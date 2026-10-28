"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Select, type SelectOption } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

import styles from "./compass-toolbar.module.css";

/**
 * Toolbar combo that appears next to the sidebar in the "Compass Page Component"
 * mockup instance on the Compass page of the Figma UXUI file (node-id 8125:11938 —
 * there is no separate master component; it only exists as a nested instance
 * inside the instance). It's composed of two instances: a "toggle select"
 * (`Home`/`Analysis` or `Analysis`/`Content`) + a "select" (`variant="mute"`).
 *
 * The segmented toggle on top reuses `Toggle` (`type="text"`) as-is, and the
 * dropdown below reuses `Select` (`variant="mute"`) as-is.
 *
 * `selectOptions` (changed to optional): across all 4 Analysis-mode screenshots
 * (growth-potential/reach/engagement/ranking, node 8052:33420, etc.), the
 * bottom "All 'Self'" Select was absent — it's only used in Home mode. Made it
 * optional so that Select itself doesn't render when it isn't passed (existing
 * Home-mode call sites remain backward compatible).
 */
export interface CompassToolbarToggleOption {
  value: string;
  label: string;
}

export interface CompassToolbarProps {
  /** The two options for the segmented toggle (e.g. Home/Analysis or Analysis/Content) */
  toggleOptions: readonly [
    CompassToolbarToggleOption,
    CompassToolbarToggleOption,
  ];
  toggleValue: string;
  onToggleValueChange?: (value: string) => void;
  /**
   * List of options passed to the bottom `Select` (`variant="mute"`). If not
   * passed, Select itself doesn't render (per Figma Analysis-mode measurements).
   */
  selectOptions?: SelectOption[];
  selectValue?: string;
  onSelectValueChange?: (value: string) => void;
  className?: string;
}

export function CompassToolbar({
  toggleOptions,
  toggleValue,
  onToggleValueChange,
  selectOptions,
  selectValue,
  onSelectValueChange,
  className,
}: CompassToolbarProps) {
  return (
    <div className={cn("dark", styles.root, className)}>
      <Toggle
        type="text"
        selectionMode="single"
        items={toggleOptions.map((option) => ({
          text: option.label,
          pressed: option.value === toggleValue,
          onPressedChange: () => onToggleValueChange?.(option.value),
        }))}
      />
      {selectOptions && (
        <Select
          variant="mute"
          options={selectOptions}
          value={selectValue}
          onValueChange={onSelectValueChange}
        />
      )}
    </div>
  );
}
