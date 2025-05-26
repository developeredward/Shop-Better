document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".slider-banner", {
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const categoryLinks = document.querySelectorAll(".category-box");
  const productCards = document.querySelectorAll(".product-card");

  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const selectedCategory = this.dataset.category;

      // Toggle active style
      categoryLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      productCards.forEach((card) => {
        const cardCategory = card.dataset.category;
        if (selectedCategory === "all" || cardCategory === selectedCategory) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});
