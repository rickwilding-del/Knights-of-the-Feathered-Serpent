const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".site-nav a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage) link.classList.add("is-active");
});

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  reveals.forEach((element) => revealObserver.observe(element));
} else {
  // Fallback for older browsers so content doesn't stay hidden forever.
  reveals.forEach((element) => element.classList.add("is-visible"));
}

const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const interest = String(formData.get("interest") || "General inquiry").trim();
    const message = String(formData.get("message") || "").trim();
    const status = contactForm.querySelector("[data-form-status]");

    const subject = encodeURIComponent(`${interest} — website message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\nMessage:\n${message}`
    );

    if (status) {
      status.textContent = "Opening your email app with this message ready to send…";
    }

    window.location.href = `mailto:knightsofthefeatheredserpent@gmail.com?subject=${subject}&body=${body}`;
  });
}

const lightboxTriggers = Array.from(
  document.querySelectorAll('img[src*="assets/images/gallery/"]')
);

if (lightboxTriggers.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Full-size artwork viewer");
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close full-size image">&times;</button>
    <button class="lightbox-nav lightbox-previous" type="button" aria-label="View previous image">&#8249;</button>
    <figure class="lightbox-figure">
      <img class="lightbox-image" alt="">
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
    <button class="lightbox-nav lightbox-next" type="button" aria-label="View next image">&#8250;</button>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const previousButton = lightbox.querySelector(".lightbox-previous");
  const nextButton = lightbox.querySelector(".lightbox-next");
  let activeIndex = 0;

  const showImage = (index) => {
    activeIndex = (index + lightboxTriggers.length) % lightboxTriggers.length;
    const trigger = lightboxTriggers[activeIndex];
    lightboxImage.src = trigger.currentSrc || trigger.src;
    lightboxImage.alt = trigger.alt;
    lightboxCaption.textContent = trigger.alt;
  };

  const openLightbox = (index) => {
    showImage(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxTriggers[activeIndex].focus();
  };

  lightboxTriggers.forEach((trigger, index) => {
    trigger.classList.add("lightbox-trigger");
    trigger.tabIndex = 0;
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-label", `View full-size image: ${trigger.alt}`);
    trigger.addEventListener("click", () => openLightbox(index));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => showImage(activeIndex - 1));
  nextButton.addEventListener("click", () => showImage(activeIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(activeIndex - 1);
    if (event.key === "ArrowRight") showImage(activeIndex + 1);
  });
}
