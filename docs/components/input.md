# Input

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=5084-3716) — `Input` (node-id `5084:3716`)
코드: `components/ui/input/input.tsx`

## Overview

Textfield / Upload / Select / Link 네 개의 입력 행을 boolean으로 켜고 끄는 **복합 블록**이다. 필요한 슬롯만 골라 쓰는 용도로 설계되어 있다.

단일 라인 입력 박스 하나가 필요하면 이 컴포넌트가 아니라 base인 [Part/Input](./part-input.md)(`components/ui/part-input`)을 쓴다.

Figma 컴포넌트 설명(description) 필드 원문:

> A labelled single-line text field — a label above and the input box (Part/Input) below. Use Input search for a search query, Input time for a time value, and Input phone for a number with a country code.

## When to use

- 폼의 여러 입력 행을 한 블록으로 묶어 보여줄 때, 그중 필요한 행만 켜서 쓸 때.
- 네 행의 치수·보더·포커스 링이 서로 같아야 할 때 — 각 행이 base `PartInput`/`Select` 인스턴스라 자동으로 일치한다.

## When not to use

- 입력 박스 하나만 필요한 경우 → `PartInput`.
- 파일 업로드만 필요한 경우 → 이 컴포넌트에서 `showTextfield`/`showSelect`/`showLink`를 끄거나, 직접 `PartInput`을 조합.

## How to use

```tsx
import { Input } from "@/components/ui/input";

// 네 슬롯 전부 (Figma 기본값)
<Input
  label="File Upload"
  selectOptions={MBTI_OPTIONS}
  onFileChange={(file) => setFile(file)}
/>

// Upload 행만
<Input
  showTextfield={false}
  showSelect={false}
  showLink={false}
  onFileChange={(file) => setFile(file)}
/>
```

## Structure

렌더 순서는 고정이고 행 사이 간격은 `--gb-spacing-3`(12px)이다.

```
Title            text-sm-semi-bold, --gb-text-default        ← label
Textfield 행      PartInput (아이콘 없음)                      ← showTextfield
Upload 행         <label> + sr-only <input type="file">       ← showUpload
Select 행         Select (variant="primary")                  ← showSelect
Link 행           PartInput (trailingIcon + lucide Globe)     ← showLink
Description      text-xs-medium, --gb-text-subtle            ← description
```

Figma에서는 네 행이 모두 공유 컴포넌트 인스턴스다 — Textfield/Upload/Link는 `Part/Input`, Select는 `select`(`614:2466`). 코드도 Textfield·Link·Select는 공용 컴포넌트를 그대로 재사용하고, **Upload 행만** 네이티브 `<input type="file">`이 controlled `value`를 지원하지 않아 `<label>` + `sr-only` 조합으로 따로 구현한다.

## Props

| Prop                                                                          | 타입      | 기본값                               | 설명                                                 |
| ----------------------------------------------------------------------------- | --------- | ------------------------------------ | ---------------------------------------------------- |
| `label`                                                                       | `string`  | `"File Upload"`                      | 블록 상단 제목. 빈 문자열이면 숨김                   |
| `description`                                                                 | `string`  | Figma 예시 문구                      | 블록 하단 도움말. 빈 문자열이면 숨김                 |
| `showTextfield`                                                               | `boolean` | `true`                               | Textfield 행 표시                                    |
| `textfieldValue` / `onTextfieldValueChange` / `textfieldPlaceholder`          | —         | placeholder `"Email or Username"`    | Textfield 행 제어                                    |
| `showUpload`                                                                  | `boolean` | `true`                               | Upload 행 표시                                       |
| `file` / `onFileChange` / `uploadPlaceholder` / `accept`                      | —         | placeholder `"File upload"`          | Upload 행 제어                                       |
| `showSelect`                                                                  | `boolean` | `true`                               | Select 행 표시. `selectOptions`가 비면 렌더하지 않음 |
| `selectOptions` / `selectValue` / `onSelectValueChange` / `selectPlaceholder` | —         | placeholder `"MBTI"`                 | Select 행 제어                                       |
| `showLink`                                                                    | `boolean` | `true`                               | Link 행 표시                                         |
| `linkValue` / `onLinkValueChange` / `linkPlaceholder`                         | —         | placeholder `"https://gabrielle.ai"` | Link 행 제어                                         |
| `className`                                                                   | `string`  | —                                    | 최상위 wrapper에 병합                                |

슬롯 boolean 네 개의 기본값이 모두 `true`인 것은 Figma 컴포넌트 프로퍼티 기본값과 같다.

## Variants

축은 `Status` 하나이고 값은 `default` / `active` / `filled` 3개(완전 조합)다. `disabled`와 `error`는 없다.

세 값 모두 React prop이 아니다 — `active`는 행별 `:focus-within`, `filled`는 각 행의 값 유무로 자동 처리된다.

Figma `Status=active`는 네 행이 **동시에** 포커스 링을 달고 있는데, 실제로 네 곳이 동시에 포커스될 수는 없으므로 "active 모양을 한 번에 보여주는 목업"으로 읽고 코드는 행별로 동작하게 구현했다.

## States and behaviors

행별 trailing 아이콘:

| 행        | 아이콘                                      | 빈 값              | 값 있음             |
| --------- | ------------------------------------------- | ------------------ | ------------------- |
| Textfield | 없음                                        | —                  | —                   |
| Upload    | `lucide/plus`                               | `--gb-icon-subtle` | `--gb-icon-default` |
| Select    | `lucide/chevron-down` (열리면 `chevron-up`) | `--gb-icon-subtle` | `--gb-icon-default` |
| Link      | `lucide/globe`                              | `--gb-icon-subtle` | `--gb-icon-default` |

아이콘은 세 Status 전부에서 표시되고 **값 유무로 색만 바뀐다** — base `Part/Input`과 같은 규칙이다.

행 공통: `h-[36px]`, `px-[var(--gb-spacing-3)]`, `rounded-[var(--gb-radius-scale-md)]`, `border-[length:var(--gb-border-1)]`. 포커스 시 보더 `--ring` + `shadow-[var(--gb-shadow-focus-ring)]`.

## 다른 범용 컴포넌트와의 조합 가이드

- **PartInput** (`components/ui/part-input`): Textfield·Link 행의 실체. Link 행은 `trailingIcon` + `icon={Globe}`로 쓴다.
- **Select** (`components/ui/select`): Select 행의 실체. `variant="primary"`가 Figma 트리거 스펙과 일치하고, 드롭다운 패널(210px / offset 8px / 항목 32px / `shadow-md`)도 이미 맞게 구현되어 있다.

현재 `components/ui/` 바깥에서 이 컴포넌트를 쓰는 화면은 없다.

## 네 행 모두 Figma에서 Part/Input 또는 select 인스턴스다

Figma도 Upload 행을 별도 디자인이 아니라 `Part/Input` 인스턴스로 두고 있고, `Status=active`에서 세 `Part/Input` 행의 placeholder가 **전부 숨겨진다**(Upload 행 포함).

코드에서 Upload 행만 `<label>` + 숨은 `<input type="file">`로 따로 구현한 것은 네이티브 file input이 controlled value를 지원하지 않기 때문이다. placeholder 숨김은 `group-has-[:focus]:opacity-0`로 같은 동작을 재현하며, 파일이 선택된 뒤의 파일명은 숨기지 않는다 — `PartInput`의 `focus:placeholder:opacity-0`이 placeholder만 숨기고 입력값은 남기는 것과 같은 규칙이다.

## ⚠️ 확인 필요

없음.
