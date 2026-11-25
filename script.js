/* ============ EDIT DI SINI ============ */
const CONFIG = {
  yourName: "Adeo.",
  song: { title: "Keep Me", artist: "Novo Amor", cover: "cover.JPG", audio: "song.mp3" }
};

const TEXT = {
  home: ["Haii Sayangku...", "sudut kecil di internet, hanya untukmu."],
  envelope: "surat untukmu",
  letter: "Haii Sayangku...",
  reasons: "Beberapa hal yang aku cintai darimu",
  cheer: "Ayoo ayo ayo!",
  forgive: "Ayo kita perbaiki lagi sama sama, ya?",
  yes: "yeyeyeyyey!!!",
  coupons: "kupon spesial untukmu",
  promise: "always you, always us!",
  time: "isokeeii sayangku, take ur time"
};

const LETTER = [
  "im writing this because my heart feels so heavy knowing how much I hurt u today. Ini bukan masalah sepele, dan aku benar benar menyesal udaa bikin kamu kecewa untuk yang kesekian kalinya.",
  "u mean the world to me, sayang. aku nggaa mau “kita” jadi 'aku kamu'. your feelings are completely valid, dan kamu pantas untuk marah sama aku. tolong jangan minta maaf yaa, karena kamu ga salah sama sekali.",
  "aku kangen kamu banget banget, kangen dengerin kamu cerita, kangen peluk kamu, aku ga bisa stop mikirin kamu, kangen kamu luar biasaa. im not going anywhere, aku engga ngelepas kamu by, aku hanya ingin memberimu space, and im right here waiting whenever u feel ready.",
  "so heres a tiny gift: a few things on the next pages to hopefully make u smile. no pressure, no rush. im right here.",
  "With all my love,",
  CONFIG.yourName
];

const REASONS = [
  "Your smile makes my whole day better",
  "You make even boring moments fun",
  "You’re the best listener I know",
  "Your laugh is my favorite sound",
  "You care so much about the people you love",
  "Being with you just feels like home"
];

const CHEERS = [
  "kamu satu satunya yang aku suka! 💙",
  "eh eh geli tipis!",
  "woaahh maw peluk!",
  "baguss sayangg!",
  "lagi lagi lagi!"
];

const COUPONS = [
  ["1 Free Hug", "valid forever"],
  ["Movie Night", "you pick the movie"],
  ["Snack Run", "your choice, my treat"],
  ["Listening Time", "no interrupting, promise"]
];

const CAT_PICS = ["cheer1.GIF", "cheer2.GIF", "cheer3.GIF", "cheer4.GIF", "cheer5.GIF"];
CAT_PICS.forEach(p => {
  const img = new Image();
  img.src = p;
});
/* ====================================== */

const $ = s => document.querySelector(s);
let timers = [];
let history_ = [];
let current = "home";

function type(el, text, speed, done) {
  if (!el || typeof text !== "string") {
    done && done();
    return;
  }
  el.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) {
      clearInterval(t);
      done && done();
    }
  }, speed);
  timers.push(t);
}

function go(id, push = true) {
  if (push && current !== id) history_.push(current);
  current = id;

  timers.forEach(clearInterval);
  timers = [];

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(id);
  if (!page) {
    alert("Halaman '" + id + "' tidak ketemu");
    return go("home", false);
  }

  page.classList.add("active");
  document.body.classList.toggle("on-home", id === "home");
  window.scrollTo(0, 0);

  if (id === "envelope" && $("#env")) $("#env").classList.remove("open");
  if (id === "yes") confetti();

  const h = page.querySelector("[data-type]");
  if (h && TEXT[id]) {
    const txt = Array.isArray(TEXT[id]) ? TEXT[id][0] : TEXT[id];
    type(h, txt, 85, () => {
      const sub = page.querySelector("[data-type-sub]");
      if (sub && Array.isArray(TEXT[id]) && TEXT[id][1]) {
        type(sub, TEXT[id][1], 30);
      }
    });
  }
}

/* tombol & klik */
let taps = 0;
let catIdx = 0;

document.addEventListener("click", e => {
  const sym = ["💙", "✦", "✧", "🐾", "💫"];
  popSpark(e.clientX, e.clientY, sym[Math.floor(Math.random() * sym.length)]);

  const cat = e.target.closest("#catTap");
  if (cat) {
    cat.classList.remove("pop");
    void cat.offsetWidth;
    cat.classList.add("pop");
    if (cat.tagName === "IMG" && CAT_PICS.length) {
      cat.src = CAT_PICS[catIdx++ % CAT_PICS.length];
    }
    cat.addEventListener("animationend", () => cat.classList.remove("pop"), { once: true });

    if (taps < 5) {
      taps++;
      if ($("#tapCount")) $("#tapCount").textContent = taps + " / 5";
      if ($("#bubble")) {
        $("#bubble").textContent = taps === 5 ? "Yay, unlocked! 🎉" : CHEERS[taps - 1];
      }
      if (taps === 5 && $("#cheerNext")) $("#cheerNext").disabled = false;
    } else if ($("#bubble")) {
      $("#bubble").textContent = CHEERS[Math.floor(Math.random() * CHEERS.length)];
    }
    return;
  }

  const b = e.target.closest("button");
  if (!b) return;

  if (b.dataset.go) go(b.dataset.go);
  else if (b.hasAttribute("data-back")) go(history_.pop() || "home", false);
  else if (b.hasAttribute("data-home")) {
    history_ = [];
    go("home", false);
  }
});

/* amplop terbuka dulu baru ke surat */
const readBtn = $("#readBtn");
if (readBtn) {
  readBtn.addEventListener("click", () => {
    if ($("#env")) $("#env").classList.add("open");
    setTimeout(() => go("letter"), 1400);
  });
}

/* surat */
const letterText = $("#letterText");
if (letterText) {
  letterText.innerHTML = LETTER.map(t => `<p>${t}</p>`).join("");
}

/* musik */
const audio = $("#audio");
const playBtn = $("#playBtn");
if ($("#songTitle")) $("#songTitle").textContent = CONFIG.song.title;
if ($("#songArtist")) $("#songArtist").textContent = CONFIG.song.artist;
if ($("#cover")) {
  $("#cover").src = CONFIG.song.cover;
  $("#cover").onerror = e => e.target.removeAttribute("src");
}
if (audio) audio.src = CONFIG.song.audio;
if (playBtn && audio) {
  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      playBtn.textContent = "❚❚";
    } else {
      audio.pause();
      playBtn.textContent = "▶";
    }
  });
}

/* alasan */
let opened = 0;
const cardsContainer = $("#cards");
if (cardsContainer) {
  REASONS.forEach(r => {
    const c = document.createElement("button");
    c.className = "card";
    c.innerHTML = '<span class="h">♥</span>';
    c.addEventListener("click", () => {
      if (c.classList.contains("open")) return;
      c.classList.add("open");
      c.textContent = r;
      if (++opened === REASONS.length && $("#reasonsNext")) {
        $("#reasonsNext").disabled = false;
      }
    });
    cardsContainer.appendChild(c);
  });
}

/* kupon */
const couponList = $("#couponList");
if (couponList) {
  COUPONS.forEach(([t, s]) => {
    const c = document.createElement("button");
    c.className = "coupon";
    c.innerHTML = `${t}<small>${s}</small>`;
    c.addEventListener("click", () => {
      c.classList.toggle("used");
      const small = c.querySelector("small");
      if (small) {
        small.textContent = c.classList.contains("used") ? "Redeemed ✓" : s;
      }
      if (c.classList.contains("used")) confetti(25);
    });
    couponList.appendChild(c);
  });
}

/* efek */
function popSpark(x, y, s) {
  const h = document.createElement("span");
  h.className = "ph";
  h.textContent = s;
  h.style.left = x + "px";
  h.style.top = y + "px";
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1000);
}

function confetti(n = 70) {
  const colors = ["#bcd6ff", "#6fa8ff", "#fff", "#ffd1dc", "#f9a8d4"];
  for (let i = 0; i < n; i++) {
    const c = document.createElement("span");
    c.className = "cf";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = (2 + Math.random() * 2) + "s";
    c.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4600);
  }
}

/* latar: bintang berkelip + gelembung */
const bg = $("#bg");
if (bg) {
  for (let i = 0; i < 28; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.textContent = i % 3 ? "✦" : "✧";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.fontSize = (8 + Math.random() * 14) + "px";
    s.style.animationDelay = Math.random() * 3 + "s";
    bg.appendChild(s);
  }

  setInterval(() => {
    const b = document.createElement("span");
    const d = 10 + Math.random() * 30;
    b.className = "bub";
    b.style.width = b.style.height = d + "px";
    b.style.left = Math.random() * 100 + "%";
    b.style.animationDuration = (9 + Math.random() * 7) + "s";
    bg.appendChild(b);
    setTimeout(() => b.remove(), 16500);
  }, 1400);
}

/* kucing cadangan kalau gambar tidak ketemu */
function catSVG(m) {
  const eyes = m === "happy"
    ? '<circle cx="76" cy="108" r="11" fill="#333"/><circle cx="124" cy="108" r="11" fill="#333"/><circle cx="72" cy="104" r="4" fill="#fff"/><circle cx="120" cy="104" r="4" fill="#fff"/>'
    : m === "idle"
    ? '<ellipse cx="76" cy="110" rx="8" ry="9" fill="#333"/><ellipse cx="124" cy="110" rx="8" ry="9" fill="#333"/>'
    : '<path d="M66 112q10-14 20 0M114 112q10-14 20 0" stroke="#333" stroke-width="5" fill="none" stroke-linecap="round"/>';
  const mouth = m === "happy"
    ? '<ellipse cx="100" cy="130" rx="7" ry="9" fill="#f58aa8"/>'
    : '<path d="M92 124q8 8 16 0" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round"/>';
  const extra = m === "happy"
    ? '<text x="10" y="50" font-size="24" fill="#ffc2d1">✦</text><text x="160" y="40" font-size="28" fill="#ffc2d1">✦</text>'
    : (m === "hug" || m === "heart") ? '<text x="120" y="195" font-size="72" fill="#f4829f">♥</text>' : "";

  return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="5">'
    + '<polygon points="42,74 52,28 88,58" fill="#fde2e4"/><polygon points="158,74 148,28 112,58" fill="#fde2e4"/>'
    + '<ellipse cx="100" cy="165" rx="48" ry="32" fill="#fff"/><ellipse cx="100" cy="108" rx="72" ry="58" fill="#fff"/>'
    + '<g stroke="none"><circle cx="56" cy="128" r="10" fill="#ffd1d9"/><circle cx="144" cy="128" r="10" fill="#ffd1d9"/></g>'
    + '<g stroke="none">' + eyes + '</g>' + mouth + '<g stroke="none">' + extra + '</g></svg>';
}

function swapCat(i) {
  if (!i.dataset.cat) return;
  const w = document.createElement("div");
  w.className = i.className;
  w.id = i.id;
  w.innerHTML = catSVG(i.dataset.cat);
  i.replaceWith(w);
}

document.addEventListener("error", e => {
  if (e.target.tagName === "IMG") swapCat(e.target);
}, true);

document.querySelectorAll("img[data-cat]").forEach(i => {
  if (i.complete && i.naturalWidth === 0) swapCat(i);
});

document.querySelectorAll(".page").forEach(p => document.body.appendChild(p));
go("home", false);
