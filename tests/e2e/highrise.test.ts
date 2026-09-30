import type { Page } from "@playwright/test";
import { describe, expect, it } from "./playwright";
import { portraitPhone } from "./viewports";

const floorOf = (page: Page, name: string) =>
  page
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { level: 3, name }) });

describe("Highrise", () => {
  it("descends from Building on the roof through Games to Other at street level", async ({
    page,
  }) => {
    await page.goto("/");
    const headings = page
      .locator("[data-highrise]")
      .getByRole("heading", { level: 2 });
    await expect(headings).toHaveText([
      "Currently building",
      "Games",
      "Other projects",
    ]);
    const tops = await Promise.all(
      (await headings.all()).map(async (heading) => {
        const box = await heading.boundingBox();
        return box?.y ?? Number.NaN;
      }),
    );
    expect(tops).toEqual(tops.toSorted((a, b) => a - b));
  });

  it("lights only the Sign of the Project in the middle of the screen", async ({
    page,
  }) => {
    await page.goto("/");
    // A resting cursor hovers whatever is under it; rest it off the page.
    await page.mouse.move(-1, -1);

    for (const name of ["Fourensics", "Roman Reign"]) {
      const floor = floorOf(page, name);
      await floor.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await expect(floor).toHaveAttribute("data-lit");
      await expect(page.locator("[data-lit]")).toHaveCount(1);
    }
  });

  it("lights the Project whose floor is across the middle of the screen, even near its edge", async ({
    page,
  }) => {
    await page.goto("/");
    await page.mouse.move(-1, -1);
    const floor = floorOf(page, "Gauge");
    // The Featured floor is tall: with its bottom edge just below the middle
    // of the screen, its centre is far above it.
    await floor.evaluate((el) => {
      scrollBy(0, el.getBoundingClientRect().bottom - innerHeight / 2 - 32);
    });
    await expect(floor).toHaveAttribute("data-lit");
    await expect(page.locator("[data-lit]")).toHaveCount(1);
  });

  it("lights the Sign of the Project focused from the keyboard", async ({
    page,
  }) => {
    await page.goto("/");
    await page.mouse.move(-1, -1);
    await floorOf(page, "Gauge").evaluate((el) =>
      el.scrollIntoView({ block: "center" }),
    );
    const floor = floorOf(page, "Fourensics");
    // Any key press makes the next focus a keyboard one; don't scroll
    // Fourensics into the middle of the screen.
    await page.keyboard.press("Shift");
    await floor
      .getByRole("link")
      .first()
      .evaluate((el) => el.focus({ preventScroll: true }));

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

  it("lays the rain over the screen only where it falls", async ({ page }) => {
    await page.goto("/");
    const overHero = page.locator("header canvas[data-rain]");
    const overHighrise = page.locator("[data-highrise] canvas[data-rain]");
    await expect(overHero).toBeVisible();
    await expect(overHighrise).toBeHidden();

    await page
      .getByRole("heading", { level: 2, name: "Other projects" })
      .scrollIntoViewIfNeeded();
    await expect(overHighrise).toBeVisible();
    await expect(overHero).toBeHidden();
  });

  it("drifts the city behind more slowly than the Highrise as the visitor descends", async ({
    page,
  }) => {
    await page.goto("/");
    // Drawn as backgrounds, so it has no role.
    const city = page.locator("[data-highrise] [data-drifting]");
    const drift = () =>
      city.evaluate(
        (el) =>
          el.getBoundingClientRect().top -
          (el.parentElement?.getBoundingClientRect().top ?? Number.NaN),
      );
    await page.evaluate(() => scrollTo(0, 1000));
    const higher = await drift();
    await page.evaluate(() => scrollTo(0, 3000));
    await expect.poll(drift).toBeGreaterThan(higher);
  });

  it("keeps every Project, its screenshot and the Social Links reachable on a phone", async ({
    page,
  }) => {
    await page.setViewportSize(portraitPhone);
    await page.goto("/");
    const highrise = page.locator("[data-highrise]");
    for (const target of [
      ...(await highrise.getByRole("link").all()),
      ...(await highrise.getByRole("img").all()),
    ]) {
      await target.scrollIntoViewIfNeeded();
      // Sub-pixel edges keep a whole element's ratio a hair under 1.
      await expect(target).toBeInViewport({ ratio: 0.99 });
    }
  });
});
