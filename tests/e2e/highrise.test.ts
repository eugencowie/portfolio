import type { Locator, Page } from "@playwright/test";
import { describe, expect, it } from "./playwright";
import { portraitPhone, smallLaptop, viewports } from "./viewports";

const floorOf = (page: Page, name: string) =>
  page
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { level: 3, name }) });

/** Scrolls until `locator`'s `edge` is `fraction` of the way down the screen. */
const scrollEdgeTo = (
  locator: Locator,
  edge: "top" | "bottom",
  fraction: number,
) =>
  locator.evaluate(
    (el, [edge, fraction]) => {
      scrollBy(0, el.getBoundingClientRect()[edge] - innerHeight * fraction);
    },
    [edge, fraction] as const,
  );

/** Waits two frames, by when the page's scripts have seen where it is. */
const settle = (page: Page) =>
  page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
  );

/** What lights on a Project's Floor: its Sign, and the Spill around it. */
const litLayers = { sign: "[data-sign] .lit", spill: "[data-spill]" };
/** A failing Sign's letter that keeps cutting out. */
const failingLayers = { letter: "[data-failing]" };

/** The play states of an element's animations. */
const playStates = (el: Locator) =>
  el.evaluate((el) =>
    el.getAnimations().map((animation) => animation.playState),
  );

/**
 * What a colour computes to on the page, resolved rather than written out:
 * the palette's colour-mix() colours serialise differently in each engine.
 */
const colorOf = (page: Page, color: string) =>
  page.evaluate((color) => {
    const probe = document.body.appendChild(document.createElement("span"));
    probe.style.color = color;
    const computed = getComputedStyle(probe).color;
    probe.remove();
    return computed;
  }, color);

/** Waits until a lit Floor's Sign and Spill have flickered on. */
const flickeredOn = async (floor: Locator) => {
  await expect(floor).toHaveAttribute("data-lit");
  for (const selector of Object.values(litLayers)) {
    await expect
      .poll(() =>
        floor
          .locator(selector)
          .evaluate((el) =>
            el
              .getAnimations()
              .every((animation) => animation.playState === "finished"),
          ),
      )
      .toBe(true);
  }
};

/**
 * Scrolls `screens` screens down, and reads the opacity of `layers` of a
 * Floor, its Sign and Spill unless given, the moment that lights or puts out
 * the Sign, before a frame can pass. Given `holdAt`, first holds their
 * animations that many ms in, until the Sign next lights or goes out.
 */
const opacityAsSignToggles = (
  floor: Locator,
  {
    screens,
    holdAt,
    layers = litLayers,
  }: { screens: number; holdAt?: number; layers?: Record<string, string> },
) =>
  floor.evaluate(
    (el, { screens, holdAt, selectors }) =>
      new Promise<Record<string, string>>((resolve) => {
        const layers = Object.entries(selectors).map(([name, selector]) => {
          const layer = el.querySelector(selector);
          if (!layer) throw new Error(`No ${selector} on the Floor`);
          return { name, layer };
        });
        new MutationObserver((_, observer) => {
          observer.disconnect();
          if (holdAt !== undefined) {
            for (const { layer } of layers) {
              for (const animation of layer.getAnimations()) {
                animation.pause();
                animation.currentTime = holdAt;
              }
            }
          }
          resolve(
            Object.fromEntries(
              layers.map(({ name, layer }) => [
                name,
                getComputedStyle(layer).opacity,
              ]),
            ),
          );
        }).observe(el, { attributeFilter: ["data-lit"] });
        scrollBy(0, innerHeight * screens);
      }),
    { screens, holdAt, selectors: layers },
  );

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

  it("gives a Featured floor Piers from 80rem, with no Sash Window or Balcony", async ({
    page,
  }) => {
    await page.setViewportSize(smallLaptop);
    await page.goto("/");
    const featured = floorOf(page, "Gauge");
    await expect(featured.locator("[data-bay]")).toHaveCount(2);
    for (const bay of await featured.locator("[data-bay]").all()) {
      await expect(bay).toBeHidden();
    }
    await expect(featured.locator("[data-balcony]")).toHaveCount(1);
    await expect(featured.locator("[data-balcony]")).toBeHidden();

    const ordinary = floorOf(page, "Roman Reign");
    await expect(ordinary.locator("[data-bay]")).toHaveCount(2);
    for (const bay of await ordinary.locator("[data-bay]").all()) {
      await expect(bay).toBeVisible();
    }
    await expect(ordinary.locator("[data-balcony]")).toBeVisible();
  });

  it("keeps a Featured floor's Balcony on a phone", async ({ page }) => {
    await page.setViewportSize(portraitPhone);
    await page.goto("/");
    await expect(
      floorOf(page, "Gauge").locator("[data-balcony]"),
    ).toBeVisible();
  });

  // From 64rem a Floor's Caption stands beside its window.
  for (const { name, ...viewport } of [
    { name: "landscape tablet", width: 1024, height: 768 },
    ...viewports.filter(({ width }) => width >= 1024),
  ]) {
    it(`centres each Project's Caption on its screenshot on a ${name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const centreOf = async (locator: Locator) => {
        const box = await locator.boundingBox();
        return box ? box.y + box.height / 2 : Number.NaN;
      };
      for (const floor of await page.locator("[data-attention]").all()) {
        const caption = await centreOf(floor.locator("[data-caption]"));
        const screenshot = await centreOf(floor.getByRole("img"));
        // Within half the 0.1rem a Featured pane's top border is thicker
        // than its bottom.
        expect(Math.abs(caption - screenshot)).toBeLessThan(1);
      }
    });
  }

  it("lights a Project's Sign only while any part of its Caption is in the middle of the screen", async ({
    page,
  }) => {
    await page.goto("/");
    await settle(page);
    await expect(page.locator("[data-lit]")).toHaveCount(0);

    for (const name of ["Fourensics", "Gauge", "Roman Reign"]) {
      const floor = floorOf(page, name);
      const caption = floor.locator("[data-caption]");
      // The middle of the screen runs from 35% to 65% of the way down it.
      await scrollEdgeTo(caption, "top", 0.64);
      await expect(floor).toHaveAttribute("data-lit");
      await expect(page.locator("[data-lit]")).toHaveCount(1);
      await scrollEdgeTo(caption, "top", 0.66);
      await expect(floor).not.toHaveAttribute("data-lit");
      await scrollEdgeTo(caption, "bottom", 0.36);
      await expect(floor).toHaveAttribute("data-lit");
      await scrollEdgeTo(caption, "bottom", 0.34);
      await expect(floor).not.toHaveAttribute("data-lit");
    }
  });

  it("fades a Project's Sign and its Spill out once they have flickered on", async ({
    page,
  }) => {
    await page.goto("/");
    const floor = floorOf(page, "Fourensics");
    await scrollEdgeTo(floor.locator("[data-caption]"), "top", 0.5);
    await flickeredOn(floor);

    expect(await opacityAsSignToggles(floor, { screens: 1 })).toEqual({
      sign: "1",
      spill: "1",
    });
    await expect(floor.locator(litLayers.sign)).toHaveCSS("opacity", "0");
    await expect(floor.locator(litLayers.spill)).toHaveCSS("opacity", "0");
  });

  it("fades a Project's Sign and its Spill out mid-flicker from however lit they are", async ({
    page,
  }) => {
    await page.goto("/");
    const floor = floorOf(page, "Fourensics");
    // A screen below the middle, so the next scroll lights it.
    await scrollEdgeTo(floor.locator("[data-caption]"), "top", 1.5);

    // 270ms into the flicker it is 0.95: the 0.95 30% stop of --neon-flicker
    // in global.css.
    const midFlicker = { sign: "0.95", spill: "0.95" };
    expect(
      await opacityAsSignToggles(floor, { screens: 1, holdAt: 270 }),
    ).toEqual(midFlicker);
    expect(await opacityAsSignToggles(floor, { screens: 1 })).toEqual(
      midFlicker,
    );
    await expect(floor.locator(litLayers.sign)).toHaveCSS("opacity", "0");
    await expect(floor.locator(litLayers.spill)).toHaveCSS("opacity", "0");
  });

  it("flickers a Project's Sign and its Spill back on mid-fade from however lit they still are", async ({
    page,
  }) => {
    await page.goto("/");
    const floor = floorOf(page, "Fourensics");
    await scrollEdgeTo(floor.locator("[data-caption]"), "top", 0.5);
    await flickeredOn(floor);

    // Held 100ms into the fade.
    const fading = await opacityAsSignToggles(floor, {
      screens: 1,
      holdAt: 100,
    });
    expect(Number(fading.sign)).toBeGreaterThan(0);
    expect(Number(fading.spill)).toBeGreaterThan(0);
    expect(await opacityAsSignToggles(floor, { screens: -1 })).toEqual(fading);
    await expect(floor.locator(litLayers.sign)).toHaveCSS("opacity", "1");
    await expect(floor.locator(litLayers.spill)).toHaveCSS("opacity", "1");
  });

  it("keeps a Sign's failing letter cut out as the Sign goes out and comes back on", async ({
    page,
  }) => {
    await page.goto("/");
    const floor = floorOf(page, "Gauge");
    await scrollEdgeTo(floor.locator("[data-caption]"), "top", 0.5);
    await flickeredOn(floor);
    const letter = floor.locator(failingLayers.letter);
    // 4150ms into its cycle the letter has cut out to 0.05, from the 88% stop
    // of `failing` in Sign.astro to its 96%.
    await letter.evaluate((el) => {
      for (const animation of el.getAnimations()) {
        animation.currentTime = 4150;
      }
    });

    const cutOut = { letter: "0.05" };
    expect(
      await opacityAsSignToggles(floor, { screens: 1, layers: failingLayers }),
    ).toEqual(cutOut);
    expect(await playStates(letter)).toEqual(["paused"]);
    expect(
      await opacityAsSignToggles(floor, { screens: -1, layers: failingLayers }),
    ).toEqual(cutOut);
    expect(await playStates(letter)).toEqual(["running"]);
  });

  it("leaves a hovered Project's Sign unlit outside the middle of the screen", async ({
    page,
  }) => {
    await page.goto("/");
    const floor = floorOf(page, "Fourensics");
    await scrollEdgeTo(floor.locator("[data-caption]"), "top", 0.75);
    // The link over the Floor takes the hover, so point at the Sign.
    const sign = floor.locator("[data-sign]");
    const box = await sign.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await settle(page);
    await expect(page.locator("[data-lit]")).toHaveCount(0);
    await expect(sign.locator(".lit")).toHaveCSS("opacity", "0");
  });

  it("lights the Sign of the Project focused from the keyboard, as well as the one in the middle of the screen", async ({
    page,
  }) => {
    await page.goto("/");
    const centred = floorOf(page, "Gauge");
    await scrollEdgeTo(centred.locator("[data-caption]"), "top", 0.5);
    await expect(centred).toHaveAttribute("data-lit");

    const floor = floorOf(page, "Fourensics");
    const link = floor.getByRole("link").first();
    // Any key press makes the next focus a keyboard one; don't scroll
    // Fourensics into the middle of the screen.
    await page.keyboard.press("Shift");
    await link.evaluate((el) => el.focus({ preventScroll: true }));
    await expect(floor).toHaveAttribute("data-lit");
    await expect(centred).toHaveAttribute("data-lit");

    await link.blur();
    await expect(floor).not.toHaveAttribute("data-lit");
    await expect(centred).toHaveAttribute("data-lit");
  });

  it("lights the Sign of a Project clicked once a key is pressed", async ({
    page,
  }) => {
    await page.goto("/");
    // Stay on the page.
    await page.evaluate(() => {
      addEventListener("click", (event) => event.preventDefault(), {
        capture: true,
      });
    });
    const floor = floorOf(page, "Fourensics");
    await scrollEdgeTo(floor.locator("[data-caption]"), "top", 0.7);
    const link = floor.getByRole("link").first();
    await link.click();
    await expect(link).toBeFocused();
    await expect(floor).not.toHaveAttribute("data-lit");

    await page.keyboard.press("Shift");
    await expect(floor).toHaveAttribute("data-lit");
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

  describe("without scripting", () => {
    it.use({ javaScriptEnabled: false });

    it("lights a Project's Floor hovered or focused as a lit one", async ({
      page,
    }) => {
      await page.goto("/");
      await expect(page.locator("[data-lit]")).toHaveCount(0);
      const floor = floorOf(page, "Gauge");
      const link = floor.getByRole("link").first();
      const sign = floor.locator(litLayers.sign);
      const spill = floor.locator(litLayers.spill);
      const host = floor.locator("[data-host]");
      const letter = floor.locator(failingLayers.letter);
      await expect(sign).toHaveCSS("opacity", "0");
      await expect(spill).toHaveCSS("opacity", "0");
      await expect(host).toHaveCSS(
        "color",
        await colorOf(page, "var(--muted)"),
      );
      expect(await playStates(letter)).toEqual(["paused"]);

      await link.hover();
      // The flicker is the linear() easing of --neon-flicker in global.css;
      // the fade it replaces is ease-out.
      await expect(sign).toHaveCSS("transition-timing-function", /^linear\(/);
      await expect(sign).toHaveCSS("opacity", "1");
      await expect(spill).toHaveCSS("opacity", "1");
      await expect(host).toHaveCSS(
        "color",
        await colorOf(page, "var(--neon-magenta)"),
      );
      expect(await playStates(letter)).toEqual(["running"]);

      await page.mouse.move(0, 0);
      await expect(sign).toHaveCSS("opacity", "0");
      await expect(spill).toHaveCSS("opacity", "0");

      await link.evaluate((el) => el.focus());
      await expect(sign).toHaveCSS("opacity", "1");
      await expect(spill).toHaveCSS("opacity", "1");
    });
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
