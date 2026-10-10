# Chatbox

> Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-5418) · node-id `7219:5418`
> 코드: `components/ui/chatbox/chatbox.tsx`

## Overview

프롬프트 입력용 Atom 컴포넌트. 한 줄 높이로 시작하는 `<textarea>` 위에 **자유 슬롯**이 있고, 아래에 첨부(+)·전송(sparkles) 두 개의 아이콘 버튼 행이 놓인다. Figma 루트 자식 세 개(`-> Slot` → 텍스트 → `Wrapper`)와 1:1로 대응한다.

항상 다크로 렌더링된다 — 루트에 `dark` 클래스를 강제해 하위 시맨틱 토큰이 사이트 테마와 무관하게 다크 값으로 resolve된다.

**책임 경계**: 아톰은 "파일을 고르는 것"까지만 담당한다. 첨부 버튼을 누르면 네이티브 파일 선택 다이얼로그가 열리고, 고른 `File` 객체를 `onAttachFiles`로 올려보내는 데서 끝난다. 고른 파일을 **어떤 모습으로 보여줄지**(썸네일, 파일 칩, 텍스트 미리보기 등)는 슬롯에 콘텐츠를 넣는 쪽의 몫이다. 이미지 썸네일·필터 chips·sentence option 행을 묶어둔 조합 구현은 `components/app/chatbox-composer/`에 있다.

Figma 컴포넌트 설명(description) 필드 원문:

> The message composer for a chat interface — a growing text area with a file-attach button and a send button. The area above the text input is an empty slot that hugs whatever is placed in it: attachment thumbnails, suggestion chips, or option rows.

## When to use

- 사용자가 자유 텍스트를 입력하고 전송하는 프롬프트 영역이 필요할 때.
- 입력 영역 위에 무언가를 띄워야 할 때 — 첨부 미리보기, 필터 chips, 선택지 목록 등. `children`이 그 자리다.
- 파일 참조가 필요할 때. `accept`/`multiple`로 받을 형식을 제한하고 `onAttachFiles`로 결과를 받는다.

## When not to use

- **단순 한 줄 텍스트 입력**에는 쓰지 않는다 — `Input`/`InputTime` 계열을 쓴다. Chatbox는 첨부·전송 버튼 행과 슬롯을 항상 포함하는 구조다.
- **여러 줄 텍스트 입력 자체**가 목적이라면 `Textarea`를 쓴다. Chatbox의 textarea는 `rows={1}` + `resize-none`으로 프롬프트 한 줄 입력에 맞춰져 있다.
- **슬롯 콘텐츠까지 함께 필요하면** 아톰을 직접 조합하기 전에 `components/app/chatbox-composer/`를 먼저 검토한다.

## How to use

`chatbox.stories.tsx` 기준:

```tsx
// 기본 — 슬롯 없음
<Chatbox onSend={handleSend} />

// 제어 컴포넌트
<Chatbox value={prompt} onValueChange={setPrompt} onSend={handleSend} />

// 이미지만 받는 첨부 버튼
<Chatbox
  accept="image/*"
  multiple
  onAttachFiles={(files) => setAttachments((prev) => [...prev, ...files])}
/>

// 슬롯에 콘텐츠 주입
<Chatbox onSend={handleSend}>
  <AttachmentPreview items={attachments} />
</Chatbox>
```

슬롯 콘텐츠가 포함된 조합은 `ChatboxComposer`를 쓴다:

```tsx
import { ChatboxComposer } from "@/components/app/chatbox-composer";

<ChatboxComposer variant="chip" onChipChange={setFilter} onSend={handleSend} />;
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성:

- `chatbox.tsx` — 컴포넌트 구현
- `chatbox.stories.tsx` — Storybook CSF3 스토리
- `chatbox.test.tsx` — Vitest + Testing Library 테스트
- `index.ts` — `Chatbox`, `ChatboxProps` named export

내부 DOM 구조 — Figma 루트 자식과 동일하게 세 블록이 **한 레벨에 평평하게** 놓여 gap 하나를 공유한다:

```
<div class="dark">                        루트 (radius 2xl, 보더, 배경, gap 28)
  {children}                              Figma `-> Slot`
  <label class="sr-only">                 textarea 접근성 이름
  <textarea rows={1}>                     Figma 텍스트
  <div>                                   Figma `Wrapper`
    <input type="file" class="sr-only">    첨부 버튼이 트리거하는 숨은 입력
    <Button variant="icon" icon="plus-icon">
    <Button variant="icon" icon="sparkles-icon">
```

- 슬롯·루트 모두 **높이 제약이 없다.** Figma에서 `-> Slot`과 루트가 가로세로 hug로 설정돼 있어, 슬롯에 들어오는 내용에 따라 루트가 함께 늘어난다. Figma 측정값 112px(루트)·28px(슬롯)은 **스펙이 아니라 현재 상태의 측정값**이다 — 슬롯이 비어 있고 숨겨진 상태의 크기이므로 코드에 리터럴로 박지 않는다.
- 숨은 `<input type="file">`은 `sr-only` + `tabIndex={-1}`로 포커스 순서에서 빠지고, 첨부 버튼의 `onClick`이 `ref.current.click()`으로 트리거한다.
- 전송 버튼은 `onSend` 호출 후 비제어 모드일 때 값을 비운다. 제어 모드에서는 `onValueChange("")`만 호출하므로 비우는 책임은 부모에게 있다.

## Props

| Prop            | 타입                      | 기본값                       | 설명                                                                     |
| --------------- | ------------------------- | ---------------------------- | ------------------------------------------------------------------------ |
| `value`         | `string`                  | —                            | 제어 컴포넌트로 쓸 때의 값                                               |
| `defaultValue`  | `string`                  | `""`                         | 비제어 컴포넌트 초기값                                                   |
| `onValueChange` | `(value: string) => void` | —                            | 값이 바뀔 때 호출. 전송 직후 `""`로도 한 번 호출됨                       |
| `onAttachFiles` | `(files: File[]) => void` | —                            | 첨부 버튼으로 파일을 고르면 호출                                         |
| `accept`        | `string`                  | —                            | 첨부 버튼이 받을 파일 형식 (네이티브 input의 `accept`). 기본은 제한 없음 |
| `multiple`      | `boolean`                 | `false`                      | 여러 파일을 한 번에 고를 수 있게 함                                      |
| `onSend`        | `() => void`              | —                            | 전송 버튼 클릭 시 호출                                                   |
| `disabled`      | `boolean`                 | `false`                      | 비활성화 (Figma `Status=disabled`)                                       |
| `placeholder`   | `string`                  | `"Please share your ideas."` | textarea placeholder. `sr-only` 라벨 텍스트로도 재사용됨                 |
| `children`      | `React.ReactNode`         | —                            | 텍스트 입력 영역 위 슬롯 (Figma `-> Slot`)                               |
| `className`     | `string`                  | —                            | 루트 `<div>`에 병합                                                      |

그 외 `React.TextareaHTMLAttributes<HTMLTextAreaElement>`를 `value`/`defaultValue`/`onChange`/`children` 제외하고 상속 — 나머지는 내부 `<textarea>`로 전달된다.

## Variants

Figma 컴포넌트 세트의 축은 **`Status` 하나뿐**이다(`default` / `active` / `disabled` / `filled`, 변형 4개). 그래서 코드에도 variant prop이 없다. 네 상태 모두 별도 prop이 아니라 상태에서 파생된다:

| Figma `Status` | 코드에서 도달하는 방법                    |
| -------------- | ----------------------------------------- |
| `default`      | 값 없음, 포커스 없음                      |
| `active`       | `hover:` 또는 `focus-within:` (아래 참고) |
| `filled`       | `value`/`defaultValue`에 값이 있을 때     |
| `disabled`     | `disabled` prop                           |

토큰(값이 아닌 이름만, `chatbox.tsx` 기준):

| 대상                      | 토큰                                                          |
| ------------------------- | ------------------------------------------------------------- |
| 루트 배경 / 보더          | `--gb-background-default` / `--gb-border-default` (1px)       |
| 루트 radius / 패딩 / gap  | `--gb-radius-scale-2xl` / `--gb-spacing-4` / `--gb-spacing-7` |
| active 보더 / 포커스 링   | `--gb-border-static-gray` / `--gb-shadow-focus-ring`          |
| 입력 텍스트 / placeholder | `--gb-text-default` / `--gb-text-subtle`                      |
| disabled placeholder      | `--gb-text-static-gray`                                       |
| 타이포그래피              | `text-xs-regular` (Figma `Text-xs/Regular`)                   |

루트 최대폭 `max-w-[700px]`는 Figma 예시 프레임 폭이고, 매칭 토큰이 없어 고정값으로 둔다(Slider 435px 선례). 실제 폭은 `w-full`로 반응형이다. 버튼 행(`Wrapper`)에는 radius·그림자·배경·보더가 없다 — Figma도 동일하다.

## States and behaviors

- **disabled는 토큰 교체로만 표현한다.** 루트에 opacity를 걸지 않는다 — Figma `Status=disabled`의 루트 배경·보더가 `default`와 완전히 동일하기 때문이다. 흐려 보이는 건 placeholder가 `--gb-text-static-gray`로, 두 버튼이 Button의 `disabled` 스타일로 교체된 결과다. `chatbox.test.tsx`의 `"does not dim the root with opacity when disabled"`로 고정했다.
- **버튼의 disabled 스타일은 Button이 소유한다.** Chatbox는 `disabled` prop만 내려보내고 색을 덮어쓰지 않는다 — `button.tsx`의 `icon` variant가 이미 Figma와 같은 토큰(`--gb-border-overlay` / `--gb-background-disabled` / `--gb-icon-static-gray`)을 적용한다.
- **disabled 시 hover 변화 없음**: 루트에 `pointer-events-none`이 붙어 hover/focus-within 분기가 아예 발동하지 않는다.
- **`active`는 hover와 focus-within 양쪽에 매핑했다.** Figma `Status` 축에는 `hover` 값이 없고 `active`만 있어서, 마우스 오버와 내부 textarea 포커스 모두 같은 스타일(보더 `--gb-border-static-gray` + 포커스 링)을 보여준다. 이 매핑은 코드 측 해석이다.
- **placeholder는 포커스 시 사라지지 않는다.** Figma `Status=active`에도 placeholder가 그대로 보인다.
- **제어/비제어**: `value`가 `undefined`면 내부 `useState(defaultValue)`로 비제어 동작, 값이 있으면 완전 제어. 전송 시 비제어 모드에서만 내부 값이 비워진다.
- **첨부 input은 매번 초기화된다.** `handleFilesSelected`가 끝에 `event.target.value = ""`를 넣어, 같은 파일을 연속으로 두 번 고를 때도 `change` 이벤트가 발생한다.

## 다른 범용 컴포넌트와의 조합 가이드

- **Button** (`variant="icon"`): 첨부·전송 버튼. Chatbox는 `disabled`만 전달하고 스타일은 Button에 맡긴다.
- **ChatboxComposer** (`components/app/chatbox-composer/`): 슬롯에 들어가는 콘텐츠 세 가지를 묶은 조합 — 이미지 썸네일 행(+ 삭제 배지), 필터 chips 행(`Chips` 재사용), sentence option 행. `variant` prop(`default`/`image`/`chip`/`sentence-option`)으로 고른다. 아톰의 `onAttachFiles`를 받아 blob URL로 썸네일을 만들고, 제거 시 `URL.revokeObjectURL`로 정리한다.

`components/ui/chatbox/` 바깥에서 아톰을 직접 렌더링하는 화면은 아직 없다.

## 슬롯의 폭과 정렬

Figma 슬롯은 `layoutAlign: STRETCH`(루트 폭을 꽉 채움) + 내용물 `MIN`(왼쪽 정렬)이고, 루트도 `MIN`이다. 코드는 루트에 `items-start`를 주고 폭은 **슬롯 소유자에게 맡긴다** — 소비처가 `w-full`을 주면 `width: 100%`가 컨테이너 폭에 해석되어 Figma의 STRETCH와 같은 결과가 된다(`ChatboxComposer`의 sentence option 행이 이 방식). 폭을 채울 필요가 없는 chips 행은 hug로 두고 왼쪽 정렬만 따른다.

## 슬롯 내용의 치수는 아톰의 대조 대상이 아니다

Figma `-> Slot`이 비어 있는 것은 미완성이 아니라 확정된 설계다 — description이 "들어오는 무엇이든 hug하는 빈 슬롯"이라고 명시하고, 아톰은 폭·정렬·hug 규칙만 책임진다. 슬롯 안에 들어가는 썸네일 크기·행 높이·배지 오프셋 같은 값은 슬롯을 채우는 쪽(앱 컴포넌트)이 자기 Figma 프레임을 기준으로 정하고, 그 근거도 그쪽에 기록한다.

## ⚠️ 확인 필요

없음.
