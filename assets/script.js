const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const menuButton = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector(".nav-links");
let lastFocusedElement = null;

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const opening = !document.body.classList.contains("menu-open");
    lastFocusedElement = document.activeElement;
    document.body.classList.toggle("menu-open", opening);
    menuButton.setAttribute("aria-expanded", String(opening));
    if (opening) navLinks.querySelector("a")?.focus();
    else lastFocusedElement?.focus();
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
      closeMenu();
      menuButton.focus();
    }
  });
}

const revealObserver = !motionQuery.matches && "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 })
  : null;

document.querySelectorAll(".reveal").forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add("is-visible");
});

const globeHero = document.querySelector("[data-globe-hero]");
const globeVisual = document.querySelector("[data-globe-visual]");
const globeStages = Array.from(document.querySelectorAll(".globe-stage-card[data-globe-stage]"));
let rafId = 0;

function updateGlobe() {
  rafId = 0;
  if (!globeHero || !globeVisual || motionQuery.matches) return;

  const rect = globeHero.getBoundingClientRect();
  const scrollable = Math.max(1, rect.height - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
  const stage = Math.min(globeStages.length - 1, Math.round(progress * (globeStages.length - 1)));
  const rotation = progress * 270;

  globeVisual.style.setProperty("--globe-rotation", `${rotation}deg`);
  globeVisual.style.setProperty("--globe-tilt", `${12 + progress * 10}deg`);

  globeStages.forEach((card, index) => card.classList.toggle("is-active", index === stage));
}

function requestGlobeUpdate() {
  if (!rafId) rafId = requestAnimationFrame(updateGlobe);
}

if (globeHero && globeVisual) {
  if (motionQuery.matches) document.body.classList.add("reduced-motion");
  window.addEventListener("scroll", requestGlobeUpdate, { passive: true });
  window.addEventListener("resize", requestGlobeUpdate);
  motionQuery.addEventListener?.("change", () => {
    document.body.classList.toggle("reduced-motion", motionQuery.matches);
    requestGlobeUpdate();
  });
  requestGlobeUpdate();
}
