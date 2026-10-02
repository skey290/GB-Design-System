# Select

- 코드: `components/ui/select/select.tsx` (`select.stories.tsx`, `select.test.tsx`, `index.ts`)
- Figma: [❄️ GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=614-2466) — node-id `614:2466` ("select" 프레임)

## Overview

`Select`는 "값 선택형" 드롭다운 컴포넌트로, `type` prop(5종: `country-number` / `social-media` / `mbti` / `self` / `frequency`)에 따라 트리거·옵션 레이아웃이 달라지고, `style` prop으로 일부 type의 시각 스타일(배경/텍스트 토큰)을 바꾼다. Radix `PopoverPrimitive`(Root/Trigger/Content) 위에 `role="combobox"` 트리거 + `role="listbox"`/`role="option"` 리스트를 직접 구성한 커스텀 콤보박스다.

Figma "select" 프레임(`614:2466`)에는 `Select` 자체의 variant(country number/social media/MBTI/self/frequency/disabled) 외에 `Type=self menu`(`Style=self-right`/`self-left`, node `5314:6893`/`5314:9661` 등)라는 별도 심볼 그룹이 같은 프레임 안에 섞여 있다(`get_metadata` 확인). 이 `self menu` variant는 **값을 하나 선택해서 트리거에 반영하는 Select와 달리, 클릭 시 액션 목록(버튼들)을 여는 메뉴**이며, 코드베이스에서도 `Select`와 완전히 별개의 컴포넌트 `components/ui/persona-action-menu/persona-action-menu.tsx`(`PersonaActionMenuProps.style: "self-right" | "self-left"`)로 구현되어 있다. 즉 같은 Figma 프레임을 공유할 뿐, 이 문서가 다루는 `Select`의 범위에는 포함되지 않는다.

또한 `components/ui/compass-toolbar/compass-toolbar.tsx`에는 "toggle select"라 불리는 2-옵션 세그먼트 토글이 `Select`(`type="self" style="mute"`)와 나란히 쓰이지만, 코드 주석(`compass-toolbar.tsx:8-28`)에 따르면 이는 `614:2466` 프레임이 아니라 별도의 GNB "Compass" 목업(`Style=compass-home`, node `5266:11096`) 안의 서브프레임(`5274:11821`)이고, 기존 세그먼트 토글 컴포넌트와도 토큰이 달라 `compass-toolbar.tsx` 내부에 로컬 구현으로 새로 만든 것이다. 이 토글도 `Select`가 아니다 — 값 목록을 펼치는 드롭다운이 아니라 항상 두 옵션이 노출된 채 하나를 고르는 세그먼트 컨트롤이라 구조 자체가 다르다.

Figma "select" 컴포넌트셋 자체에 별도의 description 필드는 없음(`get_design_context` 응답에 컴포넌트 설명 텍스트 없이 variant 이름만 노출됨).

## When to use

코드베이스 실사용처(grep 기준)에서 관찰된 패턴:

- **국가번호 코드 선택**: `components/ui/input-phone/input-phone.tsx`에서 `type="country-number"`를 전화번호 입력 필드 왼쪽에 배치해 국가 코드를 고르는 용도로 사용.
- **페르소나/프로필 필터 선택**: `components/ui/compass-toolbar/compass-toolbar.tsx`에서 `type="self" style="mute"`를 사이드바 세그먼트 토글 아래에 배치해 "All 'Self'" 목록을 고르는 용도로 사용(단, `selectOptions`를 넘기지 않으면 렌더링 자체를 생략 — Analysis 모드 실측 결과 반영).

## When not to use

⚠️ 확인 필요 — 아래 "확인 필요" 섹션 참고. Figma에 별도 설명이 없고, 코드/사용처에서도 "이런 경우엔 Select를 쓰지 말라"는 명시적 근거가 발견되지 않아 억지로 서술하지 않음.

## How to use

`select.stories.tsx`에 실제로 정의된 사용 예시:

```tsx
// country-number — 트리거에 label이 아닌 code를 표시
<Select
  type="country-number"
  options={COUNTRY_NUMBER_OPTIONS}
  value="kr"
  placeholder="Select code..."
/>

// social-media — primary(값 표시) / icon("+" 아이콘 전용 트리거)
<Select
  type="social-media"
  style="primary"
  options={SOCIAL_MEDIA_OPTIONS}
  placeholder="Select social media..."
/>
<Select type="social-media" style="icon" options={SOCIAL_MEDIA_OPTIONS} />

// mbti
<Select type="mbti" options={MBTI_OPTIONS} placeholder="Select MBTI..." />

// frequency
<Select type="frequency" options={FREQUENCY_OPTIONS} value="days" />

// self — primary(투명 배경) / reverse(background-bold) / mute(background-surface-secondary)
<Select type="self" style="primary" options={SELF_OPTIONS} value="saas-expert" />
<Select type="self" style="reverse" options={SELF_OPTIONS} value="saas-expert" />
<Select type="self" style="mute" options={SELF_OPTIONS} value="saas-expert" />

// disabled / error
<Select type="social-media" options={SOCIAL_MEDIA_OPTIONS} disabled />
<Select type="mbti" options={MBTI_OPTIONS} error />
```

실제 조합 예시(`components/ui/input-phone/input-phone.tsx:129-135`):

```tsx
<Select
  type="country-number"
  options={countryCodeOptions}
  value={currentCountryCode}
  onValueChange={handleCountryCodeChange}
  disabled={disabled}
/>
```

## Structure

- `PopoverPrimitive.Root`(제어형 `open`) → `PopoverPrimitive.Trigger asChild`로 감싼 `<button role="combobox" aria-haspopup="listbox" aria-expanded aria-controls>` → `PopoverPrimitive.Portal` → `PopoverPrimitive.Content`(`role`은 별도 지정 없이 `<div>`, 내부에 실제 리스트).
- 트리거 내부: `social-media`+`style="icon"`일 때는 `+` 아이콘만, 그 외에는 `<span>`(선택된 라벨 또는 `code`) + chevron(열림 시 `chevron-up`, 닫힘 시 `chevron-down`) 아이콘.
- 드롭다운 내부: `<ul role="listbox">` 안에 `<li role="option" aria-selected>` 목록. `country-number`는 `code` 컬럼(고정폭) + `label` 2단 레이아웃, 그 외 type은 `label` 단일 컬럼.
- 커스텀 스크롤바: 브라우저 기본 스크롤바를 숨기고(`scrollbar-width:none` 등) 트랙/썸을 `<div>`로 직접 그려 스크롤 위치에 따라 `top`/`height` 퍼센트를 계산(`updateThumb`). 옵션이 6개 초과일 때만 렌더링.
- 스크롤 다음 버튼: 옵션이 6개 초과일 때만 하단에 노출되는 `aria-label="Show more options"` 버튼, 클릭 시 리스트를 한 화면 높이만큼 `scrollBy(smooth)`.

## Props

| Prop            | 타입                                                                    | 기본값        | 설명                                                                                                                                                                   |
| --------------- | ----------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`          | `"country-number" \| "social-media" \| "mbti" \| "self" \| "frequency"` | (필수)        | Figma `Type` variant 5종. 항목 레이아웃/트리거 스타일 결정                                                                                                             |
| `style`         | `"primary" \| "reverse" \| "mute" \| "icon"`                            | type별 상이   | Figma `Style` variant. `self`에서는 `primary`/`reverse`/`mute`, `social-media`에서는 `primary`/`icon` 의미로 쓰이고 그 외 type은 무시됨(코드 주석, `select.tsx:18-23`) |
| `options`       | `SelectOption[]`                                                        | (필수)        | `{ value, label, code? }[]`. `code`는 `country-number` 전용                                                                                                            |
| `value`         | `string`                                                                | -             | 선택된 옵션의 `value`                                                                                                                                                  |
| `onValueChange` | `(value: string) => void`                                               | -             | 옵션 클릭/Enter 선택 시 호출                                                                                                                                           |
| `placeholder`   | `string`                                                                | `"Select..."` | 값이 없을 때 트리거에 표시할 텍스트                                                                                                                                    |
| `disabled`      | `boolean`                                                               | -             | 비활성화 여부                                                                                                                                                          |
| `error`         | `boolean`                                                               | -             | 에러 보더 표시 여부(`disabled`일 때는 무시됨)                                                                                                                          |
| `className`     | `string`                                                                | -             | `cn()`으로 트리거 클래스와 병합                                                                                                                                        |

`SelectOption`: `{ value: string; label: string; code?: string }` — `code`는 "country-number 타입 전용: 국가 코드(예: "+82")"(코드 주석, `select.tsx:11`).

## Variants

`type` × `style` 조합(값 없는 칸은 style 무의미 — 단일 스타일):

| type             | style           | 드롭다운 폭 | 트리거 표시                                    | 배경/보더 토큰(기본)                         |
| ---------------- | --------------- | ----------- | ---------------------------------------------- | -------------------------------------------- |
| `country-number` | (무시)          | `w-[210px]` | `code` (없으면 `label`, 없으면 placeholder)    | `--background-default` / `--border-default`  |
| `social-media`   | `primary`(기본) | `w-[210px]` | `label` + chevron                              | `--background-default` / `--border-default`  |
| `social-media`   | `icon`          | `w-[210px]` | `+` 아이콘만(값 텍스트 없음, filled 상태 없음) | `--background-default` / `--border-default`  |
| `mbti`           | (무시)          | `w-[150px]` | `label` + chevron                              | `--background-default` / `--border-default`  |
| `self`           | `primary`(기본) | `w-[210px]` | `label` + chevron                              | 배경/보더 투명                               |
| `self`           | `reverse`       | `w-[210px]` | `label` + chevron                              | `--background-bold` / 보더 투명              |
| `self`           | `mute`          | `w-[210px]` | `label` + chevron                              | `--background-surface-secondary` / 보더 투명 |
| `frequency`      | (무시)          | `w-[210px]` | `label` + chevron                              | `--background-default` / `--border-default`  |

드롭다운 폭 `150px`/`210px`는 토큰 스케일(`--scale-*`)에 없는 값이라 코드에서 예외적으로 하드코딩되어 있음(코드 주석, `select.tsx:34-35`) — "Figma 확정값"으로 명시되어 있으나 값 자체는 토큰이 아님.

## States and behaviors

- **default / filled**: 값 미선택 시 `text-subtle`(placeholder), 선택 시 `text-default`(또는 `self/reverse`에서 `text-selected`→`text-invert`)로 텍스트 색이 바뀜.
- **hover**: type/style 무관 공통으로 배경을 `--background-static-gray`로 채우고 텍스트/아이콘을 `--text-static-white`로 반전, `--shadow-focus-ring` 쉐도우 추가(코드 주석, `select.tsx:231-234`).
- **open(pressed)**: 배경은 유지한 채 보더를 `--border-static-gray`로, 쉐도우를 `--shadow-focus-ring`으로 추가. 텍스트는 선택 여부와 무관하게 고정 색(`self`/`reverse`는 `--text-invert`, 그 외는 `--text-default`)으로 강제됨(코드 주석, `select.tsx:188-195`).
- **disabled**: type/style 무관 단일 디자인(`--background-disabled` / `--border-overlay` / `--text-static-gray`, 아이콘 전용은 `--icon-static-gray`)으로 완전히 대체(코드 주석, `select.tsx:217-218`). 클릭해도 열리지 않음(`handleOpenChange`에서 `disabled` 시 조기 반환).
- **error**: `border-[var(--border-error)]` 추가. `disabled`가 아닐 때만 적용. Figma `Status` variant 목록(`default`/`filled`/`hovered`/`pressed`/`disabled`)에는 `error` 상태가 별도로 없음(`get_metadata` 확인) — 아래 확인 필요 참고.
- **selected / highlighted 옵션**: `background-static-gray` + `text-static-white`로 동일하게 표시(마우스 hover든 키보드 하이라이트든 동일 스타일).
- **키보드 내비게이션**: 트리거 포커스 상태에서 `ArrowDown`/`ArrowUp` → 팝오버 오픈. 오픈 상태에서 `ArrowDown`/`ArrowUp` → 하이라이트 이동, `Enter` → 하이라이트된 옵션 선택. `Escape`/바깥 클릭 닫힘은 Radix `Popover` 기본 동작 그대로 사용(별도 처리 없음).
- **스크롤 가능 여부**: `options.length > 6`일 때만 커스텀 스크롤바 + "Show more options" 버튼 노출(Figma 목업이 16개 중 6개만 보이는 고정 높이로 디자인되어 있어 6개 이하는 스크롤할 내용이 없다고 판단, 코드 주석 `select.tsx:68-70`).

## 다른 범용 컴포넌트와의 조합 가이드

실제 앱에서 관찰된 조합 패턴:

- **`InputPhone`과 조합**: `components/ui/input-phone/input-phone.tsx`가 `type="country-number"` `Select`를 새로 만들지 않고 그대로 재사용해, 국가코드 드롭다운 + `Input`(전화번호 텍스트 필드)을 `flex` 가로 배치로 조합(`input-phone.tsx:129-144`).
- **`CompassToolbar`와 조합**: `components/ui/compass-toolbar/compass-toolbar.tsx`가 자체 구현한 세그먼트 토글(Select 아님) 아래에 `type="self" style="mute"` `Select`를 세로로 배치. `selectOptions`가 없으면 `Select` 자체를 렌더링하지 않도록 optional 처리되어 있음(Analysis 모드 실측 결과 반영, `compass-toolbar.tsx:40-44`).

## ⚠️ 확인 필요

- **드롭다운 폭 하드코딩(150px/210px)**: `DROPDOWN_WIDTH_CLASS`가 "Figma 확정값"이라는 코드 주석과 함께 토큰이 아닌 리터럴 `w-[…px]`로 하드코딩되어 있음. 토큰 스케일에 정말 대응값이 없는지, 향후 `--scale-*`에 150/210이 추가되면 교체해야 하는지 확인 필요.
- **리스트/스크롤바 높이 계산 중복**: `LIST_MAX_HEIGHT_CLASS`와 `SCROLLBAR_TRACK_HEIGHT_CLASS`가 동일한 `calc(...)` 값을 각각 리터럴로 중복 정의하고 있고, 코드 주석 자체가 "값 변경 시 둘 다 함께 수정할 것"이라고 경고함 — 유지보수 리스크로 별도 관리(예: 공통 CSS 변수 추출) 필요 여부 확인 필요.
- **드롭다운 그림자 근사치**: `PopoverPrimitive.Content`의 `shadow-[var(--shadow-lg)]`가 "Figma의 그림자값(0 4px 3px + 0 2px 2px, rgba(0,0,0,0.1))과 정확히 일치하는 토큰이 없어 근사"라고 코드 주석에 명시되어 있음 — 정확히 일치하는 전용 토큰을 새로 추가해야 하는지 확인 필요.
- **`error` 상태의 Figma 근거 불명확**: `get_metadata` 조회 결과 "select" 프레임의 `Status` variant는 `default`/`filled`/`hovered`/`pressed`/`disabled`만 존재하고 `error` 상태 심볼이 없음. `border-[var(--border-error)]` 값이 어느 Figma 노드/토큰에서 확정된 것인지 별도 확인 필요.
- **`components/ui/toggle-select` 컴포넌트 부재**: `compass-toolbar.tsx` 코드 주석은 "기존 `components/ui/toggle-select`(AM/PM 전용)"를 언급하지만, 현재 저장소에는 해당 디렉토리/파일이 존재하지 않음(`grep`/`find` 확인). 주석이 stale인지, 컴포넌트가 이름 변경/삭제되었는지 확인 필요.
- **"When not to use" 근거 부족**: Figma에 description이 없고 코드/사용처에도 "이런 경우엔 쓰지 말라"는 근거가 없어 별도 서술을 생략함. 예를 들어 옵션이 매우 적을 때(2개 이하)도 `Select`를 쓰는 것이 의도된 설계인지(vs. 세그먼트 토글류 사용) 확인 필요.
