"use client";

import * as React from "react";

import styles from "./switch.module.css";

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type" | "role"
> {
  /** On/off state when used as a controlled component */
  checked?: boolean;
  /** Initial on/off state when used as an uncontrolled component */
  defaultChecked?: boolean;
  /** Called when the on/off state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Ref attached to the `<button>` that serves as the switch */
  ref?: React.Ref<HTMLButtonElement>;
  /** Label text shown next to the switch */
  label?: string;
  /** Whether to show the label visually. If `false`, it remains for screen readers only. */
  showLabel?: boolean;
  /** Which side of the track the label sits on */
  labelPosition?: "left" | "right";
  /** Switch size */
  size?: "default" | "small";
}

/** An on/off slider that applies immediately. */
export function Switch({
  ref,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  label = "switch",
  showLabel = true,
  labelPosition = "right",
  size = "default",
  className,
  onClick,
  ...props
}: SwitchProps) {
  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);
  const isChecked = isControlled ? checked : uncontrolledChecked;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (disabled || event.defaultPrevented) return;

    const next = !isChecked;
    if (!isControlled) {
      setUncontrolledChecked(next);
    }
    onCheckedChange?.(next);
  };

  const track = (
    <span
      data-slot="switch-track"
      data-size={size}
      data-checked={isChecked || undefined}
      data-disabled={!isChecked && disabled ? true : undefined}
      aria-hidden="true"
      className={styles.track}
    >
      <span
        data-slot="switch-thumb"
        data-size={size}
        data-checked={isChecked || undefined}
        className={styles.thumb}
      />
    </span>
  );

  const labelNode = label ? (
    <span
      data-slot="switch-label"
      className={showLabel ? styles.label : `${styles.label} ${styles.srOnly}`}
    >
      {label}
    </span>
  ) : null;

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={label ? undefined : "switch"}
      disabled={disabled}
      onClick={handleClick}
      className={className ? `${styles.root} ${className}` : styles.root}
      {...props}
    >
      {labelPosition === "left" && labelNode}
      {track}
      {labelPosition === "right" && labelNode}
    </button>
  );
}
