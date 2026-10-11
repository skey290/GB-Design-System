# Progress

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3539-7160) · node-id `3539:7160`
코드: `components/ui/progress/progress.tsx`

## Overview

상태 문구 한 줄 위에 진행률 바를 얹은 조합 컴포넌트. 바 자체는 [ProgressBar](./progress-bar.md)(Figma `Part/Progress`)를 그대로 재사용하고, 이 컴포넌트는 그 위에 라벨을 얹는 역할만 한다.

Figma 컴포넌트 설명(description) 필드 원문:

> A labelled progress indicator — a status line above a bar that fills with real progress. Status switches the label between in progress and completed. Use Spinner when the duration is unknown, and Skeleton when the shape of the loading content is already known.

**ProgressBar와의 구분**: Figma가 두 컴포넌트를 나눠 둔 것과 같은 경계다.

- **`ProgressBar`** (Figma `Part/Progress`) — 바 하나. 라벨이 없고 `Percentage` 축만 갖는다.
- **`Progress`** (이 문서) — 라벨 + 바. `Status`(in progress / completed) 축을 갖는다.

## When to use

- 진행률을 **숫자로 보고할 수 있고**, 무엇이 진행 중인지 문구로도 알려야 할 때(예: "Loading image..").
- 완료 시점에 문구가 "Completed"로 바뀌어야 할 때 — `value`가 `max`에 도달하면 자동으로 전환된다.

## When not to use

Figma description이 두 대안을 명시한다.

- **소요 시간을 알 수 없을 때** → [Spinner](./spinner.md). 진행률 개념 자체가 없는 불확정 상태용이다.
- **로딩될 콘텐츠의 모양을 이미 알 때** → [Skeleton](./skeleton.md).
- **라벨 없이 바만 필요할 때** → [ProgressBar](./progress-bar.md)를 직접 쓴다.

## How to use

```tsx
// 진행 중
<Progress value={10} aria-label="이미지 업로드" />

// 완료 — value가 max에 도달하면 라벨이 자동으로 바뀐다
<Progress value={100} aria-label="이미지 업로드" />

// 문구 지정
<Progress value={40} label="Uploading files..." completedLabel="Done" />

// 0~100이 아닌 범위
<Progress value={3} min={0} max={5} />
```

## Structure

프로젝트 컴포넌트 규칙대로 4개 파일 구성: `progress.tsx` / `progress.stories.tsx` / `progress.test.tsx` / `index.ts`.

```
<div>                              flex-col, items-start, gap 8, w-full
  <span data-slot="progress-label">  상태 문구
  <ProgressBar />                    바 (h 8, radius full)
```

Figma 목업은 `226 × 32`(라벨 16 + gap 8 + 바 8)이지만, 폭은 코드에서 `w-full`로 두고 배치하는 쪽이 정한다.

## Props

| Prop             | 타입      | 기본값               | 설명                                               |
| ---------------- | --------- | -------------------- | -------------------------------------------------- |
| `value`          | `number`  | **필수**             | 현재 진행값                                        |
| `min`            | `number`  | `0`                  | 최솟값                                             |
| `max`            | `number`  | `100`                | 최댓값. 도달하면 완료 라벨로 전환                  |
| `label`          | `string`  | `"Loading image.."`  | 진행 중 문구 (Figma 예시 문자열 그대로)            |
| `completedLabel` | `string`  | `"Completed"`        | 완료 문구                                          |
| `aria-label`     | `string`  | —                    | 내부 `ProgressBar`(`role="progressbar"`)의 접근성 이름 |
| `className`      | `string`  | —                    | 루트 `<div>`에 병합                                |

그 외 `React.HTMLAttributes<HTMLDivElement>`를 `children` 제외하고 상속한다.

## Variants

cva 기반 `variant` prop이 없다. Figma의 축은 `Status` 하나이고 값은 `in progress`/`completed` 둘인데, **prop이 아니라 `value >= max`로 파생**된다.

| Figma `Status` | 조건            | 라벨             | 바         |
| -------------- | --------------- | ---------------- | ---------- |
| `in progress`  | `value < max`   | `label`          | 진행률만큼 |
| `completed`    | `value >= max`  | `completedLabel` | 100%       |

상태를 별도 prop으로 두지 않는 이유는 "completed인데 바는 40%" 같은 **모순된 조합을 만들 수 없게** 하기 위해서다. Figma에서도 `completed` variant의 인디케이터는 항상 100%다.

## States and behaviors

| 항목        | Figma                  | 코드                                 |
| ----------- | ---------------------- | ------------------------------------ |
| 루트 gap    | `8px`                  | `--gb-spacing-2`                     |
| 루트 정렬   | `items-start`          | `items-start`                        |
| 라벨 타이포 | Semi Bold 12 / 16      | `text-xs-semi-bold`                  |
| 라벨 색     | `text/subtle`          | `--gb-text-subtle`                   |
| 바 높이     | `8px`                  | `ProgressBar` 내장                   |
| 바 트랙     | `background/subtler`   | `ProgressBar` 내장                   |
| 바 인디케이터 | `background/bolder`  | `ProgressBar` 내장                   |

- **라벨 색은 완료 여부와 무관하게 같다** — Figma도 두 variant 모두 `text/subtle`이다. 문구만 바뀐다.
- 접근성 정보는 전부 내부 `ProgressBar`가 갖는다(`role="progressbar"` + `aria-valuenow`/`min`/`max`). 라벨 `<span>`은 장식이 아니라 일반 텍스트라 스크린리더가 함께 읽는다.

## 다른 범용 컴포넌트와의 조합 가이드

- **ProgressBar** (`components/ui/progress-bar`): 바 본체. 이 컴포넌트는 `value`/`min`/`max`/`aria-label`을 그대로 넘기기만 하고, 치수·색은 전부 `ProgressBar`가 내장한 값을 쓴다.

`components/ui/progress/` 바깥의 실사용처는 아직 없다.
