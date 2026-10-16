"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { X } from "lucide-react";

import styles from "./tooltip.module.css";

export type TooltipVariant = "default" | "reversed";

export interface TooltipProps {
  /** Figma `Style` — color role */
  variant?: TooltipVariant;
  /** The element that triggers the tooltip (hover/focus target) */
  children: React.ReactNode;
  /** Tooltip title. Not rendered if omitted */
  title?: React.ReactNode;
  /** Tooltip description. Not rendered if omitted */
  description?: React.ReactNode;
  /** Which side of the trigger to float on */
  side?: "top" | "right" | "bottom" | "left";
  /** Which point along the trigger to align to */
  align?: "start" | "center" | "end";
  /** Distance (px) between the trigger and the tooltip */
  sideOffset?: number;
  /** Offset (px) along the alignment axis */
  alignOffset?: number;
  /** Radix automatically flips/shifts to keep this distance (px) from the viewport edge */
  collisionPadding?:
    number | Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  /** Called when the close button is clicked. The close button only renders if this is provided */
  onClose?: () => void;
  /** Open state when used as a controlled component */
  open?: boolean;
  /** Initial open state when used as an uncontrolled component */
  defaultOpen?: boolean;
  /** Called when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Delay (ms) after the pointer enters the trigger before the tooltip opens */
  delayDuration?: number;
  /** Merged onto the tooltip body */
  className?: string;
}

export function Tooltip({
  children,
  title,
  description,
  variant,
  side = "top",
  align = "center",
  sideOffset,
  alignOffset,
  collisionPadding = 12,
  onClose,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  className,
}: TooltipProps) {
  const hasBody = Boolean(title) || Boolean(description);
  const resolvedVariant = variant ?? "default";

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            collisionPadding={collisionPadding}
            data-variant={resolvedVariant}
            className={
              className ? `${styles.content} ${className}` : styles.content
            }
          >
            {hasBody && (
              <div className={styles.body}>
                {title && <p className={styles.title}>{title}</p>}
                {description && (
                  <p className={styles.description}>{description}</p>
                )}
              </div>
            )}
            {onClose && (
              <button
                type="button"
                aria-label="Close tooltip"
                onClick={onClose}
                className={styles.closeButton}
              >
                <X aria-hidden="true" className={styles.closeIcon} />
              </button>
            )}
            <TooltipPrimitive.Arrow asChild width={10} height={10}>
              <div data-variant={resolvedVariant} className={styles.arrow} />
            </TooltipPrimitive.Arrow>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
