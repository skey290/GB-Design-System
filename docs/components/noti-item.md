# NotiItem

- 코드: `components/app/noti-item/noti-item.tsx` (`noti-item.stories.tsx`, `noti-item.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8163-93036) `Part/Notification` node `8163:93036`

## Overview

`NotiDropdown` 리스트 행 하나. `Megaphone` 아이콘 + 라벨 + (읽지 않음이면) 우측 4px 빨간 dot.

## How to use

```tsx
<NotiItem label="New comment on your asset" unread />
```

## Props

| Prop        | 타입      | 기본값 | 설명                                      |
| ----------- | --------- | ------ | ----------------------------------------- |
| `label`     | `string`  | (필수) | 알림 텍스트                                |
| `unread`    | `boolean` | `false` | Figma `Type=new` — true면 우측에 dot 표시 |
| `className` | `string`  | -      | 루트에 병합                                |

## States and behaviors

- hover 시 `--gb-background-mute` 배경 + `--gb-text-static-white`로 반전. Figma `Status` 축은 `default`/`active` 2종만 있고 별도 disabled는 없다 — hover 기반으로 표현한다.
