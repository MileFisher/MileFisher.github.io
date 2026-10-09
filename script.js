const themeToggle = document.querySelector("#theme-toggle");
const themeToggleIcon = themeToggle?.querySelector("use");
const localTimeNode = document.querySelector("#local-time");
const currentYear = document.querySelector("#current-year");
const flipLine = document.querySelector("#flip-line");
const profileCover = document.querySelector("#profile-cover");
const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const nameAudio = document.querySelector("#name-audio");
const nameAudioButton = document.querySelector("#name-audio-button");

const flipSentences = [
  "Building practical systems. Small details matter.",
  "Full-stack development, AI workflows, ERP tools, and delivery-minded engineering.",
  "studying at TDTU with scholarships",
];

let flipIndex = 0;

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);

  if (!themeToggle) {
    return;
  }

  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );

  if (themeToggleIcon) {
    themeToggleIcon.setAttribute("href", isDark ? "#icon-sun" : "#icon-moon");
  }
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

function attachLightbox() {
  if (!lightbox || typeof lightbox.showModal !== "function") {
    return;
  }

  document.querySelectorAll(".achievement-gallery__item").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const thumbnail = item.querySelector("img");

      lightboxImage.src = item.getAttribute("href");
      lightboxImage.alt = thumbnail?.alt ?? "";
      lightboxCaption.textContent = item.dataset.caption ?? "";
      lightbox.showModal();
    });
  });

  // Clicking the backdrop (outside the figure) closes the viewer.
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
}

function attachNameAudio() {
  if (!nameAudio || !nameAudioButton) {
    return;
  }

  const setPlaying = (isPlaying) => {
    nameAudioButton.classList.toggle("is-playing", isPlaying);
  };

  nameAudioButton.addEventListener("click", () => {
    nameAudio.currentTime = 0;
    nameAudio.play().catch(() => setPlaying(false));
  });

  nameAudio.addEventListener("play", () => setPlaying(true));
  nameAudio.addEventListener("ended", () => setPlaying(false));
  nameAudio.addEventListener("pause", () => setPlaying(false));
}

syncThemeFromPreference();
updateLocalTime();
attachCoverSpotlight();
attachLightbox();
attachNameAudio();

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
