import { expect, setDemoLayout, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })));
});

for (const width of [360, 1280]) {
  test(`membership practice checkout fields work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("membership/");
    if (width === 1280) await setDemoLayout(page, "web");
    const panel = page.locator("#why-membership");
    await expect(panel.getByRole("heading", { name: "Become a Member" })).toBeVisible();
    await expect(panel.getByText("Unlimited Practice", { exact: true }).first()).toBeVisible();
    await expect(panel.locator('[aria-live="polite"] p').last()).toContainText("$200");
    await expect(panel.getByRole("slider")).toHaveCount(0);
    await expect(page.locator("[data-tier]")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Compare price & hours" })).toHaveCount(0);
    await expect(panel.getByText("Bay access")).toHaveCount(0);
    await expect(panel.getByText("Session length")).toHaveCount(0);
    await expect(panel.getByText("Minutes / session")).toHaveCount(0);
    await expect(panel.getByText("Unlimited / mo")).toHaveCount(0);
    await expect(panel.getByRole("button", { name: "10 Sessions", exact: true })).toHaveCount(0);
    await expect(panel.getByLabel("Member benefits")).toBeVisible();
    await expect(panel.getByRole("link", { name: "Become a Member", exact: true })).toBeVisible();
    await expect(panel.getByRole("link", { name: "Experience a free Member Day", exact: true })).toBeVisible();
    await expect(panel.getByRole("heading", { name: "Finalize your booking" })).toBeVisible();
    await expect(panel.getByLabel("Name")).toBeVisible();
    await expect(panel.getByLabel("Email")).toBeVisible();
    await expect(panel.getByLabel("Phone")).toBeVisible();
    await expect(panel.getByLabel("Payments accepted")).toBeVisible();
    await expect(panel.getByRole("button", { name: "Confirm booking", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "compare plans" })).toBeVisible();
    await expect(page.getByRole("link", { name: "compare plans", exact: true })).toBeVisible();
    await expect(page.getByText(/Junior Golf Membership \(\$399/)).toHaveCount(0);
    await expect(page.getByText(/Estimates for bay hours only/)).toHaveCount(0);
  });
}

test("navbar shows Golf for Kids and Book a Bay on mobile widths", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("membership/");
  const header = page.locator("header").first();
  await expect(header.getByRole("link", { name: "Book a Bay", exact: true })).toBeVisible();
  await header.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("navigation", { name: "Page" }).getByRole("link", { name: "Golf for Kids", exact: true })).toBeVisible();
});

test("hero shows a Try now cue aimed at Book a Bay", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "web");
  const cue = page.getByTestId("hero-try-now");
  const book = page.locator("header").getByRole("link", { name: "Book a Bay", exact: true });
  await expect(cue).toBeVisible();
  await expect(cue).toContainText("Try now");
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
  expect(place.dotted).not.toBe("none");
  expect(place.dotted).not.toBe("");
  // Arrow stays static (no dash/draw loop).
  expect(place.anim === "none" || place.anim === "").toBe(true);
});

test("member benefits tiles use readable large type", async ({ page }) => {
  await page.goto("membership/");
  const benefits = page.getByLabel("Member benefits");
  await expect(benefits).toBeVisible();
  const metrics = await benefits.locator(".member-benefits__title").first().evaluate((node) => {
    const styles = getComputedStyle(node);
    const line = node.parentElement?.querySelector(".member-benefits__line");
    const lineColor = line ? getComputedStyle(line).color : "";
    return {
      titleSize: parseFloat(styles.fontSize),
      lineSize: line ? parseFloat(getComputedStyle(line).fontSize) : 0,
      lineColor,
    };
  });
  expect(metrics.titleSize).toBeGreaterThanOrEqual(17);
  expect(metrics.lineSize).toBeGreaterThanOrEqual(15);
});

test("coaching and juniors checkout forms live inside the pricing panel", async ({ page }) => {
  await page.goto("coaching/");
  const coaching = page.locator("#coaching-offer");
  await expect(coaching.getByRole("heading", { name: "Finalize your booking" })).toBeVisible();
  await expect(coaching.getByLabel("Name")).toBeVisible();
  await page.goto("juniors/");
  const juniors = page.locator("#juniors-offer");
  await expect(juniors.getByRole("heading", { name: "Golf for Kids" })).toBeVisible();
  await expect(juniors.getByRole("heading", { name: "Finalize your booking" })).toBeVisible();
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
  expect(metrics.filmCount).toBe(1);
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
  await expect(band.getByRole("link", { name: "Experience a free Member Day", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Around the club" })).toHaveCount(0);
  await expect(page.locator("#coaching").getByRole("heading", { name: "Get fitted and swinging!" })).toBeVisible();
  await expect(page.locator("#juniors").getByRole("heading", { name: "Golf for kids" })).toBeVisible();
  await expect(page.locator("#hero").getByRole("link", { name: "Bay Rental Call Us", exact: true })).toHaveAttribute("href", "tel:+17324482769");
  await expect(page.locator("#coaching").getByRole("link", { name: "Swing eval" })).toHaveAttribute("data-offer", "swing-evaluation");
  await expect(page.locator("#coaching").getByRole("link", { name: "Book a single lesson" })).toHaveAttribute("href", /\/coaching\/$/);
  await expect(page.locator("#juniors").getByRole("link", { name: "Become a Junior Member" })).toHaveAttribute("data-offer", "junior");
  await expect(page.locator("#juniors").getByRole("link", { name: "Experience a Junior Class" })).toHaveAttribute("data-offer", "junior-plus");
});

test("removed sections and junior paragraph stay absent on their pages", async ({ page }) => {
  for (const route of ["membership/", "coaching/", "juniors/", "events/", "tournament/"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Around the club" })).toHaveCount(0);
    await expect(page.getByText(/Junior golf in Somerset is age-group coaching/)).toHaveCount(0);
  }
  await page.goto("coaching/");
  await expect(page.locator("#coaching-offer").getByRole("link", { name: "Swing eval" })).toHaveAttribute("data-offer", "swing-evaluation");
  await expect(page.locator("#coaching-offer").getByRole("link", { name: "Buy 10 Pack" })).toHaveAttribute("data-offer", "lesson-pack");
});

test("membership page no longer shows Silver Gold Platinum price cards", async ({ page }) => {
  await page.goto("membership/");
  await expect(page.locator("[data-tier]")).toHaveCount(0);
  await expect(page.getByText("Compare price & hours")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "compare plans" })).toBeVisible();
});

test("coaching toggles a 10 pack and a single lesson without fitting copy", async ({ page }) => {
  await page.goto("coaching/");
  const panel = page.locator("#coaching-offer");
  await expect(panel.getByRole("button", { name: "10 Pack", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(panel.locator('[aria-live="polite"] p').last()).toHaveText("$750");
  await expect(panel.getByText("Save more by buying a 10 pack.", { exact: true })).toBeVisible();
  await expect(panel.locator("dd")).toHaveCount(0);
  await expect(panel.getByRole("slider")).toHaveCount(0);
  await panel.getByRole("button", { name: "1 Lesson", exact: true }).click();
  await expect(panel.getByRole("button", { name: "1 Lesson", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(panel.locator('[aria-live="polite"] p').last()).toHaveText("$100");
  await expect(panel.getByRole("link", { name: "Book a single lesson" })).toHaveAttribute("data-offer", "lesson");
  await expect(page.getByRole("heading", { name: "Lesson packs" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Club fitting" })).toHaveCount(0);
  await expect(page.getByText(/Nick Schiavo|Nick Monticello/)).toHaveCount(0);
  const imagesOutsidePanel = await page.locator("article img").evaluateAll((nodes) =>
    nodes.filter((node) => !node.closest("#coaching-offer") && !node.closest(".page-atmosphere")).length,
  );
  expect(imagesOutsidePanel).toBe(0);
  await expect(page.getByText(/never expire|no blackout|plan for what to change/i)).toHaveCount(0);
});
