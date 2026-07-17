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

const form = document.querySelector("[data-contact-form]");
const note = document.querySelector("[data-form-note]");
const submitButton = document.querySelector("[data-submit-button]");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let isSubmitting = false;

function setError(name, message) {
  const error = form?.querySelector(`[data-error-for="${name}"]`);
  const field = form?.elements[name];
  if (error) error.textContent = message || "";
  if (field instanceof HTMLElement) field.setAttribute("aria-invalid", message ? "true" : "false");
}

function formValues() {
  return {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    enquiryType: form.elements.enquiryType.value.trim(),
    message: form.elements.message.value.trim(),
    consent: form.elements.consent.checked,
    company_website: form.elements.company_website.value.trim()
  };
}

function validate(values) {
  const errors = {};
  if (values.company_website) errors.company_website = "Spam protection rejected this submission.";
  if (values.name.length < 2) errors.name = "Enter your name using at least 2 characters.";
  if (values.name.length > 80) errors.name = "Name must be 80 characters or fewer.";
  if (!emailPattern.test(values.email)) errors.email = "Enter a valid email address.";
  if (values.email.length > 120) errors.email = "Email must be 120 characters or fewer.";
  if (!values.enquiryType) errors.enquiryType = "Choose an enquiry type.";
  if (values.message.length < 20) errors.message = "Message must be at least 20 characters.";
  if (values.message.length > 2000) errors.message = "Message must be 2000 characters or fewer.";
  if (!values.consent) errors.consent = "Consent is required before sending.";
  return errors;
}

if (form && note && submitButton) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const values = formValues();
    const errors = validate(values);
    ["name", "email", "enquiryType", "message", "consent"].forEach((name) => setError(name, errors[name]));

    if (Object.keys(errors).length) {
      note.textContent = errors.company_website || "Please fix the highlighted fields before sending.";
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    note.textContent = "Submitting your enquiry...";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        note.textContent = result.message || "The enquiry could not be sent. Please email lucentecorporate@gmail.com directly.";
        return;
      }

      form.reset();
      note.textContent = "Your message has been sent to Lucente Corporate.";
    } catch (error) {
      note.textContent = "Network error. Please try again or email lucentecorporate@gmail.com directly.";
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = "Send Enquiry";
    }
  });
}
