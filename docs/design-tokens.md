# 디자인 토큰 매핑 테이블

> Figma 변수명 ↔ CSS custom property 매핑.
> Claude Code가 Figma 디자인 구현 시 이 문서를 참조합니다.
> 토큰 추가/변경 시 이 문서도 업데이트하세요.
>
> Source: Figma `PrsHuyyra9LzqqrDwmrB5P`, node-id `4111-3488`
> (📌 GB_Design-System) — `get_variable_defs` 전체 추출 결과 기준.

## ⚠️ 2026-09-17: "Design Token" 문서 페이지(`4111:3488`) 삭제됨

이 문서 상단의 `node-id 4111-3488` 참조는 더 이상 유효하지 않습니다 — 사용자가
Figma에서 해당 페이지를 오래된 문서라 판단해 직접 삭제했습니다. Figma의
Variable은 페이지(캔버스)에 종속되지 않는 별도 리소스라 삭제된 것은 이 값들을
시각적으로 정리해두던 문서 페이지일 뿐, 실제 토큰 값에는 영향이 없습니다.
같은 날 사용자가 gap/padding/border-width/stroke-width 변수 구조 자체도
재정리했고(아래 "Spacing / Border" 절 참고), 그 결과를 코드에 반영했습니다.

## 네이밍 규칙

Figma `/` → CSS `-` 변환. 예: `color/bg/primary` → `--color-bg-primary`

## ⚠️ 2026-08-01 재정리 시 발견된 구조 변경 (중요)

이전 조사 시점 대비 Figma "Design Token" 섹션(`4111:3488`)의 **하위 노드 ID가 전부
변경**되었고(예: 이전 `4112:2666` → 현재 `4122:6583`), 컬렉션 구성 자체도 대폭
확장되었습니다. 이번 재정리는 이 변경된 구조를 기준으로 다시 조사한 결과입니다.

- 이전: 컬렉션 1개(색상 166 + effect 7), typography/spacing/radius 변수 없음으로 파악.
- 현재: **11개 Variable Collection**(`674 COLOR + 406 FLOAT` 변수), Effect Styles
  27개, Text Styles 118개. 구체적으로:
  - `tw/colors` — 244개 (Tailwind 팔레트, 이 문서의 "Primitive 팔레트"가 여기 포함)
  - `rdx/colors` — 396개 (Radix UI 팔레트 — **이번에 처음 발견**, 기존 `colors.css`에
    전혀 반영되어 있지 않음)
  - `mode (Semantic)` — 34개, light/dark 모드별 값 (기존 `colors.css`의 semantic
    alias 부분에 해당하나, **dark 모드 값은 기존 파일에 전혀 없었음**)
  - `tw/gap` — 34개 (이번 스페이싱 추출 대상)
  - `tw/border-radius` — 10개 (이번 radius 추출 대상)
  - `tw/font` — 41개 (이번 타이포그래피 추출 대상 — size/weight/leading/tracking)
  - `tokens` — 89개 (다른 컬렉션이 참조하는 범용 원시 숫자 스케일)
  - `tw/padding`(175), `tw/border-width`(25), `tw/stroke-width`(11), `tw/opacity`(21)
    — ✅ **2026-08-01 후속 작업으로 반영 완료** (아래 각 절 참고)

이번 색상/effect 재검수는 **기존 `colors.css`/`effects.css`에 이미 있는 값이 현재
Figma 값과 일치하는지**만 확인했고, 위에서 새로 발견된 `rdx/colors`, dark 모드 값,
추가 effect(Backdrop Blur/Blur 등)는 **이번 파일에는 반영하지 않았습니다** (범위 밖 —
아래 "색상/Effect 재검수 결과" 절 참고, 별도 승인 후 진행 권장).

## 색상/Effect 재검수 결과 (2026-08-01)

- **`src/tokens/colors.css`의 기존 132개 primitive 값** (slate/gray/neutral/red/orange/
  amber/green/blue/indigo/violet/purple/pink, 12팔레트 × 11스텝): 현재 Figma
  `tw/colors` 컬렉션과 **hex 값 전부 일치**. 변경 없음.
- **`src/tokens/effects.css`의 기존 7개 그림자값** (`shadow-2xs` ~ `shadow-2xl`):
  현재 Figma `DS — Effect Styles`(27개 Effect Style 중 `Box Shadow/*`)와 offset/
  blur/spread/color **전부 일치**. 변경 없음.
- **Semantic alias(`sidebar-*`, `warning`, `success`) 근거 재확인**: 이번에 Figma
  `mode (Semantic)` 프레임(34개, light/dark 페어)을 직접 조회해 light **및 dark** 값을
  모두 확인했습니다.
  - `warning`: light `#2563eb`(=blue/600), dark `#60a5fa`(=blue/400) — 둘 다 Tailwind
    blue 팔레트의 정확한 스텝과 일치하고, "라이트 600 / 다크 400" 패턴은 Tailwind
    다크모드 관례와 정확히 일치합니다. **alias라는 이전 추론을 강하게 뒷받침**.
  - `success`: light `#16a34a`(=green/600), dark `#4ade80`(=green/400) — 위와 동일한
    패턴으로 alias 추론을 뒷받침.
  - `sidebar`, `sidebar-foreground`, `sidebar-accent`, `sidebar-accent-foreground`,
    `sidebar-border`: light/dark 값 모두 neutral 팔레트의 정확한 스텝과 일치 (예:
    `sidebar-border` light `#e5e5e5`=neutral/200, dark `#404040`=neutral/700) —
    alias 추론을 뒷받침.
  - `sidebar-ring`, `sidebar-primary-foreground`: light=dark로 값이 동일 (`#737373`,
    `#fafafa`) — neutral/500, neutral/50과 각각 일치.
  - ⚠️ **`sidebar-primary` dark 값 `#646464`는 `tw/colors`(neutral 등) 어떤 팔레트와도
    일치하지 않습니다.** 대신 새로 발견한 `rdx/colors` 컬렉션의 `gray/11`이 정확히
    `#646464`입니다. 즉 이 토큰만 다크모드에서 `tw` 팔레트가 아니라 `rdx/colors`
    팔레트를 참조하는 것으로 보입니다 (컬렉션을 넘나드는 참조) — **완전히 새로운
    발견이며, 여전히 "resolve된 값 일치"로 추론한 것**이라 Figma 변수 패널에서 직접
    확인을 권장합니다 (⚠️ FLAG).
  - 여전히 `get_variable_defs`/메타데이터는 resolve된 최종값만 제공하므로, alias
    관계 자체(실제 Variable 참조 여부)는 "값 완전 일치"로 추론한 것입니다. 다만 이번엔
    light/dark 두 값이 각각 정확한 스텝에 동시에 일치한다는 점에서 이전보다 근거가
    보강되었습니다.
  - ⚠️ **dark 모드 값 자체는 기존 `colors.css`/`docs/design-tokens.md`에 전혀
    반영되어 있지 않았습니다.** 이번 작업 범위(typography/spacing/radius 추출)에는
    포함되지 않아 파일을 수정하지 않았지만, 별도 후속 작업으로 dark 모드 대응을
    권장합니다 (⚠️ FLAG).
- **새로 발견 — 미반영 항목 (이번 범위 밖, 파일 미변경)**:
  - `rdx/colors`(Radix UI 팔레트, 396개)는 `colors.css`에 전혀 없음.
  - ✅ **2026-08-01 후속 작업으로 반영 완료**: `rdx/colors` 396개 전체를
    `--color-rdx-*` 접두사로 `colors.css`에 추가했고, semantic alias 16개도
    rdx/colors와 재대조했습니다. 자세한 내용은 아래 "색상 — Primitive
    (Radix, `rdx/colors`)" 절과 "색상 — Semantic 다크모드" 절 참고.

### 2026-08-01 추가 반영 — `tw/colors` 나머지 팔레트

이전 재정리에서 미반영으로 남겨두었던 `tw/colors`의 나머지 10팔레트(각 11스텝) +
단일 값 2개(`white`, `black`)를 이번에 `get_variable_defs`로 `tw/colors` 컬렉션
전체(244개)를 재조회해 추출하고 `colors.css`에 반영했습니다.

- 팔레트 이름은 사전 추정(zinc, stone, emerald, teal, cyan, sky, fuchsia, rose,
  lime, yellow)과 **정확히 일치**했습니다.
- 검증: `slate`(11) + `gray`(11) + `zinc`(11) + `neutral`(11) + `stone`(11) +
  `red`(11) + `orange`(11) + `amber`(11) + `green`(11) + `emerald`(11) +
  `teal`(11) + `cyan`(11) + `sky`(11) + `indigo`(11) + `violet`(11) +
  `purple`(11) + `fuchsia`(11) + `pink`(11) + `rose`(11) + `lime`(11) +
  `yellow`(11) + `blue`(11) = 22팔레트 × 11스텝 = 242개, + `white` + `black`
  단일 값 2개 = **정확히 244개**로 Figma `DS — Overview`의 `tw/colors — 244개`와
  일치를 재확인했습니다.
- 기존 12팔레트(slate/gray/neutral/red/orange/amber/green/blue/indigo/violet/
  purple/pink) 132개 값도 이번 재조회 결과와 hex 전부 일치 — 기존 값은 그대로
  유지하고 건드리지 않았습니다.
- `white`/`black`은 스텝이 없는 단일 값이라 `--color-white`, `--color-black`으로
  별도 선언(`/* Primitive - Base (단일 값, 스텝 없음) */` 섹션).
  - `DS — Effect Styles`(27개) 중 `shadow-inner`, `shadow-none`, `Box Shadow/Focus
ring`, `Box Shadow/Destructive` 4개와, `Backdrop Blur/*` 8개, `Blur/*` 8개
    (총 20개)가 `effects.css`(7개)에 없음.
  - ✅ **2026-08-01 후속 작업으로 반영 완료**: 위 20개 전체를 `DS — Effect
Styles` 프레임(node-id `4122-8696`)에서 재조회해 `effects.css`에 추가했습니다
    (`--shadow-inner`, `--shadow-none`, `--shadow-focus-ring`,
    `--shadow-destructive`, `--backdrop-blur-*` 8개, `--blur-*` 8개). 자세한
    내용은 아래 "Effect (Shadow/Blur)" 절 참고. 이제 Effect Styles 27개 전체가
    `effects.css`에 반영되어 미반영 항목 없음.

## 색상 — Primitive 팔레트

Figma 변수명은 `<컬러명>/<스텝>` 형식 (예: `slate/50`)이며, CSS에서는
`--color-<컬러명>-<스텝>`으로 변환했습니다. 총 22개 팔레트 × 11스텝 = 242개 +
단일 값(`white`, `black`) 2개 = `tw/colors` 컬렉션 전체 244개.

### Slate

| Figma 변수명 | CSS Property      | 값        | 용도                    |
| ------------ | ----------------- | --------- | ----------------------- |
| slate/50     | --color-slate-50  | `#f8fafc` | Primitive (가장 밝음)   |
| slate/100    | --color-slate-100 | `#f1f5f9` | Primitive               |
| slate/200    | --color-slate-200 | `#e2e8f0` | Primitive               |
| slate/300    | --color-slate-300 | `#cbd5e1` | Primitive               |
| slate/400    | --color-slate-400 | `#94a3b8` | Primitive               |
| slate/500    | --color-slate-500 | `#64748b` | Primitive               |
| slate/600    | --color-slate-600 | `#475569` | Primitive               |
| slate/700    | --color-slate-700 | `#334155` | Primitive               |
| slate/800    | --color-slate-800 | `#1e293b` | Primitive               |
| slate/900    | --color-slate-900 | `#0f172a` | Primitive               |
| slate/950    | --color-slate-950 | `#020617` | Primitive (가장 어두움) |

### Gray

| Figma 변수명 | CSS Property     | 값        | 용도      |
| ------------ | ---------------- | --------- | --------- |
| gray/50      | --color-gray-50  | `#f9fafb` | Primitive |
| gray/100     | --color-gray-100 | `#f3f4f6` | Primitive |
| gray/200     | --color-gray-200 | `#e5e7eb` | Primitive |
| gray/300     | --color-gray-300 | `#d1d5db` | Primitive |
| gray/400     | --color-gray-400 | `#9ca3af` | Primitive |
| gray/500     | --color-gray-500 | `#6b7280` | Primitive |
| gray/600     | --color-gray-600 | `#4b5563` | Primitive |
| gray/700     | --color-gray-700 | `#374151` | Primitive |
| gray/800     | --color-gray-800 | `#1f2937` | Primitive |
| gray/900     | --color-gray-900 | `#111827` | Primitive |
| gray/950     | --color-gray-950 | `#030712` | Primitive |

### Neutral

| Figma 변수명 | CSS Property        | 값        | 용도      |
| ------------ | ------------------- | --------- | --------- |
| neutral/50   | --color-neutral-50  | `#fafafa` | Primitive |
| neutral/100  | --color-neutral-100 | `#f5f5f5` | Primitive |
| neutral/200  | --color-neutral-200 | `#e5e5e5` | Primitive |
| neutral/300  | --color-neutral-300 | `#d4d4d4` | Primitive |
| neutral/400  | --color-neutral-400 | `#a3a3a3` | Primitive |
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

### Amber

| Figma 변수명 | CSS Property      | 값        | 용도      |
| ------------ | ----------------- | --------- | --------- |
| amber/50     | --color-amber-50  | `#fffbeb` | Primitive |
| amber/100    | --color-amber-100 | `#fef3c7` | Primitive |
| amber/200    | --color-amber-200 | `#fde68a` | Primitive |
| amber/300    | --color-amber-300 | `#fcd34d` | Primitive |
| amber/400    | --color-amber-400 | `#fbbf24` | Primitive |
| amber/500    | --color-amber-500 | `#f59e0b` | Primitive |
| amber/600    | --color-amber-600 | `#d97706` | Primitive |
| amber/700    | --color-amber-700 | `#b45309` | Primitive |
| amber/800    | --color-amber-800 | `#92400e` | Primitive |
| amber/900    | --color-amber-900 | `#78350f` | Primitive |
| amber/950    | --color-amber-950 | `#451a03` | Primitive |

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

### Indigo

| Figma 변수명 | CSS Property       | 값        | 용도      |
| ------------ | ------------------ | --------- | --------- |
| indigo/50    | --color-indigo-50  | `#eef2ff` | Primitive |
| indigo/100   | --color-indigo-100 | `#e0e7ff` | Primitive |
| indigo/200   | --color-indigo-200 | `#c7d2fe` | Primitive |
| indigo/300   | --color-indigo-300 | `#a5b4fc` | Primitive |
| indigo/400   | --color-indigo-400 | `#818cf8` | Primitive |
| indigo/500   | --color-indigo-500 | `#6366f1` | Primitive |
| indigo/600   | --color-indigo-600 | `#4f46e5` | Primitive |
| indigo/700   | --color-indigo-700 | `#4338ca` | Primitive |
| indigo/800   | --color-indigo-800 | `#3730a3` | Primitive |
| indigo/900   | --color-indigo-900 | `#312e81` | Primitive |
| indigo/950   | --color-indigo-950 | `#1e1b4b` | Primitive |

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

### Purple

| Figma 변수명 | CSS Property       | 값        | 용도      |
| ------------ | ------------------ | --------- | --------- |
| purple/50    | --color-purple-50  | `#faf5ff` | Primitive |
| purple/100   | --color-purple-100 | `#f3e8ff` | Primitive |
| purple/200   | --color-purple-200 | `#e9d5ff` | Primitive |
| purple/300   | --color-purple-300 | `#d8b4fe` | Primitive |
| purple/400   | --color-purple-400 | `#c084fc` | Primitive |
| purple/500   | --color-purple-500 | `#a855f7` | Primitive |
| purple/600   | --color-purple-600 | `#9333ea` | Primitive |
| purple/700   | --color-purple-700 | `#7e22ce` | Primitive |
| purple/800   | --color-purple-800 | `#6b21a8` | Primitive |
| purple/900   | --color-purple-900 | `#581c87` | Primitive |
| purple/950   | --color-purple-950 | `#3b0764` | Primitive |

### Pink

| Figma 변수명 | CSS Property     | 값        | 용도      |
| ------------ | ---------------- | --------- | --------- |
| pink/50      | --color-pink-50  | `#fdf2f8` | Primitive |
| pink/100     | --color-pink-100 | `#fce7f3` | Primitive |
| pink/200     | --color-pink-200 | `#fbcfe8` | Primitive |
| pink/300     | --color-pink-300 | `#f9a8d4` | Primitive |
| pink/400     | --color-pink-400 | `#f472b6` | Primitive |
| pink/500     | --color-pink-500 | `#ec4899` | Primitive |
| pink/600     | --color-pink-600 | `#db2777` | Primitive |
| pink/700     | --color-pink-700 | `#be185d` | Primitive |
| pink/800     | --color-pink-800 | `#9d174d` | Primitive |
| pink/900     | --color-pink-900 | `#831843` | Primitive |
| pink/950     | --color-pink-950 | `#500724` | Primitive |

### Zinc

| Figma 변수명 | CSS Property     | 값        | 용도      |
| ------------ | ---------------- | --------- | --------- |
| zinc/50      | --color-zinc-50  | `#fafafa` | Primitive |
| zinc/100     | --color-zinc-100 | `#f4f4f5` | Primitive |
| zinc/200     | --color-zinc-200 | `#e4e4e7` | Primitive |
| zinc/300     | --color-zinc-300 | `#d4d4d8` | Primitive |
| zinc/400     | --color-zinc-400 | `#a1a1aa` | Primitive |
| zinc/500     | --color-zinc-500 | `#71717a` | Primitive |
| zinc/600     | --color-zinc-600 | `#52525b` | Primitive |
| zinc/700     | --color-zinc-700 | `#3f3f46` | Primitive |
| zinc/800     | --color-zinc-800 | `#27272a` | Primitive |
| zinc/900     | --color-zinc-900 | `#18181b` | Primitive |
| zinc/950     | --color-zinc-950 | `#09090b` | Primitive |

### Stone

| Figma 변수명 | CSS Property      | 값        | 용도      |
| ------------ | ----------------- | --------- | --------- |
| stone/50     | --color-stone-50  | `#fafaf9` | Primitive |
| stone/100    | --color-stone-100 | `#f5f5f4` | Primitive |
| stone/200    | --color-stone-200 | `#e7e5e4` | Primitive |
| stone/300    | --color-stone-300 | `#d6d3d1` | Primitive |
| stone/400    | --color-stone-400 | `#a8a29e` | Primitive |
| stone/500    | --color-stone-500 | `#78716c` | Primitive |
| stone/600    | --color-stone-600 | `#57534e` | Primitive |
| stone/700    | --color-stone-700 | `#44403c` | Primitive |
| stone/800    | --color-stone-800 | `#292524` | Primitive |
| stone/900    | --color-stone-900 | `#1c1917` | Primitive |
| stone/950    | --color-stone-950 | `#0c0a09` | Primitive |

### Emerald

| Figma 변수명 | CSS Property        | 값        | 용도      |
| ------------ | ------------------- | --------- | --------- |
| emerald/50   | --color-emerald-50  | `#ecfdf5` | Primitive |
| emerald/100  | --color-emerald-100 | `#d1fae5` | Primitive |
| emerald/200  | --color-emerald-200 | `#a7f3d0` | Primitive |
| emerald/300  | --color-emerald-300 | `#6ee7b7` | Primitive |
| emerald/400  | --color-emerald-400 | `#34d399` | Primitive |
| emerald/500  | --color-emerald-500 | `#10b981` | Primitive |
| emerald/600  | --color-emerald-600 | `#059669` | Primitive |
| emerald/700  | --color-emerald-700 | `#047857` | Primitive |
| emerald/800  | --color-emerald-800 | `#065f46` | Primitive |
| emerald/900  | --color-emerald-900 | `#064e3b` | Primitive |
| emerald/950  | --color-emerald-950 | `#022c22` | Primitive |

### Teal

| Figma 변수명 | CSS Property     | 값        | 용도      |
| ------------ | ---------------- | --------- | --------- |
| teal/50      | --color-teal-50  | `#f0fdfa` | Primitive |
| teal/100     | --color-teal-100 | `#ccfbf1` | Primitive |
| teal/200     | --color-teal-200 | `#99f6e4` | Primitive |
| teal/300     | --color-teal-300 | `#5eead4` | Primitive |
| teal/400     | --color-teal-400 | `#2dd4bf` | Primitive |
| teal/500     | --color-teal-500 | `#14b8a6` | Primitive |
| teal/600     | --color-teal-600 | `#0d9488` | Primitive |
| teal/700     | --color-teal-700 | `#0f766e` | Primitive |
| teal/800     | --color-teal-800 | `#115e59` | Primitive |
| teal/900     | --color-teal-900 | `#134e4a` | Primitive |
| teal/950     | --color-teal-950 | `#042f2e` | Primitive |

### Cyan

| Figma 변수명 | CSS Property     | 값        | 용도      |
| ------------ | ---------------- | --------- | --------- |
| cyan/50      | --color-cyan-50  | `#ecfeff` | Primitive |
| cyan/100     | --color-cyan-100 | `#cffafe` | Primitive |
| cyan/200     | --color-cyan-200 | `#a5f3fc` | Primitive |
| cyan/300     | --color-cyan-300 | `#67e8f9` | Primitive |
| cyan/400     | --color-cyan-400 | `#22d3ee` | Primitive |
| cyan/500     | --color-cyan-500 | `#06b6d4` | Primitive |
| cyan/600     | --color-cyan-600 | `#0891b2` | Primitive |
| cyan/700     | --color-cyan-700 | `#0e7490` | Primitive |
| cyan/800     | --color-cyan-800 | `#155e75` | Primitive |
| cyan/900     | --color-cyan-900 | `#164e63` | Primitive |
| cyan/950     | --color-cyan-950 | `#083344` | Primitive |

### Sky

| Figma 변수명 | CSS Property    | 값        | 용도      |
| ------------ | --------------- | --------- | --------- |
| sky/50       | --color-sky-50  | `#f0f9ff` | Primitive |
| sky/100      | --color-sky-100 | `#e0f2fe` | Primitive |
| sky/200      | --color-sky-200 | `#bae6fd` | Primitive |
| sky/300      | --color-sky-300 | `#7dd3fc` | Primitive |
| sky/400      | --color-sky-400 | `#38bdf8` | Primitive |
| sky/500      | --color-sky-500 | `#0ea5e9` | Primitive |
| sky/600      | --color-sky-600 | `#0284c7` | Primitive |
| sky/700      | --color-sky-700 | `#0369a1` | Primitive |
| sky/800      | --color-sky-800 | `#075985` | Primitive |
| sky/900      | --color-sky-900 | `#0c4a6e` | Primitive |
| sky/950      | --color-sky-950 | `#082f49` | Primitive |

### Fuchsia

| Figma 변수명 | CSS Property        | 값        | 용도      |
| ------------ | ------------------- | --------- | --------- |
| fuchsia/50   | --color-fuchsia-50  | `#fdf4ff` | Primitive |
| fuchsia/100  | --color-fuchsia-100 | `#fae8ff` | Primitive |
| fuchsia/200  | --color-fuchsia-200 | `#f5d0fe` | Primitive |
| fuchsia/300  | --color-fuchsia-300 | `#f0abfc` | Primitive |
| fuchsia/400  | --color-fuchsia-400 | `#e879f9` | Primitive |
| fuchsia/500  | --color-fuchsia-500 | `#d946ef` | Primitive |
| fuchsia/600  | --color-fuchsia-600 | `#c026d3` | Primitive |
| fuchsia/700  | --color-fuchsia-700 | `#a21caf` | Primitive |
| fuchsia/800  | --color-fuchsia-800 | `#86198f` | Primitive |
| fuchsia/900  | --color-fuchsia-900 | `#701a75` | Primitive |
| fuchsia/950  | --color-fuchsia-950 | `#4a044e` | Primitive |

### Rose

| Figma 변수명 | CSS Property     | 값        | 용도      |
| ------------ | ---------------- | --------- | --------- |
| rose/50      | --color-rose-50  | `#fff1f2` | Primitive |
| rose/100     | --color-rose-100 | `#ffe4e6` | Primitive |
| rose/200     | --color-rose-200 | `#fecdd3` | Primitive |
| rose/300     | --color-rose-300 | `#fda4af` | Primitive |
| rose/400     | --color-rose-400 | `#fb7185` | Primitive |
| rose/500     | --color-rose-500 | `#f43f5e` | Primitive |
| rose/600     | --color-rose-600 | `#e11d48` | Primitive |
| rose/700     | --color-rose-700 | `#be123c` | Primitive |
| rose/800     | --color-rose-800 | `#9f1239` | Primitive |
| rose/900     | --color-rose-900 | `#881337` | Primitive |
| rose/950     | --color-rose-950 | `#4c0519` | Primitive |

### Lime

| Figma 변수명 | CSS Property     | 값        | 용도      |
| ------------ | ---------------- | --------- | --------- |
| lime/50      | --color-lime-50  | `#f7fee7` | Primitive |
| lime/100     | --color-lime-100 | `#ecfccb` | Primitive |
| lime/200     | --color-lime-200 | `#d9f99d` | Primitive |
| lime/300     | --color-lime-300 | `#bef264` | Primitive |
| lime/400     | --color-lime-400 | `#a3e635` | Primitive |
| lime/500     | --color-lime-500 | `#84cc16` | Primitive |
| lime/600     | --color-lime-600 | `#65a30d` | Primitive |
| lime/700     | --color-lime-700 | `#4d7c0f` | Primitive |
| lime/800     | --color-lime-800 | `#3f6212` | Primitive |
| lime/900     | --color-lime-900 | `#365314` | Primitive |
| lime/950     | --color-lime-950 | `#1a2e05` | Primitive |

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

## 색상 — Primitive (Radix, `rdx/colors`)

Figma `rdx/colors` Variable Collection(396개)을 `get_variable_defs`로
"DS — rdx/colors" 프레임(node-id `4122:6875`)에 직접 호출해 전체 조회했습니다.
Figma 변수명은 `<컬러명>/<스텝>` 형식(예: `gray/11`)이며, CSS에서는
`--color-rdx-<컬러명>-<스텝>`으로 변환했습니다(tw/colors와 이름 충돌 방지).

**구성**: 33개 팔레트 × 12스텝(1~~12) = 396. tw/colors(22팔레트×11스텝)와
스텝 체계 자체가 다릅니다(1~~12 vs 50~950). 33개 팔레트 중 31개는 색상
팔레트(gray/mauve/slate/sage/olive/sand — 6개 그레이 스케일 +
tomato/red/ruby/crimson/pink/plum/purple/violet/iris/indigo/blue/cyan/teal/
jade/green/grass/bronze/gold/brown/orange/amber/yellow/lime/mint/sky — 25개
액센트 색상), 나머지 2개(`black`, `white`)는 색상 스텝이 아니라 검정/흰색
**알파(opacity) 스케일**입니다
(예: `black/1`=`#0000000d`(약 5% 불투명도) ~ `black/12`=`#000000f2`(약 95%)).

### Gray

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| gray/1       | --color-rdx-gray-1  | `#fcfcfc` |
| gray/2       | --color-rdx-gray-2  | `#f9f9f9` |
| gray/3       | --color-rdx-gray-3  | `#f0f0f0` |
| gray/4       | --color-rdx-gray-4  | `#e8e8e8` |
| gray/5       | --color-rdx-gray-5  | `#e0e0e0` |
| gray/6       | --color-rdx-gray-6  | `#d9d9d9` |
| gray/7       | --color-rdx-gray-7  | `#cecece` |
| gray/8       | --color-rdx-gray-8  | `#bbbbbb` |
| gray/9       | --color-rdx-gray-9  | `#8d8d8d` |
| gray/10      | --color-rdx-gray-10 | `#838383` |
| gray/11      | --color-rdx-gray-11 | `#646464` |
| gray/12      | --color-rdx-gray-12 | `#202020` |

### Mauve

| Figma 변수명 | CSS Property         | 값        |
| ------------ | -------------------- | --------- |
| mauve/1      | --color-rdx-mauve-1  | `#fdfcfd` |
| mauve/2      | --color-rdx-mauve-2  | `#faf9fb` |
| mauve/3      | --color-rdx-mauve-3  | `#f2eff3` |
| mauve/4      | --color-rdx-mauve-4  | `#eae7ec` |
| mauve/5      | --color-rdx-mauve-5  | `#e3dfe6` |
| mauve/6      | --color-rdx-mauve-6  | `#dbd8e0` |
| mauve/7      | --color-rdx-mauve-7  | `#d0cdd7` |
| mauve/8      | --color-rdx-mauve-8  | `#bcbac7` |
| mauve/9      | --color-rdx-mauve-9  | `#8e8c99` |
| mauve/10     | --color-rdx-mauve-10 | `#84828e` |
| mauve/11     | --color-rdx-mauve-11 | `#65636d` |
| mauve/12     | --color-rdx-mauve-12 | `#211f26` |

### Slate

| Figma 변수명 | CSS Property         | 값        |
| ------------ | -------------------- | --------- |
| slate/1      | --color-rdx-slate-1  | `#fcfcfd` |
| slate/2      | --color-rdx-slate-2  | `#f9f9fb` |
| slate/3      | --color-rdx-slate-3  | `#f0f0f3` |
| slate/4      | --color-rdx-slate-4  | `#e8e8ec` |
| slate/5      | --color-rdx-slate-5  | `#e0e1e6` |
| slate/6      | --color-rdx-slate-6  | `#d9d9e0` |
| slate/7      | --color-rdx-slate-7  | `#cdced6` |
| slate/8      | --color-rdx-slate-8  | `#b9bbc6` |
| slate/9      | --color-rdx-slate-9  | `#8b8d98` |
| slate/10     | --color-rdx-slate-10 | `#80838d` |
| slate/11     | --color-rdx-slate-11 | `#60646c` |
| slate/12     | --color-rdx-slate-12 | `#1c2024` |

### Sage

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| sage/1       | --color-rdx-sage-1  | `#fbfdfc` |
| sage/2       | --color-rdx-sage-2  | `#f7f9f8` |
| sage/3       | --color-rdx-sage-3  | `#eeeeff` |
| sage/4       | --color-rdx-sage-4  | `#e6e9e8` |
| sage/5       | --color-rdx-sage-5  | `#dfe2e0` |
| sage/6       | --color-rdx-sage-6  | `#d7dad9` |
| sage/7       | --color-rdx-sage-7  | `#cbcfcd` |
| sage/8       | --color-rdx-sage-8  | `#b8bcba` |
| sage/9       | --color-rdx-sage-9  | `#868e8b` |
| sage/10      | --color-rdx-sage-10 | `#7c8481` |
| sage/11      | --color-rdx-sage-11 | `#5f6563` |
| sage/12      | --color-rdx-sage-12 | `#1a211e` |

### Olive

| Figma 변수명 | CSS Property         | 값        |
| ------------ | -------------------- | --------- |
| olive/1      | --color-rdx-olive-1  | `#fcfdfc` |
| olive/2      | --color-rdx-olive-2  | `#f8faf8` |
| olive/3      | --color-rdx-olive-3  | `#eff1ef` |
| olive/4      | --color-rdx-olive-4  | `#e7e9e7` |
| olive/5      | --color-rdx-olive-5  | `#dfe2df` |
| olive/6      | --color-rdx-olive-6  | `#d7dad7` |
| olive/7      | --color-rdx-olive-7  | `#cccfcc` |
| olive/8      | --color-rdx-olive-8  | `#b9bcb8` |
| olive/9      | --color-rdx-olive-9  | `#898e87` |
| olive/10     | --color-rdx-olive-10 | `#7f847d` |
| olive/11     | --color-rdx-olive-11 | `#60655f` |
| olive/12     | --color-rdx-olive-12 | `#1d211c` |

### Sand

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| sand/1       | --color-rdx-sand-1  | `#fdfdfc` |
| sand/2       | --color-rdx-sand-2  | `#f9f9f8` |
| sand/3       | --color-rdx-sand-3  | `#f1f0ef` |
| sand/4       | --color-rdx-sand-4  | `#e9e8e6` |
| sand/5       | --color-rdx-sand-5  | `#e2e1de` |
| sand/6       | --color-rdx-sand-6  | `#dad9d6` |
| sand/7       | --color-rdx-sand-7  | `#cfceca` |
| sand/8       | --color-rdx-sand-8  | `#bcbbb5` |
| sand/9       | --color-rdx-sand-9  | `#8d8d86` |
| sand/10      | --color-rdx-sand-10 | `#82827c` |
| sand/11      | --color-rdx-sand-11 | `#63635e` |
| sand/12      | --color-rdx-sand-12 | `#21201c` |

### Tomato

| Figma 변수명 | CSS Property          | 값        |
| ------------ | --------------------- | --------- |
| tomato/1     | --color-rdx-tomato-1  | `#fffcfc` |
| tomato/2     | --color-rdx-tomato-2  | `#fff8f7` |
| tomato/3     | --color-rdx-tomato-3  | `#feebe7` |
| tomato/4     | --color-rdx-tomato-4  | `#ffdcd3` |
| tomato/5     | --color-rdx-tomato-5  | `#ffcdc2` |
| tomato/6     | --color-rdx-tomato-6  | `#fdbdaf` |
| tomato/7     | --color-rdx-tomato-7  | `#f5a898` |
| tomato/8     | --color-rdx-tomato-8  | `#ec8e7b` |
| tomato/9     | --color-rdx-tomato-9  | `#e54d2e` |
| tomato/10    | --color-rdx-tomato-10 | `#dd4425` |
| tomato/11    | --color-rdx-tomato-11 | `#d13415` |
| tomato/12    | --color-rdx-tomato-12 | `#5c271f` |

### Red

| Figma 변수명 | CSS Property       | 값        |
| ------------ | ------------------ | --------- |
| red/1        | --color-rdx-red-1  | `#fffcfc` |
| red/2        | --color-rdx-red-2  | `#fff7f7` |
| red/3        | --color-rdx-red-3  | `#feebec` |
| red/4        | --color-rdx-red-4  | `#ffdbdc` |
| red/5        | --color-rdx-red-5  | `#ffcdce` |
| red/6        | --color-rdx-red-6  | `#fdbdbe` |
| red/7        | --color-rdx-red-7  | `#f4a9aa` |
| red/8        | --color-rdx-red-8  | `#eb8e90` |
| red/9        | --color-rdx-red-9  | `#e5484d` |
| red/10       | --color-rdx-red-10 | `#dc3e42` |
| red/11       | --color-rdx-red-11 | `#ce2c31` |
| red/12       | --color-rdx-red-12 | `#641723` |

### Ruby

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| ruby/1       | --color-rdx-ruby-1  | `#fffcfd` |
| ruby/2       | --color-rdx-ruby-2  | `#fff7f8` |
| ruby/3       | --color-rdx-ruby-3  | `#feeaed` |
| ruby/4       | --color-rdx-ruby-4  | `#ffdce1` |
| ruby/5       | --color-rdx-ruby-5  | `#ffced6` |
| ruby/6       | --color-rdx-ruby-6  | `#f8bfc8` |
| ruby/7       | --color-rdx-ruby-7  | `#efacb8` |
| ruby/8       | --color-rdx-ruby-8  | `#e592a3` |
| ruby/9       | --color-rdx-ruby-9  | `#e54666` |
| ruby/10      | --color-rdx-ruby-10 | `#dc3b5d` |
| ruby/11      | --color-rdx-ruby-11 | `#ca244d` |
| ruby/12      | --color-rdx-ruby-12 | `#64172b` |

### Crimson

| Figma 변수명 | CSS Property           | 값        |
| ------------ | ---------------------- | --------- |
| crimson/1    | --color-rdx-crimson-1  | `#fffcfd` |
| crimson/2    | --color-rdx-crimson-2  | `#fef7f9` |
| crimson/3    | --color-rdx-crimson-3  | `#ffe9f0` |
| crimson/4    | --color-rdx-crimson-4  | `#fedce7` |
| crimson/5    | --color-rdx-crimson-5  | `#facedd` |
| crimson/6    | --color-rdx-crimson-6  | `#f3bed1` |
| crimson/7    | --color-rdx-crimson-7  | `#eaacc3` |
| crimson/8    | --color-rdx-crimson-8  | `#e093b2` |
| crimson/9    | --color-rdx-crimson-9  | `#e93d82` |
| crimson/10   | --color-rdx-crimson-10 | `#df3478` |
| crimson/11   | --color-rdx-crimson-11 | `#cb1d63` |
| crimson/12   | --color-rdx-crimson-12 | `#621639` |

### Pink

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| pink/1       | --color-rdx-pink-1  | `#fffcfe` |
| pink/2       | --color-rdx-pink-2  | `#fef7fb` |
| pink/3       | --color-rdx-pink-3  | `#fee9f5` |
| pink/4       | --color-rdx-pink-4  | `#fbdcef` |
| pink/5       | --color-rdx-pink-5  | `#f6cee7` |
| pink/6       | --color-rdx-pink-6  | `#efbfdd` |
| pink/7       | --color-rdx-pink-7  | `#e7acd0` |
| pink/8       | --color-rdx-pink-8  | `#dd93c2` |
| pink/9       | --color-rdx-pink-9  | `#d6409f` |
| pink/10      | --color-rdx-pink-10 | `#cf3897` |
| pink/11      | --color-rdx-pink-11 | `#c2298a` |
| pink/12      | --color-rdx-pink-12 | `#651249` |

### Plum

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| plum/1       | --color-rdx-plum-1  | `#fefcff` |
| plum/2       | --color-rdx-plum-2  | `#fdf7fd` |
| plum/3       | --color-rdx-plum-3  | `#fbebfb` |
| plum/4       | --color-rdx-plum-4  | `#f7def8` |
| plum/5       | --color-rdx-plum-5  | `#f2d1f3` |
| plum/6       | --color-rdx-plum-6  | `#e9c2ec` |
| plum/7       | --color-rdx-plum-7  | `#deade3` |
| plum/8       | --color-rdx-plum-8  | `#cf91d8` |
| plum/9       | --color-rdx-plum-9  | `#ab4aba` |
| plum/10      | --color-rdx-plum-10 | `#a144af` |
| plum/11      | --color-rdx-plum-11 | `#953ea3` |
| plum/12      | --color-rdx-plum-12 | `#53195d` |

### Purple

| Figma 변수명 | CSS Property          | 값        |
| ------------ | --------------------- | --------- |
| purple/1     | --color-rdx-purple-1  | `#fefcfe` |
| purple/2     | --color-rdx-purple-2  | `#fbf7fe` |
| purple/3     | --color-rdx-purple-3  | `#f7edfe` |
| purple/4     | --color-rdx-purple-4  | `#f2e2fc` |
| purple/5     | --color-rdx-purple-5  | `#ead5f9` |
| purple/6     | --color-rdx-purple-6  | `#e0c4f4` |
| purple/7     | --color-rdx-purple-7  | `#d1afec` |
| purple/8     | --color-rdx-purple-8  | `#be93e4` |
| purple/9     | --color-rdx-purple-9  | `#8e4ec6` |
| purple/10    | --color-rdx-purple-10 | `#8347b9` |
| purple/11    | --color-rdx-purple-11 | `#8145b5` |
| purple/12    | --color-rdx-purple-12 | `#402060` |

### Violet

| Figma 변수명 | CSS Property          | 값        |
| ------------ | --------------------- | --------- |
| violet/1     | --color-rdx-violet-1  | `#fdfcfe` |
| violet/2     | --color-rdx-violet-2  | `#faf8ff` |
| violet/3     | --color-rdx-violet-3  | `#f4f0fe` |
| violet/4     | --color-rdx-violet-4  | `#ebe4ff` |
| violet/5     | --color-rdx-violet-5  | `#e1d9ff` |
| violet/6     | --color-rdx-violet-6  | `#d4cafe` |
| violet/7     | --color-rdx-violet-7  | `#c2b5f5` |
| violet/8     | --color-rdx-violet-8  | `#aa99ec` |
| violet/9     | --color-rdx-violet-9  | `#6e56cf` |
| violet/10    | --color-rdx-violet-10 | `#654dc4` |
| violet/11    | --color-rdx-violet-11 | `#6550b9` |
| violet/12    | --color-rdx-violet-12 | `#2f265f` |

### Iris

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| iris/1       | --color-rdx-iris-1  | `#fdfdff` |
| iris/2       | --color-rdx-iris-2  | `#f8f8ff` |
| iris/3       | --color-rdx-iris-3  | `#f0f1fe` |
| iris/4       | --color-rdx-iris-4  | `#e6e7ff` |
| iris/5       | --color-rdx-iris-5  | `#dadcff` |
| iris/6       | --color-rdx-iris-6  | `#cbcdff` |
| iris/7       | --color-rdx-iris-7  | `#b8baf8` |
| iris/8       | --color-rdx-iris-8  | `#9b9ef0` |
| iris/9       | --color-rdx-iris-9  | `#5b5bd6` |
| iris/10      | --color-rdx-iris-10 | `#5151cd` |
| iris/11      | --color-rdx-iris-11 | `#5753c6` |
| iris/12      | --color-rdx-iris-12 | `#272962` |

### Indigo

| Figma 변수명 | CSS Property          | 값        |
| ------------ | --------------------- | --------- |
| indigo/1     | --color-rdx-indigo-1  | `#fdfdfe` |
| indigo/2     | --color-rdx-indigo-2  | `#f7f9ff` |
| indigo/3     | --color-rdx-indigo-3  | `#edf2fe` |
| indigo/4     | --color-rdx-indigo-4  | `#e1e9ff` |
| indigo/5     | --color-rdx-indigo-5  | `#d2deff` |
| indigo/6     | --color-rdx-indigo-6  | `#c1d0ff` |
| indigo/7     | --color-rdx-indigo-7  | `#abbdf9` |
| indigo/8     | --color-rdx-indigo-8  | `#8da4ef` |
| indigo/9     | --color-rdx-indigo-9  | `#3e63dd` |
| indigo/10    | --color-rdx-indigo-10 | `#3358d4` |
| indigo/11    | --color-rdx-indigo-11 | `#3a5bc7` |
| indigo/12    | --color-rdx-indigo-12 | `#1f2d5c` |

### Blue

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| blue/1       | --color-rdx-blue-1  | `#fbfdff` |
| blue/2       | --color-rdx-blue-2  | `#f4faff` |
| blue/3       | --color-rdx-blue-3  | `#e6f4fe` |
| blue/4       | --color-rdx-blue-4  | `#d5efff` |
| blue/5       | --color-rdx-blue-5  | `#c2e5ff` |
| blue/6       | --color-rdx-blue-6  | `#acd8fc` |
| blue/7       | --color-rdx-blue-7  | `#8ec8f6` |
| blue/8       | --color-rdx-blue-8  | `#5eb1ef` |
| blue/9       | --color-rdx-blue-9  | `#0090ff` |
| blue/10      | --color-rdx-blue-10 | `#0588f0` |
| blue/11      | --color-rdx-blue-11 | `#0d74ce` |
| blue/12      | --color-rdx-blue-12 | `#113264` |

### Cyan

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| cyan/1       | --color-rdx-cyan-1  | `#fafdfe` |
| cyan/2       | --color-rdx-cyan-2  | `#f2fafb` |
| cyan/3       | --color-rdx-cyan-3  | `#def7f9` |
| cyan/4       | --color-rdx-cyan-4  | `#caf1f6` |
| cyan/5       | --color-rdx-cyan-5  | `#b5e9f0` |
| cyan/6       | --color-rdx-cyan-6  | `#9ddde7` |
| cyan/7       | --color-rdx-cyan-7  | `#7dcedc` |
| cyan/8       | --color-rdx-cyan-8  | `#3db9cf` |
| cyan/9       | --color-rdx-cyan-9  | `#00a2c7` |
| cyan/10      | --color-rdx-cyan-10 | `#0797b9` |
| cyan/11      | --color-rdx-cyan-11 | `#107d98` |
| cyan/12      | --color-rdx-cyan-12 | `#0d3c48` |

### Teal

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| teal/1       | --color-rdx-teal-1  | `#fafefd` |
| teal/2       | --color-rdx-teal-2  | `#f3fbf9` |
| teal/3       | --color-rdx-teal-3  | `#e0f8f3` |
| teal/4       | --color-rdx-teal-4  | `#ccf3ea` |
| teal/5       | --color-rdx-teal-5  | `#b8eae0` |
| teal/6       | --color-rdx-teal-6  | `#a1ded2` |
| teal/7       | --color-rdx-teal-7  | `#83cdc1` |
| teal/8       | --color-rdx-teal-8  | `#53b9ab` |
| teal/9       | --color-rdx-teal-9  | `#12a594` |
| teal/10      | --color-rdx-teal-10 | `#0d9b8a` |
| teal/11      | --color-rdx-teal-11 | `#008573` |
| teal/12      | --color-rdx-teal-12 | `#0d3d38` |

### Jade

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| jade/1       | --color-rdx-jade-1  | `#fbfefd` |
| jade/2       | --color-rdx-jade-2  | `#f4fbf7` |
| jade/3       | --color-rdx-jade-3  | `#e6f7ed` |
| jade/4       | --color-rdx-jade-4  | `#d6f1e3` |
| jade/5       | --color-rdx-jade-5  | `#c3e9d7` |
| jade/6       | --color-rdx-jade-6  | `#acdec8` |
| jade/7       | --color-rdx-jade-7  | `#8bceb6` |
| jade/8       | --color-rdx-jade-8  | `#56ba9f` |
| jade/9       | --color-rdx-jade-9  | `#29a383` |
| jade/10      | --color-rdx-jade-10 | `#26997b` |
| jade/11      | --color-rdx-jade-11 | `#208368` |
| jade/12      | --color-rdx-jade-12 | `#1d3b31` |

### Green

| Figma 변수명 | CSS Property         | 값        |
| ------------ | -------------------- | --------- |
| green/1      | --color-rdx-green-1  | `#fbfefc` |
| green/2      | --color-rdx-green-2  | `#f4fbf6` |
| green/3      | --color-rdx-green-3  | `#e6f6eb` |
| green/4      | --color-rdx-green-4  | `#d6f1df` |
| green/5      | --color-rdx-green-5  | `#c4e8d1` |
| green/6      | --color-rdx-green-6  | `#adddc0` |
| green/7      | --color-rdx-green-7  | `#8eceaa` |
| green/8      | --color-rdx-green-8  | `#5bb98b` |
| green/9      | --color-rdx-green-9  | `#30a46c` |
| green/10     | --color-rdx-green-10 | `#2b9a66` |
| green/11     | --color-rdx-green-11 | `#218358` |
| green/12     | --color-rdx-green-12 | `#193b2d` |

### Grass

| Figma 변수명 | CSS Property         | 값        |
| ------------ | -------------------- | --------- |
| grass/1      | --color-rdx-grass-1  | `#fbfefb` |
| grass/2      | --color-rdx-grass-2  | `#f5fbf5` |
| grass/3      | --color-rdx-grass-3  | `#e9f6e9` |
| grass/4      | --color-rdx-grass-4  | `#daf1db` |
| grass/5      | --color-rdx-grass-5  | `#c9e8ca` |
| grass/6      | --color-rdx-grass-6  | `#b2ddb5` |
| grass/7      | --color-rdx-grass-7  | `#94ce9a` |
| grass/8      | --color-rdx-grass-8  | `#65ba74` |
| grass/9      | --color-rdx-grass-9  | `#46a758` |
| grass/10     | --color-rdx-grass-10 | `#3e9b4f` |
| grass/11     | --color-rdx-grass-11 | `#2a7e3b` |
| grass/12     | --color-rdx-grass-12 | `#203c25` |

### Bronze

| Figma 변수명 | CSS Property          | 값        |
| ------------ | --------------------- | --------- |
| bronze/1     | --color-rdx-bronze-1  | `#fdfcfc` |
| bronze/2     | --color-rdx-bronze-2  | `#fdf7f5` |
| bronze/3     | --color-rdx-bronze-3  | `#f6edea` |
| bronze/4     | --color-rdx-bronze-4  | `#efe4df` |
| bronze/5     | --color-rdx-bronze-5  | `#e7d9d3` |
| bronze/6     | --color-rdx-bronze-6  | `#dfcdc5` |
| bronze/7     | --color-rdx-bronze-7  | `#d3bcb3` |
| bronze/8     | --color-rdx-bronze-8  | `#c2a499` |
| bronze/9     | --color-rdx-bronze-9  | `#a18072` |
| bronze/10    | --color-rdx-bronze-10 | `#957468` |
| bronze/11    | --color-rdx-bronze-11 | `#7d5e54` |
| bronze/12    | --color-rdx-bronze-12 | `#43302b` |

### Gold

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| gold/1       | --color-rdx-gold-1  | `#fdfdfc` |
| gold/2       | --color-rdx-gold-2  | `#faf9f2` |
| gold/3       | --color-rdx-gold-3  | `#f2f0e7` |
| gold/4       | --color-rdx-gold-4  | `#eae6db` |
| gold/5       | --color-rdx-gold-5  | `#e1dccf` |
| gold/6       | --color-rdx-gold-6  | `#d8d0bf` |
| gold/7       | --color-rdx-gold-7  | `#cbc0aa` |
| gold/8       | --color-rdx-gold-8  | `#b9a88d` |
| gold/9       | --color-rdx-gold-9  | `#978365` |
| gold/10      | --color-rdx-gold-10 | `#8c7a5e` |
| gold/11      | --color-rdx-gold-11 | `#71624b` |
| gold/12      | --color-rdx-gold-12 | `#3b352b` |

### Brown

| Figma 변수명 | CSS Property         | 값        |
| ------------ | -------------------- | --------- |
| brown/1      | --color-rdx-brown-1  | `#fefdfc` |
| brown/2      | --color-rdx-brown-2  | `#fcf9f6` |
| brown/3      | --color-rdx-brown-3  | `#f6eee7` |
| brown/4      | --color-rdx-brown-4  | `#f0e4d9` |
| brown/5      | --color-rdx-brown-5  | `#ebdaca` |
| brown/6      | --color-rdx-brown-6  | `#e4cdb7` |
| brown/7      | --color-rdx-brown-7  | `#dcbc9f` |
| brown/8      | --color-rdx-brown-8  | `#cea37e` |
| brown/9      | --color-rdx-brown-9  | `#ad7f58` |
| brown/10     | --color-rdx-brown-10 | `#a07553` |
| brown/11     | --color-rdx-brown-11 | `#815e46` |
| brown/12     | --color-rdx-brown-12 | `#3e332e` |

### Orange

| Figma 변수명 | CSS Property          | 값        |
| ------------ | --------------------- | --------- |
| orange/1     | --color-rdx-orange-1  | `#fefcfb` |
| orange/2     | --color-rdx-orange-2  | `#fff7ed` |
| orange/3     | --color-rdx-orange-3  | `#ffefd6` |
| orange/4     | --color-rdx-orange-4  | `#ffdfb5` |
| orange/5     | --color-rdx-orange-5  | `#ffd19a` |
| orange/6     | --color-rdx-orange-6  | `#ffc182` |
| orange/7     | --color-rdx-orange-7  | `#f5ae73` |
| orange/8     | --color-rdx-orange-8  | `#ec9455` |
| orange/9     | --color-rdx-orange-9  | `#f76b15` |
| orange/10    | --color-rdx-orange-10 | `#ef5f00` |
| orange/11    | --color-rdx-orange-11 | `#cc4e00` |
| orange/12    | --color-rdx-orange-12 | `#582d1d` |

### Amber

| Figma 변수명 | CSS Property         | 값        |
| ------------ | -------------------- | --------- |
| amber/1      | --color-rdx-amber-1  | `#fefdfb` |
| amber/2      | --color-rdx-amber-2  | `#fefbe9` |
| amber/3      | --color-rdx-amber-3  | `#fff7c2` |
| amber/4      | --color-rdx-amber-4  | `#ffee9c` |
| amber/5      | --color-rdx-amber-5  | `#fbe577` |
| amber/6      | --color-rdx-amber-6  | `#f3d673` |
| amber/7      | --color-rdx-amber-7  | `#e9c162` |
| amber/8      | --color-rdx-amber-8  | `#e2a336` |
| amber/9      | --color-rdx-amber-9  | `#ffc53d` |
| amber/10     | --color-rdx-amber-10 | `#ffba18` |
| amber/11     | --color-rdx-amber-11 | `#ab6400` |
| amber/12     | --color-rdx-amber-12 | `#4f3422` |

### Yellow

| Figma 변수명 | CSS Property          | 값        |
| ------------ | --------------------- | --------- |
| yellow/1     | --color-rdx-yellow-1  | `#fdfdf9` |
| yellow/2     | --color-rdx-yellow-2  | `#fefce9` |
| yellow/3     | --color-rdx-yellow-3  | `#fffab8` |
| yellow/4     | --color-rdx-yellow-4  | `#fff394` |
| yellow/5     | --color-rdx-yellow-5  | `#ffe770` |
| yellow/6     | --color-rdx-yellow-6  | `#f3d768` |
| yellow/7     | --color-rdx-yellow-7  | `#e4c767` |
| yellow/8     | --color-rdx-yellow-8  | `#d5ae39` |
| yellow/9     | --color-rdx-yellow-9  | `#ffe629` |
| yellow/10    | --color-rdx-yellow-10 | `#ffdc00` |
| yellow/11    | --color-rdx-yellow-11 | `#9e6c00` |
| yellow/12    | --color-rdx-yellow-12 | `#473b1f` |

### Lime

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| lime/1       | --color-rdx-lime-1  | `#fcfdfa` |
| lime/2       | --color-rdx-lime-2  | `#f8faf3` |
| lime/3       | --color-rdx-lime-3  | `#eef6d6` |
| lime/4       | --color-rdx-lime-4  | `#e2f0bd` |
| lime/5       | --color-rdx-lime-5  | `#d3e7a6` |
| lime/6       | --color-rdx-lime-6  | `#c2da91` |
| lime/7       | --color-rdx-lime-7  | `#abc978` |
| lime/8       | --color-rdx-lime-8  | `#8db654` |
| lime/9       | --color-rdx-lime-9  | `#bdee63` |
| lime/10      | --color-rdx-lime-10 | `#b0e64c` |
| lime/11      | --color-rdx-lime-11 | `#5c7c2f` |
| lime/12      | --color-rdx-lime-12 | `#37401c` |

### Mint

| Figma 변수명 | CSS Property        | 값        |
| ------------ | ------------------- | --------- |
| mint/1       | --color-rdx-mint-1  | `#f9fefd` |
| mint/2       | --color-rdx-mint-2  | `#f2fbf9` |
| mint/3       | --color-rdx-mint-3  | `#ddf9f2` |
| mint/4       | --color-rdx-mint-4  | `#c8f4e9` |
| mint/5       | --color-rdx-mint-5  | `#b3ecde` |
| mint/6       | --color-rdx-mint-6  | `#9ce0d0` |
| mint/7       | --color-rdx-mint-7  | `#7ecfbd` |
| mint/8       | --color-rdx-mint-8  | `#4cbba5` |
| mint/9       | --color-rdx-mint-9  | `#86ead4` |
| mint/10      | --color-rdx-mint-10 | `#7de0cb` |
| mint/11      | --color-rdx-mint-11 | `#027864` |
| mint/12      | --color-rdx-mint-12 | `#16433c` |

### Sky

| Figma 변수명 | CSS Property       | 값        |
| ------------ | ------------------ | --------- |
| sky/1        | --color-rdx-sky-1  | `#f9feff` |
| sky/2        | --color-rdx-sky-2  | `#f1fafd` |
| sky/3        | --color-rdx-sky-3  | `#e1f6fd` |
| sky/4        | --color-rdx-sky-4  | `#d1f0fa` |
| sky/5        | --color-rdx-sky-5  | `#bee7f5` |
| sky/6        | --color-rdx-sky-6  | `#a9daed` |
| sky/7        | --color-rdx-sky-7  | `#8dcae3` |
| sky/8        | --color-rdx-sky-8  | `#60b3d7` |
| sky/9        | --color-rdx-sky-9  | `#7ce2fe` |
| sky/10       | --color-rdx-sky-10 | `#74daf8` |
| sky/11       | --color-rdx-sky-11 | `#00749e` |
| sky/12       | --color-rdx-sky-12 | `#1d3e56` |

### Black (알파 스케일)

| Figma 변수명 | CSS Property         | 값          |
| ------------ | -------------------- | ----------- |
| black/1      | --color-rdx-black-1  | `#0000000d` |
| black/2      | --color-rdx-black-2  | `#0000001a` |
| black/3      | --color-rdx-black-3  | `#00000026` |
| black/4      | --color-rdx-black-4  | `#00000033` |
| black/5      | --color-rdx-black-5  | `#0000004d` |
| black/6      | --color-rdx-black-6  | `#00000066` |
| black/7      | --color-rdx-black-7  | `#00000080` |
| black/8      | --color-rdx-black-8  | `#00000099` |
| black/9      | --color-rdx-black-9  | `#000000b2` |
| black/10     | --color-rdx-black-10 | `#000000cc` |
| black/11     | --color-rdx-black-11 | `#000000e5` |
| black/12     | --color-rdx-black-12 | `#000000f2` |

### White (알파 스케일)

| Figma 변수명 | CSS Property         | 값          |
| ------------ | -------------------- | ----------- |
| white/1      | --color-rdx-white-1  | `#ffffff0d` |
| white/2      | --color-rdx-white-2  | `#ffffff1a` |
| white/3      | --color-rdx-white-3  | `#ffffff26` |
| white/4      | --color-rdx-white-4  | `#ffffff33` |
| white/5      | --color-rdx-white-5  | `#ffffff4d` |
| white/6      | --color-rdx-white-6  | `#ffffff66` |
| white/7      | --color-rdx-white-7  | `#ffffff80` |
| white/8      | --color-rdx-white-8  | `#ffffff99` |
| white/9      | --color-rdx-white-9  | `#ffffffb2` |
| white/10     | --color-rdx-white-10 | `#ffffffcc` |
| white/11     | --color-rdx-white-11 | `#ffffffe5` |
| white/12     | --color-rdx-white-12 | `#fffffff2` |

## 색상 — Semantic (primitive alias로 구성)

✅ **2026-08-01 확정 (node-id `4126:2666`)**: 사용자가 Figma에서
"DS — mode (Semantic)" 문서 프레임을 새 node-id `4126:2666`으로 직접
편집해, 34개 시맨틱 색상 각각이 참조하는 primitive를 `<팔레트명>/<스텝>`
형식의 텍스트 라벨(예: `neutral/950`, `gray/11`, `black/5`, `white`)로
명시했습니다. `get_metadata`로 이 프레임 전체(자식 노드 텍스트 레이어)를
직접 읽어 확인했습니다.

이전에는 Figma API가 resolve된 hex 값만 반환해(`get_variable_defs` 빈 값
`{}`, `get_design_context` 리터럴 hex 스와치) "값 완전 일치" 방식으로
추론할 수밖에 없었지만, 이번엔 라벨이 팔레트명을 직접 명시하므로
**추론이 아니라 명시적으로 확인된 참조**입니다. 팔레트명 `neutral`은
`tw/colors`에만 존재하고(`rdx/colors`는 `gray`/`mauve`/`slate`/`sage`/
`olive`/`sand` 6종의 achromatic 팔레트를 사용, `neutral` 없음), 스텝 표기도
`tw`는 `50~950`(11단계), `rdx`는 `1~12`(12단계)로 달라 팔레트명+스텝
조합만으로 tw/rdx를 명확히 구분할 수 있습니다.

결과: 아래 10개 중 9개(`sidebar-primary` dark 제외 전부)는 **tw/colors**
(neutral/blue/green)를 참조하고, `sidebar-primary` dark 1개만
**rdx/colors**(`gray/11`)를 참조합니다 — 이는 이전 "값 완전 일치" 재대조
결과와 정확히 일치해 교차 검증되었습니다. `참조` 컬럼을 "미확인"에서 확정
결과로 갱신했습니다.

| Figma 변수명               | CSS Property                       | 값                                     | 용도                                                                          | 참조 (node-id 4126:2666에서 확인)       |
| -------------------------- | ---------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------- |
| sidebar                    | --color-sidebar                    | `var(--color-neutral-50)` (`#fafafa`)  | 사이드바 배경                                                                 | tw `neutral/50`                         |
| sidebar-foreground         | --color-sidebar-foreground         | `var(--color-neutral-950)` (`#0a0a0a`) | 사이드바 텍스트                                                               | tw `neutral/950`                        |
| sidebar-primary            | --color-sidebar-primary            | `var(--color-neutral-900)` (`#171717`) | 사이드바 강조 배경                                                            | tw `neutral/900` (dark는 rdx `gray/11`) |
| sidebar-primary-foreground | --color-sidebar-primary-foreground | `var(--color-neutral-50)` (`#fafafa`)  | 사이드바 강조 텍스트                                                          | tw `neutral/50`                         |
| sidebar-accent             | --color-sidebar-accent             | `var(--color-neutral-100)` (`#f5f5f5`) | 사이드바 accent 배경                                                          | tw `neutral/100`                        |
| sidebar-accent-foreground  | --color-sidebar-accent-foreground  | `var(--color-neutral-900)` (`#171717`) | 사이드바 accent 텍스트                                                        | tw `neutral/900`                        |
| sidebar-border             | --color-sidebar-border             | `var(--color-neutral-200)` (`#e5e5e5`) | 사이드바 보더                                                                 | tw `neutral/200`                        |
| sidebar-ring               | --color-sidebar-ring               | `var(--color-neutral-500)` (`#737373`) | 사이드바 포커스 링                                                            | tw `neutral/500`                        |
| warning                    | --color-warning                    | `var(--color-blue-600)` (`#2563eb`)    | 경고 상태 (⚠️ 팀 관습상 amber/orange 계열을 기대할 수 있으나 Figma 값은 blue) | tw `blue/600`                           |
| success                    | --color-success                    | `var(--color-green-600)` (`#16a34a`)   | 성공 상태                                                                     | tw `green/600`                          |

## 색상 — Semantic (flat)

✅ **2026-08-01 확정 (node-id `4126:2666`)**: 위와 동일하게 node-id
`4126:2666`의 텍스트 라벨로 확인했습니다. 6개 중 `background-color`,
`background-transparent`는 `rdx/colors`(black/white 알파 스케일)를
참조합니다(라벨: `black/5`, `white/4`, `black/4`). `semantic-non
changeable`은 이전엔 raw hex로만 파악했으나, 이번엔 라벨이 팔레트명 없는
hex가 아니라 **`white`**(스텝 없는 tw 단일 primitive)로 명시되어 있어
`var(--color-white)` alias로 확정했습니다(값은 `#ffffff`로 동일하나 참조
방식이 raw → alias로 변경됨). 나머지 3개(`semantic-background`,
`semantic-border`, `accent-non changeable`)는 이 문서에서도 팔레트 라벨
없이 hex 값 텍스트로만 표기되어 있어, primitive를 참조하지 않는 raw
값임이 명시적으로 확인되었습니다.

| Figma 변수명            | CSS Property                    | 값          | 용도                                | 참조 (node-id 4126:2666에서 확인)               |
| ----------------------- | ------------------------------- | ----------- | ----------------------------------- | ----------------------------------------------- |
| background-color        | --color-background-color        | `#0000004d` | 오버레이/딤(dim) 배경 (반투명 검정) | ✅ `var(--color-rdx-black-5)` (`black/5`)       |
| semantic-background     | --color-semantic-background     | `#696867`   | 세만틱 배경                         | raw 값 (라벨도 hex 텍스트, primitive 참조 없음) |
| semantic-border         | --color-semantic-border         | `#898887`   | 세만틱 보더                         | raw 값 (라벨도 hex 텍스트, primitive 참조 없음) |
| semantic-non changeable | --color-semantic-non-changeable | `#ffffff`   | 테마 무관 고정 색상                 | ✅ `var(--color-white)` (라벨: `white`)         |
| background-transparent  | --color-background-transparent  | `#ffffff33` | 반투명 흰색 배경                    | ✅ `var(--color-rdx-white-4)` (`white/4`)       |
| accent-non changeable   | --color-accent-non-changeable   | `#828282`   | 테마 무관 고정 accent               | raw 값 (라벨도 hex 텍스트, primitive 참조 없음) |

## 색상 — Semantic 다크모드 (2026-08-01 node-id 4126:2666에서 확정)

Figma `mode (Semantic)` Variable Collection("DS — mode (Semantic)" 문서
프레임)의 dark 값 컬럼은 이전엔 node-id `4122:7339`에서 조회했으나, 사용자가
같은 프레임을 새 node-id **`4126:2666`**으로 직접 편집해 각 시맨틱 색상의
light/dark 참조 primitive를 hex 값이 아니라 `<팔레트명>/<스텝>` 텍스트
라벨(예: `neutral/900`, `gray/11`, `black/4`)로 명시했습니다. `get_metadata`로
이 프레임을 다시 조회해 34개 행 전체(각 행의 Token / light mode / dark mode
3열, 스와치 + 라벨 텍스트)를 확인했습니다.

**조회 방법**: `get_variable_defs`는 이 프레임에도 여전히 빈 값(`{}`)을
반환합니다(실제 Variable 바인딩이 아니라 문서화용 텍스트 라벨). 대신
`get_metadata`로 얻은 레이어 트리에서 각 행의 라벨 텍스트(예:
`neutral/950`, `gray/11`, `black/5`, `white`)를 직접 읽었습니다. 읽은 light
값이 기존 `colors.css`의 light 값과 16개 전부 정확히 일치해 신뢰도를
재확인했습니다.

**alias 판정 방법**: 라벨의 팔레트명으로 tw/rdx를 구분했습니다 — `neutral`은
tw/colors 전용(rdx는 `gray`/`mauve`/`slate`/`sage`/`olive`/`sand`만 사용),
스텝 표기 `50~950`은 tw, `1~12`는 rdx 체계입니다. 이 판별 결과는 이전
"값 완전 일치" 재대조 결과(9개는 tw만 일치, `sidebar-primary` dark만
rdx-gray-11과 일치)와 **정확히 일치**해 교차 검증되었습니다.

### alias 계열 (10개) — light/dark 나란히 비교

| Figma 변수명               | CSS Property                       | Light 값                               | Dark 값                                                                      |
| -------------------------- | ---------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| sidebar                    | --color-sidebar                    | `var(--color-neutral-50)` (`#fafafa`)  | `var(--color-neutral-900)` (`#171717`) — tw `neutral/900`                    |
| sidebar-foreground         | --color-sidebar-foreground         | `var(--color-neutral-950)` (`#0a0a0a`) | `var(--color-neutral-50)` (`#fafafa`) — tw `neutral/50`                      |
| sidebar-primary            | --color-sidebar-primary            | `var(--color-neutral-900)` (`#171717`) | ✅ `var(--color-rdx-gray-11)` (`#646464`) — rdx `gray/11` (라벨로 명시 확인) |
| sidebar-primary-foreground | --color-sidebar-primary-foreground | `var(--color-neutral-50)` (`#fafafa`)  | `var(--color-neutral-50)` (`#fafafa`) — tw `neutral/50`, **light와 동일**    |
| sidebar-accent             | --color-sidebar-accent             | `var(--color-neutral-100)` (`#f5f5f5`) | `var(--color-neutral-800)` (`#262626`) — tw `neutral/800`                    |
| sidebar-accent-foreground  | --color-sidebar-accent-foreground  | `var(--color-neutral-900)` (`#171717`) | `var(--color-neutral-50)` (`#fafafa`) — tw `neutral/50`                      |
| sidebar-border             | --color-sidebar-border             | `var(--color-neutral-200)` (`#e5e5e5`) | `var(--color-neutral-700)` (`#404040`) — tw `neutral/700`                    |
| sidebar-ring               | --color-sidebar-ring               | `var(--color-neutral-500)` (`#737373`) | `var(--color-neutral-500)` (`#737373`) — tw `neutral/500`, **light와 동일**  |
| warning                    | --color-warning                    | `var(--color-blue-600)` (`#2563eb`)    | `var(--color-blue-400)` (`#60a5fa`) — tw `blue/400`                          |
| success                    | --color-success                    | `var(--color-green-600)` (`#16a34a`)   | `var(--color-green-400)` (`#4ade80`) — tw `green/400`                        |

위 10개 중 `sidebar-primary`의 dark 값 1개만 라벨이 `gray/11`(rdx)로
명시되어 있고, 나머지 9개(및 `sidebar-primary`의 light 값)는 전부 라벨이
`neutral/*` 또는 `blue/*`, `green/*`(tw)로 명시되어 있습니다.

### flat 계열 (6개) — light/dark 나란히 비교

| Figma 변수명            | CSS Property                    | Light 값    | Dark 값     | 참조 (node-id 4126:2666에서 확인)                                                                    |
| ----------------------- | ------------------------------- | ----------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| background-color        | --color-background-color        | `#0000004d` | `#0000004d` | ✅ light/dark 모두 `var(--color-rdx-black-5)` — 라벨 `black/5` (rdx, 5% 검정)                        |
| semantic-background     | --color-semantic-background     | `#696867`   | `#272625`   | raw 값 — 라벨도 hex 텍스트, primitive 참조 없음                                                      |
| semantic-border         | --color-semantic-border         | `#898887`   | `#535151`   | raw 값 — 라벨도 hex 텍스트, primitive 참조 없음                                                      |
| semantic-non changeable | --color-semantic-non-changeable | `#ffffff`   | `#ffffff`   | ✅ light/dark 모두 `var(--color-white)` — 라벨 `white` (tw 단일 primitive, "non changeable" 확인)    |
| background-transparent  | --color-background-transparent  | `#ffffff33` | `#00000033` | ✅ light=`var(--color-rdx-white-4)`(라벨 `white/4`), dark=`var(--color-rdx-black-4)`(라벨 `black/4`) |
| accent-non changeable   | --color-accent-non-changeable   | `#828282`   | `#828282`   | raw 값 — 라벨도 hex 텍스트, primitive 참조 없음 ("non changeable" 확인)                              |

**✅ 확정 요약**: node-id `4126:2666`의 텍스트 라벨을 직접 읽어 16개
semantic(및 flat 6개 포함) 전부의 참조 대상을 확정했습니다.

- tw/colors 참조(9개): `sidebar`, `sidebar-foreground`, `sidebar-primary`
  (light만), `sidebar-primary-foreground`, `sidebar-accent`,
  `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`, `warning`,
  `success` — 전부 `neutral/blue/green` tw 팔레트.
- rdx/colors 참조(4슬롯): `sidebar-primary` dark(`gray/11`),
  `background-color` light+dark(`black/5`), `background-transparent`
  light(`white/4`)+dark(`black/4`).
- tw 단일 primitive 참조(신규 확정, 2슬롯): `semantic-non changeable`
  light+dark → `var(--color-white)` (이전엔 raw hex로 처리했으나 이번에
  라벨이 "white"로 명시되어 alias로 교체).
- primitive 참조 없음(raw 값 유지, 6슬롯): `semantic-background`,
  `semantic-border`, `accent-non changeable` 각각 light+dark — 라벨 자체가
  팔레트명 없이 hex 텍스트로만 적혀 있어 명시적으로 "참조 없음"이 확인됨.

이전 문서에 있던 "미해결 플래그"(사용자가 언급한 rdx alias와 API 값-일치
결과 간 불일치)는 이번 node-id `4126:2666` 명시적 라벨 확인으로 해소되었습니다
— 결과가 이전 "값 완전 일치" 추론과 정확히 같았기 때문에, `mode (Semantic)`
프레임은 실제 Variable alias 관계를 정확히 반영하는 문서였다고 결론 내릴 수
있습니다.

## 색상 — 기존 Shadcn 변수와 충돌 (⚠️ 코드에 미반영)

아래 18개는 Figma 변수명이 `app/globals.css`의 기존 Shadcn 기본 변수명과 완전히
동일하여 **`src/tokens/colors.css`에 포함하지 않았습니다.** 값이 다를 수 있으므로
반영 여부는 별도 검토/승인이 필요합니다 (자세한 내용은 최종 보고 참고).

| Figma 변수명         | 값        | 겹치는 기존 CSS 변수 (`app/globals.css`) | 기존 값 (`:root`, light)    |
| -------------------- | --------- | ---------------------------------------- | --------------------------- |
| background           | `#ffffff` | --background                             | `oklch(1 0 0)`              |
| foreground           | `#0a0a0a` | --foreground                             | `oklch(0.145 0 0)`          |
| card                 | `#ffffff` | --card                                   | `oklch(1 0 0)`              |
| card-foreground      | `#0a0a0a` | --card-foreground                        | `oklch(0.145 0 0)`          |
| popover              | `#ffffff` | --popover                                | `oklch(1 0 0)`              |
| popover-foreground   | `#0a0a0a` | --popover-foreground                     | `oklch(0.145 0 0)`          |
| primary              | `#171717` | --primary                                | `oklch(0.205 0 0)`          |
| primary-foreground   | `#fafafa` | --primary-foreground                     | `oklch(0.985 0 0)`          |
| secondary            | `#f5f5f5` | --secondary                              | `oklch(0.97 0 0)`           |
| secondary-foreground | `#0a0a0a` | --secondary-foreground                   | `oklch(0.205 0 0)`          |
| muted                | `#f5f5f5` | --muted                                  | `oklch(0.97 0 0)`           |
| muted-foreground     | `#737373` | --muted-foreground                       | `oklch(0.556 0 0)`          |
| accent               | `#f5f5f5` | --accent                                 | `oklch(0.97 0 0)`           |
| accent-foreground    | `#171717` | --accent-foreground                      | `oklch(0.205 0 0)`          |
| destructive          | `#dc2626` | --destructive                            | `oklch(0.577 0.245 27.325)` |
| border               | `#e5e5e5` | --border                                 | `oklch(0.922 0 0)`          |
| input                | `#e5e5e5` | --input                                  | `oklch(0.922 0 0)`          |
| ring                 | `#737373` | --ring                                   | `oklch(0.708 0 0)`          |

## 색상 — Tooltip Inversed variant 전용 고정 토큰

Tooltip의 `Inversed` variant(배경/텍스트/화살표)는 앱의 라이트/다크 테마 토글과
무관하게 항상 같은 색이어야 합니다. Figma 스펙상 Inversed는 항상
`--primary`/`--primary-foreground`의 **다크모드 resolve값**으로 고정되므로,
`app/globals.css`의 `:root` 블록에 아래 전용 토큰 2개를 별도로 추가했습니다
(`.dark` 블록에는 존재하지 않음 — 테마와 무관하게 고정되어야 하므로).

| Figma 변수명            | 값        | 코드 CSS 변수           | 비고                                                                          |
| ----------------------- | --------- | ----------------------- | ----------------------------------------------------------------------------- |
| Tooltip / Inversed / bg | `#e5e5e5` | `--tooltip-inversed-bg` | `.dark` 블록의 `--primary` (`oklch(0.922 0 0)`)와 동일 값으로 고정            |
| Tooltip / Inversed / fg | `#171717` | `--tooltip-inversed-fg` | `.dark` 블록의 `--primary-foreground` (`oklch(0.205 0 0)`)와 동일 값으로 고정 |

`components/ui/tooltip/tooltip.tsx`의 `variant.inversed`와 화살표(Arrow)
div가 이 두 토큰을 사용합니다. `default` variant(`bg-primary
text-primary-foreground`)는 기존 Shadcn 테마 변수를 그대로 사용하며 변경되지
않았습니다.

## 타이포그래피

⚠️ **Figma Variable이 아니라 "Design Token" 문서 섹션(프레임 `DS — tw/font`,
node-id `4122:8225`, "tw/font — 41개")에 하드코딩된 값입니다.** Figma에 실제
Variable/Style이 생기면 재추출 필요.

**출처 검증**: 값은 `get_metadata`로 받은 레이어 트리에서 텍스트 레이어 이름
("xs"/"12", "thin"/"100" 등)을 읽은 것이며, `get_design_context`는 사용하지
않았습니다. `get_variable_defs`를 이 프레임 노드에 직접 호출해도 빈 값(`{}`)이
반환되어 실제 Variable 바인딩은 확인되지 않았습니다. 개수(41)가 "DS — Overview"의
실제 Variable Collection 개수("tw/font — 41개")와 일치하는 것은 이 문서 프레임이
해당 컬렉션을 1:1로 시각적으로 미러링해서 만들어졌기 때문으로 보이며, "값이
Variable에서 나왔다"는 근거는 아닙니다 (자세한 근거는 `src/tokens/typography.css`
파일 헤더 주석 참고).

이 프레임은 size(13) / weight(9) / leading(13, line-height) / tracking(6,
letter-spacing) **4개의 독립된 스케일**로 구성되어 있고, 하나의 이름(step)에 4개
속성이 함께 묶여 있지 않습니다(예: `xs`는 size 스케일에만 존재). 그래서 원래 요청한
`--font-{step}-size/-weight/-line-height/-letter-spacing` 번들 구조 대신
`--font-size-*`, `--font-weight-*`, `--font-leading-*`, `--font-tracking-*` 4개
그룹으로 나눠 구성했습니다.

font-family는 이 프레임에 없고, `DS — Text Styles` 프레임 설명 텍스트("Inter 기반
118개 스타일")에서 "Inter"를 확인해 `--font-family-sans`로 추가했습니다 (⚠️ 라벨
텍스트에서 추론, 직접 읽은 속성 아님).

✅ **2026-08-01 후속 작업으로 반영 완료**: "DS — Text Styles"(118개 = size 13 ×
weight 9 조합 + Time Stamp 1개)를 사용자가 지정한 새 노드(`4143:2666`)에서
`get_metadata`로 전체 추출해 `src/tokens/text-styles.css`에 반영했습니다. 자세한
내용은 아래 "Text Style (완성된 스타일 클래스)" 절 참고. 이전 조사 시점의 노드
(`4122:8786`)는 이름표만 있어 line-height/letter-spacing을 확인할 수 없었지만,
새 노드는 각 행에 "token → value" 쌍이 명시되어 있어 118개 전부 확인 가능했습니다.

### Font Size (`--font-size-*`)

| Figma 이름(step) | CSS Property     | 값      |
| ---------------- | ---------------- | ------- |
| xs               | --font-size-xs   | `12px`  |
| sm               | --font-size-sm   | `14px`  |
| base             | --font-size-base | `16px`  |
| lg               | --font-size-lg   | `18px`  |
| xl               | --font-size-xl   | `20px`  |
| 2xl              | --font-size-2xl  | `24px`  |
| 3xl              | --font-size-3xl  | `30px`  |
| 4xl              | --font-size-4xl  | `36px`  |
| 5xl              | --font-size-5xl  | `48px`  |
| 6xl              | --font-size-6xl  | `60px`  |
| 7xl              | --font-size-7xl  | `72px`  |
| 8xl              | --font-size-8xl  | `96px`  |
| 9xl              | --font-size-9xl  | `128px` |

### Font Weight (`--font-weight-*`)

| Figma 이름(step) | CSS Property             | 값    |
| ---------------- | ------------------------ | ----- |
| thin             | --font-weight-thin       | `100` |
| extralight       | --font-weight-extralight | `200` |
| light            | --font-weight-light      | `300` |
| normal           | --font-weight-normal     | `400` |
| medium           | --font-weight-medium     | `500` |
| semibold         | --font-weight-semibold   | `600` |
| bold             | --font-weight-bold       | `700` |
| extrabold        | --font-weight-extrabold  | `800` |
| black            | --font-weight-black      | `900` |

### Line Height / leading (`--font-leading-*`, 절대 px)

| Figma 이름(step) | CSS Property      | 값      |
| ---------------- | ----------------- | ------- |
| 3                | --font-leading-3  | `12px`  |
| 4                | --font-leading-4  | `16px`  |
| 5                | --font-leading-5  | `20px`  |
| 6                | --font-leading-6  | `24px`  |
| 7                | --font-leading-7  | `28px`  |
| 8                | --font-leading-8  | `32px`  |
| 9                | --font-leading-9  | `36px`  |
| 10               | --font-leading-10 | `40px`  |
| 12               | --font-leading-12 | `48px`  |
| 15               | --font-leading-15 | `60px`  |
| 18               | --font-leading-18 | `72px`  |
| 24               | --font-leading-24 | `96px`  |
| 32               | --font-leading-32 | `128px` |

### Letter Spacing / tracking (`--font-tracking-*`, px, 16px 기준)

| Figma 이름(step) | CSS Property            | 값       |
| ---------------- | ----------------------- | -------- |
| tighter          | --font-tracking-tighter | `-0.8px` |
| tight            | --font-tracking-tight   | `-0.4px` |
| normal           | --font-tracking-normal  | `0px`    |
| wide             | --font-tracking-wide    | `0.4px`  |
| wider            | --font-tracking-wider   | `0.8px`  |
| widest           | --font-tracking-widest  | `1.6px`  |

### Text Style (완성된 스타일 클래스, `--font-*` 조합)

⚠️ **추측이 아니라 명시적으로 확인함**: 이번에 사용자가 지정한 새 노드
(`4143:2666`, 프레임명 "DS — Text Styles")는 위 4122:8786 버전과 달리
118개 스타일 각 행마다 `Style / Family / Weight (token → val) / Size
(token → val) / Line-H (token → val) / Spacing (token → val)` 6개 컬럼을
텍스트 레이어로 직접 노출하고 있어 `get_metadata`로 값을 그대로 읽었습니다
(라벨에서 추론한 것이 아니라 "token → value" 쌍이 레이어 이름에 명시됨).
118개 전부(Time Stamp 1 + size 13 × weight 9 = 117) 확인 완료. 생성 파일:
`src/tokens/text-styles.css`. 클래스 네이밍: `.text-{size}-{weight}`
(kebab-case, 예: `.text-xs-black`, `.text-4xl-extra-bold`).

검증 결과 요약:

- font-weight 9개, font-size 13개는 기존 `--font-weight-*`/`--font-size-*`와 1:1 일치
- line-height는 size 그룹별로 정확히 1개 값(weight 무관 고정)이며 기존
  `--font-leading-*` 13개 값과 전부 일치 (`lg`/`xl`은 `leading-7`을 공유)
- letter-spacing은 118개 전부 `tracking/normal → 0` (`--font-tracking-normal`),
  다른 tracking 값은 Text Style에 사용되지 않음
- font-family는 `Time Stamp`만 `"Bitcount Grid Single"`로 다른 117개(`family/sans`)와
  상이 — typography.css에 대응 토큰이 없어 `text-styles.css`에 raw 값으로 기입 (⚠️ FLAG,
  후속 토큰화 검토 권장)

#### Time Stamp (1)

| 클래스             | font-family                                 | font-weight                    | font-size                   | line-height                 | letter-spacing                   |
| ------------------ | ------------------------------------------- | ------------------------------ | --------------------------- | --------------------------- | -------------------------------- |
| `.text-time-stamp` | `"Bitcount Grid Single"` (raw, ⚠️ 미토큰화) | `--font-weight-normal` (`400`) | `--font-size-base` (`16px`) | `--font-leading-3` (`12px`) | `--font-tracking-normal` (`0px`) |

#### Text-xs (9)

| 클래스                 | font-weight                        | font-size                 | line-height                 | letter-spacing                   |
| ---------------------- | ---------------------------------- | ------------------------- | --------------------------- | -------------------------------- |
| `.text-xs-black`       | `--font-weight-black` (`900`)      | `--font-size-xs` (`12px`) | `--font-leading-4` (`16px`) | `--font-tracking-normal` (`0px`) |
| `.text-xs-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-xs` (`12px`) | `--font-leading-4` (`16px`) | `--font-tracking-normal` (`0px`) |
| `.text-xs-bold`        | `--font-weight-bold` (`700`)       | `--font-size-xs` (`12px`) | `--font-leading-4` (`16px`) | `--font-tracking-normal` (`0px`) |
| `.text-xs-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-xs` (`12px`) | `--font-leading-4` (`16px`) | `--font-tracking-normal` (`0px`) |
| `.text-xs-medium`      | `--font-weight-medium` (`500`)     | `--font-size-xs` (`12px`) | `--font-leading-4` (`16px`) | `--font-tracking-normal` (`0px`) |
| `.text-xs-regular`     | `--font-weight-normal` (`400`)     | `--font-size-xs` (`12px`) | `--font-leading-4` (`16px`) | `--font-tracking-normal` (`0px`) |
| `.text-xs-light`       | `--font-weight-light` (`300`)      | `--font-size-xs` (`12px`) | `--font-leading-4` (`16px`) | `--font-tracking-normal` (`0px`) |
| `.text-xs-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-xs` (`12px`) | `--font-leading-4` (`16px`) | `--font-tracking-normal` (`0px`) |
| `.text-xs-thin`        | `--font-weight-thin` (`100`)       | `--font-size-xs` (`12px`) | `--font-leading-4` (`16px`) | `--font-tracking-normal` (`0px`) |

#### Text-sm (9)

| 클래스                 | font-weight                        | font-size                 | line-height                 | letter-spacing                   |
| ---------------------- | ---------------------------------- | ------------------------- | --------------------------- | -------------------------------- |
| `.text-sm-black`       | `--font-weight-black` (`900`)      | `--font-size-sm` (`14px`) | `--font-leading-5` (`20px`) | `--font-tracking-normal` (`0px`) |
| `.text-sm-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-sm` (`14px`) | `--font-leading-5` (`20px`) | `--font-tracking-normal` (`0px`) |
| `.text-sm-bold`        | `--font-weight-bold` (`700`)       | `--font-size-sm` (`14px`) | `--font-leading-5` (`20px`) | `--font-tracking-normal` (`0px`) |
| `.text-sm-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-sm` (`14px`) | `--font-leading-5` (`20px`) | `--font-tracking-normal` (`0px`) |
| `.text-sm-medium`      | `--font-weight-medium` (`500`)     | `--font-size-sm` (`14px`) | `--font-leading-5` (`20px`) | `--font-tracking-normal` (`0px`) |
| `.text-sm-regular`     | `--font-weight-normal` (`400`)     | `--font-size-sm` (`14px`) | `--font-leading-5` (`20px`) | `--font-tracking-normal` (`0px`) |
| `.text-sm-light`       | `--font-weight-light` (`300`)      | `--font-size-sm` (`14px`) | `--font-leading-5` (`20px`) | `--font-tracking-normal` (`0px`) |
| `.text-sm-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-sm` (`14px`) | `--font-leading-5` (`20px`) | `--font-tracking-normal` (`0px`) |
| `.text-sm-thin`        | `--font-weight-thin` (`100`)       | `--font-size-sm` (`14px`) | `--font-leading-5` (`20px`) | `--font-tracking-normal` (`0px`) |

#### Text-base (9)

| 클래스                   | font-weight                        | font-size                   | line-height                 | letter-spacing                   |
| ------------------------ | ---------------------------------- | --------------------------- | --------------------------- | -------------------------------- |
| `.text-base-black`       | `--font-weight-black` (`900`)      | `--font-size-base` (`16px`) | `--font-leading-6` (`24px`) | `--font-tracking-normal` (`0px`) |
| `.text-base-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-base` (`16px`) | `--font-leading-6` (`24px`) | `--font-tracking-normal` (`0px`) |
| `.text-base-bold`        | `--font-weight-bold` (`700`)       | `--font-size-base` (`16px`) | `--font-leading-6` (`24px`) | `--font-tracking-normal` (`0px`) |
| `.text-base-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-base` (`16px`) | `--font-leading-6` (`24px`) | `--font-tracking-normal` (`0px`) |
| `.text-base-medium`      | `--font-weight-medium` (`500`)     | `--font-size-base` (`16px`) | `--font-leading-6` (`24px`) | `--font-tracking-normal` (`0px`) |
| `.text-base-regular`     | `--font-weight-normal` (`400`)     | `--font-size-base` (`16px`) | `--font-leading-6` (`24px`) | `--font-tracking-normal` (`0px`) |
| `.text-base-light`       | `--font-weight-light` (`300`)      | `--font-size-base` (`16px`) | `--font-leading-6` (`24px`) | `--font-tracking-normal` (`0px`) |
| `.text-base-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-base` (`16px`) | `--font-leading-6` (`24px`) | `--font-tracking-normal` (`0px`) |
| `.text-base-thin`        | `--font-weight-thin` (`100`)       | `--font-size-base` (`16px`) | `--font-leading-6` (`24px`) | `--font-tracking-normal` (`0px`) |

#### Text-lg (9)

| 클래스                 | font-weight                        | font-size                 | line-height                 | letter-spacing                   |
| ---------------------- | ---------------------------------- | ------------------------- | --------------------------- | -------------------------------- |
| `.text-lg-black`       | `--font-weight-black` (`900`)      | `--font-size-lg` (`18px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-lg-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-lg` (`18px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-lg-bold`        | `--font-weight-bold` (`700`)       | `--font-size-lg` (`18px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-lg-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-lg` (`18px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-lg-medium`      | `--font-weight-medium` (`500`)     | `--font-size-lg` (`18px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-lg-regular`     | `--font-weight-normal` (`400`)     | `--font-size-lg` (`18px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-lg-light`       | `--font-weight-light` (`300`)      | `--font-size-lg` (`18px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-lg-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-lg` (`18px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-lg-thin`        | `--font-weight-thin` (`100`)       | `--font-size-lg` (`18px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |

#### Text-xl (9)

| 클래스                 | font-weight                        | font-size                 | line-height                 | letter-spacing                   |
| ---------------------- | ---------------------------------- | ------------------------- | --------------------------- | -------------------------------- |
| `.text-xl-black`       | `--font-weight-black` (`900`)      | `--font-size-xl` (`20px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-xl` (`20px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-xl-bold`        | `--font-weight-bold` (`700`)       | `--font-size-xl` (`20px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-xl` (`20px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-xl-medium`      | `--font-weight-medium` (`500`)     | `--font-size-xl` (`20px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-xl-regular`     | `--font-weight-normal` (`400`)     | `--font-size-xl` (`20px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-xl-light`       | `--font-weight-light` (`300`)      | `--font-size-xl` (`20px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-xl-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-xl` (`20px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |
| `.text-xl-thin`        | `--font-weight-thin` (`100`)       | `--font-size-xl` (`20px`) | `--font-leading-7` (`28px`) | `--font-tracking-normal` (`0px`) |

#### Text-2xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                 | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | --------------------------- | -------------------------------- |
| `.text-2xl-black`       | `--font-weight-black` (`900`)      | `--font-size-2xl` (`24px`) | `--font-leading-8` (`32px`) | `--font-tracking-normal` (`0px`) |
| `.text-2xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-2xl` (`24px`) | `--font-leading-8` (`32px`) | `--font-tracking-normal` (`0px`) |
| `.text-2xl-bold`        | `--font-weight-bold` (`700`)       | `--font-size-2xl` (`24px`) | `--font-leading-8` (`32px`) | `--font-tracking-normal` (`0px`) |
| `.text-2xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-2xl` (`24px`) | `--font-leading-8` (`32px`) | `--font-tracking-normal` (`0px`) |
| `.text-2xl-medium`      | `--font-weight-medium` (`500`)     | `--font-size-2xl` (`24px`) | `--font-leading-8` (`32px`) | `--font-tracking-normal` (`0px`) |
| `.text-2xl-regular`     | `--font-weight-normal` (`400`)     | `--font-size-2xl` (`24px`) | `--font-leading-8` (`32px`) | `--font-tracking-normal` (`0px`) |
| `.text-2xl-light`       | `--font-weight-light` (`300`)      | `--font-size-2xl` (`24px`) | `--font-leading-8` (`32px`) | `--font-tracking-normal` (`0px`) |
| `.text-2xl-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-2xl` (`24px`) | `--font-leading-8` (`32px`) | `--font-tracking-normal` (`0px`) |
| `.text-2xl-thin`        | `--font-weight-thin` (`100`)       | `--font-size-2xl` (`24px`) | `--font-leading-8` (`32px`) | `--font-tracking-normal` (`0px`) |

#### Text-3xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                 | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | --------------------------- | -------------------------------- |
| `.text-3xl-black`       | `--font-weight-black` (`900`)      | `--font-size-3xl` (`30px`) | `--font-leading-9` (`36px`) | `--font-tracking-normal` (`0px`) |
| `.text-3xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-3xl` (`30px`) | `--font-leading-9` (`36px`) | `--font-tracking-normal` (`0px`) |
| `.text-3xl-bold`        | `--font-weight-bold` (`700`)       | `--font-size-3xl` (`30px`) | `--font-leading-9` (`36px`) | `--font-tracking-normal` (`0px`) |
| `.text-3xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-3xl` (`30px`) | `--font-leading-9` (`36px`) | `--font-tracking-normal` (`0px`) |
| `.text-3xl-medium`      | `--font-weight-medium` (`500`)     | `--font-size-3xl` (`30px`) | `--font-leading-9` (`36px`) | `--font-tracking-normal` (`0px`) |
| `.text-3xl-regular`     | `--font-weight-normal` (`400`)     | `--font-size-3xl` (`30px`) | `--font-leading-9` (`36px`) | `--font-tracking-normal` (`0px`) |
| `.text-3xl-light`       | `--font-weight-light` (`300`)      | `--font-size-3xl` (`30px`) | `--font-leading-9` (`36px`) | `--font-tracking-normal` (`0px`) |
| `.text-3xl-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-3xl` (`30px`) | `--font-leading-9` (`36px`) | `--font-tracking-normal` (`0px`) |
| `.text-3xl-thin`        | `--font-weight-thin` (`100`)       | `--font-size-3xl` (`30px`) | `--font-leading-9` (`36px`) | `--font-tracking-normal` (`0px`) |

#### Text-4xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                  | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | ---------------------------- | -------------------------------- |
| `.text-4xl-black`       | `--font-weight-black` (`900`)      | `--font-size-4xl` (`36px`) | `--font-leading-10` (`40px`) | `--font-tracking-normal` (`0px`) |
| `.text-4xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-4xl` (`36px`) | `--font-leading-10` (`40px`) | `--font-tracking-normal` (`0px`) |
| `.text-4xl-bold`        | `--font-weight-bold` (`700`)       | `--font-size-4xl` (`36px`) | `--font-leading-10` (`40px`) | `--font-tracking-normal` (`0px`) |
| `.text-4xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-4xl` (`36px`) | `--font-leading-10` (`40px`) | `--font-tracking-normal` (`0px`) |
| `.text-4xl-medium`      | `--font-weight-medium` (`500`)     | `--font-size-4xl` (`36px`) | `--font-leading-10` (`40px`) | `--font-tracking-normal` (`0px`) |
| `.text-4xl-regular`     | `--font-weight-normal` (`400`)     | `--font-size-4xl` (`36px`) | `--font-leading-10` (`40px`) | `--font-tracking-normal` (`0px`) |
| `.text-4xl-light`       | `--font-weight-light` (`300`)      | `--font-size-4xl` (`36px`) | `--font-leading-10` (`40px`) | `--font-tracking-normal` (`0px`) |
| `.text-4xl-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-4xl` (`36px`) | `--font-leading-10` (`40px`) | `--font-tracking-normal` (`0px`) |
| `.text-4xl-thin`        | `--font-weight-thin` (`100`)       | `--font-size-4xl` (`36px`) | `--font-leading-10` (`40px`) | `--font-tracking-normal` (`0px`) |

#### Text-5xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                  | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | ---------------------------- | -------------------------------- |
| `.text-5xl-black`       | `--font-weight-black` (`900`)      | `--font-size-5xl` (`48px`) | `--font-leading-12` (`48px`) | `--font-tracking-normal` (`0px`) |
| `.text-5xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-5xl` (`48px`) | `--font-leading-12` (`48px`) | `--font-tracking-normal` (`0px`) |
| `.text-5xl-bold`        | `--font-weight-bold` (`700`)       | `--font-size-5xl` (`48px`) | `--font-leading-12` (`48px`) | `--font-tracking-normal` (`0px`) |
| `.text-5xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-5xl` (`48px`) | `--font-leading-12` (`48px`) | `--font-tracking-normal` (`0px`) |
| `.text-5xl-medium`      | `--font-weight-medium` (`500`)     | `--font-size-5xl` (`48px`) | `--font-leading-12` (`48px`) | `--font-tracking-normal` (`0px`) |
| `.text-5xl-regular`     | `--font-weight-normal` (`400`)     | `--font-size-5xl` (`48px`) | `--font-leading-12` (`48px`) | `--font-tracking-normal` (`0px`) |
| `.text-5xl-light`       | `--font-weight-light` (`300`)      | `--font-size-5xl` (`48px`) | `--font-leading-12` (`48px`) | `--font-tracking-normal` (`0px`) |
| `.text-5xl-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-5xl` (`48px`) | `--font-leading-12` (`48px`) | `--font-tracking-normal` (`0px`) |
| `.text-5xl-thin`        | `--font-weight-thin` (`100`)       | `--font-size-5xl` (`48px`) | `--font-leading-12` (`48px`) | `--font-tracking-normal` (`0px`) |

#### Text-6xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                  | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | ---------------------------- | -------------------------------- |
| `.text-6xl-black`       | `--font-weight-black` (`900`)      | `--font-size-6xl` (`60px`) | `--font-leading-15` (`60px`) | `--font-tracking-normal` (`0px`) |
| `.text-6xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-6xl` (`60px`) | `--font-leading-15` (`60px`) | `--font-tracking-normal` (`0px`) |
| `.text-6xl-bold`        | `--font-weight-bold` (`700`)       | `--font-size-6xl` (`60px`) | `--font-leading-15` (`60px`) | `--font-tracking-normal` (`0px`) |
| `.text-6xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-6xl` (`60px`) | `--font-leading-15` (`60px`) | `--font-tracking-normal` (`0px`) |
| `.text-6xl-medium`      | `--font-weight-medium` (`500`)     | `--font-size-6xl` (`60px`) | `--font-leading-15` (`60px`) | `--font-tracking-normal` (`0px`) |
| `.text-6xl-regular`     | `--font-weight-normal` (`400`)     | `--font-size-6xl` (`60px`) | `--font-leading-15` (`60px`) | `--font-tracking-normal` (`0px`) |
| `.text-6xl-light`       | `--font-weight-light` (`300`)      | `--font-size-6xl` (`60px`) | `--font-leading-15` (`60px`) | `--font-tracking-normal` (`0px`) |
| `.text-6xl-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-6xl` (`60px`) | `--font-leading-15` (`60px`) | `--font-tracking-normal` (`0px`) |
| `.text-6xl-thin`        | `--font-weight-thin` (`100`)       | `--font-size-6xl` (`60px`) | `--font-leading-15` (`60px`) | `--font-tracking-normal` (`0px`) |

#### Text-7xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                  | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | ---------------------------- | -------------------------------- |
| `.text-7xl-black`       | `--font-weight-black` (`900`)      | `--font-size-7xl` (`72px`) | `--font-leading-18` (`72px`) | `--font-tracking-normal` (`0px`) |
| `.text-7xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-7xl` (`72px`) | `--font-leading-18` (`72px`) | `--font-tracking-normal` (`0px`) |
| `.text-7xl-bold`        | `--font-weight-bold` (`700`)       | `--font-size-7xl` (`72px`) | `--font-leading-18` (`72px`) | `--font-tracking-normal` (`0px`) |
| `.text-7xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-7xl` (`72px`) | `--font-leading-18` (`72px`) | `--font-tracking-normal` (`0px`) |
| `.text-7xl-medium`      | `--font-weight-medium` (`500`)     | `--font-size-7xl` (`72px`) | `--font-leading-18` (`72px`) | `--font-tracking-normal` (`0px`) |
| `.text-7xl-regular`     | `--font-weight-normal` (`400`)     | `--font-size-7xl` (`72px`) | `--font-leading-18` (`72px`) | `--font-tracking-normal` (`0px`) |
| `.text-7xl-light`       | `--font-weight-light` (`300`)      | `--font-size-7xl` (`72px`) | `--font-leading-18` (`72px`) | `--font-tracking-normal` (`0px`) |
| `.text-7xl-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-7xl` (`72px`) | `--font-leading-18` (`72px`) | `--font-tracking-normal` (`0px`) |
| `.text-7xl-thin`        | `--font-weight-thin` (`100`)       | `--font-size-7xl` (`72px`) | `--font-leading-18` (`72px`) | `--font-tracking-normal` (`0px`) |

#### Text-8xl (9)

| 클래스                  | font-weight                        | font-size                  | line-height                  | letter-spacing                   |
| ----------------------- | ---------------------------------- | -------------------------- | ---------------------------- | -------------------------------- |
| `.text-8xl-black`       | `--font-weight-black` (`900`)      | `--font-size-8xl` (`96px`) | `--font-leading-24` (`96px`) | `--font-tracking-normal` (`0px`) |
| `.text-8xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-8xl` (`96px`) | `--font-leading-24` (`96px`) | `--font-tracking-normal` (`0px`) |
| `.text-8xl-bold`        | `--font-weight-bold` (`700`)       | `--font-size-8xl` (`96px`) | `--font-leading-24` (`96px`) | `--font-tracking-normal` (`0px`) |
| `.text-8xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-8xl` (`96px`) | `--font-leading-24` (`96px`) | `--font-tracking-normal` (`0px`) |
| `.text-8xl-medium`      | `--font-weight-medium` (`500`)     | `--font-size-8xl` (`96px`) | `--font-leading-24` (`96px`) | `--font-tracking-normal` (`0px`) |
| `.text-8xl-regular`     | `--font-weight-normal` (`400`)     | `--font-size-8xl` (`96px`) | `--font-leading-24` (`96px`) | `--font-tracking-normal` (`0px`) |
| `.text-8xl-light`       | `--font-weight-light` (`300`)      | `--font-size-8xl` (`96px`) | `--font-leading-24` (`96px`) | `--font-tracking-normal` (`0px`) |
| `.text-8xl-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-8xl` (`96px`) | `--font-leading-24` (`96px`) | `--font-tracking-normal` (`0px`) |
| `.text-8xl-thin`        | `--font-weight-thin` (`100`)       | `--font-size-8xl` (`96px`) | `--font-leading-24` (`96px`) | `--font-tracking-normal` (`0px`) |

#### Text-9xl (9)

| 클래스                  | font-weight                        | font-size                   | line-height                   | letter-spacing                   |
| ----------------------- | ---------------------------------- | --------------------------- | ----------------------------- | -------------------------------- |
| `.text-9xl-black`       | `--font-weight-black` (`900`)      | `--font-size-9xl` (`128px`) | `--font-leading-32` (`128px`) | `--font-tracking-normal` (`0px`) |
| `.text-9xl-extra-bold`  | `--font-weight-extrabold` (`800`)  | `--font-size-9xl` (`128px`) | `--font-leading-32` (`128px`) | `--font-tracking-normal` (`0px`) |
| `.text-9xl-bold`        | `--font-weight-bold` (`700`)       | `--font-size-9xl` (`128px`) | `--font-leading-32` (`128px`) | `--font-tracking-normal` (`0px`) |
| `.text-9xl-semi-bold`   | `--font-weight-semibold` (`600`)   | `--font-size-9xl` (`128px`) | `--font-leading-32` (`128px`) | `--font-tracking-normal` (`0px`) |
| `.text-9xl-medium`      | `--font-weight-medium` (`500`)     | `--font-size-9xl` (`128px`) | `--font-leading-32` (`128px`) | `--font-tracking-normal` (`0px`) |
| `.text-9xl-regular`     | `--font-weight-normal` (`400`)     | `--font-size-9xl` (`128px`) | `--font-leading-32` (`128px`) | `--font-tracking-normal` (`0px`) |
| `.text-9xl-light`       | `--font-weight-light` (`300`)      | `--font-size-9xl` (`128px`) | `--font-leading-32` (`128px`) | `--font-tracking-normal` (`0px`) |
| `.text-9xl-extra-light` | `--font-weight-extralight` (`200`) | `--font-size-9xl` (`128px`) | `--font-leading-32` (`128px`) | `--font-tracking-normal` (`0px`) |
| `.text-9xl-thin`        | `--font-weight-thin` (`100`)       | `--font-size-9xl` (`128px`) | `--font-leading-32` (`128px`) | `--font-tracking-normal` (`0px`) |

## 스페이싱 (`--spacing-*`, 2026-09-17 통합)

⚠️ **이 절은 2026-09-17 재구조화로 대체되었습니다.** 아래 "Padding" 절 하단의
"⚠️ 2026-09-17 재구조화" 안내와 `src/tokens/spacing.css` 파일 헤더 주석을 참고하세요.
기존 `--spacing-gap-*` 접두사는 `--spacing-*`로 이름이 바뀌었을 뿐 값은 동일합니다.

## Radius

⚠️ **Figma Variable이 아니라 "Design Token" 문서 섹션(프레임 `DS — tw/border-radius`,
node-id `4122:8047`, "tw/border-radius — 10개", 설명 "코너 라운딩 토큰.")에
하드코딩된 값입니다.** Figma에 실제 Variable이 생기면 재추출 필요.

**출처 검증**: 값은 `get_metadata`로 받은 레이어 트리에서 텍스트 레이어 이름
("rounded-md 8px" 등)을 읽은 것이며, `get_design_context`는 사용하지 않았습니다.
`get_variable_defs`를 이 프레임 노드와 개별 스와치(rounded-rectangle 도형) 노드에도
직접 호출했지만 전부 빈 값(`{}`)이 반환되어 실제 Variable 바인딩은 확인되지
않았습니다. 개수(10)가 "DS — Overview"의 실제 Variable Collection
개수("tw/border-radius — 10개")와 일치하는 것은 이 문서 프레임이 해당 컬렉션을
1:1로 시각적으로 미러링해서 만들어졌기 때문으로 보이며, "값이 Variable에서
나왔다"는 근거는 아닙니다 (자세한 근거는 `src/tokens/radius.css` 파일 헤더 주석
참고).

⚠️ **이름 충돌**: `app/globals.css`에 이미 Shadcn 기본 `--radius`, `--radius-sm`,
`--radius-md`, `--radius-lg`, `--radius-xl`(모두 `--radius: 0.625rem` 기준
`calc()`)이 있어 `rounded-sm/md/lg/xl` 이름을 그대로 쓰면 충돌합니다. 그래서
`src/tokens/radius.css`의 모든 변수는 `--radius-scale-*` 접두사로 분리했고, 기존
Shadcn `--radius*` 변수는 **건드리지 않았습니다.**

(흥미로운 점: 우연히 Figma의 rounded-sm/md/lg/xl 값이 현재 Shadcn calc() 결과값과
각각 정확히 6px/8px/10px/14px로 일치합니다 — `--radius-sm`=10px-4px=6px,
`--radius-md`=10px-2px=8px, `--radius-lg`=10px, `--radius-xl`=10px+4px=14px. 계산
방식은 다르지만 현재 수치는 서로 어긋나지 않습니다.)

| Figma 이름   | CSS Property        | 값                         |
| ------------ | ------------------- | -------------------------- |
| rounded-none | --radius-scale-none | `0px`                      |
| rounded-xs   | --radius-scale-xs   | `2px`                      |
| rounded-sm   | --radius-scale-sm   | `6px`                      |
| rounded-md   | --radius-scale-md   | `8px`                      |
| rounded-lg   | --radius-scale-lg   | `10px`                     |
| rounded-xl   | --radius-scale-xl   | `14px`                     |
| rounded-2xl  | --radius-scale-2xl  | `18px`                     |
| rounded-3xl  | --radius-scale-3xl  | `22px`                     |
| rounded-4xl  | --radius-scale-4xl  | `26px`                     |
| rounded-full | --radius-scale-full | `9999px` (Figma 표기: `∞`) |

## Effect (Shadow/Blur)

> 2026-08-01 추가 조사: Figma `DS — Effect Styles` 프레임(node-id `4122-8696`,
> Effect Styles 컬렉션 전체 27개)에서 기존 7개(Box Shadow shadow-2xs~2xl) 외
> 나머지 20개(Box Shadow 4개 + Backdrop Blur 8개 + Blur 8개)를 전부 추출해
> `effects.css`에 반영했습니다. 27개 전체 반영 완료.

Figma 그룹명 `Box Shadow/shadow-*` → CSS `--shadow-*` (그룹명 "Box Shadow"는
"shadow" 접두사와 중복되어 변수명에서 생략). 값은 여러 `DROP_SHADOW` 이펙트를
CSS `box-shadow` 문법(`offset-x offset-y blur spread color`, 콤마로 다중 연결)으로 변환.
`INNER_SHADOW`는 `inset` 키워드를 앞에 붙여 변환. `Layer Blur`/`Backdrop Blur`
그룹은 각각 CSS `filter`/`backdrop-filter`에 그대로 대입 가능한 `blur(Npx)` 값으로 변환.

| Figma 변수명                     | CSS Property         | 값                                                          | 용도                                                            |
| -------------------------------- | -------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- |
| Box Shadow/shadow-2xs            | --shadow-2xs         | `0px 1px 0px 0px #0000000d`                                 | 최소 그림자                                                     |
| Box Shadow/shadow-xs             | --shadow-xs          | `0px 1px 2px 0px #0000001a`                                 | 아주 옅은 그림자                                                |
| Box Shadow/shadow-sm             | --shadow-sm          | `0px 1px 3px 0px #0000001a`                                 | 작은 그림자                                                     |
| Box Shadow/shadow-md             | --shadow-md          | `0px 2px 4px -2px #0000001a, 0px 4px 6px -1px #0000001a`    | 중간 그림자 (카드 등)                                           |
| Box Shadow/shadow-lg             | --shadow-lg          | `0px 4px 6px -4px #0000001a, 0px 10px 15px -3px #0000001a`  | 큰 그림자 (팝오버 등)                                           |
| Box Shadow/shadow-xl             | --shadow-xl          | `0px 8px 10px -6px #0000001a, 0px 20px 25px -5px #0000001a` | 매우 큰 그림자                                                  |
| Box Shadow/shadow-2xl            | --shadow-2xl         | `0px 25px 50px -12px #00000040`                             | 최대 그림자 (모달 등)                                           |
| Box Shadow/shadow-inner          | --shadow-inner       | `inset 0px 2px 4px 0px #0000000f`                           | 내부 그림자 (INNER_SHADOW, 예: 인풋 눌림 효과)                  |
| Box Shadow/shadow-none           | --shadow-none        | `0px 0px 0px 0px #00000000`                                 | 그림자 없음 (투명, 리셋용)                                      |
| Box Shadow/Focus ring            | --shadow-focus-ring  | `0px 0px 0px 3px #a1a1a180`                                 | 포커스 상태 아웃라인 (box-shadow 링, spread 3px)                |
| Box Shadow/Destructive           | --shadow-destructive | `0px 0px 0px 3px #dc262633`                                 | 위험/삭제 액션 포커스·에러 링 (box-shadow 링, spread 3px)       |
| Backdrop Blur/backdrop-blur-none | --backdrop-blur-none | `blur(0px)`                                                 | 배경 블러 없음                                                  |
| Backdrop Blur/backdrop-blur-sm   | --backdrop-blur-sm   | `blur(4px)`                                                 | 배경 블러 (옅음)                                                |
| Backdrop Blur/backdrop-blur      | --backdrop-blur-8    | `blur(8px)`                                                 | 배경 블러 (기본값, Figma 이름에 접미사 없어 값을 이름에 사용)   |
| Backdrop Blur/backdrop-blur-md   | --backdrop-blur-md   | `blur(12px)`                                                | 배경 블러 (중간)                                                |
| Backdrop Blur/backdrop-blur-lg   | --backdrop-blur-lg   | `blur(16px)`                                                | 배경 블러 (큼)                                                  |
| Backdrop Blur/backdrop-blur-xl   | --backdrop-blur-xl   | `blur(24px)`                                                | 배경 블러 (매우 큼)                                             |
| Backdrop Blur/backdrop-blur-2xl  | --backdrop-blur-2xl  | `blur(40px)`                                                | 배경 블러 (초대형)                                              |
| Backdrop Blur/backdrop-blur-3xl  | --backdrop-blur-3xl  | `blur(64px)`                                                | 배경 블러 (최대)                                                |
| Blur/blur-none                   | --blur-none          | `blur(0px)`                                                 | 레이어 블러 없음                                                |
| Blur/blur-sm                     | --blur-sm            | `blur(4px)`                                                 | 레이어 블러 (옅음)                                              |
| Blur/blur                        | --blur-8             | `blur(8px)`                                                 | 레이어 블러 (기본값, Figma 이름에 접미사 없어 값을 이름에 사용) |
| Blur/blur-md                     | --blur-md            | `blur(12px)`                                                | 레이어 블러 (중간)                                              |
| Blur/blur-lg                     | --blur-lg            | `blur(16px)`                                                | 레이어 블러 (큼)                                                |
| Blur/blur-xl                     | --blur-xl            | `blur(24px)`                                                | 레이어 블러 (매우 큼)                                           |
| Blur/blur-2xl                    | --blur-2xl           | `blur(40px)`                                                | 레이어 블러 (초대형)                                            |
| Blur/blur-3xl                    | --blur-3xl           | `blur(64px)`                                                | 레이어 블러 (최대)                                              |

Effect Styles 컬렉션 전체 27개(Box Shadow 11 + Backdrop Blur 8 + Blur 8)를
모두 확인해 반영했습니다. 미반영 항목 없음.

## Raw Numeric Scale (`tokens` 컬렉션, `--scale-*`)

⚠️ **Figma Variable이 아니라 "Design Token" 문서 섹션(프레임 `DS — tokens`,
node-id `4122:8425`, "tokens — 89개", 설명 "범용 수치 토큰 — 다른 컬렉션에서
alias로 참조하는 원시값.")에 하드코딩된 값입니다.** Figma에 실제 Variable이
생기면 재추출 필요.

**출처 검증**: 값은 `get_metadata`로 받은 레이어 트리에서 텍스트 레이어 이름
쌍(예: `"0,5"`/`"0.5"`, `"-0,8"`/`"-0.800000011920929"`)을 읽은 것이며,
`get_design_context`는 사용하지 않았습니다. `get_variable_defs`를 이 프레임
노드(`4122:8425`)에 직접 호출해도 빈 값(`{}`)이 반환되어 실제 Variable 바인딩은
확인되지 않았습니다. 개수(89)가 "DS — Overview"의 실제 Variable Collection
개수("tokens — 89개")와 일치합니다.

**정체**: 이름 그대로 순수 raw 숫자 스케일이지만, 단일 목적(z-index/duration/
breakpoint 전용 등)이 아니라 **여러 컬렉션이 공유해서 alias로 참조하는 범용
숫자 풀(pool)**로 파악됩니다 (프레임 자체의 설명 문구 근거).

- `tw/stroke-width`(11개)의 0.5~3 구간(0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25,
  2.5, 2.75, 3)과 값이 정확히 일치 → stroke-width가 이 풀을 참조하는 것으로 추정.
- `tw/padding`(175개)이 변환하는 px 결과값들(10, 12, 14, ..., 384 등)과 일치 →
  padding도 이 풀을 참조하는 것으로 추정.
- `tw/font` tracking 값(-0.8, -0.4, 0, 0.4, 0.8, 1.6)과도 정확히 일치.
- 640/768/1024/1152/1280/1536은 Tailwind breakpoint(sm/md/lg/xl/2xl)와 유사한
  값대이나, 이 프레임 자체엔 breakpoint 라벨이 없어 추정입니다.
- 9999는 `tw/border-radius`의 `rounded-full`(9999px)과 값이 일치.
- ⚠️ **alias 관계는 "값 완전 일치"로 추론한 것이며, 원문에 명시적 alias 표기나
  참조 라벨은 발견하지 못했습니다.** `get_variable_defs`가 이 프레임에 빈 값만
  반환해 실제 Variable 참조 체인은 검증할 수 없었습니다 (⚠️ FLAG, Figma 변수
  패널에서 직접 확인 권장).

단위 없음: 프레임 자체에 px/%/기타 단위 표기가 없어 순수 숫자만 있고, 파일의
모든 변수도 단위 없는 raw 숫자로 선언했습니다. 콤마(,)는 마침표의 로캘 표기라
하이픈으로, 음수는 `neg-` 접두사로 표기했습니다 (예: `"-0,8"` →
`--scale-neg-0-8`).

대표 값 예시:

| Figma 이름(step) | CSS Property    | 값     |
| ---------------- | --------------- | ------ |
| -0,8             | --scale-neg-0-8 | `-0.8` |
| -0,4             | --scale-neg-0-4 | `-0.4` |
| 0                | --scale-0       | `0`    |
| 0,5              | --scale-0-5     | `0.5`  |
| 1                | --scale-1       | `1`    |
| 16               | --scale-16      | `16`   |
| 384              | --scale-384     | `384`  |
| 1536             | --scale-1536    | `1536` |
| 9999             | --scale-9999    | `9999` |

전체 89개 값은 `src/tokens/scale.css` 참고.

## Spacing / Border (`--spacing-*`, `--border-*`) — 2026-09-17 재구조화

⚠️ **아래는 2026-08-01 조사 당시 구조이며, 사용자가 Figma에서 직접 변수
구조를 재정리한 2026-09-17 기준 더 이상 유효하지 않습니다. 새 구조를
기준으로 작업하세요.**

사용자가 Figma DS 파일(`PrsHuyyra9LzqqrDwmrB5P`, 📌 GB_Design-System-v2.3)에서
직접 다음과 같이 재정리했고, 그 결과를 코드에 반영했습니다:

1. **gap + padding → `--spacing-*` 단일 스케일로 통합** (`src/tokens/spacing.css`).
   기존 `--spacing-padding-*`/`--spacing-gap-*` 접두사는 전부 `--spacing-*`로
   이름이 바뀌었습니다. 값은 변경 없음(기존 padding의 35스텝 그대로, gap의
   34스텝을 포함).
2. **stroke-width + border-width → `--border-*` 단일 스케일로 통합**
   (`src/tokens/border.css`, 신규 파일). 실사용처가 있던 `--border-1`(1px),
   `--border-2`(2px)만 남았고, 방향별 변수(`-b`/`-t`/`-l`/`-r`), 0.25 간격
   분수 스텝(`stroke-width` 계열), 4px/8px 스텝은 실사용처가 0건이라 폐기했습니다.
3. **방향별(top/right/bottom/left) 전용 변수 컬렉션 폐지.** 방향이 필요한 곳은
   `--spacing-*` 값을 속성별로 개별 적용합니다(예:
   `pl-[var(--spacing-3)] pr-[var(--spacing-2)]`). 좌우 값이 다른 컴포넌트
   (`textarea.tsx`, 좌 12px/우 8px)도 강제로 통일하지 않고 이 방식으로 각자
   다른 스케일 값을 그대로 유지했습니다(사용자 확인: 값이 다르면 이유가
   있을 것이므로 임의로 합치지 말 것).
4. **`padding.css`, `border-width.css`, `stroke-width.css` 파일 삭제.**
   `app/globals.css`의 `@import` 목록도 갱신했습니다.
5. Storybook 파운데이션 페이지도 통합: `Foundation/Padding` +
   `Foundation/Spacing` → `Foundation/Spacing` 하나로, `Foundation/Border Width`
   - `Foundation/Stroke Width` → `Foundation/Border` 하나로 병합했습니다.

이번 라운드에서 **변경하지 않은 것**(별도 결정 대기 또는 보류): `colors.css`의
`rdx-*` 팔레트(396개, 실사용 4곳 중 3곳은 `persona-radial-chart.tsx`로 이번엔
제외, `badge.tsx`의 destructive 텍스트 색상은 보류), `scale.css`(Figma
Variable은 아니지만 컴포넌트 자체 크기용 내부 구현 상수로 존치하기로 결정).

기존 "Padding" / "Border Width" / "Stroke Width" 절의 2026-08-01 당시 세부
조사 기록(node-id, 출처 검증 등)은 현재 코드 구조와 맞지 않아 이 문서에서
제거했습니다. 필요하면 git 히스토리에서 확인하세요.

## Opacity (`--opacity-*`)

⚠️ **Figma Variable이 아니라 "Design Token" 문서 섹션(프레임 `DS —
tw/opacity`, node-id `4122:8359`, "tw/opacity — 21개")에 하드코딩된 값입니다.**
Figma에 실제 Variable이 생기면 재추출 필요.

**출처 검증**: 값은 `get_metadata`로 받은 레이어 트리에서 텍스트 레이어
이름(`"opacity-50 50"` 등)을 읽은 것이며, `get_design_context`는 사용하지
않았습니다. `get_variable_defs`를 이 프레임 노드(`4122:8359`)에 직접 호출해도
빈 값(`{}`)이 반환되어 실제 Variable 바인딩은 확인되지 않았습니다. 개수(21)가
"DS — Overview"의 실제 Variable Collection 개수("tw/opacity — 21개")와
일치합니다.

구조: Tailwind opacity 스케일과 동일하게 0~~100을 5 단위로 증가(0, 5, 10, ...,
100 = 21스텝). Figma 라벨은 단위 없는 정수(0~~100)로만 표기되어 있어, CSS
`opacity` 속성(0~1 소수)에 바로 대입 가능하도록 100으로 나눈 소수값으로
변환했습니다 (예: 50 → 0.5).

`tokens` 컬렉션(89개, `src/tokens/scale.css`)에도 5, 10, 15, ..., 100 값들이
포함되어 있어 이 컬렉션이 그 raw 숫자 풀을 참조하는 것으로 추정됩니다 (원문
alias 표기는 없어 "값 일치" 근거임, ⚠️ FLAG).

| Figma 이름(step) | CSS Property  | 값     |
| ---------------- | ------------- | ------ |
| opacity-0        | --opacity-0   | `0`    |
| opacity-5        | --opacity-5   | `0.05` |
| opacity-50       | --opacity-50  | `0.5`  |
| opacity-100      | --opacity-100 | `1`    |

전체 21개 값은 `src/tokens/opacity.css` 참고.

## 생성된 토큰 파일

| 파일                         | 상태                                                                                                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/tokens/colors.css`      | Primitive (tw) 244 + Primitive (rdx) 396(33팔레트×12, **2026-08-01 신규 추가**) + Semantic 18(light) + `.dark` 블록(semantic 16개 다크 값, 이 중 3개 슬롯을 rdx 참조로 교체)  |
| `src/tokens/effects.css`     | 27개 전체 반영 (기존 Box Shadow 7 + 신규 20: Box Shadow 4/Backdrop Blur 8/Blur 8, **2026-08-01 추가**)                                                                        |
| `src/tokens/typography.css`  | **신규 생성** (size 13 + weight 9 + leading 13 + tracking 6 = 41, ⚠️ Figma Variable 아님)                                                                                     |
| `src/tokens/spacing.css`     | **2026-09-17 재작성** (기존 padding 35스텝 + gap 34스텝을 `--spacing-*` 단일 스케일로 통합, 35개, ⚠️ Figma Variable 아님)                                                     |
| `src/tokens/radius.css`      | **신규 생성** (10, `--radius-scale-*` 접두사, ⚠️ Figma Variable 아님)                                                                                                         |
| `src/tokens/scale.css`       | **신규 생성 (2026-08-01)**, 존치 결정(2026-09-17) (`tokens` 컬렉션 89, `--scale-*` 접두사, 단위 없는 raw 숫자, Figma엔 대응 변수 없어졌으나 컴포넌트 크기용 내부 상수로 유지) |
| `src/tokens/border.css`      | **2026-09-17 신규 생성** (기존 border-width 25개 + stroke-width 11개를 통합, 실사용 확인된 `--border-1`/`--border-2` 2개만 유지)                                              |
| `src/tokens/opacity.css`     | **신규 생성 (2026-08-01)** (`tw/opacity` 21, `--opacity-*` 접두사, ⚠️ Figma Variable 아님)                                                                                    |
| `src/tokens/text-styles.css` | **신규 생성 (2026-08-01, node-id 4143:2666)** (Text Style 118 = size 13 × weight 9 + Time Stamp 1, `.text-{size}-{weight}` 클래스, 5개 속성 전부 명시적으로 확인)             |

`app/globals.css` 최상단에 다음 import가 추가되어 있습니다.

```css
@import "tailwindcss";
@import "../src/tokens/colors.css";
@import "../src/tokens/effects.css";
@import "../src/tokens/typography.css";
@import "../src/tokens/spacing.css";
@import "../src/tokens/radius.css";
@import "../src/tokens/scale.css";
@import "../src/tokens/border.css";
@import "../src/tokens/opacity.css";
@import "../src/tokens/text-styles.css";
```

## Claude용 규칙

1. Figma MCP가 hex 색상 반환 → 이 테이블에서 찾아서 `var(--color-*)` 사용
2. Figma가 spacing/padding/gap/border 숫자 반환 → `src/tokens/spacing.css`의
   `--spacing-*`(2026-09-17부터 padding+gap 통합 단일 스케일) 또는
   `src/tokens/border.css`의 `--border-*`(border-width+stroke-width 통합)에서
   가장 가까운 값을 찾아 사용. 방향별(top/right/bottom/left) 전용 변수는 더 이상
   없으므로, 방향이 필요하면 이 스케일 값을 속성별로 개별 적용할 것(좌우 값이
   다르면 강제로 통일하지 말 것).
3. Figma가 radius 숫자 반환 → `src/tokens/radius.css`의 `--radius-scale-*` 사용.
   기존 Shadcn `--radius`, `--radius-sm/md/lg/xl`과 이름이 다르므로 혼동 주의
   (Shadcn 값을 임의로 대체하지 말 것).
4. Figma가 폰트 size/weight/line-height/letter-spacing 반환 → `src/tokens/typography.css`의
   `--font-size-*` / `--font-weight-*` / `--font-leading-*` / `--font-tracking-*`
   에서 각각 가장 가까운 값을 찾아 사용 (하나의 번들 토큰이 아니라 4개의 독립 스케일).
5. 테이블에 없는 값 → 새 변수 만들지 말고 `/* ⚠️ 누락된 토큰 */` 플래그
6. `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`,
   `destructive`, `border`, `input`, `ring` 및 각 `-foreground` 변형은 이미
   `app/globals.css`에 Shadcn 기본값으로 정의되어 있으므로 **그대로 사용**
   (Figma 값과 다를 수 있음 — 위 "충돌" 표 참고, 임의로 덮어쓰지 말 것)
