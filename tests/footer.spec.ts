import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "p2p_consent",
      JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() }),
    );
  });
});

for (const width of [390, 1280]) {
  test(`footer groups, landmarks, and tap targets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByRole("link", { name: "Par2Play", exact: true })).toBeVisible();
    await expect(footer.getByRole("heading", { name: "Visit", exact: true })).toBeVisible();
    await expect(footer.getByRole("heading", { name: "Contact", exact: true })).toBeVisible();
    await expect(footer.getByRole("heading", { name: "Explore", exact: true })).toBeVisible();
    await expect(footer.getByRole("heading", { name: "Follow", exact: true })).toBeVisible();

    const address = footer.locator("address");
    await expect(address).toContainText("695 Hamilton Street, Suite G");
    await expect(address).toContainText(/10am–10pm daily/);
    await expect(address.getByRole("link", { name: "Directions", exact: true })).toHaveAttribute(
      "href",
      "https://maps.google.com/?cid=5382340333318241794",
    );

    await expect(footer.getByRole("link", { name: "(732) 448-2769", exact: true })).toHaveAttribute(
      "href",
      "tel:+17324482769",
    );
    await expect(footer.getByRole("link", { name: "info@par2play.com", exact: true })).toHaveAttribute(
      "href",
      "mailto:info@par2play.com",
    );
    await expect(footer.getByRole("link", { name: "Instagram", exact: true })).toHaveAttribute(
      "href",
      "https://www.instagram.com/par2play/",
    );

    const explore = footer.getByRole("navigation", { name: "Explore" });
    for (const label of ["Membership", "Coaching", "Swing evaluation", "Golf for Kids", "Events", "Tournament"]) {
      await expect(explore.getByRole("link", { name: label, exact: true })).toBeVisible();
    }

    await expect(footer.getByRole("link", { name: "Privacy policy", exact: true })).toHaveCount(1);
    await expect(footer.getByRole("link", { name: "Privacy", exact: true })).toHaveCount(0);
    await expect(footer.getByRole("button", { name: "Cookie settings", exact: true })).toBeVisible();
    await expect(footer.getByRole("button", { name: "Pause motion", exact: true })).toBeVisible();

    const targets = footer.locator("a, button");
    const count = await targets.count();
    expect(count).toBeGreaterThan(8);
    for (let index = 0; index < count; index += 1) {
      const box = await targets.nth(index).boundingBox();
      expect(box, `target ${index}`).toBeTruthy();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    }
  });
}

test("cookie settings in the footer reopens consent", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./membership/");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer.locator("address")).toContainText("695 Hamilton Street, Suite G");
  await footer.getByRole("button", { name: "Cookie settings", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
