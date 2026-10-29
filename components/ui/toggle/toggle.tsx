import * as React from "react";

import { Button } from "@/components/ui/button";
import { Icon, type IconId } from "@/lib/sprite-icon";

import styles from "./toggle.module.css";

export type ToggleType = "icon" | "text";
export type ToggleOrientation = "horizontal" | "vertical" | "grid";

interface ToggleItemBase {
  /** Pressed state */
  pressed?: boolean;
  /** Called when the pressed state changes */
  onPressedChange?: (pressed: boolean) => void;
  /** Secondary label shown outside the button's right edge, only when `orientation="vertical"` */
  label?: string;
}

export interface ToggleIconItem extends ToggleItemBase {
  /** Icon to render inside the button */
  icon: React.ReactNode;
  /** Required since this is an icon-only button with no visible accessible name otherwise */
  "aria-label": string;
  text?: never;
}

export interface ToggleTextItem extends ToggleItemBase {
  /** Text to render inside the button */
  text: string;
  icon?: never;
  /** If omitted, `text` becomes the accessible name */
  "aria-label"?: string;
}

export type ToggleItem = ToggleIconItem | ToggleTextItem;

export interface ToggleTrailingAction {
  /** Icon id */
  icon: IconId;
  "aria-label": string;
  onClick?: () => void;
}

export type ToggleGridItems = readonly [
  ToggleItem,
  ToggleItem,
  ToggleItem,
  ToggleItem,
];

interface ToggleBaseProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /**
   * Item content kind.
   * - `icon`: an icon chip placed inside a bordered box with dividers
   * - `text`: a floating text chip (pill/segment) on top of a track background
   */
  type?: ToggleType;
  /** Icon button detached to the group's right edge (`type="text"` + `horizontal` only) */
  trailingAction?: ToggleTrailingAction;
  /** Disables the whole group. Disabling individual items is not supported. */
  disabled?: boolean;
}

export type ToggleProps = ToggleBaseProps &
  (
    | {
        /**
         * Segment layout direction.
         * - `horizontal`: a single row
         * - `vertical`: a single column (supports `item.label`)
         */
        orientation?: "horizontal" | "vertical";
        /** Items to show in the segmented group */
        items: ToggleItem[];
      }
    | {
        /** 2×2 grid layout. Fixed to exactly 4 items since Figma only defines this one variant */
        orientation: "grid";
        items: ToggleGridItems;
      }
  );

function isIconItem(item: ToggleItem): item is ToggleIconItem {
  return item.text === undefined;
}

function ToggleItemButton({
  item,
  disabled,
  className,
}: {
  item: ToggleItem;
  disabled: boolean;
  className?: string;
}) {
  const pressed = item.pressed ?? false;

  const handleClick = () => {
    if (!pressed) item.onPressedChange?.(true);
  };

  const itemClassName = isIconItem(item) ? styles.iconItem : styles.textItem;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={pressed}
      aria-label={item["aria-label"]}
      onClick={handleClick}
      disabled={disabled}
      data-pressed={pressed || undefined}
      className={className ? `${itemClassName} ${className}` : itemClassName}
    >
      {isIconItem(item) ? (
        <span
          aria-hidden="true"
          data-slot="toggle-icon"
          className={styles.iconSlot}
        >
          {item.icon}
        </span>
      ) : (
        item.text
      )}
    </button>
  );
}

function RowDivider() {
  return (
    <span
      aria-hidden="true"
      data-slot="toggle-divider"
      className={styles.rowDivider}
    />
  );
}

function ColumnDivider() {
  return (
    <span
      aria-hidden="true"
      data-slot="toggle-divider"
      className={styles.columnDivider}
    />
  );
}

export function Toggle({
  items,
  type = "icon",
  orientation = "horizontal",
  trailingAction,
  disabled = false,
  className,
  ...props
}: ToggleProps) {
  if (type === "text") {
    const pillClassName =
      !trailingAction && className
        ? `${styles.textContainer} ${className}`
        : styles.textContainer;
    const pill = (
      <div
        role="radiogroup"
        className={pillClassName}
        data-disabled={disabled || undefined}
        {...(trailingAction ? {} : props)}
      >
        {items.map((item, index) => (
          <ToggleItemButton
            key={(item.text ?? item["aria-label"] ?? "") + index}
            item={item}
            disabled={disabled}
          />
        ))}
      </div>
    );

    if (!trailingAction) return pill;

    return (
      <div
        className={
          className
            ? `${styles.trailingWrap} ${className}`
            : styles.trailingWrap
        }
        {...props}
      >
        {pill}
        <Button
          variant="icon"
          icon={<Icon id={trailingAction.icon} />}
          aria-label={trailingAction["aria-label"]}
          onClick={trailingAction.onClick}
          disabled={disabled}
        />
      </div>
    );
  }

  if (orientation === "grid") {
    const rows: ToggleItem[][] = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }

    const gridRootClassName = [
      styles.iconContainer,
      styles.directionColumn,
      styles.iconContainerClip,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div role="radiogroup" className={gridRootClassName} {...props}>
        {rows.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {rowIndex > 0 && !disabled && <RowDivider />}
            <div className={styles.gridRow}>
              {row.map((item, colIndex) => (
                <React.Fragment key={(item["aria-label"] ?? "") + colIndex}>
                  {colIndex > 0 && !disabled && <ColumnDivider />}
                  <ToggleItemButton item={item} disabled={disabled} />
                </React.Fragment>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (orientation === "vertical") {
    const verticalRootClassName = [
      styles.iconContainer,
      styles.fitWidth,
      styles.directionColumn,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div role="radiogroup" className={verticalRootClassName} {...props}>
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          const wrapClassName =
            !isLast && !disabled
              ? `${styles.verticalItemWrap} ${styles.verticalItemDivider}`
              : styles.verticalItemWrap;

          const itemClassName = [
            isFirst && styles.roundedTop,
            isLast && styles.roundedBottom,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={(item["aria-label"] ?? "") + index}
              className={wrapClassName}
            >
              <ToggleItemButton
                item={item}
                disabled={disabled}
                className={itemClassName}
              />
              {item.label && (
                <span data-slot="toggle-label" className={styles.itemLabel}>
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  const horizontalRootClassName = [
    styles.iconContainer,
    styles.directionRow,
    styles.iconContainerClip,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div role="radiogroup" className={horizontalRootClassName} {...props}>
      {items.map((item, index) => (
        <React.Fragment key={(item["aria-label"] ?? "") + index}>
          {index > 0 && !disabled && <ColumnDivider />}
          <ToggleItemButton item={item} disabled={disabled} />
        </React.Fragment>
      ))}
    </div>
  );
}
