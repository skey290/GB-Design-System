import * as React from "react";
import { LoaderCircle } from "lucide-react";

import styles from "./spinner.module.css";

export type SpinnerVariant = "outline" | "reversed" | "primary";

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Figma `Style` variant */
  variant?: SpinnerVariant;
  /** Label text shown on the badge */
  label?: string;
}

export function Spinner({
  className,
  variant = "outline",
  label = "Processing",
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={
        className
          ? `${styles.root} ${styles[variant]} ${className}`
          : `${styles.root} ${styles[variant]}`
      }
      {...props}
    >
      <LoaderCircle aria-hidden="true" className={styles.icon} />
      {label}
    </span>
  );
}
