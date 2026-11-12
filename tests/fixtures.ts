import { test as base, expect } from "@playwright/test";

/** Prefer motion unless a test calls emulateMedia({ reducedMotion: "reduce" }) itself. */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await use(page);
  },
});

export { expect };
