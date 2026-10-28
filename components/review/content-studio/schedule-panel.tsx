"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/sprite-icon";

import { STATUS_LABELS, type Post, type ScheduleSlot } from "./data";

export interface SchedulePanelProps {
  slots: ScheduleSlot[];
  posts: Post[];
  activeSlotId: string | null;
  onSlotClick: (slot: ScheduleSlot) => void;
  onScheduleAllDraft: () => void;
  onCreateMore: () => void;
  onOpenRepeat: () => void;
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
  onOpenRepeat,
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
          icon={<Icon id="rotate-ccw-icon" />}
          aria-label="Repeat"
          onClick={onOpenRepeat}
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
            {dayLabel}
          </p>
          {daySlots.map((slot) => {
            const post = slot.postId ? postById.get(slot.postId) : null;
            const status = post?.status ?? "no-content";
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSlotClick(slot)}
                className={cn(
                  "flex w-full items-center justify-between rounded-[var(--gb-radius-scale-md)]",
                  "px-[var(--gb-spacing-3)] py-[var(--gb-spacing-2)] text-left",
                  "border-[length:var(--gb-border-1)] border-solid",
                  slot.id === activeSlotId
                    ? "border-[var(--gb-border-selected)]"
                    : "border-transparent",
                )}
              >
                <span className="text-sm-regular text-[var(--gb-text-default)]">
                  {slot.date} — {slot.time}
                </span>
                <Badge
                  variant={status === "no-content" ? "destructive" : "outline"}
                  size="20"
                >
                  {STATUS_LABELS[status]}
                </Badge>
              </button>
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
