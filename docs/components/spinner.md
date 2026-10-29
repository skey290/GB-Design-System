# Spinner

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=1202-731) · node-id `1202:731`
Code: `components/ui/spinner/spinner.tsx`

## Overview

An inline indicator for an **indeterminate** loading state: a spinning loader icon beside a text label, on one line. It is `<span>`-based; the icon is a custom sprite symbol (`/icons.svg#spinner-icon`, rendered via `Icon`), spun by a local `@keyframes spin` in `spinner.module.css` (`rotate(0deg)` → `rotate(360deg)`, 1s linear infinite) — not Tailwind's `animate-spin`, which this component never uses. The icon's fill is `currentColor`, so it tracks the label color automatically.

**The glyph matches Figma exactly.** Figma's icon is a separate component, `Part/Spinner` (node `3492:9739`): a 144°-sweep filled annular-sector path (outer radius 6, inner radius 4.8 — a 1.2 "thickness", mathematically equivalent to a stroke with butt caps), fixed at its `Progress=-90` frame. The sprite symbol's path data is copied directly from that frame's export. Figma binds the fill to `--gb-icon-default`/`--gb-icon-invert` per `Type`, but those tokens resolve to the exact same hex as `--gb-text-default`/`--gb-text-invert` in every mode, so keeping `currentColor` (inherited from the label color below) reproduces the Figma color without a separate binding.

**How it differs from ProgressBar** — the two are easy to confuse since both signal loading, but their structures differ fundamentally:

- **Spinner** is for states where **progress cannot be known**. It has no `value` concept and no `role="progressbar"`; a continuously spinning icon simply says "working". Besides `type` (color) and `label` (text) it also accepts `className` and the rest of `HTMLAttributes<HTMLSpanElement>` (minus `children`) — see Props below.
- **ProgressBar** takes `value` / `min` / `max`, computes a real percentage, and declares `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`. It fills an indicator by computing `width` inline, and its only animation is `transition-[width]` when the value changes.

The dividing line in practice is simply **whether progress can be expressed as a number**: if not, Spinner; if so, ProgressBar.

Structurally Spinner closely resembles Badge — a `<span>` root, color variants, and a pill made from radius plus padding. Unlike Badge it has no `size` variant and no `icon` prop; it always carries the one fixed spinning icon.

## When to use

- To announce that a short async task is running, with a text label, when progress cannot be expressed as a percentage (live example: "Processing" while an image is handled in `profile-print`).
- As an overlay on top of a button, card, or thumbnail to mark that region as busy.

## When not to use

- **When the shape of the loading content is already known** → [Skeleton](./skeleton.md), which fills the slot in the content's own shape.
- **When real progress can be reported** → [ProgressBar](./progress-bar.md). Spinner is indeterminate only and has no progress concept.

## How to use

```tsx
// outline (default)
<Spinner label="Processing" type="outline" />

// reversed
<Spinner label="Processing" type="reversed" />

// primary
<Spinner label="Processing" type="primary" />
```

Overlaid on a shimmer loader (`Skeleton`), as in `profile-print.tsx`:

```tsx
<div className="relative w-full shrink-0">
  <Skeleton type="rectangle" className="aspect-square h-auto rounded-none" />
  <div className="absolute inset-0 flex items-center justify-center">
    <Spinner type="primary" label="Processing" />
  </div>
</div>
```

## Structure

Five files per the project component rule: `spinner.tsx` / `spinner.module.css` / `spinner.stories.tsx` / `spinner.test.tsx` / `index.ts`.

```
<span role="status" aria-live="polite">
  <svg aria-hidden="true"><use href="/icons.svg#spinner-icon" /></svg>   spinning icon
  {label}                                                                text, default "Processing"
</span>
```

## Props

| Prop        | Type                                   | Default        | Description                   |
| ----------- | -------------------------------------- | -------------- | ----------------------------- |
| `type`      | `"outline" \| "reversed" \| "primary"` | `"outline"`    | Color variant (Figma `Type`)  |
| `label`     | `string`                               | `"Processing"` | Text shown beside the icon    |
| `className` | `string`                               | —              | Merged onto the root `<span>` |

The rest of `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` is inherited. `children` is excluded deliberately, so text can only arrive through `label`.

## Variants

The Figma component set has one axis, `Type`, with three symbols (`outline` / `reversed` / `primary`, nodes `1202:728` / `1202:729` / `1202:730`). Unlike Badge there is no `Size` axis — every variant shares the same 20px height.

| type                | Background                          | Text and icon       | Border                                   |
| ------------------- | ----------------------------------- | ------------------- | ---------------------------------------- |
| `outline` (default) | transparent                         | `--gb-text-default` | `--gb-border-1` of `--gb-border-default` |
| `reversed`          | `--gb-background-surface-secondary` | `--gb-text-default` | none                                     |
| `primary`           | `--gb-background-bold`              | `--gb-text-invert`  | none                                     |

Checked against the Figma original, all three variants' background and text tokens match the code exactly. In particular, `reversed` does not use the shadcn default `--secondary` (`--background-subtler`, `#f5f5f5`) but references `--gb-background-surface-secondary` (`#fafafa`) directly, because the two tokens differ in light mode. In dark mode they happen to be equal, which is why the gap went unnoticed for a while.

Dimensions: root gap `--gb-spacing-1` (4px), horizontal padding `--gb-spacing-2` (8px), vertical padding `--gb-spacing-0-5` (2px), radius `--gb-radius-scale-md` (8px), height 20px, icon 12px. Height and icon size are component dimensions, so they are literal px. Typography is five individually declared properties in `spinner.module.css` (`--gb-text-xs`, `--gb-font-weight-medium`, `--gb-leading-4`, `--gb-tracking-normal`, `--gb-font-sans`) — there is no `text-xs-medium` utility class in use.

`Part/Spinner` has a `Progress` axis (`-90` / `0` / `90` / `180`, four static frames 90° apart, each the same 144° arc rotated in place); `Spinner` uses the `-90` frame as its rest position, which is what `spinner-icon` renders. Figma only shows four still frames, not a timeline, so it gives no basis for rotation direction, speed, or easing — the 1s linear clockwise spin above is a code-only decision.

## States and behaviors

- **The animation is always on.** There is no disabled or stopped concept — the icon spins in every variant.
- **No hover or focus state.** This is a status display, not a button, so no interaction state is defined.
- **The icon is decorative**: `aria-hidden="true"` is always set. Only the label carries meaning, and the root is a `role="status"` live region that delivers it to screen readers.
- **No controlled/uncontrolled split** — unlike Switch or Checkbox there is no state to own.

## Composition with other components

- **ProfilePrint** (`components/app/profile-print`): in the `type="process"` state, a `<Spinner type="primary" label="Processing" />` is centered over a square `Skeleton` with `absolute inset-0`. Layering Skeleton (static placeholder) under Spinner (in-progress label) is the established pattern in this codebase.

## The loading state is announced through a live region

The root `<span>` carries `role="status"` and `aria-live="polite"`. Because the spinning icon is `aria-hidden`, the label is the only accessible information; without the live region a screen reader would never learn that loading had started. `spinner.test.tsx` pins this.

`children` is deliberately omitted — Figma has no layout beyond icon plus label, and text must come through `label`.
