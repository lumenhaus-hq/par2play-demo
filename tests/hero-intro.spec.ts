import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

test("reduced motion shows the storefront poster without video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator("#hero video")).toHaveCount(0);
  await expect(page.locator("[data-hero-loader]")).toHaveCount(0);
  const poster = page.locator("#hero img").first();
  await expect(poster).toBeVisible();
  await expect(poster).toHaveAttribute("alt", /Par2Play storefront/i);
});

/** Real visitors are not webdriver. Playwright sets the flag, which skips the Earth zoom on its own. */
async function asVisitor(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "webdriver", { configurable: true, get: () => false });
  });
}

test("the film autoplays without the Earth zoom or a scroll lock", async ({ page }) => {
  await asVisitor(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await expect.poll(() => page.evaluate(() => navigator.webdriver)).toBe(false);
  await expect(page.locator("#lcp-poster")).toBeAttached();

  await expect.poll(() => page.locator("#hero video").count(), { timeout: 8_000 }).toBe(1);
  const video = page.locator("#hero video");
  await expect(video).toHaveAttribute("playsinline", "");
  // The film is mounted muted. Soundtrack may drop the attribute if unmuted play is allowed.
  await expect.poll(() => page.locator("#hero video.is-live").count(), { timeout: 8_000 }).toBe(1);
  await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(false);
  await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).playsInline)).toBe(true);

  const state = await page.evaluate(() => ({
    locked: document.documentElement.classList.contains("hero-scroll-lock"),
    zoom: document.documentElement.dataset.earthZoom ?? "",
    lcp: document.getElementById("lcp-poster")?.id ?? "",
  }));
  expect(state.locked).toBe(false);
  expect(state.zoom).toBe("");
  expect(state.lcp).toBe("lcp-poster");

  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4_000 }).toBeGreaterThan(0);
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => ({
    y: window.scrollY,
    locked: document.documentElement.classList.contains("hero-scroll-lock"),
    zoom: document.documentElement.dataset.earthZoom ?? "",
  }));
  expect(after.locked).toBe(false);
  expect(after.zoom).toBe("");
  expect(after.y).toBeGreaterThan(0);
});

test("a slow film keeps the poster and a corner loader without locking scroll", async ({ page }) => {
  await asVisitor(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route(/\/media\/hero\.(mp4|webm)/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    await route.continue();
  });
  await page.goto("./");
  await expect(page.locator("#lcp-poster")).toBeVisible();
  await expect(page.locator("[data-hero-loader]")).toBeVisible({ timeout: 8_000 });
  const mid = await page.evaluate(() => ({
    locked: document.documentElement.classList.contains("hero-scroll-lock"),
    zoom: document.documentElement.dataset.earthZoom ?? "",
    opacity: getComputedStyle(document.getElementById("lcp-poster")!).opacity,
  }));
  expect(mid.locked).toBe(false);
  expect(mid.zoom).toBe("");
  expect(Number(mid.opacity)).toBeGreaterThan(0.9);

  await page.mouse.wheel(0, 700);
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4_000 }).toBeGreaterThan(40);
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(40);
  expect(await page.evaluate(() => document.documentElement.classList.contains("hero-scroll-lock"))).toBe(false);
});

test.describe("touch scroll skips the Earth intro", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  test("a touch scroll on home is not reset while the film mounts itself", async ({ page }) => {
    await asVisitor(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("./");
    await expect.poll(() => page.evaluate(() => navigator.webdriver)).toBe(false);
    await expect(page.locator("#lcp-poster")).toBeAttached();

    const session = await page.context().newCDPSession(page);
    const x = 200;
    const startY = 640;
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: startY }] });
    for (let step = 1; step <= 6; step += 1) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y: startY - step * 70 }],
      });
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });

    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4_000 }).toBeGreaterThan(0);
    await page.waitForTimeout(500);
    const state = await page.evaluate(() => ({
      y: window.scrollY,
      locked: document.documentElement.classList.contains("hero-scroll-lock"),
      zoom: document.documentElement.dataset.earthZoom ?? "",
    }));
    expect(state.locked).toBe(false);
    expect(state.zoom).toBe("");
    expect(state.y).toBeGreaterThan(0);
    await expect.poll(() => page.locator("#hero video").count(), { timeout: 8_000 }).toBe(1);
  });
});

test("earth intro zooms hero.mp4 and does not load the map cut", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const hits: string[] = [];
  page.on("response", (response) => {
    const url = response.url();
    if (/hero-intro-zoom\.(mp4|webm)|\/media\/hero\.(mp4|webm)/.test(url) && response.ok()) hits.push(url);
  });
  // ?intro=play forces the Earth zoom even under Playwright's webdriver flag.
  await page.goto("./?intro=play");
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.earthZoom)).toBe("1");
  await expect.poll(() => page.locator("#hero video").count()).toBe(1);
  await expect(page.locator("#hero video")).toHaveAttribute("preload", /none|metadata/);
  await expect.poll(() => hits.some((url) => /hero-intro-zoom\.(mp4|webm)/.test(url)), { timeout: 4_000 }).toBe(false);
  await expect.poll(() => hits.some((url) => /\/media\/hero\.(mp4|webm)/.test(url)), { timeout: 15_000 }).toBe(true);
  await expect(page.getByText(/New York zooming into New Jersey/i)).toHaveCount(0);
});
