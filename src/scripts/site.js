/* ------------------------------------------------------------------
   Scroll behavior: reveal-on-scroll, sticky nav states, reading
   progress, and light parallax. No dependencies.
   Every motion path is skipped when the user asks for reduced motion.
   ------------------------------------------------------------------ */

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReduced = () => motionQuery.matches;

/* Reveal ----------------------------------------------------------- */

// Case-study prose comes from markdown, so its blocks are matched by
// position rather than by a data attribute. Keep this list in sync with
// the matching rule in global.css.
const REVEAL_SELECTOR =
  '[data-reveal], .prose > p, .prose > h2, .prose > h3, .prose > h4, .prose > ul, .prose > ol, .prose > blockquote, .prose > figure';

function initReveal() {
  const els = Array.from(document.querySelectorAll(REVEAL_SELECTOR));
  if (!els.length) return;

  // No IntersectionObserver, or reduced motion: show everything at once.
  if (!('IntersectionObserver' in window) || prefersReduced()) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.06 }
  );

  els.forEach((el) => {
    if (el.dataset.revealDelay) {
      el.style.setProperty('--reveal-delay', `${el.dataset.revealDelay}ms`);
    }
    io.observe(el);
  });

  // Safety net: if anything is still hidden well after load (an observer
  // that never fires, a hidden ancestor, etc.) reveal it rather than
  // leaving content invisible.
  window.setTimeout(() => {
    els.forEach((el) => el.classList.add('is-in'));
  }, 6000);
}

/* Nav + progress + parallax on one rAF-throttled scroll loop --------- */

function initScrollChrome() {
  const nav = document.querySelector('[data-nav]');
  const progress = document.querySelector('[data-progress]');
  const parallaxEls = prefersReduced()
    ? []
    : Array.from(document.querySelectorAll('[data-parallax]'));

  if (!nav && !progress && !parallaxEls.length) return;

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    if (nav) {
      nav.classList.toggle('is-stuck', y > 12);
      const focusInsideNav = nav.contains(document.activeElement);
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (goingDown && y > 180 && !focusInsideNav) nav.classList.add('is-hidden');
      else if (goingUp || y <= 180) nav.classList.remove('is-hidden');
    }

    if (progress) {
      const max = document.documentElement.scrollHeight - vh;
      const pct = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      progress.style.transform = `scaleX(${pct})`;
    }

    for (const el of parallaxEls) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) continue;
      const speed = parseFloat(el.dataset.parallax) || 0.08;
      const fromCenter = rect.top + rect.height / 2 - vh / 2;
      const shift = Math.max(-80, Math.min(80, -fromCenter * speed));
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    }

    lastY = y;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* Count-up numbers ---------------------------------------------------
   [data-count-to="N"] elements count up from 0 to N the first time
   they scroll into view, preserving their original zero-padding
   (e.g. "06" stays 2 digits throughout). Reduced motion jumps
   straight to the final value. */

function initCountUp() {
  const els = Array.from(document.querySelectorAll('[data-count-to]'));
  if (!els.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.countTo, 10);
    if (Number.isNaN(target)) return;
    const pad = el.textContent.trim().length || String(target).length;

    if (prefersReduced()) {
      el.textContent = String(target).padStart(pad, '0');
      return;
    }

    const duration = 700;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      el.textContent = String(Math.round(eased * target)).padStart(pad, '0');
      if (t < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    els.forEach(animate);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  els.forEach((el) => io.observe(el));
}

/* Custom cursor -------------------------------------------------------
   A small dot that follows the pointer and rings outward over
   hoverable elements. Only ever created on a real mouse (hover: hover
   + pointer: fine) and never under reduced motion — html.has-cursor
   is the single switch the CSS keys off, so if this never runs (JS
   disabled, unsupported), the browser's normal cursor is untouched. */

function initCursor() {
  if (!canHover()) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);
  document.documentElement.classList.add('has-cursor');

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let raf = null;

  const paint = () => {
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    raf = null;
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!raf) raf = window.requestAnimationFrame(paint);
    },
    { passive: true }
  );

  const HOVER_TARGETS = 'a, button, [data-tilt], [data-magnetic], [data-zoomable]';

  document.addEventListener('pointerover', (event) => {
    if (event.target instanceof Element && event.target.closest(HOVER_TARGETS)) {
      dot.classList.add('is-active');
    }
  });
  document.addEventListener('pointerout', (event) => {
    if (event.target instanceof Element && event.target.closest(HOVER_TARGETS)) {
      dot.classList.remove('is-active');
    }
  });

  window.addEventListener('pointerdown', () => dot.classList.add('is-down'));
  window.addEventListener('pointerup', () => dot.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => dot.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => dot.classList.remove('is-hidden'));
}

/* Hover-to-play cover videos ------------------------------------------
   [data-hover-video] elements (muted/loop/playsinline in the markup)
   play only while a real mouse hovers their card, and pause + rewind
   on leave. Touch devices never get a hover gesture at all, so they
   simply keep showing the poster frame — no autoplay, no extra
   mobile data spent on a video nobody asked to see move.

   A card can also carry a sibling [data-idle-frame] image (see
   .card-media-idle-frame in index.astro) — a plain, already-decoded
   picture of the video's own last frame that crossfades in on top of
   it here on leave. That's what makes the "return to cover" instant:
   no re-seeking the video itself, which would mean fetching/decoding
   that point in the file again and a visible stall. */

function initHoverVideo() {
  if (!canHover()) return;
  const videos = Array.from(document.querySelectorAll('[data-hover-video]'));
  if (!videos.length) return;

  videos.forEach((video) => {
    const card = video.closest('a') || video;

    const play = () => {
      video.currentTime = 0;
      video.play().catch(() => {
        /* Autoplay can be rejected mid-gesture (e.g. a very quick
           hover in/out); nothing to recover from, just skip it. */
      });
    };
    const stop = () => {
      video.pause();
      video.currentTime = 0;
    };

    card.addEventListener('pointerenter', play);
    card.addEventListener('pointerleave', stop);
    card.addEventListener('focus', play);
    card.addEventListener('blur', stop);
  });
}

/* First-frame poster --------------------------------------------------
   [data-show-first-frame] videos skip the separate poster image and
   show the clip's own opening frame at rest instead. A muted video
   with no `autoplay` just renders blank until it plays, so this forces
   one frame to decode by playing and immediately pausing again — runs
   once metadata/frame data is available, independent of hover or
   touch, so every visitor sees a frame instead of nothing. */

function initFirstFramePoster() {
  const videos = Array.from(document.querySelectorAll('[data-show-first-frame]'));
  if (!videos.length) return;

  videos.forEach((video) => {
    const showFirstFrame = () => {
      video
        .play()
        .then(() => {
          video.pause();
          video.currentTime = 0;
        })
        .catch(() => {
          /* Browser declined the programmatic play; the video is left
             on whatever frame it has (usually black) rather than
             fighting it further. */
        });
    };

    if (video.readyState >= 2) {
      showFirstFrame();
    } else {
      video.addEventListener('loadeddata', showFirstFrame, { once: true });
    }
  });
}

/* Cursor-tracked hover: 3D tilt + magnetic pull ---------------------
   [data-tilt] elements rotate toward the cursor (card thumbnails,
   photo frames); [data-magnetic] elements nudge slightly toward it
   (buttons, icons). Both read the pointer position into CSS custom
   properties so the actual transform lives in CSS, and both are
   skipped entirely under reduced motion or on touch devices, where
   "hover" isn't a real gesture. */

function canHover() {
  return (
    !prefersReduced() &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

function trackPointer(el, onMove, onLeave) {
  let rect = null;

  el.addEventListener('pointerenter', () => {
    rect = el.getBoundingClientRect();
  });

  el.addEventListener('pointermove', (event) => {
    if (!rect) rect = el.getBoundingClientRect();
    onMove(event, rect);
  });

  el.addEventListener('pointerleave', () => {
    rect = null;
    onLeave();
  });
}

function initTilt() {
  if (!canHover()) return;
  const els = Array.from(document.querySelectorAll('[data-tilt]'));
  const max = 14; // degrees

  els.forEach((el) => {
    trackPointer(
      el,
      (event, rect) => {
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        el.style.setProperty('--tilt-x', `${((0.5 - py) * max).toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${((px - 0.5) * max).toFixed(2)}deg`);
      },
      () => {
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
      }
    );
  });
}

function initMagnetic() {
  if (!canHover()) return;
  const els = Array.from(document.querySelectorAll('[data-magnetic]'));
  const strength = 0.35;

  els.forEach((el) => {
    trackPointer(
      el,
      (event, rect) => {
        const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
        const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
        el.style.setProperty('--magnet-x', `${x.toFixed(1)}px`);
        el.style.setProperty('--magnet-y', `${y.toFixed(1)}px`);
      },
      () => {
        el.style.setProperty('--magnet-x', '0px');
        el.style.setProperty('--magnet-y', '0px');
      }
    );
  });
}

/* Opening animation --------------------------------------------------
   [data-intro-loader] (see index.astro) fades itself out on a pure-CSS
   timeline — this just locks page scroll for that stretch, tears the
   markup down once it's done, and flags html.intro-done so a couple
   of the hero's own animations (the typed code block, the lamp
   easter egg — both gated on that class in index.astro's styles)
   only start once the handoff to the actual page has happened,
   instead of running out behind the overlay. Under reduced motion,
   skip the overlay outright rather than forcing a motionless
   multi-second wait — intro-done still gets set so nothing gated on
   it is left waiting forever. */

function initIntroLoader() {
  const loader = document.querySelector('[data-intro-loader]');
  if (!loader) return;

  if (prefersReduced()) {
    document.documentElement.classList.add('intro-done');
    loader.remove();
    return;
  }

  document.documentElement.classList.add('intro-lock');

  let cleared = false;
  const clear = () => {
    if (cleared) return;
    cleared = true;
    document.documentElement.classList.remove('intro-lock');
    document.documentElement.classList.add('intro-done');
    loader.remove();
  };

  loader.addEventListener('animationend', clear, { once: true });
  // Safety net, same idea as initReveal's: if the animationend event
  // never fires for any reason, don't leave the page permanently
  // locked behind the overlay (or its gated animations waiting
  // forever). Comfortably past the CSS timeline's own 3.5s total
  // (2s hold + 1.5s fade).
  window.setTimeout(clear, 5000);
}

/* Boot -------------------------------------------------------------- */

function boot() {
  document.documentElement.classList.add('js');
  initIntroLoader();
  initReveal();
  initScrollChrome();
  initCountUp();
  initCursor();
  initTilt();
  initMagnetic();
  initHoverVideo();
  initFirstFramePoster();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
