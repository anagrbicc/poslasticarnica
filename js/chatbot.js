(function () {
  "use strict";

  // ── Baza znanja ──────────────────────────────────────────────────────────────
  const KB = [
    {
      patterns: ["igračke", "ponuda", "šta imate", "koje igračke", "kolekcija", "proizvodi"],
      answer:
        "Naša kolekcija uključuje:\n🧸 Medvediće (Teddy, Polarni)\n🐰 Zečiće (Fluffy)\n🦊 Lisice (Foxy)\n🐨 Koale (Kiki)\n🦄 Jednoroze (Luna)\n\nSvaki komad je ručno rađen i CE sertifikovan! 💕",
    },
    {
      patterns: ["cena", "cijena", "koliko košta", "koliko kosta", "cene", "cijene", "price"],
      answer:
        "Naše cene su:\n• Zečić Fluffy – 999 RSD\n• Medvedić Teddy – 1.299 RSD\n• Koala Kiki – 1.399 RSD\n• Polarni Medved – 1.499 RSD\n• Lisica Foxy – 1.599 RSD\n• Jednorog Luna – 1.799 RSD (aktualno -20%! 🎉)",
    },
    {
      patterns: ["dostava", "slanje", "pošta", "posta", "isporuka", "shipping", "šaljete", "saljete"],
      answer:
        "📦 Dostavljamo po celoj Srbiji i regionu!\n\n• Srbija: 350 RSD (besplatno za narudžbe 3.000+ RSD)\n• Region (BIH, CG, MK): 700 RSD\n• Rok isporuke: 1–3 radna dana\n\nPratite paket putem tracking koda koji dobijate emailom! 📬",
    },
    {
      patterns: ["radno vreme", "radno vrijeme", "radi", "otvoreno", "kada", "sati", "hours"],
      answer:
        "🕐 Naše radno vreme:\n\nPonedeljak – Petak: 09:00 – 20:00\nSubota: 10:00 – 16:00\nNedelja: Zatvoreno\n\nMožete nas kontaktirati i putem emaila van radnog vremena! 📧",
    },
    {
      patterns: ["kontakt", "telefon", "email", "adresa", "gdje se nalazite", "gde se nalazite", "lokacija"],
      answer:
        "📍 Knez Mihailova 14, Beograd\n📞 +381 11 123 4567\n✉️ info@mekaniprijatelji.rs\n\nMožete nas posetiti lično ili naručiti online! 😊",
    },
    {
      patterns: ["povrat", "reklamacija", "zamjena", "zamena", "vrácení", "vracanje", "nije ispravno"],
      answer:
        "✅ Garantujemo 30 dana za povrat i zamenu!\n\nAko ste nezadovoljni iz bilo kojeg razloga, kontaktirajte nas i riešićemo problem u roku od 24h. Vaše zadovoljstvo je naš prioritet! 💖",
    },
    {
      patterns: ["uzrast", "dob", "beba", "dijete", "dete", "koliko godina", "bezbedno", "sigurno", "CE"],
      answer:
        "👶 Sve naše igračke su bezbedne za decu!\n\n• Hipoalergeni materijali\n• CE sertifikat (EU standard)\n• Bez malih delova za decu 0–3 god.\n• Perivo na 30°C u veš mašini\n\nIdealne od 0+ godina! ✨",
    },
    {
      patterns: ["popust", "akcija", "sniženje", "kupon", "promo", "sale", "discount"],
      answer:
        "🎉 Trenutne akcije:\n\n• Jednorog Luna: -20% (samo ovo sedmicu!)\n• Besplatna dostava za kupovinu 3.000+ RSD\n• Za newsletter pretplatnike: 10% na prvu narudžbu\n\nPratite nas na Instagramu za ekskluzivne ponude! 📱",
    },
    {
      patterns: ["hvala", "thanks", "super", "odlično", "odlicno", "sjajno", "krasno"],
      answer: "Hvala vam puno! 🧸💕 Raduje nas što možemo pomoći. Ako imate još pitanja, slobodno pitajte! 😊",
    },
    {
      patterns: ["zdravo", "ćao", "cao", "hej", "hello", "hi", "dobro jutro", "dobro veče", "dobro vece"],
      answer:
        "Zdravo! 👋🧸 Dobrodošli u Mekani Prijatelji!\n\nJa sam Teddy, vaš virtualni asistent. Mogu vam pomoći sa informacijama o igračkama, cijenama, dostavi i svemu ostalom. Šta vas zanima?",
    },
    {
      patterns: ["poklon", "gift", "pokloni", "za poklon", "rođendan", "rodjendan", "birthday"],
      answer:
        "🎁 Naše igračke su savršen poklon!\n\nNudimo i besplatno pakovanje na poklon (lepa kutija + mašna) za sve narudžbe. Samo napomenite pri narudžbi! 🎀\n\nNajpopularniji pokloni su:\n1. Medvedić Teddy 🧸\n2. Jednorog Luna 🦄\n3. Zečić Fluffy 🐰",
    },
  ];

  const defaultAnswer =
    "Hmm, nisam siguran šta mislite 🤔\n\nMožete me pitati o:\n• Igračkama i cenama\n• Dostavi\n• Radnom vremenu\n• Povratima\n• Poklon pakovanju\n\nIli me nazovite: +381 11 123 4567 😊";

  // ── DOM elementi ─────────────────────────────────────────────────────────────
  const toggle      = document.getElementById("chatbotToggle");
  const window_el   = document.getElementById("chatbotWindow");
  const closeBtn    = document.getElementById("chatbotClose");
  const messages    = document.getElementById("chatbotMessages");
  const input       = document.getElementById("chatbotInput");
  const sendBtn     = document.getElementById("chatbotSend");
  const openIcon    = toggle.querySelector(".chatbot__toggle-icon--open");
  const closeIcon   = toggle.querySelector(".chatbot__toggle-icon--close");

  let isOpen = false;

  // ── Otvori / zatvori ─────────────────────────────────────────────────────────
  function toggleChat() {
    isOpen = !isOpen;
    window_el.classList.toggle("open", isOpen);
    window_el.setAttribute("aria-hidden", String(!isOpen));
    openIcon.classList.toggle("hidden", isOpen);
    closeIcon.classList.toggle("hidden", !isOpen);
    if (isOpen) {
      setTimeout(() => input.focus(), 300);
    }
  }

  toggle.addEventListener("click", toggleChat);
  closeBtn.addEventListener("click", toggleChat);

  // Zatvori klikom van chata
  document.addEventListener("click", (e) => {
    if (isOpen && !document.getElementById("chatbot").contains(e.target)) {
      toggleChat();
    }
  });

  // ── Dodaj poruku ─────────────────────────────────────────────────────────────
  function addMessage(text, role) {
    const wrap = document.createElement("div");
    wrap.className = `chatbot__msg chatbot__msg--${role}`;

    if (role === "bot") {
      const avatar = document.createElement("span");
      avatar.className = "chatbot__msg-avatar";
      avatar.textContent = "🧸";
      wrap.appendChild(avatar);
    }

    const bubble = document.createElement("div");
    bubble.className = "chatbot__bubble";
    // Pretvori newline u <br>
    bubble.innerHTML = text.replace(/\n/g, "<br/>");
    wrap.appendChild(bubble);

    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  // ── Typing indikator ─────────────────────────────────────────────────────────
  function showTyping() {
    const wrap = document.createElement("div");
    wrap.className = "chatbot__msg chatbot__msg--bot";
    wrap.id = "typingIndicator";

    const avatar = document.createElement("span");
    avatar.className = "chatbot__msg-avatar";
    avatar.textContent = "🧸";

    const bubble = document.createElement("div");
    bubble.className = "chatbot__bubble chatbot__typing";
    bubble.innerHTML = "<span></span><span></span><span></span>";

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const indicator = document.getElementById("typingIndicator");
    if (indicator) indicator.remove();
  }

  // ── Pronađi odgovor ──────────────────────────────────────────────────────────
  function findAnswer(userInput) {
    const normalized = userInput.toLowerCase().trim();

    for (const entry of KB) {
      for (const pattern of entry.patterns) {
        if (normalized.includes(pattern)) {
          return entry.answer;
        }
      }
    }
    return defaultAnswer;
  }

  // ── Pošalji poruku ───────────────────────────────────────────────────────────
  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    addMessage(trimmed, "user");
    input.value = "";

    showTyping();

    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      hideTyping();
      const answer = findAnswer(trimmed);
      addMessage(answer, "bot");
    }, delay);
  }

  sendBtn.addEventListener("click", () => sendMessage(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage(input.value);
  });

  // ── Klik na suggestion dugmiće ───────────────────────────────────────────────
  messages.addEventListener("click", (e) => {
    const btn = e.target.closest(".chatbot__suggestion");
    if (!btn) return;
    sendMessage(btn.dataset.msg);
  });
})();
