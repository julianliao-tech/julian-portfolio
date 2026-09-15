/**
 * A very small DOM stand-in — just enough to drive the client scripts in
 * Node without pulling in jsdom. Supports the selector shapes the site
 * actually uses: tag, .class, [attr], [attr=value], and a single
 * descendant combinator.
 */

export class El {
  constructor(tagName, attrs = {}) {
    this.tagName = String(tagName).toUpperCase();
    this.attrs = { ...attrs };
    this.children = [];
    this.parentNode = null;
    this.style = {
      props: {},
      setProperty(name, value) { this.props[name] = value; },
      getPropertyValue(name) { return this.props[name] ?? ''; },
      removeProperty(name) { delete this.props[name]; },
    };
    this.listeners = new Map();
    this.rect = { left: 0, top: 0, width: 100, height: 80, bottom: 80, right: 100 };
    this.classList = {
      set: new Set((attrs.class || '').split(' ').filter(Boolean)),
      add: (...c) => c.forEach((x) => this.classList.set.add(x)),
      remove: (...c) => c.forEach((x) => this.classList.set.delete(x)),
      contains: (c) => this.classList.set.has(c),
      toggle: (c, on) => (on ? this.classList.set.add(c) : this.classList.set.delete(c)),
    };
  }

  append(...kids) {
    kids.forEach((k) => {
      k.parentNode = this;
      this.children.push(k);
    });
    return this;
  }

  setAttribute(name, value) {
    this.attrs[name] = String(value);
  }

  getAttribute(name) {
    return name in this.attrs ? this.attrs[name] : null;
  }

  get dataset() {
    const out = {};
    for (const [k, v] of Object.entries(this.attrs)) {
      if (!k.startsWith('data-')) continue;
      const key = k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      out[key] = v;
    }
    return out;
  }

  getBoundingClientRect() {
    return this.rect;
  }

  contains(node) {
    let walk = node;
    while (walk) {
      if (walk === this) return true;
      walk = walk.parentNode;
    }
    return false;
  }

  focus() {
    this.focused = true;
  }

  /* selectors ----------------------------------------------------- */

  matchesSimple(sel) {
    return sel
      .trim()
      .split(/(?=[.#[])|(?<=\])/)
      .filter(Boolean)
      .every((part) => {
        if (part.startsWith('.')) return this.classList.contains(part.slice(1));
        if (part.startsWith('[')) {
          const body = part.slice(1, -1);
          const eq = body.indexOf('=');
          if (eq === -1) return body in this.attrs;
          const name = body.slice(0, eq);
          const value = body.slice(eq + 1).replace(/^['"]|['"]$/g, '');
          return this.attrs[name] === value;
        }
        if (part === '*') return true;
        return this.tagName === part.toUpperCase();
      });
  }

  matches(selector) {
    return selector
      .split(',')
      .map((s) => s.trim())
      .some((s) => {
        const parts = s.split(/\s+/);
        if (parts.length === 1) return this.matchesSimple(parts[0]);
        // descendant: last part matches me, an ancestor matches the rest
        if (!this.matchesSimple(parts[parts.length - 1])) return false;
        let node = this.parentNode;
        while (node) {
          if (node.matchesSimple && node.matchesSimple(parts[0])) return true;
          node = node.parentNode;
        }
        return false;
      });
  }

  descendants() {
    const out = [];
    const walk = (node) => node.children.forEach((c) => { out.push(c); walk(c); });
    walk(this);
    return out;
  }

  querySelectorAll(selector) {
    return this.descendants().filter((n) => n.matches(selector));
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  closest(selector) {
    let node = this;
    while (node) {
      if (node.matches && node.matches(selector)) return node;
      node = node.parentNode;
    }
    return null;
  }

  /* events -------------------------------------------------------- */

  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(fn);
  }

  fire(type, event = {}) {
    const e = { type, target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...event };
    e.target = e.target || this;
    let node = this;
    while (node) {
      (node.listeners.get(type) || []).forEach((fn) => fn.call(node, e));
      node = node.parentNode;
    }
    return e;
  }
}

export function makeDocument(root) {
  const doc = new El('#document');
  const html = new El('html');
  doc.append(html);
  html.append(root);
  doc.documentElement = html;
  doc.readyState = 'complete';
  doc.body = root;
  doc.activeElement = null;
  return doc;
}

export function installGlobals(doc, { reducedMotion = false, animate = true } = {}) {
  const winListeners = new Map();
  const win = {
    innerWidth: 1280,
    innerHeight: 900,
    scrollY: 0,
    scrollTo(_x, y) { win.scrollY = y; },
    matchMedia: () => ({ matches: reducedMotion, addEventListener() {} }),
    getComputedStyle: () => ({ borderRadius: '16px' }),
    addEventListener(type, fn) {
      if (!winListeners.has(type)) winListeners.set(type, []);
      winListeners.get(type).push(fn);
    },
    fire(type) {
      (winListeners.get(type) || []).forEach((fn) => fn({ type }));
    },
    requestAnimationFrame: (fn) => fn(),
    setTimeout: (fn, ms) => setTimeout(fn, ms),
  };
  globalThis.window = win;
  globalThis.document = doc;
  globalThis.Element = El;
  if (animate) {
    El.prototype.animate = function animateStub(frames, options) {
      this.lastAnimation = { frames, options };
      const anim = { cancel() {}, finished: Promise.resolve() };
      this.runningAnimations = (this.runningAnimations || []).concat(anim);
      return anim;
    };
    El.prototype.getAnimations = function getAnimations() {
      return this.runningAnimations || [];
    };
  }
  return win;
}
