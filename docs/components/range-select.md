# Range select

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-10932) · node-id `7219:10932`
코드: `components/ui/range-select/range-select.tsx`

## Overview

시작·종료 두 날짜를 고르는 트리거 + 팝오버 위젯. 트리거 우측에 달력 아이콘이 있고, 값이 차면 `MM/DD - MM/DD`로 표시된다. 팝오버에는 [Calendar](./calendar.md)가 `mode="range"`로 두 달 나란히 펼쳐진다.

Figma 컴포넌트 설명(description) 필드 원문:

> A field that opens a calendar and returns a start and end date. The trigger shows both endpoints, or the placeholder while empty. For a single date, use Date select instead.

## When to use

- 기간(시작~종료)을 받아야 할 때. 필터·리포트 범위 같은 자리.

## When not to use

- **날짜 하나** → [Date select](./date-select.md). Figma description이 명시한다.
- **달력을 항상 펼쳐둬야 할 때** → [Calendar](./calendar.md)를 직접 쓴다.

## How to use

```tsx
// 기본
<RangeSelect value={range} onValueChange={setRange} />

// placeholder 지정
<RangeSelect placeholder="기간 선택" onValueChange={setRange} />

// 선택 가능 범위 제한
<RangeSelect
  minDate={new Date(2026, 0, 1)}
  maxDate={new Date(2026, 11, 31)}
  onValueChange={setRange}
/>

// 비활성화
<RangeSelect disabled />
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `range-select.tsx` / `range-select.stories.tsx` / `range-select.test.tsx` / `index.ts`.

```
<Popover.Root>
  <Popover.Trigger asChild>
    <button>                     h 36, w 488, radius 10, px 12, py 8, border 1, gap 8
      <span>                     값 또는 placeholder, flex-1, 좌측 정렬
      <svg #calendar-icon />      16px, 후행
  <Popover.Content className="dark" sideOffset={8} align="start">
    <Calendar mode="range" />
```

- **트리거 폭 488px**과 **radius 10px**(`--gb-radius-scale-lg`)은 Figma 확정값이다. `DateSelect`는 radius 8px이라 값이 다르다.
- 높이 `h-[36px]`을 명시한다 — 빼면 보더·패딩이 더해져 38px이 되어 옆 입력 필드와 줄이 안 맞는다.
- 팝오버는 `className="dark"` 스코프로 항상 다크다.

## Props

| Prop            | 타입                                  | 기본값                | 설명                                      |
| --------------- | ------------------------------------- | --------------------- | ----------------------------------------- |
| `value`         | `CalendarRangeValue`                  | —                     | `{ from?: Date; to?: Date }`              |
| `defaultValue`  | `CalendarRangeValue`                  | —                     | 비제어 컴포넌트로 사용할 때의 초기 기간   |
| `ref`           | `React.Ref<HTMLButtonElement>`        | —                     | 트리거 `<button>`에 연결                  |
| `onValueChange` | `(range: CalendarRangeValue) => void` | —                     | 범위가 바뀔 때 호출                       |
| `placeholder`   | `string`                              | `"Select date range"` | 값이 없을 때 트리거에 표시할 텍스트       |
| `disabled`      | `boolean`                             | `false`               | 트리거 비활성화                           |
| `minDate`       | `Date`                                | —                     | 달력에 전달                               |
| `maxDate`       | `Date`                                | —                     | 달력에 전달                               |
| `disabledDates` | `Date[]`                              | —                     | 달력에 전달                               |
| `events`        | `Record<string, CalendarEventType>`   | —                     | 달력에 전달                               |
| `className`     | `string`                              | —                     | 트리거 `<button>`에 병합                  |

`DateSelect`와 달리 **라벨 prop이 없다** — Figma에도 라벨이 없다.

## Variants

cva 기반 `variant` prop이 없다. Figma의 축은 `Status` 하나이고 값은 `default`/`hovered`/`pressed`/`filled`/`disabled` 다섯이다.

| Figma `Status` | 트리거              | 배경                       | 보더                      | 글자                     |
| -------------- | ------------------- | -------------------------- | ------------------------- | ------------------------ |
| `default`      | 값 없음             | `--gb-background-default`  | `--gb-border-default`     | `--gb-text-subtle`       |
| `filled`       | 값 있음             | `--gb-background-default`  | `--gb-border-default`     | `--gb-text-default`      |
| `hovered`      | `:hover`            | `--gb-background-mute`     | `--gb-border-static-gray` | `--gb-text-static-white` |
| `pressed`      | `data-[state=open]` | `--gb-background-default`  | `--gb-border-static-gray` + 포커스 링 | `--gb-text-default` |
| `disabled`     | `disabled`          | `--gb-background-disabled` | `--gb-border-overlay`     | `--gb-text-static-gray`  |

`DateSelect`와 달리 **다섯 상태 모두 글자가 Medium**이다 — `disabled`만 Regular인 `DateSelect`와 다르니 복사해 쓰지 않는다.

## States and behaviors

| 항목          | 값                                      |
| ------------- | --------------------------------------- |
| 트리거 크기   | `488 × 36`                              |
| radius        | `--gb-radius-scale-lg` (10px)           |
| 패딩          | px `--gb-spacing-3` · py `--gb-spacing-2` |
| 아이콘        | `calendar-icon` 16px, 후행, `text-current` |
| 값 ↔ 아이콘   | `--gb-spacing-2` (8px)                  |
| 팝오버 간격   | 트리거 아래 **8px**                     |
| 포커스 링     | `--gb-shadow-focus-ring`                |

- **팝오버는 `from`과 `to`가 모두 채워졌을 때만 닫힌다.** 시작만 고른 상태에서는 열린 채로 두 번째 선택을 기다린다.
- 값 포맷은 `MM/DD - MM/DD`다. `to`가 없으면 `MM/DD`만 표시한다.
- Figma에는 값이 빈 "default(placeholder)" 목업이 없지만(모든 상태가 이미 값으로 채워진 스냅샷), 실사용에는 빈 초기 상태가 반드시 존재하므로 `placeholder`를 지원한다 — `Select`의 placeholder 처리와 같은 근거다.

## 다른 범용 컴포넌트와의 조합 가이드

- **Calendar** (`components/ui/calendar`): 팝오버 본문. `mode="range"`로 두 달을 나란히 렌더링한다.
- 트리거는 공용 `Button`을 쓰지 않는다 — `DateSelect`와 같은 이유로, Figma 트리거가 입력 필드 계열 배색이기 때문이다.

`components/ui/range-select/` 바깥의 실사용처는 아직 없다.
