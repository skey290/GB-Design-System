# Scrollbar

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7792-522) · node-id `7792:522`
코드: `components/ui/scrollbar/scrollbar.tsx`

## Overview

스크롤 가능한 영역의 스크롤바를 디자인 토큰 색으로 바꿔주는 래퍼. 브라우저 기본 스크롤바를 CSS로 덧칠하는 방식이라, **스크롤 동작 자체는 브라우저가 그대로 담당**한다.

Figma 컴포넌트 설명(description) 필드 원문:

> A custom-styled scrollbar for a scrollable container, replacing the browser default. Comes in a standard and a thin width. Purely cosmetic — the scrolling behaviour itself stays the browser's.

## When to use

- 세로 스크롤이 생기는 박스를 감싸 스크롤바 색을 디자인에 맞출 때.
- 좁은 영역(드롭다운·사이드 패널)에서는 `thickness="thin"`.

## When not to use

- **스크롤 위치를 직접 제어하거나 커스텀 썸을 드래그시켜야 할 때.** 이 컴포넌트는 순수 장식이다. 그런 요구가 있으면 `Select`처럼 트랙·썸을 `div`로 직접 그리는 방식을 쓴다.
- 가로 스크롤 — `overflow-x-hidden`으로 고정돼 있다.

## How to use

```tsx
// 기본 (thick)
<Scrollbar className="max-h-[300px]">
  {longContent}
</Scrollbar>

// 좁은 스크롤바
<Scrollbar thickness="thin" className="max-h-[220px]">
  {longContent}
</Scrollbar>
```

높이 제한은 이 컴포넌트가 갖지 않는다 — `className`으로 `max-h-*`를 주지 않으면 스크롤이 생기지 않는다.

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `scrollbar.tsx` / `scrollbar.stories.tsx` / `scrollbar.test.tsx` / `index.ts`.

```
<div>                 overflow-y-auto overflow-x-hidden
  {children}          스크롤될 내용
```

DOM은 `<div>` 하나뿐이고, 스크롤바는 의사요소(`::-webkit-scrollbar`)와 `scrollbar-color`/`scrollbar-width`로 칠한다.

## Props

| Prop        | 타입                  | 기본값    | 설명                           |
| ----------- | --------------------- | --------- | ------------------------------ |
| `children`  | `React.ReactNode`     | **필수**  | 스크롤될 내용                  |
| `thickness` | `"thick" \| "thin"`   | `"thick"` | 스크롤바 두께 (Figma `Type`)   |
| `className` | `string`              | —         | 루트 `<div>`에 병합            |

그 외 `React.HTMLAttributes<HTMLDivElement>`를 그대로 상속한다.

## Variants

Figma 축은 `Type`(Thick/Thin) × `Position`(Start/Center/End) 2축 6 variant다. `Position`은 **썸이 트랙의 어느 위치에 있는지를 보여주는 스냅샷**이라 코드의 prop이 아니다 — 실제 위치는 스크롤 양이 결정한다.

| Figma `Type` | 코드 `thickness` | 폭     |
| ------------ | ---------------- | ------ |
| `Thick`      | `"thick"`        | `10px` |
| `Thin`       | `"thin"`         | `5px`  |

## States and behaviors

| 항목            | 값                                  |
| --------------- | ----------------------------------- |
| 트랙 배경       | `--gb-background-subtler`           |
| 썸 배경         | `--gb-background-subtle`            |
| 트랙·썸 radius  | `--gb-radius-scale-full`            |
| Firefox 대응    | `scrollbar-color` + `scrollbar-width` |

- **hover/active 상태가 없다.** Figma에도 썸 색 변화가 정의돼 있지 않다.
- Figma 목업은 트랙 위아래에 `16px` 여백을 두고 썸을 안쪽으로 들여놓았지만, 브라우저 기본 스크롤바에는 패딩을 줄 수 없어 코드로 재현하지 않는다. 그 여백까지 필요하면 네이티브 스크롤바가 아니라 커스텀 트랙·썸을 그려야 한다.

## 다른 범용 컴포넌트와의 조합 가이드

- **Select** (`components/ui/select`)는 이 컴포넌트를 쓰지 않고 드롭다운 안에 트랙·썸을 `div`로 직접 그린다 — 썸 위치를 스크롤 비율로 계산해 표시해야 해서다. 즉 코드베이스에는 **네이티브 덧칠(이 컴포넌트)** 과 **완전 커스텀(Select)** 두 방식이 공존한다.

`components/ui/scrollbar/` 바깥의 실사용처는 아직 없다.
