# Progress

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3539-7160) · node-id `3539:7160`
Code: `components/ui/progress/progress.tsx`

## Overview

A composite that stacks a status line above a progress bar. The bar itself is [ProgressBar](./progress-bar.md) (Figma `Part/Progress`) reused as-is; this component only adds the label on top.

**How it differs from ProgressBar** — the same boundary Figma draws between the two components:

- **`ProgressBar`** (Figma `Part/Progress`) — just the bar. No label, only a `Percentage(%)` axis.
- **`Progress`** (this document) — label + bar, with a `Status` axis (in progress / completed).

## When to use

- When progress **can be reported as a number** and the user also needs to know what is running (e.g. "Loading image..").
- When the label should switch to "Completed" at the end — it flips automatically once `value` reaches `max`.

## When not to use

- **When the duration is unknown** → [Spinner](./spinner.md), which is for indeterminate states with no progress concept.
- **When the shape of the loading content is already known** → [Skeleton](./skeleton.md).
- **When only the bar is needed** → use [ProgressBar](./progress-bar.md) directly.

## How to use

```tsx
// In progress
<Progress value={10} aria-label="Image upload" />

// Completed — the label flips automatically once value reaches max
<Progress value={100} aria-label="Image upload" />

// Custom copy
<Progress value={40} label="Uploading files..." completedLabel="Done" />

// A range other than 0–100
<Progress value={3} min={0} max={5} />

// Opt into the fixed 226px instead of the 100%-fill default
<Progress value={40} shouldFitContainer={false} />
```

## Structure

Five files per the project component rule: `progress.tsx` / `progress.module.css` / `progress.stories.tsx` / `progress.test.tsx` / `index.ts`.

```
<div>                                flex-col, items-start, gap 8, width 226
  <span data-slot="progress-label">  status line
  <ProgressBar />                    the bar (height 8, radius full)
```

The Figma mockup is `226 × 32` (label 16 + gap 8 + bar 8), and the code's fixed 226px matches it, but that 226 is a forced value rather than a confirmed spec — this component's two children (label, bar) are both `Fill`, so the root cannot `HUG` and some fixed width had to be chosen. The component-set frame is 266px wide (`226 + 20×2` padding), consistent with 226 being the design intent rather than an arbitrary canvas artifact, but there is no independent reuse of 226 elsewhere in the codebase to confirm it the way, e.g., `ButtonGroup`'s 344px is confirmed. Given that uncertainty, `shouldFitContainer` defaults to `true` — the 226px is opt-in (`shouldFitContainer={false}`), not the default.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | **required** | Current progress value |
| `min` | `number` | `0` | Minimum |
| `max` | `number` | `100` | Maximum. Reaching it switches to the completed label |
| `label` | `string` | `"Loading image.."` | In-progress copy. The default is the Figma `Placeholder` TEXT property's own default value (not just an example) — note the name mismatch: Figma calls it `Placeholder`, code calls it `label` |
| `completedLabel` | `string` | `"Completed"` | Completed copy. Has no Figma property counterpart at all — in Figma, `completed`'s "Completed" text is a fixed text layer, not a variable property. Kept as a prop for i18n even though Figma itself has no variable here |
| `showText` | `boolean` | `true` | Shows the status label above the bar (Figma `Text` BOOLEAN, `in progress` variant only) |
| `shouldFitContainer` | `boolean` | `true` | Stretch to the parent width instead of the fixed 226px. Pass `false` to use the fixed width |
| `aria-label` | `string` | — | Accessible name for the inner `ProgressBar` (`role="progressbar"`) |
| `className` | `string` | — | Merged onto the root `<div>` |

The rest of `React.HTMLAttributes<HTMLDivElement>` is inherited, except `children`.

## Variants

There is no `variant` prop. Figma has one axis, `Status`, with two values — `in progress` and `completed` — which is **derived from `value >= max` rather than being a prop**.

| Figma `Status` | Condition | Label | Bar |
| --- | --- | --- | --- |
| `in progress` | `value < max` | `label` | filled to the percentage |
| `completed` | `value >= max` | `completedLabel` | 100% |

Keeping it derived makes **contradictory combinations impossible** — you cannot say "completed" while the bar sits at 40%. Figma agrees: the `completed` variant's indicator is always at 100%.

Figma also has a `TEXT` property on the `in progress` variant only (codegen name `placeholder`, default `"Loading image.."` — this is `label` above), and a `BOOLEAN` property (codegen name `text`, default `true`) that toggles the label's visibility, exposed in code as `showText`.

The `Percentage(%)` axis that the nested `Part/Progress` instance carries is not exposed by `Progress` itself; Figma hardcodes the nested instance's percentage per `Status` (10% for `in progress`, 100% for `completed`) rather than wiring it to a shared value.

## States and behaviors

| Property | Figma | Code |
| --- | --- | --- |
| Root width | 226px (forced, see Structure above) | `100%` by default, 226px literal with `shouldFitContainer={false}` |
| Root gap | 8px | `--gb-spacing-2` |
| Root alignment | `items-start` | `items-start` |
| Label typography | Semi Bold 12 / 16 | five individually declared properties in `progress.module.css` (`--gb-text-xs`, `--gb-font-weight-semibold`, `--gb-leading-4`, `--gb-tracking-normal`, `--gb-font-sans`) — there is no `text-xs-semi-bold` utility class in use |
| Label color | `text/subtle` | `--gb-text-subtle` |
| Bar height | 8px | built into `ProgressBar` |
| Bar track | `background/subtler` | built into `ProgressBar` |
| Bar indicator | `background/bolder` | built into `ProgressBar` |
| Bar width transition | no motion spec in Figma | `transition: width 150ms cubic-bezier(0.4, 0, 0.2, 1)`, inherited from `ProgressBar` |

- **The label color does not change on completion** — both Figma variants use `text/subtle`. Only the copy changes.
- **The label and the progress bar are not programmatically connected.** All ARIA state lives on the inner `ProgressBar`'s `role="progressbar"` (`aria-valuenow` / `min` / `max`), and the label `<span>` has no `id` that an `aria-labelledby` on the bar points back to. A screen reader focusing the progressbar role only announces whatever `aria-label` prop was passed to `Progress` — if that prop is omitted, the progressbar has **no accessible name at all**, regardless of the visible label text sitting right above it.

## Composition with other components

- **ProgressBar** (`components/ui/progress-bar`): the bar itself. This component forwards `value` / `min` / `max` / `aria-label` and leaves every dimension and color to `ProgressBar`.
