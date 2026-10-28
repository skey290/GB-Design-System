import type {
  CompassDialTickDirection,
  CompassDialTickSize,
  CompassDialTickTextArrangement,
  CompassDialTickType,
} from "@/components/compass/ui/compass-dial-tick";

/**
 * Pure computation logic for `CompassDial` (Figma "Dial", ❄️ GB_Compass node
 * 8003:8878).
 *
 * Rendering (angular placement, rotation, CSS) is handled by
 * `compass-dial.tsx`; this file collects only the deterministic
 * input-to-output calculations — bucketing, gradient, ranking — so they're
 * easy to unit test.
 */

/** Total number of ticks around the circle (Figma original is fixed at 80, 4.5° apart) */
export const TICK_COUNT = 80;
/** Number of "anchors" (slots where real data attaches), one every 8 ticks */
export const ANCHOR_COUNT = 8;
/** Angular spacing per tick */
export const TICK_STEP_DEGREES = 360 / TICK_COUNT;
/** Tick spacing between anchors (in tick-step units). 360/8 = 45° = 10 tick-steps */
export const ANCHOR_TICK_STEP = TICK_COUNT / ANCHOR_COUNT;

/**
 * Fixed dimensions (px) of the `CompassDialTick` box itself. Must match the
 * component atom's constant (h-[117px]), so it's fixed here as a geometric
 * constant too (not a token — it's a measured SVG/layout coordinate, not
 * matched to `--spacing-*`, same judgment criterion as the existing
 * `reference_svg_geometry_not_tokens`).
 */
export const TICK_BOX_HEIGHT = 117;

/**
 * The two rings' "fixed baseline radius" (px, based on an 800×800 canvas
 * centered at (400,400)).
 *
 * outward (Reach) = 328, inward (Engagement) = 311. Determined by directly
 * measuring Figma screenshots in pixels at 800×800 (or 1063×1063 including
 * overflow — scale-corrected using get_screenshot's `original_width`).
 *
 * - outward: confirmed that the north (rank1, size5) tick's inner end (the
 *   side closer to the center) starts exactly at radius 328, and its outer
 *   end (the side that grows with size) ends at 328+80=408
 *   (`CompassDialTick`'s `direction="outward"` has the **bottom** of the box
 *   as this 328px anchor).
 * - inward: confirmed that the `tick_inward` frame's own bounding box is
 *   622×622 (radius 311), centered exactly on the center, and the north
 *   tick's label offset (-48px, same as the atom component's
 *   `getInwardLabelOffset`) is calculated exactly relative to this 311 point
 *   (`direction="inward"` has the **top** of the box as this 311px anchor).
 */
export const OUTWARD_ANCHOR_RADIUS = 328;
export const INWARD_ANCHOR_RADIUS = 311;

/** Canvas size (px) — fixed at 800×800, matching the Figma "Dial" component frame */
export const CANVAS_SIZE = 800;

export interface CompassDialSelf {
  id: string;
  qualifiedReach: number;
  /** Percentage value. E.g. 14.3 */
  engagementIntensity: number;
}

export type CompassDialType = "reach" | "engagement" | "reach-and-engagement";

export interface CompassDialTickCoachmark {
  title: string;
  description?: string;
  onDismiss?: () => void;
}

export interface CompassDialTickPlan {
  /** Clockwise angle (degrees) starting from 0 (north) */
  angle: number;
  type: CompassDialTickType;
  muted: boolean;
  size: CompassDialTickSize;
  textArrangement: CompassDialTickTextArrangement;
  label?: string;
  coachmark?: CompassDialTickCoachmark;
}

/** Clamp tick size to 1~5 */
function clampSize(value: number): CompassDialTickSize {
  return Math.min(5, Math.max(1, value)) as CompassDialTickSize;
}

/** Array of angles for the 80 ticks: [0, 4.5, 9, ..., 355.5] */
export function buildTickAngles(): number[] {
  return Array.from({ length: TICK_COUNT }, (_, i) => i * TICK_STEP_DEGREES);
}

/** Slot (0~7) → tick index (0,10,20,...,70) */
export function slotToTickIndex(slot: number): number {
  return slot * ANCHOR_TICK_STEP;
}

/**
 * Angle (0~360, north=0, clockwise) → `textArrangement`.
 *
 * `CompassDialTick` can only counter-rotate a label into one of 4 fixed
 * rotation values (cross/parallel/parallel-reverse/cross-reverse), but the
 * assembly component rotates the entire tick by the angle, so for the label
 * to end up upright we must pick, per 90° segment, the arrangement where
 * "angle + the atom's internal rotation value ≡ 0 (mod 360)" (at diagonal
 * anchors full cancellation is impossible, so there's up to a 45° tilt — the
 * Figma original is tilted the same way too, confirmed by zooming into
 * screenshots).
 *
 * outward/inward have `cross`↔`cross-reverse`'s internal rotation values
 * swapped relative to each other (outward: cross=0/cross-reverse=180,
 * inward: cross=180/cross-reverse=0), so the two directions use opposite
 * arrangements in the north/south segments. In the east/west segments,
 * parallel/parallel-reverse are the same for both directions. Ties at the
 * diagonal boundaries (45/135/225/315°) are assigned to the segment above
 * (the next one clockwise) — confirmed by comparing the tilt direction of
 * the actual engagement ring's northeast (45°) label in screenshots.
 */
export function getTextArrangement(
  angle: number,
  direction: CompassDialTickDirection,
): CompassDialTickTextArrangement {
  const normalized = ((angle % 360) + 360) % 360;

  if (normalized >= 45 && normalized < 135) return "parallel";
  if (normalized >= 225 && normalized < 315) return "parallel-reverse";

  const isNorthQuadrant = normalized < 45 || normalized >= 315;
  if (direction === "outward") {
    return isNorthQuadrant ? "cross" : "cross-reverse";
  }
  return isNorthQuadrant ? "cross-reverse" : "cross";
}

/**
 * Rule D — rank (0-based, 0=1st place) → tick size (1~5).
 *
 * Shrinks by one step for every pair of ranks (`size = 5 -
 * floor(rankIndex / 2)`; since the max is 8 people, it stops at 2 rather than
 * going down to 1) — confirmed against Figma "Self number=8" (reach measured
 * in pixels, engagement cross-checked against screenshots): `[5,5,4,4,3,3,2,2]`.
 * If n<=1 (nothing to compare against), the result is 5 (shown at max size
 * since it's the only value).
 */
export function getBucketSize(
  rankIndex: number,
  n: number,
): CompassDialTickSize {
  if (n <= 1) return 5;
  return clampSize(5 - Math.floor(rankIndex / 2));
}

/**
 * Ranks (0-based) an array of values in descending order. Ties go to
 * whichever comes earlier in the original array order (stable sort).
 */
export function rankDescending(values: number[]): number[] {
  const order = values
    .map((_, index) => index)
    .sort((a, b) => values[b] - values[a] || a - b);
  const ranks = new Array<number>(values.length);
  order.forEach((originalIndex, rank) => {
    ranks[originalIndex] = rank;
  });
  return ranks;
}

export interface FilledAnchor {
  /** 0~79 */
  tickIndex: number;
  size: CompassDialTickSize;
}

/**
 * Rule E — size of the decorative ticks between anchors.
 *
 * At each tick position, we take the maximum, over all anchors, of
 * `max(anchor.size - distance, 1)` where distance is measured clockwise.
 * When there's only one anchor (N=1), this produces a symmetric gradient
 * that moves away from itself and back again over one full loop (80
 * tick-steps) around the circle. Even when fewer than 8 anchors are sparsely
 * filled in, there's no need to explicitly find the "two nearest anchors" —
 * simply taking the max of every anchor's contribution automatically
 * produces the correct result (a farther anchor's contribution is always
 * smaller because of the distance term).
 */
export function computeSizesForTicks(
  anchors: FilledAnchor[],
  totalTicks: number = TICK_COUNT,
): CompassDialTickSize[] {
  if (anchors.length === 0) {
    return Array<CompassDialTickSize>(totalTicks).fill(1);
  }

  const sizes: CompassDialTickSize[] = new Array(totalTicks);
  for (let pos = 0; pos < totalTicks; pos++) {
    let best = 1;
    for (const anchor of anchors) {
      const forwardDistance =
        (((pos - anchor.tickIndex) % totalTicks) + totalTicks) % totalTicks;
      const backwardDistance =
        (((anchor.tickIndex - pos) % totalTicks) + totalTicks) % totalTicks;
      best = Math.max(
        best,
        anchor.size - forwardDistance,
        anchor.size - backwardDistance,
      );
    }
    sizes[pos] = clampSize(best);
  }
  return sizes;
}

/** Integer Reach notation with thousands separators (e.g. 8340 → "8,340") */
export function formatReach(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Engagement notation as a percentage with 1 decimal place (e.g. 14.3 → "14.3%") */
export function formatEngagement(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** 1 → "1st", 2 → "2nd", 3 → "3rd", 4 → "4th", 11~13 → "11th"~"13th", etc. */
export function ordinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = n % 100;
  const suffix =
    suffixes[(remainder - 20) % 10] ?? suffixes[remainder] ?? suffixes[0];
  return `${n}${suffix}`;
}

/**
 * Rule F — Ranking final rank (exactly as in `GB_Compass.md` Part 3).
 *
 * 1) Rank Qualified Reach and Engagement Intensity each 1 through N.
 * 2) Flip each rank into a score (1st=N points ... Nth=1 point).
 * 3) Final score = Engagement score×2 + Reach score×1.
 * 4) Re-sort by final score. Ties go to whichever has the higher (numerically
 *    smaller) Engagement rank.
 *
 * Returns a 1-based final rank array in the same order as the input array.
 */
export function computeFinalRanks(selves: CompassDialSelf[]): number[] {
  const n = selves.length;
  if (n === 0) return [];

  const reachRanks = rankDescending(selves.map((s) => s.qualifiedReach));
  const engagementRanks = rankDescending(
    selves.map((s) => s.engagementIntensity),
  );
  const reachScores = reachRanks.map((rank) => n - rank);
  const engagementScores = engagementRanks.map((rank) => n - rank);
  const finalScores = reachScores.map(
    (reachScore, i) => engagementScores[i] * 2 + reachScore,
  );

  const order = selves
    .map((_, index) => index)
    .sort((a, b) => {
      if (finalScores[b] !== finalScores[a]) {
        return finalScores[b] - finalScores[a];
      }
      return engagementRanks[a] - engagementRanks[b];
    });

  const finalRanks = new Array<number>(n);
  order.forEach((originalIndex, rank) => {
    finalRanks[originalIndex] = rank + 1;
  });
  return finalRanks;
}

export interface FilledSlot {
  /** Value used for size bucketing (qualifiedReach for the Reach ring, engagementIntensity for the Engagement ring) */
  value: number;
  /** Label to display. If `undefined`, this slot has no label and only affects size (used for the Ranking inner ring) */
  label?: string;
}

/**
 * Computes the 80-tick render plan for a single ring (outward or inward).
 *
 * - Slot order = array index (0 = north; Rule C: the caller passes in an
 *   array that already has slot assignment finished)
 * - Size is bucketed by descending rank of `value`, not by slot position
 *   (Rule D)
 * - Among labeled slots, north (slot 0) is always `type="circle"
 *   muted=false`; the rest use `otherLabelType` (Reach/Engagement="text",
 *   Ranking="circle") + `muted=true`
 * - Unlabeled slots (and the 79 non-anchor decorative ticks) are
 *   `type="default"`
 * - If `northCoachmark` is provided and the north slot has an actual label
 *   (i.e. Self is populated there), the coachmark is attached only to that
 *   slot. Combined with the rule that north is always `type="circle"`, this
 *   consistently points at the fixed "north chip" position regardless of
 *   rank.
 */
export function buildRingPlan({
  direction,
  filled,
  otherLabelType = "text",
  northCoachmark,
}: {
  direction: CompassDialTickDirection;
  filled: FilledSlot[];
  otherLabelType?: "text" | "circle";
  northCoachmark?: CompassDialTickCoachmark;
}): CompassDialTickPlan[] {
  const n = filled.length;
  const ranks = rankDescending(filled.map((f) => f.value));
  const anchors: FilledAnchor[] = filled.map((f, slot) => ({
    tickIndex: slotToTickIndex(slot),
    size: getBucketSize(ranks[slot], n),
  }));
  const sizes = computeSizesForTicks(anchors);
  const anchorByTickIndex = new Map(
    anchors.map((anchor, slot) => [anchor.tickIndex, { anchor, slot }]),
  );

  return buildTickAngles().map((angle, tickIndex) => {
    const textArrangement = getTextArrangement(angle, direction);
    const match = anchorByTickIndex.get(tickIndex);
    const filledSlot = match ? filled[match.slot] : undefined;
    const hasLabel = filledSlot?.label != null;

    if (!hasLabel) {
      return {
        angle,
        type: "default",
        muted: false,
        size: sizes[tickIndex],
        textArrangement,
      };
    }

    const isNorth = tickIndex === 0;
    return {
      angle,
      type: isNorth ? "circle" : otherLabelType,
      muted: !isNorth,
      size: sizes[tickIndex],
      textArrangement,
      label: filledSlot.label,
      coachmark: isNorth ? northCoachmark : undefined,
    };
  });
}

/**
 * Render plan for the 80 ticks in the "no data" (cold start) state.
 *
 * - Only the `primary` ring shows a "No Data Collected" badge
 *   (`type="circle" muted=false`) at north; the remaining 79 ticks (and the
 *   entirety of the non-primary ring) are unlabeled `type="default"` size1
 *   decorative ticks.
 * - `size` is decided by the caller: `!dataCollected` → 1; Ranking with
 *   fewer than 2 Selves (data exists but can't be ranked) → 5 (confirmed via
 *   Figma `get_design_context` measurement).
 */
export function buildSuppressedRingPlan(
  direction: CompassDialTickDirection,
  primary: boolean,
  badgeSize: CompassDialTickSize,
): CompassDialTickPlan[] {
  return buildTickAngles().map((angle, tickIndex) => {
    const textArrangement = getTextArrangement(angle, direction);
    if (primary && tickIndex === 0) {
      return {
        angle,
        type: "circle",
        muted: false,
        size: badgeSize,
        textArrangement,
        label: "No Data Collected",
      };
    }
    return {
      angle,
      type: "default",
      muted: false,
      size: 1,
      textArrangement,
    };
  });
}

export interface CompassDialPlan {
  outward?: CompassDialTickPlan[];
  inward?: CompassDialTickPlan[];
}

/**
 * `CompassDial`'s top-level planning function. Computes the render plan for
 * both rings (outward=Reach, inward=Engagement) from `type`, `selves`, and
 * `dataCollected`.
 *
 * Priority order (confirmed via Figma measurement — all 3 of the following
 * are corrections verified directly via `get_design_context` that were not
 * in the original investigation request):
 * 1) 0 Selves → both rings fully decorative (size1), no labels
 * 2) `dataCollected=false` → size1 "No Data Collected" badge at north of the
 *    primary ring
 * 3) `type="reach-and-engagement"` with fewer than 2 Selves (comparison
 *    impossible) → size5 "No Data Collected" badge at outward north (meaning
 *    the value itself exists but can't be ranked, so unlike case 2 it's
 *    shown at a larger size — confirmed via `Self number=1, Data
 *    Collected=true` measurement; a finding not previously documented)
 * 4) Otherwise → normal bucketing via `buildRingPlan`
 *
 * `coachmark` (new) is only attached to the north chip for
 * `type="reach"`/`"engagement"`. For `"reach-and-engagement"` (Ranking), it's
 * deliberately not passed through, because Figma has no coachmark for the
 * normal-data state there (only the "No Ranking Data Yet" exception state
 * when fewer than 2 Selves exist, which is out of scope here).
 */
export function buildCompassDialPlan({
  type,
  selves,
  dataCollected = true,
  coachmark,
}: {
  type: CompassDialType;
  selves: CompassDialSelf[];
  dataCollected?: boolean;
  coachmark?: CompassDialTickCoachmark;
}): CompassDialPlan {
  const filled = selves.slice(0, ANCHOR_COUNT);
  const usesOutward = type === "reach" || type === "reach-and-engagement";
  const usesInward = type === "engagement" || type === "reach-and-engagement";

  if (filled.length === 0) {
    return {
      outward: usesOutward
        ? buildSuppressedRingPlan("outward", false, 1)
        : undefined,
      inward: usesInward
        ? buildSuppressedRingPlan("inward", false, 1)
        : undefined,
    };
  }

  if (!dataCollected) {
    return {
      outward: usesOutward
        ? buildSuppressedRingPlan("outward", true, 1)
        : undefined,
      inward: usesInward
        ? buildSuppressedRingPlan("inward", !usesOutward, 1)
        : undefined,
    };
  }

  if (type === "reach-and-engagement" && filled.length < 2) {
    return {
      outward: buildSuppressedRingPlan("outward", true, 5),
      inward: buildSuppressedRingPlan("inward", false, 5),
    };
  }

  if (type === "reach") {
    return {
      outward: buildRingPlan({
        direction: "outward",
        filled: filled.map((s) => ({
          value: s.qualifiedReach,
          label: formatReach(s.qualifiedReach),
        })),
        otherLabelType: "text",
        northCoachmark: coachmark,
      }),
    };
  }

  if (type === "engagement") {
    return {
      inward: buildRingPlan({
        direction: "inward",
        filled: filled.map((s) => ({
          value: s.engagementIntensity,
          label: formatEngagement(s.engagementIntensity),
        })),
        otherLabelType: "text",
        northCoachmark: coachmark,
      }),
    };
  }

  const finalRanks = computeFinalRanks(filled);
  return {
    outward: buildRingPlan({
      direction: "outward",
      filled: filled.map((s, i) => ({
        value: s.qualifiedReach,
        label: ordinal(finalRanks[i]),
      })),
      otherLabelType: "circle",
    }),
    inward: buildRingPlan({
      direction: "inward",
      filled: filled.map((s) => ({ value: s.engagementIntensity })),
    }),
  };
}

/**
 * The `top` offset (px, negative = above center) for the tick box
 * (4×117px) before rotation.
 *
 * For outward, the **bottom** of the box is the 328px anchor; for inward,
 * the **top** of the box is the 311px anchor (both pair up with the
 * justify-end/start alignment that `CompassDialTick` already knows about).
 * The assembly component just needs to position the box with this offset
 * and then apply `rotate(angle)` around the center.
 */
export function getTickBoxTopOffset(
  direction: CompassDialTickDirection,
): number {
  return direction === "outward"
    ? -(OUTWARD_ANCHOR_RADIUS + TICK_BOX_HEIGHT)
    : -INWARD_ANCHOR_RADIUS;
}

/**
 * How many px the outward (Reach/Ranking) ring's north (slot 0) label can
 * poke above the top of the `CompassDial` canvas (local y=0) at most (a
 * real overlap-bug fix — when `app/compass/page.tsx` computes its margin
 * from the top floating menu (`ButtonGroup type="menu"`), it needs to
 * reserve this much extra space).
 *
 * North is always `type="circle"` (`Badge size="20"`, height 20px), and
 * `CompassDialTick` stacks the [label, gap(--spacing-4=16px), tick line]
 * bundle against the bottom of the box (height `TICK_BOX_HEIGHT`) via
 * `justify-end` when outward. When the tick line is at its largest, size5
 * (`TICK_GEOMETRY[5].total`=80px), the bundle's total height is at its
 * maximum (116px), so the leftover margin at the top of the box is at its
 * minimum (1px) — meaning the label sits closest to the top of the box
 * (= pokes furthest outside the canvas). This is the worst case.
 * (North isn't always size5, but a smaller size increases the leftover,
 * pulling the label back toward the canvas, so size5 guarantees the upper
 * bound.)
 */
export const OUTWARD_NORTH_LABEL_MAX_BLEED = (() => {
  // Length of the size5 tick line. Must match `CompassDialTick`
  // (compass-dial-tick.tsx)'s `TICK_GEOMETRY[5].total` — duplicated here as
  // a literal since that's a private constant in that file. If the value
  // ever changes, this comment and the test below
  // (`OUTWARD_NORTH_LABEL_MAX_BLEED` describe in compass-dial.test.tsx) will
  // catch the mismatch.
  const NORTH_TICK_SIZE5_LENGTH = 80;
  const NORTH_BADGE_HEIGHT = 20; // Badge size="20" → --scale-20(px)
  const NORTH_LABEL_GAP = 16; // CompassDialTick outward gap-[var(--spacing-4)](px)

  const boxTopLocal =
    CANVAS_SIZE / 2 - (OUTWARD_ANCHOR_RADIUS + TICK_BOX_HEIGHT); // -45
  const worstCaseContentHeight =
    NORTH_TICK_SIZE5_LENGTH + NORTH_LABEL_GAP + NORTH_BADGE_HEIGHT; // 80+16+20=116
  const leftover = TICK_BOX_HEIGHT - worstCaseContentHeight; // 1
  const labelTopLocal = boxTopLocal + leftover; // -44

  return -labelTopLocal; // 44 — expressed as a positive number (px poking above the canvas top)
})();
