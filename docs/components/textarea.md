# Textarea

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=623-3651) · node-id `623:3651`
코드: `components/ui/textarea/textarea.tsx`

## Overview

라벨 + 여러 줄 입력 박스 + (선택적) 글자 수 카운터를 세로로 쌓는 Atom 컴포넌트. 네이티브 `<textarea>` 하나를 감싸고, `maxLength`를 주면 하단에 남은 글자 수가 자동으로 붙는다.

Figma 컴포넌트 설명(description) 필드 원문:

> A labelled multi-line text field that can show a character counter when a maximum length is set. Use Input for a single line, and Chatbox for a chat message composer.

## When to use

- 여러 줄 자유 텍스트를 받아야 할 때. 한 줄이면 [Input](./input.md), 채팅 입력이면 [Chatbox](./chatbox.md)다.
- 입력 길이에 상한이 있고 남은 글자 수를 보여줘야 할 때 — `maxLength`만 주면 카운터가 따라온다.

## When not to use

Figma description이 두 대안을 명시한다.

- **한 줄 입력** → [Input](./input.md).
- **채팅 메시지 작성기** → [Chatbox](./chatbox.md). Chatbox는 첨부·전송 버튼 행과 슬롯을 함께 갖는다.

## How to use

```tsx
// 기본
<Textarea label="What are you into?" placeholder="Tell me about your interests." />

// 글자 수 카운터 (maxLength를 줄 때만 렌더링됨)
<Textarea label="What are you into?" maxLength={1000} />

// 제어 컴포넌트
<Textarea label="소개" value={bio} onValueChange={setBio} maxLength={300} />
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `textarea.tsx` / `textarea.stories.tsx` / `textarea.test.tsx` / `index.ts`.

```
<div>                                 루트, flex-col, gap 12px
  <label htmlFor>                     label이 있을 때만
  <div className="relative">          리사이즈 핸들을 띄우기 위한 포지셔닝 래퍼
    <textarea resize-none>            입력 박스
    <span data-slot="textarea-resize-handle">   우하단 7px 커스텀 그립
  <span data-slot="textarea-counter"> maxLength가 있을 때만
```

- 입력 박스 패딩은 **좌 12 / 상·우·하 8**로 비대칭이다 — 우측이 좁은 것은 리사이즈 그립 자리를 비워두기 위한 Figma 확정값이다.
- 높이는 `min-h-[80px]`로만 두고 고정하지 않는다. Figma의 80px은 최소 높이이고, 드래그로 늘릴 수 있다.

## Props

`TextareaProps`는 `React.TextareaHTMLAttributes<HTMLTextAreaElement>`에서 `value`/`defaultValue`/`onChange`/`disabled`를 제외(Omit)하고 아래를 추가한 형태다.

| Prop            | 타입                      | 기본값 | 설명                                                                 |
| --------------- | ------------------------- | ------ | -------------------------------------------------------------------- |
| `label`         | `string`                  | —      | 필드 위 라벨. 생략하면 라벨을 렌더링하지 않는다                     |
| `value`         | `string`                  | —      | 제어 컴포넌트로 쓸 때의 값                                          |
| `defaultValue`  | `string`                  | `""`   | 비제어 컴포넌트 초기값                                              |
| `onValueChange` | `(value: string) => void` | —      | 값이 바뀔 때 호출                                                   |
| `maxLength`     | `number`                  | —      | 최대 글자 수. 지정하면 하단에 `{남은 수} characters left` 카운터 표시 |
| `className`     | `string`                  | —      | 루트 `<div>`에 병합                                                 |

`disabled`는 의도적으로 Omit한다 — Figma에 disabled 상태 자체가 없어, 네이티브 속성이 `...props`로 새어나가는 것도 차단한다.

## Variants

cva 기반 `variant` prop이 없다. Figma의 축은 `Status` 하나이고 값은 `default`/`active`/`filled` 셋인데, 셋 다 prop이 아니라 CSS·값 유무로 처리된다.

| Figma `Status` | 트리거                 | 코드                                                     |
| -------------- | ---------------------- | -------------------------------------------------------- |
| `default`      | 값 없음, 비포커스      | 네이티브 `::placeholder` → `--muted-foreground`(=`--text-subtle`) |
| `filled`       | 값 있음                | 일반 텍스트 색 `--foreground`(=`--text-default`)          |
| `active`       | 포커스                 | `focus-visible:border-[var(--ring)]` + `--gb-shadow-focus-ring` |

## States and behaviors

| 항목        | 값                                                                       |
| ----------- | ------------------------------------------------------------------------ |
| 라벨        | `text-sm-medium`, `--foreground`                                         |
| 본문        | `text-sm-regular`                                                        |
| placeholder | `--muted-foreground`                                                     |
| 카운터      | `text-xs-regular`, `--muted-foreground`                                  |
| 보더        | `--border` 1px, 포커스 시 `--ring`                                       |
| radius      | `--gb-radius-scale-md`                                                   |
| 배경        | `--background`                                                           |

- **리사이즈**: 네이티브 그립(`resize-y`)이 아니라 Figma의 `handle-icon`(7px)을 직접 그린다. 네이티브 그립은 모양을 바꿀 수 없어 Figma와 달라지기 때문이다. 포인터 드래그로 높이를 조절하며 `80px` 아래로는 줄어들지 않는다(`textarea.test.tsx`의 `"grows the textarea when the handle is dragged down"`).
- **카운터**: `maxLength - 현재 길이`를 매 입력마다 다시 계산한다. `maxLength`가 없으면 카운터 요소 자체가 렌더링되지 않는다.

## 다른 범용 컴포넌트와의 조합 가이드

`components/ui/textarea/` 바깥의 실사용처는 아직 없다. 조합이 생기면 이 절에 기록한다.
