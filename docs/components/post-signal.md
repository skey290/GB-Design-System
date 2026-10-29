# PostSignal

- Code: `components/content-studio/ui/PostSignal/PostSignal.tsx` (`PostSignal.module.css`, `PostSignal.stories.tsx`, `PostSignal.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-86739) `Post signal` node `8127:86739`

## Overview

Content Studio's analysis dashboard widget showing how a post is perceived. Two stacked cards: "How people see you" (perception-alignment score + a list of brand traits matched against comment data) and "What people say" (top perceived-trait hashtags + a list of comment-reaction categories). `type` toggles both cards between their real-data view and a shared no-data placeholder.

## When to use

- The Content Studio analysis dashboard's perception/comment-signal section.

## How to use

```tsx
<PostSignal
  perceptionPercent={75}
  traits={[
    {
      label: "Expert & authoritative",
      status: "matched",
      description: "To be the go-to person for sustainable fashion startups, your content needs to establish deep expertise and authority.",
    },
    // ...one entry per trait
  ]}
  perceivedTraits={["Relatable", "Trustworthy", "Practical"]}
  reactions={[
    { icon: "message-circle-heart-icon", label: "Empathy", percent: 50, comments: 43, quote: '"I went through the same thing..."' },
    // ...one entry per reaction category
  ]}
/>

<PostSignal type="empty" />
```

## Props

| Prop                                                  | Type                   | Default                                                                                                 | Description                                                                             |
| ----------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `type`                                                | `"full" \| "empty"`    | `"full"`                                                                                                | Figma `Type`, toggles both cards between real content and the no-data placeholder       |
| `perceptionLabel`                                     | `string`               | `"Perception Alignment"`                                                                                | "How people see you" headline row label                                                 |
| `perceptionPercent`                                   | `number`               | `75`                                                                                                    | "How people see you" headline percent + progress-bar fill                               |
| `traits`                                              | `PostSignalTrait[]`    | 5-row mock data                                                                                         | Brand-trait rows, in display order                                                      |
| `perceivedTraits`                                     | `string[]`             | `["Relatable", "Trustworthy", "Practical", "Authentic", "Inspiring"]`                                   | Hashtag list under "Top perceived traits (from comments)" (rendered with a leading `#`) |
| `reactions`                                           | `PostSignalReaction[]` | 4-row mock data                                                                                         | Comment-reaction rows, in display order                                                 |
| `perceptionEmptyTitle` / `perceptionEmptyDescription` | `string`               | `"No audience signals yet"` / `"We need comments and feedback to analyze how your brand is perceived."` | `type="empty"` copy for "How people see you"                                            |
| `feedbackEmptyTitle` / `feedbackEmptyDescription`     | `string`               | `"No feedback insights yet"` / `"Your top perceived traits from comments will appear here."`            | `type="empty"` copy for "What people say"                                               |

`PostSignalTrait` is `{ label, status: "matched" | "weak-signal" | "not-detected", description, badgeLabel? }`.
`PostSignalReaction` is `{ icon: IconId, label, percent, comments, quote }`.

## Structure

- Two card shells stacked vertically (`width: 421.5px`), each bordered/rounded/padded identically — "How people see you" then "What people say".
- The Figma `Part/post signal` atom (`Type=feedback insight/audience signal`, `Style=full/empty`) isn't a separate component — it's reproduced as local subcomponents (`TraitRow`, `ReactionRow`) inside `PostSignal.tsx`, matching the pattern used by `MostHooked`/`ReachEngagement`.
- "How people see you": the `perceptionLabel`/`perceptionPercent` header row, a full-width `ProgressBar`, then one bordered "Sonner" card per `traits` entry (status icon, label, `Badge`, divider, description).
- "What people say": a hashtag row for `perceivedTraits`, then one bordered "Sonner" card per `reactions` entry (icon, label, a 120px-wide `ProgressBar` + comment count, divider, quote).
- `type="empty"`: both cards collapse to a centered icon + title + description placeholder (heart icon for perception, smile icon for feedback).

## States and behaviors

- Each `PostSignalTrait.status` fully derives its row's styling — no separate icon/color/badge props exist:
  - `matched` → `circle-check-icon`, `--gb-text-default` label, `Badge variant="outline"` ("Matched")
  - `weak-signal` → `triangle-alert-icon`, `--gb-text-info` label, `Badge variant="default"` ("Weak signal")
  - `not-detected` → `circle-x-icon`, `--gb-text-warning` label, `Badge variant="alarm"` ("Not detected")
- `badgeLabel` overrides the status's default badge text without changing the icon/color/variant.
- The divider between each row's header and body (Figma's `Vector9` 0.5px line) is implemented as a `border-top`, the same convention `MostHooked`'s row divider uses, rather than embedding the SVG asset.
- `reactions[].percent` is the progress-bar fill and is independent of `comments` — Figma has no formal property tying the two together (same "fully data-driven" status as `ReachEngagement.columns` / `ContentsAnalysis.goals`), so callers supply real metrics for both.
- `Badge` and `ProgressBar` are reused as-is; no local style overrides were needed for either.
