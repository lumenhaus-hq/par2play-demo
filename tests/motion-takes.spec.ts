import { expect, setDemoLayout, test } from "./fixtures";

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
  await setDemoLayout(page, "web");
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

test("closing frame and membership bento are on the homepage", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "web");
  const closing = page.locator("section").filter({ has: page.getByRole("heading", { name: "Your bay is waiting." }) });
  await expect(closing.getByRole("heading", { name: "Your bay is waiting." })).toBeVisible();
  await expect(closing.getByRole("link", { name: "Book a Bay", exact: true })).toBeVisible();
  const band = page.locator("#membership");
  await expect(band.getByRole("heading", { name: "Membership", exact: true })).toBeVisible();
  await expect(band.getByLabel("Simulator stats")).toBeVisible();
  await expect(band.getByLabel("Progress")).toBeVisible();
  await expect(band.getByRole("link", { name: "Experience a free Member Day", exact: true })).toBeVisible();
});

test("sound control names the action on the hero", async ({ page }) => {
  await page.goto("./");
  const sound = page.getByRole("button", { name: /turn sound on|sound on/i });
  await expect(sound).toBeVisible();
  await expect(sound).toHaveAttribute("aria-label", /sound/i);
});

test("Lenis smooth scroll is live, and Pause motion turns it off", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "web");
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("lenis"))).toBe(true);
  const pause = page.getByRole("button", { name: "Pause motion", exact: true });
  await pause.scrollIntoViewIfNeeded();
  await pause.click();
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("lenis"))).toBe(false);
});

test("reduced motion never starts Lenis", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("lenis"))).toBe(false);
});
