# ScheduleSlot

- Code: `components/content-studio/ui/ScheduleSlot/ScheduleSlot.tsx` (`ScheduleSlot.module.css`, `ScheduleSlot.stories.tsx`, `ScheduleSlot.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8757-7576) `Part/schedule panel` node `8127:86799`

## Overview

A single 230×36px row in Content Studio's schedule list, showing either a scheduled time + status badge, or (for `type="archive"`) a "Deleted at …" label. An optional circular "add post" trigger can overlay the row.

Figma's `Type` × `Status` axes don't cross fully — only 11 of the 15 combinations are actually designed. `disabled` only has a distinct look for `type="no content"` (muted time text, badge stays red/warning); for the other four types, `status="disabled"` renders identically to `status="default"` since Figma has no design for that combination.

## When to use

- Each row of Content Studio's schedule/calendar list.

## How to use

```tsx
<ScheduleSlot type="posted" time="11:00 AM" />
<ScheduleSlot type="scheduled" status="active" showAddPost onAddPost={handleAdd} />
<ScheduleSlot type="no content" status="disabled" />
<ScheduleSlot type="archive" deletedDate="Deleted at 08:12 AM" />
```

## Props

| Prop          | Type                                                              | Default                 | Description                                                                                                       |
| ------------- | ----------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `type`        | `"posted" \| "scheduled" \| "draft" \| "archive" \| "no content"` | `"posted"`              | Figma `Type`                                                                                                      |
| `status`      | `"default" \| "active" \| "disabled"`                             | `"default"`             | Figma `Status`. `active` highlights the row background; `disabled` only changes rendering for `type="no content"` |
| `time`        | `string`                                                          | `"11:00 AM"`            | Shown for every type except `archive`                                                                             |
| `deletedDate` | `string`                                                          | `"Deleted at 08:12 AM"` | Shown only for `type="archive"`                                                                                   |
| `showAddPost` | `boolean`                                                         | `false`                 | Figma `Add post` boolean. Never renders for `type="archive"`, regardless of this prop                             |
| `onAddPost`   | `() => void`                                                      | —                       | Click handler for the add-post trigger                                                                            |

## Structure

- Root `<div>` with `data-type`/`data-status` attributes driving the row background and muted-time-text styling.
- `type="draft"` → `Badge variant="reverse"`, `type="scheduled"` → `Badge variant="default"`, `type="no content"` → `Badge variant="alarm"`, `type="posted"` → `Badge variant="outline"`. All four reuse `components/ui/badge` as-is — the padding/gap/radius of ScheduleSlot's badge slot match `Badge size="20"` exactly.
- The add-post trigger is a plain `<button>`, not `components/ui/button`'s `Button` — in Figma this control is a `Button` instance, but overridden down to a 16px full-radius circle (Button's regular variants are all fixed at 36px, with no smaller size), so it's reproduced locally instead. It replicates Button's hover/active interaction values (`--gb-background-mute` background, `--gb-icon-static-white` icon) rather than leaving the trigger static. Its Figma layer name is `lucide/circle-dashed`, but the actual exported SVG is `lucide/plus` (a plain `+`) — the layer name doesn't match the icon. Icon stroke width is 2 when `type="no content"` or `status="active"`, otherwise 1.

## States and behaviors

- `status="active"` sets the row background to `--gb-background-mute-subtler` for every type (including `archive`).
- Time text is muted (`--gb-text-subtler`) for `type="posted"` (always) and `type="no content"` with `status="disabled"` — otherwise `--gb-text-default`.
- `status="disabled"` on `posted`/`scheduled`/`draft`/`archive` has no Figma design and renders exactly like `status="default"`.
- The row itself has no hover state — Figma's component set only has `Type` × `Status` axes, no hover variant. Only the add-post trigger reacts on hover/active.
