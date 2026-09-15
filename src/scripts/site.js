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

/* Boot -------------------------------------------------------------- */

function boot() {
  document.documentElement.classList.add('js');
  initReveal();
  initScrollChrome();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
