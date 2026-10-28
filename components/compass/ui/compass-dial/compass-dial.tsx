"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { CompassDialTick } from "@/components/compass/ui/compass-dial-tick";
import {
  buildCompassDialPlan,
  CANVAS_SIZE,
  getTickBoxTopOffset,
  type CompassDialSelf,
  type CompassDialTickCoachmark,
  type CompassDialTickPlan,
  type CompassDialType,
} from "./compass-dial-utils";

import styles from "./compass-dial.module.css";

export type { CompassDialSelf, CompassDialTickCoachmark, CompassDialType };

/**
 * Figma "Dial"(❄️ GB_Compass, C34HOpbSASmThFA1iYFm8D) node-id 8003:8878.
 *
 * Assembly component that arranges 80 `CompassDialTick`s (Figma "Part/Dial",
 * node 8003:8237) at 4.5° intervals around the outward (Reach) ring and the
 * inward (Engagement) ring. All value computation — bucketing, gradient,
 * ranking — lives in `compass-dial-utils.ts`; this file only places that
 * plan (`CompassDialTickPlan[]`) at circular coordinates.
 *
 * Placement approach: each tick is a child of a 0×0 pivot positioned at the
 * canvas center (400,400), and the pivot is rotated via `rotate(angle)`. The
 * tick box (4×117px) itself is never rotated — it's positioned purely via a
 * `top` offset relative to the pivot (`getTickBoxTopOffset`), so the rotation
 * always happens around the dial's center.
 *
 * Verified against all 12 real Figma variants (`Type` × `Self number` ×
 * `Data Collected`) by cross-checking with `get_screenshot`/`get_design_context`:
 * - `Self number=1, Data Collected=true` is NOT "No Data Collected" — it shows
 *   that one person's real value at size5 (confirmed, contrary to the initial
 *   investigation doc's assumption).
 * - Only `Self number=1` under `Type="reach and engagement"` is always
 *   "No Data Collected" regardless of the `Data Collected` value (consistent
 *   with the `GB_Compass.md` Part 3 cold-start condition that ranking only
 *   makes sense with at least 2 people).
 * - The two "No Data Collected" badges above differ only in badge size (the
 *   former is size1, the latter size5) — confirmed by reading each one's
 *   `h-[Npx]` value directly via `get_design_context`.
 */

/** Pivot + offset wrapper that places a single tick at an angle relative to the center */
function PositionedTick({
  plan,
  direction,
}: {
  plan: CompassDialTickPlan;
  direction: "outward" | "inward";
}) {
  return (
    <div
      className={styles.pivot}
      style={{ transform: `rotate(${plan.angle}deg)` }}
    >
      <div
        className={styles.tickWrap}
        style={{ top: getTickBoxTopOffset(direction) }}
      >
        <CompassDialTick
          direction={direction}
          type={plan.type}
          muted={plan.muted}
          size={plan.size}
          textArrangement={plan.textArrangement}
          label={plan.label}
          coachmark={plan.coachmark}
        />
      </div>
    </div>
  );
}

export interface CompassDialProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /**
   * Figma `Type` variant.
   * - `reach`: outward ring only (bucketed by Reach value, label is a
   *   thousands-separated integer)
   * - `engagement`: inward ring only (bucketed by Engagement value, label is
   *   a percentage with 1 decimal place)
   * - `reach-and-engagement`: both rings (outward shows Ranking ordinal
   *   labels; inward has no labels, just a gradient driven by Engagement
   *   value)
   */
  type: CompassDialType;
  /**
   * Array of Selves. Array order = slot assignment order (index 0 = north,
   * then clockwise in 45° steps); only the first 8 are used. Size (bucketing)
   * is determined by each value's rank, not by slot position.
   */
  selves: CompassDialSelf[];
  /**
   * Whether data has been collected (cold start). Defaults to `true`. When
   * `false`, regardless of the `selves` array, only a small "No Data
   * Collected" badge is shown at north and everything else is a decorative
   * tick.
   */
  isDataCollected?: boolean;
  /**
   * Onboarding coachmark attached to the north chip (slot 0). Only applied
   * for `type="reach"`/`"engagement"` (ignored for
   * `"reach-and-engagement"`), and only visible when that ring actually
   * renders a label there (i.e. when Selves is populated).
   */
  coachmark?: CompassDialTickCoachmark;
}

export function CompassDial({
  type,
  selves,
  isDataCollected = true,
  coachmark,
  className,
  ...props
}: CompassDialProps) {
  const plan = React.useMemo(
    () =>
      buildCompassDialPlan({
        type,
        selves,
        dataCollected: isDataCollected,
        coachmark,
      }),
    [type, selves, isDataCollected, coachmark],
  );

  return (
    <div
      className={cn(styles.root, className)}
      style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
      {...props}
    >
      {plan.outward?.map((tick, index) => (
        <PositionedTick
          key={`outward-${index}`}
          plan={tick}
          direction="outward"
        />
      ))}
      {plan.inward?.map((tick, index) => (
        <PositionedTick
          key={`inward-${index}`}
          plan={tick}
          direction="inward"
        />
      ))}
    </div>
  );
}
