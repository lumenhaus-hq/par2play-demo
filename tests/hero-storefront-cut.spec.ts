import { expect, test } from "./fixtures";

test("default home film reaches the storefront in under one second", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "webdriver", { configurable: true, get: () => false });
  });
  await page.addInitScript(() =>
    localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })),
  );
  await page.goto("./");
  await expect(page.getByTestId("landing-boot")).toBeHidden({ timeout: 20_000 });

  const video = page.locator("#hero video");
  await expect.poll(() => video.count(), { timeout: 15_000 }).toBe(1);
  await expect.poll(() => page.locator("#hero video.is-live").count(), { timeout: 15_000 }).toBe(1);

  // After the short Earth beat, playback should be on the storefront side of the cut.
  await expect
    .poll(
      async () =>
        video.evaluate((node) => {
          const film = node as HTMLVideoElement;
          return film.currentTime >= 5.5 && !film.paused;
        }),
      { timeout: 2_500 },
    )
    .toBe(true);
});
