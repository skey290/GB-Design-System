# NotiDropdown

- 코드: `components/app/noti-dropdown/noti-dropdown.tsx` (`noti-dropdown.stories.tsx`, `noti-dropdown.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8163-93051) `Notification slot` node `8163:93051`

## Overview

GNB 알림벨(`MenuNotification`) 클릭 시 뜨는 드롭다운 패널. 헤더의 All/Unread 탭 + Settings 버튼, 그 아래 알림 리스트(`NotiItem` 재사용)로 구성된다. 항상 다크로 렌더링된다(GNB 계열 공통 패턴).

## When to use

- GNB 알림벨 트리거에 앵커된 `Popover`(Radix) 콘텐츠로. `components/app/gnb/gnb.tsx`가 실제 사용 예다.

## How to use

```tsx
<NotiDropdown
  items={notificationItems}
  selectedTab={tab}
  onSelectedTabChange={setTab}
  onSettingsClick={handleSettings}
/>
```

## Props

| Prop                  | 타입                              | 기본값    | 설명                                          |
| --------------------- | --------------------------------- | --------- | --------------------------------------------- |
| `items`               | `NotiDropdownItem[]`              | (필수)    | `{ id, label, unread? }[]`                     |
| `selectedTab`         | `"all" \| "unread"`                | `"all"`   | 완전 제어형                                     |
| `onSelectedTabChange` | `(tab: "all" \| "unread") => void` | -         | 탭 전환 시 호출                                |
| `onSettingsClick`     | `() => void`                      | -         | 헤더 설정 아이콘 클릭 시 호출                   |
| `className`           | `string`                          | -         | 루트에 병합                                     |

## Structure

- 헤더: `Tabs`(All/Unread, 각각 카운트 배지) + `Settings` 아이콘 버튼.
- 리스트: `<ul>` 안에 `<li>`로 감싼 `NotiItem` 목록(`components/app/noti-item`). 옵션이 6개 초과면 커스텀 스크롤바 노출(`Select`와 동일한 트랙/썸 방식).
- `unread` 아이템은 `NotiItem`의 dot으로 표시되고, "Unread" 탭에는 `unread=true`인 항목만 필터링된다.

## States and behaviors

- 배경은 `--gb-background-overlay`(fallback 라이트)로, 실제 렌더는 밝은 카드다 — 루트 `dark` 클래스는 하위 시맨틱 토큰 resolve용이지 배경색 자체를 어둡게 만들진 않는다.
