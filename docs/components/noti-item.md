# NotiItem

- Code: `components/app/noti-item/noti-item.tsx` (`noti-item.stories.tsx`, `noti-item.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8163-93036) `Part/Notification` node `8163:93036`

## Overview

One row of the `NotiDropdown` list: a `Megaphone` icon, a label, and — when unread — a 4px red dot on the right.

## How to use

```tsx
<NotiItem label="New comment on your asset" unread />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | (required) | Notification text |
| `unread` | `boolean` | `false` | Figma `Type=new` — shows the dot on the right when true |
| `onClick` | `() => void` | — | Called when the row is clicked (the root is a `<button>`) |
| `className` | `string` | — | Merged onto the root |

## States and behaviors

- Hover inverts the row to a `--gb-background-mute` background with `--gb-text-static-white`. The Figma `Status` axis has only `default` and `active` with no separate disabled, so hover carries the active look.
