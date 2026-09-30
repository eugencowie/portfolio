import type { Page } from "@playwright/test";
import { describe, expect, it } from "./playwright";

// Decorative, so it has no role; the built asset URL keeps the file's name.
const skylineOf = (page: Page) => page.locator("header img[src*='skyline']");

describe("Skyline", () => {
  it("stays on screen as the Hero scrolls away, rising more slowly", async ({
    page,
  }) => {
    await page.goto("/");
    const skyline = skylineOf(page);
    const top = () => skyline.evaluate((el) => el.getBoundingClientRect().top);
    const atRest = await top();

    await page.evaluate(() => scrollBy(0, 400));
    await expect.poll(async () => atRest - (await top())).toBeGreaterThan(0);
    expect(atRest - (await top())).toBeLessThan(200);
    await expect(skyline).toBeInViewport();
  });

  it("is no longer drawn, nor the Sky behind it, once the Highrise has covered them", async ({
    page,
  }) => {
    await page.goto("/");
    const skyline = skylineOf(page);
    const sky = page.locator("[data-sky]");
    await expect(skyline).toBeVisible();
    await expect(sky).toBeVisible();

    await page
      .getByRole("heading", { level: 2, name: "Other projects" })
      .scrollIntoViewIfNeeded();
    await expect(skyline).toBeHidden();
    await expect(sky).toBeHidden();

    await page.evaluate(() => scrollTo(0, 0));
    await expect(skyline).toBeVisible();
    await expect(sky).toBeVisible();
  });

  it("scrolls away with the Hero for visitors who prefer reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const skyline = skylineOf(page);
    await expect(skyline).toBeInViewport();

    await page
      .getByRole("heading", { level: 2, name: "Other projects" })
      .scrollIntoViewIfNeeded();
    await expect(skyline).not.toBeInViewport();
  });
});
