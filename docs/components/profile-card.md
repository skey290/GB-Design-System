# ProfileCard

- Code: `components/content-studio/ui/ProfileCard/ProfileCard.tsx` (`ProfileCard.module.css`, `ProfileCard.stories.tsx`, `ProfileCard.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8757-7576) `Profile card` node `8127:92033`

## Overview

The 380px-wide card at the bottom of Content Studio's sidebar, showing the signed-in user's own profile. `open` switches between a full layout (avatar + job-title select + Self-Goal/Content Goal/Tone of Voice sections, each with a status icon and a pencil edit button) and a collapsed single row (avatar + job-title select + a checklist of the same three items as colored chips). `disabled` grays out the select and both icon buttons.

## When to use

- The persistent self-profile card at the bottom of Content Studio's sidebar.

## How to use

```tsx
<ProfileCard
  open={profileOpen}
  avatarSrc={user.avatarUrl}
  options={JOB_TITLE_OPTIONS}
  value={jobTitle}
  onValueChange={setJobTitle}
  onToggleOpen={() => setProfileOpen((prev) => !prev)}
  isSelfGoalComplete={selfGoal.isSaved}
  isContentGoalComplete={contentGoal.isSaved}
  isToneOfVoiceComplete={toneOfVoice.isSaved}
  knownForNowText={selfGoal.now}
  knownForNextText={selfGoal.next}
  contentGoalText={contentGoal.text}
  toneOfVoiceText={toneOfVoice.text}
  onEditSelfGoal={() => setGoalOpen(true)}
  onEditContentGoal={() => setGoalOpen(true)}
  onEditToneOfVoice={() => setGoalOpen(true)}
/>
```

## Props

| Prop                                                                     | Type             | Default                                             | Description                                                                                                                 |
| ------------------------------------------------------------------------ | ---------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `open`                                                                   | `boolean`        | `true`                                              | Figma `Open`. Full checklist/goal layout vs collapsed checklist row                                                         |
| `disabled`                                                               | `boolean`        | `false`                                             | Figma `Status=disabled`                                                                                                     |
| `avatarSrc`                                                              | `string`         | —                                                   | Image for the `Avatar`. Falls back to `Avatar`'s own icon fallback when omitted                                             |
| `avatarAlt`                                                              | `string`         | `"Profile picture"`                                 | Alt text for the avatar                                                                                                     |
| `options`                                                                | `SelectOption[]` | —                                                   | Forwarded to the job-title `Select`                                                                                         |
| `value` / `defaultValue` / `onValueChange`                               | —                | —                                                   | Forwarded to the job-title `Select`                                                                                         |
| `placeholder`                                                            | `string`         | `"Select..."`                                       | Forwarded to the job-title `Select`                                                                                         |
| `onToggleOpen`                                                           | `() => void`     | —                                                   | Shrink/expand toggle click handler — typically flips `open` in the parent (ProfileCard holds no internal open/closed state) |
| `toggleLabel`                                                            | `string`         | `"Collapse profile card"` / `"Expand profile card"` | Accessible label for the toggle button, defaults based on `open`                                                            |
| `isSelfGoalComplete` / `isContentGoalComplete` / `isToneOfVoiceComplete` | `boolean`        | `false`                                             | See **Completion criteria** below                                                                                           |
| `knownForNowText` / `knownForNextText`                                   | `string`         | sample text                                         | Self-Goal body text, shown when `open`                                                                                      |
| `contentGoalText`                                                        | `string`         | sample text                                         | Content Goal body text, shown when `open`                                                                                   |
| `toneOfVoiceText`                                                        | `string`         | sample text                                         | Tone of Voice body text, shown when `open`                                                                                  |
| `onEditSelfGoal` / `onEditContentGoal` / `onEditToneOfVoice`             | `() => void`     | —                                                   | Pencil button click handlers. ProfileCard does not own an edit modal — the parent opens its own (e.g. `GoalEditDialog`)     |

## Completion criteria

`isSelfGoalComplete` / `isContentGoalComplete` / `isToneOfVoiceComplete` control the status icon in the `open` layout (success check vs alarm X) and the chip color in the collapsed checklist row (`success` = green vs `alarm` = red).

**These are not derived from whether the text props are non-empty.** `knownForNowText` etc. always have a non-empty sample-text default when omitted, so "text is present" is never a reliable signal. Completion means: the user has actually saved real Goal data through the edit modal (e.g. uploaded an image + saved content, per Self's "creating a Self" flow) — not merely that a text field has a value. The parent is responsible for computing each boolean from its real data source (e.g. a `isSaved` flag on the Goal record) and passing it in; ProfileCard does not compute this itself.

## Structure

- Root card reuses `components/ui/select` (`variant="mute"`) for the job-title trigger, `components/ui/button` (`variant="icon"` for the toggle, `variant="icon-ghost"` for each pencil), `components/ui/badge` (`variant="reverse" size="20"`) for the "Now"/"Next" labels in the `open` layout, and `components/ui/chips` (default `size="md"`, `variant="success"`/`"alarm"`) for the collapsed checklist row — each chip gets an unstyled `CircleCheck`/`CircleX` child, so the icon inherits the chip's color and follows it on hover/selected (see docs/components/chips.md). The checklist chips locally tighten Chips' default horizontal padding (`--gb-spacing-4` → `--gb-spacing-3`, via an inline `style` override) so all three fit on one line inside the 380px card; the Tone of Voice chip's label is shortened to "Tone" for the same reason, while the Self-Goal/Content Goal labels stay full.
- Below the chip row, a single line of text reflects completion state — see **States and behaviors**.
- `open=false`'s avatar reuses `components/ui/avatar` (`shape="rounded"`) as-is.
- Status/pencil/toggle icons are `lucide-react` imports passed directly to `Button`'s `icon` prop, not routed through the sprite icon system.

## States and behaviors

- `disabled` disables the select and both icon buttons identically in both `open` states; it does not change the root card's border/background.
- In the collapsed (`open=false`) checklist row, the line below the chips is derived from the three completion props, not a static hint: any incomplete item(s) produce a `--gb-text-warning` message naming them ("Fill out Content Goal & Tone of Voice to generate content."), joined with `&` and capped at the three known labels; once all three are complete it switches to a plain `--gb-text-default` "All set — ready to generate content." instead.
- ProfileCard is a fully controlled component — it owns no `open` or completion state. The real app page (e.g. `app/review/content-studio/page.tsx`) keeps `open` in its own `useState` and flips it in `onToggleOpen`; the pencil buttons open an edit modal that lives outside ProfileCard entirely. In Storybook, the Playground story wraps ProfileCard in a demo-only local-state component so the toggle visibly works on canvas — real pages should wire their own state, not reuse that wrapper. The pencil buttons have no Storybook-side modal, since the modal is an app-layer component ProfileCard never imports.
