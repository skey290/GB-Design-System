# ContentsAnalysis

- Code: `components/content-studio/ui/ContentsAnalysis/ContentsAnalysis.tsx` (`ContentsAnalysis.module.css`, `ContentsAnalysis.stories.tsx`, `ContentsAnalysis.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-86563) `Contents analysis` node `8127:86563`

## Overview

Content Studio's analysis dashboard card showing this month's post count, weekly goal progress, and a mini calendar with Published/Reserved/Draft markers.

## When to use

- The Content Studio analysis dashboard's "Posts This Month" section.

## How to use

```tsx
<ContentsAnalysis
  variant="expanded"
  postsThisMonth={15}
  postsDelta="+5"
  goals={[
    { label: "Weekly Goal Progress", current: 75, target: 100, format: "percent" },
    { label: "Posting Frequency", current: 2, target: 3, format: "fraction" },
    { label: "Tone consistency", current: 75, target: 100, format: "percent" },
  ]}
  calendarEvents={{ "2026-09-13": "draft", "2026-09-17": "reserved" }}
/>

<ContentsAnalysis variant="empty" />
```

## Props

| Prop               | Type                                | Default                                                               | Description                                                                          |
| ------------------ | ----------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `variant`          | `"expanded" \| "empty"`             | `"empty"`                                                             | Figma `Style`                                                                        |
| `postsThisMonth`   | `number`                            | `15`                                                                  | `variant="expanded"` headline total                                                  |
| `postsDelta`       | `string`                            | `"+5"`                                                                | Delta badge text next to the total                                                   |
| `goals`            | `ContentsAnalysisGoal[]`            | Weekly Goal Progress / Posting Frequency / Tone consistency mock rows | Weekly goal progress rows, in display order                                          |
| `calendarEvents`   | `Record<string, CalendarEventType>` | `{}`                                                                  | Per-date event markers, forwarded to the embedded `Calendar` (keys are `yyyy-MM-dd`) |
| `emptyTitle`       | `string`                            | `"No uploads in June"`                                                | `variant="empty"` title                                                              |
| `emptyDescription` | `string`                            | `"Connect your calendar or drafts to start tracking weekly goals."`   | `variant="empty"` description                                                        |

`ContentsAnalysisGoal` is `{ label, current, target, format?: "percent" | "fraction" }`. The progress bar fill is always `current / target`; `format` only controls the trailing value text (`"75%"` vs `"2/3"`).

## Structure

- Shared card shell: bordered, rounded container, 300px wide for `expanded`, 308px (fixed 208px height) for `empty`.
- Shared header: "Posts This Month" title + a calendar icon.
- `variant="expanded"`: a total block (headline number + delta `Badge`), three goal rows (label + `ProgressBar` + trailing value text), and an embedded `Calendar` (`mode="single"`) with a Published/Reserved/Draft legend row underneath.
- `variant="empty"`: a centered calendar-check icon in a circle, a title, and a supporting description.

## States and behaviors

- The Figma "Part/Calendar modal" is not reimplemented — it is the general-purpose `Calendar` component (`components/ui/calendar`, `mode="single"`) embedded directly, since its bordered/padded shell and `published`/`reserved`/`draft` event types already match exactly. No date selection is wired up (no `value`/`onValueChange` passed) — the calendar is a passive display that still supports month navigation via its own prev/next buttons.
- `goals` is fully data-driven — there's no formal Figma property backing the three rows beyond the card's `Style`, so callers are expected to pass real metrics for production use.
