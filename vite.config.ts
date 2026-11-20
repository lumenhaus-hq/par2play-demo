import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

function deferCss() {
  return {
    name: "defer-css",
    transformIndexHtml: {
      order: "post" as const,
      handler(html: string) {
        const critical = `<style>body{margin:0}#lcp-poster{position:absolute;top:0;left:0;width:100%;height:calc(100svh - 1px);object-fit:cover;object-position:center;z-index:2;pointer-events:none}#root{position:relative;z-index:1}header{height:4.5rem;overflow:hidden;display:flex;align-items:center;padding:0.75rem 1.5rem;box-sizing:border-box}header>div{display:flex;width:100%;align-items:center;justify-content:space-between;gap:1rem}header>div>div{display:flex;align-items:center;gap:0.5rem;flex-wrap:nowrap}#hero{height:100svh;margin-top:-4.5rem;overflow:hidden}h1{font-size:2rem;line-height:1.05;font-weight:600}[data-cookie-slot]{position:fixed;left:0;right:0;bottom:0;z-index:30;min-height:22rem;pointer-events:none}.page-atmosphere{position:absolute;inset:0;pointer-events:none}.page-atmosphere__floaters{position:absolute;inset:0;margin:0;padding:0;list-style:none}.page-atmosphere__floater{position:absolute}.page-atmosphere__glyph{display:block;width:100%;aspect-ratio:188/148}@media(min-width:768px){[data-cookie-slot]{min-height:10rem}}@media(prefers-reduced-motion:reduce){#lcp-poster{display:none}}</style>`;
        const withCritical = html.includes("#lcp-poster{") ? html : html.replace("</head>", `${critical}</head>`);
        return withCritical.replace(
          /<link rel="stylesheet" crossorigin(?:=["'][^"']*["'])? href="([^"]+)">/g,
          `<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="$1"></noscript>`,
        );
      },
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react(), tailwindcss(), deferCss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(fileURLToPath(new URL(".", import.meta.url)), "index.html"),
        membership: resolve(fileURLToPath(new URL(".", import.meta.url)), "membership/index.html"),
        coaching: resolve(fileURLToPath(new URL(".", import.meta.url)), "coaching/index.html"),
        juniors: resolve(fileURLToPath(new URL(".", import.meta.url)), "juniors/index.html"),
        events: resolve(fileURLToPath(new URL(".", import.meta.url)), "events/index.html"),
        tournament: resolve(fileURLToPath(new URL(".", import.meta.url)), "tournament/index.html"),
        privacy: resolve(fileURLToPath(new URL(".", import.meta.url)), "privacy-policy/index.html"),
        notfound: resolve(fileURLToPath(new URL(".", import.meta.url)), "404.html"),
      },
    },
  },
});
