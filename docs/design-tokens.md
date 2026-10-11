# 디자인 토큰 매핑 테이블

> Figma 변수명 ↔ CSS custom property 매핑.
> Claude Code가 Figma 디자인 구현 시 이 문서를 참조합니다.
> 토큰 추가/변경 시 이 문서도 업데이트하세요.
>
> Source: Figma `G9YNa2vjdqDjnML9y5hXJ4` (📌 GB_Design-System — Atom), 페이지
> `📄Token Documentation`(node-id `7370:2`). 각 토큰
> 카테고리의 구체적 출처 프레임은 아래 각 섹션에 명시.

## `--gb-` 토큰 prefix

`src/tokens/*.css`에 정의된 원시/시맨틱 토큰은 전부 `--gb-` prefix를 씁니다 (예: `--gb-radius-scale-lg`, `--gb-text-bold`, `--gb-background-mute`). 신규/수정 코드는 반드시 `var(--gb-*)`로 참조하세요.

- **적용 대상**: `border.css` / `colors.css` / `effects.css` / `opacity.css` / `radius.css` / `spacing.css` / `typography.css` 7개 파일의 `:root`/`.dark` 토큰 정의.
- **적용 제외**: `app/globals.css`의 `@theme inline` 블록(`--color-primary`, `--radius-lg` 등)과 Shadcn 브릿지 변수(`--background`, `--primary`, `--border` 등). Tailwind v4가 `bg-primary`/`rounded-lg` 유틸리티를 생성하는 고정 네임스페이스라 prefix를 붙이면 전체 앱의 Tailwind 유틸리티가 깨집니다.
- **하위호환**: 각 토큰 파일 끝에 `--이전이름: var(--gb-이전이름);` 형태의 alias 블록이 있어, 아직 마이그레이션하지 않은 컴포넌트는 prefix 없는 옛 이름을 그대로 써도 정상 동작합니다. alias는 사용처 전환이 끝나면 제거합니다.

### 마이그레이션 상태 (사용처 기준, 컴포넌트 작업 시마다 갱신)

| 범위 | 상태 |
|---|---|
| **`components/ui/` 전체 (29개)** | ✅ `--gb-*` 전환 완료 |
| `components/app/` | ⏳ 미전환 — alias로 정상 동작 중 |
| `components/compass/` · `components/dashboard/` | ⏳ 미전환 — alias로 정상 동작 중 |
| `components/foundation/` | ⏳ 미전환 (토큰 문서 스토리) |
| `src/tokens/text-styles.css` | ⏳ 미전환 — 39종을 prefix 없이 참조 (`var(--text-sm)` 등). 토큰을 정의하지 않고 소비만 하는 클래스 파일 |

`components/ui/`에서 prefix를 붙이지 않은 것은 Shadcn 브릿지 변수(`--background`,
`--border`, `--ring`, `--foreground`, `--muted-foreground`, `--accent`, `--primary`,
`--muted`)뿐입니다 — 위 "적용 제외" 항목에 해당합니다.

## 네이밍 규칙

Figma `/` → CSS `-` 변환 후 `--gb-` prefix. 예: `background/error/default` →
`--gb-background-error-default`

## 색상 — Primitive 팔레트

Figma 변수명은 `<컬러명>/<스텝>` 형식 (예: `neutral/50`)이며, CSS에서는
`--color-<컬러명>-<스텝>`으로 변환합니다.

primitive는 Tailwind가 `bg-neutral-50` 같은 유틸리티를 만드는 데 쓰는 고정
네임스페이스라 `--color-*`로 두고 `--gb-` prefix를 붙이지 않습니다
(Shadcn 브릿지 변수와 같은 예외).

**아래 표에 있는 것만 코드에 정의되어 있습니다** — 실제로 쓰는 7개 팔레트
(neutral·red·orange·green·blue·violet·yellow) + 단일 값 `white`/`black`.
Figma의 `tw/colors`·`rdx/colors` 컬렉션에는 팔레트가 더 많지만, 쓰지 않는
것을 CSS 변수로 싣지 않기 때문에 코드에는 없습니다. 전체 팔레트를 봐야 하면
Figma 쪽 컬렉션을 직접 확인하세요.

### Neutral

| Figma 변수명 | CSS Property        | 값        | 용도      |
| ------------ | ------------------- | --------- | --------- |
| neutral/50   | --color-neutral-50  | `#fafafa` | Primitive |
| neutral/100  | --color-neutral-100 | `#f5f5f5` | Primitive |
| neutral/200  | --color-neutral-200 | `#e5e5e5` | Primitive |
| neutral/300  | --color-neutral-300 | `#d4d4d4` | Primitive |
| neutral/400  | --color-neutral-400 | `#a3a3a3` | Primitive |
| neutral/450  | --color-neutral-450 | `#828282` | Primitive |
| neutral/500  | --color-neutral-500 | `#737373` | Primitive |
| neutral/600  | --color-neutral-600 | `#525252` | Primitive |
| neutral/700  | --color-neutral-700 | `#404040` | Primitive |
| neutral/800  | --color-neutral-800 | `#262626` | Primitive |
| neutral/900  | --color-neutral-900 | `#171717` | Primitive |
| neutral/950  | --color-neutral-950 | `#0a0a0a` | Primitive |

### Red

| Figma 변수명 | CSS Property    | 값        | 용도      |
| ------------ | --------------- | --------- | --------- |
| red/50       | --color-red-50  | `#fef2f2` | Primitive |
| red/100      | --color-red-100 | `#fee2e2` | Primitive |
| red/200      | --color-red-200 | `#fecaca` | Primitive |
| red/300      | --color-red-300 | `#fca5a5` | Primitive |
| red/400      | --color-red-400 | `#f87171` | Primitive |
| red/500      | --color-red-500 | `#ef4444` | Primitive |
| red/600      | --color-red-600 | `#dc2626` | Primitive |
| red/700      | --color-red-700 | `#b91c1c` | Primitive |
| red/800      | --color-red-800 | `#991b1b` | Primitive |
| red/900      | --color-red-900 | `#7f1d1d` | Primitive |
| red/950      | --color-red-950 | `#450a0a` | Primitive |

### Orange

| Figma 변수명 | CSS Property       | 값        | 용도      |
| ------------ | ------------------ | --------- | --------- |
| orange/50    | --color-orange-50  | `#fff7ed` | Primitive |
| orange/100   | --color-orange-100 | `#ffedd5` | Primitive |
| orange/200   | --color-orange-200 | `#fed7aa` | Primitive |
| orange/300   | --color-orange-300 | `#fdba74` | Primitive |
| orange/400   | --color-orange-400 | `#fb923c` | Primitive |
| orange/500   | --color-orange-500 | `#f97316` | Primitive |
| orange/600   | --color-orange-600 | `#ea580c` | Primitive |
| orange/700   | --color-orange-700 | `#c2410c` | Primitive |
| orange/800   | --color-orange-800 | `#9a3412` | Primitive |
| orange/900   | --color-orange-900 | `#7c2d12` | Primitive |
| orange/950   | --color-orange-950 | `#431407` | Primitive |

### Green

| Figma 변수명 | CSS Property      | 값        | 용도                          |
| ------------ | ----------------- | --------- | ----------------------------- |
| green/50     | --color-green-50  | `#f0fdf4` | Primitive                     |
| green/100    | --color-green-100 | `#dcfce7` | Primitive                     |
| green/200    | --color-green-200 | `#bbf7d0` | Primitive                     |
| green/300    | --color-green-300 | `#86efac` | Primitive                     |
| green/400    | --color-green-400 | `#4ade80` | Primitive                     |
| green/500    | --color-green-500 | `#22c55e` | Primitive                     |
| green/600    | --color-green-600 | `#16a34a` | Primitive (→ `success` alias) |
| green/700    | --color-green-700 | `#15803d` | Primitive                     |
| green/800    | --color-green-800 | `#166534` | Primitive                     |
| green/900    | --color-green-900 | `#14532d` | Primitive                     |
| green/950    | --color-green-950 | `#052e16` | Primitive                     |

### Blue

| Figma 변수명 | CSS Property     | 값        | 용도                          |
| ------------ | ---------------- | --------- | ----------------------------- |
| blue/50      | --color-blue-50  | `#eff6ff` | Primitive                     |
| blue/100     | --color-blue-100 | `#dbeafe` | Primitive                     |
| blue/200     | --color-blue-200 | `#bfdbfe` | Primitive                     |
| blue/300     | --color-blue-300 | `#93c5fd` | Primitive                     |
| blue/400     | --color-blue-400 | `#60a5fa` | Primitive                     |
| blue/500     | --color-blue-500 | `#3b82f6` | Primitive                     |
| blue/600     | --color-blue-600 | `#2563eb` | Primitive (→ `warning` alias) |
| blue/700     | --color-blue-700 | `#1d4ed8` | Primitive                     |
| blue/800     | --color-blue-800 | `#1e40af` | Primitive                     |
| blue/900     | --color-blue-900 | `#1e3a8a` | Primitive                     |
| blue/950     | --color-blue-950 | `#172554` | Primitive                     |

### Violet

| Figma 변수명 | CSS Property       | 값        | 용도      |
| ------------ | ------------------ | --------- | --------- |
| violet/50    | --color-violet-50  | `#f5f3ff` | Primitive |
| violet/100   | --color-violet-100 | `#ede9fe` | Primitive |
| violet/200   | --color-violet-200 | `#ddd6fe` | Primitive |
| violet/300   | --color-violet-300 | `#c4b5fd` | Primitive |
| violet/400   | --color-violet-400 | `#a78bfa` | Primitive |
| violet/500   | --color-violet-500 | `#8b5cf6` | Primitive |
| violet/600   | --color-violet-600 | `#7c3aed` | Primitive |
| violet/700   | --color-violet-700 | `#6d28d9` | Primitive |
| violet/800   | --color-violet-800 | `#5b21b6` | Primitive |
| violet/900   | --color-violet-900 | `#4c1d95` | Primitive |
| violet/950   | --color-violet-950 | `#2e1065` | Primitive |

### Yellow

| Figma 변수명 | CSS Property       | 값        | 용도      |
| ------------ | ------------------ | --------- | --------- |
| yellow/50    | --color-yellow-50  | `#fefce8` | Primitive |
| yellow/100   | --color-yellow-100 | `#fef9c3` | Primitive |
| yellow/200   | --color-yellow-200 | `#fef08a` | Primitive |
| yellow/300   | --color-yellow-300 | `#fde047` | Primitive |
| yellow/400   | --color-yellow-400 | `#facc15` | Primitive |
| yellow/500   | --color-yellow-500 | `#eab308` | Primitive |
| yellow/600   | --color-yellow-600 | `#ca8a04` | Primitive |
| yellow/700   | --color-yellow-700 | `#a16207` | Primitive |
| yellow/800   | --color-yellow-800 | `#854d0e` | Primitive |
| yellow/900   | --color-yellow-900 | `#713f12` | Primitive |
| yellow/950   | --color-yellow-950 | `#422006` | Primitive |

### Base (단일 값, 스텝 없음)

| Figma 변수명 | CSS Property  | 값        | 용도             |
| ------------ | ------------- | --------- | ---------------- |
| white        | --color-white | `#ffffff` | Primitive (순백) |
| black        | --color-black | `#000000` | Primitive (순흑) |

## 색상 — Semantic (primitive alias로 구성)

**컴포넌트는 이 시맨틱 토큰만 씁니다.** 위 primitive 팔레트(`--color-neutral-500` 등)를
컴포넌트에서 직접 참조하지 마세요 — 다크모드 전환이 깨집니다.

Figma `color` 컬렉션(Light/Dark 2모드)의 시맨틱 변수 80개가 전부 코드에 있습니다.
Figma 변수명의 `/`가 CSS에서 `-`가 됩니다 (`background/error/default` →
`--gb-background-error-default`). "Dark 값"이 `(light와 동일)`인 것은 `.dark`
블록에 오버라이드가 없어 라이트 값을 그대로 쓰는 토큰입니다.

### Background (`--gb-background-*`, 26개)

| Figma 변수명 | CSS Property | Light 값 | Dark 값 |
| --- | --- | --- | --- |
| background/backdrop | `--gb-background-backdrop` | `#0000004d` | (light와 동일) |
| background/bold | `--gb-background-bold` | `#171717` | `#e5e5e5` |
| background/bolder | `--gb-background-bolder` | `#0a0a0a` | `#fafafa` |
| background/default | `--gb-background-default` | `#ffffff` | `#0a0a0a` |
| background/disabled | `--gb-background-disabled` | `#f5f5f5` | `#404040` |
| background/disabled-bold | `--gb-background-disabled-bold` | `#737373` | `#a3a3a3` |
| background/error/default | `--gb-background-error-default` | `#dc2626` | (light와 동일) |
| background/error/subtle | `--gb-background-error-subtle` | `#fef2f2` | `#450a0a` |
| background/info/default | `--gb-background-info-default` | `#2563eb` | `#60a5fa` |
| background/info/subtle | `--gb-background-info-subtle` | `#eff6ff` | `#172554` |
| background/mute | `--gb-background-mute` | `#737373` | (light와 동일) |
| background/mute-subtle | `--gb-background-mute-subtle` | `#828282` | (light와 동일) |
| background/mute-subtler | `--gb-background-mute-subtler` | `#e5e5e5` | `#171717` |
| background/overlay | `--gb-background-overlay` | `#ffffff` | `#262626` |
| background/selected | `--gb-background-selected` | `#f5f5f5` | `#404040` |
| background/sheer | `--gb-background-sheer` | `#ffffff33` | `#00000033` |
| background/sheer-invert | `--gb-background-sheer-invert` | `#00000033` | `#ffffff33` |
| background/static/white | `--gb-background-static-white` | `#ffffff` | (light와 동일) |
| background/subtle | `--gb-background-subtle` | `#e5e5e5` | `#404040` |
| background/subtler | `--gb-background-subtler` | `#f5f5f5` | `#262626` |
| background/subtlest | `--gb-background-subtlest` | `#fafafa` | `#171717` |
| background/success/default | `--gb-background-success-default` | `#16a34a` | `#4ade80` |
| background/success/subtle | `--gb-background-success-subtle` | `#f0fdf4` | `#052e16` |
| background/surface | `--gb-background-surface` | `#ffffff` | `#171717` |
| background/surface-secondary | `--gb-background-surface-secondary` | `#fafafa` | `#262626` |
| background/warning/default | `--gb-background-warning-default` | `#f87171` | (light와 동일) |

### Border (`--gb-border-*`, 21개)

| Figma 변수명 | CSS Property | Light 값 | Dark 값 |
| --- | --- | --- | --- |
| border/bold | `--gb-border-bold` | `#737373` | (light와 동일) |
| border/bolder | `--gb-border-bolder` | `#0a0a0a` | `#fafafa` |
| border/contrast | `--gb-border-contrast` | `#ffffff` | `#000000` |
| border/default | `--gb-border-default` | `#e5e5e5` | `#404040` |
| border/default-strong | `--gb-border-default-strong` | `#fafafa` | `#171717` |
| border/error | `--gb-border-error` | `#dc2626` | `#f87171` |
| border/error-static | `--gb-border-error-static` | `#dc2626` | (light와 동일) |
| border/info | `--gb-border-info` | `#2563eb` | `#60a5fa` |
| border/invert | `--gb-border-invert` | `#171717` | `#e5e5e5` |
| border/invert-strong | `--gb-border-invert-strong` | `#171717` | `#fafafa` |
| border/mute | `--gb-border-mute` | `#828282` | (light와 동일) |
| border/mute-subtle | `--gb-border-mute-subtle` | `#a3a3a3` | (light와 동일) |
| border/muted | `--gb-border-muted` | `#737373` | `#a3a3a3` |
| border/overlay | `--gb-border-overlay` | `#ffffff` | `#262626` |
| border/selected | `--gb-border-selected` | `#f5f5f5` | `#404040` |
| border/static/gray | `--gb-border-static-gray` | `#737373` | (light와 동일) |
| border/static/white | `--gb-border-static-white` | `#ffffff` | (light와 동일) |
| border/subtle | `--gb-border-subtle` | `#e5e5e5` | `#171717` |
| border/subtler | `--gb-border-subtler` | `#f5f5f5` | `#262626` |
| border/success | `--gb-border-success` | `#16a34a` | `#4ade80` |
| border/warning | `--gb-border-warning` | `#f87171` | (light와 동일) |

### Icon (`--gb-icon-*`, 17개)

| Figma 변수명 | CSS Property | Light 값 | Dark 값 |
| --- | --- | --- | --- |
| icon/bold | `--gb-icon-bold` | `#171717` | `#e5e5e5` |
| icon/default | `--gb-icon-default` | `#0a0a0a` | `#fafafa` |
| icon/emphasis | `--gb-icon-emphasis` | `#171717` | `#fafafa` |
| icon/error | `--gb-icon-error` | `#dc2626` | `#f87171` |
| icon/error-static | `--gb-icon-error-static` | `#dc2626` | (light와 동일) |
| icon/faint | `--gb-icon-faint` | `#e5e5e5` | `#404040` |
| icon/fainter | `--gb-icon-fainter` | `#f5f5f5` | `#262626` |
| icon/info | `--gb-icon-info` | `#2563eb` | `#60a5fa` |
| icon/invert | `--gb-icon-invert` | `#fafafa` | `#171717` |
| icon/pressed | `--gb-icon-pressed` | `#e5e5e5` | `#171717` |
| icon/selected | `--gb-icon-selected` | `#f5f5f5` | `#404040` |
| icon/static/gray | `--gb-icon-static-gray` | `#737373` | (light와 동일) |
| icon/static/white | `--gb-icon-static-white` | `#ffffff` | (light와 동일) |
| icon/subtle | `--gb-icon-subtle` | `#737373` | `#a3a3a3` |
| icon/subtlest | `--gb-icon-subtlest` | `#a3a3a3` | `#737373` |
| icon/success | `--gb-icon-success` | `#16a34a` | `#4ade80` |
| icon/warning | `--gb-icon-warning` | `#f87171` | (light와 동일) |

### Text (`--gb-text-*`, 16개)

| Figma 변수명 | CSS Property | Light 값 | Dark 값 |
| --- | --- | --- | --- |
| text/bold | `--gb-text-bold` | `#171717` | `#e5e5e5` |
| text/default | `--gb-text-default` | `#0a0a0a` | `#fafafa` |
| text/emphasis | `--gb-text-emphasis` | `#171717` | `#fafafa` |
| text/error | `--gb-text-error` | `#dc2626` | `#f87171` |
| text/error-static | `--gb-text-error-static` | `#dc2626` | (light와 동일) |
| text/info | `--gb-text-info` | `#2563eb` | `#60a5fa` |
| text/invert | `--gb-text-invert` | `#fafafa` | `#171717` |
| text/popover | `--gb-text-popover` | `#ffffff` | `#262626` |
| text/selected | `--gb-text-selected` | `#f5f5f5` | `#404040` |
| text/static/gray | `--gb-text-static-gray` | `#737373` | (light와 동일) |
| text/static/white | `--gb-text-static-white` | `#ffffff` | (light와 동일) |
| text/subtle | `--gb-text-subtle` | `#737373` | `#a3a3a3` |
| text/subtler | `--gb-text-subtler` | `#828282` | (light와 동일) |
| text/subtlest | `--gb-text-subtlest` | `#a3a3a3` | `#737373` |
| text/success | `--gb-text-success` | `#16a34a` | `#4ade80` |
| text/warning | `--gb-text-warning` | `#f87171` | (light와 동일) |

## 색상 — Semantic 다크모드


### flat 계열 (2개) — light/dark 나란히 비교

| Figma 변수명            | CSS Property                    | Light 값    | Dark 값     | 참조 (node-id 7378:3500에서 확인)                                                                    |
| ----------------------- | ------------------------------- | ----------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| semantic-non changeable | --color-semantic-non-changeable | `#ffffff`   | `#ffffff`   | ✅ light/dark 모두 `var(--color-white)` — 라벨 `white` (tw 단일 primitive, "non changeable" 확인)    |
| accent-non changeable   | --color-accent-non-changeable   | `#828282`   | `#828282`   | raw 값 — 라벨도 hex 텍스트, primitive 참조 없음 ("non changeable" 확인)                              |

**요약**: 코드에 정의된 시맨틱 색은 `--color-semantic-non-changeable`과 `--color-accent-non-changeable` 둘뿐이고, 나머지 시맨틱 색은 `--gb-background-*`/`--gb-text-*`/`--gb-border-*`/`--gb-icon-*` 계열로 제공됩니다.

## 색상 — Shadcn 브릿지 변수

Tailwind v4가 `bg-primary`·`border-border` 같은 유틸리티를 만드는 데 쓰는 고정
네임스페이스입니다. 이름이 Figma 시맨틱 변수명과 겹치지만 **`--gb-` prefix를
붙이지 않습니다** — 붙이면 앱 전체의 Tailwind 유틸리티가 깨집니다.

값은 직접 선언하지 않고 `app/globals.css`에서 시맨틱 토큰을 가리킵니다.
18개 전부 Figma 값과 일치합니다.

| Shadcn 변수 | 연결된 시맨틱 토큰 | Light 값 |
| --- | --- | --- |
| `--background` | `--gb-background-default` | `#ffffff` |
| `--foreground` | `--gb-text-default` | `#0a0a0a` |
| `--card` | `--gb-background-surface` | `#ffffff` |
| `--card-foreground` | `--gb-text-default` | `#0a0a0a` |
| `--popover` | `--gb-background-overlay` | `#ffffff` |
| `--popover-foreground` | `--gb-text-default` | `#0a0a0a` |
| `--primary` | `--gb-background-bold` | `#171717` |
| `--primary-foreground` | `--gb-text-invert` | `#fafafa` |
| `--secondary` | `--gb-background-subtler` | `#f5f5f5` |
| `--secondary-foreground` | `--gb-text-default` | `#0a0a0a` |
| `--muted` | `--gb-background-subtler` | `#f5f5f5` |
| `--muted-foreground` | `--gb-text-subtle` | `#737373` |
| `--accent` | `--gb-background-selected` | `#f5f5f5` |
| `--accent-foreground` | `--gb-text-bold` | `#171717` |
| `--destructive` | `--gb-background-error-default` | `#dc2626` |
| `--border` | `--gb-border-default` | `#e5e5e5` |
| `--input` | `--gb-border-default` | `#e5e5e5` |
| `--ring` | `--gb-border-static-gray` | `#737373` |

## 색상 — Tooltip reversed variant

Figma에서 Tooltip의 `reversed`는 `default`와 **같은 변수**(`background-bold` /
`text-invert`)를 참조하되 반대 모드로 resolve되는 구조입니다. 즉 두 variant는
라이트·다크 양쪽에서 항상 서로 반대 색이어야 합니다.

| | `default` 배경 | `reversed` 배경 |
| --- | --- | --- |
| 라이트 | `#171717` | `#e5e5e5` |
| 다크 | `#e5e5e5` | `#171717` |

코드는 이 반전을 **기존 모드 대응 토큰**으로 구현합니다 — 신규 토큰을 추가하지
않았습니다.

| 용도          | 코드 CSS 변수                  | 라이트    | 다크      |
| ------------- | ------------------------------ | --------- | --------- |
| reversed 배경 | `--gb-background-mute-subtler` | `#e5e5e5` | `#171717` |
| reversed 전경 | `--gb-text-emphasis`           | `#171717` | `#fafafa` |

`components/ui/tooltip/tooltip.tsx`의 `variant.reversed`와 화살표(Arrow) div가
이 토큰을 사용합니다. `default` variant(`bg-primary text-primary-foreground`)는
기존 Shadcn 테마 변수를 그대로 씁니다.

reversed에 리터럴 hex를 고정하면 안 됩니다 — 다크모드에서 `--primary`가
`#e5e5e5`로 resolve되어 `default`와 같은 색이 됩니다.

## 타이포그래피

⚠️ **Figma Variable이 아니라 "Design Token" 문서 섹션(프레임 `DS — tw/font`,
node-id `7370:476`, "tw/font — 41개")에 하드코딩된 값입니다.** Figma에 실제
Variable/Style이 생기면 재추출 필요.

이 프레임은 size(13) / weight(9) / leading(13, line-height) / tracking(6,
letter-spacing) **4개의 독립된 스케일**로 구성되어 있고, 하나의 이름(step)에 4개
속성이 함께 묶여 있지 않습니다(예: `xs`는 size 스케일에만 존재). 그래서
`--text-*`, `--font-weight-*`, `--leading-*`, `--font-tracking-*` 4개
그룹으로 나눠 구성했습니다.

font-family는 이 프레임에 없고, `DS — Text Styles` 프레임 설명 텍스트("Inter 기반
118개 스타일")에서 "Inter"를 확인해 `--gb-font-sans`로 추가했습니다.

### Font Size (`--gb-text-*`)

| Figma 이름(step) | CSS Property     | 값      |
| ---------------- | ---------------- | ------- |
| xxs              | `--gb-text-xxs`  | `10px`  |
| xs               | `--gb-text-xs`   | `12px`  |
| sm               | `--gb-text-sm`   | `14px`  |
| base             | `--gb-text-base` | `16px`  |
| lg               | `--gb-text-lg`   | `18px`  |
| xl               | `--gb-text-xl`   | `20px`  |
| 2xl              | `--gb-text-2xl`  | `24px`  |
| 3xl              | `--gb-text-3xl`  | `30px`  |
| 4xl              | `--gb-text-4xl`  | `36px`  |
| 5xl              | `--gb-text-5xl`  | `48px`  |
| 6xl              | `--gb-text-6xl`  | `60px`  |
| 7xl              | `--gb-text-7xl`  | `72px`  |
| 8xl              | `--gb-text-8xl`  | `96px`  |
| 9xl              | `--gb-text-9xl`  | `128px` |

### Font Weight (`--gb-font-weight-*`)

| Figma 이름(step) | CSS Property             | 값    |
| ---------------- | ------------------------ | ----- |
| thin             | `--gb-font-weight-thin`       | `100` |
| extralight       | `--gb-font-weight-extralight` | `200` |
| light            | `--gb-font-weight-light`      | `300` |
| normal           | `--gb-font-weight-normal`     | `400` |
| medium           | `--gb-font-weight-medium`     | `500` |
| semibold         | `--gb-font-weight-semibold`   | `600` |
| bold             | `--gb-font-weight-bold`       | `700` |
| extrabold        | `--gb-font-weight-extrabold`  | `800` |
| black            | `--gb-font-weight-black`      | `900` |

### Line Height / leading (`--gb-leading-*`, 절대 px)

| Figma 이름(step) | CSS Property      | 값      |
| ---------------- | ----------------- | ------- |
| 3                | `--gb-leading-3`  | `12px`  |
| 4                | `--gb-leading-4`  | `16px`  |
| 5                | `--gb-leading-5`  | `20px`  |
| 6                | `--gb-leading-6`  | `24px`  |
| 7                | `--gb-leading-7`  | `28px`  |
| 8                | `--gb-leading-8`  | `32px`  |
| 9                | `--gb-leading-9`  | `36px`  |
| 10               | `--gb-leading-10` | `40px`  |
| 12               | `--gb-leading-12` | `48px`  |
| 15               | `--gb-leading-15` | `60px`  |
| 18               | `--gb-leading-18` | `72px`  |
| 24               | `--gb-leading-24` | `96px`  |
| 32               | `--gb-leading-32` | `128px` |

### Letter Spacing / tracking (`--gb-tracking-*`, px, 16px 기준)

| Figma 이름(step) | CSS Property            | 값       |
| ---------------- | ----------------------- | -------- |
| normal           | `--gb-tracking-normal`  | `0px`    |

### Text Style (완성된 스타일 클래스, `--gb-font-*` 조합)

Figma `DS — Text Styles` 프레임(node-id `7372:2`)의 118개 스타일(size 13 ×
weight 9 + Time Stamp 1)을 `.text-{size}-{weight}` 클래스(kebab-case, 예:
`.text-xs-black`, `.text-4xl-extra-bold`)로 생성. 생성 파일:
`src/tokens/text-styles.css`.

구조:

- font-weight 9개, font-size 13개는 기존 `--font-weight-*`/`--text-*`와 1:1 일치
- line-height는 size 그룹별로 정확히 1개 값(weight 무관 고정)이며 기존
  `--leading-*` 13개 값과 전부 일치 (`lg`/`xl`은 `leading-7`을 공유)
- letter-spacing은 118개 전부 `tracking/normal → 0` (`--tracking-normal`),
  다른 tracking 값은 Text Style에 사용되지 않음
- font-family는 `Time Stamp`만 Bitcount Grid Single이고 나머지는 `family/sans`다.
  `app/layout.tsx`의 next/font가 만든 `--font-time-stamp` 변수를 참조한다

#### Time Stamp (1)

| 클래스             | font-family                                 | font-weight                    | font-size                   | line-height                 | letter-spacing                   |
| ------------------ | ------------------------------------------- | ------------------------------ | --------------------------- | --------------------------- | -------------------------------- |
| `.text-time-stamp` | `var(--font-time-stamp)` (next/font 생성, 폴백 `monospace`) | `--font-weight-normal` (`400`) | `--text-base` (`16px`) | `--leading-3` (`12px`) | `--tracking-normal` (`0px`) |

#### Text-xs (9)

| 클래스                 | font-weight                        | font-size                 | line-height                 | letter-spacing                   |
| ---------------------- | ---------------------------------- | ------------------------- | --------------------------- | -------------------------------- |
| `.text-xs-black`       | `--font-weight-black` (`900`)      | `--text-xs` (`12px`) | `--leading-4` (`16px`) | `--tracking-normal` (`0px`) |
| `.text-xs-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-xs` (`12px`) | `--leading-4` (`16px`) | `--tracking-normal` (`0px`) |
| `.text-xs-bold`        | `--font-weight-bold` (`700`)       | `--text-xs` (`12px`) | `--leading-4` (`16px`) | `--tracking-normal` (`0px`) |
| `.text-xs-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-xs` (`12px`) | `--leading-4` (`16px`) | `--tracking-normal` (`0px`) |
| `.text-xs-medium`      | `--font-weight-medium` (`500`)     | `--text-xs` (`12px`) | `--leading-4` (`16px`) | `--tracking-normal` (`0px`) |
| `.text-xs-regular`     | `--font-weight-normal` (`400`)     | `--text-xs` (`12px`) | `--leading-4` (`16px`) | `--tracking-normal` (`0px`) |
| `.text-xs-light`       | `--font-weight-light` (`300`)      | `--text-xs` (`12px`) | `--leading-4` (`16px`) | `--tracking-normal` (`0px`) |
| `.text-xs-extra-light` | `--font-weight-extralight` (`200`) | `--text-xs` (`12px`) | `--leading-4` (`16px`) | `--tracking-normal` (`0px`) |
| `.text-xs-thin`        | `--font-weight-thin` (`100`)       | `--text-xs` (`12px`) | `--leading-4` (`16px`) | `--tracking-normal` (`0px`) |

#### Text-sm (9)

| 클래스                 | font-weight                        | font-size                 | line-height                 | letter-spacing                   |
| ---------------------- | ---------------------------------- | ------------------------- | --------------------------- | -------------------------------- |
| `.text-sm-black`       | `--font-weight-black` (`900`)      | `--text-sm` (`14px`) | `--leading-5` (`20px`) | `--tracking-normal` (`0px`) |
| `.text-sm-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-sm` (`14px`) | `--leading-5` (`20px`) | `--tracking-normal` (`0px`) |
| `.text-sm-bold`        | `--font-weight-bold` (`700`)       | `--text-sm` (`14px`) | `--leading-5` (`20px`) | `--tracking-normal` (`0px`) |
| `.text-sm-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-sm` (`14px`) | `--leading-5` (`20px`) | `--tracking-normal` (`0px`) |
| `.text-sm-medium`      | `--font-weight-medium` (`500`)     | `--text-sm` (`14px`) | `--leading-5` (`20px`) | `--tracking-normal` (`0px`) |
| `.text-sm-regular`     | `--font-weight-normal` (`400`)     | `--text-sm` (`14px`) | `--leading-5` (`20px`) | `--tracking-normal` (`0px`) |
| `.text-sm-light`       | `--font-weight-light` (`300`)      | `--text-sm` (`14px`) | `--leading-5` (`20px`) | `--tracking-normal` (`0px`) |
| `.text-sm-extra-light` | `--font-weight-extralight` (`200`) | `--text-sm` (`14px`) | `--leading-5` (`20px`) | `--tracking-normal` (`0px`) |
| `.text-sm-thin`        | `--font-weight-thin` (`100`)       | `--text-sm` (`14px`) | `--leading-5` (`20px`) | `--tracking-normal` (`0px`) |

#### Text-base (9)

| 클래스                   | font-weight                        | font-size                   | line-height                 | letter-spacing                   |
| ------------------------ | ---------------------------------- | --------------------------- | --------------------------- | -------------------------------- |
| `.text-base-black`       | `--font-weight-black` (`900`)      | `--text-base` (`16px`) | `--leading-6` (`24px`) | `--tracking-normal` (`0px`) |
| `.text-base-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-base` (`16px`) | `--leading-6` (`24px`) | `--tracking-normal` (`0px`) |
| `.text-base-bold`        | `--font-weight-bold` (`700`)       | `--text-base` (`16px`) | `--leading-6` (`24px`) | `--tracking-normal` (`0px`) |
| `.text-base-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-base` (`16px`) | `--leading-6` (`24px`) | `--tracking-normal` (`0px`) |
| `.text-base-medium`      | `--font-weight-medium` (`500`)     | `--text-base` (`16px`) | `--leading-6` (`24px`) | `--tracking-normal` (`0px`) |
| `.text-base-regular`     | `--font-weight-normal` (`400`)     | `--text-base` (`16px`) | `--leading-6` (`24px`) | `--tracking-normal` (`0px`) |
| `.text-base-light`       | `--font-weight-light` (`300`)      | `--text-base` (`16px`) | `--leading-6` (`24px`) | `--tracking-normal` (`0px`) |
| `.text-base-extra-light` | `--font-weight-extralight` (`200`) | `--text-base` (`16px`) | `--leading-6` (`24px`) | `--tracking-normal` (`0px`) |
| `.text-base-thin`        | `--font-weight-thin` (`100`)       | `--text-base` (`16px`) | `--leading-6` (`24px`) | `--tracking-normal` (`0px`) |

#### Text-lg (9)

| 클래스                 | font-weight                        | font-size                 | line-height                 | letter-spacing                   |
| ---------------------- | ---------------------------------- | ------------------------- | --------------------------- | -------------------------------- |
| `.text-lg-black`       | `--font-weight-black` (`900`)      | `--text-lg` (`18px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-lg-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-lg` (`18px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-lg-bold`        | `--font-weight-bold` (`700`)       | `--text-lg` (`18px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-lg-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-lg` (`18px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-lg-medium`      | `--font-weight-medium` (`500`)     | `--text-lg` (`18px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-lg-regular`     | `--font-weight-normal` (`400`)     | `--text-lg` (`18px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-lg-light`       | `--font-weight-light` (`300`)      | `--text-lg` (`18px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-lg-extra-light` | `--font-weight-extralight` (`200`) | `--text-lg` (`18px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-lg-thin`        | `--font-weight-thin` (`100`)       | `--text-lg` (`18px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |

#### Text-xl (9)

| 클래스                 | font-weight                        | font-size                 | line-height                 | letter-spacing                   |
| ---------------------- | ---------------------------------- | ------------------------- | --------------------------- | -------------------------------- |
| `.text-xl-black`       | `--font-weight-black` (`900`)      | `--text-xl` (`20px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-xl` (`20px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-xl-bold`        | `--font-weight-bold` (`700`)       | `--text-xl` (`20px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-xl` (`20px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-xl-medium`      | `--font-weight-medium` (`500`)     | `--text-xl` (`20px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-xl-regular`     | `--font-weight-normal` (`400`)     | `--text-xl` (`20px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-xl-light`       | `--font-weight-light` (`300`)      | `--text-xl` (`20px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-xl-extra-light` | `--font-weight-extralight` (`200`) | `--text-xl` (`20px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |
| `.text-xl-thin`        | `--font-weight-thin` (`100`)       | `--text-xl` (`20px`) | `--leading-7` (`28px`) | `--tracking-normal` (`0px`) |

#### Text-2xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                 | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | --------------------------- | -------------------------------- |
| `.text-2xl-black`       | `--font-weight-black` (`900`)      | `--text-2xl` (`24px`) | `--leading-8` (`32px`) | `--tracking-normal` (`0px`) |
| `.text-2xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-2xl` (`24px`) | `--leading-8` (`32px`) | `--tracking-normal` (`0px`) |
| `.text-2xl-bold`        | `--font-weight-bold` (`700`)       | `--text-2xl` (`24px`) | `--leading-8` (`32px`) | `--tracking-normal` (`0px`) |
| `.text-2xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-2xl` (`24px`) | `--leading-8` (`32px`) | `--tracking-normal` (`0px`) |
| `.text-2xl-medium`      | `--font-weight-medium` (`500`)     | `--text-2xl` (`24px`) | `--leading-8` (`32px`) | `--tracking-normal` (`0px`) |
| `.text-2xl-regular`     | `--font-weight-normal` (`400`)     | `--text-2xl` (`24px`) | `--leading-8` (`32px`) | `--tracking-normal` (`0px`) |
| `.text-2xl-light`       | `--font-weight-light` (`300`)      | `--text-2xl` (`24px`) | `--leading-8` (`32px`) | `--tracking-normal` (`0px`) |
| `.text-2xl-extra-light` | `--font-weight-extralight` (`200`) | `--text-2xl` (`24px`) | `--leading-8` (`32px`) | `--tracking-normal` (`0px`) |
| `.text-2xl-thin`        | `--font-weight-thin` (`100`)       | `--text-2xl` (`24px`) | `--leading-8` (`32px`) | `--tracking-normal` (`0px`) |

#### Text-3xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                 | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | --------------------------- | -------------------------------- |
| `.text-3xl-black`       | `--font-weight-black` (`900`)      | `--text-3xl` (`30px`) | `--leading-9` (`36px`) | `--tracking-normal` (`0px`) |
| `.text-3xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-3xl` (`30px`) | `--leading-9` (`36px`) | `--tracking-normal` (`0px`) |
| `.text-3xl-bold`        | `--font-weight-bold` (`700`)       | `--text-3xl` (`30px`) | `--leading-9` (`36px`) | `--tracking-normal` (`0px`) |
| `.text-3xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-3xl` (`30px`) | `--leading-9` (`36px`) | `--tracking-normal` (`0px`) |
| `.text-3xl-medium`      | `--font-weight-medium` (`500`)     | `--text-3xl` (`30px`) | `--leading-9` (`36px`) | `--tracking-normal` (`0px`) |
| `.text-3xl-regular`     | `--font-weight-normal` (`400`)     | `--text-3xl` (`30px`) | `--leading-9` (`36px`) | `--tracking-normal` (`0px`) |
| `.text-3xl-light`       | `--font-weight-light` (`300`)      | `--text-3xl` (`30px`) | `--leading-9` (`36px`) | `--tracking-normal` (`0px`) |
| `.text-3xl-extra-light` | `--font-weight-extralight` (`200`) | `--text-3xl` (`30px`) | `--leading-9` (`36px`) | `--tracking-normal` (`0px`) |
| `.text-3xl-thin`        | `--font-weight-thin` (`100`)       | `--text-3xl` (`30px`) | `--leading-9` (`36px`) | `--tracking-normal` (`0px`) |

#### Text-4xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                  | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | ---------------------------- | -------------------------------- |
| `.text-4xl-black`       | `--font-weight-black` (`900`)      | `--text-4xl` (`36px`) | `--leading-10` (`40px`) | `--tracking-normal` (`0px`) |
| `.text-4xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-4xl` (`36px`) | `--leading-10` (`40px`) | `--tracking-normal` (`0px`) |
| `.text-4xl-bold`        | `--font-weight-bold` (`700`)       | `--text-4xl` (`36px`) | `--leading-10` (`40px`) | `--tracking-normal` (`0px`) |
| `.text-4xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-4xl` (`36px`) | `--leading-10` (`40px`) | `--tracking-normal` (`0px`) |
| `.text-4xl-medium`      | `--font-weight-medium` (`500`)     | `--text-4xl` (`36px`) | `--leading-10` (`40px`) | `--tracking-normal` (`0px`) |
| `.text-4xl-regular`     | `--font-weight-normal` (`400`)     | `--text-4xl` (`36px`) | `--leading-10` (`40px`) | `--tracking-normal` (`0px`) |
| `.text-4xl-light`       | `--font-weight-light` (`300`)      | `--text-4xl` (`36px`) | `--leading-10` (`40px`) | `--tracking-normal` (`0px`) |
| `.text-4xl-extra-light` | `--font-weight-extralight` (`200`) | `--text-4xl` (`36px`) | `--leading-10` (`40px`) | `--tracking-normal` (`0px`) |
| `.text-4xl-thin`        | `--font-weight-thin` (`100`)       | `--text-4xl` (`36px`) | `--leading-10` (`40px`) | `--tracking-normal` (`0px`) |

#### Text-5xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                  | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | ---------------------------- | -------------------------------- |
| `.text-5xl-black`       | `--font-weight-black` (`900`)      | `--text-5xl` (`48px`) | `--leading-12` (`48px`) | `--tracking-normal` (`0px`) |
| `.text-5xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-5xl` (`48px`) | `--leading-12` (`48px`) | `--tracking-normal` (`0px`) |
| `.text-5xl-bold`        | `--font-weight-bold` (`700`)       | `--text-5xl` (`48px`) | `--leading-12` (`48px`) | `--tracking-normal` (`0px`) |
| `.text-5xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-5xl` (`48px`) | `--leading-12` (`48px`) | `--tracking-normal` (`0px`) |
| `.text-5xl-medium`      | `--font-weight-medium` (`500`)     | `--text-5xl` (`48px`) | `--leading-12` (`48px`) | `--tracking-normal` (`0px`) |
| `.text-5xl-regular`     | `--font-weight-normal` (`400`)     | `--text-5xl` (`48px`) | `--leading-12` (`48px`) | `--tracking-normal` (`0px`) |
| `.text-5xl-light`       | `--font-weight-light` (`300`)      | `--text-5xl` (`48px`) | `--leading-12` (`48px`) | `--tracking-normal` (`0px`) |
| `.text-5xl-extra-light` | `--font-weight-extralight` (`200`) | `--text-5xl` (`48px`) | `--leading-12` (`48px`) | `--tracking-normal` (`0px`) |
| `.text-5xl-thin`        | `--font-weight-thin` (`100`)       | `--text-5xl` (`48px`) | `--leading-12` (`48px`) | `--tracking-normal` (`0px`) |

#### Text-6xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                  | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | ---------------------------- | -------------------------------- |
| `.text-6xl-black`       | `--font-weight-black` (`900`)      | `--text-6xl` (`60px`) | `--leading-15` (`60px`) | `--tracking-normal` (`0px`) |
| `.text-6xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-6xl` (`60px`) | `--leading-15` (`60px`) | `--tracking-normal` (`0px`) |
| `.text-6xl-bold`        | `--font-weight-bold` (`700`)       | `--text-6xl` (`60px`) | `--leading-15` (`60px`) | `--tracking-normal` (`0px`) |
| `.text-6xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-6xl` (`60px`) | `--leading-15` (`60px`) | `--tracking-normal` (`0px`) |
| `.text-6xl-medium`      | `--font-weight-medium` (`500`)     | `--text-6xl` (`60px`) | `--leading-15` (`60px`) | `--tracking-normal` (`0px`) |
| `.text-6xl-regular`     | `--font-weight-normal` (`400`)     | `--text-6xl` (`60px`) | `--leading-15` (`60px`) | `--tracking-normal` (`0px`) |
| `.text-6xl-light`       | `--font-weight-light` (`300`)      | `--text-6xl` (`60px`) | `--leading-15` (`60px`) | `--tracking-normal` (`0px`) |
| `.text-6xl-extra-light` | `--font-weight-extralight` (`200`) | `--text-6xl` (`60px`) | `--leading-15` (`60px`) | `--tracking-normal` (`0px`) |
| `.text-6xl-thin`        | `--font-weight-thin` (`100`)       | `--text-6xl` (`60px`) | `--leading-15` (`60px`) | `--tracking-normal` (`0px`) |

#### Text-7xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                  | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | ---------------------------- | -------------------------------- |
| `.text-7xl-black`       | `--font-weight-black` (`900`)      | `--text-7xl` (`72px`) | `--leading-18` (`72px`) | `--tracking-normal` (`0px`) |
| `.text-7xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-7xl` (`72px`) | `--leading-18` (`72px`) | `--tracking-normal` (`0px`) |
| `.text-7xl-bold`        | `--font-weight-bold` (`700`)       | `--text-7xl` (`72px`) | `--leading-18` (`72px`) | `--tracking-normal` (`0px`) |
| `.text-7xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-7xl` (`72px`) | `--leading-18` (`72px`) | `--tracking-normal` (`0px`) |
| `.text-7xl-medium`      | `--font-weight-medium` (`500`)     | `--text-7xl` (`72px`) | `--leading-18` (`72px`) | `--tracking-normal` (`0px`) |
| `.text-7xl-regular`     | `--font-weight-normal` (`400`)     | `--text-7xl` (`72px`) | `--leading-18` (`72px`) | `--tracking-normal` (`0px`) |
| `.text-7xl-light`       | `--font-weight-light` (`300`)      | `--text-7xl` (`72px`) | `--leading-18` (`72px`) | `--tracking-normal` (`0px`) |
| `.text-7xl-extra-light` | `--font-weight-extralight` (`200`) | `--text-7xl` (`72px`) | `--leading-18` (`72px`) | `--tracking-normal` (`0px`) |
| `.text-7xl-thin`        | `--font-weight-thin` (`100`)       | `--text-7xl` (`72px`) | `--leading-18` (`72px`) | `--tracking-normal` (`0px`) |

#### Text-8xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                  | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | ---------------------------- | -------------------------------- |
| `.text-8xl-black`       | `--font-weight-black` (`900`)      | `--text-8xl` (`96px`) | `--leading-24` (`96px`) | `--tracking-normal` (`0px`) |
| `.text-8xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-8xl` (`96px`) | `--leading-24` (`96px`) | `--tracking-normal` (`0px`) |
| `.text-8xl-bold`        | `--font-weight-bold` (`700`)       | `--text-8xl` (`96px`) | `--leading-24` (`96px`) | `--tracking-normal` (`0px`) |
| `.text-8xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-8xl` (`96px`) | `--leading-24` (`96px`) | `--tracking-normal` (`0px`) |
| `.text-8xl-medium`      | `--font-weight-medium` (`500`)     | `--text-8xl` (`96px`) | `--leading-24` (`96px`) | `--tracking-normal` (`0px`) |
| `.text-8xl-regular`     | `--font-weight-normal` (`400`)     | `--text-8xl` (`96px`) | `--leading-24` (`96px`) | `--tracking-normal` (`0px`) |
| `.text-8xl-light`       | `--font-weight-light` (`300`)      | `--text-8xl` (`96px`) | `--leading-24` (`96px`) | `--tracking-normal` (`0px`) |
| `.text-8xl-extra-light` | `--font-weight-extralight` (`200`) | `--text-8xl` (`96px`) | `--leading-24` (`96px`) | `--tracking-normal` (`0px`) |
| `.text-8xl-thin`        | `--font-weight-thin` (`100`)       | `--text-8xl` (`96px`) | `--leading-24` (`96px`) | `--tracking-normal` (`0px`) |

#### Text-9xl (9)

| 클래스                  | font-weight                        | font-size                   | line-height                   | letter-spacing                   |
| ----------------------- | ---------------------------------- | --------------------------- | ----------------------------- | -------------------------------- |
| `.text-9xl-black`       | `--font-weight-black` (`900`)      | `--text-9xl` (`128px`) | `--leading-32` (`128px`) | `--tracking-normal` (`0px`) |
| `.text-9xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--text-9xl` (`128px`) | `--leading-32` (`128px`) | `--tracking-normal` (`0px`) |
| `.text-9xl-bold`        | `--font-weight-bold` (`700`)       | `--text-9xl` (`128px`) | `--leading-32` (`128px`) | `--tracking-normal` (`0px`) |
| `.text-9xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--text-9xl` (`128px`) | `--leading-32` (`128px`) | `--tracking-normal` (`0px`) |
| `.text-9xl-medium`      | `--font-weight-medium` (`500`)     | `--text-9xl` (`128px`) | `--leading-32` (`128px`) | `--tracking-normal` (`0px`) |
| `.text-9xl-regular`     | `--font-weight-normal` (`400`)     | `--text-9xl` (`128px`) | `--leading-32` (`128px`) | `--tracking-normal` (`0px`) |
| `.text-9xl-light`       | `--font-weight-light` (`300`)      | `--text-9xl` (`128px`) | `--leading-32` (`128px`) | `--tracking-normal` (`0px`) |
| `.text-9xl-extra-light` | `--font-weight-extralight` (`200`) | `--text-9xl` (`128px`) | `--leading-32` (`128px`) | `--tracking-normal` (`0px`) |
| `.text-9xl-thin`        | `--font-weight-thin` (`100`)       | `--text-9xl` (`128px`) | `--leading-32` (`128px`) | `--tracking-normal` (`0px`) |

## Radius

⚠️ **Figma Variable이 아니라 "Design Token" 문서 섹션(프레임 `DS — tw/border-radius`,
node-id `7370:672`, "tw/border-radius — 10개")에 하드코딩된 값입니다.** Figma에
실제 Variable이 생기면 재추출 필요.

⚠️ **이름 충돌**: `app/globals.css`에 이미 Shadcn 기본 `--radius`, `--radius-sm`,
`--radius-md`, `--radius-lg`, `--radius-xl`이 있어 `rounded-sm/md/lg/xl` 이름을
그대로 쓰면 충돌합니다. 그래서 `src/tokens/radius.css`의 모든 변수는
`--radius-scale-*` 접두사로 분리했고, 기존 Shadcn `--radius*` 변수는 건드리지
않았습니다.

| Figma 이름   | CSS Property        | 값                         |
| ------------ | ------------------- | -------------------------- |
| rounded-none | `--gb-radius-scale-none` | `0px`                      |
| rounded-xs   | `--gb-radius-scale-xs`   | `2px`                      |
| rounded-sm   | `--gb-radius-scale-sm`   | `6px`                      |
| rounded-md   | `--gb-radius-scale-md`   | `8px`                      |
| rounded-lg   | `--gb-radius-scale-lg`   | `10px`                     |
| rounded-xl   | `--gb-radius-scale-xl`   | `14px`                     |
| rounded-2xl  | `--gb-radius-scale-2xl`  | `18px`                     |
| rounded-3xl  | `--gb-radius-scale-3xl`  | `22px`                     |
| rounded-4xl  | `--gb-radius-scale-4xl`  | `26px`                     |
| rounded-full | `--gb-radius-scale-full` | `9999px` (Figma 표기: `∞`) |

## Effect (Shadow/Blur)

Source: Figma `DS — Effect Styles` 프레임(node-id `7372:457`), 27개 전체 반영.

Figma 그룹명 `Box Shadow/shadow-*` → CSS `--shadow-*` (그룹명 "Box Shadow"는
"shadow" 접두사와 중복되어 변수명에서 생략). 값은 여러 `DROP_SHADOW` 이펙트를
CSS `box-shadow` 문법(`offset-x offset-y blur spread color`, 콤마로 다중 연결)으로 변환.
`INNER_SHADOW`는 `inset` 키워드를 앞에 붙여 변환. `Layer Blur`/`Backdrop Blur`
그룹은 각각 CSS `filter`/`backdrop-filter`에 그대로 대입 가능한 `blur(Npx)` 값으로 변환.

| Figma 변수명                     | CSS Property         | 값                                                          | 용도                                                            |
| -------------------------------- | -------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- |
| Box Shadow/shadow-2xs            | `--gb-shadow-2xs`         | `0px 1px 0px 0px #0000000d`                                 | 최소 그림자                                                     |
| Box Shadow/shadow-xs             | `--gb-shadow-xs`          | `0px 1px 2px 0px #0000001a`                                 | 아주 옅은 그림자                                                |
| Box Shadow/shadow-sm             | `--gb-shadow-sm`          | `0px 1px 3px 0px #0000001a`                                 | 작은 그림자                                                     |
| Box Shadow/shadow-md             | `--gb-shadow-md`          | `0px 2px 4px -2px #0000001a, 0px 4px 6px -1px #0000001a`    | 중간 그림자 (카드 등)                                           |
| Box Shadow/shadow-lg             | `--gb-shadow-lg`          | `0px 4px 6px -4px #0000001a, 0px 10px 15px -3px #0000001a`  | 큰 그림자 (팝오버 등)                                           |
| Box Shadow/shadow-xl             | `--gb-shadow-xl`          | `0px 8px 10px -6px #0000001a, 0px 20px 25px -5px #0000001a` | 매우 큰 그림자                                                  |
| Box Shadow/shadow-2xl            | `--gb-shadow-2xl`         | `0px 25px 50px -12px #00000040`                             | 최대 그림자 (모달 등)                                           |
| Box Shadow/shadow-inner          | `--gb-shadow-inner`       | `inset 0px 2px 4px 0px #0000000f`                           | 내부 그림자 (INNER_SHADOW, 예: 인풋 눌림 효과)                  |
| Box Shadow/shadow-none           | `--gb-shadow-none`        | `0px 0px 0px 0px #00000000`                                 | 그림자 없음 (투명, 리셋용)                                      |
| Box Shadow/Focus ring            | `--gb-shadow-focus-ring`  | `0px 0px 0px 3px #a1a1a180`                                 | 포커스 상태 아웃라인 (box-shadow 링, spread 3px)                |
| Box Shadow/Destructive           | `--gb-shadow-destructive` | `0px 0px 0px 3px #dc262633`                                 | 위험/삭제 액션 포커스·에러 링 (box-shadow 링, spread 3px)       |
| Backdrop Blur/backdrop-blur-none | `--gb-backdrop-blur-none` | `blur(0px)`                                                 | 배경 블러 없음                                                  |
| Backdrop Blur/backdrop-blur-sm   | `--gb-backdrop-blur-sm`   | `blur(4px)`                                                 | 배경 블러 (옅음)                                                |
| Backdrop Blur/backdrop-blur      | `--gb-backdrop-blur-8`    | `blur(8px)`                                                 | 배경 블러 (기본값, Figma 이름에 접미사 없어 값을 이름에 사용)   |
| Backdrop Blur/backdrop-blur-md   | `--gb-backdrop-blur-md`   | `blur(12px)`                                                | 배경 블러 (중간)                                                |
| Backdrop Blur/backdrop-blur-lg   | `--gb-backdrop-blur-lg`   | `blur(16px)`                                                | 배경 블러 (큼)                                                  |
| Backdrop Blur/backdrop-blur-xl   | `--gb-backdrop-blur-xl`   | `blur(24px)`                                                | 배경 블러 (매우 큼)                                             |
| Backdrop Blur/backdrop-blur-2xl  | `--gb-backdrop-blur-2xl`  | `blur(40px)`                                                | 배경 블러 (초대형)                                              |
| Backdrop Blur/backdrop-blur-3xl  | `--gb-backdrop-blur-3xl`  | `blur(64px)`                                                | 배경 블러 (최대)                                                |
| Blur/blur-none                   | `--gb-blur-none`          | `blur(0px)`                                                 | 레이어 블러 없음                                                |
| Blur/blur-sm                     | `--gb-blur-sm`            | `blur(4px)`                                                 | 레이어 블러 (옅음)                                              |
| Blur/blur                        | `--gb-blur-8`             | `blur(8px)`                                                 | 레이어 블러 (기본값, Figma 이름에 접미사 없어 값을 이름에 사용) |
| Blur/blur-md                     | `--gb-blur-md`            | `blur(12px)`                                                | 레이어 블러 (중간)                                              |
| Blur/blur-lg                     | `--gb-blur-lg`            | `blur(16px)`                                                | 레이어 블러 (큼)                                                |
| Blur/blur-xl                     | `--gb-blur-xl`            | `blur(24px)`                                                | 레이어 블러 (매우 큼)                                           |
| Blur/blur-2xl                    | `--gb-blur-2xl`           | `blur(40px)`                                                | 레이어 블러 (초대형)                                            |
| Blur/blur-3xl                    | `--gb-blur-3xl`           | `blur(64px)`                                                | 레이어 블러 (최대)                                              |

Effect Styles 컬렉션 전체 27개(Box Shadow 11 + Backdrop Blur 8 + Blur 8)를
모두 확인해 반영했습니다. 미반영 항목 없음.

## Spacing / Border (`--gb-spacing-*`, `--gb-border-*`)

Figma Variable이 아니라 Figma 문서 섹션으로 정리된 값입니다.

**Spacing** — gap과 padding을 하나의 스케일로 통합했습니다(22스텝). 방향별
전용 변수는 없고, 방향이 필요하면 속성별로 각각 적용합니다
(예: `pl-[var(--gb-spacing-3)] pr-[var(--gb-spacing-2)]`). 좌우 값이 다른
컴포넌트(예: `textarea.tsx`)를 억지로 통일하지 않습니다.

컴포넌트 자체 크기(높이·너비)에는 쓰지 않습니다 — Figma 확정값을 리터럴
px로 적습니다(예: `h-[36px]`).

| CSS Property | 값 |
| --- | --- |
| `--gb-spacing-0` | `0px` |
| `--gb-spacing-0-5` | `2px` |
| `--gb-spacing-1` | `4px` |
| `--gb-spacing-1-5` | `6px` |
| `--gb-spacing-2` | `8px` |
| `--gb-spacing-2-5` | `10px` |
| `--gb-spacing-3` | `12px` |
| `--gb-spacing-3-5` | `14px` |
| `--gb-spacing-4` | `16px` |
| `--gb-spacing-5` | `20px` |
| `--gb-spacing-6` | `24px` |
| `--gb-spacing-7` | `28px` |
| `--gb-spacing-8` | `32px` |
| `--gb-spacing-9` | `36px` |
| `--gb-spacing-10` | `40px` |
| `--gb-spacing-11` | `44px` |
| `--gb-spacing-12` | `48px` |
| `--gb-spacing-16` | `64px` |
| `--gb-spacing-20` | `80px` |
| `--gb-spacing-24` | `96px` |
| `--gb-spacing-32` | `128px` |
| `--gb-spacing-64` | `256px` |

**Border** — stroke-width와 border-width를 하나의 스케일로 통합했습니다.
보더 두께에만 쓰고, 색은 `--gb-border-*` 시맨틱 색 토큰을 씁니다
(예: `border-[length:var(--gb-border-1)] border-[var(--gb-border-default)]`).

| CSS Property | 값 |
| --- | --- |
| `--gb-border-0` | `0px` |
| `--gb-border-1` | `1px` |
| `--gb-border-2` | `2px` |
| `--gb-border-3` | `3px` |

## Opacity (`--gb-opacity-*`)

⚠️ **Figma Variable이 아니라 "Design Token" 문서 섹션(프레임 `DS —
tw/opacity`, node-id `7370:731`, "tw/opacity — 21개")에 하드코딩된 값입니다.**
Figma에 실제 Variable이 생기면 재추출 필요.

구조: Tailwind opacity 스케일과 동일하게 0~100을 5 단위로 증가(21스텝). Figma
라벨은 단위 없는 정수(0~100)로 표기되어 있어, CSS `opacity`(0~1 소수)에
대입 가능하도록 100으로 나눈 소수값으로 변환했습니다(예: 50 → 0.5).

| CSS Property | 값 |
| --- | --- |
| `--gb-opacity-0` | `0` |
| `--gb-opacity-5` | `0.05` |
| `--gb-opacity-10` | `0.1` |
| `--gb-opacity-15` | `0.15` |
| `--gb-opacity-20` | `0.2` |
| `--gb-opacity-25` | `0.25` |
| `--gb-opacity-30` | `0.3` |
| `--gb-opacity-35` | `0.35` |
| `--gb-opacity-40` | `0.4` |
| `--gb-opacity-45` | `0.45` |
| `--gb-opacity-50` | `0.5` |
| `--gb-opacity-55` | `0.55` |
| `--gb-opacity-60` | `0.6` |
| `--gb-opacity-65` | `0.65` |
| `--gb-opacity-70` | `0.7` |
| `--gb-opacity-75` | `0.75` |
| `--gb-opacity-80` | `0.8` |
| `--gb-opacity-85` | `0.85` |
| `--gb-opacity-90` | `0.9` |
| `--gb-opacity-95` | `0.95` |
| `--gb-opacity-100` | `1` |

## 생성된 토큰 파일

| 파일                         | 내용                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `src/tokens/colors.css`      | Primitive 85 (실사용 7팔레트 + `white`/`black` 등) + Semantic 80(`:root`) + `.dark` 오버라이드 58 + `.light` 강제 스코프 80 |
| `src/tokens/effects.css`     | 27개 전체 (Box Shadow 11 + Backdrop Blur 8 + Blur 8)                                                                        |
| `src/tokens/typography.css`  | size 14(`--gb-text-*`) + leading 13 + weight 9 + tracking 1 + family 1 = 38 (Figma Variable 아님) |
| `src/tokens/spacing.css`     | gap+padding 통합 단일 스케일 22개 (Figma Variable 아님) |
| `src/tokens/radius.css`      | 10개, `--gb-radius-scale-*` (Figma Variable 아님) |
| `src/tokens/border.css`      | stroke-width+border-width 통합 4개 (`--gb-border-0`~`--gb-border-3`) |
| `src/tokens/opacity.css`     | 21개, `--gb-opacity-*` (Figma Variable 아님) |
| `src/tokens/text-styles.css` | 클래스 127개, `.text-{size}-{weight}` + `.text-time-stamp` |

`app/globals.css` 최상단에 다음 import가 있습니다.

```css
@import "tailwindcss";
@import "../src/tokens/colors.css";
@import "../src/tokens/effects.css";
@import "../src/tokens/typography.css";
@import "../src/tokens/spacing.css";
@import "../src/tokens/radius.css";
@import "../src/tokens/border.css";
@import "../src/tokens/opacity.css";
@import "../src/tokens/text-styles.css";
```

## Claude용 규칙

1. Figma MCP가 hex 색상 반환 → 이 테이블에서 찾아서 `var(--color-*)` 사용
2. Figma가 spacing/padding/gap/border 숫자 반환 → `src/tokens/spacing.css`의
   `--spacing-*`(padding+gap 통합 단일 스케일) 또는
   `src/tokens/border.css`의 `--border-*`(border-width+stroke-width 통합)에서
   가장 가까운 값을 찾아 사용. 방향별(top/right/bottom/left) 전용 변수는 더 이상
   없으므로, 방향이 필요하면 이 스케일 값을 속성별로 개별 적용할 것(좌우 값이
   다르면 강제로 통일하지 말 것).
3. Figma가 radius 숫자 반환 → `src/tokens/radius.css`의 `--radius-scale-*` 사용.
   기존 Shadcn `--radius`, `--radius-sm/md/lg/xl`과 이름이 다르므로 혼동 주의
   (Shadcn 값을 임의로 대체하지 말 것).
4. Figma가 폰트 size/weight/line-height/letter-spacing 반환 → `src/tokens/typography.css`의
   `--text-*` / `--font-weight-*` / `--leading-*` / `--font-tracking-*`
   에서 각각 가장 가까운 값을 찾아 사용 (하나의 번들 토큰이 아니라 4개의 독립 스케일).
5. 테이블에 없는 값 → 새 변수 만들지 말고 `/* ⚠️ 누락된 토큰 */` 플래그
6. `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`,
   `destructive`, `border`, `input`, `ring` 및 각 `-foreground` 변형은 이미
   `app/globals.css`에 Shadcn 기본값으로 정의되어 있으므로 **그대로 사용**
   (Figma 값과 다를 수 있음 — 위 "충돌" 표 참고, 임의로 덮어쓰지 말 것)
