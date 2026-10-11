# Input time

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=588-108) · node-id `588:108`
코드: `components/ui/input-time/input-time.tsx`

## Overview

라벨 + `HH:MM` 마스크 입력 + AM/PM 토글을 한 행에 묶은 시간 입력 필드. 선택적으로 행 끝에 원형 삭제 버튼이 붙고, 범위를 벗어난 값을 입력하면 아래에 경고 문구가 나타난다.

Figma 컴포넌트 설명(description) 필드 원문:

> A labelled time field — a masked hh:mm input plus an AM/PM toggle. Typing is constrained so only valid hours (1–12) and minutes (00–59) can be entered. Use Date select for a calendar date.

## When to use

- 12시간제 시각을 받아야 할 때. 날짜는 [Date select](./date-select.md)다.
- 여러 시간대를 줄 단위로 추가·삭제하는 화면 — `showDelete`로 행 제거 버튼을 켤 수 있다.

## When not to use

- **달력 날짜** → [Date select](./date-select.md) / [Range select](./range-select.md).
- 24시간제나 초 단위가 필요한 경우 — Figma에 해당 디자인이 없다.

## How to use

```tsx
// 기본
<InputTime label="Time to post" />

// 제어 컴포넌트 (값 + AM/PM 분리)
<InputTime
  label="Time to post"
  value={time}
  onValueChange={setTime}
  period={period}
  onPeriodChange={setPeriod}
/>

// 삭제 버튼 표시 — 실제 제거는 호출부 책임
<InputTime showDelete onDelete={() => removeRow(id)} />

// 비활성화 (입력과 AM/PM 토글이 함께 꺼짐)
<InputTime disabled />
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `input-time.tsx` / `input-time.stories.tsx` / `input-time.test.tsx` / `index.ts`.

```
<div>                            루트, flex-col, gap 12
  <label htmlFor>                라벨
  <div>                          행, flex, items-center, gap 8
    <TimeMaskInput />            PartInput 기반 HH:MM 마스크, flex-1
    <PeriodToggle />             AM/PM radiogroup, self-stretch
    <button>                     showDelete일 때만, 18×18 원형 X
  <p>                            검증 실패 시에만, 경고 문구
```

- **AM/PM 토글 폭은 고정값**이다 — enabled `81px`, disabled `83px`. disabled에서 2px 넓은 것은 Figma가 그때만 칩 사이에 `2px` 간격을 주기 때문이고, 코드도 `disabled`에 `gap: 2px`을 넣어 칩 하나의 폭이 양쪽 모두 37.5px로 떨어지게 맞춰져 있다.
- 삭제 버튼은 공용 [Button](./button.md)의 `icon` variant와 같은 배색을 쓰되 크기만 18×18이다.

## Props

`InputTimeProps`는 `React.InputHTMLAttributes<HTMLInputElement>`에서 `value`/`defaultValue`/`onChange`/`type`/`id`/`disabled`를 제외(Omit)하고 아래를 추가한 형태다.

| Prop              | 타입                            | 기본값           | 설명                                                        |
| ----------------- | ------------------------------- | ---------------- | ----------------------------------------------------------- |
| `label`           | `string`                        | `"Time to post"` | 필드 위 라벨                                                |
| `value`           | `string`                        | —                | 제어 컴포넌트 값 (`HH:MM` 마스크)                           |
| `defaultValue`    | `string`                        | —                | 비제어 초기값                                               |
| `onValueChange`   | `(value: string) => void`       | —                | 입력 값 변경 콜백                                           |
| `period`          | `"AM" \| "PM"`                  | —                | 제어 컴포넌트의 AM/PM 값                                    |
| `defaultPeriod`   | `"AM" \| "PM"`                  | `"AM"`           | 비제어 AM/PM 초기값                                         |
| `onPeriodChange`  | `(period) => void`              | —                | AM/PM 변경 콜백                                             |
| `disabled`        | `boolean`                       | —                | 입력과 토글을 함께 비활성화 (Figma `Status=disabled`)       |
| `showDelete`      | `boolean`                       | `false`          | 행 우측 끝 원형 X 버튼 표시 (Figma `propDelete`)            |
| `onDelete`        | `() => void`                    | —                | 삭제 버튼 클릭 콜백. **행 제거는 호출부 책임**              |
| `id`              | `string`                        | 자동 생성        | 라벨과 연결할 입력 id                                       |
| `className`       | `string`                        | —                | 루트 `<div>`에 병합                                         |

## Variants

cva 기반 `variant` prop이 없다. Figma의 축은 `Status` 하나이고 값은 `default`/`active`/`filled`/`error`/`disabled` 다섯이다.

| Figma `Status` | 트리거              | 코드                                                        |
| -------------- | ------------------- | ----------------------------------------------------------- |
| `default`      | 값 없음             | `PartInput` 기본 상태                                        |
| `filled`       | 값 있음             | 입력 텍스트가 `--foreground`                                 |
| `active`       | hover/포커스        | `PartInput`의 `:hover`/`:focus` (보더 `--ring` + 포커스 링) |
| `error`        | 범위 밖 입력        | 보더 `--gb-border-warning` + 하단 경고 문구                  |
| `disabled`     | `disabled`          | 입력·토글·삭제 버튼 모두 비활성 배색                         |

## States and behaviors

| 항목             | 값                                                          |
| ---------------- | ----------------------------------------------------------- |
| 루트 gap         | `--gb-spacing-3` (12px)                                     |
| 행 gap           | `--gb-spacing-2` (8px)                                      |
| 라벨             | `text-sm-semi-bold`, `--foreground`                         |
| 경고 문구        | `text-sm-medium`, `--gb-text-warning`                       |
| 토글 래퍼        | border 1px, radius `--gb-radius-scale-lg`, padding 2px      |
| 선택된 AM/PM 칩  | `--gb-background-mute` + `--gb-text-static-white` + `--gb-shadow-sm` |
| 삭제 버튼        | 18×18, radius `--gb-radius-scale-lg`, 아이콘 16px           |
| 삭제 아이콘 색   | `--gb-icon-default`, disabled에서 `--gb-icon-static-gray`   |

- **입력 제한은 자릿수 단위다.** 시는 1–12, 분은 00–59만 입력되도록 타이핑 시점에 후보를 제한하고, 벗어난 키는 무시하면서 흔들림(shake) 애니메이션을 재생한다. 애니메이션을 연속으로 다시 재생하려면 클래스를 제거한 뒤 강제 reflow(`void offsetWidth`)가 필요하다.
- **AM/PM은 radiogroup**이다. 좌우 화살표 키로 전환되며, 상호 배타적 선택지라 `role="radio"` + `aria-checked`를 쓴다.
- **캐럿 위치**는 입력된 자릿수에 따라 계산해 `useLayoutEffect`에서 직접 복원한다 — 마스크 문자열을 다시 쓰면 브라우저가 캐럿을 끝으로 보내기 때문이다.

## 다른 범용 컴포넌트와의 조합 가이드

- **PartInput** (`components/ui/part-input`): 마스크 입력 본체(`trailingIcon={false}`).
- **Button**의 `icon` variant와 동일한 배색을 삭제 버튼이 따른다(크기만 18×18로 축소).

`components/ui/input-time/` 바깥의 실사용처는 아직 없다.
