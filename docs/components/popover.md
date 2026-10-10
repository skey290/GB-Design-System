# Popover

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7269-451) — "Popover" 컴포넌트셋 (node-id `7269:451`)
코드: `components/ui/popover/popover.tsx`

## Overview

이 컴포넌트는 이름과 달리 일반적으로 통용되는 "트리거 근처에 뜨는 작은 팝업"이 아니다.

- **코드**: `popover.tsx` 최상단 import가 `import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";`이다. `@radix-ui/react-popover`가 아니라 **alert-dialog** 프리미티브를 그대로 사용한다.
- **Figma**: 컴포넌트셋(`7269:451`) 프레임 이름은 `Popover`이지만, `Type=notification`/`Type=warning` 두 심볼을 한 단계 더 들어가면 실제 콘텐츠 프레임의 레이어명은 둘 다 **`Alert dialog`**다(node `7269:378`, `7269:453`). 즉 Figma 안에서도 "Popover"는 컴포넌트셋 레벨의 이름일 뿐, 레이어 트리는 자기 자신을 "Alert dialog"로 부른다.
- **동작**: children으로 트리거 요소를 받지 않고(자체 트리거 없음), 부모가 `open`/`onOpenChange`로 완전히 제어하는 완전 제어형 컴포넌트다. 화면 정중앙(`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`)에 고정 렌더링되며, 트리거에 앵커링되는 화살표나 위치 계산 로직이 전혀 없다.

Figma 컴포넌트 설명(description) 필드 원문:

> A centred modal panel that interrupts the user with a notification or a warning and waits for a response. Type selects which of the two it is. It has no trigger of its own and is not anchored to one — the parent decides when it is open. Use Tooltip for a short hint attached to a trigger.

즉 이름은 "Popover"지만 Figma description·내부 레이어명·코드 구현이 모두 **앵커 없는 중앙 모달**로 일치한다.

### Popover vs Tooltip 비교

`docs/components/tooltip.md`의 표와 대칭으로 기술:

|                 | **Popover**(이 문서, 이 코드베이스의 실제 구현)                                                                           | **Tooltip**                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 기반 프리미티브 | `@radix-ui/react-alert-dialog`                                                                                            | `@radix-ui/react-tooltip`                                     |
| 트리거 방식     | 자체 트리거 없음 — 부모가 `open`/`onOpenChange`를 직접 제어하는 완전 제어형(`children`으로 트리거를 받지 않음)            | hover/focus(Figma Tooltip description에 명시)                 |
| 배치            | 항상 화면 정중앙(`fixed top-1/2 left-1/2`) — 앵커 없음                                                                    | 트리거에 앵커링(`side`/`align`, 화살표 포함)                  |
| Figma 상 정체   | 컴포넌트셋 이름은 "Popover"(node `7269:451`)이지만 **실제 콘텐츠 레이어명은 "Alert dialog"** — 확인/경고 모달에 더 가까움 | "Tooltip" 컴포넌트(호버 정보 팝업), 레이어명도 Tooltip과 일치 |

정리하면, 이 프로젝트에서 "Popover"라는 이름의 컴포넌트는 실제로는 클릭 등으로 열고 닫는 화면 중앙 확인/경고 모달(alert dialog)이고, 마우스 호버로 여닫히는 일반적 의미의 "popover" 상호작용은 이 컴포넌트가 아니라 `Tooltip`이 담당한다(자세한 내용은 `tooltip.md` 참고).

트리거 근처에 앵커링되는 "진짜" popover 패턴은 이 프로젝트에도 있지만, `components/ui/popover`가 아니라 `@radix-ui/react-popover`를 각 컴포넌트가 직접 import해서 개별 구현한 것이다. 사용처: `components/ui/select/select.tsx`, `components/ui/date-select/date-select.tsx`, `components/ui/range-select/range-select.tsx`, `components/app/gnb/gnb.tsx`(알림 드롭다운), `components/app/noti-dropdown/noti-dropdown.tsx`. 즉 앵커형 팝오버에는 공용 래퍼가 없고, 컴포넌트별로 Radix 프리미티브를 직접 쓰는 컨벤션이다.

## When to use

- 화면 중앙에서 사용자의 확인/취소 응답을 반드시 받아야 하는 상황(예: 다른 페이지로 이동하기 전 확인, 위험한 동작 전 경고).
- 실사용 예(스토리 기준): "Content Studio로 이동하시겠습니까?" 같은 페이지 이탈 확인.

## When not to use

- **트리거에 붙는 짧은 힌트** → Figma description이 명시한다. 이 컴포넌트가 아니라 [Tooltip](./tooltip.md)을 쓴다.
- **트리거에 앵커링된 드롭다운/캘린더류** → `@radix-ui/react-popover`를 직접 쓰는 기존 컨벤션(select/date-select/range-select)을 따른다. 이 컴포넌트는 앵커링을 하지 않는다.

## How to use

`popover.stories.tsx`에서 그대로 인용(완전 제어형이라 스토리에서도 로컬 state로 감싼 데모 래퍼를 사용):

```tsx
import { Popover } from "./popover";

// Notification (기본)
<Popover
  type="notification"
  open={open}
  onOpenChange={setOpen}
  title="Heading to 'Content Studio' to create your post?"
  description="Exit this page and start creating a post in 'Content Studio'."
  onCancel={() => {}}
  onConfirm={() => {}}
/>

// Warning
<Popover type="warning" open={open} onOpenChange={setOpen} title="..." description="..." />

// "Do not ask again." 체크박스 포함 (notification 전용)
<Popover
  type="notification"
  open={open}
  onOpenChange={setOpen}
  title="..."
  description="..."
  checkbox={false}
  checkboxLabel="Do not ask again."
  onCheckedChange={(checked) => {}}
/>

// 버튼 라벨 커스터마이즈
<Popover type="notification" open={open} onOpenChange={setOpen} title="..." description="..."
  cancelLabel="Not now" confirmLabel="Yes, continue" />
```

## Structure

- `AlertDialogPrimitive.Root`(`open`/`onOpenChange`로 완전 제어) → `Portal` → `<div className="dark">` 래퍼 → `Overlay` + `Content`.
- **`.dark` 강제 스코프**: 이 컴포넌트가 참조하는 시맨틱 토큰(`--background-default`, `--text-default`, `--background-bold`, `--text-invert`, `--border-default` 등)은 항상 다크모드 값으로 렌더링된다 — `Chatbox`/`GNB`/`DateSelect`/`RangeSelect`/`NotiDropdown`과 동일한 패턴. Figma 실제 값은 `--background-default: #0a0a0a`, `--text-default: #fafafa`, `--border-default: #404040`, `--background-bold: #e5e5e5`, `--text-invert: #171717`다.
- `Overlay`: `bg-[var(--gb-background-backdrop)] backdrop-blur-[var(--backdrop-blur-md)]`로 배경을 블러 처리.
- `Content`: 정중앙 고정(`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`), 너비 `var(--scale-512)`(512px), `rounded-[var(--gb-radius-scale-lg)]`, `p-[var(--gb-spacing-6)]`, `shadow-[var(--gb-shadow-lg)]`. 내부는 세로 2단 구성:
  1. 헤더 영역: `leadingIcon`(24px 슬롯, 기본값은 Figma placeholder `circle-dashed-icon`) + `Title`(`text-lg-semi-bold`)을 가로 배치, 그 아래 `Description`(`text-sm-regular`, `--text-subtle`).
  2. 액션 영역: (notification이고 `checkbox`가 전달됐을 때만) `Checkbox`(`variant="muted"`) 한 줄 + Cancel/Confirm `Button` 두 개(`AlertDialogPrimitive.Cancel`/`Action`을 `asChild`로 감싸 기존 `Button`(`outline`/`primary`, 각 `flex-1`)을 그대로 재사용).
- 기존 컴포넌트 재사용: `Button`(`components/ui/button`), `Checkbox`(`components/ui/checkbox`) — 새 `<button>` 태그를 만들지 않고 그대로 조합.

## Props

| Prop              | 타입                          | 필수   | 기본값                                        | 설명                                                                                                                                                                                                                                                       |
| ----------------- | ----------------------------- | ------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`            | `"notification" \| "warning"` | 예     | —                                             | Figma `Type` variant에 대응                                                                                                                                                                                                                                |
| `open`            | `boolean`                     | 예     | —                                             | 다이얼로그 열림 여부(완전 제어형)                                                                                                                                                                                                                          |
| `onOpenChange`    | `(open: boolean) => void`     | 예     | —                                             | open 상태 변경 콜백                                                                                                                                                                                                                                        |
| `title`           | `string`                      | 예     | —                                             | 다이얼로그 제목(`text-lg-semi-bold`)                                                                                                                                                                                                                       |
| `description`     | `string`                      | 예     | —                                             | 다이얼로그 설명(`text-sm-regular`, `--text-subtle`)                                                                                                                                                                                                        |
| `leadingIcon`     | `React.ReactNode`             | 아니오 | Figma placeholder(`circle-dashed-icon`, 24px) | 헤더 아이콘 슬롯                                                                                                                                                                                                                                           |
| `checkbox`        | `boolean`                     | 아니오 | —                                             | "Do not ask again." 체크 상태. `type="notification"`이고 이 prop이 전달됐을 때만(즉 `undefined`가 아닐 때만) 체크박스 행 자체가 렌더링됨 — Figma의 "표시 안 함" 상태와 대응. `type="warning"`에서는 Figma에 이 행이 존재하지 않으므로 값을 전달해도 무시됨 |
| `checkboxLabel`   | `string`                      | 아니오 | `"Do not ask again."`                         | 체크박스 라벨                                                                                                                                                                                                                                              |
| `onCheckedChange` | `(checked: boolean) => void`  | 아니오 | —                                             | 체크박스 토글 콜백                                                                                                                                                                                                                                         |
| `cancelLabel`     | `string`                      | 아니오 | `"Cancel"`                                    | 취소 버튼 라벨                                                                                                                                                                                                                                             |
| `onCancel`        | `() => void`                  | 아니오 | —                                             | 취소 버튼 클릭 콜백                                                                                                                                                                                                                                        |
| `confirmLabel`    | `string`                      | 아니오 | `"Confirm"`                                   | 확인 버튼 라벨                                                                                                                                                                                                                                             |
| `onConfirm`       | `() => void`                  | 아니오 | —                                             | 확인 버튼 클릭 콜백                                                                                                                                                                                                                                        |

## Variants

### Type — `type`

Figma `Type` 프로퍼티는 `notification`/`warning` 2종(`Type=notification` node `7269:377`, `Type=warning` node `7269:452`). 실측값:

| type                                | 아이콘 색        | Title 색         | Border 색          | 체크박스 행                                                                                                               |
| ----------------------------------- | ---------------- | ---------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `notification`(기본 성격의 variant) | `--icon-default` | `--text-default` | `--border-subtle`  | Figma에 `checkbox` 인스턴스가 존재(단, 실측 시 `hidden="true"`로 숨겨진 상태) — 코드에서 `checkbox` prop 전달 시에만 노출 |
| `warning`                           | `--icon-error`   | `--text-error`   | `--border-warning` | Figma 레이어 트리에 체크박스 인스턴스 자체가 없음 — 코드도 `type === "notification"`일 때만 행을 렌더링하도록 이중 방어   |

Description 텍스트(`--text-subtle`)와 Cancel/Confirm 버튼 색은 두 variant 간 차이 없음(둘 다 동일하게 `Button` outline/primary 재사용).

## States and behaviors

- **열림/닫힘**: 완전 제어형 — `open`이 `true`일 때만 렌더링되며, 트리거 자체는 컴포넌트 밖에서 관리한다(`children`을 받지 않음).
- **Cancel**: `AlertDialogPrimitive.Cancel`이 자동으로 다이얼로그를 닫고(`onOpenChange(false)`), 추가로 `onCancel` 콜백을 호출한다(테스트 `popover.test.tsx`로 확인).
- **Confirm**: `AlertDialogPrimitive.Action`도 동일하게 자동으로 닫힌 뒤 `onConfirm` 콜백을 호출한다.
- **Escape 키**: Radix AlertDialog 기본 동작으로 `onOpenChange(false)`가 호출되며 닫힌다(테스트로 확인).
- **체크박스 행 노출 조건**: `type === "notification" && checkbox !== undefined`일 때만 렌더링. `checkbox={false}`를 명시적으로 전달해야 렌더링되며, prop 자체를 생략하면(=`undefined`) 행이 아예 나타나지 않는다 — "값이 false"와 "행을 안 보여줌"을 구분하는 설계.
- **collision/포지셔닝 로직 없음**: Tooltip과 달리 화면 정중앙 고정이라 `collisionPadding`류의 방어 로직이 존재하지 않는다(뷰포트 경계 충돌 개념 자체가 없음).

## 다른 범용 컴포넌트와의 조합 가이드

**현재 이 컴포넌트를 가져다 쓰는 곳은 컴포넌트 자신의 스토리/테스트뿐이고, 앱/다른 컴포넌트에서의 실사용처는 없다**. 대신 컴포넌트 **내부**에서 다른 범용 컴포넌트를 조합하는 패턴이 확인된다:

- **Button 조합**: Cancel/Confirm 두 액션 모두 `AlertDialogPrimitive.Cancel`/`Action`을 `asChild`로 감싸 기존 `Button`(`variant="outline"`/`variant="primary"`, 각각 `flex-1`로 동일 너비)을 그대로 재사용한다(`button.md`의 "폼/다이얼로그의 확인·취소 액션" 사용처로도 기록돼 있음).
- **Checkbox 조합**: `type="notification"`이고 `checkbox` prop이 전달된 경우에만 `Checkbox`(`variant="muted"`)를 설명 텍스트와 액션 버튼 사이에 배치한다(`checkbox.md`에도 이 조합이 코드베이스 내 유일한 실사용처로 기록돼 있음). `.dark` 강제 스코프 안에서 렌더링되므로 무테마 상태에서도 항상 다크 톤으로 보인다.
- **신규 화면 설계 시 주의**: 트리거에 앵커링되는 실제 "popover" UI(드롭다운, 캘린더, 액션 메뉴 등)가 필요하면 이 `Popover` 컴포넌트를 재사용하지 말 것 — 위 Overview에서 확인했듯 이 컴포넌트는 화면 중앙 확인 모달 전용이다. 대신 이 코드베이스의 기존 컨벤션대로 `@radix-ui/react-popover`를 직접 사용한 기존 구현체(`Select`, `DateSelect`, `RangeSelect`, `GNB`의 알림 드롭다운, `NotiDropdown`)의 패턴을 참고해 개별 구현하거나, 호버 기반 보조 정보라면 `Tooltip`을 사용한다.

## `leadingIcon`은 기본값이 없다

Figma `-> Leading Icon`의 instance-swap 기본값은 `4063:4787`(`lucide/circle-dashed`)인데, 이 노드는 **Badge의 `Leading Icon`, Button의 `Icon`도 공유하는 Figma 공용 placeholder**다. 즉 디자인 의도가 아니라 "여기에 아이콘이 들어간다"는 자리표시다.

그래서 코드는 placeholder를 런타임 기본값으로 출하하지 않는다 — `leadingIcon`을 전달하지 않으면 슬롯 자체를 렌더링하지 않는다(Figma `Leading Icon=false`와 같은 결과). Badge가 `icon`에 기본값을 두지 않는 것과 같은 규칙이다.

## `warning`에는 체크박스를 넘길 수 없다

Figma `Type=warning`에는 체크박스 레이어가 **아예 없다**(`notification`에는 있고 `visible=false`). 목업 누락이 아니라 구조적으로 불가능한 조합이므로, `PopoverProps`를 `type`으로 갈라지는 discriminated union으로 두어 `warning` + `checkbox`를 **타입 레벨에서 막는다**. 타입을 우회해 넘겨도 렌더링되지 않는 런타임 방어는 `popover.test.tsx`가 고정한다.

## ⚠️ 확인 필요

없음.
