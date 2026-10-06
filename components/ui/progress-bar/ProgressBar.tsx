import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  /** 현재 진행률 값. `min`~`max` 범위로 clamp됩니다 */
  value?: number;
  /** 최솟값 */
  min?: number;
  /** 최댓값 */
  max?: number;
  className?: string;
  /** progressbar 역할에 대한 접근성 라벨 */
  "aria-label"?: string;
}

export function ProgressBar({
  value = 0,
  min = 0,
  max = 100,
  className,
  "aria-label": ariaLabel,
}: ProgressBarProps) {
  const clampedValue = Math.min(max, Math.max(min, value));
  const percent = max === min ? 0 : ((clampedValue - min) / (max - min)) * 100;

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={ariaLabel}
      data-slot="progress-bar-track"
      className={cn(
        // 8px: 컴포넌트 자체 높이 → CLAUDE.md 규칙에 따라 --scale-8 사용
        // (Button.tsx h-[36px]와 동일 관례).
        "relative h-[8px] w-full overflow-hidden rounded-[var(--radius-scale-full)] bg-[var(--background-subtler)]",
        className,
      )}
    >
      <div
        data-slot="progress-bar-indicator"
        className="h-full rounded-[var(--radius-scale-full)] bg-[var(--background-bolder)] transition-[width]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
