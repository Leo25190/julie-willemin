import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://julie-willemin.fr',
  integrations: [tailwind(), react(), sitemap()],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            motion: ['framer-motion'],
            icons: ['lucide-react']
          }
        }
      }
    }
  }
});
