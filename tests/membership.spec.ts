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
  await expect(band.getByRole("img", { name: "Golfers on a simulator at Par2Play" })).toBeVisible();
  await expect(band.locator("video")).toHaveCount(0);
  await expect(band.getByRole("button", { name: /^(Play|Pause) video$/ })).toHaveCount(0);
});

test("mobile membership Member Day CTA stays a single readable line", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("./");
  await setDemoLayout(page, "mobile");
  const band = page.locator("#membership");
  await band.scrollIntoViewIfNeeded();
  const cta = band.getByRole("link", { name: "Experience a free Member Day", exact: true });
  await expect(cta).toBeVisible();
  const metrics = await cta.evaluate((node) => {
    const label = node.querySelector(".cta-label-text") as HTMLElement;
    const styles = getComputedStyle(label);
    const rects = [...label.getClientRects()];
    return {
      whiteSpace: styles.whiteSpace,
      textShadow: styles.textShadow,
      lineCount: rects.length,
      height: label.getBoundingClientRect().height,
      fontSize: parseFloat(styles.fontSize),
    };
  });
  expect(metrics.whiteSpace).toBe("nowrap");
  // No ghost-line wipe shadow (was `0 1.1em currentColor` and stacked over wraps).
  expect(metrics.textShadow.includes("1.1em")).toBe(false);
  expect(metrics.lineCount).toBe(1);
  expect(metrics.height).toBeLessThan(metrics.fontSize * 1.6);
});

test("desktop membership shows CTAs and bento over the film", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "web");
  const band = page.locator("#membership");
  await band.scrollIntoViewIfNeeded();
  await expectMembershipBento(band);
  await expect(band.locator(".membership-film__overlay")).toBeVisible();
  await expect(band.locator("video")).toHaveCount(0);
  const still = await band.locator(".membership-film__still-img").evaluate((node) => ({
    width: node.getAttribute("width"),
    height: node.getAttribute("height"),
    ratio: getComputedStyle(node).aspectRatio,
  }));
  expect(still.width).toBe("1280");
  expect(still.height).toBe("720");
  expect(still.ratio).toMatch(/16\s*\/\s*9|1\.777/);
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

test("membership band is a sized still with no film", async ({ page }) => {
  await page.goto("./");
  const band = page.locator("#membership");
  await band.scrollIntoViewIfNeeded();
  const still = band.getByRole("img", { name: "Golfers on a simulator at Par2Play" });
  await expect(still).toBeVisible();
  await expect(still).toHaveAttribute("width", "1280");
  await expect(still).toHaveAttribute("height", "720");
  await expect(band.locator("video")).toHaveCount(0);
  await expect(band.getByRole("button", { name: /^(Play|Pause) video$/ })).toHaveCount(0);
  const requests = await page.evaluate(() =>
    performance.getEntriesByType("resource").some((entry) => /montage.*\.mp4/.test(entry.name)),
  );
  expect(requests).toBe(false);
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
      const fee = panel.locator("[data-invoice-total]");
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
