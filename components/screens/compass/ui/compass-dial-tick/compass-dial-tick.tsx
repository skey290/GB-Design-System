import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";

import styles from "./compass-dial-tick.module.css";

/**
 * Figma "Part/Dial" (📌 GB_UXUI, Wp6AZNGqC4qf2Sz5zQ2PzQ) node-id 8125:22862
 * (the component frame that collects every variant).
 *
 * Atom component for a single "tick" unit, repeated 80 times around the
 * compass dial circle. The repetition (angle rotation + position
 * calculation) is not this component's responsibility — it belongs to the
 * parent "Dial" assembly component. This file only draws the tick line +
 * (if present) a single label inside a local 4×117px box.
 *
 * Figma variant → props mapping:
 * - `type`: default (tick line only) / text (numeric label) / circle (Badge marker)
 * - `direction`: outward (aligned to the bottom of the box) / inward
 *   (aligned to the top of the box) — for both directions the DOM order is
 *   the same, label→tick (the label always sits on the side farther from
 *   the center). What `direction` changes is only the box's own radial
 *   position (anchor) and its alignment basis (justify-end/start).
 * - `muted`: downgrades only the label/Badge style (no effect on the tick
 *   line color — it's always pinned to `--border-static-white`)
 * - `textArrangement`: label rotation direction. See the ROTATION tables below
 * - `size`: tick line length (1–5). Has no effect on the label
 *
 * ⚠️ The rotation angle for textArrangement × direction doesn't generalize
 * into a simple formula, so each of the 8 text/circle combinations was
 * measured and pinned into a table (see TEXT_TRANSFORM/CIRCLE_TRANSFORM
 * below — both are pure rotation only; see each table's own comment for the
 * detailed verification rationale).
 *
 * `coachmark`: the Reach/Engagement onboarding coachmark ("Most Reached:
 * 8,340"/"Most Engaged: 14.3%") always attaches to the label chip of the
 * north tick (slot 0). `buildRingPlan`'s `isNorth` rule already pins this
 * chip to `type="circle"` for rendering, so when this prop is present, all
 * that's needed is to wrap that label (text/circle alike) in a `Tooltip`
 * (`variant="reversed"`, always open).
 */

export type CompassDialTickType = "default" | "text" | "circle";
export type CompassDialTickDirection = "outward" | "inward";
export type CompassDialTickTextArrangement =
  "cross" | "parallel" | "parallel-reverse" | "cross-reverse";
export type CompassDialTickSize = 1 | 2 | 3 | 4 | 5;

export interface CompassDialTickProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Tick kind — default: tick line only / text: numeric label / circle: Badge marker */
  type?: CompassDialTickType;
  /** Which side the tick faces relative to the dial center — outward or inward */
  direction?: CompassDialTickDirection;
  /** Downgrades the label/Badge style by one step (no effect on the tick line color) */
  muted?: boolean;
  /** Label rotation direction (so it always reads upright on the circular dial). Ignored when type="default" */
  textArrangement?: CompassDialTickTextArrangement;
  /** Tick line length step (1–5). Has no effect on the label */
  size?: CompassDialTickSize;
  /**
   * Value to display when type="text"|"circle". The Figma samples ("6/1",
   * "Badge") are placeholders, so no default is set — specify explicitly at the call site when needed.
   */
  label?: string;
  /**
   * Onboarding coachmark attached to the label (if present). When passed, wraps it in a
   * `Tooltip` (`variant="reversed"`) that's always open. If `onDismiss` is present, a close (X) button renders alongside it.
   */
  coachmark?: {
    title: string;
    description?: string;
    onDismiss?: () => void;
  };
}

/**
 * Measured tick line values (px) — downloaded the Figma "Part/Dial" tick
 * vector directly for each size and back-calculated the path coordinates.
 * These are SVG-internal geometric coordinates that don't match spacing
 * tokens, so they're pinned as component-internal constants rather than
 * tokenized.
 * upper: the long segment farther from the label (SVG local y=total side),
 * gap: the middle gap, lower: the short segment adjacent to the label (SVG
 * local y=0 side). Regardless of direction, this orientation (label-adjacent
 * = short side) is always the same — for both outward/inward the label is
 * always on the tick's local y=0 side.
 */
const TICK_GEOMETRY: Record<
  CompassDialTickSize,
  { total: number; upper: number; gap: number; lower: number }
> = {
  5: { total: 80, upper: 52.14, gap: 10.95, lower: 16.91 },
  4: { total: 65, upper: 42.36, gap: 8.9, lower: 13.74 },
  3: { total: 50, upper: 23.25, gap: 10.51, lower: 16.24 },
  2: { total: 35, upper: 16.27, gap: 7.36, lower: 11.37 },
  1: { total: 20, upper: 9.3, gap: 4.21, lower: 6.5 },
};

/**
 * Root container width (px) — a geometric constant that is the Figma
 * frame's own physical dimension.
 * The height (117px) is used directly in `h-[117px]` in the className.
 */
const ROOT_WIDTH = 4;

/**
 * CSS transform (pure rotation only) applied to the type="text" label.
 *
 * ⚠️ When screenshotting the standalone "Part/Dial" component on the
 * variant gallery sheet, the 4 inward combinations look like a mirror image
 * that can't be expressed with `rotate()`, but this is a placement artifact
 * of the gallery sheet itself — when screenshotting the actually assembled
 * "Dial" component (the circular gauge with 80 ticks rotated into place by
 * angle), every label reads upright normally with no mirroring. So no
 * mirror axis is added — only pure rotation values are used. Verification:
 * directly confirmed that all 8 labels (14.3%/1.8%/1.9%/0.5%/0.4%/2.0%/
 * 0.3%/3.7%) in a full screenshot of the Figma "Dial" (Type=engagement)
 * read upright with no mirroring.
 */
const TEXT_TRANSFORM: Record<
  CompassDialTickDirection,
  Record<CompassDialTickTextArrangement, string>
> = {
  outward: {
    cross: "rotate(0deg)",
    "cross-reverse": "rotate(180deg)",
    parallel: "rotate(-90deg)",
    "parallel-reverse": "rotate(90deg)",
  },
  inward: {
    cross: "rotate(180deg)",
    "cross-reverse": "rotate(0deg)",
    parallel: "rotate(-90deg)",
    "parallel-reverse": "rotate(90deg)",
  },
};

/**
 * CSS transform (pure rotation only) applied to the type="circle" (Badge).
 *
 * Only `inward`+`cross-reverse` (north quadrant) is an exception: carrying
 * over the Figma raw value as-is composites to `rotate(180deg) scaleY(-1)`,
 * which flips the text inside the badge left-right. The `text` label at the
 * same position (`TEXT_TRANSFORM.inward["cross-reverse"]`) displays
 * correctly at rotation 0, so circle is matched to the same `rotate(0deg)`
 * to remove the flip. The remaining 7 follow the same "pure rotation only"
 * principle as TEXT_TRANSFORM — the assembled-Dial verification rationale
 * in the comment above applies equally here.
 */
const CIRCLE_TRANSFORM: Record<
  CompassDialTickDirection,
  Record<CompassDialTickTextArrangement, string>
> = {
  outward: {
    cross: "rotate(0deg)",
    "cross-reverse": "rotate(180deg)",
    parallel: "rotate(-90deg)",
    "parallel-reverse": "rotate(90deg)",
  },
  inward: {
    cross: "rotate(0deg)",
    "cross-reverse": "rotate(0deg)",
    parallel: "rotate(90deg)",
    "parallel-reverse": "rotate(-90deg)",
  },
};

function DialTickMark({ size }: { size: CompassDialTickSize }) {
  const { total, upper, gap } = TICK_GEOMETRY[size];
  const pointB = total - upper;
  const pointC = total - upper - gap;

  return (
    <svg
      width={ROOT_WIDTH}
      height={total}
      viewBox={`0 0 ${ROOT_WIDTH} ${total}`}
      fill="none"
      className={styles.tickMark}
      aria-hidden="true"
      data-slot="compass-dial-tick-mark"
    >
      <path
        d={`M2 ${total}L2 ${pointB}M2 ${pointC}L2 0`}
        stroke="var(--gb-border-static-white)"
        strokeWidth={1}
      />
    </svg>
  );
}

export function CompassDialTick({
  type = "default",
  direction = "outward",
  muted = false,
  textArrangement = "cross",
  size = 5,
  label,
  coachmark,
  className,
  ...props
}: CompassDialTickProps) {
  const hasLabel = type === "text" || type === "circle";
  const isOutward = direction === "outward";

  const wrapWithCoachmark = (node: React.ReactNode) =>
    coachmark ? (
      <Tooltip
        variant="reversed"
        open
        side="right"
        align="start"
        title={coachmark.title}
        description={coachmark.description}
        onClose={coachmark.onDismiss}
      >
        {node}
      </Tooltip>
    ) : (
      node
    );

  // outward: the label is in the same flex flow as the tick, so at the
  // bottom of the box (117px), [label, gap(--spacing-4=16px), tick] stack up
  // (together they nearly exactly fill the box height — verified).
  // inward: only the tick stays in the box flow (pinned to the box top =
  // rim, same as the decorative ticks), and the label floats outside the
  // box via `position: absolute` (further out than the rim) — measured on
  // the Figma north tick, the Badge floats clearly further outside than the
  // common boundary line formed by the outer ends of the decorative ticks,
  // and confirmed that the tick's own length matches the other size5 ticks.
  // The label-tick gap was fixed at 8px (`--gb-spacing-2`, half of outward)
  // by directly measuring the Figma "Part/Dial" atom component (node
  // 8125:22891) — since it's a different value from outward, it's not
  // shared via `gapClass` and is set directly on the label side with `mb-`.
  const labelNode =
    type === "text"
      ? wrapWithCoachmark(
          <div
            className={cn(styles.labelWrap, styles.textLabelWrap)}
            data-direction={direction}
          >
            <p
              className={styles.textLabel}
              data-muted={muted || undefined}
              style={{
                transform: TEXT_TRANSFORM[direction][textArrangement],
              }}
            >
              {label}
            </p>
          </div>,
        )
      : type === "circle"
        ? wrapWithCoachmark(
            <div className={styles.labelWrap} data-direction={direction}>
              <div
                style={{
                  transform: CIRCLE_TRANSFORM[direction][textArrangement],
                }}
              >
                <Badge variant={muted ? "outline" : "default"} size="20">
                  {label}
                </Badge>
              </div>
            </div>,
          )
        : null;

  const tickNode = (
    <div className={styles.tickWrap}>
      <DialTickMark size={size} />
    </div>
  );

  return (
    <div
      className={cn(styles.root, className)}
      data-direction={direction}
      data-has-label={hasLabel || undefined}
      {...props}
    >
      {isOutward && labelNode}
      {tickNode}
      {!isOutward && labelNode}
    </div>
  );
}
