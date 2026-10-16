"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";

import styles from "./checkbox.module.css";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "type"
  > {
  /** Checked state when used as a controlled component (Figma `Status=checked`) */
  checked?: boolean;
  /** Initial checked state when used as an uncontrolled component */
  defaultChecked?: boolean;
  /** Indeterminate (partially selected) state (Figma `Status=part`) */
  indeterminate?: boolean;
  /** Called when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Whether it's disabled (Figma `Status=disabled`/`disabled-checked`/`disabled-part`) */
  disabled?: boolean;
  /** Figma `Type` axis. Named `variant` because `style` collides with the native attribute */
  variant?: "default" | "mute";
  /** Label text shown next to the checkbox (required) */
  label: string;
  /** Whether to show the label on screen. If `false`, it stays screen-reader-only */
  showLabel?: boolean;
  /** Merged onto the root `<div>` */
  className?: string;
  /** Checkbox id to associate with the label. Auto-generated if omitted */
  id?: string;
}

/** A single boolean choice that can be paired with a label. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      checked,
      defaultChecked,
      indeterminate = false,
      onCheckedChange,
      disabled = false,
      variant = "default",
      label,
      showLabel = true,
      className,
      id,
      ...props
    },
    ref,
  ) {
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;

    const inputRef = React.useRef<HTMLInputElement>(null);
    // `indeterminate` only ever exists as a DOM property, never as an HTML
    // attribute, so it has to be re-applied imperatively on every render.
    React.useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    });

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={className ? `${styles.root} ${className}` : styles.root}>
        <span className={styles.control}>
          <input
            {...props}
            ref={setRefs}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={(event) => onCheckedChange?.(event.target.checked)}
            data-variant={variant}
            className={styles.input}
          />
          <Check aria-hidden="true" className={styles.checkIcon} />
          <Minus aria-hidden="true" className={styles.dashIcon} />
        </span>
        <label
          htmlFor={checkboxId}
          data-variant={variant}
          data-disabled={disabled || undefined}
          className={
            showLabel ? styles.label : `${styles.label} ${styles.srOnly}`
          }
        >
          {label}
        </label>
      </div>
    );
  },
);
