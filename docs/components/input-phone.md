# Input phone

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3525-8236) · node-id `3525:8236`
코드: `components/ui/input-phone/input-phone.tsx`

## Overview

라벨 아래에 국가번호 드롭다운(왼쪽)과 전화번호 입력(오른쪽)을 한 행으로 묶은 필드. 두 칸 모두 기존 공용 컴포넌트를 그대로 재사용한다 — 드롭다운은 [Select](./select.md), 번호 입력은 [PartInput](./part-input.md).

Figma 컴포넌트 설명(description) 필드 원문:

> A labelled phone-number field — a country-code dropdown on the left and the number input on the right. The dropdown is a Select, so the list of country codes is supplied by the consumer.

## When to use

- 국가번호와 전화번호를 함께 받아야 할 때.
- **국가번호 목록은 이 컴포넌트가 들고 있지 않다.** `countryCodeOptions`로 호출부가 넘긴다 — Figma description이 명시한 설계다.

## When not to use

- 국가번호가 필요 없는 단순 번호 입력 → [Input](./input.md)의 Textfield 행.

## How to use

```tsx
const COUNTRY_CODES = [
  { value: "us", label: "United States (+1)", code: "+1" },
  { value: "kr", label: "대한민국 (+82)", code: "+82" },
];

// 기본
<InputPhone countryCodeOptions={COUNTRY_CODES} />

// 제어 컴포넌트 (국가번호와 번호를 각각 제어)
<InputPhone
  countryCodeOptions={COUNTRY_CODES}
  countryCode={code}
  onCountryCodeChange={setCode}
  value={phone}
  onValueChange={setPhone}
/>

// 비활성화 — 두 칸이 함께 꺼지고 라벨은 흐려지지 않는다
<InputPhone countryCodeOptions={COUNTRY_CODES} disabled />
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `input-phone.tsx` / `input-phone.stories.tsx` / `input-phone.test.tsx` / `index.ts`.

```
<div data-slot="input-phone">        루트, flex-col, items-start, gap 12
  <label htmlFor>                    라벨
  <div data-slot="input-phone-wrapper">  행, flex, items-start, gap 10
    <Select variant="primary" className="w-[88px]" />   국가번호
    <PartInput type="tel" className="min-w-0 flex-1" /> 전화번호
```

- **행 간격이 10px**이다(`--gb-spacing-2-5`). 12px(행 사이)·8px(아이콘 간격)과 헷갈리기 쉬운 자리다.
- 국가번호 Select 폭 `88px`은 Figma 확정값이라 리터럴로 둔다.
- 번호 입력은 `trailingIcon={false}`이고 `type="tel"`이다.

## Props

| Prop                  | 타입                      | 필수   | 기본값 | 설명                                                        |
| --------------------- | ------------------------- | ------ | ------ | ----------------------------------------------------------- |
| `countryCodeOptions`  | `SelectOption[]`          | **예** | —      | 국가번호 목록. 트리거에는 `code`가 표시된다                 |
| `label`               | `string`                  | 아니오 | `"Where can we reach you?"` | 필드 위 라벨                           |
| `countryCode`         | `string`                  | 아니오 | —      | 제어 컴포넌트의 국가번호 값                                 |
| `defaultCountryCode`  | `string`                  | 아니오 | —      | 비제어 국가번호 초기값                                      |
| `onCountryCodeChange` | `(value: string) => void` | 아니오 | —      | 국가번호 변경 콜백                                          |
| `value`               | `string`                  | 아니오 | —      | 제어 컴포넌트의 전화번호 값                                 |
| `defaultValue`        | `string`                  | 아니오 | `""`   | 비제어 전화번호 초기값                                      |
| `onValueChange`       | `(value: string) => void` | 아니오 | —      | 전화번호 변경 콜백                                          |
| `placeholder`         | `string`                  | 아니오 | —      | 전화번호 입력의 placeholder                                 |
| `disabled`            | `boolean`                 | 아니오 | `false`| 두 칸을 함께 비활성화 (Figma `Status=disabled`)             |
| `id`                  | `string`                  | 아니오 | 자동   | 라벨과 연결할 입력 id                                       |
| `className`           | `string`                  | 아니오 | —      | 루트에 병합                                                 |

국가번호와 전화번호는 **값 쌍이 아니라 독립된 두 제어 축**이다 — 한쪽만 제어하고 다른 쪽을 비제어로 두는 것도 가능하다.

## Variants

cva 기반 `variant` prop이 없다. Figma의 축은 `Status` 하나이고 값은 `default`/`filled`/`disabled` 셋이다(`active`·`error` 없음). 포커스 상태는 `PartInput`/`Select`가 각자 CSS로 처리한다.

| Figma `Status` | 두 칸 공통 색                                                         |
| -------------- | --------------------------------------------------------------------- |
| `default`      | 배경 `--background`, 보더 `--border`, 텍스트 `--muted-foreground`      |
| `filled`       | 텍스트만 `--foreground`로                                              |
| `disabled`     | 배경 `--gb-background-disabled`, 보더 `--gb-border-overlay`, 텍스트 `--gb-text-static-gray` |

## States and behaviors

- **disabled에서도 라벨은 흐려지지 않는다** — Figma 확정. 입력 칸 두 개만 비활성 배색으로 바뀐다.
- 폭은 `w-full`이다. Figma 목업의 320px은 배치 예시다.
- 두 칸의 높이·radius·보더는 각각 `Select`와 `PartInput`이 내장한 값을 그대로 물려받는다 — 이 컴포넌트가 다시 지정하지 않는다.

## 다른 범용 컴포넌트와의 조합 가이드

- **Select** (`components/ui/select`): 국가번호 드롭다운. `variant="primary"` + `w-[88px]`.
- **PartInput** (`components/ui/part-input`): 번호 입력. `trailingIcon={false}` + `type="tel"`.

`components/ui/input-phone/` 바깥의 실사용처는 아직 없다.
