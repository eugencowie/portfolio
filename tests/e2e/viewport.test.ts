import type { Page } from "@playwright/test";
import { socialLinks } from "@/site";
import { describe, expect, it } from "./playwright";
import { viewports } from "./viewports";

type Viewport = { width: number; height: number };

/** The home page on a screen, with its fonts loaded. */
async function open(page: Page, viewport: Viewport) {
  await page.setViewportSize(viewport);
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

// The Hero must fit on one screen with the Social Links visible, whatever the
// viewport. The Projects below it scroll, so only the width is checked for
// overflow.

describe("Hero", () => {
  for (const { name, ...viewport } of viewports) {
    it(`fits with the Social Links on one screen on a ${name}`, async ({
      page,
    }) => {
      await open(page, viewport);

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

// A Project's Sign is sized to fit its Caption on two lines at most, whatever
// the viewport, so a long name neither wraps onto a third line nor overflows.

describe("Highrise", () => {
  for (const { name, ...viewport } of viewports) {
    it(`fits every Project's Sign on two lines on a ${name}`, async ({
      page,
    }) => {
      await open(page, viewport);

      const signs = page
        .locator("[data-highrise]")
        .getByRole("heading", { level: 3 })
        .filter({ has: page.locator("[data-sign]") });
      expect(await signs.count()).toBeGreaterThan(0);
      for (const heading of await signs.all()) {
        const { text, lines, overflow } = await heading.evaluate((el) => {
          const sign = el.querySelector("[data-sign]")!;
          const lineHeight = parseFloat(getComputedStyle(sign).lineHeight);
          return {
            text: el.textContent,
            lines: sign.getBoundingClientRect().height / lineHeight,
            overflow: el.scrollWidth - el.clientWidth,
          };
        });
        // Sub-pixel edges keep a line's height from being exactly a line-height.
        expect(lines, text).toBeLessThanOrEqual(2.05);
        expect(overflow, text).toBe(0);
      }
    });
  }
});
