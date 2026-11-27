import { devices } from "@playwright/test";
import { expect, test } from "./fixtures";

test.use({
  ...devices["Pixel 7"],
  viewport: { width: 390, height: 844 },
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "p2p_consent",
      JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() }),
    );
    const original = EventTarget.prototype.addEventListener;
    const flagged: { type: string; passive: boolean | null }[] = [];
    EventTarget.prototype.addEventListener = function addEventListener(type, listener, options) {
      const passive = options && typeof options === "object" ? options.passive : undefined;
      const blocksScroll = type === "touchstart" || type === "touchmove" || type === "wheel" || type === "scroll";
      if (blocksScroll && passive !== true) flagged.push({ type, passive: passive ?? null });
      return original.call(this, type, listener, options);
    };
    (window as unknown as { __nonpassive: typeof flagged }).__nonpassive = flagged;
  });
});

test("coarse pointers keep native scroll and passive touch listeners", async ({ page }) => {
  await page.goto("./");
  const pointer = await page.evaluate(() => ({
    coarse: window.matchMedia("(pointer: coarse)").matches,
    hoverNone: window.matchMedia("(hover: none)").matches,
  }));
  expect(pointer.coarse || pointer.hoverNone).toBe(true);
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("lenis"))).toBe(false);
  const flagged = await page.evaluate(() => {
    const entries = (window as unknown as { __nonpassive?: { type: string; passive: boolean | null }[] }).__nonpassive ?? [];
    return entries;
  });
  const blocking = flagged.filter((entry) => {
    if (entry.type === "touchstart" || entry.type === "touchmove" || entry.type === "wheel") return entry.passive !== true;
    return entry.type === "scroll" && entry.passive === false;
  });
  expect(blocking).toEqual([]);
});

test("membership band is a still and never requests the montage", async ({ page }) => {
  await page.goto("./");
  const still = page.locator("#membership img[alt='Golfers on a simulator at Par2Play']");
  await expect(still).toHaveCount(1);
  await expect(still).toHaveAttribute("width", "1280");
  await expect(still).toHaveAttribute("height", "720");
  await expect(page.locator("#membership video")).toHaveCount(0);
  await page.locator("#membership").evaluate((node) => node.scrollIntoView({ block: "start" }));
  await expect(page.locator("#membership video")).toHaveCount(0);
  const requested = await page.evaluate(() =>
    performance.getEntriesByType("resource").some((entry) => /montage.*\.mp4/.test(entry.name)),
  );
  expect(requested).toBe(false);
  await page.locator("#coaching").evaluate((node) => node.scrollIntoView({ block: "center" }));
  await expect(page.locator("#coaching video")).toHaveCount(0);
  const afterCoaching = await page.evaluate(() =>
    performance.getEntriesByType("resource").some((entry) => /montage.*\.mp4/.test(entry.name)),
  );
  expect(afterCoaching).toBe(false);
});

test("hamburger stays inset and the try-now tip meets Book a Bay", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const header = page.locator("header").first();
  const menu = header.getByRole("button", { name: "Open menu" });
  const book = header.getByRole("link", { name: "Book a Bay", exact: true });
  await expect(menu).toBeVisible();
  const menuBox = await menu.boundingBox();
  const bookBox = await book.boundingBox();
  expect(menuBox).toBeTruthy();
  expect(bookBox).toBeTruthy();
  expect(Math.round(menuBox!.width)).toBeGreaterThanOrEqual(44);
  expect(Math.round(menuBox!.height)).toBeGreaterThanOrEqual(44);
  expect(390 - (menuBox!.x + menuBox!.width)).toBeGreaterThanOrEqual(12);

  const tip = page.locator("[data-arrow-tip]");
  await expect(tip).toBeAttached();
  const tipBox = await tip.boundingBox();
  expect(tipBox).toBeTruthy();
  const cx = tipBox!.x + tipBox!.width / 2;
  const cy = tipBox!.y + tipBox!.height / 2;
  const slack = 18;
  expect(cx).toBeGreaterThanOrEqual(bookBox!.x - slack);
  expect(cx).toBeLessThanOrEqual(bookBox!.x + bookBox!.width + slack);
  expect(cy).toBeGreaterThanOrEqual(bookBox!.y - slack);
  expect(cy).toBeLessThanOrEqual(bookBox!.y + bookBox!.height + slack);
});

function channel(color: string) {
  const match = color.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const parts = match[1]!.split(",").map((part) => Number.parseFloat(part.trim()));
  return parts.length >= 3 ? (parts.slice(0, 3) as [number, number, number]) : null;
}

function contrast(foreground: string, background: string) {
  const paint = (rgb: [number, number, number]) => {
    const linear = rgb.map((value) => {
      const channel = value / 255;
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
  };
  const fg = channel(foreground);
  const bg = channel(background);
  if (!fg || !bg) return 0;
  const [hi, lo] = [paint(fg), paint(bg)].sort((a, b) => b - a);
  return (hi! + 0.05) / (lo! + 0.05);
}

for (const width of [360, 390]) {
  test(`hero CTAs stay equal, readable, and tappable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    const hero = page.locator("#hero");
    const member = hero.getByRole("link", { name: "Experience a Member's Day", exact: true });
    const phone = hero.getByRole("link", { name: "Call us at (732) 448-2769", exact: true });
    await expect(member).toBeVisible();
    await expect(phone).toHaveAttribute("href", "tel:+17324482769");
    const metrics = await phone.evaluate((node) => {
      const label = node.querySelector(".hero-call-label") as HTMLElement;
      const number = node.querySelector(".hero-call-number") as HTMLElement;
      const memberNode = document.querySelector("#hero .hero-cta-pair a.cta-brand") as HTMLElement;
      const phoneBox = node.getBoundingClientRect();
      const memberBox = memberNode.getBoundingClientRect();
      const styles = getComputedStyle(node);
      const labelStyles = getComputedStyle(label);
      return {
        color: styles.color,
        background: styles.backgroundColor,
        memberColor: getComputedStyle(memberNode).color,
        memberBackground: getComputedStyle(memberNode).backgroundColor,
        fontSize: Number.parseFloat(labelStyles.fontSize),
        numberNowrap: getComputedStyle(number).whiteSpace,
        lines: [...label.getClientRects()].length,
        phoneWidth: phoneBox.width,
        memberWidth: memberBox.width,
        phoneHeight: (node as HTMLElement).offsetHeight,
        memberHeight: memberNode.offsetHeight,
        overflow: node.scrollWidth - node.clientWidth,
      };
    });
    expect(metrics.fontSize).toBeGreaterThanOrEqual(16);
    expect(metrics.numberNowrap).toBe("nowrap");
    expect(metrics.lines).toBeLessThanOrEqual(2);
    expect(metrics.overflow).toBeLessThanOrEqual(1);
    expect(metrics.phoneHeight).toBeGreaterThanOrEqual(44);
    expect(metrics.memberHeight).toBeGreaterThanOrEqual(44);
    expect(Math.abs(metrics.phoneWidth - metrics.memberWidth)).toBeLessThanOrEqual(2);
    expect(contrast(metrics.color, metrics.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(metrics.memberColor, metrics.memberBackground)).toBeGreaterThanOrEqual(4.5);
    await phone.evaluate((node: HTMLElement) => {
      node.focus({ focusVisible: true } as FocusOptions);
    });
    const ring = await phone.evaluate((node) => getComputedStyle(node).boxShadow);
    expect(ring).not.toBe("none");
  });
}
