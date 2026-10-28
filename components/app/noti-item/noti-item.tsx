"use client";

import * as React from "react";
import { Megaphone } from "lucide-react";

import styles from "./noti-item.module.css";

/** 알림 드롭다운(`NotiDropdown`)의 리스트 항목 하나 (Figma `Part/Notification`). */
export interface NotiItemProps {
  /** 알림 라벨 텍스트 */
  label: string;
  /** Figma `Type=new` — true면 우측에 4px 빨간 dot 표시 */
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
