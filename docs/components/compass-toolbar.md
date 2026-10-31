# CompassToolbar

- Code: `components/screens/compass/ui/compass-toolbar/compass-toolbar.tsx` (`compass-toolbar.module.css`, `compass-toolbar.stories.tsx`, `compass-toolbar.test.tsx`, `index.ts`)
- Figma: [📌 GB_Design-System (Atom)](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=5266-11096) — nested instance inside the "Compass Page Component" mockup (node `5266:11096`); there is no separate master component

## Overview

The toolbar combo next to Compass's sidebar: a segmented toggle (e.g. Home/Analysis) stacked above an optional dropdown select. It composes two existing components as-is — `Toggle` (`type="text"`) for the segmented control and `Select` (`variant="mute"`) for the dropdown — with no new interactive logic of its own.

## When to use

- Compass's page-mode switcher — Home/Analysis or Analysis/Content toggle, with an optional "All 'Self'" filter select below it (Home mode only; the four Analysis-mode screens — growth-potential/reach/engagement/ranking — have no select).

## How to use

```tsx
<CompassToolbar
  toggleOptions={[
    { value: "home", label: "Home" },
    { value: "analysis", label: "Analysis" },
  ]}
  toggleValue={mode}
  onToggleValueChange={setMode}
  selectOptions={[{ value: "all-self", label: "All 'Self'" }]}
  selectValue={selfFilter}
  onSelectValueChange={setSelfFilter}
/>
```

## Props

| Prop                  | Type                                                                | Default    | Description                                                                                                                               |
| --------------------- | ------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `toggleOptions`       | `readonly [CompassToolbarToggleOption, CompassToolbarToggleOption]` | (required) | The two segmented-toggle options, `{ value, label }` each                                                                                 |
| `toggleValue`         | `string`                                                            | (required) | Currently pressed toggle option's value                                                                                                   |
| `onToggleValueChange` | `(value: string) => void`                                           | —          | Called when a toggle option is pressed                                                                                                    |
| `selectOptions`       | `SelectOption[]`                                                    | —          | Bottom dropdown's options. Omitted entirely skips rendering the `Select` (per Figma's Analysis-mode screens, which have no select at all) |
| `selectValue`         | `string`                                                            | —          | Dropdown's current value                                                                                                                  |
| `onSelectValueChange` | `(value: string) => void`                                           | —          | Called when the dropdown value changes                                                                                                    |
| `className`           | `string`                                                            | —          | Merged onto the root                                                                                                                      |

## Structure

- Root: a `.dark`-scoped `<div>` (same forced-dark convention as Popover/GNB/Chatbox), stacking the toggle and the optional select vertically.
- Toggle: `Toggle` with `type="text"`, mapping `toggleOptions` 1:1 onto `items`, each `pressed` derived from `option.value === toggleValue`.
- Select: rendered only when `selectOptions` is given, reusing `Select` with `variant="mute"` unmodified.

## States and behaviors

- Both the toggle and the select are fully controlled — `CompassToolbar` holds no internal state of its own; the parent owns `toggleValue`/`selectValue`.
- There is no standalone "no select" variant prop — `selectOptions` being omitted is the only signal, matching how the real Analysis-mode screens never pass it rather than passing an empty array.
