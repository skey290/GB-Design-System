# Skeleton

> Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3017-2922) · node-id `3017:2922` ("Skeleton Loader Segment" frame)
> Code: `components/ui/skeleton/skeleton.tsx`

## Overview

An atom that stands in for content while it loads, mimicking its shape — a block, a text line, or a circle. A single `type` prop (`"rectangle" | "text" | "circle"`) decides the size and radius, and every shape carries an infinitely looping shimmer highlight that sweeps across it.

In Figma the component is a static snapshot set: `Progress` (`0` / `33` / `66`) × `Type` (`rectangle` / `text` / `circle`), nine symbols in total. The `Progress` axis is not a real progress value — it is three still frames with the bright band of the background gradient at a different position per `Type` (`rectangle`: 9% / 50% / 90%; `circle`: 0% / 50% / 100%; `text`: 47% / 50% / 53%), and the band does not sweep monotonically left-to-right across the three frames either. The code reinterprets this as one looping CSS animation (`shimmer`, 2s ease-in-out) that moves `background-position` left to right, uniformly across all three shapes. There is no `progress` prop: the animation is fixed and cannot be stopped at a given percentage.

**How it differs from Spinner and ProgressBar:**

- `Skeleton` — the grey shape itself is the placeholder, mimicking the real content (an image block, a text line, a round avatar). It is always `aria-hidden="true"`, so screen readers never see it, and it conveys no loading or progress information.
- `Spinner` — a badge-shaped component with an icon (`lucide-react`'s `LoaderCircle`) and a text label, unrelated to the content's shape. An indeterminate indicator used alongside a status label such as "Processing".
- `ProgressBar` — computes a real percentage from `value` / `min` / `max` and fills a bar. A determinate indicator.

The three are sometimes combined: `components/app/profile-print` layers `Spinner type="primary" label="Processing"` on top of a `Skeleton` meant to be square in its `process` variant (it currently isn't — see "Sizes override cleanly through `className`" below). In this project, "showing that an image is loading" and "announcing that work is in progress" are deliberately separate concerns.

## When to use

- Before real content (images, cards, list rows) arrives, to preview the shape and size it will occupy. Combine `type="rectangle"` (cards, images), `type="text"` (text lines), and `type="circle"` (avatars) to approximate the real layout.
- Compose several `Skeleton` primitives in a flex layout to build a list-row or card loading screen (see the composed example below — there is no separate `ListItem`/`Card` story; the only export is `Playground`).
- Overlay with `Spinner` when a square image area is processing and a status label is also needed.

## When not to use

- **When there is no layout to preview.** The Figma description says so — if the shape of the incoming content is unknown, use [Spinner](./spinner.md). A Skeleton exists only to say "something this shape goes here".
- **When a determinate percentage must be shown** → [ProgressBar](./progress-bar.md). Skeleton's `Progress` axis is an animation snapshot, not a value, and there is no `progress` prop.

## How to use

```tsx
// Default — rectangle
<Skeleton type="rectangle" />

// A single text line
<Skeleton type="text" />

// Circle (avatar and friends)
<Skeleton type="circle" />

// Opt into the fixed 226px instead of the 100%-fill default (ignored by circle)
<Skeleton type="rectangle" shouldFitContainer={false} />
```

Reproducing an avatar + two text lines composition from primitives (not a single Figma node — there is no "Skeleton text" node in the Skeleton/Deprecated page; this is assembled from the `circle` and `text` primitives above):

```tsx
<div className="flex items-center gap-[var(--gb-spacing-3)]">
  <Skeleton type="circle" className="size-[32px]" />
  <div className="flex min-w-px flex-1 flex-col items-start gap-[var(--gb-spacing-2)]">
    <Skeleton type="text" className="h-[15px] w-full" />
    <Skeleton type="text" className="h-[15px] w-[150px]" />
  </div>
</div>
```

Real usage — `components/app/profile-print/profile-print.tsx`:

```tsx
<div className="relative w-full shrink-0">
  {/* aspect-square/h-auto/rounded-none below are currently ineffective — see
     "Sizes override cleanly through className" under States and behaviors */}
  <Skeleton type="rectangle" className="aspect-square h-auto rounded-none" />
  <div className="absolute inset-0 flex items-center justify-center">
    <Spinner type="primary" label="Processing" />
  </div>
</div>
```

`Skeleton` ships fixed pixel dimensions (226×157, 226×27, 27×27), but `shouldFitContainer` defaults to `true`, so real usage normally fills the container by default and only reaches for `aspect-*` to control the other axis.

## Structure

Five files per the project component rule: `skeleton.tsx` / `skeleton.module.css` / `skeleton.stories.tsx` / `skeleton.test.tsx` / `index.ts` (exporting `Skeleton`, `SkeletonProps`, `SkeletonType`).

The DOM is a single level:

```
<div data-slot="skeleton" aria-hidden="true">   the placeholder shape itself
```

No children — one `div` carrying the background gradient (inline `style`) and the per-shape class.

## Props

| Prop                 | Type                                | Default       | Description                                                                                                                                        |
| -------------------- | ----------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`               | `"rectangle" \| "text" \| "circle"` | `"rectangle"` | Figma `Type` variant. Decides size and radius together                                                                                             |
| `shouldFitContainer` | `boolean`                           | `true`        | Stretch to the parent width instead of the fixed 226px. Pass `false` to use the fixed width. **Ignored by `circle`**, which would stop being round |
| `className`          | `string`                            | —             | Merged onto the root `<div>`. Commonly used to override the default size                                                                           |
| `style`              | `React.CSSProperties`               | —             | Merged with the internal shimmer background (`{ ...shimmerStyle, ...style }`), so it can override the shimmer                                      |

The rest of `React.HTMLAttributes<HTMLDivElement>` is inherited. `progress` (the Figma axis) is not exposed.

## Variants

| Figma `Type` | Figma size | Figma radius         | `type`        | Code size / radius               |
| ------------ | ---------- | -------------------- | ------------- | -------------------------------- |
| `rectangle`  | 226×157    | `radius-2xl` (18px)  | `"rectangle"` | 226×157, `--gb-radius-scale-2xl` |
| `text`       | 226×27     | `radius-md` (8px)    | `"text"`      | 226×27, `--gb-radius-scale-md`   |
| `circle`     | 27×27      | `radius-full` (9999) | `"circle"`    | 27×27, `--gb-radius-scale-full`  |

(Figma's own variant values are lowercase, matching the `type` prop's values.)

Sizes and radii match Figma exactly.

The `Progress` axis maps to no code variant — all three static frames are replaced by the single looping `shimmer` animation.

## States and behaviors

- **The animation is always on; there is no stopped state.** No prop indicates completion. `shimmer` loops from the moment it renders, and removing the Skeleton when loading finishes is entirely the consumer's job (`profile-print`'s conditional render is the example).
- **Hidden from assistive technology by default, but not enforced.** `aria-hidden="true"` is set before `{...props}` is spread onto the root, so a consumer passing their own `aria-hidden` can override it. Announcing the loading state needs a separate `aria-live` / `aria-busy` treatment or Spinner's text label — Skeleton does not do it.
- **The color matches Figma.** `--gb-color-shimmer-gray` (`#dbdbdb`) is the same value Figma uses; the Figma side is a literal hex because gradient stops cannot bind variables. Transparency comes from `color-mix(in srgb, var(--gb-color-shimmer-gray) 50%, transparent)` rather than a hardcoded `rgba()`. The token is used only by Skeleton.
- **The gradient angle is a uniform `135deg` regardless of shape**, so that in a list mixing shapes the light does not flow in conflicting directions. Figma's angles vary not just between shapes but between `Progress` frames of the _same_ shape (e.g. `text`'s `0` and `33` frames are 115.484° and -64.516° — opposite directions) — see below.
- **Sizes do not currently override through `className` for every property.** `width`/`height`/`border-radius` are declared directly in `skeleton.module.css` as an unlayered CSS Module, which wins over Tailwind's `@layer utilities` regardless of specificity — confirmed in the browser: adding `h-auto rounded-none w-full` to a `circle` produces no change at all (27px/27px/9999px before and after). The `profile-print` example above is affected by exactly this — its `h-auto`/`rounded-none` do nothing, so the loader is not actually square. `aspect-square` alone doesn't help either, since the explicit `height` it would need to override is still set by the module. Treat any `className` size/radius override on this component as non-functional until this is addressed.

## Where this deliberately departs from Figma

**The reference for Skeleton is the running animation, not the Figma mockup.** The Figma gradients were dragged by hand per shape, so their angles and band widths differ, and shapes with an 8× aspect difference (226×157 vs 226×27) cannot share one angle and one band width. These three differences are intentional, not mismatches.

|                | Code                                                                                   | Figma                                                    |
| -------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Angle          | uniform `135deg`                                                                       | `45°` / `115.5°` / `24.6°` per shape                     |
| Band width     | narrow band proportional to element width (stops `40/50/60` + `background-size: 200%`) | `222px` / `12.8px` / `35.8px`                            |
| Stop positions | a narrow band is what reads as "light passing through"                                 | a still mockup, so one frame is drawn as a wide gradient |

**The literal hex in Figma is also intentional.** Figma cannot bind a variable to a gradient stop, so `#dbdbdb` is entered directly. The code receives it as the dedicated primitive token `--gb-color-shimmer-gray` — the same value, Skeleton only — so it is not hardcoded. Do not substitute a similar token: the nearest, `#e5e5e5`, differs by 10 per channel and is visible, and being shared it would drag Skeleton along whenever it changes.
