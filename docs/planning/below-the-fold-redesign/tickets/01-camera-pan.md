# Prototype the camera move from the Hero to the Highrise's roof

Type: prototype
Status: ready-for-agent

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

_(unresolved)_
