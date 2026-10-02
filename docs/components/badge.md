# Badge

Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=665-2024) · node-id `665:2024`
코드: `components/ui/badge/badge.tsx`

## Overview

작은 라벨/카운트/상태 표시용 인라인 컴포넌트. `<span>` 기반이며, 텍스트(children)와 선택적 아이콘 슬롯(`icon`)을 좌우로 배치한다. Figma "Badge" 컴포넌트 프레임에는 `Type`(색상 variant)과 `Size`(20/28) 두 축의 variant 세트가 있으며, Figma 컴포넌트 자체에 별도 description 필드는 없음(get_metadata 응답에 description 텍스트 없음).

Figma에 정의된 `Type` variant는 `default / reverse / alarm / destructive / disabled / outline` 6종뿐이다. 코드의 `success` variant는 Figma "Badge" 컴포넌트에는 존재하지 않고, `alarm`과 동일한 형태(투명 배경 + inset border)에 success 색상 토큰만 다르게 매핑한 코드 전용 확장이다(badge.tsx 주석 및 Figma metadata 대조로 확인, node-id 8003:12444 "❄️ GB_Compass" 파일의 "+0.2pp" 델타 배지 용도로 2026-09-28 추가).

## When to use

- 짧은 라벨, 카운트, 상태/델타 값을 한 줄 텍스트로 강조 표시할 때 (실사용 예: 탭 옆 카운트, 히스토리 항목 태그, 페르소나 선택 칩, 성장률/증감 표시).
- 텍스트 옆에 작은 아이콘 하나를 함께 보여줘야 할 때 (`icon` prop, size 10 스케일로 고정 렌더링).
- 클릭 가능한 토글/선택 요소로 쓸 때도 가능 — `onClick` 등 나머지 HTML span 속성이 모두 forward됨(`persona-radial-chart.tsx`에서 `onClick`으로 선택 가능한 배지로 사용).

## When not to use

⚠️ 확인 필요 — Figma/코드에서 "이런 경우엔 쓰지 말 것"을 명시한 근거를 찾지 못함. (버튼 대체 용도로 clickable하게 쓰는 사례가 실제 존재하므로 "인터랙션 요소로 쓰면 안 된다"고 단정할 근거 없음.)

## How to use

`badge.stories.tsx`에서 그대로 인용:

```tsx
// 기본 사용
<Badge variant="default">Badge</Badge>

// Success 델타 배지 (Figma Compass 전용 확장)
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
- 아이콘 슬롯: `icon`이 있을 때만 `<span aria-hidden="true">`로 감싸 렌더링, 고정 크기 `size-[calc(var(--scale-10)*1px)]`
- children: 아이콘 뒤에 그대로 렌더링

## Props

| Prop       | 타입                                                                                         | 필수   | 기본값      | 설명                                                                                                                                                                |
| ---------- | -------------------------------------------------------------------------------------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`  | `"default" \| "reverse" \| "outline" \| "disabled" \| "alarm" \| "success" \| "destructive"` | 아니오 | `"outline"` | 색상/상태 variant. `success`는 Figma에 없는 코드 전용 확장(위 Overview 참고)                                                                                        |
| `size`     | `"20" \| "28"`                                                                               | 아니오 | `"20"`      | 배지 높이. Figma `Size` 프로퍼티 값 그대로 문자열 사용                                                                                                              |
| `icon`     | `React.ReactNode`                                                                            | 아니오 | —           | 라벨 앞 아이콘 슬롯. Figma의 `leadingIcon`/`leadingIcon1`에 대응. Figma엔 size=20에서만 정의돼 있으나 코드에서는 두 사이즈 모두 허용하도록 일반화됨(badge.tsx 주석) |
| `children` | `React.ReactNode`                                                                            | 예     | —           | 배지 라벨 텍스트                                                                                                                                                    |
| ...props   | `React.HTMLAttributes<HTMLSpanElement>`                                                      | 아니오 | —           | `onClick`, `className`, `data-*` 등 span 표준 속성 모두 forward                                                                                                     |

## Variants

### Type (색상)

| variant                             | 배경                              | 텍스트                    | 보더                           |
| ----------------------------------- | --------------------------------- | ------------------------- | ------------------------------ |
| `default`                           | `var(--background-bold)`          | `var(--text-invert)`      | 없음                           |
| `reverse`                           | `var(--background-default)`       | `var(--text-default)`     | inset, `var(--border-bolder)`  |
| `outline` (기본값)                  | 투명                              | `var(--text-subtle)`      | inset, `var(--border-muted)`   |
| `disabled`                          | `var(--background-disabled)`      | `var(--text-static-gray)` | inset, `var(--border-overlay)` |
| `alarm`                             | 투명                              | `var(--text-warning)`     | inset, `var(--border-warning)` |
| `success` (Figma에 없음, 코드 전용) | 투명                              | `var(--text-success)`     | inset, `var(--border-success)` |
| `destructive`                       | `var(--background-error-default)` | `var(--text-default)`     | 없음                           |

보더는 실제 `border` 대신 inset `box-shadow`로 구현되어 있다 — 레이아웃 공간을 차지하지 않아 variant 간 높이가 완전히 동일하게 유지된다(badge.tsx 주석에 명시된 의도).

### Size

| size          | 높이 토큰                   | 좌우 패딩            | 타이포그래피     |
| ------------- | --------------------------- | -------------------- | ---------------- |
| `20` (기본값) | `calc(var(--scale-20)*1px)` | `var(--spacing-1-5)` | `text-xs-medium` |
| `28`          | `calc(var(--scale-28)*1px)` | `var(--spacing-3)`   | `text-sm-medium` |

### Compound variant

- `destructive` variant는 size에 관계없이 semibold 타이포그래피(`text-xs-semi-bold` / `text-sm-semi-bold`)를 쓴다. 나머지 6개 variant는 medium(`text-xs-medium` / `text-sm-medium`)을 쓴다. (Figma 스펙, badge.tsx 주석 및 badge.test.tsx `"uses semibold typography only for the destructive variant"` 테스트로 확인)

## States and behaviors

- Variant 자체에 hover/focus/active 상태 스타일은 정의돼 있지 않음(코드에 없음 — 배지를 클릭 가능하게 쓰는 소비 컴포넌트 쪽에서 `cursor-pointer` 등을 직접 추가, 아래 조합 가이드 참고).
- `disabled` variant는 시각적 스타일(회색 배경/텍스트/보더)만 제공하며, 실제 `disabled` HTML 속성이나 `pointer-events-none` 등 인터랙션 차단 로직은 Badge 자체에 없음 — 코드 사용처(`tabs.tsx`)에서는 `item.disabled`일 때 Badge를 아예 렌더링하지 않는 방식으로 처리.
- 아이콘 래퍼는 `aria-hidden="true"`가 항상 붙는다(장식용으로 취급).

## 다른 범용 컴포넌트와의 조합 가이드

실제 코드 사용처(`grep -rn "from.*ui/badge" app/ components/`) 기준:

- **Tabs** (`components/ui/tabs/tabs.tsx`): 탭 라벨 옆 카운트 표시. `count`가 숫자이고 `disabled`가 아닐 때만 렌더링. `variant={selected ? "default" : "outline"}`로 선택 상태에 배지 색을 연동.
- **NotiDropdown** (`components/ui/noti-dropdown/noti-dropdown.tsx`): 컴포넌트 주석에 "Tabs/Badge를 그대로 재사용"이라고 명시 — Tabs를 통해 간접적으로 Badge를 재사용(헤더의 All/Unread 탭 + 카운트).
- **AssetHistoryDrawer** (`components/ui/asset-history-drawer/asset-history-drawer.tsx`): 히스토리 리스트 항목 맨 앞에 `variant="outline"` 고정으로 태그처럼 사용, 라벨/타임스탬프 텍스트와 나란히 배치.
- **PersonaRadialChart** (`components/dashboard/ui/persona-radial-chart/persona-radial-chart.tsx`): 클릭 가능한 선택 칩으로 사용 — `onClick`을 그대로 Badge에 전달하고 `emphasized` 여부에 따라 `default`/`outline`을 토글. 비선택 상태에서는 Badge의 기본 outline 색 대신 `text-muted-foreground` + `shadow-[inset_0_0_0_var(--border-1)_var(--color-muted-foreground)]`로 직접 오버라이드(⚠️ 확인 필요 항목 참고). 상태 전환에 커스텀 페이드 트랜지션 클래스(`BADGE_TRANSITION`, `FADE_IN`)를 `className`으로 추가.
- **CompassDialTick** (`components/compass/ui/compass-dial-tick/compass-dial-tick.tsx`): 다이얼 눈금 라벨로 사용, `muted` 여부에 따라 `outline`/`default` 토글, `size="20"` 고정, 회전 transform이 걸린 wrapper 안에 배치.
- **CompassGrowthAvatar** (`components/compass/ui/compass-growth-avatar/compass-growth-avatar.tsx`): 아바타 링 위에 성장률(%) 표시. `showEstimateStyling` 여부로 `alarm`/`reverse` variant 토글.
- **CompassMetricCard** (`components/compass/ui/compass-metric-card/compass-metric-card.tsx`): 카드 헤더 우측에 `variant="outline" size="20"` 고정으로 라벨 표시.
- **CompassDetailView** (`components/compass/ui/compass-detail-view/compass-detail-view.tsx`): 통계 델타(증감) 표시. `BadgeProps["variant"]`를 `Extract`로 좁혀 `"success" | "alarm"`만 허용하는 자체 타입(`CompassDetailViewPostStatDelta["variant"]`)을 정의 — Badge의 타입을 재사용해 소비 컴포넌트 쪽 prop을 제한하는 패턴.

공통 패턴: Badge는 항상 "값/상태에 따라 variant를 두 갈래(default↔outline, alarm↔reverse 등)로 토글"하는 방식으로 조합되며, 커스텀 색이 필요하면 `className`으로 Tailwind 임의값이 아닌 다른 `var(--...)` 토큰을 덮어쓰는 방식을 쓴다(PersonaRadialChart 사례).

## ⚠️ 확인 필요

- **"When not to use" 근거 없음**: Figma/코드 어디에도 배지를 쓰면 안 되는 경우가 명시돼 있지 않음. 인터랙션 요소(버튼 대체)로 쓰는 실사용 사례(PersonaRadialChart)가 있어 "클릭 불가 텍스트 전용"이라고 단정할 수도 없음.
- **`success` variant는 Figma "Badge" 컴포넌트(node-id 665:2024)에 없음**: get_metadata로 확인한 6개 Type(`default/reverse/alarm/destructive/disabled/outline`) 중에 `success`가 없음. badge.tsx 주석은 다른 Figma 프레임(node-id 8003:12444, "❄️ GB_Compass" 파일)의 "+0.2pp" 델타 배지를 근거로 든다고 밝히고 있으나, 이 문서 작성자는 해당 노드를 직접 조회해 재검증하지 않았음 — 필요 시 8003:12444를 별도 조회해 실제로 success 색상 스펙이 맞는지 교차검증 권장.
- **PersonaRadialChart의 `--color-muted-foreground` 토큰**: Badge 자체 variant가 쓰는 네이밍(`--background-*`, `--text-*`, `--border-*`)과 다른 네이밍 체계(`--color-muted-foreground`, shadcn 계열)를 소비처에서 오버라이드에 사용 중. 실재하는 토큰(`app/globals.css`에 정의됨)이라 하드코딩은 아니지만, 두 네이밍 체계가 혼용되는 이유/의도가 문서화돼 있지 않음.
- **`disabled` variant의 실제 비활성화 로직 부재**: Badge 컴포넌트 자체는 시각 스타일만 제공하고 클릭 차단 등은 하지 않음 — 향후 Badge를 단독으로 클릭 가능하게 쓰는 새 화면에서 `variant="disabled"`만 지정하고 `onClick` 차단을 빠뜨리는 실수가 나올 수 있어 보임(추정 — 실제 버그 사례는 아직 없음).
