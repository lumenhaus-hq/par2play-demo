import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const viewports = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});

async function scrollPastHeader(page: Page, selector: string) {
  const target = page.locator(selector);
  await target.scrollIntoViewIfNeeded();
  await expect
    .poll(async () =>
      target.evaluate((el) => {
        const header = document.querySelector("header.hero-toolbar, header.header-bar");
        const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
        const top = el.getBoundingClientRect().top;
        if (top < headerBottom + 8) window.scrollBy(0, top - headerBottom - 16);
        return el.getBoundingClientRect().top >= headerBottom + 4;
      }),
    )
    .toBe(true);
  return target;
}

for (const viewport of viewports) {
  test(`home membership CTAs are fully on screen at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("./");
    const intro = await scrollPastHeader(page, "#membership .membership-film__intro");
    const member = intro.getByRole("link", { name: "Become a Member", exact: true });
    const day = intro.getByRole("link", { name: "Try a free members day", exact: true });
    await expect(member).toBeVisible();
    await expect(day).toBeVisible();

    const metrics = await intro.evaluate((node) => {
      const view = { w: window.innerWidth, h: window.innerHeight };
      const links = [...node.querySelectorAll("a")].map((el) => {
        const rect = el.getBoundingClientRect();
        const points = [
          [rect.left + rect.width / 2, rect.top + 6],
          [rect.left + rect.width / 2, rect.top + rect.height / 2],
          [rect.left + rect.width / 2, rect.bottom - 6],
          [rect.left + 10, rect.top + rect.height / 2],
          [rect.right - 10, rect.top + rect.height / 2],
        ];
        const painted = points.every(([x, y]) => {
          const hit = document.elementFromPoint(x, y);
          return Boolean(hit && (el === hit || el.contains(hit)));
        });
        return {
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          painted,
        };
      });
      return { view, links };
    });

    expect(metrics.links).toHaveLength(2);
    for (const link of metrics.links) {
      expect(link.top).toBeGreaterThanOrEqual(0);
      expect(link.left).toBeGreaterThanOrEqual(0);
      expect(link.right).toBeLessThanOrEqual(metrics.view.w + 1);
      expect(link.bottom).toBeLessThanOrEqual(metrics.view.h + 1);
      expect(link.height).toBeGreaterThan(32);
      expect(link.painted).toBe(true);
    }
    expect(Math.abs(metrics.links[0]!.width - metrics.links[1]!.width)).toBeLessThanOrEqual(1);
  });
}

for (const path of ["./", "membership/"] as const) {
  for (const viewport of viewports) {
    test(`${path} scrollWidth stays within the viewport at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(path);
      await page.locator("header.hero-toolbar, header.header-bar").first().waitFor();
      const fit = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(fit.scrollWidth).toBeLessThanOrEqual(fit.clientWidth);

      await page.evaluate(() => window.scrollTo(0, 480));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
      const header = page.locator("header.hero-toolbar, header.header-bar").first();
      const stuck = await header.evaluate((el) => {
        const top = el.getBoundingClientRect().top;
        return { top, position: getComputedStyle(el).position };
      });
      expect(stuck.position).toBe("sticky");
      expect(stuck.top).toBeGreaterThanOrEqual(-1);
      expect(stuck.top).toBeLessThanOrEqual(1);
      const after = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(after.scrollWidth).toBeLessThanOrEqual(after.clientWidth);
    });
  }
}
