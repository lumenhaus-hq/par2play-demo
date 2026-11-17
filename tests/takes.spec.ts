import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() }));
    localStorage.setItem("par2play-motion", "paused");
  });
});

async function pickTake(page: import("@playwright/test").Page, name: "Classic" | "Orbit" | "Ledger" | "Strike") {
  await page.getByRole("button", { name, exact: true }).click({ force: true });
  await expect
    .poll(async () => page.getByRole("button", { name, exact: true }).getAttribute("aria-pressed"))
    .toBe("true");
}

test("take switcher mounts orbit, ledger, and strike rebuilds", async ({ page }) => {
  await page.goto("./");
  const layout = page.getByTestId("layout");
  await expect(layout).toHaveAttribute("data-take", "classic");

  await pickTake(page, "Orbit");
  await expect(layout).toHaveAttribute("data-take", "orbit");
  await expect(page.locator("[data-take-root='orbit']")).toBeVisible();
  await expect(page.getByRole("heading", { name: /A home for all golfers/i })).toBeVisible();
  await expect(page.locator(".take-boot--out")).toBeVisible({ timeout: 4000 });

  await pickTake(page, "Ledger");
  await expect(layout).toHaveAttribute("data-take", "ledger");
  await expect(page.locator("[data-take-root='ledger']")).toBeVisible();
  await expect(page.getByRole("heading", { name: /clubhouse that stays open/i })).toBeVisible();

  await pickTake(page, "Strike");
  await expect(layout).toHaveAttribute("data-take", "strike");
  await expect(page.locator("[data-take-root='strike']")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Hit it\. Read it\. Repeat/i })).toBeVisible();
});

test("?take=orbit loads the cinema rebuild", async ({ page }) => {
  await page.goto("./?take=orbit");
  await expect(page.getByTestId("layout")).toHaveAttribute("data-take", "orbit");
  await expect
    .poll(async () => page.getByRole("button", { name: "Orbit", exact: true }).getAttribute("aria-pressed"))
    .toBe("true");
  await expect(page.locator("[data-orbit-rail]")).toBeVisible();
});
