import * as React from "react";

import styles from "./badge.module.css";

export type BadgeVariant =
  | "default"
  | "reverse"
  | "outline"
  | "alarm"
  | "success"
  | "destructive";
export type BadgeSize = "20" | "28";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Content to display inside the badge (usually a number or short label). If omitted,
   * renders only `icon` with no label (Figma `Label=false`) */
  children?: React.ReactNode;
  /** Icon slot rendered before the label. Renders at 10×10 or 14×14 depending on `size`. */
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant = "outline",
  size = "20",
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-variant={variant}
      data-size={size}
      className={className ? `${styles.root} ${className}` : styles.root}
      {...props}
    >
      {icon && (
        <span
          className={size === "28" ? styles.iconLarge : styles.iconSmall}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
