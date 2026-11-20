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
        const critical = `<style>body{margin:0}#lcp-poster{position:absolute;top:0;left:0;width:100%;height:calc(100svh - 1px);object-fit:cover;object-position:center;z-index:2;pointer-events:none}#root{position:relative;z-index:1}header.hero-toolbar,header.header-bar{height:4.5rem;overflow:visible;display:flex;align-items:center;padding:0.75rem 1rem;box-sizing:border-box}:is(.hero-toolbar,.header-bar)>div{display:flex;width:100%;align-items:center;justify-content:space-between;gap:1rem}:is(.hero-toolbar,.header-bar)>div>div{display:flex;align-items:center;gap:0.5rem;flex-wrap:nowrap}#hero{height:100svh;margin-top:-4.5rem;overflow:visible;display:flex;flex-direction:column;justify-content:flex-end}.hero-bay-frame{position:absolute;inset:0}.hero-offer-dock{box-sizing:border-box;width:100%;max-height:42%;margin-top:auto}.hero-try-now{position:absolute;top:3.05rem;right:1.15rem;left:auto;z-index:45;display:flex;width:max-content;max-width:11rem;pointer-events:none}@media(min-width:768px){.hero-try-now{top:0;left:0;right:auto}}h1{font-size:2rem;line-height:1.05;font-weight:600}.play-title{font-size:clamp(2.2rem,10.5vw,5.6rem);line-height:.88;min-height:2.45em;padding-top:.12em}.play-sheet{margin-top:2.5rem;min-height:36rem}.what-you-get{margin-top:2.75rem;min-height:18rem}.scorecard__total{min-height:4.25rem}[data-cookie-slot]{position:fixed;left:0;right:0;bottom:0;z-index:30;min-height:28rem;pointer-events:none}[data-cookie-slot] .leading-snug{min-height:10rem}.page-atmosphere{position:absolute;inset:0;pointer-events:none}.page-atmosphere__floaters{position:absolute;inset:0;margin:0;padding:0;list-style:none}.page-atmosphere__floater{position:absolute}.page-atmosphere__glyph{display:block;width:100%;aspect-ratio:188/148}@media(min-width:768px){[data-cookie-slot]{min-height:10rem}}@media(prefers-reduced-motion:reduce){#lcp-poster{display:none}}</style>`;
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
        "swing-evaluation": resolve(fileURLToPath(new URL(".", import.meta.url)), "swing-evaluation/index.html"),
        juniors: resolve(fileURLToPath(new URL(".", import.meta.url)), "juniors/index.html"),
        events: resolve(fileURLToPath(new URL(".", import.meta.url)), "events/index.html"),
        tournament: resolve(fileURLToPath(new URL(".", import.meta.url)), "tournament/index.html"),
        privacy: resolve(fileURLToPath(new URL(".", import.meta.url)), "privacy-policy/index.html"),
        notfound: resolve(fileURLToPath(new URL(".", import.meta.url)), "404.html"),
      },
    },
  },
});
