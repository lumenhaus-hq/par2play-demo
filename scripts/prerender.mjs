import { chromium } from "@playwright/test";
import { preview } from "vite";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROUTES = ["", "membership/", "coaching/", "swing-evaluation/", "juniors/", "events/", "tournament/", "privacy-policy/"];
const port = 4193;
const server = await preview({ preview: { port, strictPort: true, host: "127.0.0.1" } });
const baseUrl = new URL(server.config.base, `http://127.0.0.1:${port}`);
let browser;

try {
  browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  // Prefer motion so prerendered markup matches client hydration (videos, Pause motion).
  // HeroVideo already skips the bay intro under navigator.webdriver.
  await page.emulateMedia({ reducedMotion: "no-preference" });

  for (const route of ROUTES) {
    const href = new URL(route, baseUrl);
    href.searchParams.set("prerender", "1");
    await page.goto(href.href, { waitUntil: "networkidle" });
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 30_000 });
    await page.evaluate(() => {
      document.documentElement.classList.remove("media-on", "ticker-on");
      document.getElementById("lcp-poster")?.removeAttribute("data-bay");
      // The print stylesheet flips to media=all on load. Keep the saved HTML deferred
      // so the poster can paint before the full sheet.
      for (const link of document.querySelectorAll('link[rel="stylesheet"][onload]')) {
        link.media = "print";
      }
      // First client render keeps posters only. Effects mount clips after paint,
      // so the saved HTML must not include videos the effects already attached.
      for (const video of document.querySelectorAll("video")) video.remove();
    });
    const html = ("<!doctype html>\n" + (await page.content())).replace(/react-aria\d+-/g, "react-aria-");
    const file = route === "" ? resolve("dist/index.html") : resolve("dist", route, "index.html");
    await writeFile(file, html);
    const words = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    console.log("prerendered", route || "/", words, "words");
  }
} finally {
  await browser?.close();
  await new Promise((done) => server.httpServer.close(done));
}
