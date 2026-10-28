"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "@/lib/sprite-icon";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Scrollbar } from "@/components/ui/scrollbar";
import { NotiItem } from "@/components/app/noti-item";

import styles from "./noti-dropdown.module.css";

/** Dropdown panel shown when the notification bell is clicked (see docs/components/noti-dropdown.md) */
export interface NotiDropdownItem {
  id: string;
  label: string;
  /** If true, shows a 4px red dot on the right (Figma `Type=new`) and exposes it in the "Unread" tab too */
  unread?: boolean;
}

export interface NotiDropdownProps {
  items: NotiDropdownItem[];
  /** Currently selected tab (fully controlled) */
  selectedTab?: "all" | "unread";
  onSelectedTabChange?: (tab: "all" | "unread") => void;
  onSettingsClick?: () => void;
  /** Called when a notification item in the list is clicked (passes the item id) */
  onItemClick?: (id: string) => void;
  className?: string;
}
// Fixed to a height of 6 rows (see docs/components/noti-dropdown.md — the calc() spacing is required)
const LIST_VISIBLE_HEIGHT =
  "calc((var(--gb-spacing-8) * 6) + (var(--gb-spacing-2) * 5) + (var(--gb-spacing-1) * 2))";

export function NotiDropdown({
  items,
  selectedTab = "all",
  onSelectedTabChange,
  onSettingsClick,
  onItemClick,
  className,
}: NotiDropdownProps) {
  const [thumb, setThumb] = React.useState({ top: 0, height: 100 });
  const listRef = React.useRef<HTMLUListElement>(null);

  const unreadCount = items.filter((item) => item.unread).length;
  const visibleItems =
    selectedTab === "unread" ? items.filter((item) => item.unread) : items;
  const isScrollable = visibleItems.length > 6;

  const updateThumb = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const { scrollTop, scrollHeight, clientHeight } = list;
    if (scrollHeight <= clientHeight) {
      setThumb({ top: 0, height: 100 });
      return;
    }
    const heightPercent = (clientHeight / scrollHeight) * 100;
    const topPercent =
      (scrollTop / (scrollHeight - clientHeight)) * (100 - heightPercent);
    setThumb({ top: topPercent, height: heightPercent });
  }, []);

  const listCallbackRef = React.useCallback(
    (node: HTMLUListElement | null) => {
      listRef.current = node;
      if (node) updateThumb();
    },
    [updateThumb],
  );

  return (
    <div className={cn("dark", styles.root, className)}>
      <div className={styles.header}>
        <Tabs
          items={[
            { label: "All", count: items.length },
            { label: "Unread", count: unreadCount },
          ]}
          selectedIndex={selectedTab === "unread" ? 1 : 0}
          onSelectedIndexChange={(index) =>
            onSelectedTabChange?.(index === 1 ? "unread" : "all")
          }
          className={styles.tabs}
        />
        <Button
          variant="icon-ghost"
          icon={<Icon id="settings-icon" />}
          aria-label="Notification settings"
          onClick={onSettingsClick}
          className={styles.settingsButton}
        />
      </div>
      <div className={styles.listWrap}>
        <ul
          ref={listCallbackRef}
          onScroll={updateThumb}
          style={{ maxHeight: LIST_VISIBLE_HEIGHT }}
          className={styles.list}
        >
          {visibleItems.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <NotiItem
                label={item.label}
                unread={item.unread}
                onClick={() => onItemClick?.(item.id)}
              />
            </li>
          ))}
        </ul>
        {isScrollable ? (
          <Scrollbar
            thumbTop={thumb.top}
            thumbHeight={thumb.height}
            style={{ height: LIST_VISIBLE_HEIGHT }}
          />
        ) : null}
      </div>
    </div>
  );
}
