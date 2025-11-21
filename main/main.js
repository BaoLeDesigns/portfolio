document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".project-card[data-images]");
  let autoRotateEnabled = true; // global toggle state

  // ------------------ CAROUSELS ------------------
  cards.forEach((card) => {
    const raw = card.dataset.images || "";
    const images = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!images.length) return;

    const mainImg = card.querySelector(".project-main-image");
    const dotsWrapper = card.querySelector(".carousel-dots");
    const prevBtn = card.querySelector(".carousel-btn.prev");
    const nextBtn = card.querySelector(".carousel-btn.next");

    if (!mainImg || !dotsWrapper || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    mainImg.src = images[0];

    // Build dots
    images.forEach((src, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot" + (index === 0 ? " active" : "");
      dot.dataset.index = String(index);
      dotsWrapper.appendChild(dot);
    });

    function updateImage(newIndex) {
      const total = images.length;
      currentIndex = (newIndex + total) % total;
      mainImg.src = images[currentIndex];

      dotsWrapper.querySelectorAll(".carousel-dot").forEach((dot) => {
        const i = Number(dot.dataset.index || 0);
        dot.classList.toggle("active", i === currentIndex);
      });
    }

    // Arrow buttons
    prevBtn.addEventListener("click", () => {
      updateImage(currentIndex - 1);
    });

    nextBtn.addEventListener("click", () => {
      updateImage(currentIndex + 1);
    });

    // Dots click
    dotsWrapper.addEventListener("click", (e) => {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        target.classList.contains("carousel-dot")
      ) {
        const idx = Number(target.dataset.index || 0);
        if (!Number.isNaN(idx)) updateImage(idx);
      }
    });

    // ------------------ AUTO-ROTATE PER CARD ------------------
    let autoTimer = null;

    function startAuto() {
      if (!autoRotateEnabled || autoTimer) return;
      autoTimer = setInterval(() => {
        updateImage(currentIndex + 1);
      }, 6000);
    }

    function stopAuto() {
      if (!autoTimer) return;
      clearInterval(autoTimer);
      autoTimer = null;
    }

    startAuto(); // start if enabled

    card.addEventListener("mouseenter", stopAuto);
    card.addEventListener("mouseleave", startAuto);

    
    card._startAuto = startAuto;
    card._stopAuto = stopAuto;
  });

// ------------------ AUTO ROTATE BUTTON ------------------
const autoBtn = document.getElementById("autoRotateButton");
if (autoBtn) {
  autoBtn.addEventListener("click", () => {
    autoRotateEnabled = !autoRotateEnabled;

    // Update button UI
    if (autoRotateEnabled) {
      autoBtn.classList.add("toggle-on");
      autoBtn.textContent = "Auto-Rotate: ON";
    } else {
      autoBtn.classList.remove("toggle-on");
      autoBtn.textContent = "Auto-Rotate: OFF";
    }

    // Start/stop all timers
    cards.forEach((card) => {
      if (autoRotateEnabled && typeof card._startAuto === "function") {
        card._startAuto();
      } else if (!autoRotateEnabled && typeof card._stopAuto === "function") {
        card._stopAuto();
      }
    });
  });
}

  // ---------------------- LIGHTBOX LOGIC ----------------------
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return; 

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const lightboxPrev = lightbox.querySelector(".lightbox-prev");
  const lightboxNext = lightbox.querySelector(".lightbox-next");

  let lightboxImages = [];
  let lightboxIndex = 0;

  function showLightboxImage(delta = 0) {
    if (!lightboxImages.length || !lightboxImg) return;

    if (delta !== 0) {
      const total = lightboxImages.length;
      lightboxIndex = (lightboxIndex + delta + total) % total;
    }

    lightboxImg.src = lightboxImages[lightboxIndex];
  }

  
  document.querySelectorAll(".project-main-image").forEach((img) => {
    img.style.cursor = "zoom-in";

    img.addEventListener("click", () => {
      const card = img.closest(".project-card");
      if (!card) return;

      const raw = card.dataset.images || "";
      const images = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (!images.length) return;

      lightboxImages = images;

      const fullSrc = img.src;
      let idx = images.findIndex((path) => fullSrc.endsWith(path));
      if (idx === -1) idx = 0;

      lightboxIndex = idx;
      showLightboxImage(0);
      lightbox.classList.add("active");
    });
  });

  // Lightbox nav buttons
  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      showLightboxImage(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", (e) => {
      e.stopPropagation();
      showLightboxImage(1);
    });
  }


  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
      lightbox.classList.remove("active");
    });
  }

  
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });
});

