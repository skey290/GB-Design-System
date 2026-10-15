# MenuButton

- 코드: `components/app/menu-button/menu-button.tsx` (`menu-button.stories.tsx`, `menu-button.test.tsx`, `index.ts`)
- Figma: [📌 GB_Design-System (Atom)](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3436-812) node `3436:812` · [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8163-93014) `Part/GNB` node `8163:93014`

## Overview

GNB(사이드바) 내비게이션 항목 하나. `type`에 따라 아이콘만, 아이콘+라벨, 라벨만 세 가지 형태로 렌더링한다.

Figma `Part/GNB`는 `Type`(`text` / `icon + text`) × `Status`(`default` / `active` / `disabled`) 6조합이다. 코드의 `type="icon"`은 이 6조합에 없는 별도 상태가 아니라, 상위 GNB가 접힌(Expand=false) 상태에서 `icon + text`의 라벨을 숨긴 모습과 같다 — Figma에서도 그 상태는 Part/GNB 대신 범용 `Button`(`variant="icon-ghost"`) 인스턴스를 직접 꽂아 쓴다.

## When to use

- GNB 사이드바의 내비게이션 항목.

## When not to use

- GNB 바깥의 일반 버튼에는 범용 `Button`을 쓴다. `MenuButton`은 GNB Expand 토글과 "현재 선택된 항목" 상태를 전제로 만들어졌다.

## How to use

```tsx
<MenuButton type="icon-with-text" icon={Home} label="Dashboard" />
<MenuButton type="text" label="Dashboard" status="active" />
<MenuButton type="icon" icon={Home} aria-label="Dashboard" />
```

## Structure

- 루트는 단일 `<button>`. `type="icon"`/`"icon-with-text"`일 때 아이콘을 감싸는 `<span>` 하나, 라벨은 `type`과 무관하게 항상 DOM에 마운트해두고 `grid-template-columns: 0fr↔1fr` + `padding-left`로 폭/간격/opacity를 함께 트랜지션한다(조건부 렌더링은 Expand 토글 시 트랜지션 없이 팝인/팝아웃하는 문제가 있었음).
- Figma에 hover 상태가 없다(hover/press/select가 전부 active와 동일) — 마우스 오버 시 `active`와 동일한 스타일을 보여준다(`showActiveStyle = isActive || isHovered`). `text-styles.css`의 커스텀 텍스트 유틸리티는 Tailwind `hover:` variant를 타지 못해 CSS 대신 `onMouseEnter`/`onMouseLeave` state로 처리한다.

## Props

| Prop     | 타입                                     | 기본값      | 설명                                                                    |
| -------- | ---------------------------------------- | ----------- | ------------------------------------------------------------------------ |
| `type`   | `"icon" \| "icon-with-text" \| "text"`   | `"icon"`    | Figma `Type`. `icon`은 GNB가 접혔을 때의 모습(아래 Overview 참고)         |
| `status` | `"default" \| "active" \| "disabled"`    | `"default"` | Figma `Status`. disabled는 이 하나로만 표현 — 네이티브 `disabled`는 안 받음 |
| `icon`   | `LucideIcon`                             | -           | `type="icon" \| "icon-with-text"`에서 렌더링할 아이콘                    |
| `label`  | `string`                                 | -           | `type="icon-with-text" \| "text"`에서 렌더링할 라벨 텍스트                |

## States and behaviors

- **아이콘 박스 radius**: `default`/`disabled`는 `rounded-full`(배경 없음), `active`(선택됨 또는 호버)는 `rounded-lg`(10px) + `bg-mute` — 범용 `Button`의 `icon-ghost` variant와 동일한 토큰 조합이다. `Part/GNB`의 아이콘 박스가 Figma에서 `Button(icon-ghost)` 인스턴스이기 때문에 코드도 같은 값을 쓰지만, `MenuButton`의 루트가 이미 `<button>`이라 그 안에 `<Button>`(역시 `<button>`을 렌더링)을 중첩할 수 없어 값만 동일하게 재현했다 — 실제 컴포넌트 임베드는 불가능한 구조.
- **disabled**: 네이티브 `disabled` + `aria-current` 미설정. 라벨은 `text-static-gray`.
- **active**: `aria-current="true"`. 시각 전용 플래그(`showActiveStyle`)와 실제 선택 여부(`isActive`)를 분리해, 호버만으로는 `aria-current`가 바뀌지 않는다.
