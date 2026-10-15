# GoalSetting

- 코드: `components/app/goal-setting/goal-setting.tsx` (`goal-setting.stories.tsx`, `goal-setting.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8234-99895) `Goal setting` node `8234:99895`

## Overview

Know Thyself의 "Edit Goal"과 Content Studio의 "My goal" 편집이 공유하는 Goal 설정 카드. `type="empty"`(아직 Goal을 안 만든 상태 — 안내 문구 + Chatbox)와 `type="filled"`(Brand Position/Target/Posting·Tracking Frequency/Targeted Followers까지 채워진 전체 폼) 두 상태로 구성된다.

Figma에는 `Type=empty`/`Type=modeling partner`/`Type=fashionista` 3개 독립 컴포넌트가 있지만, 이는 Figma variant 프로퍼티가 아니라 레이어명 컨벤션일 뿐이다 — 구조적으로는 empty/filled 2가지뿐이고, "modeling partner"/"fashionista"는 filled 상태에 들어가는 샘플 데이터 2종(구조 차이 없음)이다.

## When to use

- Know Thyself의 "Edit Goal" 모달, Content Studio의 "My goal" 편집 모달 양쪽에서 동일하게.

## How to use

```tsx
<GoalSetting type="empty" onSubmitDescription={handleDescribe} onClose={close} />

<GoalSetting
  type="filled"
  paragraph1Template="I'm a data scientist ... positioned as a {brandPosition} for {target} ..."
  paragraph2Template="I share {postingSummary} ... approximately {targetedFollowers} ... {trackingFrequency} reach ..."
  brandPosition={brandPosition}
  target={target}
  postingFrequency={postingFrequency}
  postingCount={postingCount}
  targetedFollowersIndex={followersIndex}
  trackingFrequency={trackingFrequency}
  onSave={handleSave}
  onClose={close}
/>
```

## Props

공통(`onClose`, `className`) 외 `type`에 따라 갈린다.

### `type="empty"`

| Prop                 | 타입                            | 기본값    | 설명                                  |
| -------------------- | ------------------------------- | --------- | ------------------------------------- |
| `onSubmitDescription` | `(description: string) => void` | -        | Chatbox 전송(✨) 시 입력 텍스트와 함께 호출 |

### `type="filled"`

| Prop                             | 타입                                            | 기본값     | 설명                                                             |
| -------------------------------- | ----------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| `paragraph1Template`             | `string`                                        | (필수)     | `{brandPosition}`, `{target}` 플레이스홀더 포함                   |
| `paragraph2Template`             | `string`                                        | (필수)     | `{postingSummary}`, `{targetedFollowers}`, `{trackingFrequency}` 플레이스홀더 포함 |
| `brandPosition` / `target`       | `string`                                        | (필수)     | Input 값이자 문단 안 Chips 값(단일 소스)                          |
| `brandPositionFile` / `targetFile` | `File \| null`                                 | `null`     | 각 Input의 첨부파일                                               |
| `postingFrequency`               | `"Daily" \| "Weekly" \| "Monthly"`              | `"Daily"`  |                                                                      |
| `postingCount`                   | `number`                                        | `3`        | `{postingSummary}` = `"{n} time(s) a day"`로 자동 변환             |
| `targetedFollowersIndex`         | `number` (0~5)                                  | `1`        | `TARGETED_FOLLOWERS_LABELS` 인덱스                                 |
| `trackingFrequency`              | `"Weekly" \| "Monthly" \| "Quarterly"`          | `"Monthly"`|                                                                      |
| `onSave`                         | `() => void`                                    | -          |                                                                      |

## Structure

- 문단(`paragraph1Template`/`paragraph2Template`) 안의 Chips는 자유 텍스트가 아니라, 같은 데이터를 공유하는 하단 필드(`brandPosition`, `target`, `postingFrequency`+`postingCount`, `targetedFollowersIndex`, `trackingFrequency`)에서 파생된 값이 `{key}` 자리에 자동으로 삽입된다 — 아래 입력을 바꾸면 문단의 Chips도 항상 같이 바뀐다. 서술 문장(템플릿 자체)만 자유롭게 바뀔 수 있는 부분이다.
- Brand Position/Target 행은 범용 `Input`(`showSelect`/`showLink` 끔) 그대로 재사용 — label + textfield + 첨부파일(File.pdf) 업로드 행 구조가 Figma와 1:1 일치.
- Targeted Followers는 범용 `Slider`(`min=0`, `max=5`)를 인덱스 기반으로 재사용하고, 하단에 6개 스케일 레이블("1,000"~"1,000,000+")을 항상 표시.
- Posting/Tracking Frequency의 버튼그룹과 Posting 카운터(±)는 기존 `ButtonGroup`/`Toggle`의 선택 색상 토큰이 Figma 값(`--gb-background-mute`)과 달라(기존 컴포넌트는 `-subtle` 계열) 재사용하지 않고 컴포넌트 내부에 새로 작성했다.
- 닫기(X) = `Button variant="icon-ghost"`, Save = `Button variant="primary"`.

## States and behaviors

- `type="empty"`일 때 Chatbox 위 두 줄 안내 문구는 Chatbox의 `children` 슬롯에 들어가는 고정 콘텐츠이고, 실제 입력은 그 아래 textarea에서 이뤄진다.
