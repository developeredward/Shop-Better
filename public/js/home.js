const searchBox = document.getElementById("searchBox");
const suggestionsBox = document.getElementById("suggestionsBox");

searchBox.addEventListener("input", async () => {
  const query = searchBox.value.trim();

  if (!query) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.style.display = "none";
    return;
  }

  try {
    const res = await fetch(
      `/search/suggestions?query=${encodeURIComponent(query)}`
    );
    const products = await res.json();

    if (products.length === 0) {
      suggestionsBox.innerHTML =
        '<div style="padding: 10px;">No results found.</div>';
      suggestionsBox.style.display = "block";
      return;
    }

    suggestionsBox.innerHTML = products
      .map(
        (p) => `
          <a href="/product/${p._id}">
            <img src="${p.imageUrl}" alt="${p.name}" />
            <span>${p.name}</span>
          </a>
        `
      )
      .join("");
    suggestionsBox.style.display = "block";
  } catch (error) {
    console.error("Search error:", error);
  }
});

document.addEventListener("click", (e) => {
  if (!document.getElementById("searchForm").contains(e.target)) {
    suggestionsBox.style.display = "none";
  }
});
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
