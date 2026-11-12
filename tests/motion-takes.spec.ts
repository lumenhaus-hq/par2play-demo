import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() }));
    if (sessionStorage.getItem("par2play-motion-reset")) return;
    localStorage.removeItem("par2play-motion");
    sessionStorage.setItem("par2play-motion-reset", "1");
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
});

test("pause motion persists and stops the hero film", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Desktop", exact: true }).click();
  const pause = page.getByRole("button", { name: "Pause motion", exact: true });
  await pause.scrollIntoViewIfNeeded();
  await expect(pause).toBeVisible();
  await pause.click();
  await expect(page.getByRole("button", { name: "Play motion", exact: true })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => localStorage.getItem("par2play-motion"))).toBe("paused");
  await expect.poll(async () => page.evaluate(() => document.documentElement.classList.contains("motion-paused"))).toBe(true);
  await page.reload();
  await expect(page.getByRole("button", { name: "Play motion", exact: true })).toBeVisible();
  await expect(page.locator("#hero video")).toHaveCount(0);
  await expect(page.locator("#hero img").first()).toBeVisible();
});

test("closing frame and numbered membership chapters are on the homepage", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Desktop", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your bay is waiting." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Book a bay", exact: true })).toBeVisible();
  const band = page.locator("#membership");
  await expect(band.getByText("01 / 03", { exact: true }).first()).toBeVisible();
  await expect(band.getByRole("heading", { name: "Member benefits" })).toBeVisible();
  await expect(band.getByRole("heading", { name: "Track your progress" })).toBeVisible();
  await expect(band.getByRole("heading", { name: "Fit it around your day" })).toBeVisible();
});

test("sound control names the action on the hero", async ({ page }) => {
  await page.goto("./");
  const sound = page.getByRole("button", { name: /turn sound on|sound on/i });
  await expect(sound).toBeVisible();
  await expect(sound).toContainText(/sound/i);
});
