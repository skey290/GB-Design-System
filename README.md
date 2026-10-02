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

http://localhost:6006 에서 모든 컴포넌트의 variant/상태별 story를 확인할 수 있습니다.

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
  colors.css, spacing.css,    Figma 기준 디자인 토큰 (Style Dictionary 소스 아님,
  typography.css, radius.css, 이 CSS 파일 자체가 원본)
  border.css, opacity.css,
  scale.css, effects.css,
  text-styles.css
components/foundation/        토큰 Storybook 문서 (Colors/Typography/Spacing/Radius/Border/Opacity/Scale/Effects)
components/ui/                범용 UI 컴포넌트 (아래 목록)
lib/
  utils.ts                    cn() — clsx + tailwind-merge 커스텀 설정
  sprite-icon.tsx              /public/icons.svg 스프라이트 아이콘 헬퍼
docs/
  design-tokens.md            토큰 매핑/사용 가이드
  components/*.md             컴포넌트별 레퍼런스 문서 (Props, 사용 예시)
```

### 포함된 컴포넌트 (`components/ui/`)

| 분류              | 컴포넌트                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 입력              | `input`, `input-basic`, `input-file-upload`, `input-link`, `input-phone`, `input-search`, `textarea`, `checkbox`, `switch`, `slider`, `range-select`, `date-select` |
| 버튼/선택         | `button`, `button-group`, `google-button`, `toggle`, `select`, `tabs`, `pagination`                                                                                 |
| 오버레이/메뉴     | `popover`, `floating-menu`, `menu-button`, `menu-notification`, `noti-dropdown`, `tooltip`                                                                          |
| 피드백/상태       | `badge`, `chips`, `progress-bar`, `skeleton`, `spinner`, `carousel`                                                                                                 |
| 네비게이션/프로필 | `gnb`, `avatar`, `floating-profile`                                                                                                                                 |
| 기타              | `calendar`, `chatbox`, `asset-history-drawer`, `onboarding-tone-card`, `persona-action-menu`, `profile-print`                                                       |

> `asset-history-drawer` / `onboarding-tone-card` / `persona-action-menu` / `profile-print`는 특정 앱에서만
> 쓰일 가능성이 있어 추후 app 전용 저장소로 재분류될 수 있습니다.

컴포넌트 1개는 `.tsx` / `.stories.tsx` / `.test.tsx` / `index.ts` 4개 파일로 구성됩니다.

## 빌드 및 테스트

```bash
npm run build            # Next.js 프로덕션 빌드
npm run build-storybook  # Storybook 정적 빌드
npm run typecheck        # tsc --noEmit
npm test                 # Vitest
```

## 디자인 토큰 규칙

- 하드코딩된 색상값(hex/rgb/hsl), 스페이싱 금지 — 반드시 `var(--color-*)`, `var(--spacing-*)` 사용.
- 타이포그래피는 `var(--font-*)`, `var(--text-*)` 토큰만 사용.
- 자세한 매핑은 `docs/design-tokens.md` 참고.
