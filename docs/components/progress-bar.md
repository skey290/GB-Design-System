# ProgressBar

> Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3311-1341) · node-id `3311:1341` (프레임 이름: `Part/Prograss` — Figma 원본 레이어 이름 표기 그대로, 오탈자 포함)
> 코드: `components/ui/progress-bar/ProgressBar.tsx`

## Overview

`min`~`max` 범위의 **수치형 `value`를 받아 결정적(deterministic)으로 채워지는 막대**를 그리는 Atom 컴포넌트. 네이티브 `<progress>` 태그가 아니라 `role="progressbar"` + `aria-valuenow`/`aria-valuemin`/`aria-valuemax`를 가진 `<div>` 2단 구조(`track` + `indicator`)로 구현되어 있다(`components/ui/progress-bar/ProgressBar.tsx:26-45`). `value`는 `min`~`max` 범위로 clamp된 뒤 백분율로 환산되어 indicator의 `width`에 인라인 스타일로 반영된다.

Figma 컴포넌트에 별도 설명(description) 필드는 없음 — `get_metadata`/`get_design_context` 응답 모두 설명 텍스트를 반환하지 않았다.

**ProgressBar와 Spinner의 구분(중요)**: 이름은 다르지만 둘 다 "로딩/진행 상태" 표시용이라 혼동하기 쉽다. 실제 코드 확인 결과 둘은 성격이 다른 컴포넌트다.

|           | ProgressBar                                                                                      | Spinner (`components/ui/spinner/spinner.tsx`)                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 진행 표현 | **결정적(determinate)** — 몇 %인지 알고 있을 때, `value` prop으로 정확한 비율을 막대 너비로 표시 | **불확정(indeterminate)** — 몇 %인지 모를 때, `lucide-react`의 `LoaderCircle` 아이콘을 `animate-spin`으로 무한 회전만 시킴. 진행률 수치 개념 자체가 없음 |
| Props 축  | `value`/`min`/`max` (수치)                                                                       | `variant`(`outline`/`secondary`/`primary`) + `label`(텍스트), 수치 prop 없음                                                                             |
| DOM 역할  | `role="progressbar"` + `aria-valuenow` 등 수치 접근성 속성                                       | 아이콘 + 텍스트 라벨을 감싼 `<span>`(뱃지형 레이아웃), 별도 `role="progressbar"` 없음                                                                    |
| 형태      | 가로로 긴 알약형 트랙 바                                                                         | 아이콘 + 라벨이 나란히 있는 작은 뱃지형 요소                                                                                                             |

즉 "완료율을 %로 아는 업로드/설치 진행"에는 ProgressBar, "언제 끝날지 모르는 로딩 표시(뱃지형 라벨 포함)"에는 Spinner를 쓰는 구조로 코드가 갈라져 있다.

## When to use

- 진행률을 `0~100%`(또는 커스텀 `min`/`max` 범위) 수치로 알고 있고, 그 값을 막대 형태로 시각화해야 할 때.
- 접근성 트리에 `progressbar` role과 `aria-valuenow`/`aria-valuemin`/`aria-valuemax`가 필요한 경우 (`aria-label` prop으로 라벨 지정).

## When not to use

⚠️ 확인 필요 — 코드/Figma 어디에도 "이런 경우엔 쓰지 말 것"을 뒷받침하는 근거가 없어 문서에 억지로 채우지 않음. (일반적으로 진행률을 모르는 로딩 상태에는 위 Overview에서 구분한 대로 Spinner를 쓰는 것이 합리적이나, 이는 두 컴포넌트의 구조적 차이에서 추론한 것이지 Figma/코드에 명시된 프로젝트 차원의 규칙은 아니다.)

## How to use

`ProgressBar.stories.tsx`에서 그대로 인용:

```tsx
// 기본 — value 0~100 사이 10 단위 (Figma Percentage(%) variant와 1:1 대응)
<ProgressBar aria-label="progress" value={0} />
<ProgressBar aria-label="progress" value={50} />
<ProgressBar aria-label="progress" value={100} />

// 범위를 벗어난 값은 자동으로 clamp됨
<ProgressBar aria-label="progress" value={250} min={0} max={100} /> // → 100%로 clamp

// 커스텀 min/max 범위
<ProgressBar aria-label="upload" value={150} min={100} max={200} /> // → 50%
```

스토리 데코레이터가 `width: var(--spacing-80)`인 컨테이너로 감싸서 렌더링한다 — ProgressBar 자체는 `w-full`이라 부모 폭에 맞춰 늘어나는 구조이므로, 실제 사용 시에도 폭을 결정하는 쪽은 부모 컨테이너다.

현재 코드베이스 내에서 `components/ui/progress-bar/` 바깥의 실제 화면/조합 사용처는 발견되지 않았다(`grep -rn "ProgressBar" app/ components/ --include="*.tsx" -l` 결과 컴포넌트 자체의 `.tsx`/`.test.tsx`/`.stories.tsx` 3개 파일만 매치됨).

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성:

- `ProgressBar.tsx` — 컴포넌트 구현
- `ProgressBar.stories.tsx` — Storybook CSF3 스토리
- `ProgressBar.test.tsx` — Vitest + Testing Library 테스트
- `index.ts` — `ProgressBar`, `ProgressBarProps` named export

내부 DOM 구조:

```
<div role="progressbar" aria-valuenow aria-valuemin aria-valuemax aria-label data-slot="progress-bar-track">   트랙(알약 모양 배경, 전체 너비)
  <div data-slot="progress-bar-indicator" style={{ width: `${percent}%` }}>                                    채워지는 막대
```

Figma 쪽 구조(`get_design_context` 원본, node `4059:4520` 기준)도 트랙(바깥 `div`, `rounded-full`, `bg-[--background-subtler]`) 안에 `Indicator`라는 이름의 내부 요소(`bg-[--background-bolder]`, `rounded-full`)가 겹쳐진 2단 구조로 동일하다. 다만 Figma 원본은 인디케이터를 `left-0 right-1/2` 절대 위치 + `-translate-y-1/2`로 배치한 것과 달리, 코드는 `height: 100%` + `width: {percent}%`인 자연스러운 flex-in-flow 방식으로 구현 — 시각적 결과는 동일하되 구현 방식은 코드 쪽이 더 단순하다.

## Props

| Prop         | 타입     | 기본값 | 설명                                                                              |
| ------------ | -------- | ------ | --------------------------------------------------------------------------------- |
| `value`      | `number` | `0`    | 현재 진행률 값. `min`~`max` 범위로 clamp됨 (Figma `Percentage(%)` variant에 대응) |
| `min`        | `number` | `0`    | 최솟값                                                                            |
| `max`        | `number` | `100`  | 최댓값                                                                            |
| `className`  | `string` | —      | 최상위 트랙 `<div>`에 병합                                                        |
| `aria-label` | `string` | —      | `progressbar` role에 대한 접근성 라벨                                             |

그 외 상속되는 HTML 속성 없음 — `React.HTMLAttributes` 등을 스프레드하지 않는 명시적 props 인터페이스.

## Variants

Figma 컴포넌트 세트는 `Percentage(%)` 단일 축, `0`부터 `100`까지 10 단위 총 11개 심볼(`get_metadata` 확인: `0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100`).

| Figma `Percentage(%)` | 코드 매핑                                                                               |
| --------------------- | --------------------------------------------------------------------------------------- |
| `0`, `10`, ..., `100` | `value={0}`, `value={10}`, ..., `value={100}` (각각 대응하는 `.stories.tsx` story 존재) |

코드는 `value`를 연속적인 `number`로 받으므로 Figma의 10 단위 스냅과 달리 임의의 소수/정수 값(예: `value={73}`)도 동일한 방식으로 처리한다 — Figma는 대표 스냅샷 11개만 디자인해 둔 것이고, 실제 구현은 그 사이 값도 모두 지원하는 연속 스펙트럼이다.

토큰(값이 아닌 이름만, `ProgressBar.tsx` 기준):

| 요소                           | 토큰                   |
| ------------------------------ | ---------------------- |
| 트랙 배경                      | `--background-subtler` |
| 인디케이터(채워지는 막대) 배경 | `--background-bolder`  |
| 트랙/인디케이터 모서리         | `--radius-scale-full`  |

Figma `get_variable_defs`(node `3311:1341`)도 동일한 두 변수(`--background-subtler`, `--background-bolder`)와 `--radius-full`(→ 코드의 `--radius-scale-full`과 값 9999px로 동일)을 반환해 코드와 정확히 일치함을 확인했다. 트랙 높이는 `--scale-8`(`src/tokens/scale.css:74` 기준 `8`) 참조 — 컴포넌트 자체 높이라 `--spacing-*`가 아닌 `--scale-*`를 쓴다는 점이 `ProgressBar.tsx:34-35` 주석에 `Button.tsx`의 `h-[calc(var(--scale-36)*1px)]`와 같은 관례라고 명시돼 있음.

## States and behaviors

- **clamp 동작**: `value`가 `max`를 초과하면 `max`로, `min` 미만이면 `min`으로 고정된다(`Math.min(max, Math.max(min, value))`, `ProgressBar.tsx:22`). `ProgressBar.test.tsx`와 스토리 `ClampsOutOfRangeValues`(`value={250}` → `aria-valuenow="100"`, `width: 100%`)에서 검증됨.
- **`min === max` 예외 처리**: 분모가 0이 되는 경우를 막기 위해 `max === min`이면 `percent`를 강제로 `0`으로 고정한다(`ProgressBar.tsx:23`) — 별도 테스트/스토리로 검증된 케이스는 아니고 코드 상에서만 확인됨.
- **커스텀 범위 지원**: `min`/`max`를 `0~100`이 아닌 임의 범위로 지정 가능(`ProgressBar.test.tsx`의 `min={100} max={200}` 케이스, 백분율 계산은 항상 `(value - min) / (max - min)`).
- **값 변경 시 전환 애니메이션**: 인디케이터에 `transition-[width]` 클래스가 있어 `width`가 바뀔 때 부드럽게 전환된다(`ProgressBar.tsx:42`) — 다만 이 전환의 duration/easing을 지정하는 토큰은 코드에 없고 Tailwind 기본 transition 값을 그대로 사용한다(아래 확인 필요 참고).
- **접근성 값 동기화**: `aria-valuenow`/`aria-valuemin`/`aria-valuemax`가 항상 clamp된 값(원본 `value`가 아닌 `clampedValue`) 및 `min`/`max` prop과 동기화된다 — `ProgressBar.test.tsx` 전체 케이스에서 검증.
- **라벨은 `aria-label`로만 지정**: 시각적으로 보이는 텍스트 라벨이 없다 — Switch/Checkbox와 달리 화면에 표시되는 라벨 slot 자체가 컴포넌트 구조에 없고, 접근성 이름은 `aria-label` prop으로만 부여한다(값을 안 주면 `aria-label`이 `undefined`로 렌더링됨).
- **hover/disabled 상태 없음**: `ProgressBar.tsx` 전체에 `hover:`/`disabled` 관련 클래스나 prop이 없다 — 순수 표시 전용(non-interactive) 컴포넌트라 인터랙션 상태 자체가 설계에 없음.

## 다른 범용 컴포넌트와의 조합 가이드

현재 코드베이스에서 `ProgressBar`를 실제로 다른 컴포넌트와 조합해 쓰는 화면은 발견되지 않았다(`grep -rn "ProgressBar" app/ components/ --include="*.tsx" -l` 기준 컴포넌트 자체 파일 3개만 매치, import/렌더링하는 외부 화면 없음). 따라서 이 섹션은 현재 채울 근거가 없다.

## ⚠️ 확인 필요

- **Figma 컴포넌트 설명(description) 필드 부재**: `get_metadata`/`get_design_context` 응답 모두 이 컴포넌트에 대한 설명 텍스트를 반환하지 않았음. Figma 파일에서 직접 Description 패널을 확인해 실제로 비어있는지 재확인 필요.
- **"When not to use" 근거 없음**: 코드/Figma 어디에도 이 컴포넌트를 쓰지 말아야 할 상황에 대한 명시적 근거가 없어 문서에 억지로 채우지 않음.
- **실사용처 전무**: 코드베이스 전체에서 `ProgressBar`를 실제로 렌더링하는 화면이 스토리/테스트 외에는 없음. 조합 가이드를 채우려면 실제 적용 화면이 필요.
- **전환 애니메이션(`transition-[width]`) duration/easing 토큰 부재**: 값 변경 시 부드러운 전환을 위한 `transition-[width]` 클래스가 있지만, duration/easing을 지정하는 프로젝트 토큰(`--duration-*`, `--ease-*` 등)을 참조하지 않고 Tailwind 기본값을 그대로 쓴다. 다른 컴포넌트들의 전환 애니메이션 관례와 통일할지, 혹은 Figma 쪽에 별도 모션 스펙이 있는지(모션 컨텍스트는 이번 조사에서 조회하지 않음) 확인 필요.
- **Figma 프레임 이름의 오탈자**: node `3311:1341`의 Figma 레이어 이름이 `Part/Prograss`로 "Progress"의 오탈자다 — 문서에는 원본 그대로 인용했으나, 이것이 Figma 파일 자체의 실수인지 확인 후 필요 시 디자이너에게 전달할지 판단 필요.
- **`min === max`일 때 0%로 고정하는 처리의 시각적 근거**: 분모 0 방지를 위한 방어 코드로 보이나, 이 케이스에 대한 Figma variant나 별도 테스트/스토리가 없어 "0%가 맞는 기본값인지"(예: 100%가 더 적절할 수도 있음) 디자인 의도 확인 필요.
