# Input search

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3981-19811) · node-id `3981:19811`
코드: `components/ui/input-search/input-search.tsx`

## Overview

왼쪽에 돋보기 아이콘이 들어간 한 줄 검색 입력. 공용 [PartInput](./part-input.md)을 보더·배경 없이 합성하고, 바깥 wrapper가 보더·그림자·포커스 링을 담당한다.

Figma 컴포넌트 설명(description) 필드 원문:

> A single-line field for search queries, with a search icon inside the input box. Submitting is the consumer's concern — this component only owns the query text. Use the plain Input for ordinary text entry.

## When to use

- 목록·갤러리 위에 검색어를 입력받는 자리.
- **검색 실행은 이 컴포넌트의 책임이 아니다.** Enter 처리·디바운스·쿼리 전송은 호출하는 쪽이 한다. 이 컴포넌트는 입력값만 들고 있는다.

## When not to use

- **일반 텍스트 입력** → [Input](./input.md). 검색 아이콘이 붙은 모양 자체가 "검색"이라는 의미를 갖는다.

## How to use

```tsx
// 기본
<InputSearch placeholder="Search placeholder" />

// 제어 컴포넌트 + 검색 실행은 호출부에서
<InputSearch
  value={query}
  onValueChange={setQuery}
  onKeyDown={(e) => e.key === "Enter" && runSearch(query)}
/>

// 비활성화
<InputSearch disabled />
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `input-search.tsx` / `input-search.stories.tsx` / `input-search.test.tsx` / `index.ts`.

```
<div>                      보더·배경·그림자·포커스 링 담당, h 36, gap 12
  <Search />               lucide 돋보기, 16px, 선행
  <PartInput />            보더·배경·패딩 제거한 순수 input, flex-1
```

- **검색 아이콘은 선행(leading)** 이라 아이콘↔텍스트 간격이 **12px**이다. 후행 아이콘을 쓰는 `PartInput`(8px)과 값이 다르다.
- `PartInput`은 `trailingIcon={false}`로 쓰고 `rounded-none border-0 bg-transparent px-0`으로 중화한다 — 시각적 껍데기는 전부 바깥 wrapper가 갖는다.

## Props

`InputSearchProps`는 `PartInputProps`에서 `value`/`defaultValue`/`onValueChange`/`className`을 제외(Omit)하고 아래를 다시 선언한 형태다.

| Prop            | 타입                      | 기본값                  | 설명                                      |
| --------------- | ------------------------- | ----------------------- | ----------------------------------------- |
| `value`         | `string`                  | —                       | 제어 컴포넌트로 쓸 때의 값                |
| `defaultValue`  | `string`                  | —                       | 비제어 컴포넌트 초기값                    |
| `onValueChange` | `(value: string) => void` | —                       | 값이 바뀔 때 호출                         |
| `placeholder`   | `string`                  | `"Search placeholder"`  | 빈 값일 때 표시할 예시 문구               |
| `disabled`      | `boolean`                 | —                       | 비활성화                                  |
| `className`     | `string`                  | —                       | 바깥 wrapper에 병합                       |

그 외 native `<input>` 속성은 `...inputProps`로 내부 `PartInput`에 전달된다(`onKeyDown`, `name`, `autoFocus` 등).

## Variants

cva 기반 `variant` prop이 없다. Figma의 축은 `Status` 하나이고 값은 `default`/`active`/`filled`/`disabled` 넷이다(`error` 없음).

| Figma `Status` | 트리거            | 배경                       | 보더                       | 텍스트                  |
| -------------- | ----------------- | -------------------------- | -------------------------- | ----------------------- |
| `default`      | 값 없음, 비포커스 | `--background`             | `--border`                 | `--muted-foreground`    |
| `filled`       | 값 있음           | `--background`             | `--border`                 | `--foreground`          |
| `active`       | hover 또는 포커스 | `--background`             | `--ring`                   | `--foreground`          |
| `disabled`     | `disabled`        | `--gb-background-disabled` | `--gb-border-overlay`      | `--gb-text-static-gray` |

## States and behaviors

| 항목        | 값                                                        |
| ----------- | --------------------------------------------------------- |
| 높이        | `36px`                                                    |
| 좌우 패딩   | `--gb-spacing-3` (12px)                                   |
| 아이콘 간격 | `--gb-spacing-3` (12px)                                   |
| radius      | `--gb-radius-scale-md`                                    |
| 그림자      | `--gb-shadow-xs` (default·filled·disabled)                |
| 포커스 링   | `--gb-shadow-focus-ring` — active에서 `shadow-xs`를 **대체**한다 |
| 아이콘 색   | `--gb-icon-default`, disabled에서 `--gb-icon-static-gray` |

- **`active`는 prop이 아니다.** `hover:`와 `focus-within:` 양쪽에 같은 스타일을 건다 — Figma의 `active`가 마우스 오버와 포커스 모두를 뜻하기 때문이다.
- **disabled는 흐림이 아니다.** `opacity`를 낮추는 대신 불투명한 별도 배색을 쓰고, `pointer-events-none`으로 hover 변화를 막는다.
- 폭은 `w-full`이다. Figma 목업의 344px은 배치 예시이지 스펙이 아니다.

## 다른 범용 컴포넌트와의 조합 가이드

- **PartInput** (`components/ui/part-input`): 입력 본체. 보더·배경·패딩을 모두 끄고 합성한다. 주의 — Figma에서는 `Input search`가 `Part/Input` 인스턴스를 쓰지 않고 아이콘·텍스트를 루트 직속으로 둔다. 코드 쪽이 더 조합적이다.

`components/ui/input-search/` 바깥의 실사용처는 아직 없다.
