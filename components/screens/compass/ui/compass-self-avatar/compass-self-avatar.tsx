import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";

import styles from "./compass-self-avatar.module.css";

export type CompassSelfAvatarVariant = "self" | "empty" | "potential";
export type CompassSelfAvatarStatus = "default" | "active";
export type CompassSelfAvatarPosition =
  0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;

export interface CompassSelfAvatarCoachmark {
  title: string;
  description?: string;
  onDismiss?: () => void;
}

export interface CompassSelfAvatarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Kind of self content */
  variant?: CompassSelfAvatarVariant;
  /** Status, only for variant="self"|"empty"|"potential" */
  status?: CompassSelfAvatarStatus;
  /** Valid only for variant="self" && status="default" */
  error?: boolean;
  /** User image URL, shown when variant="self"|"potential" */
  image?: string;
  /** Image alt text (e.g. user name) */
  imageAlt?: string;
  /** Overlay text for status="active". Falls back to a per-variant default when unset */
  label?: string;
  /** Bottom description text for the error (or potential's lack-of-data) state. Falls back to a default when unset */
  description?: string;
  /** Growth value 0-100, for variant="potential" */
  growth?: number;
  /** Placement angle around the dial center, for variant="potential" (0=north, clockwise) */
  position?: CompassSelfAvatarPosition;
  /** Whether data has been collected, for variant="potential". When false, the badge turns to the warning color and the Estimate notice overlaps it */
  isDataCollected?: boolean;
  /** Onboarding coachmark attached to the percentage badge, for variant="potential" */
  coachmark?: CompassSelfAvatarCoachmark;
}

const DEFAULT_ACTIVE_LABEL: Record<"self" | "empty", string> = {
  self: "Go to\nContent Studio",
  empty: "Go to\nSelf",
};

const DEFAULT_EMPTY_LABEL = "No\nSelf Yet";

const DEFAULT_ERROR_DESCRIPTION: Record<"self" | "potential", string> = {
  self: "(No experience data)",
  potential: "(Lack of Data)",
};

/** Avatar radius (px) */
const AVATAR_RADIUS = 50;
/** Badge center ≈ ring radius + this value (px) */
const BADGE_RADIAL_GAP = 31;

function getRingRadius(growth: number): number {
  return AVATAR_RADIUS + growth * 1.25;
}

function MultilineText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split("\n").map((line) => (
        <span key={line} className={styles.line}>
          {line}
        </span>
      ))}
    </span>
  );
}

export function CompassSelfAvatar({
  variant = "self",
  status = "default",
  error = false,
  image,
  imageAlt = "",
  label,
  description,
  growth = 0,
  position = 0,
  isDataCollected = true,
  coachmark,
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}: CompassSelfAvatarProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const isPotential = variant === "potential";
  const isActive = status === "active" || isHovered;
  const effectiveError = isPotential ? !isDataCollected : error;
  const showError = variant !== "empty" && !isActive && effectiveError;
  const hoverHandlers = {
    onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true);
      onMouseEnter?.(event);
    },
    onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
      onMouseLeave?.(event);
    },
  };

  if (variant === "empty") {
    return (
      <div
        className={cn(styles.emptyRoot, className)}
        data-slot="compass-self-avatar-empty"
        data-active={isActive || undefined}
        {...props}
        {...hoverHandlers}
      >
        <MultilineText
          text={
            label ??
            (isActive ? DEFAULT_ACTIVE_LABEL.empty : DEFAULT_EMPTY_LABEL)
          }
          className={styles.emptyLabel}
        />
      </div>
    );
  }

  const avatar = (
    <div
      className={cn(styles.avatarRoot, !isPotential && className)}
      data-active={isActive || undefined}
      {...(!isPotential ? props : {})}
      {...hoverHandlers}
    >
      {image && (
        <img
          src={image}
          alt={imageAlt}
          className={styles.avatarImage}
          data-blur={isActive || showError || undefined}
        />
      )}
      <div
        className={styles.avatarOverlay}
        data-visible={isActive || showError || undefined}
      >
        {isActive && (
          <MultilineText
            text={label ?? DEFAULT_ACTIVE_LABEL.self}
            className={styles.activeLabel}
          />
        )}
        {showError && (
          <span className={styles.errorBlock}>
            <span className={styles.errorTitle}>Estimate</span>
            <br />
            <span className={styles.errorDescription}>
              {description ??
                DEFAULT_ERROR_DESCRIPTION[isPotential ? "potential" : "self"]}
            </span>
          </span>
        )}
      </div>
    </div>
  );

  if (!isPotential) {
    return avatar;
  }

  const ringRadius = getRingRadius(growth);
  const bearing = position;
  const showEstimateStyling = !isDataCollected;

  return (
    <div className={cn(styles.potentialRoot, className)} {...props}>
      {avatar}

      <div
        className={styles.ring}
        style={{
          width: ringRadius * 2,
          height: ringRadius * 2,
          transform: "translate(-50%, -50%)",
        }}
        aria-hidden="true"
      />

      <div
        className={styles.spokePivot}
        style={{ transform: `rotate(${bearing}deg)` }}
        aria-hidden="true"
      >
        <div
          className={styles.spokeLine}
          style={{ top: -ringRadius, height: ringRadius - AVATAR_RADIUS }}
        />
      </div>

      {(() => {
        const badge = (
          <div style={{ transform: `rotate(${-bearing}deg)` }}>
            <Badge
              variant={showEstimateStyling ? "alarm" : "reverse"}
              size="20"
            >
              {Math.round(growth)}%
            </Badge>
          </div>
        );

        return (
          <div
            className={styles.badgePivot}
            style={{ transform: `rotate(${bearing}deg)` }}
          >
            <div
              className={styles.badgeWrap}
              style={{ top: -(ringRadius + BADGE_RADIAL_GAP) }}
            >
              {coachmark ? (
                <Tooltip
                  variant="reversed"
                  open
                  side="right"
                  align="start"
                  title={coachmark.title}
                  description={coachmark.description}
                  onClose={coachmark.onDismiss}
                >
                  {badge}
                </Tooltip>
              ) : (
                badge
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
