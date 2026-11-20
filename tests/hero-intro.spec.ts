import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

test("reduced motion shows the storefront poster without video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator("#hero video")).toHaveCount(0);
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

test("a gesture mounts the film without the Earth zoom or a scroll lock", async ({ page }) => {
  await asVisitor(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await expect.poll(() => page.evaluate(() => navigator.webdriver)).toBe(false);
  await page.waitForTimeout(400);
  await expect(page.locator("#hero video")).toHaveCount(0);
  await expect(page.locator("#lcp-poster")).toBeVisible();

  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.locator("#hero video").count()).toBe(1);
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4_000 }).toBeGreaterThan(0);

  const samples: { y: number; locked: boolean; zoom: string }[] = [];
  for (let i = 0; i < 8; i += 1) {
    samples.push(
      await page.evaluate(() => ({
        y: window.scrollY,
        locked: document.documentElement.classList.contains("hero-scroll-lock"),
        zoom: document.documentElement.dataset.earthZoom ?? "",
      })),
    );
    await page.waitForTimeout(120);
  }
  expect(samples.some((sample) => sample.locked)).toBe(false);
  expect(samples.some((sample) => sample.zoom === "1")).toBe(false);
  expect(samples.every((sample) => sample.y > 0)).toBe(true);
});

test.describe("touch scroll skips the Earth intro", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  test("a touch scroll on home is not reset when the intro was not requested", async ({ page }) => {
    await asVisitor(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("./");
    await expect.poll(() => page.evaluate(() => navigator.webdriver)).toBe(false);
    await page.waitForTimeout(400);
    await expect(page.locator("#hero video")).toHaveCount(0);
    await expect(page.locator("#lcp-poster")).toBeVisible();

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
