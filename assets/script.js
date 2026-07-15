const menuButton = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".nav-links a");

if (menuButton) {
  menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const hero = document.querySelector("[data-hero]");
const heroShape = document.querySelector("[data-hero-shape]");

if (hero && heroShape && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroShape.style.translate = `${x * 18}px ${y * 18}px`;
  });
}

const form = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

if (form && formNote) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('[name="company_website"]');
    if (honeypot && honeypot.value) {
      formNote.textContent = "Submission received.";
      form.reset();
      return;
    }

    if (!form.checkValidity()) {
      formNote.textContent = "Please complete the required fields before sending.";
      form.reportValidity();
      return;
    }

    formNote.textContent = "Thanks. Your enquiry is ready to be sent once email handling is connected.";
    form.reset();
  });
}
