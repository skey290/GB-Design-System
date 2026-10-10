# Checkbox

> Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-8617) · node-id `76:8617`
> 코드: `components/ui/checkbox/checkbox.tsx`

## Overview

라벨이 항상 붙는 단일 boolean 토글 Atom 컴포넌트. 네이티브 `<input type="checkbox">`가 아니라 `<button role="checkbox">` + `<label htmlFor>` 조합으로 구현되어 있고(`components/ui/checkbox/checkbox.tsx:85-130`), `checked`/`indeterminate`/`disabled`/`variant`(default|mute) 네 값으로 상태가 결정된다. 제어(controlled)·비제어(uncontrolled) 양쪽 사용 패턴을 모두 지원한다(`checked`가 `undefined`면 내부 state로 비제어 동작, 값이 있으면 완전 제어).

Figma 컴포넌트 설명(description) 필드 원문:

> A single boolean choice, optionally with a text label beside the box. Status sets what the box shows — nothing, part (indeterminate, for a partially selected group), or a check — and carries the disabled variants of each, so a disabled checkbox still shows whether it was checked. Type sets the visual tone of the enabled states. Use for one standalone yes/no option — for choosing one out of many mutually exclusive options, use a radio group instead.

## When to use

- 단일 항목에 대한 boolean 선택/동의가 필요하고, 그 항목에 **텍스트 라벨이 항상 함께 노출**되어야 할 때. `label`은 optional이 아니라 필수 prop이다(`CheckboxProps.label: string`) — 라벨 없는 체크박스는 이 컴포넌트로 표현할 수 없다.
- 실제 앱에서 관찰된 사용처: `components/ui/popover/popover.tsx`의 `type="notification"` Popover에서 "다시 보지 않기" 류의 옵션 행으로 사용(`variant="mute"`, 제어 컴포넌트로 `checked`/`onCheckedChange` 연결). 현재 코드베이스 내 실제 사용처는 이 한 곳뿐이다.

## When not to use

- **여러 선택지 중 하나만 고르는 경우.** Figma description이 명시한다 — 상호 배타적인 선택에는 Checkbox가 아니라 라디오 그룹을 쓴다. Checkbox는 독립적인 yes/no 하나를 위한 것이다.
- **켜는 즉시 효과가 발생하는 설정** → [Switch](./switch.md). Checkbox는 제출 시점에 반영되는 값에 쓴다.

## How to use

`checkbox.stories.tsx`에서 그대로 인용:

```tsx
// 기본(비제어) — 선택 안 됨
<Checkbox label="Accept terms and conditions" defaultChecked={false} />

// mute 톤 (Figma Type=mute)
<Checkbox label="Accept terms and conditions" defaultChecked={false} variant="mute" />

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
  variant="mute"
  label={checkboxLabel}
  checked={checkbox}
  onCheckedChange={onCheckedChange}
/>
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성:

- `checkbox.tsx` — 컴포넌트 구현
- `checkbox.stories.tsx` — Storybook CSF3 스토리
- `checkbox.test.tsx` — Vitest + Testing Library 테스트
- `index.ts` — `Checkbox`, `CheckboxProps` named export

내부 DOM 구조:

```
<div>                         inline-flex, gap-[var(--gb-spacing-2)]
  <button role="checkbox">    실제 박스 (체크/마이너스 아이콘은 lucide-react 컴포넌트)
  <label htmlFor={id}>        라벨 텍스트, text-sm-medium 타이포그래피 유틸리티 사용
```

- `id`는 미지정 시 `React.useId()`로 자동 생성되어 `label htmlFor`와 연결됨.
- 아이콘은 `lucide-react`의 `<Check />`/`<Minus />`를 직접 쓴다 — Figma도 `lucide/check`/`lucide/minus` 인스턴스다.

## Props

| Prop              | 타입                         | 기본값             | 설명                                                                                                                                                                           |
| ----------------- | ---------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `checked`         | `boolean`                    | —                  | 제어 컴포넌트로 쓸 때의 체크 여부 (Figma `Status=checked`)                                                                                                                     |
| `defaultChecked`  | `boolean`                    | `false`            | 비제어 컴포넌트 초기값                                                                                                                                                         |
| `indeterminate`   | `boolean`                    | `false`            | 인디터미네이트(부분 선택, Figma `Status=part`). `checked`와 독립적인 값이며 `true`면 `checked`와 무관하게 `aria-checked="mixed"`가 노출됨. 소비자가 직접 제어(내부 state 없음) |
| `onCheckedChange` | `(checked: boolean) => void` | —                  | 체크 상태 변경 시 호출                                                                                                                                                         |
| `disabled`        | `boolean`                    | `false`            | 비활성화. Figma `Status`의 `disabled`/`disabled-checked`/`disabled-part`에 대응 — `checked`/`indeterminate`와 조합해 결정됨                                                    |
| `variant`         | `"default" \| "mute"`        | `"default"`        | Figma `Type` 축의 시각 톤. 네이티브 `style` 속성과 이름 충돌 방지를 위해 `variant`로 명명                                                                                      |
| `label`           | `string`                     | — (필수)           | 체크박스 옆 라벨 텍스트                                                                                                                                                        |
| `className`       | `string`                     | —                  | 최상위 wrapper(`div`)에 병합                                                                                                                                                   |
| `id`              | `string`                     | 자동 생성(`useId`) | 미지정 시 내부 생성 id 사용, label과 연결                                                                                                                                      |

그 외 `React.ButtonHTMLAttributes<HTMLButtonElement>`를 `onChange`/`type`/`role` 제외하고 그대로 상속(`...props`가 내부 `<button>`에 전달됨).

## Variants

Figma 컴포넌트셋(`76:8617`)은 **`Type` × `Status` 2축**이다.

| 축       | 값                                                                                 | 코드 매핑                            |
| -------- | ---------------------------------------------------------------------------------- | ------------------------------------ |
| `Type`   | `default` · `mute`                                                                 | `variant` prop                       |
| `Status` | `default` · `part` · `checked` · `disabled` · `disabled-checked` · `disabled-part` | `checked`/`indeterminate`/`disabled` |

축 곱은 2×6 = 12인데 실제로 그려진 조합은 **9개**다 — `mute`에는 disabled 계열 3개가 없다. disabled 배색이 `Type`과 무관하게 하나뿐이라 `default` 아래에만 그려 둔 것이고, 누락이 아니다.

`disabled`는 Figma에서 `Status` 축의 값이지만 코드에서는 네이티브 `<button disabled>` 속성과 1:1 대응하는 별도 boolean prop이다(공통 Props 컨벤션). `checked`/`indeterminate`와 조합해 Figma의 어느 `disabled-*` 값에 해당하는지가 정해진다.

| 코드 조합                    | Figma `Status`     |
| ---------------------------- | ------------------ |
| `disabled`                   | `disabled`         |
| `disabled` + `checked`       | `disabled-checked` |
| `disabled` + `indeterminate` | `disabled-part`    |

토큰:

| Type      | Status               | border                    | background                      | 아이콘                  | 라벨                    |
| --------- | -------------------- | ------------------------- | ------------------------------- | ----------------------- | ----------------------- |
| `default` | default              | `--gb-border-muted`       | `--gb-background-bolder`        | —                       | `--gb-text-default`     |
| `default` | part·checked         | `--gb-border-subtle`      | `--gb-background-default`       | `--gb-icon-default`     | `--gb-text-default`     |
| `mute`    | default·part·checked | `--gb-border-mute-subtle` | `--gb-background-default`       | `--gb-icon-default`     | `--gb-text-subtle`      |
| 전부      | `disabled-*`         | `--gb-border-default`     | `--gb-background-disabled-bold` | `--gb-icon-static-gray` | `--gb-text-static-gray` |

`mute`는 세 활성 Status에서 배색이 동일하고, Status가 바꾸는 것은 박스 안의 표시(없음/대시/체크)뿐이다. `default`만 marked 여부로 배색이 반전된다(미체크는 진한 박스, 체크/부분선택은 흰 박스 + 아이콘).

박스 공통: `size-[16px]`, `rounded-[var(--gb-radius-scale-sm)]`, `border-[length:var(--gb-border-1)]`, `shadow-[var(--gb-shadow-xs)]`(Figma `Box Shadow/shadow-xs`). 포커스 시 `shadow-[var(--gb-shadow-focus-ring)]`. 아이콘 `size-[12px]`. wrapper 간격 `gap-[var(--gb-spacing-2)]`. 박스/아이콘 크기는 컴포넌트 자체 치수라 리터럴 px를 쓴다.

Figma 변수명 `border/subtler`의 코드 토큰은 `--gb-border-subtle`이다 — 이름만 다르고 값은 같다(다크 `#262626`, `src/tokens/colors.css` 참고).

## States and behaviors

- **unchecked / checked / indeterminate**: `isMarked = indeterminate || isChecked`로 판단. marked면 흰 배경(`--background-default`) + 아이콘, 아니면 진하게 채워진 박스(`--background-bolder`, 아이콘 없음) — Figma 원본대로 "반전"된 배색이며 Figma 원본 그대로 보정 없이 구현한다.
- **indeterminate 우선순위**: `indeterminate`가 `true`면 `checked` 값과 무관하게 `aria-checked="mixed"`가 되고 minus 아이콘이 렌더링됨(`checkbox.test.tsx:24-31`에서 검증).
- **disabled**: `variant`보다 우선해 고정 배색(`cursor-not-allowed`, `--gb-border-default`, `--gb-background-disabled-bold`, 아이콘 `--gb-icon-static-gray`, 라벨 `--gb-text-static-gray`)이 적용된다. **단 Status 표시는 유지된다** — `disabled + checked`는 회색 박스에 회색 체크가 보여 "선택됨, 지금은 수정 불가"가 구분된다. 클릭은 네이티브 `disabled` 속성과 `handleClick`의 `if (disabled || event.defaultPrevented) return` 이중으로 막힌다.
- **disabled는 hover와 무관하게 고정 스타일** — 확인됨. 다만 정확히는, `checkbox.tsx` 전체에 `hover:` Tailwind 클래스가 단 하나도 없다. 즉 disabled뿐 아니라 모든 상태가 hover 시 시각적으로 변하지 않는다. disabled 상태는 그중에서도 항상 동일한 한 세트의 클래스만 적용되므로 "hover/select에 상태 변화 없음" 규칙을 만족한다.
- **focus**: `focus-visible:shadow-[var(--gb-shadow-focus-ring)]`가 base 클래스에 있다. 네이티브 `<button disabled>`는 포커스를 받지 않으므로 disabled 상태에서는 발동하지 않는다.
- **키보드**: 네이티브 `<button>` 시맨틱을 사용하므로 Enter/Space로 토글됨(`KeyboardInteraction` story, `checkbox.test.tsx:86-98`에서 검증).
- **라벨 클릭**: `<label htmlFor>` 네이티브 연결로 라벨 텍스트 클릭 시에도 토글됨(`LabelClickInteraction` story, `checkbox.test.tsx:47-55`).
- **제어/비제어**: `checked`가 `undefined`가 아니면 완전 제어(내부 state 미사용, `onCheckedChange`만 호출하고 실제 체크 여부는 부모가 다시 넘겨줘야 반영됨 — `checkbox.test.tsx:68-84`에서 검증). `checked`가 `undefined`면 내부 `useState(defaultChecked)`로 비제어 동작.
- **`mute` × `disabled`**: Figma에 스와치가 없다. disabled 배색이 `Type`과 무관하게 하나뿐이라서이고, 코드도 `disabled`가 `variant`를 덮어 같은 결과를 낸다.

## 다른 범용 컴포넌트와의 조합 가이드

현재 코드베이스에서 관찰된 조합은 다음 한 가지뿐:

- **Popover(`components/ui/popover/popover.tsx`) 내 notification 타입**: 설명 텍스트와 액션 버튼(`Button`) 사이에 `variant="mute"` Checkbox 한 줄을 옵션으로 배치(예: "다시 보지 않기" 류). Popover 전체가 `<div className="dark">`로 강제 다크 렌더링되는 컨텍스트 안에서 사용됨.

그 외 리스트 아이템 선택, 약관 동의 폼 등 다른 조합 패턴은 앱 내에 없다(현재는 Popover 사용처와 컴포넌트 자체 스토리/테스트뿐).

## hover 상태가 없는 것은 의도다

`checkbox.tsx`에는 `hover:` 클래스가 하나도 없고, Figma `Status` 축에도 hover 값이 없다. 라벨이 달린 행 전체가 클릭 대상이라 hover 피드백 없이도 조작 지점이 분명하다 — 다른 컴포넌트(Button·Chips·Select)에 hover가 있는 것과 다른 선택이며, 누락이 아니다.

## ⚠️ 확인 필요

없음.
