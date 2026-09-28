import { defineConfig } from 'astro/config';

// Custom-domain config. Previously a GitHub Pages project-site path
// (base: '/julian-portfolio/'); now served at the domain's root via
// public/CNAME. See README.md.
export default defineConfig({
  site: 'https://julianliao.net',
});
