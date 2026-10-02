import * as React from "react";

import { cn } from "@/lib/utils";

export type SkeletonShape = "rect" | "text" | "circle";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Figma `Type` variant(Rect/Text/Circle)을 정규화한 prop */
  shape?: SkeletonShape;
}

// Figma "Part/Skeleton" 컴포넌트 셋의 Type별 기본 크기/radius. className으로 덮어쓸 수 있습니다.
const shapeClassName: Record<SkeletonShape, string> = {
  rect: "h-[157px] w-[226px] rounded-[var(--radius-scale-2xl)]",
  text: "h-[27px] w-[226px] rounded-[var(--radius-scale-md)]",
  circle: "size-[27px] rounded-[var(--radius-scale-full)]",
};

// Figma 색상 rgb(219,219,219)(#dbdbdb)와 정확히 일치하는 토큰이 없어, 채널당 오차 2(육안 구분
// 불가 수준)인 --color-shimmer-gray(#d9d9d9)를 근사치로 사용하기로 사용자와 확정했습니다.
// 대각선으로 스윕하는 하이라이트 밴드는 Figma의 `Progress=0/33/66` 3-프레임 정적 스냅샷을,
// 무한 반복되는 CSS 애니메이션(`app/globals.css`의 `@keyframes shimmer`)으로 재해석한 것입니다
// (사용자 확정 — `progress` prop은 노출하지 않습니다).
const shimmerStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(105deg, var(--color-shimmer-gray) 40%, color-mix(in srgb, var(--color-shimmer-gray) 50%, transparent) 50%, var(--color-shimmer-gray) 60%)",
  backgroundSize: "200% 100%",
};

export function Skeleton({
  shape = "rect",
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
