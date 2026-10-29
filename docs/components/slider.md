# Slider

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-10513) — `Slider` (node-id `76:10520`)
Code: `components/ui/slider/slider.tsx`

## Overview

A track the user drags to pick a single value from a continuous range. The filled portion and the round thumb show the current value.

## When to use

- For adjusting an approximate value **by feel** — volume, brightness, a ratio.
- The minimum, maximum, and step are the consumer's to set, which is the documented design intent.

## When not to use

- **When an exact number must be typed** → [Input](./input.md). A slider cannot hit a precise value reliably.
- For a start/end pair — Figma has no such design.

## How to use

```tsx
// Uncontrolled
<Slider defaultValue={30} aria-label="Brightness" />

// Controlled
<Slider value={volume} onValueChange={setVolume} aria-label="Volume" />

// Custom range and step
<Slider min={0} max={200} step={10} value={v} onValueChange={setV} aria-label="Price" />

// Linked to a label element
<label id="brightness-label">Brightness</label>
<Slider aria-labelledby="brightness-label" />

// Fill the parent instead of the fixed 435px
<Slider shouldFitContainer value={v} onValueChange={setV} aria-label="Targeted followers" />
```

## Structure

Five files per the project component rule: `slider.tsx` / `slider.module.css` / `slider.stories.tsx` / `slider.test.tsx` / `index.ts`.

```
<div data-slot="slider-track">       height 6, radius full, clickable
  <div data-slot="slider-range" />   filled portion, from the left by percent
  <div role="slider" />              16×16 thumb, absolutely placed at the value
```

- Track height (6px) and thumb size (16px) are literal px — Figma has no variable bound to either, and per this project's rule a component's own dimensions are literal px rather than spacing tokens.
- The thumb is centered on the value with `translate(-50%, -50%)`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | Current value when controlled |
| `defaultValue` | `number` | `30` | Initial value when uncontrolled |
| `onValueChange` | `(value: number) => void` | — | Called on drag, click, and keyboard interaction |
| `min` | `number` | `0` | Minimum |
| `max` | `number` | `100` | Maximum |
| `step` | `number` | `1` | Increment |
| `shouldFitContainer` | `boolean` | `false` | Stretch the track to the parent width instead of the fixed 435px |
| `aria-label` | `string` | — | Accessible name for the thumb |
| `aria-labelledby` | `string` | — | Accessible name via a label element's id |
| `id` | `string` | — | Root id |
| `className` | `string` | — | Merged onto the track |

Always pass either `aria-label` or `aria-labelledby` — the thumb has no visible text.

## Variants

There is no `variant` prop, and **Figma has no variant axis either** — a single `Slider` component whose fill length and thumb position follow the value. No disabled state is defined.

## States and behaviors

| Property | Figma | Code |
| --- | --- | --- |
| Track height | 6px, no variable bound | 6px literal |
| Track background | `background/subtler` | `--gb-background-subtler` |
| Filled portion | `background/bold` | `--gb-background-bold` |
| Thumb size | 16×16, no variable bound | 16px literal |
| Thumb background | `background/default` | `--gb-background-default` |
| Thumb border | `border/bolder` 1px | `--gb-border-bolder` |
| Radius | full (track, fill, thumb) | `--gb-radius-scale-full` |
| Focus ring | — | `--gb-shadow-focus-ring` (accessibility layer added in code) |

- **Cursor** — the whole track is `pointer`; the thumb is `grab`. `:active` on the thumb switches it to `grabbing`, but the drag handler is attached to the track, not the thumb — a drag that starts on the track never passes through the thumb's own `:active`, so `grabbing` is only reliably reachable by pressing the thumb itself, not by dragging from elsewhere on the track.
- **Keyboard** — the thumb carries `role="slider"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`. Arrow keys move by `step`, PageUp/PageDown by 10 steps, Home/End jump to the bounds.
- **Track click** — pressing anywhere on the track jumps the value there without dragging the thumb.
- **The focus ring is not in Figma.** Without a visible focus marker on the thumb a keyboard user cannot tell where they are, so it is added in code.

## Sizing

The track is a fixed 435px by default, matching the Figma component. That 435px is likely a mockup width rather than a spec, though: the component's children are both `Fill`, so it cannot `HUG` and 435 was forced; the same 435 also exactly equals the section's content-column width (`64 + 435 + 64`) and matches a sibling description frame at the same width. Pass `shouldFitContainer` when the parent should decide the width — `components/app/goal-setting` does this for the Targeted Followers row.

## Composition with other components

A standalone component that reuses nothing else. Used by `components/app/goal-setting`.
