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
| `onNotificationSettingsClick` | `() => void`                       | -      | 알림 드롭다운 톱니바퀴 클릭 시 호출 — 알림 닫힘+Setting 패널의 Notification 섹션 활성화와 함께 항상 호출됨 |
| `onSettingsClick`             | `() => void`                       | -      | Settings 메뉴 클릭 시 호출(Setting 패널 토글과 별개로 항상 함께 호출됨) |
| `workHistoryItems`            | `GnbHistoryItem[]`                 | `[]`   | Work History 드로어에 전달                            |
| `selfArchiveItems`            | `GnbHistoryItem[]`                 | `[]`   | Self Archive 드로어에 전달                            |
| `onSettingSectionSelect`      | `(section: GnbSettingSection) => void` | -  | Setting 패널 메뉴 6행 중 하나를 클릭하면 호출             |
| `settingSearchValue`          | `string`                            | -      | Setting 패널 검색창 제어값(`InputSearch`의 `value`로 위임) |
| `defaultSettingSearchValue`   | `string`                            | -      | Setting 패널 검색창 비제어 초기값                         |
| `onSettingSearchChange`       | `(value: string) => void`           | -      | Setting 패널 검색창 입력 변경 시 호출                      |

## Structure

- 접힌 상태(`expanded=false`): 토글/벨/설정/네비게이션 항목 전부 `MenuButton`의 `type="icon"`(= Figma 아이콘 레일의 범용 `Button` 인스턴스를 값으로 재현한 것 — 구조적으로는 `<button>` 중첩이 불가능해 컴포넌트 자체를 끼워넣지 못한다).
- 펼친 상태(`expanded=true`): 벨/설정/네비게이션 항목은 `MenuButton`의 `type="icon-with-text"`(Figma `Part/GNB`). 토글 버튼만 접힘/펼침 무관하게 `type="icon"` 고정.
- 로고는 `/public/images/logo.png`, 너비는 Figma 확정값 `250px`(펼침) / `48px`(접힘). 접혔을 때는 `opacity-0`으로 숨기고(레이아웃 폭은 유지 안 함 — 토글 버튼에 `shrink-0`을 줘 로고 때문에 찌그러지지 않게 한다), 너비 애니메이션은 루트의 `transition-[width]` 하나에 맡긴다(개별 항목은 `overflow-hidden`+라벨 opacity만 사용).
- 알림벨: 읽지 않음일 때 `Bell` 위에 4px 점(`--gb-background-warning-default`)을 겹친 합성 아이콘(`DotBellIcon`)을, 아니면 순수 `Bell`을 `MenuButton`의 `icon`으로 넘긴다. Figma의 `dot-bell-icon`은 fill로 평탄화된 에셋이라 다른 lucide 아이콘(전부 stroke 2px)과 두께가 달라, 합성 방식으로 대체해 두께를 통일했다. 알림 드롭다운은 이 벨 트리거에 앵커된 Radix `Popover`(`NotiDropdown`).
- GNB 계열(`MenuButton`/`NotiDropdown` 포함)은 Figma 실측상 항상 다크로 렌더링된다(`--background-subtlest` 등 시맨틱 토큰의 다크값과 스크린샷이 일치) — `Popover`/`Chatbox`와 동일하게 루트에 `.dark` 스코프 클래스를 적용한다.
- 토글/벨/설정처럼 라벨이 항상 고정 문자열인 버튼은 `className="w-full"`을 접힘/펼침과 무관하게 항상 줘야 한다 — 접혔을 때만 빼면 라벨 텍스트가 보이지 않아도 폭은 그대로 차지해 아이콘이 가운데 정렬로 밀려 화면 밖으로 사라진다.

## Work History / Self Archive 드로어

Figma `GNB` 컴포넌트셋 자체에 `Type=work history`(node `8163:93431`)/`Type=self archive`(node `8163:93776`) variant가 있다. `Notfication`(알림)과 달리 이 두 variant는 별도 컴포넌트를 인스턴싱하지 않고 범용 atom(Button/Badge/아이콘)만으로 GNB 안에 직접 그려져 있다 — 그래서 `NotiDropdown`처럼 독립 컴포넌트로 분리하지 않고 `gnb.tsx` 내부의 비공개 `GnbHistoryPanel`로 그대로 둔다. 패널은 GNB 본체와 나란한 flex 형제로 붙어(절대위치 오버레이 아님) 열리면 전체 폭이 함께 넓어진다. 레일과 패널 사이 간격은 Figma 실측상 0px(완전 플러시, 보더도 없음) — 배경색 차이(`--gb-background-subtlest` vs `--gb-background-subtler`)만으로 구분된다.

트리거는 GNB 패널 바깥 우측에 독립적으로 떠 있는 2연 세그먼트 `Toggle`(`components/ui/toggle`, history/archive 아이콘)이고, `gnb.tsx`가 `activeDrawer` state로 열기/전환/재클릭 닫기(셋 다 닫힌 상태로 시작, 누른 것만 열리고 같은 걸 다시 누르면 닫힘)를 직접 제어한다 — `Toggle`의 내장 `selectionMode`(single/multiple) 어느 쪽도 이 조합(상호배타 + 재클릭 해제)을 그대로 지원하지 않기 때문이다. Work History/Self Archive 패널이 열려도 `Toggle`은 `z-20`으로 항상 위에 떠 있어 전환/닫기가 계속 가능하다 — 단, Setting 패널이 열려있을 때는 Figma에 이 토글 자체가 없어 렌더링하지 않는다.

토글의 위치는 두 축을 서로 다른 CSS 속성으로 나눠 적용한다 — 레일 폭(`expanded`) 축은 `left: railWidth(48|250)+20px`로, 드로어 폭(`activeDrawer`) 축은 `transform: translateX(drawerWidth)`으로(닫힘 0, Work History/Self Archive 407 — Setting은 토글 자체를 렌더링하지 않으므로 해당 없음). `left`에는 레일 자신의 `transition-[width] duration-200`과 같은 `transition-[left] duration-200 ease-linear`를 줘서 레일이 접히고 펼쳐지는 동안 토글도 같은 속도로 같이 움직인다(레일이 다 접히기 전에 토글만 먼저 도착해버리는 어긋남 방지). `transform`에는 트랜지션을 주지 않아 드로어가 열리고 닫힐 때는 트랜지션 없이 바로 스냅한다(드로어 자체가 조건부 렌더링이라 즉시 나타나고 사라지기 때문 — 패널은 안 끝났는데 토글만 애니메이션되면 오히려 어색하다). 두 축을 하나의 숫자로 합쳐 `left` 하나에만 넣으면 이 두 가지 서로 다른 타이밍 요구를 동시에 만족시킬 수 없다.

## Setting 패널

Figma `GNB` 컴포넌트셋의 `Type=setting` variant(`Expand=false` 노드 `8163:93129` / `Expand=true` 노드 `8163:93253`). Work History/Self Archive와 달리 제목이나 닫기(X) 버튼이 없고, 레일 폭(`Expand`)과 무관하게 항상 **250px 고정 폭**이다(Work History/Self Archive가 항상 407px 고정인 것과 같은 성격). 내부는 위에서 아래로 검색창(`InputSearch` 재사용, 234×32로 축소) → 메뉴 6행(`MenuButton type="icon-with-text"`)이다. 트리거/상호배타/재클릭 닫기는 Work History/Self Archive와 완전히 같은 `activeDrawer`/`toggleDrawer` 메커니즘을 공유한다(Settings 버튼 클릭 시 `activeDrawer`가 `"setting"`으로 토글되고, `onSettingsClick`도 별개로 항상 함께 호출됨).

메뉴 6행은 `GnbSettingSection`(`notification`/`general`/`account`/`privacy`/`billing`/`usage`)과 1:1 대응하며, 아이콘은 각각 lucide `Bell`/`Settings`/`UserRound`/`Shield`/`CreditCard`/`BarChartBig`다. `Gnb`가 내부 상태(`activeSettingSection`)로 현재 선택된 섹션을 추적해 해당 행만 `status="active"`로 표시한다(메인 네비게이션의 `activeId`와 같은 패턴). 섹션 행 클릭 또는 아래 알림벨 단축 진입 시에만 활성화되고, Settings 버튼으로 새로 열 때는 초기화된다(특정 섹션을 미리 가리키지 않음). Setting 패널이 열려있는 동안은 메인 네비게이션의 현재 페이지 표시(`activeId` 기반 `active` 상태)가 꺼진다 — Setting도 페이지 전환과 동급이라 두 종류의 "현재 위치" 표시가 동시에 보이면 안 되기 때문이다.

**알림 드롭다운에서 Setting의 Notification 섹션으로 바로 이동**: `NotiDropdown`의 톱니바퀴 아이콘(`onSettingsClick`) 또는 리스트 안 알림 항목(`onItemClick`) 중 아무거나 누르면 알림 드롭다운이 닫히고, Setting 패널이 열리며, `Notification` 행이 자동으로 활성화된다 — 알림 설정으로 이동한다는 의미상 자연스러운 흐름이다. 이때도 `onSettingSectionSelect("notification")`과 기존 `onNotificationSettingsClick`이 둘 다 호출된다.

메뉴 목록은 왼쪽 세로선(`--gb-border-selected`) 보더박스 안에서 위에서부터 쌓인다. `Notification`(첫 행)에 `mt-[60px]`를 줘서 검색창 바로 아래가 아니라 한 칸 내려온 자리에서 시작하고, 그다음 `General`부터 `Usage`까지는 평범한 간격으로 바로 이어 붙는다 — 그 결과 `General`의 시작 Y가 레일 네비게이션 리스트(`Dashboard`가 시작하는 지점)와 정확히 일치한다. `60px`는 레일 쪽 헤더(로고/알림/설정/구분선)가 차지하는 고정 높이에 맞춘 값이고, 양쪽 리스트 모두 위에서부터 쌓이는 구조라 전체 높이가 늘어나도 이 정렬은 그대로 유지된다. 패널 배경은 Work History/Self Archive의 `--gb-background-subtler`와 달리 **`--gb-background-subtlest`**(레일과 동일한 토큰)다 — 실측 결과 둘이 다르다.

## Self Archive 선택 강조는 없다

Figma `Type=self archive`의 5개 샘플 행은 전부 완전히 동일한 모습이다(배경 없음) — 특정 항목을 강조 표시하는 선택 상태가 Figma에 존재하지 않으므로, `GnbHistoryItem`에도 그런 prop을 두지 않는다.

## 삭제는 확인창을 거친다

Self Archive 행의 삭제(Trash) 버튼은 `item.onDelete`를 바로 호출하지 않고, 먼저 범용 `Popover`(`components/ui/popover`, `type="warning"`)로 "삭제할까요?" 확인창을 띄운다. Figma에는 이 확인창 디자인이 없지만(삭제 아이콘만 있고 그 뒤 동작은 명시돼 있지 않음), 되돌릴 수 없는 삭제라 실수 방지 차원에서 둔 코드 쪽 판단이다. 확인(`Delete`)을 눌러야 실제로 `onDelete`가 호출된다.


## Icon mapping (실사용처 기준, `gnb.stories.tsx`/`app/compass/page.tsx`)

| 항목            | 아이콘                                  |
| --------------- | ---------------------------------------- |
| Dashboard       | lucide `Home`                            |
| Assets          | `/public/icons.svg`의 `asset-icon` 커스텀 스프라이트 |
| Compass         | lucide `Compass`                         |
| Contents Studio | lucide `Blocks`                          |
| Know Thyself    | lucide `UserRoundSearch`                 |

Assets만 Figma에 lucide로 없는 커스텀 글리프(사람+뷰파인더 브래킷)라 스프라이트를 쓴다. 나머지는 전부 Figma가 그대로 쓰는 lucide 표준 아이콘이다 — Figma 쪽 디자인이 바뀔 수 있으니 매번 현재 파일 기준으로 재대조한다(이전 감사 결과를 그대로 신뢰하지 않는다).
