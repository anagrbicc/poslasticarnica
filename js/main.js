"use strict";

function getCart() {
  return JSON.parse(localStorage.getItem("mp_cart") || "[]");
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById("cartCount");
  if (el) { el.textContent = total; el.classList.toggle("has-items", total > 0); }
}

// Header scroll
const header = document.getElementById("header");
if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });
}

// Mobilni meni
const burger  = document.getElementById("burger");
const navList = document.getElementById("navList");
if (burger && navList) {
  burger.addEventListener("click", () => navList.classList.toggle("open"));
  navList.querySelectorAll(".header__nav-link").forEach(link =>
    link.addEventListener("click", () => navList.classList.remove("open"))
  );
}

updateCartCount();

// Dodaj u korpu
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", function () {
    const card = this.closest(".product-card");
    if (!card) return;
    const { id, name, img } = card.dataset;
    const price = +card.dataset.price;
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) item.qty++;
    else cart.push({ id, name, price, img, qty: 1 });
    localStorage.setItem("mp_cart", JSON.stringify(cart));
    updateCartCount();
    this.textContent = "✓ Dodato!";
    this.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
    setTimeout(() => { this.textContent = "Dodaj u korpu"; this.style.background = ""; }, 1800);
  });
});

// Hero slider
const slides = document.querySelectorAll(".hero__slide");
const dots   = document.querySelectorAll(".hero__dot");
if (slides.length > 1) {
  let current = 0;
  function goToSlide(i) {
    slides[current].classList.remove("hero__slide--active");
    dots[current].classList.remove("hero__dot--active");
    slides[current = i].classList.add("hero__slide--active");
    dots[i].classList.add("hero__dot--active");
  }
  dots.forEach(dot => dot.addEventListener("click", () => goToSlide(+dot.dataset.index)));
  setInterval(() => goToSlide((current + 1) % slides.length), 5000);
}

// Filter igračaka
const filterBtns = document.querySelectorAll(".filter-btn");
const cards      = document.querySelectorAll(".product-card");
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("filter-btn--active"));
    btn.classList.add("filter-btn--active");
    const filter = btn.dataset.filter;
    cards.forEach(card =>
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter)
    );
  });
});

// Kontakt forma
const form    = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = "Slanje..."; btn.disabled = true;
    setTimeout(() => {
      formMsg.textContent = "✓ Poruka je uspešno poslata! Javićemo se uskoro.";
      form.reset(); btn.textContent = "Pošalji poruku"; btn.disabled = false;
      setTimeout(() => { formMsg.textContent = ""; }, 5000);
    }, 1200);
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 80, behavior: "smooth" });
  });
});

// Fade-in animacija
if ("IntersectionObserver" in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeInUp 0.55s ease both";
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".product-card, .about__stat, .contact__info-item").forEach(el => {
    el.style.opacity = "0"; obs.observe(el);
  });
}
