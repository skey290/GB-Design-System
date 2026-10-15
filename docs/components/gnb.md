# Gnb

- 코드: `components/app/gnb/gnb.tsx` (`gnb.stories.tsx`, `gnb.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8163-93080) `GNB` node `8163:93080` (Type×Expand×Notification 8 variant)

## Overview

메인 사이드바. Expand/Notification 두 축을 "`expanded` boolean + `activeId`/`disabledIds`"로 축약했다(아이콘 레일의 토글/벨/설정 버튼은 범용 `Button`, 펼쳐졌을 때의 메뉴 리스트는 `MenuButton`/`Part/GNB`로 서로 다른 Figma 컴포넌트다 — 하나로 합쳐져 있지 않다).

## How to use

```tsx
<Gnb
  expanded={expanded}
  onExpandedChange={setExpanded}
  items={[{ id: "dashboard", icon: Home, label: "Dashboard" }, ...]}
  activeId={activeId}
  onItemSelect={setActiveId}
  unreadCount={2}
  notificationItems={notificationItems}
  onSettingsClick={handleSettings}
/>
```

## Props

| Prop                          | 타입                              | 기본값 | 설명                                                |
| ----------------------------- | --------------------------------- | ------ | --------------------------------------------------- |
| `expanded`                    | `boolean`                          | (필수) | Figma `Expand`                                       |
| `onExpandedChange`            | `(expanded: boolean) => void`      | -      | 접기/펼치기 토글 버튼 클릭 시 호출                   |
| `items`                       | `GnbItem[]`                       | (필수) | `{ id, icon: LucideIcon, label }[]`                  |
| `activeId`                    | `string`                           | (필수) | 현재 활성 항목 id                                     |
| `disabledIds`                 | `string[]`                        | `[]`   | 개별 비활성화 항목 id (Figma `Style=disabled`)        |
| `onItemSelect`                | `(id: string) => void`             | -      |                                                        |
| `unreadCount`                 | `number`                           | `0`    | 알림벨 dot 표시 여부 결정 (0이면 숨김)                |
| `notificationItems`           | `NotiDropdownItem[]`               | `[]`   | `NotiDropdown`에 전달                                 |
| `onNotificationSettingsClick` | `() => void`                       | -      |                                                        |
| `onSettingsClick`             | `() => void`                       | -      | Settings 메뉴 클릭 (플라이아웃 패널은 후속 작업)       |

## Structure

- 접힌 상태(`expanded=false`): 토글/벨/설정/네비게이션 항목 전부 `MenuButton`의 `type="icon"`(= Figma 아이콘 레일의 범용 `Button` 인스턴스를 값으로 재현한 것 — 구조적으로는 `<button>` 중첩이 불가능해 컴포넌트 자체를 끼워넣지 못한다).
- 펼친 상태(`expanded=true`): 네비게이션 항목은 `MenuButton`의 `type="icon-with-text"`(Figma `Part/GNB`).
- 로고는 `/public/images/logo.png`, 너비는 Figma 확정값 `250px`(펼침) / `48px`(접힘).
- 알림 드롭다운은 벨 트리거(`MenuNotification`)에 앵커된 Radix `Popover`(`NotiDropdown`).

## Icon mapping (실사용처 기준, `gnb.stories.tsx`/`app/compass/page.tsx`)

| 항목            | 아이콘                                  |
| --------------- | ---------------------------------------- |
| Dashboard       | lucide `Home`                            |
| Assets          | `/public/icons.svg`의 `asset-icon` 커스텀 스프라이트 |
| Compass         | lucide `Compass`                         |
| Contents Studio | lucide `Blocks`                          |
| Know Thyself    | lucide `UserSearch`                      |

Assets만 Figma에 lucide로 없는 커스텀 글리프(사람+뷰파인더 브래킷)라 스프라이트를 쓴다. 나머지는 전부 Figma가 그대로 쓰는 lucide 표준 아이콘이다 — Figma 쪽 디자인이 바뀔 수 있으니 매번 현재 파일 기준으로 재대조한다(이전 감사 결과를 그대로 신뢰하지 않는다).
