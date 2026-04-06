/* ============================================================
   SIGNIFYIN' — script.js
   ============================================================ */

const stage       = document.getElementById('stage');
const strip       = document.getElementById('strip');
const audioEl     = document.getElementById('audioEl');
const playPauseBtn= document.getElementById('playPause');
const iconPlay    = playPauseBtn.querySelector('.icon-play');
const iconPause   = playPauseBtn.querySelector('.icon-pause');
const skipBackBtn = document.getElementById('skipBack');
const skipFwdBtn  = document.getElementById('skipFwd');
const playerTitle = document.getElementById('playerTitle');
const playerArtist= document.getElementById('playerArtist');
const elCurrent   = document.getElementById('currentTime');
const elTotal     = document.getElementById('totalTime');
const progressFill= document.getElementById('progressFill');
const progressTrack= document.getElementById('progressTrack');
const jumpBtns    = Array.from(document.querySelectorAll('.jump-btn'));
const eras        = Array.from(document.querySelectorAll('.era'));

const isMobile = () => window.innerWidth <= 768;

// ============================================================
// SCROLL STATE
// ============================================================
let scrollX    = 0;     // current px offset
let targetX    = 0;     // target px offset (lerped)
let rafId      = null;
let activeCard = null;

function maxScroll() {
  return Math.max(0, strip.scrollWidth - stage.clientWidth);
}

function setTranslate(x) {
  strip.style.transform = `translateX(${-x}px)`;
}

// smooth lerp loop
function animateScroll() {
  if (Math.abs(targetX - scrollX) < 0.5) {
    scrollX = targetX;
    setTranslate(scrollX);
    rafId = null;
    return;
  }
  scrollX += (targetX - scrollX) * 0.1;
  setTranslate(scrollX);
  rafId = requestAnimationFrame(animateScroll);
}

function scrollTo(x) {
  if (isMobile()) return;
  targetX = Math.max(0, Math.min(maxScroll(), x));
  if (!rafId) rafId = requestAnimationFrame(animateScroll);
}

// ============================================================
// WHEEL → horizontal
// ============================================================
stage.addEventListener('wheel', (e) => {
  if (isMobile()) return;
  e.preventDefault();
  scrollTo(targetX + e.deltaY * 1);
  updateActiveJump();
}, { passive: false });

// Also intercept on window to prevent page scroll on desktop
window.addEventListener('wheel', (e) => {
  if (isMobile()) return;
  e.preventDefault();
  scrollTo(targetX + e.deltaY * 1);
  updateActiveJump();
}, { passive: false });

// ============================================================
// DRAG to scroll
// ============================================================
let dragStart = null;
let dragStartX = 0;

strip.addEventListener('mousedown', (e) => {
  if (isMobile()) return;
  dragStart = e.clientX;
  dragStartX = targetX;
});

window.addEventListener('mousemove', (e) => {
  if (dragStart === null || isMobile()) return;
  const dx = dragStart - e.clientX;
  scrollTo(dragStartX + dx);
  updateActiveJump();
});

window.addEventListener('mouseup', () => { dragStart = null; });

// Touch swipe (desktop/tablet horizontal)
let touchX0 = 0;
let touchScrollX0 = 0;

window.addEventListener('touchstart', (e) => {
  touchX0 = e.touches[0].clientX;
  touchScrollX0 = targetX;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (isMobile()) return;
  const dx = touchX0 - e.touches[0].clientX;
  scrollTo(touchScrollX0 + dx * 1.4);
  updateActiveJump();
}, { passive: true });

// Arrow keys
window.addEventListener('keydown', (e) => {
  if (isMobile()) return;
  const step = stage.clientWidth * 0.4;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') scrollTo(targetX + step);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   scrollTo(targetX - step);
  updateActiveJump();
});

// ============================================================
// JUMP NAV
// ============================================================
jumpBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    if (isMobile()) {
      eras[i].scrollIntoView({ behavior: 'smooth' });
    } else {
      const era = eras[i];
      // get the era's left offset relative to strip
      const eraLeft = era.offsetLeft;
      scrollTo(eraLeft - 60); // 60px = strip padding
    }
    setActiveJump(i);
  });
});

function setActiveJump(i) {
  jumpBtns.forEach((b, j) => b.classList.toggle('active', j === i));
}

function updateActiveJump() {
  // find which era is most visible
  let closest = 0;
  let closestDist = Infinity;
  eras.forEach((era, i) => {
    const eraLeft = era.offsetLeft - 60;
    const dist = Math.abs(eraLeft - targetX);
    if (dist < closestDist) { closestDist = dist; closest = i; }
  });
  setActiveJump(closest);
}

// Mobile: IntersectionObserver for jump nav
const mobileObs = new IntersectionObserver((entries) => {
  if (!isMobile()) return;
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const i = eras.indexOf(entry.target);
      if (i !== -1) setActiveJump(i);
    }
  });
}, { threshold: 0.4 });

eras.forEach(e => mobileObs.observe(e));

// ============================================================
// AUDIO
// ============================================================
function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
}

function loadCard(card) {
  if (activeCard) activeCard.classList.remove('playing');
  activeCard = card;
  card.classList.add('playing');

  playerTitle.textContent  = card.dataset.title  || '—';
  playerArtist.textContent = card.dataset.artist || '—';

  audioEl.src = card.dataset.audio;
  audioEl.play().catch(() => {});
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    if (activeCard === card) {
      audioEl.paused ? audioEl.play() : audioEl.pause();
    } else {
      loadCard(card);
    }
  });
});

playPauseBtn.addEventListener('click', () => {
  if (!audioEl.src) return;
  audioEl.paused ? audioEl.play() : audioEl.pause();
});

skipBackBtn.addEventListener('click', () => {
  audioEl.currentTime = Math.max(0, audioEl.currentTime - 15);
});
skipFwdBtn.addEventListener('click', () => {
  audioEl.currentTime = Math.min(audioEl.duration || 0, audioEl.currentTime + 15);
});

audioEl.addEventListener('play', () => {
  iconPlay.classList.add('hidden');
  iconPause.classList.remove('hidden');
});
audioEl.addEventListener('pause', () => {
  iconPlay.classList.remove('hidden');
  iconPause.classList.add('hidden');
});
audioEl.addEventListener('ended', () => {
  iconPlay.classList.remove('hidden');
  iconPause.classList.add('hidden');
  progressFill.style.width = '0%';
  if (activeCard) activeCard.classList.remove('playing');
});
audioEl.addEventListener('loadedmetadata', () => {
  elTotal.textContent = fmt(audioEl.duration);
});
audioEl.addEventListener('timeupdate', () => {
  elCurrent.textContent = fmt(audioEl.currentTime);
  if (audioEl.duration) {
    progressFill.style.width = `${(audioEl.currentTime / audioEl.duration) * 100}%`;
  }
});

progressTrack.addEventListener('click', (e) => {
  if (!audioEl.duration) return;
  const r = progressTrack.getBoundingClientRect();
  audioEl.currentTime = ((e.clientX - r.left) / r.width) * audioEl.duration;
});

// ============================================================
// RESIZE
// ============================================================
window.addEventListener('resize', () => {
  if (isMobile()) {
    strip.style.transform = '';
    scrollX = 0; targetX = 0;
  } else {
    scrollTo(Math.min(targetX, maxScroll()));
  }
});

// init
setActiveJump(0);
