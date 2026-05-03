// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: 'https://willowhome.example',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [vue()],
});
