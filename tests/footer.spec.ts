import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "p2p_consent",
      JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() }),
    );
  });
});

const EXPLORE = ["Membership", "Coaching", "Swing evaluation", "Golf for Kids", "Events", "Tournament"] as const;

async function expectFullGroups(footer: ReturnType<import("@playwright/test").Page["getByRole"]>) {
  await expect(footer.getByRole("heading", { name: "Visit", exact: true })).toBeVisible();
  await expect(footer.getByRole("heading", { name: "Contact", exact: true })).toBeVisible();
  await expect(footer.getByRole("heading", { name: "Explore", exact: true })).toBeVisible();
  await expect(footer.getByRole("heading", { name: "Follow", exact: true })).toBeVisible();
  const explore = footer.getByRole("navigation", { name: "Explore" });
  for (const label of EXPLORE) {
    await expect(explore.getByRole("link", { name: label, exact: true })).toBeVisible();
  }
  await expect(footer.getByRole("link", { name: "info@par2play.com", exact: true })).toHaveAttribute(
    "href",
    "mailto:info@par2play.com",
  );
}

test("desktop footer keeps the full columns", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("./");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer.getByRole("link", { name: "Par2Play", exact: true })).toBeVisible();
  await expect(footer.getByRole("button", { name: "More links" })).toHaveCount(0);
  await expectFullGroups(footer);
  const address = footer.locator("address").last();
  await expect(address).toContainText("695 Hamilton Street, Suite G");
  await expect(address).toContainText(/10am–10pm daily/);
  await expect(footer.getByRole("link", { name: "Directions", exact: true })).toHaveAttribute(
    "href",
    "https://maps.google.com/?cid=5382340333318241794",
  );
  await expect(footer.getByRole("link", { name: "(732) 448-2769", exact: true })).toHaveAttribute(
    "href",
    "tel:+17324482769",
  );
  await expect(footer.getByRole("link", { name: "Instagram", exact: true })).toHaveAttribute(
    "href",
    "https://www.instagram.com/par2play/",
  );
  await expect(footer.getByRole("link", { name: "Privacy policy", exact: true })).toHaveCount(1);
  await expect(footer.getByRole("button", { name: "Cookie settings", exact: true })).toBeVisible();
  await expect(footer.getByRole("button", { name: "Pause motion", exact: true })).toBeVisible();
  const targets = footer.locator("a:visible, button:visible");
  const count = await targets.count();
  for (let index = 0; index < count; index += 1) {
    const box = await targets.nth(index).boundingBox();
    expect(box, `target ${index}`).toBeTruthy();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  }
});

test("mobile footer stays compact until more links opens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  const nap = footer.locator("address").first();
  await expect(nap).toContainText("Par2Play");
  await expect(nap).toContainText("695 Hamilton Street, Suite G");
  await expect(nap).toContainText(/10am–10pm daily/);
  await expect(nap.getByRole("link", { name: "(732) 448-2769", exact: true })).toHaveAttribute(
    "href",
    "tel:+17324482769",
  );
  await expect(footer.getByRole("link", { name: "Directions", exact: true })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Instagram", exact: true })).toBeVisible();
  await expect(footer.getByRole("heading", { name: "Explore", exact: true })).toHaveCount(0);
  const more = footer.locator("button[aria-controls='site-footer-more']");
  await expect(more).toHaveAccessibleName("More links");
  await expect(more).toHaveAttribute("aria-expanded", "false");
  const collapsed = await footer.evaluate((node) => Math.round(node.getBoundingClientRect().height));
  expect(collapsed).toBeLessThanOrEqual(385);

  await more.click();
  await expect(more).toHaveAttribute("aria-expanded", "true");
  await expectFullGroups(footer);
  await expect(footer.getByRole("button", { name: "Cookie settings", exact: true })).toBeVisible();
  await expect(footer.getByRole("button", { name: "Pause motion", exact: true })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Privacy policy", exact: true })).toHaveCount(1);

  const targets = footer.locator("a:visible, button:visible");
  const count = await targets.count();
  expect(count).toBeGreaterThan(8);
  for (let index = 0; index < count; index += 1) {
    const box = await targets.nth(index).boundingBox();
    expect(box, `target ${index}`).toBeTruthy();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  }
});

test("cookie settings in the footer reopens consent", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./membership/");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer.locator("address").first()).toContainText("695 Hamilton Street, Suite G");
  await footer.getByRole("button", { name: "More links", exact: true }).click();
  await footer.getByRole("button", { name: "Cookie settings", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
