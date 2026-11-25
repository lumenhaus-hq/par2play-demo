import { expect, setDemoLayout, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })));
});

for (const width of [360, 1280]) {
  test(`membership pricing invoice leads the panel at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("membership/");
    if (width === 1280) await setDemoLayout(page, "web");
    const panel = page.locator("#why-membership");
    await expect(page.getByRole("heading", { name: "The membership that rewards your passion more!" })).toBeVisible();
    await expect(page).toHaveTitle("Indoor Golf Membership in Somerset, NJ | Par2Play");
    await expect(panel.getByText("Unlimited Practice", { exact: true }).first()).toBeVisible();
    await expect(panel.locator("[data-invoice-total]")).toHaveText("$200/mo");
    await expect(panel.getByRole("slider")).toHaveCount(0);
    await expect(page.locator("[data-tier]")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Compare price & hours" })).toHaveCount(0);
    await expect(panel.getByText("Bay access")).toHaveCount(0);
    await expect(panel.getByText("Session length")).toHaveCount(0);
    await expect(panel.getByText("Minutes / session")).toHaveCount(0);
    await expect(panel.getByText("Unlimited / mo")).toHaveCount(0);
    await expect(panel.getByRole("button", { name: "10 Sessions", exact: true })).toHaveCount(0);
    await expect(panel.getByLabel("Member benefits")).toHaveCount(0);
    await expect(panel.getByRole("button", { name: /^Monthly/ })).toHaveAttribute("aria-pressed", "true");
    await expect(panel.getByRole("button", { name: "Reserve time & day", exact: true })).toHaveAttribute("aria-expanded", "false");
    await expect(panel.getByRole("link", { name: "Try a free members day", exact: true })).toHaveCount(0);
    await expect(panel.getByRole("heading", { name: "Finalize your booking" })).toHaveCount(0);
    await expect(panel.getByLabel("Name")).toHaveCount(0);
    await expect(panel.getByLabel("Email")).toHaveCount(0);
    await expect(panel.getByLabel("Phone")).toHaveCount(0);
    await expect(panel.getByRole("button", { name: "Confirm booking", exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "compare plans" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "compare plans", exact: true })).toHaveCount(0);
    await expect(page.getByText(/Junior Golf Membership \(\$399/)).toHaveCount(0);
    await expect(page.getByText(/Estimates for bay hours only/)).toHaveCount(0);
  });
}

test("navbar shows Golf for Kids and Book a Bay on mobile widths", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("membership/");
  const header = page.locator("header").first();
  await expect(header.getByRole("link", { name: "Book a Bay", exact: true })).toBeVisible();
  await header.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("navigation", { name: "Page" });
  await expect(menu.getByRole("link", { name: "Golf for Kids", exact: true })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Swing evaluation", exact: true })).toHaveAttribute("href", /\/swing-evaluation\/$/);
});

test("mobile hero keeps membership and phone CTAs visible above the ticker", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await setDemoLayout(page, "mobile");
  const member = page.locator("#hero").getByRole("link", { name: "Free Members’ Day Invite!", exact: true });
  const phone = page.locator("#hero").getByRole("link", { name: "Call us at (732) 448-2769", exact: true });
  await expect(member).toBeVisible();
  await expect(phone).toBeVisible();
  const metrics = await phone.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const memberRect = document.querySelector("#hero .hero-cta-pair a.cta-brand")!.getBoundingClientRect();
    const hero = document.getElementById("hero")!.getBoundingClientRect();
    const dock = document.querySelector("[data-hero-offer]")!.getBoundingClientRect();
    return {
      ctaTop: rect.top,
      ctaBottom: rect.bottom,
      ctaHeight: rect.height,
      memberTop: memberRect.top,
      memberWidth: memberRect.width,
      phoneWidth: rect.width,
      heroTop: hero.top,
      heroHeight: hero.height,
      dockTop: dock.top,
      dockHeight: dock.height,
    };
  });
  // Fully on screen — not a clipped sliver under overflow.
  expect(metrics.ctaHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.memberTop).toBeGreaterThan(metrics.heroTop + metrics.heroHeight * 0.28);
  expect(metrics.ctaBottom).toBeLessThan(metrics.heroTop + metrics.heroHeight - 8);
  expect(Math.abs(metrics.memberWidth - metrics.phoneWidth)).toBeLessThanOrEqual(2);
  // Upper film band stays open for the storefront (dock ≤ ~half the bay).
  expect(metrics.dockTop).toBeGreaterThan(metrics.heroTop + metrics.heroHeight * 0.4);
  expect(metrics.dockHeight).toBeLessThanOrEqual(metrics.heroHeight * 0.58);
});

test("hero CTAs sit side by side and equal width on a wide card", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("./");
  const member = page.locator("#hero").getByRole("link", { name: "Free Members’ Day Invite!", exact: true });
  const phone = page.locator("#hero").getByRole("link", { name: "Call us at (732) 448-2769", exact: true });
  const boxes = await Promise.all([
    member.evaluate((node) => ({ top: node.offsetTop, width: node.offsetWidth, height: node.offsetHeight })),
    phone.evaluate((node) => ({ top: node.offsetTop, width: node.offsetWidth, height: node.offsetHeight })),
  ]);
  const memberBox = boxes[0];
  const phoneBox = boxes[1];
  expect(Math.abs(memberBox.top - phoneBox.top)).toBeLessThanOrEqual(2);
  expect(Math.abs(memberBox.width - phoneBox.width)).toBeLessThanOrEqual(2);
  expect(memberBox.height).toBeGreaterThanOrEqual(44);
  expect(phoneBox.height).toBeGreaterThanOrEqual(44);
});

test("hero shows a Try now cue aimed at Book a Bay", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "web");
  const cue = page.getByTestId("hero-try-now");
  const book = page.locator("header").getByRole("link", { name: "Book a Bay", exact: true });
  await expect(cue).toBeVisible();
  await expect(cue).toContainText("Try now!");
  await expect(cue).toHaveAttribute("aria-hidden", "true");
  await expect(book).toBeVisible();
  const place = await Promise.all([
    cue.boundingBox(),
    book.boundingBox(),
    cue.evaluate((node) => {
      const stroke = node.querySelector(".hero-try-now__stroke") as SVGElement;
      return {
        fontSize: parseFloat(getComputedStyle(node.querySelector(".hero-try-now__label")!).fontSize),
        dotted: getComputedStyle(stroke).strokeDasharray,
        anim: getComputedStyle(stroke).animationName,
        glow: getComputedStyle(node.querySelector(".hero-try-now__arrow")!).filter,
      };
    }),
  ]).then(([cueBox, bookBox, style]) => {
    expect(cueBox).toBeTruthy();
    expect(bookBox).toBeTruthy();
    return {
      midX: cueBox!.x + cueBox!.width / 2,
      midY: cueBox!.y + cueBox!.height / 2,
      bookLeft: bookBox!.x,
      bookRight: bookBox!.x + bookBox!.width,
      bookBottom: bookBox!.y + bookBox!.height,
      ...style,
    };
  });
  // Tucked under Book a Bay — close on X, just below the button.
  expect(place.midX).toBeGreaterThan(place.bookLeft - 48);
  expect(place.midX).toBeLessThan(place.bookRight + 24);
  expect(place.midY).toBeGreaterThan(place.bookBottom - 8);
  expect(place.midY).toBeLessThan(place.bookBottom + 140);
  expect(place.fontSize).toBeGreaterThanOrEqual(18);
  // Solid stroke. No drop-shadow filter: that layer delayed the hero poster paint.
  expect(place.dotted === "none" || place.dotted === "").toBe(true);
  expect(place.glow === "none" || !place.glow.includes("drop-shadow")).toBe(true);
  // Arrow stays static (no dash/draw loop).
  expect(place.anim === "none" || place.anim === "").toBe(true);
});

test("membership scorecard price uses readable large type", async ({ page }) => {
  await page.goto("membership/");
  const figure = page.locator("[data-invoice-total]");
  await expect(figure).toBeVisible();
  const size = await figure.evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
  expect(size).toBeGreaterThanOrEqual(28);
  const title = page.locator(".what-you-get__title").first();
  const titleSize = await title.evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
  expect(titleSize).toBeGreaterThanOrEqual(17);
});

for (const width of [320, 390]) {
  test(`membership and coaching titles wrap inside ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const pages = [
      ["membership/", "The membership that rewards your passion more!"],
      ["coaching/", "Swing your way to your first birdie and hole in one!"],
    ] as const;
    for (const [route, heading] of pages) {
      await page.goto(route);
      const h1 = page.getByRole("heading", { level: 1, name: heading, exact: true });
      await expect(h1).toBeVisible();
      const fit = await h1.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        const lineHeight = parseFloat(style.lineHeight);
        return {
          page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          left: rect.left,
          right: rect.right,
          lines: lineHeight > 0 ? Math.round(rect.height / lineHeight) : 1,
          view: window.innerWidth,
        };
      });
      expect(fit.page).toBeLessThanOrEqual(1);
      expect(fit.left).toBeGreaterThanOrEqual(0);
      expect(fit.right).toBeLessThanOrEqual(fit.view + 1);
      expect(fit.lines).toBeGreaterThan(1);
    }
  });
}

test("coaching and juniors pricing keeps the invoice and drops checkout", async ({ page }) => {
  await page.goto("coaching/");
  await expect(page.getByRole("heading", { name: "Swing your way to your first birdie and hole in one!" })).toBeVisible();
  await expect(page).toHaveTitle("Golf Lessons in Somerset, NJ – PGA Coaches | Par2Play");
  const coaching = page.locator("#coaching-offer");
  await expect(coaching.locator("[data-invoice]")).toBeVisible();
  await expect(coaching.getByRole("heading", { name: "Finalize your booking" })).toHaveCount(0);
  await expect(coaching.getByLabel("Name")).toHaveCount(0);
  await expect(coaching.getByRole("button", { name: "Confirm booking", exact: true })).toHaveCount(0);
  await page.goto("juniors/");
  const juniors = page.locator("#juniors-offer");
  await expect(page.getByRole("heading", { name: "Golf for Kids" })).toBeVisible();
  await expect(juniors.locator("[data-invoice]")).toBeVisible();
  await expect(juniors.getByRole("heading", { name: "Finalize your booking" })).toHaveCount(0);
  await expect(juniors.getByRole("button", { name: "Confirm booking", exact: true })).toHaveCount(0);
});

test("mobile homepage membership uses the golf bento grid", async ({ page }) => {
  // The demo's narrow preview must also work in a wide desktop browser.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("./");
  await setDemoLayout(page, "mobile");
  const band = page.locator("#membership");
  await band.locator(".membership-bento__grid").scrollIntoViewIfNeeded();
  const metrics = await band.evaluate((node) => {
    const grid = node.querySelector(".membership-bento__grid")!;
    const availability = node.querySelector('[aria-label="Preferred availability"]')!;
    const film = node.querySelector(".membership-film")!;
    const tiles = [...grid.querySelectorAll(".membership-bento__tile")].map((tile) =>
      Math.round(tile.getBoundingClientRect().height),
    );
    const gridRect = grid.getBoundingClientRect();
    const filmRect = film.getBoundingClientRect();
    return {
      gridTop: gridRect.top,
      gridBottom: gridRect.bottom,
      availabilityTop: availability.getBoundingClientRect().top,
      filmCount: node.querySelectorAll("video").length,
      tileHeights: tiles,
      viewportHeight: window.innerHeight,
      gridInsideFilm:
        gridRect.top >= filmRect.top - 1 &&
        gridRect.bottom <= filmRect.bottom + 1,
    };
  });
  expect(metrics.availabilityTop).toBeGreaterThanOrEqual(metrics.gridTop);
  await expect(band.locator("video")).toHaveCount(0);
  expect(metrics.gridInsideFilm).toBe(true);
  const [firstHeight, ...restHeights] = metrics.tileHeights;
  expect(firstHeight).toBeGreaterThan(0);
  for (const height of restHeights) {
    expect(Math.abs(height - firstHeight)).toBeLessThanOrEqual(2);
  }
  expect(metrics.gridBottom - metrics.gridTop).toBeLessThanOrEqual(metrics.viewportHeight * 0.72);
  await expect(band.getByLabel("Simulator stats")).toBeVisible();
  await expect(band.getByLabel("Progress")).toBeVisible();
  await expect(band.getByLabel("Preferred availability")).toBeVisible();
  await expect(band.locator(".membership-bento__benefits")).toHaveCount(0);
  await expect(page.locator("#events img")).toHaveCount(0);
  await expect(band.getByRole("link", { name: "Try a free members day", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Around the club" })).toHaveCount(0);
  await page.locator("#coaching").scrollIntoViewIfNeeded();
  await expect(page.locator("#coaching").getByRole("heading", { name: "Get fitted and swinging!" })).toBeVisible();
  await page.locator("#juniors").scrollIntoViewIfNeeded();
  await expect(page.locator("#juniors").getByRole("heading", { name: "Golf for kids" })).toBeVisible();
  await expect(page.locator("#hero").getByRole("link", { name: "Call us at (732) 448-2769", exact: true })).toHaveAttribute("href", "tel:+17324482769");
  await expect(page.locator("#coaching").getByRole("link", { name: "Swing evaluation", exact: true })).toHaveAttribute("href", /\/swing-evaluation\/$/);
  await expect(page.locator("#coaching").getByRole("link", { name: "Lessons", exact: true })).toHaveAttribute("href", /\/coaching\/$/);
  await expect(page.locator("#juniors").getByRole("link", { name: "Become a Junior Member" })).toHaveAttribute("href", /\/juniors\/$/);
  await expect(page.locator("#juniors").getByRole("link", { name: "Experience golf for juniors" })).toHaveAttribute("href", /\/junior-golf-experience\/$/);
});

test("removed sections and junior paragraph stay absent on their pages", async ({ page }) => {
  for (const route of ["membership/", "coaching/", "juniors/", "events/", "tournament/"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Around the club" })).toHaveCount(0);
    await expect(page.getByText(/Junior golf in Somerset is age-group coaching/)).toHaveCount(0);
  }
  await page.goto("coaching/");
  const offer = page.locator("#coaching-offer");
  await expect(offer.getByRole("button", { name: /^10 Pack/ })).toHaveAttribute("aria-pressed", "true");
  await expect(offer.getByRole("button", { name: "Reserve time & day", exact: true })).toBeVisible();
  await expect(offer.getByText(/swing evaluation/i)).toHaveCount(0);
  await expect(page.locator("main").getByRole("link", { name: "Swing evaluation", exact: true })).toBeVisible();
});

test("membership page no longer shows Silver Gold Platinum price cards", async ({ page }) => {
  await page.goto("membership/");
  await expect(page.locator("[data-tier]")).toHaveCount(0);
  await expect(page.getByText("Compare price & hours")).toHaveCount(0);
  await expect(page.getByText(/Silver|Gold|Platinum/)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "compare plans" })).toHaveCount(0);
});

test("header menu is an icon button on phone and desktop", async ({ page }) => {
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("membership/");
    const header = page.locator("header").first();
    const toggle = header.getByRole("button", { name: /menu$/i });
    await expect(header.getByRole("button", { name: "Open menu" })).toBeVisible();
    const box = await toggle.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
    await expect(header.getByRole("link", { name: "Book a Bay", exact: true })).toBeVisible();
    await expect(header.getByRole("link", { name: "Membership", exact: true })).toHaveCount(0);
    await toggle.click();
    await expect(header.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    const menu = header.getByRole("navigation", { name: "Page" });
    await expect(menu.getByRole("link", { name: "Golf for Kids", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(header.getByRole("button", { name: "Open menu" })).toBeFocused();
    await expect(header.getByRole("navigation", { name: "Page" })).toHaveCount(0);
  }
});

test("coaching toggles a 10 pack and a single lesson without fitting copy", async ({ page }) => {
  await page.goto("coaching/");
  const panel = page.locator("#coaching-offer");
  await expect(panel.getByRole("button", { name: /^10 Pack/ })).toHaveAttribute("aria-pressed", "true");
  await expect(panel.locator("[data-invoice-total]")).toHaveText("$750");
  await expect(panel.getByText("10 private lessons", { exact: true })).toBeVisible();
  await expect(panel.locator("dd")).toHaveCount(0);
  await expect(panel.getByRole("slider")).toHaveCount(0);
  await panel.getByRole("button", { name: /^1 Lesson/ }).click();
  await expect(panel.getByRole("button", { name: /^1 Lesson/ })).toHaveAttribute("aria-pressed", "true");
  await expect(panel.locator("[data-invoice-total]")).toHaveText("$100");
  await expect(panel.getByRole("button", { name: "Reserve time & day", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lesson packs" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Club fitting" })).toHaveCount(0);
  await expect(page.getByText(/Nick Schiavo|Nick Monticello/)).toHaveCount(0);
  const imagesOutsidePanel = await page.locator("article img").evaluateAll((nodes) =>
    nodes.filter((node) => !node.closest("#coaching-offer") && !node.closest(".page-atmosphere") && !node.closest(".what-you-get")).length,
  );
  expect(imagesOutsidePanel).toBe(0);
  await expect(page.getByText(/never expire|no blackout|plan for what to change/i)).toHaveCount(0);
});
