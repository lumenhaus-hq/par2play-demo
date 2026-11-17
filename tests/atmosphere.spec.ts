import { expect, setDemoLayout, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("p2p_consent", JSON.stringify({ v: 1, analytics: false, marketing: false, ts: Date.now() })),
  );
});

test("homepage atmosphere floaters sit behind content with depth layers", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "web");
  const atmosphere = page.getByTestId("page-atmosphere");
  await expect(atmosphere).toBeVisible();
  await expect(atmosphere.locator(".page-atmosphere__floater")).toHaveCount(9);
  await expect(atmosphere.locator('[data-depth="far"]')).toHaveCount(4);
  await expect(atmosphere.locator('[data-depth="mid"]')).toHaveCount(3);
  await expect(atmosphere.locator('[data-depth="near"]')).toHaveCount(2);
  const stacking = await atmosphere.evaluate((node) => {
    const styles = getComputedStyle(node);
    const content = node.parentElement?.querySelector(":scope > .relative");
    const contentZ = content ? getComputedStyle(content).zIndex : "auto";
    return {
      pointerEvents: styles.pointerEvents,
      ariaHidden: node.getAttribute("aria-hidden"),
      contentZ,
    };
  });
  expect(stacking.pointerEvents).toBe("none");
  expect(stacking.ariaHidden).toBe("true");
  expect(stacking.contentZ).toBe("10");
  const inView = await atmosphere.locator(".page-atmosphere__floater").evaluateAll((nodes) =>
    nodes.filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0;
    }).length,
  );
  // Viewport-fixed field: most glyphs should be on-screen at once.
  expect(inView).toBeGreaterThanOrEqual(7);
});

test("scroll shifts near floaters more than far ones", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "web");
  const atmosphere = page.getByTestId("page-atmosphere");
  const before = await atmosphere.evaluate((node) => {
    const near = node.querySelector<HTMLElement>('[data-depth="near"]')!;
    const far = node.querySelector<HTMLElement>('[data-depth="far"]')!;
    return {
      nearTop: near.getBoundingClientRect().top,
      farTop: far.getBoundingClientRect().top,
      shift: getComputedStyle(node).getPropertyValue("--floater-shift").trim(),
    };
  });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.55));
  await expect.poll(async () =>
    atmosphere.evaluate((node) => getComputedStyle(node).getPropertyValue("--floater-shift").trim()),
  ).not.toBe(before.shift === "" ? "0rem" : before.shift);
  const after = await atmosphere.evaluate((node) => {
    const near = node.querySelector<HTMLElement>('[data-depth="near"]')!;
    const far = node.querySelector<HTMLElement>('[data-depth="far"]')!;
    return {
      nearDelta: near.getBoundingClientRect().top,
      farDelta: far.getBoundingClientRect().top,
      nearParallax: Number(getComputedStyle(near).getPropertyValue("--parallax")),
      farParallax: Number(getComputedStyle(far).getPropertyValue("--parallax")),
    };
  });
  expect(after.nearParallax).toBeGreaterThan(after.farParallax);
  // Near layer should have moved farther from its pre-scroll position than far.
  expect(Math.abs(after.nearDelta - before.nearTop)).toBeGreaterThan(Math.abs(after.farDelta - before.farTop) - 0.5);
});

test("reduced motion freezes atmosphere floaters", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await setDemoLayout(page, "web");
  const atmosphere = page.getByTestId("page-atmosphere");
  await expect(atmosphere).toHaveClass(/page-atmosphere--still/);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.6));
  await expect
    .poll(() => atmosphere.evaluate((node) => getComputedStyle(node).getPropertyValue("--floater-shift").trim()))
    .toBe("0rem");
  const animating = await atmosphere.locator(".page-atmosphere__floater img").evaluateAll((imgs) =>
    imgs.some((img) => getComputedStyle(img).animationName !== "none" && getComputedStyle(img).animationName !== ""),
  );
  expect(animating).toBe(false);
});
