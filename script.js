/* ============ EDIT DI SINI ============ */
const CONFIG = {
  yourName: "[Your Name]",
  song: {
    title:  "Keep Me",
    artist: "Novo Amor",
    cover:  "cover.jpg",
    audio:  "song.mp3"
  }
};
const TEXT = {
  home: ["I’m Sorry, Love...", "A space to clear the air, share my heart, and bridge the gap between us"],
  letter: "I’m Sorry, Love...",
  forgive: "Will you forgive me, my love?",
  yes: "Yeeees!!!",
  promise: "I Promise that this won’t happen again!",
  time: "Take all the time you need to process, love"
};
const LETTER = [
 "I’m writing this because I want to give you some space, but I also need to clear the air about what happened between us. Looking back at our misunderstanding, I realize that my words/actions didn’t reflect how I truly feel about you, and I am so sorry for my part in it.",
 "I hate the feeling of there being a wall between us. It was never my intention to hurt or upset you, but I know that intentions don't change how things landed. Your feelings are completely valid, and it pains me to know that I caused you any stress or doubt.",
 "Our relationship means the world to me, and I don't want a miscommunication to overshadow the love and respect we’ve built. I want to listen and truly understand your perspective whenever you are ready to talk.",
 "Please take all the time and space you need. Just know that I am here, I love you, and I hope you can forgive me.",
 "With all my love,",
 CONFIG.yourName
];
/* ====================================== */

const $ = s => document.querySelector(s);
let timers = [];

function type(el, text, speed = 70, done){
  el.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length){ clearInterval(t); done && done(); }
  }, speed);
  timers.push(t);
}

function go(id){
  timers.forEach(clearInterval); timers = [];
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(id);
  page.classList.add('active');
  window.scrollTo(0, 0);

  const h = page.querySelector('[data-type]');
  if (h && TEXT[id]){
    const txt = Array.isArray(TEXT[id]) ? TEXT[id][0] : TEXT[id];
    type(h, txt, 85, () => {
      const sub = page.querySelector('[data-type-sub]');
      if (sub) type(sub, TEXT[id][1], 30);
    });
  }
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-go]');
  if (b) go(b.dataset.go);
});

$('#letterText').innerHTML = LETTER.map(t => `<p>${t}</p>`).join('');

const audio = $('#audio'), playBtn = $('#playBtn');
$('#songTitle').textContent = CONFIG.song.title;
$('#songArtist').textContent = CONFIG.song.artist;
$('#cover').src = CONFIG.song.cover;
$('#cover').onerror = e => e.target.removeAttribute('src');
audio.src = CONFIG.song.audio;
playBtn.addEventListener('click', () => {
  if (audio.paused){ audio.play().catch(()=>{}); playBtn.textContent = '❚❚'; }
  else { audio.pause(); playBtn.textContent = '▶'; }
});

go('home');
