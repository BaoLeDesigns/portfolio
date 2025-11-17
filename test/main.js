// main.js
// Finds all .project-card elements with data-images and
// turns them into independent carousels.

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".project-card[data-images]");

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

    // Create dots based on images
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

    prevBtn.addEventListener("click", () => {
      updateImage(currentIndex - 1);
    });

    nextBtn.addEventListener("click", () => {
      updateImage(currentIndex + 1);
    });

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

    // Auto-rotate
    let autoTimer = setInterval(() => {
      updateImage(currentIndex + 1);
    }, 4000);

    card.addEventListener("mouseenter", () => clearInterval(autoTimer));
    card.addEventListener("mouseleave", () => {
      autoTimer = setInterval(() => {
        updateImage(currentIndex + 1);
      }, 4000);
    });
  });
});
