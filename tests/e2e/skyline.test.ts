import { describe, expect, it } from "./playwright";

describe("Skyline", () => {
  it("scrolls away with the Hero so the Projects sit on the plain Sky", async ({
    page,
  }) => {
    await page.goto("/");
    // Decorative, so it has no role; the built asset URL keeps the file's name.
    const skyline = page.locator("header img[src*='skyline']");
    await expect(skyline).toBeInViewport();

    await page
      .getByRole("heading", { level: 2, name: "Other projects" })
      .scrollIntoViewIfNeeded();
    await expect(skyline).not.toBeInViewport();
  });
});
