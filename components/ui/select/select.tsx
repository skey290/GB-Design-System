"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

import { DropdownList } from "@/components/ui/dropdown-list";
import type { DropdownListOption as SelectOption } from "@/components/ui/dropdown-list";
import { InputSearch } from "@/components/ui/input-search";
import { Icon, type IconId } from "@/lib/sprite-icon";

import styles from "./select.module.css";

export type { SelectOption };

/** The 8 valid `Type` × `Style` combinations. */
export type SelectVariant =
  | "primary"
  | "reverse"
  | "mute"
  | "ghost"
  | "icon"
  | "icon-ghost"
  | "side"
  | "side-reverse";

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
  /** Icon shown on `icon`/`icon-ghost` (Figma `icon` instance-swap), defaults to `plus-icon` */
  icon?: IconId;
  /** Shows a search box above the dropdown list that filters `options` by label. Default false */
  isSearchable?: boolean;
  /** Placeholder for the search box. Only used when `isSearchable` is true */
  searchPlaceholder?: string;
  /** Controlled open state for the dropdown (e.g. hover-driven menus). Uncontrolled (click-driven) if omitted */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** For hover-driven menus: forwarded to the trigger `<button>` */
  onTriggerMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onTriggerMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  /** For hover-driven menus: forwarded to the dropdown content, so hovering it also counts as "still open" */
  onContentMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onContentMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  /** Merged into the trigger `<button>` */
  className?: string;
  /** Sizes the dropdown panel to its widest option instead of the default fixed 210px — for callers whose option labels vary unpredictably in length. Default false. */
  shouldFitContent?: boolean;
  /** DOM node the dropdown portals into. Radix defaults to `document.body`, which escapes a `colorScheme`-scoped ancestor (e.g. a dark/light dialog) and falls back to `:root` tokens — pass the themed ancestor so the dropdown inherits the right mode. */
  container?: HTMLElement | null;
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
  icon = "plus-icon",
  isSearchable = false,
  searchPlaceholder = "Search...",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onTriggerMouseEnter,
  onTriggerMouseLeave,
  onContentMouseEnter,
  onContentMouseLeave,
  className,
  shouldFitContent = false,
  container,
}: SelectProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;

  const isOpenControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = isOpenControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (!isOpenControlled) setUncontrolledOpen(next);
    setControlledOpen?.(next);
  };
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const generatedId = React.useId();
  const contentRef = React.useRef<HTMLDivElement>(null);

  const typeaheadBufferRef = React.useRef("");
  const typeaheadTimeoutRef =
    React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => {
    return () => clearTimeout(typeaheadTimeoutRef.current);
  }, []);

  const navOptions = React.useMemo(() => {
    if (!isSearchable) return options;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [isSearchable, options, searchQuery]);

  const selectedOption = options.find(
    (option) => option.value === currentValue,
  );
  const isIconOnly = variant === "icon" || variant === "icon-ghost";
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

  // Also covers commitSelection's setOpen(false), which bypasses handleOpenChange.
  React.useEffect(() => {
    if (!open && isSearchable) setSearchQuery("");
  }, [open, isSearchable]);

  React.useEffect(() => {
    if (isSearchable) setHighlightedIndex(0);
  }, [navOptions, isSearchable]);

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
      setHighlightedIndex((prev) => Math.min(prev + 1, navOptions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = navOptions[highlightedIndex];
      if (option) commitSelection(option);
    } else if (
      !isSearchable &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      clearTimeout(typeaheadTimeoutRef.current);
      typeaheadBufferRef.current += event.key.toLowerCase();
      typeaheadTimeoutRef.current = setTimeout(() => {
        typeaheadBufferRef.current = "";
      }, 600);

      const buffer = typeaheadBufferRef.current;
      const matchIndex = options.findIndex(
        (option) =>
          !option.disabled && option.label.toLowerCase().startsWith(buffer),
      );
      if (matchIndex >= 0) setHighlightedIndex(matchIndex);
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
          onMouseEnter={onTriggerMouseEnter}
          onMouseLeave={onTriggerMouseLeave}
          className={className ? `${styles.root} ${className}` : styles.root}
        >
          {isIconOnly ? (
            <Icon id={icon} className={styles.icon} />
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
      <PopoverPrimitive.Portal container={container ?? undefined}>
        <PopoverPrimitive.Content
          ref={contentRef}
          side={popoverSide}
          align="start"
          sideOffset={isSide ? SIDE_DROPDOWN_OFFSET : DROPDOWN_OFFSET}
          alignOffset={isSide ? SIDE_DROPDOWN_ALIGN_OFFSET : 0}
          onKeyDown={handleContentKeyDown}
          onOpenAutoFocus={(event) => {
            // Keeps focus off the search input so its placeholder stays visible — see select.md.
            if (!isSearchable) return;
            event.preventDefault();
            contentRef.current?.focus();
          }}
          onMouseEnter={onContentMouseEnter}
          onMouseLeave={onContentMouseLeave}
          className={isSearchable ? styles.searchPanel : styles.content}
          data-fit-content={
            !isSearchable && shouldFitContent ? true : undefined
          }
        >
          {isSearchable ? (
            <InputSearch
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder={searchPlaceholder}
              shouldFitContainer
            />
          ) : null}
          {isSearchable ? (
            <div className={styles.listCard}>
              {navOptions.length === 0 ? (
                <p className={styles.searchEmpty}>No results found</p>
              ) : (
                <DropdownList
                  options={navOptions}
                  value={value}
                  highlightedIndex={highlightedIndex}
                  onHighlightChange={setHighlightedIndex}
                  onCommit={commitSelection}
                  listboxId={listboxId}
                  getOptionId={getOptionId}
                />
              )}
            </div>
          ) : (
            <DropdownList
              options={navOptions}
              value={value}
              highlightedIndex={highlightedIndex}
              onHighlightChange={setHighlightedIndex}
              onCommit={commitSelection}
              listboxId={listboxId}
              getOptionId={getOptionId}
            />
          )}
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
