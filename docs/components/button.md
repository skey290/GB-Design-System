# Button

- 코드: `components/ui/button/button.tsx` (`button.stories.tsx`, `button.test.tsx`, `index.ts`)
- Figma: [📌 GB_Design-System (Atom)](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=73-3681) — node-id `73:3681` ("Button" 컴포넌트셋)

## Overview

`Button`은 네이티브 `<button>`을 감싼 단일 컴포넌트로, `variant` prop 하나로 9가지 시각 스타일을 전환한다.

- **텍스트 버튼** — `primary` / `mute` / `outline` / `link` / `ghost` : `children`을 라벨로 렌더링
- **아이콘 전용 버튼** — `icon` / `icon-ghost` / `icon-rounded` : `children` 대신 `icon` prop의 아이콘 하나만 렌더링
- **Google 로그인 버튼** — `google` : 좌측 Google 아이콘 + 라벨 고정 조합

Figma 컴포넌트셋의 variant 축은 **`Type` × `Style` × `Status`** 3개다(철자 그대로 — `State`가 아니다). 전수 조합 54개가 아니라 **실재하는 조합은 27개**이고, 코드의 9개 variant가 `Type`×`Style` 9개 조합에 1:1로 대응한다.

| 코드 `variant` | Figma `Type` / `Style` | default     | active      | disabled    |
| -------------- | ---------------------- | ----------- | ----------- | ----------- |
| `primary`      | default / default      | `73:3673`   | `73:3668`   | `3435:465`  |
| `mute`         | default / mute         | `5037:8039` | `5037:8045` | `5037:8042` |
| `outline`      | default / outline      | `73:3678`   | `73:3679`   | `3435:474`  |
| `link`         | default / link         | `73:3674`   | `73:3672`   | `3435:481`  |
| `ghost`        | default / ghost        | `7793:3225` | `7793:3227` | `7793:3286` |
| `icon`         | icon / default         | `73:3669`   | `73:3676`   | `3435:486`  |
| `icon-ghost`   | icon / ghost           | `3019:201`  | `3019:203`  | `3435:517`  |
| `icon-rounded` | icon / rounded         | `1463:5750` | `1463:5753` | `3435:515`  |
| `google`       | google / default       | `73:3671`   | `73:3664`   | `3435:488`  |

`Status=active`는 코드에서 별도 prop이 아니라 CSS `:hover` + `:active`로, `Status=disabled`는 네이티브 `disabled` prop으로 구현했다.

> **주의 — `ghost`는 Figma에서 두 군데에 있다.** `Type=default, Style=ghost`(텍스트형)와 `Type=icon, Style=ghost`(아이콘형)는 서로 다른 컴포넌트다. 코드에서는 각각 `ghost` / `icon-ghost`로 갈라져 있다.

`size` prop은 없음 — Figma에도 크기 축이 없다.

## When to use

Figma 컴포넌트셋 description:

> "A clickable button used to trigger an action such as submit, navigate, or confirm. Type chooses the shape of the content — default renders a label, icon renders a single icon with no label, google renders the branded sign-in button — and Style sets the colour role. Not for representing a persistent on/off state — use Switch or Toggle instead."

제출 / 이동 / 확인처럼 **누르면 한 번 실행되는 액션**에 쓴다. 코드베이스 실사용 패턴:

- **다이얼로그의 확인·취소**: `components/ui/popover/popover.tsx:136-143`에서 Radix `AlertDialogPrimitive.Cancel`/`Action`을 `asChild`로 감싸 `outline`(취소) + `primary`(확인)를 `flex-1`로 나란히 배치.
- **2버튼 액션 조합**: `components/ui/button-group/button-group.tsx`가 Figma `Button group` 컴포넌트셋을 구현 — `outline` + `primary` 쌍을 `type`별 고정 라벨로 제공하고, `type="menu"`는 `ghost`/`icon-ghost` 기반 플로팅 내비게이션을 조립한다.
- **아이콘 전용 컨트롤**: 캘린더 월/연도 이동(`components/ui/calendar/calendar.tsx`, `icon-ghost` 4곳), 챗박스 첨부/전송(`components/ui/chatbox/chatbox.tsx`, `icon`), 카드 닫기(`components/app/floating-profile/floating-profile.tsx`, `icon-ghost`).
- **낮은 강조 텍스트 액션**: 데이터 로드 실패 시 "Retry"에 `link` 사용(`compass-detail-view`, `compass-self-cluster`, `compass-metric-card`).

## When not to use

- **켜짐/꺼짐이 유지되는 상태 표현에는 쓰지 않는다** — `Toggle` 또는 `Switch`를 쓴다(Figma description 명시).
- 선택 가능한 옵션 묶음(세그먼트)에도 쓰지 않는다 — `Toggle`의 `type="text"`가 그 역할을 한다.

## How to use

```tsx
// 텍스트 버튼 (primary가 기본값)
<Button variant="primary">Button</Button>
<Button variant="mute">Button</Button>
<Button variant="outline">Button</Button>
<Button variant="link">Button</Button>
<Button variant="ghost">Button</Button>

// 라벨 뒤 아이콘 — primary/mute/outline/link에서만 적용된다
<Button variant="primary" iconAfter="arrow-right-icon">Go Next</Button>

// 아이콘 전용 — children 대신 icon prop
<Button variant="icon" icon="search-icon" />
<Button variant="icon-ghost" icon="chevron-left-icon" />
<Button variant="icon-rounded" icon="plus-icon" />

// Google — 아이콘과 기본 라벨이 내장돼 있다
<Button variant="google" />

// disabled
<Button variant="primary" disabled>Button</Button>
```

## Structure

- 루트는 네이티브 `<button type="button">` 하나. Button 자체는 `asChild`를 지원하지 않으므로, 합성이 필요하면 상위 Radix primitive가 `asChild`로 감싼다(popover 예시 참고).
- 아이콘은 `ButtonIcon` 내부 헬퍼가 렌더링한다. `LUCIDE_SPRITE_MAP`에 해당 id가 있으면 **lucide 컴포넌트**를, 없으면 `<svg><use href="/icons.svg#{id}" /></svg>` **스프라이트**를 쓴다.
- 아이콘 전용 variant: `icon`만 렌더링(`children` 무시).
- `google`: Google 아이콘 + `children ?? "Continue with Google"`.
- 그 외 텍스트 variant: `children` + (`iconAfter`가 있고 해당 variant가 trailing 슬롯을 가질 때) 뒤쪽 아이콘.
- `aria-label`: 명시하지 않으면 아이콘 전용 variant에서 `icon` id 값으로 자동 대체. 텍스트 variant는 `undefined`.

## Props

`ButtonProps` = `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">` + `VariantProps<typeof buttonVariants>` + 아래:

| Prop         | 타입                                                                                                            | 기본값                                             | 설명                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `variant`    | `"primary" \| "mute" \| "outline" \| "link" \| "ghost" \| "icon" \| "icon-ghost" \| "icon-rounded" \| "google"` | `"primary"`                                        | 시각 스타일                                                                                     |
| `children`   | `React.ReactNode`                                                                                               | -                                                  | 라벨 텍스트. 아이콘 전용 variant에서는 무시됨                                                   |
| `icon`       | `IconId`                                                                                                        | `"circle-dashed-icon"`                             | 아이콘 전용 variant에서 렌더링할 아이콘 id                                                      |
| `iconAfter`  | `IconId`                                                                                                        | -                                                  | 라벨 뒤 아이콘. **`primary`/`mute`/`outline`/`link`에서만** 적용(그 외 variant에 넘기면 무시됨) |
| `disabled`   | `boolean`                                                                                                       | -                                                  | 네이티브 `disabled`. variant별 disabled 토큰 자동 적용                                          |
| `className`  | `string`                                                                                                        | -                                                  | `cn()`으로 뒤에 병합되어 덮어쓰기 가능                                                          |
| `aria-label` | `string`                                                                                                        | 아이콘 전용 variant는 `icon` id, 그 외 `undefined` | 접근성 라벨                                                                                     |
| 그 외        | `React.ButtonHTMLAttributes<HTMLButtonElement>`                                                                 | -                                                  | `onClick` 등 네이티브 속성 spread                                                               |

`iconAfter`의 Figma 대응은 `Type=default` 계열의 instance-swap property(`trailingIcon` → `icon`으로 개명됨) + 표시 토글 boolean이다. **텍스트 `ghost`에는 아이콘 슬롯이 없어** 코드 `TRAILING_ICON_VARIANTS`에서도 제외돼 있다.

## Variants

높이/크기는 Figma 확정값이라 리터럴 px(`h-[36px]` 등)로 직접 쓴다 — spacing 토큰이 아니다.

| variant        | 형태           | 크기 / radius                                                   | 기본 토큰                                             | active 토큰                                             | disabled 토큰                                                 |
| -------------- | -------------- | --------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| `primary`      | 텍스트         | `h-36` / `radius-scale-lg`                                      | `bg-primary` / `text-primary-foreground`              | `background-mute` / `text-static-white` / `opacity-90`  | `border-overlay` / `background-disabled` / `text-static-gray` |
| `mute`         | 텍스트         | `h-36` / `radius-scale-lg`                                      | `background-subtler` / `text-default`                 | `background-mute` / `text-static-white` / `opacity-90`  | 〃                                                            |
| `outline`      | 텍스트         | `h-36` / `radius-scale-lg`                                      | `border-border` / `bg-background` / `text-foreground` | `background-mute` / border 투명화 / `text-static-white` | 〃                                                            |
| `link`         | 텍스트(밑줄)   | `h-20` / radius 없음                                            | `text-bold`, 배경 투명                                | `text-subtle` / 밑줄 `border-mute-subtle`               | `text-static-gray`                                            |
| `ghost`        | 텍스트         | `h-36` / `radius-scale-full`                                    | 배경 투명 / `text-default`                            | `background-mute` / `text-static-white`                 | 배경 투명 / `text-static-gray`                                |
| `icon`         | 아이콘(정사각) | `36×36` / `radius-scale-lg`                                     | `border-border` / `bg-background` / `icon-default`    | `background-mute` / border 투명화 / `icon-static-white` | `border-overlay` / `background-disabled` / `icon-static-gray` |
| `icon-ghost`   | 아이콘(원형)   | `36×36` / `radius-scale-full` → **active 시 `radius-scale-lg`** | 배경 투명 / `icon-default`                            | `background-mute` / `icon-static-white`                 | 배경 투명 / `icon-static-gray`                                |
| `icon-rounded` | 아이콘(원형)   | `36×36` / `radius-scale-full`                                   | `border-border` / `bg-background` / `icon-default`    | `background-mute` / border 투명화 / `icon-static-white` | `border-overlay` / `background-disabled` / `icon-static-gray` |
| `google`       | 아이콘+텍스트  | `h-36` / `radius-scale-lg`                                      | `background-bolder` / `border-muted` / `text-invert`  | `background-mute` / border 투명화 / `text-static-white` | `border-overlay` / `background-disabled` / `text-static-gray` |

아이콘 크기는 16px 고정이고, `link`의 `iconAfter`만 12px다.

**`opacity-90`은 `primary`/`mute`의 active에만 붙는다** — 나머지 variant의 active에는 opacity 변수가 바인딩돼 있지 않다.

### `icon-ghost`의 모서리 전환

Figma에서 `icon/ghost`는 **active(`3019:203`)만 `radius-lg`(10px)** 이고 default(`3019:201`)·disabled(`3435:517`)는 `radius-full`로 바인딩돼 있다. 평소에는 배경이 투명해 모서리가 보이지 않으므로, **실제로 눈에 보이는 모양은 "눌렀을 때의 둥근 사각형"** 하나다. 이 구분이 없으면 `icon-rounded`(항상 원형)와 hover 시 모양이 똑같아져 두 variant를 구별할 수 없다.

영향 범위: `calendar`(4곳) · `floating-profile`(1곳) · `compass-detail-view`(1곳).

## States and behaviors

- **default**: variant 기본 토큰.
- **hover / active** (Figma `Status=active`): 코드에서 `hover:`와 `active:` 양쪽에 같은 스타일을 적용한다. Figma에 hover와 press가 따로 없어 한 상태로 합쳤다.
- **focus-visible**: 전 variant 공통 `focus-visible:shadow-[var(--gb-shadow-focus-ring)]`. **Figma에는 focus 상태가 없고, 접근성을 위해 코드에서 추가한 것**이다.
- **disabled**: 공통 `disabled:pointer-events-none disabled:cursor-not-allowed` + variant별 disabled 토큰. hover/active 스타일은 `pointer-events-none`으로 차단된다.
- **`link`의 밑줄 색 분리**: active 시 텍스트(`text-subtle`)와 밑줄(`border-mute-subtle`)이 서로 다른 토큰이라 `decoration-*`로 분리 지정했다. default/disabled는 두 값이 같아 `underline` 기본 `currentColor` 상속을 쓴다.
- **active 시 보더 처리**: Figma는 active에서 스트로크를 **아예 제거**하지만, 코드는 `border-transparent`로 1px을 남긴다. 보더를 없애면 버튼 크기가 1px 줄어 눌릴 때 흔들리기 때문이다. 시각 결과는 동일하다.
- **loading 상태**: 코드/Figma 모두 없음.

## 다른 범용 컴포넌트와의 조합 가이드

- **`ButtonGroup`**: `outline` + `primary` 쌍(`type="save"` 등)과 `ghost`/`icon-ghost` 기반 플로팅 내비게이션(`type="menu"`)을 Button 인스턴스로 조립한다. Button이 바뀌면 ButtonGroup에도 전파된다.
- **Radix 다이얼로그**: `AlertDialogPrimitive.Cancel`/`Action`을 `asChild`로 감싸 Button을 그대로 사용(취소=`outline`, 확인=`primary`).
- **`Toggle`**: Toggle의 `trailingAction`이 `Button variant="icon"`을 내부에서 사용한다.
- **자유 배치**: `floating-profile`에서 flex 컨테이너 안에 `icon`(공유) + `outline` 2개(Edit Assets/Edit Goal) + `primary`(CTA)를 순서대로 배치.
- **토글형 컨트롤에는 쓰지 않는다**: `calendar.tsx`는 월/연도 토글 라벨에 Button이 아닌 로컬 `HeaderToggleButton`을 쓴다. Figma description의 "persistent on/off state에는 Toggle/Switch" 원칙과 방향이 일치한다.

## ⚠️ 확인 필요

없음.

## 소비처가 variant를 덮어쓰지 않는다

`primary`의 `bg-primary`/`text-primary-foreground`는 Shadcn 브릿지를 거쳐 각각 `--gb-background-bold`/`--gb-text-invert`로 해석된다. 따라서 소비처가 같은 값을 `className`으로 다시 주는 것은 중복이다 — 레이아웃(`flex-1` 등)만 넘기고 색·높이는 variant에 맡긴다.

Figma 컴포넌트 프로퍼티는 `-> Icon`(instance-swap)과 `Show icon`(boolean)으로 이름이 분리돼 있어, codegen도 `icon`/`showIcon`으로 나온다.
