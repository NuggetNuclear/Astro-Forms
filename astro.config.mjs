// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://lookuman.cl',

  // Las tipografías se descargan en el build y se sirven desde el propio
  // dominio: sin petición bloqueante a Google, sin salto de fuente y con
  // métricas de respaldo generadas automáticamente.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Anton',
      cssVariable: '--fuente-display',
      weights: [400],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Arial Narrow', 'Helvetica Neue', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--fuente-sans',
      weights: [400, 500, 600, 700, 800],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
