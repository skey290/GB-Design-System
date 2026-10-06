# Popover

Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=7269-451) — "Popover" 컴포넌트셋 (node-id `7269:451`)
코드: `components/ui/popover/popover.tsx`

## Overview

이 컴포넌트는 이름과 달리 일반적으로 통용되는 "트리거 근처에 뜨는 작은 팝업"이 아니다.

- **코드**: `popover.tsx` 최상단 import가 `import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";`이다. `@radix-ui/react-popover`가 아니라 **alert-dialog** 프리미티브를 그대로 사용한다.
- **Figma**: `get_metadata`로 node `7269:451`을 조회하면 최상위 컴포넌트셋 프레임 이름은 `Popover`이지만, 그 안의 `Type=notification`/`Type=warning` 두 심볼을 각각 한 단계 더 들어가면 실제 콘텐츠를 담은 프레임의 레이어명은 둘 다 **`Alert dialog`**다(node `7269:378`, `7269:453`). 즉 Figma 파일 안에서도 "Popover"는 페이지/컴포넌트셋 레벨의 이름일 뿐, 실제 레이어 트리 안에서는 자기 자신을 "Alert dialog"로 부르고 있다.
- **동작**: children으로 트리거 요소를 받지 않고(자체 트리거 없음), 부모가 `open`/`onOpenChange`로 완전히 제어하는 완전 제어형 컴포넌트다. 화면 정중앙(`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`)에 고정 렌더링되며, 트리거에 앵커링되는 화살표나 위치 계산 로직이 전혀 없다.

Figma 컴포넌트셋 자체에는 별도 description(설명) 필드가 없다(`get_design_context`로 조회 시 "Component descriptions" 섹션에 `Button`만 나오고 `Popover`/`Alert dialog`는 없음) — Figma에 별도 설명 없음.

### Popover vs Tooltip 비교

`docs/components/tooltip.md`의 표와 대칭으로 기술:

|                 | **Popover**(이 문서, 이 코드베이스의 실제 구현)                                                                           | **Tooltip**                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 기반 프리미티브 | `@radix-ui/react-alert-dialog`                                                                                            | `@radix-ui/react-tooltip`                                     |
| 트리거 방식     | 자체 트리거 없음 — 부모가 `open`/`onOpenChange`를 직접 제어하는 완전 제어형(`children`으로 트리거를 받지 않음)            | hover/focus(Figma Tooltip description에 명시)                 |
| 배치            | 항상 화면 정중앙(`fixed top-1/2 left-1/2`) — 앵커 없음                                                                    | 트리거에 앵커링(`side`/`align`, 화살표 포함)                  |
| Figma 상 정체   | 컴포넌트셋 이름은 "Popover"(node `7269:451`)이지만 **실제 콘텐츠 레이어명은 "Alert dialog"** — 확인/경고 모달에 더 가까움 | "Tooltip" 컴포넌트(호버 정보 팝업), 레이어명도 Tooltip과 일치 |

정리하면, 이 프로젝트에서 "Popover"라는 이름의 컴포넌트는 실제로는 클릭 등으로 열고 닫는 화면 중앙 확인/경고 모달(alert dialog)이고, 마우스 호버로 여닫히는 일반적 의미의 "popover" 상호작용은 이 컴포넌트가 아니라 `Tooltip`이 담당한다(자세한 내용은 `tooltip.md` 참고).

⚠️ 별도로 확인된 사실: 이 프로젝트에는 트리거 근처에 앵커링되는 "진짜" popover 패턴이 실제로 존재하지만, 그것은 `components/ui/popover`가 아니라 `@radix-ui/react-popover`(Radix의 진짜 Popover 프리미티브)를 각 컴포넌트가 직접 import해서 개별 구현한 것이다. `grep -rn "react-popover" components/` 기준 사용처: `components/ui/select/select.tsx`, `components/ui/date-select/date-select.tsx`, `components/ui/range-select/range-select.tsx`, `components/ui/persona-action-menu/persona-action-menu.tsx`, `components/ui/gnb/gnb.tsx`(알림 드롭다운), `components/ui/noti-dropdown/noti-dropdown.tsx`. 즉 이 코드베이스에는 "Popover"라는 이름의 공용 컴포넌트가 1개 있지만 그것은 Alert Dialog 역할이고, 실제 앵커형 팝오버 UI는 컴포넌트별로 각자 Radix 원시 프리미티브를 재구현하는 컨벤션을 따른다 — 공용 래퍼가 없다(신규 화면 설계 시 조합 가이드 참고).

## When to use

- 화면 중앙에서 사용자의 확인/취소 응답을 반드시 받아야 하는 상황(예: 다른 페이지로 이동하기 전 확인, 위험한 동작 전 경고).
- 실사용 예(스토리 기준): "Content Studio로 이동하시겠습니까?" 같은 페이지 이탈 확인.

## When not to use

⚠️ 확인 필요 — Figma/코드 어디에도 "이런 경우엔 쓰지 말 것"이 명시돼 있지 않음. 다만 위 "Popover vs Tooltip" 구분에 따라, 트리거 근처에 붙어야 하거나 hover로 여닫혀야 하는 보조 정보 표시는 이 컴포넌트가 아니라 `Tooltip`을 써야 하고, 트리거에 앵커링된 드롭다운/캘린더류는 `@radix-ui/react-popover`를 직접 쓰는 기존 컨벤션(select/date-select/range-select 등)을 따라야 한다.

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
- **`.dark` 강제 스코프**: 코드 주석에 따르면 이 컴포넌트가 참조하는 시맨틱 토큰(`--background-default`, `--text-default`, `--background-bold`, `--text-invert`, `--border-default` 등)이 항상 다크모드 값으로 렌더링됨을 스크린샷으로 확인했고, `Chatbox`/`FloatingMenu`/`GNB`/`DateSelect`/`RangeSelect`/`PersonaActionMenu`/`NotiDropdown`과 동일한 패턴(항상 다크)이라고 명시돼 있다. `get_design_context`가 반환하는 인라인 fallback 리터럴(예: `--background-default,white`, `--border-subtle,#f5f5f5`)은 **라이트값처럼 보이지만 실제 렌더링과 다르다** — `get_variable_defs`로 직접 조회하면 `--background-default: #0a0a0a`, `--text-default: #fafafa`, `--border-default: #404040`, `--background-bold: #e5e5e5`, `--text-invert: #171717` 등 다크모드 값이 확인된다.
- `Overlay`: `bg-[var(--background-backdrop)] backdrop-blur-[var(--backdrop-blur-md)]`로 배경을 블러 처리.
- `Content`: 정중앙 고정(`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`), 너비 `var(--scale-512)`(512px), `rounded-[var(--radius-scale-lg)]`, `p-[var(--spacing-6)]`, `shadow-[var(--shadow-lg)]`. 내부는 세로 2단 구성:
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

Figma `Type` 프로퍼티는 `notification`/`warning` 2종(`get_metadata`로 확인한 두 심볼: `Type=notification` node `7269:377`, `Type=warning` node `7269:452`). `get_design_context`/`get_variable_defs` 실측 결과:

| type                                | 아이콘 색        | Title 색         | Border 색          | 체크박스 행                                                                                                                                  |
| ----------------------------------- | ---------------- | ---------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `notification`(기본 성격의 variant) | `--icon-default` | `--text-default` | `--border-subtle`  | Figma에 `checkbox` 인스턴스가 존재(단, 실측 시 `hidden="true"`로 숨겨진 상태) — 코드에서 `checkbox` prop 전달 시에만 노출                    |
| `warning`                           | `--icon-error`   | `--text-error`   | `--border-warning` | Figma 레이어 트리에 체크박스 인스턴스 자체가 없음(`get_metadata` 확인) — 코드도 `type === "notification"`일 때만 행을 렌더링하도록 이중 방어 |

Description 텍스트(`--text-subtle`)와 Cancel/Confirm 버튼 색은 두 variant 간 차이 없음(둘 다 동일하게 `Button` outline/primary 재사용).

## States and behaviors

- **열림/닫힘**: 완전 제어형 — `open`이 `true`일 때만 렌더링되며, 트리거 자체는 컴포넌트 밖에서 관리한다(`children`을 받지 않음).
- **Cancel**: `AlertDialogPrimitive.Cancel`이 자동으로 다이얼로그를 닫고(`onOpenChange(false)`), 추가로 `onCancel` 콜백을 호출한다(테스트 `popover.test.tsx`로 확인).
- **Confirm**: `AlertDialogPrimitive.Action`도 동일하게 자동으로 닫힌 뒤 `onConfirm` 콜백을 호출한다.
- **Escape 키**: Radix AlertDialog 기본 동작으로 `onOpenChange(false)`가 호출되며 닫힌다(테스트로 확인).
- **체크박스 행 노출 조건**: `type === "notification" && checkbox !== undefined`일 때만 렌더링. `checkbox={false}`를 명시적으로 전달해야 렌더링되며, prop 자체를 생략하면(=`undefined`) 행이 아예 나타나지 않는다 — "값이 false"와 "행을 안 보여줌"을 구분하는 설계.
- **collision/포지셔닝 로직 없음**: Tooltip과 달리 화면 정중앙 고정이라 `collisionPadding`류의 방어 로직이 존재하지 않는다(뷰포트 경계 충돌 개념 자체가 없음).

## 다른 범용 컴포넌트와의 조합 가이드

`grep -rn "from '@/components/ui/popover'" app/ components/` 기준 — **현재 이 컴포넌트를 가져다 쓰는 곳은 컴포넌트 자신의 스토리/테스트뿐이고, 앱/다른 컴포넌트에서의 실사용처는 없다**. 대신 컴포넌트 **내부**에서 다른 범용 컴포넌트를 조합하는 패턴이 확인된다:

- **Button 조합**: Cancel/Confirm 두 액션 모두 `AlertDialogPrimitive.Cancel`/`Action`을 `asChild`로 감싸 기존 `Button`(`variant="outline"`/`variant="primary"`, 각각 `flex-1`로 동일 너비)을 그대로 재사용한다(`button.md`의 "폼/다이얼로그의 확인·취소 액션" 사용처로도 기록돼 있음).
- **Checkbox 조합**: `type="notification"`이고 `checkbox` prop이 전달된 경우에만 `Checkbox`(`variant="muted"`)를 설명 텍스트와 액션 버튼 사이에 배치한다(`checkbox.md`에도 이 조합이 코드베이스 내 유일한 실사용처로 기록돼 있음). `.dark` 강제 스코프 안에서 렌더링되므로 무테마 상태에서도 항상 다크 톤으로 보인다.
- **신규 화면 설계 시 주의**: 트리거에 앵커링되는 실제 "popover" UI(드롭다운, 캘린더, 액션 메뉴 등)가 필요하면 이 `Popover` 컴포넌트를 재사용하지 말 것 — 위 Overview에서 확인했듯 이 컴포넌트는 화면 중앙 확인 모달 전용이다. 대신 이 코드베이스의 기존 컨벤션대로 `@radix-ui/react-popover`를 직접 사용한 기존 구현체(`Select`, `DateSelect`, `RangeSelect`, `PersonaActionMenu`, `GNB`의 알림 드롭다운, `NotiDropdown`)의 패턴을 참고해 개별 구현하거나, 호버 기반 보조 정보라면 `Tooltip`을 사용한다.

## ⚠️ 확인 필요

- **"When not to use" 근거 부족**: Figma/코드 어디에도 "이럴 땐 쓰지 마라"는 명시가 없음. `Tooltip`/원시 `@radix-ui/react-popover` 사용처와의 역할 구분으로 대체 기술함.
- **실사용처 전무**: 현재 앱/다른 컴포넌트 코드에서 이 `Popover`(Alert dialog) 컴포넌트를 가져다 쓰는 곳이 스토리/테스트 외에는 없다(grep 기준). 향후 실제 화면에 적용되면 조합 패턴이 늘어날 수 있으니 재조회 필요.
- **`leadingIcon` 기본값(`circle-dashed-icon`)이 Figma 원본 의도인지 placeholder인지**: 코드 주석과 prop 설명 모두 "Figma placeholder"라고 표기돼 있고, 실측 스크린샷에서도 `lucide/circle-dashed` 아이콘이 그대로 쓰였다 — 다만 이 아이콘이 실제 프로덕션에서도 기본값으로 쓰일 의도인지, 단순히 목업 단계의 자리표시자인지는 Figma 쪽에 별도 설명이 없어 확정하지 못했다.
- **warning에서 `checkbox` prop을 전달했을 때 항상 무시되는 것이 Figma 의도인지**: Figma `warning` variant 레이어에 체크박스 인스턴스 자체가 없다는 사실은 확인했으나(`get_metadata`), 이것이 "warning에는 절대 체크박스 옵션을 허용하지 않는다"는 디자인 의도인지 단순히 아직 그 조합이 목업되지 않은 것인지는 Figma 설명이 없어 확정할 수 없다.
