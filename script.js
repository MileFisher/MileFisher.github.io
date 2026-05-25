const revealNodes = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".section-nav a");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const currentYear = document.querySelector("#current-year");
const themeToggle = document.querySelector("#theme-toggle");
const localTimeNode = document.querySelector("#local-time");
const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");

for (const node of revealNodes) {
  const delay = Number(node.dataset.delay || 0);
  node.style.setProperty("--reveal-delay", `${delay}ms`);
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px",
  }
);

for (const node of revealNodes) {
  revealObserver.observe(node);
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }

      const activeId = `#${entry.target.id}`;

      for (const link of navLinks) {
        link.classList.toggle("is-active", link.getAttribute("href") === activeId);
      }
    }
  },
  {
    threshold: 0.35,
    rootMargin: "-10% 0px -50% 0px",
  }
);

for (const section of sections) {
  sectionObserver.observe(section);
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);

  if (!themeToggle) {
    return;
  }

  const isDark = theme === "dark";
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
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

syncThemeFromPreference();
updateLocalTime();
setInterval(updateLocalTime, 60000);

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
