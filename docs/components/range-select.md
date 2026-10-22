# Range select

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-10932) · node-id `7219:10932`
Code: `components/ui/range-select/range-select.tsx`

## Overview

A trigger plus popover for picking a start and an end date. A calendar icon sits at the right of the trigger, and once both endpoints are set the value reads `MM/DD - MM/DD`. The popover shows [Calendar](./calendar.md) in `mode="range"`, with two months side by side.

## When to use

- When a period (start to end) must be collected — filters, report ranges, and similar.

## When not to use

- **A single date** → [Date select](./date-select.md).
- **The calendar must stay open** → use [Calendar](./calendar.md) directly.

## How to use

```tsx
// Basic
<RangeSelect value={range} onValueChange={setRange} />

// Custom placeholder
<RangeSelect placeholder="Select a period" onValueChange={setRange} />

// Restrict the selectable range
<RangeSelect
  minDate={new Date(2026, 0, 1)}
  maxDate={new Date(2026, 11, 31)}
  onValueChange={setRange}
/>

// Disabled
<RangeSelect disabled />
```

## Structure

Five files per the project component rule: `range-select.tsx` / `range-select.module.css` / `range-select.stories.tsx` / `range-select.test.tsx` / `index.ts`.

```
<Popover.Root>
  <Popover.Trigger asChild>
    <button>                     height 36, width 488, radius 10, padding (vertical 8 / horizontal 12), border 1, gap 8
      <span>                     value or placeholder, flex: 1, left-aligned
      <CalendarIcon />           lucide-react's Calendar, 16px, trailing
  <Popover.Content className="dark" sideOffset={8} align="start">
    <Calendar mode="range" />
```

- **The trigger renders at 488px in Figma, and the code matches it, but the evidence for that being a confirmed spec (rather than a forced value) is independent reuse, not just "Figma draws it that way":** the trigger's label `span` is `flex-[1_0_0]`, so the root can't `HUG` horizontally and some fixed width had to be chosen regardless — but `Part/Calendar modal`'s `Type=range` variant (`7285:4507`), a separate Figma component, is independently also 488px, and `calendar.module.css`'s own token math for that same layout (`12+224+16+224+12`) sums to 488 too. Two independent sources landing on the same number is what makes 488 a spec rather than an artifact, unlike cases where only the forced-FIXED reasoning applies.
- **10px radius** (`--gb-radius-scale-lg`) — note `DateSelect` uses an 8px radius, so the two differ.
- The 36px height is declared explicitly; without it, border and padding would add up to 38px and the field would not line up with its neighbors.
- The popover is scoped with `className="dark"` and always renders dark, same as `DateSelect`/`Popover`/`Chatbox`/`NotiDropdown` — note this is a code convention, not something Figma specifies; the Figma mockup for this component is itself in light mode.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `CalendarRangeValue` | — | `{ from?: Date; to?: Date }` |
| `defaultValue` | `CalendarRangeValue` | — | Initial period when uncontrolled |
| `ref` | `React.Ref<HTMLButtonElement>` | — | Forwarded to the trigger `<button>` |
| `onValueChange` | `(range: CalendarRangeValue) => void` | — | Called when the range changes |
| `placeholder` | `string` | `"Select date range"` | Trigger text while empty |
| `disabled` | `boolean` | `false` | Disables the trigger |
| `minDate` | `Date` | — | Passed to the calendar |
| `maxDate` | `Date` | — | Passed to the calendar |
| `disabledDates` | `Date[]` | — | Passed to the calendar |
| `events` | `Record<string, CalendarEventType>` | — | Passed to the calendar |
| `className` | `string` | — | Merged onto the trigger `<button>` |

Unlike `DateSelect` there is **no label prop** — Figma has no label here either.

## Variants

There is no `variant` prop. Figma has one axis, `Status`, with five values, plus a `TEXT` property `Period` (default `"09/01 - 09/30"`) that this doc's variant table alone doesn't capture — it is the filled-state example value, matching the `MM/DD - MM/DD` format below.

| Figma `Status` | Trigger condition | Background | Border | Text |
| --- | --- | --- | --- | --- |
| `default` | no value | `--gb-background-default` | `--gb-border-default` | `--gb-text-subtle` |
| `filled` | has a value | `--gb-background-default` | `--gb-border-default` | `--gb-text-default` |
| `hovered` | `:hover` | `--gb-background-mute` | `--gb-border-static-gray` + focus ring | `--gb-text-static-white` |
| `pressed` | `data-[state=open]` | `--gb-background-default` | `--gb-border-static-gray` + focus ring | `--gb-text-default` |
| `disabled` | `disabled` | `--gb-background-disabled` | `--gb-border-overlay` | `--gb-text-static-gray` |

Unlike `DateSelect`, **all five states keep Medium weight** — `DateSelect` drops to Regular when disabled, so do not copy one into the other.

## States and behaviors

| Property | Value |
| --- | --- |
| Trigger size | 488 × 36 |
| Radius | `--gb-radius-scale-lg` (10px) |
| Padding | `--gb-spacing-3` horizontal, `--gb-spacing-2` vertical |
| Icon | lucide-react's `Calendar` (not the `calendar-icon` sprite symbol), 16px, trailing. Figma binds a separate `icon/*` token per `Status` rather than having the icon inherit the text color — the code's `currentColor` approach lands on the same values anyway (both themes), so there is no visible gap, but it is not literally "inheriting" by Figma's own structure |
| Value ↔ icon gap | `--gb-spacing-2` (8px) |
| Popover offset | 8px below the trigger |
| Focus ring | `--gb-shadow-focus-ring` on `hovered`/`pressed` only — there is no `:focus-visible` rule in `range-select.module.css`, so Tab-ing to the closed trigger shows no indicator at all |

- **The popover stays open after both `from` and `to` are set.** Closing it (outside click / Escape, Radix Popover's own default) is left to the user, so they can review or adjust the pick before dismissing it. An earlier version auto-closed on the second click; that made it impossible to see or correct the just-picked end date.
- The value format is `MM/DD - MM/DD`; with no `to`, only `MM/DD` is shown.
- Figma has no empty "default (placeholder)" mockup — every state is drawn already filled — but an empty initial state inevitably exists in real use, so `placeholder` is supported. This is the same reasoning as `Select`'s placeholder handling.
- **The open popover is 2px wider than the trigger** (490px vs. 488px), confirmed by measuring both in the browser — not a deliberate design choice, just an unresolved mismatch coming from `Calendar`'s `fit-content` sizing plus its own padding and border.

## Composition with other components

- **Calendar** (`components/ui/calendar`): the popover body, rendered with `mode="range"` across two months. This reuse has a Figma basis beyond visual similarity — Figma's `pressed` state (`7219:10933`) embeds a genuine instance of `Part/Calendar modal` (master `7285:4507`, `Type=range`), confirmed via the instance-id chain.
- The trigger does not use the shared `Button`, for the same reason as `DateSelect`: the Figma trigger uses input-field colors.
