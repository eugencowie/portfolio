import type { Page } from "@playwright/test";
import { describe, expect, it } from "./playwright";

const floorOf = (page: Page, name: string) =>
  page
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { level: 3, name }) });

describe("Tenement", () => {
  it("lights only the Sign of the Project in the middle of the screen", async ({
    page,
  }) => {
    await page.goto("/");
    const floor = floorOf(page, "Fourensics");
    await floor.evaluate((el) => el.scrollIntoView({ block: "center" }));
    // A resting cursor hovers whatever is under it; rest it mid-screen.
    const { width, height } = page.viewportSize() ?? { width: 0, height: 0 };
    await page.mouse.move(width / 2, height / 2);

    await expect(floor).toHaveAttribute("data-lit");
    await expect(page.locator("[data-lit]")).toHaveCount(1);
  });

  it("lights a Social Link's Sign only while it is hovered", async ({
    page,
  }) => {
    await page.goto("/");
    const social = page.locator("[data-hover-lit]").first();
    // Not even in the middle of the screen.
    await social.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.mouse.move(0, 0);
    const lit = social.locator(".lit");
    await expect(lit).toHaveCSS("opacity", "0");

    await social.hover();
    await expect(lit).toHaveCSS("opacity", "1");
  });

  it("links a Project's whole window to the Project", async ({ page }) => {
    await page.goto("/");
    const screenshot = page.getByRole("img", {
      name: "Screenshot of Fourensics",
    });
    await screenshot.scrollIntoViewIfNeeded();
    const box = await screenshot.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const href = await page.evaluate(
      ([x, y]) => document.elementFromPoint(x, y)?.closest("a")?.href,
      [box.x + box.width / 2, box.y + box.height / 2],
    );
    expect(href).toBe("https://github.com/eugencowie/Fourensics");
  });

  it("holds the rain for visitors who prefer reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const rain = page.locator("canvas[data-rain]");
    await expect(rain).toHaveCount(2);
    for (const canvas of await rain.all()) await expect(canvas).toBeHidden();
  });
});
