import { expect, setDemoLayout, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })));
});

test("mobile membership shows the golf bento grid", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "mobile");
  const band = page.locator("#membership");
  await band.scrollIntoViewIfNeeded();
  await expect(band.locator(".membership-bento__grid")).toBeVisible();
  await expect(band.getByRole("heading", { name: "Membership", exact: true })).toBeVisible();
  await expect(band.getByLabel("Member profile")).toBeVisible();
  await expect(band.getByLabel("Simulator stats")).toBeVisible();
  await expect(band.getByText("Meet the member kit", { exact: true })).toBeVisible();
  await expect(band.getByText("Cool session stats", { exact: true })).toBeVisible();
  await expect(band.getByText("275", { exact: true })).toBeVisible();
  await expect(band.locator(".membership-bento__benefit-title", { hasText: "Member benefits" })).toBeVisible();
  await expect(band.getByRole("button", { name: /^(Play|Pause) video$/ })).toHaveCount(0);
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
  await expect(band.getByRole("img", { name: "Golfers on a simulator at Par2Play" })).toBeVisible();
  await expect(band.locator("video")).toHaveCount(0);
  await expect(band.getByRole("button", { name: /^(Play|Pause) video$/ })).toHaveCount(0);
});

for (const width of [320, 360, 390, 430, 1280]) {
  test(`membership practice price stays readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("membership/");
    const panel = page.locator("#why-membership");
    for (const [label, amount] of [
      ["Unlimited Practice", "$200"],
      ["10 Sessions", "$400"],
    ] as const) {
      await panel.getByRole("button", { name: label, exact: true }).click();
      const fee = panel.locator('[aria-live="polite"] p').last();
      await expect(fee).toContainText(amount);
      const layout = await fee.evaluate((node) => {
        const bounds = node.closest("section")!.getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        return {
          feeSize: parseFloat(getComputedStyle(node).fontSize),
          left: rect.left - bounds.left,
          right: bounds.right - rect.right,
        };
      });
      expect(layout.feeSize).toBeGreaterThan(28);
      expect(layout.left).toBeGreaterThanOrEqual(0);
      expect(layout.right).toBeGreaterThanOrEqual(0);
    }
  });
}
