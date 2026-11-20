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
      handler(html: string, ctx: { path?: string; filename?: string }) {
        const page = `${ctx.path ?? ""} ${ctx.filename ?? ""}`;
        const base = (process.env.VITE_BASE || "/").replace(/\/?$/, "/");
        const subpage = /\/(membership|coaching|swing-evaluation|juniors|events|members-day|junior-golf-experience|tournament)(\/|$)/.test(page);
        const swingFace = subpage
          ? `[data-cookie-slot]{display:flex;justify-content:center;box-sizing:border-box;padding:.75rem}[data-cookie-slot]>div{box-sizing:border-box;width:100%;max-width:48rem;padding:.75rem 1rem;border:1px solid rgb(10 15 11 / .15)}[data-cookie-slot] p{margin:0}[data-cookie-slot] .text-base{font-size:1rem;line-height:1.5;font-weight:600}[data-cookie-slot] .leading-snug{margin-top:.25rem;font-size:.875rem;line-height:1.375}[data-cookie-slot] .cookie-banner .mt-3{margin-top:.75rem;display:grid;gap:.5rem}[data-cookie-slot] .cookie-banner button{box-sizing:border-box;width:100%;min-height:2.75rem;border:2px solid #0a0f0b;border-radius:999px;background:#fff;color:#0a0f0b;padding:.25rem 1rem;font-size:1rem;font-weight:600}@font-face{font-family:"Permanent Marker";font-style:normal;font-weight:400;font-display:swap;src:url("${base}fonts/permanent-marker-400.woff2") format("woff2")}.display-title__accent{font-family:"Permanent Marker",cursive;font-weight:400;letter-spacing:0;line-height:.85;white-space:nowrap}`
          : "";
        const critical = `<style>body{margin:0}#lcp-poster{position:absolute;top:0;left:0;width:100%;height:calc(100svh - 1px);object-fit:cover;object-position:center;z-index:2;pointer-events:none}#root{position:relative;z-index:1}header.hero-toolbar,header.header-bar{height:4.5rem;overflow:visible;display:flex;align-items:center;padding:0.75rem 1rem;box-sizing:border-box}:is(.hero-toolbar,.header-bar)>div{display:flex;width:100%;align-items:center;justify-content:space-between;gap:1rem}:is(.hero-toolbar,.header-bar)>div>div{display:flex;align-items:center;gap:0.5rem;flex-wrap:nowrap}#hero{height:100svh;margin-top:-4.5rem;overflow:visible;display:flex;flex-direction:column;justify-content:flex-end}.hero-bay-frame{position:absolute;inset:0}.hero-offer-dock{box-sizing:border-box;width:100%;max-height:42%;margin-top:auto}.hero-try-now{position:absolute;top:3.05rem;right:1.15rem;left:auto;z-index:45;display:flex;width:max-content;max-width:15rem;pointer-events:none}@media(min-width:768px){.hero-try-now{top:0;left:0;right:auto}}h1{font-size:2rem;line-height:1.05;font-weight:600}.play-title{font-size:clamp(2.2rem,10.5vw,5.6rem);line-height:1.05;font-weight:800;letter-spacing:-.025em;min-height:2.45em;padding-top:.12em;text-wrap:balance}body:has(#events-offer) .play-title{min-height:3.3em}.display-title--panel{margin:0;font-size:clamp(2.3rem,7vw,4.15rem);line-height:.9;font-weight:800;min-height:2.2em}.offer-layout{display:grid;gap:2rem;min-width:0}article.px-6{padding:4rem 1.5rem}@container (width>=48rem){article.px-6{padding:6rem 3rem}}.offer-layout__title,.offer-layout__buy,.offer-layout__story{min-width:0;max-width:100%}.play-sheet{position:relative;margin-top:2.5rem;min-height:36rem}#events-offer{min-height:41.25rem}.play-sheet__glyph{position:absolute;width:4.25rem;height:auto;pointer-events:none}.play-sheet__glyph--b{width:3.4rem}.what-you-get{margin-top:2.75rem;min-height:18rem}.scorecard__total{min-height:4.25rem}.scorecard__row{display:grid;grid-template-columns:1.5rem minmax(0,1fr) auto;gap:.55rem;align-items:baseline;padding:.55rem 0;font-size:1rem}.scorecard__hole,.scorecard__hole svg{width:1.35rem;height:1.35rem}[data-cookie-slot]{position:fixed;left:0;right:0;bottom:0;z-index:30;min-height:28rem;pointer-events:none}[data-cookie-slot] .leading-snug{min-height:10rem}.display-title__accent{position:relative}.display-swoosh{position:absolute;left:-.04em;bottom:-.22em;display:block;width:108%;height:.38em;overflow:visible;pointer-events:none}.free-hero{position:relative}.free-hero__gift{position:absolute;top:.15rem;right:.2rem;width:2.4rem;height:2.4rem;pointer-events:none}.free-hero__bits{position:absolute;inset:0;pointer-events:none}.free-hero__bits i{position:absolute;width:.45rem;height:.7rem}.offer-still,.aspect-video{aspect-ratio:16/9;overflow:hidden}.offer-still img,.aspect-video img{display:block;width:100%;height:100%;object-fit:cover}#league-poster{display:none}@media(max-width:767px){#tournament-offer>div>div:first-child{min-height:25rem}@media(min-width:390px){#tournament-offer>div>div:first-child{min-height:24.375rem}}#league-poster{display:block;position:absolute;z-index:2;left:1.5rem;width:calc(100% - 3rem);height:18rem;object-fit:cover;object-position:center;pointer-events:none;border-bottom-left-radius:1.5rem;border-bottom-right-radius:1.5rem;top:38.5rem}@media(min-width:390px){#league-poster{top:37.875rem}}.offer-film{position:relative;min-height:18rem;overflow:hidden}.offer-film>div{position:absolute;inset:0}.offer-film img{width:100%;height:18rem;object-fit:cover;display:block}body:has(#league-poster) .offer-film img{visibility:hidden}}.page-atmosphere{position:fixed;inset:0;z-index:0;width:100%;height:100vh;height:100svh;overflow:visible;pointer-events:none}.page-atmosphere__floaters{position:fixed;inset:0;z-index:5;margin:0;padding:0;list-style:none;pointer-events:none}.page-atmosphere__floater{position:absolute}.page-atmosphere__glyph{display:block;width:100%;aspect-ratio:188/148}@media(min-width:768px){[data-cookie-slot]{min-height:10rem}}@media(prefers-reduced-motion:reduce){#lcp-poster{display:none}}${swingFace}</style>`;
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
        "members-day": resolve(fileURLToPath(new URL(".", import.meta.url)), "members-day/index.html"),
        "junior-golf-experience": resolve(fileURLToPath(new URL(".", import.meta.url)), "junior-golf-experience/index.html"),
        privacy: resolve(fileURLToPath(new URL(".", import.meta.url)), "privacy-policy/index.html"),
        notfound: resolve(fileURLToPath(new URL(".", import.meta.url)), "404.html"),
      },
    },
  },
});
