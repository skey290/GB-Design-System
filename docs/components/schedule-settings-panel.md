# ScheduleSettingsPanel

- Code: `components/content-studio/ui/ScheduleSettingsPanel/ScheduleSettingsPanel.tsx` (`ScheduleSettingsPanel.module.css`, `ScheduleSettingsPanel.stories.tsx`, `ScheduleSettingsPanel.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8757-7576) `Schedule Panel` → `Type=settings-daily`/`settings-weekly`/`settings-monthly`/`settings-custom`, node `8127:87596`

## Overview

A 380px-wide recurrence-rule form in Content Studio's sidebar, reached from `SchedulePanel`'s gear button. `repeatType` switches the Repeat tab between `daily`/`weekly`/`monthly`/`custom`, each adding a different middle section below the tabs, while the header (date range + back button) and the "On Each Day" occurrence stepper + time field + Save button stay the same across all four.

## When to use

- The recurrence-settings screen shown when a user taps the gear icon on `SchedulePanel`'s header.

## How to use

```tsx
<ScheduleSettingsPanel
  defaultRepeatType="weekly"
  onBack={() => setView("list")}
  onSave={handleSaveSchedule}
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `repeatType` / `defaultRepeatType` / `onRepeatTypeChange` | `"daily" \| "weekly" \| "monthly" \| "custom"` | `"daily"` (uncontrolled) | Figma `Type`, minus the shared `settings-` prefix. Controls which Repeat tab is active |
| `dateRange` / `defaultDateRange` / `onDateRangeChange` | — | — | Forwarded to the header `RangeSelect` |
| `onBack` | `() => void` | — | Back-arrow button click handler, returning to `SchedulePanel` |
| `selectedWeekdays` / `defaultSelectedWeekdays` / `onSelectedWeekdaysChange` | `string[]` | `[]` | Weekday ids toggled under "On Every" (`repeatType="weekly"` only) |
| `dayOfMonth` / `defaultDayOfMonth` / `onDayOfMonthChange` | `string` | `""` | Digits for "Day \_\_ of every month" (`repeatType="monthly"` only) |
| `everyCount` / `defaultEveryCount` / `onEveryCountChange` | `string` | `""` | Digits for "Every \_\_" (`repeatType="custom"` only) |
| `everyUnit` / `defaultEveryUnit` / `onEveryUnitChange` | `string` | `"days"` | Unit select next to `everyCount` (`repeatType="custom"` only) |
| `occurrencesPerDay` / `defaultOccurrencesPerDay` / `onOccurrencesPerDayChange` | `string` | `""` | Digits for the "How often would you like to post?" stepper |
| `time` / `defaultTime` / `onTimeChange` | — | — | Forwarded to `InputTime`'s HH:MM value |
| `period` / `defaultPeriod` / `onPeriodChange` | `"AM" \| "PM"` | — | Forwarded to `InputTime`'s AM/PM toggle |
| `onDeleteTime` | `() => void` | — | Forwarded to `InputTime`'s delete button (always shown) |
| `onSave` | `() => void` | — | Save button click handler |

All `value`/`defaultValue`/`onChange`-style groups follow the controlled/uncontrolled convention — pass the plain value to drive it externally, or just the `default*` to let the component manage its own state.

## Structure

- Header: `RangeSelect` (flex-basis overridden to 0, same trick as `SchedulePanel`) + a 36px `Button variant="icon"` with a back arrow.
- Repeat section: a bold "Repeat" title, a 4-way tab row (Daily/Weekly/Monthly/Custom, each `flex: 1`), and a conditional middle block:
  - `daily`: no middle block.
  - `weekly`: "On Every" + 7 weekday toggle pills (M T W T F S S).
  - `monthly`: "On this date" + "Day `NumberMaskInput` of every month".
  - `custom`: "Every" + `NumberMaskInput` + a `Select variant="primary"` for the unit (Days/Weeks/Months).
- A 1px divider, then the "On Each Day" section shared by all four types: a stepper (circular minus/plus buttons + `NumberMaskInput` + "time(s) a day"), and an `InputTime` with `showDelete` and `shouldFitContainer`.
- A full-width `Button variant="primary"` "Save" at the bottom.

## States and behaviors

- The Repeat tab row and weekday pills are local `<button>`s, not the shared `Button`/`Tabs` components — their selected fill (`--gb-background-mute-subtle`) is a different token than `Button`'s built-in selected look (`--gb-background-mute`), so reusing `Button` would shift the color.
- `NumberMaskInput` is a small shared local field (used by the occurrence stepper, "Day of every month", and "Every") that shows a borderless `_ _` placeholder when empty and accepts digit-only typing, up to 2 digits.
- The weekday pills' selected color is assumed to match the Repeat tabs' selected color — Figma's mockup never shows a selected weekday example to confirm against.
- The Custom unit dropdown's option list (Days/Weeks/Months) isn't shown in Figma (the mockup only shows the closed trigger) — it's a placeholder set of standard recurrence units.
