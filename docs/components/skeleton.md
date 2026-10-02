# Skeleton

> Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3017-2922) · node-id `3017:2922`("Skeleton Loader Segment" 프레임, 상위 "Skeleton" 프레임 node-id `76:10492`)
> 코드: `components/ui/skeleton/skeleton.tsx`

## Overview

콘텐츠가 로딩 중일 때 콘텐츠의 모양(사각/텍스트 줄/원)을 흉내 낸 placeholder를 보여주는 Atom 컴포넌트다. `shape` prop(`"rect" | "text" | "circle"`) 하나로 모양·크기·radius가 정해지며, 각 모양은 대각선으로 쓸고 지나가는 shimmer 하이라이트가 무한 반복되는 배경 그라디언트 애니메이션을 갖는다(`components/ui/skeleton/skeleton.tsx:24-28`, `app/globals.css`의 `@keyframes shimmer`).

Figma 상위 프레임(`76:10492`)에는 "Component description" 텍스트 노드가 있고, 컴포넌트명 "Skeleton"과 함께 설명 텍스트가 그대로 존재한다: **"Use to show a placeholder while content is loading."** (`get_design_context(nodeId: "76:10492")`로 확인).

Figma 구조상 이 컴포넌트는 `Progress`(`0`/`33`/`66`) × `Type`(`Rectangle`/`Text`/`Circle`) 2축, 총 9개 심볼로 구성된 정적 스냅샷 세트다(`get_metadata` 확인). `Progress` 축은 실제 progress 값이 아니라 — 동일 `Type`끼리 비교하면 배경 그라디언트의 밝은 밴드(`rgba(219,219,219,0.5)`) 위치가 9%→50%→90% 지점으로 이동하는 3장의 정지 프레임이다(`get_design_context`로 `Rectangle` 타입의 `progress="0"/"33"/"66"` 세 버전을 직접 비교해 확인: 밝은 밴드 stop이 각각 1번째/2번째/3번째 색상 정지점으로 이동). 코드는 이 3-프레임 스냅샷을 `background-position`을 좌→우로 이동시키는 무한 반복 CSS 애니메이션(`shimmer`, 2s ease-in-out)으로 재해석했다 — `skeleton.tsx:19-23` 주석에 "사용자 확정"이라고 명시되어 있다. `progress` prop은 코드에 노출되지 않는다(고정된 애니메이션만 존재, 특정 진행률로 멈출 수 없음).

**Spinner/ProgressBar와의 구분(코드로 확인)**:

- `Skeleton`: 콘텐츠의 실제 모양(사각형 이미지, 텍스트 줄, 원형 아바타 등)을 흉내 낸 회색 도형 자체가 placeholder다. `aria-hidden="true"`가 항상 붙어 스크린리더에서 완전히 숨겨진다(`skeleton.tsx:39`) — 로딩 완료 여부나 진행률에 대한 어떤 접근성 정보도 제공하지 않는다.
- `Spinner`(`components/ui/spinner/spinner.tsx`): 콘텐츠 모양과 무관한 아이콘(`lucide-react`의 `LoaderCircle`) + 텍스트 라벨을 담은 배지형 컴포넌트(`variant`: `outline`/`secondary`/`primary`). "Processing" 같은 상태 라벨과 함께 쓰이는 불확정(indeterminate) 로딩 인디케이터다.
- `ProgressBar`(`components/ui/progress-bar/ProgressBar.tsx`): `value`/`min`/`max` prop으로 실제 진행률(%)을 계산해 채워지는 막대(`role="progressbar"` 계열, `aria-label` prop 보유) — 확정(determinate) 진행률 인디케이터다.

세 컴포넌트는 실제로 조합되어 쓰이기도 한다 — `components/ui/profile-print/profile-print.tsx`의 `process` variant에서 정사각형 `Skeleton`(콘텐츠 placeholder) 위에 `Spinner variant="primary" label="Processing"`(상태 배지)를 겹쳐서 함께 사용한다(`profile-print.tsx:105-115`). 즉 이 프로젝트에서 "이미지가 로딩 중임을 사각형 모양으로 보여주는 것"과 "지금 처리 중이라는 상태를 알리는 것"은 별개 관심사로 분리되어 있다.

## When to use

- 이미지/카드/리스트 항목 등 실제 콘텐츠가 로드되기 전, 그 콘텐츠가 차지할 모양과 크기를 미리 보여주는 placeholder가 필요할 때. `shape="rect"`(카드/이미지), `shape="text"`(텍스트 줄), `shape="circle"`(아바타) 3종을 조합해 실제 레이아웃과 유사한 skeleton 화면을 구성한다.
- `skeleton.stories.tsx`의 `ListItem`/`Card` 스토리처럼 여러 `Skeleton` primitive를 `flex` 레이아웃으로 조합해 "리스트 항목" 또는 "카드" 형태의 합성 로딩 화면을 만들 때.
- `profile-print.tsx`처럼 정사각형 이미지 영역이 처리(process) 중임을 보여주면서, 동시에 상태 라벨이 필요하면 `Spinner`와 함께 겹쳐 쓴다.

## When not to use

⚠️ 확인 필요 — 코드/Figma 어디에도 "이런 경우엔 쓰지 말 것"을 뒷받침하는 명시적 근거가 없음. 일반적 UX 관례상 확정 진행률(%)을 보여줘야 하면 `ProgressBar`를, 콘텐츠 모양과 무관한 상태 텍스트만 필요하면 `Spinner`를 대신 쓰는 것으로 보이나, 이는 세 컴포넌트의 구조적 차이에서 유추한 것이지 프로젝트 문서/Figma에 명시된 규칙은 아니다.

## How to use

`skeleton.stories.tsx`에서 그대로 인용:

```tsx
// 기본값 — rect
<Skeleton shape="rect" />

// 텍스트 한 줄
<Skeleton shape="text" />

// 원형(아바타 등)
<Skeleton shape="circle" />
```

Figma "Skeleton text" 합성 예시(아바타 + 텍스트 2줄)를 `Skeleton` primitive 조합으로 재현한 것(`ListItem` 스토리):

```tsx
<div className="flex items-center gap-[var(--spacing-3)]">
  <Skeleton shape="circle" className="size-[32px]" />
  <div className="flex min-w-px flex-1 flex-col items-start gap-[var(--spacing-2)]">
    <Skeleton shape="text" className="h-[15px] w-full" />
    <Skeleton shape="text" className="h-[15px] w-[150px]" />
  </div>
</div>
```

Figma "Skeleton card" 합성 예시(이미지 + 텍스트 2줄)를 재현한 것(`Card` 스토리):

```tsx
<div className="flex w-[261px] flex-col items-start gap-[var(--spacing-3)]">
  <Skeleton shape="rect" className="aspect-[153/89] h-auto w-full" />
  <div className="flex w-full flex-col items-start gap-[var(--spacing-2)]">
    <Skeleton shape="text" className="h-[15px] w-full" />
    <Skeleton shape="text" className="h-[15px] w-[150px]" />
  </div>
</div>
```

실제 화면 사용처 — `components/ui/profile-print/profile-print.tsx:108-111`:

```tsx
<div className="relative w-full shrink-0">
  <Skeleton shape="rect" className="aspect-square h-auto w-full rounded-none" />
  <div className="absolute inset-0 flex items-center justify-center">
    <Spinner variant="primary" label="Processing" />
  </div>
</div>
```

두 예시 모두 `className`으로 기본 크기(`shapeClassName`)를 재정의하는 패턴을 보여준다 — `Skeleton`은 고정 픽셀 치수(226×157, 226×27, 27×27)를 기본값으로 갖지만 실제 사용 시엔 `w-full`/`aspect-*` 등으로 컨테이너에 맞춰 덮어쓰는 것이 일반적이다.

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성:

- `skeleton.tsx` — 컴포넌트 구현
- `skeleton.stories.tsx` — Storybook CSF3 스토리
- `skeleton.test.tsx` — Vitest + Testing Library 테스트
- `index.ts` — `Skeleton`, `SkeletonProps`, `SkeletonShape` named export

내부 DOM 구조는 단일 레벨이다:

```
<div data-slot="skeleton" aria-hidden="true">   그 자체가 placeholder 도형
```

별도 자식 요소 없이, `div` 하나에 배경 그라디언트(`style`)와 모양별 클래스(`className`)만으로 전체가 표현된다.

## Props

| Prop        | 타입                           | 기본값   | 설명                                                                                                                 |
| ----------- | ------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `shape`     | `"rect" \| "text" \| "circle"` | `"rect"` | Figma `Type` variant(`Rectangle`/`Text`/`Circle`)를 정규화한 prop. 크기·radius를 함께 결정                           |
| `className` | `string`                       | —        | 최상위 `<div>`에 병합. 기본 크기/radius를 덮어쓰는 용도로 실사용처에서 자주 쓰임(`w-full`, `aspect-square` 등)       |
| `style`     | `React.CSSProperties`          | —        | 내부 shimmer 배경 스타일과 병합(`{ ...shimmerStyle, ...style }`) — `style`로 넘긴 값이 shimmer 배경을 덮어쓸 수 있음 |

그 외 `React.HTMLAttributes<HTMLDivElement>`를 그대로 상속(`...props`가 내부 `<div>`에 전달됨). `progress`(Figma의 `Progress` variant축)는 prop으로 노출되지 않는다.

## Variants

Figma "Skeleton Loader Segment" 프레임(`3017:2922`)은 `Progress`(`0`/`33`/`66`) × `Type`(`Rectangle`/`Text`/`Circle`) 조합, 총 9개 심볼(`get_metadata` 확인):

| Figma `Type` | Figma 크기 | Figma radius(변수)    | 코드 매핑(`shape`) | 코드 크기/radius                                        |
| ------------ | ---------- | --------------------- | ------------------ | ------------------------------------------------------- |
| `Rectangle`  | 226×157    | `--radius-2xl`(18px)  | `"rect"`           | `h-[157px] w-[226px] rounded-[var(--radius-scale-2xl)]` |
| `Text`       | 226×27     | `--radius-md`(8px)    | `"text"`           | `h-[27px] w-[226px] rounded-[var(--radius-scale-md)]`   |
| `Circle`     | 27×27      | `--radius-full`(9999) | `"circle"`         | `size-[27px] rounded-[var(--radius-scale-full)]`        |

크기·radius 값 모두 `get_design_context`로 확인한 Figma 값과 코드가 정확히 일치한다(`get_variable_defs(nodeId: "3017:2922")` 결과: `{"--radius-2xl":"18","--radius-md":"8","--radius-full":"9999"}`).

`Progress` 축(`0`/`33`/`66`)은 별도 코드 variant로 매핑되지 않는다 — 3개 정적 프레임 전체가 하나의 무한 반복 CSS 애니메이션(`shimmer`)으로 대체되었기 때문이다(Overview 참고).

## States and behaviors

- **애니메이션은 항상 켜져 있음, 정지 상태 없음**: `Skeleton`에는 로딩 완료/애니메이션 정지를 나타내는 prop이나 state가 없다. 렌더링되는 즉시 `animate-[shimmer_2s_ease-in-out_infinite]`가 무한 반복되며, 로딩이 끝났을 때 `Skeleton`을 화면에서 걷어내는 책임은 전적으로 사용하는 쪽 코드에 있다(`profile-print.tsx`의 `isProcess` 조건부 렌더링이 그 예).
- **접근성은 완전히 숨김 처리**: `aria-hidden="true"`가 항상 고정되어 있어(`skeleton.tsx:39`) 스크린리더는 이 요소의 존재 자체를 인지하지 못한다. 로딩 중임을 스크린리더 사용자에게 알리려면 별도의 `aria-live`/`aria-busy` 처리나 `Spinner`의 텍스트 라벨 같은 대체 수단이 필요하다 — `Skeleton` 자체는 그 역할을 하지 않는다.
- **색상은 Figma 리터럴 hex에 대한 근사 토큰**: Figma 실제 색상은 `rgb(219,219,219)`(`#dbdbdb`, `get_design_context`로 직접 확인)이며, 정확히 일치하는 토큰이 없어 채널당 오차 2인 `--color-shimmer-gray`(`#d9d9d9`, `src/tokens/colors.css:163`)를 근사치로 쓰기로 사용자가 확정한 상태다(`skeleton.tsx:19-20` 주석). 그라디언트에는 투명도 처리를 위해 `color-mix(in srgb, var(--color-shimmer-gray) 50%, transparent)`가 쓰인다(순수 `rgba()` 하드코딩이 아니라 토큰 기반 mix).
- **그라디언트 각도는 Figma 원본과 다름 — 확인됨**: 코드는 모든 `shape`에 동일한 `105deg` 각도를 쓰지만(`skeleton.tsx:26`), Figma 원본은 `Type`별로 각도가 다르다(`get_design_context`로 직접 비교: `Rectangle`≈135deg, `Text`≈170.24deg, `Circle`≈124.79deg). 코드가 이를 단일 각도로 통일한 것은 의도적 단순화로 보이나 Figma 스펙과 정확히 일치하진 않는다 — 아래 확인 필요 참고.
- **크기는 `className`으로 쉽게 오버라이드됨**: `Skeleton.test.tsx`에서 `shape="circle"` + `className="size-[32px]"`를 주면 기본 `size-[27px]`가 사라지고 `size-[32px]`만 남는 것으로 검증됨(Tailwind 클래스 병합 순서상 뒤에 오는 `className`이 우선). 실사용처(`ListItem`/`Card` 스토리, `profile-print.tsx`)도 전부 기본 크기를 `className`으로 재정의해서 쓴다.

## 다른 범용 컴포넌트와의 조합 가이드

- **`Spinner`와 겹쳐 쓰기**: `profile-print.tsx`의 `process` variant가 유일하게 확인된 실사용 조합 패턴이다 — 정사각형 `Skeleton shape="rect"`(콘텐츠 placeholder, `rounded-none`으로 radius 재정의) 위에 `absolute inset-0 flex items-center justify-center`로 `Spinner variant="primary" label="Processing"`을 중앙 배치한다. 즉 "이 자리에 이미지가 들어올 것"은 `Skeleton`이, "지금 처리 중"이라는 상태 텍스트는 `Spinner`가 각자 맡는 역할 분리 패턴이다.
- **`Skeleton` primitive만으로 리스트/카드 합성**: 별도 `SkeletonListItem`/`SkeletonCard` 컴포넌트를 새로 만들지 않고, 기본 `Skeleton`을 `flex` 컨테이너 안에 여러 개(`circle` + `text`×2, 또는 `rect` + `text`×2) 배치해 재현하는 패턴이 `skeleton.stories.tsx`의 `ListItem`/`Card` 스토리에 정의돼 있다. 신규 화면에서 리스트/카드 로딩 placeholder가 필요하면 이 두 스토리를 그대로 참고해 조합하면 된다(단, 스토리 자체가 실제 화면 코드에서 재사용되는 컴포넌트는 아니며 패턴 예시임).
- **`ProgressBar`와의 조합 사례는 없음**: `grep -rn "Skeleton" app/ components/`와 `grep -rn "ProgressBar"` 결과를 교차했을 때 두 컴포넌트가 같은 화면에서 함께 쓰이는 사례는 발견되지 않았다.

## ⚠️ 확인 필요

- **그라디언트 각도 불일치**: 코드는 모든 `shape`에 `105deg` 고정값을 쓰지만, Figma 원본은 `Type`별로 다른 각도(Rectangle≈135deg, Text≈170.24deg, Circle≈124.79deg)를 갖는다. 단일 각도로 통일한 것이 의도된 단순화인지, 아니면 shape별로 각도를 맞춰야 하는지 확인 필요.
- **색상 근사치(`--color-shimmer-gray` vs Figma `#dbdbdb`)**: 코드 주석상 "사용자와 확정"된 근사치로 기술돼 있으나, 이 문서 작성 시점에 별도로 재확인하지는 않았다 — switch.md 등 기존 문서의 관례대로 "확인됨"으로 표시하되, 채널당 오차 2가 여전히 허용 범위인지는 디자인 쪽 최종 확인이 필요할 수 있음.
- **"When not to use" 근거 없음**: 코드/Figma 어디에도 이 컴포넌트를 쓰지 말아야 할 상황에 대한 명시적 근거가 없어 문서에 억지로 채우지 않음. Spinner/ProgressBar와의 역할 구분은 구조적 유추이지 명문화된 규칙은 아님.
- **`progress` prop 미노출에 대한 의도 재확인**: 코드 주석에 "사용자 확정 — `progress` prop은 노출하지 않습니다"라고 명시돼 있어 이 문서에서는 확정 사실로 기술했으나, 향후 특정 진행률에서 애니메이션을 멈춰야 하는 요구사항이 생길 경우 이 결정을 재검토할 필요가 있는지는 별도 확인 필요.
- **`aria-hidden` 고정에 따른 접근성 공백**: `Skeleton` 단독으로는 로딩 상태를 스크린리더에 전혀 알리지 않는다. `profile-print.tsx`처럼 `Spinner`의 텍스트 라벨과 항상 함께 쓰인다면 문제가 없지만, `Skeleton`만 단독으로 쓰이는 화면(예: `ListItem`/`Card` 패턴을 실제 화면에 적용할 때)에서 별도 `aria-busy`/`aria-live` 처리가 필요한지는 확인되지 않았다.
