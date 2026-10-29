# MostHooked

- Code: `components/content-studio/ui/MostHooked/MostHooked.tsx` (`MostHooked.module.css`, `MostHooked.stories.tsx`, `MostHooked.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8507-71028) `MostHooked` node `8127:86223`

## Overview

The "Top Performers" ranking card in Content Studio's analysis dashboard. Embeds the shared `ProfileCard` (self profile, always `open`) above a ranked list of the account's best-performing posts, sorted by engagement.

## When to use

- The Content Studio analysis dashboard's top-performers card.

## How to use

```tsx
<MostHooked
  options={jobTitleOptions}
  defaultValue="data-scientist"
  bio="4 years in finance, 3 in data science — forecasting Finance teams trust."
  items={[
    {
      handle: "@cloedatascientist",
      description: "Discover the latest insights and updates here.",
      likes: 74,
      comments: 51,
    },
    // ...up to the ranked posts to show
  ]}
  onGoalClick={handleGoalClick}
/>

<MostHooked options={jobTitleOptions} /> {/* no items → no-data state */}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `MostHookedItem[]` | `[]` | Ranked posts, sorted by engagement. Rank numbers and the first row's highlighted look are derived from array order — empty/omitted renders the no-data state |
| `children` | `ReactNode` | — | Self-profile portrait slot, forwarded to the embedded `ProfileCard` |
| `open` / `disabled` / `avatarSrc` / `avatarAlt` | — | — | Forwarded to the embedded `ProfileCard` |
| `options` | `SelectOption[]` | — | Forwarded to the embedded `ProfileCard`'s job-title select |
| `value` / `defaultValue` / `onValueChange` / `placeholder` | — | — | Forwarded to the embedded `ProfileCard`'s select |
| `onGoalClick` / `goalLabel` | — | — | Forwarded to the embedded `ProfileCard`'s goal button |
| `onToggleOpen` / `toggleLabel` | — | — | Forwarded to the embedded `ProfileCard`'s shrink/expand toggle |

`MostHookedItem` is `{ handle: string; description: string; likes: number; comments: number }`.

## Structure

- Embedded `ProfileCard` (reused as-is, `open=true`).
- A header ("Top Performers" / "Sorted by Engagement") shared by both the list and no-data states.
- Full state: a card listing one row per `items` entry. Each row shows the LinkedIn icon, handle, a rank `Badge`, description, a divider, and like/comment counts. The first row always renders with the highlighted look (subtler background, no border, `Badge variant="alarm"`); the rest use the default look (bordered card, `Badge variant="outline"`).
- No-data state: a single card with the header plus a centered hook icon, "No posts tracked yet" title, and a supporting description.

## States and behaviors

- The full/no-data split is driven purely by whether `items` has entries — there's no separate status prop.
- Only the first item in `items` ever renders highlighted; reordering `items` moves the highlight with it.
- The embedded `ProfileCard`'s own `disabled`/`open` behavior is unchanged — see its own reference doc for details.
