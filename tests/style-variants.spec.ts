import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() }));
  });
});

test("demo chrome locks Classic homepage to Signal tokens without style togglebar", async ({ page }) => {
  await page.goto("./");
  const layout = page.getByTestId("layout");
  await expect(layout).toHaveAttribute("data-layout", "web");
  await expect(layout).toHaveAttribute("data-style", "signal");
  await expect(layout).toHaveAttribute("data-take", "classic");
  await expect(layout).toHaveAttribute("data-hero-type", "plate");

  await expect(page.getByRole("button", { name: "Classic", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Signal", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Orbit", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Fairway", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Nocturne", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Mist", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Plate", exact: true })).toHaveCount(0);

  await expect
    .poll(async () => layout.evaluate((node) => getComputedStyle(node).getPropertyValue("--accent").trim()))
    .toBe("#c6ff1a");
  await expect
    .poll(async () => layout.evaluate((node) => getComputedStyle(node).getPropertyValue("--font-display-stack")))
    .toContain("Syne");
});

test("?style= query still selects a variant on load", async ({ page }) => {
  await page.goto("./?style=signal");
  await expect(page.getByTestId("layout")).toHaveAttribute("data-style", "signal");
  await expect
    .poll(async () =>
      page.getByTestId("layout").evaluate((node) => getComputedStyle(node).getPropertyValue("--accent").trim()),
    )
    .toBe("#c6ff1a");
});

test("hero toolbar is black with an accent edge while on film", async ({ page }) => {
  await page.goto("./");
  const bar = page.locator("header.hero-toolbar").first();
  await expect(bar).toBeVisible();
  await expect.poll(async () => bar.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe("rgb(0, 0, 0)");
  await expect
    .poll(async () => bar.evaluate((node) => getComputedStyle(node).borderBottomColor))
    .not.toBe("rgba(0, 0, 0, 0)");
});
