# Below-the-fold redesign: design brief

Status: needs-triage

Everything under the Hero on the home page is up for a radical redesign. Five throwaway prototypes have been built and reviewed (see [Prototypes so far](#prototypes-so-far)); none is the answer, but between them they pinned down what the answer has to do. This brief records that so the next round of prototypes has something to check against.

Nothing here picks a direction. The current site stays as it is until an ambitious design is ready; there is no deadline.

## Who the page is for

Three visitors, in order of how little they care. The effort it takes to find something should be inversely proportional to how much the visitor wants it.

| Visitor                 | How they arrive                               | What they are asking                      | What must happen                                                                                                                                   |
| ----------------------- | --------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Credibility-checker** | Social media, after an interaction with Eugen | Is this person worth paying attention to? | The first screen catches them before they close the tab. The Hero already does this; the site being unique and memorable is itself the credential. |
| **Tool-finder**         | From one of Eugen's Projects, wanting more    | Has he built anything else I'd use?       | Projects come straight after the Hero, most interesting first, with nothing between them and the Hero. They will scroll; they do not need to scan. |
| **Coworker**            | Knows Eugen, curious about him outside work   | What is he into?                          | Sections like Games signal interests. About, photos, hobbies live on their own pages behind a small, tucked-away link. They will click through.    |

Consequences:

- This page is Projects only. It does not need to grow to hold a blog, photos or an About.
- Nothing sits between the Hero and the first Section. No intro, no About, no list of posts.
- One Project per screen is acceptable. "Scannable" is not a goal; "nothing in the way" is.
- Two of the three visitors probably arrive on a phone, but the design is desktop first: optimise for desktop, then make the phone usable.

## What the page must do

### Keep the spectacle going

The Hero promises a neon city. Continuing that below the fold is worth striving for, balanced against the other goals: it must not get between the tool-finder and the Projects, and it must still work on a phone. Night Drive is the cautionary case: the strongest atmosphere of the five, undone by a sideways scroll that fights the phone.

### Land the camera

Every scene-based prototype got the same seam wrong: the join between the Hero and what follows. The fix that came up for both Night Drive and Neon Signs is the same move, and it is independent of what the scene lands on:

> The Skyline holds still as the Hero scrolls away. The camera tilts down past the river, with a little parallax on the Skyline for depth, and lands on something on the near bank of the Clyde: a road, a building, a wall. The Hero and what follows become one continuous shot.

It lands on the Highrise's roof, prototyped in [ticket 01](tickets/01-camera-pan.md) against a crane down the Highrise's front, the move it already makes below the roof.

### Present each Project in this order of importance

1. **Screenshot.** The most important element: nothing else gives a visitor as much of an impression of a Project. Whatever the scene, the screenshot must be the lit thing, not a backdrop. (A screenshot that plays as a short clip when it has the visitor's attention is a later upgrade; static screenshots for now.)
2. **Name and tagline.** Important.
3. **Host.** Least important; can be dropped. It tells a phone visitor where a link goes, which is its only job.
4. **Optional prose extras.** Tech, status, year may add value, written as prose ("Built with X, hosted on Z"), never as badges.

### Three tiers of Project

Within a Section: one Featured Project, then normal Projects, then compact rows if a Section ever grows past three. Featured should look different, not just come first; it matters somewhat, not a lot. The Other Section is compact rows only.

### Overdo the motion, then dial back

Interactivity (reacting to scroll, hover, focus) and ambient motion (rain, flicker, water shimmer) are both welcome and both serve the spectacle. Err on the side of too much; it can always be dialled back. Every prototype still needs a reduced-motion fallback, but that is a finishing detail, not a design constraint.

## Decided

- **Palette.** Two colours: every Section heading is cyan Neon and every Sign magenta. Each floor's other colour comes from its screenshot's light. Featured stands out by form instead: an arched window with a lit fanlight.
- **The direction itself.** Neon Signs revised ([ticket 02](tickets/02-neon-signs-revised.md)), built as the Highrise. Night Drive without the sideways scroll ([ticket 03](tickets/03-night-drive-vertical.md)) and the Clyde tunnel ([ticket 04](tickets/04-clyde-tunnel.md)) were not pursued.

## Prototypes so far

All on `prototype/*` branches. What each one taught us:

| Prototype       | Branch                                         | Keep                                                                                                                                                                   | Lose                                                                                                                                                                |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Night Drive** | `prototype/night-drive-style`                  | The most outrun of the five: billboards by a road, a car that brakes and reverses with the scroll. Add rain and it would be incredible.                                | Sideways scroll fights the phone; billboards cut off at the screen edge. The join restarts the sky instead of continuing the Hero. Overlaps the Hero's own Skyline. |
| **Riverside**   | `prototype/riverside-neon-style`, `?variant=A` | Best continuation of the Hero; cleanest; cheapest to finish.                                                                                                           | Not ambitious enough for the current plan. Mirrored headings read as glitched text.                                                                                 |
| **Neon Signs**  | `prototype/riverside-neon-style`, `?variant=B` | Huge neon Project names; signs on a brick wall lighting the bricks around them; a building with floors to descend through, the Other Section at street level or below. | Screenshot demoted to a dim wash (the most important element). Wall too flat; should read as a tall building with windows. Hard edge where river meets wall.        |
| **Marquee**     | `prototype/marquee-style`                      | The lit / unlit tube idea (could become the hover state of another design).                                                                                            | Featured screenshot smaller than normal. A safe option, not being pursued now.                                                                                      |
| **Ping**        | `prototype/ping-style`                         | The projects-first, minimal origin of the site (ping.gg); size tiers.                                                                                                  | Featured does not stand out; the least neon of the five. Featured image spill is clipped by the card.                                                               |

## Deferred

- **Riverside vs Marquee head to head.** The two safe options occupy the same role. Compare them only if the ambitious direction stalls.
- **Screenshots as clips.** Capture short videos per Project; play them when a Project has attention (alone on screen, hovered, focused).
- **About / photos / hobbies pages.** Separate pages, linked from somewhere tucked away.
