import { socialLinks } from "@/site";
import { describe, expect, it } from "./playwright";
import { viewports } from "./viewports";

// The Hero must fit on one screen with the Social Links visible, whatever the
// viewport. The Projects below it scroll, so only the width is checked for
// overflow.

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
      const hero = page.locator("header");
      await expect(hero).toBeInViewport({ ratio: 1 });
      await expect(
        hero.getByRole("heading", { level: 1, name: "eugen.codes" }),
      ).toBeInViewport({ ratio: 1 });
      for (const link of socialLinks) {
        await expect(
          hero.getByRole("link", { name: link.name, exact: true }),
        ).toBeInViewport({ ratio: 1 });
      }
    });
  }
});
