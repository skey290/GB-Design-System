"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input, type InputProps } from "@/components/ui/input";

import styles from "./input-search.module.css";

/** A single-line search input with a magnifying-glass icon on the left. See `docs/components/input-search.md` for the full spec. */
export interface InputSearchProps extends Omit<
  InputProps,
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
  /** Stretches to fill the parent instead of its fixed 344px width. Default false */
  shouldFitContainer?: boolean;
  /** Merged into the outer wrapper (the element with the border/shadow/focus ring) */
  className?: string;
}

export function InputSearch({
  disabled,
  shouldFitContainer = false,
  className,
  placeholder = "Search placeholder",
  ...inputProps
}: InputSearchProps) {
  return (
    <div
      data-disabled={disabled || undefined}
      data-fit-container={shouldFitContainer || undefined}
      className={className ? `${styles.root} ${className}` : styles.root}
    >
      <Search className={styles.icon} aria-hidden="true" />
      <Input
        placeholder={placeholder}
        disabled={disabled}
        isBare
        {...inputProps}
      />
    </div>
  );
}
