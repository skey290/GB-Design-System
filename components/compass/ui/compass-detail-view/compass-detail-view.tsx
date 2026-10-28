import * as React from "react";
import { CircleX } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Icon } from "@/lib/sprite-icon";
import {
  CompassMetricCard,
  type CompassMetricCardState,
} from "@/components/compass/ui/compass-metric-card";

import styles from "./compass-detail-view.module.css";

/**
 * Figma "Detail view"(❄️ GB_Compass, C34HOpbSASmThFA1iYFm8D) node-id 8003:12444.
 *
 * 특정 직업/토픽 하나에 대한 성장 분석 상세 패널. `compass-dial`/`compass-self-cluster`
 * 계열(원형 궤도 기하 구조)과는 완전히 무관한 별개 조립 컴포넌트다. 헤더(탭 1개 +
 * "Create Posts with one click" CTA) 아래 `CompassMetricCard` 3장(Growth
 * Potential / Qualified Reach / Engagement Intensity)을 세로로 쌓는다 — 카드
 * 셸은 `CompassMetricCard`로 분리하고, 카드마다 다른 콘텐츠(퍼센트 히어로,
 * 포스트 통계, 빈 상태, 에러 상태)만 이 파일에서 조립한다.
 *
 * `type` 6종 → 파생 규칙:
 * - `error`: 3장 모두 반투명 blur 박스(circle-x + 안내문 + Retry)로 대체. CTA
 *   버튼도 `Button`의 `disabled` prop을 쓰지 않고(토큰이 다름:
 *   `--background-disabled`/`--text-static-gray`가 아니라
 *   `--background-selected`/`--text-subtler`/`--border-overlay`) className으로
 *   직접 오버라이드.
 * - `niche-data`/`no-experience`: **Growth Potential 카드에만** `--border-warning`
 *   보더가 붙는다(Reach/Engagement 카드는 두 타입에서도 보더 없음).
 * - `bls`/`trend-data`: Qualified Reach/Engagement Intensity 카드가 빈 상태
 *   대신 실제 포스트 통계(대표 포스트 + 최근 포스트, 델타 배지·Breakdown 리스트는
 *   있을 때만) 2컬럼을 보여준다. 그 외(`default`/`niche-data`/`no-experience`)는
 *   "Not Enough posts Yet" 빈 상태.
 * - Growth Potential 카드는 위 6종 어디서도 빈 상태가 없다 — 항상 퍼센트
 *   히어로 + Industry Growth/Experience 2행을 보여주고(카피만 타입별로 다름),
 *   `error`에서만 blur 박스로 전환된다.
 *
 * 아이콘: 카드 우측 상단의 "화살표" 아이콘은 Figma layer 이름이
 * `lucide/circle-dashed`로 되어 있지만 실제 렌더링되는 SVG는 arrow-up-right
 * 모양이라 `arrow-up-right-icon`을 사용했다 — layer 이름을 그대로 믿으면 안
 * 되는 사례. 빈 상태 아이콘은 `no-file-pen-icon`(`public/icons.svg`,
 * ❄️ GB_Design System Atom 아이콘 라이브러리 node-id 4976:8231) 사용.
 */

export type CompassDetailViewType =
  "default" | "bls" | "niche-data" | "no-experience" | "trend-data" | "error";

export interface CompassDetailViewPostStatDelta {
  label: string;
  variant: Extract<BadgeProps["variant"], "success" | "alarm">;
}

export interface CompassDetailViewPostStat {
  /** 통계 라벨 (예: "Most Reached Post") */
  label: string;
  /** 통계 값 (예: "8,340") */
  value: string;
  /** 증감 배지. 없으면 렌더링하지 않음(예: "Most Reached/Engaged Post") */
  delta?: CompassDetailViewPostStatDelta;
  /** 델타 배지 옆 캡션 (예: "vs Previous Post") */
  deltaCaption?: string;
  /** 하단 Breakdown 목록. 없으면 렌더링하지 않음 */
  breakdown?: { label: string; value: string }[];
  /** 우상단 화살표 버튼 클릭 핸들러 */
  onRefreshClick?: () => void;
}

export interface CompassDetailViewProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Figma `type` 변형. 기본 "default" */
  type?: CompassDetailViewType;
  /** 상단 탭 라벨. 기본값은 `type`별 Figma 샘플값("trend-data"만 "Vintage Fashion") */
  title?: string;
  onCreatePostsClick?: () => void;
  /** 3개 카드 공통 에러 상태 Retry 클릭 핸들러 (`type="error"`에서만 유효) */
  onRetry?: () => void;
  onGrowthFooterClick?: () => void;
  onReachFooterClick?: () => void;
  onEngagementFooterClick?: () => void;
  /** Growth Potential 퍼센트 값. 기본값은 `type`별 Figma 샘플값 */
  growthPercent?: string;
  /** Growth Potential "Industry Growth"/"Content Trend" 행의 상세 텍스트 */
  growthIndustryDetail?: string;
  /** Growth Potential "Experience" 행의 값 */
  growthExperienceYears?: string;
  /** `type="bls"|"trend-data"`에서만 사용. 최대 2개(대표 포스트 + 최근 포스트) */
  reachStats?: CompassDetailViewPostStat[];
  /** `type="bls"|"trend-data"`에서만 사용. 최대 2개(대표 포스트 + 최근 포스트) */
  engagementStats?: CompassDetailViewPostStat[];
}

const TITLE_BY_TYPE: Record<CompassDetailViewType, string> = {
  default: "Data Scientist",
  bls: "Data Scientist",
  "niche-data": "Data Scientist",
  "no-experience": "Data Scientist",
  "trend-data": "Vintage Fashion",
  error: "Data Scientist",
};

const GROWTH_DESCRIPTION_BY_TYPE: Record<
  Exclude<CompassDetailViewType, "error">,
  string
> = {
  default:
    "It reflects how promising your career background is, based on 'official U.S. labor statistics' and your experience.",
  bls: "It reflects how promising your career background is, based on 'official U.S. labor statistics' and your experience.",
  "no-experience":
    "It reflects how promising your career background is, based on 'official U.S. labor statistics' and your experience.",
  "niche-data":
    "Data is too new or niche to measure growth yet, so we're showing a neutral estimate.",
  "trend-data":
    "Your field isn't officially classified yet, so this is based on 'search trend data' instead — a lighter, rougher read than industry data.",
};

const GROWTH_INDUSTRY_LABEL_BY_TYPE: Record<
  Exclude<CompassDetailViewType, "error">,
  string
> = {
  default: "Industry Growth",
  bls: "Industry Growth",
  "no-experience": "Industry Growth",
  "niche-data": "Industry Growth",
  "trend-data": "Content Trend",
};

const GROWTH_PERCENT_DEFAULT_BY_TYPE: Record<
  Exclude<CompassDetailViewType, "error">,
  string
> = {
  default: "80%",
  bls: "80%",
  "trend-data": "80%",
  "niche-data": "20%",
  "no-experience": "20%",
};

const GROWTH_INDUSTRY_DETAIL_DEFAULT_BY_TYPE: Record<
  Exclude<CompassDetailViewType, "error">,
  string
> = {
  default: "Data Scientist, +29% projected over 10 years",
  bls: "Data Scientist, +29% projected over 10 years",
  "no-experience": "Data Scientist, +29% projected over 10 years",
  "niche-data": "Not enough data to show industry detail",
  "trend-data":
    "Vintage Fashion — content mentions have more than doubled in the past year",
};

const GROWTH_EXPERIENCE_DEFAULT_BY_TYPE: Record<
  Exclude<CompassDetailViewType, "error">,
  string
> = {
  default: "10 years",
  bls: "10 years",
  "trend-data": "10 years",
  "niche-data": "Not enough data to calculate this accurately.",
  "no-experience": "Not enough data to calculate this accurately.",
};

const REACH_DESCRIPTION =
  "An estimate of how many people your content actually reached, not just how many times it was shown.";
const REACH_HELPER_EMPTY =
  "Reach needs 9 posts, each at least 7 days old, to show results.";

const ENGAGEMENT_DESCRIPTION =
  "Not a click count.\nThis measures how deeply people responded to your post — comments and shares count for more than a like.";
const ENGAGEMENT_HELPER_EMPTY =
  "Engagement needs 9 posts, each at least 7 days old, to show results.";
const ENGAGEMENT_FOOTNOTE =
  "Can go above 100% — comments and shares count more than likes.";

const DEFAULT_REACH_STATS: CompassDetailViewPostStat[] = [
  { label: "Most Reached Post", value: "8,340" },
  {
    label: "Most Recent Post",
    value: "6,150",
    delta: { label: "-8%", variant: "alarm" },
    deltaCaption: "vs Previous Post",
  },
];

const DEFAULT_ENGAGEMENT_STATS: CompassDetailViewPostStat[] = [
  {
    label: "Most Engaged Post",
    value: "14.3%",
    breakdown: [
      { label: "Reactions", value: "310" },
      { label: "Comments", value: "42" },
      { label: "Shares", value: "18" },
    ],
  },
  {
    label: "Most Recent Post",
    value: "4.3%",
    delta: { label: "+0.2pp", variant: "success" },
    deltaCaption: "vs Previous Post",
    breakdown: [
      { label: "Reactions", value: "200" },
      { label: "Comments", value: "20" },
      { label: "Shares", value: "10" },
    ],
  },
];

/**
 * 카드 콘텐츠 영역이 "반투명 blur 박스"로 바뀌는 두 경우(빈 상태 아이콘, 에러
 * 안내) 공통 셸. Figma 실측: `aspect-[510/246]`.
 *
 * `backdrop-blur`는 Figma에서 바인딩된 Effect 스타일 이름("Backdrop Blur/
 * backdrop-blur-md", radius: 12) 기준으로 적용한다 — `src/tokens/effects.css`의
 * `--backdrop-blur-md: blur(12px)`와 정확히 일치.
 */
function FrostedBox({ children }: { children: React.ReactNode }) {
  return <div className={styles.frostedBox}>{children}</div>;
}

function ErrorBoxContent({ onRetry }: { onRetry?: () => void }) {
  return (
    <FrostedBox>
      <CircleX className={styles.frostedIcon} aria-hidden="true" />
      <p className={styles.frostedTitle}>We couldn&apos;t fetch your data</p>
      <p className={styles.frostedSubtitle}>please try again shortly.</p>
      <Button variant="link" onClick={onRetry}>
        Retry
      </Button>
    </FrostedBox>
  );
}

function EmptyBoxContent({ helperText }: { helperText: string }) {
  return (
    <FrostedBox>
      <div className={styles.emptyIconWrap}>
        <svg className={styles.frostedIcon} aria-hidden="true">
          <use href="/icons.svg#no-file-pen-icon" />
        </svg>
      </div>
      <p className={styles.frostedTitle}>Not Enough posts Yet</p>
      <p className={styles.frostedSubtitle}>{helperText}</p>
    </FrostedBox>
  );
}

/** Growth Potential 전용 콘텐츠 — 퍼센트 히어로 + 세로 구분선 + 2행(Industry Growth/Experience) */
function GrowthContent({
  percent,
  industryLabel,
  industryDetail,
  experienceYears,
}: {
  percent: string;
  industryLabel: string;
  industryDetail: string;
  experienceYears: string;
}) {
  return (
    <div className={styles.growthRow}>
      <p className={styles.growthPercent}>{percent}</p>
      <div className={styles.growthDivider} aria-hidden="true" />
      <div className={styles.growthDetails}>
        <div className={styles.growthDetailBlock}>
          <p className={styles.growthDetailLabel}>{industryLabel}</p>
          <p className={styles.growthDetailValue}>{industryDetail}</p>
        </div>
        <div className={styles.growthDetailBlock}>
          <p className={styles.growthDetailLabel}>Experience</p>
          <p className={styles.growthDetailValue}>{experienceYears}</p>
        </div>
      </div>
    </div>
  );
}

/** Qualified Reach/Engagement Intensity 카드의 포스트 통계 블록 1개 (라벨+값+옵션 델타/Breakdown) */
function StatBlock({ stat }: { stat: CompassDetailViewPostStat }) {
  return (
    <div className={styles.statBlock}>
      <p className={styles.statLabel}>{stat.label}</p>
      <p className={styles.statValue}>{stat.value}</p>
      {stat.delta && (
        <div className={styles.statDeltaRow}>
          <Badge variant={stat.delta.variant} size="20">
            {stat.delta.label}
          </Badge>
          {stat.deltaCaption && (
            <p
              className={styles.statDeltaCaption}
              data-variant={stat.delta.variant}
            >
              {stat.deltaCaption}
            </p>
          )}
        </div>
      )}
      {stat.breakdown && (
        <div className={styles.statBreakdown}>
          <p className={styles.statBreakdownTitle}>Breakdown</p>
          {stat.breakdown.map((row) => (
            <div key={row.label} className={styles.statBreakdownRow}>
              <p className={styles.statBreakdownLabel}>{row.label}</p>
              <p className={styles.statBreakdownValue}>{row.value}</p>
            </div>
          ))}
        </div>
      )}
      <Button
        variant="icon-ghost"
        icon={<Icon id="arrow-up-right-icon" />}
        aria-label={`${stat.label} 자세히 보기`}
        onClick={stat.onRefreshClick}
        className={styles.statRefreshButton}
      />
    </div>
  );
}

/** bls/trend-data 타입에서 보여주는 통계 2컬럼 + 세로 구분선 */
function StatRow({ stats }: { stats: CompassDetailViewPostStat[] }) {
  return (
    <div className={styles.statRow}>
      {stats.map((stat, i) => (
        <React.Fragment key={stat.label}>
          {i > 0 && (
            <div className={styles.statRowDivider} aria-hidden="true" />
          )}
          <StatBlock stat={stat} />
        </React.Fragment>
      ))}
    </div>
  );
}

export function CompassDetailView({
  type = "default",
  title,
  onCreatePostsClick,
  onRetry,
  onGrowthFooterClick,
  onReachFooterClick,
  onEngagementFooterClick,
  growthPercent,
  growthIndustryDetail,
  growthExperienceYears,
  reachStats,
  engagementStats,
  className,
  ...props
}: CompassDetailViewProps) {
  const isError = type === "error";
  const isStatGroup = type === "bls" || type === "trend-data";
  const isGrowthWarning = type === "niche-data" || type === "no-experience";

  const resolvedTitle = title ?? TITLE_BY_TYPE[type];
  const resolvedReachStats = reachStats ?? DEFAULT_REACH_STATS;
  const resolvedEngagementStats = engagementStats ?? DEFAULT_ENGAGEMENT_STATS;

  // Reach/Engagement 카드는 niche-data/no-experience에서도 경고 보더가 붙지
  // 않는다(Growth Potential 카드만의 규칙, 실측 확인) — error에서만 상태 전환.
  const growthState: CompassMetricCardState = isError
    ? "error"
    : isGrowthWarning
      ? "warning"
      : "default";
  const postCardState: CompassMetricCardState = isError ? "error" : "default";

  return (
    <div className={cn(styles.root, className)} {...props}>
      <div className={styles.headerBlock}>
        <Tabs
          items={[{ label: resolvedTitle }]}
          selectedIndex={0}
          className={styles.tabs}
        />
        <Button
          variant="primary"
          onClick={onCreatePostsClick}
          aria-disabled={isError || undefined}
          className={styles.ctaButton}
          data-error={isError || undefined}
        >
          Create Posts with one click
        </Button>
      </div>

      <CompassMetricCard
        title="Growth Potential"
        badgeLabel="Become Recommended"
        description={isError ? undefined : GROWTH_DESCRIPTION_BY_TYPE[type]}
        state={growthState}
        onFooterLinkClick={onGrowthFooterClick}
        className={styles.growthCard}
      >
        {isError ? (
          <ErrorBoxContent onRetry={onRetry} />
        ) : (
          <GrowthContent
            percent={growthPercent ?? GROWTH_PERCENT_DEFAULT_BY_TYPE[type]}
            industryLabel={GROWTH_INDUSTRY_LABEL_BY_TYPE[type]}
            industryDetail={
              growthIndustryDetail ??
              GROWTH_INDUSTRY_DETAIL_DEFAULT_BY_TYPE[type]
            }
            experienceYears={
              growthExperienceYears ?? GROWTH_EXPERIENCE_DEFAULT_BY_TYPE[type]
            }
          />
        )}
      </CompassMetricCard>

      <CompassMetricCard
        title="Qualified Reach"
        badgeLabel="Become Known"
        description={REACH_DESCRIPTION}
        state={postCardState}
        onFooterLinkClick={onReachFooterClick}
        className={styles.reachCard}
      >
        {isError ? (
          <ErrorBoxContent onRetry={onRetry} />
        ) : isStatGroup ? (
          <StatRow stats={resolvedReachStats} />
        ) : (
          <EmptyBoxContent helperText={REACH_HELPER_EMPTY} />
        )}
      </CompassMetricCard>

      <CompassMetricCard
        title="Engagement Intensity"
        badgeLabel="Become Trusted"
        description={isError ? undefined : ENGAGEMENT_DESCRIPTION}
        state={postCardState}
        onFooterLinkClick={onEngagementFooterClick}
        className={styles.engagementCard}
      >
        {isError ? (
          <ErrorBoxContent onRetry={onRetry} />
        ) : isStatGroup ? (
          <>
            <StatRow stats={resolvedEngagementStats} />
            <div className={styles.engagementDivider} aria-hidden="true" />
            <p className={styles.engagementFootnote}>{ENGAGEMENT_FOOTNOTE}</p>
          </>
        ) : (
          <EmptyBoxContent helperText={ENGAGEMENT_HELPER_EMPTY} />
        )}
      </CompassMetricCard>
    </div>
  );
}
