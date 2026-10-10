# Switch

> Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-10618) · node-id `76:10618`
> 코드: `components/ui/switch/switch.tsx`

## Overview

on/off 두 상태만 갖는 단일 boolean 토글 Atom 컴포넌트. 네이티브 `<input type="checkbox">`가 아니라 `<button role="switch" aria-checked>` 조합으로 구현되어 있다(`components/ui/switch/switch.tsx:110-130`). `checked`/`disabled`/`labelPosition`/`size` 4가지 축으로 상태·모양이 결정되며, 제어(controlled)·비제어(uncontrolled) 양쪽 사용 패턴을 모두 지원한다(`checked`가 `undefined`면 내부 state로 비제어 동작, 값이 있으면 완전 제어) — Checkbox와 동일한 구현 관례다.

Figma 컴포넌트 설명(description) 필드 원문:

> A single on/off toggle rendered as a track-and-thumb slider, typically for a setting that takes effect immediately. Distinct from Toggle, which is a group of buttons where each one can be pressed on or off independently. Use Checkbox when the value is only committed on submit.

**Toggle과의 구분**: 이름이 비슷한 `components/ui/toggle/toggle.tsx`는 별도 컴포넌트다. Toggle은 여러 버튼을 묶어 각각을 독립적으로 누르는 세그먼트 그룹(`role="group"` + `aria-pressed`)이고, Switch는 단일 항목의 on/off 슬라이더(`role="switch"`)다. Toggle의 `Type`은 `icon` / `text` / `text + icon` 세 종류라 아이콘 전용이 아니다.

또한 ARIA 표준상 `role="switch"`는 `role="checkbox"`와 달리 "즉시 반영되는 상태 변경"(설정을 켜는 즉시 효과가 발생하는 것)을 의미하는 것으로 통용된다 — 이는 프로젝트 고유 규칙이 아니라 WAI-ARIA 관례이며, 이 프로젝트의 Switch 구현이 이 관례를 실제로 어떻게 활용하는지(예: 폼 제출 없이 즉시 반영되는 설정 화면)는 코드베이스 내 실사용처가 없어 확인하지 못했다.

## When to use

- 단일 항목에 대한 on/off 상태를 라벨과 함께, 또는 라벨 없이(스크린리더용 대체 텍스트만) 노출해야 할 때. `label`은 optional prop이며 기본값이 `"switch"` 리터럴 문자열이다(`SwitchProps.label?: string`, 기본값 `"switch"`) — Checkbox와 달리 라벨이 필수가 아니다.
- 라벨 위치를 트랙 좌/우 어느 쪽으로도 둘 수 있어야 할 때 (`labelPosition="left" | "right"`), 또는 두 가지 크기(`size="default" | "small"`) 중 선택해야 할 때.

## When not to use

Figma description이 두 가지를 명시한다.

- **값이 제출 시점에만 반영되는 경우** → Switch가 아니라 [Checkbox](./checkbox.md). Switch는 켜는 즉시 효과가 발생하는 설정에 쓴다(ARIA `role="switch"` 관례와도 일치).
- **여러 옵션을 각각 독립적으로 켜고 끄는 경우** → [Toggle](./toggle.md). Switch는 boolean 하나만 다룬다.

## How to use

`switch.stories.tsx`에서 그대로 인용:

```tsx
// 기본(비제어) — off, 라벨 오른쪽
<Switch label="switch" labelPosition="right" size="default" defaultChecked={false} />

// on
<Switch label="switch" labelPosition="right" size="default" defaultChecked={true} />

// 라벨을 왼쪽에 두는 reversed 배치
<Switch label="switch" labelPosition="left" size="default" defaultChecked={false} />

// 비활성화 — disabled와 labelPosition은 독립 prop이라 자유 조합 가능
// (Figma의 disabled 예시는 항상 라벨이 왼쪽에 있지만 코드는 그 조합을 강제하지 않음)
<Switch label="switch" labelPosition="left" size="default" defaultChecked={false} disabled />

// small 사이즈
<Switch label="switch" labelPosition="right" size="small" defaultChecked={false} />
```

제어 컴포넌트로 쓸 때:

```tsx
<Switch
  label="알림 받기"
  checked={notificationsEnabled}
  onCheckedChange={setNotificationsEnabled}
/>
```

현재 코드베이스 내에서 `components/ui/switch/` 바깥의 실제 화면/조합 사용처는 발견되지 않았다. 즉 현재는 컴포넌트 자체의 stories/test 외 실사용 예가 없다.

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성:

- `switch.tsx` — 컴포넌트 구현
- `switch.stories.tsx` — Storybook CSF3 스토리
- `switch.test.tsx` — Vitest + Testing Library 테스트
- `index.ts` — `Switch`, `SwitchProps` named export

내부 DOM 구조:

```
<button role="switch" aria-checked disabled>   실제 인터랙션 대상(전체가 버튼)
  {labelPosition === "left" && <span data-slot="switch-label">}
  <span data-slot="switch-track">               트랙(알약 모양 배경)
    <span data-slot="switch-thumb">              동그란 손잡이
  {labelPosition === "right" && <span data-slot="switch-label">}
```

- Checkbox처럼 별도 `<label htmlFor>` 연결이 아니라, 라벨 텍스트가 `<button>` 자식으로 렌더링되어 버튼 자체의 접근성 이름(accessible name)이 됨 — 별도 `aria-labelledby` 없이 네이티브 방식으로 이름이 결정된다.
- 라벨이 없을 때(`label`을 빈 문자열로 명시)만 `aria-label="switch"`가 하드코딩되어 붙는다(`switch.tsx:114`).

## Props

| Prop              | 타입                         | 기본값      | 설명                                                                                                                            |
| ----------------- | ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `checked`         | `boolean`                    | —           | 제어 컴포넌트로 쓸 때의 on/off 상태 (Figma `On` variant)                                                                        |
| `defaultChecked`  | `boolean`                    | `false`     | 비제어 컴포넌트 초기값                                                                                                          |
| `onCheckedChange` | `(checked: boolean) => void` | —           | on/off 상태 변경 시 호출                                                                                                        |
| `disabled`        | `boolean`                    | `false`     | 비활성화 (Figma `Status=disabled`). `labelPosition`과 독립된 축이라 자유 조합 가능                                              |
| `label`           | `string`                     | `"switch"`  | 스위치 옆 라벨 텍스트. 빈 문자열로 명시하면 시각적 라벨은 사라지고 대신 하드코딩된 `aria-label="switch"`가 접근성 이름으로 붙음 |
| `labelPosition`   | `"left" \| "right"`          | `"right"`   | 라벨이 트랙 기준 어느 쪽에 있는지 (Figma `Type`: `"right"` → `default`, `"left"` → `reversed`)                                  |
| `size`            | `"default" \| "small"`       | `"default"` | 스위치 크기 (Figma `Size` variant)                                                                                              |
| `className`       | `string`                     | —           | 최상위 `<button>`에 병합                                                                                                        |

그 외 `React.ButtonHTMLAttributes<HTMLButtonElement>`를 `onChange`/`type`/`role` 제외하고 그대로 상속(`...props`가 내부 `<button>`에 전달됨). `onClick`은 별도로 받아 내부 토글 로직 실행 전에 먼저 호출됨.

## Variants

Figma 컴포넌트 세트는 `On` × `Type` × `Status` × `Size` 4축, 축 곱 16개가 전부 그려져 있다. `disabled`는 `Type`이 아니라 `Status` 축에 있다 — 이 프로젝트의 전역 규칙("`Type`은 종류/형태만, `disabled`는 `Status`")에 따른 구조다.

| Figma `On` | Figma `Type`         | Figma `Status` | Figma `Size` | 코드 매핑                                                         |
| ---------- | -------------------- | -------------- | ------------ | ----------------------------------------------------------------- |
| `off`      | `default`            | `default`      | `default`    | `defaultChecked=false`, `labelPosition="right"`, `size="default"` |
| `on`       | `default`            | `default`      | `default`    | `defaultChecked=true`, `labelPosition="right"`, `size="default"`  |
| `off`      | `reversed`           | `default`      | `default`    | `labelPosition="left"`                                            |
| `on`       | `reversed`           | `default`      | `default`    | `labelPosition="left"`, `defaultChecked=true`                     |
| `off`      | `default`            | `disabled`     | `default`    | `disabled=true`, `labelPosition="right"`                          |
| `on`       | `default`            | `disabled`     | `default`    | `disabled=true`, `defaultChecked=true`                            |
| `off`/`on` | `default`/`reversed` | `default`      | `small`      | 위와 동일 조합에 `size="small"`                                   |
| `off`/`on` | `default`            | `disabled`     | `small`      | `disabled=true`, `size="small"`                                   |

축 곱 2×2×2×2 = 16이 모두 존재하며 희소 조합은 없다.

Figma는 `Type`(배치: `default`/`reversed`)과 `Status`(상태: `default`/`disabled`)를 별도 축으로 분리해 두었고, 코드도 `labelPosition`과 `disabled`를 독립 prop으로 두어 구조가 일치한다. 코드가 허용하는 16조합 전부에 Figma 근거가 있다.

`Type=default`와 `Type=reversed`의 disabled는 바인딩 변수 집합이 완전히 동일하다 — 차이는 라벨/트랙 배치 순서뿐이라 "disabled 모습은 하나" 규칙에 부합한다.

토큰(값이 아닌 이름만, `switch.tsx` 기준):

| 상태                    | 트랙 배경                  | 손잡이 배경                    | 라벨 텍스트         |
| ----------------------- | -------------------------- | ------------------------------ | ------------------- |
| off, 활성               | `--gb-background-selected` | `--gb-background-static-white` | `--gb-text-default` |
| off, disabled           | `--gb-background-disabled` | `--gb-background-static-white` | 동일                |
| on (disabled 여부 무관) | `--gb-background-bold`     | `--gb-background-subtlest`     | 동일                |

트랙/손잡이 공통: `rounded-[var(--gb-radius-scale-full)]`, `shadow-[var(--gb-shadow-xs)]`, 트랙 패딩 `p-[var(--gb-spacing-0-5)]`. 그림자는 손잡이가 아니라 **트랙**에 걸린다. 치수는 컴포넌트 자체 크기라 Figma 확정값을 리터럴 px로 쓴다: default 트랙 `h-[24px]`/`w-[44px]`, 손잡이 `size-[20px]`; small 트랙 `h-[22px]`/`w-[40px]`, 손잡이 `size-[18px]`. 버튼 wrapper 간격 `gap-[var(--gb-spacing-1-5)]`(6px). 포커스 시 `shadow-[var(--gb-shadow-focus-ring)]`.

## States and behaviors

- **on/off 배색은 disabled와 독립적으로 한 단계만 다름**: on 상태는 disabled 여부와 무관하게 트랙이 항상 `--gb-background-bold`다(`isChecked ? "bg-[var(--gb-background-bold)]" : disabled ? "bg-[var(--gb-background-disabled)]" : "bg-[var(--gb-background-selected)]"`, `switch.tsx:75-82`) — off일 때만 disabled 여부에 따라 트랙 색이 `--gb-background-selected`/`--gb-background-disabled`로 갈라진다. Figma도 동일하다.
- **disabled는 버튼 전체 opacity로 표현**: `disabled`가 true면 트랙/손잡이 색과 별개로 버튼 전체에 `opacity-[var(--gb-opacity-50)]`가 적용되어 전체적으로 흐려짐(`switch.tsx:119-121`). 즉 disabled 여부의 시각적 구분은 트랙 색 변화(off일 때만)와 전체 opacity 50%가 함께 작동하는 구조.
- **disabled 시 클릭 무시**: 네이티브 `disabled` 속성과 `handleClick` 내부의 `if (disabled || event.defaultPrevented) return` 이중으로 막혀 `onCheckedChange`가 호출되지 않고 `aria-checked`도 바뀌지 않음(`switch.test.tsx:67-81`, story `DisabledInteraction`에서 검증).
- **disabled는 hover/select와 무관하게 고정 스타일 — 확인됨**: `switch.tsx` 전체에 `hover:` Tailwind 클래스가 단 하나도 없다. disabled뿐 아니라 모든 상태가 hover 시 시각적으로 변하지 않으며, disabled는 그중에서도 항상 동일한 opacity-50 + 고정 트랙 색 조합만 적용되므로 "hover/select에 상태 변화 없음" 규칙을 만족한다.
- **focus**: `focus-visible:shadow-[var(--gb-shadow-focus-ring)]`가 base 클래스에 포함되어 상태와 무관하게 정의되어 있음(단, 네이티브 disabled 버튼은 보통 포커스를 받지 않으므로 실질적으로는 비활성 상태가 아닐 때만 관찰 가능 — Checkbox 문서와 동일한 caveat).
- **키보드**: 네이티브 `<button>` 시맨틱을 사용하므로 이론상 Enter/Space로 토글되어야 하나, `switch.test.tsx`/`switch.stories.tsx` 어디에도 키보드 인터랙션을 직접 검증하는 테스트/스토리가 없다(전부 `userEvent.click` 기반). Checkbox에는 `KeyboardInteraction` 전용 스토리가 있지만 Switch에는 대응하는 것이 없음 — 아래 확인 필요 항목 참고.
- **제어/비제어**: `checked`가 `undefined`가 아니면 완전 제어(내부 state 미사용, `onCheckedChange`만 호출하고 실제 on/off는 부모가 다시 넘겨줘야 반영됨 — `switch.test.tsx:48-65`에서 검증). `checked`가 `undefined`면 내부 `useState(defaultChecked)`로 비제어 동작.
- **라벨 유무와 접근성 이름**: 라벨 텍스트가 버튼의 자식으로 렌더링되므로 별도 `aria-labelledby` 연결 없이 네이티브 방식으로 버튼의 접근성 이름이 됨(`switch.test.tsx:15-21`에서 커스텀 라벨로 `getByRole("switch", { name: ... })` 조회가 성공함을 검증). 라벨을 빈 문자열로 주면 시각적 텍스트는 없어지고 하드코딩된 `aria-label="switch"`만 남는다 — 이 경우 커스텀 접근성 이름을 지정할 방법이 없다(아래 확인 필요 참고).

## 다른 범용 컴포넌트와의 조합 가이드

현재 `components/ui/switch/` 바깥에서 `Switch`를 import/렌더링하는 곳은 없다.

## 접근성 이름과 키보드

시각 라벨을 비우면(`label=""`) 기본 `aria-label`은 `"switch"`지만, `...props`가 뒤에 전개되므로 **소비처가 넘긴 `aria-label`이 그대로 이긴다.** 커스텀 접근성 이름이 필요한 라벨 없는 스위치도 표현할 수 있다.

Enter/Space 토글과 disabled일 때 포커스를 받지 않는 동작을 `switch.test.tsx`가 고정한다.

disabled 투명도는 Figma `opacity/50` 변수에 바인딩돼 있고 코드도 `--gb-opacity-50`을 쓴다.

## ⚠️ 확인 필요

없음.
