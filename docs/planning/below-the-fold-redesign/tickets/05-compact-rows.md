# Compact rows for a Section past three Projects

Type: task
Status: needs-triage

## Question

The [spec](../spec.md#three-tiers-of-project) asks for "one Featured Project, then normal Projects, then compact rows if a Section ever grows past three". The Highrise gives every Building and Games Project a floor of its own, and has no compact tier. Nothing needs one yet: Building and Games have three Projects each.

How should a Section's fourth Project onwards appear on the Highrise?

## What to build

- When Building or Games has more than three Projects, the first three keep their floors and the rest become compact rows.
- Start from the Other Section's tenant directory at street level (`src/components/GroundFloor.astro`): names and taglines pressed into black felt, lined up like a directory listing.
- Decide where the rows hang: a directory board on the Section's last floor, or a floor of their own.
- Decide whether a compact row keeps a small lit thumbnail of its screenshot, or drops it like the Other Section.
- Desktop first; then check 390×844 is usable.

## Answer

_(unresolved)_
