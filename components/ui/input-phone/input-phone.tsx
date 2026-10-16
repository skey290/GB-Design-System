"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { PartInput } from "@/components/ui/part-input";
import { Select, type SelectOption } from "@/components/ui/select";

import styles from "./input-phone.module.css";

/** Figma `Input phone` — a country-code Select + phone number field. See docs/components/input-phone.md for the spec. */
export interface InputPhoneProps {
  /** Label text shown above the field (Figma's top text) */
  label?: string;
  /** Options shown in the country-code Select (same shape as Select's SelectOption, `code` is required) */
  countryCodeOptions: SelectOption[];
  /** Country-code value when used as a controlled component */
  countryCode?: string;
  /** Initial country-code value when used as an uncontrolled component */
  defaultCountryCode?: string;
  /** Called when the country code changes */
  onCountryCodeChange?: (value: string) => void;
  /** Phone number value when used as a controlled component */
  value?: string;
  /** Initial phone number value when used as an uncontrolled component */
  defaultValue?: string;
  /** Called when the phone number value changes */
  onValueChange?: (value: string) => void;
  /** Placeholder for the phone number input field */
  placeholder?: string;
  /** Whether disabled (Figma `Status=disabled`) */
  disabled?: boolean;
  /** Id of the phone number input to associate with the label. Auto-generated if omitted */
  id?: string;
  /** Merged onto the root `<div>` */
  className?: string;
}

export function InputPhone({
  label = "Where can we reach you?",
  countryCodeOptions,
  countryCode,
  defaultCountryCode,
  onCountryCodeChange,
  value,
  defaultValue = "",
  onValueChange,
  placeholder,
  disabled = false,
  id,
  className,
}: InputPhoneProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const isCountryCodeControlled = countryCode !== undefined;
  const [uncontrolledCountryCode, setUncontrolledCountryCode] =
    React.useState(defaultCountryCode);
  const currentCountryCode = isCountryCodeControlled
    ? countryCode
    : uncontrolledCountryCode;

  const isValueControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const currentValue = isValueControlled ? value : uncontrolledValue;

  const handleCountryCodeChange = (next: string) => {
    if (!isCountryCodeControlled) {
      setUncontrolledCountryCode(next);
    }
    onCountryCodeChange?.(next);
  };

  const handleValueChange = (next: string) => {
    if (!isValueControlled) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  return (
    <div
      data-slot="input-phone"
      className={className ? `${styles.root} ${className}` : styles.root}
    >
      {label ? (
        <label
          htmlFor={inputId}
          className={cn("text-sm-semi-bold", styles.label)}
        >
          {label}
        </label>
      ) : null}
      <div data-slot="input-phone-wrapper" className={styles.wrapper}>
        <Select
          variant="primary"
          options={countryCodeOptions}
          value={currentCountryCode}
          onValueChange={handleCountryCodeChange}
          disabled={disabled}
          className={styles.countryCode}
        />
        <PartInput
          id={inputId}
          showTrailingIcon={false}
          type="tel"
          value={currentValue}
          disabled={disabled}
          placeholder={placeholder}
          onValueChange={handleValueChange}
          className={styles.phoneField}
        />
      </div>
    </div>
  );
}
