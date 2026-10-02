# Toggle

- 코드: `components/ui/toggle/toggle.tsx` (`toggle.stories.tsx`, `toggle.test.tsx`, `index.ts`)
- Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=7214-444) — node-id `7214:444` ("Toggle" 컴포넌트셋)

## Overview

`Toggle`은 아이콘 눌림 버튼 여러 개를 하나의 세그먼트 그룹으로 묶는 컴포넌트다(`role="group"`). 각 버튼은 `role`은 없는 네이티브 `<button>`이지만 `aria-pressed`로 눌림 상태를 표현하며, `items` 배열(`ToggleItem[]`)로 개수를 임의로 지정한다.

코드 상단 주석(`toggle.tsx:6`)에 명시된 대로, **on/off 하나만 표현하는 `Switch`(`components/ui/switch/Switch.tsx`)와는 다른 컴포넌트**다. `Switch`는 `role="switch"` 단일 트랙+썸 슬라이더로 boolean 하나를 전환하고, `Toggle`은 `role="group"` 안에 여러 개의 독립적인 `aria-pressed` 버튼을 나란히 배치하는 세그먼트/툴바형 컨트롤이다. 둘은 이름만 비슷할 뿐 구조와 용도가 겹치지 않는다.

Figma "Toggle" 컴포넌트셋(node `7214:444`) 자체에 별도 description 필드는 없음 — `get_metadata`/`get_design_context` 응답 모두 variant 이름만 노출되고 설명 텍스트는 없다.

Figma 컴포넌트셋은 `Type`(horizontal/vertical/grid) × `Number`(1~5) × `Status`(default/disabled) 3축 조합이지만, **모든 조합이 다 있는 것은 아니다**(`get_metadata` 확인 결과):

| Type         | Figma에 정의된 Number                          |
| ------------ | ---------------------------------------------- |
| `horizontal` | 1, 2, 3, 4, 5 (default/disabled 각각)          |
| `vertical`   | 3, 4 (default/disabled 각각) — 1, 2는 없음     |
| `grid`       | 4 (default/disabled 각각) — 2×2 한 종류만 있음 |

코드는 이 제약을 그대로 따르지 않고 **`items` 배열 길이를 orientation과 무관하게 임의로 허용**한다(런타임에 개수를 막는 로직 없음). 즉 코드가 Figma 스펙보다 일반화되어 있다 — 자세한 내용은 Variants 섹션 참고.

## When to use

코드/스토리/실사용처에서 관찰된 패턴:

- 여러 아이콘 옵션 중 하나(또는 여러 개)를 눌러서 켜고 끄는 세그먼트형 툴바가 필요할 때. 가로 한 줄(`horizontal`), 세로 한 줄(`vertical`, 아이콘 옆에 보조 라벨 표시 가능), 2열 그리드(`grid`) 세 가지 배치를 지원.
- 실사용 예: `components/compass/ui/compass-analysis-menu/compass-analysis-menu.tsx` — GNB 근처에 떠 있는 Analysis 서브메뉴를 `orientation="vertical"` `Toggle` 위에 라디오처럼(단일 선택) 어댑터를 씌워 구현.
- 컴포넌트 자체는 다중 선택(각 아이템이 독립적인 `pressed` boolean)을 전제로 하며, 단일 선택(라디오처럼 하나만 켜지게)이 필요하면 소비 컴포넌트 쪽에서 `pressed`/`onPressedChange`를 직접 조율해야 한다(`CompassAnalysisMenu`, `toggle.stories.tsx`의 `ControlledToggleDemo`가 이 패턴을 보여줌).

## When not to use

⚠️ 확인 필요 — Figma/코드 어디에도 "이런 경우엔 쓰지 말 것"을 명시한 근거를 찾지 못함.

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

// 2x2 그리드 (Figma Type=Rectangular, Number=4)
<Toggle orientation="grid" items={fourItems} />

// 그룹 전체 비활성화
<Toggle orientation="horizontal" items={threeItems} disabled />
```

라디오처럼 하나만 선택되게 하려면 부모가 선택된 `aria-label`(또는 별도 value)을 state로 들고, 각 아이템의 `pressed`/`onPressedChange`를 매핑해야 한다(`toggle.stories.tsx`의 `ControlledToggleDemo`, `compass-analysis-menu.tsx` 참고).

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
- vertical의 라벨(`<span data-slot="toggle-label">`)은 `position: absolute; left-full`로 버튼 박스 바깥에 배치된다 — 코드 주석(`toggle.tsx:177-189`)에 따르면 Figma 원본에서 보더 박스 너비가 라벨 길이와 무관하게 아이콘 칩(34px) 고정이라, 이를 그대로 재현하기 위한 의도적 구조다. 같은 주석에 `w-fit`이 필수인 이유(부모가 `align-items: stretch` flex-col일 때 컨테이너 폭이 형제 요소에 맞춰 늘어나 라벨 위치가 밀리는 버그, 2026-09-29 사용자 확인 후 수정)도 기록돼 있다.
- vertical 첫/마지막 행에는 컨테이너 라운딩(`--radius-scale-lg`)과 맞춘 라운딩이 버튼(`ToggleButton`) 배경 자체에 직접 적용된다 — 코드 주석은 이것이 Figma 실측(node `7214:453` Vertical/4/Default, `7214:490` Vertical/4/Disabled) 기반이라고 명시.

## Props

### `ToggleProps`

| Prop          | 타입                                                     | 필수   | 기본값         | 설명                                                                                |
| ------------- | -------------------------------------------------------- | ------ | -------------- | ----------------------------------------------------------------------------------- |
| `items`       | `ToggleItem[]`                                           | 예     | —              | 세그먼트 그룹에 표시할 아이템 목록                                                  |
| `orientation` | `"horizontal" \| "vertical" \| "grid"`                   | 아니오 | `"horizontal"` | 배치 방향 (Figma `Type`: Horizontal/Vertical/Rectangular)                           |
| `disabled`    | `boolean`                                                | 아니오 | `false`        | 그룹 전체 비활성화. **개별 아이템 단위 비활성화는 지원하지 않음**(코드 주석에 명시) |
| ...props      | `Omit<React.HTMLAttributes<HTMLDivElement>, "children">` | 아니오 | —              | 루트 `<div role="group">`에 그대로 forward (`className`, `data-*` 등)               |

### `ToggleItem`

| Prop              | 타입                         | 필수   | 기본값                         | 설명                                                                                         |
| ----------------- | ---------------------------- | ------ | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `icon`            | `React.ReactNode`            | 예     | —                              | 버튼 안에 렌더링할 아이콘                                                                    |
| `pressed`         | `boolean`                    | 아니오 | `false`(내부적으로 `?? false`) | 눌림 상태 (Figma `Status=pressed` — ⚠️ 확인 필요 섹션 참고)                                  |
| `onPressedChange` | `(pressed: boolean) => void` | 아니오 | —                              | 클릭 시 반전된 값과 함께 호출                                                                |
| `"aria-label"`    | `string`                     | 예     | —                              | 아이콘만 있는 버튼이라 접근성 라벨 필수                                                      |
| `label`           | `string`                     | 아니오 | —                              | `orientation="vertical"`일 때만 버튼 우측에 표시되는 보조 라벨. horizontal/grid에서는 무시됨 |

## Variants

### Type (배치 방향)

| orientation           | 컨테이너 레이아웃                           | divider                                     | Figma에 정의된 Number                      |
| --------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------ |
| `horizontal` (기본값) | `flex-row overflow-clip`                    | 아이템 사이 세로선(1px, `--border-default`) | 1, 2, 3, 4, 5                              |
| `vertical`            | `flex-col w-fit`                            | 행 사이 가로선(`border-b`)                  | 3, 4 (라벨 항상 동반, Figma 스크린샷 기준) |
| `grid`                | `flex-col overflow-clip`, 2개씩 행으로 그룹 | 아이템 사이 세로선 + 행 사이 가로선         | 4 (2×2 한 종류만)                          |

코드는 세 orientation 모두에서 `items.length`에 제한을 두지 않는다. 특히 `grid`는 `items.slice(i, i+2)`로 무조건 2개씩 끊어 행을 만드는데, Figma에는 `Number=4`(정확히 2×2로 나눠떨어지는 경우) 예시만 있어 3개·5개처럼 2로 나눠떨어지지 않는 그리드가 Figma상 어떻게 보여야 하는지는 확인할 수 없었다.

### Status (상태)

| status                   | 배경                                                                                  | 텍스트/아이콘              |
| ------------------------ | ------------------------------------------------------------------------------------- | -------------------------- |
| 기본(unpressed, enabled) | `bg-background`(= `var(--background-default)`, `app/globals.css`의 shadcn alias 경유) | `var(--icon-default)`      |
| `pressed`                | `var(--background-mute-subtle)`                                                       | `var(--icon-static-white)` |
| `disabled`               | `var(--background-disabled)`                                                          | `var(--text-subtler)`      |

`pressed`와 `disabled`는 cva의 독립된 두 variant 축이라(compound variant 없음) 동시에 `true`면 `variants` 객체 선언 순서(`pressed` → `disabled`) 때문에 `disabled` 클래스가 뒤에 오고, `cn()`의 tailwind-merge가 충돌하는 `bg-*`/`text-*` 유틸리티 중 나중 것을 채택해 `disabled` 스타일이 우선 적용되는 것으로 코드상 추론된다(⚠️ 실제 스토리/테스트로 이 조합을 직접 검증하지는 않음 — 확인 필요 섹션 참고).

컨테이너 공통 토큰(모든 orientation 동일): `border-[var(--border-default)]`, `rounded-[var(--radius-scale-lg)]`, `shadow-[var(--shadow-xs)]`. 버튼 크기는 `w-[34px] h-[calc(var(--scale-36)*1px)]` — 34px은 토큰 스케일(32/36px)에 정확히 맞는 값이 없어 코드 주석에 "Figma 스펙 확정값"으로 명시하고 예외적으로 하드코딩한 값이다.

## States and behaviors

- **hover 없음**: 코드 주석(`toggle.tsx:15`)에 "Figma에는 hover 상태가 없어 배경/색 변화는 없고 커서만 바뀐다"고 명시. `cursor-pointer`(활성) / `disabled:cursor-not-allowed`만 적용됨.
- **disabled**: 그룹 단위로만 적용되며(`ToggleProps.disabled`), 개별 아이템에는 disabled prop이 없다. 네이티브 `<button disabled>`이라 클릭이 브라우저 레벨에서 막히고, `toggle.test.tsx`("does not call onPressedChange when disabled")로 검증됨.
- **disabled + vertical 라벨**: `DisabledVerticalWithLabels` 스토리 설명대로 "버튼만 disabled 톤이 되고 라벨 색은 유지"된다 — 라벨은 상태와 무관하게 항상 `text-[var(--text-subtle)]` 고정.
- **focus**: `focus-visible:z-10 focus-visible:shadow-[var(--shadow-focus-ring)]`가 base 클래스에 포함되어 pressed/disabled 상태와 무관하게 항상 적용됨.
- **완전 제어 컴포넌트**: `pressed`는 항상 부모가 넘겨야 하는 값이고(내부 state 없음), 클릭 시 `onPressedChange(!pressed)`만 호출한다. 실제로 버튼 시각 상태를 바꾸려면 부모가 `pressed` prop을 다시 넘겨줘야 한다(`toggle.stories.tsx`의 `Interaction` play function, `toggle.test.tsx`의 "calls onPressedChange with the toggled value" 테스트로 확인).
- **divider 렌더링 규칙**: 아이템 사이(가로 배치 시 세로선, 세로 배치 시 가로선)에만 그려지고 첫 아이템 앞에는 없다(`toggle.test.tsx`: "renders a divider between items but not before the first item").
- **키보드**: 네이티브 `<button>` 시맨틱이라 Enter/Space로 토글 가능하나, 별도의 키보드 전용 스토리/테스트는 없음(⚠️ 확인 필요).

## 다른 범용 컴포넌트와의 조합 가이드

실제 코드 사용처(`grep -rln "components/ui/toggle" app/ components/`) 기준, 현재 `@/components/ui/toggle`을 실제로 import하는 곳은 **`compass-analysis-menu.tsx` 한 곳뿐**이다.

- **CompassAnalysisMenu** (`components/compass/ui/compass-analysis-menu/compass-analysis-menu.tsx`): Figma "Toggle"(❄️ GB_Compass 파일, `orientation="vertical"` 4버튼)을 감싸는 얇은 어댑터. `Toggle`이 아이템별 독립 `pressed` boolean 배열이라 단일 선택(라디오) 규칙이 없다는 점을 이 어댑터가 `value`/`onValueChange`(단일 값)로 감싸 라디오처럼 동작하게 만든다 — 각 `ToggleItem.onPressedChange`에서 `pressed`가 `true`로 바뀔 때만 `onValueChange`를 호출하는 방식. 아이콘은 `lib/sprite-icon`의 `createSpriteIcon`으로 `/public/icons.svg` 스프라이트에서 가져온다(신규 아이콘 추가 없이 기존 스프라이트로 해결됨).
- **`components/ui/compass-toolbar/compass-toolbar.tsx`**: 코드 주석에 "toggle select"/"세그먼트 토글"이 언급되지만, 실제로는 `@/components/ui/toggle`을 import하지 않고 파일 내부에 완전히 별개의(2-옵션 전용, `role="radiogroup"`) 로컬 구현을 새로 두고 있다. 주석상 재사용을 검토했으나 토큰이 달라(`background-selected`/`background-static-gray`/`drop-shadow` 등) 재사용하지 않았다고 명시돼 있다 — 이 문서가 다루는 `Toggle` 컴포넌트의 실제 조합 사례가 아니므로 조합 가이드에서 제외한다. (참고: 이 주석이 언급하는 `components/ui/toggle-select`라는 별도 컴포넌트는 현재 저장소에 실존하지 않음 — `ls components/ui/`로 확인.)

공통 패턴(사례가 1건뿐이라 잠정적): `Toggle`을 다중 선택 컨트롤이 아니라 단일 선택(라디오형) 메뉴로 쓸 때는, `Toggle` 자체를 직접 노출하지 않고 `value`/`onValueChange` 형태의 전용 어댑터 컴포넌트로 감싸는 패턴이 관찰된다.

## ⚠️ 확인 필요

- **"When not to use" 근거 없음**: Figma/코드 어디에도 명시적 근거가 없어 문서에 억지로 채우지 않음.
- ~~`pressed` 상태의 Figma 대응 불확실~~ → **해결됨(사용자 확인, 2026-09-29)**: Toggle의 hover·press·selected(선택) 세 인터랙션은 시각적으로 구분 없이 전부 동일한 "active" 외형에 대응한다 — Figma `Status` variant가 `default`/`disabled` 두 가지뿐인 이유가 바로 이것이다(hover에 별도 variant가 없으면 active를 따르는 다른 컴포넌트들의 관례와 동일한 패턴 — [[feedback_hover_fallback_to_codebase_convention]]). 코드가 쓰는 눌림 배경색(`--background-mute-subtle`)은 이 통합된 active 스타일이며 별도 출처 확인 불필요.
- **`pressed` + `disabled` 동시 적용 시 실제 렌더링**: cva variants 선언 순서와 tailwind-merge 동작을 근거로 "disabled가 우선 적용될 것"이라고 추론했으나, 이 조합을 직접 렌더링해 검증하는 스토리나 테스트는 없다.
- **34px 하드코딩**: 코드 주석이 "토큰 스케일(32px/36px)에 정확히 일치하는 값이 없어 예외적으로 하드코딩, Figma 스펙 확정값"이라고 명시하고 있음 — 토큰 정책상 예외로 이미 문서화된 케이스이지만, 향후 `--scale-34` 같은 토큰이 추가될 경우 마이그레이션 대상인지 확인 필요.
- **`bg-background` 사용**: 컨테이너/버튼 대부분이 `var(--...)` bracket 표기를 쓰는데, 미눌림·비비활성 버튼 배경만 Tailwind 유틸리티 클래스 `bg-background`를 사용한다. `app/globals.css`에서 `--background: var(--background-default)`로 alias돼 있어 값 자체는 동일하지만, 프로젝트 "하드코딩 색상값 금지·`var(--color-*)` 사용" 규칙 대비 표기 방식이 파일 내 다른 곳과 일관되지 않음.
- **그리드 홀수/5개 이상 레이아웃**: Figma에는 `grid, Number=4`(2×2) 한 종류만 있어, 코드가 일반화한 3개·5개 이상 그리드 배치가 시각적으로 Figma 의도와 맞는지 디자인 확인이 필요.
- **키보드 전용 인터랙션 테스트 부재**: 네이티브 버튼이라 Enter/Space 동작은 브라우저가 보장하지만, Checkbox/Switch 등 다른 컴포넌트 문서와 달리 이를 명시적으로 검증하는 스토리/테스트가 없다.
