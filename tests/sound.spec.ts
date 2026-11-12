import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

type Probe = {
  live: boolean;
  muted: boolean;
  volume: number;
  paused: boolean;
  bgGain: number;
  armed: boolean;
  stored: "on" | "off" | null;
};

type PlayCall = { muted: boolean; volume: number };

type HeroVideo = HTMLVideoElement & {
  webkitAudioDecodedByteCount: number;
  captureStream: () => MediaStream;
};

async function probe(page: Page): Promise<Probe> {
  return page.evaluate(() => {
    const read = (window as Window & { __par2playSound?: () => Probe }).__par2playSound;
    if (!read) throw new Error("missing sound probe");
    return read();
  });
}

/** First unmuted play() rejects, later calls use the real media element. */
async function blockFirstUnmutedPlay(page: Page) {
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    const calls: PlayCall[] = [];
    let blocked = false;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      calls.push({ muted: this.muted, volume: this.volume });
      (window as Window & { __playCalls?: PlayCall[] }).__playCalls = calls;
      if (!this.muted && !blocked) {
        blocked = true;
        return Promise.reject(new DOMException("play() blocked", "NotAllowedError"));
      }
      return original.apply(this, arguments);
    };
  });
}

async function playCalls(page: Page): Promise<PlayCall[]> {
  return page.evaluate(() => (window as Window & { __playCalls?: PlayCall[] }).__playCalls ?? []);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("par2play-sound-reset")) return;
    localStorage.removeItem("par2play-sound");
    sessionStorage.setItem("par2play-sound-reset", "1");
  });
});

test("rejected autoplay stays muted until one gesture, then the icon matches", async ({ page }) => {
  await blockFirstUnmutedPlay(page);
  await page.goto("/");

  const sound = page.getByRole("button", { name: /sound/i });
  const video = page.locator("#hero video");

  await expect(sound).toBeVisible({ timeout: 15_000 });
  await expect.poll(async () => (await probe(page)).armed).toBe(true);
  await expect.poll(async () => (await probe(page)).live).toBe(false);
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  await expect.poll(async () => video.evaluate((node) => (node as HTMLVideoElement).muted)).toBe(true);
  await expect(sound.locator("path").nth(1)).toHaveAttribute("d", /10\.2 6\.2/);

  const bootCalls = await playCalls(page);
  expect(bootCalls[0]).toMatchObject({ muted: false, volume: 1 });
  expect(bootCalls.some((call) => call.muted)).toBe(true);

  await page.mouse.click(48, 420);

  await expect.poll(async () => (await probe(page)).live).toBe(true);
  await expect.poll(async () => (await probe(page)).armed).toBe(false);
  await expect(sound).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => video.evaluate((node) => (node as HTMLVideoElement).muted)).toBe(false);
  await expect.poll(async () => video.evaluate((node) => (node as HTMLVideoElement).volume)).toBe(1);

  const gestureCalls = (await playCalls(page)).filter((call) => !call.muted);
  expect(gestureCalls[gestureCalls.length - 1]?.volume).toBe(1);

  await sound.click();
  await expect.poll(async () => (await probe(page)).live).toBe(false);
  await expect.poll(async () => (await probe(page)).stored).toBe("off");
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  await expect(sound.locator("path").nth(1)).toHaveAttribute("d", /10\.2 6\.2/);

  await page.mouse.click(48, 420);
  await page.keyboard.press("a");
  await page.mouse.wheel(0, 240);
  await expect.poll(async () => (await probe(page)).live).toBe(false);
  await expect.poll(async () => video.evaluate((node) => (node as HTMLVideoElement).muted)).toBe(true);

  await page.reload();
  await page.mouse.click(48, 420);
  await page.keyboard.press("a");
  await expect.poll(async () => (await probe(page)).live).toBe(false);
  await expect.poll(async () => (await probe(page)).stored).toBe("off");
  await expect(sound).toHaveAttribute("aria-pressed", "false");
});

test("keydown is enough to unmute inside that gesture", async ({ page }) => {
  await blockFirstUnmutedPlay(page);
  await page.goto("/");
  await expect.poll(async () => (await probe(page)).armed).toBe(true);
  await page.keyboard.press("a");
  await expect.poll(async () => (await probe(page)).live).toBe(true);
  await expect.poll(async () => (await probe(page)).armed).toBe(false);
  const calls = await playCalls(page);
  const last = calls[calls.length - 1];
  expect(last?.muted).toBe(false);
  expect(last?.volume).toBe(1);
});

test("scroll is enough to unmute inside that gesture", async ({ page }) => {
  await blockFirstUnmutedPlay(page);
  await page.goto("/");
  await expect.poll(async () => (await probe(page)).armed).toBe(true);
  await page.mouse.wheel(0, 200);
  await expect.poll(async () => (await probe(page)).live).toBe(true);
  await expect.poll(async () => (await probe(page)).armed).toBe(false);
});

test.describe("touch", () => {
  test.use({ hasTouch: true });

  test("touchstart is enough to unmute inside that gesture", async ({ page }) => {
    await blockFirstUnmutedPlay(page);
    await page.goto("/");
    await expect.poll(async () => (await probe(page)).armed).toBe(true);
    await page.touchscreen.tap(48, 420);
    await expect.poll(async () => (await probe(page)).live).toBe(true);
    await expect.poll(async () => (await probe(page)).armed).toBe(false);
  });
});

test("a stored mute never turns itself back on", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("par2play-sound", "off"));
  await page.goto("/");
  const sound = page.getByRole("button", { name: /sound/i });
  await expect(sound).toBeVisible({ timeout: 15_000 });
  await expect.poll(async () => (await probe(page)).armed).toBe(false);
  await expect.poll(async () => (await probe(page)).live).toBe(false);
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  await page.mouse.click(48, 420);
  await page.keyboard.press("a");
  await page.mouse.wheel(0, 180);
  await expect.poll(async () => (await probe(page)).live).toBe(false);
  await expect(sound).toHaveAttribute("aria-pressed", "false");
});

test("Sound starts with the soundtrack and the loop takes over past the hero", async ({ page }) => {
  const media: string[] = [];
  page.on("response", (response) => {
    const url = response.url();
    if (/hero\.(webm|mp4)|bg_loop_A\.(m4a|mp3)/.test(url)) {
      media.push(`${response.status()} ${url}`);
    }
  });

  await page.goto("/");
  const sound = page.getByRole("button", { name: /sound/i });
  const video = page.locator("#hero video");

  await expect(sound).toBeVisible({ timeout: 15_000 });
  await expect.poll(async () => (await probe(page)).armed || (await probe(page)).live).toBe(true);
  if (!(await probe(page)).live) {
    await page.mouse.click(48, 420);
  }

  await expect(sound).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(async () =>
      video.evaluate((node) => {
        const element = node as HeroVideo;
        return {
          muted: element.muted,
          volume: element.volume,
          paused: element.paused,
          bytes: element.webkitAudioDecodedByteCount,
          src: element.currentSrc,
        };
      }),
    )
    .toMatchObject({ muted: false, volume: 1, paused: false });

  const audible = await video.evaluate((node) => {
    const element = node as HeroVideo;
    const stream = element.captureStream();
    return {
      bytes: element.webkitAudioDecodedByteCount,
      tracks: stream.getAudioTracks().length,
      src: element.currentSrc,
    };
  });
  expect(audible.bytes).toBeGreaterThan(0);
  expect(audible.tracks).toBeGreaterThan(0);
  expect(audible.src).toMatch(/\/par2play-demo\/media\/hero\.(webm|mp4)/);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(async () => (await probe(page)).bgGain, { timeout: 4000 })
    .toBeGreaterThan(0.5);

  const state = await probe(page);
  expect(state.live).toBe(true);
  expect(state.muted).toBe(false);
  expect(media.some((line) => line.startsWith("200") || line.startsWith("206"))).toBe(true);
  expect(media.some((line) => line.startsWith("404"))).toBe(false);
});
