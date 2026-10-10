# Skeleton

> Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3017-2922) · node-id `3017:2922`("Skeleton Loader Segment" 프레임, 상위 "Skeleton" 프레임 node-id `3017:2922`)
> 코드: `components/ui/skeleton/skeleton.tsx`

## Overview

콘텐츠가 로딩 중일 때 콘텐츠의 모양(사각/텍스트 줄/원)을 흉내 낸 placeholder를 보여주는 Atom 컴포넌트다. `shape` prop(`"rectangle" | "text" | "circle"`) 하나로 모양·크기·radius가 정해지며, 각 모양은 대각선으로 쓸고 지나가는 shimmer 하이라이트가 무한 반복되는 배경 그라디언트 애니메이션을 갖는다(`components/ui/skeleton/skeleton.tsx:24-28`, `app/globals.css`의 `@keyframes shimmer`).

Figma 컴포넌트 설명(description) 필드 원문:

> A placeholder shape shown while real content is loading, with a shimmer sweep across it. One segment stands in for one piece of content — a text line, a circle, or a block — so several are usually combined to match the shape of the layout underneath. Use Spinner when there is no layout to preview.

Figma 구조상 이 컴포넌트는 `Progress`(`0`/`33`/`66`) × `Type`(`rectangle`/`text`/`circle`) 2축, 총 9개 심볼로 구성된 정적 스냅샷 세트다. `Progress` 축은 실제 progress 값이 아니라 — 동일 `Type`끼리 비교하면 배경 그라디언트의 밝은 밴드(`rgba(219,219,219,0.5)`) 위치가 9%→50%→90% 지점으로 이동하는 3장의 정지 프레임이다. 코드는 이 3-프레임 스냅샷을 `background-position`을 좌→우로 이동시키는 무한 반복 CSS 애니메이션(`shimmer`, 2s ease-in-out)으로 재해석했다. `progress` prop은 코드에 노출되지 않는다(고정된 애니메이션만 존재, 특정 진행률로 멈출 수 없음).

**Spinner/ProgressBar와의 구분(코드로 확인)**:

- `Skeleton`: 콘텐츠의 실제 모양(사각형 이미지, 텍스트 줄, 원형 아바타 등)을 흉내 낸 회색 도형 자체가 placeholder다. `aria-hidden="true"`가 항상 붙어 스크린리더에서 완전히 숨겨진다(`skeleton.tsx:39`) — 로딩 완료 여부나 진행률에 대한 어떤 접근성 정보도 제공하지 않는다.
- `Spinner`(`components/ui/spinner/spinner.tsx`): 콘텐츠 모양과 무관한 아이콘(`lucide-react`의 `LoaderCircle`) + 텍스트 라벨을 담은 배지형 컴포넌트(`variant`: `outline`/`secondary`/`primary`). "Processing" 같은 상태 라벨과 함께 쓰이는 불확정(indeterminate) 로딩 인디케이터다.
- `ProgressBar`(`components/ui/progress-bar/progress-bar.tsx`): `value`/`min`/`max` prop으로 실제 진행률(%)을 계산해 채워지는 막대(`role="progressbar"` 계열, `aria-label` prop 보유) — 확정(determinate) 진행률 인디케이터다.

세 컴포넌트는 실제로 조합되어 쓰이기도 한다 — `components/app/profile-print/profile-print.tsx`의 `process` variant에서 정사각형 `Skeleton`(콘텐츠 placeholder) 위에 `Spinner variant="primary" label="Processing"`(상태 배지)를 겹쳐서 함께 사용한다(`profile-print.tsx:105-115`). 즉 이 프로젝트에서 "이미지가 로딩 중임을 사각형 모양으로 보여주는 것"과 "지금 처리 중이라는 상태를 알리는 것"은 별개 관심사로 분리되어 있다.

## When to use

- 이미지/카드/리스트 항목 등 실제 콘텐츠가 로드되기 전, 그 콘텐츠가 차지할 모양과 크기를 미리 보여주는 placeholder가 필요할 때. `shape="rectangle"`(카드/이미지), `shape="text"`(텍스트 줄), `shape="circle"`(아바타) 3종을 조합해 실제 레이아웃과 유사한 skeleton 화면을 구성한다.
- `skeleton.stories.tsx`의 `ListItem`/`Card` 스토리처럼 여러 `Skeleton` primitive를 `flex` 레이아웃으로 조합해 "리스트 항목" 또는 "카드" 형태의 합성 로딩 화면을 만들 때.
- `profile-print.tsx`처럼 정사각형 이미지 영역이 처리(process) 중임을 보여주면서, 동시에 상태 라벨이 필요하면 `Spinner`와 함께 겹쳐 쓴다.

## When not to use

- **미리 보여줄 레이아웃이 없을 때.** Figma description이 명시한다 — 로딩될 콘텐츠의 모양을 모르면 Skeleton이 아니라 [Spinner](./spinner.md)를 쓴다. Skeleton은 "이 자리에 이런 모양이 들어온다"를 보여주는 것이 전부라, 흉내 낼 모양이 없으면 의미가 없다.
- **확정 진행률(%)을 보여줘야 할 때** → [ProgressBar](./progress-bar.md). Skeleton의 `Progress` 축은 애니메이션 스냅샷일 뿐 실제 진행률이 아니고, 코드에도 `progress` prop이 없다.

## How to use

`skeleton.stories.tsx`에서 그대로 인용:

```tsx
// 기본값 — rect
<Skeleton shape="rectangle" />

// 텍스트 한 줄
<Skeleton shape="text" />

// 원형(아바타 등)
<Skeleton shape="circle" />
```

Figma "Skeleton text" 합성 예시(아바타 + 텍스트 2줄)를 `Skeleton` primitive 조합으로 재현한 것(`ListItem` 스토리):

```tsx
<div className="flex items-center gap-[var(--gb-spacing-3)]">
  <Skeleton shape="circle" className="size-[32px]" />
  <div className="flex min-w-px flex-1 flex-col items-start gap-[var(--gb-spacing-2)]">
    <Skeleton shape="text" className="h-[15px] w-full" />
    <Skeleton shape="text" className="h-[15px] w-[150px]" />
  </div>
</div>
```

Figma "Skeleton card" 합성 예시(이미지 + 텍스트 2줄)를 재현한 것(`Card` 스토리):

```tsx
<div className="flex w-[261px] flex-col items-start gap-[var(--gb-spacing-3)]">
  <Skeleton shape="rectangle" className="aspect-[153/89] h-auto w-full" />
  <div className="flex w-full flex-col items-start gap-[var(--gb-spacing-2)]">
    <Skeleton shape="text" className="h-[15px] w-full" />
    <Skeleton shape="text" className="h-[15px] w-[150px]" />
  </div>
</div>
```

실제 화면 사용처 — `components/app/profile-print/profile-print.tsx:108-111`:

```tsx
<div className="relative w-full shrink-0">
  <Skeleton
    shape="rectangle"
    className="aspect-square h-auto w-full rounded-none"
  />
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

| Prop        | 타입                                | 기본값        | 설명                                                                                                                 |
| ----------- | ----------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------- |
| `shape`     | `"rectangle" \| "text" \| "circle"` | `"rectangle"` | Figma `Type` variant(`Rectangle`/`Text`/`Circle`)를 정규화한 prop. 크기·radius를 함께 결정                           |
| `className` | `string`                            | —             | 최상위 `<div>`에 병합. 기본 크기/radius를 덮어쓰는 용도로 실사용처에서 자주 쓰임(`w-full`, `aspect-square` 등)       |
| `style`     | `React.CSSProperties`               | —             | 내부 shimmer 배경 스타일과 병합(`{ ...shimmerStyle, ...style }`) — `style`로 넘긴 값이 shimmer 배경을 덮어쓸 수 있음 |

그 외 `React.HTMLAttributes<HTMLDivElement>`를 그대로 상속(`...props`가 내부 `<div>`에 전달됨). `progress`(Figma의 `Progress` variant축)는 prop으로 노출되지 않는다.

## Variants

Figma "Skeleton Loader Segment" 프레임(`3017:2922`)은 `Progress`(`0`/`33`/`66`) × `Type`(`rectangle`/`text`/`circle`) 조합, 총 9개 심볼:

| Figma `Type` | Figma 크기 | Figma radius(변수)    | 코드 매핑(`shape`) | 코드 크기/radius                                           |
| ------------ | ---------- | --------------------- | ------------------ | ---------------------------------------------------------- |
| `Rectangle`  | 226×157    | `--radius-2xl`(18px)  | `"rectangle"`      | `h-[157px] w-[226px] rounded-[var(--gb-radius-scale-2xl)]` |
| `Text`       | 226×27     | `--radius-md`(8px)    | `"text"`           | `h-[27px] w-[226px] rounded-[var(--gb-radius-scale-md)]`   |
| `Circle`     | 27×27      | `--radius-full`(9999) | `"circle"`         | `size-[27px] rounded-[var(--gb-radius-scale-full)]`        |

크기·radius 값 모두 Figma와 코드가 정확히 일치한다(Figma 변수: `--radius-2xl` 18, `--radius-md` 8, `--radius-full` 9999).

`Progress` 축(`0`/`33`/`66`)은 별도 코드 variant로 매핑되지 않는다 — 3개 정적 프레임 전체가 하나의 무한 반복 CSS 애니메이션(`shimmer`)으로 대체되었기 때문이다(Overview 참고).

## States and behaviors

- **애니메이션은 항상 켜져 있음, 정지 상태 없음**: `Skeleton`에는 로딩 완료/애니메이션 정지를 나타내는 prop이나 state가 없다. 렌더링되는 즉시 `animate-[shimmer_2s_ease-in-out_infinite]`가 무한 반복되며, 로딩이 끝났을 때 `Skeleton`을 화면에서 걷어내는 책임은 전적으로 사용하는 쪽 코드에 있다(`profile-print.tsx`의 `isProcess` 조건부 렌더링이 그 예).
- **접근성은 완전히 숨김 처리**: `aria-hidden="true"`가 항상 고정되어 있어(`skeleton.tsx:39`) 스크린리더는 이 요소의 존재 자체를 인지하지 못한다. 로딩 중임을 스크린리더 사용자에게 알리려면 별도의 `aria-live`/`aria-busy` 처리나 `Spinner`의 텍스트 라벨 같은 대체 수단이 필요하다 — `Skeleton` 자체는 그 역할을 하지 않는다.
- **색상은 Figma 값과 일치**: `--gb-color-shimmer-gray`(`#dbdbdb`)가 Figma 값과 같다. Figma 쪽은 변수에 바인딩되지 않은 리터럴 hex다. 그라디언트에는 투명도 처리를 위해 `color-mix(in srgb, var(--gb-color-shimmer-gray) 50%, transparent)`를 쓴다(순수 `rgba()` 하드코딩이 아니라 토큰 기반 mix). 이 토큰은 Skeleton에서만 쓰인다.
- **그라디언트 각도는 shape와 무관하게 `135deg` 통일**: 코드는 세 shape 모두 135°를 쓴다 — 여러 shape이 섞인 리스트에서 빛이 서로 엇갈려 흐르지 않게 하려는 것. Figma는 `Type`별로 각도가 다르다(축 기준 `Rectangle` 45° / `Text` 115.5° / `Circle` 24.6°). 아래 "Figma를 그대로 따르지 않는 부분" 참고.
- **크기는 `className`으로 쉽게 오버라이드됨**: `Skeleton.test.tsx`에서 `shape="circle"` + `className="size-[32px]"`를 주면 기본 `size-[27px]`가 사라지고 `size-[32px]`만 남는 것으로 검증됨(Tailwind 클래스 병합 순서상 뒤에 오는 `className`이 우선). 실사용처(`ListItem`/`Card` 스토리, `profile-print.tsx`)도 전부 기본 크기를 `className`으로 재정의해서 쓴다.

## 다른 범용 컴포넌트와의 조합 가이드

- **`Spinner`와 겹쳐 쓰기**: `profile-print.tsx`의 `process` variant가 유일하게 확인된 실사용 조합 패턴이다 — 정사각형 `Skeleton shape="rectangle"`(콘텐츠 placeholder, `rounded-none`으로 radius 재정의) 위에 `absolute inset-0 flex items-center justify-center`로 `Spinner variant="primary" label="Processing"`을 중앙 배치한다. 즉 "이 자리에 이미지가 들어올 것"은 `Skeleton`이, "지금 처리 중"이라는 상태 텍스트는 `Spinner`가 각자 맡는 역할 분리 패턴이다.
- **`Skeleton` primitive만으로 리스트/카드 합성**: 별도 `SkeletonListItem`/`SkeletonCard` 컴포넌트를 새로 만들지 않고, 기본 `Skeleton`을 `flex` 컨테이너 안에 여러 개(`circle` + `text`×2, 또는 `rect` + `text`×2) 배치해 재현하는 패턴이 `skeleton.stories.tsx`의 `ListItem`/`Card` 스토리에 정의돼 있다. 신규 화면에서 리스트/카드 로딩 placeholder가 필요하면 이 두 스토리를 그대로 참고해 조합하면 된다(단, 스토리 자체가 실제 화면 코드에서 재사용되는 컴포넌트는 아니며 패턴 예시임).
- **`ProgressBar`와의 조합 사례는 없음**: 두 컴포넌트가 같은 화면에서 함께 쓰이는 사례는 없다.

## Figma를 그대로 따르지 않는 부분

**Skeleton의 기준은 Figma 목업이 아니라 실제 구동되는 애니메이션이다.** Figma 쪽 그라디언트는 shape마다 핸들을 손으로 끈 값이라 각도·띠 굵기가 제각각이고, 비율이 8배 차이 나는 도형(226×157 vs 226×27)에 같은 각도와 같은 폭을 동시에 줄 수 없다. 아래 세 항목은 불일치가 아니라 의도된 차이다.

|           | 코드                                                                  | Figma                                              |
| --------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| 각도      | `135deg` 통일                                                         | `45°` / `115.5°` / `24.6°` (shape별)               |
| 띠 굵기   | 요소 폭에 비례하는 좁은 띠(stop `40/50/60` + `background-size: 200%`) | `222px` / `12.8px` / `35.8px`                      |
| stop 위치 | 띠가 좁아야 "지나가는 빛"으로 보인다                                  | 정지 목업이라 한 프레임을 넓은 그라데이션으로 표현 |

**그라디언트 색이 Figma에서 리터럴 hex인 것도 의도다.** Figma는 그라디언트 스톱에 변수를 바인딩할 수 없어 `#dbdbdb`를 직접 넣었다. 코드는 전용 primitive 토큰 `--gb-color-shimmer-gray`(같은 값, Skeleton 전용)로 받으므로 하드코딩이 아니다. 유사 토큰으로 대체하지 않는다 — 가장 가까운 `#e5e5e5`와 채널당 10 차이라 눈에 띄고, 공유 토큰이라 한쪽을 바꾸면 Skeleton이 함께 흔들린다.

## ⚠️ 확인 필요

없음.
