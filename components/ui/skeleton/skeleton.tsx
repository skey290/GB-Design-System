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

// 밴드 폭을 Figma 그라데이션(stop 9%/50%/91%)만큼 넓히면 빛나는 영역이 박스보다
// 커져 "지나가는 띠"가 아니라 전체가 깜빡이는 것처럼 보인다. 각도도 shape별로
// 나누면 여러 shape이 섞인 리스트에서 빛이 서로 엇갈려 흐른다.
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
