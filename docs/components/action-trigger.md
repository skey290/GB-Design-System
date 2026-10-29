# ActionTrigger

- Code: `components/content-studio/ui/ActionTrigger/ActionTrigger.tsx` (`ActionTrigger.module.css`, `ActionTrigger.stories.tsx`, `ActionTrigger.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-92271) `Action Trigger` node `8127:92271`

## Overview

Content Studio's analysis dashboard widget showing actionable next steps: an "Action Items" list (empty slots, perception gaps, etc.) and a "Why don't you try this?" AI-recommendation card with a Skeleton placeholder standing in for a generated preview. `type` toggles between the real-data view and a no-data placeholder.

## When to use

- The Content Studio analysis dashboard's action/recommendation section.

## How to use

```tsx
<ActionTrigger
  items={[
    {
      label: "Empty Slot on Jul 2",
      description: 'AI topic suggestion ready — "Leading without authority."',
      badgeLabel: "Draft",
      badgeVariant: "alarm",
      onAction: () => openComposer(slotId),
    },
    // ...one entry per action item
  ]}
  recommendationHeadline="Turn expertise into authority"
  recommendationDescription="Your sustainable fashion niche isn't landing yet. Let AI draft a post that stakes your POV."
  onTryItOut={() => startAiDraft()}
/>

<ActionTrigger type="empty" onCreatePosts={() => router.push("/content-studio")} />
```

## Props

| Prop                        | Type                  | Default                                                                                         | Description                                                                            |
| --------------------------- | --------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `type`                      | `"full" \| "empty"`   | `"full"`                                                                                        | Figma `Type`, toggles between the real content and the no-post placeholder             |
| `title`                     | `string`              | `"Action Items"`                                                                                | "Action Items" card title (also used as the standalone title in `type="empty"`)        |
| `items`                     | `ActionTriggerItem[]` | 3-row mock data                                                                                 | Action item rows, in display order. The "N items" count is derived from `items.length` |
| `footerCaption`             | `string`              | `"Updated daily · Prioritized by urgency"`                                                      | "Action Items" card footer caption                                                     |
| `recommendationTitle`       | `string`              | `"Why don't you try this?"`                                                                     | Recommendation card title                                                              |
| `recommendationHeadline`    | `string`              | `"Turn expertise into authority"`                                                               | Headline under the skeleton placeholder                                                |
| `recommendationDescription` | `string`              | `"Your sustainable fashion niche isn't landing yet. Let AI draft a post that stakes your POV."` | Supporting copy under the headline                                                     |
| `recommendationActionLabel` | `string`              | `"Try it out"`                                                                                  | Recommendation card CTA label                                                          |
| `onTryItOut`                | `() => void`          | —                                                                                               | Recommendation card CTA click handler                                                  |
| `emptyTitle`                | `string`              | `"No post yet"`                                                                                 | `type="empty"` placeholder title                                                       |
| `emptyDescription`          | `string`              | `"You haven't generated any posts yet.\nCreate a post at the content studio to get started."`   | `type="empty"` placeholder description                                                 |
| `emptyActionLabel`          | `string`              | `"Create posts"`                                                                                | `type="empty"` CTA label                                                               |
| `onCreatePosts`             | `() => void`          | —                                                                                               | `type="empty"` CTA click handler                                                       |

`ActionTriggerItem` is `{ label, description, badgeLabel, badgeVariant?, actionLabel?, onAction? }`.

## Structure

- `type="empty"`: a title followed by a single bordered box — a dashed-circle icon + `emptyTitle`, `emptyDescription`, and a full-width `Button variant="primary"` CTA.
- `type="full"`: two card shells stacked vertically (`width: 367.5px`), each bordered/rounded/padded identically.
  - "Action Items" card: title + "N items" header row, then one bordered "Sonner" row per `items` entry (status icon, label, `Badge`, description, full-width `Button variant="mute"` CTA), then the footer caption.
  - "Why don't you try this?" card: title, a `Skeleton type="rectangle"` placeholder (270px height, `--gb-radius-scale-xl`), a headline/description text block, then a full-width `Button variant="mute"` CTA.
- The Figma `Part/Action Trigger` atom (`Type=item/ad`) isn't a separate component — it's reproduced as a local subcomponent (`ItemRow`) inside `ActionTrigger.tsx`, matching the pattern used by `PostSignal`/`MostHooked`.

## States and behaviors

- Each item row's icon is fixed to `circle-check-icon` — Figma doesn't vary it across rows, so it isn't exposed as a prop.
- `items[].badgeVariant` defaults to `"default"` (black "Brand Goal" look); pass `"alarm"` for the warning-toned "Draft" look. Both reuse the general-purpose `Badge` as-is.
- `items[].onAction` is a per-row callback, since each row's "Create a post" button is a real action trigger rather than passive display.
- `Skeleton`'s default `rectangle` size (226×157px, `--gb-radius-scale-2xl`) is overridden locally to the Figma-confirmed 270px height and `--gb-radius-scale-xl` radius via a doubled class selector for specificity (`.recommendationSkeleton.recommendationSkeleton`), independent of CSS module load order.
- `Button variant="mute"` is reused for every CTA except the `type="empty"` one, which uses `variant="primary"` — both match their Figma counterparts pixel-for-pixel without local overrides.
