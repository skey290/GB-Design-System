# ProgressBar

> Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3311-1341) · node-id `3311:1341` (frame name: `Part/Progress`, correctly spelled — the "Prograss" typo lives on a different layer, an instance *inside* the `Progress` component, not this frame's own name)
> Code: `components/ui/progress-bar/progress-bar.tsx`

## Overview

An atom that draws a **deterministically filled bar from a numeric `value`** within a `min`–`max` range. It is not a native `<progress>` element but a two-level `<div>` structure (track + indicator) carrying `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`. The `value` is clamped into range, converted to a percentage, and applied to the indicator's `width` as an inline style.

**How ProgressBar and Spinner differ** — both signal loading, so they are easy to mix up:

| | ProgressBar | Spinner |
| --- | --- | --- |
| Progress model | **Determinate** — the percentage is known and drawn as bar width from `value` | **Indeterminate** — the percentage is unknown; a `LoaderCircle` icon simply spins. There is no progress concept at all |
| Prop axis | `value` / `min` / `max` (numeric) | `variant` + `label` (no numeric prop) |
| DOM role | `role="progressbar"` with the numeric ARIA attributes | a badge-shaped `<span>` wrapping icon and label, no `role="progressbar"` |
| Shape | a wide pill-shaped track | a small badge with icon and label side by side |

So uploads and installs with a known completion percentage use ProgressBar; loading with no known end uses Spinner.

## When to use

- When progress is known as a number (0–100%, or a custom `min` / `max` range) and must be visualized as a bar.
- When the accessibility tree needs a `progressbar` role with `aria-valuenow` / `aria-valuemin` / `aria-valuemax` (name it through `aria-label`).

## When not to use

- **When progress is unknown** → [Spinner](./spinner.md). ProgressBar requires a `value` and cannot express an indeterminate state.
- **When a label is needed, do not use it alone.** If status copy belongs above the bar, use [Progress](./progress.md), which composes this component plus a label line. This component owns the bar only.

## How to use

```tsx
// Basic — values in steps of 10, matching the Figma Percentage(%) variants 1:1
<ProgressBar aria-label="progress" value={0} />
<ProgressBar aria-label="progress" value={50} />
<ProgressBar aria-label="progress" value={100} />

// Out-of-range values are clamped automatically
<ProgressBar aria-label="progress" value={250} min={0} max={100} /> // → clamped to 100%

// Custom min/max range
<ProgressBar aria-label="upload" value={150} min={100} max={200} /> // → 50%
```

The story decorator wraps it in a fixed-width container. ProgressBar itself is `width: 100%`, so the parent always decides the width. Figma draws this component at a fixed 1000px, but that is forced rather than a spec: the track's only child (`Indicator`) is absolutely positioned, so the track has zero in-flow children and cannot `HUG` — `width: 100%` is correct, not a departure. Figma's own sibling component, `Progress` (which wraps this one with a label), doesn't carry the 1000px forward either: when `Part/Progress` is placed as a nested instance inside `Progress`, Figma itself shrinks it to that parent's own width (226px) rather than keeping 1000.

## Structure

Five files per the project component rule: `progress-bar.tsx` / `progress-bar.module.css` / `progress-bar.stories.tsx` / `progress-bar.test.tsx` / `index.ts`.

```
<div role="progressbar" aria-valuenow aria-valuemin aria-valuemax aria-label data-slot="progress-bar-track">
  <div data-slot="progress-bar-indicator" style={{ width: `${percent}%` }}>
```

Figma's structure (node `4059:4520`) has a third level the code doesn't reproduce: inside `Indicator` there are two zero-width marker layers, `Start` and `End`. Being zero-width, they render nothing, so the rendered result is still effectively two levels — but the layer tree itself is three deep, not two. The track (`rounded-full`, `background/subtler`) contains `Indicator` (`background/bolder`, `rounded-full`), which the Figma original positions absolutely (`left-0 right-1/2` with a vertical translate), whereas the code uses a natural in-flow `height: 100%` + `width: {percent}%`. The visual result is identical and the code is simpler.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Current progress, clamped into `min`–`max` (maps to the Figma `Percentage(%)` variant) |
| `min` | `number` | `0` | Minimum |
| `max` | `number` | `100` | Maximum |
| `className` | `string` | — | Merged onto the track `<div>` |
| `aria-label` | `string` | — | Accessible name for the `progressbar` role |

No other HTML attributes are inherited — this is an explicit props interface with no spread.

## Variants

The Figma component set has a single `Percentage(%)` axis with eleven symbols from `0` to `100` in steps of 10.

The code takes `value` as a continuous `number`, so unlike Figma's decade snaps it handles any value (`value={73}` included). Figma simply designed eleven representative snapshots; the implementation is a continuous spectrum.

| Element | Token |
| --- | --- |
| Track background | `--gb-background-subtler` |
| Indicator background | `--gb-background-bolder` |
| Track and indicator radius | `--gb-radius-scale-full` |

Figma binds the same two background variables and `radius-full` (9999px, equal to the code's `--gb-radius-scale-full`). The track height is 8px — a component dimension, so it is a literal px rather than a spacing token, following the same convention as Button's 36px.

## States and behaviors

- **Clamping** — a `value` above `max` becomes `max`, below `min` becomes `min`. Verified by `progress-bar.test.tsx` (there is no separate `ClampsOutOfRangeValues` story — the only export is `Playground`).
- **`min === max` guard** — to avoid dividing by zero, `percent` is forced to `0` when `max === min`. No test currently covers this specific case.
- **Custom ranges** — `min` / `max` need not be 0–100; the percentage is always `(value - min) / (max - min)`.
- **Transition on value change** — a CSS Module rule (`transition: width 150ms cubic-bezier(0.4, 0, 0.2, 1)`, not a Tailwind `transition-[width]` class) animates width changes. Duration and easing match every other transition in `components/ui/`.
- **Accessibility values stay in sync** — `aria-valuenow` always reflects the **clamped** value, not the raw `value`, alongside the `min` and `max` props.
- **The label is `aria-label` only** — there is no visible text slot in the structure. Without the prop, no accessible name is rendered.
- **No hover or disabled state** — this is a purely non-interactive display, so no interaction state is designed.

## Composition with other components

Used by [Progress](./progress.md), which stacks a status line above it.

## Figma does not specify motion

The Figma file's variable collections are `space`, `color-primitives`, `radius`, `stroke`, `opacity`, `font`, and `color` — **there is no duration or easing collection.** Using the default duration and easing for `transition-[width]` is therefore not a departure from Figma; there is simply no spec to compare against.

## `min === max` resolves to 0%

A code-only guard against dividing by zero. The Figma `Percentage(%)` axis has no `min` / `max` concept and therefore no matching variant. An empty bar (0%) is a safer default than a full one (100%), so 0% was chosen. No test currently pins this specific guard.
