import { expect, test } from "./fixtures";

test("home shows a plain boot plate until hero and membership assets are warm", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./", { waitUntil: "domcontentloaded" });

  const boot = page.getByTestId("landing-boot");
  await expect(boot).toBeVisible({ timeout: 5_000 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains("landing-booting")))
    .toBe(true);

  await expect(boot).toBeHidden({ timeout: 20_000 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains("landing-booting")))
    .toBe(false);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains("ticker-on")))
    .toBe(true);

  await expect(page.locator("#hero")).toBeVisible();
  await expect(page.locator("#membership img[alt='Golfers on a simulator at Par2Play']")).toBeVisible();
  await expect(page.locator(".benefit-track")).toBeVisible();
});

test("after boot, desktop wheel freezes the hero film and membership stays scrollable", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./");
  await expect(page.getByTestId("landing-boot")).toBeHidden({ timeout: 20_000 });

  const video = page.locator("#hero video");
  await expect.poll(() => video.count(), { timeout: 10_000 }).toBe(1);
  await expect
    .poll(async () => video.evaluate((node) => !(node as HTMLVideoElement).paused), { timeout: 10_000 })
    .toBe(true);

  await page.mouse.wheel(0, 320);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const film = document.querySelector("#hero video") as HTMLVideoElement | null;
        return Boolean(film?.paused && window.scrollY > 24);
      }),
    )
    .toBe(true);

  await page.locator("#membership").evaluate((node) => node.scrollIntoView({ block: "center" }));
  await expect(page.locator("#membership")).toBeInViewport();
  await page.locator("#coaching").evaluate((node) => node.scrollIntoView({ block: "start" }));
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(800);
});
