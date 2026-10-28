"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./gnb-button.module.css";

/**
 * A single GNB navigation item.
 *
 * The label always stays mounted in the DOM regardless of `type`, with only
 * its `opacity` transitioning — width changes are left entirely to the GNB
 * root's single `transition-[width]`, and the button itself hides the
 * overflowing label naturally via `overflow-hidden` (no separate grid/padding
 * animation).
 *
 * Figma has no hover state (hover/press/select are all identical to active),
 * so mouse-over shows the same style as active (`showActiveStyle`). The
 * custom text utilities in text-styles.css can't take a Tailwind `hover:`
 * variant, so this is handled via onMouseEnter/onMouseLeave state instead of CSS.
 */
export interface GnbButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "disabled"
> {
  /** Figma `Type` variant */
  type?: "icon" | "icon-with-text" | "text";
  /** Figma `Status` variant (the original's "diabled" typo is normalized to disabled). Disabled state is expressed only through this one prop — the native `disabled` prop isn't accepted separately. */
  status?: "default" | "active" | "disabled";
  /** Icon rendered in `type="icon" | "icon-with-text"` */
  icon?: LucideIcon;
  /** Label text rendered in `type="icon-with-text" | "text"` */
  label?: string;
}

export const GnbButton = React.forwardRef<HTMLButtonElement, GnbButtonProps>(
  function GnbButton(
    {
      type = "icon",
      status = "default",
      icon: Icon,
      label,
      className,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) {
    const [isHovered, setIsHovered] = React.useState(false);
    const isActive = status === "active";
    const isDisabled = status === "disabled";
    // Visual-only flag — not used for `aria-current` (actual selection state is `isActive`).
    const showActiveStyle = isActive || isHovered;
    const isTextOnly = type === "text";
    const isExpanded = type === "icon-with-text";
    const showIcon = !isTextOnly && Icon;
    const hasLabel = Boolean(label);

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-current={isActive ? "true" : undefined}
        data-type={type}
        data-has-label={hasLabel || undefined}
        data-show-active={showActiveStyle || undefined}
        onMouseEnter={(event) => {
          setIsHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setIsHovered(false);
          onMouseLeave?.(event);
        }}
        className={className ? `${styles.root} ${className}` : styles.root}
        {...props}
      >
        {showIcon ? (
          <span className={styles.iconWrap}>
            <Icon aria-hidden="true" className={styles.icon} />
          </span>
        ) : null}
        {isTextOnly ? (
          hasLabel && <span className={styles.label}>{label}</span>
        ) : hasLabel ? (
          // The label always stays mounted with only opacity transitioning —
          // the width follows the GNB root's width transition, and as the
          // button itself shrinks, overflow-hidden hides it naturally.
          <span
            aria-hidden={isExpanded ? undefined : "true"}
            className={cn(styles.label, styles.expandableLabel)}
          >
            {label}
          </span>
        ) : null}
      </button>
    );
  },
);
