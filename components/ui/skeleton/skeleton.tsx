import * as React from "react";

import styles from "./skeleton.module.css";

export type SkeletonShape = "rectangle" | "text" | "circle";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Figma `Type` variant */
  shape?: SkeletonShape;
}

const shimmerStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(135deg, var(--gb-color-shimmer-gray) 40%, color-mix(in srgb, var(--gb-color-shimmer-gray) 50%, transparent) 50%, var(--gb-color-shimmer-gray) 60%)",
  backgroundSize: "200% 100%",
};

export function Skeleton({
  shape = "rectangle",
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={
        className
          ? `${styles.root} ${styles[shape]} ${className}`
          : `${styles.root} ${styles[shape]}`
      }
      style={{ ...shimmerStyle, ...style }}
      {...props}
    />
  );
}
