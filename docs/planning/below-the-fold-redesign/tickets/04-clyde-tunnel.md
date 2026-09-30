# Prototype the Clyde Tunnel: drive down the page, buildings either side

Type: prototype
Status: wontfix

## Question

Instead of landing on a road that runs across the screen, can the camera pan down into a road tunnel under the river and then drive down the page, with the Projects as lit buildings on the left and right that scroll up past the viewer?

This is Night Drive with the road turned to run down the page instead of across it. It keeps the outrun mood and the car, gets a vertical scroll for free, and gives the page a natural spine: the road, with Projects alternating on either side. It is a separate prototype from ticket 03 because the viewpoint is different (looking along the road, not side-on to it), and that changes everything about how a Project is drawn.

## What to build

A throwaway branch off `main` (or off the branch from ticket 01 if it has landed; otherwise stub the join with a hard cut).

- The camera pans down from the Hero past the river and into a tunnel mouth on the near bank, as if driving into the Clyde Tunnel.
- Coming out of the tunnel, the road runs down the page. Pick a viewpoint and note it: top-down, or a forward perspective with the road narrowing away from the viewer. Try the one that lets a screenshot be the biggest thing on screen.
- Each Project is a building beside the road: the screenshot is its lit face, the name a neon sign on it, the tagline on a plate. Buildings alternate left and right. They scroll up past the viewer as the page scrolls down.
- The tunnel itself could hold the Currently building Section (lit signs on the tunnel wall) before the road opens out, or the Sections could all be on the road. Try whichever makes the Section headings land naturally.
- Three tiers: Featured gets the biggest building. The Other Section is compact: shop fronts, street signs, or a gantry across the road.
- The car stays in shot, ahead of the viewer, and reacts to the scroll as in Night Drive (rolling, braking, reversing).
- Spectacle: rain, tunnel lights strobing past, headlight cones, tail-light streaks, wet-road reflections. Overdo it.
- Palette: pick one of the three options in the spec and note which.
- Desktop first; then check 390×844 is usable. A vertical road should suit a phone better than the original.
- Reduced-motion fallback.

## What to report

- Screenshots at desktop and phone: tunnel, first Section, Other Section.
- Which viewpoint was chosen and why; whether the other one is worth a second look.
- Does the screenshot read as the main thing when it is the face of a building?
- Does it still feel like driving, or does the road become a divider between two columns?
- Does the tunnel earn its place, or is it a longer version of the pan?

## Answer

Not pursued: Neon Signs revised ([ticket 02](02-neon-signs-revised.md)) became the homepage as the Highrise.
