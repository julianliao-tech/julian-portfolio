/**
 * Behavior tests for src/scripts/site.js (scroll reveal, sticky nav,
 * reading progress, parallax).
 *
 *   npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { El, makeDocument, installGlobals } from './dom-stub.mjs';

function buildPage() {
  const body = new El('body');

  const nav = new El('header', { 'data-nav': '' });
  const progress = new El('div', { 'data-progress': '' });
  nav.append(progress);

  const hero = new El('div', { 'data-parallax': '0.1' });
  hero.rect = { left: 0, top: 0, width: 1280, height: 400, bottom: 400, right: 1280 };

  const revealed = new El('section', { 'data-reveal': '', 'data-reveal-delay': '90' });
  const prose = new El('div', { class: 'prose' });
  const para = new El('p');
  const figure = new El('figure');
  prose.append(para, figure);

  body.append(nav, hero, revealed, prose);
  return { body, nav, progress, hero, revealed, para, figure };
}

function installObserver({ available = true } = {}) {
  const observed = [];
  if (!available) {
    delete globalThis.IntersectionObserver;
    return observed;
  }
  globalThis.IntersectionObserver = class {
    constructor(cb) {
      this.cb = cb;
      observed.push(this);
      this.targets = [];
      this.unobserved = [];
    }
    observe(el) { this.targets.push(el); }
    unobserve(el) { this.unobserved.push(el); }
    intersect(els) {
      this.cb(els.map((target) => ({ target, isIntersecting: true })));
    }
  };
  globalThis.window.IntersectionObserver = globalThis.IntersectionObserver;
  return observed;
}

async function load(options = {}, observerOptions = {}) {
  const page = buildPage();
  const doc = makeDocument(page.body);
  doc.documentElement.scrollHeight = 3000;
  const win = installGlobals(doc, options);
  const observers = installObserver(observerOptions);
  await import(`../src/scripts/site.js?t=${Math.random()}`);
  return { ...page, doc, win, observers };
}

test('sets the js flag so the reveal styles can apply', async () => {
  const page = await load();
  assert.ok(page.doc.documentElement.classList.contains('js'));
});

test('observes both attribute-marked and markdown prose blocks', async () => {
  const page = await load();
  const io = page.observers[0];
  const tags = io.targets.map((t) => t.tagName);
  assert.deepEqual(tags.sort(), ['FIGURE', 'P', 'SECTION']);
});

test('reveals an element when it intersects, then stops watching it', async () => {
  const page = await load();
  const io = page.observers[0];
  assert.equal(page.revealed.classList.contains('is-in'), false);
  io.intersect([page.revealed]);
  assert.equal(page.revealed.classList.contains('is-in'), true);
  assert.deepEqual(io.unobserved, [page.revealed]);
  assert.equal(page.revealed.style.getPropertyValue('--reveal-delay'), '90ms');
});

test('without IntersectionObserver everything is shown immediately', async () => {
  const page = await load({}, { available: false });
  assert.equal(page.revealed.classList.contains('is-in'), true);
  assert.equal(page.para.classList.contains('is-in'), true);
});

test('reduced motion shows everything and skips parallax', async () => {
  const page = await load({ reducedMotion: true });
  assert.equal(page.revealed.classList.contains('is-in'), true);
  page.win.scrollY = 500;
  page.win.fire('scroll');
  assert.equal(page.hero.style.transform, undefined, 'no parallax transform');
});

test('nav hides on the way down and comes back on the way up', async () => {
  const page = await load();
  assert.equal(page.nav.classList.contains('is-stuck'), false);

  page.win.scrollY = 600;
  page.win.fire('scroll');
  assert.equal(page.nav.classList.contains('is-stuck'), true);
  assert.equal(page.nav.classList.contains('is-hidden'), true);

  page.win.scrollY = 400;
  page.win.fire('scroll');
  assert.equal(page.nav.classList.contains('is-hidden'), false);

  page.win.scrollY = 0;
  page.win.fire('scroll');
  assert.equal(page.nav.classList.contains('is-stuck'), false);
});

test('nav stays put for small scrolls near the top', async () => {
  const page = await load();
  page.win.scrollY = 150;
  page.win.fire('scroll');
  assert.equal(page.nav.classList.contains('is-hidden'), false);
});

test('reading progress tracks scroll position', async () => {
  const page = await load();
  // scrollHeight 3000 - viewport 900 = 2100 of travel
  page.win.scrollY = 1050;
  page.win.fire('scroll');
  assert.equal(page.progress.style.transform, 'scaleX(0.5)');
  page.win.scrollY = 5000;
  page.win.fire('scroll');
  assert.equal(page.progress.style.transform, 'scaleX(1)', 'clamped at the end');
});

test('parallax moves the marked element against the scroll', async () => {
  const page = await load();
  page.hero.rect = { left: 0, top: -200, width: 1280, height: 400, bottom: 200, right: 1280 };
  page.win.scrollY = 300;
  page.win.fire('scroll');
  // centre is 450px above the viewport centre, speed 0.1 => +45px
  assert.equal(page.hero.style.transform, 'translate3d(0, 45.00px, 0)');
});

/* Opening animation --------------------------------------------------- */

function buildIntroPage() {
  const body = new El('body');
  const loader = new El('div', { 'data-intro-loader': '' });
  const col = new El('div', { class: 'intro-col' });
  const track = new El('div', { class: 'intro-track' });
  col.append(track);
  loader.append(col);
  body.append(loader);
  return { body, loader, col, track };
}

async function loadIntro(options = {}) {
  const page = buildIntroPage();
  const doc = makeDocument(page.body);
  const win = installGlobals(doc, options);
  await import(`../src/scripts/site.js?t=${Math.random()}`);
  return { ...page, doc, win };
}

test('intro loader ignores a bubbled animationend from a child track', async () => {
  const page = await loadIntro();
  assert.ok(page.doc.documentElement.classList.contains('intro-lock'));

  // A column's own scroll animation (see .intro-track in index.astro)
  // finishes independently of, and often before, the loader's own
  // fade — this bubbles up through .intro-col to the loader and used
  // to be mistaken for the loader's fade completing.
  page.track.fire('animationend', { animationName: 'intro-scroll-up' });

  assert.ok(page.doc.documentElement.classList.contains('intro-lock'), 'still locked');
  assert.equal(page.doc.documentElement.classList.contains('intro-done'), false);
  assert.equal(page.loader.parentNode, page.body, 'loader not torn down yet');
});

test('intro loader clears once its own fade animation actually ends', async () => {
  const page = await loadIntro();
  page.track.fire('animationend', { animationName: 'intro-scroll-up' }); // ignored
  page.loader.fire('animationend', { animationName: 'intro-loader-out' });

  assert.equal(page.doc.documentElement.classList.contains('intro-lock'), false);
  assert.ok(page.doc.documentElement.classList.contains('intro-done'));
  assert.equal(page.loader.parentNode, null, 'loader removed from the DOM');
});

test('intro loader is skipped under reduced motion, but intro-done still gets set', async () => {
  const page = await loadIntro({ reducedMotion: true });
  assert.equal(page.doc.documentElement.classList.contains('intro-lock'), false);
  assert.ok(page.doc.documentElement.classList.contains('intro-done'));
  assert.equal(page.loader.parentNode, null);
});
