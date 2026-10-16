"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import {
  Calendar,
  type CalendarEventType,
} from "@/components/ui/calendar/calendar";

import styles from "./date-select.module.css";

/** Figma `Date select` — a single-date picker. See docs/components/date-select.md for the spec. */
export interface DateSelectProps {
  /** Ref attached to the trigger `<button>` */
  ref?: React.Ref<HTMLButtonElement>;
  /** Label text. Figma default is "Date to post" */
  label?: string;
  /** Selected date when used as a controlled component */
  value?: Date;
  /** Initial date when used as an uncontrolled component */
  defaultValue?: Date;
  /** Called when a date is picked. The popover closes immediately on selection */
  onValueChange?: (date: Date) => void;
  /** Text shown on the trigger when there's no value */
  placeholder?: string;
  /** Disables the trigger (the popover won't open either) */
  disabled?: boolean;
  /** Merged onto the root `<div>` */
  className?: string;
  /** Dates before this one can't be selected (passed to the calendar) */
  minDate?: Date;
  /** Dates after this one can't be selected (passed to the calendar) */
  maxDate?: Date;
  /** List of individually disallowed dates (passed to the calendar) */
  disabledDates?: Date[];
  /** Event markers per date. Keys are `yyyy-MM-dd` (passed to the calendar) */
  events?: Record<string, CalendarEventType>;
}

function formatDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}.${dd}.${date.getFullYear()}`;
}

export function DateSelect({
  ref,
  label = "Date to post",
  value,
  defaultValue,
  onValueChange,
  placeholder = "MM.DD.YYYY",
  disabled = false,
  className,
  minDate,
  maxDate,
  disabledDates,
  events,
}: DateSelectProps) {
  const [open, setOpen] = React.useState(false);
  const generatedId = React.useId();

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;
  const hasValue = !!currentValue;

  const handleOpenChange = (next: boolean) => {
    if (disabled) return;
    setOpen(next);
  };

  return (
    <div className={className ? `${styles.root} ${className}` : styles.root}>
      {label && (
        <label htmlFor={generatedId} className={styles.label}>
          {label}
        </label>
      )}
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <PopoverPrimitive.Trigger asChild>
          <button
            ref={ref}
            id={generatedId}
            type="button"
            disabled={disabled}
            data-has-value={hasValue || undefined}
            className={styles.trigger}
          >
            <span className={styles.triggerLabel}>
              {hasValue ? formatDate(currentValue) : placeholder}
            </span>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            className={`dark ${styles.popoverContent}`}
          >
            <Calendar
              mode="single"
              value={currentValue}
              onValueChange={(date) => {
                if (!isControlled) setUncontrolledValue(date);
                onValueChange?.(date);
                setOpen(false);
              }}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              events={events}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}
