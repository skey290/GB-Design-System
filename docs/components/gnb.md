# Gnb

- 코드: `components/app/gnb/gnb.tsx` (`gnb.stories.tsx`, `gnb.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8163-93080) `GNB` node `8163:93080` (Type×Expand×Notification 8 variant)

## Overview

메인 사이드바. Expand/Notification 두 축을 "`expanded` boolean + `activeId`/`disabledIds`"로 축약했다. 토글/벨/설정/네비게이션 항목 전부 `MenuButton` 하나로 조합한다 — Figma에서도 이 전부가 같은 패턴(접힘: 범용 `Button` 인스턴스, 펼침: `Part/GNB` 인스턴스)을 따르는 동일한 종류의 행이고, 벨만 별도 컴포넌트가 아니다. 다만 사이드바 토글 버튼 자체는 접힘/펼침과 무관하게 항상 `Button` 인스턴스다(라벨이 없는 고정 아이콘 버튼이라 Part/GNB 대상이 아님).

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
| `workHistoryItems`            | `GnbHistoryItem[]`                 | `[]`   | Work History 드로어에 전달                            |
| `selfArchiveItems`            | `GnbHistoryItem[]`                 | `[]`   | Self Archive 드로어에 전달                            |

## Structure

- 접힌 상태(`expanded=false`): 토글/벨/설정/네비게이션 항목 전부 `MenuButton`의 `type="icon"`(= Figma 아이콘 레일의 범용 `Button` 인스턴스를 값으로 재현한 것 — 구조적으로는 `<button>` 중첩이 불가능해 컴포넌트 자체를 끼워넣지 못한다).
- 펼친 상태(`expanded=true`): 벨/설정/네비게이션 항목은 `MenuButton`의 `type="icon-with-text"`(Figma `Part/GNB`). 토글 버튼만 접힘/펼침 무관하게 `type="icon"` 고정.
- 로고는 `/public/images/logo.png`, 너비는 Figma 확정값 `250px`(펼침) / `48px`(접힘). 접혔을 때는 `opacity-0`으로 숨기고(레이아웃 폭은 유지 안 함 — 토글 버튼에 `shrink-0`을 줘 로고 때문에 찌그러지지 않게 한다), 너비 애니메이션은 루트의 `transition-[width]` 하나에 맡긴다(개별 항목은 `overflow-hidden`+라벨 opacity만 사용, 과거의 `grid-template-columns` 트릭은 제거했다).
- 알림벨: `MenuButton`에 읽지 않음 여부에 따라 `icon`만 `dot-bell-icon`(벨+점 단일 에셋) 또는 순수 `Bell`로 바꿔 넘긴다. 알림 드롭다운은 이 벨 트리거에 앵커된 Radix `Popover`(`NotiDropdown`).
- 토글/벨/설정처럼 라벨이 항상 고정 문자열인 버튼은 `className="w-full"`을 접힘/펼침과 무관하게 항상 줘야 한다 — 접혔을 때만 빼면 라벨 텍스트가 보이지 않아도 폭은 그대로 차지해 아이콘이 가운데 정렬로 밀려 화면 밖으로 사라진다.

## Work History / Self Archive 드로어

Figma `GNB` 컴포넌트셋 자체에 `Type=work history`(node `8163:93431`)/`Type=self archive`(node `8163:93776`) variant가 있다. `Notfication`(알림)과 달리 이 두 variant는 별도 컴포넌트를 인스턴싱하지 않고 범용 atom(Button/Badge/아이콘)만으로 GNB 안에 직접 그려져 있다 — 그래서 `NotiDropdown`처럼 독립 컴포넌트로 분리하지 않고 `gnb.tsx` 내부의 비공개 `GnbHistoryPanel`로 그대로 둔다. 패널은 GNB 본체와 나란한 flex 형제로 붙어(절대위치 오버레이 아님) 열리면 전체 폭이 함께 넓어진다. 레일과 패널 사이 간격은 Figma 실측상 0px(완전 플러시, 보더도 없음) — 배경색 차이(`--gb-background-subtlest` vs `--gb-background-subtler`)만으로 구분된다.

트리거는 GNB 패널 바깥 우측에 독립적으로 떠 있는 2연 세그먼트 `Toggle`(`components/ui/toggle`, history/archive 아이콘)이고, `gnb.tsx`가 `activeDrawer` state로 열기/전환/재클릭 닫기(셋 다 닫힌 상태로 시작, 누른 것만 열리고 같은 걸 다시 누르면 닫힘)를 직접 제어한다 — `Toggle`의 내장 `selectionMode`(single/multiple) 어느 쪽도 이 조합(상호배타 + 재클릭 해제)을 그대로 지원하지 않기 때문이다. 패널이 열려도 `Toggle`은 `z-20`으로 항상 위에 떠 있어 전환/닫기가 계속 가능하다.

토글의 위치는 두 축을 서로 다른 CSS 속성으로 나눠 적용한다 — 레일 폭(`expanded`) 축은 `left: railWidth(48|250)+20px`로, 드로어 폭(`activeDrawer`) 축은 `transform: translateX(열림 ? 407 : 0)`으로. `left`에는 레일 자신의 `transition-[width] duration-200`과 같은 `transition-[left] duration-200 ease-linear`를 줘서 레일이 접히고 펼쳐지는 동안 토글도 같은 속도로 같이 움직인다(레일이 다 접히기 전에 토글만 먼저 도착해버리는 어긋남 방지). `transform`에는 트랜지션을 주지 않아 드로어가 열리고 닫힐 때는 트랜지션 없이 바로 스냅한다(드로어 자체가 조건부 렌더링이라 즉시 나타나고 사라지기 때문 — 패널은 안 끝났는데 토글만 애니메이션되면 오히려 어색하다). 두 축을 하나의 숫자로 합쳐 `left` 하나에만 넣으면 이 두 가지 서로 다른 타이밍 요구를 동시에 만족시킬 수 없다.

## Self Archive 선택 강조는 없다

과거 코드에 `GnbHistoryItem.selected`(선택된 항목 회색 배경 강조)가 있었으나, Figma `Type=self archive`를 재확인한 결과 5개 샘플 행이 전부 완전히 동일한 모습(배경 없음)이었다 — 선택 강조 자체가 Figma에 존재하지 않는다. 그래서 `selected` prop을 완전히 제거했다.

## 삭제는 확인창을 거친다

Self Archive 행의 삭제(Trash) 버튼은 `item.onDelete`를 바로 호출하지 않고, 먼저 범용 `Popover`(`components/ui/popover`, `type="warning"`)로 "삭제할까요?" 확인창을 띄운다. Figma에는 이 확인창 디자인이 없지만(삭제 아이콘만 있고 그 뒤 동작은 명시돼 있지 않음), 되돌릴 수 없는 삭제라 실수 방지 차원에서 둔 코드 쪽 판단이다. 확인(`Delete`)을 눌러야 실제로 `onDelete`가 호출된다.


## Icon mapping (실사용처 기준, `gnb.stories.tsx`/`app/compass/page.tsx`)

| 항목            | 아이콘                                  |
| --------------- | ---------------------------------------- |
| Dashboard       | lucide `Home`                            |
| Assets          | `/public/icons.svg`의 `asset-icon` 커스텀 스프라이트 |
| Compass         | lucide `Compass`                         |
| Contents Studio | lucide `Blocks`                          |
| Know Thyself    | lucide `UserSearch`                      |

Assets만 Figma에 lucide로 없는 커스텀 글리프(사람+뷰파인더 브래킷)라 스프라이트를 쓴다. 나머지는 전부 Figma가 그대로 쓰는 lucide 표준 아이콘이다 — Figma 쪽 디자인이 바뀔 수 있으니 매번 현재 파일 기준으로 재대조한다(이전 감사 결과를 그대로 신뢰하지 않는다).
