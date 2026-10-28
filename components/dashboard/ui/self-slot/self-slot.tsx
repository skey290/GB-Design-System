"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

import styles from "./self-slot.module.css";

/**
 * Figma `Part/self` (a 40×40 circular slot) — `SelfCuration` uses 8 of these
 * arranged in a circle. See `docs/persona-radial-chart-spec.md` for the full spec.
 */

export interface SelfSlotPersona {
  /** Avatar alt text */
  name: string;
  /** Avatar image URL. Falls back to initials → icon if absent */
  imageSrc?: string;
  /** Initials to show when there's no avatar image */
  initials?: string;
}

export interface SelfSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Persona to show. Becomes a "No Self" empty slot (Figma `style=empty`) if absent */
  persona?: SelfSlotPersona | null;
  /** Figma `Status` variant. `active` is a white ring highlight (a blur+dim overlay for an avatar, a filled background for an empty slot) */
  status?: "default" | "active";
}

/** Placeholder text shown on an empty slot (exactly as in the Figma original) */
const PLACEHOLDER_LABEL = "No Self";

export function SelfSlot({
  persona,
  status = "default",
  className,
  ...props
}: SelfSlotProps) {
  const isActive = status === "active";

  if (persona) {
    return (
      <div className={cn(styles.filledRoot, className)} {...props}>
        <Avatar
          variant="image"
          shape="circle"
          src={persona.imageSrc}
          initials={persona.initials}
          alt={persona.name}
          // Avatar's CSS Module fixes width/height:32px unlayered, which
          // takes priority over Tailwind's size-full (className), so it
          // must be overridden via inline style for 40px to apply
          style={{ width: 40, height: 40 }}
          className={styles.avatarImg}
          data-active={isActive || undefined}
        />
        <span
          aria-hidden="true"
          className={styles.overlay}
          data-active={isActive || undefined}
        />
        {/* The highlight ring is drawn as a separate span (last in the DOM),
            not via outline — a negative outline-offset would be hidden
            behind the avatar child filling the full 40px, invisible in Chrome */}
        <span
          aria-hidden="true"
          className={styles.ring}
          data-active={isActive || undefined}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={PLACEHOLDER_LABEL}
      className={cn(styles.emptyRoot, className)}
      data-active={isActive || undefined}
      {...props}
    >
      <span aria-hidden="true">{PLACEHOLDER_LABEL}</span>
    </div>
  );
}
