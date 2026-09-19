import { describe, expect, it } from "./playwright";

describe("Index", () => {
  it("presents the site identity and sharing metadata", async ({ page }) => {
    const title = "eugen codes";
    const tagline = "I build things for fun. Some of them work.";
    await page.goto("/");

    await expect(page).toHaveTitle(title);
    await expect(
      page.getByRole("heading", { level: 1, name: "eugen.codes" }),
    ).toBeVisible();
    await expect(page.getByText(tagline)).toBeVisible();

    const attributes = [
      ['meta[name="description"]', "content", tagline],
      ['link[rel="canonical"]', "href", "https://eugen.codes/"],
      ['meta[property="og:type"]', "content", "website"],
      ['meta[property="og:title"]', "content", title],
      ['meta[property="og:description"]', "content", tagline],
      ['meta[property="og:url"]', "content", "https://eugen.codes/"],
      ['meta[property="og:image"]', "content", "https://eugen.codes/og.png"],
      [
        'meta[property="og:image:alt"]',
        "content",
        "Illustrated portrait of Eugen beside the eugen codes wordmark and the tagline “I build things for fun. Some of them work.”",
      ],
      ['meta[property="og:image:width"]', "content", "1200"],
      ['meta[property="og:image:height"]', "content", "630"],
      ['meta[name="twitter:card"]', "content", "summary_large_image"],
      ['link[rel="icon"]', "href", "/favicon.png"],
      ['link[rel="apple-touch-icon"]', "href", "/apple-touch-icon.png"],
    ] satisfies [selector: string, attribute: string, value: string][];
    for (const [selector, attribute, value] of attributes) {
      await expect(page.locator(selector)).toHaveAttribute(attribute, value);
    }
  });
});
