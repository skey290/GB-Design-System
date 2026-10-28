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
 * A growth analysis detail panel for a single job/topic. It's a completely
 * separate assembly component unrelated to the `compass-dial`/`compass-self-cluster`
 * family (circular orbit geometry). Below the header (1 tab +
 * "Create Posts with one click" CTA), it stacks 3 `CompassMetricCard`s (Growth
 * Potential / Qualified Reach / Engagement Intensity) vertically — the card
 * shell is separated into `CompassMetricCard`, and only the content that
 * differs per card (percent hero, post stats, empty state, error state) is
 * assembled in this file.
 *
 * 6 `type` variants → derivation rules:
 * - `error`: all 3 cards are replaced by a semi-transparent blur box
 *   (circle-x + message + Retry). The CTA button also doesn't use `Button`'s
 *   `disabled` prop (the tokens differ: not
 *   `--background-disabled`/`--text-static-gray` but
 *   `--background-selected`/`--text-subtler`/`--border-overlay`), and is
 *   overridden directly via className.
 * - `niche-data`/`no-experience`: only the **Growth Potential card** gets a
 *   `--border-warning` border (the Reach/Engagement cards have no border for
 *   either type).
 * - `bls`/`trend-data`: the Qualified Reach/Engagement Intensity cards show
 *   2 columns of actual post stats (featured post + most recent post, with
 *   the delta badge/Breakdown list only when present) instead of an empty
 *   state. For the rest (`default`/`niche-data`/`no-experience`), it's the
 *   "Not Enough posts Yet" empty state.
 * - The Growth Potential card has no empty state in any of the 6 types above
 *   — it always shows the percent hero + Industry Growth/Experience 2 rows
 *   (only the copy differs per type), and switches to the blur box only on
 *   `error`.
 *
 * Icons: the "arrow" icon in the top-right of the card has a Figma layer name
 * of `lucide/circle-dashed`, but the SVG actually rendered is shaped like
 * arrow-up-right, so `arrow-up-right-icon` was used instead — a case where
 * the layer name can't be trusted at face value. The empty state icon uses
 * `no-file-pen-icon` (`public/icons.svg`,
 * node-id 4976:8231 in the ❄️ GB_Design System Atom icon library).
 */

export type CompassDetailViewType =
  "default" | "bls" | "niche-data" | "no-experience" | "trend-data" | "error";

export interface CompassDetailViewPostStatDelta {
  label: string;
  variant: Extract<BadgeProps["variant"], "success" | "alarm">;
}

export interface CompassDetailViewPostStat {
  /** Stat label (e.g. "Most Reached Post") */
  label: string;
  /** Stat value (e.g. "8,340") */
  value: string;
  /** Change badge. Not rendered when absent (e.g. "Most Reached/Engaged Post") */
  delta?: CompassDetailViewPostStatDelta;
  /** Caption next to the delta badge (e.g. "vs Previous Post") */
  deltaCaption?: string;
  /** Bottom breakdown list. Not rendered when absent */
  breakdown?: { label: string; value: string }[];
  /** Click handler for the top-right arrow button */
  onRefreshClick?: () => void;
}

export interface CompassDetailViewProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Figma `type` variant. Defaults to "default" */
  type?: CompassDetailViewType;
  /** Top tab label. Defaults to the Figma sample value per `type` (only "trend-data" is "Vintage Fashion") */
  title?: string;
  onCreatePostsClick?: () => void;
  /** Retry click handler shared by the error state of all 3 cards (only effective for `type="error"`) */
  onRetry?: () => void;
  onGrowthFooterClick?: () => void;
  onReachFooterClick?: () => void;
  onEngagementFooterClick?: () => void;
  /** Growth Potential percent value. Defaults to the Figma sample value per `type` */
  growthPercent?: string;
  /** Detail text for the Growth Potential "Industry Growth"/"Content Trend" row */
  growthIndustryDetail?: string;
  /** Value for the Growth Potential "Experience" row */
  growthExperienceYears?: string;
  /** Used only for `type="bls"|"trend-data"`. Max 2 items (representative post + recent post) */
  reachStats?: CompassDetailViewPostStat[];
  /** Used only for `type="bls"|"trend-data"`. Max 2 items (representative post + recent post) */
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
 * Shared shell for the two cases where the card content area turns into a
 * "translucent blur box" (empty-state icon, error message). Figma measured:
 * `aspect-[510/246]`.
 *
 * `backdrop-blur` is applied based on the Effect style name bound in Figma
 * ("Backdrop Blur/backdrop-blur-md", radius: 12) — this matches exactly
 * `--backdrop-blur-md: blur(12px)` in `src/tokens/effects.css`.
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

/** Growth Potential-only content — percent hero + vertical divider + 2 rows (Industry Growth/Experience) */
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

/** One post stat block for the Qualified Reach/Engagement Intensity cards (label+value+optional delta/breakdown) */
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

/** Stats 2-column layout + vertical divider shown for the bls/trend-data types */
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

  // The Reach/Engagement cards don't get a warning border even in
  // niche-data/no-experience (a rule unique to the Growth Potential card,
  // confirmed by measurement) — they only switch state on error.
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
