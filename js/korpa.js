"use strict";

const SHIPPING = 350;
const FREE_SHIPPING_THRESHOLD = 3000;

const cartEmpty    = document.getElementById("cartEmpty");
const cartContent  = document.getElementById("cartContent");
const cartItemsEl  = document.getElementById("cartItems");
const stepCart     = document.getElementById("stepCart");
const stepCheckout = document.getElementById("stepCheckout");
const stepSuccess  = document.getElementById("stepSuccess");
const step1Ind     = document.getElementById("step1Indicator");
const step2Ind     = document.getElementById("step2Indicator");
const step3Ind     = document.getElementById("step3Indicator");

function saveCart(cart) {
  localStorage.setItem("mp_cart", JSON.stringify(cart));
  updateCartCount();
}

function formatPrice(n) { return n.toLocaleString("sr-RS") + " RSD"; }
function calcSubtotal(cart) { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function calcShipping(subtotal) { return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING; }

function renderCart() {
  const cart = getCart();
  if (cart.length === 0) {
    cartEmpty.style.display   = "flex";
    cartContent.style.display = "none";
    return;
  }
  cartEmpty.style.display   = "none";
  cartContent.style.display = "block";

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item__img-wrap">
        <img src="${item.img}" alt="${item.name}" class="cart-item__img"
             onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
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
  document.getElementById("summarySubtotal").textContent = formatPrice(subtotal);
  document.getElementById("summaryShipping").textContent = shipping === 0 ? "Besplatno" : formatPrice(shipping);
  document.getElementById("summaryTotal").textContent    = formatPrice(subtotal + shipping);
  document.getElementById("promoRow").style.display      = shipping === 0 ? "flex" : "none";
}

function renderCheckoutSummary(cart = getCart()) {
  const listEl = document.getElementById("checkoutItemList");
  if (!listEl) return;
  listEl.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <span>${item.name} × ${item.qty}</span>
      <span>${formatPrice(item.price * item.qty)}</span>
    </div>
  `).join("");
  const subtotal = calcSubtotal(cart);
  const shipping = calcShipping(subtotal);
  document.getElementById("checkoutSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("checkoutShipping").textContent = shipping === 0 ? "Besplatno" : formatPrice(shipping);
  document.getElementById("checkoutTotal").textContent    = formatPrice(subtotal + shipping);
}

function showStep(step) {
  const steps  = ["cart", "checkout", "success"];
  const panels = [stepCart, stepCheckout, stepSuccess];
  const inds   = [step1Ind, step2Ind, step3Ind];
  const idx    = steps.indexOf(step);
  panels.forEach((el, i) => { el.style.display = i === idx ? "block" : "none"; });
  inds.forEach((el, i) => {
    el.classList.toggle("checkout-step--active", i === idx);
    el.classList.toggle("checkout-step--done",   i < idx);
  });
  if (step === "checkout") renderCheckoutSummary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Događaji na listi artikala
if (cartItemsEl) {
  cartItemsEl.addEventListener("click", e => {
    const qtyBtn    = e.target.closest(".qty-btn");
    const removeBtn = e.target.closest(".cart-item__remove");
    if (!qtyBtn && !removeBtn) return;
    let cart = getCart();
    const id = (qtyBtn || removeBtn).dataset.id;
    if (removeBtn) {
      cart = cart.filter(i => i.id !== id);
    } else {
      const item = cart.find(i => i.id === id);
      if (!item) return;
      if (qtyBtn.dataset.action === "inc") item.qty++;
      else if (--item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    saveCart(cart);
    renderCart();
  });
}

document.getElementById("goToCheckout")?.addEventListener("click", () => showStep("checkout"));
document.getElementById("backToCart")?.addEventListener("click",   () => showStep("cart"));

// Prikaz podataka kartice
document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const cardDetails = document.getElementById("cardDetails");
    if (cardDetails) cardDetails.style.display = radio.value === "kartica" ? "block" : "none";
  });
});

// Formatiranje broja kartice i datuma
document.getElementById("cardNumber")?.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").substring(0, 16).replace(/(.{4})/g, "$1 ").trim();
});
document.getElementById("cardExpiry")?.addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").substring(0, 4);
  this.value = v.length >= 2 ? v.substring(0, 2) + "/" + v.substring(2) : v;
});

// Submit narudžbine
document.getElementById("checkoutForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const payment = document.querySelector('input[name="payment"]:checked');
  const labels  = { kartica: "Plaćanje karticom", pouzecem: "Plaćanje pouzećem", uplatnica: "Uplata na račun" };
  document.getElementById("orderNumber").textContent  = "#MP-" + Math.floor(10000 + Math.random() * 90000);
  document.getElementById("orderPayment").textContent = payment ? labels[payment.value] : "Kartica";
  localStorage.removeItem("mp_cart");
  showStep("success");
});

renderCart();
updateCartCount();
