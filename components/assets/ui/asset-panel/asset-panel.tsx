"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { Icon, type IconId } from "@/lib/sprite-icon";
import { Button } from "@/components/ui/button";
import {
  GoalSetting,
  Divider,
  type GoalPostingFrequency,
  type GoalSettingAction,
  type GoalTimeframe,
} from "@/components/app/goal-setting";

export interface AssetPanelSelfProfile {
  id: string;
  role: string;
  image: string;
  description: string;
  knownForNow: string;
  knownForNext: string;
  postingCount: number;
  postingFrequency: GoalPostingFrequency;
  targetedFollowersIndex: number;
  timeframe: GoalTimeframe;
  goalActions: GoalSettingAction[];
}

export interface AssetPanelProps {
  self: AssetPanelSelfProfile;
  onCreateContents: () => void;
  /** 헤더 "..." 메뉴의 "Edit Self Portrait" 선택 시 호출 */
  onEditSelfPortrait: () => void;
  /** 헤더 "..." 메뉴의 "Go to Asset Gallery" 선택 시 호출 */
  onGoToAssetGallery: () => void;
  className?: string;
}

const PANEL_MENU_ITEMS: { label: string; icon: IconId }[] = [
  { label: "Edit Self Portrait", icon: "eraser-icon" },
  { label: "Go to Asset Gallery", icon: "images-icon" },
  { label: "Edit Goal", icon: "goal-icon" },
];

/** 헤더 우측 상단 "..." 메뉴 (Figma `Detail view` 컴포넌트, node 8612:89563) */
function AssetPanelMenu({
  onEditSelfPortrait,
  onGoToAssetGallery,
  onEditGoal,
}: {
  onEditSelfPortrait: () => void;
  onGoToAssetGallery: () => void;
  onEditGoal: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="More options"
          className={cn(
            "absolute top-[-18px] right-0 flex size-[36px] shrink-0 items-center justify-center rounded-[var(--gb-radius-scale-full)] text-[var(--gb-icon-default)]",
            "hover:rounded-[var(--gb-radius-scale-lg)] hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-icon-static-white)]",
            open &&
              "rounded-[var(--gb-radius-scale-lg)] border-[length:var(--gb-border-1)] border-[var(--gb-border-static-gray)] border-solid bg-[var(--gb-background-default)] text-[var(--gb-icon-default)] shadow-[var(--gb-shadow-focus-ring)] hover:bg-[var(--gb-background-default)] hover:text-[var(--gb-icon-default)]",
          )}
        >
          <Icon id="ellipsis-icon" className="size-[16px]" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="bottom"
          align="end"
          sideOffset={8}
          onMouseLeave={() => setOpen(false)}
          className={cn(
            "dark z-50 flex w-[210px] flex-col items-start gap-[var(--gb-spacing-1)]",
            "rounded-[var(--gb-radius-scale-md)] border-[length:var(--gb-border-1)] border-[var(--gb-border-default)] border-solid",
            "bg-[var(--gb-background-surface)] p-[var(--gb-spacing-1)] shadow-[var(--gb-shadow-md)]",
          )}
        >
          {PANEL_MENU_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() =>
                handleSelect(
                  item.label === "Edit Self Portrait"
                    ? onEditSelfPortrait
                    : item.label === "Go to Asset Gallery"
                      ? onGoToAssetGallery
                      : onEditGoal,
                )
              }
              className={cn(
                "flex w-full items-center gap-[var(--gb-spacing-2)] rounded-[var(--gb-radius-scale-sm)]",
                "px-[var(--gb-spacing-2)] py-[var(--gb-spacing-2)] text-sm-regular text-[var(--gb-text-default)]",
                "hover:bg-[var(--gb-background-mute)]",
              )}
            >
              <Icon id={item.icon} className="size-[16px]" />
              {item.label}
            </button>
          ))}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

/**
 * 라이브 사이트 우측 고정 패널 — 선택된 Self의 프로필 헤더(이미지/역할/설명/"..." 메뉴) +
 * Known for Now/Next(`GoalSetting`을 헤더·Save 버튼 없이 임베드 재사용) + Create contents 버튼.
 */
export function AssetPanel({
  self,
  onCreateContents,
  onEditSelfPortrait,
  onGoToAssetGallery,
  className,
}: AssetPanelProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rootRef}
      className={cn(
        "dark z-2 flex h-full w-[500px] shrink-0 flex-col items-start gap-[var(--gb-spacing-7)] overflow-y-auto bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-9)]",
        className,
      )}
    >
      <div className="relative flex w-full items-center gap-[var(--gb-spacing-7)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={self.image}
          alt={self.role}
          className="h-[120px] w-[120px] shrink-0 rounded-[var(--gb-radius-scale-2xl)] object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--gb-spacing-1-5)]">
          <p className="text-base-bold text-[var(--gb-text-default)]">
            {self.role}
          </p>
          <p className="text-sm-medium text-[var(--gb-text-default)]">
            {self.description}
          </p>
        </div>
        <AssetPanelMenu
          onEditSelfPortrait={onEditSelfPortrait}
          onGoToAssetGallery={onGoToAssetGallery}
          onEditGoal={() =>
            rootRef.current?.scrollTo({ top: 0, behavior: "smooth" })
          }
        />
      </div>

      <Divider />

      <GoalSetting
        key={self.id}
        showHeader={false}
        showSaveButton={false}
        defaultNow={self.knownForNow}
        defaultGoal={self.knownForNext}
        goalActions={self.goalActions}
        defaultPostingCount={self.postingCount}
        defaultPostingFrequency={self.postingFrequency}
        defaultTargetedFollowersIndex={self.targetedFollowersIndex}
        defaultTimeframe={self.timeframe}
        className="w-full rounded-none border-none bg-transparent p-0 shadow-none"
      />

      <Button
        type="button"
        variant="primary"
        onClick={onCreateContents}
        className="w-full"
      >
        Create contents
      </Button>
    </div>
  );
}
