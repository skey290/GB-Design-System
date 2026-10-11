# Calendar

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-10741) — `Part/Calendar modal` (node-id `7219:10741`) / `Part/Calendar` (node-id `7219:10714`)
코드: `components/ui/calendar/calendar.tsx`

## Overview

달력 패널 전체 — 월 헤더, 요일 줄, 날짜 격자. 단일 날짜(`mode="single"`)와 기간(`mode="range"`) 두 모드를 가지며, 헤더의 월·연 칩을 누르면 월 선택·연도 선택 서브뷰로 바뀐다.

Figma 쪽은 두 컴포넌트로 나뉘어 있다.

- **`Part/Calendar modal`** (`7219:10741`) — 패널 전체. `Type`(default/month/year/range) × `Data` 축.
- **`Part/Calendar`** (`7219:10714`) — 날짜 칸 하나. 17개 variant로 선택·범위·오늘·이벤트 마커 상태를 담는다.

Figma 컴포넌트 설명(description) 필드 원문:

> **Part/Calendar modal** — The calendar surface itself — month header, weekday row, and the grid of day cells. Used as the dropdown body of Date select and Range select, or embedded directly when the calendar is always visible.
>
> **Part/Calendar** — The single day cell used to build a calendar month grid, carrying the selection, range, today, and event-marker states for one date. Not meant to be placed on its own — use Part/Calendar modal, Date select, or Range select.

## When to use

- 달력을 **항상 펼쳐둔 채로** 보여줘야 할 때 직접 쓴다.
- 트리거를 눌러 열리는 형태가 필요하면 [Date select](./date-select.md) / [Range select](./range-select.md)를 쓴다 — 둘 다 내부에서 이 컴포넌트를 렌더링한다.

## When not to use

- **날짜 칸(`Part/Calendar`)을 단독으로 쓰지 않는다.** Figma description이 명시한다 — 격자 안에서만 의미를 갖는다.

## How to use

```tsx
// 단일 날짜
<Calendar mode="single" value={date} onValueChange={setDate} />

// 기간 (두 달이 나란히 표시됨)
<Calendar mode="range" value={range} onValueChange={setRange} />

// 선택 가능 범위 제한 + 개별 비활성 날짜
<Calendar
  mode="single"
  minDate={new Date(2026, 0, 1)}
  maxDate={new Date(2026, 11, 31)}
  disabledDates={[new Date(2026, 8, 10)]}
  onValueChange={setDate}
/>

// 날짜별 이벤트 마커
<Calendar
  mode="single"
  events={{ "2026-09-01": "published", "2026-09-17": "draft" }}
  onValueChange={setDate}
/>
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `calendar.tsx` / `calendar.stories.tsx` / `calendar.test.tsx` / `index.ts`.

```
single:
<div>                          패널. flex-col, gap 16, padding 20, radius 10, border 1
  <div>                        헤더. 양끝 정렬
    <Button icon-ghost />      ◀ 36×36 원형
    <div gap 4>                월 칩 + 연 칩
    <Button icon-ghost />      ▶
  <DateGrid> | <MonthYearGrid> 서브뷰에 따라 교체

range:
<div>                          패널. flex-row, gap 16, padding 12
  <div>  [◀][월] + 왼쪽 달 격자
  <div>  [월][▶] ... [연도] + 오른쪽 달 격자
```

- **패널 padding이 모드별로 다르다** — single `20px`, range `12px`. Figma 확정값이다.
- 날짜 격자는 `grid-cols-7`에 **열 간격 0 / 행 간격 4px**. 칸이 맞붙어야 범위 선택이 끊김 없이 이어진다.
- 월·연 서브뷰는 `grid-cols-3`, 칸 `70×32`.

## Props

`CalendarProps`는 공통 props + `mode`로 갈리는 판별 유니온이다.

| Prop             | 타입                                     | 기본값 | 설명                                                 |
| ---------------- | ---------------------------------------- | ------ | ---------------------------------------------------- |
| `mode`           | `"single" \| "range"`                    | **필수** | 단일 날짜 / 기간 선택                              |
| `value`          | `Date` \| `CalendarRangeValue`           | —      | `mode`에 따라 타입이 달라진다                        |
| `onValueChange`  | `(date) => void` \| `(range) => void`    | —      | `mode`에 따라 시그니처가 달라진다                    |
| `events`         | `Record<string, CalendarEventType>`      | —      | 날짜별 마커. 키는 `yyyy-MM-dd`                       |
| `minDate`        | `Date`                                   | —      | 이 날짜 이전은 선택 불가                             |
| `maxDate`        | `Date`                                   | —      | 이 날짜 이후는 선택 불가                             |
| `disabledDates`  | `Date[]`                                 | —      | 개별 비활성 날짜                                     |
| `className`      | `string`                                 | —      | 패널 루트에 병합                                     |

`CalendarEventType`은 `"published" | "reserved" | "draft"` 셋이다.

## Variants

### 날짜 칸 (`Part/Calendar`)

| 상태              | 배경                        | 보더                        | 글자                     | radius |
| ----------------- | --------------------------- | --------------------------- | ------------------------ | ------ |
| 기본              | 없음                        | 없음                        | `--gb-text-default`      | 8px    |
| **오늘**          | **없음**                    | **`--gb-border-static-gray` 1px** | `--gb-text-default` | 8px    |
| **선택됨**        | **`--gb-background-bold`**  | 없음                        | `--gb-text-invert`       | 8px    |
| 범위 양끝         | `--gb-background-bold`      | 없음                        | `--gb-text-invert`       | 한쪽만 8px |
| 범위 중간         | `--gb-background-selected`  | 없음                        | `--gb-text-bold`         | **0**  |
| 지난/다음 달      | 없음                        | 없음                        | `--gb-text-static-gray`  | 8px    |
| 비활성            | 없음                        | 없음                        | `--gb-text-static-gray`  | 8px    |

**오늘은 테두리, 선택된 날은 채움**이다 — 둘을 바꿔 쓰면 "오늘"이 이미 선택된 것처럼 보인다.

### 이벤트 마커

칸 안 우하단(`left 14 / top 24`)에 4×4 점이 찍힌다.

| `CalendarEventType` | 모양           | 색                                       |
| ------------------- | -------------- | ---------------------------------------- |
| `published`         | ● 채운 원      | `--gb-icon-default`                      |
| `reserved`          | ○ 빈 원(1px)   | `--gb-icon-default`                      |
| `draft`             | ● 채운 원      | `--gb-icon-warning`                      |

선택된 칸(짙은 배경) 위에서는 `published`/`reserved`가 `--gb-icon-invert`로 반전된다 — 반전하지 않으면 어두운 배경에 어두운 점이 되어 사라진다. `draft`는 경고색이라 반전하지 않는다.

### 패널 (`Part/Calendar modal`)

| Figma `Type` | 코드                  | 크기 기준                       |
| ------------ | --------------------- | ------------------------------- |
| `default`    | `mode="single"` 날짜 뷰 | padding 20, 7열 격자            |
| `month`      | 월 선택 서브뷰         | padding 20, 3열 격자 (칸 70×32) |
| `year`       | 연 선택 서브뷰         | padding 20, 3열 격자            |
| `range`      | `mode="range"`         | padding 12, 두 달 가로 배치     |

## States and behaviors

| 항목           | 값                                                       |
| -------------- | -------------------------------------------------------- |
| 패널 배경      | `--gb-background-overlay`                                |
| 패널 보더      | `--gb-border-default` 1px                                |
| 패널 radius    | `--gb-radius-scale-lg`                                   |
| 패널 gap       | `--gb-spacing-4` (16px)                                  |
| 헤더 칩        | 공용 `Button variant="outline"` (h36, radius 10, px 16)  |
| 헤더 화살표    | 공용 `Button variant="icon-ghost"` (36×36, 원형)         |
| 요일 라벨      | 32px 폭 · 16px 높이 · `text-xs-regular` · `--gb-text-subtle` |
| 날짜 칸        | 32×32 · `text-sm-regular`                                |

- **연도 서브뷰는 12칸**이다. 10년 구간을 1년 앞당겨 시작해 3×4 격자를 채운다(2026 → 2019~2030).
- **범위 선택**에서 두 번째 날짜를 고르면 팝오버를 닫는 것은 호출부(`RangeSelect`)의 책임이고, 이 컴포넌트는 값만 올린다.
- 헤더 월·연 칩은 `mode="single"`에서만 누를 수 있다. `range`에서는 서브뷰가 Figma에 정의돼 있지 않아 비인터랙티브 표시로 둔다.

## 다른 범용 컴포넌트와의 조합 가이드

- **DateSelect** (`components/ui/date-select`): 트리거 아래 팝오버에 `mode="single"`로 렌더링. 팝오버는 `.dark` 스코프다.
- **RangeSelect** (`components/ui/range-select`): 같은 방식으로 `mode="range"`.
- **Button**: 헤더의 화살표(`icon-ghost`)와 월·연 칩(`outline`)을 그대로 재사용한다 — 달력 전용 버튼을 따로 만들지 않는다.
