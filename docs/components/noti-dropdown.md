# NotiDropdown

- 코드: `components/app/noti-dropdown/noti-dropdown.tsx` (`noti-dropdown.stories.tsx`, `noti-dropdown.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8163-93051) `Notification slot` node `8163:93051`

## Overview

GNB 알림벨(`MenuButton`) 클릭 시 뜨는 드롭다운 패널. 헤더의 All/Unread 탭 + Settings 버튼, 그 아래 알림 리스트(`NotiItem` 재사용)로 구성된다. 항상 다크로 렌더링된다(GNB 계열 공통 패턴).

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
| `onItemClick`         | `(id: string) => void`            | -         | 리스트 안 알림 항목 클릭 시 호출                |
| `className`           | `string`                          | -         | 루트에 병합                                     |

## Structure

- 헤더: `Tabs`(All/Unread, 각각 카운트 배지) + `Settings` 아이콘 버튼.
- 리스트: `<ul>` 안에 `<li>`로 감싼 `NotiItem` 목록(`components/app/noti-item`). **리스트는 항상 최대 6행 높이로 고정되고, 6개를 넘으면 무조건 스크롤이 생긴다**(`DropdownList`/`Select`와 동일한 트랙/썸 방식). 높이 제한은 Tailwind 임의값 클래스가 아니라 인라인 `style`로 적용한다 — `calc()`의 `+`/`-` 연산자는 앞뒤 공백이 없으면 전체 선언이 무효 처리되어 조용히 무시된다.
- `unread` 아이템은 `NotiItem`의 dot으로 표시되고, "Unread" 탭에는 `unread=true`인 항목만 필터링된다.
- `NotiItem`은 `<button>`이라 리스트 항목 자체도 클릭 가능하다 — 헤더 Settings 아이콘과 동일하게 알림 설정으로 이동하는 진입점으로 취급한다(`Gnb`에서 둘 다 같은 핸들러로 연결, Setting 패널의 Notification 섹션을 연다).

## States and behaviors

- 배경은 `--gb-background-overlay`(fallback 라이트)로, 실제 렌더는 밝은 카드다 — 루트 `dark` 클래스는 하위 시맨틱 토큰 resolve용이지 배경색 자체를 어둡게 만들진 않는다.
