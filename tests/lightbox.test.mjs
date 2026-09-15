/**
 * Behavior tests for src/scripts/lightbox.js, run against the small DOM
 * stub in tests/dom-stub.mjs:
 *
 *   node --test tests/
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { El, makeDocument, installGlobals } from './dom-stub.mjs';

function buildPage() {
  const body = new El('body');

  const dialog = new El('dialog', { 'data-lightbox': '' });
  dialog.open = false;
  dialog.showModal = function showModal() { this.open = true; };
  dialog['close'] = function close() { this.open = false; };
  const lbImg = new El('img', { 'data-lb-img': '' });
  const caption = new El('p', { 'data-lb-caption': '' });
  const counter = new El('span', { 'data-lb-counter': '' });
  const prev = new El('button', { 'data-lb-prev': '', 'data-lb-control': '' });
  const next = new El('button', { 'data-lb-next': '', 'data-lb-control': '' });
  const closeBtn = new El('button', { 'data-lb-close': '', 'data-lb-control': '' });
  dialog.append(lbImg, caption, counter, prev, next, closeBtn);

  const grid = new El('section', { 'data-zoom-group': '' });
  const thumbs = ['a', 'b', 'c'].map((name, i) => {
    const frame = new El('figure', { 'data-zoom-frame': '' });
    const img = new El('img', { 'data-zoomable': '', src: `/${name}.webp`, alt: `photo ${name}` });
    img.src = `/${name}.webp`;
    img.alt = `photo ${name}`;
    img.naturalWidth = 2000;
    img.naturalHeight = 1000;
    img.rect = { left: 10, top: 100 + i * 200, width: 300, height: 150, bottom: 250 + i * 200, right: 310 };
    frame.rect = img.rect;
    frame.append(img);
    grid.append(frame);
    return img;
  });

  // A markdown-style image that only opts in through the container.
  const prose = new El('div', { class: 'prose', 'data-zoom-group': '', 'data-zoom-scan': '' });
  const proseImg = new El('img', { src: '/p.webp', alt: 'prose shot' });
  proseImg.src = '/p.webp';
  proseImg.alt = 'prose shot';
  proseImg.naturalWidth = 1000;
  proseImg.naturalHeight = 800;
  prose.append(new El('p').append(proseImg));

  body.append(dialog, grid, prose);
  return { body, dialog, lbImg, caption, counter, prev, next, closeBtn, thumbs, proseImg };
}

async function load(options) {
  const page = buildPage();
  const doc = makeDocument(page.body);
  installGlobals(doc, options);
  // Fresh module instance per test.
  await import(`../src/scripts/lightbox.js?t=${Math.random()}`);
  return { ...page, doc };
}

test('scans [data-zoom-scan] containers and marks images zoomable', async () => {
  const page = await load();
  assert.equal(page.proseImg.getAttribute('data-zoomable'), '');
  assert.equal(page.thumbs[0].getAttribute('role'), 'button');
  assert.equal(page.thumbs[0].getAttribute('tabindex'), '0');
  assert.ok(page.doc.documentElement.classList.contains('lb-ready'));
});

test('clicking a thumbnail opens the dialog with that image', async () => {
  const page = await load();
  page.thumbs[1].fire('click');
  assert.equal(page.dialog.open, true);
  assert.equal(page.lbImg.src, '/b.webp');
  assert.equal(page.lbImg.alt, 'photo b');
  assert.equal(page.caption.textContent, 'photo b');
  assert.equal(page.counter.textContent, '2 / 3');
  assert.equal(page.thumbs[1].style.visibility, 'hidden');
  assert.equal(page.closeBtn.focused, true);
});

test('the opened image is sized and centered inside the viewport', async () => {
  const page = await load();
  page.thumbs[0].fire('click');
  // 2000x1000 source, 1280x900 viewport, 0.86/0.8 caps => 1100.8 x 550.4
  assert.equal(page.lbImg.style.width, '1100.8px');
  assert.equal(page.lbImg.style.height, '550.4px');
  assert.equal(page.lbImg.style.left, '89.60000000000002px');
});

test('arrow keys step through the group and wrap around', async () => {
  const page = await load();
  page.thumbs[2].fire('click');
  page.doc.fire('keydown', { key: 'ArrowRight' });
  assert.equal(page.lbImg.src, '/a.webp', 'wraps past the end');
  assert.equal(page.thumbs[2].style.visibility, '', 'previous thumbnail is restored');
  page.doc.fire('keydown', { key: 'ArrowLeft' });
  assert.equal(page.lbImg.src, '/c.webp');
});

test('a group is scoped to its own [data-zoom-group]', async () => {
  const page = await load();
  page.proseImg.fire('click');
  assert.equal(page.counter.textContent, '', 'a lone image gets no counter');
  assert.equal(page.prev.hidden, true);
  assert.equal(page.next.hidden, true);
});

test('Esc closes, restores the thumbnail and returns focus', async () => {
  const page = await load();
  page.thumbs[0].fire('click');
  const cancel = page.dialog.fire('cancel');
  assert.equal(cancel.defaultPrevented, true, 'native close is intercepted so it can animate');
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(page.dialog.open, false);
  assert.equal(page.thumbs[0].style.visibility, '');
  assert.equal(page.thumbs[0].focused, true);
});

test('clicking a control does not close, clicking elsewhere does', async () => {
  const page = await load();
  page.thumbs[0].fire('click');
  page.next.fire('click');
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(page.dialog.open, true, 'next button must not close the viewer');
  assert.equal(page.lbImg.src, '/b.webp');
  page.dialog.fire('click');
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(page.dialog.open, false);
});

test('reduced motion opens and closes without running animations', async () => {
  const page = await load({ reducedMotion: true });
  page.thumbs[0].fire('click');
  assert.equal(page.dialog.open, true);
  assert.equal(page.lbImg.lastAnimation, undefined, 'no flight animation');
  page.closeBtn.fire('click');
  assert.equal(page.dialog.open, false, 'closes immediately');
  assert.equal(page.thumbs[0].style.visibility, '');
});

test('still opens when the Web Animations API is missing', async () => {
  delete El.prototype.animate;
  delete El.prototype.getAnimations;
  const page = await load({ animate: false });
  page.thumbs[0].fire('click');
  assert.equal(page.dialog.open, true);
  page.closeBtn.fire('click');
  assert.equal(page.dialog.open, false);
});

test('does nothing at all when <dialog> is unsupported', async () => {
  const page = buildPage();
  page.dialog.showModal = undefined;
  const doc = makeDocument(page.body);
  installGlobals(doc);
  await import(`../src/scripts/lightbox.js?t=${Math.random()}`);
  page.thumbs[0].fire('click');
  assert.equal(page.dialog.open, false);
  assert.equal(doc.documentElement.classList.contains('lb-ready'), false, 'no zoom cursor is promised');
});
