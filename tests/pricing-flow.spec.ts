import type { Locator, Page } from "@playwright/test";
import { expect, siteHref, test } from "./fixtures";

const BAY = "https://par2play.oclock.app/book?flow=flow_bf_bay_rental";
const LESSONS = "https://par2play.oclock.app/book?flow=flow_bf_lessons";
const PACKS = "https://par2play.oclock.app/store/prod_lesson_packs";
const UNLIMITED = "https://par2play.oclock.app/store/prod_practice_unlimited";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })));
  await page.emulateMedia({ reducedMotion: "reduce" });
});

async function expectOrder(section: Locator, selectors: string[]) {
  const indexes = await section.evaluate((node, sels) => {
    const all = [...node.querySelectorAll("*")];
    return sels.map((sel) => {
      const match = node.querySelector(sel);
      return match ? all.indexOf(match) : -1;
    });
  }, selectors);
  for (const index of indexes) expect(index).toBeGreaterThanOrEqual(0);
  for (let i = 1; i < indexes.length; i++) expect(indexes[i]).toBeGreaterThan(indexes[i - 1]!);
}

async function expectEqualChoice(section: Locator) {
  const widths = await section.locator("[data-price-options] button").evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().width)),
  );
  expect(widths.length).toBeGreaterThanOrEqual(2);
  for (const width of widths.slice(1)) expect(Math.abs(width - widths[0]!)).toBeLessThanOrEqual(2);
}

async function expectNoHorizontalOverflow(page: Page) {
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(extra).toBeLessThanOrEqual(1);
}

test("index CTAs open subpages and the header Book a Bay stays on GolfClock", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");

  const headerBook = page.locator("header").getByRole("link", { name: "Book a Bay", exact: true });
  await expect(headerBook).toHaveAttribute("href", BAY);
  await expect(headerBook).toHaveAttribute("target", "_blank");

  await expect(page.locator("#hero").getByRole("link", { name: "Call us at (732) 448-2769", exact: true })).toHaveAttribute(
    "href",
    "tel:+17324482769",
  );

  const membership = page.locator("#membership");
  await expect(membership.getByRole("link", { name: "Become a Member", exact: true })).toHaveAttribute("href", siteHref("membership/"));
  await expect(membership.getByRole("link", { name: "Try a free members day", exact: true })).toHaveAttribute(
    "href",
    siteHref("members-day/"),
  );

  const coaching = page.locator("#coaching");
  const swing = coaching.getByRole("link", { name: "Swing evaluation", exact: true });
  const lessons = coaching.getByRole("link", { name: "Lessons", exact: true });
  await expect(swing).toHaveAttribute("href", siteHref("swing-evaluation/"));
  await expect(lessons).toHaveAttribute("href", siteHref("coaching/"));
  const homeCtas = await Promise.all([swing.boundingBox(), lessons.boundingBox()]);
  expect(homeCtas[0]?.width).toBeGreaterThan(40);
  expect(Math.abs((homeCtas[0]?.width ?? 0) - (homeCtas[1]?.width ?? 0))).toBeLessThanOrEqual(2);

  const juniors = page.locator("#juniors");
  await expect(juniors.getByRole("link", { name: "Become a Junior Member", exact: true })).toHaveAttribute("href", siteHref("juniors/"));
  await expect(juniors.getByRole("link", { name: "Experience a Junior Class", exact: true })).toHaveAttribute("href", siteHref("juniors/"));

  const events = page.locator("#events");
  await expect(events.getByRole("link", { name: "See events", exact: true })).toHaveAttribute("href", siteHref("events/"));
  await expect(events.getByRole("link", { name: "Check availability", exact: true })).toHaveAttribute("href", siteHref("events/"));

  const closing = page.locator("section").filter({ has: page.getByRole("heading", { name: "Your bay is waiting." }) });
  await expect(closing.getByRole("link", { name: "Become a Member", exact: true })).toHaveAttribute("href", siteHref("membership/"));
  const closingBay = closing.getByRole("link", { name: "Book a Bay", exact: true });
  await expect(closingBay).toHaveAttribute("href", "#hero");
  await expect(closingBay).not.toHaveAttribute("target", "_blank");

  await expect(page.locator("#tournament").getByRole("button", { name: "Reserve your tournament spot", exact: true })).toBeVisible();
  await expect(page.locator('a[href*="par2play.oclock.app"]')).toHaveCount(1);
  await expectNoHorizontalOverflow(page);
});

test("membership pricing is title, bento, toggles, invoice, then Complete booking", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("membership/");
  const article = page.locator("main > article");
  await expectOrder(article, ["h1", "[data-price-options]", "[data-invoice]", "a.cta-shell", "[data-what-you-get]"]);
  await expect(article.locator(".play-lead")).toHaveCount(0);
  await expect(article.locator(".page-bento")).toHaveCount(0);
  await expect(article.locator(".what-you-get__card")).toHaveCount(4);
  const columns = await article.locator(".what-you-get__grid").evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(2);
  await expect(page.getByText(/ord_p2p/)).toHaveCount(0);
  await expect(article.locator("[data-invoice]")).toHaveCount(1);
  await expect(article.locator("[data-invoice-total]")).toHaveCount(1);
  await expect(page.locator("[data-price-card]")).toHaveCount(0);
  const panel = page.locator("#why-membership");
  const invoice = panel.locator("[data-invoice]");
  await expect(invoice).toHaveAttribute("aria-live", "polite");
  await expect(invoice.locator("[data-invoice-total]")).toHaveText("$200/mo");
  await expect(invoice.locator("[data-members-price]")).toHaveAttribute("data-members-price", "200");
  await expect(invoice).toContainText("Members price");
  await expect(invoice).toContainText("Practice Unlimited (monthly)");
  await expect(invoice).toContainText("Monthly");
  const amounts = await invoice.innerText().then((text) =>
    [...text.matchAll(/\$([0-9,]+)/g)].map((match) => Number(match[1]!.replace(/,/g, ""))),
  );
  expect(amounts.length).toBeGreaterThan(0);
  for (const amount of amounts) expect(amount).toBeGreaterThanOrEqual(200);
  await expect(panel.getByRole("button", { name: /^Monthly/ })).toHaveAttribute("aria-pressed", "true");
  await expect(panel.getByRole("link", { name: "Complete booking", exact: true })).toHaveAttribute("href", UNLIMITED);
  await expect(panel.getByRole("link", { name: "Become a Member", exact: true })).toHaveCount(0);
  await expect(panel.locator("input")).toHaveCount(0);
  await expect(panel.locator("form")).toHaveCount(0);
  await expectEqualChoice(panel);

  await panel.getByRole("button", { name: /^Year/ }).click();
  await expect(invoice.locator("[data-invoice-total]")).toHaveText("$2,400/yr");
  await expect(invoice.locator("[data-members-price]")).toHaveAttribute("data-members-price", "2400");
  await expect(invoice).toContainText("Twelve months");
  await expect(panel.getByRole("link", { name: "Complete booking", exact: true })).toHaveAttribute("href", UNLIMITED);
  const yearAmounts = await invoice.innerText().then((text) =>
    [...text.matchAll(/\$([0-9,]+)/g)].map((match) => Number(match[1]!.replace(/,/g, ""))),
  );
  expect(yearAmounts).toContain(2400);
  for (const amount of yearAmounts) expect(amount).toBeGreaterThanOrEqual(200);
  await expectNoHorizontalOverflow(page);
});

test("coaching invoice and Complete booking follow the selected lesson", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("coaching/");
  const article = page.locator("main > article");
  await expectOrder(article, ["h1", "[data-price-options]", "[data-invoice]", "a.cta-shell", "[data-what-you-get]"]);
  await expect(article.locator(".play-lead")).toHaveCount(0);
  await expect(article.locator(".page-bento")).toHaveCount(0);
  await expect(article.locator(".what-you-get__card")).toHaveCount(4);
  const columns = await article.locator(".what-you-get__grid").evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(2);
  await expect(page.getByText(/ord_p2p/)).toHaveCount(0);
  await expect(article.locator("[data-invoice]")).toHaveCount(1);
  await expect(page.locator("[data-price-card]")).toHaveCount(0);
  const panel = page.locator("#coaching-offer");
  const invoice = panel.locator("[data-invoice]");
  const booking = panel.getByRole("link", { name: "Complete booking", exact: true });
  await expect(invoice).toHaveAttribute("aria-live", "polite");
  await expect(panel.getByRole("button", { name: /^10 Pack/ })).toHaveAttribute("aria-pressed", "true");
  await expect(invoice.locator("[data-invoice-total]")).toHaveText("$750");
  await expect(invoice).toContainText("10 private lessons");
  await expect(booking).toHaveAttribute("href", PACKS);
  await expect(booking).toHaveAttribute("data-offer", "lesson-pack");
  await expectEqualChoice(panel);

  await panel.getByRole("button", { name: /^10 Pack/ }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(panel.getByRole("button", { name: /^1 Lesson/ })).toHaveAttribute("aria-pressed", "true");
  await expect(invoice.locator("[data-invoice-total]")).toHaveText("$100");

  await panel.getByRole("button", { name: /^1 Lesson/ }).click();
  await expect(invoice.locator("[data-invoice-total]")).toHaveText("$100");
  await expect(invoice).toContainText("Single lesson");
  await expect(invoice).toContainText("30 minutes");
  await expect(booking).toHaveAttribute("href", LESSONS);
  await expect(booking).toHaveAttribute("data-offer", "lesson");
  await expect(panel.getByText(/swing evaluation/i)).toHaveCount(0);
  await expect(panel.getByRole("link", { name: "Book swing evaluation" })).toHaveCount(0);
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(jsonLd.join(" ").toLowerCase()).not.toContain("swing evaluation");
  await expect(panel.locator("form")).toHaveCount(0);
  await expect(panel.locator("input")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test("juniors invoice follows the weekly option and Complete booking uses the lessons flow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("juniors/");
  const article = page.locator("main > article");
  await expectOrder(article, ["h1", "[data-price-options]", "[data-invoice]", "a.cta-shell", "[data-what-you-get]"]);
  await expect(article.locator(".play-lead")).toHaveCount(0);
  await expect(article.locator(".page-bento")).toHaveCount(0);
  await expect(article.locator(".what-you-get__card")).toHaveCount(4);
  const columns = await article.locator(".what-you-get__grid").evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(2);
  await expect(page.getByText(/ord_p2p/)).toHaveCount(0);
  await expect(article.locator("[data-invoice]")).toHaveCount(1);
  await expect(page.locator("[data-price-card]")).toHaveCount(0);
  const panel = page.locator("#juniors-offer");
  const invoice = panel.locator("[data-invoice]");
  const booking = panel.getByRole("link", { name: "Complete booking", exact: true });
  await expect(invoice).toHaveAttribute("aria-live", "polite");
  await expect(panel.getByRole("button", { name: "Twice a week" })).toHaveAttribute("aria-pressed", "true");
  await expect(invoice.locator("[data-invoice-total]")).toHaveText("$399/mo");
  await expect(invoice).toContainText("Monthly");
  await expect(booking).toHaveAttribute("href", LESSONS);
  await expect(booking).toHaveAttribute("data-offer", "junior-plus");
  await expectEqualChoice(panel);

  await panel.getByRole("button", { name: "Once a week" }).click();
  await expect(invoice.locator("[data-invoice-total]")).toHaveText("$249/mo");
  await expect(invoice).toContainText("Once a week");
  await expect(booking).toHaveAttribute("href", LESSONS);
  await expect(booking).toHaveAttribute("data-offer", "junior");
  await expect(panel.locator("form")).toHaveCount(0);
  await expect(panel.locator("input")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test("swing evaluation page shows the $100 session and one booking link", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("swing-evaluation/");
  const article = page.locator("main > article");
  await expectOrder(article, ["h1", "[data-swing-price]", "a.cta-shell", "[data-what-you-get]"]);
  await expect(article.locator(".play-lead")).toHaveCount(0);
  await expect(article.locator(".what-you-get > p")).toHaveCount(0);
  await expect(article.locator(".what-you-get__card")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Swing evaluation", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What you get", exact: true })).toBeVisible();
  await expect(page.locator("[data-swing-price]")).toHaveText("$100");
  await expect(page.locator(".swing-hero__length")).toHaveText("30 minutes");
  const booking = page.getByRole("link", { name: "Book swing evaluation", exact: true });
  await expect(booking).toHaveCount(1);
  await expect(booking).toHaveAttribute("href", LESSONS);
  await expect(booking).toHaveAttribute("data-offer", "swing-evaluation");
  await expect(page.locator("[data-invoice]")).toHaveCount(0);
  await expect(page.getByText(/ord_p2p/)).toHaveCount(0);
  await expect(page.locator("main").getByText(/Nick Schiavo|Nick Monticello/)).toHaveCount(0);
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(jsonLd.join(" ")).toContain("100");
  expect(jsonLd.join(" ").toLowerCase()).not.toContain("nick ");
  const columns = await article.locator(".what-you-get__grid").evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(2);
  await expectNoHorizontalOverflow(page);
});
