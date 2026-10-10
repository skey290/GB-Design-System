# Chips

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3021-1615) · node-id `3021:1615`
코드: `components/ui/chips/chips.tsx`

## Overview

클릭 가능한 필터/선택용 알약(pill) 버튼 컴포넌트. `<button type="button">` 기반이며, `selected`(눌림 상태)와 `deletable`(우측 상단 삭제 배지) 두 가지 부가 기능을 가진다. Figma "Chips" 컴포넌트셋(node-id `3021:1615`)에는 `Type`(primary/secondary/outline/ghost)과 `Status`(default/active, primary에 한해 disabled 추가) 두 축의 variant, 그리고 `deleteIcon`(boolean) 컴포넌트 프로퍼티가 있다.

Figma 컴포넌트 설명(description) 필드 원문:

> A clickable, selectable pill for filter or tag selection, where the user toggles one or more options on or off. Delete icon adds an X badge for removing the chip; it is hidden when the chip is disabled, since a disabled chip cannot be acted on. Distinct from Badge, which is a passive, non-interactive label.

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

- **클릭·선택·삭제가 없는 단순 표시 라벨** → Figma description이 명시한다. `Chips`가 아니라 [Badge](./badge.md)를 쓴다. Chips는 `<button>`이라 선택 상태(`aria-pressed`)와 클릭 차단(`disabled`)을 내장한 인터랙션 요소다.

## How to use

`chips.stories.tsx`에서 그대로 인용:

```tsx
// 기본 사용
<Chips variant="primary">Chip</Chips>

// 색상 variant
<Chips variant="secondary">Chip</Chips>
<Chips variant="outline">Chip</Chips>
<Chips variant="ghost">Chip</Chips>

// 선택된 상태 (Figma Status=active)
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
  - 내부에 `lucide-react`의 `X` 아이콘을 `size-[16px]`로 렌더링 (Figma의 `lucide/x` 인스턴스 16×16에 대응)

## Props

| Prop        | 타입                                               | 필수   | 기본값      | 설명                                                                                      |
| ----------- | -------------------------------------------------- | ------ | ----------- | ----------------------------------------------------------------------------------------- |
| `variant`   | `"primary" \| "secondary" \| "outline" \| "ghost"` | 아니오 | `"primary"` | 색상 variant. Figma `type` 프로퍼티에 대응                                                |
| `selected`  | `boolean`                                          | 아니오 | `false`     | 눌림/선택 상태. `aria-pressed`에 반영되고 Figma `Status=active` 스타일을 적용             |
| `disabled`  | `boolean`                                          | 아니오 | —           | 네이티브 button `disabled` 속성. 모든 variant에 동일한 비활성 모양 적용(아래 States 참고) |
| `deletable` | `boolean`                                          | 아니오 | `false`     | 우측 상단 삭제(X) 배지 표시 여부. Figma `deleteIcon`에 대응                               |
| `onDelete`  | `(event: React.SyntheticEvent) => void`            | 아니오 | —           | 삭제 배지 클릭/Enter/Space 활성화 시 호출. 칩 자체의 `onClick`으로는 전파되지 않음        |
| `children`  | `React.ReactNode`                                  | 예     | —           | 칩 라벨 텍스트                                                                            |
| ...props    | `React.ButtonHTMLAttributes<HTMLButtonElement>`    | 아니오 | —           | `onClick`, `className`, `type`, `data-*` 등 button 표준 속성 모두 forward                 |

## Variants

### Type × Status (색상)

Figma에서 `Type`(4종) × `Status`(default/active, 2종)을 실측해 확인한 값:

| Type               | Status           | 배경                                      | 텍스트                                      | 보더                                          |
| ------------------ | ---------------- | ----------------------------------------- | ------------------------------------------- | --------------------------------------------- |
| `primary` (기본값) | default          | `var(--gb-background-bold)`               | `var(--gb-text-invert)`                     | 없음(투명)                                    |
| `primary`          | active(selected) | `var(--gb-background-mute)`               | `var(--gb-text-static-white)`               | 없음                                          |
| `secondary`        | default          | `var(--gb-background-surface-secondary)`  | `var(--foreground)`(코드 `text-foreground`) | 없음                                          |
| `secondary`        | active(selected) | `var(--gb-background-mute)`               | `var(--gb-text-static-white)`               | 없음                                          |
| `outline`          | default          | `var(--background)`(코드 `bg-background`) | `var(--foreground)`(코드 `text-foreground`) | `var(--gb-border-default)` — inset box-shadow |
| `outline`          | active(selected) | `var(--gb-background-mute)`               | `var(--gb-text-static-white)`               | 없음(선택 시 보더 사라짐)                     |
| `ghost`            | default          | 투명(`bg-transparent`)                    | `var(--foreground)`(코드 `text-foreground`) | 없음                                          |
| `ghost`            | active(selected) | `var(--gb-background-mute)`               | `var(--gb-text-static-white)`               | 없음                                          |

선택(`Status=active`) 상태는 4개 Type 전부 동일하게 `--gb-background-mute` + `--gb-text-static-white`로 통일되고 보더는 사라진다(`outline`도 테두리 없음). `primary`/`active` 노드(node-id `3021:1619`)를 직접 조회해 배경 `#737373`·텍스트 흰색임을 교차검증했다.

`outline`의 보더는 실제 `border`가 아니라 **inset box-shadow**로 구현한다 — `w-fit` + border-box에서는 실제 보더가 바깥 폭에 2px 더해져 Figma 폭(71px)과 어긋나기 때문이다. Figma의 inside stroke와 동일한 결과이며, Badge도 같은 이유로 같은 방식을 쓴다.

Figma 변수명 `background-mute`와 코드 토큰 `--gb-background-mute`가 이름·값(`#737373`) 모두 일치한다.

### Hover

Figma에는 별도 `hover` 상태가 정의돼 있지 않다(`Status`는 `default`/`active`만 존재, `primary`에 한해 `disabled` 추가). 코드는 hover 시 active와 동일한 색(`--gb-background-mute` + `--gb-text-static-white`)으로 미리보기 처리하도록 4개 variant 전부에 `hover:` 클래스를 둔다(`chips.test.tsx`의 `"previews the active look on hover"` 테스트로 검증).

### Disabled

Figma 컴포넌트 세트에는 `disabled` state가 `type=primary`에만 그려져 있다(node-id `3810:6910`, 배경 `--background-bold` + `opacity 70%`, 텍스트 `--text-subtle`). 코드는 이를 4개 variant 전부에 동일한 모양으로 통일 적용했다 — variant 고유색을 유지하지 않고 모두 `disabled:bg-primary disabled:text-muted-foreground disabled:opacity-[var(--gb-opacity-70)]`로 렌더링한다(chips.tsx 주석, chips.test.tsx `"unifies disabled look to the primary-disabled appearance"` 테스트로 확인).

### Deletable (삭제 배지)

**`disabled`에는 배지가 없다.** Figma의 `Status=disabled` 변형은 자식이 라벨 텍스트 하나뿐이고, 배지 인스턴스가 숨겨진 게 아니라 파일에서 삭제돼 있다(직전 배지 노드를 조회하면 "node ID was not found" — 숨김이면 node-id가 보존된다). 코드도 `deletable && !disabled`로 아예 렌더하지 않는다.

비활성이 아닌 8개 변형(4 Type × default·active)에는 배지가 전부 있고, 스펙이 동일하다:

| 항목   | 값                                            |
| ------ | --------------------------------------------- |
| 크기   | 16×16, `rounded-full`                         |
| 배경   | `--background-default` (코드 `bg-background`) |
| 보더   | **없음**                                      |
| 아이콘 | 16×16, `--gb-icon-default`                    |
| 위치   | 칩 바깥 테두리 기준 우측 4px / 상단 5px 돌출  |

**아이콘 색은 칩 본문에서 상속받으면 안 된다** — 배지 배경이 칩과 반대 색이라, 상속시키면 `primary`와 모든 `selected` 상태에서 배경과 같은 색이 되어 X가 보이지 않는다. `--gb-icon-default`로 고정한다.

**위치 오프셋 `-right-[4px] -top-[5px]`** — 칩 루트에 실제 보더가 없으므로 padding box와 border box가 일치해 Figma 절대좌표를 그대로 쓴다. (Figma 생성 CSS가 `outline`에만 `-5/-6`을 내놓는 것은 그 변형의 1px 보더 때문에 padding-box 기준 좌표가 1px 밀린 것일 뿐, Type별로 디자인이 다른 게 아니다.)

또한 배지가 칩에 앵커되려면 칩 루트에 `relative`가 있어야 한다(cva base에 포함).

## States and behaviors

- `selected`는 시각 스타일뿐 아니라 `aria-pressed` 속성으로도 노출되는 실제 토글 상태(Badge에는 이런 개념 자체가 없음).
- `disabled`는 네이티브 `disabled` 속성이라 클릭이 실제로 차단됨(`pointer-events-none` 클래스도 함께 적용). Badge의 `disabled` variant는 시각 스타일만 있고 실제 차단 로직이 없는 것과 대비됨.
- 칩이 `disabled`면 삭제 배지는 **렌더링되지 않는다**(Figma 동일). `activateDelete`의 `disabled` 가드는 렌더 도중 상태가 바뀌는 경우를 막는 방어선으로만 남아 있다.
- 삭제 배지 클릭/키보드 활성화는 `event.stopPropagation()`으로 칩 자체의 `onClick`/선택 상태 변경과 완전히 분리된다 — chips.test.tsx에 "삭제 클릭이 onClick을 트리거하지 않음", "삭제 후에도 `aria-pressed`가 바뀌지 않음"을 검증하는 테스트가 있음.
- 삭제 배지는 키보드로도 활성화 가능(Enter/Space) — 마우스 전용이 아님.

## 다른 범용 컴포넌트와의 조합 가이드

Chips를 실제로 import해서 쓰는 곳은 **`ChatboxComposer`** 한 곳뿐이다(`components/ui/pagination/pagination.tsx`에도 "Chips"라는 단어가 나오지만 삭제 배지 오프셋이 같은 예외 패턴이라는 주석 속 언급일 뿐, 실제 import는 없음).

- **ChatboxComposer** (`components/app/chatbox-composer/chatbox-composer.tsx`): `variant === "chip"`일 때 필터 목록을 Chips로 렌더링해 Chatbox의 슬롯에 넣는다. `CHIP_LABELS = ["All", "Image", "Text"]`를 `map`으로 순회하며 각 항목을 `variant="secondary"` 고정, `selected={currentChip === index}`로 단일 선택(라디오형) 토글, `disabled`를 그대로 전파, `onClick`으로 `handleChipClick(index)` 호출. `deletable`/`onDelete`는 이 조합에서 쓰지 않는다(필터 선택 용도라 삭제 기능 불필요).

현재까지 확인된 조합 패턴은 "라벨 목록을 순회 렌더링 + `selected`로 단일 선택 토글" 한 가지뿐이며, `deletable` 기능을 실제로 사용하는 소비 컴포넌트는 아직 없다(스토리/테스트에서만 검증됨).

## disabled 모습은 Type과 무관하게 하나다

Figma에는 `Type=primary, Status=disabled` 하나만 그려져 있다 — `secondary`/`outline`/`ghost`의 disabled 스와치가 없는 것은 누락이 아니라 "disabled 모습은 컴포넌트당 하나"라는 규칙의 결과다. 코드도 base 클래스에서 네 variant를 같은 모습으로 덮는다.

`outline`은 보더를 실제 `border`가 아니라 inset box-shadow로 그리기 때문에, 통일에는 `disabled:shadow-none`까지 필요하다 — 이게 없으면 disabled outline 칩에만 보더가 남는다. `chips.test.tsx`가 네 variant 전부에 대해 `disabled:bg-primary` · `disabled:text-muted-foreground` · `disabled:shadow-none` 세 개를 모두 검사한다.

## 삭제 배지의 두 가지 의도적 차이

- **아이콘을 바꿔 쓸 수 없다.** Figma 컴포넌트 프로퍼티는 `Delete icon`(boolean) 하나뿐이고 instance-swap 슬롯이 없다(Badge의 `Leading Icon`, Button의 `Icon`과 달리). 코드도 lucide `X`를 하드코딩해 양쪽이 일치한다. 레이어명이 `lucide/circle-dashed`로 남은 것은 슬롯 이름의 잔재일 뿐 실제 렌더링은 `lucide/x`다.
- **Figma는 배지를 `Button` 인스턴스로 두지만 코드는 `<span role="button">`이다.** 칩 자체가 `<button>`이라 중첩 `<button>`은 유효하지 않은 HTML이 된다 — "기존 컴포넌트 재사용" 규칙의 의도적 예외다.

## ⚠️ 확인 필요

없음.
