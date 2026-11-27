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
  await expect(page).toHaveTitle("Experience a Member's Day | Par2Play");
  await expect(page.getByRole("heading", { level: 1, name: "Experience a Member's Day" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Arrive" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pick up a club" })).toBeVisible();
  await expect(page.getByText("Full Swing simulators and 100+ courses.")).toBeVisible();
  const invoice = page.locator("[data-invoice]");
  await expect(invoice).toContainText("You pay");
  await expect(invoice.locator(".scorecard__was")).toHaveText("$70");
  await expect(invoice.locator(".scorecard__free")).toHaveText("FREE");
  const freeLabels = page.getByText(/^free$/i);
  await expect(freeLabels).toHaveCount(1);
  await expect(freeLabels).toHaveClass("scorecard__free");
  await expect(page.locator(".coupon-burst.is-on")).toHaveCount(0);
  const book = page.getByRole("button", { name: "Reserve time & day", exact: true });
  await expect(book).toHaveAttribute("aria-expanded", "false");
  await book.click();
  await page.getByRole("radio", { name: "10:00 AM", exact: true }).click();
  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Last name").fill("Lovelace");
  const purchase = page.getByRole("link", { name: "Complete Purchase", exact: true });
  const href = await purchase.getAttribute("href");
  expect(href).toContain(BAY.split("?")[0]);
  expect(href).toContain("flow=flow_bf_bay_rental");
  expect(href).toContain("date=");
  expect(href).toContain("tr=");
  expect(href).not.toContain("Ada");
  await expect(purchase).not.toHaveAttribute("target", "_blank");
  await expect(page.getByRole("link", { name: /Ask us anything/ })).toHaveAttribute("href", "tel:+17324482769");
  const json = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(json.join(" ")).not.toContain('"@type":"Person"');
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(extra).toBeLessThanOrEqual(1);
});

test("junior golf experience is free and books the lessons flow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("junior-golf-experience/");
  await expect(page).toHaveTitle("Experience golf for juniors | Par2Play");
  await expect(page.getByRole("heading", { level: 1, name: "Experience golf for juniors" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).not.toContainText("FREE");
  const invoice = page.locator("[data-invoice]");
  await expect(invoice).toContainText("You pay");
  await expect(invoice.locator(".scorecard__free")).toHaveText("FREE");
  await expect(invoice.locator(".scorecard__was")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "What to expect" })).toBeVisible();
  await expect(page.locator(".what-you-get__card")).toHaveCount(4);
  await page.getByRole("button", { name: "Reserve time & day", exact: true }).click();
  await page.getByRole("radio", { name: "10:00 AM", exact: true }).click();
  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Last name").fill("Lovelace");
  const href = await page.getByRole("link", { name: "Complete Purchase", exact: true }).getAttribute("href");
  expect(href).toContain("flow=flow_bf_lessons");
  expect(href).toContain("date=");
  expect(href).not.toContain("Ada");
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(extra).toBeLessThanOrEqual(1);
});

test("swing evaluation explains the 50 minutes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("swing-evaluation/");
  const invoice = page.locator("[data-invoice]");
  await expect(invoice.locator("[data-invoice-total]")).toHaveText("$100");
  await expect(invoice).toContainText("You pay");
  await expect(invoice).toContainText("50 minutes");
  await expect(invoice).toContainText("Full Swing");
  await expect(page.getByRole("heading", { name: "Who it is for" })).toHaveCount(0);
  await expect(page.locator(".what-you-get__card")).toHaveCount(4);
  await expect(page.getByRole("button", { name: "Reserve time & day", exact: true })).toBeVisible();
});

test("desktop subpages put the price card beside the story", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const route of ["membership/", "swing-evaluation/", "members-day/", "junior-golf-experience/"]) {
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
    const type = await page.locator(".what-you-get__line").first().evaluate((node) => {
      const style = getComputedStyle(node);
      return { size: style.fontSize, weight: style.fontWeight };
    });
    expect(type.size, route).toBe("16px");
    const titleWeight = await page.locator(".what-you-get__title").first().evaluate((node) => getComputedStyle(node).fontWeight);
    expect(Number(titleWeight), route).toBeGreaterThanOrEqual(700);
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
