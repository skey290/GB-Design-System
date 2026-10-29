"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/sprite-icon";
import {
  ScheduleSlot as ScheduleSlotRow,
  type ScheduleSlotType,
} from "@/components/content-studio/ui/ScheduleSlot";

import type { Post, ScheduleSlot } from "./data";

export interface SchedulePanelProps {
  slots: ScheduleSlot[];
  posts: Post[];
  activeSlotId: string | null;
  onSlotClick: (slot: ScheduleSlot) => void;
  onScheduleAllDraft: () => void;
  onCreateMore: () => void;
  onOpenSettings: () => void;
}

/**
 * 좌측 스케줄 리스트 — Today/Tomorrow/Thursday 그룹, 각 슬롯 상태 배지,
 * Schedule All Draft / Create More Post / Repeat 진입점.
 * (`docs/GB_Content_Studio.md` 1부·6부·7부·8부)
 */
export function SchedulePanel({
  slots,
  posts,
  activeSlotId,
  onSlotClick,
  onScheduleAllDraft,
  onCreateMore,
  onOpenSettings,
}: SchedulePanelProps) {
  const postById = new Map(posts.map((post) => [post.id, post]));
  const hasDraft = slots.some((slot) => {
    const post = slot.postId ? postById.get(slot.postId) : null;
    return post?.status === "draft";
  });

  const groups = slots.reduce<Record<string, ScheduleSlot[]>>((acc, slot) => {
    (acc[slot.dayLabel] ??= []).push(slot);
    return acc;
  }, {});

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col gap-[var(--gb-spacing-5)] overflow-y-auto border-r-[length:var(--gb-border-1)] border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
      <div className="flex items-center justify-between">
        <p className="text-base-bold text-[var(--gb-text-default)]">
          My Post Created
        </p>
        <Button
          variant="icon-ghost"
          icon={<Icon id="settings-2-icon" />}
          aria-label="Open schedule settings"
          onClick={onOpenSettings}
        />
      </div>

      {hasDraft && (
        <Button variant="outline" onClick={onScheduleAllDraft}>
          Schedule All Draft
        </Button>
      )}

      {Object.entries(groups).map(([dayLabel, daySlots]) => (
        <div key={dayLabel} className="flex flex-col gap-[var(--gb-spacing-2)]">
          <p className="text-sm-semi-bold text-[var(--gb-text-subtle)]">
            {dayLabel}, {daySlots[0]!.date}
          </p>
          {daySlots.map((slot) => {
            const post = slot.postId ? postById.get(slot.postId) : null;
            const type: ScheduleSlotType =
              post?.status === "no-content" || !post
                ? "no content"
                : post.status;
            return (
              <ScheduleSlotRow
                key={slot.id}
                type={type}
                time={slot.time}
                status={slot.id === activeSlotId ? "active" : "default"}
                onClick={() => onSlotClick(slot)}
              />
            );
          })}
        </div>
      ))}

      <Button
        variant="outline"
        icon={<Icon id="plus-icon" />}
        onClick={onCreateMore}
      >
        Create More Post
      </Button>
    </div>
  );
}
