# Tabs

- 코드: `components/ui/tabs/tabs.tsx` (`tabs.stories.tsx`, `tabs.test.tsx`, `index.ts`)
- Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3282-324) — node-id `3282:324` ("Tabs" 프레임, `Number` variant 1~8)

## Overview

`Tabs`는 `role="tablist"` 루트(`<div>`) 안에 `role="tab"` 버튼(`<button>`)들을 가로로 나열하는 컴포넌트다. `items` 배열(`TabItem[]`)과 `selectedIndex`(현재 선택된 인덱스), `onSelectedIndexChange` 콜백만으로 완전 제어(controlled)되며, 각 탭은 라벨 텍스트 옆에 선택적으로 카운트 `Badge`를 렌더링한다.

Figma 상위 프레임(node `76:10755`, "Tabs")의 `Component description` 텍스트 노드(`665:1908`)에 다음 설명이 그대로 있다:

> "A set of layered sections of content—known as tab panels—that are displayed one at a time."

같은 상위 프레임 안에 두 개의 하위 컴포넌트가 있다:

- **`Part/Tab`** (node `3282:285`) — 탭 1개의 `State` variant: `Default` / `Hovered` / `Selected` / `disabled`. 코드의 개별 탭 버튼 스타일이 이 4개 상태와 1:1 대응한다.
- **`Tabs`** (node `3282:324`, 이 문서가 링크하는 노드) — `Number` variant(`1`~`8`)로 탭 개수가 다른 조합을 보여주는 쇼케이스 프레임. 모든 탭이 `Default` 상태로만 그려져 있고, 탭 개수에 따라 컨테이너 너비만 달라진다. `tabs.stories.tsx`의 `TabCountAndBadge` 스토리가 이 variant에 대응한다(스토리 코드 주석에는 `"Nuber"`로 오타가 있으나 실제 Figma 프로퍼티명은 `Number`다 — 기능에는 영향 없는 주석 오타, 아래 확인 필요 참고).

이 두 컴포넌트(`Part/Tab`, `Tabs` 쇼케이스) 모두에는 별도의 description 필드가 없다(`get_metadata` 응답에 이름만 있고 설명 텍스트 없음) — description은 상위 `Tabs` 개요 프레임에만 있다.

## When to use

코드베이스 실사용처(`grep -rn "ui/tabs"` 기준, 현재 2곳)에서 관찰된 패턴:

- **다중 항목을 전환하는 실제 탭 전환**: `components/ui/noti-dropdown/noti-dropdown.tsx`에서 "All" / "Unread" 두 탭으로 알림 리스트 필터를 전환(각 탭에 카운트 배지 동반).
- **단일 항목의 "제목 바"로 전용**: `components/compass/ui/compass-detail-view/compass-detail-view.tsx`에서 `items`에 `{ label: resolvedTitle }` 딱 하나만 넣고 `selectedIndex={0}` 고정으로 사용 — 실제 탭 전환 기능 없이, `Selected` 상태의 semibold 타이포그래피 + 밑줄 보더 스타일만 섹션 타이틀 바처럼 재사용하는 패턴(아래 조합 가이드 참고).

## When not to use

⚠️ 확인 필요 — Figma description(위 Overview 인용문)은 "여러 콘텐츠 패널을 하나씩 보여주는 용도"라고만 설명할 뿐 "이런 경우엔 쓰지 말 것"을 명시하지 않음. 코드 사용처에도 금지 근거가 없음. 다만 `compass-detail-view.tsx` 사례처럼 탭이 1개뿐이고 전환 기능이 없는 "제목 바" 용도로 쓰는 것이 의도된 설계인지, 아니면 임시 방편인지는 코드 주석에 근거가 없어 불명확(아래 확인 필요 참고).

## How to use

`tabs.stories.tsx`에서 그대로 인용:

```tsx
// 기본 — 카운트 배지 포함
const items = [
  { label: "전체", count: 12 },
  { label: "진행중", count: 4 },
  { label: "완료" }, // count 없으면 배지 미렌더
];

<Tabs items={items} selectedIndex={0} />;

// 제어형 전환
function TabsDemo() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <Tabs
      items={items}
      selectedIndex={selectedIndex}
      onSelectedIndexChange={setSelectedIndex}
    />
  );
}

// disabled 탭 — 클릭 불가, count가 있어도 배지 미렌더 (Figma "PartTab" state=disabled)
<Tabs
  items={[
    { label: "전체", count: 12 },
    { label: "진행중", count: 4, disabled: true },
    { label: "완료" },
  ]}
  selectedIndex={0}
/>;
```

실제 조합 예시 (`components/ui/noti-dropdown/noti-dropdown.tsx`):

```tsx
<Tabs
  items={[
    { label: "All", count: items.length },
    { label: "Unread", count: unreadCount },
  ]}
  selectedIndex={selectedTab === "unread" ? 1 : 0}
  onSelectedIndexChange={(index) =>
    onSelectedTabChange?.(index === 1 ? "unread" : "all")
  }
  className="min-w-0 flex-1 border-b-[color:var(--border-static-gray)] [&>button]:flex-1"
/>
```

단일 탭 "제목 바" 용도 예시 (`components/compass/ui/compass-detail-view/compass-detail-view.tsx`):

```tsx
<Tabs
  items={[{ label: resolvedTitle }]}
  selectedIndex={0}
  className="w-full border-b-[var(--border-mute)]"
/>
```

## Structure

- 루트: `<div role="tablist">`, `flex flex-row` + 하단 보더(`border-b-[length:var(--border-1)] border-b-[color:var(--border-static-gray)]`). `className`으로 덮어쓰기 가능(`cn()`으로 병합, 뒤에 오므로 우선 적용).
- 각 탭: `<button type="button" role="tab" aria-selected={selected} disabled={item.disabled} onClick={...}>`
  - `<span>{item.label}</span>` — 라벨 텍스트
  - `typeof item.count === "number" && !item.disabled`일 때만 `<Badge variant={selected ? "default" : "outline"}>{item.count}</Badge>` 렌더링. `disabled`면 `count` 값과 무관하게 배지를 아예 렌더링하지 않음.
- `key`는 `` `${item.label}-${index}` `` 조합 — 별도 `id` prop이 `TabItem`에 없어 라벨+인덱스로 key를 생성.

## Props

`TabItem`:

| Prop       | 타입      | 필수   | 기본값 | 설명                                                                                          |
| ---------- | --------- | ------ | ------ | --------------------------------------------------------------------------------------------- |
| `label`    | `string`  | 예     | —      | 탭에 표시할 라벨 텍스트                                                                       |
| `count`    | `number`  | 아니오 | —      | 라벨 옆 카운트. 없으면 배지를 렌더링하지 않음                                                 |
| `disabled` | `boolean` | 아니오 | —      | true면 클릭 불가하며 카운트가 있어도 배지를 렌더링하지 않음(Figma `PartTab` `state=disabled`) |

`TabsProps` = `Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">` + 아래:

| Prop                    | 타입                                                     | 필수   | 기본값 | 설명                                      |
| ----------------------- | -------------------------------------------------------- | ------ | ------ | ----------------------------------------- |
| `items`                 | `TabItem[]`                                              | 예     | —      | 탭 목록                                   |
| `selectedIndex`         | `number`                                                 | 예     | —      | 현재 선택된 탭의 인덱스                   |
| `onSelectedIndexChange` | `(index: number) => void`                                | 아니오 | —      | 탭 선택이 변경될 때 호출                  |
| `className`             | `string`                                                 | 아니오 | —      | 루트 `<div>`에 `cn()`으로 병합            |
| 그 외                   | `React.HTMLAttributes<HTMLDivElement>` (`onChange` 제외) | 아니오 | —      | `data-*` 등 나머지 div 속성 그대로 spread |

## Variants

Figma `Part/Tab`(node `3282:285`)의 `State` variant 4종과 코드 대응:

| Figma `State` | 코드 조건                                         | 라벨 텍스트/타이포그래피                    | 하단 보더              | 배지                                                                             |
| ------------- | ------------------------------------------------- | ------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------- |
| `Default`     | `selected === false` (hover 아님)                 | `var(--text-subtle)`, `text-sm-medium`      | 투명                   | `variant="outline"` (있을 때만)                                                  |
| `Hovered`     | CSS `:hover` (별도 prop 아님, 미선택 탭에만 적용) | `var(--text-emphasis)`, `text-sm-medium`    | 투명                   | `variant="outline"` — Figma에서도 Hovered의 배지 색은 Default와 동일             |
| `Selected`    | `selected === true`                               | `var(--text-default)`, `text-sm-semi-bold`  | `var(--border-bolder)` | `variant="default"` (배경 `var(--background-bold)`, 텍스트 `var(--text-invert)`) |
| `disabled`    | `disabled === true`                               | `var(--text-static-gray)`, `text-sm-medium` | 투명                   | 렌더링 안 됨(Figma도 `disabled` state에서 배지 자체가 없음)                      |

`Selected`와 `Hovered`는 Figma에서도 상호 배타적인 별도 state이며, 코드에서도 `selected` 분기에는 `hover:` 클래스가 없고 `!selected` 분기에만 `hover:text-[var(--text-emphasis)]`가 붙어 동일하게 배타적으로 구현됨.

`Number`(탭 개수) variant는 별도의 색상/스타일 변경 없이 탭 개수(1~8)와 컨테이너 너비만 달라지는 레이아웃 variant다 — 코드에서는 `items` 배열 길이로 자연스럽게 대응되며 별도 prop이 없다.

## States and behaviors

- **선택(`aria-selected`)**: `selectedIndex === index`로 계산, `Selected` 스타일(semibold + 하단 보더) 적용.
- **hover**: 미선택 탭에서만 `hover:text-[var(--text-emphasis)]` 적용. `transition-colors`로 색 전환에 트랜지션 포함.
- **focus-visible**: `focus-visible:[outline:var(--border-2)_solid_var(--ring)]` + `focus-visible:[outline-offset:-3px]` + `focus-visible:rounded-[var(--radius-scale-lg)]`. Figma `Part/Tab`의 4개 `State`에는 별도 "Focused" variant가 없음 — 코드에서 접근성을 위해 추가한 레이어(코드 주석: "focus-visible ring: outline-offset -3px는 토큰 스케일에 일치값이 없어 예외적으로 하드코딩 (Figma 스펙 확정값)"). `-3px`는 토큰이 아닌 하드코딩 값(아래 확인 필요 참고).
- **disabled**: 네이티브 `disabled` 속성(클릭 차단, `disabled:pointer-events-none disabled:cursor-not-allowed`) + `disabled:text-[var(--text-static-gray)]`. `count`가 있어도 배지를 렌더링하지 않음(Figma `disabled` state와 일치).
- 컨테이너(`role="tablist"`) 자체에는 hover/focus 상태가 없음 — 상태는 각 탭 버튼 단위로만 존재.

## 다른 범용 컴포넌트와의 조합 가이드

실제 코드 사용처(`grep -rln "ui/tabs" app/ components/` 기준, 현재 2곳) — `Badge`를 내부적으로 재사용:

- **Badge** (`components/ui/badge/badge.tsx`): `count`가 숫자이고 `disabled`가 아닐 때만 렌더링. `variant={selected ? "default" : "outline"}`로 선택 상태와 배지 색을 연동 — Tabs 자체가 Badge의 소비처(badge.md의 조합 가이드에도 동일 사실 기재).
- **NotiDropdown** (`components/ui/noti-dropdown/noti-dropdown.tsx`): 코드 주석에 "Tabs/Badge를 그대로 재사용"이라고 명시돼 있고, 실제로 `import { Tabs } from "@/components/ui/tabs"`로 확인됨. "All"/"Unread" 두 탭 + 카운트 배지로 알림 리스트를 필터링. `className="min-w-0 flex-1 ... [&>button]:flex-1"`로 각 탭 버튼을 컨테이너 너비에 맞춰 균등하게 늘림(기본 `shrink-0` 레이아웃을 `[&>button]:flex-1`로 오버라이드).
- **CompassDetailView** (`components/compass/ui/compass-detail-view/compass-detail-view.tsx`): 탭 전환 기능 없이 `items`에 단일 항목만 넣고 `selectedIndex={0}`으로 고정 — 제목(`resolvedTitle`)을 `Selected` 상태의 semibold 텍스트 + 밑줄 보더 스타일로 보여주는 "섹션 타이틀 바" 용도로 재해석해 사용. `className="w-full border-b-[var(--border-mute)]"`로 기본 `border-static-gray` 대신 더 옅은 `border-mute` 토큰으로 하단 보더 색을 교체.

공통 패턴: 두 사용처 모두 `className`으로 루트 `<div>`의 레이아웃(너비/보더 색)만 오버라이드하고, 탭 버튼 내부 스타일(타이포그래피, 배지 variant 전환 로직)은 건드리지 않는다.

## ⚠️ 확인 필요

- **`focus-visible` `outline-offset: -3px` 하드코딩**: 코드 주석은 "토큰 스케일에 일치값이 없어 예외적으로 하드코딩(Figma 스펙 확정값)"이라고 밝히고 있으나, Figma `Part/Tab`(node `3282:285`)의 `State` variant 자체에는 `Focused` 상태가 없어 이 문서 작성자가 별도 Figma 노드로 `-3px`의 출처를 직접 재확인하지는 못함. 토큰화 가능 여부를 디자이너와 재확인 권장.
- **`Tabs`가 단일 탭 "제목 바" 용도로 쓰이는 것이 의도된 설계인지**: `compass-detail-view.tsx`는 탭 전환 기능 없이 `Tabs`를 재사용해 섹션 타이틀 바처럼 쓴다. Figma description("여러 콘텐츠 패널을 하나씩 보여주는 용도")과는 결이 다른 사용이라, 이것이 의도된 패턴 확장인지 별도 컴포넌트가 필요한 상황을 임시로 땜빵한 것인지 코드 주석에 근거가 없음.
- **스토리 주석의 `"Nuber"` 오타**: `tabs.stories.tsx`의 `TabCountAndBadge` 스토리 주석이 Figma `Number` variant를 `"Nuber"`로 표기하고 있음(기능 영향 없는 주석/설명 오타로 추정 — 코드 로직 자체는 정상 동작).
- **"When not to use" 근거 없음**: Figma description과 코드 어디에도 "이런 경우엔 Tabs를 쓰지 말 것"이 명시돼 있지 않음.
