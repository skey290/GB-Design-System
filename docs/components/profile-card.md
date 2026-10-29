# ProfileCard

- Code: `components/content-studio/ui/ProfileCard/ProfileCard.tsx` (`ProfileCard.module.css`, `ProfileCard.stories.tsx`, `ProfileCard.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8757-7576) `Profile card` node `8127:92033`

## Overview

The 380px-wide card at the bottom of Content Studio's sidebar, showing the signed-in user's own profile. `open` switches between a full layout (portrait + bio + job-title select + goal button + a collapse toggle) and a collapsed single row (avatar + job-title select + goal button + an expand toggle). `disabled` grays out the select and both icon buttons.

## When to use

- The persistent self-profile card at the bottom of Content Studio's sidebar.

## How to use

```tsx
<ProfileCard
  options={[
    { value: "data-scientist", label: "Data Scientist" },
    { value: "product-manager", label: "Product Manager" },
  ]}
  value={jobTitle}
  onValueChange={setJobTitle}
  onGoalClick={openGoalSetting}
  onToggleOpen={() => setOpen((prev) => !prev)}
>
  <img src={user.portraitUrl} alt={user.name} />
</ProfileCard>
```

## Props

| Prop                                       | Type              | Default                                             | Description                                                                                                       |
| ------------------------------------------ | ----------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `open`                                     | `boolean`         | `true`                                              | Figma `Open`. Full layout vs collapsed single row                                                                 |
| `disabled`                                 | `boolean`         | `false`                                             | Figma `Status=disabled`                                                                                           |
| `children`                                 | `React.ReactNode` | —                                                   | Self-profile portrait slot (Figma instance-swap slot), `open` only. Falls back to a placeholder icon when omitted |
| `bio`                                      | `string`          | sample bio text                                     | Shown under the portrait, `open` only                                                                             |
| `avatarSrc`                                | `string`          | —                                                   | Image for the collapsed row's `Avatar`. Falls back to `Avatar`'s own icon fallback when omitted                   |
| `avatarAlt`                                | `string`          | `"Profile picture"`                                 | Alt text shared by the avatar and the portrait placeholder                                                        |
| `options`                                  | `SelectOption[]`  | —                                                   | Forwarded to the job-title `Select`                                                                               |
| `value` / `defaultValue` / `onValueChange` | —                 | —                                                   | Forwarded to the job-title `Select`                                                                               |
| `placeholder`                              | `string`          | `"Select..."`                                       | Forwarded to the job-title `Select`                                                                               |
| `onGoalClick`                              | `() => void`      | —                                                   | Goal icon button click handler                                                                                    |
| `goalLabel`                                | `string`          | `"Goal"`                                            | Accessible label for the goal icon button                                                                         |
| `onToggleOpen`                             | `() => void`      | —                                                   | Shrink/expand toggle click handler — typically flips `open` in the parent                                         |
| `toggleLabel`                              | `string`          | `"Collapse profile card"` / `"Expand profile card"` | Accessible label for the toggle button, defaults based on `open`                                                  |

## Structure

- Root card reuses `components/ui/select` (`variant="mute"`) for the job-title trigger and `components/ui/button` (`variant="icon"`) for the goal button in both layouts, unmodified.
- `open=true`'s portrait is a Figma instance-swap slot, reflected as a `children` prop — default content is a local placeholder (bordered box + `user-filled-icon` sprite), not a Figma-designed state.
- `open=false`'s avatar reuses `components/ui/avatar` (`shape="rounded"`) as-is.
- The shrink/expand toggle reuses `components/ui/button` (`variant="icon-ghost"`) with a local CSS override: Figma shows a bordered gray chip only when `disabled`, which `icon-ghost`'s shared disabled style (transparent) doesn't produce — overridden locally via a specificity-boosted selector rather than editing the shared `Button` component.
- Goal/Shrink/Expand icons are `lucide-react` imports passed directly to `Button`'s `icon` prop (same pattern as `SchedulePanel`'s `Plus`/`Settings2`), not routed through the sprite icon system.

## States and behaviors

- The job-title select's disabled text color is bound to `--gb-text-subtler` in Figma, but `Select`'s shared disabled style uses `--gb-text-static-gray` — a minor shade difference left as-is rather than editing the shared component for one screen (same call as `SchedulePanel`'s range select).
- `disabled` disables the select and both icon buttons identically in both `open` states; it does not change the root card's border/background.
