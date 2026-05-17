"use strict";

const KB = [
  { patterns: ["igracke", "ponuda", "sta imate", "koje igracke", "kolekcija", "proizvodi"],
    answer: "Nasa kolekcija ukljucuje:\n- Medvedice (Teddy, Polarni)\n- Zecice (Fluffy)\n- Lisice (Foxy)\n- Koale (Kiki)\n- Jednoroze (Luna)\n\nSvaki komad je rucno radjen i CE sertifikovan!" },
  { patterns: ["cena", "cijena", "koliko kosta", "cene", "cijene", "price"],
    answer: "Nase cene su:\n- Zecic Fluffy: 999 RSD\n- Medvedic Teddy: 1.299 RSD\n- Koala Kiki: 1.399 RSD\n- Polarni Medved: 1.499 RSD\n- Lisica Foxy: 1.599 RSD\n- Jednorog Luna: 1.799 RSD (aktualno -20%!)" },
  { patterns: ["dostava", "slanje", "posta", "isporuka", "shipping", "saljete"],
    answer: "Dostavljamo po celoj Srbiji i regionu!\n\n- Srbija: 350 RSD (besplatno za narudzbine 3.000+ RSD)\n- Region (BIH, CG, MK): 700 RSD\n- Rok isporuke: 1-3 radna dana\n\nPratite paket putem tracking koda koji dobijate emailom!" },
  { patterns: ["radno vreme", "radi", "otvoreno", "kada", "sati", "hours"],
    answer: "Nase radno vreme:\n\nPonedeljak - Petak: 09:00 - 20:00\nSubota: 10:00 - 16:00\nNedelja: Zatvoreno\n\nMozete nas kontaktirati i putem emaila van radnog vremena!" },
  { patterns: ["kontakt", "telefon", "email", "adresa", "gde se nalazite", "lokacija"],
    answer: "Knez Mihailova 14, Beograd\nTel: +381 11 123 4567\nEmail: info@mekaniprijatelji.rs\n\nMozete nas posetiti licno ili naruciti online!" },
  { patterns: ["povrat", "reklamacija", "zamena", "vracanje", "nije ispravno"],
    answer: "Garantujemo 30 dana za povrat i zamenu!\n\nAko ste nezadovoljni iz bilo kojeg razloga, kontaktirajte nas i resoicemo problem u roku od 24h. Vase zadovoljstvo je nas prioritet!" },
  { patterns: ["uzrast", "beba", "dete", "koliko godina", "bezbedno", "sigurno", "CE"],
    answer: "Sve nase igracke su bezbedne za decu!\n\n- Hipoalergeni materijali\n- CE sertifikat (EU standard)\n- Bez malih delova za decu 0-3 god.\n- Perivo na 30°C u ves masini\n\nIdealne od 0+ godina!" },
  { patterns: ["popust", "akcija", "snizenje", "kupon", "promo", "sale", "discount"],
    answer: "Trenutne akcije:\n\n- Jednorog Luna: -20% (samo ovo sedmicu!)\n- Besplatna dostava za kupovinu 3.000+ RSD\n- Za newsletter pretplatnike: 10% na prvu narudzbinu\n\nPratite nas na Instagramu za ekskluzivne ponude!" },
  { patterns: ["hvala", "thanks", "super", "odlicno", "sjajno"],
    answer: "Hvala vam puno! Raduje nas sto mozemo pomoci. Ako imate jos pitanja, slobodno pitajte!" },
  { patterns: ["zdravo", "cao", "hej", "hello", "hi", "dobro jutro"],
    answer: "Zdravo! Dobrodosli u Mekani Prijatelji!\n\nJa sam Teddy, vas virtuelni asistent. Mogu vam pomoci sa informacijama o igrakama, cenama, dostavi i svemu ostalom. Sta vas zanima?" },
  { patterns: ["poklon", "gift", "rodjendan", "birthday"],
    answer: "Nase igracke su savrsen poklon!\n\nNudimo i besplatno pakovanje na poklon (lepa kutija + masna) za sve narudzbine. Samo napomenite pri narudzbini!\n\nNajpopularniji pokloni su:\n1. Medvedic Teddy\n2. Jednorog Luna\n3. Zecic Fluffy" },
];

const defaultAnswer = "Nisam siguran sta mislite.\n\nMozete me pitati o:\n- Igracakama i cenama\n- Dostavi\n- Radnom vremenu\n- Povratima\n- Poklon pakovanju\n\nIli me nazovite: +381 11 123 4567";

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
  const div = document.createElement("div");
  div.className = `chatbot__msg chatbot__msg--${role}`;
  div.innerHTML = `<div class="chatbot__bubble">${text.replace(/\n/g, "<br/>")}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const div = document.createElement("div");
  div.id = "typingIndicator";
  div.className = "chatbot__msg chatbot__msg--bot";
  div.innerHTML = '<div class="chatbot__bubble chatbot__typing"><span></span><span></span><span></span></div>';
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
