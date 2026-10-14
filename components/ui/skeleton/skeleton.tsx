import * as React from "react";

import { cn } from "@/lib/utils";

export type SkeletonShape = "rectangle" | "text" | "circle";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Figma `Type` variant */
  shape?: SkeletonShape;
}

const shapeClassName: Record<SkeletonShape, string> = {
  rectangle: "h-[157px] w-[226px] rounded-[var(--gb-radius-scale-2xl)]",
  text: "h-[27px] w-[226px] rounded-[var(--gb-radius-scale-md)]",
  circle: "size-[27px] rounded-[var(--gb-radius-scale-full)]",
};

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
      className={cn(
        "shrink-0 animate-[shimmer_2s_ease-in-out_infinite]",
        shapeClassName[shape],
        className,
      )}
      style={{ ...shimmerStyle, ...style }}
      {...props}
    />
  );
}
