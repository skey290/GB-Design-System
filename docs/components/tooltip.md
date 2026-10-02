# Tooltip

Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=79-11350) — "Tooltip" 컴포넌트 페이지 (node-id `79:11350`)
코드: `components/ui/tooltip/tooltip.tsx`

> 참고: 사용자가 제공한 node-id `3042:539`("Tootip")는 `79:11350` 안에 중첩된 하위 프레임으로, "Braket position × Style" 24개 variant 인스턴스가 모여 있는 매트릭스일 뿐이다(`get_metadata`로 확인). 컴포넌트 설명(description) 텍스트와 최상위 컴포넌트 이름("Tooltip")은 부모 프레임 `79:11350`에 있으므로 이 문서의 대표 링크는 `79:11350`으로 잡았다. `tooltip.stories.tsx`의 `parameters.design.url` 역시 `79-11350`을 가리킨다.

## Overview

Figma 컴포넌트 설명(description) 필드 원문:

> "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."

즉 Figma 스펙상 Tooltip은 **키보드 포커스 또는 마우스 호버 시** 트리거 요소에 연결된 정보를 보여주는 팝업으로 명시돼 있다. 코드도 Radix `@radix-ui/react-tooltip`을 그대로 사용해 트리거에 `hover`/`focus` 이벤트가 걸리는 구조로 구현되어 있어 Figma 설명과 일치한다.

`get_metadata`로 확인한 실제 구조: `79:11350` 최상위 프레임 안에 (1) description 텍스트 프레임, (2) 단일 톤 베이스 컴포넌트 `Tool tip base`(node `3042:535`, `closeIcon`/`title1`/`title`/`description`/`description1` 5개 컴포넌트 프로퍼티 보유), (3) `Braket`(화살표) 심볼, (4) `Braket position × Style` 24개 variant 인스턴스 매트릭스(`3042:539` 프레임, position 12종 × Style 2종)가 들어있다.

### Tooltip vs Popover 구분

같은 코드베이스에 `components/ui/popover/popover.tsx`가 있어 혼동될 수 있으나, 실제로는 용도가 전혀 다르다(코드 확인):

|                 | **Tooltip**                                  | **Popover**(이 코드베이스의 실제 구현)                                                                                                  |
| --------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 기반 프리미티브 | `@radix-ui/react-tooltip`                    | `@radix-ui/react-alert-dialog`(!)                                                                                                       |
| 트리거 방식     | hover/focus (Figma description에 명시)       | 클릭 등으로 부모가 `open`/`onOpenChange`를 직접 제어하는 완전 제어형 — 자체 트리거 요소가 없음(`children`으로 트리거를 받지 않음)       |
| 배치            | 트리거에 앵커링(`side`/`align`, 화살표 포함) | 항상 화면 정중앙(`fixed top-1/2 left-1/2`) — 앵커 없음                                                                                  |
| Figma 상 정체   | "Tooltip" 컴포넌트(호버 정보 팝업)           | popover.tsx 코드 주석: Figma "Popover" 페이지(node-id `7269:451`)이지만 **실제 레이어명은 "Alert dialog"** — 확인/경고 모달에 더 가까움 |

정리하면, 이 프로젝트에서 "Popover"라는 이름의 컴포넌트는 실제로는 클릭 기반 확인 모달(alert dialog)이고, 마우스 호버로 여닫히는 일반적 의미의 "popover" 상호작용은 이 코드베이스에 존재하지 않는다 — 그 역할은 전부 `Tooltip`이 담당한다.

## When to use

- Figma description에 명시된 대로, 트리거 요소에 마우스 호버 또는 키보드 포커스가 갔을 때 보조 정보(제목/설명)를 짧게 보여줄 때.
- 실사용 예(코드 확인, 아래 조합 가이드 참고): 컴퍼스 다이얼의 온보딩 코치마크 — 특정 눈금 라벨이나 성장률 배지에 "항상 열린" 상태로 붙여 안내 문구를 보여주는 용도로 재사용되고 있다.

## When not to use

⚠️ 확인 필요 — Figma description/코드 어디에도 "이런 경우엔 쓰지 말 것"이 명시돼 있지 않음. 다만 위 "Tooltip vs Popover" 구분에 따라, 클릭으로 열고 화면 중앙에 확인/경고를 띄워야 하는 경우는 `Tooltip`이 아니라 `Popover`를 써야 한다.

## How to use

`tooltip.stories.tsx`에서 그대로 인용:

```tsx
import { Tooltip } from "./tooltip";

// 기본(default, dark) — 700ms 지연이 기본이나 스토리/테스트에서는 0으로 고정
<Tooltip title="Title" description="Tool tip text" delayDuration={0}>
  <button type="button">Hover me</button>
</Tooltip>

// Inversed(light) variant
<Tooltip variant="inversed" title="Title" description="Tool tip text">
  <button type="button">Hover me</button>
</Tooltip>

// title만 / description만
<Tooltip title="Title only">
  <button type="button">Hover me</button>
</Tooltip>
<Tooltip description="Description only">
  <button type="button">Hover me</button>
</Tooltip>

// 닫기(X) 버튼 포함 — onClose를 전달할 때만 렌더링됨
<Tooltip title="Title" description="Tool tip text" onClose={() => {}}>
  <button type="button">Hover me</button>
</Tooltip>

// 방향 지정 (Below/Left) — 항상 열린 상태로 스토리 확인
<Tooltip variant="default" side="bottom" align="start" open>
  <button type="button">Hover me</button>
</Tooltip>
```

## Structure

- `TooltipPrimitive.Provider`(delayDuration 전달) → `Root`(제어/비제어 겸용: `open`/`defaultOpen`/`onOpenChange`) → `Trigger`(`asChild`로 `children`을 그대로 트리거 요소로 사용) → `Portal` → `Content`.
- `Content` 내부:
  - `title`/`description` 중 하나라도 있으면(`hasBody`) `<div>` 래퍼 안에 `title`(있을 때만, `text-sm-semi-bold`)과 `description`(있을 때만, `text-sm-regular`)을 세로로 배치.
  - `onClose`가 전달됐을 때만 우측 상단에 닫기(X) 아이콘 `<button>` 렌더링(`aria-label="Close tooltip"`).
  - `TooltipPrimitive.Arrow`를 `asChild`로 받아 10px 정사각형을 45도 회전시킨 다이아몬드 모양(`Braket`)으로 커스텀 렌더링.
- 좌우 padding이 비대칭(`pl-[var(--spacing-4)]` / `pr-[var(--spacing-8)]`)이다 — 우측은 좌측 padding(16px) + 닫기 아이콘 너비(16px)만큼 **닫기 버튼 유무와 무관하게 항상** 여유 공간을 확보한다(코드 주석에 명시된 의도, Figma 24-variant 매트릭스 전수 확인 결과 확정값).

## Props

| Prop               | 타입                                                                  | 필수   | 기본값              | 설명                                                                                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------- | ------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`         | `React.ReactNode`                                                     | 예     | —                   | 툴팁을 트리거하는 요소(hover/focus 대상). `asChild`로 트리거에 그대로 적용됨                                                                                                                                |
| `title`            | `React.ReactNode`                                                     | 아니오 | —                   | 툴팁 제목. falsy면 렌더링 안 됨 — Figma `title1`(boolean) 토글에 대응                                                                                                                                       |
| `description`      | `React.ReactNode`                                                     | 아니오 | —                   | 툴팁 설명. falsy면 렌더링 안 됨 — Figma `description`(boolean) 토글에 대응                                                                                                                                  |
| `variant`          | `"default" \| "inversed"`                                             | 아니오 | `"default"`         | Figma `Style` 프로퍼티(Default/Inversed)에 대응                                                                                                                                                             |
| `side`             | `"top" \| "right" \| "bottom" \| "left"`                              | 아니오 | `"top"`             | Figma `Braket position`의 1차 방향 축에 대응(정확한 매핑은 Variants 참고)                                                                                                                                   |
| `align`            | `"start" \| "center" \| "end"`                                        | 아니오 | `"center"`          | Figma `Braket position`의 2차 정렬 축에 대응                                                                                                                                                                |
| `sideOffset`       | `number`                                                              | 아니오 | Radix 기본값        | Radix `Content`로 그대로 전달                                                                                                                                                                               |
| `alignOffset`      | `number`                                                              | 아니오 | Radix 기본값        | Radix `Content`로 그대로 전달                                                                                                                                                                               |
| `collisionPadding` | `number \| Partial<Record<"top"\|"right"\|"bottom"\|"left", number>>` | 아니오 | `12`                | 뷰포트 경계 충돌 방지 여백. **Figma 실측값 아님** — Figma는 정적 목업이라 화면 경계 충돌을 표현하지 않으므로, `--spacing-3`(12px)에 대응하는 값을 레이아웃 방어용 기본값으로 둔 것(사용자 확인, 2026-09-29) |
| `onClose`          | `() => void`                                                          | 아니오 | —                   | 전달 시에만 닫기(X) 버튼 렌더링 — Figma `closeIcon`(boolean) 토글에 대응                                                                                                                                    |
| `open`             | `boolean`                                                             | 아니오 | —                   | 제어형 open 상태                                                                                                                                                                                            |
| `defaultOpen`      | `boolean`                                                             | 아니오 | —                   | 비제어형 초기 open 상태                                                                                                                                                                                     |
| `onOpenChange`     | `(open: boolean) => void`                                             | 아니오 | —                   | open 상태 변경 콜백                                                                                                                                                                                         |
| `delayDuration`    | `number`                                                              | 아니오 | Radix 기본값(700ms) | 트리거 진입 후 열리기까지 지연 시간(ms)                                                                                                                                                                     |
| `className`        | `string`                                                              | 아니오 | —                   | `Content`에 추가로 병합되는 클래스                                                                                                                                                                          |

## Variants

### Style (색상) — `variant`

Figma `Style` 프로퍼티는 `Default`/`Inversed` 2종. `get_design_context`로 실측 확인:

| variant           | 배경                                          | 텍스트                       | 화살표                            |
| ----------------- | --------------------------------------------- | ---------------------------- | --------------------------------- |
| `default`(기본값) | `bg-primary`(다크 리터럴, Figma 값 `#171717`) | `text-primary-foreground`    | `bg-primary`와 동일 색            |
| `inversed`        | `var(--tooltip-inversed-bg)`                  | `var(--tooltip-inversed-fg)` | `--tooltip-inversed-bg`와 동일 색 |

`--tooltip-inversed-bg: #e5e5e5` / `--tooltip-inversed-fg: #171717`는 `app/globals.css`에 리터럴 hex로 고정 정의돼 있다. Figma에서 Inversed variant가 참조하는 변수(`--background-bold`, `--text-invert`)의 실제 resolve 값도 각각 `#e5e5e5`/`#171717`로 동일하게 확인됨(`get_design_context` 실측) — 즉 앱 라이트/다크 테마 전환과 무관하게 **항상 이 리터럴 값으로 고정**되도록 의도적으로 별도 토큰을 둔 것이며, 코드 주석에도 "다크모드 resolve값으로 고정"이라고 명시돼 있다. 일반적인 "하드코딩 금지" 위반이 아니라 Figma가 의도적으로 테마 비연동 고정값을 쓰는 사례로 확인됨.

### Braket position (방향) — `side` + `align`

Figma에는 `Braket position`(12종: BottomLeft/BottomCenter/BottomRight/TopLeft/TopCenter/TopRight/LeftTop/LeftCenter/LeftBottom/RightTop/RightCenter/RightBottom) × `Style`(2종) = 24개 variant 매트릭스가 있다(`3042:539` 프레임, 코드 주석의 "24-variant 매트릭스 전수 재확인"과 일치).

`get_design_context`로 3개 표본(BottomLeft, TopLeft, RightTop)을 직접 대조한 결과, Figma의 1차 방향 단어(Bottom/Top/Left/Right)는 **"화살표가 박스의 어느 변에 붙어 있는지"** 를 가리키며, Radix `side`(콘텐츠가 트리거의 어느 쪽에 나타나는지)와는 반대 방향으로 대응한다:

| Figma `Braket position` 1차 단어 | 실측 결과(박스↔화살표 배치)                                                           | 대응하는 `side` |
| -------------------------------- | ------------------------------------------------------------------------------------- | --------------- |
| `Bottom...` (예: BottomLeft)     | 박스가 위, 화살표가 박스 아래쪽에 붙음(화살표가 아래를 가리킴 → 트리거가 아래에 있음) | `top`           |
| `Top...` (예: TopLeft)           | 박스가 아래, 화살표가 박스 위쪽에 붙음                                                | `bottom`        |
| `Right...` (예: RightTop)        | 박스가 왼쪽, 화살표가 박스 오른쪽에 붙음                                              | `left`          |
| `Left...`                        | (RightTop과 대칭 구조로 추정, 개별 조회로 재확인하지 않음)                            | `right`(추정)   |

2차 단어(Left/Center/Right 또는 Top/Center/Bottom, `align`에 대응 추정)는 이번 조사에서 개별 노드 좌표까지 대조하지 않아 정확한 대응(및 방향 반전 여부)을 확정하지 못했다 — 아래 ⚠️ 확인 필요 참고.

## States and behaviors

- **열림/닫힘**: hover 또는 focus 시 `delayDuration` 이후 열림(Figma description의 "keyboard focus or mouse hovers" 그대로). `open`/`defaultOpen`/`onOpenChange`로 제어/비제어 모두 가능 — 코드에서는 `open` prop을 고정 전달해 "항상 열린" 코치마크 용도로도 쓰인다(조합 가이드 참고).
- **title/description 단독 표시**: 각각 독립적으로 켜고 끌 수 있음(둘 다 optional, `hasBody`가 false면 본문 자체가 렌더링 안 됨).
- **닫기 버튼**: `onClose`를 전달할 때만 나타나며, 클릭 시 `onClose` 콜백만 호출한다 — 열림 상태(`open`) 자체를 자동으로 바꾸지 않음(제어형일 때는 호출부가 `onOpenChange`/`open`도 함께 관리해야 함).
- **collisionPadding**: 뷰포트 경계 근처에서 Radix가 자동 flip/shift — Figma 목업엔 없는 순수 방어 로직(위 Props 설명 참고).

## 다른 범용 컴포넌트와의 조합 가이드

실제 코드 사용처(`grep -rn "from '@/components/ui/tooltip'" app/ components/`) 기준 — 현재는 모두 `components/compass/` 하위 2곳뿐이며, 둘 다 "온보딩 코치마크"라는 동일한 패턴으로 쓰인다:

- **CompassDialTick** (`components/compass/ui/compass-dial-tick/compass-dial-tick.tsx`): `coachmark` prop이 전달되면 눈금 라벨(텍스트 또는 `Badge` 마커)을 `Tooltip`(`variant="inversed"`, `open` 항상 true, `side="right"` `align="start"` 고정)으로 감싼다. `coachmark.onDismiss`가 있으면 `onClose`로 그대로 연결돼 닫기 버튼이 뜬다.
- **CompassGrowthAvatar** (`components/compass/ui/compass-growth-avatar/compass-growth-avatar.tsx`): 성장률 퍼센트 `Badge`를 동일한 패턴(`variant="inversed"`, `open`, `side="right"`, `align="start"`)의 `Tooltip`으로 감싼다. 코드 주석에 따르면 이 배지 자체가 Figma 실측(node `...;8003:11120;8003:10867`)으로 확인된 코치마크 앵커다.

공통 패턴: 두 조합 모두 (1) 다른 범용 컴포넌트(`Badge` 또는 라벨 텍스트)를 `children`으로 감싸는 **래퍼 전용** 용도로만 쓰이고, (2) hover 트리거를 쓰지 않고 `open`을 강제로 true로 고정해 "상시 노출되는 온보딩 안내"로 용도를 확장하며, (3) `variant="inversed"` + `side="right"`/`align="start"` 조합을 그대로 재사용한다. 두 사용처 모두 아직 `title`/`description`을 hover 기반 보조설명 용도(Figma 원래 의도)로 쓰는 사례는 없다.

## ⚠️ 확인 필요

- **`Braket position` 2차 축(Left/Center/Right, Top/Center/Bottom) ↔ `align` 정확한 대응 미확정**: 1차 방향(Top/Bottom/Left/Right ↔ `side`, 반대 방향으로 대응)은 3개 표본(BottomLeft/TopLeft/RightTop) 실측으로 확인했으나, 2차 단어가 `align="start"/"center"/"end"` 중 무엇에 대응하는지, 그리고 1차 축처럼 방향이 반전되는지는 개별 노드 좌표까지 대조하지 않아 확정하지 못했다. `LeftTop`도 대칭 구조로 추정만 했고 별도 조회는 하지 않았다. 정확한 매핑이 필요하면 24개 노드 전수(또는 최소 Center/Right 계열 포함 추가 표본)를 `get_design_context`로 재조회 권장.
- **"When not to use" 근거 부족**: Figma description에는 hover/focus 트리거라는 사실만 있고 "이럴 땐 쓰지 마라"는 명시가 없음. `Popover`(Alert dialog 기반)와의 역할 구분으로 대체 기술함.
- **실사용 2건 모두 hover 트리거 대신 `open` 강제 고정 패턴**: Figma 원본 의도(hover 시 보조정보)로 `Tooltip`을 쓰는 코드 사용처가 아직 없어, 일반적인 hover 툴팁 용도의 실제 조합 예시는 이번 조사에서 확인하지 못했다(스토리북 스토리에는 있음).
