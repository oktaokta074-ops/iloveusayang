/* ============ EDIT DI SINI ============ */
const CONFIG = {
  yourName: "Tri Utami",
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
 "I’m writing this because I’ve been thinking about you. Ever since our little argument, things have felt a bit different between us, and I really don’t like it.",
 "I don’t want a small disagreement to sit between us like a wall. Whatever was said, it never changes how much you mean to me. Your feelings matter, and I want to hear every one of them whenever you’re ready.",
 "You’re my favorite person to laugh with, to complain with, and to do absolutely nothing with. I miss that easy us.",
 "So here’s a tiny gift: a few things on the next pages to hopefully make you smile. No pressure, no rush. I’m right here.",
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
 "You’re my favorite person 💙",
 "Hehe, that tickles!",
 "Hug incoming 🤗",
 "You’re doing great, love",
 "One more smile please 😊"
];
const COUPONS = [
 ["1 Free Hug", "valid forever"],
 ["Movie Night", "you pick the movie"],
 ["Snack Run", "your choice, my treat"],
 ["Listening Time", "no interrupting, promise"]
];
const CAT_PICS = ["cheer1.GIF", "cheer2.GIF", "cheer3.GIF", "cheer4.GIF", "cheer5.GIF"];
CAT_PICS.forEach(p => { new Image().src = p; });
/* ====================================== */

const $ = s => document.querySelector(s);
let timers = [], history_ = [], current = "home";

function type(el, text, speed, done){
  el.textContent = ""; let i = 0;
  const t = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length){ clearInterval(t); done && done(); }
  }, speed);
  timers.push(t);
}

function go(id, push = true){
  if (push && current !== id) history_.push(current);
  current = id;
  timers.forEach(clearInterval); timers = [];
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(id);
  page.classList.add("active");
  document.body.classList.toggle("on-home", id === "home");
  window.scrollTo(0, 0);
  if (id === "envelope") $("#env").classList.remove("open");
  if (id === "yes") confetti();
  const h = page.querySelector("[data-type]");
  if (h && TEXT[id]){
    const txt = Array.isArray(TEXT[id]) ? TEXT[id][0] : TEXT[id];
    type(h, txt, 85, () => {
      const sub = page.querySelector("[data-type-sub]");
      if (sub) type(sub, TEXT[id][1], 30);
    });
  }
}

/* tombol & klik */
let taps = 0, catIdx = 0;
document.addEventListener("click", e => {
  const sym = ["💙", "✦", "✧", "🐾", "💫"];
  popSpark(e.clientX, e.clientY, sym[Math.floor(Math.random() * sym.length)]);

  const cat = e.target.closest("#catTap");
  if (cat){
    cat.classList.remove("pop"); void cat.offsetWidth; cat.classList.add("pop");
    if (cat.tagName === "IMG") cat.src = CAT_PICS[catIdx++ % CAT_PICS.length];
    cat.addEventListener("animationend", () => cat.classList.remove("pop"), { once: true });
    if (taps < 5){
      taps++;
      $("#tapCount").textContent = taps + " / 5";
      $("#bubble").textContent = taps === 5 ? "Yay, unlocked! 🎉" : CHEERS[taps - 1];
      if (taps === 5) $("#cheerNext").disabled = false;
    } else {
      $("#bubble").textContent = CHEERS[Math.floor(Math.random() * CHEERS.length)];
    }
    return;
  }
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.go) go(b.dataset.go);
  else if (b.hasAttribute("data-back")) go(history_.pop() || "home", false);
  else if (b.hasAttribute("data-home")){ history_ = []; go("home", false); }
});

/* amplop terbuka dulu baru ke surat */
$("#readBtn").addEventListener("click", () => {
  $("#env").classList.add("open");
  setTimeout(() => go("letter"), 1400);
});

/* surat */
$("#letterText").innerHTML = LETTER.map(t => `<p>${t}</p>`).join("");

/* musik */
const audio = $("#audio"), playBtn = $("#playBtn");
$("#songTitle").textContent = CONFIG.song.title;
$("#songArtist").textContent = CONFIG.song.artist;
$("#cover").src = CONFIG.song.cover;
$("#cover").onerror = e => e.target.removeAttribute("src");
audio.src = CONFIG.song.audio;
playBtn.addEventListener("click", () => {
  if (audio.paused){ audio.play().catch(() => {}); playBtn.textContent = "❚❚"; }
  else { audio.pause(); playBtn.textContent = "▶"; }
});

/* alasan */
let opened = 0;
REASONS.forEach(r => {
  const c = document.createElement("button");
  c.className = "card"; c.innerHTML = '<span class="h">♥</span>';
  c.addEventListener("click", () => {
    if (c.classList.contains("open")) return;
    c.classList.add("open"); c.textContent = r;
    if (++opened === REASONS.length) $("#reasonsNext").disabled = false;
  });
  $("#cards").appendChild(c);
});

/* kupon */
COUPONS.forEach(([t, s]) => {
  const c = document.createElement("button");
  c.className = "coupon"; c.innerHTML = `${t}<small>${s}</small>`;
  c.addEventListener("click", () => {
    c.classList.toggle("used");
    c.querySelector("small").textContent = c.classList.contains("used") ? "Redeemed ✓" : s;
    if (c.classList.contains("used")) confetti(25);
  });
  $("#couponList").appendChild(c);
});

/* efek */
function popSpark(x, y, s){
  const h = document.createElement("span");
  h.className = "ph"; h.textContent = s;
  h.style.left = x + "px"; h.style.top = y + "px";
  document.body.appendChild(h); setTimeout(() => h.remove(), 1000);
}
function confetti(n = 70){
  const colors = ["#bcd6ff", "#6fa8ff", "#fff", "#ffd1dc", "#f9a8d4"];
  for (let i = 0; i < n; i++){
    const c = document.createElement("span");
    c.className = "cf";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = (2 + Math.random() * 2) + "s";
    c.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(c); setTimeout(() => c.remove(), 4600);
  }
}

/* latar: bintang berkelip + gelembung */
const bg = $("#bg");
for (let i = 0; i < 28; i++){
  const s = document.createElement("span");
  s.className = "star"; s.textContent = i % 3 ? "✦" : "✧";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 100 + "%";
  s.style.fontSize = (8 + Math.random() * 14) + "px";
  s.style.animationDelay = Math.random() * 3 + "s";
  bg.appendChild(s);
}
setInterval(() => {
  const b = document.createElement("span"), d = 10 + Math.random() * 30;
  b.className = "bub";
  b.style.width = b.style.height = d + "px";
  b.style.left = Math.random() * 100 + "%";
  b.style.animationDuration = (9 + Math.random() * 7) + "s";
  bg.appendChild(b); setTimeout(() => b.remove(), 16500);
}, 1400);

/* kucing cadangan kalau gambar tidak ketemu */
function catSVG(m){
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
function swapCat(i){
  if (!i.dataset.cat) return;
  const w = document.createElement("div");
  w.className = i.className; w.id = i.id; w.innerHTML = catSVG(i.dataset.cat);
  i.replaceWith(w);
}
document.addEventListener("error", e => { if (e.target.tagName === "IMG") swapCat(e.target); }, true);
document.querySelectorAll("img[data-cat]").forEach(i => { if (i.complete && i.naturalWidth === 0) swapCat(i); });

go("home", false);
