# Julian Liao — Portfolio

Personal UX portfolio, rebuilt from the original Squarespace site
(julianliao.net) as a static [Astro](https://astro.build) site with the same
content, a new layout, and version control on GitHub instead of a page
builder.

## Structure

- `src/content/projects/*.md` — the five main case studies (Guide, Michigan
  ChatGPT, SureCall, Timecapsule Tunes, Dominos). Each is one markdown file:
  frontmatter for the metadata block (role, timeline, tools, etc.), body
  copy for the case study itself. **To add a new project**, drop in a new
  `.md` file here with an `order` after the existing ones — no code changes
  needed, it shows up on the Home grid and in the prev/next chain
  automatically.
- `src/pages/` — Home, About, Photos, and the one-off Consulting Work page
  (it doesn't follow the case-study template, so it isn't in the
  collection).
- `src/layouts/` — `BaseLayout` (nav + footer, used everywhere) and
  `ProjectLayout` (case-study header/metadata/prev-next, used by every
  project page).
- `src/styles/global.css` — design tokens (color, type scale, spacing). Edit
  `--accent` etc. here to reskin the whole site.
- `public/images/` — every image from the original site, downloaded and
  organized by page/project.
- `public/files/` — the two consulting-work PDFs.

## Running locally

```
npm install
npm run dev
```

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
