# Date select

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-10905) · node-id `7219:10905`
코드: `components/ui/date-select/date-select.tsx`

## Overview

라벨 + 날짜 트리거를 쌓고, 트리거를 누르면 아래에 [Calendar](./calendar.md)가 펼쳐지는 완성형 위젯. 값이 없으면 placeholder를, 있으면 `MM.DD.YYYY`로 포맷한 날짜를 보여준다.

Figma 컴포넌트 설명(description) 필드 원문:

> A field that opens a calendar and returns a single date. The trigger shows the chosen date, or the placeholder while empty. For a start-and-end pair, use Range select instead.

## When to use

- 날짜 **하나**를 고르게 해야 할 때.
- 달력을 항상 펼쳐둘 필요는 없고, 눌렀을 때만 열리면 되는 자리.

## When not to use

- **시작·종료 두 날짜** → [Range select](./range-select.md). Figma description이 명시한다.
- **달력을 항상 보여줘야 할 때** → [Calendar](./calendar.md)를 직접 쓴다.
- **시각(시·분)** → [Input time](./input-time.md).

## How to use

```tsx
// 기본
<DateSelect label="Date to post" value={date} onValueChange={setDate} />

// 선택 가능 범위 제한
<DateSelect
  value={date}
  onValueChange={setDate}
  minDate={new Date(2026, 0, 1)}
  maxDate={new Date(2026, 11, 31)}
/>

// 날짜별 이벤트 마커를 달력에 전달
<DateSelect events={{ "2026-09-17": "draft" }} onValueChange={setDate} />

// 비활성화
<DateSelect disabled />
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `date-select.tsx` / `date-select.stories.tsx` / `date-select.test.tsx` / `index.ts`.

```
<div>                              루트. flex-col, items-start, gap 12, w 192
  <label htmlFor>                  라벨
  <Popover.Root>
    <Popover.Trigger asChild>
      <button>                     h 36, radius 8, px 12, py 8, border 1
    <Popover.Content className="dark" sideOffset={8} align="start">
      <Calendar mode="single" />
```

- **트리거 폭 192px**은 Figma 확정값이라 리터럴로 둔다.
- radius는 `--gb-radius-scale-md`(8px)다 — `RangeSelect`(10px)와 값이 다르니 주의.
- 팝오버는 `className="dark"`로 스코프해 사이트 테마와 무관하게 항상 다크로 렌더링한다(Popover·Chatbox·RangeSelect·NotiDropdown과 동일 원칙).

## Props

| Prop            | 타입                                | 기본값           | 설명                                        |
| --------------- | ----------------------------------- | ---------------- | ------------------------------------------- |
| `label`         | `string`                            | `"Date to post"` | 필드 위 라벨. 빈 문자열이면 숨김            |
| `value`         | `Date`                              | —                | 선택된 날짜                                 |
| `onValueChange` | `(date: Date) => void`              | —                | 날짜 선택 시 호출. 선택 즉시 팝오버가 닫힌다 |
| `placeholder`   | `string`                            | `"MM.DD.YYYY"`   | 값이 없을 때 트리거에 표시할 텍스트         |
| `disabled`      | `boolean`                           | `false`          | 트리거 비활성화 (팝오버도 열리지 않음)      |
| `minDate`       | `Date`                              | —                | 달력에 전달                                 |
| `maxDate`       | `Date`                              | —                | 달력에 전달                                 |
| `disabledDates` | `Date[]`                            | —                | 달력에 전달                                 |
| `events`        | `Record<string, CalendarEventType>` | —                | 달력에 전달                                 |
| `className`     | `string`                            | —                | 루트 `<div>`에 병합                         |

## Variants

cva 기반 `variant` prop이 없다. Figma의 축은 `Status` 하나이고 값은 `default`/`hovered`/`pressed`/`filled`/`disabled` 다섯인데, 전부 prop이 아니라 값 유무와 CSS 상태로 처리된다.

| Figma `Status` | 트리거            | 배경                       | 보더                        | 글자                    |
| -------------- | ----------------- | -------------------------- | --------------------------- | ----------------------- |
| `default`      | 값 없음           | `--gb-background-default`  | `--gb-border-default`       | `--gb-text-subtle`      |
| `filled`       | 값 있음           | `--gb-background-default`  | `--gb-border-default`       | `--gb-text-default`     |
| `hovered`      | `:hover`          | `--gb-background-mute`     | `--gb-border-static-gray`   | `--gb-text-static-white` |
| `pressed`      | `data-[state=open]` | `--gb-background-default`  | `--gb-border-static-gray` + 포커스 링 | `--gb-text-default` |
| `disabled`     | `disabled`        | `--gb-background-disabled` | `--gb-border-overlay`       | `--gb-text-static-gray` |

**`disabled`만 글자 굵기가 다르다** — Figma에서 나머지 네 상태는 Medium인데 `disabled`만 Regular다. 코드도 `disabled ? "text-sm-regular" : "text-sm-medium"`으로 갈라 둔다.

## States and behaviors

| 항목            | 값                                 |
| --------------- | ---------------------------------- |
| 루트 gap        | `--gb-spacing-3` (12px)            |
| 트리거 높이     | `36px`                             |
| 트리거 radius   | `--gb-radius-scale-md` (8px)       |
| 트리거 패딩     | px `--gb-spacing-3` · py `--gb-spacing-2` |
| 라벨            | `text-sm-medium`, `--gb-text-default` |
| 포커스 링       | `--gb-shadow-focus-ring`           |
| 팝오버 간격     | 트리거 아래 **8px** (`sideOffset`) |
| 팝오버 정렬     | 좌측(`align="start"`)              |

- **날짜를 고르면 팝오버가 바로 닫힌다** — 단일 선택이라 추가 확인 단계가 없다.
- `disabled`면 `onOpenChange`를 가로채 팝오버가 열리지 않는다.
- 날짜 포맷은 `MM.DD.YYYY`로 고정이다(Figma 예시 `09.01.2026`).

## 다른 범용 컴포넌트와의 조합 가이드

- **Calendar** (`components/ui/calendar`): 팝오버 본문. `mode="single"`로 렌더링하고 선택값을 그대로 올려받는다.
- 트리거는 공용 `Button`을 쓰지 않는다 — Figma 트리거가 입력 필드 계열 배색(`border-default` + `background-default`)이라 `Button`의 어느 variant와도 맞지 않기 때문이다.

`components/ui/date-select/` 바깥의 실사용처는 아직 없다.
