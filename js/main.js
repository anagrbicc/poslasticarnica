/**
 * main.js – Opšta funkcionalnost sajta Mekani Prijatelji
 */

(function () {
  "use strict";

  // ── Header scroll efekt ───────────────────────────────────────────────────────
  const header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 30);
    }, { passive: true });
  }

  // ── Mobilni meni ─────────────────────────────────────────────────────────────
  const burger  = document.getElementById("burger");
  const navList = document.getElementById("navList");
  if (burger && navList) {
    burger.addEventListener("click", () => {
      navList.classList.toggle("open");
    });
    navList.querySelectorAll(".header__nav-link").forEach((link) => {
      link.addEventListener("click", () => navList.classList.remove("open"));
    });
  }

  // ── Korpa – broj artikala u headeru ──────────────────────────────────────────
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("mp_cart") || "[]");
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    const countEl = document.getElementById("cartCount");
    if (countEl) {
      countEl.textContent = total;
      countEl.classList.toggle("has-items", total > 0);
    }
  }

  updateCartCount();

  // ── "Dodaj u korpu" dugmad ────────────────────────────────────────────────────
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".product-card");
      if (!card) return;

      const id    = card.dataset.id;
      const name  = card.dataset.name;
      const price = parseInt(card.dataset.price, 10);
      const img   = card.dataset.img;

      let cart = JSON.parse(localStorage.getItem("mp_cart") || "[]");
      const existing = cart.find((i) => i.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id, name, price, img, qty: 1 });
      }
      localStorage.setItem("mp_cart", JSON.stringify(cart));

      // Vizuelni feedback
      const original = this.textContent;
      this.textContent = "✓ Dodato!";
      this.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
      updateCartCount();
      setTimeout(() => {
        this.textContent = original;
        this.style.background = "";
      }, 1800);
    });
  });

  // ── Hero slider ──────────────────────────────────────────────────────────────
  const slides = document.querySelectorAll(".hero__slide");
  const dots   = document.querySelectorAll(".hero__dot");

  if (slides.length > 1) {
    let current = 0;

    function goToSlide(index) {
      slides[current].classList.remove("hero__slide--active");
      dots[current].classList.remove("hero__dot--active");
      current = index;
      slides[current].classList.add("hero__slide--active");
      dots[current].classList.add("hero__dot--active");
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => goToSlide(parseInt(dot.dataset.index, 10)));
    });

    // Auto-play na svakih 5s
    setInterval(() => goToSlide((current + 1) % slides.length), 5000);
  }

  // ── Filter igračaka ───────────────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards      = document.querySelectorAll(".product-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
      });
    });
  });

  // ── Kontakt forma ─────────────────────────────────────────────────────────────
  const form    = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = "Slanje...";
      submitBtn.disabled = true;
      setTimeout(() => {
        formMsg.textContent = "✓ Poruka je uspešno poslata! Javićemo se uskoro.";
        form.reset();
        submitBtn.textContent = "Pošalji poruku";
        submitBtn.disabled = false;
        setTimeout(() => { formMsg.textContent = ""; }, 5000);
      }, 1200);
    });
  }

  // ── Smooth scroll ─────────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    });
  });

  // ── Intersection Observer – fade-in ──────────────────────────────────────────
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeInUp 0.55s ease both";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".product-card, .about__stat, .contact__info-item").forEach((el) => {
      el.style.opacity = "0";
      observer.observe(el);
    });
  }
})();
