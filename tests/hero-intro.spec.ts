import { expect, test } from "./fixtures";

test("reduced motion shows the storefront poster without video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator("#hero video")).toHaveCount(0);
  const poster = page.locator("#hero img").first();
  await expect(poster).toBeVisible();
  await expect(poster).toHaveAttribute("alt", /Par2Play storefront/i);
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
