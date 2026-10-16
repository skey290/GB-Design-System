"use client";

import * as React from "react";
import { Plus, type LucideIcon } from "lucide-react";

import styles from "./part-input.module.css";

/**
 * The innermost reusable base text input atom.
 * See `docs/components/part-input.md` for spec.
 */
export interface PartInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange"
> {
  /** Value when used as a controlled component */
  value?: string;
  /** Initial value when used as an uncontrolled component */
  defaultValue?: string;
  /** Called when the value changes */
  onValueChange?: (value: string) => void;
  /** Ref for composite components (e.g. TimeMaskInput) that need direct access to the DOM input.
   * Since React 19, function components can receive `ref` as a plain prop without forwardRef. */
  ref?: React.Ref<HTMLInputElement>;
  /** Whether to show the trailing icon (Figma `Trailing icon`, default `true`) */
  showTrailingIcon?: boolean;
  /** The trailing icon component. Defaults to lucide `Plus`, matching the Figma
   * Instance Swap property default. Only rendered when `showTrailingIcon` is true. */
  icon?: LucideIcon;
  /** Error state (Figma `Status=error`). Only the border turns to the warning color;
   * this component does not render the error message itself — the consumer composes it. */
  isError?: boolean;
  /** Fills the outer container with no border/background/focus ring (e.g. when embedded in InputSearch). Default false */
  isBare?: boolean;
}

const SELECTION_RANGE_SUPPORTED_TYPES = new Set([
  "text",
  "search",
  "url",
  "tel",
  "password",
]);

export function PartInput({
  ref,
  value,
  defaultValue = "",
  onValueChange,
  disabled,
  className,
  onMouseDown,
  showTrailingIcon = true,
  icon: Icon = Plus,
  isError = false,
  isBare = false,
  ...props
}: PartInputProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    onMouseDown?.(event);
    if (event.defaultPrevented || disabled) return;
    if (event.button !== 0 || currentValue.length > 0) return;

    const input = event.currentTarget;
    if (!SELECTION_RANGE_SUPPORTED_TYPES.has(input.type)) return;

    event.preventDefault();
    input.focus();
    input.setSelectionRange(0, 0);
  };

  const inputElement = (
    <input
      ref={ref}
      value={currentValue}
      disabled={disabled}
      onChange={handleChange}
      onMouseDown={handleMouseDown}
      data-with-icon={showTrailingIcon || undefined}
      data-error={isError || undefined}
      data-bare={isBare || undefined}
      className={
        !showTrailingIcon && className
          ? `${styles.root} ${className}`
          : styles.root
      }
      {...props}
    />
  );

  if (!showTrailingIcon) {
    return inputElement;
  }

  const iconState = disabled
    ? "disabled"
    : currentValue.length > 0
      ? "filled"
      : "empty";

  return (
    <div className={className ? `${styles.wrapper} ${className}` : styles.wrapper}>
      {inputElement}
      <Icon aria-hidden="true" data-state={iconState} className={styles.icon} />
    </div>
  );
}
