/* ------------------------------------------------------------------
   Interface sound: hover boops, press clicks, and a sweep on the
   lightbox. Everything here is synthesized with the Web Audio API —
   there are no audio files to download, and nothing is created until
   the visitor actually turns sound on.

   Default is OFF, deliberately. Sound that starts on its own is the
   fastest way to get a portfolio closed in an open-plan office, and
   browsers block it before a gesture anyway. The toggle in the nav is
   the invitation; the choice is remembered in localStorage.

   To ship it on by default instead, flip DEFAULT_ON below — the stored
   preference still wins once someone has made a choice.
   ------------------------------------------------------------------ */

const DEFAULT_ON = false;
const STORE_KEY = 'sfx';

let ctx = null;
let master = null;
let enabled = false;
let lastHoverAt = 0;

/* Preference ------------------------------------------------------- */

function readPref() {
  try {
    const v = localStorage.getItem(STORE_KEY);
    if (v === 'on') return true;
    if (v === 'off') return false;
  } catch {
    /* private mode, blocked storage — fall through to the default */
  }
  return DEFAULT_ON;
}

function writePref(on) {
  try {
    localStorage.setItem(STORE_KEY, on ? 'on' : 'off');
  } catch {
    /* preference just won't survive the page, which is fine */
  }
}

/* Audio graph ------------------------------------------------------ */

// Built lazily, and only from inside a user gesture, so the context is
// never created in the suspended state browsers hand back on load.
function audio() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);
  return ctx;
}

function env(node, peak, attack, decay) {
  const t = ctx.currentTime;
  node.gain.cancelScheduledValues(t);
  node.gain.setValueAtTime(0.0001, t);
  node.gain.exponentialRampToValueAtTime(peak, t + attack);
  node.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function tone({ from, to = from, type = 'sine', peak = 0.05, attack = 0.006, decay = 0.09 }) {
  if (!enabled || !audio()) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, ctx.currentTime);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + attack + decay);
  env(gain, peak, attack, decay);
  osc.connect(gain).connect(master);
  osc.start();
  osc.stop(ctx.currentTime + attack + decay + 0.02);
}

// Filtered white noise, swept — the "whoosh" under a panel opening.
function sweep({ from = 400, to = 2600, peak = 0.035, dur = 0.34 } = {}) {
  if (!enabled || !audio()) return;
  const frames = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.1;
  filter.frequency.setValueAtTime(from, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + dur);

  const gain = ctx.createGain();
  env(gain, peak, 0.05, dur - 0.05);

  src.connect(filter).connect(gain).connect(master);
  src.start();
  src.stop(ctx.currentTime + dur + 0.02);
}

/* The kit ---------------------------------------------------------- */

export const sfx = {
  // Hover: a short, slightly detuned blip. Rate-limited, because a grid
  // of tiles under a moving cursor will otherwise fire a dozen a second.
  boop() {
    const now = performance.now();
    if (now - lastHoverAt < 90) return;
    lastHoverAt = now;
    const base = 520 + Math.random() * 90;
    tone({ from: base, to: base * 1.22, type: 'triangle', peak: 0.045, decay: 0.07 });
  },
  // Press: two quick tones, the second a fifth up, so it reads as
  // confirmation rather than as another hover.
  click() {
    tone({ from: 440, type: 'square', peak: 0.03, decay: 0.045 });
    window.setTimeout(() => tone({ from: 660, type: 'square', peak: 0.025, decay: 0.07 }), 45);
  },
  sweep,
  get enabled() {
    return enabled;
  },
};

/* Wiring ----------------------------------------------------------- */

const HOVER_SELECTOR = '[data-sfx-hover], .card-media, .up-next-row, .consulting-item, .navlink, .icon, .btn-outline';
const PRESS_SELECTOR = 'a[href], button, [data-zoomable], [data-sfx-press]';

function paint(btn) {
  btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  btn.dataset.on = enabled ? 'true' : 'false';
  btn.setAttribute('aria-label', enabled ? 'Turn interface sound off' : 'Turn interface sound on');
}

function initSfx() {
  enabled = readPref();

  const toggles = Array.from(document.querySelectorAll('[data-sfx-toggle]'));
  toggles.forEach(paint);

  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      enabled = !enabled;
      writePref(enabled);
      toggles.forEach(paint);
      // The click itself is the gesture that unlocks audio, so the
      // confirmation tone doubles as proof it works.
      if (enabled) {
        audio();
        if (ctx && ctx.state === 'suspended') ctx.resume();
        sfx.click();
      }
    });
  });

  // Delegated, so anything added to the page later is covered too.
  document.addEventListener(
    'pointerover',
    (e) => {
      if (!enabled || e.pointerType !== 'mouse') return;
      const t = e.target instanceof Element ? e.target.closest(HOVER_SELECTOR) : null;
      if (!t || t.hasAttribute('data-sfx-toggle')) return;
      // Ignore moves between children of the same element.
      if (e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) return;
      sfx.boop();
    },
    { passive: true }
  );

  document.addEventListener(
    'pointerdown',
    (e) => {
      if (!enabled) return;
      const t = e.target instanceof Element ? e.target.closest(PRESS_SELECTOR) : null;
      if (!t || t.hasAttribute('data-sfx-toggle')) return;
      sfx.click();
    },
    { passive: true }
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSfx, { once: true });
} else {
  initSfx();
}

// The lightbox opens and closes a full-screen panel, which is the one
// place a sweep reads as motion rather than as noise.
window.addEventListener('lightbox:open', () => sweep({ from: 300, to: 2400 }));
window.addEventListener('lightbox:close', () => sweep({ from: 2400, to: 300, dur: 0.26 }));
