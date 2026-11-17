import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() }));
    localStorage.setItem("par2play-motion", "paused");
  });
});

test("demo chrome ships Classic only, with Signal styles", async ({ page }) => {
  await page.goto("./");
  const layout = page.getByTestId("layout");
  await expect(layout).toHaveAttribute("data-take", "classic");
  await expect(layout).toHaveAttribute("data-style", "signal");
  await expect(page.getByRole("button", { name: "Classic", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Orbit", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ledger", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Strike", exact: true })).toHaveCount(0);
});

test("?take=orbit still loads the cinema rebuild via deep link", async ({ page }) => {
  await page.goto("./?take=orbit");
  await expect(page.getByTestId("layout")).toHaveAttribute("data-take", "orbit");
  await expect(page.locator("[data-orbit-rail]")).toBeVisible();
});
