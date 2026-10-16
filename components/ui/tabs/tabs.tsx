import * as React from "react";

import { Badge } from "@/components/ui/badge";

import styles from "./tabs.module.css";

export interface TabItem {
  /** Label text to show on the tab */
  label: string;
  /** Count to show next to the label. No badge is rendered if omitted */
  count?: number;
  /** Whether the tab is disabled. If true, it can't be clicked and no badge is rendered even with a count (Figma "disabled" state) */
  disabled?: boolean;
}

export interface TabsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** List of tabs */
  items: TabItem[];
  /** Index of the currently selected tab */
  selectedIndex: number;
  /** Called when the selected tab changes */
  onSelectedIndexChange?: (index: number) => void;
}

export function Tabs({
  items,
  selectedIndex,
  onSelectedIndexChange,
  className,
  ...props
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={className ? `${styles.list} ${className}` : styles.list}
      {...props}
    >
      {items.map((item, index) => {
        const selected = index === selectedIndex;

        return (
          <button
            key={`${item.label}-${index}`}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={item.disabled}
            data-selected={selected}
            onClick={() => onSelectedIndexChange?.(index)}
            className={styles.tab}
          >
            <span>{item.label}</span>
            {typeof item.count === "number" && !item.disabled ? (
              <Badge variant={selected ? "default" : "outline"}>
                {item.count}
              </Badge>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
