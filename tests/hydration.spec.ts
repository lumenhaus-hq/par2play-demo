import { expect, test } from "./fixtures";

const ROUTES = ["", "membership/", "coaching/", "swing-evaluation/", "juniors/", "events/", "tournament/", "members-day/", "junior-golf-experience/", "privacy-policy/"];

test("routes hydrate without a React hydration error", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  for (const route of ROUTES) {
    errors.length = 0;
    await page.goto(route === "" ? "./" : route, { waitUntil: "networkidle" });
    await expect(page.locator("h1").first()).toBeVisible();
    const hydration = errors.filter((line) => /hydrat|HYDRATE|did not match|Minified React error #4(18|19|22|23|25)/i.test(line));
    expect(hydration, route || "/").toEqual([]);
  }
});
