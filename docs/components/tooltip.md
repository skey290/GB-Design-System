# Tooltip

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=79-11350) — "Tooltip" 컴포넌트 페이지 (node-id `79:11350`)
코드: `components/ui/tooltip/tooltip.tsx`

> 참고: 컴포넌트셋은 `3042:539`이고, 이 문서가 대표 링크로 쓰는 `79:11350`은 그것을 담고 있는 페이지 프레임이다. `tooltip.stories.tsx`의 `parameters.design.url`도 `79-11350`을 가리킨다.

## Overview

Figma 컴포넌트 설명(description) 필드 원문:

> A small floating hint that appears when its target is hovered or receives keyboard focus. It holds a short line of text and an arrow pointing at the target; Arrow position sets which side the arrow sits on. Use Popover when the content needs controls or more than a sentence.

코드도 Radix `@radix-ui/react-tooltip`을 그대로 사용해 트리거에 `hover`/`focus` 이벤트가 걸리는 구조라 Figma 설명과 일치한다.

페이지 프레임 `79:11350` 안의 실제 구조: (1) 설명 텍스트 프레임, (2) 단일 톤 베이스 컴포넌트 `Tool tip base`(node `3042:535`, `closeIcon`/`title1`/`title`/`description`/`description1` 5개 컴포넌트 프로퍼티 보유), (3) `Arrow`(화살표) 심볼, (4) `Arrow position × Style` 24개 variant 매트릭스(`3042:539` 컴포넌트셋, position 12종 × Style 2종).

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

- **컨트롤이 들어가거나 한 문장을 넘는 내용** → Figma description이 명시한다. `Tooltip`이 아니라 [Popover](./popover.md)를 쓴다. Tooltip은 짧은 힌트 한 줄 전용이다.
- **클릭으로 열고 확인/취소 응답을 받아야 하는 경우** → 역시 `Popover`(실제로는 alert dialog)다.

## How to use

`tooltip.stories.tsx`에서 그대로 인용:

```tsx
import { Tooltip } from "./tooltip";

// 기본(default, dark) — 700ms 지연이 기본이나 스토리/테스트에서는 0으로 고정
<Tooltip title="Title" description="Tool tip text" delayDuration={0}>
  <button type="button">Hover me</button>
</Tooltip>

// Reversed(light) variant
<Tooltip variant="reversed" title="Title" description="Tool tip text">
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
  - `TooltipPrimitive.Arrow`를 `asChild`로 받아 10px 정사각형을 45도 회전시킨 다이아몬드 모양(`Arrow`)으로 커스텀 렌더링. 회전하면 대각선이 14.14px가 되므로 `translate-y-[calc(-50%_-_2px)]`로 본문 쪽에 밀어넣어, 바깥으로는 Figma와 같은 **밑변 10px · 높이 5px 삼각형**만 노출시킨다(브라우저 실측: 돌출 5.07px / 밑변 10.14px). Radix가 래퍼를 side별로 회전시켜 화살표의 로컬 −Y를 항상 본문 안쪽으로 맞춰주므로 `side`별 분기 없이 같은 값 하나로 네 방향이 모두 해결된다.
- 좌우 padding이 비대칭(`pl-[var(--gb-spacing-4)]` / `pr-[var(--gb-spacing-8)]`)이다 — 우측은 좌측 padding(16px) + 닫기 아이콘 너비(16px)만큼 **닫기 버튼 유무와 무관하게 항상** 여유 공간을 확보한다(코드 주석에 명시된 의도, Figma 24-variant 매트릭스 전수 확인 결과 확정값).

## Props

| Prop               | 타입                                                                  | 필수   | 기본값              | 설명                                                                                                                                                                                                                           |
| ------------------ | --------------------------------------------------------------------- | ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `children`         | `React.ReactNode`                                                     | 예     | —                   | 툴팁을 트리거하는 요소(hover/focus 대상). `asChild`로 트리거에 그대로 적용됨                                                                                                                                                   |
| `title`            | `React.ReactNode`                                                     | 아니오 | —                   | 툴팁 제목. falsy면 렌더링 안 됨 — Figma `title1`(boolean) 토글에 대응                                                                                                                                                          |
| `description`      | `React.ReactNode`                                                     | 아니오 | —                   | 툴팁 설명. falsy면 렌더링 안 됨 — Figma `description`(boolean) 토글에 대응                                                                                                                                                     |
| `variant`          | `"default" \| "reversed"`                                             | 아니오 | `"default"`         | Figma `Style` 프로퍼티(Default/Reversed)에 대응                                                                                                                                                                                |
| `side`             | `"top" \| "right" \| "bottom" \| "left"`                              | 아니오 | `"top"`             | Figma `Arrow position`의 1차 방향 축에 대응(정확한 매핑은 Variants 참고)                                                                                                                                                       |
| `align`            | `"start" \| "center" \| "end"`                                        | 아니오 | `"center"`          | Figma `Arrow position`의 2차 정렬 축에 대응                                                                                                                                                                                    |
| `sideOffset`       | `number`                                                              | 아니오 | Radix 기본값        | Radix `Content`로 그대로 전달                                                                                                                                                                                                  |
| `alignOffset`      | `number`                                                              | 아니오 | Radix 기본값        | Radix `Content`로 그대로 전달                                                                                                                                                                                                  |
| `collisionPadding` | `number \| Partial<Record<"top"\|"right"\|"bottom"\|"left", number>>` | 아니오 | `12`                | 뷰포트 경계 충돌 방지 여백. **Figma 실측값 아님** — Figma는 정적 목업이라 화면 경계 충돌을 표현하지 않으므로, `--spacing-3`(12px)에 대응하는 값을 레이아웃 방어용 기본값으로 둔 것(Figma 실측값이 아닌 레이아웃 방어용 기본값) |
| `onClose`          | `() => void`                                                          | 아니오 | —                   | 전달 시에만 닫기(X) 버튼 렌더링 — Figma `closeIcon`(boolean) 토글에 대응                                                                                                                                                       |
| `open`             | `boolean`                                                             | 아니오 | —                   | 제어형 open 상태                                                                                                                                                                                                               |
| `defaultOpen`      | `boolean`                                                             | 아니오 | —                   | 비제어형 초기 open 상태                                                                                                                                                                                                        |
| `onOpenChange`     | `(open: boolean) => void`                                             | 아니오 | —                   | open 상태 변경 콜백                                                                                                                                                                                                            |
| `delayDuration`    | `number`                                                              | 아니오 | Radix 기본값(700ms) | 트리거 진입 후 열리기까지 지연 시간(ms)                                                                                                                                                                                        |
| `className`        | `string`                                                              | 아니오 | —                   | `Content`에 추가로 병합되는 클래스                                                                                                                                                                                             |

## Variants

### Style (색상) — `variant`

Figma `Style` 프로퍼티는 `Default`/`Reversed` 2종. 실측값:

| variant           | 배경                                   | 텍스트                    | 화살표                                   |
| ----------------- | -------------------------------------- | ------------------------- | ---------------------------------------- |
| `default`(기본값) | `bg-primary`(→ `--gb-background-bold`) | `text-primary-foreground` | `bg-primary`와 동일 색                   |
| `reversed`        | `var(--gb-background-mute-subtler)`    | `var(--gb-text-emphasis)` | `--gb-background-mute-subtler`와 동일 색 |

Figma에서 `reversed`는 `default`와 **같은 변수**(`background-bold`/`text-invert`)를 참조하되 반대 모드로 resolve되는 구조다. 즉 두 variant는 라이트·다크 양쪽에서 항상 서로 반대 색이어야 한다:

|        | `default` 배경 | `reversed` 배경 |
| ------ | -------------- | --------------- |
| 라이트 | `#171717`      | `#e5e5e5`       |
| 다크   | `#e5e5e5`      | `#171717`       |

코드는 이 반전을 **기존 모드 대응 토큰**으로 구현한다 — `--gb-background-mute-subtler`(라이트 `#e5e5e5` / 다크 `#171717`)와 `--gb-text-emphasis`(라이트 `#171717` / 다크 `#fafafa`)가 필요한 값과 정확히 일치한다.

reversed에 리터럴 hex를 고정하면 안 된다 — 다크모드에서 `--primary`가 `#e5e5e5`로 resolve되어 `default`와 같은 색이 된다.

### Arrow position (방향) — `side` + `align`

Figma에는 `Arrow position`(12종: BottomLeft/BottomCenter/BottomRight/TopLeft/TopCenter/TopRight/LeftTop/LeftCenter/LeftBottom/RightTop/RightCenter/RightBottom) × `Style`(2종) = 24개 variant 매트릭스가 있다(`3042:539` 프레임, 코드 주석의 "24-variant 매트릭스 전수 재확인"과 일치).

Figma의 1차 방향 단어(Bottom/Top/Left/Right)는 **"화살표가 박스의 어느 변에 붙어 있는지"** 를 가리키며, Radix `side`(콘텐츠가 트리거의 어느 쪽에 나타나는지)와는 반대 방향으로 대응한다:

| Figma `Arrow position` 1차 단어 | 실측 결과(박스↔화살표 배치)                                                           | 대응하는 `side` |
| ------------------------------- | ------------------------------------------------------------------------------------- | --------------- |
| `Bottom...` (예: BottomLeft)    | 박스가 위, 화살표가 박스 아래쪽에 붙음(화살표가 아래를 가리킴 → 트리거가 아래에 있음) | `top`           |
| `Top...` (예: TopLeft)          | 박스가 아래, 화살표가 박스 위쪽에 붙음                                                | `bottom`        |
| `Right...` (예: RightTop)       | 박스가 왼쪽, 화살표가 박스 오른쪽에 붙음                                              | `left`          |
| `Left...` (예: LeftTop)         | 박스가 오른쪽, 화살표가 박스 왼쪽에 붙음                                              | `right`         |

2차 단어 ↔ `align` 대응도 전수 확정했다 (24개 노드 좌표 대조):

| Figma 2차 단어           | 대응하는 `align` |
| ------------------------ | ---------------- |
| `...Left` / `...Top`     | `start`          |
| `...Center`              | `center`         |
| `...Right` / `...Bottom` | `end`            |

즉 상하 계열(`Bottom.../Top...`)은 2차 단어가 Left/Center/Right로 가로 정렬을, 좌우 계열(`Left.../Right...`)은 Top/Center/Bottom으로 세로 정렬을 지정한다. 1차 축과 달리 2차 축은 방향이 반전되지 않는다.

## States and behaviors

- **열림/닫힘**: hover 또는 focus 시 `delayDuration` 이후 열림(Figma description의 "keyboard focus or mouse hovers" 그대로). `open`/`defaultOpen`/`onOpenChange`로 제어/비제어 모두 가능 — 코드에서는 `open` prop을 고정 전달해 "항상 열린" 코치마크 용도로도 쓰인다(조합 가이드 참고).
- **title/description 단독 표시**: 각각 독립적으로 켜고 끌 수 있음(둘 다 optional, `hasBody`가 false면 본문 자체가 렌더링 안 됨).
- **닫기 버튼**: `onClose`를 전달할 때만 나타나며, 클릭 시 `onClose` 콜백만 호출한다 — 열림 상태(`open`) 자체를 자동으로 바꾸지 않음(제어형일 때는 호출부가 `onOpenChange`/`open`도 함께 관리해야 함).
- **collisionPadding**: 뷰포트 경계 근처에서 Radix가 자동 flip/shift — Figma 목업엔 없는 순수 방어 로직(위 Props 설명 참고).

## 다른 범용 컴포넌트와의 조합 가이드

현재 사용처는 모두 `components/compass/` 하위 2곳뿐이며, 둘 다 "온보딩 코치마크"라는 동일한 패턴으로 쓰인다:

- **CompassDialTick** (`components/compass/ui/compass-dial-tick/compass-dial-tick.tsx`): `coachmark` prop이 전달되면 눈금 라벨(텍스트 또는 `Badge` 마커)을 `Tooltip`(`variant="reversed"`, `open` 항상 true, `side="right"` `align="start"` 고정)으로 감싼다. `coachmark.onDismiss`가 있으면 `onClose`로 그대로 연결돼 닫기 버튼이 뜬다.
- **CompassGrowthAvatar** (`components/compass/ui/compass-growth-avatar/compass-growth-avatar.tsx`): 성장률 퍼센트 `Badge`를 동일한 패턴(`variant="reversed"`, `open`, `side="right"`, `align="start"`)의 `Tooltip`으로 감싼다. 코드 주석에 따르면 이 배지 자체가 Figma 실측(node `...;8003:11120;8003:10867`)으로 확인된 코치마크 앵커다.

공통 패턴: 두 조합 모두 (1) 다른 범용 컴포넌트(`Badge` 또는 라벨 텍스트)를 `children`으로 감싸는 **래퍼 전용** 용도로만 쓰이고, (2) hover 트리거를 쓰지 않고 `open`을 강제로 true로 고정해 "상시 노출되는 온보딩 안내"로 용도를 확장하며, (3) `variant="reversed"` + `side="right"`/`align="start"` 조합을 그대로 재사용한다. 두 사용처 모두 아직 `title`/`description`을 hover 기반 보조설명 용도(Figma 원래 의도)로 쓰는 사례는 없다.

## 그림자 적용 범위는 의도적으로 Figma와 다르다

Figma는 `Box Shadow/shadow-sm`을 루트(본문 + `Arrow`)에 걸어 두 요소를 합친 실루엣을 따라가게 하지만, 코드는 콘텐츠 박스에만 건다. Radix가 화살표를 별도 래퍼로 분리해 배치하므로 루트에 그림자를 걸면 화살표 주변에 이중 그림자가 생긴다.

## Figma 프로퍼티 이름

`Tool tip base`의 boolean 토글은 `Show title` / `Show description`이다 — 텍스트 슬롯(`-> Title` / `-> Description`)과 이름이 겹치지 않아 codegen도 `title1`/`description1` 대신 `showTitle`/`showDescription`을 낸다.

## ⚠️ 확인 필요

없음.
