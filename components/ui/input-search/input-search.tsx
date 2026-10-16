"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { PartInput, type PartInputProps } from "@/components/ui/part-input";

import styles from "./input-search.module.css";

/** A single-line search input with a magnifying-glass icon on the left. See `docs/components/input-search.md` for the full spec. */
export interface InputSearchProps extends Omit<
  PartInputProps,
  "value" | "defaultValue" | "onValueChange" | "className"
> {
  /** Search query when used as a controlled component */
  value?: string;
  /** Initial search query when used as an uncontrolled component */
  defaultValue?: string;
  /** Called when the search query changes. Running the search is the caller's responsibility */
  onValueChange?: (value: string) => void;
  /** Disables the input */
  disabled?: boolean;
  /** Merged into the outer wrapper (the element with the border/shadow/focus ring) */
  className?: string;
}

export function InputSearch({
  disabled,
  className,
  placeholder = "Search placeholder",
  ...inputProps
}: InputSearchProps) {
  return (
    <div
      data-disabled={disabled || undefined}
      className={className ? `${styles.root} ${className}` : styles.root}
    >
      <Search className={styles.icon} aria-hidden="true" />
      <PartInput
        showTrailingIcon={false}
        placeholder={placeholder}
        disabled={disabled}
        isBare
        {...inputProps}
      />
    </div>
  );
}
