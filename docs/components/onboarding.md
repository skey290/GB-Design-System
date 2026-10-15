# Onboarding

- 코드: `components/app/onboarding/onboarding.tsx` (`onboarding.stories.tsx`, `onboarding.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8135-128629) `Onboarding` 섹션 → `Detail view` (node `8135:128630`)

## Overview

Google 계정으로 가입/로그인하는 Gabrielle 최초 진입 화면. 일러스트, 워드마크, 안내 문구, Google 로그인 버튼으로 구성된 고정 레이아웃 카드 하나뿐이고 Figma에 variant/상태 축이 없다.

## When to use

- 로그인 전 최초 진입 지점에서 Google 계정 로그인을 유도할 때.

## How to use

```tsx
<Onboarding onContinueWithGoogle={() => signInWithGoogle()} />
```

## Props

| Prop | 타입 | 설명 |
| --- | --- | --- |
| `onContinueWithGoogle` | `() => void` | "Continue with Google" 버튼 클릭 시 호출 |

그 외 `React.HTMLAttributes<HTMLDivElement>`(`children` 제외)를 루트 `div`로 그대로 상속.

## Structure

- 루트는 Figma 확정 고정 치수 `660×1038px`(반응형 아님) — 컴포넌트 크기라 스페이싱 토큰이 아닌 리터럴 px를 쓴다.
- 일러스트(`/images/onboarding/pixelated-human.png`, `258×388px`)는 이 화면 전용 정적 이미지라 Figma에 instance-swap 슬롯이 없어 prop화하지 않았다.
- 워드마크는 새 에셋을 받지 않고 GNB가 이미 쓰는 `/images/logo.png`를 재사용한다 — Figma에서 받은 SVG 워드마크와 같은 "GABRIELLE" 로고다.
- Google 로그인 버튼은 범용 `Button`(`components/ui/button`) `variant="google"`을 그대로 재사용 — 기본 아이콘(`google-icon`)과 기본 라벨("Continue with Google")이 이 화면 문구와 정확히 일치해 별도 override 없이 그대로 쓴다.
- 안내 문구 2개(헤드라인/캡션)는 전부 `.text-xs-light` 텍스트 스타일이고 색만 다르다(헤드라인 `--gb-text-default`, 캡션 `--gb-text-subtle`).

## Notes

- 이 레포(`GB-Data-Vis`)의 `.gitignore`는 앱 전용 컴포넌트만 공개하는 allowlist 방식이라 `components/app/*`는 기존에도 git에 커밋되지 않는다 — `components/app/chatbox-composer` 등 기존 app 컴포넌트와 동일한 상태이며, 이번 추가로 바뀐 점은 없다.
