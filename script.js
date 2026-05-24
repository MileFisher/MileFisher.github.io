const revealNodes = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const scrollBar = document.querySelector(".scroll-indicator__bar");
const currentYear = document.querySelector("#current-year");

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
    threshold: 0.18,
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
        const isActive = link.getAttribute("href") === activeId;
        link.classList.toggle("is-active", isActive);
      }
    }
  },
  {
    threshold: 0.45,
    rootMargin: "-10% 0px -35% 0px",
  }
);

for (const section of sections) {
  sectionObserver.observe(section);
}

function updateScrollBar() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollBar.style.width = `${Math.min(progress, 1) * 100}%`;
}

window.addEventListener("scroll", updateScrollBar, { passive: true });
window.addEventListener("resize", updateScrollBar);
updateScrollBar();

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
