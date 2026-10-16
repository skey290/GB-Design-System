# DropdownList

- 코드: `components/ui/dropdown-list/dropdown-list.tsx` (`dropdown-list.stories.tsx`, `dropdown-list.test.tsx`, `index.ts`)
- Figma: [📌 GB_Design-System (Atom)](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=8094-1187) `Dropdown slot`(node `8094:1187`) · `Part/dropdown slot`(node `8094:1231`)

## Overview

`Select`의 드롭다운 패널 안에 들어가는 옵션 리스트(+ 커스텀 스크롤바)만 따로 뽑아낸 컴포넌트. `Select`는 이 컴포넌트를 import해서 트리거 아래 팝오버 콘텐츠 안에 끼워 넣는다 — `components/ui/chatbox`와 `components/app/chatbox-composer`가 "범용 슬롯 + 그 슬롯을 채우는 콘텐츠"로 분리되어 있는 것과 똑같은 관계다. 차이는 Chatbox의 슬롯은 정적 콘텐츠만 받는 반면, 여기는 선택/강조 상태가 `Select`와 양방향으로 오간다는 점(`highlightedIndex`/`onHighlightChange`, `onCommit`).

Figma 쪽에서는 `Select` 컴포넌트셋(Atom 파일, node `614:2466`) 안에 `name="Dropdown"`인 빈 slot 노드가 있고, 거기 실제로 꽂히는 리스트 콘텐츠의 디자인은 같은 Atom 파일 안에 `Select` 바로 옆에 배치된 `Dropdown slot`/`Part/dropdown slot`을 기준으로 삼는다(variant 축으로 흡수된 건 아니고 참고용 별개 컴포넌트셋).

`components/ui/`에 둔 이유는 이 컴포넌트가 `Select`(Atom 파일에 실재하는 ui 아톰)의 내부 구현이 분리된 것이기 때문이다 — `ui/Select`가 `app/`을 참조하면 `Select`만 공개하는 GB-Design-System 레포 빌드가 깨진다. `dropdown-list.stories.tsx`에 자주 추가되는 6개 Type 쇼케이스(menu/self/social media/timeframe/mbti/phone number)는 각 앱의 실사용 예시를 보여주는 스토리 샘플 데이터일 뿐, `DropdownListOption` 타입이나 렌더링 로직 자체는 이 쇼케이스들이 늘어나도 바뀌지 않는다.

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
- **리스트는 항상 최대 6행 높이로 고정된다.** 옵션이 6개를 넘으면 무조건 스크롤이 생긴다 — 7개 이상인 모든 경우(self/mbti/phone number 쇼케이스 포함) 예외 없이 적용되는 규칙이다. 커스텀 스크롤바는 브라우저 기본 스크롤바를 숨기고 트랙/썸을 `<div>`로 직접 그려 스크롤 위치에 따라 `top`/`height` 퍼센트를 계산하며, 옵션이 6개 초과일 때만 렌더링된다. 하단에 별도 "다음 보기" 버튼(chevron)은 Figma 디자인에 없으므로 두지 않는다 — 스크롤로만 나머지를 본다. (구현 메모: 높이 제한은 Tailwind 임의값 클래스가 아니라 `<ul>`/스크롤바 트랙에 인라인 `style`로 직접 건다 — `calc()`의 `+`/`-` 연산자는 앞뒤 공백이 없으면 전체 선언이 무효 처리되어 조용히 무시된다.)
- `disabled` 옵션은 텍스트만 흐려지고 hover 강조가 안 걸리지만, 클릭 자체는 `onCommit`으로 그대로 전달된다 — 선택을 막는 책임은 호출하는 쪽(`Select`)에 있다.

- 스크롤바 썸 크기는 `options`가 바뀔 때마다 `useLayoutEffect`로 재계산한다 — `<ul>` 자체는 재마운트되지 않아(같은 `Select`/`DropdownList` 인스턴스에서 콘텐츠만 바뀌는 경우) 마운트 시점에만 계산하면 이전 옵션 개수 기준 썸 크기가 그대로 남는다.

## States and behaviors

- **selected / highlighted 옵션**: `--gb-background-mute` + `--gb-text-static-white`로 동일하게 표시(마우스 hover든 키보드 하이라이트든 동일).
- **옵션 단위 disabled**: 텍스트만 `--gb-text-static-gray`로 바뀌고 배경 변화는 없다. hover 시에도 하이라이트되지 않는다.
