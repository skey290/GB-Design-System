"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  SelfCuration,
  selfCurationEmptySlotKey,
} from "@/components/screens/dashboard/ui/self-curation";

import styles from "./persona-radial-chart.module.css";

/**
 * A radial chart comparing the self + 8 personas across 3 metrics
 * (concentric rings) × 8 sectors (angles). See `docs/persona-radial-chart-spec.md`
 * for the full spec.
 *
 * ⚠️ The radius/angle constants below are SVG `viewBox` internal coordinate
 * values, not CSS lengths.
 */

const CANVAS_SIZE = 500;
const RING_BOUNDARY_RADII = [128, 160, 200, 250] as const;
const RING_BAND_COUNT = 8;
const LABEL_ORBIT_RADIUS = 265;
const NOT_ENOUGH_DATA_OFFSET_Y = 276;
/** The slot count is fixed at 8 — independent of how many slots are filled (`selfCount`) */
const SECTOR_COUNT = 8;
const SECTOR_ANGLE = 360 / SECTOR_COUNT;
/** In SVG, 3 o'clock is 0°, so starting at -90° (12 o'clock) makes the topmost spoke vertical */
const FIRST_SECTOR_START_ANGLE = -90;
const DEFAULT_VALUE_FRACTION_DIGITS = 1;

/** Highlight bands use a semantic token that flips dark=white/light=black; dimmed bands use the opposite-polarity token */
const HIGHLIGHT_BAND_FILL =
  "color-mix(in srgb, var(--gb-icon-default) 20%, transparent)";
const DIMMED_BAND_FILL = "var(--gb-background-sheer)";

/** The 3 large rings from the inside out = the 3 metric categories */
export const PERSONA_METRICS = [
  {
    key: "growth",
    label: "Growth Potential",
    innerRadius: 128,
    outerRadius: 160,
  },
  {
    key: "reach",
    label: "Qualified Reach",
    innerRadius: 160,
    outerRadius: 200,
  },
  {
    key: "engagement",
    label: "Engagement Intensity",
    innerRadius: 200,
    outerRadius: 250,
  },
] as const;

export type PersonaMetricKey = (typeof PERSONA_METRICS)[number]["key"];

export interface PersonaDatum {
  /** Persona identifier (used to designate the self and as the React key) */
  id: string;
  /** Name shown on the badge outside the sector */
  name: string;
  /** Avatar image URL. Falls back to initials → icon if absent */
  imageSrc?: string;
  /** Initials to show when there's no avatar image */
  initials?: string;
  /** Growth Potential (%) */
  growth: number;
  /** Qualified Reach (count) */
  reach: number;
  /** Engagement Intensity (%) */
  engagement: number;
}

/** Figma mock sample data — array order is the sector placement order (clockwise from 12 o'clock) */
export const DEFAULT_PERSONAS: PersonaDatum[] = [
  {
    id: "data-scientist",
    name: "Data Scientist",
    imageSrc: "/images/personas/self-default.jpg",
    initials: "D",
    growth: 80,
    reach: 8340,
    engagement: 14.3,
  },
  {
    id: "yoga-meditator",
    name: "Yoga Meditator",
    imageSrc: "/images/personas/yoga-meditator.jpg",
    initials: "Y",
    growth: 10,
    reach: 6453,
    engagement: 1.8,
  },
  {
    id: "novelist",
    name: "Novelist",
    imageSrc: "/images/personas/novelist.jpg",
    initials: "N",
    growth: 40,
    reach: 4784,
    engagement: 0.4,
  },
  {
    id: "entrepreneur",
    name: "Entrepreneur",
    imageSrc: "/images/personas/entrepreneur.jpg",
    initials: "E",
    growth: 70,
    reach: 978,
    engagement: 2.0,
  },
  {
    id: "fashionista",
    name: "Fashionista",
    imageSrc: "/images/personas/fashionista.jpg",
    initials: "F",
    growth: 60,
    reach: 6782,
    engagement: 0.3,
  },
  {
    id: "fashion-editor",
    name: "Fashion Editor",
    imageSrc: "/images/personas/fashion-editor.jpg",
    initials: "F",
    growth: 20,
    reach: 125,
    engagement: 3.7,
  },
  {
    id: "team-leader",
    name: "Team Leader",
    imageSrc: "/images/personas/team-leader.jpg",
    initials: "T",
    growth: 50,
    reach: 8006,
    engagement: 0.5,
  },
  {
    id: "vegan-chef",
    name: "Vegan Chef",
    imageSrc: "/images/personas/vegan-chef.jpg",
    initials: "V",
    growth: 30,
    reach: 5431,
    engagement: 1.9,
  },
];

/** `self` isn't a Figma variant — it's a value handled only in code, when an avatar itself is hovered directly */
export type PersonaRadialChartHover = "default" | PersonaMetricKey | "self";

function getCenterMessage(
  hover: PersonaRadialChartHover,
  isDataCollected: boolean,
  isEmptySlotActive: boolean,
) {
  if (hover === "self") {
    // The criterion is the currently highlighted target (whether it's an empty slot), not selfCount
    return isEmptySlotActive ? "Create a Self" : "Go to Content Studio";
  }
  if (hover === "default") {
    return "Hover to explore";
  }
  if (hover === "growth") {
    return "Growth Potential";
  }
  if (!isDataCollected) {
    return "Create Posts to analyze";
  }
  return hover === "reach" ? "Qualified Reach" : "Engagement Intensity";
}

function polarToCartesian(radius: number, angleInDegrees: number) {
  const radians = (angleInDegrees * Math.PI) / 180;
  return {
    x: radius * Math.cos(radians),
    y: radius * Math.sin(radians),
  };
}

function round(value: number) {
  return Number(value.toFixed(3));
}

/** Donut-slice (annulus sector) path. The sector angle is fixed at 45° (<180°), so the large-arc-flag is always 0 */
function annulusSectorPath(
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const outerStart = polarToCartesian(outerRadius, startAngle);
  const outerEnd = polarToCartesian(outerRadius, endAngle);
  const innerEnd = polarToCartesian(innerRadius, endAngle);
  const innerStart = polarToCartesian(innerRadius, startAngle);

  return [
    `M ${round(outerStart.x)} ${round(outerStart.y)}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${round(outerEnd.x)} ${round(outerEnd.y)}`,
    `L ${round(innerEnd.x)} ${round(innerEnd.y)}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${round(innerStart.x)} ${round(innerStart.y)}`,
    "Z",
  ].join(" ");
}

/** Full-ring (360°) donut path. `fill-rule="evenodd"` punches out the inside */
function fullAnnulusPath(innerRadius: number, outerRadius: number) {
  const ring = (r: number) =>
    `M ${r} 0 A ${r} ${r} 0 1 1 ${-r} 0 A ${r} ${r} 0 1 1 ${r} 0 Z`;
  return `${ring(outerRadius)} ${ring(innerRadius)}`;
}

function formatMetricValue(
  metricKey: PersonaMetricKey,
  value: number,
  fractionDigits: number,
) {
  const text = value.toLocaleString("en-US", {
    maximumFractionDigits: fractionDigits,
  });
  return metricKey === "reach" ? text : `${text}%`;
}

function getSectorGeometry(index: number) {
  const startAngle = FIRST_SECTOR_START_ANGLE + SECTOR_ANGLE * index;
  return {
    startAngle,
    endAngle: startAngle + SECTOR_ANGLE,
    midAngle: startAngle + SECTOR_ANGLE / 2,
  };
}

/** Alignment anchor for attaching a badge outside the circle (reverse-derived from Figma-measured coordinates) */
function getLabelAnchor(midAngle: number) {
  const { x, y } = polarToCartesian(1, midAngle);
  const isCornerSector = Math.abs(y) > 0.7;

  return {
    translateX: x > 0 ? "0%" : "-100%",
    translateY: isCornerSector ? (y > 0 ? "0%" : "-100%") : "-50%",
  };
}

/**
 * Band count = the rank within that ring (not a value ratio). Evenly
 * distributed as 1st place=8 bands / last place=1 band, so all 8 people
 * stay distinguishable even if values are close or one person dominates.
 * Ties get the same band count; a value of 0 or less gets 0 bands.
 */
function getRankBandCounts(values: number[]) {
  const ranked = values.filter((value) => value > 0).sort((a, b) => b - a);

  return values.map((value) => {
    if (value <= 0) return 0;
    if (ranked.length <= 1) return RING_BAND_COUNT;

    const rank = ranked.indexOf(value);
    const step = (RING_BAND_COUNT - 1) / (ranked.length - 1);
    return Math.max(1, Math.round(RING_BAND_COUNT - rank * step));
  });
}

export interface PersonaRadialChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  /** The persona data that exists. If fewer than 8, the remaining slots become "No Self" empty slots */
  personas?: PersonaDatum[];
  /** Number of selves to reveal. Defaults to `personas.length` */
  selfCount?: number;
  /** Maximum decimal digits for badge values. Default 1 */
  valueFractionDigits?: number;
  /** Figma `Data collected` — Reach/Engagement are only computed once there are posts */
  isDataCollected?: boolean;
  /** When given, acts as a controlled component (ignores the mouse); when omitted, follows real mouse hover */
  hover?: PersonaRadialChartHover;
  /** Called when the hover state changes */
  onHoverChange?: (hover: PersonaRadialChartHover) => void;
  /** Persona id to treat as the self. Defaults to the first persona */
  selfId?: string;
  /** Click handler for the center message (acts as a CTA) */
  onCenterClick?: () => void;
}

export function PersonaRadialChart({
  personas = DEFAULT_PERSONAS,
  selfCount,
  valueFractionDigits = DEFAULT_VALUE_FRACTION_DIGITS,
  isDataCollected = true,
  hover: controlledHover,
  onHoverChange,
  selfId,
  onCenterClick,
  className,
  ...props
}: PersonaRadialChartProps) {
  const [uncontrolledHover, setUncontrolledHover] =
    React.useState<PersonaRadialChartHover>("default");
  const hover = controlledHover ?? uncontrolledHover;

  const changeHover = (next: PersonaRadialChartHover) => {
    if (controlledHover === undefined) {
      setUncontrolledHover(next);
    }
    onHoverChange?.(next);
  };

  const [hoveredAvatarId, setHoveredAvatarId] = React.useState<string | null>(
    null,
  );

  // Uses `||` instead of `??` to stop `selfId=""` from slipping through
  const resolvedSelfId = selfId || personas[0]?.id;
  const revealedCount = selfCount ?? personas.length;

  const slots = React.useMemo(() => {
    return Array.from({ length: SECTOR_COUNT }, (_, index) => {
      const persona = personas[index];
      if (!persona) return null;
      const shown = index < revealedCount || persona.id === resolvedSelfId;
      return shown ? persona : null;
    });
  }, [personas, revealedCount, resolvedSelfId]);

  // The mouse takes priority; otherwise (controlled mode) the highlight target is chosen empty slot → self
  const firstEmptySlotKey = slots.findIndex((slot) => slot === null);
  const activeAvatarId =
    hoveredAvatarId ??
    (firstEmptySlotKey >= 0
      ? selfCurationEmptySlotKey(firstEmptySlotKey)
      : resolvedSelfId);
  const isEmptySlotActive = activeAvatarId?.startsWith("slot:") ?? false;

  const hasMetricData = (metricKey: PersonaMetricKey) =>
    isDataCollected || metricKey === "growth";

  const ringBandCounts = React.useMemo(() => {
    const counts = {} as Record<PersonaMetricKey, number[]>;
    for (const metric of PERSONA_METRICS) {
      counts[metric.key] = getRankBandCounts(
        personas.map((persona) => persona[metric.key]),
      );
    }
    return counts;
  }, [personas]);

  const centerMessage = getCenterMessage(
    hover,
    isDataCollected,
    isEmptySlotActive,
  );
  const isMetricHover = PERSONA_METRICS.some((metric) => metric.key === hover);
  const isAwaitingData =
    isMetricHover && !hasMetricData(hover as PersonaMetricKey);

  return (
    <div
      className={cn(styles.root, className)}
      onMouseLeave={() => {
        setHoveredAvatarId(null);
        changeHover("default");
      }}
      {...props}
    >
      <svg
        className={cn(styles.overlay, styles.svg)}
        viewBox={`${-CANVAS_SIZE / 2} ${-CANVAS_SIZE / 2} ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        role="img"
        aria-label="Persona radial analytics"
      >
        {PERSONA_METRICS.map((metric) => {
          const isDimmed = isMetricHover && hover !== metric.key;
          const bandStep =
            (metric.outerRadius - metric.innerRadius) / RING_BAND_COUNT;

          if (hover === metric.key && !hasMetricData(metric.key)) {
            return (
              <path
                key={metric.key}
                className={styles.fadeIn}
                d={fullAnnulusPath(metric.innerRadius, metric.outerRadius)}
                fillRule="evenodd"
                fill={HIGHLIGHT_BAND_FILL}
              />
            );
          }

          if (!hasMetricData(metric.key)) return null;

          return (
            <g key={metric.key}>
              {slots.map((persona, index) => {
                if (!persona) return null;

                const { startAngle, endAngle } = getSectorGeometry(index);
                const bands = ringBandCounts[metric.key][index];

                return Array.from({ length: bands }, (_, step) => (
                  <path
                    key={`${persona.id}-${step}`}
                    className={styles.colorTransition}
                    d={annulusSectorPath(
                      metric.innerRadius,
                      metric.innerRadius + bandStep * (step + 1),
                      startAngle,
                      endAngle,
                    )}
                    fill={isDimmed ? DIMMED_BAND_FILL : HIGHLIGHT_BAND_FILL}
                  />
                ));
              })}
            </g>
          );
        })}

        <g fill="none" strokeWidth="var(--gb-border-1)" aria-hidden="true">
          {RING_BOUNDARY_RADII.map((radius) => {
            const isHighlighted =
              isAwaitingData &&
              PERSONA_METRICS.some(
                (metric) =>
                  metric.key === hover &&
                  (metric.innerRadius === radius ||
                    metric.outerRadius === radius),
              );

            return (
              <circle
                key={radius}
                className={styles.colorTransition}
                cx="0"
                cy="0"
                r={radius}
                stroke={
                  isHighlighted
                    ? "var(--gb-color-semantic-non-changeable)"
                    : "var(--gb-background-subtler)"
                }
              />
            );
          })}
          {/* Fixed at 8 slots, so 4 diameter lines = 8 spokes */}
          {Array.from({ length: SECTOR_COUNT / 2 }, (_, index) => {
            const { startAngle } = getSectorGeometry(index);
            const end = polarToCartesian(RING_BOUNDARY_RADII[3], startAngle);
            return (
              <line
                key={startAngle}
                x1={round(-end.x)}
                y1={round(-end.y)}
                x2={round(end.x)}
                y2={round(end.y)}
                stroke="var(--gb-background-subtler)"
              />
            );
          })}
        </g>

        <g fill="transparent">
          {PERSONA_METRICS.map((metric) => (
            <path
              key={metric.key}
              d={fullAnnulusPath(metric.innerRadius, metric.outerRadius)}
              fillRule="evenodd"
              onMouseEnter={() => {
                setHoveredAvatarId(null);
                changeHover(metric.key);
              }}
              aria-hidden="true"
            />
          ))}
        </g>
      </svg>

      <SelfCuration
        className={styles.overlay}
        slots={slots}
        activeSlotId={hover === "self" ? activeAvatarId : null}
        centerMessage={centerMessage}
        onSlotHover={(slotId) => {
          if (slotId) {
            setHoveredAvatarId(slotId);
            changeHover("self");
          } else {
            setHoveredAvatarId(null);
            changeHover("default");
          }
        }}
        onCenterClick={onCenterClick}
      />

      {slots.map((persona, index) => {
        if (!persona) return null;
        if (isMetricHover && !hasMetricData(hover as PersonaMetricKey)) {
          return null;
        }

        const { midAngle } = getSectorGeometry(index);
        const position = polarToCartesian(LABEL_ORBIT_RADIUS, midAngle);
        const anchor = getLabelAnchor(midAngle);
        const isSelf = persona.id === resolvedSelfId;

        const content = isMetricHover
          ? formatMetricValue(
              hover as PersonaMetricKey,
              persona[hover as PersonaMetricKey],
              valueFractionDigits,
            )
          : persona.name;

        // First-place is determined by reusing the ring band count (8 bands = first place) — ties get both filled
        const isEmphasized = isMetricHover
          ? ringBandCounts[hover as PersonaMetricKey][index] === RING_BAND_COUNT
          : isSelf;

        return (
          <div
            key={persona.id}
            className={cn(styles.labelWrap, styles.fadeIn)}
            style={{
              left: `calc(50% + ${round(position.x)}px)`,
              top: `calc(50% + ${round(position.y)}px)`,
              transform: `translate(${anchor.translateX}, ${anchor.translateY})`,
            }}
          >
            <Badge
              variant={isEmphasized ? "default" : "outline"}
              className={cn(styles.badge, !isEmphasized && styles.badgeDimmed)}
            >
              <span key={content} className={styles.fadeIn}>
                {content}
              </span>
            </Badge>
          </div>
        );
      })}

      {isAwaitingData && (
        <div
          className={cn(styles.notEnoughDataWrap, styles.fadeIn)}
          style={{ top: `calc(50% + ${NOT_ENOUGH_DATA_OFFSET_Y}px)` }}
        >
          <Badge variant="default" className={styles.badge}>
            Not Enough Data Yet
          </Badge>
        </div>
      )}
    </div>
  );
}
