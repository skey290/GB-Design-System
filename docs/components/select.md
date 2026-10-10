# Select

- 코드: `components/ui/select/select.tsx` (`select.stories.tsx`, `select.test.tsx`, `index.ts`)
- Figma: [📌 GB_Design-System (Atom)](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=614-2466) — node-id `614:2466` ("select" 컴포넌트셋, 27 variant)

## Overview

`Select`는 "값 선택형" 드롭다운 컴포넌트다. Radix `PopoverPrimitive`(Root/Trigger/Content) 위에 `role="combobox"` 트리거 + `role="listbox"`/`role="option"` 리스트를 직접 구성한 커스텀 콤보박스다.

Figma 컴포넌트 설명(description) 필드 원문:

> A dropdown for choosing a single value from a list of options, made of a trigger and the option list it opens. The trigger shows the selected value, or the placeholder while nothing is chosen. For free text entry, use Input instead.

Figma는 `Type`(default/side/icon) × `Style`(primary/reverse/mute/ghost) × `Status`(default/filled/hovered/pressed/disabled) 3축의 **희소 매트릭스**(27조합)로 정의되어 있다. 코드는 이 중 **형태 조합 7종만 `variant` 1축으로 접어** 노출한다 — 3축을 그대로 옮기면 Figma에 없는 조합이 타입상 허용되고 Storybook Controls에 드롭다운이 여러 개 떠서 깨진 조합을 고를 수 있기 때문이다(`Button`과 동일한 판단).

`Status` 축은 variant가 아니라 런타임 상태로 매핑된다:

| Figma `Status` | 코드                                 |
| -------------- | ------------------------------------ |
| `default`      | 기본                                 |
| `filled`       | `value`가 있으면 자동 (variant 아님) |
| `hovered`      | `:hover`                             |
| `pressed`      | `[data-state=open]` (드롭다운 열림)  |
| `disabled`     | `disabled` prop                      |

> **`hovered`와 `pressed`는 값이 다르다.** `hovered`는 배경을 채우고 텍스트를 반전시키는 상태이고, `pressed`는 드롭다운이 열린 상태로 배경을 그대로 둔 채 보더+포커스링만 더한다. (`Button`에서는 Figma `active`가 `:hover`와 같은 값이었지만 `Select`는 다르다 — 묶으면 안 된다.)

### 드롭다운 패널은 Figma에 디자인이 없다

Figma 컴포넌트셋 안의 `Dropdown`은 **내용물이 없는 빈 slot 노드**다(`children = null`). 슬롯에 바인딩된 건 `stroke/1`과 `Box Shadow/shadow-md` 둘뿐이고, 옵션 목록의 배경/아이템 높이/radius 같은 값은 **Figma에 존재하지 않는다.** 따라서 패널 내부 구현(리스트 + 커스텀 스크롤바 + "Show more" 버튼)은 코드베이스 컨벤션을 따른 것이며 Figma 대조 대상이 아니다.

슬롯 기하만 Figma 확정값이다 — 폭 `210px`, 트리거와의 간격 `8px`(슬롯 `top: 44` = 트리거 36 + 8). `side` 계열만 `left: 120, top: -8`로 **아래가 아니라 옆으로** 열린다.

## When to use

코드베이스 실사용처(grep 기준):

- **국가번호 코드 선택**: `components/ui/input-phone/input-phone.tsx`에서 `variant="primary"`를 전화번호 입력 필드 왼쪽에 배치해 국가 코드를 고르는 용도로 사용. 옵션에 `code`를 넘기면 트리거에 라벨 대신 코드(`+82`)가 표시된다.
- **페르소나/프로필 필터 선택**: `components/compass/ui/compass-toolbar/compass-toolbar.tsx`에서 `variant="mute"`를 사이드바 세그먼트 토글 아래에 배치해 "All 'Self'" 목록을 고르는 용도로 사용(`selectOptions`를 넘기지 않으면 렌더링 자체를 생략).

## When not to use

- **항상 두 옵션이 노출된 채 하나를 고르는 세그먼트 컨트롤**에는 쓰지 않는다. 값 목록을 펼치는 드롭다운이 아니라 구조 자체가 다르다 — `Toggle`(`type="text"` + `selectionMode="single"`)을 쓴다. `compass-toolbar.tsx`가 `Select`(아래쪽 드롭다운)와 `Toggle`(위쪽 세그먼트)을 나란히 쓰는 실제 예다.

## How to use

```tsx
// primary — 기본 트리거(보더 + 배경)
<Select variant="primary" options={OPTIONS} placeholder="Select..." />

// code가 있으면 트리거에 라벨 대신 코드를 표시하고, 드롭다운에 코드 컬럼(50px)이 생긴다
<Select variant="primary" options={COUNTRY_OPTIONS} value="kr" />

// reverse / mute / ghost — 배경만 다른 같은 형태
<Select variant="reverse" options={OPTIONS} value="a" />
<Select variant="mute" options={OPTIONS} value="a" />
<Select variant="ghost" options={OPTIONS} value="a" />

// icon — 36px 정사각 "+" 아이콘 전용 트리거 (라벨 없음)
<Select variant="icon" options={OPTIONS} />

// side / side-reverse — 24px 높이, 드롭다운이 옆으로 열림
<Select variant="side" options={OPTIONS} value="a" />
<Select variant="side-reverse" options={OPTIONS} value="a" />

// disabled — Figma에는 primary/icon에만 정의되어 있음
<Select variant="primary" options={OPTIONS} disabled />
```

실제 조합 예시(`components/ui/input-phone/input-phone.tsx`):

```tsx
<Select
  variant="primary"
  options={countryCodeOptions}
  value={currentCountryCode}
  onValueChange={handleCountryCodeChange}
  disabled={disabled}
/>
```

## Structure

- `PopoverPrimitive.Root`(제어형 `open`) → `PopoverPrimitive.Trigger asChild`로 감싼 `<button role="combobox" aria-haspopup="listbox" aria-expanded aria-controls>` → `PopoverPrimitive.Portal` → `PopoverPrimitive.Content`.
- 트리거 내부: `icon` variant는 `+` 아이콘만, 그 외에는 `<span>`(선택된 라벨 또는 `code`) + 셰브론.
- 드롭다운 내부: `<ul role="listbox">` 안에 `<li role="option" aria-selected>` 목록. 옵션 중 하나라도 `code`를 가지면 `code` 컬럼(고정폭 50px) + `label` 2단 레이아웃, 아니면 `label` 단일 컬럼.
- 커스텀 스크롤바: 브라우저 기본 스크롤바를 숨기고 트랙/썸을 `<div>`로 직접 그려 스크롤 위치에 따라 `top`/`height` 퍼센트를 계산(`updateThumb`). 옵션이 6개 초과일 때만 렌더링.
- 스크롤 다음 버튼: 옵션이 6개 초과일 때만 하단에 노출되는 `aria-label="Show more options"` 버튼, 클릭 시 리스트를 한 화면 높이만큼 `scrollBy(smooth)`.

## Props

| Prop            | 타입                      | 기본값        | 설명                                                   |
| --------------- | ------------------------- | ------------- | ------------------------------------------------------ |
| `variant`       | `SelectVariant`           | `"primary"`   | 트리거 형태. Figma `Type` × `Style` 유효 조합 7종      |
| `options`       | `SelectOption[]`          | (필수)        | `{ value, label, code? }[]`                            |
| `value`         | `string`                  | -             | 선택된 옵션의 `value`                                  |
| `onValueChange` | `(value: string) => void` | -             | 옵션 클릭/Enter 선택 시 호출                           |
| `placeholder`   | `string`                  | `"Select..."` | 값이 없을 때 트리거에 표시할 텍스트                    |
| `disabled`      | `boolean`                 | -             | 비활성화. Figma에는 `primary`/`icon`에만 정의되어 있음 |
| `className`     | `string`                  | -             | `cn()`으로 트리거 클래스와 병합                        |

`SelectVariant`: `"primary" | "reverse" | "mute" | "ghost" | "icon" | "side" | "side-reverse"`

`SelectOption`: `{ value: string; label: string; code?: string }` — `code`는 트리거에 라벨 대신 표시할 짧은 코드(예: 국가번호 `"+82"`).

## Variants

| `variant`      | Figma 조합        | 치수                 | 배경 / 보더                                       | 타이포            |
| -------------- | ----------------- | -------------------- | ------------------------------------------------- | ----------------- |
| `primary`      | default × primary | `h-[36px]`           | `--gb-background-default` / `--gb-border-default` | `text-sm-medium`  |
| `reverse`      | default × reverse | `h-[36px]`           | `--gb-background-bold` / 없음                     | `text-sm-medium`  |
| `mute`         | default × mute    | `h-[36px]`           | `--gb-background-surface-secondary` / 없음        | `text-sm-medium`  |
| `ghost`        | default × ghost   | `h-[36px]`           | 투명 / 없음                                       | `text-sm-medium`  |
| `icon`         | icon × primary    | `size-[36px]`        | `--gb-background-default` / `--gb-border-default` | 없음 (`+` 아이콘) |
| `side`         | side × primary    | `h-[24px]`           | 투명 / 없음                                       | `text-xs-medium`  |
| `side-reverse` | side × reverse    | `h-[24px]`, 좌우반전 | 투명 / 없음                                       | `text-xs-medium`  |

모든 variant 공통: `--gb-radius-scale-md`, 셰브론 16px.

Figma에 **없는** 조합은 코드에도 없다 — `side`는 `filled`/`disabled`/`mute`/`ghost`가 없고, `icon`은 `filled`/`reverse`/`mute`/`ghost`가 없고, `disabled`는 `primary`와 `icon`에만 있다.

### `side` 계열이 다른 점

`side`의 `primary` vs `reverse`는 **색 차이가 아니라 레이아웃 반전**이다(`default` Type의 `reverse`가 색 반전인 것과 의미가 다르다).

|                | 트리거 구성                 | 셰브론(닫힘 → 열림)              | 드롭다운 방향 |
| -------------- | --------------------------- | -------------------------------- | ------------- |
| `side`         | 텍스트 → 아이콘             | `chevron-right` → `chevron-left` | 오른쪽        |
| `side-reverse` | 아이콘 → 텍스트 (우측 정렬) | `chevron-left` → `chevron-right` | 왼쪽          |

또 `side`의 hover는 default 계열과 **반대 방향**이다 — 배경을 채우는 게 아니라 텍스트/아이콘을 `--gb-text-static-gray`로 **흐린다(dim)**. 포커스링도 없다.

## States and behaviors

- **default / filled**: 값 미선택 시 `--gb-text-subtle`(placeholder), 선택 시 `--gb-text-default`로 텍스트 색이 바뀐다. `reverse`만 `--gb-text-selected` → `--gb-text-invert`. **굵기 변화는 없다**(양쪽 다 medium).
- **hover (default 계열)**: 배경을 `--gb-background-mute`로 채우고 텍스트/아이콘을 `--gb-text-static-white`로 반전, `--gb-shadow-focus-ring` 추가. Style과 무관하게 공통이다.
- **hover (`side` 계열)**: 배경 변화 없이 텍스트/아이콘만 `--gb-text-static-gray`로 흐려진다.
- **open (pressed)**: 배경은 유지한 채 보더를 `--gb-border-static-gray`로, 쉐도우를 `--gb-shadow-focus-ring`으로 추가. 텍스트는 선택 여부와 무관하게 고정 색(`reverse`는 `--gb-text-invert`, 그 외는 `--gb-text-default`)으로 강제된다. 셰브론이 뒤집힌다. `side` 계열은 포커스링이 없다(Figma spread 0).
- **disabled**: variant 무관 단일 디자인(`--gb-background-disabled` / `--gb-border-overlay` / `--gb-text-static-gray`)으로 완전히 대체되고, **라벨 굵기가 `text-sm-regular`로 바뀐다**(Figma 확정 — disabled만 Medium이 아니다). 클릭해도 열리지 않는다.
- **selected / highlighted 옵션**: `--gb-background-mute` + `--gb-text-static-white`로 동일하게 표시(마우스 hover든 키보드 하이라이트든 동일).
- **키보드 내비게이션**: 트리거 포커스 상태에서 `ArrowDown`/`ArrowUp` → 오픈. 오픈 상태에서 `ArrowDown`/`ArrowUp` → 하이라이트 이동, `Enter` → 선택. `Escape`/바깥 클릭 닫힘은 Radix `Popover` 기본 동작.
- **스크롤 가능 여부**: `options.length > 6`일 때만 커스텀 스크롤바 + "Show more options" 버튼 노출.

## 다른 범용 컴포넌트와의 조합 가이드

- **`InputPhone`과 조합**: `components/ui/input-phone/input-phone.tsx`가 `variant="primary"` `Select`를 그대로 재사용해, 국가코드 드롭다운 + `Input`(전화번호 필드)을 `flex` 가로 배치로 조합. 옵션에 `code`를 넣는 것만으로 트리거 표시와 드롭다운 코드 컬럼이 함께 켜진다.
- **`CompassToolbar`와 조합**: `components/compass/ui/compass-toolbar/compass-toolbar.tsx`가 자체 구현한 세그먼트 토글(Select 아님) 아래에 `variant="mute"` `Select`를 세로 배치. `selectOptions`가 없으면 `Select` 자체를 렌더링하지 않도록 optional 처리되어 있다.

## 포커스링은 side 계열을 뺀 5개에만 있다

`primary`·`reverse`·`mute`·`ghost`·`icon` 다섯에 **hover와 열림(`pressed`) 양쪽 모두** 포커스링(`Box Shadow/Focus ring`)이 붙는다. `side`/`side-reverse`는 hover가 배경을 채우는 대신 텍스트·아이콘을 흐리는 방식이라 링이 없다. Figma도 동일하게 hovered 5개 + pressed 5개다.

## disabled 토큰과 타이포

텍스트는 `text/static-gray`, 셰브론은 `icon/static-gray`, 타이포는 **활성과 같은 `Text-sm/Medium`을 유지**한다(weight를 떨어뜨리지 않는다). `select.test.tsx`가 세 값을 모두 고정한다.

font-size는 27개 variant 어디에도 변수로 바인딩돼 있지 않다 — 타이포는 텍스트 **스타일**(`Text-sm/Medium` 등)로만 관리하는 것이 이 파일의 방식이고, 구현에는 스타일 이름만 쓰면 된다.

## 리스트/스크롤바 높이는 CSS 변수 하나로 공유한다

리스트는 `max-h`, 스크롤바 트랙은 `h`로 유틸이 달라 같은 `calc`를 두 번 적어야 했는데, 공통 부모에 `--gb-select-list-height`를 한 번 선언하고 둘이 그 변수를 참조한다.

커스텀 스크롤바를 공용 `Scrollbar` 컴포넌트로 대체할 수는 없다 — `Scrollbar`는 네이티브 스크롤바를 `::-webkit-scrollbar`로 스타일링하는 방식이고, Select는 트랙·썸을 `<div>`로 직접 그려 스크롤 위치에 동기화하는 오버레이 방식이다. 메커니즘이 다르다.

## ⚠️ 확인 필요

없음.
