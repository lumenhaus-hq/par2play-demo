import { expect, test } from "./fixtures";

test("desktop home hero keeps the brush title above the CTA without clipping", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() =>
    localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })),
  );
  await page.goto("./");
  await expect(page.getByTestId("landing-boot")).toBeHidden({ timeout: 20_000 });

  await expect
    .poll(() =>
      page.evaluate(() => {
        const dock = document.querySelector(".hero-offer-dock");
        const body = document.querySelector(".hero-offer-body");
        const brush = document.querySelector(".hero-sticker--brush, .hero-sticker--script");
        const cta = document.querySelector(".hero-stage--cta");
        if (!dock || !body || !brush || !cta) return false;
        const dockMax = getComputedStyle(dock).maxHeight;
        const clipped = body.scrollHeight > body.clientHeight + 2;
        const gap = cta.getBoundingClientRect().top - brush.getBoundingClientRect().bottom;
        return dockMax === "none" && !clipped && gap > 8;
      }),
    )
    .toBe(true);
});

test("desktop membership Reserve CTA matches the invoice width", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() =>
    localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })),
  );
  await page.goto("./membership/");
  await expect(page.locator("[data-invoice]")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const stamp = document.querySelector(".reserve-time .cta-stamp");
        const invoice = document.querySelector("[data-invoice]");
        if (!stamp || !invoice) return 0;
        return stamp.getBoundingClientRect().width / invoice.getBoundingClientRect().width;
      }),
    )
    .toBeGreaterThan(0.98);
});
