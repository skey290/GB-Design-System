"use client";

import * as React from "react";

import styles from "./textarea.module.css";

/**
 * A text area with a label, character counter, and a custom resize grip.
 * See `docs/components/textarea.md` for the spec.
 */
const MIN_HEIGHT = 80;

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "defaultValue" | "onChange" | "disabled"
> {
  /** Label text shown above the field (Figma top text, e.g. "Tell me about your interest.") */
  label?: string;
  /** Value when used as a controlled component */
  value?: string;
  /** Initial value when used as an uncontrolled component */
  defaultValue?: string;
  /** Called when the value changes */
  onValueChange?: (value: string) => void;
  /**
   * Maximum input length. When set, a `{remaining} characters left`
   * counter renders automatically below the field (Figma example: "1000 characters left").
   * When omitted, no counter is rendered.
   */
  maxLength?: number;
  /** Ref to the underlying DOM `<textarea>`. Set alongside the internal ref the resize grip uses */
  ref?: React.Ref<HTMLTextAreaElement>;
}

export function Textarea({
  ref,
  label,
  value,
  defaultValue = "",
  onValueChange,
  maxLength,
  className,
  id,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // The resize grip adjusts height directly through the internal ref, so fill it alongside the external ref.
  const setTextareaRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const startResize = (event: React.PointerEvent<HTMLSpanElement>) => {
    const element = textareaRef.current;
    if (!element || event.button !== 0) return;
    event.preventDefault();

    const startY = event.clientY;
    const startHeight = element.offsetHeight;

    const handleMove = (moveEvent: PointerEvent) => {
      const next = Math.max(
        MIN_HEIGHT,
        startHeight + moveEvent.clientY - startY,
      );
      element.style.height = `${next}px`;
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  const charactersLeft =
    maxLength !== undefined ? maxLength - currentValue.length : null;

  return (
    <div className={className ? `${styles.root} ${className}` : styles.root}>
      {label ? (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      ) : null}
      <div className={styles.fieldWrapper}>
        <textarea
          ref={setTextareaRef}
          id={textareaId}
          value={currentValue}
          maxLength={maxLength}
          onChange={handleChange}
          className={styles.field}
          {...props}
        />
        <span
          data-slot="textarea-resize-handle"
          aria-hidden="true"
          onPointerDown={startResize}
          className={styles.resizeHandle}
        >
          <svg className={styles.resizeIcon}>
            <use href="/icons.svg#handle-icon" />
          </svg>
        </span>
      </div>
      {charactersLeft !== null ? (
        <span data-slot="textarea-counter" className={styles.counter}>
          {charactersLeft} characters left
        </span>
      ) : null}
    </div>
  );
}
