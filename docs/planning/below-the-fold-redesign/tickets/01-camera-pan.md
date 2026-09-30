# Prototype the camera pan from the Hero to the near bank

Type: prototype
Status: ready-for-agent

## Question

Can the Hero and what follows be made one continuous shot: the Skyline holding still as the Hero scrolls away, the camera tilting down past the river and landing on the near bank of the Clyde?

Every scene-based prototype so far got this seam wrong (see [spec](../spec.md#land-the-camera)). Answer it on its own, with nothing on the near bank yet, so the answer transfers to whichever scene wins.

## What to build

A throwaway branch off `main` that changes only the join between the Hero and the page below it.

- The Hero scrolls away as now, but the Skyline stays put (sticky or fixed) while the Identity and Social Links rise out of view.
- As the scroll continues, the view tilts down: the Skyline drifts up and out with a little parallax, the river passes, and the near bank arrives from the bottom.
- The near bank is a placeholder: a flat ground plane in the Sky's colours, with a plain block where the first Section heading would sit. No Projects.
- Desktop first (1440×900). Then check it holds at 390×844.
- Overdo the motion; add a reduced-motion fallback that jumps straight to the near bank.

## What to report

- Screenshots at three points: Hero, mid-pan, landed.
- Whether the parallax reads as a camera tilting down or as layers sliding.
- Whether the river is convincing as the thing being passed over.
- How the sticky Skyline interacts with the Sky's star and reflection bands.
- Anything that fights the phone.

## Answer

_(unresolved)_
