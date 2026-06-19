# Mobile Responsiveness Pass — Design

Date: 2026-06-19
Status: Draft (awaiting review)

## Problem

Four views are broken or unusable on mobile (narrow viewports). Evidence: device
screenshots in `tmp/mobile/` (cosmicmap, local-group, spacetime, photo-screen).

The app shell is fixed and non-scrolling (`html, body { overflow: hidden }`,
`--header-height: 52px`); each view paints its own `position: fixed` HUD. The HUD
was tuned for desktop only, so on phones:

### Overlay views — Cosmic Map, Local Group, Spacetime

These three share one pattern (`.map-title`, `.map-controls`/tabs,
`.structures-nav`, `.map-legend`; Local Group uses `LocalGroupWaypointRail`):

- **Title collides with tabs.** `.map-title` is full-width, centered, and starts at
  header height; the tab/segmented control is pinned `left: 24px` at the *same*
  height. They overlap.
- **Panels blanket the canvas.** `.structures-nav` (tall button list, left) and
  `.map-legend` (9-item velocity legend, bottom-left) are fixed desktop panels with
  no mobile sizing and no way to dismiss them. They cover most of the 3D canvas —
  the actual content — and cannot be toggled off.

### Photo view (NSA, `/g/:pgc/photo`)

- **Canvas collapses to ~10px.** `.photo-page` is `height: 100dvh; overflow: hidden`
  flex column: `hero` (3.5rem title + wrapping links) + `canvas-card` (`flex: 1`) +
  `bands-card` (fixed 160–320px). On short screens the hero and bands eat the
  height and squeeze the canvas `flex: 1` to near-zero.
- **Can't scroll to recover.** The container is named `.photo-scroll` but has
  `overflow: hidden`, so the page does not scroll.
- **Spectral band images distorted.** Bands render as ~1px-wide tall strips
  (`object-fit: cover` inside tall thin flex items); NUV renders as a white tower.
- **Header crowding.** "Back to Galaxy" / "Shuffle Another Galaxy" links wrap;
  "Tune image" overlaps the canvas.

## Goals

- On phones, the 3D canvas / image is the hero and is visible by default.
- No element overlaps another (title vs tabs, panels vs canvas).
- All controls remain reachable, on demand.
- Preserve the existing desktop layout and visual identity unchanged.
- No changes to Three.js scene logic — layout/CSS and small template/state changes only.

Non-goals: redesigning the desktop HUD; restyling beyond what mobile requires;
touching scene/shader code; the Home galaxy field (not in the reported set).

## Approach: canvas-first + toggle (option A)

A single mobile breakpoint (`max-width: 640px`). Above it, nothing changes.

### Overlay views (Cosmic Map, Local Group, Spacetime)

1. **Compact title.** On mobile, shrink the title (≈18px), drop the tall gradient
   padding, and constrain its footprint so it no longer reserves the tab zone.
2. **Reposition primary controls.** Move the tab/segmented control (Groups/Galaxies/
   Info; Frame/Info) clear of the title — a compact bar directly under the app
   header — so title and tabs never overlap.
3. **Collapsible secondary HUD.** The STRUCTURES/WAYPOINTS nav and the velocity
   legend are **hidden by default** on mobile, behind one floating toggle button
   ("HUD"/layers icon, bottom area, clear of the OS nav bar). Tapping it reveals a
   single compact panel (containing structures list + legend); tapping again or
   tapping the canvas dismisses it. Canvas is fully visible by default.
4. The existing full-width info sidebar (`@media max-width: 640px` already sets
   `width: 100%`) is kept for the "Info" content.

A small shared piece of state (`hudOpen`) and a shared toggle button are added per
view. If the three implementations converge, extract a `MobileHudToggle` component;
otherwise keep per-view (YAGNI — decide during implementation, don't pre-build).

### Photo view

1. **Let it scroll on mobile.** Change `.photo-scroll`/`.photo-page` so that at
   `max-width: 640px` the page scrolls vertically (`overflow-y: auto`, height
   `min-height: 100dvh` instead of fixed `100dvh; overflow: hidden`). Desktop keeps
   the fixed, non-scrolling layout.
2. **Canvas never collapses.** Give `.canvas-card`/`.canvas-wrapper` a
   `min-height` on mobile (≈50dvh) so the composite is always usefully large.
3. **Shrink the hero.** Title to ≈2rem on mobile; stack/condense the hero links and
   `header-actions` (shader select + ✦ + ⓘ) so they don't wrap awkwardly.
4. **Fix the bands grid.** Replace the fixed-height tall-strip layout with a real
   thumbnail grid on mobile: a 3-column (or 2-column on very narrow) grid of
   roughly square cells, so band images keep a sensible aspect ratio with
   `object-fit: cover`. Remove the fixed heights that force thin columns.
5. **Tune image.** Verify the "Tune image" button and drawer remain usable on the
   scrollable mobile layout (drawer already `max-width: 50%`).

## Affected files

- `src/views/CosmicMapView.vue` — title/controls/structures/legend responsive CSS + `hudOpen` toggle.
- `src/views/SpacetimeView.vue` — same pattern.
- `src/views/LocalGroupView.vue` + `src/components/local-group/LocalGroupWaypointRail.vue` — waypoint rail toggle + title/controls responsive CSS.
- `src/views/GalaxyPhotoView.vue` — scroll behavior, canvas min-height, hero, bands grid.
- Possibly `src/assets/main.css` — only if a shared breakpoint token or shared toggle style is warranted.

## Testing / verification

- No existing unit tests cover view layout; this is visual/responsive. Verify by
  running the dev server and checking each page at a phone width (≤640px) and at
  desktop width (unchanged).
- Confirm: title never overlaps tabs; canvas visible by default on all four pages;
  toggles reveal/hide panels; photo page scrolls and canvas has real height; band
  thumbnails are not distorted.
- Run `npm test` to confirm no regressions (layout changes shouldn't affect the
  209 passing tests, but verify).

## Risks / open questions

- Exact mobile placement of the primary tabs (under header vs inside the HUD
  toggle) — settle during implementation against the live layout.
- Whether to extract a shared `MobileHudToggle` component or keep per-view — decide
  after the first view is done.
