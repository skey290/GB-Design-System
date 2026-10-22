import * as React from "react";

import styles from "./skeleton.module.css";

export type SkeletonType = "rectangle" | "text" | "circle";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Figma `Type` variant */
  type?: SkeletonType;
  /** Stretches to fill the parent instead of its fixed width. Ignored by `circle`. Default true — pass false to use the fixed width */
  shouldFitContainer?: boolean;
}

const shimmerStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(135deg, var(--gb-color-shimmer-gray) 40%, color-mix(in srgb, var(--gb-color-shimmer-gray) 50%, transparent) 50%, var(--gb-color-shimmer-gray) 60%)",
  backgroundSize: "200% 100%",
};

export function Skeleton({
  type = "rectangle",
  shouldFitContainer = true,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      data-fit-container={shouldFitContainer || undefined}
      className={
        className
          ? `${styles.root} ${styles[type]} ${className}`
          : `${styles.root} ${styles[type]}`
      }
      style={{ ...shimmerStyle, ...style }}
      {...props}
    />
  );
}
