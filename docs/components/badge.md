# Badge

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=665-2024) · node-id `665:2024`
코드: `components/ui/badge/badge.tsx`

## Overview

작은 라벨/카운트/상태 표시용 인라인 컴포넌트. `<span>` 기반이며, 텍스트(children)와 선택적 아이콘 슬롯(`icon`)을 좌우로 배치한다.

Figma 컴포넌트 설명(description) 필드 원문:

> A small inline label for displaying a count, status, or short delta value. Style sets the colour role, and Size (20/28) scales both the label and the leading icon. Purely a passive display element — for a clickable, selectable, or deletable pill, use Chips instead.

축은 `Style`(색상, 6개)과 `Size`(20/28) 두 개이고 축 곱 12개가 모두 그려져 있다. `Status` 축은 없다 — 즉 `disabled` 상태 variant가 없고, 코드에도 없어 양쪽이 일치한다.

## When to use

- 짧은 라벨, 카운트, 상태/델타 값을 한 줄 텍스트로 강조 표시할 때 (실사용 예: 탭 옆 카운트, 히스토리 항목 태그, 페르소나 선택 칩, 성장률/증감 표시).
- 텍스트 옆에 작은 아이콘 하나를 함께 보여줘야 할 때 (`icon` prop, `size`에 따라 10×10/14×14).
- 클릭 가능한 토글/선택 요소로 쓸 때도 가능 — `onClick` 등 나머지 HTML span 속성이 모두 forward됨(`persona-radial-chart.tsx`에서 `onClick`으로 선택 가능한 배지로 사용).

## When not to use

Figma description이 명시한다 — **클릭·선택·삭제가 가능한 알약형 UI가 필요하면 Badge가 아니라 [Chips](./chips.md)를 쓴다.** Badge는 선택 상태를 갖지 않는 수동 표시 요소다.

단 코드는 `onClick` 등 span 표준 속성을 모두 forward하므로 기술적으로는 클릭 가능하게 쓸 수 있고, `persona-radial-chart.tsx`가 실제로 그렇게 쓰고 있다. 새로 만드는 화면에서 선택 가능한 알약이 필요하면 Chips를 먼저 검토한다.

## How to use

`badge.stories.tsx`에서 그대로 인용:

```tsx
// 기본 사용
<Badge variant="default">Badge</Badge>

// Success 델타 배지
<Badge variant="success">+0.2pp</Badge>

// destructive — semibold 타이포그래피 자동 적용
<Badge variant="destructive">Badge</Badge>

// size 28
<Badge variant="default" size="28">Badge</Badge>

// 아이콘 슬롯
<Badge
  variant="default"
  icon={
    <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <circle cx="5" cy="5" r="4" stroke="currentColor" strokeDasharray="2 2" />
    </svg>
  }
>
  Badge
</Badge>
```

## Structure

- 루트: `<span>` (`React.HTMLAttributes<HTMLSpanElement>`를 그대로 extend, 나머지 props는 spread로 forward)
- 아이콘 슬롯: `icon`이 있을 때만 `<span aria-hidden="true">`로 감싸 렌더링. `size=20`이면 `size-[10px]`, `size=28`이면 `size-[14px]`
- children: 아이콘 뒤에 그대로 렌더링

## Props

| Prop       | 타입                                                                           | 필수   | 기본값      | 설명                                                                                      |
| ---------- | ------------------------------------------------------------------------------ | ------ | ----------- | ----------------------------------------------------------------------------------------- |
| `variant`  | `"default" \| "reverse" \| "outline" \| "alarm" \| "success" \| "destructive"` | 아니오 | `"outline"` | 색상 variant. Figma `Style` 축 6개 값과 1:1 대응                                          |
| `size`     | `"20" \| "28"`                                                                 | 아니오 | `"20"`      | 배지 높이. Figma `Size` 프로퍼티 값 그대로 문자열 사용                                    |
| `icon`     | `React.ReactNode`                                                              | 아니오 | —           | 라벨 앞 아이콘 슬롯. Figma `leadingIcon`에 대응. `size=20`이면 10×10, `size=28`이면 14×14 |
| `children` | `React.ReactNode`                                                              | 예     | —           | 배지 라벨 텍스트                                                                          |
| ...props   | `React.HTMLAttributes<HTMLSpanElement>`                                        | 아니오 | —           | `onClick`, `className`, `data-*` 등 span 표준 속성 모두 forward                           |

## Variants

### Style (색상)

| variant            | 배경                                 | 텍스트                   | 보더                              |
| ------------------ | ------------------------------------ | ------------------------ | --------------------------------- |
| `default`          | `var(--gb-background-bold)`          | `var(--gb-text-invert)`  | 없음                              |
| `reverse`          | `var(--gb-background-default)`       | `var(--gb-text-default)` | inset, `var(--gb-border-bolder)`  |
| `outline` (기본값) | 투명                                 | `var(--gb-text-subtle)`  | inset, `var(--gb-border-muted)`   |
| `alarm`            | 투명                                 | `var(--gb-text-warning)` | inset, `var(--gb-border-warning)` |
| `success`          | 투명                                 | `var(--gb-text-success)` | inset, `var(--gb-border-success)` |
| `destructive`      | `var(--gb-background-error-default)` | `var(--gb-text-default)` | 없음                              |

보더는 실제 `border` 대신 inset `box-shadow`로 구현되어 있다 — 레이아웃 공간을 차지하지 않아 variant 간 높이가 완전히 동일하게 유지된다(badge.tsx 주석에 명시된 의도).

### Size

| size          | 높이 토큰  | 좌우 패딩               | 타이포그래피     |
| ------------- | ---------- | ----------------------- | ---------------- |
| `20` (기본값) | `h-[20px]` | `var(--gb-spacing-1-5)` | `text-xs-medium` |
| `28`          | `h-[28px]` | `var(--gb-spacing-3)`   | `text-sm-medium` |

### Compound variant

- `destructive` variant는 size에 관계없이 semibold 타이포그래피(`text-xs-semi-bold` / `text-sm-semi-bold`)를 쓴다. 나머지 5개 variant는 medium(`text-xs-medium` / `text-sm-medium`)을 쓴다. (badge.test.tsx의 `"uses semibold typography only for the destructive variant"` 테스트로 고정)

## States and behaviors

- 상태 축이 없다 — hover/focus/active/disabled 스타일이 Figma에도, 코드에도 정의돼 있지 않다. 배지를 클릭 가능하게 쓰는 소비 컴포넌트 쪽에서 `cursor-pointer` 등을 직접 추가한다(아래 조합 가이드 참고).
- 비활성 맥락에서는 Badge에 상태를 주는 대신 **렌더링 자체를 생략**한다 — `tabs.tsx`가 `item.disabled`일 때 Badge를 그리지 않는 방식.
- 아이콘 래퍼는 `aria-hidden="true"`가 항상 붙는다(장식용으로 취급).

## 다른 범용 컴포넌트와의 조합 가이드

실제 코드 사용처:

- **Tabs** (`components/ui/tabs/tabs.tsx`): 탭 라벨 옆 카운트 표시. `count`가 숫자이고 `disabled`가 아닐 때만 렌더링. `variant={selected ? "default" : "outline"}`로 선택 상태에 배지 색을 연동.
- **NotiDropdown** (`components/app/noti-dropdown/noti-dropdown.tsx`): 컴포넌트 주석에 "Tabs/Badge를 그대로 재사용"이라고 명시 — Tabs를 통해 간접적으로 Badge를 재사용(헤더의 All/Unread 탭 + 카운트).
- **AssetHistoryDrawer** (`components/app/asset-history-drawer/asset-history-drawer.tsx`): 히스토리 리스트 항목 맨 앞에 `variant="outline"` 고정으로 태그처럼 사용, 라벨/타임스탬프 텍스트와 나란히 배치.
- **PersonaRadialChart** (`components/dashboard/ui/persona-radial-chart/persona-radial-chart.tsx`): 클릭 가능한 선택 칩으로 사용 — `onClick`을 그대로 Badge에 전달하고 `emphasized` 여부에 따라 `default`/`outline`을 토글. 비선택 상태에서는 Badge의 기본 outline 색 대신 `text-muted-foreground` + `shadow-[inset_0_0_0_var(--gb-border-1)_var(--color-muted-foreground)]`로 직접 오버라이드. 상태 전환에 커스텀 페이드 트랜지션 클래스(`BADGE_TRANSITION`, `FADE_IN`)를 `className`으로 추가.
- **CompassDialTick** (`components/compass/ui/compass-dial-tick/compass-dial-tick.tsx`): 다이얼 눈금 라벨로 사용, `muted` 여부에 따라 `outline`/`default` 토글, `size="20"` 고정, 회전 transform이 걸린 wrapper 안에 배치.
- **CompassGrowthAvatar** (`components/compass/ui/compass-growth-avatar/compass-growth-avatar.tsx`): 아바타 링 위에 성장률(%) 표시. `showEstimateStyling` 여부로 `alarm`/`reverse` variant 토글.
- **CompassMetricCard** (`components/compass/ui/compass-metric-card/compass-metric-card.tsx`): 카드 헤더 우측에 `variant="outline" size="20"` 고정으로 라벨 표시.
- **CompassDetailView** (`components/compass/ui/compass-detail-view/compass-detail-view.tsx`): 통계 델타(증감) 표시. `BadgeProps["variant"]`를 `Extract`로 좁혀 `"success" | "alarm"`만 허용하는 자체 타입(`CompassDetailViewPostStatDelta["variant"]`)을 정의 — Badge의 타입을 재사용해 소비 컴포넌트 쪽 prop을 제한하는 패턴.

공통 패턴: Badge는 항상 "값/상태에 따라 variant를 두 갈래(default↔outline, alarm↔reverse 등)로 토글"하는 방식으로 조합되며, 커스텀 색이 필요하면 `className`으로 Tailwind 임의값이 아닌 다른 `var(--...)` 토큰을 덮어쓰는 방식을 쓴다(PersonaRadialChart 사례).

## ⚠️ 확인 필요

없음.

## 아이콘 색은 Figma에 정의돼 있지 않다

12개 variant 전부 같은 placeholder 인스턴스(`lucide/circle-dashed`, `4063:4787`) 하나를 쓰고, 색 오버라이드가 없다. 즉 **Figma에는 variant별 아이콘 색이 존재하지 않는다** — 코드가 아이콘 색을 배지 텍스트 색에 상속시키는 것이 Figma와 어긋나지 않는다.

보더는 색·굵기 모두 변수에 바인딩돼 있다 — 색은 Style별(`border/muted`·`border/bolder`·`border/warning`·`border/success`), 굵기는 공통 `stroke/1`. `default`/`destructive`는 보더가 없다.
