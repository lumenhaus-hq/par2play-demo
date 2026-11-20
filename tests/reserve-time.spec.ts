import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })));
});

test("reserve shows thinking dots, then a time selector, without putting names in the url", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("coaching/");
  const panel = page.locator("#coaching-offer");
  await panel.getByRole("button", { name: /^1 Lesson/ }).click();
  const trigger = panel.getByRole("button", { name: "Reserve time & day", exact: true });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(panel.getByText("Loading available times")).toBeVisible();
  await expect(panel.getByRole("radio", { name: "10:00 AM", exact: true })).toBeVisible();
  await expect(panel.getByText("Single Lesson 30 Min")).toBeVisible();
  await panel.getByRole("radio", { name: "10:00 AM", exact: true }).click();
  await panel.getByLabel("First name").fill("Ada");
  await panel.getByLabel("Last name").fill("Lovelace");
  const purchase = panel.getByRole("link", { name: "Complete Purchase", exact: true });
  const href = await purchase.getAttribute("href");
  expect(href).toContain("flow=flow_bf_lessons");
  expect(href).toContain("date=");
  expect(href).not.toContain("tr=");
  expect(href).not.toContain("Ada");
  expect(href).not.toContain("Lovelace");
  await expect(purchase).not.toHaveAttribute("target", "_blank");
});

test("expanded reserve stays inside 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("members-day/");
  await page.getByRole("button", { name: "Reserve time & day", exact: true }).click();
  await expect(page.getByLabel("Duration")).toBeVisible();
  await expect(page.getByLabel("Party size")).toBeVisible();
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(extra).toBeLessThanOrEqual(1);
});
