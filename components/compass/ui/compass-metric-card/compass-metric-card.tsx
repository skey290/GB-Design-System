import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import styles from "./compass-metric-card.module.css";

/**
 * Figma "Detail view"(❄️ GB_Compass, C34HOpbSASmThFA1iYFm8D) node-id 8003:12444
 * 안에서 "Growth Potential" / "Qualified Reach" / "Engagement Intensity" 3개
 * 섹션이 완전히 동일하게 반복하는 틀(셸)만 뽑아낸 컴포넌트. 6개 `type` variant
 * (default/BLS/niche data/no experience/trend data/error)를 직접 조회한 결과,
 * 세 섹션 모두 "제목+뱃지 헤더 → (옵션)설명 문단 → 콘텐츠 슬롯 → (옵션)하단 링크"
 * 구조를 그대로 공유하고, 바뀌는 건 콘텐츠 슬롯 내부(퍼센트 히어로 vs 포스트
 * 통계 vs 빈 상태)뿐이라 그 부분만 `children`으로 상위(`CompassDetailView`)에서
 * 주입받는다(컴파스 전용 하위 컴포넌트 분리 패턴은 `compass-dial-tick.tsx`와 동일).
 *
 * `state` → Figma 축 매핑:
 * - `default`(border 없음): type=default/BLS/trend data
 * - `warning`(`--border-warning` 1px 보더 추가): type=niche data/no experience
 *   (Figma 실측 — 직관과 달리 "완전히 텅 빈" 상태가 아니라 이 두 타입에서만
 *   경고 보더가 붙는다. Growth Potential 카드에서만 쓰이는 축이고 Qualified
 *   Reach/Engagement Intensity 카드는 이 두 타입에서도 항상 `default`)
 * - `error`: 하단 "Update in Know thyself" 링크만 숨긴다. ⚠️ 설명 문단은
 *   `state`와 무관하게 `description` prop 유무로만 결정된다 — Figma 실측
 *   결과 Qualified Reach/Engagement Intensity 카드는 `error`에서도 설명 문단이
 *   그대로 남아있고(호출부에서 계속 전달), Growth Potential 카드만 `error`에서
 *   호출부가 `description`을 아예 넘기지 않아(제목 자리를 대신 차지) 사라진다.
 */

export type CompassMetricCardState = "default" | "warning" | "error";

export interface CompassMetricCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** 카드 제목 (예: "Growth Potential") */
  title: string;
  /** 헤더 우측 pill 뱃지 텍스트 (예: "Become Recommended") */
  badgeLabel: string;
  /** 설명 문단. `state`와 무관하게 이 값이 있을 때만 렌더링(위 doc 주석 참고) */
  description?: string;
  /** Figma `type` 축이 결정하는 셸 스타일. 기본 "default" */
  state?: CompassMetricCardState;
  /** 하단 링크 텍스트. 기본 "Update in Know thyself" */
  footerLinkLabel?: string;
  /** 하단 링크 클릭 핸들러. `state="error"`에서는 링크 자체를 렌더링하지 않음 */
  onFooterLinkClick?: () => void;
  /** 콘텐츠 슬롯 (퍼센트 히어로/포스트 통계/빈 상태/에러 안내 등, 카드마다 다름) */
  children: React.ReactNode;
}

export function CompassMetricCard({
  title,
  badgeLabel,
  description,
  state = "default",
  footerLinkLabel = "Update in Know thyself",
  onFooterLinkClick,
  children,
  className,
  ...props
}: CompassMetricCardProps) {
  const isError = state === "error";

  return (
    <div
      className={cn(styles.root, className)}
      data-warning={state === "warning" || undefined}
      {...props}
    >
      <div className={styles.headerWrap}>
        <div className={styles.headerRow}>
          <p className={styles.title}>{title}</p>
          <Badge variant="outline" size="20">
            {badgeLabel}
          </Badge>
        </div>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {children}

      {!isError && (
        // Figma 좌표 실측(버그 수정, node 8003:12465 vs 부모 8003:12449):
        // 버튼 인스턴스 x=404·width=156 → 우측 끝 560px == 카드 콘텐츠 영역
        // 우측 끝(padding 28px 제외 시 28+532=560)과 정확히 일치 — 가운데 정렬이
        // 아니라 우측 정렬이었다. `items-center`를 `items-end`로 수정.
        <div className={styles.footerLinkRow}>
          <Button
            variant="link"
            onClick={onFooterLinkClick}
            className={styles.footerLink}
          >
            {footerLinkLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
