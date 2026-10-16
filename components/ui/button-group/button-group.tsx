"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Icon, type IconId } from "@/lib/sprite-icon";

import { ButtonGroupContext } from "./context";
import styles from "./button-group.module.css";

export type ButtonGroupType =
  "skippable" | "back-or-forth" | "save" | "confirm" | "error" | "menu";

interface ButtonGroupPair {
  secondary: string;
  primary: string;
}

const BUTTON_GROUP_LABELS: Record<
  Exclude<ButtonGroupType, "menu">,
  ButtonGroupPair
> = {
  skippable: { secondary: "Later", primary: "Go Next" },
  "back-or-forth": { secondary: "Go back", primary: "Go Next" },
  save: { secondary: "Cancel", primary: "Save" },
  confirm: { secondary: "Cancel", primary: "Confirm" },
  error: { secondary: "Refresh", primary: "Back to Dashboard" },
};

export interface ButtonGroupMenuItem {
  /** Item identifier (must be unique) */
  id: string;
  /** Text to display. If omitted, renders as an icon-only item */
  label?: string;
  /** Icon id to display */
  icon?: IconId;
}

const DEFAULT_MENU_ITEMS: ButtonGroupMenuItem[] = [
  { id: "home", icon: "home-icon" },
  { id: "assets", label: "Assets" },
  { id: "compass", label: "Compass" },
  { id: "contents-studio", label: "Content Studio" },
];

export interface ButtonGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  /** Button combo kind. Only `menu` is a floating navigation pill — the rest are a 2-button row */
  type?: ButtonGroupType;
  /** Disables every button in the combo at once */
  disabled?: boolean;
  /** Fills the parent width instead of the fixed width (344px) (`menu` is unaffected) */
  shouldFitContainer?: boolean;
  /** Label for the left outline button. If omitted, uses the default label for `type` */
  secondaryLabel?: string;
  /** Label for the right primary button. If omitted, uses the default label for `type` */
  primaryLabel?: string;
  /** Click handler for the left outline button */
  onSecondaryClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Click handler for the right primary button */
  onPrimaryClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Item list to render for `type="menu"` */
  items?: ButtonGroupMenuItem[];
  /** Id of the currently active item for `type="menu"` */
  activeId?: string;
  /** Called when the active item changes for `type="menu"` */
  onActiveChange?: (id: string) => void;
}

export function ButtonGroup({
  type = "skippable",
  disabled = false,
  shouldFitContainer = false,
  secondaryLabel,
  primaryLabel,
  onSecondaryClick,
  onPrimaryClick,
  items = DEFAULT_MENU_ITEMS,
  activeId,
  onActiveChange,
  className,
  ...props
}: ButtonGroupProps) {
  if (type === "menu") {
    return (
      <ButtonGroupMenu
        items={items}
        activeId={activeId}
        onActiveChange={onActiveChange}
        disabled={disabled}
        className={className}
        {...props}
      />
    );
  }

  const labels = BUTTON_GROUP_LABELS[type];

  return (
    <ButtonGroupContext.Provider value={{ disabled }}>
      <div
        className={className ? `${styles.pair} ${className}` : styles.pair}
        data-fit-container={shouldFitContainer || undefined}
        {...props}
      >
        <Button
          variant="outline"
          className={styles.pairButton}
          onClick={onSecondaryClick}
        >
          {secondaryLabel ?? labels.secondary}
        </Button>
        <Button
          variant="primary"
          className={styles.pairButton}
          onClick={onPrimaryClick}
        >
          {primaryLabel ?? labels.primary}
        </Button>
      </div>
    </ButtonGroupContext.Provider>
  );
}

interface ButtonGroupMenuProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  items: ButtonGroupMenuItem[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
  disabled: boolean;
}

function ButtonGroupMenu({
  items,
  activeId,
  onActiveChange,
  disabled,
  className,
  ...props
}: ButtonGroupMenuProps) {
  const instanceId = React.useId();

  const focusAndActivate = (index: number) => {
    if (disabled) return;
    const item = items[index];
    if (!item) return;

    onActiveChange?.(item.id);
    document.getElementById(`${instanceId}-${item.id}`)?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const foundIndex = items.findIndex((item) => item.id === activeId);
    const currentIndex = foundIndex === -1 ? 0 : foundIndex;
    if (items.length === 0) return;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusAndActivate((currentIndex + 1) % items.length);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusAndActivate((currentIndex - 1 + items.length) % items.length);
        break;
      case "Home":
        event.preventDefault();
        focusAndActivate(0);
        break;
      case "End":
        event.preventDefault();
        focusAndActivate(items.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <ButtonGroupContext.Provider value={{ disabled }}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={className ? `${styles.menu} ${className}` : styles.menu}
        {...props}
      >
        {items.map((item, index) => {
          const isSelected = !disabled && item.id === activeId;
          const isFocusable =
            activeId === undefined ? index === 0 : item.id === activeId;

          return item.label ? (
            <Button
              key={item.id}
              variant="ghost"
              id={`${instanceId}-${item.id}`}
              role="tab"
              aria-selected={item.id === activeId}
              tabIndex={isFocusable ? 0 : -1}
              isSelected={isSelected}
              onClick={() => onActiveChange?.(item.id)}
            >
              {item.label}
            </Button>
          ) : (
            <Button
              key={item.id}
              variant="icon-rounded"
              icon={item.icon ? <Icon id={item.icon} /> : undefined}
              id={`${instanceId}-${item.id}`}
              role="tab"
              aria-selected={item.id === activeId}
              aria-label={item.id}
              tabIndex={isFocusable ? 0 : -1}
              isSelected={isSelected}
              onClick={() => onActiveChange?.(item.id)}
            />
          );
        })}
      </div>
    </ButtonGroupContext.Provider>
  );
}
