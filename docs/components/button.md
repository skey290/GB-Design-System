# Button

- Code: `components/ui/button/button.tsx` (`button.module.css`, `button.stories.tsx`, `button.test.tsx`, `index.ts`)
- Figma: [📌 GB_Design-System (Atom)](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=73-3681) — node-id `73:3681` (the "Button" component set)

## Overview

`Button` wraps a native `<button>` and switches between ten visual styles through a single `variant` prop.

- **Text buttons** — `primary` / `mute` / `outline` / `link` / `ghost`: render `children` as the label
- **Icon-only buttons** — `icon` / `icon-ghost` / `icon-rounded`: render just the node passed to `icon`, ignoring `children`
- **Brand button** — `google`: a fixed leading brand icon plus a fixed default label

The Figma component set has three variant axes — **`Type` × `Style` × `Status`** (spelled exactly that way; it is not `State`). Not all 72 products exist: **30 combinations are drawn**, and the ten code variants map 1:1 onto the ten real `Type`×`Style` pairs.

| Code `variant` | Figma `Type` / `Style` | default     | active      | disabled    |
| -------------- | ---------------------- | ----------- | ----------- | ----------- |
| `primary`      | default / default      | `73:3673`   | `73:3668`   | `3435:465`  |
| `mute`         | default / mute         | `5037:8039` | `5037:8045` | `5037:8042` |
| `outline`      | default / outline      | `73:3678`   | `73:3679`   | `3435:474`  |
| `link`         | default / link         | `73:3674`   | `73:3672`   | `3435:481`  |
| `ghost`        | default / ghost        | `7793:3225` | `7793:3227` | `7793:3286` |
| `icon`         | icon / default         | `73:3669`   | `73:3676`   | `3435:486`  |
| `icon-ghost`   | icon / ghost           | `3019:201`  | `3019:203`  | `3435:517`  |
| `icon-rounded` | icon / ghost-rounded   | `1463:5750` | `1463:5753` | `3435:515`  |
| `google`       | google / default       | `73:3671`   | `73:3664`   | `3435:488`  |

`Status=active` is not a prop — it is CSS `:hover` + `:active`. `Status=disabled` is the native `disabled` attribute.

> **`ghost` exists in two places in Figma.** `Type=default, Style=ghost` (text) and `Type=icon, Style=ghost` (icon) are different components. In code they are `ghost` and `icon-ghost`.

There is no `size` prop — Figma has no size axis.

## When to use

For **one-shot actions** such as submit, navigate, or confirm. Patterns in this codebase:

- **Dialog confirm/cancel**: `components/ui/popover/popover.tsx` wraps Radix `AlertDialogPrimitive.Cancel` / `Action` with `asChild`, placing `outline` (cancel) and `primary` (confirm) side by side with `flex-1`.
- **Two-button action pairs**: `components/ui/button-group/button-group.tsx` implements the Figma `Button group` set — an `outline` + `primary` pair with per-`type` fixed labels, plus an `icon-rounded` + `ghost` floating navigation for `type="menu"`.
- **Icon-only controls**: calendar month/year navigation (`calendar.tsx`, four `icon-ghost`), chatbox attach/send (`chatbox.tsx`, `icon`).
- **Low-emphasis text actions**: `link` for "Retry" when a data load fails (`compass-detail-view`, `compass-self-cluster`, `compass-metric-card`).

## When not to use

- **Not for a persistent on/off state** — use `Toggle` or `Switch` (the Figma description says so).
- Not for a segmented set of selectable options — `Toggle` with `type="text"` covers that.

## How to use

```tsx
// Text buttons (primary is the default)
<Button variant="primary">Button</Button>
<Button variant="mute">Button</Button>
<Button variant="outline">Button</Button>
<Button variant="link">Button</Button>
<Button variant="ghost">Button</Button>

// Trailing icon — primary / mute / outline / link only
<Button variant="primary" icon={<Icon id="arrow-right-icon" />}>Go Next</Button>

// Icon-only — icon instead of children, aria-label is required by the type
<Button variant="icon" icon={<Icon id="search-icon" />} aria-label="Search" />
<Button variant="icon-ghost" icon={<ChevronLeft />} aria-label="Previous month" />

// Brand buttons — icon and default label are built in
<Button variant="google" />

// Selected state within a group
<Button variant="ghost" isSelected>Compass</Button>

// Disabled
<Button variant="primary" disabled>Button</Button>
```

## Structure

- The root is a single native `<button type="button">`. `Button` does not support `asChild`, so when composition is needed a Radix primitive wraps it with `asChild` instead (see the popover example).
- `icon` takes an arbitrary `React.ReactNode` — a lucide component, an `<Icon>` sprite reference, or raw SVG. It is colored by `currentColor`, so variant color rules apply to it automatically.
- Icon-only variants render `icon` and ignore `children`.
- `google` renders a sprite icon (`/icons.svg#google-icon`) followed by `children ?? "Continue with Google"`.
- Other text variants render `children` followed by `icon` when one is given.
- `aria-label` is **enforced by the type system** for icon-only variants: `IconButtonProps` intersects an `AccessibleName` union requiring either `aria-label` or `aria-labelledby`. Omitting both is a compile error. There is no automatic fallback.

## Props

`ButtonProps` is a discriminated union keyed off `variant`: `TextButtonProps | PlainButtonProps | IconButtonProps | BrandButtonProps`. All four extend `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">`.

| Prop                             | Type                                                                                                            | Default     | Description                                                                                                                                                      |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`                        | `"primary" \| "mute" \| "outline" \| "link" \| "ghost" \| "icon" \| "icon-ghost" \| "icon-rounded" \| "google"` | `"primary"` | Visual style                                                                                                                                                     |
| `children`                       | `React.ReactNode`                                                                                               | —           | Label text. Ignored by icon-only variants; optional for brand variants                                                                                           |
| `icon`                           | `React.ReactNode`                                                                                               | —           | Trailing icon for text variants (16px, 12px for `link`); the whole content for icon-only variants, where it is **required**. Not accepted by `ghost` or `google` |
| `isSelected`                     | `boolean`                                                                                                       | `false`     | Marks this as the currently selected item within a group. Renders the same look as `:active`                                                                     |
| `disabled`                       | `boolean`                                                                                                       | —           | Native `disabled`. Applies the per-variant disabled tokens                                                                                                       |
| `className`                      | `string`                                                                                                        | —           | Appended after the module class, so it can override                                                                                                              |
| `aria-label` / `aria-labelledby` | `string`                                                                                                        | —           | Required for icon-only variants (one or the other)                                                                                                               |
| rest                             | `React.ButtonHTMLAttributes<HTMLButtonElement>`                                                                 | —           | `onClick` and friends, spread onto the element                                                                                                                   |

`icon` corresponds to the Figma instance-swap property `Icon` plus its visibility boolean `Show icon` (default `false`). Per the shared props convention, a slot expressed by one prop needs no separate boolean — presence of `icon` decides it. **Text `ghost` has no icon slot in Figma**, so `PlainButtonProps` types `icon` as `undefined`.

`ButtonGroup` consumes `isSelected` for its `type="menu"` navigation. Figma has no `Status=selected` value; the basis is the `Button group` description, "a segmented set where only one item is active at a time."

## Variants

Heights and sizes are fixed Figma values, so they are literal px rather than spacing tokens.

| variant        | Shape             | Size / radius                                                    | Default                                                    | Active                                                       | Disabled                                                      |
| -------------- | ----------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| `primary`      | text              | 36px / `radius-scale-lg`                                         | `background-bold` / `text-invert`                          | `background-mute` / `text-static-white` / `opacity-90`       | `border-overlay` / `background-disabled` / `text-static-gray` |
| `mute`         | text              | 36px / `radius-scale-lg`                                         | `background-subtler` / `text-default`                      | `background-mute` / `text-static-white` / `opacity-90`       | same as above                                                 |
| `outline`      | text              | 36px / `radius-scale-lg`                                         | `border-default` / transparent background / `text-default` | `background-mute` / transparent border / `text-static-white` | same as above                                                 |
| `link`         | text (underlined) | 20px / no radius                                                 | `text-bold`, transparent background                        | `text-subtle` / underline `border-mute-subtle`               | `text-static-gray`                                            |
| `ghost`        | text              | 36px / `radius-scale-full`                                       | transparent / `text-default`                               | `background-mute` / `text-static-white`                      | transparent / `text-static-gray`                              |
| `icon`         | icon (square)     | 36×36 / `radius-scale-lg`                                        | `border-default` / `background-default` / `icon-default`   | `background-mute` / transparent border / `icon-static-white` | `border-overlay` / `background-disabled` / `icon-static-gray` |
| `icon-ghost`   | icon (round)      | 36×36 / `radius-scale-full` → **`radius-scale-lg` while active** | transparent / `icon-default`                               | `background-mute` / `icon-static-white`                      | transparent / `icon-static-gray`                              |
| `icon-rounded` | icon (round)      | 36×36 / `radius-scale-full`, **no border**                       | transparent / `icon-default`                               | `background-mute` / `icon-static-white`                      | transparent background / `icon-static-gray`                   |
| `google`       | icon + text       | 36px / `radius-scale-lg`, gap 6px                                | `background-bolder` / `border-muted` / `text-invert`       | `background-mute` / transparent border / `text-static-white` | `border-overlay` / `background-disabled` / `text-static-gray` |

Typography is `Text-sm/Medium` across all 30 variants, including disabled — the weight is never dropped.

Icons are 16px, except `link`'s trailing icon at 12px.

**`opacity-90` applies only to the active state of `primary` and `mute`** — no other variant binds an opacity variable.

### Why `icon-ghost` changes corners

In Figma `icon/ghost` binds `radius-lg` (10px) **only on active** (`3019:203`); default (`3019:201`) and disabled (`3435:517`) are `radius-full`. The background is transparent at rest, so the corner is invisible until pressed — meaning **the only shape you actually see is the rounded square on press**. Without that distinction it would look identical to `icon-rounded` on hover and the two variants would be indistinguishable.

Affects `calendar` (×4), `compass-detail-view` (×1).

## States and behaviors

- **default** — the variant's base tokens.
- **hover / active** (Figma `Status=active`) — the same declarations are applied to both. Figma has no separate hover and press, so they are merged. Hover is wrapped in `@media (hover: hover)` so touch devices do not latch it.
- **focus-visible** — `--gb-shadow-focus-ring` on every variant. **Figma has no focus state; this is added in code for accessibility.**
- **disabled** — `pointer-events: none` plus `cursor: not-allowed` and the per-variant disabled tokens. Hover and active styles are blocked by `pointer-events: none`.
- **`link` underline** — implemented as `border-bottom`, not `text-decoration`, because the text color and the underline color are different tokens in the active state.
- **borders in the active state** — Figma removes the stroke entirely on active, but the code keeps 1px and sets `border-color: transparent`. Dropping the border would shrink the button by 1px and make it jump on press. The visual result is the same.
- **loading state** — exists in neither code nor Figma.

## Composition with other components

- **`ButtonGroup`** assembles both the `outline` + `primary` pair (`type="save"` etc.) and the `icon-rounded` + `ghost` floating navigation (`type="menu"`) out of Button instances. Changes to Button propagate there.
- **Radix dialogs** wrap `AlertDialogPrimitive.Cancel` / `Action` with `asChild` and use Button directly (cancel = `outline`, confirm = `primary`).
- **`Toggle`** uses `Button variant="icon"` internally for its `trailingAction`.
- **Not for toggle-like controls** — `calendar.tsx` uses a local `HeaderToggleButton` for its month/year toggle rather than Button, matching the "persistent on/off state → Toggle/Switch" principle.

## Consumers do not override the variant

A variant already resolves every color and height. Passing the same values again through `className` is duplication — hand it layout only (`flex-1` and such) and let the variant own the rest.
