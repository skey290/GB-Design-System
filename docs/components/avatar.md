# Avatar

Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3073-4051) · node-id `3073:4051`
코드: `components/ui/avatar/avatar.tsx`

## Overview

사용자를 나타내는 32px 고정 크기의 아바타 컴포넌트. `<div>` 기반이며, Figma "Avatar" 컴포넌트 세트는 `Type`(Image/Initial/Icon) × `Style`(rounded/rectangle/circle) 2축 9개 variant로 구성돼 있다(get_metadata로 확인, 각 32×32). Figma 컴포넌트 자체에 별도 description 필드는 없음(get_metadata/get_design_context 응답 모두에 description 텍스트 없음).

코드는 Figma `Type`을 `variant` prop(`image`/`initial`/`icon`)으로, `Style`을 `shape` prop(`rounded`/`rectangle`/`circle`)으로 매핑했다. Figma의 "Style"이라는 이름이 React의 `style`(인라인 스타일) prop과 겹치기 때문에 `shape`로 개명했다고 avatar.tsx 주석에 명시돼 있다. 3×3 = 9개 조합 전부 32px 고정 크기로, Figma 스펙과 정확히 일치한다(get_design_context 결과의 `size-[32px]`와 코드의 `size-[calc(var(--scale-32)*1px)]` 대응 확인).

Figma에 없는, 코드 전용 확장이 하나 있다 — `variant="image"`인데 `src`가 없거나 이미지 로드에 실패하면 `initials`로, `initials`도 없으면 `icon`으로 자동 폴백한다(avatar.tsx 주석: "Figma에는 명시되지 않은, 실제 서비스에서 흔한 이미지 로드 실패 대응을 위한 확장 — 새 variant를 추가하지 않고 기존 3개 Type으로만 귀결됨"). `variant="initial"`인데 `initials`가 없을 때도 `icon`으로 폴백한다.

## When to use

- 사용자/페르소나를 이미지, 이니셜, 또는 기본 아이콘으로 시각화해야 할 때 (실사용 예: `FloatingProfile`의 프로필 아바타 버블, `PersonaSlot`의 40px 페르소나 슬롯 내부).
- 프로필 이미지 URL이 아직 없거나(`initials`만 있는 신규 사용자), 이미지 로드가 실패할 수 있는 상황 — 폴백 체인(image → initial → icon)이 내장돼 있어 소비 컴포넌트가 별도 에러 핸들링을 하지 않아도 된다.

## When not to use

⚠️ 확인 필요 — Figma/코드 어디에도 "이런 경우엔 쓰지 말 것"을 명시한 근거를 찾지 못함.

## How to use

`avatar.stories.tsx`에서 그대로 인용:

```tsx
// Icon (기본값) — src/initials 없이 아이콘 플레이스홀더
<Avatar variant="icon" shape="circle" />

// Initial — 이니셜 텍스트
<Avatar variant="initial" shape="circle" initials="S" />

// Image
<Avatar
  variant="image"
  shape="circle"
  src="/images/personas/self-default.jpg"
  alt="사용자 프로필 사진"
/>

// 이미지 로드 실패 → initials로 자동 폴백 (Figma에 없는 코드 전용 확장)
<Avatar variant="image" src="https://broken.invalid/x.png" initials="S" alt="..." />

// src 없음 → icon으로 자동 폴백
<Avatar variant="image" />
```

## Structure

- 루트: `<div>` (`Omit<React.HTMLAttributes<HTMLDivElement>, "children">`를 extend, `children`은 직접 받지 않고 내부 렌더 로직으로 대체됨)
- `variant="image"`일 때: `<img>` 하나만 렌더링, `size-full object-cover`로 컨테이너를 꽉 채움, `onError`로 `imageFailed` 상태를 세팅해 폴백 트리거
- `variant="initial"`일 때: `<span aria-hidden="true">`에 `initials` 텍스트
- `variant="icon"`일 때: `<svg aria-hidden="true">` + `<use href="/icons.svg#user-filled-icon" />`, 18px 고정(`--scale-18`)
- 접근성: `image`가 아닌 두 variant는 루트 `<div>`에 `role="img"` + `aria-label`(alt → initials → `"avatar"` 순으로 fallback)을 부여. `image` variant는 `role`/`aria-label`을 주지 않고 `<img alt>`에 위임.

## Props

| Prop       | 타입                                                   | 필수   | 기본값     | 설명                                                                                                                                 |
| ---------- | ------------------------------------------------------ | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `variant`  | `"image" \| "initial" \| "icon"`                       | 아니오 | `"icon"`   | Figma `Type` variant 매핑. 실제 렌더링 시엔 `src`/`initials` 유무에 따라 자동 폴백되어 값이 재계산될 수 있음(내부 `resolvedVariant`) |
| `shape`    | `"rounded" \| "rectangle" \| "circle"`                 | 아니오 | `"circle"` | Figma `Style` variant 매핑. React `style` prop과의 이름 충돌을 피하기 위해 개명                                                      |
| `src`      | `string`                                               | 아니오 | —          | `variant="image"`일 때 표시할 이미지 URL                                                                                             |
| `alt`      | `string`                                               | 아니오 | `""`       | 이미지의 대체 텍스트이자, 폴백(initial/icon) 상태의 `aria-label`로도 재사용됨                                                        |
| `initials` | `string`                                               | 아니오 | —          | `variant="initial"`일 때 표시할 이니셜 텍스트 (Figma 예시: `"S"`)                                                                    |
| ...props   | `React.HTMLAttributes<HTMLDivElement>` (children 제외) | 아니오 | —          | `className`, `data-*`, `onClick` 등 div 표준 속성 forward. `children`은 받지 않음                                                    |

## Variants

### Type (variant)

| variant         | 배경                        | 보더                                            | 콘텐츠                                                     |
| --------------- | --------------------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| `image`         | 없음                        | 없음                                            | `<img>`가 컨테이너를 꽉 채움 (`size-full object-cover`)    |
| `initial`       | `var(--background-default)` | `var(--border-1)` 두께의 `var(--border-subtle)` | 이니셜 텍스트, `text-sm-semi-bold` + `var(--text-default)` |
| `icon` (기본값) | `var(--background-default)` | `var(--border-1)` 두께의 `var(--border-subtle)` | `user-filled-icon` SVG (18px), `var(--icon-default)`       |

get_variable_defs(node `3073:4051`)로 대조한 실제 값: `--background-default: #ffffff`, `--border-subtle: #f5f5f5`, `--icon-default: #0a0a0a` — 코드 토큰 이름과 정확히 일치.

### Style (shape)

| shape             | 토큰                       |
| ----------------- | -------------------------- |
| `rounded`         | `var(--radius-scale-md)`   |
| `rectangle`       | `var(--radius-scale-none)` |
| `circle` (기본값) | `var(--radius-scale-full)` |

Figma 변수명은 `--radius-md`(8) / `--radius-none`(0) / `--radius-full`(9999)로, 코드의 `--radius-scale-*` 네이밍과 접두사가 다르지만 값의 의미는 동일하게 대응된다(다른 컴포넌트 문서에서도 반복 관찰되는, Figma 변수명과 코드 토큰명 사이의 네이밍 체계 차이).

### 크기

- 루트: `size-[calc(var(--scale-32)*1px)]` — 32px, Figma 스펙 고정값. Style 축과 무관하게 9개 조합 모두 동일.
- 아이콘 콘텐츠: `size-[calc(var(--scale-18)*1px)]` — 18px, Figma의 아이콘 컨테이너 크기 그대로.

## States and behaviors

- **이미지 로드 실패 폴백**: `<img>`의 `onError`에서 `imageFailed` state를 `true`로 세팅 → `resolvedVariant`가 `initials`가 있으면 `initial`로, 없으면 `icon`으로 재계산됨. Figma에는 없는 확장(avatar.tsx 주석에 명시).
- **`src` 부재 폴백**: `variant="image"`인데 `src`가 없으면 위와 동일하게 `initial`/`icon`으로 재계산.
- **`initials` 부재 폴백**: `variant="initial"`인데 `initials`가 없으면 `icon`으로 재계산.
- 이 세 폴백 모두 새로운 variant를 추가하지 않고 기존 3개 Type 중 하나로 귀결되므로, Figma variant 구조를 벗어나지 않는다.
- hover/focus/active 등 인터랙션 상태는 Avatar 자체에 정의돼 있지 않음 — 클릭 가능하게 쓰려면 소비 컴포넌트가 직접 `<button>` 등으로 감싸야 한다(아래 조합 가이드의 `FloatingProfile` 참고).
- `icon`/`initial` 콘텐츠는 항상 `aria-hidden="true"`가 붙는다(장식용으로 취급, 접근성 라벨은 루트 `div`의 `aria-label`이 담당).

## 다른 범용 컴포넌트와의 조합 가이드

실제 코드 사용처(`grep -rn "ui/avatar" app/ components/`) 기준 — Avatar를 직접 import하는 곳은 두 곳뿐이다(`compass-self-avatar`/`compass-growth-avatar`/`compass-self-cluster`는 이름이 비슷할 뿐 `ui/avatar`를 import하지 않는 별개 컴포넌트이며, `compass-self-cluster.tsx` 주석은 "prop 이름을 `variant`로 바꾼 선례"로만 `ui/avatar`를 언급함).

- **FloatingProfile** (`components/ui/floating-profile/floating-profile.tsx`): 32px 아바타 버블로 사용, `variant="image"` 고정. Figma "Floating profile"(node `7244:22163`)에는 원래 `Type=Onboarding` variant가 있었으나 삭제되어 현재 `Type=default`/`Type=no profile` 두 종류만 남음. **"no profile" 상태(node `7425:4495`)는 별도 구현 없이 Avatar의 기존 `src` 부재 → icon 폴백을 그대로 재사용**하도록 설계됨 — `avatarSrc` prop을 optional로 두고 값이 없으면 Avatar가 자동으로 렌더링하는 `icon` variant(어두운 배경 + `user-filled-icon`)가 "no profile" 디자인과 시각적으로 일치한다고 코드 주석에 명시(floating-profile.tsx L26–L33). Figma에 `Open=true`(카드 펼침) 상태의 "no profile" 디자인이 없어서, `avatarSrc`가 없을 때는 아바타 클릭(카드 열기)이 실제로 `disabled`로 비활성화된다. Avatar 자체는 `<div>`라 클릭 불가능하므로, `FloatingProfile`은 Avatar를 디자인 시스템 `Button`이 아닌 순수 reset `<button type="button">`으로 감싸는 방식을 쓴다("Figma엔 'Button'이 아닌 'Avatar' 인스턴스라 Button을 억지로 씌우지 않았다"고 주석에 명시).
- **PersonaSlot** (`components/dashboard/ui/persona-slot/persona-slot.tsx`): 40×40 원형 페르소나 슬롯 내부에 `variant="image"`로 배치, `imageSrc`/`initials`/`name`(alt)을 그대로 Avatar에 전달해 image → initial → icon 폴백 체인을 위임. 바깥 wrapper `<div>`가 40px 크기와 `outline`(하이라이트 링, `active` 상태) 및 `blur`/`dim` 이펙트를 담당하고, Avatar는 `size-full`로 그 안을 채우는 내용물 역할만 한다 — 크기/보더/링 같은 레이아웃 장식은 Avatar 바깥에서 처리하고 Avatar는 콘텐츠(이미지/이니셜/아이콘) 렌더링과 폴백 로직만 책임지는 패턴.

공통 패턴: 두 사용처 모두 Avatar를 "콘텐츠 폴백 엔진"으로만 쓰고, 클릭 가능 여부·크기 오버라이드(`size-full`)·하이라이트 링 같은 레이아웃/인터랙션은 바깥 wrapper에서 처리한다. 특히 `FloatingProfile`은 Figma에 없는 상태(no profile × open)를 새 variant 추가 없이 Avatar의 기존 폴백 동작을 재해석해서 흡수한 사례로, "Figma에 없는 조합은 기존 컴포넌트의 폴백/변형 조합으로 커버할 수 있는지 먼저 검토"하는 참고 사례가 된다.

## ⚠️ 확인 필요

- **"When not to use" 근거 없음**: Figma/코드 어디에도 Avatar를 쓰면 안 되는 경우가 명시돼 있지 않음.
- **Figma 컴포넌트 description 없음**: get_metadata, get_design_context 두 응답 모두 "Avatar" 컴포넌트 세트에 대한 설명 텍스트를 반환하지 않음 — Figma 파일에 description이 아예 입력돼 있지 않은 것으로 보이나, MCP 응답만으로는 "description 필드가 비어있다"와 "이 도구가 description을 노출하지 않는다"를 완전히 구분하긴 어려움.
- **`--radius-scale-*` vs Figma `--radius-*` 네이밍 차이**: get_variable_defs가 반환한 Figma 변수명(`--radius-md`, `--radius-none`, `--radius-full`)과 코드가 쓰는 토큰명(`--radius-scale-md`, `--radius-scale-none`, `--radius-scale-full`)이 접두사만 다르다. 값(8/0/9999)과 의도는 일치하는 것으로 보이나, 두 네이밍 체계가 프로젝트 전역에서 어떻게 매핑되는지(Style Dictionary 변환 규칙 등) 이 문서 범위에서는 검증하지 않음.
