import * as React from "react";

import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";

export interface ProgressProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** 현재 진행값 */
  value: number;
  /** 진행값의 최솟값 */
  min?: number;
  /** 진행값의 최댓값. 이 값에 도달하면 완료 라벨로 바뀝니다 */
  max?: number;
  /** 진행 중일 때 바 위에 표시할 문구 */
  label?: string;
  /** 완료되었을 때 바 위에 표시할 문구 */
  completedLabel?: string;
  /** 진행률 바에 전달할 접근성 라벨 */
  "aria-label"?: string;
}

export function Progress({
  value,
  min = 0,
  max = 100,
  label = "Loading image..",
  completedLabel = "Completed",
  className,
  "aria-label": ariaLabel,
  ...props
}: ProgressProps) {
  const isCompleted = value >= max;

  return (
    <div
      className={cn(
        "flex w-[226px] flex-col items-start gap-[var(--gb-spacing-2)]",
        className,
      )}
      {...props}
    >
      <span
        data-slot="progress-label"
        className="text-xs-semi-bold w-full text-[var(--gb-text-subtle)]"
      >
        {isCompleted ? completedLabel : label}
      </span>
      <ProgressBar value={value} min={min} max={max} aria-label={ariaLabel} />
    </div>
  );
}
