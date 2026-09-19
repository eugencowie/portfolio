import { socialLinks } from "@/site";
import { describe, expect, it } from "./playwright";

// The Hero must fit on one screen with the Social Links visible, whatever the
// viewport: portrait and landscape phones, laptops and a desktop monitor. The
// Projects below it scroll, so only the width is checked for overflow.
const viewports = [
  { name: "portrait phone", width: 375, height: 667 },
  { name: "landscape phone", width: 844, height: 390 },
  { name: "small laptop", width: 1280, height: 720 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "desktop", width: 1920, height: 1080 },
];

describe("Hero", () => {
  for (const { name, ...viewport } of viewports) {
    it(`fits with the Social Links on one screen on a ${name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready.then(() => undefined));

      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(scrollWidth).toBeLessThanOrEqual(viewport.width);
      await expect(
        page.getByRole("heading", { level: 1, name: "eugen.codes" }),
      ).toBeInViewport({ ratio: 1 });
      for (const link of socialLinks) {
        await expect(
          page.getByRole("link", { name: link.label, exact: true }),
        ).toBeInViewport({ ratio: 1 });
      }
    });
  }
});
