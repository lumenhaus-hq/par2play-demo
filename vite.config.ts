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
        const critical = `<style>body{margin:0}#lcp-poster{position:absolute;top:0;left:0;width:100%;height:100svh;object-fit:cover;z-index:0;pointer-events:none}#root{position:relative;z-index:1}h1{font-size:2rem;line-height:1.05;font-weight:600}</style>`;
        const withCritical = html.includes("#lcp-poster{") ? html : html.replace("</head>", `${critical}</head>`);
        return withCritical.replace(
          /<link rel="stylesheet" crossorigin href="([^"]+)">/g,
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
