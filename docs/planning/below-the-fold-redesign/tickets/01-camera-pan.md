# Prototype the camera move from the Hero to the Highrise's roof

Type: prototype
Status: resolved

## Question

Can the Hero and the Highrise be made one continuous shot, the camera leaving the Skyline and landing on the Highrise's roof?

Every scene-based prototype so far got this seam wrong (see [spec](../spec.md#land-the-camera)). The spec's move is a tilt: the Skyline holds still as the Hero scrolls away, then the camera tilts down past the river and lands on the near bank. The Highrise already makes a different move below the roof, a crane down its front, the city behind drifting by more slowly than the brickwork. This prototype builds both moves, landing on the real roof, and compares them with today's join.

## What to build

A throwaway branch `prototype/camera-pan` off `feature/tenement` that changes only the join between the Hero and the Highrise. Three variants, flipped with `?variant=` and ← →:

- **`crane`**, the default: one move all the way down. The stars stay fixed, the Skyline and its river rise slowly, and the roof rises at page speed in front of them and hides them, landing on the roof's Sign against the far city. The Sky's reflection band goes, since it would slide against the Skyline. The Skyline shows through the top of the lane, with the city behind's towers standing in front of it.
- **`tilt`**: the spec's move. The Skyline and the stars hold still while the Identity and the Social Links leave, then the whole picture moves up together with a little parallax: the Skyline out of the top, the river across the screen, the roof in from the bottom, landing on the roof's Sign against the water. The river is the Skyline's own reflection, hidden below the Hero today, running on into dark water down to the roof. The hold adds scroll before the first Project; accept it and measure it.
- **`current`**: today's join, for comparison.

Also:

- Desktop first (1440×900), then the same move at 390×844.
- Overdo the motion.
- Reduced motion, and browsers without scroll-driven animations, get today's join.
- The rain across the join stays as it is.

## What to report

- How to run it and flip between the variants.
- The tilt's extra scroll before the first Project, on desktop and on a phone.
- Anything that fights the phone: the address bar resizing held layers, the Skyline cropped to its centre.
- What should be dialled back.

Judged in the browser, for the Answer: whether each move reads as a camera or as layers sliding, whether the crane reads as one continuous shot with the descent below it, and whether the tilt's river convinces as the thing being passed over.

## Answer

Yes, with the crane. Judged in the browser, the crane is good: the stars stay put, the Skyline rises slowly, and the roof rises in front of it at page speed, the same move the Highrise already makes below the roof, so the Hero and the Highrise read as one shot. It adds no scroll before the first Project. The tilt is not pursued. It cost 1.35 screens of scroll before the first Project.

## Comments

### Prototype built (branch `prototype/camera-pan`)

Run `mise run astro dev --background` and open `/`. Flip between `crane` (the default), `tilt` and `current` with the bar at the bottom of the screen or with ← →; each is also reachable directly as `/?variant=<name>`. The bar only renders on the dev server. The code is `src/components/prototype-camera-pan/`, wrapped around the Hero in `src/pages/index.astro`.

What was built:

- **Crane:** the stars and the Sky stay fixed, and the Skyline and its sliver of river rise at about a quarter of the scroll speed until the roof has passed the top of the screen. The roof rises at page speed in front of them, so about 0.6 screens down its Sign stands against the far city with the Skyline behind the parapet. The top of the lane is see-through for its first screen, so the Skyline shows down it, behind the city's towers. It adds no scroll.
- **Tilt:** the Sky, the stars and the Skyline hold still for 85svh while the Identity and the Social Links leave. Then everything moves up together, the stars lagging at about 0.87× for a little depth against the Skyline. The Skyline's own reflection, hidden below the Hero today, runs on into 50svh of river with its glow at the top and neon streaks shimmering on the water. The roof arrives against the dark water. The rain falls through the whole passage.
- **Fallback:** under reduced motion, and in browsers without scroll-driven animations, every variant is today's join. Full-page screenshots with reduced motion are pixel-identical to `feature/tenement` at 1440×900 and 390×844.

**The tilt's extra scroll:** the first Project floor moves from 1216px to 2431px on desktop (1440×900) and from 1145px to 2284px on a phone (390×844). That is 1.35 extra screens on both, the 85svh hold plus the 50svh river, before the visitor reaches the first Project. The crane adds none.

**What fights the phone:**

- Neither move was tried on a real phone. The crane's backdrop is fixed and 100lvh tall with the picture in its top 100svh, and the tilt's is sticky. How each behaves when the address bar shows and hides is untested.
- The Skyline is cropped to the centre 768px, as in the Hero today, so the phone gets the Hydro, the Finnieston Crane and part of the Armadillo. Both moves still read with that crop.
- In the crane, the lane is 39px wide on a phone, so the Skyline showing down it is barely there.
- In the tilt, the river is half a screen of water with nothing on it but streaks, and on a phone the whole screen is water for a moment.

**What to dial back, from the stills:**

1. **The tilt's cost.** 1.35 screens before the first Project goes against the spec's rule that the spectacle mustn't get between the tool-finder and the Projects. If the tilt wins, start the tilt before the Social Links have fully left and halve the river.
2. **The crane's rise speed.** It is set to 0.25×. Faster reads more like layers sliding; slower reads more like the Skyline being fixed.
3. **The tilt's roof.** It stands against plain dark water with no streaks behind it. If the tilt wins, carry the ripples down to the parapet.

Two e2e tests were changed on this branch only. The Skyline test now runs on `?variant=current`, since the crane is what stops the Skyline scrolling away with the Hero. The rain test counts a third canvas, the tilt passage's.

### Built on `feature/tenement`

The crane is the homepage's join, rebuilt rather than copied from the prototype:

- The Hero's own Skyline is held (`<Skyline held>`) and the Sky is fixed to the screen, instead of a second copy of both in a backdrop.
- The Skyline rises at a quarter of the scroll speed for the first 240svh, for as long as any of it shows, rather than stopping once the roof has passed the top of the screen.
- The lane's sky fades in from clear over the same distance as before, rather than staying clear for its first 35svh, so under reduced motion the lane is unchanged.
- There is no tilt, no variant switcher and no third Rain.
- The rise is written as animation longhands. The CSS minifier folds a timeline into the `animation` shorthand, which browsers reject, so the prototype's crane only rose on the dev server. The same fault had kept the city behind from drifting in the built site; that was fixed first, in its own commit.
