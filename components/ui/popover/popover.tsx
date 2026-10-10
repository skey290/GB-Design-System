"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * 화살표나 트리거 앵커가 없는 화면 정중앙 확인창. 트리거를 children으로 받지
 * 않고, 부모가 `open`/`onOpenChange`로 완전히 제어합니다.
 *
 * 항상 다크로 렌더링됩니다 — Chatbox와 동일하게 Overlay+Content를 `className="dark"`
 * 래퍼로 스코프해, 기존 Button(outline/primary) 색을 오버라이드 없이 재사용합니다.
 */
interface PopoverBaseProps {
  /** 다이얼로그 열림 여부 (완전 제어형) */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 다이얼로그 제목 (text-lg-semi-bold) */
  title: string;
  /** 다이얼로그 설명 (text-sm-regular, --text-subtle) */
  description: string;
  /** 헤더 아이콘(24px 슬롯, Figma `Leading Icon`). 전달하지 않으면 슬롯이 렌더링되지 않습니다 */
  leadingIcon?: React.ReactNode;
  cancelLabel?: string;
  onCancel?: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
}

/**
 * `checkbox` 행은 Figma `Type=notification`에만 존재한다 — `warning` variant에는
 * 체크박스 레이어 자체가 없어, 타입 레벨에서 조합을 막는다.
 */
export type PopoverProps = PopoverBaseProps &
  (
    | {
        type: "notification";
        /** "Do not ask again." 행의 체크 상태. 전달하지 않으면 행 자체가 렌더링되지 않습니다 */
        checkbox?: boolean;
        checkboxLabel?: string;
        onCheckedChange?: (checked: boolean) => void;
      }
    | {
        type: "warning";
        checkbox?: never;
        checkboxLabel?: never;
        onCheckedChange?: never;
      }
  );

export function Popover({
  type,
  open,
  onOpenChange,
  title,
  description,
  leadingIcon,
  checkbox,
  checkboxLabel = "Do not ask again.",
  onCheckedChange,
  cancelLabel = "Cancel",
  onCancel,
  confirmLabel = "Confirm",
  onConfirm,
}: PopoverProps) {
  const isWarning = type === "warning";
  const showCheckboxRow = type === "notification" && checkbox !== undefined;

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <div className="dark">
          <AlertDialogPrimitive.Overlay
            className={cn(
              "fixed inset-0 z-50",
              "bg-[var(--gb-background-backdrop)] backdrop-blur-[var(--gb-backdrop-blur-md)]",
            )}
          />
          <AlertDialogPrimitive.Content
            className={cn(
              "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
              "flex w-[512px] flex-col",
              "gap-[var(--gb-spacing-4)] rounded-[var(--gb-radius-scale-lg)]",
              "border-[length:var(--gb-border-1)] border-solid",
              "bg-[var(--gb-background-default)] p-[var(--gb-spacing-6)]",
              "shadow-[var(--gb-shadow-lg)] outline-none",
              isWarning
                ? "border-[var(--gb-border-warning)]"
                : "border-[var(--gb-border-subtle)]",
            )}
          >
            <div className="flex flex-col gap-[var(--gb-spacing-2)]">
              <div className="flex items-center gap-[var(--gb-spacing-2)]">
                {leadingIcon ? (
                  <span
                    className={cn(
                      "shrink-0",
                      isWarning
                        ? "text-[var(--gb-icon-error)]"
                        : "text-[var(--gb-icon-default)]",
                    )}
                  >
                    {leadingIcon}
                  </span>
                ) : null}
                <AlertDialogPrimitive.Title
                  className={cn(
                    "text-lg-semi-bold",
                    isWarning
                      ? "text-[var(--gb-text-error)]"
                      : "text-[var(--gb-text-default)]",
                  )}
                >
                  {title}
                </AlertDialogPrimitive.Title>
              </div>
              <AlertDialogPrimitive.Description className="text-sm-regular text-[var(--gb-text-subtle)]">
                {description}
              </AlertDialogPrimitive.Description>
            </div>
            <div className="flex flex-col gap-[var(--gb-spacing-2)]">
              {showCheckboxRow && (
                <Checkbox
                  variant="mute"
                  label={checkboxLabel}
                  checked={checkbox}
                  onCheckedChange={onCheckedChange}
                />
              )}
              <div className="flex items-center justify-end gap-[var(--gb-spacing-2-5)]">
                <AlertDialogPrimitive.Cancel asChild>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                  >
                    {cancelLabel}
                  </Button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogPrimitive.Action asChild>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={onConfirm}
                  >
                    {confirmLabel}
                  </Button>
                </AlertDialogPrimitive.Action>
              </div>
            </div>
          </AlertDialogPrimitive.Content>
        </div>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
