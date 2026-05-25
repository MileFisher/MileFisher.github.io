const themeToggle = document.querySelector("#theme-toggle");
const localTimeNode = document.querySelector("#local-time");
const currentYear = document.querySelector("#current-year");
const flipLine = document.querySelector("#flip-line");
const profileCover = document.querySelector("#profile-cover");
const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");

const flipSentences = [
  "Building practical systems. Small details matter.",
  "Full-stack development, AI workflows, and delivery-minded engineering.",
  "Software Engineering student at TDTU with a 75% scholarship.",
];

let flipIndex = 0;

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);

  if (!themeToggle) {
    return;
  }

  const isDark = theme === "dark";
  themeToggle.textContent = isDark ? "light" : "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
}

function syncThemeFromPreference() {
  const storedTheme = localStorage.getItem("portfolio-theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    applyTheme(storedTheme);
    return;
  }

  applyTheme(themeMedia.matches ? "dark" : "light");
}

function updateLocalTime() {
  if (!localTimeNode) {
    return;
  }

  localTimeNode.textContent = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date());
}

function rotateFlipLine() {
  if (!flipLine) {
    return;
  }

  flipLine.classList.add("is-swapping");

  window.setTimeout(() => {
    flipIndex = (flipIndex + 1) % flipSentences.length;
    flipLine.textContent = flipSentences[flipIndex];
    flipLine.classList.remove("is-swapping");
  }, 180);
}

function attachCoverSpotlight() {
  if (!profileCover) {
    return;
  }

  const resetSpotlight = () => {
    profileCover.style.setProperty("--spotlight-x", "50%");
    profileCover.style.setProperty("--spotlight-y", "50%");
  };

  profileCover.addEventListener("pointermove", (event) => {
    const rect = profileCover.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    profileCover.style.setProperty("--spotlight-x", `${x}%`);
    profileCover.style.setProperty("--spotlight-y", `${y}%`);
  });

  profileCover.addEventListener("pointerleave", resetSpotlight);
  resetSpotlight();
}

syncThemeFromPreference();
updateLocalTime();
attachCoverSpotlight();

window.setInterval(updateLocalTime, 60000);
window.setInterval(rotateFlipLine, 3200);

themeMedia.addEventListener("change", () => {
  if (!localStorage.getItem("portfolio-theme")) {
    applyTheme(themeMedia.matches ? "dark" : "light");
  }
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
