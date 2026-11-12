import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })));
});

test("membership montage pauses, resumes, and stays paused off screen", async ({ page }) => {
  await page.goto("./");
  const band = page.locator("#membership");
  const video = band.locator("video");
  await band.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(false);
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.muted)).toBe(true);
  // Sticky preview/header sit over the top of the film; hit the mid frame instead.
  await band.getByRole("button", { name: "Pause video", exact: true }).click({ position: { x: 40, y: 280 } });
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
  await band.getByRole("button", { name: "Play video", exact: true }).click({ position: { x: 40, y: 280 } });
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(false);
  await page.locator("footer").last().scrollIntoViewIfNeeded();
  await expect.poll(() => band.evaluate((node) => node.getBoundingClientRect().bottom)).toBeLessThanOrEqual(0);
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
});

test("reduced motion uses the membership poster without a video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  const band = page.locator("#membership");
  await band.scrollIntoViewIfNeeded();
  await expect(band.locator("img")).toBeVisible();
  await expect(band.locator("video")).toHaveCount(0);
  await expect(band.getByRole("button", { name: /^(Play|Pause) video$/ })).toHaveCount(0);
});

for (const width of [320, 360, 390, 430, 1280]) {
  test(`membership fee fits and exceeds the hours count at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("membership/");
    const panel = page.locator("#why-membership");
    for (const period of ["Monthly", "Annual"]) {
      await panel.getByRole("button", { name: period }).click();
      const fee = panel.locator('[aria-live="polite"] p > span').first();
      await expect(fee).toBeVisible();
      const layout = await fee.evaluate((node) => {
        const panel = node.closest("section")!;
        const hours = panel.querySelector("output")!;
        const rect = node.getBoundingClientRect();
        const bounds = panel.getBoundingClientRect();
        return {
          feeSize: parseFloat(getComputedStyle(node).fontSize),
          hoursSize: parseFloat(getComputedStyle(hours).fontSize),
          left: rect.left - bounds.left,
          right: bounds.right - rect.right,
        };
      });
      expect(layout.feeSize).toBeGreaterThan(layout.hoursSize);
      expect(layout.left).toBeGreaterThanOrEqual(0);
      expect(layout.right).toBeGreaterThanOrEqual(0);
    }
  });
}
