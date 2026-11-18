#!/usr/bin/env node
/**
 * Render the SVG graphics sources into the PNG assets the site serves.
 *
 * Sources: src/graphics/og-image.svg, src/graphics/app-icon.svg
 * Outputs: public/og-image.png,
 *          public/icons/icon-512.png,
 *          public/icons/icon-192.png,
 *          public/icons/apple-touch-icon.png (180x180)
 *
 * Requires ImageMagick on PATH (preinstalled on GitHub Actions runners).
 * The rendered PNGs are committed, so CI and Pages never need to re-render.
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function magick(args) {
  execFileSync("magick", args, { stdio: "inherit" });
}

const ogSrc = path.join(root, "src", "graphics", "og-image.svg");
const iconSrc = path.join(root, "src", "graphics", "app-icon.svg");
const out = (p) => path.join(root, "public", p);

magick([ogSrc, "-resize", "1200x630", out("og-image.png")]);
magick([iconSrc, "-resize", "512x512", out("icons/icon-512.png")]);
magick([out("icons/icon-512.png"), "-resize", "192x192", out("icons/icon-192.png")]);
magick([
  out("icons/icon-512.png"),
  "-resize",
  "180x180",
  out("icons/apple-touch-icon.png"),
]);

console.log("rendered: og-image.png, icon-512.png, icon-192.png, apple-touch-icon.png");
