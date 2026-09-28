# Julian Liao — Portfolio

Personal UX portfolio, rebuilt from the original Squarespace site
(julianliao.net) as a static [Astro](https://astro.build) site with the same
content, a new layout, and version control on GitHub instead of a page
builder.

## Structure

- `src/content/projects/*.md` — one markdown file per project. The frontmatter
  (title, order, tile image, summary, role, tools) feeds the Home grid and the
  prev/next order. Guide, Michigan ChatGPT, SureCall, connexU and E-LINK each
  have their own hand-built page in `src/pages/work/`; the others render
  through `src/pages/work/[slug].astro`.
- `src/pages/` — Home, About, Photos, Travel, plus `work/` for the case-study
  pages and the one-off Consulting Work page.
- `src/components/` — the shared Nav, Footer and Lightbox.
- `src/layouts/` — `BaseLayout` (nav + footer, used everywhere) and
  `ProjectLayout` (case-study header/metadata/prev-next, used by every
  project page).
- `src/styles/global.css` — design tokens (color, type scale, spacing) and
  the shared primitives (`.wrap`, `.eyebrow`, `.btn`, scroll-reveal). Edit
  `--accent` etc. here to reskin the whole site.
- `src/scripts/` — the two client scripts, both dependency-free vanilla JS:
  `site.js` (scroll reveal, sticky-nav behavior, reading progress,
  parallax) and `lightbox.js` (click-to-expand image viewer).
- `tests/` — Node test-runner tests for those two scripts, against a small
  hand-rolled DOM stub. Run with `npm test`.
- `public/images/` — every image and video the site uses, organized by
  page/project (`home/`, `about/`, `guide/`, `michigan-chatgpt/`, `surecall/`,
  `connexu/`, `elink/`, `photos/`, `photo-carousel/`, and so on). Raw source
  files (screenshots, screen recordings, original photos) are not kept in the
  repo.
- `public/files/` — the two consulting-work PDFs.

## Running locally

```
npm install
npm run dev
npm test      # client-script tests
```

## Design and interaction notes

- The site is a single dark theme (no light mode) — `--bg` through
  `--line` in `global.css` define it.
- **Click an image to expand it.** Photos, the About collages and every
  case-study image open in a modal `<dialog>`. The expand is a FLIP
  animation via `element.animate()`, so the thumbnail appears to grow
  into place. Arrow keys and swipes move through the set; Esc, the close
  button or a click outside collapses it back to the thumbnail. Browsers
  without `<dialog>` or the Web Animations API just show the images
  inline, which is why nothing depends on the lightbox to read the page.
- **Scrolling** fades and lifts blocks in via `IntersectionObserver`,
  drives a reading-progress bar in the header, hides the header on the
  way down and returns it on the way up, and floats the hero portrait on
  a small parallax offset.
- `prefers-reduced-motion: reduce` turns all of that off: reveals show
  immediately, parallax is skipped, and the lightbox opens and closes
  without a flight animation.
- Scroll-reveal styles only apply under `html.js` (set by an inline head
  script), so with JavaScript disabled the page is fully visible.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages automatically. The first time, turn on
Pages for this repo: **Settings → Pages → Source → GitHub Actions**.

Live at: https://julianliao-tech.github.io/julian-portfolio/

### Moving to a custom domain later

Right now `astro.config.mjs` sets `base: '/julian-portfolio'` because the
site is served from a project-page path. If you point a custom domain (e.g.
`julianliao.net`) at this repo instead:

1. Add a `public/CNAME` file containing just the domain, e.g. `julianliao.net`.
2. In `astro.config.mjs`, change `site` to `https://julianliao.net` and
   **delete** the `base` line entirely.
3. Find-and-replace the `/julian-portfolio/images/...` and
   `/julian-portfolio/files/...` prefixes in `src/content/projects/*.md`
   down to `/images/...` and `/files/...` (the rest of the site reads the
   base from `import.meta.env.BASE_URL` automatically, so only the
   hardcoded markdown image paths need this).
4. Update the domain's DNS to point at GitHub Pages, and update the
   `site`/CNAME in GitHub's repo settings.

## Content notes

- Content was migrated from the live Squarespace site on 2026-09-14,
  verified against the page's raw HTML (not just a visual read) for
  accuracy.
- One sentence on the SureCall page was rewritten during migration — the
  original had a copy-paste error referencing an unrelated project. See the
  HTML comment in `src/content/projects/surecall.md` for what changed.
- No image on the original site had alt text; alt text here was written
  fresh by viewing each image directly.
