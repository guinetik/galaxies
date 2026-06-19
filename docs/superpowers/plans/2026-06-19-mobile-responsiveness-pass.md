# Mobile Responsiveness Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Photo, Cosmic Map, Local Group, and Spacetime views usable on phones — canvas/image visible by default, no overlapping HUD, controls available on demand.

**Architecture:** Pure responsive CSS + small Vue template/state additions. One mobile breakpoint (`max-width: 640px`); desktop layout is left untouched. Overlay views get a "canvas-first + toggle" treatment: title shrinks and clears the controls, and the secondary panels (structures/waypoints + legend) hide behind a floating HUD toggle. The photo view becomes a scrolling page with a fixed-height canvas and a real thumbnail grid. No Three.js / scene / shader code changes.

**Tech Stack:** Vue 3 SFCs (`<script setup lang="ts">`, scoped CSS), Vite, Tailwind (available but these views use scoped CSS — match that), vue-tsc for type checking.

## Global Constraints

- Mobile breakpoint: `@media (max-width: 640px)` — single cutoff for this pass.
- Header offset variable: `var(--header-height)` (= `52px`, from `src/assets/main.css`). Use it for top offsets; never hardcode 52.
- Do NOT change desktop (>640px) appearance. All new rules live inside the `@media (max-width: 640px)` block, except the base `.hud-toggle { display: none; }` rule (hidden on desktop).
- Do NOT touch Three.js scene classes, shaders, or scene resize logic. The photo view's `ResizeObserver` already reacts to canvas-wrapper size changes — giving the wrapper a real height is enough.
- Accent color used across these views: `#22d3ee`. Panel background idiom: `rgba(0,0,0,0.6–0.7)` + `backdrop-filter: blur(8px)`.
- After each task: `npm run build` must pass (vue-tsc gate), then commit.
- Verification is visual (no layout test framework). Use `npm run dev` + browser devtools device emulation at ~390px width.

---

## File Structure

- `src/views/GalaxyPhotoView.vue` — scroll on mobile, fixed-height canvas, thumbnail bands grid, shrunk hero (CSS only).
- `src/views/CosmicMapView.vue` — `hudOpen` state, HUD toggle button, compact title, repositioned tabs, collapsible structures-nav + legend.
- `src/views/SpacetimeView.vue` — same overlay pattern as Cosmic Map.
- `src/views/LocalGroupView.vue` — same overlay pattern (waypoints = `.structures-nav`, no legend).

Each view is self-contained; tasks are independent and can be done in any order. Recommended order below goes highest-severity → pattern-setter → repeats.

---

### Task 1: Photo view — scrollable layout, fixed-height canvas, thumbnail bands

**Files:**
- Modify: `src/views/GalaxyPhotoView.vue` (scoped `<style>` only; no template/script change)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: nothing other tasks rely on.

Context: `.photo-scroll` is `position: fixed; inset: 0; overflow: hidden`. `.photo-page` is `height: 100dvh; overflow: hidden; display: flex; flex-direction: column` containing `.photo-hero`, `.content-grid` (`flex: 1`), which holds `.canvas-card` (`flex: 1`) and `.bands-card` (fixed height). On short screens the canvas `flex:1` collapses to ~10px and the page can't scroll. Bands use `object-fit: cover` in tall thin flex cells → 1px strips.

- [ ] **Step 1: Add the mobile block to the scoped style**

Append this block at the very end of the `<style scoped>` section in `src/views/GalaxyPhotoView.vue` (immediately before the closing `</style>`). It comes after the existing `@media (max-width: 768px)` / `(max-width: 480px)` blocks so it wins at ≤640px (later rule, switching `.bands-grid` to `display: grid` overrides the older flex rules):

```css
/* ── Mobile (≤640px): scrolling page, fixed-height canvas, thumbnail bands ── */
@media (max-width: 640px) {
  /* Let the page scroll instead of clipping to one screen */
  .photo-scroll {
    overflow-y: auto;
  }

  .photo-page {
    height: auto;
    min-height: 100dvh;
    overflow: visible;
    padding: calc(var(--header-height, 52px) + 0.5rem) 1rem 1.5rem;
  }

  /* Shrink the hero so it does not eat the canvas height */
  .photo-hero-title {
    font-size: 2rem;
  }

  .photo-hero-subtitle {
    font-size: 1rem;
  }

  .hero-links {
    margin-bottom: 1rem;
  }

  .back-link,
  .shuffle-link {
    font-size: 0.8rem;
  }

  /* Stack canvas + bands; canvas gets a real, non-collapsing height */
  .content-grid {
    display: block;
  }

  .canvas-card {
    flex: none;
    margin-bottom: 1rem;
  }

  .canvas-wrapper {
    flex: none;
    height: 55dvh;
    min-height: 280px;
  }

  /* Stack the card header so the shader select stops crowding the title */
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .header-actions {
    width: 100%;
  }

  /* Spectral bands as a real thumbnail grid (kills the 1px-strip distortion) */
  .bands-card {
    height: auto;
  }

  .bands-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    height: auto;
  }

  .band-item {
    flex: none;
    aspect-ratio: 1;
  }

  .band-img-wrap {
    height: 100%;
  }
}
```

- [ ] **Step 2: Type-check / build**

Run: `cd src/main/site && npm run build`
Expected: build succeeds (no vue-tsc errors). CSS-only change, so this should pass cleanly.

- [ ] **Step 3: Visual verification**

Run: `cd src/main/site && npm run dev`, open `http://localhost:9965/g/2429/photo` (or any PGC with photo data), enable browser device emulation at ~390px width.
Expected:
- Page scrolls vertically.
- Composite canvas is large (~55% of viewport height), not a thin sliver.
- "Composite Imaging" title and the shader dropdown stack (no crowding); "Tune image" sits over the canvas top-right as before.
- Spectral bands show as a 3-column grid of square thumbnails with correct (cover) aspect ratio — no 1px towers.
- At desktop width (>640px) the layout is unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/main/site/src/views/GalaxyPhotoView.vue
git commit -m "fix(photo): mobile scroll layout, fixed-height canvas, thumbnail bands grid"
```

---

### Task 2: Cosmic Map — compact title, repositioned tabs, collapsible HUD

**Files:**
- Modify: `src/views/CosmicMapView.vue` (template, `<script setup>`, scoped `<style>`)

**Interfaces:**
- Consumes: existing `loading`, `showInfo` refs.
- Produces: `hudOpen: Ref<boolean>` (local to this view; not shared).

Context: `.map-title` is full-width centered starting at header height; `.map-controls` (tabs + Show Axes) is `fixed; left: 24px` at the same height → they overlap. `.structures-nav` (top-left list) and `.map-legend` (bottom-left, 9 items) are fixed desktop panels with no mobile handling.

- [ ] **Step 1: Add `hudOpen` state**

In the `<script setup>` of `src/views/CosmicMapView.vue`, add this line next to the other refs (e.g. directly after `const showInfo = ref(false)`):

```ts
const hudOpen = ref(false)
```

(`ref` is already imported.)

- [ ] **Step 2: Bind the HUD-open class on the two collapsible panels**

In the template, change the legend opening tag:

```html
<div v-if="!loading && !showInfo" class="map-legend" :class="{ 'hud-open': hudOpen }">
```

and the structures-nav opening tag:

```html
<div v-if="!loading" class="structures-nav" :class="{ 'hud-open': hudOpen }">
```

- [ ] **Step 3: Add the HUD toggle button**

In the template, immediately before the closing `</div>` of `.cosmic-map-container` (after the tooltip block), add:

```html
    <!-- Mobile HUD toggle (controls structures + legend) -->
    <button
      v-if="!loading"
      class="hud-toggle"
      :aria-label="hudOpen ? 'Hide map controls' : 'Show map controls'"
      @click="hudOpen = !hudOpen"
    >
      {{ hudOpen ? '×' : '≡' }}
    </button>
```

- [ ] **Step 4: Add the toggle base style + mobile block**

In the scoped `<style>`, add the base `.hud-toggle` rule and the mobile block at the end (replace the existing `@media (max-width: 640px)` block — which currently only widens `.map-sidebar` — with the expanded one below so there is a single 640 block):

```css
/* ── Mobile HUD toggle (hidden on desktop) ── */
.hud-toggle {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 16px;
  z-index: 22;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.65);
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .map-sidebar {
    width: 100%;
  }

  /* Compact title that no longer reserves the controls zone */
  .map-title {
    padding: calc(var(--header-height) + 44px) 12px 14px;
  }

  .map-title-text {
    font-size: 16px;
    letter-spacing: 0.15em;
    margin-bottom: 0;
  }

  .map-subtitle {
    display: none;
  }

  /* Tabs become a centered bar directly under the app header */
  .map-controls {
    top: calc(var(--header-height) + 6px);
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
  }

  /* Secondary panels hidden until the HUD toggle opens them */
  .structures-nav:not(.hud-open),
  .map-legend:not(.hud-open) {
    display: none;
  }

  /* When open, keep them on-screen and scrollable */
  .structures-nav {
    top: calc(var(--header-height) + 96px);
    left: 12px;
    max-height: 50vh;
    overflow-y: auto;
  }

  .map-legend {
    left: 12px;
    bottom: 80px;
  }

  .hud-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

- [ ] **Step 5: Type-check / build**

Run: `cd src/main/site && npm run build`
Expected: build succeeds (vue-tsc passes with the new `hudOpen` ref and template binding).

- [ ] **Step 6: Visual verification**

Run dev server, open `http://localhost:9965/map`, device emulation ~390px.
Expected:
- Title is small and centered and does NOT overlap the Groups/Galaxies/Info tabs (tabs are a centered bar under the header).
- STRUCTURES list and the V_CMB legend are hidden by default; the canvas is fully visible.
- A round `≡` button (bottom-right) reveals them (turns to `×`); STRUCTURES list is capped at 50vh and scrolls.
- Desktop (>640px) unchanged.

- [ ] **Step 7: Commit**

```bash
git add src/main/site/src/views/CosmicMapView.vue
git commit -m "fix(cosmic-map): mobile compact title, centered tabs, collapsible HUD"
```

---

### Task 3: Spacetime — compact title, collapsible HUD

**Files:**
- Modify: `src/views/SpacetimeView.vue` (template, `<script setup>`, scoped `<style>`)

**Interfaces:**
- Consumes: existing `loading`, `showInfo` refs.
- Produces: `hudOpen: Ref<boolean>` (local).

Context: `.spacetime-title` full-width centered; `.info-toggle` (i button) top-left; `.info-panel`, `.structures-nav` (with an inline `:style` top binding), `.map-legend` (bottom-left). The inline `:style` on `.structures-nav` sets `top` — leave it; the mobile rules below only set `left`, `max-height`, `overflow`, and the hide/show, which do not conflict with the inline `top`.

- [ ] **Step 1: Add `hudOpen` state**

In `<script setup>` of `src/views/SpacetimeView.vue`, add after `const showInfo = ref(false)`:

```ts
const hudOpen = ref(false)
```

- [ ] **Step 2: Bind the HUD-open class on the collapsible panels**

Legend opening tag:

```html
<div v-if="!loading" class="map-legend" :class="{ 'hud-open': hudOpen }">
```

Structures-nav opening tag (keep the existing `:style`, add `:class`):

```html
<div
  v-if="!loading"
  class="structures-nav"
  :class="{ 'hud-open': hudOpen }"
  :style="{ top: showInfo ? '420px' : 'calc(var(--header-height) + 130px)' }"
>
```

- [ ] **Step 3: Add the HUD toggle button**

In the template, before the closing `</div>` of `.spacetime-page` (after the structures-nav block), add:

```html
    <!-- Mobile HUD toggle (controls structures + legend) -->
    <button
      v-if="!loading"
      class="hud-toggle"
      :aria-label="hudOpen ? 'Hide controls' : 'Show controls'"
      @click="hudOpen = !hudOpen"
    >
      {{ hudOpen ? '×' : '≡' }}
    </button>
```

- [ ] **Step 4: Add the toggle base style + mobile block**

Append to the scoped `<style>` (this view has no existing `@media` block):

```css
/* ── Mobile HUD toggle (hidden on desktop) ── */
.hud-toggle {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 16px;
  z-index: 22;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.65);
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

@media (max-width: 640px) {
  .spacetime-title {
    padding: calc(var(--header-height) + 44px) 12px 14px;
  }

  .spacetime-title-text {
    font-size: 16px;
    letter-spacing: 0.15em;
    margin-bottom: 0;
  }

  .spacetime-subtitle {
    display: none;
  }

  .info-toggle {
    left: 12px;
  }

  .info-panel {
    top: calc(var(--header-height) + 44px);
    left: 12px;
    right: 12px;
    max-width: none;
  }

  /* Secondary panels hidden until the HUD toggle opens them */
  .structures-nav:not(.hud-open),
  .map-legend:not(.hud-open) {
    display: none;
  }

  .structures-nav {
    left: 12px;
    max-height: 50vh;
    overflow-y: auto;
  }

  .map-legend {
    left: 12px;
    bottom: 80px;
  }

  .hud-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

- [ ] **Step 5: Type-check / build**

Run: `cd src/main/site && npm run build`
Expected: build succeeds.

- [ ] **Step 6: Visual verification**

Run dev server, open `http://localhost:9965/spacetime`, device emulation ~390px.
Expected:
- "SPACETIME FABRIC" title small, no overlap with the `i` button or description.
- STRUCTURES list + legend hidden by default; fabric canvas fully visible.
- `≡` button (bottom-right) reveals them; `i` button still opens the info panel (full-width).
- Desktop unchanged.

- [ ] **Step 7: Commit**

```bash
git add src/main/site/src/views/SpacetimeView.vue
git commit -m "fix(spacetime): mobile compact title and collapsible HUD"
```

---

### Task 4: Local Group — compact title, repositioned tabs, collapsible waypoints

**Files:**
- Modify: `src/views/LocalGroupView.vue` (template, `<script setup>`, scoped `<style>`)

**Interfaces:**
- Consumes: existing `loading`, `showInfo` refs.
- Produces: `hudOpen: Ref<boolean>` (local).

Context: `.local-group-title` full-width centered; `.map-controls` (Frame/Info tabs) `fixed; left: 24px` at header height → overlaps title; `.info-panel` (right); `.structures-nav` (waypoints, `bottom: 24px; left: 24px`). No legend. There is an existing `@media (max-width: 900px)` block — leave it; add a separate `@media (max-width: 640px)` block AFTER it so the 640 rules win at phone widths.

- [ ] **Step 1: Add `hudOpen` state**

In `<script setup>` of `src/views/LocalGroupView.vue`, add after `const showInfo = ref(false)`:

```ts
const hudOpen = ref(false)
```

(`ref` is already imported.)

- [ ] **Step 2: Bind the HUD-open class on the waypoints panel**

Change the `.structures-nav` opening tag:

```html
<div
  v-if="!loading"
  class="structures-nav"
  :class="{ 'hud-open': hudOpen }"
>
```

- [ ] **Step 3: Add the HUD toggle button**

In the template, before the `<GalaxyTooltip ... />` element (still inside `.local-group-page`), add:

```html
    <!-- Mobile HUD toggle (controls waypoints) -->
    <button
      v-if="!loading"
      class="hud-toggle"
      :aria-label="hudOpen ? 'Hide waypoints' : 'Show waypoints'"
      @click="hudOpen = !hudOpen"
    >
      {{ hudOpen ? '×' : '≡' }}
    </button>
```

- [ ] **Step 4: Add the toggle base style + mobile block**

In the scoped `<style>`, add the base `.hud-toggle` rule (anywhere among the base rules) and a new `@media (max-width: 640px)` block placed AFTER the existing `@media (max-width: 900px)` block:

```css
/* ── Mobile HUD toggle (hidden on desktop) ── */
.hud-toggle {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 16px;
  z-index: 22;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.65);
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

@media (max-width: 640px) {
  .local-group-title {
    padding: calc(var(--header-height) + 44px) 12px 14px;
  }

  .local-group-title-text {
    font-size: 16px;
    letter-spacing: 0.15em;
    margin-bottom: 0;
  }

  .local-group-subtitle {
    display: none;
  }

  /* Frame/Info tabs become a centered bar under the app header */
  .map-controls {
    top: calc(var(--header-height) + 6px);
    left: 50%;
    transform: translateX(-50%);
  }

  .info-panel {
    top: calc(var(--header-height) + 44px);
    left: 12px;
    right: 12px;
    max-width: none;
  }

  /* Waypoints hidden until the HUD toggle opens them */
  .structures-nav:not(.hud-open) {
    display: none;
  }

  .structures-nav {
    left: 12px;
    bottom: 80px;
    max-height: 50vh;
    overflow-y: auto;
  }

  .hud-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

- [ ] **Step 5: Type-check / build**

Run: `cd src/main/site && npm run build`
Expected: build succeeds.

- [ ] **Step 6: Visual verification**

Run dev server, open `http://localhost:9965/local-group`, device emulation ~390px.
Expected:
- "LOCAL GROUP" title small, no overlap with the Frame/Info tabs (centered under the header).
- WAYPOINTS list hidden by default; the tilted-shells canvas fully visible.
- `≡` button (bottom-right) reveals the waypoints list (capped 50vh, scrollable).
- Desktop unchanged.

- [ ] **Step 7: Commit**

```bash
git add src/main/site/src/views/LocalGroupView.vue
git commit -m "fix(local-group): mobile compact title, centered tabs, collapsible waypoints"
```

---

### Task 5: Final regression check

**Files:** none (verification only)

- [ ] **Step 1: Run the test suite**

Run: `cd src/main/site && npm test`
Expected: all 209 tests pass (these are logic/shader tests; layout changes should not affect them). If anything fails, investigate before considering the pass done.

- [ ] **Step 2: Full build**

Run: `cd src/main/site && npm run build`
Expected: vue-tsc + vite build succeed.

- [ ] **Step 3: Cross-page visual sweep**

With `npm run dev` and device emulation at ~390px, walk all four pages (`/g/<pgc>/photo`, `/map`, `/local-group`, `/spacetime`) and confirm against the original screenshots in `tmp/mobile/`: no title/tab overlap, canvas visible by default, toggles work, photo scrolls with a large canvas and a clean bands grid. Then switch to desktop width and confirm each page looks exactly as before.

---

## Self-Review

**Spec coverage:**
- Overlay views — title vs tabs overlap → Tasks 2/3/4 compact title + repositioned controls. ✓
- Overlay views — panels blanket canvas, no toggle → Tasks 2/3/4 `hudOpen` + `.hud-toggle` + `:not(.hud-open){display:none}`. ✓
- Photo — canvas collapse / can't scroll → Task 1 `.photo-scroll{overflow-y:auto}`, `.photo-page{height:auto;min-height:100dvh;overflow:visible}`, `.canvas-wrapper{height:55dvh}`. ✓
- Photo — distorted bands → Task 1 grid + `aspect-ratio:1`. ✓
- Photo — header crowding / wrapping links → Task 1 `.card-header` stack + smaller hero links. ✓
- Single 640 breakpoint; desktop untouched → all rules inside `@media (max-width:640px)` except base `.hud-toggle{display:none}`. ✓
- No scene/shader changes → only CSS + `hudOpen` ref + toggle button. ✓
- Deferred decision (tabs placement) → resolved to "centered bar under header" in Tasks 2/4. ✓
- Deferred decision (shared component) → kept per-view (each defines its own `hudOpen` + `.hud-toggle`); not extracted (YAGNI). ✓

**Placeholder scan:** No TBD/TODO; every CSS block and template snippet is complete and literal.

**Type consistency:** `hudOpen` is a `ref(false)` in each of the three overlay views, referenced only within that same view's template (`:class="{ 'hud-open': hudOpen }"`, `@click="hudOpen = !hudOpen"`). The CSS hook class is `hud-open` (kebab) bound from the `hudOpen` ref — consistent in every task. The toggle class is `.hud-toggle` everywhere.
