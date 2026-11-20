import { type Page, test as base, expect } from "@playwright/test";

/** Same default as playwright.config.ts. Set PLAYWRIGHT_BASE when the build used another VITE_BASE. */
export const basePath = (process.env.PLAYWRIGHT_BASE ?? "/par2play-demo/").replace(/\/?$/, "/");

export function siteHref(path = ""): string {
  return `${basePath}${path.replace(/^\//, "")}`;
}

export function sitePathPattern(path = ""): RegExp {
  const escaped = siteHref(path).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`${escaped}$`);
}

/** Prefer motion unless a test calls emulateMedia({ reducedMotion: "reduce" }) itself. */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await use(page);
  },
});

/** Demo layout toggle lives in the toolbar as an icon button. */
export async function setDemoLayout(page: Page, layout: "mobile" | "web") {
  const toggle = page.locator("[data-layout-toggle]").first();
  await expect(toggle).toBeVisible();
  const wantMobile = layout === "mobile";
  await expect
    .poll(async () => {
      const pressed = (await toggle.getAttribute("aria-pressed")) === "true";
      if (pressed === wantMobile) return true;
      await toggle.click({ force: true });
      return false;
    })
    .toBe(true);
  await expect(page.locator(`[data-testid="layout"][data-layout="${layout}"]`)).toBeVisible();
}

export { expect };
