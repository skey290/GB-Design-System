# Input

Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=520-3062) — `Part/Input` (node-id `520:3062`)
Code: `components/ui/input/input.tsx`

## Overview

Figma "Part/Input" 컴포넌트(node-id `520:3062`)를 기반으로 구현된 단일 라인 텍스트 입력의 base 컴포넌트다. Figma 컴포넌트 자체에 description(설명) 필드는 없음 — **Figma에 별도 설명 없음**.

`input.tsx` 코드 주석(JSDoc)에 따르면, 이 컴포넌트는 label/아이콘/에러 텍스트 없이 순수 `<input>` 박스만 구현되어 있다. 값(value)이 없을 때는 native `placeholder`로 예시 텍스트를 보여주고, 포커스 시 placeholder가 즉시 사라지며(`focus:placeholder:opacity-0`), 값이 있는 필드는 일반 브라우저 caret 동작을 따른다(단, 빈 필드는 클릭 위치와 무관하게 caret이 항상 맨 앞에 위치하도록 커스텀 처리됨 — Structure/States 참고).

## When to use

- 코드 사용처 확인 결과(`grep`), 이 컴포넌트는 앱 화면에서 직접 쓰이기보다 **다른 input 계열 컴포넌트의 base로 합성**되어 쓰인다. `input-basic`, `input-search`, `input-phone`, `input-link` 4개 컴포넌트가 내부적으로 `import { Input } from "@/components/ui/input"` 형태로 이 컴포넌트를 감싸/합성한다.
- Figma에 "언제 쓰는지"에 대한 별도 description은 없다.

## When not to use

⚠️ 확인 필요 항목 참고 — 코드/Figma 어디에도 "언제 쓰면 안 되는지"를 판단할 근거가 없어 억지로 채우지 않음.

## How to use

`input.stories.tsx`에 있는 실제 스토리 코드 그대로 인용.

```tsx
import { Input } from "./input";

// Figma `State=default`
export const Default: Story = {
  args: {
    placeholder: "Email or Username",
  },
};

// Figma `State=active` — 실제로는 prop이 아니라 hover/focus CSS 상태.
export const Focused: Story = {
  args: {
    placeholder: "Email or Username",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Email or Username");
    await userEvent.click(input);
    await expect(input).toHaveFocus();
  },
};

// Figma `State=disabled` (node-id 4522:7021)
export const Disabled: Story = {
  args: {
    placeholder: "Email or Username",
    disabled: true,
    defaultValue: "이미 입력된 값",
  },
};

export const TypingInteraction: Story = {
  name: "Typing / Interaction",
  args: {
    placeholder: "Email or Username",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Email or Username");
    await userEvent.type(input, "hello@example.com");
    await expect(input).toHaveValue("hello@example.com");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      "hello@example.com",
    );
  },
};
```

제어(controlled) 컴포넌트로 쓸 때는 `value` + `onValueChange`를, 비제어(uncontrolled)로 쓸 때는 `defaultValue`만 넘긴다(`value`와 `defaultValue`를 동시에 넘기면 `value`가 우선하며 controlled로 동작).

## Structure

기본은 단일 native `<input>` 엘리먼트지만, `trailingIcon`을 켜면 `<div className="relative">` wrapper 안에 input + 우측 절대 위치 아이콘으로 구조가 바뀐다.

- **label 없음** — 라벨이 필요하면 호출부에서 별도로 배치해야 한다.
- **trailing 아이콘 슬롯 있음(opt-in)** — `trailingIcon`(boolean, 기본 `false`) + `icon`(`LucideIcon`, 기본 `Plus`) prop으로 제어. Figma 컴포넌트 프로퍼티 기본값은 `true`이지만, 기존 파생 컴포넌트(input-basic/input-search/input-phone/input-link)가 전부 아이콘 없이 쓰이고 있어 코드 기본값은 `false`로 뒀다(2026-09-29 사용자 확인, `input.tsx` 상단 주석 참고).
- **validation/error 메시지 없음** — 에러 상태 표시 로직 없음.
- `className`은 `trailingIcon`이 `false`일 때는 `<input>`에, `true`일 때는 바깥 wrapper `<div>`에 적용된다 — 아이콘 사용 시 대상이 바뀌는 점 주의.

## Props

`InputProps`는 `React.InputHTMLAttributes<HTMLInputElement>`에서 `value`/`defaultValue`/`onChange`를 제외(Omit)하고 아래를 추가한 형태다.

| Prop            | Type                                                             | Default     | Description                                                                           |
| --------------- | ---------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `value`         | `string`                                                         | `undefined` | 제어 컴포넌트로 사용할 때의 값                                                        |
| `defaultValue`  | `string`                                                         | `""`        | 비제어 컴포넌트로 사용할 때의 초기 값                                                 |
| `onValueChange` | `(value: string) => void`                                        | `undefined` | 값이 바뀔 때 호출                                                                     |
| `ref`           | `React.Ref<HTMLInputElement>`                                    | `undefined` | 실제 DOM `<input>`에 접근해야 하는 조합 컴포넌트(예: TimeMaskInput)를 위한 ref        |
| `disabled`      | `boolean` (native)                                               | `undefined` | 비활성화 여부                                                                         |
| `trailingIcon`  | `boolean`                                                        | `false`     | trailing 아이콘 표시 여부(opt-in). Figma 컴포넌트 프로퍼티 기본값은 `true`            |
| `icon`          | `LucideIcon`                                                     | `Plus`      | trailing 아이콘 컴포넌트. `trailingIcon`이 `true`일 때만 렌더링                       |
| `...props`      | `React.InputHTMLAttributes<HTMLInputElement>` (위 3개 제외 전체) | —           | `type`, `placeholder`, `maxLength`, `readOnly` 등 native `<input>` 속성을 그대로 전달 |

## Variants

이 컴포넌트에는 cva 기반 `variant` prop이 없다. Figma의 `State`(`default`/`active`/`disabled`/`filled`)는 React prop으로 노출되지 않고 전부 native 상태(`disabled` 속성)와 CSS pseudo-class(`:hover`, `:focus`)로 처리된다 — 자세한 내용은 아래 States 섹션 참고.

## States and behaviors

| 상태                           | 트리거                                                     | 스타일(토큰)                                                                                                                                                                                                                                                      |
| ------------------------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default                        | 값 없음, 비활성/비포커스                                   | `border-[var(--border)]`, `bg-[var(--background)]`, `text-[var(--foreground)]`, `text-sm-medium`                                                                                                                                                                  |
| hover / focus (Figma `active`) | 마우스 오버 또는 클릭/키보드 포커스 (`disabled`가 아닐 때) | `border-[var(--ring)]`, `shadow-[var(--shadow-focus-ring)]`                                                                                                                                                                                                       |
| filled (값 있음)               | 값이 입력된 상태                                           | 별도 코드 분기 없음 — 입력된 텍스트는 placeholder가 아닌 일반 텍스트 색(`--foreground`)이라 자연스럽게 Figma의 `filled`와 일치                                                                                                                                    |
| disabled                       | `disabled` prop                                            | `text-sm-regular`(다른 상태는 `text-sm-medium`), `cursor-not-allowed`, `border-[var(--border-overlay)]`, `bg-[var(--background-disabled)]`, `text-[var(--text-static-gray)]`. hover/focus로 인한 보더·그림자 변화 없음(`not-disabled:` variant로 명시적으로 차단) |

`trailingIcon`이 켜졌을 때 아이콘 색 상태(Figma 컴포넌트 프로퍼티 기준):

| 상태                 | 아이콘 색 토큰                        |
| -------------------- | ------------------------------------- |
| default              | `--icon-subtle`                       |
| hover / focus-within | `--icon-default`                      |
| disabled             | `--icon-static-gray`(hover 무관 고정) |

기타 관찰된 동작:

- **포커스 시 placeholder 즉시 숨김**: `focus:placeholder:opacity-0` — 기본 브라우저 동작(타이핑 시작 후 사라짐)과 다르게, 포커스되는 즉시 사라진다.
- **빈 필드 클릭 시 caret 항상 맨 앞**: 값이 빈 문자열일 때 필드를 클릭하면 클릭 위치와 무관하게 caret이 0번 위치에 고정된다(`onMouseDown`에서 `preventDefault` + `setSelectionRange(0, 0)`). 값이 있는 필드는 일반 브라우저 동작(클릭한 위치에 caret)을 따른다. `setSelectionRange`가 스펙상 지원되는 타입(`text`/`search`/`url`/`tel`/`password`)에서만 동작하며, 그 외 타입(예: `email`)은 이 로직을 건너뛴다.
- **readOnly**: 별도 커스텀 스타일 없이 native `readOnly` 속성만 그대로 전달됨(코드에 readOnly 전용 분기 없음).

## 다른 범용 컴포넌트와의 조합 가이드

코드에서 확인된 구조적 관계:

- `Input`은 **base 컴포넌트**다. 아래 컴포넌트들이 내부적으로 `Input`을 import해서 감싸거나 합성한다(실제 `import` 문으로 확인):
  - `input-basic` (`components/ui/input-basic/input-basic.tsx`)
  - `input-search` (`components/ui/input-search/input-search.tsx`)
  - `input-phone` (`components/ui/input-phone/input-phone.tsx`)
  - `input-link` (`components/ui/input-link/input-link.tsx`)
- `input-file-upload`와 `textarea`는 `Input`을 import하지 않는다 — 별도의 독립 구현이다. `input-file-upload`는 코드 주석에 따르면 native `<input type="file">`이 controlled `value`를 지원하지 않아 base `Input`(controlled value 모델)을 재사용할 수 없는 것이 명시된 이유다. `textarea`는 multi-line(`<textarea>`) 엘리먼트라 base `Input`(`<input>`)과 DOM 엘리먼트 자체가 다르다.
- 앱 페이지(`app/`)나 `components/ui/input/` 바깥에서 `Input`을 직접 import해 쓰는 곳은 발견되지 않았다(위 4개 input-계열 컴포넌트 내부 합성 용도로만 관찰됨) — 즉 Button 등 다른 컴포넌트와의 직접 조합 패턴은 관찰되지 않았다.

## ⚠️ 확인 필요

- ~~Figma 원본에 트레일링 아이콘 존재, 코드에는 없음~~ → **해결됨(2026-09-29)**: Figma `componentPropertyDefinitions` 재조회 결과 `trailingIcon`(Boolean, 기본값 true) + `icon`(Instance Swap, 기본값 lucide `Plus`)이 정식 컴포넌트 프로퍼티로 확인되어, `trailingIcon`/`icon` prop을 추가했다. 코드 기본값은 기존 화면(아이콘 없이 사용 중) 영향을 피하기 위해 Figma 기본값(true)과 다르게 `false`로 뒀다(사용자 확인 완료).
- ~~Storybook `parameters.design.url`의 Figma 파일 키 불일치~~ → **해결됨(2026-09-29)**: 구 파일 키(`PrsHuyyra9LzqqrDwmrB5P`)를 현재 파일 키(`G9YNa2vjdqDjnML9y5hXJ4`)로 정정.
- **"When to use" / "When not to use"**: Figma에 description이 없고, 코드 주석에도 사용 시나리오에 대한 명시적 기술이 없어 채우지 못했다. 실제 사용 가이드라인이 있다면 확인 후 보강 필요.
- **readOnly/error 등 프로젝트 전반의 폼 검증 패턴과의 관계**: 이 컴포넌트 자체에는 에러 상태 표현이 없는데, 실제 폼에서 에러를 어떻게 표시하는지(예: 별도 에러 텍스트 컴포넌트 조합 여부) 이번 조사 범위에서는 확인하지 않았다 — 필요하면 별도 조사 필요.
