import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this repo at /jmc-network-website/. Keep this in
  // sync with the repo name and the deploy workflow.
  base: "/jmc-network-website/",
  plugins: [react(), tailwindcss()],
})
