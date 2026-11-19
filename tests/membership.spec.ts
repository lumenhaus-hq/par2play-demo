import type { Locator } from "@playwright/test";
import { expect, setDemoLayout, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })));
});

async function expectMembershipBento(band: Locator) {
  const grid = band.locator(".membership-bento__grid");
  await expect(grid).toHaveCount(1);
  await expect(grid).toBeVisible();
  await expect(band.getByRole("heading", { name: "Membership", exact: true })).toBeVisible();
  await expect(band.getByLabel("Club lineup")).toBeVisible();
  await expect(band.getByLabel("Preferred availability")).toBeVisible();
  await expect(band.getByLabel("Simulator stats")).toBeVisible();
  await expect(band.getByLabel("Progress")).toBeVisible();
  await expect(band.getByText("Clubs on standby", { exact: true })).toBeVisible();
  await expect(band.getByText("Your times, held", { exact: true })).toBeVisible();
  await expect(band.getByText("Cool session stats", { exact: true })).toBeVisible();
  await expect(band.getByText("275", { exact: true })).toBeVisible();
  await expect(band.getByText("Your bag", { exact: true })).toHaveCount(0);
  await expect(band.locator(".membership-bento__benefits")).toHaveCount(0);
  const heights = await grid.locator(".membership-bento__tile").evaluateAll((tiles) =>
    tiles.map((tile) => Math.round(tile.getBoundingClientRect().height)),
  );
  expect(heights.length).toBe(4);
  for (const height of heights.slice(1)) {
    expect(Math.abs(height - heights[0]!)).toBeLessThanOrEqual(2);
  }
}

test("mobile membership shows CTAs and bento over the film", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "mobile");
  const band = page.locator("#membership");
  await band.scrollIntoViewIfNeeded();
  await expectMembershipBento(band);
  await expect(band.locator(".membership-film__overlay")).toBeVisible();
  await expect(band.getByRole("link", { name: "Become a Member", exact: true })).toBeVisible();
  await expect(band.getByRole("button", { name: /^(Play|Pause) video$/ })).toBeVisible();
});

test("desktop membership shows CTAs and bento over the film", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "web");
  const band = page.locator("#membership");
  await band.scrollIntoViewIfNeeded();
  await expectMembershipBento(band);
  await expect(band.locator(".membership-film__overlay")).toBeVisible();
  await expect(band.getByRole("button", { name: /^(Play|Pause) video$/ })).toBeVisible();
  const stacking = await band.evaluate((node) => {
    const film = node.querySelector(".membership-film")!;
    const grid = node.querySelector(".membership-bento__grid")!;
    const filmRect = film.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    return {
      gridInsideFilm:
        gridRect.top >= filmRect.top - 1 &&
        gridRect.bottom <= filmRect.bottom + 1 &&
        gridRect.left >= filmRect.left - 1 &&
        gridRect.right <= filmRect.right + 1,
    };
  });
  expect(stacking.gridInsideFilm).toBe(true);
});

test("membership montage pauses, resumes, and stays paused off screen", async ({ page }) => {
  await page.goto("./");
  const band = page.locator("#membership");
  const video = band.locator("video");
  await band.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused), { timeout: 15_000 }).toBe(false);
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.muted)).toBe(true);
  // Overlay owns the hits — toggle via the control itself.
  await band.getByRole("button", { name: "Pause video", exact: true }).evaluate((node: HTMLButtonElement) => node.click());
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
  await band.getByRole("button", { name: "Play video", exact: true }).evaluate((node: HTMLButtonElement) => node.click());
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
    for (const [label, amount] of [["Unlimited Practice", "$200"]] as const) {
      await expect(panel.getByText(label, { exact: true }).first()).toBeVisible();
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
