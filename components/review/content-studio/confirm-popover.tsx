"use client";

import type * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { ButtonGroup } from "@/components/ui/button-group";

export interface ConfirmPopoverProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
}

/**
 * "Move to Archive?" / "Restore" / "영구 삭제" 확인 다이얼로그 — 카드 위에
 * 바로 뜨는 형태라 전체화면 Dialog가 아니라 Popover로 앵커링한다
 * (`docs/GB_Content_Studio.md` 3부·4부·12부·13부 공용).
 */
export function ConfirmPopover({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  open,
  onOpenChange,
  onConfirm,
}: ConfirmPopoverProps) {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="bottom"
          align="center"
          sideOffset={8}
          className={cn(
            "dark z-50 flex w-[360px] flex-col gap-[var(--gb-spacing-4)]",
            "rounded-[var(--gb-radius-scale-lg)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtle)]",
            "bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-4)] shadow-[var(--gb-shadow-lg)]",
          )}
        >
          <div className="flex flex-col gap-[var(--gb-spacing-1)]">
            <p className="text-sm-semi-bold text-[var(--gb-text-default)]">
              {title}
            </p>
            <p className="text-xs-regular text-[var(--gb-text-subtle)]">
              {description}
            </p>
          </div>
          <ButtonGroup
            type="confirm"
            shouldFitContainer
            primaryLabel={confirmLabel}
            onSecondaryClick={() => onOpenChange?.(false)}
            onPrimaryClick={() => {
              onConfirm();
              onOpenChange?.(false);
            }}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
