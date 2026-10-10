# Toggle

- 코드: `components/ui/toggle/toggle.tsx` (`toggle.stories.tsx`, `toggle.test.tsx`, `index.ts`)
- Figma: [📌 GB_Design-System (Atom)](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7214-444) — node-id `7214:444` ("Toggle" 컴포넌트셋, 20 variant) / `7214:437` ("Part/Toggle", 6 variant)

## Overview

`Toggle`은 아이콘 눌림 버튼 여러 개를 하나의 세그먼트 그룹으로 묶는 컴포넌트다(`role="group"`). 각 버튼은 `role`은 없는 네이티브 `<button>`이지만 `aria-pressed`로 눌림 상태를 표현하며, `items` 배열(`ToggleItem[]`)로 개수를 임의로 지정한다.

코드 상단 주석(`toggle.tsx:6`)에 명시된 대로, **on/off 하나만 표현하는 `Switch`(`components/ui/switch/switch.tsx`)와는 다른 컴포넌트**다. `Switch`는 `role="switch"` 단일 트랙+썸 슬라이더로 boolean 하나를 전환하고, `Toggle`은 `role="group"` 안에 여러 개의 독립적인 `aria-pressed` 버튼을 나란히 배치하는 세그먼트/툴바형 컨트롤이다. 둘은 이름만 비슷할 뿐 구조와 용도가 겹치지 않는다.

Figma 컴포넌트셋에는 설명문이 작성되어 있다:

> "A segmented group of buttons, laid out horizontally, vertically, or as a grid, where each button can be pressed on or off independently. Type sets what each button shows — an icon, a label, or both. Distinct from Switch, which is a single on/off slider. **Hover, press, and selected all share the same active appearance.**"

마지막 문장이 이 컴포넌트의 상태 설계를 결정한다 — `Status` variant가 `default`/`disabled` 둘뿐인 이유이고, **hover에도 눌림과 동일한 외형을 적용해야 한다는 근거**다(추정이 아니라 Figma에 문서화된 내용).

Figma 축은 4개이고 조합이 희소하다(`Toggle` 20 variant):

| `Type`(내용)  | `Style`(배치) | `Number` | 비고                                            |
| ------------- | ------------- | -------- | ----------------------------------------------- |
| `icon`        | `horizontal`  | 1~5      | 보더 박스 + 구분선                              |
| `icon`        | `grid`        | 4        | 2×2 한 종류만                                   |
| `text`        | `horizontal`  | 2        | 알약(세그먼트) 트랙 — AM/PM 형태                |
| `text + icon` | `horizontal`  | 3        | 알약 토글(2) + **별개의 `Button`**(1) 조합      |
| `text + icon` | `vertical`    | 3, 4     | 아이콘 칩 세로 스택 + 박스 **바깥**의 보조 라벨 |

⚠️ **`Type=text + icon`은 `Style`에 따라 의미가 완전히 다르다** — `vertical`에서는 "아이콘 + 외부 라벨"이고, `horizontal`에서는 "텍스트 토글 + 옆에 붙은 아이콘 Button"이다. 축이 직교하지 않는다.

코드는 이 4축을 3개 prop으로 매핑한다:

| Figma                             | 코드                                    |
| --------------------------------- | --------------------------------------- |
| `Type=icon`                       | `type="icon"`                           |
| `Type=text`                       | `type="text"`                           |
| `Type=text + icon` × `vertical`   | `type="icon"` + `item.label`            |
| `Type=text + icon` × `horizontal` | `type="text"` + `trailingAction`        |
| `Style`                           | `orientation`                           |
| `Number`                          | `items.length` (런타임 제한 없음)       |
| `Status`                          | `disabled`(그룹) / `item.pressed`(항목) |

`Part/Toggle`(`7214:437`)의 `Status=active`는 항목 단위 상태(`item.pressed`)이고, `Toggle` 컨테이너의 `Status=disabled`는 그룹 단위 상태(`disabled`)다 — 축 레벨이 다르다.

## When to use

코드/스토리/실사용처에서 관찰된 패턴:

- 여러 아이콘 옵션 중 하나(또는 여러 개)를 눌러서 켜고 끄는 세그먼트형 툴바가 필요할 때. 가로 한 줄(`horizontal`), 세로 한 줄(`vertical`, 아이콘 옆에 보조 라벨 표시 가능), 2열 그리드(`grid`) 세 가지 배치를 지원.
- 실사용 예: `components/compass/ui/compass-analysis-menu/compass-analysis-menu.tsx` — GNB 근처에 떠 있는 Analysis 서브메뉴를 `orientation="vertical"` `Toggle` 위에 라디오처럼(단일 선택) 어댑터를 씌워 구현.
- 컴포넌트 자체는 다중 선택(각 아이템이 독립적인 `pressed` boolean)을 전제로 하며, 단일 선택(라디오처럼 하나만 켜지게)이 필요하면 소비 컴포넌트 쪽에서 `pressed`/`onPressedChange`를 직접 조율해야 한다(`CompassAnalysisMenu`, `toggle.stories.tsx`의 `ControlledToggleDemo`가 이 패턴을 보여줌).

## When not to use

- **boolean 하나만 켜고 끄는 경우** → Figma description이 명시한다. Toggle이 아니라 [Switch](./switch.md)를 쓴다. Toggle은 여러 버튼을 묶는 세그먼트 그룹이다.

## How to use

`toggle.stories.tsx`에서 그대로 인용:

```tsx
// 가로 2개 (Figma Type=Horizontal, Number=2)
<Toggle
  orientation="horizontal"
  items={[
    { icon: <BookmarkIcon />, "aria-label": "북마크 1" },
    { icon: <BookmarkIcon />, "aria-label": "북마크 2" },
  ]}
/>

// 세로 4개 + 보조 라벨 (Figma Type=Vertical, Number=4)
<Toggle
  orientation="vertical"
  items={[
    { icon: <BookmarkIcon />, "aria-label": "북마크 1", label: "Growth Potential" },
    { icon: <BookmarkIcon />, "aria-label": "북마크 2", label: "Reach" },
    { icon: <BookmarkIcon />, "aria-label": "북마크 3", label: "Engagement" },
    { icon: <BookmarkIcon />, "aria-label": "북마크 4", label: "Ranking" },
  ]}
/>

// 2x2 그리드 (Figma Type=icon, Style=grid, Number=4)
<Toggle orientation="grid" items={fourItems} />

// 알약 세그먼트 (Figma Type=text, Number=2) — AM/PM처럼 항상 하나만 선택
<Toggle
  type="text"
  selectionMode="single"
  items={[
    { text: "AM", pressed: true, onPressedChange: () => setPeriod("AM") },
    { text: "PM", onPressedChange: () => setPeriod("PM") },
  ]}
/>

// 알약 + 옆에 붙은 아이콘 Button (Figma Type="text + icon", Style=horizontal, Number=3)
<Toggle
  type="text"
  items={amPmItems}
  trailingAction={{ icon: "calendar-icon", "aria-label": "날짜 선택", onClick: openCalendar }}
/>

// 그룹 전체 비활성화
<Toggle orientation="horizontal" items={threeItems} disabled />
```

라디오처럼 하나만 선택되게 하려면 `selectionMode="single"`을 주면 된다 — ARIA 역할(`radiogroup`/`radio`)과 "이미 선택된 항목 재클릭 무시"를 컴포넌트가 처리한다. 부모는 선택된 값을 state로 들고 각 아이템의 `pressed`만 매핑하면 된다(`compass-toolbar.tsx`, `compass-analysis-menu.tsx` 참고).

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `toggle.tsx` / `toggle.stories.tsx` / `toggle.test.tsx` / `index.ts` (named export `Toggle`, `ToggleProps`, `ToggleItem`).

내부 DOM 구조 (orientation별로 분기):

```
<div role="group">                       컨테이너 (border/radius/shadow)
  horizontal: flex-row, overflow-clip
    <button aria-pressed>...</button>    아이템 사이에 세로 divider(1px, --border-default)
  vertical: flex-col, w-fit
    <div className="relative">           행마다 wrapper (버튼 폭만으로 너비 결정)
      <button aria-pressed>...</button>
      <span data-slot="toggle-label">    label이 있을 때만, absolute left-full로 버튼 바깥에 배치
    </div>                               행 사이 가로 divider(border-b)
  grid: flex-col, overflow-clip
    <div className="flex-row">           2개씩 묶은 행
      <button aria-pressed>...</button>  아이템 사이 세로 divider, 행 사이 가로 divider
```

- 아이콘은 `<span data-slot="toggle-icon" aria-hidden="true">` 안에 `size-[calc(var(--scale-16)*1px)]`로 고정.
- divider는 `<span data-slot="toggle-divider" aria-hidden="true">`, 색은 `--border-default`.
- vertical의 라벨(`<span data-slot="toggle-label">`)은 `position: absolute; left-full`로 버튼 박스 바깥에 배치된다 — 코드 주석(`toggle.tsx:177-189`)에 따르면 Figma 원본에서 보더 박스 너비가 라벨 길이와 무관하게 아이콘 칩(34px) 고정이라, 이를 그대로 재현하기 위한 의도적 구조다. 같은 주석에 `w-fit`이 필수인 이유(부모가 `align-items: stretch` flex-col일 때 컨테이너 폭이 형제 요소에 맞춰 늘어나 라벨 위치가 밀리는 버그)도 기록돼 있다.
- vertical 첫/마지막 행에는 컨테이너 라운딩(`--radius-scale-lg`)과 맞춘 라운딩이 버튼(`ToggleButton`) 배경 자체에 직접 적용된다 — 코드 주석은 이것이 Figma 실측(node `7214:453` Vertical/4/Default, `7214:490` Vertical/4/Disabled) 기반이라고 명시.

## Props

### `ToggleProps`

| Prop             | 타입                                                     | 필수   | 기본값         | 설명                                                                                |
| ---------------- | -------------------------------------------------------- | ------ | -------------- | ----------------------------------------------------------------------------------- |
| `items`          | `ToggleItem[]`                                           | 예     | —              | 세그먼트 그룹에 표시할 아이템 목록                                                  |
| `type`           | `"icon" \| "text"`                                       | 아니오 | `"icon"`       | 아이템 내용 종류. `icon`은 보더 박스 + 구분선, `text`는 트랙 배경 위 알약(세그먼트) |
| `orientation`    | `"horizontal" \| "vertical" \| "grid"`                   | 아니오 | `"horizontal"` | 배치 방향 (Figma `Style`). `type="text"`는 Figma에 `horizontal`만 정의됨            |
| `trailingAction` | `{ icon: IconId; "aria-label": string; onClick? }`       | 아니오 | —              | 알약 오른쪽에 떨어져 붙는 아이콘 `Button` (Figma `Type="text + icon"` horizontal)   |
| `selectionMode`  | `"multiple" \| "single"`                                 | 아니오 | `"multiple"`   | **Figma에 없는 접근성 prop** — 시각적 결과는 동일. 아래 설명 참고                   |
| `disabled`       | `boolean`                                                | 아니오 | `false`        | 그룹 전체 비활성화. **개별 아이템 단위 비활성화는 지원하지 않음**                   |
| ...props         | `Omit<React.HTMLAttributes<HTMLDivElement>, "children">` | 아니오 | —              | 루트 `<div role="group">`에 그대로 forward (`className`, `data-*` 등)               |

### `selectionMode`

Figma에는 없는 **접근성 전용 prop**이다(CLAUDE.md의 "구조적/접근성 prop은 Figma 유무와 무관하게 적용" 규칙에 따름). 시각적 결과는 두 모드가 완전히 동일하고 ARIA 역할만 달라진다.

| 모드                | 컨테이너            | 항목                            | 이미 선택된 항목 재클릭 |
| ------------------- | ------------------- | ------------------------------- | ----------------------- |
| `multiple` (기본값) | `role="group"`      | `aria-pressed`                  | 해제됨                  |
| `single`            | `role="radiogroup"` | `role="radio"` + `aria-checked` | 무시(해제되지 않음)     |

AM/PM이나 Home/Analysis처럼 **항상 하나만 선택되는 세그먼트 컨트롤**에는 `single`을 쓴다 — Figma의 "each button can be pressed on or off independently" 설명은 아이콘 툴바 쪽 기준이고, 알약형은 실제로 상호배타적으로 쓰인다.

### `ToggleItem`

아이콘 아이템과 텍스트 아이템의 **판별 유니온**이다 — `icon`과 `text`를 동시에 넘길 수 없다.

공통 prop:

| Prop              | 타입                         | 필수   | 설명                                                                      |
| ----------------- | ---------------------------- | ------ | ------------------------------------------------------------------------- |
| `pressed`         | `boolean`                    | 아니오 | 눌림 상태 (Figma `Part/Toggle Status=active`). 기본 `false`               |
| `onPressedChange` | `(pressed: boolean) => void` | 아니오 | 클릭 시 반전된 값과 함께 호출. `selectionMode="single"`에서는 항상 `true` |
| `label`           | `string`                     | 아니오 | `orientation="vertical"`일 때만 버튼 우측 **바깥**에 표시되는 보조 라벨   |

`ToggleIconItem`:

| Prop           | 타입              | 필수 | 설명                                    |
| -------------- | ----------------- | ---- | --------------------------------------- |
| `icon`         | `React.ReactNode` | 예   | 버튼 안에 렌더링할 아이콘 (16×16 슬롯)  |
| `"aria-label"` | `string`          | 예   | 아이콘만 있는 버튼이라 접근성 라벨 필수 |

`ToggleTextItem`:

| Prop           | 타입     | 필수   | 설명                               |
| -------------- | -------- | ------ | ---------------------------------- |
| `text`         | `string` | 예     | 버튼 안에 렌더링할 텍스트          |
| `"aria-label"` | `string` | 아니오 | 생략하면 `text`가 접근성 이름이 됨 |

## Variants

### Type (배치 방향)

| orientation           | 컨테이너 레이아웃                           | divider                                     | Figma에 정의된 Number                      |
| --------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------ |
| `horizontal` (기본값) | `flex-row overflow-clip`                    | 아이템 사이 세로선(1px, `--border-default`) | 1, 2, 3, 4, 5                              |
| `vertical`            | `flex-col w-fit`                            | 행 사이 가로선(`border-b`)                  | 3, 4 (라벨 항상 동반, Figma 스크린샷 기준) |
| `grid`                | `flex-col overflow-clip`, 2개씩 행으로 그룹 | 아이템 사이 세로선 + 행 사이 가로선         | 4 (2×2 한 종류만)                          |

코드는 세 orientation 모두에서 `items.length`에 제한을 두지 않는다. 특히 `grid`는 `items.slice(i, i+2)`로 무조건 2개씩 끊어 행을 만드는데, Figma에는 `Number=4`(정확히 2×2로 나눠떨어지는 경우) 예시만 있어 3개·5개처럼 2로 나눠떨어지지 않는 그리드가 Figma상 어떻게 보여야 하는지는 확인할 수 없었다.

### Status (상태)

`type="icon"` 아이템:

| status                         | 배경                          | 아이콘                   |
| ------------------------------ | ----------------------------- | ------------------------ |
| 기본(unpressed, enabled)       | `--gb-background-default`     | `--gb-icon-default`      |
| **hover** (unpressed, enabled) | `--gb-background-mute-subtle` | `--gb-icon-static-white` |
| `pressed`                      | `--gb-background-mute-subtle` | `--gb-icon-static-white` |
| `disabled`                     | `--gb-background-disabled`    | `--gb-text-subtler`      |

`type="text"` 아이템:

| status                         | 배경                   | 텍스트                   |
| ------------------------------ | ---------------------- | ------------------------ |
| 기본(unpressed, enabled)       | 투명                   | `--gb-text-default`      |
| **hover** (unpressed, enabled) | `--gb-background-mute` | `--gb-text-static-white` |
| `pressed`                      | `--gb-background-mute` | `--gb-text-static-white` |
| `disabled`                     | 투명                   | `--gb-text-static-gray`  |

⚠️ **아이콘 active 배경(`background/mute-subtle` #828282)과 텍스트 active 배경(`background/mute` #737373)이 Figma에서 서로 다른 변수·다른 값이다.** 통일되어 있지 않다.

hover는 `enabled:hover:`로 선언되어 **disabled 버튼에는 적용되지 않는다**(disabled는 hover/select에 상태 변화가 없어야 한다는 프로젝트 규칙과 일치).

`pressed`와 `disabled`는 cva의 독립된 두 variant 축이라(compound variant 없음) 동시에 `true`면 `variants` 객체 선언 순서(`pressed` → `disabled`) 때문에 `disabled` 클래스가 뒤에 오고, `cn()`의 tailwind-merge가 충돌하는 `bg-*`/`text-*` 유틸리티 중 나중 것을 채택해 `disabled` 스타일이 우선 적용되는 것으로 코드상 추론된다(⚠️ 실제 스토리/테스트로 이 조합을 직접 검증하지는 않음 — 확인 필요 섹션 참고).

`type="icon"` 컨테이너: `border-[var(--gb-border-default)]`, `rounded-[var(--gb-radius-scale-lg)]`, `shadow-[var(--gb-shadow-xs)]`, 배경 없음(각 아이템이 채움), 구분선 1px. 아이템 크기 `h-[36px] w-[34px]` — 둘 다 컴포넌트 자체 치수라 Figma 확정값 리터럴.

`type="text"` 컨테이너(알약 트랙)는 완전히 다르다 — **트랙 배경이 있고 구분선이 없다**:

|               | enabled                    | disabled                   |
| ------------- | -------------------------- | -------------------------- |
| 배경          | `--gb-background-selected` | `--gb-background-disabled` |
| 보더          | `--gb-border-default`      | `--gb-border-overlay`      |
| radius        | `--gb-radius-scale-lg`     | 동일                       |
| padding / gap | `--gb-spacing-0-5` (2px)   | 동일                       |
| 높이          | `36px` 고정                | 동일                       |

아이콘 계열과 달리 **disabled에서 트랙 자체의 배경·보더도 함께 바뀐다.** 아이템 칩은 `h-[32px]`, `px-[--gb-spacing-2]`/`py-[--gb-spacing-1]`, `--gb-radius-scale-md`, `--gb-shadow-sm`.

`trailingAction`을 넘기면 알약과 아이콘 `Button` 사이에 `--gb-spacing-1-5`(6px) 간격을 둔 투명 래퍼가 한 겹 더 생긴다.

## States and behaviors

- **hover = active 외형**: Figma 컴포넌트 설명문의 "Hover, press, and selected states all share the same active appearance"에 따라, 눌리지 않은 활성 아이템에 마우스를 올리면 눌림과 동일한 배경·전경색이 적용된다. `enabled:hover:`로 선언되어 disabled 버튼에는 반응하지 않고, 이미 눌린 아이템은 값이 같아 변화가 없다.
- **disabled**: 그룹 단위로만 적용되며(`ToggleProps.disabled`), 개별 아이템에는 disabled prop이 없다. 네이티브 `<button disabled>`이라 클릭이 브라우저 레벨에서 막히고, `toggle.test.tsx`("does not call onPressedChange when disabled")로 검증됨.
- **disabled + vertical 라벨**: `DisabledVerticalWithLabels` 스토리 설명대로 "버튼만 disabled 톤이 되고 라벨 색은 유지"된다 — 라벨은 상태와 무관하게 항상 `text-[var(--gb-text-subtle)]` 고정.
- **focus**: `focus-visible:z-10 focus-visible:shadow-[var(--gb-shadow-focus-ring)]`가 base 클래스에 포함되어 pressed/disabled 상태와 무관하게 항상 적용됨.
- **완전 제어 컴포넌트**: `pressed`는 항상 부모가 넘겨야 하는 값이고(내부 state 없음), 클릭 시 `onPressedChange(!pressed)`만 호출한다. 실제로 버튼 시각 상태를 바꾸려면 부모가 `pressed` prop을 다시 넘겨줘야 한다(`toggle.stories.tsx`의 `Interaction` play function, `toggle.test.tsx`의 "calls onPressedChange with the toggled value" 테스트로 확인).
- **divider 렌더링 규칙**: 아이템 사이(가로 배치 시 세로선, 세로 배치 시 가로선)에만 그려지고 첫 아이템 앞에는 없다(`toggle.test.tsx`: "renders a divider between items but not before the first item").
- **키보드**: 네이티브 `<button>` 시맨틱이라 Enter/Space로 토글 가능하나, 별도의 키보드 전용 스토리/테스트는 없음(⚠️ 확인 필요).

## 다른 범용 컴포넌트와의 조합 가이드

실제 코드 사용처 기준, `@/components/ui/toggle`을 import하는 곳은 **`compass-analysis-menu.tsx`와 `compass-toolbar.tsx` 두 곳**이다.

- **CompassAnalysisMenu** (`components/compass/ui/compass-analysis-menu/compass-analysis-menu.tsx`): Figma "Toggle"(❄️ GB_Compass 파일, `orientation="vertical"` 4버튼)을 감싸는 얇은 어댑터. `Toggle`이 아이템별 독립 `pressed` boolean 배열이라 단일 선택(라디오) 규칙이 없다는 점을 이 어댑터가 `value`/`onValueChange`(단일 값)로 감싸 라디오처럼 동작하게 만든다 — 각 `ToggleItem.onPressedChange`에서 `pressed`가 `true`로 바뀔 때만 `onValueChange`를 호출하는 방식. 아이콘은 `lib/sprite-icon`의 `createSpriteIcon`으로 `/public/icons.svg` 스프라이트에서 가져온다(신규 아이콘 추가 없이 기존 스프라이트로 해결됨).
- **CompassToolbar** (`components/compass/ui/compass-toolbar/compass-toolbar.tsx`): Home/Analysis 세그먼트 토글을 `Toggle`(`type="text"` + `selectionMode="single"`)로 구현한다 — Figma `Toggle Type=text`와 토큰이 전부 일치한다.

공통 패턴: `Toggle`을 단일 선택(라디오형)으로 쓸 때는 `selectionMode="single"`을 주고, 바깥에서 `value`/`onValueChange` 형태의 전용 어댑터로 감싼다. `selectionMode`가 ARIA 역할과 "이미 선택된 항목 재클릭 무시"를 처리하므로 어댑터는 값 매핑만 담당하면 된다.

## 그리드는 2×2 네 개로 고정이다

Figma에 `grid, Number=4` 한 종류만 있어, `orientation="grid"`일 때 `items`를 **아이템 4개 튜플**(`ToggleGridItems`)로 받는다. 3개·5개 이상 그리드는 타입 레벨에서 만들 수 없다.

## 하드코딩된 34px

`h-[34px]`은 토큰 스케일(32px/36px)에 일치값이 없는 Figma 확정값이라 리터럴로 둔다.

## `pressed` + `disabled`

cva의 독립된 두 축이라 동시에 `true`면 선언 순서상 `disabled` 쪽이 뒤에 와서 이긴다 — `aria-pressed`는 `true`로 유지되고 배색만 disabled가 된다. `toggle.test.tsx`가 실제 렌더링으로 고정한다. Enter/Space 토글과 disabled 시 포커스 차단도 같은 파일에서 검증한다.

## ⚠️ 확인 필요

없음.
