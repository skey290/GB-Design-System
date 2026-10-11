# Pagination

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3331-2811) · node-id `3331:2811`
코드: `components/ui/pagination/pagination.tsx`

## Overview

페이지 목록을 이동하는 내비게이션. 번호 목록(`number`)과 점 인디케이터(`dot`) 두 형태가 있고, 가로·세로 배치를 모두 지원한다. 페이지 수가 많으면 현재 페이지 주변만 남기고 말줄임(`…`)으로 접는다.

Figma 컴포넌트 설명(description) 필드 원문:

> Page navigation for a paged list. Type switches between a numbered list with previous/next controls and a compact row of dots, and Direction lays it out horizontally or vertically. Long page counts collapse to ellipses around the current page.

## When to use

- 여러 페이지로 나뉜 목록에서 페이지를 직접 고르게 할 때 → `type="number"`.
- 캐러셀·온보딩처럼 **현재 위치만 알리면 되는** 자리 → `type="dot"`.

## When not to use

- 무한 스크롤이나 "더 보기" 방식에는 쓰지 않는다 — 전체 페이지 수가 확정돼 있어야 한다.

## How to use

```tsx
// 번호 목록 (기본)
<Pagination totalPages={10} currentPage={page} onPageChange={setPage} />

// 현재 페이지 양옆에 더 많이 노출
<Pagination totalPages={20} currentPage={page} onPageChange={setPage} siblingCount={2} />

// 점 인디케이터
<Pagination type="dot" totalPages={5} currentPage={page} onPageChange={setPage} />

// 세로 배치 (화살표가 ▲▼로, 말줄임도 세로형으로 바뀐다)
<Pagination direction="vertical" totalPages={10} currentPage={page} onPageChange={setPage} />
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `pagination.tsx` / `pagination.stories.tsx` / `pagination.test.tsx` / `index.ts`.

```
number:
<nav>                      flex, gap 4 (세로면 flex-col)
  <button>                 ◀ / ▲   36×36, radius 8
  <button>                 번호     36×36, radius 8
  <span>                   …       36×36, 비인터랙티브
  <button>                 ▶ / ▼

dot:
<nav>                      flex, gap 4
  <button>                 6×6 원형 점
```

- 번호 칸·화살표·말줄임이 **모두 같은 36×36 박스**다. 말줄임만 버튼이 아니라 `<span>`이다.
- 점은 `6px`인데 토큰 스케일(4/8px)에 맞는 값이 없어 리터럴로 둔다.

## Props

| Prop           | 타입                           | 기본값         | 설명                                                 |
| -------------- | ------------------------------ | -------------- | ---------------------------------------------------- |
| `totalPages`   | `number`                       | **필수**       | 전체 페이지 수                                       |
| `currentPage`  | `number`                       | **필수**       | 현재 페이지 (1부터 시작)                             |
| `onPageChange` | `(page: number) => void`       | **필수**       | 페이지 변경 콜백                                     |
| `type`         | `"number" \| "dot"`            | `"number"`     | 표시 형태 (Figma `Type`)                             |
| `direction`    | `"horizontal" \| "vertical"`   | `"horizontal"` | 배치 방향 (Figma `Direction`)                        |
| `siblingCount` | `number`                       | `1`            | 현재 페이지 양옆에 노출할 번호 개수 (`number` 전용)  |

그 외 `React.HTMLAttributes<HTMLElement>`를 `onChange` 제외하고 상속한다.

## Variants

Figma 축은 `Type`(number/dot) × `Direction`(Horizontal/Vertical) 2축이다.

| 조합                | 아이콘                                  |
| ------------------- | --------------------------------------- |
| number × horizontal | `chevron-left` / `chevron-right` / `ellipsis` |
| number × vertical   | `chevron-up` / `chevron-down` / `ellipsis-vertical` |
| dot × horizontal    | 아이콘 없음 (점만)                      |
| dot × vertical      | 아이콘 없음 (점만)                      |

**방향을 바꾸면 아이콘도 함께 바뀐다** — 세로 배치에서 좌우 화살표가 남아 있으면 안 된다.

## States and behaviors

| 항목              | 값                                      |
| ----------------- | --------------------------------------- |
| 칸 크기           | `36 × 36`                               |
| 칸 radius         | `--gb-radius-scale-md` (8px)            |
| 항목 간격         | `--gb-spacing-1` (4px)                  |
| 아이콘            | `--gb-spacing-4` (16px), `--gb-icon-default` |
| 번호 텍스트       | `text-sm-medium`, `--gb-text-default`   |
| **현재 페이지**   | 배경 `--gb-background-default` + 보더 `--gb-border-default` 1px |
| 그 외 번호        | 배경 투명, 보더 없음                    |
| 비활성 화살표     | `--gb-opacity-50`                       |
| 점 크기           | `6px`, radius full                      |
| 점(현재/이전/이후)| `--gb-icon-default` / `--gb-icon-pressed` / `--gb-icon-faint` |
| 포커스 링         | `--gb-shadow-focus-ring`                |

- **현재 페이지만 테두리와 배경을 갖는다.** 나머지 번호는 투명이라 글자만 보인다.
- 첫 페이지에서 이전, 마지막 페이지에서 다음 화살표는 `disabled`가 되고 `opacity-50`으로 흐려진다.
- 말줄임(`…`)은 클릭 대상이 아니다 — hover 배경도 주지 않는다.
- 노출할 번호 개수는 `siblingCount * 2 + 5`로 계산한다(첫·마지막·현재·좌우 형제·말줄임 2개).

## 다른 범용 컴포넌트와의 조합 가이드

공용 `Button`을 쓰지 않는다 — Figma 페이지 칸이 36×36 radius 8에 현재 페이지만 보더를 갖는 고유 배색이라, `Button`의 어느 variant와도 맞지 않는다.

`components/ui/pagination/` 바깥의 실사용처는 아직 없다.
