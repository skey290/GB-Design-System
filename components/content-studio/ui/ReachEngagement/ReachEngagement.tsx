"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";
import { Icon, type IconId } from "@/lib/sprite-icon";
import { cn } from "@/lib/utils";

import styles from "./ReachEngagement.module.css";

export type { SelectOption };

export interface FunnelChannelRow {
  /** Icon shown before the channel label */
  icon: IconId;
  /** Channel display name, e.g. "Instagram" */
  label: string;
  /** Formatted metric value for this channel, e.g. "1,234" or "9.2%" */
  value: string;
  /** Formatted delta vs. last month, e.g. "+89" or "+0.6pp" */
  delta: string;
  /** Figma `Part/funnel` `Status=focus` — highlights the connected/selected channel */
  highlighted?: boolean;
}

export interface FunnelColumn {
  /** Column title, e.g. "Reach" */
  label: string;
  /** Headline metric value, e.g. "204" or "4.2%" */
  value: string;
  /** Text shown after `value`, e.g. "(avg.0.4%)" on the Conversion column */
  valueCaption?: string;
  /** Delta badge text, e.g. "+10%" */
  delta: string;
  /** Text after the delta badge. Default "from last month" */
  deltaCaption?: string;
  /** Figma chevron-right affordance, hidden on the Conversion column */
  showDetail?: boolean;
  /** Per-channel breakdown rows, in display order */
  rows: FunnelChannelRow[];
}

export interface TopChannelSummary {
  icon: IconId;
  label: string;
  reach: string;
  engagementRate: string;
}

export interface ReachEngagementProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Figma `Type` */
  type?: "reach" | "funnel" | "empty";
  /** Shared header caption, e.g. "Last 28 days" */
  period?: string;

  /** Total reach figure, `type="reach"` only, e.g. "18,240" */
  reachTotal?: string;
  /** Delta badge text next to `reachTotal` */
  reachDelta?: string;
  /** Engagement rate metric row, `type="reach"` only */
  engagementRate?: string;
  /** New followers metric row, `type="reach"` only */
  newFollowers?: string;
  /** Best-performing channel summary, `type="reach"` only */
  topChannel?: TopChannelSummary;
  /** Click handler for the "Funnel Analysis" button, `type="reach"` only */
  onFunnelAnalysisClick?: () => void;
  /** Label for the "Funnel Analysis" button */
  funnelAnalysisLabel?: string;

  /** Options for the connected-account select trigger, `type="funnel"` only */
  accountOptions?: SelectOption[];
  /** Connected-account select value when controlled */
  accountValue?: string;
  /** Connected-account select initial value when uncontrolled */
  defaultAccountValue?: string;
  /** Called when the connected-account selection changes */
  onAccountChange?: (value: string) => void;
  /** Metric columns, in display order (Figma mock: Reach/Engagement/New Followers/Conversion) */
  columns?: FunnelColumn[];
}

const DEFAULT_ACCOUNT_OPTIONS: SelectOption[] = [
  { value: "social-connected", label: "Social Connected" },
];

const DEFAULT_TOP_CHANNEL: TopChannelSummary = {
  icon: "linkedin-icon",
  label: "Linkedin",
  reach: "6,487",
  engagementRate: "9.2%",
};

const DEFAULT_FUNNEL_COLUMNS: FunnelColumn[] = [
  {
    label: "Reach",
    value: "204",
    delta: "+10%",
    showDetail: true,
    rows: [
      { icon: "youtube-icon", label: "YouTube", value: "830", delta: "+31" },
      {
        icon: "instagram-icon",
        label: "Instagram",
        value: "312",
        delta: "-2",
      },
      { icon: "thread-icon", label: "Thread", value: "214", delta: "+89" },
      {
        icon: "facebook-icon",
        label: "Facebook",
        value: "210",
        delta: "+31",
      },
      {
        icon: "linkedin-icon",
        label: "Linkedin",
        value: "204",
        delta: "-2",
        highlighted: true,
      },
      { icon: "tiktok-icon", label: "TikTok", value: "104", delta: "-2" },
    ],
  },
  {
    label: "Engagement",
    value: "4.2%",
    delta: "+0.22pp",
    showDetail: true,
    rows: [
      {
        icon: "instagram-icon",
        label: "Instagram",
        value: "9.2%",
        delta: "+0.6pp",
      },
      {
        icon: "facebook-icon",
        label: "Facebook",
        value: "4%",
        delta: "+3.4pp",
      },
      {
        icon: "youtube-icon",
        label: "YouTube",
        value: "4.5%",
        delta: "+1.5pp",
      },
      {
        icon: "linkedin-icon",
        label: "Linkedin",
        value: "4.2%",
        delta: "+0.2pp",
        highlighted: true,
      },
      {
        icon: "thread-icon",
        label: "Thread",
        value: "1.6%",
        delta: "+0.1pp",
      },
      {
        icon: "tiktok-icon",
        label: "TikTok",
        value: "0.1%",
        delta: "+0.0pp",
      },
    ],
  },
  {
    label: "New Followers",
    value: "+2",
    delta: "+2",
    showDetail: true,
    rows: [
      {
        icon: "youtube-icon",
        label: "YouTube",
        value: "1.5k",
        delta: "+104",
      },
      { icon: "thread-icon", label: "Thread", value: "1.2k", delta: "+45" },
      {
        icon: "linkedin-icon",
        label: "Linkedin",
        value: "1.2k",
        delta: "+2",
        highlighted: true,
      },
      {
        icon: "instagram-icon",
        label: "Instagram",
        value: "240",
        delta: "+89",
      },
      { icon: "tiktok-icon", label: "TikTok", value: "210", delta: "+31" },
      {
        icon: "facebook-icon",
        label: "Facebook",
        value: "40",
        delta: "-2",
      },
    ],
  },
  {
    label: "Conversion",
    value: "0.98%",
    valueCaption: "(avg.0.4%)",
    delta: "+0.1pp",
    rows: [
      {
        icon: "linkedin-icon",
        label: "Linkedin",
        value: "1.4%",
        delta: "+1.1pp",
        highlighted: true,
      },
      {
        icon: "youtube-icon",
        label: "YouTube",
        value: "0.9%",
        delta: "+0.8pp",
      },
      {
        icon: "instagram-icon",
        label: "Instagram",
        value: "0.5%",
        delta: "+0.5pp",
      },
      {
        icon: "facebook-icon",
        label: "Facebook",
        value: "0.2%",
        delta: "+0.2pp",
      },
      { icon: "thread-icon", label: "Thread", value: "0.2%", delta: "+0.1pp" },
      {
        icon: "tiktok-icon",
        label: "TikTok",
        value: "0.1%",
        delta: "+0.0pp",
      },
    ],
  },
];

export function ReachEngagement({
  className,
  type = "empty",
  period = "Last 28 days",
  reachTotal = "18,240",
  reachDelta = "+22%",
  engagementRate = "4.2%",
  newFollowers = "+127",
  topChannel = DEFAULT_TOP_CHANNEL,
  onFunnelAnalysisClick,
  funnelAnalysisLabel = "Funnel Analysis",
  accountOptions = DEFAULT_ACCOUNT_OPTIONS,
  accountValue,
  defaultAccountValue = DEFAULT_ACCOUNT_OPTIONS[0]?.value,
  onAccountChange,
  columns = DEFAULT_FUNNEL_COLUMNS,
  ...props
}: ReachEngagementProps) {
  return (
    <div className={cn(styles.root, className)} data-type={type} {...props}>
      {type === "funnel" ? (
        <>
          <div className={styles.funnelTop}>
            <p className={styles.title}>Growth funnel on</p>
            <Select
              variant="mute"
              options={accountOptions}
              value={accountValue}
              defaultValue={defaultAccountValue}
              onValueChange={onAccountChange}
            />
          </div>
          <div className={styles.columnsRow}>
            {columns.map((column, index) => (
              <FunnelColumnView
                key={`${column.label}-${index}`}
                column={column}
                period={period}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={styles.header}>
            <p className={styles.title}>Reach</p>
            <p className={styles.period}>{period}</p>
          </div>
          {type === "empty" ? (
            <div className={styles.emptyBody}>
              <div className={styles.emptyIconWrap}>
                <Icon id="globe-icon" className={styles.emptyIcon} />
              </div>
              <p className={styles.emptyTitle}>No reach data yet</p>
              <p className={styles.emptyDescription}>
                Insights from channels like LinkedIn and Instagram will appear
                here once you start posting.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.totalBlock}>
                <p className={styles.totalLabel}>Total</p>
                <p className={styles.totalValue}>{reachTotal}</p>
                <div className={styles.deltaRow}>
                  <Badge variant="alarm" size="20">
                    {reachDelta}
                  </Badge>
                  <span className={styles.deltaCaption}>from last month</span>
                </div>
              </div>
              <div className={styles.metricsList}>
                <MetricRow label="Engagement Rate" value={engagementRate} />
                <MetricRow label="New Followers" value={newFollowers} />
              </div>
              <div className={styles.topChannelSection}>
                <div className={styles.topChannelHeaderRow}>
                  <p className={styles.topChannelLabel}>Top Channel</p>
                  <div className={styles.topChannelBadge}>
                    <Icon
                      id={topChannel.icon}
                      className={styles.topChannelIcon}
                    />
                    <span className={styles.topChannelName}>
                      {topChannel.label}
                    </span>
                  </div>
                </div>
                <MetricRow label="Reach" value={topChannel.reach} />
                <MetricRow
                  label="Engagement Rate"
                  value={topChannel.engagementRate}
                />
              </div>
              <div className={styles.funnelButtonRow}>
                <Button
                  variant="mute"
                  className={styles.funnelButton}
                  onClick={onFunnelAnalysisClick}
                >
                  {funnelAnalysisLabel}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metricRow}>
      <p className={styles.metricLabel}>{label}</p>
      <p className={styles.metricValue}>{value}</p>
    </div>
  );
}

function FunnelColumnView({
  column,
  period,
}: {
  column: FunnelColumn;
  period: string;
}) {
  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitleGroup}>
          <p className={styles.columnTitle}>{column.label}</p>
          <p className={styles.columnSubtitle}>({period})</p>
        </div>
        {column.showDetail && (
          <ChevronRight aria-hidden="true" className={styles.columnChevron} />
        )}
      </div>
      <div className={styles.columnValueGroup}>
        <div className={styles.columnValueRow}>
          <p className={styles.columnValue}>{column.value}</p>
          {column.valueCaption && (
            <span className={styles.columnValueCaption}>
              {column.valueCaption}
            </span>
          )}
        </div>
        <div className={styles.columnDeltaRow}>
          <Badge variant="alarm" size="20">
            {column.delta}
          </Badge>
          <span className={styles.deltaCaption}>
            {column.deltaCaption ?? "from last month"}
          </span>
        </div>
      </div>
      <div className={styles.columnDivider} aria-hidden="true" />
      <div className={styles.rowsList}>
        {column.rows.map((row, index) => (
          <div key={`${row.label}-${index}`} className={styles.row}>
            <div
              className={styles.rowMain}
              data-highlighted={row.highlighted || undefined}
            >
              <Icon id={row.icon} className={styles.rowIcon} />
              <p className={styles.rowLabel}>{row.label}</p>
            </div>
            <Badge variant="outline" size="20">
              {row.value}
            </Badge>
            <span className={styles.rowDelta}>{row.delta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
