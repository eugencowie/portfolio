import { describe, expect, it } from "./playwright";

describe("Skyline", () => {
  it("stays on screen as the Hero scrolls away, rising more slowly", async ({
    page,
  }) => {
    await page.goto("/");
    // Decorative, so it has no role; the built asset URL keeps the file's name.
    const skyline = page.locator("header img[src*='skyline']");
    const top = () => skyline.evaluate((el) => el.getBoundingClientRect().top);
    const atRest = await top();

    await page.evaluate(() => scrollBy(0, 400));
    await expect.poll(async () => atRest - (await top())).toBeGreaterThan(0);
    expect(atRest - (await top())).toBeLessThan(200);
    await expect(skyline).toBeInViewport();
  });

  it("scrolls away with the Hero for visitors who prefer reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const skyline = page.locator("header img[src*='skyline']");
    await expect(skyline).toBeInViewport();

    await page
      .getByRole("heading", { level: 2, name: "Other projects" })
      .scrollIntoViewIfNeeded();
    await expect(skyline).not.toBeInViewport();
  });
});
