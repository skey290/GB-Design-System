# Button

- 코드: `components/ui/button/button.tsx` (`button.stories.tsx`, `button.test.tsx`, `index.ts`)
- Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=73-3681) — node-id `73:3681` ("Button" 컴포넌트셋)

## Overview

`Button`은 네이티브 `<button>` 엘리먼트를 감싼 단일 컴포넌트로, `variant` prop 하나로 7가지 시각 스타일(`primary` / `mute` / `outline` / `link` / `icon` / `ghost` / `icon-rounded`)을 전환한다. `icon` / `ghost` / `icon-rounded` variant는 텍스트 `children` 대신 `/icons.svg` 스프라이트 아이콘을 렌더링하는 아이콘 전용 버튼이고, 나머지(`primary` / `mute` / `outline` / `link`)는 텍스트 라벨(`children`)을 렌더링하는 텍스트 버튼이다.

Figma 컴포넌트셋에는 `Type`(variant)과 `State`(default / active / disabled) 두 축의 variant 프로퍼티가 있다. 코드에서는 `State=active`를 별도 prop이 아니라 CSS `:hover`로, `State=disabled`를 네이티브 `disabled` prop으로 구현했다(코드 상단 주석, `button.tsx:6-8` 참조).

Figma 컴포넌트/컴포넌트셋 자체에 별도의 description 필드는 없음 (`get_metadata`로 조회한 결과 variant/state 이름만 노출되고 설명 텍스트는 없음).

## When to use

코드베이스 실사용처(grep 기준)에서 관찰된 패턴:

- **폼/다이얼로그의 확인·취소 액션**: `components/ui/popover/popover.tsx`에서 Radix `AlertDialogPrimitive.Cancel`/`Action`을 `asChild`로 감싸 `Button variant="outline"`(취소) + `Button variant="primary"`(확인)를 나란히 배치(`flex-1`로 동일 너비).
- **아이콘 전용 컨트롤**: 캐러셀 이전/다음(`components/ui/carousel/carousel.tsx`, `variant="icon"`), 캘린더 월 이동(`components/ui/calendar/calendar.tsx`, `variant="ghost"`), 챗박스 첨부/전송(`components/ui/chatbox/chatbox.tsx`, `variant="icon"`), 카드 닫기 버튼(`components/ui/floating-profile/floating-profile.tsx`, `variant="ghost"`).
- **낮은 강조 텍스트 액션(재시도 등)**: `components/compass/ui/compass-detail-view/compass-detail-view.tsx`, `components/compass/ui/compass-self-cluster/compass-self-cluster.tsx`에서 데이터 로드 실패 시 "Retry" 액션에 `variant="link"` 사용.
- **여러 버튼을 그룹으로 배치**: `components/ui/button-group/button-group.tsx`(`ButtonGroup`)와 조합해 아이콘 버튼 + outline 버튼 + primary 버튼을 한 줄에 배치(`components/ui/floating-profile/floating-profile.tsx`).

## When not to use

⚠️ 확인 필요 — 아래 "확인 필요" 섹션 참고 (명확한 근거 부족으로 별도 서술 생략).

## How to use

`button.stories.tsx`에 실제로 정의된 사용 예시:

```tsx
// 텍스트 버튼 (primary 기본값)
<Button variant="primary">Button</Button>

// mute / outline / link
<Button variant="mute">Button</Button>
<Button variant="outline">Button</Button>
<Button variant="link">Button</Button>

// 아이콘 전용 — icon prop으로 /icons.svg 스프라이트 id 지정
<Button variant="icon" icon="search-icon" />
<Button variant="ghost" icon="bell-icon" />
<Button variant="icon-rounded" icon="plus-icon" />

// disabled
<Button variant="primary" disabled>Button</Button>
<Button variant="mute" disabled>Button</Button>
```

실제 조합 예시 (`components/ui/popover/popover.tsx:136-145`):

```tsx
<AlertDialogPrimitive.Cancel asChild>
  <Button variant="outline" className="flex-1" onClick={onCancel}>
    {cancelLabel}
  </Button>
</AlertDialogPrimitive.Cancel>
<AlertDialogPrimitive.Action asChild>
  <Button variant="primary" className="flex-1" onClick={onConfirm}>
    {confirmLabel}
  </Button>
</AlertDialogPrimitive.Action>
```

## Structure

- 루트: 네이티브 `<button type="button">` 하나. Radix `Slot`/`asChild` 패턴은 Button 자체에 구현되어 있지 않음 — 위 popover 예시처럼 상위(Radix primitive)가 `asChild`로 감싸는 방식으로 합성된다.
- 아이콘 전용 variant(`icon` / `ghost` / `icon-rounded`)일 때: `children` 대신 `<svg><use href="/icons.svg#{icon}" /></svg>` 렌더링.
- 텍스트 variant(`primary` / `mute` / `outline` / `link`)일 때: `children` 그대로 렌더링.
- `aria-label`: 명시적으로 전달하지 않으면, 아이콘 전용 variant에서는 `icon` id 값으로 자동 대체됨(`button.tsx:119`). 텍스트 variant에서는 별도 대체 없음(`undefined`).

## Props

`ButtonProps` = `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">` + `VariantProps<typeof buttonVariants>` + 아래:

| Prop         | 타입                                                                                | 기본값                                                       | 설명                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `variant`    | `"primary" \| "mute" \| "outline" \| "link" \| "icon" \| "ghost" \| "icon-rounded"` | `"primary"`                                                  | cva variant. 시각 스타일 결정                                                                                       |
| `children`   | `React.ReactNode`                                                                   | -                                                            | 버튼 라벨 텍스트. `primary`/`mute`/`outline`/`link`에서 사용 (아이콘 전용 variant에서는 무시되고 아이콘이 렌더링됨) |
| `icon`       | `string`                                                                            | `"circle-dashed-icon"`                                       | `/icons.svg` 스프라이트 아이콘 id. `icon`/`ghost`/`icon-rounded`에서 사용                                           |
| `disabled`   | `boolean`                                                                           | -                                                            | 네이티브 `disabled`. 각 variant별 disabled 토큰 스타일 자동 적용                                                    |
| `className`  | `string`                                                                            | -                                                            | `cn()`으로 variant 클래스와 병합 (뒤에 병합되므로 덮어쓰기 가능)                                                    |
| `aria-label` | `string`                                                                            | 아이콘 전용 variant일 때 `icon` id로 대체, 그 외 `undefined` | 접근성 라벨                                                                                                         |
| 그 외        | `React.ButtonHTMLAttributes<HTMLButtonElement>` (children 제외)                     | -                                                            | `onClick` 등 네이티브 button 속성 그대로 spread                                                                     |

## Variants

`variant` (cva, `defaultVariants.variant = "primary"`):

| variant        | 형태                      | 높이/크기                           | 배경/텍스트 토큰(기본)                                | hover 토큰                                                          | disabled 토큰                                                       |
| -------------- | ------------------------- | ----------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `primary`      | 텍스트                    | `--scale-36` 높이                   | `bg-primary` / `text-primary-foreground`              | `--background-static-gray` / `--text-static-white` / `--opacity-90` | `--border-overlay` / `--background-disabled` / `--text-static-gray` |
| `mute`         | 텍스트                    | `--scale-36` 높이                   | `--background-subtler` / `--text-default`             | `--background-static-gray` / `--text-static-white` / `--opacity-90` | `--border-overlay` / `--background-disabled` / `--text-static-gray` |
| `outline`      | 텍스트                    | `--scale-36` 높이                   | `border-border` / `bg-background` / `text-foreground` | `--background-static-gray` / border 투명화 / `--text-static-white`  | `--border-overlay` / `--background-disabled` / `--text-static-gray` |
| `link`         | 텍스트                    | `--scale-20` 높이                   | `--text-bold` (underline, 배경 투명)                  | `--text-subtle` (텍스트) / `--border-mute-subtle` (밑줄 decoration) | `--text-static-gray`                                                |
| `icon`         | 아이콘 전용(정사각)       | `--scale-36`                        | `border-border` / `bg-background` / `text-foreground` | `--background-static-gray` / border 투명화 / `--icon-static-white`  | `--border-overlay` / `--background-disabled` / `--icon-subtlest`    |
| `ghost`        | 아이콘 전용(정사각, 원형) | `--scale-36`, `--radius-scale-full` | 배경 투명 / `text-foreground`                         | 모서리 `--radius-scale-md`로 변경 + `--icon-subtlest`               | `--border-overlay` / `--background-disabled` / `--icon-subtlest`    |
| `icon-rounded` | 아이콘 전용(정사각, 원형) | `--scale-36`, `--radius-scale-full` | `border-border` / `bg-background` / `text-foreground` | `--background-static-gray` / border 투명화 / `--icon-static-white`  | `--border-overlay` / `--background-disabled` / `--icon-default`     |

높이값(36px / link 20px)은 Figma 스펙 확정값이며, `--spacing-*`가 아닌 범용 숫자 토큰 `--scale-*`를 `calc(var(--scale-N)*1px)` 형태로 참조한다(코드 주석, `button.tsx:10-12`).

`size` prop은 없음 — Figma 컴포넌트셋에도 `Type`/`State` 두 축만 있고 별도 크기 variant가 없음(`get_metadata` 확인).

## States and behaviors

- **default**: 각 variant 기본 토큰 스타일.
- **hover**(Figma `State=active` 대응): `hover:` 유틸로 구현. variant별 hover 토큰은 위 표 참조.
- **focus-visible**: 모든 variant 공통으로 `focus-visible:shadow-[var(--shadow-focus-ring)]` 적용.
- **disabled**: `disabled:pointer-events-none disabled:cursor-not-allowed` 공통 + variant별 disabled 토큰. Figma에 별도 disabled 상태로 정의되어 있음(`State=disabled` variant 확인, `get_metadata`).
- **link variant 밑줄 색 분리**: hover 시 텍스트 색(`--text-subtle`)과 밑줄 색(`--border-mute-subtle`)이 서로 다른 토큰에 바인딩되어 `decoration-*` 유틸로 분리 지정됨. default/disabled 상태는 텍스트·밑줄 값이 항상 같아(각각 `--text-bold`/`--icon-bold`, `--text-static-gray`/`--border-static-gray` 페어) `underline`의 기본 `currentColor` 상속을 그대로 사용(코드 주석, `button.tsx:14-20`; `button.test.tsx`에 hover decoration 테스트 존재).
- **loading 상태**: 코드/Figma 모두에 없음.

## 다른 범용 컴포넌트와의 조합 가이드

실제 앱에서 관찰된 조합 패턴:

- **`ButtonGroup`과 조합**: `components/ui/floating-profile/floating-profile.tsx`에서 `ButtonGroup`(`orientation="horizontal"`) 안에 `Button variant="icon"`(공유) + `Button variant="outline"` 2개(Edit Assets/Edit Goal) + `Button variant="primary"`(CTA)를 순서대로 배치. `ButtonGroup`은 Figma상 별도 컴포넌트셋이 아니라 기존 Button 인스턴스들을 배치한 레이아웃 조합이며, `disabled` prop을 그룹에 주면 `React.cloneElement`로 모든 자식 Button에 전파됨(`components/ui/button-group/button-group.tsx` 코드 주석).
- **Radix 다이얼로그 액션과 조합**: `AlertDialogPrimitive.Cancel`/`Action`을 `asChild`로 감싸 `Button`을 그대로 사용(취소=outline, 확인=primary). Button 자체는 `asChild`를 지원하지 않고, 상위 Radix primitive가 `asChild`로 Button의 `<button>` 엘리먼트에 자신의 핸들러/속성을 병합하는 방식.
- **아이콘 버튼은 내비게이션/유틸리티 컨트롤에 사용**: 캐러셀 이전/다음, 캘린더 월 이동, 챗박스 첨부/전송, 카드 닫기 버튼 등 "텍스트 라벨이 필요 없는 단일 액션"에 `icon`/`ghost`/`icon-rounded` variant가 일관되게 쓰임.
- **`link` variant는 인라인 텍스트 액션에 사용**: 데이터 로드 실패 시 "Retry"처럼, 본문 흐름 속에 낮은 시각적 무게로 삽입되는 액션에 사용(`compass-detail-view`, `compass-self-cluster`).
- **캘린더의 토글형 컨트롤은 Button을 쓰지 않음**: `components/ui/calendar/calendar.tsx`는 월/연도 토글 라벨에 Button이 아닌 별도의 로컬 `HeaderToggleButton` 함수를 만들어 사용함(활성/비활성 토글 상태 표현 때문으로 보이나, 코드 주석에 명시적 이유는 없음 — 아래 확인 필요 참고).

## ⚠️ 확인 필요

- **"When not to use" 근거 부족**: Figma 컴포넌트에 description이 없고, 코드/사용처에서도 "이런 경우엔 쓰지 말라"는 근거가 발견되지 않음. 예를 들어 토글형(선택 유지) 버튼에 Button을 안 쓰는 것이 의도적 설계 원칙인지, 아니면 단순히 각 구현 시점의 선택이었는지 불명확.
- **캘린더 `HeaderToggleButton`이 Button을 재사용하지 않는 이유**: `calendar.tsx`가 월/연도 토글에 Button variant를 확장하는 대신 별도 컴포넌트를 만든 이유가 코드 주석에 명시되어 있지 않음. Figma에 토글 상태(`active`/선택됨)를 가진 Button variant가 없어서인지, 다른 이유인지 확인 필요.
- **`icon-rounded`의 disabled 아이콘 색이 다른 아이콘류와 다름**: `icon`/`ghost`는 disabled 시 `--icon-subtlest`를 쓰는데 `icon-rounded`만 `--icon-default`를 씀(코드 그대로, `button.tsx:76`). Figma 실측을 재확인해 의도된 차이인지 확인 필요.
- **floating-profile.tsx의 primary 버튼 커스텀 오버라이드**: CTA 버튼에 `className`으로 `bg-[var(--background-bold)] text-[var(--text-invert)] hover:opacity-[var(--opacity-90)]`를 얹어 Button의 기본 `primary` 토큰(`bg-primary`/`text-primary-foreground`)을 부분적으로 덮어씀. 이 앱(floating-profile) 한정의 특수 케이스인지, 아니면 `primary` variant 자체의 토큰이 Figma 최신본과 어긋나 있는 것인지 확인 필요.
- **chatbox.tsx의 disabled 클래스 재지정**: `icon` variant에 이미 `disabled:border-[var(--border-overlay)] disabled:bg-[var(--background-disabled)]`가 포함돼 있는데, 사용처에서 동일 클래스를 `className`으로 다시 전달함. 중복인지, 다른 의도(예: `cn()` 병합 순서 이슈 회피)가 있는지 확인 필요.
