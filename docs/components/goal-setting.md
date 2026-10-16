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
| `onSave`              | `() => void`                    | -        | 하단 Save 버튼 클릭 시 호출            |

### `type="filled"`

제어/비제어 쌍을 지원하는 필드는 `값` / `default값` 두 개로 나열한다(둘 다 optional — 아무것도 안 주면 비제어, `defaultX`만 주면 비제어 초기값, `x`를 주면 완전 제어).

| Prop                               | 타입                                    | 기본값      | 설명                                                        |
| ----------------------------------- | --------------------------------------- | ----------- | ------------------------------------------------------------- |
| `paragraph1Template`                | `string`                                | (필수)      | `{brandPosition}`, `{target}` 플레이스홀더 포함              |
| `paragraph2Template`                | `string`                                | (필수)      | `{postingSummary}`, `{targetedFollowers}`, `{trackingFrequency}` 플레이스홀더 포함 |
| `brandPosition` / `defaultBrandPosition` | `string`                            | `""`        | Input 값이자 문단 안 Badge 값(단일 소스)                     |
| `target` / `defaultTarget`          | `string`                                | `""`        | 위와 동일                                                    |
| `brandPositionFile` / `targetFile`  | `File \| null`                          | `null`      | 각 Input의 첨부파일(완전 제어만 지원)                        |
| `postingFrequency` / `defaultPostingFrequency` | `"Daily" \| "Weekly" \| "Monthly"` | `"Daily"`  |                                                               |
| `postingCount` / `defaultPostingCount` | `number`                             | `3`         | `{postingSummary}` = `"{n} time(s) a day (Daily)"`처럼 Posting Frequency 선택값이 괄호로 붙어 자동 변환 |
| `targetedFollowersIndex` / `defaultTargetedFollowersIndex` | `number`(0~5)        | `1`         | `TARGETED_FOLLOWERS_LABELS` 인덱스                            |
| `trackingFrequency` / `defaultTrackingFrequency` | `"Weekly" \| "Monthly" \| "Quarterly"` | `"Monthly"` |                                                           |
| `onSave`                            | `() => void`                            | -           |                                                               |

## Structure

- 문단(`paragraph1Template`/`paragraph2Template`) 안의 Badge는 자유 텍스트가 아니라, 같은 데이터를 공유하는 하단 필드(`brandPosition`, `target`, `postingFrequency`+`postingCount`, `targetedFollowersIndex`, `trackingFrequency`)에서 파생된 값이 `{key}` 자리에 자동으로 삽입된다 — 아래 입력을 바꾸면 문단의 Badge도 항상 같이 바뀐다. 서술 문장(템플릿 자체)만 자유롭게 바뀔 수 있는 부분이다. `Badge variant="default" size="20"`를 수정 없이 그대로 재사용한다 — 실측 결과 `size="20"` 기본 프리셋(h-20px, px-6px, text-xs-medium)이 Figma 값과 정확히 일치해서 className으로 패딩/폰트를 따로 덮어쓰면 오히려 어긋난다(`align-middle`만 추가해 값이 비었을 때 baseline이 밀리는 것만 방지). Chips가 아니라 Badge인 이유는 클릭 가능한 액션이 아니라 값을 보여주기만 하는 순수 표시용이기 때문(Figma에서도 Chips→Badge로 교체됨).
- Brand Position/Target 행은 범용 `Input`(`showSelect`/`showLink` 끔) 그대로 재사용 — label + textfield + 첨부파일 업로드 행 구조가 Figma와 1:1 일치. 업로드 행 placeholder는 Input 자체 기본값("File upload")을 그대로 쓴다 — Figma의 "File.pdf"는 빈 상태 placeholder가 아니라 이미 첨부된 예시 파일의 이름이라, 실제 파일이 첨부되면 `Input`이 자동으로 `file.name`을 보여준다.
- Posting/Tracking Frequency 버튼(`FrequencyGroup`)과 Posting 카운터(±)는 전부 범용 `Button` 컴포넌트를 그대로 재사용한다 — 버튼 그룹은 `variant="outline"`에 선택 시 배경/텍스트 색만 className으로 덮어쓰고, 카운터는 `variant="icon-rounded"`(24px로 축소)다. hover/focus-visible/active/disabled는 전부 Button 자체 동작을 그대로 물려받는다. Figma 실측상 버튼 3개는 `flex-1`로 균등폭 꽉 채움이고, Posting Frequency는 버튼 줄과 카운터 줄이 **서로 다른 줄**(세로로 쌓임)이다.
- Targeted Followers는 범용 `Slider`(`min=0`, `max=5`)를 인덱스 기반으로 재사용한다. 하단 6개 스케일 레이블("1,000"~"1M+")은 **Figma의 실제 배치(균등 gap, 슬라이더 값과 무관)를 의도적으로 따르지 않고**, 슬라이더 thumb과 같은 퍼센트 공식(`index/5*100%`)으로 위치를 맞췄다 — Figma는 한 값(5,000)만 보여주는 정적 목업이라 트랙과 레이블이 구조적으로 연결되어 있지 않지만, 실제 동작하는 슬라이더에서는 어떤 값을 선택해도 레이블이 thumb과 일치해야 하므로 사용자 확인 하에 의도적으로 분기했다.
- 닫기(X) = `Button variant="icon-ghost"`, Save = `Button variant="primary"`.

## States and behaviors

- `type="empty"`일 때 안내 문구는 별도 슬롯이 아니라 `Chatbox`의 `placeholder` prop으로 전달된다 — 입력도 같은 textarea에서 바로 이뤄진다(안내 문구가 사라지고 실제 입력 텍스트가 보인다).
- `brandPosition`/`target`/`postingFrequency`/`postingCount`/`targetedFollowersIndex`/`trackingFrequency` 전부 제어/비제어 쌍을 지원한다 — 아무 값도 안 넘기면 내부 state로 동작하므로 Storybook Controls나 최소 연동만 한 소비처에서도 바로 타이핑/클릭이 먹힌다.
