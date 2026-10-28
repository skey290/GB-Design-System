import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CompassSelfAvatar,
  type CompassSelfAvatarPosition,
} from "@/components/compass/ui/compass-self-avatar";

import styles from "./compass-self-cluster.module.css";

/**
 * Assembly component that arranges up to 8 "selves" as 8 independent satellites.
 *
 * `variant` (maps to the Figma `Style` axis; named this way to avoid colliding
 * with the React `style` prop):
 * - `reach-or-engagement`: renders each self as a `CompassSelfAvatar` (self/empty).
 *   The center shows `label` text (default "Reach").
 * - `potential` / `potential-estimate`: by default (no hover), only the single
 *   self with the highest `growth` value shows the growth decoration (ring/
 *   connector/badge); the rest render as plain, undecorated avatars. Hovering
 *   a different self moves the decoration to that self, and hovering an empty
 *   slot hides all decoration. The hovered self always has its `status`
 *   forced to `"active"`. The `-estimate` variant's Estimate indicator only
 *   appears on the resting default focus self (no hover), driven by
 *   `CompassSelfClusterSelf.estimate` (default `true`).
 * - `potential-error`: global API failure state. All selves render without
 *   decoration, and the center label switches to "We couldn't fetch your
 *   data" plus a Retry button.
 *
 * Fill order: the `selves` array order = north, clockwise.
 *
 * `coachmark`: attaches only to the percentage badge of the currently
 * decorated focus self. It hides together with the decoration whenever a
 * different self is hovered, or an empty slot is hovered.
 */

export type CompassSelfClusterVariant =
  | "reach-or-engagement"
  | "potential"
  | "potential-estimate"
  | "potential-error";

export type CompassSelfClusterPosition = CompassSelfAvatarPosition;

export interface CompassSelfClusterSelf {
  image: string;
  imageAlt?: string;
  /** Used only for potential-family variants. Drives focus-self selection (max value) and ring size */
  growth?: number;
  /**
   * Only applies when variant="potential-estimate" and this self is the one
   * decorated by default (no hover). Whether this self's data is insufficient
   * — `true` (default) makes the badge show the warning color.
   */
  estimate?: boolean;
}

export interface CompassSelfClusterProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Figma `Style` axis */
  variant?: CompassSelfClusterVariant;
  /** Center label, only used for variant="reach-or-engagement". Default "Reach" */
  label?: string;
  /** List of selves to fill starting from north, clockwise. Max 8 (extras are ignored) */
  selves?: CompassSelfClusterSelf[];
  /** Active (hover/press) state keyed by index into the selves array — applies to filled selves */
  activeSelfIndex?: number;
  /** Position to mark as active when giving an empty slot the active state */
  activeEmptyPosition?: CompassSelfClusterPosition;
  /** Click on a filled self — intent is to navigate to Content Studio */
  onSelfClick?: (index: number) => void;
  /** Click on an empty slot — intent is to navigate to Assets */
  onEmptySlotClick?: (position: CompassSelfClusterPosition) => void;
  /** Retry click handler, only used for variant="potential-error" */
  onRetry?: () => void;
  /** Only used for potential-family variants. Onboarding coachmark that
   * attaches to the percentage badge of the currently decorated focus self. */
  coachmark?: {
    title: string;
    description?: string;
    onDismiss?: () => void;
  };
}

/** Order starting from north (0), clockwise */
const FILL_ORDER: CompassSelfClusterPosition[] = [
  0, 45, 90, 135, 180, 225, 270, 315,
];

/** Distance to the satellite center (px) */
const SATELLITE_RADIUS = 157;
/** Container size (px) */
const CLUSTER_SIZE = 414;

function getFocusIndex(selves: CompassSelfClusterSelf[]): number | undefined {
  if (selves.length === 0) return undefined;
  let focusIndex = 0;
  for (let i = 1; i < selves.length; i++) {
    if ((selves[i].growth ?? 0) > (selves[focusIndex].growth ?? 0)) {
      focusIndex = i;
    }
  }
  return focusIndex;
}

/**
 * Hover tracking is attached to this component's stable positioning wrapper
 * div — decoration changes only alter the child's props, never the child's
 * component type, so it never remounts.
 */
function PositionedSatellite({
  position,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  position: CompassSelfClusterPosition;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={styles.pivot}
      style={{ transform: `rotate(${position}deg)` }}
    >
      <div
        className={styles.satelliteWrap}
        style={{ top: -SATELLITE_RADIUS }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div style={{ transform: `rotate(${-position}deg)` }}>{children}</div>
      </div>
    </div>
  );
}

export function CompassSelfCluster({
  variant = "reach-or-engagement",
  label = "Reach",
  selves = [],
  activeSelfIndex,
  activeEmptyPosition,
  onSelfClick,
  onEmptySlotClick,
  onRetry,
  coachmark,
  className,
  ...props
}: CompassSelfClusterProps) {
  const filledSelves = selves.slice(0, 8);
  const isError = variant === "potential-error";
  const isGrowthSet =
    variant === "potential" || variant === "potential-estimate";
  const focusIndex = isGrowthSet ? getFocusIndex(filledSelves) : undefined;

  const [hoveredSelfIndex, setHoveredSelfIndex] = React.useState<number | null>(
    null,
  );
  const [hoveredEmptyPosition, setHoveredEmptyPosition] =
    React.useState<CompassSelfClusterPosition | null>(null);

  const decoratedIndex = isGrowthSet
    ? hoveredEmptyPosition !== null
      ? undefined
      : (hoveredSelfIndex ?? focusIndex)
    : undefined;

  return (
    <div
      className={cn(styles.root, className)}
      style={{ width: CLUSTER_SIZE, height: CLUSTER_SIZE }}
      {...props}
    >
      <div className={styles.centerLabel}>
        {isError ? (
          <div className={styles.errorBlock}>
            <p className={styles.labelText}>We couldn&apos;t fetch your data</p>
            <Button variant="link" onClick={onRetry}>
              Retry
            </Button>
          </div>
        ) : (
          <p className={styles.labelText}>
            {isGrowthSet ? "Growth Potential" : label}
          </p>
        )}
      </div>

      {FILL_ORDER.map((position, i) => {
        const self = filledSelves[i];

        if (!self) {
          const isEmptyActive = activeEmptyPosition === position;
          return (
            <PositionedSatellite
              key={position}
              position={position}
              onMouseEnter={
                isGrowthSet
                  ? () => setHoveredEmptyPosition(position)
                  : undefined
              }
              onMouseLeave={
                isGrowthSet
                  ? () =>
                      setHoveredEmptyPosition((current) =>
                        current === position ? null : current,
                      )
                  : undefined
              }
            >
              <CompassSelfAvatar
                variant="empty"
                status={isEmptyActive ? "active" : "default"}
                onClick={() => onEmptySlotClick?.(position)}
              />
            </PositionedSatellite>
          );
        }

        // Hover forces not only decoratedIndex but also status to "active"
        // immediately, so the "Go to Content Studio" text and the potential
        // badge appear together with no delay. The Estimate indicator text
        // never shows on a hovered self — it only appears on the resting
        // default focus self (no hover). The badge color is independent of
        // status; it always follows each self's own estimate value.
        const isHoveredSelf = isGrowthSet && hoveredSelfIndex === i;
        const isActive = activeSelfIndex === i || isHoveredSelf;
        const isDecorated = isGrowthSet && i === decoratedIndex;
        const isFocusEstimate =
          variant === "potential-estimate" && (self.estimate ?? true);
        const showCoachmarkHere =
          isGrowthSet &&
          coachmark != null &&
          i === focusIndex &&
          hoveredSelfIndex === null &&
          hoveredEmptyPosition === null;

        return (
          <PositionedSatellite
            key={position}
            position={position}
            onMouseEnter={
              isGrowthSet ? () => setHoveredSelfIndex(i) : undefined
            }
            onMouseLeave={
              isGrowthSet
                ? () =>
                    setHoveredSelfIndex((current) =>
                      current === i ? null : current,
                    )
                : undefined
            }
          >
            <CompassSelfAvatar
              variant={isDecorated ? "potential" : "self"}
              position={position}
              growth={self.growth ?? 0}
              isDataCollected={!isFocusEstimate}
              status={isActive ? "active" : "default"}
              image={self.image}
              imageAlt={self.imageAlt}
              coachmark={showCoachmarkHere ? coachmark : undefined}
              onClick={() => onSelfClick?.(i)}
            />
          </PositionedSatellite>
        );
      })}
    </div>
  );
}
