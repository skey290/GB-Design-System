# MenuNotification

- 코드: `components/app/menu-notification/menu-notification.tsx` (`menu-notification.stories.tsx`, `menu-notification.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8163-93080) GNB 노드 `8163:93080`의 알림벨 트리거(Button 인스턴스, 아이콘 `dot-bell-icon`)

## Overview

GNB 알림벨 트리거. `type`에 따라 아이콘만 또는 아이콘+라벨로 렌더링하고, 클릭 시 `NotiDropdown`을 여는 트리거 역할을 한다(`components/app/gnb/gnb.tsx`가 Radix `Popover.Trigger`로 감싸 사용).

## How to use

```tsx
<MenuNotification type="icon" aria-label="Notification" />
<MenuNotification type="text" status="active" />
```

## Props

| Prop      | 타입                                   | 기본값           | 설명                                                              |
| --------- | -------------------------------------- | ---------------- | ------------------------------------------------------------------ |
| `type`    | `"icon" \| "text"`                      | `"icon"`         | Figma `Type`                                                        |
| `status`  | `"default" \| "active" \| "disabled"`   | `"default"`      | Figma `Status`                                                      |
| `label`   | `string`                                | `"Notification"` | `type="text"`에서 렌더링할 라벨                                     |
| `showDot` | `boolean`                               | `true`           | 읽지 않음 표시 여부 (status가 disabled면 무조건 숨김)                |

## States and behaviors

- **아이콘은 두 가지**: 읽지 않음 표시가 있을 때(`showDot && !disabled`)는 Figma 원본과 동일하게 벨+점이 하나로 합쳐진 `dot-bell-icon`(`/public/icons.svg`) 스프라이트를 쓴다. 없을 때(Figma에 없는 상태 — 정적 디자인 툴은 "읽음" 상태를 따로 그리지 않는다)는 순수 lucide `Bell`을 쓴다.
- **active**: 아이콘 박스 배경이 `--gb-background-mute`로 채워진다(라벨/아이콘 흰색 반전). radius는 `--gb-radius-scale-md` 고정 — `MenuButton`과 달리 hover 시 모양이 바뀌지 않는다.
- GNB Expand 토글 시 라벨은 `MenuButton`과 동일한 `grid-template-columns`(0fr↔1fr) 트릭으로 트랜지션된다.
