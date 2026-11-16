import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() }));
  });
});

test("style switcher applies distinct tokens on the layout", async ({ page }) => {
  await page.goto("./");
  // Default flow layout is already desktop web.
  const layout = page.getByTestId("layout");
  await expect(layout).toHaveAttribute("data-layout", "web");
  await expect(layout).toHaveAttribute("data-style", "fairway");

  await page.getByRole("button", { name: "Signal", exact: true }).click({ force: true });
  await expect(layout).toHaveAttribute("data-style", "signal");
  await expect
    .poll(async () => layout.evaluate((node) => getComputedStyle(node).getPropertyValue("--accent").trim()))
    .toBe("#c6ff1a");
  await expect
    .poll(async () => layout.evaluate((node) => getComputedStyle(node).getPropertyValue("--font-display-stack")))
    .toContain("Syne");

  await page.getByRole("button", { name: "Nocturne", exact: true }).click({ force: true });
  await expect(layout).toHaveAttribute("data-style", "nocturne");
  await expect
    .poll(async () => layout.evaluate((node) => getComputedStyle(node).getPropertyValue("--accent").trim()))
    .toBe("#e2a33a");
  await expect
    .poll(async () => layout.evaluate((node) => getComputedStyle(node).getPropertyValue("--paper").trim()))
    .toBe("#1c1916");

  await page.getByRole("button", { name: "Mist", exact: true }).click({ force: true });
  await expect(layout).toHaveAttribute("data-style", "mist");
  await expect
    .poll(async () => layout.evaluate((node) => getComputedStyle(node).getPropertyValue("--accent").trim()))
    .toBe("#0f766e");
  await expect
    .poll(async () => layout.evaluate((node) => getComputedStyle(node).getPropertyValue("--font-display-stack")))
    .toContain("Sora");
});

test("?style= query selects a variant on load", async ({ page }) => {
  await page.goto("./?style=signal");
  await expect(page.getByTestId("layout")).toHaveAttribute("data-style", "signal");
  await expect
    .poll(async () => page.getByRole("button", { name: "Signal", exact: true }).getAttribute("aria-pressed"))
    .toBe("true");
  await expect
    .poll(async () =>
      page.getByTestId("layout").evaluate((node) => getComputedStyle(node).getPropertyValue("--accent").trim()),
    )
    .toBe("#c6ff1a");
});
