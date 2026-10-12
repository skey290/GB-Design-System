# Button group

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3466-29935) · node-id `3466:29935`
코드: `components/ui/button-group/button-group.tsx`

## Overview

관련 버튼들을 한 덩어리로 묶는 컴포넌트. 성격이 완전히 다른 두 형태가 한 컴포넌트셋 안에 들어 있다.

- **2버튼 행** (`skippable` / `back-or-forth` / `save` / `confirm` / `error`) — 왼쪽 보조(outline) + 오른쪽 주(primary) 액션. 단계나 다이얼로그를 닫는 쌍이다.
- **`menu`** — 떠 있는 알약 모양 내비게이션. 항목 하나만 활성화된다.

Figma 컴포넌트 설명(description) 필드 원문:

> A row of related buttons presented as one unit — either a secondary/primary action pair that closes a step or dialog, or a segmented set where one item is active at a time. Use Button on its own when there is only one action, and Toggle when each item toggles independently.

## When to use

- 단계/다이얼로그의 **보조 + 주 액션 쌍**이 필요할 때 — `type`만 고르면 라벨이 따라온다.
- 화면 위에 떠 있는 **내비게이션 pill**이 필요할 때 → `type="menu"`.

## When not to use

Figma description이 두 대안을 명시한다.

- **액션이 하나뿐** → [Button](./button.md)을 단독으로 쓴다.
- **각 항목이 독립적으로 켜고 꺼짐** → [Toggle](./toggle.md). `menu`는 항상 하나만 활성이다.

## How to use

```tsx
// 2버튼 행 — type이 라벨을 결정
<ButtonGroup type="confirm" onSecondaryClick={close} onPrimaryClick={submit} />

// 라벨 덮어쓰기
<ButtonGroup type="save" secondaryLabel="나중에" primaryLabel="저장" />

// 부모 너비 꽉 채우기 (기본은 344px 고정)
<ButtonGroup type="skippable" shouldFitContainer />

// 플로팅 메뉴
<ButtonGroup
  type="menu"
  items={[
    { id: "home", icon: "home-icon" },
    { id: "assets", label: "Assets" },
    { id: "compass", label: "Compass" },
  ]}
  activeId={active}
  onActiveChange={setActive}
/>
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `button-group.tsx` / `button-group.stories.tsx` / `button-group.test.tsx` / `index.ts`.

```
2버튼 행:
<div>                            flex, items-end, gap 10, w 344 (또는 w-full)
  <Button variant="outline" className="flex-1" />
  <Button variant="primary" className="flex-1" />

menu:
<div role="tablist">             inline-flex, h 53, gap 12, px 10, py 8, radius full
  <Button variant="ghost" | "icon-rounded" role="tab" />  항목 수만큼
```

- 두 버튼은 `flex-1`로 **정확히 반씩** 나눠 갖는다(Figma 344 = 167 + 10 + 167).
- `menu`는 `--gb-background-sheer` 배경 + `backdrop-filter` 블러라 뒤가 비치는 떠 있는 바다.
- `menu` 항목은 `label`이 있으면 `ghost`, 없으면 `icon-rounded`로 자동 전환된다.

## Props

| Prop                  | 타입                            | 기본값         | 설명                                                    |
| --------------------- | ------------------------------- | -------------- | ------------------------------------------------------- |
| `type`                | `ButtonGroupType`               | `"skippable"`  | 조합 종류. `menu`만 pill, 나머지는 2버튼 행            |
| `disabled`            | `boolean`                       | `false`        | 조합 내 모든 버튼을 비활성화                           |
| `shouldFitContainer`  | `boolean`                       | `false`        | 고정 344px 대신 부모 너비를 채운다 (`menu` 제외)       |
| `secondaryLabel`      | `string`                        | `type`별 기본  | 왼쪽 outline 버튼 라벨                                  |
| `primaryLabel`        | `string`                        | `type`별 기본  | 오른쪽 primary 버튼 라벨                                |
| `onSecondaryClick`    | `MouseEventHandler`             | —              | 왼쪽 버튼 클릭 핸들러                                   |
| `onPrimaryClick`      | `MouseEventHandler`             | —              | 오른쪽 버튼 클릭 핸들러                                 |
| `items`               | `ButtonGroupMenuItem[]`         | 기본 4개 항목  | `type="menu"` 전용 항목 목록                            |
| `activeId`            | `string`                        | —              | `type="menu"`의 현재 활성 항목 id                       |
| `onActiveChange`      | `(id: string) => void`          | —              | `type="menu"` 활성 항목 변경 콜백                       |

`ButtonGroupType`은 `"skippable" | "back-or-forth" | "save" | "confirm" | "error" | "menu"`다.
Figma 라벨은 공백·대문자를 쓰므로 코드에서 kebab-case/소문자로 바꿨다 — `back or forth` → `back-or-forth`, `Error` → `error`.

## Variants

### `type`별 기본 라벨

| `type`          | 왼쪽(outline) | 오른쪽(primary)      |
| --------------- | ------------- | -------------------- |
| `skippable`     | Later         | Go Next              |
| `back-or-forth` | Go back       | Go Next              |
| `save`          | Cancel        | Save                 |
| `confirm`       | Cancel        | Confirm              |
| `error`         | Refresh       | Back to Dashboard    |

라벨만 다르고 **배색·치수는 다섯 종류가 완전히 동일**하다. Figma도 `Type` 축이 라벨만 바꾼다.

### `menu`

| 항목                 | 값                                |
| -------------------- | --------------------------------- |
| 높이                 | `53px`                            |
| gap                  | `--gb-spacing-3` (12px)           |
| 패딩                 | px `--gb-spacing-2-5` · py `--gb-spacing-2` |
| radius               | `--gb-radius-scale-full`          |
| 배경                 | `--gb-background-sheer`           |
| 보더                 | `--gb-border-default` 1px         |
| 배경 블러            | `--gb-backdrop-blur`            |
| 항목(라벨 있음)      | `Button variant="ghost"`          |
| 항목(아이콘만)       | `Button variant="icon-rounded"`   |

## States and behaviors

- **2버튼 행의 `disabled`**: 두 버튼이 함께 비활성 배색(`--gb-background-disabled` + `--gb-border-overlay` + `--gb-text-static-gray`)이 된다. Figma도 `Status=disabled`에서 두 버튼이 같은 모습이다.
- **`menu`의 키보드 이동**: `role="tablist"` + `role="tab"`이라 좌우 화살표로 항목을 옮긴다.
- `shouldFitContainer`는 `menu`에 적용되지 않는다 — pill은 내용만큼만 넓어진다.

## 다른 범용 컴포넌트와의 조합 가이드

- **Button** (`components/ui/button`): 두 형태 모두 공용 Button을 조합한다. 2버튼 행은 `outline`/`primary`, `menu`는 `ghost`/`icon-rounded`. 전용 버튼을 따로 만들지 않는다.

`components/ui/button-group/` 바깥의 실사용처는 아직 없다.
