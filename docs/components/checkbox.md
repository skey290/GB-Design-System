# Checkbox

> Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-8617) · node-id `76:8617`
> Code: `components/ui/checkbox/checkbox.tsx`

## Overview

An atom for a single boolean choice with a label beside it. It is a native `<input type="checkbox">` paired with `<label htmlFor>`, and its appearance is decided by four values: `checked`, `indeterminate`, `disabled`, and `type` (`default` | `mute`). Both controlled and uncontrolled use are supported — when `checked` is `undefined` the component keeps its own state, otherwise the parent owns it fully.

## When to use

- For a standalone boolean choice or consent. `label` is a required prop — the text can never be omitted. To hide it visually, pass `showLabel={false}`, which keeps it as the accessible name only (e.g. a select-all column in a table).
- Observed in the app: the `type="notification"` Popover uses one as an option row such as "don't show again" (`type="mute"`, controlled through `checked` / `onCheckedChange`). That is currently the only usage in the codebase.

## When not to use

- **Choosing one of several mutually exclusive options.** The Figma description says so explicitly — use a radio group instead. A checkbox is for one independent yes/no.
- **A setting that takes effect the moment it is flipped** → [Switch](./switch.md). Use a checkbox for a value that is applied on submit.

## How to use

```tsx
// Default (uncontrolled), unchecked
<Checkbox label="Accept terms and conditions" defaultChecked={false} />

// mute tone (Figma Type=mute)
<Checkbox label="Accept terms and conditions" type="mute" />

// Disabled
<Checkbox label="Accept terms and conditions" disabled />

// Checked
<Checkbox label="Accept terms and conditions" defaultChecked />

// Indeterminate (partial selection)
<Checkbox label="Accept terms and conditions" indeterminate />
```

Controlled usage, as composed inside `popover.tsx`:

```tsx
<Checkbox
  type="mute"
  label={checkboxLabel}
  checked={checkbox}
  onCheckedChange={onCheckedChange}
/>
```

## Structure

Five files, per the project component rule:

- `checkbox.tsx` — implementation
- `checkbox.module.css` — styles
- `checkbox.stories.tsx` — Storybook CSF3 story
- `checkbox.test.tsx` — Vitest + Testing Library
- `index.ts` — `Checkbox`, `CheckboxProps` named exports

DOM structure:

```
<div>                             inline-flex, gap var(--gb-spacing-2)
  <span>                          16×16 positioning context
    <input type="checkbox">       the real control, appearance: none
    <Check />  <Minus />          both always rendered; CSS picks which is visible
  <label htmlFor={id}>            label text, Text-sm/Medium
```

- `id` is generated with `React.useId()` when not supplied, and wired to `label htmlFor`.
- Icons are `lucide-react`'s `<Check />` and `<Minus />` — Figma uses `lucide/check` and `lucide/minus` instances too.
- Which icon shows is pure CSS (`:checked`, `:indeterminate`), so no JavaScript branch decides it.

## Props

`CheckboxProps` extends `React.InputHTMLAttributes<HTMLInputElement>`, omitting `onChange` and `type`, and adding the following.

| Prop              | Type                          | Default             | Description                                                                                                                                      |
| ----------------- | ----------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `checked`         | `boolean`                     | —                   | Checked state when controlled (Figma `Status=checked`)                                                                                           |
| `defaultChecked`  | `boolean`                     | `false`             | Initial state when uncontrolled                                                                                                                  |
| `indeterminate`   | `boolean`                     | `false`             | Partial selection (Figma `Status=part`). Independent of `checked`; applied as a DOM property on every render since it has no HTML attribute form |
| `onCheckedChange` | `(checked: boolean) => void`  | —                   | Called when the checked state changes                                                                                                            |
| `disabled`        | `boolean`                     | `false`             | Maps to Figma `Status=disabled` / `disabled-checked` / `disabled-part`, decided together with `checked` / `indeterminate`                        |
| `type`            | `"default" \| "mute"`         | `"default"`         | Figma `Type` axis. The native `type` attribute is omitted from the props and hardcoded to `"checkbox"`, so the name is free                      |
| `label`           | `string`                      | — (required)        | Label text beside the box                                                                                                                        |
| `showLabel`       | `boolean`                     | `true`              | Figma `label` boolean property. When `false` the label becomes `sr-only` — invisible but still the accessible name                               |
| `ref`             | `React.Ref<HTMLInputElement>` | —                   | Forwarded to the `<input>`                                                                                                                       |
| `className`       | `string`                      | —                   | Merged onto the root `<div>`                                                                                                                     |
| `id`              | `string`                      | generated (`useId`) | Used to associate the label                                                                                                                      |

## Variants

The Figma component set (`76:8617`) has **two axes, `Type` × `Status`**.

| Axis     | Values                                                                             | Code mapping                             |
| -------- | ---------------------------------------------------------------------------------- | ---------------------------------------- |
| `Type`   | `default` · `mute`                                                                 | `type` prop                              |
| `Status` | `default` · `part` · `checked` · `disabled` · `disabled-checked` · `disabled-part` | `checked` / `indeterminate` / `disabled` |

The product is 2×6 = 12 but only **9 combinations are drawn** — `mute` has no disabled trio. The disabled palette is the same regardless of `Type`, so it is drawn only under `default`. That is not an omission.

`disabled` is a `Status` value in Figma but a separate boolean prop in code, mapping 1:1 to the native attribute (per the shared props convention). Which `disabled-*` value it corresponds to depends on the combination:

| Code combination             | Figma `Status`     |
| ---------------------------- | ------------------ |
| `disabled`                   | `disabled`         |
| `disabled` + `checked`       | `disabled-checked` |
| `disabled` + `indeterminate` | `disabled-part`    |

Tokens:

| Type      | Status                   | Border                    | Background                      | Icon                 | Label                   |
| --------- | ------------------------ | ------------------------- | ------------------------------- | -------------------- | ----------------------- |
| `default` | default                  | `--gb-border-muted`       | `--gb-background-bolder`        | —                    | `--gb-text-default`     |
| `default` | part · checked           | `--gb-border-mute`        | `--gb-background-bolder`        | `--gb-icon-invert`   | `--gb-text-default`     |
| `mute`    | default · part · checked | `--gb-border-mute-subtle` | `--gb-background-default`       | `--gb-icon-default`  | `--gb-text-subtle`      |
| all       | `disabled-*`             | `--gb-border-default`     | `--gb-background-disabled-bold` | `--gb-icon-subtlest` | `--gb-text-static-gray` |

`mute` keeps one palette across all three enabled statuses — `Status` only changes what is inside the box (nothing / dash / check). `default` keeps the same background (`--gb-background-bolder`) whether marked or not; only the border and icon color change between unchecked and checked/partial. The icon itself is never the same color across `Type`: `default` uses `--gb-icon-invert`, `mute` uses `--gb-icon-default`.

Shared box metrics: 16×16, `--gb-radius-scale-sm`, `--gb-border-1`, `--gb-shadow-xs` (Figma `Box Shadow/shadow-xs`). Icon is 12×12. Wrapper gap is `--gb-spacing-2`. Box and icon sizes are component dimensions, so they are literal px.

> The disabled icon uses `--gb-icon-subtlest`, not `--gb-icon-static-gray`. The two tokens resolve to the same `#737373` in dark mode, so the difference is only visible in light mode (`#a3a3a3` vs `#737373`) — and the Figma file is dark, so this cannot be caught by eye.

## States and behaviors

- **unchecked / checked / indeterminate** — selected by the CSS `:checked` and `:indeterminate` pseudo-classes. The background stays the same across all three; marking the box only swaps the border color and reveals the icon. This is Figma's own behavior and is implemented without correction.
- **indeterminate wins** — when `indeterminate` is true the dash renders regardless of `checked`.
- **disabled** overrides `type` with a fixed palette, **but the status readout is preserved** — `disabled + checked` shows a grey check in a grey box, so "selected, currently not editable" stays distinguishable. Clicks are blocked by the native attribute.
- **disabled does not react to hover** — in fact nothing in this component does. `checkbox.module.css` declares no `:hover` rule at all, so every state is hover-stable.
- **focus** — `:focus-visible` applies `--gb-shadow-focus-ring`. A disabled native input is not focusable, so it never fires there.
- **keyboard** — native `<input type="checkbox">` semantics, so Space toggles it.
- **label click** — the native `htmlFor` association toggles the box when the text is clicked.
- **controlled / uncontrolled** — when `checked` is not `undefined` the component is fully controlled; it only calls `onCheckedChange` and waits for the parent to pass a new value back.
- **`mute` × `disabled`** — no Figma swatch exists for this pair. In code `disabled` overrides `type` and produces the same disabled look regardless — [inferred from the absence of a `mute`-disabled swatch, not from an explicit Figma rule].

## Composition with other components

Only one composition exists in the codebase today:

- **Popover, `type="notification"`** (`components/ui/popover/popover.tsx`): a single `type="mute"` Checkbox sits as an optional row between the description text and the action buttons. The Popover forces a dark rendering context around it.

## Having no hover state is deliberate

There is no `:hover` rule here and no hover value on the Figma `Status` axis. The whole labelled row is the click target, so the affordance is clear without hover feedback. This differs from Button, Chips, and Select on purpose — it is not an omission.
