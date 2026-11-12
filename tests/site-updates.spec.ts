import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })));
});

for (const width of [360, 1280]) {
  test(`membership practice toggle and checkout fields work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("membership/");
    if (width === 1280) await page.getByRole("button", { name: "Desktop", exact: true }).click();
    const panel = page.locator("#why-membership");
    await expect(panel.getByRole("button", { name: "Unlimited Practice", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(panel.locator('[aria-live="polite"] p').last()).toContainText("$200");
    await expect(panel.getByRole("slider")).toHaveCount(0);
    await expect(page.locator("[data-tier]")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Compare price & hours" })).toHaveCount(0);
    await panel.getByRole("button", { name: "10 Sessions", exact: true }).click();
    await expect(panel.getByRole("button", { name: "10 Sessions", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(panel.locator('[aria-live="polite"] p').last()).toContainText("$400");
    await expect(page.getByRole("heading", { name: "Finalize your booking" })).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Phone")).toBeVisible();
    await expect(page.getByLabel("Payments accepted")).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirm booking", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "compare plans" })).toBeVisible();
    await expect(page.getByRole("link", { name: "compare plans", exact: true })).toBeVisible();
    await expect(page.getByText(/Junior Golf Membership \(\$399/)).toHaveCount(0);
    await expect(page.getByText(/Estimates for bay hours only/)).toHaveCount(0);
  });
}

test("mobile homepage benefits sit below the film on a solid dark background", async ({ page }) => {
  // The demo's narrow preview must also work in a wide desktop browser.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("./");
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  const band = page.locator("#membership");
  await band.getByRole("heading", { name: "Track your progress" }).scrollIntoViewIfNeeded();
  const metrics = await band.evaluate((node) => {
    const heading = node.querySelector("h3")!;
    const film = node.querySelector("video")!;
    return {
      headingTop: heading.getBoundingClientRect().top,
      filmBottom: film.getBoundingClientRect().bottom,
      background: getComputedStyle(node).backgroundColor,
      text: getComputedStyle(heading.nextElementSibling!).color,
      fontSize: parseFloat(getComputedStyle(heading.nextElementSibling!).fontSize),
    };
  });
  expect(metrics.headingTop).toBeGreaterThan(metrics.filmBottom);
  expect(metrics.background).toBe("rgb(2, 8, 6)");
  expect(metrics.text).toBe("rgb(255, 255, 255)");
  expect(metrics.fontSize).toBeGreaterThanOrEqual(16);
  await expect(page.locator("#events img")).toHaveCount(0);
  await expect(band.getByRole("link", { name: "Try it out", exact: true })).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.getByRole("heading", { name: "Around the club" })).toHaveCount(0);
  await expect(page.locator("#coaching").getByRole("heading", { name: "Get fitted and swinging!" })).toBeVisible();
  await expect(page.locator("#juniors").getByRole("heading", { name: "Golf for kids" })).toBeVisible();
  await expect(page.locator("#coaching").getByRole("link", { name: "Evaluate my swing" })).toHaveAttribute("data-offer", "swing-evaluation");
  await expect(page.locator("#coaching").getByRole("link", { name: "Try it out" })).toHaveAttribute("data-offer", "bay");
});

test("removed sections and junior paragraph stay absent on their pages", async ({ page }) => {
  for (const route of ["membership/", "coaching/", "juniors/", "events/", "tournament/"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Around the club" })).toHaveCount(0);
    await expect(page.getByText(/Junior golf in Somerset is age-group coaching/)).toHaveCount(0);
  }
  await page.goto("coaching/");
  await expect(page.locator("#coaching-offer").getByRole("link", { name: "Evaluate my swing" })).toHaveAttribute("data-offer", "swing-evaluation");
  await expect(page.locator("#coaching-offer").getByRole("link", { name: "Try it out" })).toHaveAttribute("data-offer", "bay");
});

test("membership page no longer shows Silver Gold Platinum price cards", async ({ page }) => {
  await page.goto("membership/");
  await expect(page.locator("[data-tier]")).toHaveCount(0);
  await expect(page.getByText("Compare price & hours")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "compare plans" })).toBeVisible();
});

test("coaching defaults to evaluation and has no pictures below pricing", async ({ page }) => {
  await page.goto("coaching/");
  const panel = page.locator("#coaching-offer");
  await expect(panel.getByRole("button", { name: "Swing evaluation", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(panel.locator("dd")).toHaveText(["50–60", "1"]);
  await expect(panel.getByRole("slider")).toHaveCount(0);
  const imagesOutsidePanel = await page.locator("article img").evaluateAll((nodes) => nodes.filter((node) => !node.closest("#coaching-offer")).length);
  expect(imagesOutsidePanel).toBe(0);
  await panel.getByRole("button", { name: "Lessons", exact: true }).click();
  await expect(panel.locator("dd")).toHaveText(["30", "5"]);
  await expect(panel.getByRole("slider")).toBeVisible();
  await expect(page.getByText(/never expire|no blackout|plan for what to change/i)).toHaveCount(0);
});
