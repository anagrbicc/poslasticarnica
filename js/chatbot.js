"use strict";

// Baza znanja
const KB = [
  { patterns: ["igračke", "ponuda", "šta imate", "koje igračke", "kolekcija", "proizvodi"],
    answer: "Naša kolekcija uključuje:\n🧸 Medvjediće (Teddy, Polarni)\n🐰 Zečiće (Fluffy)\n🦊 Lisice (Foxy)\n🐨 Koale (Kiki)\n🦄 Jednoroze (Luna)\n\nSvaki komad je ručno rađen i CE sertifikovan! 💕" },
  { patterns: ["cena", "cijena", "koliko košta", "koliko kosta", "cene", "cijene", "price"],
    answer: "Naše cijene su:\n• Zečić Fluffy – 999 RSD\n• Medvjedić Teddy – 1.299 RSD\n• Koala Kiki – 1.399 RSD\n• Polarni Medvjed – 1.499 RSD\n• Lisica Foxy – 1.599 RSD\n• Jednorog Luna – 1.799 RSD (aktualno -20%! 🎉)" },
  { patterns: ["dostava", "slanje", "pošta", "posta", "isporuka", "shipping", "šaljete", "saljete"],
    answer: "📦 Dostavljamo po cijeloj Srbiji i regionu!\n\n• Srbija: 350 RSD (besplatno za narudžbe 3.000+ RSD)\n• Region (BIH, CG, MK): 700 RSD\n• Rok isporuke: 1–3 radna dana\n\nPratite paket putem tracking koda koji dobijate emailom! 📬" },
  { patterns: ["radno vreme", "radno vrijeme", "radi", "otvoreno", "kada", "sati", "hours"],
    answer: "🕐 Naše radno vreme:\n\nPonedeljak – Petak: 09:00 – 20:00\nSubota: 10:00 – 16:00\nNedelja: Zatvoreno\n\nMožete nas kontaktirati i putem emaila van radnog vremena! 📧" },
  { patterns: ["kontakt", "telefon", "email", "adresa", "gdje se nalazite", "gde se nalazite", "lokacija"],
    answer: "📍 Knez Mihailova 14, Beograd\n📞 +381 11 123 4567\n✉️ info@mekaniprijatelji.rs\n\nMožete nas posjetiti lično ili naručiti online! 😊" },
  { patterns: ["povrat", "reklamacija", "zamjena", "zamena", "vracanje", "nije ispravno"],
    answer: "✅ Garantujemo 30 dana za povrat i zamjenu!\n\nAko ste nezadovoljni iz bilo kojeg razloga, kontaktirajte nas i riješićemo problem u roku od 24h. Vaše zadovoljstvo je naš prioritet! 💖" },
  { patterns: ["uzrast", "dob", "beba", "dijete", "dete", "koliko godina", "bezbedno", "sigurno", "CE"],
    answer: "👶 Sve naše igračke su bezbedne za djecu!\n\n• Hipoalergeni materijali\n• CE sertifikat (EU standard)\n• Bez malih dijelova za djecu 0–3 god.\n• Perivo na 30°C u veš mašini\n\nIdealne od 0+ godina! ✨" },
  { patterns: ["popust", "akcija", "sniženje", "kupon", "promo", "sale", "discount"],
    answer: "🎉 Trenutne akcije:\n\n• Jednorog Luna: -20% (samo ovo sedmicu!)\n• Besplatna dostava za kupovinu 3.000+ RSD\n• Za newsletter pretplatnike: 10% na prvu narudžbu\n\nPratite nas na Instagramu za ekskluzivne ponude! 📱" },
  { patterns: ["hvala", "thanks", "super", "odlično", "odlicno", "sjajno", "krasno"],
    answer: "Hvala vam puno! 🧸💕 Raduje nas što možemo pomoći. Ako imate još pitanja, slobodno pitajte! 😊" },
  { patterns: ["zdravo", "ćao", "cao", "hej", "hello", "hi", "dobro jutro", "dobro veče", "dobro vece"],
    answer: "Zdravo! 👋🧸 Dobrodošli u Mekani Prijatelji!\n\nJa sam Teddy, vaš virtualni asistent. Mogu vam pomoći sa informacijama o igračkama, cijenama, dostavi i svemu ostalom. Šta vas zanima?" },
  { patterns: ["poklon", "gift", "pokloni", "za poklon", "rođendan", "rodjendan", "birthday"],
    answer: "🎁 Naše igračke su savršen poklon!\n\nNudimo i besplatno pakovanje na poklon (lijepa kutija + mašna) za sve narudžbe. Samo napomenite pri narudžbi! 🎀\n\nNajpopularniji pokloni su:\n1. Medvjedić Teddy 🧸\n2. Jednorog Luna 🦄\n3. Zečić Fluffy 🐰" },
];

const defaultAnswer = "Hmm, nisam siguran šta mislite 🤔\n\nMožete me pitati o:\n• Igračkama i cijenama\n• Dostavi\n• Radnom vremenu\n• Povratima\n• Poklon pakovanju\n\nIli me nazovite: +381 11 123 4567 😊";

const toggle    = document.getElementById("chatbotToggle");
const chatWin   = document.getElementById("chatbotWindow");
const closeBtn  = document.getElementById("chatbotClose");
const messages  = document.getElementById("chatbotMessages");
const input     = document.getElementById("chatbotInput");
const sendBtn   = document.getElementById("chatbotSend");
const openIcon  = toggle.querySelector(".chatbot__toggle-icon--open");
const closeIcon = toggle.querySelector(".chatbot__toggle-icon--close");

function toggleChat() {
  const open = chatWin.classList.toggle("open");
  chatWin.setAttribute("aria-hidden", String(!open));
  openIcon.classList.toggle("hidden", open);
  closeIcon.classList.toggle("hidden", !open);
  if (open) setTimeout(() => input.focus(), 300);
}

toggle.addEventListener("click", toggleChat);
closeBtn.addEventListener("click", toggleChat);
document.addEventListener("click", e => {
  if (chatWin.classList.contains("open") && !document.getElementById("chatbot").contains(e.target)) toggleChat();
});

function addMessage(text, role) {
  const avatar = role === "bot" ? '<span class="chatbot__msg-avatar">🧸</span>' : "";
  const div = document.createElement("div");
  div.className = `chatbot__msg chatbot__msg--${role}`;
  div.innerHTML = avatar + `<div class="chatbot__bubble">${text.replace(/\n/g, "<br/>")}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const div = document.createElement("div");
  div.id = "typingIndicator";
  div.className = "chatbot__msg chatbot__msg--bot";
  div.innerHTML = '<span class="chatbot__msg-avatar">🧸</span><div class="chatbot__bubble chatbot__typing"><span></span><span></span><span></span></div>';
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
  document.getElementById("typingIndicator")?.remove();
}

function findAnswer(userInput) {
  const text = userInput.toLowerCase().trim();
  for (const entry of KB) {
    if (entry.patterns.some(p => text.includes(p))) return entry.answer;
  }
  return defaultAnswer;
}

function sendMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  addMessage(trimmed, "user");
  input.value = "";
  showTyping();
  setTimeout(() => {
    hideTyping();
    addMessage(findAnswer(trimmed), "bot");
  }, 800 + Math.random() * 600);
}

sendBtn.addEventListener("click", () => sendMessage(input.value));
input.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(input.value); });
messages.addEventListener("click", e => {
  const btn = e.target.closest(".chatbot__suggestion");
  if (btn) sendMessage(btn.dataset.msg);
});
