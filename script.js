/* ============ EDIT DI SINI ============ */
const CONFIG = {
  yourName: "[Your Name]",
  song: { title: "Keep Me", artist: "Novo Amor", cover: "cover.jpg", audio: "song.mp3" }
};
const TEXT = {
  home: ["Hey, Love...", "A little corner of the internet, made just for you"],
  letter: "Hey, Love...",
  reasons: "A few things I love about you",
  cheer: "Cheer-up break!",
  forgive: "Can we get back to us, my love?",
  yes: "Yeeees!!!",
  coupons: "Your Love Coupons",
  promise: "Always you, always us!",
  time: "Take all the time you need, love"
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
 "You’re my favorite person 💗",
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

document.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.go) go(b.dataset.go);
  else if (b.hasAttribute("data-back")) go(history_.pop() || "home", false);
  else if (b.hasAttribute("data-home")){ history_ = []; go("home", false); }
});

/* amplop terbuka dulu baru ke surat */
$("#readBtn").addEventListener("click", () => {
  $("#env").classList.add("open");
  setTimeout(() => go("letter"), 700);
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

/* alasan (hati) */
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

/* tap kucing */
let taps = 0;
$("#catTap").addEventListener("click", e => {
  const cat = e.currentTarget;
  cat.classList.remove("pop"); void cat.offsetWidth; cat.classList.add("pop");
  cat.addEventListener("animationend", () => cat.classList.remove("pop"), { once: true });
  popHeart(e.clientX, e.clientY);
  if (taps < 5){
    taps++;
    $("#tapCount").textContent = taps + " / 5";
    $("#bubble").textContent = taps === 5 ? "Yay, unlocked! 🎉" : CHEERS[taps - 1];
    if (taps === 5) $("#cheerNext").disabled = false;
  } else {
    $("#bubble").textContent = CHEERS[Math.floor(Math.random() * CHEERS.length)];
  }
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
function popHeart(x, y){
  const h = document.createElement("span");
  h.className = "ph"; h.textContent = "💗";
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
setInterval(() => {
  const h = document.createElement("span");
  h.className = "fh"; h.textContent = "♥";
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = (12 + Math.random() * 22) + "px";
  h.style.animationDuration = (7 + Math.random() * 6) + "s";
  document.body.appendChild(h); setTimeout(() => h.remove(), 13500);
}, 900);

go("home", false);
