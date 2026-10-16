import styles from "./progress-bar.module.css";

export interface ProgressBarProps {
  /** Current progress value. Clamped to the `min`~`max` range */
  value?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Merged into the track `<div>` */
  className?: string;
  /** Accessibility label for the progressbar role */
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
      className={className ? `${styles.track} ${className}` : styles.track}
    >
      <div
        data-slot="progress-bar-indicator"
        className={styles.indicator}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
