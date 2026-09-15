/* ------------------------------------------------------------------
   Shared-element image lightbox.

   Clicking any [data-zoomable] image expands it into a modal <dialog>.
   The expand/collapse is a FLIP animation (First-Last-Invert-Play) run
   through the Web Animations API: the opened image starts exactly on
   top of the thumbnail and animates to its full size, which reads like
   the thumbnail itself grew.

   Why FLIP rather than the View Transitions API: FLIP works in every
   browser that supports element.animate() (Chrome, Safari 13.1+,
   Firefox), needs no per-element view-transition-name bookkeeping for
   the dozens of images on a case-study page, and behaves identically
   everywhere. Where element.animate() or <dialog> is missing, the
   lightbox degrades to an instant open (or, with no <dialog> at all,
   the page simply stays as-is with images inline).
   ------------------------------------------------------------------ */

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReduced = () => motionQuery.matches;

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const OPEN_MS = 440;
const CLOSE_MS = 320;

function init() {
  const dialog = document.querySelector('[data-lightbox]');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const img = dialog.querySelector('[data-lb-img]');
  const caption = dialog.querySelector('[data-lb-caption]');
  const counter = dialog.querySelector('[data-lb-counter]');
  const btnPrev = dialog.querySelector('[data-lb-prev]');
  const btnNext = dialog.querySelector('[data-lb-next]');
  const btnClose = dialog.querySelector('[data-lb-close]');
  if (!img) return;

  // Markdown-rendered images (case studies) can't carry the attribute in
  // source, so opt whole containers in with [data-zoom-scan].
  document.querySelectorAll('[data-zoom-scan] img').forEach((el) => {
    el.setAttribute('data-zoomable', '');
  });

  const zoomables = Array.from(document.querySelectorAll('[data-zoomable]'));
  if (!zoomables.length) return;

  // Make each thumbnail behave like a button for keyboard and AT users.
  zoomables.forEach((el) => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-haspopup', 'dialog');
  });

  document.documentElement.classList.add('lb-ready');

  let group = [];
  let index = 0;
  let isOpen = false;
  let closing = false;
  let scrollLock = 0;

  const groupFor = (el) => {
    const scope = el.closest('[data-zoom-group]') || document;
    return Array.from(scope.querySelectorAll('[data-zoomable]'));
  };

  /* Geometry ------------------------------------------------------- */

  // Where the full-size image should land: centered, contained inside
  // the viewport, computed from the thumbnail's intrinsic ratio so we
  // never have to wait for a load event.
  const targetRect = (source) => {
    const nw = source.naturalWidth || source.offsetWidth || 1;
    const nh = source.naturalHeight || source.offsetHeight || 1;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxW = vw * (vw < 700 ? 0.92 : 0.86);
    const maxH = vh * (vw < 700 ? 0.74 : 0.8);
    const scale = Math.min(maxW / nw, maxH / nh);
    const w = Math.max(1, nw * scale);
    const h = Math.max(1, nh * scale);
    return {
      width: w,
      height: h,
      left: (vw - w) / 2,
      top: (vh - h) / 2 - (vw < 700 ? 10 : 14),
    };
  };

  const place = (source) => {
    const t = targetRect(source);
    img.style.left = `${t.left}px`;
    img.style.top = `${t.top}px`;
    img.style.width = `${t.width}px`;
    img.style.height = `${t.height}px`;
    return t;
  };

  const paint = (source) => {
    img.src = source.currentSrc || source.src;
    img.alt = source.alt || '';
    if (caption) caption.textContent = source.alt || '';
    if (counter) {
      counter.textContent = group.length > 1 ? `${index + 1} / ${group.length}` : '';
    }
    const many = group.length > 1;
    if (btnPrev) btnPrev.hidden = !many;
    if (btnNext) btnNext.hidden = !many;
    return place(source);
  };

  const clearAnimations = () => {
    if (typeof img.getAnimations !== 'function') return;
    img.getAnimations().forEach((a) => a.cancel());
  };

  // Prefer the clipping frame's box when there is one: it is what the
  // user actually sees, and it survives the thumbnail's hover scale.
  const measureOf = (source) => source.closest('[data-zoom-frame]') || source;

  // Measured eagerly by the caller, because locking page scroll can move
  // the thumbnail before the animation is set up.
  const metrics = (source) => {
    const measure = measureOf(source);
    return {
      rect: measure.getBoundingClientRect(),
      radiusPx: parseFloat(window.getComputedStyle(measure).borderRadius) || 0,
    };
  };

  const flip = (from, target, direction) => {
    clearAnimations();
    if (prefersReduced() || typeof img.animate !== 'function') return null;
    if (!from || !from.rect.width || !from.rect.height) return null;
    const scale = from.rect.width / target.width;
    // Divide by the scale so the corner radius *looks* identical to the
    // thumbnail's at the start of the flight.
    const radiusPx = from.radiusPx;
    const inverted = {
      transform: `translate3d(${from.rect.left - target.left}px, ${from.rect.top - target.top}px, 0) scale(${scale})`,
      borderRadius: `${scale > 0 ? radiusPx / scale : radiusPx}px`,
      opacity: 0.85,
    };
    const natural = { transform: 'translate3d(0,0,0) scale(1)', borderRadius: '6px', opacity: 1 };
    const frames = direction === 'in' ? [inverted, natural] : [natural, inverted];
    return img.animate(frames, {
      duration: direction === 'in' ? OPEN_MS : CLOSE_MS,
      easing: EASE,
      fill: 'both',
    });
  };

  const lockScroll = () => {
    scrollLock = window.scrollY;
    document.documentElement.style.overflow = 'hidden';
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = '';
    window.scrollTo(0, scrollLock);
  };

  /* Open / close --------------------------------------------------- */

  const open = (source) => {
    if (isOpen) return;
    group = groupFor(source);
    index = Math.max(0, group.indexOf(source));
    isOpen = true;

    // Measure before anything can move the page.
    const from = metrics(source);

    lockScroll();
    dialog.showModal();
    const target = paint(source);
    source.style.visibility = 'hidden';
    flip(from, target, 'in');
    if (btnClose) btnClose.focus({ preventScroll: true });
  };

  const close = () => {
    if (!isOpen || closing) return;
    closing = true;
    const source = group[index];

    const finish = () => {
      dialog.close();
      dialog.classList.remove('is-closing');
      isOpen = false;
      closing = false;
      group.forEach((el) => { el.style.visibility = ''; });
      if (source && typeof source.focus === 'function') {
        source.focus({ preventScroll: true });
      }
    };

    // Give the page its scroll back first, then fly home to wherever the
    // thumbnail actually is now (prev/next may have moved us along).
    unlockScroll();
    if (!source) return finish();

    const rect = source.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      source.scrollIntoView({ block: 'center', behavior: 'auto' });
    }

    const target = place(source);
    const anim = flip(metrics(source), target, 'out');
    if (!anim) return finish();
    dialog.classList.add('is-closing');
    anim.finished.then(finish).catch(finish);
  };

  /* Prev / next ---------------------------------------------------- */

  const step = (delta) => {
    if (!isOpen || closing || group.length < 2) return;
    const previous = group[index];
    if (previous) previous.style.visibility = '';
    index = (index + delta + group.length) % group.length;
    const source = group[index];
    source.style.visibility = 'hidden';
    paint(source);
    clearAnimations();
    if (prefersReduced() || typeof img.animate !== 'function') return;
    img.animate(
      [
        { opacity: 0, transform: `translate3d(${delta * 36}px, 0, 0)` },
        { opacity: 1, transform: 'translate3d(0,0,0)' },
      ],
      { duration: 320, easing: EASE }
    );
  };

  /* Wiring --------------------------------------------------------- */

  const zoomableFrom = (node) =>
    node instanceof Element ? node.closest('[data-zoomable]') : null;

  document.addEventListener('click', (event) => {
    const source = zoomableFrom(event.target);
    if (!source) return;
    event.preventDefault();
    open(source);
  });

  document.addEventListener('keydown', (event) => {
    if (isOpen) {
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
      return;
    }
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const source = zoomableFrom(event.target);
    if (!source) return;
    event.preventDefault();
    open(source);
  });

  if (btnPrev) btnPrev.addEventListener('click', () => step(-1));
  if (btnNext) btnNext.addEventListener('click', () => step(1));
  if (btnClose) btnClose.addEventListener('click', close);

  // Click anywhere that is not a control closes (including the image,
  // which shows a zoom-out cursor).
  dialog.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('[data-lb-control]')) return;
    close();
  });

  // Esc: run the collapse animation instead of a hard close.
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });

  window.addEventListener('resize', () => {
    if (isOpen && group[index]) place(group[index]);
  });

  // Swipe between images on touch devices.
  let touchX = null;
  dialog.addEventListener('touchstart', (event) => {
    touchX = event.changedTouches[0].clientX;
  }, { passive: true });
  dialog.addEventListener('touchend', (event) => {
    if (touchX === null) return;
    const dx = event.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
  }, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
