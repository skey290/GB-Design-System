"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox";

import styles from "./popover.module.css";

/**
 * A fully controlled confirmation dialog centered on screen.
 * See `docs/components/popover.md` for the spec.
 */
interface PopoverBaseProps {
  /** Whether the dialog is open (fully controlled) */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Dialog title (text-lg-semi-bold) */
  title: string;
  /** Dialog description (text-sm-regular, --text-subtle). If omitted, the
   * description line is not rendered (Figma `Description=false`) */
  description?: string;
  /** Header icon (24px slot, Figma `Leading Icon`). The slot isn't rendered if not passed */
  leadingIcon?: React.ReactNode;
  /** Whether to show the bottom area (checkbox + button row). Figma's `Button`
   * toggles a wrapper around both, so `false` also hides the checkbox */
  showButtons?: boolean;
  cancelLabel?: string;
  onCancel?: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
}

export type PopoverProps = PopoverBaseProps &
  (
    | {
        type: "notification";
        /** Checked state of the "Do not ask again." row. The row itself isn't rendered if not passed */
        checkbox?: boolean;
        checkboxLabel?: string;
        onCheckedChange?: (checked: boolean) => void;
      }
    | {
        type: "warning";
        checkbox?: never;
        checkboxLabel?: never;
        onCheckedChange?: never;
      }
  );

export function Popover({
  type,
  open,
  onOpenChange,
  title,
  description,
  leadingIcon,
  showButtons = true,
  checkbox,
  checkboxLabel = "Do not ask again.",
  onCheckedChange,
  cancelLabel = "Cancel",
  onCancel,
  confirmLabel = "Confirm",
  onConfirm,
}: PopoverProps) {
  const isWarning = type === "warning";
  const showCheckboxRow = type === "notification" && checkbox !== undefined;

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <div className="dark">
          <AlertDialogPrimitive.Overlay className={styles.overlay} />
          <AlertDialogPrimitive.Content
            className={styles.content}
            data-warning={isWarning || undefined}
            // Without a description line, break the describedby reference Radix sets up
            {...(description ? {} : { "aria-describedby": undefined })}
          >
            <div className={styles.header}>
              <div className={styles.headerRow}>
                {leadingIcon ? (
                  <span
                    className={styles.icon}
                    data-warning={isWarning || undefined}
                  >
                    {leadingIcon}
                  </span>
                ) : null}
                <AlertDialogPrimitive.Title
                  className={styles.title}
                  data-warning={isWarning || undefined}
                >
                  {title}
                </AlertDialogPrimitive.Title>
              </div>
              {description ? (
                <AlertDialogPrimitive.Description className={styles.description}>
                  {description}
                </AlertDialogPrimitive.Description>
              ) : null}
            </div>
            {showButtons && (
            <div className={styles.footer}>
              {showCheckboxRow && (
                <Checkbox
                  variant="mute"
                  label={checkboxLabel}
                  checked={checkbox}
                  onCheckedChange={onCheckedChange}
                />
              )}
              <div className={styles.actions}>
                <AlertDialogPrimitive.Cancel asChild>
                  <Button
                    variant="outline"
                    className={styles.actionButton}
                    onClick={onCancel}
                  >
                    {cancelLabel}
                  </Button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogPrimitive.Action asChild>
                  <Button
                    variant="primary"
                    className={styles.actionButton}
                    onClick={onConfirm}
                  >
                    {confirmLabel}
                  </Button>
                </AlertDialogPrimitive.Action>
              </div>
            </div>
            )}
          </AlertDialogPrimitive.Content>
        </div>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
