# Spinner

Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=1202-731) · node-id `1202:731`
코드: `components/ui/spinner/spinner.tsx`

## Overview

회전하는 로더 아이콘 + 라벨 텍스트를 한 줄로 보여주는 인라인 "불확정(indeterminate) 로딩 상태" 표시 컴포넌트. `<span>` 기반이며, `lucide-react`의 `LoaderCircle` 아이콘(`components/ui/spinner/spinner.tsx:2,55-60`)에 Tailwind 기본 유틸리티 클래스 `animate-spin`을 붙여 CSS `@keyframes`(`spin` — `transform: rotate(360deg)`를 무한 반복)로 계속 회전시키는 방식으로 구현돼 있다. SVG `stroke-dasharray` 애니메이션이나 커스텀 keyframe이 아니라 lucide 아이콘 + Tailwind 내장 `animate-spin` 클래스 조합이 전부다. 아이콘 색상은 별도 지정 없이 `currentColor`를 따르므로 라벨 텍스트 색과 자동으로 연동된다(`spinner.tsx:58` 주석).

Figma 컴포넌트에 별도 설명(description) 필드는 없음 — `get_metadata`/`get_design_context` 응답 모두 설명 텍스트를 반환하지 않았다.

**Progress-bar와의 구분(중요)**: 이름이 비슷한 용도(로딩/진행 상태 표시)로 쓰이지만 코드 구조가 근본적으로 다르다.

- **Spinner**(`components/ui/spinner/spinner.tsx`)는 "얼마나 진행됐는지 알 수 없는" **불확정(indeterminate)** 상태용이다. `value`/진행률 개념 자체가 없고, `role="progressbar"` 같은 ARIA도 없으며, 그냥 아이콘이 계속 도는 것으로 "처리 중"임만 알린다. Props는 `variant`(색상)와 `label`(텍스트)뿐.
- **Progress-bar**(`components/ui/progress-bar/ProgressBar.tsx`)는 `value`/`min`/`max`를 받아 실제 퍼센트(`percent`)를 계산하고 `role="progressbar"` + `aria-valuenow`/`aria-valuemin`/`aria-valuemax`를 명시하는 **결정적(determinate)** 진행률 바다(`ProgressBar.tsx:22-30`). 내부 인디케이터 `width`를 `style`로 직접 계산해 채우며, 애니메이션은 `transition-[width]`(값이 바뀔 때만 부드럽게 전환)뿐 — Spinner처럼 계속 도는 애니메이션이 없다.

즉 "진행률을 숫자로 알 수 있는가"가 두 컴포넌트를 가르는 실제 기준이다: 알 수 없으면 Spinner(계속 회전하는 아이콘), 알 수 있으면 Progress-bar(채워지는 바).

또한 Spinner는 시각적으로 Badge(`components/ui/badge/badge.tsx`)와 매우 닮은 구조다 — `<span>` 루트, `outline`/`secondary`/`primary`류 색상 variant, `rounded`+패딩으로 알약 모양을 만드는 방식이 거의 동일하다(실제로 `.stories.tsx`/`.test.tsx` 안에서도 변수명이 `badge`로 돼 있다 — `spinner.stories.tsx:35`, `spinner.test.tsx:22` 등). 다만 Badge와 달리 Spinner에는 `size` variant나 `icon` prop이 없고, 항상 고정된 회전 아이콘 하나만 갖는다.

## When to use

- 짧은 비동기 작업이 진행 중임을 라벨 텍스트와 함께 알려야 하고, 진행률을 퍼센트로 알 수 없을 때 (`profile-print.tsx`의 실제 사용례: 이미지 처리 중 "Processing" 표시).
- 버튼/카드/썸네일 등 다른 컴포넌트 위에 오버레이로 얹어 "이 영역이 처리 중"임을 표시할 때.

## When not to use

⚠️ 확인 필요 — 코드/Figma 어디에도 "이런 경우엔 쓰지 말 것"을 뒷받침하는 근거가 없음. 다만 구조적으로는 명확한 대안이 있다: 진행률(%)을 알 수 있는 경우라면 Spinner 대신 Progress-bar를 쓰는 것이 기존 코드베이스의 구분 기준과 일치한다(위 Overview 참고, 다만 이 우선순위 판단이 Figma/코드에 명문화돼 있진 않음).

## How to use

`spinner.stories.tsx`에서 그대로 인용:

```tsx
// outline (기본값)
<Spinner label="Processing" variant="outline" />

// secondary
<Spinner label="Processing" variant="secondary" />

// primary
<Spinner label="Processing" variant="primary" />
```

실제 조합 사용처(`profile-print.tsx:113`), 시머 로더(`Skeleton`) 위에 오버레이로 얹는 패턴:

```tsx
<div className="relative w-full shrink-0">
  <Skeleton shape="rect" className="aspect-square h-auto w-full rounded-none" />
  <div className="absolute inset-0 flex items-center justify-center">
    <Spinner variant="primary" label="Processing" />
  </div>
</div>
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성:

- `spinner.tsx` — 컴포넌트 구현
- `spinner.stories.tsx` — Storybook CSF3 스토리
- `spinner.test.tsx` — Vitest + Testing Library 테스트
- `index.ts` — `Spinner`, `SpinnerProps` named export

내부 DOM 구조:

```
<span>                                  루트, cva variant 클래스 적용
  <LoaderCircle aria-hidden="true" className="animate-spin" />   회전 아이콘
  {label}                               텍스트 (기본값 "Processing")
</span>
```

## Props

| Prop        | 타입                                    | 기본값         | 설명                                |
| ----------- | --------------------------------------- | -------------- | ----------------------------------- |
| `variant`   | `"outline" \| "secondary" \| "primary"` | `"outline"`    | 색상 variant (Figma `Type` variant) |
| `label`     | `string`                                | `"Processing"` | 아이콘 옆에 표시할 텍스트           |
| `className` | `string`                                | —              | 루트 `<span>`에 병합                |

그 외 `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">`를 그대로 상속(`...props`가 루트 `<span>`에 전달됨) — `children`은 명시적으로 제외돼 있어 라벨 외 임의 자식을 넣을 수 없다(텍스트는 반드시 `label` prop으로만 전달).

## Variants

Figma 컴포넌트 세트는 `Type` 한 축, 총 3개 심볼(`get_metadata` 확인: `Type=outline`/`Type=secondary`/`Type=primary`, 각각 node-id `1202:728`/`1202:729`/`1202:730`). Badge와 달리 별도 `Size` variant는 없음 — 모든 variant가 동일한 높이(`--scale-20`)를 공유한다.

| variant           | 배경                              | 텍스트/아이콘 색                            | 보더                                                                 |
| ----------------- | --------------------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `outline`(기본값) | 투명                              | `--foreground`(→`--text-default`)           | `border-[length:var(--border-1)] border-border`(→`--border-default`) |
| `secondary`       | `--background-surface-secondary`  | `--secondary-foreground`(→`--text-default`) | 없음                                                                 |
| `primary`         | `--primary`(→`--background-bold`) | `--primary-foreground`(→`--text-invert`)    | 없음                                                                 |

Figma `get_variable_defs`/`get_design_context` 원본과 대조한 결과, 세 variant 모두 배경·텍스트 토큰이 코드와 정확히 일치한다. 특히 `secondary`는 shadcn 기본 `--secondary`(`--background-subtler`, `#f5f5f5`)를 쓰지 않고 `--background-surface-secondary`(`#fafafa`)를 직접 참조하도록 의도적으로 분리돼 있다 — 라이트 모드에서 두 토큰 값이 다르기 때문이며, 이는 `spinner.tsx:23-27` 주석에 "2026-09-26, Figma 절대 기준 원칙에 따라 수정"이라고 명시된 이미 확정된 결정이다(다크 모드에서는 두 토큰이 우연히 같은 값이라 그동안 문제가 드러나지 않았다고 주석에 설명돼 있음).

치수(코드 기준, Figma 스펙과 대조 확인됨): 루트 `gap-[var(--spacing-1)]`(4px), `px-[var(--spacing-2)]`(8px), `py-[var(--spacing-0-5)]`(2px), `rounded-[var(--radius-scale-md)]`(8px), 높이 `h-[calc(var(--scale-20)*1px)]`(20px, 컴포넌트 자체 높이라 `--scale-*` 사용). 아이콘 크기 `size-[calc(var(--scale-12)*1px)]`(12px, 아이콘 자체 크기라 `--scale-*` 사용). 텍스트 스타일 `text-xs-medium`.

## States and behaviors

- **애니메이션은 항상 켜져 있음**: `disabled`나 정지 상태 개념 자체가 없다 — variant와 무관하게 아이콘은 항상 `animate-spin`으로 회전한다.
- **hover/focus 상태 없음**: `spinner.tsx`에 `hover:`/`focus:` 계열 Tailwind 클래스가 전혀 없다. 버튼이 아니라 상태 표시 전용 요소이므로 인터랙션 상태 자체가 정의돼 있지 않다.
- **아이콘은 장식용 취급**: `LoaderCircle`에 `aria-hidden="true"`가 항상 붙는다(`spinner.tsx:56`). 다만 루트 `<span>` 자체에는 `role="status"`나 `aria-live` 같은 스크린리더용 속성이 없어, 라벨 텍스트(`label`)만이 접근성 정보의 전부다 — 아래 확인 필요 참고.
- **제어 개념 없음**: Switch/Checkbox와 달리 controlled/uncontrolled 구분이 필요한 state가 없다(단순 표시 컴포넌트).

## 다른 범용 컴포넌트와의 조합 가이드

실제 코드 사용처(`grep -rn "Spinner" app/ components/` 기준, `components/ui/spinner/` 바깥에서 유일한 사용처):

- **ProfilePrint** (`components/ui/profile-print/profile-print.tsx:105-115`): `type="process"` 상태에서 정사각형 `Skeleton`(시머 로더) 위에 `absolute inset-0 flex items-center justify-center`로 중앙 오버레이해 `<Spinner variant="primary" label="Processing" />`를 배치. 컴포넌트 주석(`profile-print.tsx:14-17`)에 "Spinner variant='primary' 재사용 — 배지의 bg/text 색상·치수가 Figma 스펙과 정확히 일치"라고 명시돼 있어, Skeleton(정적 플레이스홀더) + Spinner(진행 중 라벨)를 겹쳐 "처리 중" 상태를 표현하는 것이 현재 코드베이스의 유일한 확립된 패턴이다.

이 외 다른 화면에서의 조합 사용례는 없음.

## ⚠️ 확인 필요

- **Figma 컴포넌트 설명(description) 필드 부재**: `get_metadata`/`get_design_context` 모두 설명 텍스트를 반환하지 않음. Figma 파일에서 직접 Description 패널을 확인해 재검증 필요.
- **"When not to use" 근거 없음**: Figma/코드 어디에도 명시적 근거가 없어 억지로 채우지 않음.
- **루트에 `role="status"`/`aria-live` 부재**: 로딩 상태를 스크린리더에 능동적으로 알리는 ARIA 라이브 리전 속성이 없다. 현재는 라벨 텍스트가 DOM에 존재하는 것 외에 스크린리더가 "지금 로딩 중"임을 별도로 인지할 방법이 없어 보인다(추정 — 실제 접근성 이슈로 보고된 사례는 없음). 의도된 설계인지, 추가가 필요한지 확인 필요.
- **`children` 제외로 라벨 외 커스텀 콘텐츠 불가**: `SpinnerProps`가 `children`을 명시적으로 `Omit`하고 있어(`spinner.tsx:41`), 텍스트 외 다른 요소(예: 커스텀 아이콘 추가)를 넣을 방법이 없음. Badge처럼 별도 `icon` 슬롯도 없어, 향후 아이콘+텍스트 외 레이아웃이 필요해지면 현재 API로는 불가능 — 의도된 제약인지 확인 필요.
