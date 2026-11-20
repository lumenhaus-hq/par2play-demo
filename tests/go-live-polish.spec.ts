import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const EVENTS = "https://par2play.oclock.app/events";
const ASK = "Questions? Ask us anything (732) 448-2769";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })));
  await page.emulateMedia({ reducedMotion: "reduce" });
});

function contrastRatio(fg: number[], bg: number[]) {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const lum = (rgb: number[]) => 0.2126 * channel(rgb[0]!) + 0.7152 * channel(rgb[1]!) + 0.0722 * channel(rgb[2]!);
  const lighter = Math.max(lum(fg), lum(bg));
  const darker = Math.min(lum(fg), lum(bg));
  return (lighter + 0.05) / (darker + 0.05);
}

async function askLinkContrast(page: Page, selector: string) {
  return page.locator(selector).evaluate((node) => {
    const parse = (value: string) => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match?.[1]) return null;
      const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
      const alpha = parts.length === 4 ? parts[3]! : 1;
      return { rgb: parts.slice(0, 3), alpha };
    };
    if (node instanceof HTMLElement) node.focus({ focusVisible: true });
    const color = parse(getComputedStyle(node).color);
    let current: Element | null = node;
    let background: { rgb: number[]; alpha: number } | null = null;
    while (current) {
      const next = parse(getComputedStyle(current).backgroundColor);
      if (next && next.alpha >= 0.9) {
        background = next;
        break;
      }
      current = current.parentElement;
    }
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return {
      fg: color?.rgb ?? null,
      bg: background?.rgb ?? null,
      underline: style.textDecorationLine,
      shadow: style.boxShadow,
      height: rect.height,
    };
  });
}

test("scorecards drop the eyebrow and say You pay", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["coaching/", "juniors/", "events/"]) {
    await page.goto(route);
    await expect(page.getByText(/^scorecard$/i)).toHaveCount(0);
    await expect(page.getByText("On the card")).toHaveCount(0);
    await expect(page.locator("[data-invoice]")).toContainText("You pay");
  }
  await page.goto("membership/");
  await expect(page.getByText(/^scorecard$/i)).toHaveCount(0);
  await expect(page.getByText("On the card")).toHaveCount(0);
  await expect(page.locator("[data-invoice]")).toContainText("Members price");
  await page.goto("swing-evaluation/");
  await expect(page.getByText(/^scorecard$/i)).toHaveCount(0);
  await expect(page.locator("[data-invoice]")).toContainText("You pay");
  await expect(page.locator("[data-invoice-total]")).toHaveText("$100");
});

test("ask-us link sits under booking CTAs and clears WCAG AA", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const routes = ["membership/", "coaching/", "juniors/", "swing-evaluation/", "events/", "tournament/", "members-day/", "junior-golf-experience/"];
  for (const route of routes) {
    await page.goto(route);
    const link = page.locator("[data-ask-us]");
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute("href", "tel:+17324482769");
    await expect(link).toHaveText(ASK);
    const booking = page.locator("[data-reserve-trigger]").first();
    const order = await page.locator("main").evaluate(() => {
      const root = document.querySelector("main");
      if (!root) return [-1, -1];
      const all = [...root.querySelectorAll("*")];
      const cta = root.querySelector("[data-reserve-trigger]");
      const ask = root.querySelector("[data-ask-us]");
      return [cta ? all.indexOf(cta) : -1, ask ? all.indexOf(ask) : -1];
    });
    expect(order[0]).toBeGreaterThanOrEqual(0);
    expect(order[1]).toBeGreaterThan(order[0]!);
    await link.focus();
    const metrics = await askLinkContrast(page, "[data-ask-us]");
    expect(metrics.fg).toBeTruthy();
    expect(metrics.bg).toBeTruthy();
    expect(contrastRatio(metrics.fg!, metrics.bg!)).toBeGreaterThanOrEqual(4.5);
    expect(metrics.underline).toContain("underline");
    expect(metrics.shadow).not.toBe("none");
    expect(metrics.height).toBeGreaterThanOrEqual(44);
    await expect(booking).toBeVisible();
  }

  await page.goto("./");
  const home = page.locator("#membership [data-ask-us]");
  await home.scrollIntoViewIfNeeded();
  await expect(home).toHaveAttribute("href", "tel:+17324482769");
  await expect(home).toHaveText(ASK);
  const homeOrder = await page.locator("#membership").evaluate((node) => {
    const all = [...node.querySelectorAll("*")];
    const title = node.querySelector("h2");
    const grid = node.querySelector(".membership-bento__grid");
    const cta = node.querySelector(".membership-film__intro a");
    const ask = node.querySelector("[data-ask-us]");
    return [title, grid, cta, ask].map((item) => (item ? all.indexOf(item) : -1));
  });
  for (const index of homeOrder) expect(index).toBeGreaterThanOrEqual(0);
  for (let i = 1; i < homeOrder.length; i++) expect(homeOrder[i]).toBeGreaterThan(homeOrder[i - 1]!);
  await home.focus();
  const homeMetrics = await askLinkContrast(page, "#membership [data-ask-us]");
  expect(contrastRatio(homeMetrics.fg!, homeMetrics.bg!)).toBeGreaterThanOrEqual(4.5);
  expect(homeMetrics.underline).toContain("underline");
  expect(homeMetrics.height).toBeGreaterThanOrEqual(44);
});

test("subpage titles clear the sticky header and use the swoosh", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("coaching/");
  const gap = await page.evaluate(() => {
    const header = document.querySelector("header");
    const title = document.querySelector("h1");
    if (!header || !title) return -1;
    return title.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
  });
  expect(gap).toBeGreaterThanOrEqual(8);
  const title = page.getByRole("heading", { name: "Swing your way to your first birdie and hole in one!", exact: true });
  await expect(title).toBeVisible();
  const titleFace = await title.evaluate((node) => {
    const accent = node.querySelector(".display-title__accent");
    return {
      label: node.getAttribute("aria-label"),
      accentFont: accent ? getComputedStyle(accent).fontFamily : "",
      shadow: getComputedStyle(node).textShadow,
      swoosh: node.querySelectorAll(".display-swoosh").length,
    };
  });
  expect(titleFace.label).toBe("Swing your way to your first birdie and hole in one!");
  expect(titleFace.accentFont.toLowerCase()).toContain("marker");
  expect(titleFace.shadow).not.toBe("none");
  expect(titleFace.swoosh).toBe(1);
  const motion = await title.evaluate((node) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return { reduce, animation: getComputedStyle(node).animationName };
  });
  expect(motion.reduce).toBe(true);
  expect(motion.animation === "none" || motion.animation === "").toBe(true);
});

test("subpage titles reuse the home section glow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.locator("#coaching").scrollIntoViewIfNeeded();
  const homeGlow = await page.locator("#coaching h2").evaluate((node) => getComputedStyle(node).textShadow);
  const darkGlow = await page.locator("section.bg-void h2").evaluate((node) => getComputedStyle(node).textShadow);
  const pages = [
    ["membership/", "The membership that rewards your passion more!", homeGlow],
    ["coaching/", "Swing your way to your first birdie and hole in one!", homeGlow],
    ["swing-evaluation/", "Swing evaluation", homeGlow],
    ["juniors/", "Golf for Kids", homeGlow],
    ["events/", "Golf simulator parties and events", homeGlow],
    ["tournament/", "Par2Play Fall League", darkGlow],
  ] as const;
  for (const [route, name, glow] of pages) {
    await page.goto(route);
    const title = page.getByRole("heading", { level: 1, name, exact: true });
    const style = await title.evaluate((node) => {
      const computed = getComputedStyle(node);
      const accent = node.querySelector(".display-title__accent");
      const rect = node.getBoundingClientRect();
      return {
        shadow: computed.textShadow,
        accent: accent ? getComputedStyle(accent).fontFamily : "",
        page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        right: rect.right,
        view: window.innerWidth,
      };
    });
    expect(style.shadow).toBe(glow);
    expect(style.accent.toLowerCase()).toContain("marker");
    expect(style.page).toBeLessThanOrEqual(1);
    expect(style.right).toBeLessThanOrEqual(style.view + 1);
  }
});

test("home section titles use the same display treatment", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const sections = [
    ["Membership", "#membership"],
    ["Get fitted and swinging!", "#coaching"],
    ["Golf for kids", "#juniors"],
    ["Events", "#events"],
    ["Your bay is waiting.", "section.bg-void"],
  ] as const;
  for (const [name, selector] of sections) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    const heading = page.locator(selector).getByRole("heading", { name, exact: true });
    await expect(heading).toHaveClass(/display-title/);
    const face = await heading.evaluate((node) => {
      const accent = node.querySelector(".display-title__accent");
      return {
        font: accent ? getComputedStyle(accent).fontFamily.toLowerCase() : "",
        label: node.getAttribute("aria-label"),
      };
    });
    expect(face.font).toContain("marker");
    expect(face.label).toBe(name);
  }
});

test("try now arrow hides after one scroll and stays hidden", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const cue = page.getByTestId("hero-try-now");
  await expect(cue).toBeVisible();
  await expect(cue).toHaveAttribute("data-retired", "false");
  await page.evaluate(() => window.scrollTo(0, 480));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(40);
  await expect(cue).toHaveAttribute("data-retired", "true");
  await expect(cue).toHaveCSS("opacity", "0");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(8);
  await expect(cue).toHaveAttribute("data-retired", "true");
  await expect(cue).toHaveCSS("opacity", "0");
});

test("events offers 2, 3, and 6 hours at price on request", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("events/");
  await expect(page.locator("input[type=range]")).toHaveCount(0);
  await expect(page.locator(".pace-slider")).toHaveCount(0);
  const panel = page.locator("#events-offer");
  await expect(panel.getByRole("button", { name: "2 hours, Price on request" })).toHaveAttribute("aria-pressed", "true");
  await expect(panel.getByRole("button", { name: "3 hours, Price on request" })).toBeVisible();
  await expect(panel.getByRole("button", { name: "6 hours, Price on request" })).toBeVisible();
  const invoice = panel.locator("[data-invoice]");
  await expect(invoice.locator("[data-invoice-total]")).toHaveText("Price on request");
  await expect(invoice).toContainText("You pay");
  await expect(invoice).not.toContainText("$");
  const booking = panel.getByRole("button", { name: "Reserve time & day", exact: true });
  await expect(booking).toHaveAttribute("aria-expanded", "false");
  await booking.click();
  await panel.getByLabel("Start date").fill("2026-12-01");
  await panel.getByLabel("First name").fill("Ada");
  await panel.getByLabel("Last name").fill("Lovelace");
  const purchase = panel.getByRole("link", { name: "Complete Purchase", exact: true });
  await expect(purchase).toHaveAttribute("href", EVENTS);
  await expect(purchase).toHaveAttribute("data-offer", "group");
  await panel.getByRole("button", { name: "6 hours, Price on request" }).click();
  await expect(invoice).toContainText("6 hours");
  await expect(invoice.locator("[data-invoice-total]")).toHaveText("Price on request");
  await expect(panel.getByRole("link", { name: "Complete Purchase", exact: true })).toHaveAttribute("href", EVENTS);
  await expect(page.locator(".what-you-get__card")).toHaveCount(4);
  const order = await page.locator("main").evaluate((node) => {
    const all = [...node.querySelectorAll("*")];
    return ["[data-price-options]", "[data-invoice]", "[data-reserve-trigger]", "[data-ask-us]", "[data-what-you-get]"].map((sel) => {
      const match = node.querySelector(sel);
      return match ? all.indexOf(match) : -1;
    });
  });
  for (let i = 1; i < order.length; i++) expect(order[i]).toBeGreaterThan(order[i - 1]!);
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(extra).toBeLessThanOrEqual(1);
});

test("membership what you get uses the four promised lines", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("membership/");
  const cards = page.locator(".what-you-get__card");
  await expect(cards).toHaveCount(4);
  await expect(cards.nth(0)).toContainText("Ease of Mind");
  await expect(cards.nth(0)).toContainText("One simple $200/mo plan. No surprises.");
  await expect(cards.nth(1)).toContainText("Flexible Schedule");
  await expect(cards.nth(1)).toContainText("Open 10am–10pm daily, up to an hour a day.");
  await expect(cards.nth(2)).toContainText("Top Equipment");
  await expect(cards.nth(2)).toContainText("Premium clubs are on hand.");
  await expect(cards.nth(3)).toContainText("Awesome Gaming Tech");
  await expect(cards.nth(3)).toContainText("Full Swing simulators, 100+ courses, and shot analytics.");
  await expect(cards.locator("img")).toHaveCount(4);
});

test("10 pack toggle shows a 25% savings sticker that stays inside the card", async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("coaching/");
    const pack = page.getByRole("button", { name: "10 Pack, $750" });
    await expect(pack).toBeVisible();
    await expect(pack).toContainText("Save 25% with 10 pack");
    await expect(pack).toHaveAccessibleDescription("Save 25% with 10 pack");
    await expect(pack.locator(".joint-toggle__spark")).toBeVisible();
    await expect(page.getByRole("button", { name: "1 Lesson, $100" })).not.toContainText("Save 25%");
    const fit = await pack.locator(".joint-toggle__badge").evaluate((node) => {
      const button = node.closest("button");
      if (!button) return null;
      const badge = node.getBoundingClientRect();
      const box = button.getBoundingClientRect();
      return {
        right: badge.right - box.right,
        left: box.left - badge.left,
        top: box.top - badge.top,
        bottom: badge.bottom - box.bottom,
        pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(fit).toBeTruthy();
    expect(fit!.right).toBeLessThanOrEqual(1);
    expect(fit!.left).toBeLessThanOrEqual(1);
    expect(fit!.top).toBeLessThanOrEqual(1);
    expect(fit!.bottom).toBeLessThanOrEqual(1);
    expect(fit!.pageOverflow).toBeLessThanOrEqual(1);
  }
});
