# ReachEngagement

- Code: `components/screens/content-studio/ui/ReachEngagement/ReachEngagement.tsx` (`ReachEngagement.module.css`, `ReachEngagement.stories.tsx`, `ReachEngagement.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-86245) `Reach & Engagement` node `8127:86245`

## Overview

Content Studio's analysis dashboard card for reach/engagement metrics and the per-channel growth funnel. `type` controls which of the three Figma variants renders: a compact reach summary, a wide multi-column funnel breakdown, or a no-data placeholder.

## When to use

- The Content Studio analysis dashboard's reach/engagement section.

## How to use

```tsx
<ReachEngagement type="reach" />

<ReachEngagement
  type="funnel"
  accountOptions={[{ value: "linkedin", label: "LinkedIn" }]}
  defaultAccountValue="linkedin"
  columns={[
    {
      label: "Reach",
      value: "204",
      delta: "+10%",
      showDetail: true,
      rows: [
        { icon: "linkedin-icon", label: "Linkedin", value: "204", delta: "-2", highlighted: true },
        // ...one entry per channel
      ],
    },
    // ...Engagement / New Followers / Conversion columns
  ]}
/>

<ReachEngagement type="empty" />
```

## Props

| Prop                                                                          | Type                             | Default                                                        | Description                                       |
| ----------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------- | ------------------------------------------------- |
| `type`                                                                        | `"reach" \| "funnel" \| "empty"` | `"empty"`                                                      | Figma `Type`                                      |
| `period`                                                                      | `string`                         | `"Last 28 days"`                                               | Shared header/column caption                      |
| `reachTotal` / `reachDelta`                                                   | `string`                         | `"18,240"` / `"+22%"`                                          | `type="reach"` headline total and its delta badge |
| `engagementRate` / `newFollowers`                                             | `string`                         | `"4.2%"` / `"+127"`                                            | `type="reach"` metric rows                        |
| `topChannel`                                                                  | `TopChannelSummary`              | mock Linkedin entry                                            | `type="reach"` best-performing channel summary    |
| `onFunnelAnalysisClick` / `funnelAnalysisLabel`                               | —                                | — / `"Funnel Analysis"`                                        | `type="reach"` CTA button                         |
| `accountOptions` / `accountValue` / `defaultAccountValue` / `onAccountChange` | —                                | one "Social Connected" option                                  | `type="funnel"` connected-account select          |
| `columns`                                                                     | `FunnelColumn[]`                 | 4-column mock data (Reach/Engagement/New Followers/Conversion) | `type="funnel"` metric columns, in display order  |

`FunnelColumn` is `{ label, value, valueCaption?, delta, deltaCaption?, showDetail?, rows: FunnelChannelRow[] }`.
`FunnelChannelRow` is `{ icon: IconId, label, value, delta, highlighted? }`.
`TopChannelSummary` is `{ icon: IconId, label, reach, engagementRate }`.

## Structure

- Shared card shell: bordered, rounded container, 300px wide for `reach`/`empty`, 1192px wide for `funnel`.
- `type="reach"`: header ("Reach" / `period`), total figure with a delta `Badge`, two metric rows, a "Top Channel" summary (icon + name + reach/engagement rate), and a full-width "Funnel Analysis" button (`Button variant="mute"`).
- `type="funnel"`: "Growth funnel on" + a connected-account `Select` (`variant="mute"`), followed by `columns.length` columns laid out side by side. Each column has a title/subtitle/chevron header, a headline value with delta badge, a divider, and a list of channel rows (icon, label, value `Badge variant="outline"`, delta text).
- `type="empty"`: header plus a centered globe icon, "No reach data yet" title, and a supporting description.

## States and behaviors

- The Figma `Part/funnel` atom (`Status=default/focus`) is implemented as a local row inside each funnel column rather than a separate component — `row.highlighted` toggles the `Status=focus` look (subtler background behind the icon+label only, not the value badge or delta).
- `columns` is fully data-driven — there's no formal Figma property backing the per-column/per-row content beyond `type`, so callers are expected to pass real metrics for production use. The default mock data matches Figma's current "Last 28 days" sample numbers, limited to the six channels with a dedicated icon (Instagram/YouTube/Threads/Facebook/LinkedIn/TikTok).
- Figma's own channel rows currently have two unresolved inconsistencies that this component does **not** reproduce: several columns still label a row "Pinterest" while rendering the Instagram icon (no Pinterest icon exists in the icon sprite), and the highlighted "Linkedin" row in the raw Figma data points at the default Instagram placeholder icon instead of the LinkedIn icon. Because `rows` are supplied by the caller via `icon: IconId`, the default mock data sidesteps both by using the correct `linkedin-icon` and omitting the unresolved Pinterest row — callers passing real data aren't affected either way.
