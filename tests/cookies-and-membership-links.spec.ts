import { expect, test } from "./fixtures";

for (const width of [390, 1280]) {
  for (const action of ["Accept all", "Reject non-essential", "Save my choices"]) {
    test(`${action} closes and remembers cookie choice at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("./");
      if (action === "Save my choices") {
        await page.getByRole("button", { name: "Settings", exact: true }).click();
        await page.getByRole("dialog").getByRole("button", { name: action, exact: true }).click();
      } else {
        await page.getByRole("button", { name: action, exact: true }).click();
      }
      await expect(page.getByText("Cookies at Par2Play", { exact: true })).toHaveCount(0);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("p2p_consent")!));
      expect(stored.analytics).toBe(action === "Accept all");
      expect(stored.marketing).toBe(action === "Accept all");
      await page.reload();
      await expect(page.getByText("Cookies at Par2Play", { exact: true })).toHaveCount(0);
    });
  }

  test(`homepage membership CTAs navigate to the subpage at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    await page.getByRole("button", { name: "Reject non-essential", exact: true }).click();
    const ctas = page.getByRole("link", { name: "Become a Member", exact: true });
    const count = await ctas.count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (const cta of await ctas.all()) {
      await expect(cta).toHaveAttribute("href", "/par2play-demo/membership/");
      await expect(cta).not.toHaveAttribute("target", "_blank");
    }
    await page.locator("#hero").getByRole("link", { name: "Become a Member", exact: true }).click();
    await expect(page).toHaveURL(/\/par2play-demo\/membership\/$/);
    await expect(page.locator("#why-membership")).toBeVisible();
  });
}

for (const action of ["Accept all", "Reject non-essential", "Save my choices"]) {
  test(`${action} closes cookie notice when storage is blocked`, async ({ page }) => {
    await page.addInitScript(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === "p2p_consent") throw new DOMException("Storage blocked", "SecurityError");
        return original.call(this, key, value);
      };
    });
    await page.goto("./");
    if (action === "Save my choices") {
      await page.getByRole("button", { name: "Settings", exact: true }).click();
      await page.getByRole("dialog").getByRole("button", { name: action, exact: true }).click();
    } else {
      await page.getByRole("button", { name: action, exact: true }).click();
    }
    await expect(page.getByText("Cookies at Par2Play", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}

test("returning visitor hydrates without restoring the cookie notice", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("HYDRATE")) errors.push(message.text());
  });
  await page.addInitScript(() => localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })));
  await page.goto("./");
  await expect(page.getByText("Cookies at Par2Play", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Cookie settings", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Save my choices", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("membership CTA opens the subpage from the mobile preview", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Reject non-essential", exact: true }).click();
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await page.locator("#hero").getByRole("link", { name: "Become a Member", exact: true }).click();
  await expect(page).toHaveURL(/\/par2play-demo\/membership\/$/);
  await expect(page.locator("#why-membership")).toBeVisible();
});
