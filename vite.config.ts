import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// Relative assets work at both / and /repository/ on GitHub Pages.
export default defineConfig({ plugins: [react(), tailwindcss()], base: './' });
