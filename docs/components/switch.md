# Switch

> Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-10618) · node-id `76:10618`
> Code: `components/ui/switch/switch.tsx`

## Overview

A single boolean toggle with only on and off states. It is built from `<button role="switch" aria-checked>` rather than a native checkbox. Four axes decide its state and shape — `checked`, `disabled`, `labelPosition`, `size` — and both controlled and uncontrolled use are supported (when `checked` is `undefined` it keeps internal state, otherwise the parent owns it), matching the Checkbox convention.

**How it differs from Toggle**: the similarly named `components/ui/toggle` is a separate component. Toggle is a segmented group of buttons pressed independently (`role="group"` with `aria-pressed`); Switch is a single on/off slider (`role="switch"`). Toggle's `Type` is `icon` / `text` / `text + icon`, so it is not icon-only.

Per the ARIA standard, `role="switch"` — unlike `role="checkbox"` — implies a state change that **takes effect immediately**. That is a WAI-ARIA convention rather than a project rule, and it matches the Figma description.

## When to use

- For a single on/off state, with a label or without one (screen-reader text only). `label` is optional and defaults to the literal `"switch"` — unlike Checkbox, a label is not required.
- When the label must sit on either side of the track (`labelPosition="left" | "right"`), or when a choice between two sizes is needed (`size="default" | "small"`).

## When not to use

- **When the value is only committed on submit** → [Checkbox](./checkbox.md). Switch is for settings that take effect the moment they flip, matching the `role="switch"` convention.
- **When several options toggle independently** → [Toggle](./toggle.md). Switch handles exactly one boolean.

## How to use

```tsx
// Default (uncontrolled) — off, label on the right
<Switch label="switch" labelPosition="right" size="default" defaultChecked={false} />

// On
<Switch label="switch" labelPosition="right" size="default" defaultChecked />

// Reversed layout, label on the left
<Switch label="switch" labelPosition="left" size="default" />

// Disabled — disabled and labelPosition are independent props, so any combination is valid
// (Figma draws disabled for both labelPosition values — default/left and reversed/right, see Variants below)
<Switch label="switch" labelPosition="left" size="default" disabled />

// small size
<Switch label="switch" labelPosition="right" size="small" />
```

Controlled:

```tsx
<Switch
  label="Email notifications"
  checked={notificationsEnabled}
  onCheckedChange={setNotificationsEnabled}
/>
```

## Structure

Five files per the project component rule: `switch.tsx` / `switch.module.css` / `switch.stories.tsx` / `switch.test.tsx` / `index.ts`.

```
<button role="switch" aria-checked disabled>   the whole thing is the interaction target
  {labelPosition === "left" && <span data-slot="switch-label">}
  <span data-slot="switch-track">              pill-shaped track
    <span data-slot="switch-thumb">            round thumb
  {labelPosition === "right" && <span data-slot="switch-label">}
```

- Unlike Checkbox there is no `<label htmlFor>` association — the label text renders as a child of the `<button>` and natively becomes the button's accessible name, with no `aria-labelledby`.
- A hardcoded `aria-label="switch"` is attached only when `label` is an explicit empty string.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | — | On/off state when controlled (Figma `On` variant) |
| `defaultChecked` | `boolean` | `false` | Initial value when uncontrolled |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called when the state changes |
| `disabled` | `boolean` | `false` | Disabled (Figma `Status=disabled`). Independent of `labelPosition`, so any combination is valid |
| `label` | `string` | `"switch"` | Label text beside the switch. An explicit empty string removes the visual label and leaves the hardcoded `aria-label="switch"` |
| `showLabel` | `boolean` | `true` | Figma `label` boolean property. When `false` the label becomes `sr-only` — invisible but still the accessible name |
| `ref` | `React.Ref<HTMLButtonElement>` | — | Forwarded to the `<button>` |
| `labelPosition` | `"left" \| "right"` | `"right"` | Which side of the track the label sits on (Figma `Type`: `right` → `default`, `left` → `reversed`) |
| `size` | `"default" \| "small"` | `"default"` | Switch size (Figma `Size`) |
| `className` | `string` | — | Merged onto the `<button>` |

The rest of `React.ButtonHTMLAttributes<HTMLButtonElement>` is inherited, except `onChange`, `type`, and `role`. `onClick` is taken separately and called before the internal toggle runs.

## Variants

The Figma component set has four axes — `On` × `Type` × `Status` × `Size` — and all 2×2×2×2 = 16 products are drawn, with no sparse combinations. `disabled` lives on the `Status` axis rather than `Type`, following the project-wide rule that `Type` carries only kind or shape.

Figma separates `Type` (layout: `default` / `reversed`) from `Status` (state: `default` / `disabled`), and the code mirrors that with independent `labelPosition` and `disabled` props. Every one of the 16 combinations the code allows has a Figma basis.

The disabled frames of `Type=default` and `Type=reversed` bind exactly the same variable set — only the label/track order differs — so the "one disabled look per component" rule holds.

| State | Track background | Thumb background | Label text |
| --- | --- | --- | --- |
| off, enabled | `--gb-background-selected` | `--gb-background-static-white` | `--gb-text-default` |
| off, disabled | `--gb-background-disabled` | `--gb-background-static-white` | same |
| on (regardless of disabled) | `--gb-background-bold` | `--gb-background-subtlest` | same |

Shared by track and thumb: `--gb-radius-scale-full`, `--gb-shadow-xs`, and `--gb-spacing-0-5` track padding. The shadow sits on the **track**, not the thumb. Dimensions are component sizes, so they are literal px: default track 24×44 with a 20px thumb; small track 22×40 with an 18px thumb. The button wrapper gap is `--gb-spacing-1-5` (6px). Focus applies `--gb-shadow-focus-ring`.

## States and behaviors

- **The on palette is independent of disabled.** The track is always `--gb-background-bold` when on, whether or not it is disabled; only the off state splits between `--gb-background-selected` and `--gb-background-disabled`. Figma does the same.
- **Disabled is expressed through whole-button opacity.** When `disabled`, `--gb-opacity-50` is applied to the entire button on top of the track and thumb colors. The visual distinction therefore comes from the track color change (off only) plus 50% opacity together.
- **Clicks are ignored when disabled** — blocked both by the native attribute and by an early return in the click handler, so `onCheckedChange` is never called and `aria-checked` never changes.
- **Disabled is hover-stable** — there is no `:hover` rule anywhere in this component, so no state changes on hover.
- **focus** — `:focus-visible` applies `--gb-shadow-focus-ring` regardless of state, though a disabled native button normally cannot receive focus.
- **keyboard** — native `<button>` semantics, so Tab focuses it and both Enter and Space toggle it.
- **controlled / uncontrolled** — when `checked` is not `undefined` the component is fully controlled; it only calls `onCheckedChange` and waits for the parent.
- **Accessible name** — the label renders as a child of the button and becomes its accessible name natively. To hide the label visually while keeping the name, use `showLabel={false}`, which leaves it `sr-only`. (`label=""` empties the label itself, leaving only the hardcoded `aria-label="switch"`, so use `showLabel` when a specific name is needed.)

## Accessible name and keyboard

With the visual label emptied (`label=""`), the default `aria-label` is `"switch"` — but since `...props` is spread afterwards, **an `aria-label` passed by the consumer wins**. A label-less switch with a custom accessible name is therefore expressible.

`switch.test.tsx` pins both the Enter/Space toggle and the fact that a disabled switch does not take focus.

The disabled opacity binds to Figma's `opacity/50` variable, and the code uses `--gb-opacity-50`.
