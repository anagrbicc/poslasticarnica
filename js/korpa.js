/**
 * korpa.js – Logika stranice korpe i checkout-a
 */

(function () {
  "use strict";

  const SHIPPING = 350;
  const FREE_SHIPPING_THRESHOLD = 3000;

  // ── Elementi ──────────────────────────────────────────────────────────────────
  const cartEmpty       = document.getElementById("cartEmpty");
  const cartContent     = document.getElementById("cartContent");
  const cartItemsEl     = document.getElementById("cartItems");
  const stepCart        = document.getElementById("stepCart");
  const stepCheckout    = document.getElementById("stepCheckout");
  const stepSuccess     = document.getElementById("stepSuccess");
  const step1Ind        = document.getElementById("step1Indicator");
  const step2Ind        = document.getElementById("step2Indicator");
  const step3Ind        = document.getElementById("step3Indicator");

  // ── Pomoćne funkcije ─────────────────────────────────────────────────────────
  function getCart() {
    return JSON.parse(localStorage.getItem("mp_cart") || "[]");
  }

  function saveCart(cart) {
    localStorage.setItem("mp_cart", JSON.stringify(cart));
    updateHeaderCount(cart);
  }

  function updateHeaderCount(cart) {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    const el = document.getElementById("cartCount");
    if (el) { el.textContent = total; el.classList.toggle("has-items", total > 0); }
  }

  function formatPrice(n) {
    return n.toLocaleString("sr-RS") + " RSD";
  }

  function calcSubtotal(cart) {
    return cart.reduce((s, i) => s + i.price * i.qty, 0);
  }

  function calcShipping(subtotal) {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING;
  }

  // ── Render korpe ─────────────────────────────────────────────────────────────
  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      cartEmpty.style.display    = "flex";
      cartContent.style.display  = "none";
      return;
    }

    cartEmpty.style.display   = "none";
    cartContent.style.display = "block";

    // Artikli
    cartItemsEl.innerHTML = cart.map((item) => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__img-wrap">
          <img src="${item.img}" alt="${item.name}" class="cart-item__img" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
          <span class="cart-item__img-fallback" style="display:none">🧸</span>
        </div>
        <div class="cart-item__info">
          <h4 class="cart-item__name">${item.name}</h4>
          <p class="cart-item__unit-price">${formatPrice(item.price)} / kom</p>
        </div>
        <div class="cart-item__qty">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
        <div class="cart-item__subtotal">${formatPrice(item.price * item.qty)}</div>
        <button class="cart-item__remove" data-id="${item.id}" aria-label="Ukloni">✕</button>
      </div>
    `).join("");

    updateSummary(cart);
  }

  function updateSummary(cart) {
    const subtotal = calcSubtotal(cart);
    const shipping = calcShipping(subtotal);
    const total    = subtotal + shipping;

    const subEl      = document.getElementById("summarySubtotal");
    const shipEl     = document.getElementById("summaryShipping");
    const promoRow   = document.getElementById("promoRow");
    const totalEl    = document.getElementById("summaryTotal");

    if (subEl)    subEl.textContent    = formatPrice(subtotal);
    if (totalEl)  totalEl.textContent  = formatPrice(total);
    if (shipEl)   shipEl.textContent   = shipping === 0 ? "Besplatno" : formatPrice(shipping);
    if (promoRow) promoRow.style.display = shipping === 0 ? "flex" : "none";
  }

  // ── Događaji na korpi ────────────────────────────────────────────────────────
  if (cartItemsEl) {
    cartItemsEl.addEventListener("click", (e) => {
      const qtyBtn = e.target.closest(".qty-btn");
      const removeBtn = e.target.closest(".cart-item__remove");

      let cart = getCart();

      if (qtyBtn) {
        const id = qtyBtn.dataset.id;
        const action = qtyBtn.dataset.action;
        const item = cart.find((i) => i.id === id);
        if (!item) return;
        if (action === "inc") item.qty += 1;
        if (action === "dec") {
          item.qty -= 1;
          if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
        }
        saveCart(cart);
        renderCart();
      }

      if (removeBtn) {
        const id = removeBtn.dataset.id;
        cart = cart.filter((i) => i.id !== id);
        saveCart(cart);
        renderCart();
      }
    });
  }

  // ── Prelaz na checkout ────────────────────────────────────────────────────────
  const goToCheckoutBtn = document.getElementById("goToCheckout");
  if (goToCheckoutBtn) {
    goToCheckoutBtn.addEventListener("click", () => {
      showStep("checkout");
    });
  }

  const backToCartBtn = document.getElementById("backToCart");
  if (backToCartBtn) {
    backToCartBtn.addEventListener("click", () => showStep("cart"));
  }

  // ── Render checkout sažetka ───────────────────────────────────────────────────
  function renderCheckoutSummary() {
    const cart = getCart();
    const listEl = document.getElementById("checkoutItemList");
    if (!listEl) return;

    listEl.innerHTML = cart.map((item) => `
      <div class="checkout-item">
        <span>${item.name} × ${item.qty}</span>
        <span>${formatPrice(item.price * item.qty)}</span>
      </div>
    `).join("");

    const subtotal = calcSubtotal(cart);
    const shipping = calcShipping(subtotal);

    const subEl  = document.getElementById("checkoutSubtotal");
    const shipEl = document.getElementById("checkoutShipping");
    const totEl  = document.getElementById("checkoutTotal");

    if (subEl)  subEl.textContent  = formatPrice(subtotal);
    if (shipEl) shipEl.textContent = shipping === 0 ? "Besplatno" : formatPrice(shipping);
    if (totEl)  totEl.textContent  = formatPrice(subtotal + shipping);
  }

  // ── Prikaz/skrivanje kartica za karticu ───────────────────────────────────────
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const cardDetails = document.getElementById("cardDetails");
      if (cardDetails) {
        cardDetails.style.display = radio.value === "kartica" ? "block" : "none";
      }
    });
  });

  // Formatiranje broja kartice
  const cardNumInput = document.getElementById("cardNumber");
  if (cardNumInput) {
    cardNumInput.addEventListener("input", function () {
      let val = this.value.replace(/\D/g, "").substring(0, 16);
      this.value = val.replace(/(.{4})/g, "$1 ").trim();
    });
  }

  const cardExpInput = document.getElementById("cardExpiry");
  if (cardExpInput) {
    cardExpInput.addEventListener("input", function () {
      let val = this.value.replace(/\D/g, "").substring(0, 4);
      if (val.length >= 2) val = val.substring(0, 2) + "/" + val.substring(2);
      this.value = val;
    });
  }

  // ── Submit narudžbine ─────────────────────────────────────────────────────────
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const payment = document.querySelector('input[name="payment"]:checked');
      const paymentLabels = { kartica: "Plaćanje karticom", pouzecem: "Plaćanje pouzećem", uplatnica: "Uplata na račun" };

      const orderNum = "#MP-" + Math.floor(10000 + Math.random() * 90000);
      const orderNumEl = document.getElementById("orderNumber");
      const orderPayEl = document.getElementById("orderPayment");
      if (orderNumEl) orderNumEl.textContent = orderNum;
      if (orderPayEl) orderPayEl.textContent = payment ? paymentLabels[payment.value] : "Kartica";

      // Isprazni korpu
      localStorage.removeItem("mp_cart");

      showStep("success");
    });
  }

  // ── Koraci navigacija ─────────────────────────────────────────────────────────
  function showStep(step) {
    stepCart.style.display     = step === "cart"     ? "block" : "none";
    stepCheckout.style.display = step === "checkout" ? "block" : "none";
    stepSuccess.style.display  = step === "success"  ? "block" : "none";

    step1Ind.classList.toggle("checkout-step--active",    step === "cart");
    step1Ind.classList.toggle("checkout-step--done",      step !== "cart");
    step2Ind.classList.toggle("checkout-step--active",    step === "checkout");
    step2Ind.classList.toggle("checkout-step--done",      step === "success");
    step3Ind.classList.toggle("checkout-step--active",    step === "success");

    if (step === "checkout") renderCheckoutSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Init ──────────────────────────────────────────────────────────────────────
  renderCart();
  updateHeaderCount(getCart());
})();
