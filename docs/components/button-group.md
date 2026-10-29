# Button group

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3466-29935) · node-id `3466:29935`
Code: `components/ui/button-group/button-group.tsx`

## Overview

Presents related buttons as one unit. Two quite different shapes live in the same component set.

- **Two-button row** (`skippable` / `back-or-forth` / `save` / `confirm` / `error`) — a secondary (outline) action on the left and a primary one on the right. The pair that closes a step or a dialog.
- **`menu`** — a floating pill-shaped navigation where exactly one item is active at a time.

## When to use

- When a step or dialog needs a **secondary + primary action pair** — choosing `type` brings the labels with it.
- When a **floating navigation pill** is needed → `type="menu"`.

## When not to use

- **Only one action** → use [Button](./button.md) on its own.
- **Each item toggles independently** → [Toggle](./toggle.md). In `menu`, exactly one item is always active.

## How to use

```tsx
// Two-button row — type decides the labels
<ButtonGroup type="confirm" onSecondaryClick={close} onPrimaryClick={submit} />

// Overriding the labels
<ButtonGroup type="save" secondaryLabel="Later" primaryLabel="Save" />

// Fill the parent width (344px fixed by default)
<ButtonGroup type="skippable" shouldFitContainer />

// Floating menu
<ButtonGroup
  type="menu"
  items={[
    { id: "home", icon: "home-icon" },
    { id: "assets", label: "Assets" },
    { id: "compass", label: "Compass" },
  ]}
  activeId={active}
  onActiveChange={setActive}
/>
```

## Structure

Six files: the usual five per the project component rule (`button-group.tsx` / `button-group.module.css` / `button-group.stories.tsx` / `button-group.test.tsx` / `index.ts`) plus `context.ts`, which carries `ButtonGroupContext` — the only path through which the group's `disabled` reaches its child `Button`s (`ButtonGroup` never passes `disabled` to a child directly; each `Button` reads `disabled ?? group.disabled` from the context, per `button.tsx`).

```
Two-button row:
<div>                            flex, items-end, gap 10, width 344 (or 100%)
  <Button variant="outline" />
  <Button variant="primary" />

menu:
<div role="tablist">             inline-flex, height 53, gap 12, padding (vertical 8 / horizontal 10), radius full
  <Button variant="ghost" | "icon-rounded" role="tab" />  one per item
```

- The two buttons split the row **exactly in half** with `flex: 1` (Figma's 344 = 167 + 10 + 167).
- `menu` uses a `--gb-background-sheer` background with a backdrop blur, so it reads as a floating bar with the page showing through.
- A `menu` item renders as `ghost` when it has a `label` and `icon-rounded` when it does not.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `ButtonGroupType` | `"skippable"` | Which arrangement. `menu` is the pill; everything else is the two-button row |
| `disabled` | `boolean` | `false` | Disables every button in the group |
| `shouldFitContainer` | `boolean` | `false` | Fill the parent width instead of the fixed 344px (not applied to `menu`). A dedicated prop, not a `className` override, because `.pair`'s `width: 344px` is declared in an unlayered CSS Module, which always wins over a Tailwind utility like `w-full` regardless of specificity — `shouldFitContainer` sets `data-fit-container="true"`, matched by another rule in the same module, which wins the same way |
| `secondaryLabel` | `string` | per `type` | Left outline button label |
| `primaryLabel` | `string` | per `type` | Right primary button label |
| `onSecondaryClick` | `MouseEventHandler` | — | Left button click handler |
| `onPrimaryClick` | `MouseEventHandler` | — | Right button click handler |
| `renderSecondary` | `(button: ReactElement) => ReactElement` | — | Wraps the left `Button` element before it's placed in the row. Two-button row only — see "Composition with other components" below |
| `renderPrimary` | `(button: ReactElement) => ReactElement` | — | Wraps the right `Button` element — same purpose as `renderSecondary` |
| `items` | `ButtonGroupMenuItem[]` | four default items | `type="menu"` only |
| `activeId` | `string` | — | Currently active item id for `type="menu"` |
| `onActiveChange` | `(id: string) => void` | — | Active-item change callback for `type="menu"` |
| `className` | `string` | — | Merged onto the root `<div>` |
| `...props` | rest of `React.HTMLAttributes<HTMLDivElement>` | — | `id`, `data-*`, … forwarded to the root |

`secondaryLabel`, `primaryLabel`, `onSecondaryClick`, `onPrimaryClick`, `renderSecondary`, and `renderPrimary` are only read by the two-button row — passing them alongside `type="menu"` has no effect, since `menu` renders from `items` / `activeId` / `onActiveChange` instead.

`renderSecondary`/`renderPrimary` exist so a consumer can thread a Radix primitive's `asChild` through to the actual rendered `Button`, without `ButtonGroup` losing ownership of layout or the default labels. `Popover` is the real-world case: its Cancel/Confirm pair needs `AlertDialogPrimitive.Cancel`/`Action` wrapping the live `Button` DOM node for Radix's auto-close/auto-focus behavior — see [`popover.md`](./popover.md#cancelconfirm-reuses-buttongroup).

`ButtonGroupType` is `"skippable" | "back-or-forth" | "save" | "confirm" | "error" | "menu"`. Figma's labels use spaces and capitals, so the code converts them to kebab-case lowercase — `back or forth` → `back-or-forth`, `Error` → `error`.

## Variants

### Default labels per `type`

| `type` | Left (outline) | Right (primary) |
| --- | --- | --- |
| `skippable` | Later | Go Next |
| `back-or-forth` | Go back | Go Next |
| `save` | Cancel | Save |
| `confirm` | Cancel | Confirm |
| `error` | Refresh | Back to Dashboard |

Only the labels differ — **all five share identical colors and dimensions**. Figma's `Type` axis changes nothing but the labels.

### `menu`

| Property | Value |
| --- | --- |
| Height | 53px |
| Gap | `--gb-spacing-3` (12px) |
| Padding | `--gb-spacing-2-5` horizontal, `--gb-spacing-2` vertical |
| Radius | `--gb-radius-scale-full` |
| Background | `--gb-background-sheer` |
| Border | `--gb-border-default`, 1px |
| Backdrop blur | `--gb-backdrop-blur` |
| Item with a label | `Button variant="ghost"` |
| Icon-only item | `Button variant="icon-rounded"` |

## States and behaviors

- **`disabled` on the two-button row** turns both buttons to the disabled palette (`--gb-background-disabled` + `--gb-border-overlay` + `--gb-text-static-gray`). Figma's `Status=disabled` shows both the same way.
- **`disabled` on `menu`** still blocks clicks on every item, but `aria-selected="true"` stays on the active tab — only its visual highlight disappears (disabled Buttons don't render the selected look), so the ARIA state and the rendered look disagree while disabled.
- **Keyboard navigation in `menu`** — `role="tablist"` with `role="tab"` items, implementing full roving-tabindex navigation: Right/Down and Left/Up move to the next/previous item (wrapping), Home/End jump to the first/last. The active item is marked with `isSelected` on its Button.
- `shouldFitContainer` does not apply to `menu` — the pill is only as wide as its contents.

## Composition with other components

- **Button** (`components/ui/button`): both shapes compose the shared Button. The row uses `outline` / `primary`; `menu` uses `ghost` / `icon-rounded`. No dedicated button is built for either.
- **Popover** (`components/ui/popover`): reuses the `type="confirm"` row via `renderSecondary`/`renderPrimary` for its Cancel/Confirm pair, matching a genuine `ButtonGroup` instance Figma embeds there.
