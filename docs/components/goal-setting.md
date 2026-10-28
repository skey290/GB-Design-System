# GoalSetting

- Code: `components/app/goal-setting/goal-setting.tsx` (`goal-setting.stories.tsx`, `goal-setting.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8234-99895) `Goal setting` node `8234:99895` (`Type=empty` `8127:91766`, `Type=default` `8127:91771`)

## Overview

The "My goal" card shared by Know Thyself's "Edit Goal" and Content Studio's "My goal". It has two sections, both always open for editing (no read/edit toggle):

- **Known for Now** — a single statement `Textarea`.
- **Known for Next** — a statement `Textarea` plus, once it has a value, a settings sentence ("I post `{frequency}`, aiming for `{followers}` followers, within `{timeframe}`.") whose three values are editable through inline chip panels.

Each section also has a collapsible "Gabrielle suggests N actions" accordion listing suggested actions with a `Run` button, shown only when actions are provided. A single `Save` button at the bottom of the card commits the whole card.

## When to use

- Identically in Know Thyself's "Edit Goal" modal and Content Studio's "My goal" modal.
- `FloatingProfile` is the read-only compact summary of the same data (its own bordered statement box + pencil button) — clicking its pencil opens `GoalSetting` (via `GoalEditDialog`) to edit.

## How to use

```tsx
<GoalSetting
  defaultNow="I'm known for financial modeling and data analysis in early-stage startups."
  defaultGoal="I'm known for Finance-Fluent Modeling Partner for early-stage SaaS founders."
  defaultPostingCount={3}
  defaultPostingFrequency="Day"
  defaultTargetedFollowersIndex={1}
  defaultTimeframe="1 year"
  nowActions={[
    {
      id: "a1",
      category: "Content Studio",
      label: "Draft 3 posts",
      onRun: runDraft,
    },
  ]}
  goalActions={[
    {
      id: "a2",
      category: "Assets",
      label: "Create a pitch deck in Assets",
      onRun: runDeck,
    },
  ]}
  onClose={close}
  onSave={persist}
/>
```

## Props

Controlled/uncontrolled pairs are listed as `value` / `defaultValue`. Passing nothing is uncontrolled; passing only `defaultX` sets the initial uncontrolled value; passing `x` makes it fully controlled.

| Prop                                                       | Type                                                | Default    | Description                                                                         |
| ---------------------------------------------------------- | --------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------- |
| `now` / `defaultNow`                                       | `string`                                            | `""`       | "Known for Now" statement. Empty shows the Textarea's placeholder guidance sentence |
| `onNowChange`                                              | `(value: string) => void`                           | —          | Called immediately on every keystroke in the Now textarea                           |
| `nowActions`                                               | `GoalSettingAction[]`                               | `[]`       | Suggested actions for Now's Gabrielle accordion. Empty hides the accordion entirely |
| `goal` / `defaultGoal`                                     | `string`                                            | `""`       | "Known for Next" statement                                                          |
| `onGoalChange`                                             | `(value: string) => void`                           | —          | Called immediately on every keystroke in the Next textarea                          |
| `goalActions`                                              | `GoalSettingAction[]`                               | `[]`       | Suggested actions for Goal's Gabrielle accordion                                    |
| `postingCount` / `defaultPostingCount`                     | `number`                                            | `3`        | Posting Frequency stepper value                                                     |
| `postingFrequency` / `defaultPostingFrequency`             | `"Day" \| "Week" \| "Month"`                        | `"Day"`    | Posting Frequency toggle                                                            |
| `targetedFollowersIndex` / `defaultTargetedFollowersIndex` | `number` (0–5)                                      | `1`        | Index into `TARGETED_FOLLOWERS_LABELS`                                              |
| `timeframe` / `defaultTimeframe`                           | `"1 month" \| "3 months" \| "6 months" \| "1 year"` | `"1 year"` |                                                                                     |
| `onClose`                                                  | `() => void`                                        | —          | Card's close (X) button, only rendered when `showHeader` is true                    |
| `showHeader`                                               | `boolean`                                           | `true`     | Shows the "My goal" title + close button row. `false` to embed headerless           |
| `onSave`                                                   | `() => void`                                        | —          | Card's single bottom Save button                                                    |

`GoalSettingAction`: `{ id: string; category: string; label: string; onRun?: () => void }`. `category` is the text shown in the leading Badge (e.g. `"Assets"`, `"Content Studio"`).

## Structure

- No read/edit toggle, no pencil button, no draft buffering. Both statement `Textarea`s are always mounted; `onNowChange`/`onGoalChange` fire on every keystroke (controlled/uncontrolled, same pattern as the sibling `KnownFor` component). There is one `Save` button for the whole card (`Button variant="primary"`, full width) — it only calls `onSave`, it does not hold back any value.
- The settings sentence (`I post {chip}, aiming for {chip} followers, within {chip}.`) only renders once `goal` is non-empty — matches Figma, which has no divider/sentence at all in the empty-goal mockup. Its three chips are always `Chips variant="outline"`. The chip matching whichever settings panel is currently open (`frequency`/`followers`/`timeframe`) gets `selected`; the other two stay unselected.
- Clicking a settings chip opens the matching inline panel (`Posting Frequency` stepper + Day/Week/Month toggle, `Targeted Followers` `Slider`, or `Timeframe` toggle list) below the sentence, dashed-border/`radius-3xl`/`shadow-lg`. Clicking the same chip again closes it; clicking a different chip switches panels. Panel edits call `onPostingCountChange`/`onPostingFrequencyChange`/`onTargetedFollowersIndexChange`/`onTimeframeChange` immediately — there is no separate commit step for them either, `openPanel` is purely which panel is currently expanded.
- `Button`, `Badge`, `Chips`, `Slider`, and `Textarea` are reused unmodified — no new CSS or new general-purpose components were added. `Badge variant="alarm"` is the "Needs approval" badge; `Badge variant="outline"` is the action row's category badge; the `Run` button and the Posting-Frequency-toggle/Timeframe-toggle buttons are all `Button variant="outline"` (selected ones add `isSelected`); `Save` is `Button variant="primary"`.
- `STATEMENT_BOX_CLASS` is exported from this file but is no longer used inside `GoalSetting` itself (Figma's always-open Textarea has no outer bordered box — the border/padding come from `Textarea`'s own styling). It remains because `FloatingProfile`'s read-only summary box still uses it.
- Targeted Followers' bottom scale labels use the same percent-of-thumb-range formula as the `Slider` thumb rather than Figma's static evenly-spaced layout — a working slider's labels should track the thumb's value range. Flag if literal Figma spacing is preferred instead.
- The "Gabrielle suggests N actions" accordion renders at most 3 action rows plus a "+ N more" line when there are more; it sits below each section's Textarea (and settings sentence/panel, for Next).

## States and behaviors

- `now`/`goal` empty render the Textarea's native `placeholder` (muted text color comes from `Textarea`'s own styling, not manual conditional coloring).
- Both sections are always editable simultaneously — there is no mutual-exclusion between Now and Next, and no unsaved-draft discard behavior.
- `nowActions`/`goalActions`, `postingCount`, `postingFrequency`, `targetedFollowersIndex`, and `timeframe` all support the controlled/uncontrolled pair, so the component works immediately in Storybook Controls or a minimally wired consumer.
