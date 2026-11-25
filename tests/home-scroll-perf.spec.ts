import { expect, test } from "./fixtures";

test("phones load the 720p hero cut, not the 1080p master", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const hits: string[] = [];
  page.on("response", (response) => {
    const url = response.url();
    if (/\/media\/hero(-mobile)?\.(mp4|webm)$/.test(url) && response.ok()) hits.push(url);
  });
  await page.goto("./?film=1");
  await expect.poll(() => page.locator("#hero video").count(), { timeout: 15_000 }).toBe(1);
  await expect.poll(() => hits.some((url) => /hero-mobile\.mp4/.test(url)), { timeout: 15_000 }).toBe(true);
  expect(hits.some((url) => /\/media\/hero\.mp4$/.test(url))).toBe(false);
  expect(hits.some((url) => /\/media\/hero\.webm$/.test(url))).toBe(false);
});

test("desktop hero film freezes on the first wheel notch", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./?film=1");
  const video = page.locator("#hero video");
  await expect.poll(() => video.count(), { timeout: 15_000 }).toBe(1);
  await expect
    .poll(async () => video.evaluate((node) => !(node as HTMLVideoElement).paused), {
      timeout: 15_000,
    })
    .toBe(true);

  await page.mouse.wheel(0, 240);
  await expect
    .poll(async () => {
      return page.evaluate(() => {
        const film = document.querySelector("#hero video") as HTMLVideoElement | null;
        return Boolean(film?.paused && window.scrollY > 24);
      });
    }, { timeout: 8_000 })
    .toBe(true);
});

test("desktop never mounts Lenis on the landing page", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("./");
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("lenis"))).toBe(false);
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.querySelector(".hero-panel-depth")!).backdropFilter)).toBe(
    "none",
  );
});

test("desktop wheel yields atmosphere and ticker, then restores them when idle", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./");
  const track = page.locator(".benefit-track");
  await expect(track).toBeVisible();
  await expect.poll(async () => track.evaluate((node) => getComputedStyle(node).animationPlayState)).toBe(
    "running",
  );

  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("is-scrolling"))).toBe(
    true,
  );
  await expect.poll(async () => track.evaluate((node) => getComputedStyle(node).animationPlayState)).toBe(
    "paused",
  );
  await expect
    .poll(async () =>
      page.locator(".page-atmosphere__floaters").evaluate((node) => getComputedStyle(node).opacity),
    )
    .toBe("0");

  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains("is-scrolling")), {
      timeout: 4_000,
    })
    .toBe(false);
  await expect.poll(async () => track.evaluate((node) => getComputedStyle(node).animationPlayState)).toBe(
    "running",
  );
});
