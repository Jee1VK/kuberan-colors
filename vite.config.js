import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Essential for GitHub Pages hosting (e.g. username.github.io/color-iq-game/)
  base: './',
});
