"use client";

import * as React from "react";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  validatePhoneNumberLength,
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

/** Why the keystroke was rejected (Figma `Status=error`) — no country picked
 * yet, too many digits for the selected country, or a non-numeric character. */
type PhoneValidationField = "noCountry" | "digitLimit" | "nonNumeric";

/** Kept to one line at the component's 320px width — see input-phone.module.css `.warning`. */
const PHONE_VALIDATION_ERROR_MESSAGES: Record<PhoneValidationField, string> = {
  noCountry: "Select a country first.",
  digitLimit: "Too many digits for this country.",
  nonNumeric: "Numbers only.",
};

/** Duration of one shake playback (matches the `shake` keyframe in
 * `app/globals.css`), and how long to wait before auto-clearing the error
 * border/message if the user doesn't type anything else afterward. */
const SHAKE_ANIMATION_MS = 400;
const VALIDATION_ERROR_AUTO_DISMISS_MS = 2000;
const SHAKE_ANIMATION_CLASS = "animate-[shake_0.4s_ease-in-out]";

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
  const phoneInputRef = React.useRef<HTMLInputElement>(null);
  const shakeTimeoutRef = React.useRef<number | undefined>(undefined);
  const dismissTimeoutRef = React.useRef<number | undefined>(undefined);
  const [validationField, setValidationField] =
    React.useState<PhoneValidationField | null>(null);

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

  const clearValidationError = () => {
    if (dismissTimeoutRef.current !== undefined) {
      window.clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = undefined;
    }
    setValidationField(null);
  };

  const triggerShake = () => {
    const input = phoneInputRef.current;
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

  const rejectInput = (field: PhoneValidationField) => {
    setValidationField(field);
    triggerShake();
    if (dismissTimeoutRef.current !== undefined) {
      window.clearTimeout(dismissTimeoutRef.current);
    }
    dismissTimeoutRef.current = window.setTimeout(() => {
      clearValidationError();
    }, VALIDATION_ERROR_AUTO_DISMISS_MS);
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

  const handleValueChange = (next: string) => {
    const isAddingCharacter = next.length > currentValue.length;

    if (isAddingCharacter && !currentCountryCode) {
      rejectInput("noCountry");
      return;
    }

    // Counting digits vs. non-digits (rather than scanning for letters only)
    // catches every disallowed character — symbols, whitespace, non-Latin
    // text — without flagging the punctuation `AsYouType` itself inserts.
    const nextDigits = next.replace(/\D/g, "");
    const prevNonDigitCount =
      currentValue.length - currentValue.replace(/\D/g, "").length;
    const nextNonDigitCount = next.length - nextDigits.length;
    if (nextNonDigitCount > prevNonDigitCount) {
      rejectInput("nonNumeric");
      return;
    }

    if (currentCountryCode && nextDigits.length > 0) {
      const lengthResult = validatePhoneNumberLength(
        nextDigits,
        currentCountryCode.toUpperCase() as CountryCode,
      );
      if (lengthResult === "TOO_LONG") {
        rejectInput("digitLimit");
        return;
      }
    }

    if (validationField) {
      clearValidationError();
    }

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
      <div className={styles.fieldGroup}>
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
            ref={phoneInputRef}
            id={inputId}
            inputType="tel"
            value={currentValue}
            disabled={disabled}
            placeholder={placeholder}
            isError={!!validationField}
            onValueChange={handleValueChange}
            onBlur={() => clearValidationError()}
            className={styles.phoneField}
          />
        </div>
        {validationField ? (
          <p className={styles.warning}>
            {PHONE_VALIDATION_ERROR_MESSAGES[validationField]}
          </p>
        ) : null}
      </div>
    </div>
  );
}
