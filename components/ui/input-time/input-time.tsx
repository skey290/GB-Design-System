"use client";

import * as React from "react";
import { X } from "lucide-react";

import { PartInput } from "@/components/ui/part-input";

import styles from "./input-time.module.css";

/**
 * Figma only has a `time` type, so there's no `type` prop — this is a single-purpose
 * component for the "Time to post" label + HH:MM mask input + AM/PM toggle.
 *
 * `Status` has 5 values: `default`/`active`/`filled`/`disabled`/`error`. `active` is
 * `PartInput`'s built-in `:hover`+`:focus` focus ring, and `filled` is satisfied
 * automatically once a value exists, so neither is a prop. With no value, a native
 * `placeholder` shows an example, and the empty slots of the `__:__` mask are shown
 * in a light color while focused.
 *
 * `disabled` inherits the base `PartInput`'s disabled styles, and the AM/PM
 * `PeriodToggle` branches into its own disabled-only style (the selected item loses
 * its solid fill and becomes plain text).
 *
 * The error color isn't `--gb-destructive` — it's the lighter
 * `--gb-border-warning`/`--gb-text-warning`.
 *
 * When `showDelete` (Figma property name `Delete`) is true, a delete button appears
 * at the right end of the row, as a sibling of the AM/PM toggle. Clicking it only
 * calls `onDelete`; actually removing the row is the parent's responsibility.
 * Combined with `disabled`, the icon color switches to `--gb-text-subtlest` and the
 * native `disabled` attribute blocks clicks too.
 *
 * Hour/minute range validation (hours 1–12 / minutes 0–59) works by **restricting
 * the allowed candidates as each digit is typed**, not after the full value is
 * entered.
 */
export type TimePeriod = "AM" | "PM";

const TIME_LABEL = "Time to post";
const TIME_PLACEHOLDER = "11:00";

const PERIODS: TimePeriod[] = ["AM", "PM"];

const TIME_MASK_MAX_DIGITS = 4;

function extractTimeDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, TIME_MASK_MAX_DIGITS);
}

function formatTimeMask(digits: string): string {
  const padded = digits.padEnd(TIME_MASK_MAX_DIGITS, "_");
  return `${padded.slice(0, 2)}:${padded.slice(2, 4)}`;
}

/** A colon gets inserted once the digits fill in, so this is the index in the
 * "HH:MM" string where the caret should sit after n digits are entered
 * (+1 for the colon once there are 2 or more digits). */
function caretPositionForDigitCount(digitCount: number): number {
  return digitCount + (digitCount >= 2 ? 1 : 0);
}

/** Which side is out of range — hours (1–12) or minutes (0–59) (Figma `Status=error`). */
type TimeMaskField = "hours" | "minutes";

const TIME_MASK_ERROR_MESSAGES: Record<TimeMaskField, string> = {
  hours: "Hours must be between 1 and 12.",
  minutes: "Minutes must be between 0 and 59.",
};

/** Duration of one shake playback (matches the `shake` keyframe in
 * `app/globals.css`), and how long to wait before auto-clearing the error
 * border/message if the user doesn't type anything else afterward. */
const SHAKE_ANIMATION_MS = 400;
const VALIDATION_ERROR_AUTO_DISMISS_MS = 2000;
const SHAKE_ANIMATION_CLASS = "animate-[shake_0.4s_ease-in-out]";

/** Whether `digit` is allowed at `position` (0=hour tens, 1=hour ones,
 * 2=minute tens, 3=minute ones) — only allows hours 1–12 and minutes 0–59.
 * `digitsBefore` holds the already-committed previous digits (the only one
 * actually needed here is the hour tens digit, when judging the hour ones
 * digit). */
function isDigitAllowedAtPosition(
  digitsBefore: string,
  position: number,
  digit: string,
): boolean {
  if (position === 0) return digit === "0" || digit === "1";
  if (position === 1) {
    return digitsBefore[0] === "0"
      ? digit >= "1" && digit <= "9"
      : digit >= "0" && digit <= "2";
  }
  if (position === 2) return digit >= "0" && digit <= "5";
  return true; // position 3: minute ones digit allows 0-9 fully
}

interface TimeMaskInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "id"
> {
  id: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called when an out-of-range hour/minute input is rejected and the error
   * state changes. Per the Figma structure, the error message is rendered
   * full-width below the whole row by `InputTime`, not this component, so
   * only the state is passed upward. */
  onValidationErrorChange?: (field: TimeMaskField | null) => void;
}

/**
 * HH:MM numeric mask. Since the Figma example value (`11:00`) is just static
 * text and doesn't represent real input interaction, the behavior of showing
 * empty slots as `_` and filling digits from the left was designed
 * separately. Backspace is intercepted to erase only the last filled digit
 * (otherwise it would look like it's erasing the trailing `_`/`:` while the
 * actual digit stays), and all other typing/pasting extracts just the digits
 * from the `onChange` value. Picking a middle slot with the caret to edit it
 * isn't supported — a simple model like this was judged sufficient for a
 * short 4-digit value.
 *
 * In the default (unfocused + empty) state, a native placeholder (an example
 * time) is shown instead of the `__:__` mask, and it only switches to the
 * mask on focus. Once a value has been entered, it keeps showing the mask
 * regardless of focus. The empty mask (`__:__`) for Figma `Status=active` is
 * the default text color (`--gb-text-default`), not the placeholder color —
 * only `Status=error`'s empty mask uses the lighter `--gb-text-subtle`.
 *
 * Rebuilding the whole string and replacing `value` entirely on every
 * keystroke makes the browser lose the original caret position and snap it
 * to the end of the string, so the caret is explicitly positioned with
 * `setSelectionRange` by computing "where the next digit should land" from
 * the digit count.
 */
function TimeMaskInput({
  value,
  defaultValue = "",
  onValueChange,
  onValidationErrorChange,
  disabled,
  className,
  placeholder,
  onFocus,
  onBlur,
  ...props
}: TimeMaskInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [invalidField, setInvalidField] = React.useState<TimeMaskField | null>(
    null,
  );
  const shakeTimeoutRef = React.useRef<number | undefined>(undefined);
  const dismissTimeoutRef = React.useRef<number | undefined>(undefined);
  const isControlled = value !== undefined;
  const [uncontrolledDigits, setUncontrolledDigits] = React.useState(() =>
    extractTimeDigits(defaultValue),
  );
  const digits = isControlled ? extractTimeDigits(value) : uncontrolledDigits;
  const showMask = isFocused || digits.length > 0;

  const commit = (nextDigits: string) => {
    if (!isControlled) {
      setUncontrolledDigits(nextDigits);
    }
    onValueChange?.(formatTimeMask(nextDigits));
  };

  const setValidationField = (field: TimeMaskField | null) => {
    setInvalidField(field);
    onValidationErrorChange?.(field);
  };

  const clearValidationError = () => {
    if (dismissTimeoutRef.current !== undefined) {
      window.clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = undefined;
    }
    setValidationField(null);
  };

  const triggerShake = () => {
    const input = inputRef.current;
    if (!input) return;
    if (shakeTimeoutRef.current !== undefined) {
      window.clearTimeout(shakeTimeoutRef.current);
    }
    input.classList.remove(SHAKE_ANIMATION_CLASS);
    // To replay a shake that's already running from the start, the class
    // must be removed and a reflow forced, or the browser won't restart
    // the animation.
    void input.offsetWidth;
    input.classList.add(SHAKE_ANIMATION_CLASS);
    shakeTimeoutRef.current = window.setTimeout(() => {
      input.classList.remove(SHAKE_ANIMATION_CLASS);
    }, SHAKE_ANIMATION_MS);
  };

  React.useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current !== undefined) {
        window.clearTimeout(shakeTimeoutRef.current);
      }
      if (dismissTimeoutRef.current !== undefined) {
        window.clearTimeout(dismissTimeoutRef.current);
      }
    };
  }, []);

  const handleTimeValueChange = (next: string) => {
    const incoming = extractTimeDigits(next);
    let nextDigits = digits;
    let rejectedField: TimeMaskField | null = null;

    for (let i = digits.length; i < incoming.length; i++) {
      const char = incoming[i];
      if (isDigitAllowedAtPosition(nextDigits, i, char)) {
        nextDigits += char;
      } else {
        rejectedField = i < 2 ? "hours" : "minutes";
        break;
      }
    }

    if (nextDigits !== digits) {
      commit(nextDigits);
    }

    if (rejectedField) {
      setValidationField(rejectedField);
      triggerShake();
      if (dismissTimeoutRef.current !== undefined) {
        window.clearTimeout(dismissTimeoutRef.current);
      }
      dismissTimeoutRef.current = window.setTimeout(() => {
        clearValidationError();
      }, VALIDATION_ERROR_AUTO_DISMISS_MS);
    } else if (invalidField) {
      clearValidationError();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Backspace") return;
    event.preventDefault();
    if (invalidField) {
      clearValidationError();
    }
    commit(digits.slice(0, -1));
  };

  React.useLayoutEffect(() => {
    if (!showMask) return;
    const pos = caretPositionForDigitCount(digits.length);
    inputRef.current?.setSelectionRange(pos, pos);
  }, [digits, showMask]);

  const showsSubtleEmptyMask = !disabled && digits.length === 0 && !!invalidField;

  return (
    <PartInput
      {...props}
      ref={inputRef}
      showTrailingIcon={false}
      type="text"
      inputMode="numeric"
      disabled={disabled}
      isError={!!invalidField}
      value={showMask ? formatTimeMask(digits) : ""}
      placeholder={placeholder}
      onValueChange={handleTimeValueChange}
      onKeyDown={handleKeyDown}
      onFocus={(event) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocused(false);
        clearValidationError();
        onBlur?.(event);
      }}
      style={showsSubtleEmptyMask ? { color: "var(--gb-text-subtle)" } : undefined}
      className={className}
    />
  );
}

interface PeriodToggleProps {
  value?: TimePeriod;
  defaultValue?: TimePeriod;
  onValueChange?: (period: TimePeriod) => void;
  disabled?: boolean;
  /** Merged onto the root `<div>` */
  className?: string;
}

/**
 * The AM/PM toggle inside PartInput basic.
 *
 * The outer wrapper has a 1px border (`--gb-border-default`) +
 * `--gb-background-selected` background, and the selected item has a
 * solid fill (`--gb-background-mute` + `--gb-text-static-white` +
 * `--gb-shadow-sm`).
 *
 * When `disabled`, the outer border becomes `--gb-border-overlay`, the
 * background becomes `--gb-background-disabled`, and the selected item
 * loses its fill and becomes plain `--gb-text-static-gray` text. There's
 * no divider or background for the unselected item.
 *
 * AM/PM are mutually exclusive choices, so this is implemented as an
 * actually-functioning radiogroup.
 */
function PeriodToggle({
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
}: PeriodToggleProps) {
  const instanceId = React.useId();
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState<TimePeriod>(
    defaultValue ?? "AM",
  );
  const current = isControlled ? value : uncontrolledValue;

  const selectPeriod = (period: TimePeriod) => {
    if (!isControlled) {
      setUncontrolledValue(period);
    }
    onValueChange?.(period);
    document.getElementById(`${instanceId}-${period}`)?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectPeriod(current === "AM" ? "PM" : "AM");
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="AM or PM"
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      onKeyDown={disabled ? undefined : handleKeyDown}
      className={className ? `${styles.periodGroup} ${className}` : styles.periodGroup}
    >
      {PERIODS.map((period) => {
        const selected = period === current;

        return (
          <button
            key={period}
            type="button"
            role="radio"
            id={`${instanceId}-${period}`}
            disabled={disabled}
            aria-checked={selected}
            data-selected={selected || undefined}
            tabIndex={selected ? 0 : -1}
            onClick={() => selectPeriod(period)}
            className={styles.periodButton}
          >
            {period}
          </button>
        );
      })}
    </div>
  );
}

export interface InputTimeProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "id" | "disabled"
> {
  /** Label text shown above the field (Figma example: "Time to post") */
  label?: string;
  /** Whether to show the label on screen (Figma `Title`). If `false`, it's
   * only visually hidden and its association with the input field is kept */
  showTitle?: boolean;
  /** Input value (HH:MM mask) when used as a controlled component */
  value?: string;
  /** Initial input value when used as an uncontrolled component */
  defaultValue?: string;
  /** Called when the input value changes */
  onValueChange?: (value: string) => void;
  /** AM/PM selection (controlled component) */
  period?: TimePeriod;
  /** Initial AM/PM selection (uncontrolled component) */
  defaultPeriod?: TimePeriod;
  /** Called when the AM/PM selection changes */
  onPeriodChange?: (period: TimePeriod) => void;
  /** Figma `Status=disabled` — disables the time input and AM/PM toggle
   * together */
  disabled?: boolean;
  /** Figma `Delete` (default false) — shows a circular X delete button at
   * the right end of the row. Present across every `default`/`filled`/
   * `active`/`error`/`disabled` Status combination */
  showDelete?: boolean;
  /** Called when the delete button is clicked. Actually removing/unmounting
   * the field is the caller's responsibility (this component doesn't remove
   * itself) */
  onDelete?: () => void;
  /** Id of the input field to associate with the label. Auto-generated if
   * omitted */
  id?: string;
  /** Merged onto the root `<div>` */
  className?: string;
}

export function InputTime({
  label = TIME_LABEL,
  showTitle = true,
  value,
  defaultValue = "",
  onValueChange,
  period,
  defaultPeriod,
  onPeriodChange,
  disabled,
  showDelete = false,
  onDelete,
  placeholder,
  id,
  className,
  ...props
}: InputTimeProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const [timeErrorField, setTimeErrorField] =
    React.useState<TimeMaskField | null>(null);

  return (
    <div className={className ? `${styles.root} ${className}` : styles.root}>
      <label
        htmlFor={inputId}
        className={showTitle ? styles.label : `${styles.label} ${styles.srOnly}`}
      >
        {label}
      </label>

      <div className={styles.row}>
        <TimeMaskInput
          {...props}
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          onValidationErrorChange={setTimeErrorField}
          disabled={disabled}
          placeholder={placeholder ?? TIME_PLACEHOLDER}
          className={styles.timeInput}
        />
        <PeriodToggle
          value={period}
          defaultValue={defaultPeriod}
          onValueChange={onPeriodChange}
          disabled={disabled}
        />
        {showDelete && (
          <button
            type="button"
            disabled={disabled}
            onClick={onDelete}
            aria-label="Delete"
            className={styles.deleteButton}
          >
            <X aria-hidden="true" className={styles.deleteIcon} />
          </button>
        )}
      </div>
      {timeErrorField && (
        <p className={styles.error}>
          {TIME_MASK_ERROR_MESSAGES[timeErrorField]}
        </p>
      )}
    </div>
  );
}
