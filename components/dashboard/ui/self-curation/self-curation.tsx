"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  SelfSlot,
  type SelfSlotPersona,
} from "@/components/dashboard/ui/self-slot";

import styles from "./self-curation.module.css";

/**
 * Figma `Self curation` — a component that lays out 8 `SelfSlot`s in a
 * circular orbit with a guidance message in the center.
 * `persona-radial-chart` uses this as a base and overlays metric rings on
 * top. See `docs/persona-radial-chart-spec.md` for the full spec.
 */

export const SELF_CURATION_SLOT_COUNT = 8;

/** Orbit radius where avatar centers sit (Figma-measured ≈97, same coordinate system as persona-radial-chart) */
const AVATAR_ORBIT_RADIUS = 97;
/** In the SVG coordinate system, 3 o'clock is 0° and clockwise is positive, so starting at -90° (12 o'clock) makes the first slot exactly vertical */
const FIRST_SECTOR_START_ANGLE = -90;
const SECTOR_ANGLE = 360 / SELF_CURATION_SLOT_COUNT;

function polarToCartesian(radius: number, angleInDegrees: number) {
  const radians = (angleInDegrees * Math.PI) / 180;
  return {
    x: radius * Math.cos(radians),
    y: radius * Math.sin(radians),
  };
}

function round(value: number) {
  return Number(value.toFixed(3));
}

/** Synthetic key identifying an empty slot (no persona). Must differ per index so each slot can be highlighted individually */
export function selfCurationEmptySlotKey(index: number) {
  return `slot:${index}`;
}

export interface SelfCurationPersona {
  /** Identifier used as the React key and for determining the highlight target */
  id: string;
  /** Avatar alt text */
  name: string;
  imageSrc?: string;
  initials?: string;
}

export interface SelfCurationProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onClick"
> {
  /** `SELF_CURATION_SLOT_COUNT` (8) slots. `null` means an empty slot (Figma `style=empty`) */
  slots: (SelfCurationPersona | null)[];
  /** Id of the currently highlighted slot (`selfCurationEmptySlotKey(index)` or a persona id) */
  activeSlotId?: string | null;
  /** Guidance message shown in the center (Figma has just one line of text, no button) */
  centerMessage: string;
  /** Called with that slotId when the mouse enters a slot, and `null` when it leaves */
  onSlotHover?: (slotId: string | null) => void;
  /** Click handler for the center message */
  onCenterClick?: () => void;
}

export function SelfCuration({
  slots,
  activeSlotId,
  centerMessage,
  onSlotHover,
  onCenterClick,
  className,
  ...props
}: SelfCurationProps) {
  return (
    <div className={cn(styles.root, className)} {...props}>
      {slots.map((persona, index) => {
        const startAngle = FIRST_SECTOR_START_ANGLE + SECTOR_ANGLE * index;
        const midAngle = startAngle + SECTOR_ANGLE / 2;
        const position = polarToCartesian(AVATAR_ORBIT_RADIUS, midAngle);
        const slotId = persona ? persona.id : selfCurationEmptySlotKey(index);
        const slotPersona: SelfSlotPersona | null = persona
          ? {
              name: persona.name,
              imageSrc: persona.imageSrc,
              initials: persona.initials,
            }
          : null;

        return (
          <div
            key={slotId}
            className={styles.slotWrap}
            style={{
              left: `calc(50% + ${round(position.x)}px)`,
              top: `calc(50% + ${round(position.y)}px)`,
            }}
            onMouseEnter={() => onSlotHover?.(slotId)}
            onMouseLeave={() => onSlotHover?.(null)}
          >
            <SelfSlot
              persona={slotPersona}
              status={slotId === activeSlotId ? "active" : "default"}
            />
          </div>
        );
      })}

      {/* Center guidance message — remounts and fades in every time its content changes */}
      <p
        key={centerMessage}
        className={styles.centerMessage}
        data-clickable={Boolean(onCenterClick) || undefined}
        onClick={onCenterClick}
      >
        {centerMessage}
      </p>
    </div>
  );
}
