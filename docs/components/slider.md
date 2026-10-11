# Slider

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-10513) — `Slider` (node-id `76:10520`)
코드: `components/ui/slider/slider.tsx`

## Overview

트랙을 드래그해 연속 범위에서 값 하나를 고르는 컨트롤. 채워진 구간(bar)과 동그란 손잡이(thumb)로 현재 값을 표시한다.

Figma 컴포넌트 설명(description) 필드 원문:

> A track the user drags to pick a value from a continuous range. The minimum, maximum, and step are set by the consumer. Use Input when the user needs to type an exact value.

## When to use

- 대략적인 값을 **감각적으로** 조절할 때(볼륨·밝기·비율 등).
- 최소·최대·증감 단위는 호출부가 정한다 — Figma description이 명시한 설계다.

## When not to use

- **정확한 수치를 입력해야 할 때** → [Input](./input.md). 슬라이더로는 정밀한 값을 맞추기 어렵다.
- 범위(시작~끝) 두 값이 필요한 경우 — Figma에 해당 디자인이 없다.

## How to use

```tsx
// 비제어
<Slider defaultValue={30} aria-label="밝기" />

// 제어
<Slider value={volume} onValueChange={setVolume} aria-label="볼륨" />

// 범위·단위 지정
<Slider min={0} max={200} step={10} value={v} onValueChange={setV} aria-label="가격" />

// 라벨 요소와 연결
<label id="brightness-label">밝기</label>
<Slider aria-labelledby="brightness-label" />
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `slider.tsx` / `slider.stories.tsx` / `slider.test.tsx` / `index.ts`.

```
<div data-slot="slider-track">        h 6, w-full, radius full, 클릭 가능
  <div data-slot="slider-range" />     채워진 구간, 왼쪽부터 percent만큼
  <div role="slider" />                손잡이 16×16, 현재 값 위치에 절대 배치
```

- 트랙 높이 `6px`은 `--gb-spacing-1-5`와 값이 같아 토큰으로 쓴다.
- 손잡이는 `-translate-x-1/2 -translate-y-1/2`로 값 위치에 정확히 중심을 맞춘다.

## Props

| Prop               | 타입                        | 기본값 | 설명                                        |
| ------------------ | --------------------------- | ------ | ------------------------------------------- |
| `value`            | `number`                    | —      | 제어 컴포넌트의 현재 값                     |
| `defaultValue`     | `number`                    | `30`   | 비제어 초기값 (Figma 예시 비율에 가장 가까운 값) |
| `onValueChange`    | `(value: number) => void`   | —      | 드래그·클릭·키보드 조작 시 호출             |
| `min`              | `number`                    | `0`    | 최솟값                                      |
| `max`              | `number`                    | `100`  | 최댓값                                      |
| `step`             | `number`                    | `1`    | 증감 단위                                   |
| `aria-label`       | `string`                    | —      | 손잡이의 접근성 이름                        |
| `aria-labelledby`  | `string`                    | —      | 라벨 요소 id로 접근성 이름 연결             |
| `id`               | `string`                    | —      | 루트 id                                     |
| `className`        | `string`                    | —      | 트랙에 병합                                 |

`aria-label`이나 `aria-labelledby` 중 하나는 반드시 주는 것이 좋다 — 손잡이에 보이는 텍스트가 없다.

## Variants

cva 기반 `variant` prop이 없다. Figma에도 **variant 축 자체가 없다** — `Slider` 컴포넌트 하나뿐이고, 값에 따라 채워진 길이와 손잡이 위치만 달라진다. disabled 상태도 정의돼 있지 않다.

## States and behaviors

| 항목         | Figma                        | 코드                                      |
| ------------ | ---------------------------- | ----------------------------------------- |
| 트랙 높이    | `6px`                        | `h-[var(--gb-spacing-1-5)]`               |
| 트랙 배경    | `background/subtler`         | `bg-[var(--muted)]` (= `--background-subtler`) |
| 채운 구간    | `background/bold`            | `bg-[var(--primary)]` (= `--background-bold`) |
| 손잡이 크기  | `16 × 16`                    | `size-[var(--gb-spacing-4)]`              |
| 손잡이 배경  | `background/default`         | `bg-[var(--background)]`                  |
| 손잡이 보더  | `border/bolder` 1px          | `border-[var(--gb-border-bolder)]`        |
| radius       | full (트랙·구간·손잡이 모두) | `--gb-radius-scale-full`                  |
| 포커스 링    | —                            | `--gb-shadow-focus-ring` (코드가 더한 접근성 레이어) |

- **커서**: 트랙 전체가 `cursor-pointer`, 손잡이는 `cursor-grab` → 드래그 중 `cursor-grabbing`.
- **키보드**: 손잡이가 `role="slider"` + `aria-valuenow`/`aria-valuemin`/`aria-valuemax`를 갖는다. 화살표 키로 `step`만큼 증감한다.
- **트랙 클릭**: 손잡이를 끌지 않고 트랙 아무 데나 눌러도 그 위치로 값이 점프한다.
- **포커스 링은 Figma에 없다.** 손잡이에 보이는 포커스 표시가 없으면 키보드 사용자가 위치를 알 수 없어 코드에서 더한 레이어다.

## 다른 범용 컴포넌트와의 조합 가이드

다른 범용 컴포넌트를 재사용하지 않는 독립 컴포넌트다. `components/ui/slider/` 바깥의 실사용처는 아직 없다.
