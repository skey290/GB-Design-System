import * as React from "react";

import { cn } from "@/lib/utils";

export type SkeletonShape = "rectangle" | "text" | "circle";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Figma `Type` variant */
  shape?: SkeletonShape;
}

// Type별 치수/radius. className으로 덮어쓸 수 있습니다.
const shapeClassName: Record<SkeletonShape, string> = {
  rectangle: "h-[157px] w-[226px] rounded-[var(--gb-radius-scale-2xl)]",
  text: "h-[27px] w-[226px] rounded-[var(--gb-radius-scale-md)]",
  circle: "size-[27px] rounded-[var(--gb-radius-scale-full)]",
};

// 대각선으로 스윕하는 하이라이트 밴드는 Figma의 `Progress=0/33/66` 3-프레임 정적 스냅샷을
// 무한 반복 CSS 애니메이션(`app/globals.css`의 `@keyframes shimmer`)으로 재해석한 것이고,
// `progress` prop은 노출하지 않는다. 밴드 폭은 Figma의 넓은 그라데이션(stop 9%/50%/91%)이
// 아니라 좁은 띠로 둔다 — Figma 값을 그대로 쓰면 빛나는 영역이 박스보다 넓어져
// "지나가는 띠"가 아니라 전체가 깜빡이는 것처럼 보인다.
// 각도는 shape와 무관하게 135°로 통일한다 — 여러 shape이 섞인 리스트에서 빛이 서로
// 엇갈려 흐르지 않게 하려는 것.
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
