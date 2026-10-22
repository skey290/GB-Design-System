"use client";

import * as React from "react";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";

import styles from "./input-phone.module.css";

const countryDisplayNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

/** Every ITU-assigned country/region, sourced from libphonenumber-js — not a hand-picked sample. */
const DEFAULT_COUNTRY_CODE_OPTIONS: SelectOption[] = getCountries()
  .map((country) => {
    const callingCode = `+${getCountryCallingCode(country)}`;
    const name = countryDisplayNames?.of(country) ?? country;
    return {
      value: country.toLowerCase(),
      label: `${name} (${callingCode})`,
      code: callingCode,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

function formatPhoneNumber(raw: string, countryCode?: string): string {
  if (!countryCode) return raw;
  try {
    return new AsYouType(countryCode.toUpperCase() as CountryCode).input(raw);
  } catch {
    return raw;
  }
}

/** Figma `Input phone` — a country-code Select + phone number field. See docs/components/input-phone.md for the spec. */
export interface InputPhoneProps {
  /** Label text shown above the field (Figma's top text) */
  label?: string;
  /** Options shown in the country-code Select (same shape as Select's SelectOption, `code` is required). Defaults to the full ITU country list from `libphonenumber-js` — pass this only to narrow it down */
  countryCodeOptions?: SelectOption[];
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
  /** Placeholder for the country search box shown above the dropdown list */
  searchPlaceholder?: string;
  /** Whether disabled (Figma `Status=disabled`) */
  disabled?: boolean;
  /** Id of the phone number input to associate with the label. Auto-generated if omitted */
  id?: string;
  /** Stretches to fill the parent instead of its fixed 320px width. Default false */
  shouldFitContainer?: boolean;
  /** Merged onto the root `<div>` */
  className?: string;
}

export function InputPhone({
  label = "Where can we reach you?",
  countryCodeOptions = DEFAULT_COUNTRY_CODE_OPTIONS,
  countryCode,
  defaultCountryCode,
  onCountryCodeChange,
  value,
  defaultValue = "",
  onValueChange,
  placeholder,
  searchPlaceholder = "Search country",
  disabled = false,
  id,
  shouldFitContainer = false,
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
    const formatted = formatPhoneNumber(next, currentCountryCode);
    if (!isValueControlled) {
      setUncontrolledValue(formatted);
    }
    onValueChange?.(formatted);
  };

  return (
    <div
      data-slot="input-phone"
      data-fit-container={shouldFitContainer || undefined}
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
          isSearchable
          searchPlaceholder={searchPlaceholder}
          className={styles.countryCode}
        />
        <Input
          id={inputId}
          inputType="tel"
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
