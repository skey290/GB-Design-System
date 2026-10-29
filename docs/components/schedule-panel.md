# SchedulePanel

- Code: `components/content-studio/ui/SchedulePanel/SchedulePanel.tsx` (`SchedulePanel.module.css`, `SchedulePanel.stories.tsx`, `SchedulePanel.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8757-7576) `Schedule Panel` node `8127:86849`

## Overview

A 380px-wide card in Content Studio's sidebar that groups `ScheduleSlot` rows by date, with a date-range filter and bulk-action buttons in the header/footer. `type` switches between four distinct panel contents: a normal mixed list (`default`), an AI-generation-in-progress state (`in process`), an empty state (`no content`), and a trash view (`archived`).

Figma also defines four `settings-*` types (`settings-daily`/`settings-weekly`/`settings-monthly`/`settings-custom`), reached by the header's gear button. These are a completely different recurrence-rule form (Repeat tabs + day/month/custom-interval inputs + `Input time`), not another layout of this same panel, so they're implemented separately as `ScheduleSettingsPanel` — `SchedulePanel` only exposes `onOpenSettings` and leaves the actual panel swap to the parent.

## When to use

- The sidebar card listing a date range's scheduled posts in Content Studio.

## How to use

```tsx
{/* controlled: the panel never mutates this list itself */}
<SchedulePanel
  groups={[
    {
      date: "Today, Sep 01",
      slots: [
        { rowId: 1, type: "posted", time: "11:00 AM" },
        { rowId: 2, type: "draft", time: "02:25 PM" },
      ],
    },
  ]}
  onOpenSettings={() => setView("settings")}
  onScheduleAllDraft={handleScheduleAllDraft}
  onCreateMorePost={handleCreatePost}
/>

{/* uncontrolled: clicking "Create More Post" appends a cadence-based bundle itself */}
<SchedulePanel
  defaultGroups={initialGroups}
  extendDays={3}
  occurrencesPerDay={3}
  startTime="09:00 AM"
  onCreateMorePost={trackCreatePost}
/>

<SchedulePanel type="no content" onCreateBrandFitPost={handleCreatePost} />
<SchedulePanel type="in process" groups={pendingGroups} />
<SchedulePanel type="archived" groups={archivedGroups} onCreateMorePost={handleCreatePost} />
```

## Props

| Prop                                                   | Type                                                      | Default      | Description                                                                                                                                                                                                   |
| ------------------------------------------------------ | --------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                                                 | `"default" \| "in process" \| "no content" \| "archived"` | `"default"`  | Figma `Type`                                                                                                                                                                                                  |
| `status`                                               | `"default" \| "disabled"`                                 | `"default"`  | Figma `Status`. Only changes rendering for `type="default"` — `in process`/`archived` bake their own look into `type`, and `no content` is never disabled                                                     |
| `groups`                                               | `SchedulePanelGroup[]`                                    | —            | Date-grouped rows, controlled. When passed, the panel never mutates it — the parent must update it itself (e.g. inside `onCreateMorePost`). Ignored for `type="no content"`                                   |
| `defaultGroups`                                        | `SchedulePanelGroup[]`                                    | `[]`         | Initial date-grouped rows, uncontrolled. Ignored when `groups` is passed. Used when the panel should own its own list                                                                                         |
| `extendDays`                                           | `number`                                                  | `3`          | How many new date groups "Create More Post" appends per click, uncontrolled only                                                                                                                              |
| `occurrencesPerDay`                                    | `number`                                                  | `3`          | How many empty slots each newly-appended day gets                                                                                                                                                             |
| `startTime`                                            | `string`                                                  | `"09:00 AM"` | Anchor time for the first new slot each appended day; later ones spread automatically 6 hours apart                                                                                                           |
| `dateRange` / `defaultDateRange` / `onDateRangeChange` | —                                                         | —            | Forwarded to the header `RangeSelect`. `dateRange`/`defaultDateRange`'s `to` date also anchors where uncontrolled "Create More Post" extension starts (falls back to the real current date if neither is set) |
| `onOpenSettings`                                       | `() => void`                                              | —            | Gear button click handler. The button itself is hidden for `type="archived"`                                                                                                                                  |
| `onScheduleAllDraft`                                   | `() => void`                                              | —            | Header CTA click handler for `type="default"`/`"in process"` ("Schedule All Draft"). Always called regardless of controlled/uncontrolled                                                                      |
| `onCreateBrandFitPost`                                 | `() => void`                                              | —            | Header CTA click handler for `type="no content"` ("Create Your Brand-fit Post")                                                                                                                               |
| `onCreateMorePost`                                     | `() => void`                                              | —            | Footer button click handler, shown only for `type="default"`/`"archived"`. Always called regardless of controlled/uncontrolled                                                                                |
| `selectedRowId`                                        | `string \| number \| null`                                | —            | Which row is highlighted, controlled. Every row — including `type="archive"` — is clickable                                                                                                                   |
| `defaultSelectedRowId`                                 | `string \| number \| null`                                | `null`       | Initial highlighted row, uncontrolled                                                                                                                                                                         |
| `onSlotClick`                                          | `(slot: SchedulePanelSlot) => void`                       | —            | Called with the full clicked slot (including `rowId`), regardless of controlled/uncontrolled                                                                                                                  |

`SchedulePanelGroup` is `{ date: string; slots: SchedulePanelSlot[] }`, and `SchedulePanelSlot` is `ScheduleSlotProps & { rowId: string | number }` — each slot is spread directly onto a `ScheduleSlot`.

## Structure

- Header: `RangeSelect` (flex-basis overridden to 0 so it shrinks inside the 380px card rather than keeping its own 488px default width) + a 36px gear `Button variant="icon"`, then a full-width `Button variant="primary"` CTA below. `type="archived"` skips this whole header block — it only renders a full-width `RangeSelect`, no gear button and no CTA.
- Body: date groups (bold date heading + `ScheduleSlot` rows), auto-scrolling when a parent constrains the panel's height. The scroll thumb position reuses the same measure-on-scroll pattern as `DropdownList`/`NotiDropdown`, paired with the shared `Scrollbar` component. `type="no content"` replaces the whole body with a centered "No Post Created" message instead.
- Footer: a full-width `Button variant="outline"` "Create More Post" with a trailing plus icon, shown only for `type="default"`/`"archived"`.

## States and behaviors

- `status="disabled"` (only meaningful for `type="default"`) grays out the range select, gear button, header CTA, and footer button — the already-rendered `ScheduleSlot` rows are unaffected, since each row's own look is controlled by its own `status`, independent of the panel.
- `type="in process"` always renders the range select, gear button, and "Schedule All Draft" CTA in the disabled look, with no footer button — representing content still being generated.
- `type="archived"` always renders its footer "Create More Post" button in the disabled look (can't add new posts to a past date), while the range select itself stays fully interactive.
- The scrollbar only appears once the groups list actually overflows its container — there's no manual boolean for it, unlike the Figma mockup's demo-only `scrollBar` toggle.
- Clicking "Create More Post" always calls `onCreateMorePost`. When the panel is uncontrolled (`groups` not passed), it additionally appends `extendDays` new date groups to the end of the list, each with `occurrencesPerDay` empty `type="no content"` slots — times start at `startTime` and spread 6 hours apart per occurrence (e.g. `"09:00 AM"` → `"09:00 AM"`/`"03:00 PM"`/`"09:00 PM"` for 3 occurrences). Repeated clicks keep extending forward from the same anchor date rather than overlapping. When controlled (`groups` passed), the list never changes on its own; the parent must update `groups` to reflect the new posts.
- The extension's date labels (e.g. "Friday, Sep 04") are computed from real calendar dates, anchored to `dateRange`/`defaultDateRange`'s `to` date if provided, or the actual current date otherwise — not parsed from the existing groups' `date` strings, since those are free-form labels.
- Every `ScheduleSlot` row is clickable (`SchedulePanel` always passes `onClick` down), regardless of `type` — `archive` rows included. Clicking always calls `onSlotClick` with the full slot. When uncontrolled (`selectedRowId` not passed), the panel also highlights the clicked row itself (`status="active"`) unless that slot already sets its own `status` explicitly, in which case the explicit value wins. When controlled (`selectedRowId` passed), the panel never changes the highlight on its own — the parent must update `selectedRowId`.
- Clicking "Schedule All Draft" always calls `onScheduleAllDraft`. When uncontrolled (`groups` not passed), it additionally turns every `type="draft"` slot across all groups into `type="scheduled"` itself. When controlled (`groups` passed), the list never changes on its own; the parent must update `groups`.
