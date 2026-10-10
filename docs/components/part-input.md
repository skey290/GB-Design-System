# Part/Input

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=520-3062) — `Part/Input` (node-id `520:3062`)
Code: `components/ui/part-input/part-input.tsx`

## Overview

Figma "Part/Input" 컴포넌트(node-id `520:3062`)를 기반으로 구현된 단일 라인 텍스트 입력의 base 컴포넌트다.

Figma 컴포넌트 설명(description) 필드 원문:

> "The bare single-line input box: border, padding, placeholder, and the optional trailing icon. Has no label, helper text, or error message — those are composed by the higher-level fields (Input, Input search, Input time, Input phone) that wrap this as their base. Use one of those rather than placing this on its own."

`input.tsx` 코드 주석(JSDoc)에 따르면, 이 컴포넌트는 label/아이콘/에러 텍스트 없이 순수 `<input>` 박스만 구현되어 있다. 값(value)이 없을 때는 native `placeholder`로 예시 텍스트를 보여주고, 포커스 시 placeholder가 즉시 사라지며(`focus:placeholder:opacity-0`), 값이 있는 필드는 일반 브라우저 caret 동작을 따른다(단, 빈 필드는 클릭 위치와 무관하게 caret이 항상 맨 앞에 위치하도록 커스텀 처리됨 — Structure/States 참고).

## When to use

- 이 컴포넌트는 앱 화면에서 직접 쓰이기보다 **다른 input 계열 컴포넌트의 base로 합성**되어 쓰인다. `input-time`, `input-phone`이 `import { Input } from "@/components/ui/input"` 형태로 감싼다.
- 주의: `input-search`는 코드에서 `PartInput`을 합성하지만 **Figma에서는 `Part/Input` 인스턴스를 쓰지 않는다**(아이콘·텍스트가 루트 직속). `input-link`는 **코드에 존재하지 않고**, Figma에서도 별도 컴포넌트셋이 아니라 `Input`(`5084:3716`)의 `Link` boolean 슬롯이다.

## When not to use

- **앱 화면에 이것만 단독으로 놓지 않는다.** 라벨·헬퍼 텍스트·에러 메시지가 없으므로, 그게 필요하면 이것을 base로 감싸는 상위 필드(`Input`, `Input search`, `Input time`, `Input phone`)를 쓴다.

## How to use

`input.stories.tsx`에 있는 실제 스토리 코드 그대로 인용.

```tsx
import { Input } from "./input";

// Figma `Status=default`
export const Default: Story = {
  args: {
    placeholder: "Email or Username",
  },
};

// Figma `Status=active` — 실제로는 prop이 아니라 hover/focus CSS 상태.
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

// Figma `Status=disabled` (node-id 4522:7021)
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
- **trailing 아이콘 슬롯 있음(opt-in)** — `trailingIcon`(boolean, 기본 `false`) + `icon`(`LucideIcon`, 기본 `Plus`) prop으로 제어. Figma 컴포넌트 프로퍼티 기본값은 `true`이지만, 파생 컴포넌트(input-time/input-search/input-phone)가 전부 아이콘 없이 쓰이므로 코드 기본값은 `false`다.
- **validation/error 메시지 없음** — 에러 상태 표시 로직 없음.
- `className`은 `trailingIcon`이 `false`일 때는 `<input>`에, `true`일 때는 바깥 wrapper `<div>`에 적용된다 — 아이콘 사용 시 대상이 바뀌는 점 주의.

## Props

`PartInputProps`는 `React.InputHTMLAttributes<HTMLInputElement>`에서 `value`/`defaultValue`/`onChange`를 제외(Omit)하고 아래를 추가한 형태다.

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

이 컴포넌트에는 cva 기반 `variant` prop이 없다. Figma의 축은 `Status` 하나이고 값은 `default`/`active`/`disabled`/`filled`/`error` 5개(완전 조합)다.

`active`/`filled`는 React prop으로 노출되지 않고 CSS pseudo-class(`:hover`, `:focus`)와 값 유무로 자동 처리되며, `disabled`는 네이티브 속성, `error`만 `isError` boolean prop이다.

## States and behaviors

| 상태                           | 트리거                                                     | 스타일(토큰)                                                                                                                                                                                                                                                          |
| ------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default                        | 값 없음, 비활성/비포커스                                   | `border-[var(--border)]`, `bg-[var(--background)]`, `text-[var(--foreground)]`, `text-sm-medium`                                                                                                                                                                      |
| hover / focus (Figma `active`) | 마우스 오버 또는 클릭/키보드 포커스 (`disabled`가 아닐 때) | `border-[var(--ring)]`, `shadow-[var(--gb-shadow-focus-ring)]`                                                                                                                                                                                                        |
| filled (값 있음)               | 값이 입력된 상태                                           | 별도 코드 분기 없음 — 입력된 텍스트는 placeholder가 아닌 일반 텍스트 색(`--foreground`)이라 자연스럽게 Figma의 `filled`와 일치                                                                                                                                        |
| disabled                       | `disabled` prop                                            | `cursor-not-allowed`, `border-[var(--gb-border-overlay)]`, `bg-[var(--gb-background-disabled)]`, `text-[var(--gb-text-static-gray)]`. 타이포는 다른 상태와 같은 `text-sm-medium`. hover/focus로 인한 보더·그림자 변화 없음(`not-disabled:` variant로 명시적으로 차단) |
| error                          | `isError` prop                                             | `border-[var(--gb-border-warning)]`. 에러 문구는 이 컴포넌트가 렌더링하지 않는다 — 소비처가 조합한다                                                                                                                                                                  |

`trailingIcon`이 켜졌을 때 아이콘 색 상태(Figma 컴포넌트 프로퍼티 기준):

| 상태                      | 아이콘 색 토큰          |
| ------------------------- | ----------------------- |
| 값 없음 (default, active) | `--gb-icon-subtle`      |
| 값 있음 (filled)          | `--gb-icon-default`     |
| disabled                  | `--gb-icon-static-gray` |

Figma는 **값 유무**로 아이콘 색을 가른다 — hover/focus로는 바뀌지 않는다. `active`도 `icon/subtle`이다.

기타 관찰된 동작:

- **포커스 시 placeholder 즉시 숨김**: `focus:placeholder:opacity-0` — 기본 브라우저 동작(타이핑 시작 후 사라짐)과 다르게, 포커스되는 즉시 사라진다.
- **빈 필드 클릭 시 caret 항상 맨 앞**: 값이 빈 문자열일 때 필드를 클릭하면 클릭 위치와 무관하게 caret이 0번 위치에 고정된다(`onMouseDown`에서 `preventDefault` + `setSelectionRange(0, 0)`). 값이 있는 필드는 일반 브라우저 동작(클릭한 위치에 caret)을 따른다. `setSelectionRange`가 스펙상 지원되는 타입(`text`/`search`/`url`/`tel`/`password`)에서만 동작하며, 그 외 타입(예: `email`)은 이 로직을 건너뛴다.
- **readOnly**: 별도 커스텀 스타일 없이 native `readOnly` 속성만 그대로 전달됨(코드에 readOnly 전용 분기 없음).

## 다른 범용 컴포넌트와의 조합 가이드

코드에서 확인된 구조적 관계:

- `PartInput`은 **base 컴포넌트**다. 아래 컴포넌트들이 내부적으로 `PartInput`을 import해서 감싸거나 합성한다(실제 `import` 문으로 확인):
  - `input-time` (`components/ui/input-time/input-time.tsx`)
  - `input-search` (`components/ui/input-search/input-search.tsx`)
  - `input-phone` (`components/ui/input-phone/input-phone.tsx`)
- `components/ui/input`은 Figma `Input`(`5084:3716`)에 대응하는 **복합 블록**이다. Textfield / Upload / Select / Link 네 행을 boolean(`showTextfield`/`showUpload`/`showSelect`/`showLink`)으로 켜고 끈다. Textfield·Link 행은 `PartInput`, Select 행은 `Select`를 재사용하고, Upload 행만 native `<input type="file">`이 controlled `value`를 지원하지 않아 `<label>` + `sr-only` 조합으로 따로 구현한다.
- `textarea`는 multi-line(`<textarea>`) 엘리먼트라 base `PartInput`(`<input>`)과 DOM 엘리먼트 자체가 달라 `PartInput`을 쓰지 않는다.
- 앱 페이지(`app/`)나 `components/ui/` 바깥에서 `PartInput`을 직접 import해 쓰는 곳은 발견되지 않았다(위 input-계열 컴포넌트 내부 합성 용도로만 관찰됨) — 즉 Button 등 다른 컴포넌트와의 직접 조합 패턴은 관찰되지 않았다.

## 파생 컴포넌트의 Figma 현재 상태

`Part/Input`을 감싸거나 같은 페이지(`73:1977`)에 있는 컴포넌트셋들의 축 구성이다. **다섯 개 모두 축이 `Status` 하나뿐이고 `disabled`는 전부 `Status` 안에 있다** — `Type`/`Style` 축은 현재 어디에도 없다.

| 컴포넌트셋     | 노드         | `Status` 값                                  | 코드                         |
| -------------- | ------------ | -------------------------------------------- | ---------------------------- |
| `Part/Input`   | `520:3062`   | default · active · filled · error · disabled | `components/ui/part-input`   |
| `Input`        | `5084:3716`  | default · active · filled                    | `components/ui/input`        |
| `Input search` | `3981:19811` | default · active · filled · **disabled**     | `components/ui/input-search` |
| `Input time`   | `588:108`    | default · active · filled · error · disabled | `components/ui/input-time`   |
| `Input phone`  | `3525:8236`  | default · filled · **disabled**              | `components/ui/input-phone`  |

`Input search`는 `Trailing icon` 프로퍼티가 없고, 검색 아이콘이 각 variant에 고정된 `lucide/search` 레이어로 들어가 있다. 아이콘 색은 enabled 상태 전부 `icon/default`, disabled만 `icon/static-gray`다.

`Input phone`의 라벨은 string 프로퍼티가 아니라 하드코딩 텍스트(`"Where can we reach you?"`)이고, disabled에서도 흐려지지 않는다.

## disabled에서도 타이포 weight는 유지한다

네 입력 계열(`Part/Input` · `select` · `date-select` · `range-select`) 모두 disabled에서 `Text-sm/Medium`을 유지한다 — weight를 떨어뜨리지 않고 색으로만 비활성을 표현한다. `select.test.tsx`가 이 규칙을 고정한다.

## `trailingIcon` 기본값은 `true`

Figma 컴포넌트 프로퍼티 기본값과 같다. 아이콘 없이 쓰는 조합은 각자 `trailingIcon={false}`를 명시한다 — `input-time`, `input-search`, `input-phone`, 그리고 `Input`의 Textfield 행. `Input`의 Link 행만 아이콘(`Globe`)을 쓴다.

`trailingIcon`이 `false`면 단일 `<input>`을 그대로 렌더링하고, `true`면 `relative` wrapper로 감싼다 — 이때 `className`은 input이 아니라 wrapper에 적용된다.

## 에러 문구는 소비처가 렌더링한다

`isError`는 보더만 경고색으로 바꾸고 문구는 렌더링하지 않는다. 문구가 필요한 소비처가 직접 조합한다 — `input-time`이 행 아래 full-width 문구를 렌더링하는 것이 현재 유일한 선례다.

## ⚠️ 확인 필요

없음.
