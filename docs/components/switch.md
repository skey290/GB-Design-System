# Switch

> Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=76-10618) · node-id `76:10618`
> 코드: `components/ui/switch/Switch.tsx`

## Overview

on/off 두 상태만 갖는 단일 boolean 토글 Atom 컴포넌트. 네이티브 `<input type="checkbox">`가 아니라 `<button role="switch" aria-checked>` 조합으로 구현되어 있다(`components/ui/switch/Switch.tsx:110-130`). `checked`/`disabled`/`labelPosition`/`size` 4가지 축으로 상태·모양이 결정되며, 제어(controlled)·비제어(uncontrolled) 양쪽 사용 패턴을 모두 지원한다(`checked`가 `undefined`면 내부 state로 비제어 동작, 값이 있으면 완전 제어) — Checkbox와 동일한 구현 관례다.

Figma 컴포넌트에 별도 설명(description) 필드는 없음 — `get_metadata`/`get_design_context` 응답 모두 컴포넌트 설명 텍스트를 반환하지 않았다. 아래 내용은 전부 코드(`Switch.tsx`/`.stories.tsx`/`.test.tsx`)와 Figma variant 구조에서 직접 확인한 사실만 기술한다.

**Toggle과의 구분**: 이름이 비슷한 `components/ui/toggle/toggle.tsx`는 별도 컴포넌트다. 해당 파일 주석에 명시된 대로 "on/off 슬라이더인 Switch와 달리, 아이콘 눌림 버튼을 여러 개 묶는 세그먼트 그룹"이다(`components/ui/toggle/toggle.tsx:6`) — Toggle은 여러 옵션 중 하나(또는 복수)를 아이콘 버튼으로 선택하는 세그먼트 그룹이고, Switch는 단일 항목의 on/off 슬라이더다. `role`도 다르다(`switch` vs Toggle 쪽 구현).

또한 ARIA 표준상 `role="switch"`는 `role="checkbox"`와 달리 "즉시 반영되는 상태 변경"(설정을 켜는 즉시 효과가 발생하는 것)을 의미하는 것으로 통용된다 — 이는 프로젝트 고유 규칙이 아니라 WAI-ARIA 관례이며, 이 프로젝트의 Switch 구현이 이 관례를 실제로 어떻게 활용하는지(예: 폼 제출 없이 즉시 반영되는 설정 화면)는 코드베이스 내 실사용처가 없어 확인하지 못했다.

## When to use

- 단일 항목에 대한 on/off 상태를 라벨과 함께, 또는 라벨 없이(스크린리더용 대체 텍스트만) 노출해야 할 때. `label`은 optional prop이며 기본값이 `"switch"` 리터럴 문자열이다(`SwitchProps.label?: string`, 기본값 `"switch"`) — Checkbox와 달리 라벨이 필수가 아니다.
- 라벨 위치를 트랙 좌/우 어느 쪽으로도 둘 수 있어야 할 때 (`labelPosition="left" | "right"`), 또는 두 가지 크기(`size="default" | "small"`) 중 선택해야 할 때.

## When not to use

⚠️ 코드/Figma에서 "이런 경우엔 쓰지 말 것"을 뒷받침하는 근거를 찾지 못함 — 아래 "확인 필요" 섹션 참고. (일반적으로 즉시 반영 여부에 따라 Checkbox와 구분해 쓰는 것이 ARIA 관례이나, 이 프로젝트 내 실사용처가 없어 프로젝트 차원의 판단 근거는 없음.)

## How to use

`Switch.stories.tsx`에서 그대로 인용:

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

현재 코드베이스 내에서 `components/ui/switch/` 바깥의 실제 화면/조합 사용처는 발견되지 않았다(`grep -rn "Switch" app/ components/`로 나오는 다른 매치들은 전부 무관한 문맥 — `toggle.tsx`의 비교 주석, `noti-dropdown.stories.tsx`의 `TabSwitchInteraction`이라는 스토리 이름, `compass-self-cluster.stories.tsx`의 `...HoverSwitchesDecoration`이라는 스토리 이름, `input-phone.tsx`의 "Switch/Textarea 선례" 주석 — Switch 컴포넌트를 import/렌더링하는 곳이 아니다). 즉 현재는 컴포넌트 자체의 stories/test 외 실사용 예가 없다.

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성:

- `Switch.tsx` — 컴포넌트 구현
- `Switch.stories.tsx` — Storybook CSF3 스토리
- `Switch.test.tsx` — Vitest + Testing Library 테스트
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
- 라벨이 없을 때(`label`을 빈 문자열로 명시)만 `aria-label="switch"`가 하드코딩되어 붙는다(`Switch.tsx:114`).

## Props

| Prop              | 타입                         | 기본값      | 설명                                                                                                                                                                                           |
| ----------------- | ---------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `checked`         | `boolean`                    | —           | 제어 컴포넌트로 쓸 때의 on/off 상태 (Figma `On` variant)                                                                                                                                       |
| `defaultChecked`  | `boolean`                    | `false`     | 비제어 컴포넌트 초기값                                                                                                                                                                         |
| `onCheckedChange` | `(checked: boolean) => void` | —           | on/off 상태 변경 시 호출                                                                                                                                                                       |
| `disabled`        | `boolean`                    | `false`     | 비활성화 (Figma `Type=disabled` variant). `labelPosition`과 독립적인 prop — Figma는 disabled일 때 라벨이 항상 왼쪽인 예시만 제공하지만 코드는 `disabled` + `labelPosition="right"` 조합도 허용 |
| `label`           | `string`                     | `"switch"`  | 스위치 옆 라벨 텍스트. 빈 문자열로 명시하면 시각적 라벨은 사라지고 대신 하드코딩된 `aria-label="switch"`가 접근성 이름으로 붙음                                                                |
| `labelPosition`   | `"left" \| "right"`          | `"right"`   | 라벨이 트랙 기준 어느 쪽에 있는지 (Figma `Type` variant: `"right"` → Figma `default`, `"left"` → Figma `reversed`/`disabled` 예시와 동일 순서)                                                 |
| `size`            | `"default" \| "small"`       | `"default"` | 스위치 크기 (Figma `Size` variant)                                                                                                                                                             |
| `className`       | `string`                     | —           | 최상위 `<button>`에 병합                                                                                                                                                                       |

그 외 `React.ButtonHTMLAttributes<HTMLButtonElement>`를 `onChange`/`type`/`role` 제외하고 그대로 상속(`...props`가 내부 `<button>`에 전달됨). `onClick`은 별도로 받아 내부 토글 로직 실행 전에 먼저 호출됨.

## Variants

Figma 컴포넌트 세트는 `On` × `Type` × `Size` 3축 조합, 총 12개 심볼(`get_metadata` 확인):

| Figma `On` | Figma `Type`                    | Figma `Size` | 코드 매핑                                                         |
| ---------- | ------------------------------- | ------------ | ----------------------------------------------------------------- |
| `off`      | `default`                       | `default`    | `defaultChecked=false`, `labelPosition="right"`, `size="default"` |
| `on`       | `default`                       | `default`    | `defaultChecked=true`, `labelPosition="right"`, `size="default"`  |
| `off`      | `reversed`                      | `default`    | `labelPosition="left"`                                            |
| `on`       | `reversed`                      | `default`    | `labelPosition="left"`, `defaultChecked=true`                     |
| `off`      | `disabled`                      | `default`    | `disabled=true`, `labelPosition="left"`(Figma 예시 기준)          |
| `on`       | `disabled`                      | `default`    | `disabled=true`, `defaultChecked=true`                            |
| `off`/`on` | `default`/`reversed`/`disabled` | `small`      | 위와 동일 조합에 `size="small"`                                   |

`Type=disabled`는 Figma 상으로는 "라벨 왼쪽 배치 + 비활성화"가 하나로 묶인 variant이지만, 코드는 `disabled`와 `labelPosition`을 독립 prop으로 분리해 자유 조합을 허용한다 — `Switch.tsx:17-21` 주석에 이 설계 의도가 명시되어 있음.

토큰(값이 아닌 이름만, `Switch.tsx` 기준):

| 상태                    | 트랙 배경               | 손잡이 배경                 | 라벨 텍스트                                                      |
| ----------------------- | ----------------------- | --------------------------- | ---------------------------------------------------------------- |
| off, 활성               | `--background-selected` | `--background-static-white` | `--foreground`(→ `app/globals.css`에서 `--text-default`에 alias) |
| off, disabled           | `--background-disabled` | `--background-static-white` | 동일                                                             |
| on (disabled 여부 무관) | `--background-bold`     | `--background-subtlest`     | 동일                                                             |

트랙/손잡이 공통: `rounded-[var(--radius-scale-full)]`, `shadow-[var(--shadow-xs)]`, 트랙 패딩 `p-[var(--spacing-0-5)]`. 치수는 `--scale-*` 참조(컴포넌트 자체 크기라 `--spacing-*`가 아닌 `--scale-*` 사용 — `tabs.tsx`/`chips.tsx`/`input.tsx`와 동일 관례라고 코드 주석에 명시, `Switch.tsx:69-70`): default 트랙 `h=--scale-24`/`w=--scale-44`, 손잡이 `size=--scale-20`; small 트랙 `h=--scale-22`/`w=--scale-40`, 손잡이 `size=--scale-18`. 버튼 wrapper 간격 `gap-[var(--spacing-1-5)]`. 포커스 시 `shadow-[var(--shadow-focus-ring)]`.

## States and behaviors

- **on/off 배색은 disabled와 독립적으로 한 단계만 다름**: on 상태는 disabled 여부와 무관하게 트랙이 항상 `--background-bold`다(`isChecked ? "bg-[var(--background-bold)]" : disabled ? "bg-[var(--background-disabled)]" : "bg-[var(--background-selected)]"`, `Switch.tsx:75-82`) — off일 때만 disabled 여부에 따라 트랙 색이 `--background-selected`/`--background-disabled`로 갈라진다.
- **disabled는 버튼 전체 opacity로 표현**: `disabled`가 true면 트랙/손잡이 색과 별개로 버튼 전체에 `opacity-[var(--opacity-50)]`가 적용되어 전체적으로 흐려짐(`Switch.tsx:119-121`). 즉 disabled 여부의 시각적 구분은 트랙 색 변화(off일 때만)와 전체 opacity 50%가 함께 작동하는 구조.
- **disabled 시 클릭 무시**: 네이티브 `disabled` 속성과 `handleClick` 내부의 `if (disabled || event.defaultPrevented) return` 이중으로 막혀 `onCheckedChange`가 호출되지 않고 `aria-checked`도 바뀌지 않음(`Switch.test.tsx:67-81`, story `DisabledInteraction`에서 검증).
- **disabled는 hover/select와 무관하게 고정 스타일 — 확인됨**: `Switch.tsx` 전체에 `hover:` Tailwind 클래스가 단 하나도 없다. disabled뿐 아니라 모든 상태가 hover 시 시각적으로 변하지 않으며, disabled는 그중에서도 항상 동일한 opacity-50 + 고정 트랙 색 조합만 적용되므로 "hover/select에 상태 변화 없음" 규칙을 만족한다.
- **focus**: `focus-visible:shadow-[var(--shadow-focus-ring)]`가 base 클래스에 포함되어 상태와 무관하게 정의되어 있음(단, 네이티브 disabled 버튼은 보통 포커스를 받지 않으므로 실질적으로는 비활성 상태가 아닐 때만 관찰 가능 — Checkbox 문서와 동일한 caveat).
- **키보드**: 네이티브 `<button>` 시맨틱을 사용하므로 이론상 Enter/Space로 토글되어야 하나, `Switch.test.tsx`/`Switch.stories.tsx` 어디에도 키보드 인터랙션을 직접 검증하는 테스트/스토리가 없다(전부 `userEvent.click` 기반). Checkbox에는 `KeyboardInteraction` 전용 스토리가 있지만 Switch에는 대응하는 것이 없음 — 아래 확인 필요 항목 참고.
- **제어/비제어**: `checked`가 `undefined`가 아니면 완전 제어(내부 state 미사용, `onCheckedChange`만 호출하고 실제 on/off는 부모가 다시 넘겨줘야 반영됨 — `Switch.test.tsx:48-65`에서 검증). `checked`가 `undefined`면 내부 `useState(defaultChecked)`로 비제어 동작.
- **라벨 유무와 접근성 이름**: 라벨 텍스트가 버튼의 자식으로 렌더링되므로 별도 `aria-labelledby` 연결 없이 네이티브 방식으로 버튼의 접근성 이름이 됨(`Switch.test.tsx:15-21`에서 커스텀 라벨로 `getByRole("switch", { name: ... })` 조회가 성공함을 검증). 라벨을 빈 문자열로 주면 시각적 텍스트는 없어지고 하드코딩된 `aria-label="switch"`만 남는다 — 이 경우 커스텀 접근성 이름을 지정할 방법이 없다(아래 확인 필요 참고).

## 다른 범용 컴포넌트와의 조합 가이드

현재 코드베이스에서 `Switch`를 실제로 다른 컴포넌트와 조합해 쓰는 화면은 발견되지 않았다(`grep -rn "Switch" app/ components/` 기준, `components/ui/switch/` 바깥에서 이 컴포넌트를 import/렌더링하는 곳 없음 — 다른 매치는 전부 주석/무관한 스토리 이름). 따라서 이 섹션은 현재 채울 근거가 없다. Checkbox 문서의 Popover 조합처럼, Switch도 설정 리스트/알림 옵션 행 등에 쓰일 잠재적 후보이지만 실사용 근거가 없어 추측으로 적지 않는다.

## ⚠️ 확인 필요

- **Figma 컴포넌트 설명(description) 필드 부재**: `get_metadata`/`get_design_context` 응답 모두 이 컴포넌트에 대한 설명 텍스트를 반환하지 않았음. Figma 파일에서 직접 Description 패널을 확인해 실제로 비어있는지 재확인 필요.
- **"When not to use" 근거 없음**: 코드/Figma 어디에도 이 컴포넌트를 쓰지 말아야 할 상황에 대한 명시적 근거가 없어 문서에 억지로 채우지 않음.
- **실사용처 전무**: 코드베이스 전체에서 `Switch` 컴포넌트를 실제로 렌더링하는 화면이 스토리/테스트 외에는 없음. 조합 가이드를 채우려면 실제 적용 화면이 필요.
- **라벨을 빈 문자열로 줄 때 커스텀 접근성 이름 지정 불가**: `label=""`으로 시각적 라벨을 숨기면 `aria-label`이 하드코딩된 `"switch"` 문자열로 고정됨(`Switch.tsx:114`). 커스텀 접근성 이름이 필요한 라벨 없는 스위치 사용처가 생기면 이 하드코딩이 막힐 수 있음 — 의도된 설계인지 확인 필요.
- **키보드 인터랙션 테스트/스토리 부재**: 네이티브 `<button>` 시맨틱상 Enter/Space 토글이 될 것으로 예상되지만, Checkbox와 달리 이를 직접 검증하는 테스트나 스토리가 없음. 실제 동작 검증 및 Checkbox와의 커버리지 격차 보완이 필요한지 확인 필요.
- **라벨 텍스트 토큰 `--foreground` vs `--text-default`**: Figma `get_design_context` 원본 코드는 라벨 색을 `--text-default`로 명시하는데, 실제 `Switch.tsx`는 `--foreground`를 사용한다(`Switch.tsx:103`). `app/globals.css:72`에서 `--foreground: var(--text-default)`로 alias되어 있어 최종 값은 동일하지만, Checkbox 등 다른 컴포넌트는 `--text-default`를 직접 참조하는 관례를 쓰는 반면 Switch만 `--foreground` alias를 거친다 — 의도된 선택인지, 아니면 다른 컴포넌트와 일관성을 맞춰 `--text-default`로 통일할지 확인 필요.
- **on+disabled 조합의 트랙 색 처리**: on 상태는 disabled 여부와 무관하게 트랙이 항상 `--background-bold`이고, disabled 여부는 버튼 전체 opacity-50으로만 표현됨. Figma 쪽 `get_design_context` 원본에서도 on+disabled에 `opacity-50`을 쓰는 동일한 패턴이 보이므로 Figma 스펙과 일치하는 것으로 보이나, 별도의 "on+disabled 전용 트랙 색"이 디자인 의도였는지는 Figma 파일에서 별도 색상 스타일 지정 없이 opacity만으로 표현된 것이 맞는지 최종 확인 필요.
