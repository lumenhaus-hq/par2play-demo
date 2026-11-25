import { expect, test } from "./fixtures";

for (const width of [390, 1280]) {
  test(`home benefit ticker scrolls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 800 });
    await page.goto("./");
    await expect(page.getByTestId("landing-boot")).toBeHidden({ timeout: 20_000 });
    await page.evaluate(() => document.documentElement.classList.remove("is-scrolling"));
    const track = page.locator(".benefit-track");
    await expect(track).toBeVisible();
    await expect.poll(async () => track.evaluate((node) => getComputedStyle(node).animationName)).toBe("usp-marquee");
    await expect.poll(async () => track.evaluate((node) => getComputedStyle(node).animationPlayState)).toBe(
      "running",
    );
    const readX = () =>
      track.evaluate((node) => {
        const value = getComputedStyle(node).transform;
        const match = /matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*(-?\d+\.?\d*)/.exec(value);
        return match ? Number(match[1]) : 0;
      });
    const first = await readX();
    await page.waitForTimeout(1000);
    const second = await readX();
    expect(Math.abs(second - first)).toBeGreaterThan(8);
  });
}

test("home benefit ticker stays on the static list when motion is reduced", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await expect(page.locator(".benefit-marquee")).toBeHidden();
  await expect(page.locator(".benefit-static")).toBeVisible();
});
