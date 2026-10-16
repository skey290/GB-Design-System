import * as React from "react";

import { ProgressBar } from "@/components/ui/progress-bar";

import styles from "./progress.module.css";

export interface ProgressProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Current progress value */
  value: number;
  /** Minimum of the progress value */
  min?: number;
  /** Maximum of the progress value. Switches to the completed label once reached */
  max?: number;
  /** Text to show above the bar while in progress */
  label?: string;
  /** Text to show above the bar once completed */
  completedLabel?: string;
  /** Accessibility label passed to the progress bar */
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
      className={className ? `${styles.root} ${className}` : styles.root}
      {...props}
    >
      <span data-slot="progress-label" className={styles.label}>
        {isCompleted ? completedLabel : label}
      </span>
      <ProgressBar value={value} min={min} max={max} aria-label={ariaLabel} />
    </div>
  );
}
