import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this repo under /jmc-network-website/. The base can
  // be overridden per build with SITE_BASE — the PR-preview workflow sets it
  // to /jmc-network-website/preview/pr-{N}/ so each preview is self-contained.
  base: process.env.SITE_BASE ?? "/jmc-network-website/",
  plugins: [react(), tailwindcss()],
});
