import { expect, test } from "./fixtures";

test("reduced motion shows the storefront intro poster without video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator("#hero video")).toHaveCount(0);
  const poster = page.locator("#hero img").first();
  await expect(poster).toBeVisible();
  await expect(poster).toHaveAttribute("alt", /Par2Play storefront/i);
});

test("cinematic intro serves the HD zoom cut then the looping hero", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const hits: string[] = [];
  page.on("response", (response) => {
    const url = response.url();
    if (/hero-intro-zoom\.(mp4|webm)|\/media\/hero\.(mp4|webm)/.test(url) && response.ok()) hits.push(url);
  });
  // ?intro=play forces the cinematic boot even under Playwright's webdriver flag.
  await page.goto("./?intro=play");
  await expect.poll(() => hits.some((url) => /hero-intro-zoom\.(mp4|webm)/.test(url)), { timeout: 15_000 }).toBe(true);
  await expect.poll(() => hits.some((url) => /\/media\/hero\.(mp4|webm)/.test(url)), { timeout: 15_000 }).toBe(true);
  await expect(page.getByText(/Animated map zooming into the Par2Play storefront/i)).toBeAttached();
});
