"use client";

import * as React from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CalendarRangeValue } from "@/components/ui/calendar";
import { InputTime, type TimePeriod } from "@/components/ui/input-time";
import { RangeSelect } from "@/components/ui/range-select";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import styles from "./ScheduleSettingsPanel.module.css";

/** Figma `Type` (`settings-daily`/`settings-weekly`/`settings-monthly`/`settings-custom`), without the shared `settings-` prefix. */
export type ScheduleSettingsPanelRepeatType =
  "daily" | "weekly" | "monthly" | "custom";

const REPEAT_TABS: { id: ScheduleSettingsPanelRepeatType; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "custom", label: "Custom" },
];

const WEEKDAYS: { id: string; label: string }[] = [
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
  { id: "sun", label: "S" },
];

const EVERY_UNIT_OPTIONS: SelectOption[] = [
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Months" },
];

const NUMBER_MASK_MAX_DIGITS = 2;

function extractDigits(value: string, maxDigits: number): string {
  return value.replace(/\D/g, "").slice(0, maxDigits);
}

interface NumberMaskInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  maxDigits?: number;
  "aria-label": string;
  className?: string;
}

/** Borderless "_ _" placeholder digit field, shared by the occurrence stepper, "Day of every month", and "Every" interval inputs. */
function NumberMaskInput({
  value,
  defaultValue = "",
  onValueChange,
  maxDigits = NUMBER_MASK_MAX_DIGITS,
  className,
  ...props
}: NumberMaskInputProps) {
  const isControlled = value !== undefined;
  const [uncontrolledDigits, setUncontrolledDigits] = React.useState(() =>
    extractDigits(defaultValue, maxDigits),
  );
  const digits = isControlled
    ? extractDigits(value, maxDigits)
    : uncontrolledDigits;

  const commit = (next: string) => {
    if (!isControlled) setUncontrolledDigits(next);
    onValueChange?.(next);
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      value={digits}
      placeholder="_ _"
      onChange={(event) => commit(extractDigits(event.target.value, maxDigits))}
      className={cn(styles.numberMask, className)}
    />
  );
}

/** One row under "On Each Day". The stepper's count always equals `timeSlots.length` — stepping or typing a number resizes this array directly, so the two can never drift out of sync. */
export interface ScheduleTimeSlotValue {
  time?: string;
  period?: TimePeriod;
}

function useUncontrolled<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const current = isControlled ? value : uncontrolledValue;

  const commit = (next: T) => {
    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next);
  };

  return [current, commit];
}

export interface ScheduleSettingsPanelProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue"
> {
  /** Which Repeat tab is active, when used as a controlled component. */
  repeatType?: ScheduleSettingsPanelRepeatType;
  /** Initial Repeat tab when used as an uncontrolled component. */
  defaultRepeatType?: ScheduleSettingsPanelRepeatType;
  /** Called when a Repeat tab is clicked. */
  onRepeatTypeChange?: (type: ScheduleSettingsPanelRepeatType) => void;

  /** Range select value when controlled. */
  dateRange?: CalendarRangeValue;
  /** Range select initial value when uncontrolled. */
  defaultDateRange?: CalendarRangeValue;
  /** Called when the selected date range changes. */
  onDateRangeChange?: (range: CalendarRangeValue) => void;

  /** Back-arrow button click handler, returning to the main schedule panel. */
  onBack?: () => void;

  /** Selected weekday ids for `repeatType="weekly"` ("On Every"). */
  selectedWeekdays?: string[];
  /** Initial selected weekday ids when uncontrolled. */
  defaultSelectedWeekdays?: string[];
  /** Called when a weekday pill is toggled. */
  onSelectedWeekdaysChange?: (ids: string[]) => void;

  /** Day-of-month digits for `repeatType="monthly"` ("On this date"). */
  dayOfMonth?: string;
  defaultDayOfMonth?: string;
  onDayOfMonthChange?: (value: string) => void;

  /** Interval count for `repeatType="custom"` ("Every"). */
  everyCount?: string;
  defaultEveryCount?: string;
  onEveryCountChange?: (value: string) => void;
  /** Interval unit for `repeatType="custom"`. */
  everyUnit?: string;
  defaultEveryUnit?: string;
  onEveryUnitChange?: (value: string) => void;

  /** Time slots under "On Each Day" — one `InputTime` row per entry. The stepper above them shows and controls `timeSlots.length` directly. */
  timeSlots?: ScheduleTimeSlotValue[];
  defaultTimeSlots?: ScheduleTimeSlotValue[];
  onTimeSlotsChange?: (slots: ScheduleTimeSlotValue[]) => void;

  /** Save button click handler. */
  onSave?: () => void;
}

export function ScheduleSettingsPanel({
  className,
  repeatType,
  defaultRepeatType = "daily",
  onRepeatTypeChange,
  dateRange,
  defaultDateRange,
  onDateRangeChange,
  onBack,
  selectedWeekdays,
  defaultSelectedWeekdays = [],
  onSelectedWeekdaysChange,
  dayOfMonth,
  defaultDayOfMonth = "",
  onDayOfMonthChange,
  everyCount,
  defaultEveryCount = "",
  onEveryCountChange,
  everyUnit,
  defaultEveryUnit = "days",
  onEveryUnitChange,
  timeSlots,
  defaultTimeSlots = [{}],
  onTimeSlotsChange,
  onSave,
  ...props
}: ScheduleSettingsPanelProps) {
  const [currentRepeatType, setRepeatType] = useUncontrolled(
    repeatType,
    defaultRepeatType,
    onRepeatTypeChange,
  );
  const [currentWeekdays, setWeekdays] = useUncontrolled(
    selectedWeekdays,
    defaultSelectedWeekdays,
    onSelectedWeekdaysChange,
  );
  const [currentDayOfMonth, setDayOfMonth] = useUncontrolled(
    dayOfMonth,
    defaultDayOfMonth,
    onDayOfMonthChange,
  );
  const [currentEveryCount, setEveryCount] = useUncontrolled(
    everyCount,
    defaultEveryCount,
    onEveryCountChange,
  );
  const [currentEveryUnit, setEveryUnit] = useUncontrolled(
    everyUnit,
    defaultEveryUnit,
    onEveryUnitChange,
  );
  const [currentTimeSlots, setTimeSlots] = useUncontrolled(
    timeSlots,
    defaultTimeSlots,
    onTimeSlotsChange,
  );
  const occurrencesCount = currentTimeSlots.length;

  const toggleWeekday = (id: string) => {
    setWeekdays(
      currentWeekdays.includes(id)
        ? currentWeekdays.filter((day) => day !== id)
        : [...currentWeekdays, id],
    );
  };

  // The stepper's number IS `currentTimeSlots.length` — resizing the array
  // (not a separately-tracked count) is what keeps the digits and the actual
  // time rows below from ever drifting out of sync.
  const resizeTimeSlots = (nextCount: number) => {
    const count = Math.max(0, nextCount);
    setTimeSlots(
      Array.from({ length: count }, (_, i) => currentTimeSlots[i] ?? {}),
    );
  };

  const stepOccurrences = (delta: 1 | -1) =>
    resizeTimeSlots(occurrencesCount + delta);

  const updateTimeSlot = (
    index: number,
    patch: Partial<ScheduleTimeSlotValue>,
  ) => {
    setTimeSlots(
      currentTimeSlots.map((slot, i) =>
        i === index ? { ...slot, ...patch } : slot,
      ),
    );
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(currentTimeSlots.filter((_, i) => i !== index));
  };

  return (
    <div className={cn(styles.root, className)} {...props}>
      <div className={styles.headerRow}>
        <RangeSelect
          className={styles.rangeSelect}
          value={dateRange}
          defaultValue={defaultDateRange}
          onValueChange={onDateRangeChange}
        />
        <Button
          variant="icon"
          aria-label="Back to schedule panel"
          icon={<ArrowLeft />}
          onClick={onBack}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.repeatSection}>
          <p className={styles.sectionTitle}>Repeat</p>
          <div className={styles.repeatTabs} role="tablist">
            {REPEAT_TABS.map((tab) => {
              const selected = tab.id === currentRepeatType;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  data-selected={selected || undefined}
                  onClick={() => setRepeatType(tab.id)}
                  className={styles.repeatTab}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {currentRepeatType === "weekly" && (
            <div className={styles.fieldGroup}>
              <p className={styles.fieldLabel}>On Every</p>
              <div className={styles.weekdayRow}>
                {WEEKDAYS.map((day, index) => {
                  const selected = currentWeekdays.includes(day.id);
                  return (
                    <button
                      key={`${day.id}-${index}`}
                      type="button"
                      aria-pressed={selected}
                      aria-label={day.id}
                      data-selected={selected || undefined}
                      onClick={() => toggleWeekday(day.id)}
                      className={styles.weekdayPill}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentRepeatType === "monthly" && (
            <div className={styles.fieldGroup}>
              <p className={styles.fieldLabel}>On this date</p>
              <div className={styles.inlineRow}>
                <span className={styles.inlineLabel}>Day</span>
                <NumberMaskInput
                  aria-label="Day of every month"
                  value={currentDayOfMonth}
                  onValueChange={setDayOfMonth}
                  className={styles.numberMaskSemibold}
                />
                <span className={styles.inlineLabel}>of every month</span>
              </div>
            </div>
          )}

          {currentRepeatType === "custom" && (
            <div className={styles.fieldGroup}>
              <p className={styles.fieldLabel}>Every</p>
              <div className={styles.inlineRow}>
                <NumberMaskInput
                  aria-label="Repeat interval"
                  value={currentEveryCount}
                  onValueChange={setEveryCount}
                  className={styles.numberMaskSemibold}
                />
                <Select
                  options={EVERY_UNIT_OPTIONS}
                  value={currentEveryUnit}
                  onValueChange={setEveryUnit}
                  className={styles.everyUnitSelect}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.onEachDaySection}>
          <p className={styles.sectionTitle}>On Each Day</p>

          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>
              How often would you like to post?
            </p>
            <div className={styles.stepperRow}>
              <button
                type="button"
                aria-label="Decrease occurrences per day"
                onClick={() => stepOccurrences(-1)}
                className={styles.stepperButton}
              >
                <Minus aria-hidden="true" className={styles.stepperIcon} />
              </button>
              <NumberMaskInput
                aria-label="Occurrences per day"
                value={String(occurrencesCount)}
                onValueChange={(value) => resizeTimeSlots(Number(value || 0))}
                className={styles.numberMaskSemibold}
              />
              <button
                type="button"
                aria-label="Increase occurrences per day"
                onClick={() => stepOccurrences(1)}
                className={styles.stepperButton}
              >
                <Plus aria-hidden="true" className={styles.stepperIcon} />
              </button>
              <span className={styles.inlineLabel}>time(s) a day</span>
            </div>
          </div>

          {currentTimeSlots.map((slot, index) => (
            <InputTime
              key={index}
              label={
                index === 0
                  ? "When would you like to post?"
                  : `When would you like to post? (slot ${index + 1})`
              }
              showTitle={index === 0}
              value={slot.time}
              onValueChange={(value) => updateTimeSlot(index, { time: value })}
              period={slot.period}
              onPeriodChange={(period) => updateTimeSlot(index, { period })}
              showDelete
              onDelete={() => removeTimeSlot(index)}
              shouldFitContainer
            />
          ))}
        </div>

        <Button
          variant="primary"
          className={styles.saveButton}
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
