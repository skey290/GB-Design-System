# Tabs

- 코드: `components/ui/tabs/tabs.tsx` (`tabs.stories.tsx`, `tabs.test.tsx`, `index.ts`)
- Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3282-324) — node-id `3282:324` ("Tabs" 프레임, `Number` variant 1~8)

## Overview

`Tabs`는 `role="tablist"` 루트(`<div>`) 안에 `role="tab"` 버튼(`<button>`)들을 가로로 나열하는 컴포넌트다. `items` 배열(`TabItem[]`)과 `selectedIndex`(현재 선택된 인덱스), `onSelectedIndexChange` 콜백만으로 완전 제어(controlled)되며, 각 탭은 라벨 텍스트 옆에 선택적으로 카운트 `Badge`를 렌더링한다.

Figma 컴포넌트 설명(description) 필드 원문:

> A row of tabs that switches between sections of content, one visible at a time. Number sets how many tabs the row holds. Each tab can carry a count and can be disabled individually.

페이지 프레임 `76:10755` 안에 두 개의 컴포넌트셋이 있다:

- **`Part/Tab`** (node `3282:285`) — 탭 1개의 `State` variant: `Default` / `Hovered` / `Selected` / `disabled`. 코드의 개별 탭 버튼 스타일이 이 4개 상태와 1:1 대응한다. description: "The single tab used to build Tabs — one label with its optional count, and its own selected and disabled states. Not meant to be placed on its own."
- **`Tabs`** (node `3282:324`) — `Number` variant(`1`~`8`)로 탭 개수가 다른 조합을 보여준다. 모든 탭이 `Default` 상태로만 그려져 있고, 탭 개수에 따라 컨테이너 너비만 달라진다. `tabs.stories.tsx`의 `TabCountAndBadge` 스토리가 이 variant에 대응한다.

## When to use

- 한 영역 안에서 **여러 섹션을 번갈아 보여줄 때** — 한 번에 하나만 보이고, 어느 것이 열려 있는지를 탭 줄이 표시한다.
- 각 섹션에 **항목 수를 함께 노출해야 할 때** — `count`를 주면 라벨 옆에 `Badge`가 붙는다.
- 특정 섹션을 **일시적으로 못 고르게 해야 할 때** — `items[].disabled`로 탭 단위 비활성이 가능하다.

## When not to use

- **`Part/Tab`을 단독으로 쓰지 않는다.** Figma description이 명시한다 — 탭 하나는 `Tabs`를 구성하는 부품이고, 혼자 놓일 용도가 아니다.
- **전환할 섹션이 없을 때.** 루트에 `role="tablist"`, 각 버튼에 `role="tab"`/`aria-selected`가 붙으므로, 눌러도 바뀔 것이 없으면 스크린리더에 "탭"이라고 알리면서 실제로는 아무 일도 일어나지 않는 상태가 된다. 제목만 필요하면 제목 요소를 쓴다.

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

실제 조합 예시 (`components/app/noti-dropdown/noti-dropdown.tsx`):

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
  className="min-w-0 flex-1 border-b-[color:var(--gb-border-static-gray)] [&>button]:flex-1"
/>
```

## Structure

- 루트: `<div role="tablist">`, `flex flex-row` + 하단 보더(`border-b-[length:var(--gb-border-1)] border-b-[color:var(--gb-border-static-gray)]`). `className`으로 덮어쓰기 가능(`cn()`으로 병합, 뒤에 오므로 우선 적용).
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

| Figma `State` | 코드 조건                                         | 라벨 텍스트/타이포그래피                       | 하단 보더                 | 배지                                                                                   |
| ------------- | ------------------------------------------------- | ---------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------- |
| `Default`     | `selected === false` (hover 아님)                 | `var(--gb-text-subtle)`, `text-sm-medium`      | 투명                      | `variant="outline"` (있을 때만)                                                        |
| `Hovered`     | CSS `:hover` (별도 prop 아님, 미선택 탭에만 적용) | `var(--gb-text-emphasis)`, `text-sm-medium`    | 투명                      | `variant="outline"` — Figma에서도 Hovered의 배지 색은 Default와 동일                   |
| `Selected`    | `selected === true`                               | `var(--gb-text-default)`, `text-sm-semi-bold`  | `var(--gb-border-bolder)` | `variant="default"` (배경 `var(--gb-background-bold)`, 텍스트 `var(--gb-text-invert)`) |
| `disabled`    | `disabled === true`                               | `var(--gb-text-static-gray)`, `text-sm-medium` | 투명                      | 렌더링 안 됨(Figma도 `disabled` state에서 배지 자체가 없음)                            |

`Selected`와 `Hovered`는 Figma에서도 상호 배타적인 별도 state이며, 코드에서도 `selected` 분기에는 `hover:` 클래스가 없고 `!selected` 분기에만 `hover:text-[var(--gb-text-emphasis)]`가 붙어 동일하게 배타적으로 구현됨.

`Number`(탭 개수) variant는 별도의 색상/스타일 변경 없이 탭 개수(1~8)와 컨테이너 너비만 달라지는 레이아웃 variant다 — 코드에서는 `items` 배열 길이로 자연스럽게 대응되며 별도 prop이 없다.

## States and behaviors

- **선택(`aria-selected`)**: `selectedIndex === index`로 계산, `Selected` 스타일(semibold + 하단 보더) 적용.
- **hover**: 미선택 탭에서만 `hover:text-[var(--gb-text-emphasis)]` 적용. `transition-colors`로 색 전환에 트랜지션 포함.
- **focus-visible**: `focus-visible:[outline:var(--gb-border-2)_solid_var(--ring)]` + `focus-visible:[outline-offset:-3px]` + `focus-visible:rounded-[var(--gb-radius-scale-lg)]`. Figma `Part/Tab`의 4개 `State`에는 별도 "Focused" variant가 없음 — 코드에서 접근성을 위해 추가한 레이어(코드 주석: "focus-visible ring: outline-offset -3px는 토큰 스케일에 일치값이 없어 예외적으로 하드코딩 (Figma 스펙 확정값)"). `-3px`는 토큰이 아닌 하드코딩 값(아래 "`focus-visible`은 코드가 더한 접근성 레이어다" 참고).
- **disabled**: 네이티브 `disabled` 속성(클릭 차단, `disabled:pointer-events-none disabled:cursor-not-allowed`) + `disabled:text-[var(--gb-text-static-gray)]`. `count`가 있어도 배지를 렌더링하지 않음(Figma `disabled` state와 일치).
- 컨테이너(`role="tablist"`) 자체에는 hover/focus 상태가 없음 — 상태는 각 탭 버튼 단위로만 존재.

## 다른 범용 컴포넌트와의 조합 가이드

- **Badge** (`components/ui/badge/badge.tsx`): `count`가 숫자이고 `disabled`가 아닐 때만 렌더링. `variant={selected ? "default" : "outline"}`로 선택 상태와 배지 색을 연동 — Tabs 자체가 Badge의 소비처(badge.md의 조합 가이드에도 동일 사실 기재).
- **NotiDropdown** (`components/app/noti-dropdown/noti-dropdown.tsx`): "All"/"Unread" 두 탭 + 카운트 배지로 알림 리스트를 필터링. `className="min-w-0 flex-1 ... [&>button]:flex-1"`로 각 탭 버튼을 컨테이너 너비에 맞춰 균등하게 늘림(기본 `shrink-0` 레이아웃을 `[&>button]:flex-1`로 오버라이드).

소비처는 `className`으로 루트 `<div>`의 레이아웃(너비/보더 색)만 오버라이드하고, 탭 버튼 내부 스타일(타이포그래피, 배지 variant 전환 로직)은 건드리지 않는다.

## `focus-visible`은 코드가 더한 접근성 레이어다

Figma `Part/Tab`의 `State` 축에는 `Focused`가 없다. 키보드 사용자를 위해 코드가 추가한 것이고, `outline-offset: -3px`는 토큰 스케일에 일치값이 없어 리터럴로 둔다 — Figma에 대응 스펙이 없으므로 대조 대상이 아니다.

## ⚠️ 확인 필요

없음.
