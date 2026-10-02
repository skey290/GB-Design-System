# Chips

Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3021-1615) · node-id `3021:1615`
코드: `components/ui/chips/chips.tsx`

## Overview

클릭 가능한 필터/선택용 알약(pill) 버튼 컴포넌트. `<button type="button">` 기반이며, `selected`(눌림 상태)와 `deletable`(우측 상단 삭제 배지) 두 가지 부가 기능을 가진다. Figma "Chips" 컴포넌트 프레임에는 `type`(primary/secondary/outline/ghost)과 `state`(default/active, primary에 한해 disabled 추가) 두 축의 variant, 그리고 `propDelete`(boolean) 컴포넌트 프로퍼티가 있다. Figma 컴포넌트 자체에 별도 description 필드는 없음(get_metadata/get_design_context 응답에 description 텍스트 없음).

**Badge와의 실제 차이점** (추측이 아닌 코드 구조 기준):

|                | Badge (`components/ui/badge`)                                                                               | Chips (`components/ui/chips`)                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 루트 엘리먼트  | `<span>`                                                                                                    | `<button type="button">`                                                                |
| 클릭 가능 여부 | 아님(HTML 속성만 따로 없음, 소비처가 `onClick` 등 span 속성을 직접 forward 받아 임의로 클릭형으로 씀)       | 원래부터 버튼 — `disabled` prop이 실제 HTML `disabled` 속성으로 동작, 클릭 시 자동 차단 |
| 선택 상태      | 없음(Badge 자체엔 `selected` 개념 없음. 소비처가 `variant`를 직접 토글해서 흉내냄 — 예: PersonaRadialChart) | `selected` prop 내장, `aria-pressed`로 노출되는 실제 토글 상태                          |
| 삭제 가능 여부 | 없음                                                                                                        | `deletable` + `onDelete` 내장 — 우측 상단에 별도 삭제(X) 배지 렌더링                    |
| 용도           | 라벨/카운트/상태 텍스트 표시(수동적)                                                                        | 필터 칩, 선택형 태그(능동적 인터랙션 요소)                                              |

즉 Badge는 "표시용 라벨"이고 Chips는 "선택/삭제가 가능한 인터랙션 요소"로, 컴포넌트 설계 의도 자체가 다르다.

## When to use

- 여러 옵션 중 하나 이상을 토글 선택하는 필터/카테고리 UI (실사용 예: `Chatbox`의 첨부 옵션 칩 — All/Image/Text 중 하나를 선택).
- 선택된 항목을 삭제(제거) 가능한 형태로 보여줘야 할 때 (`deletable` + `onDelete`).
- 네 가지 색상 변형(primary/secondary/outline/ghost) 중 화면 위계에 맞는 강조도를 골라 쓸 때.

## When not to use

⚠️ 확인 필요 — Figma/코드에 "이런 경우엔 쓰지 말 것"이 명시된 근거를 찾지 못함.

## How to use

`chips.stories.tsx`에서 그대로 인용:

```tsx
// 기본 사용
<Chips variant="primary">Chip</Chips>

// 색상 variant
<Chips variant="secondary">Chip</Chips>
<Chips variant="outline">Chip</Chips>
<Chips variant="ghost">Chip</Chips>

// 선택된 상태 (Figma State=active)
<Chips variant="primary" selected>Chip</Chips>

// 비활성화
<Chips variant="primary" disabled>Chip</Chips>

// 삭제 가능한 칩
<Chips variant="secondary" deletable onDelete={() => {}}>
  Chip
</Chips>
```

실사용 예 (`chatbox.tsx`):

```tsx
{
  CHIP_LABELS.map((label, index) => (
    <Chips
      key={label}
      type="button"
      variant="secondary"
      selected={currentChip === index}
      disabled={disabled}
      onClick={() => handleChipClick(index)}
    >
      {label}
    </Chips>
  ));
}
```

## Structure

- 루트: `<button type="button">` (`React.ButtonHTMLAttributes<HTMLButtonElement>`를 extend, 나머지 props는 spread로 forward)
- `disabled`, `onClick` 등은 별도 커스텀 로직 없이 네이티브 button 속성 그대로 동작
- `aria-pressed`는 항상 `selected ?? false` 값으로 세팅됨 (선택 가능한 토글임을 스크린리더에 명시)
- `deletable`이 true일 때만, 우측 상단에 절대 위치된 `<span role="button">` 삭제 배지를 추가 렌더링
  - 중첩 `<button>`(잘못된 HTML)을 피하기 위해 실제 `<button>` 대신 `role="button"` + `tabIndex` + 수동 키보드 핸들러(Enter/Space)로 구현
  - `onMouseDown`/`onClick`에서 `event.stopPropagation()`을 호출해 칩 자체의 클릭/포커스 로직에 이벤트가 전파되지 않도록 분리
  - 내부에 `icons.svg#x-icon` 스프라이트 아이콘 렌더링

## Props

| Prop        | 타입                                               | 필수   | 기본값      | 설명                                                                                      |
| ----------- | -------------------------------------------------- | ------ | ----------- | ----------------------------------------------------------------------------------------- |
| `variant`   | `"primary" \| "secondary" \| "outline" \| "ghost"` | 아니오 | `"primary"` | 색상 variant. Figma `type` 프로퍼티에 대응                                                |
| `selected`  | `boolean`                                          | 아니오 | `false`     | 눌림/선택 상태. `aria-pressed`에 반영되고 Figma `State=active` 스타일을 적용              |
| `disabled`  | `boolean`                                          | 아니오 | —           | 네이티브 button `disabled` 속성. 모든 variant에 동일한 비활성 모양 적용(아래 States 참고) |
| `deletable` | `boolean`                                          | 아니오 | `false`     | 우측 상단 삭제(X) 배지 표시 여부. Figma `propDelete`에 대응                               |
| `onDelete`  | `(event: React.SyntheticEvent) => void`            | 아니오 | —           | 삭제 배지 클릭/Enter/Space 활성화 시 호출. 칩 자체의 `onClick`으로는 전파되지 않음        |
| `children`  | `React.ReactNode`                                  | 예     | —           | 칩 라벨 텍스트                                                                            |
| ...props    | `React.ButtonHTMLAttributes<HTMLButtonElement>`    | 아니오 | —           | `onClick`, `className`, `type`, `data-*` 등 button 표준 속성 모두 forward                 |

## Variants

### Type × State (색상)

Figma에서 `type`(4종) × `state`(default/active, 2종)을 실측(`get_design_context`)해 확인한 값:

| type               | state            | 배경                                      | 텍스트                                      | 보더                                  |
| ------------------ | ---------------- | ----------------------------------------- | ------------------------------------------- | ------------------------------------- |
| `primary` (기본값) | default          | `var(--background-bold)`                  | `var(--text-invert)`                        | 없음(투명)                            |
| `primary`          | active(selected) | `var(--background-static-gray)`           | `var(--text-static-white)`                  | 없음                                  |
| `secondary`        | default          | `var(--background-surface-secondary)`     | `var(--foreground)`(코드 `text-foreground`) | 없음                                  |
| `secondary`        | active(selected) | `var(--background-static-gray)`           | `var(--text-static-white)`                  | 없음                                  |
| `outline`          | default          | `var(--background)`(코드 `bg-background`) | `var(--foreground)`(코드 `text-foreground`) | `var(--border)`(코드 `border-border`) |
| `outline`          | active(selected) | `var(--background-static-gray)`           | `var(--text-static-white)`                  | 없음(선택 시 보더 사라짐)             |
| `ghost`            | default          | 투명(`bg-transparent`)                    | `var(--foreground)`(코드 `text-foreground`) | 없음                                  |
| `ghost`            | active(selected) | `var(--background-static-gray)`           | `var(--text-static-white)`                  | 없음                                  |

선택(active) 상태는 코드 주석에 명시된 대로 "Figma State=active: 4개 Type 전부 동일하게 `--background-static-gray` + `--text-static-white`로 통일되고 보더는 사라짐" 스펙이며, `primary`/`active` 노드(node-id `3021:1619`)를 직접 조회해 배경 `#737373`(`--background-static-gray`)·텍스트 흰색(`--text-static-white`)임을 교차검증했다.

### Hover

Figma에는 별도 `hover` State가 정의돼 있지 않다(get_metadata 결과 `state`는 `default`/`active`만 존재, `primary`에 한해 `disabled` 추가). 코드는 "사용자 확정"에 따라 hover 시 active(selected)와 동일한 색(`--background-static-gray` + `--text-static-white`)으로 미리보기 처리하도록 4개 variant 전부에 `hover:` 클래스를 추가했다(chips.tsx 주석, chips.test.tsx `"previews the active look on hover"` 테스트로 확인).

### Disabled

Figma 컴포넌트 세트에는 `disabled` state가 `type=primary`에만 그려져 있다(node-id `3810:6910`, 배경 `--background-bold` + `opacity 70%`, 텍스트 `--text-subtle`). 코드는 "사용자 확정"에 따라 이를 4개 variant 전부에 동일한 모양으로 통일 적용했다 — variant 고유색을 유지하지 않고 모두 `disabled:bg-primary disabled:text-muted-foreground disabled:opacity-[var(--opacity-70)]`로 렌더링한다(chips.tsx 주석, chips.test.tsx `"unifies disabled look to the primary-disabled appearance"` 테스트로 확인).

### Deletable (삭제 배지)

Figma `propDelete=true`일 때의 오버레이 배지 스펙(get_design_context로 default/disabled 두 상태 조회):

| 칩 상태              | 배지 배경                                              | 배지 보더                                      |
| -------------------- | ------------------------------------------------------ | ---------------------------------------------- |
| default(비활성 아님) | `var(--background)`(Figma 원본 `--background-default`) | `var(--border)`(Figma 원본 `--border-default`) |
| disabled             | `var(--background-disabled)`                           | `var(--border-overlay)`                        |

코드는 이 두 상태를 각각 `bg-background border-border` / `bg-[var(--background-disabled)] border-[color:var(--border-overlay)]`로 구현. 배지 크기 `16px`(`var(--spacing-4)`), 위치 오프셋 `top: -5px` / `right: -4px`(`var(--spacing-1)`)는 토큰 스케일에 정확히 매칭되는 값이 없어 Figma 실측값을 그대로 쓴 예외 케이스(chips.tsx 주석, "Select 리셋 아이콘과 동일한 예외 패턴"이라고 명시).

## States and behaviors

- `selected`는 시각 스타일뿐 아니라 `aria-pressed` 속성으로도 노출되는 실제 토글 상태(Badge에는 이런 개념 자체가 없음).
- `disabled`는 네이티브 `disabled` 속성이라 클릭이 실제로 차단됨(`pointer-events-none` 클래스도 함께 적용). Badge의 `disabled` variant는 시각 스타일만 있고 실제 차단 로직이 없는 것과 대비됨.
- 삭제 배지는 칩이 `disabled`일 때 자체적으로 `aria-disabled="true"` + `tabIndex={-1}` + `pointer-events-none`으로 비활성화되며, `onDelete`가 호출되지 않는다(칩의 `disabled`가 배지에도 전파됨).
- 삭제 배지 클릭/키보드 활성화는 `event.stopPropagation()`으로 칩 자체의 `onClick`/선택 상태 변경과 완전히 분리된다 — chips.test.tsx에 "삭제 클릭이 onClick을 트리거하지 않음", "삭제 후에도 `aria-pressed`가 바뀌지 않음"을 검증하는 테스트가 있음.
- 삭제 배지는 키보드로도 활성화 가능(Enter/Space) — 마우스 전용이 아님.

## 다른 범용 컴포넌트와의 조합 가이드

실제 코드 사용처(`grep -rn "Chips" app/ components/ --include="*.tsx"`) 기준, Chips를 실제로 import해서 쓰는 곳은 **`Chatbox`** 한 곳뿐이다(`components/ui/pagination/pagination.tsx`에도 "Chips"라는 단어가 등장하지만 이는 삭제 배지 오프셋 값이 동일한 예외 패턴이라는 주석 속 언급일 뿐, 실제 import/사용은 없음).

- **Chatbox** (`components/ui/chatbox/chatbox.tsx`): `variant === "chip"`일 때 첨부 옵션 목록을 Chips로 렌더링. `CHIP_LABELS = ["All", "Image", "Text"]`를 `map`으로 순회하며 각 항목을 `variant="secondary"` 고정, `selected={currentChip === index}`로 단일 선택(라디오형) 토글, `disabled={disabled}`로 Chatbox 전체 비활성 상태를 그대로 전파, `onClick`으로 `handleChipClick(index)` 호출. `deletable`/`onDelete`는 이 조합에서 사용하지 않음(첨부 옵션 선택 용도라 삭제 기능 불필요).

현재까지 확인된 조합 패턴은 "라벨 목록을 순회 렌더링 + `selected`로 단일 선택 토글" 한 가지뿐이며, `deletable` 기능을 실제로 사용하는 소비 컴포넌트는 아직 없다(스토리/테스트에서만 검증됨).

## ⚠️ 확인 필요

- **`deletable`/`onDelete` 실사용 사례 없음**: 코드베이스 전체에서 `deletable`을 실제로 쓰는 소비 컴포넌트를 찾지 못함(Chatbox도 사용 안 함). Storybook(`Deletable` story)과 `chips.test.tsx`에서만 동작이 검증된 상태 — 실제 화면에서 태그 삭제 UI로 쓰일 때 레이아웃/접근성이 의도대로 동작하는지는 추가 확인 필요.
- **`secondary`/`outline`/`ghost`의 disabled 통일 처리가 실제 디자인 검토를 거쳤는지**: Figma에는 `type=primary`의 disabled 모양만 그려져 있고, 나머지 3개 타입에도 동일 모양을 적용한 것은 코드 주석상 "사용자 확정"이라고만 돼 있음 — 이 문서 작성자가 별도 Figma 노드로 재검증하지 않았으므로, 향후 Figma에 3개 타입 disabled가 추가되면 코드와 재대조 필요.
- ~~삭제 배지 아이콘 데이터 불일치~~ → **해결됨(오해, 2026-09-29 사용자 확인)**: `circle-dashed`는 오타가 아니라 이 아이콘 슬롯의 기본(placeholder) 아이콘이다. 삭제 배지 아이콘은 Instance Swap 컴포넌트 프로퍼티로 상황에 따라 바꿔 쓸 수 있게 설계되어 있고(Input의 `trailingIcon`/`icon`과 동일한 패턴 — [[feedback_figma_prop_default_vs_existing_usage]] 참고), 실제 삭제 용도 인스턴스에서는 `lucide/x`로 스왑되어 있다. 코드의 `icons.svg#x-icon` 사용은 정확함 — 수정 불필요.
- **`outline`/`secondary`/`ghost`의 `text-foreground`, `bg-background`, `border-border` 등이 Figma의 `--text-default`/`--background-default`/`--border-default` 시맨틱 토큰과 정확히 동일한 값으로 매핑되는지**: Tailwind 별칭 토큰(`background`, `foreground`, `border`)과 Figma가 노출하는 `--background-default` 계열 변수명이 다르게 표기되어 있어, `app/globals.css`의 실제 별칭 정의까지 대조하지 않았음 — 코드 주석상 문제 제기가 없어 정합성이 있다고 추정되나 별도 토큰 동기화 점검(`/check-tokens` 등) 권장.
