"use client";

import * as React from "react";
import { Globe, Plus } from "lucide-react";

import { Icon } from "@/lib/sprite-icon";

import styles from "./input.module.css";

export type InputType = "textfield" | "upload" | "link" | "social-connect";

const SOCIAL_CONNECT_LABEL = {
  default: "Connect with Linkedin",
  connected: "Linkedin Connected",
  error: "Fail to connect",
} as const;

/**
 * The innermost reusable base text input atom.
 * See `docs/components/input.md` for spec.
 */
export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type"
> {
  /** Figma `Type` axis. Decides the trailing icon: none / `Plus` / `Globe` */
  type?: InputType;
  /** Native `<input type>` forwarded to the DOM (e.g. `tel`, `url`). Ignored by `type="upload"` */
  inputType?: React.HTMLInputTypeAttribute;
  /** Value when used as a controlled component */
  value?: string;
  /** Initial value when used as an uncontrolled component */
  defaultValue?: string;
  /** Called when the value changes */
  onValueChange?: (value: string) => void;
  /** Ref for composite components (e.g. TimeMaskInput) that need direct access to the DOM input.
   * Since React 19, function components can receive `ref` as a plain prop without forwardRef. */
  ref?: React.Ref<HTMLInputElement>;
  /** Selected file. Only used by `type="upload"` */
  file?: File | null;
  /** Called when the file selection changes. Only used by `type="upload"` */
  onFileChange?: (file: File | null) => void;
  /** `accept` attribute for the file input. Only used by `type="upload"` */
  accept?: string;
  /** Error state (Figma `Status=error`). Only the border turns to the warning color;
   * this component does not render the error message itself — the consumer composes it. */
  isError?: boolean;
  /** Fills the outer container with no border/background/focus ring (e.g. when embedded in InputSearch). Default false */
  isBare?: boolean;
  /** Whether the social account is connected (Figma `Status=filled`). Only used by `type="social-connect"` */
  isConnected?: boolean;
  /** Called when the connect/disconnect button is clicked. Only used by `type="social-connect"` */
  onConnectClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const SELECTION_RANGE_SUPPORTED_TYPES = new Set([
  "text",
  "search",
  "url",
  "tel",
  "password",
]);

export function Input({
  ref,
  type = "textfield",
  inputType,
  value,
  defaultValue = "",
  onValueChange,
  disabled,
  className,
  onMouseDown,
  placeholder,
  id,
  file = null,
  onFileChange,
  accept,
  isError = false,
  isBare = false,
  isConnected = false,
  onConnectClick,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

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

  if (type === "social-connect") {
    const label = isError
      ? SOCIAL_CONNECT_LABEL.error
      : isConnected
        ? SOCIAL_CONNECT_LABEL.connected
        : SOCIAL_CONNECT_LABEL.default;

    return (
      <button
        type="button"
        id={inputId}
        disabled={disabled}
        onClick={onConnectClick}
        data-connected={isConnected || undefined}
        data-error={isError || undefined}
        className={
          className
            ? `${styles.socialConnect} ${className}`
            : styles.socialConnect
        }
      >
        <Icon id="linkedin-icon" className={styles.socialConnectIcon} />
        {label}
      </button>
    );
  }

  if (type === "upload") {
    return (
      <label
        htmlFor={inputId}
        data-filled={file != null}
        data-error={isError || undefined}
        className={
          className ? `${styles.uploadLabel} ${className}` : styles.uploadLabel
        }
      >
        <span className={styles.uploadLabelText}>
          {file ? file.name : placeholder}
        </span>
        <Plus aria-hidden="true" className={styles.uploadIcon} />
        <input
          {...props}
          ref={ref}
          id={inputId}
          type="file"
          accept={accept}
          disabled={disabled}
          className={styles.srOnly}
          onChange={(event) => onFileChange?.(event.target.files?.[0] ?? null)}
        />
      </label>
    );
  }

  const hasIcon = type === "link";

  const inputElement = (
    <input
      {...props}
      ref={ref}
      id={inputId}
      type={inputType}
      placeholder={placeholder}
      value={currentValue}
      disabled={disabled}
      onChange={handleChange}
      onMouseDown={handleMouseDown}
      data-with-icon={hasIcon || undefined}
      data-error={isError || undefined}
      data-bare={isBare || undefined}
      className={
        !hasIcon && className ? `${styles.root} ${className}` : styles.root
      }
    />
  );

  if (!hasIcon) {
    return inputElement;
  }

  const iconState = disabled
    ? "disabled"
    : currentValue.length > 0
      ? "filled"
      : "empty";

  return (
    <div
      className={className ? `${styles.wrapper} ${className}` : styles.wrapper}
    >
      {inputElement}
      <Globe
        aria-hidden="true"
        data-state={iconState}
        className={styles.icon}
      />
    </div>
  );
}
