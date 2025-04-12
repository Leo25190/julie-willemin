import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://leo25190.github.io',
  base: 'julie-willemin',
  integrations: [tailwind(), react(), sitemap()],
});
