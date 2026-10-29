"use client";

import * as React from "react";
import { Expand, Goal, Shrink } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import styles from "./ProfileCard.module.css";

export type { SelectOption };

export interface ProfileCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Figma `Open` — full profile layout vs a collapsed single row. Default true */
  open?: boolean;
  /** Figma `Status=disabled` */
  disabled?: boolean;
  /** Self-profile portrait slot, shown only when `open`. Falls back to a placeholder when omitted */
  children?: React.ReactNode;
  /** Bio text shown under the portrait, `open` only */
  bio?: string;
  /** Image for the collapsed row's avatar. Falls back to the Avatar component's own icon when omitted */
  avatarSrc?: string;
  /** Alt text shared by the avatar and the portrait placeholder */
  avatarAlt?: string;
  /** Options for the job-title select trigger */
  options: SelectOption[];
  /** Select value when controlled */
  value?: string;
  /** Select initial value when uncontrolled */
  defaultValue?: string;
  /** Called when the select value changes */
  onValueChange?: (value: string) => void;
  /** Select trigger placeholder */
  placeholder?: string;
  /** Click handler for the goal icon button */
  onGoalClick?: () => void;
  /** Accessible label for the goal icon button */
  goalLabel?: string;
  /** Click handler for the shrink/expand toggle — typically flips `open` in the parent */
  onToggleOpen?: () => void;
  /** Accessible label for the shrink/expand toggle button */
  toggleLabel?: string;
}

const DEFAULT_BIO =
  "4 years in finance, 3 in data science — forecasting Finance teams trust.";

export function ProfileCard({
  className,
  open = true,
  disabled = false,
  children,
  bio = DEFAULT_BIO,
  avatarSrc,
  avatarAlt = "Profile picture",
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select...",
  onGoalClick,
  goalLabel = "Goal",
  onToggleOpen,
  toggleLabel = open ? "Collapse profile card" : "Expand profile card",
  ...props
}: ProfileCardProps) {
  const select = (
    <Select
      variant="mute"
      className={styles.trigger}
      options={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );

  const goalButton = (
    <Button
      variant="icon"
      aria-label={goalLabel}
      icon={<Goal />}
      onClick={onGoalClick}
      disabled={disabled}
    />
  );

  return (
    <div
      className={cn(styles.root, className)}
      data-open={open}
      data-disabled={disabled || undefined}
      {...props}
    >
      {open ? (
        <>
          <div className={styles.portraitRow}>
            <div className={styles.portrait}>
              {children ?? (
                <div
                  className={styles.portraitFallback}
                  role="img"
                  aria-label={avatarAlt}
                >
                  <svg
                    aria-hidden="true"
                    className={styles.portraitFallbackIcon}
                  >
                    <use href="/icons.svg#user-filled-icon" />
                  </svg>
                </div>
              )}
            </div>
            <p className={styles.bio}>{bio}</p>
          </div>
          <div className={styles.controlsRow}>
            {select}
            {goalButton}
          </div>
          <Button
            variant="icon-ghost"
            className={cn(styles.toggleButton, styles.toggleButtonFloating)}
            aria-label={toggleLabel}
            icon={<Shrink />}
            onClick={onToggleOpen}
            disabled={disabled}
          />
        </>
      ) : (
        <>
          <Avatar shape="rounded" src={avatarSrc} alt={avatarAlt} />
          <div className={styles.controlsRow}>
            {select}
            {goalButton}
            <Button
              variant="icon-ghost"
              className={styles.toggleButton}
              aria-label={toggleLabel}
              icon={<Expand />}
              onClick={onToggleOpen}
              disabled={disabled}
            />
          </div>
        </>
      )}
    </div>
  );
}
