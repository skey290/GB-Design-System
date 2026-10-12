# Gabrielle Design System

Gabrielle 앱 전반(Dashboard / Compass / Content Studio / Know Thyself / Assets)에서 공통으로 쓰는
**범용 아토믹 디자인 시스템 컴포넌트 모음**입니다. 특정 앱에 종속된 컴포넌트(예: Compass 전용 3D 시각화,
Dashboard 전용 차트)는 포함하지 않으며, 그런 컴포넌트는 별도 저장소([GB-Data-Vis](https://github.com/skey290/GB-Data-Vis))에 공개되어 있습니다.

커스터마이징된 Shadcn(shadcn/ui) 기반이며, 실제 디자인 값(색상/보더/간격/타이포그래피 등)은 Figma 디자인 토큰을
그대로 반영합니다.

## 빠르게 실행하기

```bash
npm install
npm run storybook
```

http://localhost:6006 에서 컴포넌트별 `Playground` story를 확인할 수 있습니다 — variant/상태를 story로 나누지 않고 Controls에서 모든 prop을 직접 조작합니다.

```bash
npm run dev
```

http://localhost:3000 에서 최소 쉘 페이지가 뜹니다(디자인 토큰/폰트 로딩 확인용, 별도 데모 페이지는 없음).

## 구성

```
app/
  globals.css                 디자인 토큰(src/tokens/*.css) import + Tailwind 베이스
  layout.tsx                  폰트(Inter, Bitcount Grid Single) + 라이트/다크 테마 초기화 스크립트
src/tokens/
  colors.css, spacing.css,    Figma 기준 디자인 토큰, `--gb-` prefix (Style Dictionary
  typography.css, radius.css, 소스 아님, 이 CSS 파일 자체가 원본)
  border.css, opacity.css,
  effects.css, text-styles.css
components/foundation/        토큰 Storybook 문서 (Colors/Typography/Spacing/Radius/Border/Opacity/Effects)
components/ui/                범용 UI 컴포넌트 (아래 목록)
lib/
  utils.ts                    cn() — clsx + tailwind-merge 커스텀 설정
  sprite-icon.tsx              /public/icons.svg 스프라이트 아이콘 헬퍼
docs/
  design-tokens.md            토큰 매핑/사용 가이드
  components/*.md             컴포넌트별 레퍼런스 문서 (Props, 사용 예시)
```

### 포함된 컴포넌트 (`components/ui/`, 29개)

| 분류        | 컴포넌트                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------- |
| 텍스트 입력 | `input`, `part-input`, `input-phone`, `input-search`, `input-time`, `textarea`, `chatbox` |
| 선택        | `checkbox`, `switch`, `slider`, `select`, `calendar`, `date-select`, `range-select`       |
| 버튼/토글   | `button`, `button-group`, `toggle`, `chips`                                               |
| 네비게이션  | `tabs`, `pagination`, `scrollbar`                                                         |
| 오버레이    | `popover`, `tooltip`                                                                      |
| 피드백/상태 | `badge`, `progress`, `progress-bar`, `skeleton`, `spinner`                                |
| 표시        | `avatar`                                                                                  |

`part-input`과 `progress-bar`는 각각 `input` 계열과 `progress`의 내부 조각이라
단독으로 쓰지 않습니다 (Figma `Part/*`에 대응).

특정 앱에 종속된 컴포넌트(GNB, 프로필 카드, 알림 드롭다운 등)는 이 저장소에
없습니다.

컴포넌트 1개는 `.tsx` / `.stories.tsx` / `.test.tsx` / `index.ts` 4개 파일로 구성됩니다.

## 빌드 및 테스트

```bash
npm run build            # Next.js 프로덕션 빌드
npm run build-storybook  # Storybook 정적 빌드
npm run typecheck        # tsc --noEmit
npm test                 # Vitest
```

## 디자인 토큰 규칙

- 하드코딩된 색상값(hex/rgb/hsl), 스페이싱 금지.
- 색은 **시맨틱 토큰**(`--gb-background-*` / `--gb-border-*` / `--gb-icon-*` / `--gb-text-*`)을
  쓰세요. primitive 팔레트(`--gb-color-neutral-500` 등)를 컴포넌트에서 직접 참조하면
  다크모드 전환이 깨집니다.
- 간격은 `var(--gb-spacing-*)`, 타이포그래피는 `.text-*` 스타일 클래스를 씁니다.
  컴포넌트 자체 크기(높이/너비)는 Figma 확정값을 리터럴 px로 둡니다(예: `h-[36px]`).
- 자세한 매핑은 `docs/design-tokens.md` 참고.
