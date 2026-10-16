import * as React from "react";
import { X } from "lucide-react";

import styles from "./chips.module.css";

export type ChipsVariant = "primary" | "secondary" | "outline" | "ghost";

export interface ChipsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Label displayed on the chip */
  children: React.ReactNode;
  /** Figma `Style` — the chip's color/shape role */
  variant?: ChipsVariant;
  /** Persistent selected state (Figma has no separate hover state, so it uses the same color as :hover) */
  selected?: boolean;
  /** Whether to show the delete (X) badge in the top-right corner (Figma `Delete icon`) */
  showDeleteIcon?: boolean;
  /** Called when the delete badge is activated by click or keyboard. Does not propagate to the chip's own onClick */
  onDelete?: (event: React.SyntheticEvent) => void;
}

export function Chips({
  className,
  variant = "primary",
  selected = false,
  disabled,
  showDeleteIcon = false,
  onDelete,
  children,
  ...props
}: ChipsProps) {
  const activateDelete = (event: React.SyntheticEvent) => {
    if (disabled) return;
    event.stopPropagation();
    onDelete?.(event);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      data-variant={variant}
      data-selected={selected || undefined}
      className={className ? `${styles.root} ${className}` : styles.root}
      {...props}
    >
      {children}
      {showDeleteIcon && !disabled && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Remove"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={activateDelete}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              activateDelete(event);
            }
          }}
          className={styles.deleteBadge}
        >
          <X className={styles.deleteIcon} />
        </span>
      )}
    </button>
  );
}
