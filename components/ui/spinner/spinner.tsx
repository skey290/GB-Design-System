import * as React from "react";

import { Icon } from "@/lib/sprite-icon";

import styles from "./spinner.module.css";

export type SpinnerType = "outline" | "reversed" | "primary";

export interface SpinnerProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  /** Figma `Type` variant */
  type?: SpinnerType;
  /** Label text shown on the badge */
  label?: string;
}

export function Spinner({
  className,
  type = "outline",
  label = "Processing",
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={
        className
          ? `${styles.root} ${styles[type]} ${className}`
          : `${styles.root} ${styles[type]}`
      }
      {...props}
    >
      <Icon id="spinner-icon" className={styles.icon} />
      {label}
    </span>
  );
}
