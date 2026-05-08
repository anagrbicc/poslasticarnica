/**
 * main.js – Opšta funkcionalnost sajta Mekani Prijatelji
 */

(function () {
  "use strict";

  // ── Header scroll efekt ───────────────────────────────────────────────────────
  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });

  // ── Mobilni meni ─────────────────────────────────────────────────────────────
  const burger  = document.getElementById("burger");
  const navList = document.querySelector(".header__nav-list");

  burger.addEventListener("click", () => {
    navList.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(navList.classList.contains("open")));
  });

  // Zatvori meni klikom na link
  navList.querySelectorAll(".header__nav-link").forEach((link) => {
    link.addEventListener("click", () => navList.classList.remove("open"));
  });

  // ── Filter igračaka ───────────────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards      = document.querySelectorAll(".product-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !match);
      });
    });
  });

  // ── "Dodaj u korpu" dugmad – feedback animacija ───────────────────────────────
  document.querySelectorAll(".product-card .btn--primary").forEach((btn) => {
    btn.addEventListener("click", function () {
      const original = this.textContent;
      this.textContent = "✓ Dodato!";
      this.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
      setTimeout(() => {
        this.textContent = original;
        this.style.background = "";
      }, 1800);
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
        formMsg.textContent = "✓ Poruka je uspješno poslata! Javićemo se uskoro.";
        form.reset();
        submitBtn.textContent = "Pošalji poruku";
        submitBtn.disabled = false;
        setTimeout(() => { formMsg.textContent = ""; }, 5000);
      }, 1200);
    });
  }

  // ── Smooth scroll za anchor linkove ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // ── Intersection Observer – fade-in animacija za sekcije ─────────────────────
  const observerOptions = { threshold: 0.12 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeInUp 0.6s ease both";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".product-card, .about__stat, .contact__info-item").forEach((el) => {
    el.style.opacity = "0";
    observer.observe(el);
  });
})();
