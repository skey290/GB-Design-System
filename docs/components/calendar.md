# Calendar

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-10741) — `Part/Calendar modal` (node-id `7219:10741`) / `Part/Calendar` (node-id `7219:10714`)
Code: `components/ui/calendar/calendar.tsx`

## Overview

The whole calendar surface — month header, weekday row, and the grid of day cells. It has two modes, single date (`mode="single"`) and period (`mode="range"`), and pressing the month or year chip in the header switches to a month- or year-picking subview.

Figma splits this into two components:

- **`Part/Calendar modal`** (`7219:10741`) — the whole panel. `Type` (default / month / year / range) × `Data`.
- **`Part/Calendar`** (`7219:10714`) — a single day cell, with 17 variants covering selection, range, today, and event-marker states.

## When to use

- Directly, when the calendar should be **permanently visible**.
- For a trigger-driven form, use [Date select](./date-select.md) / [Range select](./range-select.md) — both render this component internally.

## When not to use

- **Do not place a day cell (`Part/Calendar`) on its own.** The Figma description says so: it only means anything inside the grid.

`Calendar` itself is a pure primitive referencing semantic tokens only and does not force dark mode. The "always dark" treatment (the same principle as Popover and Chatbox) belongs to the popover content wrappers in `DateSelect` and `RangeSelect`.

## How to use

```tsx
// Single date
<Calendar mode="single" value={date} onValueChange={setDate} />

// Period (two months side by side)
<Calendar mode="range" value={range} onValueChange={setRange} />

// Restrict the range, plus individually disabled dates
<Calendar
  mode="single"
  minDate={new Date(2026, 0, 1)}
  maxDate={new Date(2026, 11, 31)}
  disabledDates={[new Date(2026, 8, 10)]}
  onValueChange={setDate}
/>

// Per-date event markers
<Calendar
  mode="single"
  events={{ "2026-09-01": "published", "2026-09-17": "draft" }}
  onValueChange={setDate}
/>
```

## Structure

Five files per the project component rule: `calendar.tsx` / `calendar.module.css` / `calendar.stories.tsx` / `calendar.test.tsx` / `index.ts`.

```
single:
<div>                          panel. flex-col, gap 16, padding 20, radius 10, border 1
  <div>                        header, space-between
    <Button icon-ghost />      ◀ 36×36 round
    <div gap 4>                month chip + year chip
    <Button icon-ghost />      ▶
  <DateGrid> | <MonthYearGrid> swapped by subview

range:
<div>                          panel. flex-row, gap 16, padding 12
  <div>  [◀][month] + left month grid
  <div>  [month][▶] … [year] + right month grid
```

- **Panel padding differs by mode** — 20px for single, 12px for range. Both are fixed Figma values.
- The date grid is `grid-template-columns: repeat(7, …)` with **zero column gap and a 4px row gap**. Cells must butt together so a selected range reads continuously.
- The month and year subviews are three columns of 70×32 cells.

## Props

`CalendarProps` is the shared props plus a discriminated union keyed on `mode`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `"single" \| "range"` | **required** | Single date or period selection |
| `value` | `Date` \| `CalendarRangeValue` | — | Type depends on `mode` |
| `onValueChange` | `(date) => void` \| `(range) => void` | — | Signature depends on `mode` |
| `events` | `Record<string, CalendarEventType>` | — | Per-date markers, keyed `yyyy-MM-dd` |
| `minDate` | `Date` | — | Dates before this cannot be selected |
| `maxDate` | `Date` | — | Dates after this cannot be selected |
| `disabledDates` | `Date[]` | — | Individually disabled dates |
| `className` | `string` | — | Merged onto the panel root |

`CalendarEventType` is `"published" | "reserved" | "draft"`.

## Variants

### Day cell (`Part/Calendar`)

| State | Background | Border | Text | Radius |
| --- | --- | --- | --- | --- |
| Default | none | none | `--gb-text-default` | 8px |
| **Hover** | **`--gb-background-subtlest`** | none | `--gb-text-default` | 8px |
| **Today** | **none** | **`--gb-border-static-gray`, 1px** | `--gb-text-default` | 8px |
| **Selected** | **`--gb-background-bold`** | none | `--gb-text-invert` | 8px |
| Range endpoints | `--gb-background-bold` | none | `--gb-text-invert` | 8px on one side |
| Range middle | `--gb-background-selected` | none | `--gb-text-bold` | **0** |
| Previous/next month | none | none | `--gb-text-static-gray` | 8px |
| Disabled | none | none | `--gb-text-static-gray` | 8px |

**Today is a border; selected is a fill.** Swapping them makes today look already selected.

### Event markers

A 4×4 dot sits in the lower right of the cell.

| `CalendarEventType` | Shape | Color |
| --- | --- | --- |
| `published` | filled circle | `--gb-icon-default` |
| `reserved` | hollow circle (1px) | `--gb-icon-default` |
| `draft` | filled circle | `--gb-icon-warning` |

Over a selected cell (dark background), `published` and `reserved` invert to `--gb-icon-invert`; without that, a dark dot on a dark fill would vanish. `draft` is a warning color and does not invert.

### Panel (`Part/Calendar modal`)

| Figma `Type` | Code | Metrics |
| --- | --- | --- |
| `default` | `mode="single"` date view | padding 20, 7-column grid |
| `month` | month-picking subview | padding 20, 3-column grid (70×32 cells) |
| `year` | year-picking subview | padding 20, 3-column grid |
| `range` | `mode="range"` | padding 12, two months side by side |

Figma's `Data` (False/True) toggles whether event markers are drawn; the code decides from whether `events` has values rather than adding a boolean prop. The `Data style` property that picks the marker kind maps to `CalendarEventType`.

### Month and year subviews

In `mode="single"`, pressing the month or year chip replaces the date grid with a subview. Figma has only static snapshots, so the interaction follows standard calendar-widget UX.

- **Month subview**: the pressed chip (e.g. `Sep`) becomes filled and the other (`2026`) becomes outline. The arrows move the year by ±1.
- **Year subview**: the reverse — `2026` is filled and `Sep` is outline. The arrows move by ±12 years. The start year is `Math.floor(year / 10) * 10 - 1`, so a decade starts one year early to fill all twelve cells (2026 → 2019–2030).
- The month and year grid cells themselves carry no selected emphasis — Figma draws no such distinction.
- `range` has no subviews — the header chips are pressable only in `mode="single"`.

## States and behaviors

| Property | Value |
| --- | --- |
| Panel width | `fit-content` (Figma HUG) |
| Panel background | `--gb-background-overlay` |
| Panel border | `--gb-border-default`, 1px |
| Panel radius | `--gb-radius-scale-lg` |
| Panel gap | `--gb-spacing-4` (16px) |
| Header chips | shared `Button variant="outline"` (36px tall, radius 10, 16px padding) |
| Header arrows | shared `Button variant="icon-ghost"` (36×36, round) |
| Weekday labels | 32px wide, 16px tall, `text-xs-regular`, `--gb-text-subtle` |
| Day cells | 32×32, `text-sm-regular` |

- **The panel width is `fit-content`, not a fixed value.** Figma sets `Part/Calendar modal` to HUG, so content decides: date view `20×2 + 32×7 = 264`, month/year view `20×2 + 70×3 = 250`, range view `12×2 + 224 + 16 + 224 = 488`.
- Measured in the browser these come out as **266 / 252 / 490**, 2px wider than Figma, because of the 1px border on each side. Figma uses `strokeAlign: INSIDE` and draws the stroke **inside** its own box, while CSS `border-box` adds the border outside the padding. Forcing the Figma number as a fixed width would squeeze the two-month grid from 224 to 223px, so leaving it to hug is correct.
- The month/year grid cells (`.gridCell`) and day cells (`.cell`) are native `<button>`s and show `--gb-shadow-focus-ring` on `:focus-visible` — no Figma counterpart. The header's nav arrows and month/year toggle reuse the shared `Button` component, which already carries this treatment.
- **Hover** (`--gb-background-subtlest`, pointer devices only via `@media (hover: hover)`) applies to day cells (including `today`) and every month/year grid cell. Figma defines a `Status=hover` variant (`Type=day`, node `8163:542`) and a matching one for `Type=month & year` (`8163:544`) — confirmed via `get_metadata`/`get_variable_defs`. Figma's `today` has no separate hover symbol of its own, but the code applies the same hover background to it anyway (today keeps its border on top) for a consistent feel across all unselected cells. It still does **not** apply to `selected` or any range state — Figma's `Status` axis is mutually exclusive there.
- **The year subview holds twelve cells**, starting a decade one year early to fill the 3×4 grid.
- **In range selection**, closing the popover after the second date is the consumer's job (`RangeSelect`); this component only reports the value.
- **In `mode="range"`, each header label (left month, right month, right year) opens its own nested popover** with a `MonthYearGrid` below it, instead of swapping the date grid inline like `mode="single"` does — the side-by-side two-month layout has no room to swap in place, and the whole thing already sits inside `RangeSelect`'s own popover. Figma has no design for this at all (its `range` subviews are undefined), so the mapping from a pick back onto `viewDate` is a code-only decision: picking the **left month** sets `viewDate`'s month (year unchanged); picking the **right month** sets `viewDate` so that `viewDate + 1 month` lands on the pick; picking the **year** (shown once, on the right) sets `viewDate` so the **right** column's year becomes the pick. Picking a value closes only that nested popover — the outer `RangeSelect` popover stays open, same principle as the date-selection fix above.
- The header month/year toggle fills only the pressed chip with `--gb-background-mute` + `--gb-text-static-white`; the inactive one keeps the outline default.

## Composition with other components

- **DateSelect** (`components/ui/date-select`): renders it as popover content with `mode="single"`, inside a `.dark` scope.
- **RangeSelect** (`components/ui/range-select`): the same, with `mode="range"`.
- **Button**: the header arrows (`icon-ghost`) and month/year chips (`outline`) are the shared component — no calendar-specific button is built.
