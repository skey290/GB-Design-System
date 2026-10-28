import * as React from "react";

import { cn } from "@/lib/utils";
import {
  CompassDial,
  type CompassDialSelf,
  type CompassDialType,
} from "@/components/compass/ui/compass-dial";
import { CANVAS_SIZE } from "@/components/compass/ui/compass-dial/compass-dial-utils";
import {
  CompassSelfCluster,
  type CompassSelfClusterPosition,
  type CompassSelfClusterSelf,
} from "@/components/compass/ui/compass-self-cluster";

import styles from "./compass-analysis.module.css";

/**
 * Final assembly component that overlays `CompassDial` and `CompassSelfCluster`.
 * Places `CompassSelfCluster` at the center of the 800x800 canvas
 * (`CANVAS_SIZE` from `CompassDial`).
 *
 * `type` is a fixed pairing that also determines whether the dial is shown
 * (not a free combination): `reach`/`engagement`/`reach-and-engagement` show
 * the dial and cluster together, while `potential` shows only the cluster
 * without the dial (choose one of potential/potential-estimate/potential-error
 * via `potentialVariant`).
 *
 * Self data has different shapes between `CompassDialSelf`
 * (id/qualifiedReach/engagementIntensity) and `CompassSelfClusterSelf`
 * (image/imageAlt/growth), but both must refer to the same 8 people in the
 * same slot order, so this component takes a single unified
 * `CompassAnalysisSelf` array and converts it internally for each
 * sub-component.
 *
 * `coachmark` is passed through as-is to whichever of the dial/cluster it
 * applies to, and is ignored if it applies to neither (e.g. Ranking).
 */

export type CompassAnalysisType =
  "potential" | "reach" | "engagement" | "reach-and-engagement";

export type CompassAnalysisPotentialVariant =
  "potential" | "potential-estimate" | "potential-error";

export interface CompassAnalysisSelf {
  id: string;
  image: string;
  imageAlt?: string;
  qualifiedReach: number;
  engagementIntensity: number;
  /** Used only when type="potential" */
  growth?: number;
  /** Valid only when this self is decorated under potentialVariant="potential-estimate" */
  estimate?: boolean;
}

export interface CompassAnalysisProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Also determines whether the dial is shown. Default "reach-and-engagement" */
  type?: CompassAnalysisType;
  /** Valid only when type="potential". Default "potential" */
  potentialVariant?: CompassAnalysisPotentialVariant;
  /** Valid only when type is reach/engagement/reach-and-engagement */
  isDataCollected?: boolean;
  /** Center label. If not given, falls back to the default for type ("reach"→"Reach"/"engagement"→"Engagement"/"reach-and-engagement"→"Ranking"). Ignored when type="potential" (the cluster is fixed to "Growth Potential") */
  label?: string;
  /** List of selves filled clockwise starting from north. Up to 8 people */
  selves?: CompassAnalysisSelf[];
  activeSelfIndex?: number;
  activeEmptyPosition?: CompassSelfClusterPosition;
  onSelfClick?: (index: number) => void;
  onEmptySlotClick?: (position: CompassSelfClusterPosition) => void;
  /** Retry click handler, valid only when potentialVariant="potential-error" */
  onRetry?: () => void;
  /**
   * Onboarding coachmark for the current submenu. Passed through as-is to
   * whichever of the dial/cluster it applies to, and ignored if it applies
   * to neither (e.g. Ranking).
   */
  coachmark?: {
    title: string;
    description?: string;
    onDismiss?: () => void;
  };
}

const DEFAULT_LABEL_BY_TYPE: Record<CompassDialType, string> = {
  reach: "Reach",
  engagement: "Engagement",
  "reach-and-engagement": "Ranking",
};

export function CompassAnalysis({
  type = "reach-and-engagement",
  potentialVariant = "potential",
  isDataCollected = true,
  label,
  selves = [],
  activeSelfIndex,
  activeEmptyPosition,
  onSelfClick,
  onEmptySlotClick,
  onRetry,
  coachmark,
  className,
  ...props
}: CompassAnalysisProps) {
  const isPotential = type === "potential";
  const dialType: CompassDialType | undefined = isPotential ? undefined : type;
  const dialSelves = React.useMemo<CompassDialSelf[]>(
    () =>
      selves.map((self) => ({
        id: self.id,
        qualifiedReach: self.qualifiedReach,
        engagementIntensity: self.engagementIntensity,
      })),
    [selves],
  );

  const clusterSelves = React.useMemo<CompassSelfClusterSelf[]>(
    () =>
      selves.map((self) => ({
        image: self.image,
        imageAlt: self.imageAlt,
        growth: self.growth,
        estimate: self.estimate,
      })),
    [selves],
  );

  return (
    <div
      className={cn(styles.root, className)}
      style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
      {...props}
    >
      {dialType && (
        <CompassDial
          type={dialType}
          selves={dialSelves}
          isDataCollected={isDataCollected}
          coachmark={coachmark}
        />
      )}

      <div className={styles.centered}>
        <CompassSelfCluster
          variant={isPotential ? potentialVariant : "reach-or-engagement"}
          label={
            isPotential ? undefined : (label ?? DEFAULT_LABEL_BY_TYPE[type])
          }
          selves={clusterSelves}
          activeSelfIndex={activeSelfIndex}
          activeEmptyPosition={activeEmptyPosition}
          onSelfClick={onSelfClick}
          onEmptySlotClick={onEmptySlotClick}
          onRetry={onRetry}
          coachmark={coachmark}
        />
      </div>
    </div>
  );
}
