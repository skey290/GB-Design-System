"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Plus } from "lucide-react";

import { DropdownList } from "@/components/ui/dropdown-list";
import type { DropdownListOption as SelectOption } from "@/components/ui/dropdown-list";

import styles from "./select.module.css";

export type { SelectOption };

/** The 7 valid `Type` × `Style` combinations. */
export type SelectVariant =
  "primary" | "reverse" | "mute" | "ghost" | "icon" | "side" | "side-reverse";

export interface SelectProps {
  /** Ref to attach to the trigger `<button>` */
  ref?: React.Ref<HTMLButtonElement>;
  /** Trigger shape */
  variant?: SelectVariant;
  /** List of options to show in the dropdown */
  options: SelectOption[];
  /** Selected value when used as a controlled component */
  value?: string;
  /** Initial selected value when used as an uncontrolled component */
  defaultValue?: string;
  /** Called when the value changes */
  onValueChange?: (value: string) => void;
  /** Text to show on the trigger when no value is selected */
  placeholder?: string;
  /** Figma only defines disabled for `primary`/`icon` */
  disabled?: boolean;
  /** Merged into the trigger `<button>` */
  className?: string;
}

const SIDE_VARIANTS: readonly SelectVariant[] = ["side", "side-reverse"];

const DROPDOWN_OFFSET = 8;
const SIDE_DROPDOWN_OFFSET = 5;
const SIDE_DROPDOWN_ALIGN_OFFSET = -8;

export function Select({
  ref,
  variant = "primary",
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select...",
  disabled,
  className,
}: SelectProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;

  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const generatedId = React.useId();

  const selectedOption = options.find(
    (option) => option.value === currentValue,
  );
  const isIconOnly = variant === "icon";
  const isSide = SIDE_VARIANTS.includes(variant);
  const isSideReverse = variant === "side-reverse";

  const triggerLabel =
    selectedOption?.code ?? selectedOption?.label ?? placeholder;

  const listboxId = `${generatedId}-listbox`;
  const getOptionId = (optionValue: string) =>
    `${generatedId}-option-${optionValue}`;

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;
    setOpen(nextOpen);
    if (nextOpen) {
      const selectedIndex = options.findIndex(
        (option) => option.value === currentValue,
      );
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  };

  const commitSelection = (option: SelectOption) => {
    if (option.disabled) return;
    if (!isControlled) setUncontrolledValue(option.value);
    onValueChange?.(option.value);
    setOpen(false);
  };

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (disabled || open) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      handleOpenChange(true);
    }
  };

  const handleContentKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = options[highlightedIndex];
      if (option) commitSelection(option);
    }
  };

  const popoverSide = isSideReverse ? "left" : isSide ? "right" : "bottom";

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          disabled={disabled}
          data-variant={variant}
          data-placeholder={selectedOption ? undefined : true}
          onKeyDown={handleTriggerKeyDown}
          className={className ? `${styles.root} ${className}` : styles.root}
        >
          {isIconOnly ? (
            <Plus aria-hidden="true" className={styles.icon} />
          ) : (
            <>
              <span className={styles.truncate}>{triggerLabel}</span>
              <SelectChevron
                isOpen={open}
                isSide={isSide}
                isSideReverse={isSideReverse}
              />
            </>
          )}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side={popoverSide}
          align="start"
          sideOffset={isSide ? SIDE_DROPDOWN_OFFSET : DROPDOWN_OFFSET}
          alignOffset={isSide ? SIDE_DROPDOWN_ALIGN_OFFSET : 0}
          onKeyDown={handleContentKeyDown}
          className={styles.content}
        >
          <DropdownList
            options={options}
            value={value}
            highlightedIndex={highlightedIndex}
            onHighlightChange={setHighlightedIndex}
            onCommit={commitSelection}
            listboxId={listboxId}
            getOptionId={getOptionId}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

function SelectChevron({
  isOpen,
  isSide,
  isSideReverse,
}: {
  isOpen: boolean;
  isSide: boolean;
  isSideReverse: boolean;
}) {
  if (isSide) {
    const PointsAway = isSideReverse ? ChevronLeft : ChevronRight;
    const PointsBack = isSideReverse ? ChevronRight : ChevronLeft;
    const Icon = isOpen ? PointsBack : PointsAway;
    return <Icon aria-hidden="true" className={styles.icon} />;
  }

  const Icon = isOpen ? ChevronUp : ChevronDown;
  return <Icon aria-hidden="true" className={styles.icon} />;
}
