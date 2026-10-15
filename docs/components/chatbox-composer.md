# ChatboxComposer

- 코드: `components/app/chatbox-composer/chatbox-composer.tsx` (`chatbox-composer.stories.tsx`, `chatbox-composer.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8158-31088) `Chatbox slot` node `8158:31088`

## Overview

`Chatbox`(`components/ui/chatbox`)의 `children` 슬롯(Figma `-> Slot`)에 들어가는 콘텐츠 3종을 묶은 조합 컴포넌트 — 이미지 썸네일 행, 필터 chips 행, sentence option 행. `Chatbox` 쪽이 슬롯이 `true`일 때 보여주는 실제 내용이 이 컴포넌트다.

## When to use

- 프롬프트 입력창 위에 첨부 이미지 미리보기, 필터 chips, 선택지 목록 중 하나를 보여줘야 할 때.

## When not to use

- 슬롯 콘텐츠 없이 `Chatbox` 단독으로 쓸 거라면 `components/ui/chatbox`를 직접 쓴다.

## How to use

```tsx
<ChatboxComposer onSend={handleSend} />
<ChatboxComposer images={images} onRemoveImage={handleRemove} onSend={handleSend} />
<ChatboxComposer variant="chip" selectedChip={filter} onChipChange={setFilter} />
<ChatboxComposer variant="sentence-option" selectedSentenceOption={i} onSentenceOptionChange={setI} />
```

## Props

| Prop                           | 타입                                    | 기본값 | 설명                                                        |
| ------------------------------ | --------------------------------------- | ------ | ----------------------------------------------------------- |
| `variant`                      | `"default" \| "image" \| "chip" \| "sentence-option"` | `"default"` | 슬롯에 보여줄 콘텐츠 종류 |
| `images` / `defaultImages`     | `{ src: string; alt?: string }[]`       | -      | 제어/비제어 첨부 이미지 목록. 있으면 `variant`와 무관하게 썸네일 행이 보임 |
| `onRemoveImage`                | `(index: number) => void`               | -      | 이미지 삭제 배지 클릭 시 호출                                |
| `onAttach`                     | `() => void`                            | -      | 첨부 버튼 클릭 시 호출                                       |
| `selectedChip` / `defaultSelectedChip` / `onChipChange` | `number`           | `0`    | `variant="chip"` 전용                                        |
| `selectedSentenceOption` / `defaultSelectedSentenceOption` / `onSentenceOptionChange` | `number \| null` | `null`(선택 없음) | `variant="sentence-option"` 전용 |

그 외 `Chatbox`의 props(`value`/`onValueChange`/`disabled`/`onSend` 등, `children`/`onAttachFiles`/`accept`/`multiple` 제외)를 그대로 상속.

## Structure

- 이미지 행: 81px 정사각 썸네일(`object-cover`) + 우상단 삭제 배지(`-top-1.5 -right-1.5`, 항상 라이트 고정 — Chatbox 전체가 다크여도 이 배지만 예외).
- chips 행: `Chips`(`variant="secondary"`) 재사용. 라벨 `All`/`Image`/`Text`, 선택 상태는 `selected`로 토글. 삭제(X) 배지는 없다 — 필터 선택용이라 지울 수 있는 대상이 아니다.
- sentence option 행: `Chips`가 아닌 전용 `<button>` — 가로 꽉 채움(`h-[36px] w-full`), 라벨 가운데 정렬(아이콘 없음), 선택 시 `bg-mute`+`text-static-white`. 초기 상태는 아무 행도 선택되지 않는다(`null`).
- 첨부 파일은 `Chatbox`의 `onAttachFiles`를 받아 blob URL로 썸네일을 만들고, 제거 시 `URL.revokeObjectURL`로 정리한다(비제어 모드에서만 자동 관리).

## States and behaviors

- **variant와 images는 독립이다**: `images`가 있으면 `variant`가 `"chip"`/`"sentence-option"`이어도 이미지 행이 함께 보인다(둘 다 `showImages`/`showChips`/`showSentenceOptions`로 개별 토글). Figma의 `Type=image` variant는 이미지 3장이 고정 콘텐츠로 박힌 정적 예시라, Storybook Playground는 `images`/`defaultImages`를 따로 지정하지 않으면 `variant="image"` 선택 시 샘플 썸네일 3장을 보여준다(스토리 전용 데모 로직, 컴포넌트 자체 동작은 아님).
- **sentence option 선택 강조는 Figma 전용 디자인이 없다.** Figma `Type=options`의 3개 행은 전부 미선택 모습(흰 배경)만 그려져 있고, 이 행들이 쓰는 범용 `Button` 컴포넌트에도 "선택됨(지속 상태)" variant가 없다(있는 건 hover/press용 `Status=active`뿐이며, Figma 설명은 오히려 Button을 지속 상태 표현에 쓰지 말라고 명시한다). 코드의 `isSelected` 강조색(`bg-mute`+`text-static-white`)은 Figma `Status=active`(hover/press) 토큰 조합을 재사용한 것 — 어떤 선택지를 골랐는지 사용자에게 보여줘야 하는 기능적 필요 때문에 코드 쪽에서 둔 자체 판단이다.
