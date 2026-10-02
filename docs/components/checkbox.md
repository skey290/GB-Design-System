# Checkbox

> Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=76-8617) · node-id `76:8617`
> 코드: `components/ui/checkbox/Checkbox.tsx`

## Overview

라벨이 항상 붙는 단일 boolean 토글 Atom 컴포넌트. 네이티브 `<input type="checkbox">`가 아니라 `<button role="checkbox">` + `<label htmlFor>` 조합으로 구현되어 있고(`components/ui/checkbox/Checkbox.tsx:85-130`), `checked`/`indeterminate`/`disabled`/`variant`(default|muted) 4가지 축으로 상태가 결정된다. 제어(controlled)·비제어(uncontrolled) 양쪽 사용 패턴을 모두 지원한다(`checked`가 `undefined`면 내부 state로 비제어 동작, 값이 있으면 완전 제어).

Figma 컴포넌트에 별도 설명(description) 필드는 없음 — `get_metadata`/`get_design_context` 응답 모두 컴포넌트 설명 텍스트를 반환하지 않았다. 아래 내용은 전부 코드(`Checkbox.tsx`/`.stories.tsx`/`.test.tsx`)와 Figma variant 구조에서 직접 확인한 사실만 기술한다.

## When to use

- 단일 항목에 대한 boolean 선택/동의가 필요하고, 그 항목에 **텍스트 라벨이 항상 함께 노출**되어야 할 때. `label`은 optional이 아니라 필수 prop이다(`CheckboxProps.label: string`) — 라벨 없는 체크박스는 이 컴포넌트로 표현할 수 없다.
- 실제 앱에서 관찰된 사용처: `components/ui/popover/popover.tsx`의 `type="notification"` Popover에서 "다시 보지 않기" 류의 옵션 행으로 사용(`variant="muted"`, 제어 컴포넌트로 `checked`/`onCheckedChange` 연결). 현재 코드베이스 내 실제 사용처는 이 한 곳뿐이다.

## When not to use

⚠️ 코드/Figma에서 "이런 경우엔 쓰지 말 것"을 뒷받침하는 근거를 찾지 못함 — 아래 "확인 필요" 섹션 참고.

## How to use

`Checkbox.stories.tsx`에서 그대로 인용:

```tsx
// 기본(비제어) — 선택 안 됨
<Checkbox label="Accept terms and conditions" defaultChecked={false} />

// muted 스타일 (미체크 상태 전용 톤 다운 스와치)
<Checkbox label="Accept terms and conditions" defaultChecked={false} variant="muted" />

// 비활성화
<Checkbox label="Accept terms and conditions" defaultChecked={false} disabled />

// 체크됨
<Checkbox label="Accept terms and conditions" defaultChecked={true} />

// 인디터미네이트(부분 선택)
<Checkbox label="Accept terms and conditions" indeterminate />
```

실제 앱 내 조합 사용 예 (`components/ui/popover/popover.tsx:127-134`, 제어 컴포넌트):

```tsx
<Checkbox
  variant="muted"
  label={checkboxLabel}
  checked={checkbox}
  onCheckedChange={onCheckedChange}
/>
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성:

- `Checkbox.tsx` — 컴포넌트 구현
- `Checkbox.stories.tsx` — Storybook CSF3 스토리
- `Checkbox.test.tsx` — Vitest + Testing Library 테스트
- `index.ts` — `Checkbox`, `CheckboxProps` named export

내부 DOM 구조:

```
<div>                         inline-flex, gap-[var(--spacing-2)]
  <button role="checkbox">    실제 박스 (체크 아이콘/마이너스 아이콘은 <svg><use> 로 icons.svg 스프라이트 참조)
  <label htmlFor={id}>        라벨 텍스트, text-sm-medium 타이포그래피 유틸리티 사용
```

- `id`는 미지정 시 `React.useId()`로 자동 생성되어 `label htmlFor`와 연결됨.
- 아이콘은 `/icons.svg#check-icon`, `/icons.svg#minus-icon` 스프라이트 참조(하드코딩 인라인 SVG 아님).

## Props

| Prop              | 타입                         | 기본값             | 설명                                                                                                                                                                            |
| ----------------- | ---------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `checked`         | `boolean`                    | —                  | 제어 컴포넌트로 쓸 때의 체크 여부 (Figma `Checked` variant)                                                                                                                     |
| `defaultChecked`  | `boolean`                    | `false`            | 비제어 컴포넌트 초기값                                                                                                                                                          |
| `indeterminate`   | `boolean`                    | `false`            | 인디터미네이트(부분 선택, Figma `Part` variant). `checked`와 독립적인 값이며 `true`면 `checked`와 무관하게 `aria-checked="mixed"`가 노출됨. 소비자가 직접 제어(내부 state 없음) |
| `onCheckedChange` | `(checked: boolean) => void` | —                  | 체크 상태 변경 시 호출                                                                                                                                                          |
| `disabled`        | `boolean`                    | `false`            | 비활성화 (Figma `Disabled` variant)                                                                                                                                             |
| `variant`         | `"default" \| "muted"`       | `"default"`        | Figma `Style` variant. 네이티브 `style` 속성과 이름 충돌 방지를 위해 `variant`로 명명                                                                                           |
| `label`           | `string`                     | — (필수)           | 체크박스 옆 라벨 텍스트                                                                                                                                                         |
| `className`       | `string`                     | —                  | 최상위 wrapper(`div`)에 병합                                                                                                                                                    |
| `id`              | `string`                     | 자동 생성(`useId`) | 미지정 시 내부 생성 id 사용, label과 연결                                                                                                                                       |

그 외 `React.ButtonHTMLAttributes<HTMLButtonElement>`를 `onChange`/`type`/`role` 제외하고 그대로 상속(`...props`가 내부 `<button>`에 전달됨).

## Variants

Figma 컴포넌트 세트는 `Type` × `Style` 2축 조합(Figma 레이어명 원문 그대로, `Defalut`는 Figma 측 오타로 보임 — 확인 필요 항목 참고):

| Figma `Type` | Figma `Style` | 코드 매핑                                                                     |
| ------------ | ------------- | ----------------------------------------------------------------------------- |
| `Defalut`    | `default`     | `checked=false`, `indeterminate=false`, `disabled=false`, `variant="default"` |
| `Defalut`    | `muted`       | `checked=false`, `indeterminate=false`, `disabled=false`, `variant="muted"`   |
| `Checked`    | `default`     | `checked=true`                                                                |
| `Part`       | `default`     | `indeterminate=true`                                                          |
| `Disabled`   | `default`     | `disabled=true`                                                               |

**muted는 미체크·비활성 아닌 상태에만 존재하는 스와치**다. Figma 컴포넌트 세트에 checked/indeterminate/disabled와 조합된 muted 스와치가 없고, 코드도 이를 그대로 반영한다 — `isMuted = variant === "muted" && !disabled && !isMarked` (`Checkbox.tsx:76`). 즉 `variant="muted"`를 checked/indeterminate/disabled와 같이 넘겨도 muted 스타일은 무시되고 해당 상태의 일반 스타일이 우선한다.

토큰(값이 아닌 이름만, `Checkbox.tsx` 기준):

| 상태                               | border             | background                   | text/icon             |
| ---------------------------------- | ------------------ | ---------------------------- | --------------------- |
| unchecked (default)                | `--border-muted`   | `--background-bolder`        | —                     |
| checked / indeterminate ("marked") | `--border-subtle`  | `--background-default`       | `--icon-default`      |
| muted (unchecked, enabled)         | `--border-mute`    | `--background-default`       | 라벨 `--text-subtler` |
| disabled                           | `--border-default` | `--background-disabled-bold` | 라벨 `--text-subtle`  |
| 라벨 기본                          | —                  | —                            | `--text-default`      |

박스 공통: `size-[var(--spacing-4)]`, `rounded-[var(--radius-scale-sm)]`, `border-[length:var(--border-1)]`, `shadow-[var(--shadow-xs)]`. 포커스 시 `shadow-[var(--shadow-focus-ring)]`. 아이콘 크기 `size-[var(--spacing-3)]`. wrapper 간격 `gap-[var(--spacing-2)]`.

## States and behaviors

- **unchecked / checked / indeterminate**: `isMarked = indeterminate || isChecked`로 판단. marked면 흰 배경(`--background-default`) + 아이콘, 아니면 진하게 채워진 박스(`--background-bolder`, 아이콘 없음) — Figma 원본대로 "반전"된 배색이며 코드 주석에 "사용자 확인 후 보정 없이 구현"이라고 명시되어 있음(`Checkbox.tsx:71-72`).
- **indeterminate 우선순위**: `indeterminate`가 `true`면 `checked` 값과 무관하게 `aria-checked="mixed"`가 되고 minus 아이콘이 렌더링됨(`Checkbox.test.tsx:24-31`에서 검증).
- **disabled**: `disabled`가 true면 marked/muted 판정과 무관하게 고정 클래스(`cursor-not-allowed`, `border-default`, `background-disabled-bold`, 라벨 `text-subtle`)가 적용됨. 클릭은 네이티브 `disabled` 속성과 `handleClick` 내부의 `if (disabled || event.defaultPrevented) return` 이중으로 막혀 `onCheckedChange`가 호출되지 않음(`Checkbox.test.tsx:100-114`, story `DisabledInteraction`에서 검증).
- **disabled는 hover와 무관하게 고정 스타일** — 확인됨. 다만 정확히는, `Checkbox.tsx` 전체에 `hover:` Tailwind 클래스가 단 하나도 없다. 즉 disabled뿐 아니라 모든 상태가 hover 시 시각적으로 변하지 않는다. disabled 상태는 그중에서도 항상 동일한 한 세트의 클래스만 적용되므로 "hover/select에 상태 변화 없음" 규칙을 만족한다.
- **focus**: `focus-visible:shadow-[var(--shadow-focus-ring)]`가 base 클래스에 포함되어 상태와 무관하게 정의되어 있음(단, 네이티브 disabled 버튼은 보통 포커스를 받지 않으므로 실질적으로는 비활성 상태가 아닐 때만 관찰 가능 — 확인 필요 항목 참고).
- **키보드**: 네이티브 `<button>` 시맨틱을 사용하므로 Enter/Space로 토글됨(`KeyboardInteraction` story, `Checkbox.test.tsx:86-98`에서 검증).
- **라벨 클릭**: `<label htmlFor>` 네이티브 연결로 라벨 텍스트 클릭 시에도 토글됨(`LabelClickInteraction` story, `Checkbox.test.tsx:47-55`).
- **제어/비제어**: `checked`가 `undefined`가 아니면 완전 제어(내부 state 미사용, `onCheckedChange`만 호출하고 실제 체크 여부는 부모가 다시 넘겨줘야 반영됨 — `Checkbox.test.tsx:68-84`에서 검증). `checked`가 `undefined`면 내부 `useState(defaultChecked)`로 비제어 동작.
- **Figma에 없는 조합**: `DisabledChecked` 스토리(`disabled=true` + `defaultChecked=true`)가 존재하며, 스토리 이름 자체에 "Figma에 없는 조합"이라고 명시되어 있음. 코드 동작상으로는 disabled 스타일이 우선 적용되어 체크 아이콘은 보이지 않는다(`!disabled && isChecked`일 때만 아이콘 렌더링).

## 다른 범용 컴포넌트와의 조합 가이드

현재 코드베이스에서 관찰된 조합은 다음 한 가지뿐:

- **Popover(`components/ui/popover/popover.tsx`) 내 notification 타입**: 설명 텍스트와 액션 버튼(`Button`) 사이에 `variant="muted"` Checkbox 한 줄을 옵션으로 배치(예: "다시 보지 않기" 류). Popover 전체가 `<div className="dark">`로 강제 다크 렌더링되는 컨텍스트 안에서 사용됨.

그 외 리스트 아이템 선택, 약관 동의 폼 등 다른 조합 패턴은 `grep -rn "Checkbox" app/ components/` 기준으로 앱 내에 존재하지 않음(현재는 Popover 사용처와 컴포넌트 자체 스토리/테스트뿐).

## ⚠️ 확인 필요

- **Figma 컴포넌트 설명(description) 필드 부재**: `get_metadata`/`get_design_context` 응답 모두 이 컴포넌트에 대한 설명 텍스트를 반환하지 않았음. Figma 파일에서 직접 Description 패널을 확인해 실제로 비어있는지 재확인 필요.
- **"When not to use" 근거 없음**: 코드/Figma 어디에도 이 컴포넌트를 쓰지 말아야 할 상황에 대한 명시적 근거가 없어 문서에 억지로 채우지 않음.
- **Hover 스타일 자체의 부재**: `Checkbox.tsx`에 `hover:` 클래스가 전혀 없어 disabled뿐 아니라 모든 상태가 hover 시 시각 변화가 없음. 이것이 의도된 디자인(Figma에도 hover variant가 Figma 컴포넌트 세트 metadata상 없음)인지, 아니면 향후 hover 스타일 추가가 필요한 누락인지 확인 필요.
- **Disabled+Checked 조합**: `DisabledChecked` 스토리가 "Figma에 없는 조합"으로 존재. 실제 화면에서 이 조합(체크된 상태를 비활성화로 보여주는 것)이 필요한 요구사항인지, 아니면 방어적 케이스로만 남겨둔 것인지 확인 필요.
- **focus-visible 스타일과 disabled의 상호작용**: `focus-visible:shadow-[var(--shadow-focus-ring)]`가 상태 무관 공통 클래스로 정의돼 있으나, 브라우저 네이티브 동작상 `disabled` 버튼은 포커스를 받지 않는 것이 일반적 — 실제 브라우저별 접근성 동작 검증 필요.
- **Figma variant 명칭 오타(`Defalut`)**: Figma 컴포넌트 세트의 `Type` variant 값이 `Default`가 아니라 `Defalut`로 되어 있음(metadata에서 확인). 오타를 Figma에서 수정할지, 코드/문서에서 그대로 따를지는 별도 확인 필요.
