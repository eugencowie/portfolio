import { describe, expect, it } from "./playwright";

describe("Index", () => {
  it("presents the site identity and sharing metadata", async ({ page }) => {
    const title = "eugen";
    const description =
      "Personal website of eugen, who codes: a portfolio of software projects, past and present.";
    await page.goto("/");

    await expect(page).toHaveTitle(title);
    await expect(
      page.getByRole("heading", { level: 1, name: "eugen.codes" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "github", exact: true }),
    ).toHaveAttribute("href", "https://github.com/eugencowie");
    await expect(
      page.getByRole("link", { name: "twitter", exact: true }),
    ).toHaveAttribute("href", "https://x.com/eugencowie");

    const attributes = [
      ['meta[name="description"]', "content", description],
      ['meta[property="og:type"]', "content", "website"],
      ['meta[property="og:title"]', "content", title],
      ['meta[property="og:description"]', "content", description],
      [
        'meta[property="og:image:alt"]',
        "content",
        "Illustrated portrait of eugen above the eugen.codes wordmark, in front of a neon skyline at night",
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

    // The site URL is a deploy-time setting, so the resolved URL is not pinned
    // here; the MainLayout tests cover it.
    const structuredData = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    expect(JSON.parse(structuredData ?? "null")).toEqual({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      description,
      mainEntity: {
        "@type": "Person",
        name: title,
        url: expect.any(String),
        sameAs: ["https://github.com/eugencowie", "https://x.com/eugencowie"],
      },
    });
  });

  it("uses the intended fonts for Section headings, Signs and the directory", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 2, name: "Currently building" }),
    ).toHaveCSS("font-family", /Yellowtail/);
    await expect(
      page
        .getByRole("heading", { level: 3, name: "Gauge" })
        .locator("[data-sign]"),
    ).toHaveCSS("font-family", /Michroma/);
    await expect(
      page.getByRole("heading", { level: 3, name: "aptabase-rs" }),
    ).toHaveCSS("font-family", /Commit Mono/);
  });
});
