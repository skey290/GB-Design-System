# GoalSetting

- Code: `components/app/goal-setting/goal-setting.tsx` (`goal-setting.stories.tsx`, `goal-setting.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8234-99895) `Goal setting` node `8234:99895`

## Overview

The Goal settings card shared by Know Thyself's "Edit Goal" and Content Studio's "My goal". It has two states: `type="empty"` (no goal yet — guidance copy plus a Chatbox) and `type="filled"` (the full form with Brand Position, Target, Posting/Tracking Frequency, and Targeted Followers).

Figma has three separate components — `Type=empty`, `Type=modeling partner`, `Type=fashionista` — but those are a layer-naming convention rather than Figma variant properties. Structurally there are only empty and filled; "modeling partner" and "fashionista" are two sets of sample data for the filled state, identical in structure.

## When to use

- Identically in Know Thyself's "Edit Goal" modal and Content Studio's "My goal" modal.

## How to use

```tsx
<GoalSetting type="empty" onSubmitDescription={handleDescribe} onClose={close} />

<GoalSetting
  type="filled"
  paragraph1Template="I'm a data scientist ... positioned as a {brandPosition} for {target} ..."
  paragraph2Template="I share {postingSummary} ... approximately {targetedFollowers} ... {trackingFrequency} reach ..."
  brandPosition={brandPosition}
  target={target}
  postingFrequency={postingFrequency}
  postingCount={postingCount}
  targetedFollowersIndex={followersIndex}
  trackingFrequency={trackingFrequency}
  onSave={handleSave}
  onClose={close}
/>
```

## Props

Beyond the shared `onClose` and `className`, the props split by `type`.

### `type="empty"`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onSubmitDescription` | `(description: string) => void` | — | Called with the entered text when the Chatbox send (✨) fires |
| `onSave` | `() => void` | — | Called when the Save button is clicked |

### `type="filled"`

Fields supporting the controlled/uncontrolled pair are listed as `value` / `defaultValue`. Both are optional: passing nothing is uncontrolled, passing only `defaultX` sets the initial uncontrolled value, and passing `x` makes it fully controlled.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `paragraph1Template` | `string` | (required) | Contains the `{brandPosition}` and `{target}` placeholders |
| `paragraph2Template` | `string` | (required) | Contains `{postingSummary}`, `{targetedFollowers}`, `{trackingFrequency}` |
| `brandPosition` / `defaultBrandPosition` | `string` | `""` | Both the input value and the badge value in the paragraph (one source) |
| `target` / `defaultTarget` | `string` | `""` | Same as above |
| `brandPositionFile` / `targetFile` | `File \| null` | `null` | Attachment for each input (controlled only) |
| `postingFrequency` / `defaultPostingFrequency` | `"Daily" \| "Weekly" \| "Monthly"` | `"Daily"` | |
| `postingCount` / `defaultPostingCount` | `number` | `3` | `{postingSummary}` renders as `"{n} time(s) a day (Daily)"`, with the Posting Frequency choice appended in parentheses |
| `targetedFollowersIndex` / `defaultTargetedFollowersIndex` | `number` (0–5) | `1` | Index into `TARGETED_FOLLOWERS_LABELS` |
| `trackingFrequency` / `defaultTrackingFrequency` | `"Weekly" \| "Monthly" \| "Quarterly"` | `"Monthly"` | |
| `onSave` | `() => void` | — | |

## Structure

- The badges inside the paragraphs are not free text. Values derived from the fields below (`brandPosition`, `target`, `postingFrequency` + `postingCount`, `targetedFollowersIndex`, `trackingFrequency`) are substituted into the `{key}` placeholders, so editing a field always updates the paragraph badge too. Only the surrounding sentence (the template itself) is free.
  `Badge variant="default" size="20"` is reused without modification — measurement confirmed the `size="20"` preset (20px tall, 6px horizontal padding, `text-xs-medium`) matches Figma exactly, so overriding padding or font through `className` would actually break it. Only `align-middle` is added, to stop the baseline shifting when the value is empty. It is a Badge rather than Chips because it only displays a value and is not a clickable action — Figma replaced Chips with Badge here too.
- The Brand Position and Target rows reuse the shared `InputForm` as-is (with `showSelect` and `showLink` off) — the label + textfield + attachment upload structure matches Figma 1:1. The upload row keeps `InputForm`'s own default placeholder ("File upload"); Figma's "File.pdf" is not an empty-state placeholder but the name of an already-attached example file, which `InputForm` shows automatically once a real file is attached.
- The Posting/Tracking Frequency buttons (`FrequencyGroup`) and the posting counter (±) all reuse the shared `Button`. The button group is `variant="outline"` with only the selected background and text color overridden through `className`; the counter is `variant="icon-rounded"` shrunk to 24px. Hover, focus-visible, active, and disabled all come from Button itself. Measured against Figma, the three buttons are `flex-1` at equal width, and Posting Frequency puts the button row and the counter row on **separate lines**, stacked vertically.
- Targeted Followers reuses the shared `Slider` (`min=0`, `max=5`) by index, with `shouldFitContainer` so it fills the card. The six scale labels below ("1,000" through "1M+") **deliberately do not follow Figma's actual layout** (evenly spaced, unrelated to the slider value) and instead use the same percentage formula as the thumb (`index / 5 * 100%`). Figma is a static mockup showing a single value (5,000), so its track and labels are not structurally connected; in a working slider the labels must line up with the thumb at every value, so this was branched intentionally with the user's confirmation.
- Close (X) is `Button variant="icon-ghost"`, Save is `Button variant="primary"`.

## States and behaviors

- In `type="empty"` the guidance copy is not a separate slot — it is passed as `Chatbox`'s `placeholder`, so typing happens in the same textarea (the guidance disappears and the real text appears).
- `brandPosition`, `target`, `postingFrequency`, `postingCount`, `targetedFollowersIndex`, and `trackingFrequency` all support the controlled/uncontrolled pair. With nothing passed they run on internal state, so typing and clicking work immediately in Storybook Controls or in a minimally wired consumer.
