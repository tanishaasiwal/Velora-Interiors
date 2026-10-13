const slides = document.querySelectorAll(".hero-bg");

let currentIndex = 0;
const slideDuration = 3000;
const loadedSlides = new Set();

// Preload all images immediately
slides.forEach((slide, index) => {
  const match = slide.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);

  if (!match) return;

  const img = new Image();

  img.onload = () => {
    loadedSlides.add(index);
  };

  img.onerror = () => {
    console.error("Image failed to load:", match[1]);
  };

  img.src = match[1];

  if (img.complete && img.naturalWidth > 0) {
    loadedSlides.add(index);
  }
});

// Show first slide immediately
slides.forEach((slide, index) => {
  slide.classList.toggle("active", index === 0);
});

// Start slideshow
if (slides.length > 1) {
  window.setInterval(() => {
    // Find the next image that has loaded
    let nextIndex = (currentIndex + 1) % slides.length;
    let checked = 0;

    while (checked < slides.length && !loadedSlides.has(nextIndex)) {
      nextIndex = (nextIndex + 1) % slides.length;
      checked++;
    }

    // Wait for an image to load instead of showing a blank slide
    if (!loadedSlides.has(nextIndex)) return;

    slides[currentIndex].classList.remove("active");
    slides[nextIndex].classList.add("active");

    currentIndex = nextIndex;
  }, slideDuration);
}

const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");

if (menuToggle && primaryNavigation) {
  const closeNavigation = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNavigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation" : "Close navigation",
    );
    primaryNavigation.classList.toggle("is-open", !isOpen);
  });

  primaryNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  window
    .matchMedia("(min-width: 1051px)")
    .addEventListener("change", closeNavigation);
}

const inquiryDialog = document.querySelector("#inquiry-dialog");
const inquiryTriggers = document.querySelectorAll(
  ".inquiry-trigger, .mobile-inquiry-trigger",
);
const inquiryClose = document.querySelector(".inquiry-close");
const inquiryForm = document.querySelector(".inquiry-form");
const inquiryStatus = document.querySelector(".inquiry-form-status");

if (inquiryDialog) {
  inquiryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (primaryNavigation?.classList.contains("is-open")) {
        menuToggle?.click();
      }

      inquiryDialog.showModal();
    });
  });

  inquiryClose?.addEventListener("click", () => inquiryDialog.close());

  inquiryDialog.addEventListener("click", (event) => {
    if (event.target === inquiryDialog) inquiryDialog.close();
  });

  inquiryForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    inquiryStatus.textContent =
      "Online enquiry delivery is not connected yet, so your details have not been sent.";
  });
}

const animatedTiles = document.querySelectorAll(
  ".service-cards, .project-cards, .process-step, .testimonial-card",
);

animatedTiles.forEach((tile, index) => {
  tile.dataset.aos = "fade-up";
  tile.dataset.aosDelay = String((index % 3) * 100);
});

if (window.AOS) {
  window.AOS.init({
    duration: 750,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
    disable: () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
}
