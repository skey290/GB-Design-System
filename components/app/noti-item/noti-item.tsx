"use client";

import * as React from "react";
import { Megaphone } from "lucide-react";

import styles from "./noti-item.module.css";

/** A single list item in the notification dropdown (`NotiDropdown`) (Figma `Part/Notification`). */
export interface NotiItemProps {
  /** Notification label text */
  label: string;
  /** Figma `Type=new` — shows a 4px red dot on the right when true */
  unread?: boolean;
  onClick?: () => void;
  className?: string;
}

export function NotiItem({
  label,
  unread = false,
  onClick,
  className,
}: NotiItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className ? `${styles.root} ${className}` : styles.root}
    >
      <Megaphone aria-hidden="true" className={styles.icon} />
      <span className={styles.label}>{label}</span>
      {unread ? (
        <span
          aria-hidden="true"
          data-slot="noti-item-unread-dot"
          className={styles.unreadDot}
        />
      ) : null}
    </button>
  );
}
