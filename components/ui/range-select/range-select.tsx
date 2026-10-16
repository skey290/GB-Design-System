"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Calendar,
  type CalendarEventType,
  type CalendarRangeValue,
} from "@/components/ui/calendar/calendar";

import styles from "./range-select.module.css";

/**
 * Figma `Range select` — a date-range (start~end) selection trigger + popover
 * calendar. See `docs/components/range-select.md` for the full spec.
 */
export interface RangeSelectProps {
  /** Ref attached to the trigger `<button>` */
  ref?: React.Ref<HTMLButtonElement>;
  /** Date range when used as a controlled component */
  value?: CalendarRangeValue;
  /** Initial date range when used as an uncontrolled component */
  defaultValue?: CalendarRangeValue;
  /** Called when the date range changes */
  onValueChange?: (range: CalendarRangeValue) => void;
  /** Text shown on the trigger when there's no value */
  placeholder?: string;
  /** Disables the trigger (the popover won't open either) */
  disabled?: boolean;
  /** Merged onto the trigger `<button>` */
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

function formatShortDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}/${dd}`;
}

function formatRange(value?: CalendarRangeValue): string | undefined {
  if (!value?.from) return undefined;
  if (!value.to) return formatShortDate(value.from);
  return `${formatShortDate(value.from)} - ${formatShortDate(value.to)}`;
}

export function RangeSelect({
  ref,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select date range",
  disabled = false,
  className,
  minDate,
  maxDate,
  disabledDates,
  events,
}: RangeSelectProps) {
  const [open, setOpen] = React.useState(false);

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;
  const formattedValue = formatRange(currentValue);
  const hasValue = !!formattedValue;

  const handleOpenChange = (next: boolean) => {
    if (disabled) return;
    setOpen(next);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          data-has-value={hasValue || undefined}
          className={
            className ? `${styles.trigger} ${className}` : styles.trigger
          }
        >
          <span className={styles.triggerLabel}>
            {formattedValue ?? placeholder}
          </span>
          <CalendarIcon aria-hidden="true" className={styles.icon} />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          className={`dark ${styles.popoverContent}`}
        >
          <Calendar
            mode="range"
            value={currentValue}
            onValueChange={(range) => {
              if (!isControlled) setUncontrolledValue(range);
              onValueChange?.(range);
              if (range.from && range.to) setOpen(false);
            }}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            events={events}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
