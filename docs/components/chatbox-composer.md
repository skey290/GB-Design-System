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
| `selectedSentenceOption` / `defaultSelectedSentenceOption` / `onSentenceOptionChange` | `number` | `0` | `variant="sentence-option"` 전용 |

그 외 `Chatbox`의 props(`value`/`onValueChange`/`disabled`/`onSend` 등, `children`/`onAttachFiles`/`accept`/`multiple` 제외)를 그대로 상속.

## Structure

- 이미지 행: 81px 정사각 썸네일(`object-cover`) + 우상단 삭제 배지(`-top-1.5 -right-1.5`, 항상 라이트 고정 — Chatbox 전체가 다크여도 이 배지만 예외).
- chips 행: `Chips`(`variant="secondary"`, `showDeleteIcon`) 재사용. 라벨 `All`/`Image`/`Text`, 선택 상태는 `selected`로 토글.
- sentence option 행: `Chips`가 아닌 전용 `<button>` — 가로 꽉 채움(`h-[36px] w-full`), 우측에 `ChevronRight`, 선택 시 `bg-mute`+`text-static-white`.
- 첨부 파일은 `Chatbox`의 `onAttachFiles`를 받아 blob URL로 썸네일을 만들고, 제거 시 `URL.revokeObjectURL`로 정리한다(비제어 모드에서만 자동 관리).

## States and behaviors

- **chips 삭제 배지**: Figma는 All/Image/Text 세 칩 모두에 삭제(X) 배지가 떠 있다 — `showDeleteIcon`을 전달해 반영한다. 클릭 시 동작(`onDelete`)은 아직 연결하지 않았다(칩이 필터 선택용이라 "삭제"가 곧 "선택 해제"인지는 아직 정의되지 않음).
- **variant와 images는 독립이다**: `images`가 있으면 `variant`가 `"chip"`/`"sentence-option"`이어도 이미지 행이 함께 보인다(둘 다 `showImages`/`showChips`/`showSentenceOptions`로 개별 토글).
