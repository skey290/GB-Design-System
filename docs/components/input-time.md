# Input time

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=588-108) · node-id `588:108`
Code: `components/ui/input-time/input-time.tsx`

## Overview

A time field combining a label, an `HH:MM` masked input, and an AM/PM toggle on one row. A round delete button can be added at the end of the row, and entering an out-of-range value shows a warning message below.

## When to use

- For a 12-hour time of day. For a date, use [Date select](./date-select.md).
- For screens where several time rows are added and removed — `showDelete` turns on the per-row remove button.

## When not to use

- **A calendar date** → [Date select](./date-select.md) / [Range select](./range-select.md).
- 24-hour time or seconds — Figma has no such design.

## How to use

```tsx
// Basic
<InputTime label="Time to post" />

// Controlled (value and AM/PM are separate)
<InputTime
  label="Time to post"
  value={time}
  onValueChange={setTime}
  period={period}
  onPeriodChange={setPeriod}
/>

// Show the delete button — actually removing the row is the consumer's job
<InputTime showDelete onDelete={() => removeRow(id)} />

// Fill the parent instead of the fixed 320px
<InputTime shouldFitContainer />

// Disabled (the input and the AM/PM toggle turn off together)
<InputTime disabled />
```

## Structure

Five files per the project component rule: `input-time.tsx` / `input-time.module.css` / `input-time.stories.tsx` / `input-time.test.tsx` / `index.ts`.

```
<div>                            root, flex-col, gap 12, width 320
  <label htmlFor>                label
  <div>                          row, flex, items-center, gap 8
    <TimeMaskInput />            Input-based HH:MM mask, flex: 1
    <PeriodToggle />             AM/PM radiogroup, self-stretch
    <button>                     only when showDelete, 18×18 round X
  <p>                            only on validation failure, warning copy
```

- **The AM/PM toggle width is fixed** — 81px enabled, 83px disabled. The extra 2px exists because Figma adds a 2px gap between the chips only in the disabled state; the code adds the same `gap: 2px` so each chip stays exactly 37.5px wide in both.
- The delete button reuses the same palette as [Button](./button.md)'s `icon` variant, shrunk to 18×18.

## Props

`InputTimeProps` extends `React.InputHTMLAttributes<HTMLInputElement>`, omitting `value` / `defaultValue` / `onChange` / `type` / `id` / `disabled`, and adding the following.

| Prop                 | Type                      | Default          | Description                                                          |
| -------------------- | ------------------------- | ---------------- | -------------------------------------------------------------------- |
| `label`              | `string`                  | `"Time to post"` | Label above the field                                                |
| `showTitle`          | `boolean`                 | `true`           | Figma `Title`. When `false` the label becomes `sr-only`              |
| `value`              | `string`                  | —                | Value when controlled (`HH:MM` mask)                                 |
| `defaultValue`       | `string`                  | —                | Initial value when uncontrolled                                      |
| `onValueChange`      | `(value: string) => void` | —                | Value change callback                                                |
| `period`             | `"AM" \| "PM"`            | —                | AM/PM when controlled                                                |
| `defaultPeriod`      | `"AM" \| "PM"`            | `"AM"`           | Initial AM/PM when uncontrolled                                      |
| `onPeriodChange`     | `(period) => void`        | —                | AM/PM change callback                                                |
| `disabled`           | `boolean`                 | —                | Disables the input and the toggle together (Figma `Status=disabled`) |
| `showDelete`         | `boolean`                 | `false`          | Show the round X button at the end of the row (Figma `Delete`)       |
| `onDelete`           | `() => void`              | —                | Delete-button callback. **Removing the row is the consumer's job**   |
| `shouldFitContainer` | `boolean`                 | `false`          | Stretch to the parent width instead of the fixed 320px               |
| `id`                 | `string`                  | generated        | Input id used for the label association                              |
| `className`          | `string`                  | —                | Merged onto the root `<div>`                                         |

## Variants

There is no `variant` prop. Figma has one axis, `Status`, with five values — `default` / `active` / `filled` / `error` / `disabled`.

| Figma `Status` | Trigger            | Code                                                                                                                                                                                           |
| -------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default`      | empty              | the base `Input` resting state                                                                                                                                                                 |
| `filled`       | has a value        | input text in `--gb-text-default`                                                                                                                                                              |
| `active`       | hover or focus     | `Input`'s `:hover` / `:focus` (border + focus ring)                                                                                                                                            |
| `error`        | out-of-range entry | border `--gb-border-warning` plus the warning copy below — stays warning-colored, with no focus ring, even while the field is still focused (see `input.md`'s "`error` wins over hover/focus") |
| `disabled`     | `disabled`         | input, toggle, and delete button all take the disabled palette                                                                                                                                 |

## States and behaviors

| Property                                | Value                                                                                                                |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Root gap                                | `--gb-spacing-3` (12px)                                                                                              |
| Row gap                                 | `--gb-spacing-2` (8px)                                                                                               |
| Label                                   | `Text-sm/SemiBold`, `--gb-text-default`                                                                              |
| Warning copy                            | `Text-sm/Medium`, `--gb-text-warning`                                                                                |
| Toggle wrapper                          | 1px border, radius `--gb-radius-scale-lg`, 2px padding                                                               |
| Selected AM/PM chip                     | `--gb-background-mute` + `--gb-text-static-white` + `--gb-shadow-sm`                                                 |
| Hovered/pressed AM/PM chip (unselected) | same as selected — Figma's `Part/Toggle` description states hover, press, and selected all share the same appearance |
| Delete button                           | 18×18, radius `--gb-radius-scale-lg`, 16px icon                                                                      |
| Delete icon color                       | `--gb-icon-default`, `--gb-icon-static-gray` when disabled                                                           |

- **Validation happens digit by digit.** Hours are limited to 1–12 and minutes to 00–59 by restricting the allowed candidates as each digit is typed. A rejected key is ignored and plays a shake animation. Replaying the shake back-to-back requires removing the class and forcing a reflow (`void offsetWidth`).
- **AM/PM is a radiogroup.** Left and right arrow keys switch it, and since the options are mutually exclusive it uses `role="radio"` with `aria-checked`.
- **Caret position** is computed from the number of entered digits and restored in `useLayoutEffect`, because rewriting the mask string makes the browser snap the caret to the end.
- The number field passes `inputType="text"` with `inputMode="numeric"` — the mask characters are not numeric, so a native `number` type cannot be used.

## Composition with other components

- **Input** (`components/ui/input`): the masked field itself, via the internal `TimeMaskInput`.
- The delete button follows the same palette as **Button**'s `icon` variant, shrunk to 18×18.
