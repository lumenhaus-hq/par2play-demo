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
  await expect(atmosphere.locator(".page-atmosphere__floater")).toHaveCount(12);
  await expect(atmosphere.locator('[data-depth="far"]')).toHaveCount(5);
  await expect(atmosphere.locator('[data-depth="mid"]')).toHaveCount(4);
  await expect(atmosphere.locator('[data-depth="near"]')).toHaveCount(3);
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
  const spread = await atmosphere.locator(".page-atmosphere__floater").evaluateAll((nodes) => {
    const rects = nodes.map((node) => node.getBoundingClientRect());
    const inView = rects.filter((rect) => rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0);
    const lefts = inView.map((rect) => rect.left + rect.width / 2);
    const tops = inView.map((rect) => rect.top + rect.height / 2);
    return {
      inView: inView.length,
      leftSpan: Math.max(...lefts) - Math.min(...lefts),
      topSpan: Math.max(...tops) - Math.min(...tops),
      viewportW: window.innerWidth,
      viewportH: window.innerHeight,
    };
  });
  // Scattered field: all glyphs on-screen and spread across the viewport, not edge-only.
  expect(spread.inView).toBe(12);
  expect(spread.leftSpan).toBeGreaterThan(spread.viewportW * 0.45);
  expect(spread.topSpan).toBeGreaterThan(spread.viewportH * 0.45);
});

test("mobile preview keeps the scattered glyph field inside the phone frame", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "mobile");
  const atmosphere = page.getByTestId("page-atmosphere");
  await expect(atmosphere).toHaveClass(/page-atmosphere--framed/);
  await expect(atmosphere.locator(".page-atmosphere__floater")).toHaveCount(12);
  await expect(atmosphere.locator(".page-atmosphere__glyph")).toHaveCount(12);
  await expect(atmosphere.locator(".page-atmosphere__floater--near")).toHaveCount(3);
  const visibleNear = await atmosphere.locator(".page-atmosphere__floater--near").evaluateAll((nodes) =>
    nodes.filter((node) => getComputedStyle(node).display !== "none").length,
  );
  expect(visibleNear).toBe(3);
  const paint = await atmosphere.evaluate((root) => {
    const layer = getComputedStyle(root);
    const near = root.querySelector<HTMLElement>(".page-atmosphere__floater--near")!;
    const glyph = near.querySelector<HTMLElement>(".page-atmosphere__glyph")!;
    const styles = getComputedStyle(glyph);
    return {
      iconToken: Number(layer.getPropertyValue("--atmosphere-icon")),
      nearOpacity: Number(getComputedStyle(near).opacity),
      fill: styles.backgroundColor,
      mask: styles.maskImage || (styles as CSSStyleDeclaration & { webkitMaskImage?: string }).webkitMaskImage || "",
    };
  });
  // Brand silhouette fill must stay opaque enough to read on phones (was ~0.24 black).
  expect(paint.iconToken).toBeGreaterThanOrEqual(0.7);
  expect(paint.nearOpacity).toBeGreaterThanOrEqual(0.7);
  // Classic #14532d, signal #0a1f3d, or mist #0f2924 — all ≥7:1 on their papers.
  expect(paint.fill).toMatch(/rgb\(\s*(20,\s*83,\s*45|10,\s*31,\s*61|15,\s*41,\s*36)\s*\)/);
  expect(paint.mask).toMatch(/url\(/);
});

test("section titles carry a feathered tint with no edge", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "web");
  const plate = await page.locator(".section-title").first().evaluate((node) => {
    const before = getComputedStyle(node, "::before");
    return {
      content: before.content,
      filter: before.backdropFilter || (before as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter || "",
      shadow: before.boxShadow,
      background: before.backgroundImage,
      z: before.zIndex,
    };
  });
  expect(plate.content).not.toBe("none");
  expect(plate.filter === "none" || plate.filter === "").toBe(true);
  expect(plate.shadow === "none" || plate.shadow === "").toBe(true);
  expect(plate.background).toMatch(/radial-gradient/);
  expect(Number(plate.z)).toBeLessThan(0);
});

test("scroll keeps floater parallax off on desktop", async ({ page }) => {
  await page.goto("./");
  await setDemoLayout(page, "web");
  const atmosphere = page.getByTestId("page-atmosphere");
  await page.evaluate(() => document.documentElement.classList.remove("is-scrolling"));
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.55));
  await page.evaluate(() => document.documentElement.classList.remove("is-scrolling"));
  await expect
    .poll(() => atmosphere.evaluate((node) => getComputedStyle(node).getPropertyValue("--floater-shift").trim()))
    .toBe("0rem");
  await expect
    .poll(() => atmosphere.evaluate((node) => getComputedStyle(node).getPropertyValue("--floater-spin").trim()))
    .toBe("0deg");
  const depth = await atmosphere.evaluate((node) => {
    const near = node.querySelector<HTMLElement>('[data-depth="near"]')!;
    const far = node.querySelector<HTMLElement>('[data-depth="far"]')!;
    return {
      nearParallax: Number(getComputedStyle(near).getPropertyValue("--parallax")),
      farParallax: Number(getComputedStyle(far).getPropertyValue("--parallax")),
      washX: getComputedStyle(node.closest(".page-grid") ?? node).getPropertyValue("--scroll-x").trim(),
    };
  });
  expect(depth.nearParallax).toBeGreaterThan(depth.farParallax);
  expect(depth.washX.length).toBeGreaterThan(0);
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
  const animating = await atmosphere.locator(".page-atmosphere__glyph").evaluateAll((glyphs) =>
    glyphs.some((glyph) => getComputedStyle(glyph).animationName !== "none" && getComputedStyle(glyph).animationName !== ""),
  );
  expect(animating).toBe(false);
});
