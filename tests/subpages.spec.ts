import { expect, test } from "./fixtures";

const BAY = "https://par2play.oclock.app/book?flow=flow_bf_bay_rental";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "p2p_consent",
      JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() }),
    );
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("members day walks the visit and books the bay", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("members-day/");
  await expect(page).toHaveTitle("Try a free members day | Par2Play");
  await expect(page.getByRole("heading", { level: 1, name: "Try a free members day" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Arrive" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pick up a club" })).toBeVisible();
  await expect(page.getByText("Full Swing simulators and 100+ courses.")).toBeVisible();
  const book = page.getByRole("link", { name: "Complete booking", exact: true });
  await expect(book).toHaveAttribute("href", BAY);
  await expect(book).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("link", { name: /Ask us anything/ })).toHaveAttribute("href", "tel:+17324482769");
  const json = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(json.join(" ")).not.toContain('"@type":"Person"');
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(extra).toBeLessThanOrEqual(1);
});

test("swing evaluation explains the 30 minutes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("swing-evaluation/");
  await expect(page.getByText("$100").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "You swing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "You read the data" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "You leave with it" })).toBeVisible();
  await expect(page.getByText("30 minutes on a Full Swing simulator.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Book swing evaluation", exact: true })).toBeVisible();
});

test("desktop subpages put the price card beside the story", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const route of ["membership/", "swing-evaluation/", "members-day/"]) {
    await page.goto(route);
    const columns = await page.locator(".offer-layout").evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length);
    expect(columns, route).toBe(2);
    const order = await page.locator("main").evaluate((node) => {
      const buy = node.querySelector(".offer-layout__buy");
      const story = node.querySelector(".offer-layout__story");
      if (!buy || !story) return 0;
      return buy.getBoundingClientRect().left < story.getBoundingClientRect().left ? 1 : 0;
    });
    expect(order, route).toBe(1);
  }
});

test("phone subpages stay stacked", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("coaching/");
  const columns = await page.locator(".offer-layout").evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(1);
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(extra).toBeLessThanOrEqual(1);
});
