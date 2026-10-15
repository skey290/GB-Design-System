# DropdownList

- 코드: `components/ui/dropdown-list/dropdown-list.tsx` (`dropdown-list.stories.tsx`, `dropdown-list.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8160-31364) `Dropdown slot`(node `8160:31364`) · `Part/dropdown slot`(node `8160:31351`)

## Overview

`Select`의 드롭다운 패널 안에 들어가는 옵션 리스트(+ 커스텀 스크롤바 + "Show more" 버튼)만 따로 뽑아낸 컴포넌트. `Select`는 이 컴포넌트를 import해서 트리거 아래 팝오버 콘텐츠 안에 끼워 넣는다 — `components/ui/chatbox`와 `components/app/chatbox-composer`가 "범용 슬롯 + 그 슬롯을 채우는 콘텐츠"로 분리되어 있는 것과 똑같은 관계다. 차이는 Chatbox의 슬롯은 정적 콘텐츠만 받는 반면, 여기는 선택/강조 상태가 `Select`와 양방향으로 오간다는 점(`highlightedIndex`/`onHighlightChange`, `onCommit`).

Figma 쪽에서는 `Select` 컴포넌트셋(Atom 파일, node `614:2466`) 안에 `name="Dropdown"`인 빈 slot 노드가 있고, 거기 실제로 꽂히는 리스트 콘텐츠의 디자인은 다른 화면 파일의 `Dropdown slot`/`Part/dropdown slot`을 기준으로 삼는다.

## When to use

- `Select`가 내부적으로만 사용한다. 직접 다른 곳에서 가져다 쓸 일은 거의 없지만, 트리거 없이 옵션 리스트만 필요한 경우(예: 커맨드 팔레트 등)에는 재사용 가능.

## How to use

```tsx
<DropdownList
  options={options}
  value={currentValue}
  highlightedIndex={highlightedIndex}
  onHighlightChange={setHighlightedIndex}
  onCommit={(option) => { ... }}
  listboxId={listboxId}
  getOptionId={(value) => `${id}-option-${value}`}
/>
```

## Props

| Prop                | 타입                                    | 설명                                                    |
| ------------------- | --------------------------------------- | ------------------------------------------------------- |
| `options`           | `DropdownListOption[]`                  | `{ value, label, code?, icon?, disabled? }[]`            |
| `value`             | `string`                                 | 현재 선택된 값                                           |
| `highlightedIndex`  | `number`                                 | 키보드/마우스로 강조된 옵션 인덱스 (제어, 부모가 소유)   |
| `onHighlightChange` | `(index: number) => void`               | 마우스 hover로 강조가 바뀔 때 호출                       |
| `onCommit`          | `(option: DropdownListOption) => void`  | 옵션 클릭 시 호출 — disabled 체크는 호출하는 쪽 책임     |
| `listboxId`         | `string`                                 | `<ul id>` — 트리거의 `aria-controls`와 연결              |
| `getOptionId`       | `(value: string) => string`             | 옵션별 `id` 생성 — `aria-activedescendant` 연결용        |

`DropdownListOption`: `{ value: string; label: string; code?: string; icon?: LucideIcon; disabled?: boolean }` — `Select`가 공개하는 `SelectOption`은 이 타입의 별칭이다(`export type { SelectOption }`로 재수출).

## Structure

- 옵션 중 하나라도 `icon`을 가지면 16px 아이콘 칸(없는 옵션은 빈 칸으로 자리만 유지)을 맨 앞에 추가.
- 옵션 중 하나라도 `code`를 가지면 `code` 컬럼(고정폭 50px) + `label` 2단 레이아웃, 아니면 `label` 단일 컬럼.
- 커스텀 스크롤바: 브라우저 기본 스크롤바를 숨기고 트랙/썸을 `<div>`로 직접 그려 스크롤 위치에 따라 `top`/`height` 퍼센트를 계산. 옵션이 6개 초과일 때만 렌더링.
- 스크롤 다음 버튼: 옵션이 6개 초과일 때만 하단에 노출되는 `aria-label="Show more options"` 버튼, 클릭 시 리스트를 한 화면 높이만큼 `scrollBy(smooth)`.
- `disabled` 옵션은 텍스트만 흐려지고 hover 강조가 안 걸리지만, 클릭 자체는 `onCommit`으로 그대로 전달된다 — 선택을 막는 책임은 호출하는 쪽(`Select`)에 있다.

## States and behaviors

- **selected / highlighted 옵션**: `--gb-background-mute` + `--gb-text-static-white`로 동일하게 표시(마우스 hover든 키보드 하이라이트든 동일).
- **옵션 단위 disabled**: 텍스트만 `--gb-text-static-gray`로 바뀌고 배경 변화는 없다. hover 시에도 하이라이트되지 않는다.
