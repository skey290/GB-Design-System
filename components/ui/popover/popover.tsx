"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";

/**
 * Figma "Popover" 페이지(node-id 7269:451, 실제 레이어명은 "Alert dialog") —
 * 화살표/트리거 앵커가 없는 화면 정중앙 확인창. Figma에 트리거 요소가 없으므로
 * children으로 트리거를 받지 않고, 부모가 `open`/`onOpenChange`로 완전히 제어합니다.
 *
 * 항상 다크: `get_variable_defs` 실측 결과 이 컴포넌트가 참조하는 시맨틱 토큰
 * (`--background-default`, `--text-default`, `--background-bold`, `--text-invert`,
 * `--border-default` 등)이 전부 다크모드 값으로 렌더링됨을 스크린샷으로 확인했습니다
 * (get_design_context의 인라인 fallback 리터럴은 라이트값처럼 보이지만 실제 렌더링과
 * 다름 — Chatbox/FloatingMenu와 동일한 함정). Chatbox/FloatingMenu와 동일하게 Overlay+
 * Content를 `className="dark"` 래퍼로 스코프해, 기존 Button(outline/primary) 색을
 * 오버라이드 없이 그대로 재사용합니다.
 */
export interface PopoverProps {
  /** Figma `Type` variant: notification | warning */
  type: "notification" | "warning";
  /** 다이얼로그 열림 여부 (완전 제어형) */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 다이얼로그 제목 (text-lg-semi-bold) */
  title: string;
  /** 다이얼로그 설명 (text-sm-regular, --text-subtle) */
  description: string;
  /** 헤더 아이콘(24px 슬롯). 전달하지 않으면 Figma placeholder(circle-dashed-icon)를 사용 */
  leadingIcon?: React.ReactNode;
  /**
   * "Do not ask again." 체크박스 행의 체크 상태. Figma에는 이 행의 노출 여부를 켜고 끄는
   * 별도 boolean 컴포넌트 프로퍼티가 있고(`type="notification"`일 때만 존재), 값 자체는
   * 항상 미체크 상태로만 목업되어 있습니다. 코드에서는 이를 `checked`/`onCheckedChange`
   * 컨트롤드 페어로 노출해 실제 토글이 가능하게 하되, prop을 아예 전달하지 않으면(=
   * `undefined`) Figma의 "표시 안 함" 상태와 동일하게 행 자체를 렌더링하지 않습니다.
   * `type="warning"`에서는 Figma에 이 행이 존재하지 않아 항상 무시됩니다.
   */
  checkbox?: boolean;
  checkboxLabel?: string;
  onCheckedChange?: (checked: boolean) => void;
  cancelLabel?: string;
  onCancel?: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
}

const DEFAULT_ICON = (
  <svg className="size-[var(--spacing-6)]" aria-hidden="true">
    <use href="/icons.svg#circle-dashed-icon" />
  </svg>
);

export function Popover({
  type,
  open,
  onOpenChange,
  title,
  description,
  leadingIcon = DEFAULT_ICON,
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
              "bg-[var(--background-backdrop)] backdrop-blur-[var(--backdrop-blur-md)]",
            )}
          />
          <AlertDialogPrimitive.Content
            className={cn(
              "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
              "flex w-[calc(var(--scale-512)*1px)] flex-col",
              "gap-[var(--spacing-4)] rounded-[var(--radius-scale-lg)]",
              "border-[length:var(--border-1)] border-solid",
              "bg-[var(--background-default)] p-[var(--spacing-6)]",
              "shadow-[var(--shadow-lg)] outline-none",
              isWarning
                ? "border-[var(--border-warning)]"
                : "border-[var(--border-subtle)]",
            )}
          >
            <div className="flex flex-col gap-[var(--spacing-2)]">
              <div className="flex items-center gap-[var(--spacing-2)]">
                <span
                  className={cn(
                    "shrink-0",
                    isWarning
                      ? "text-[var(--icon-error)]"
                      : "text-[var(--icon-default)]",
                  )}
                >
                  {leadingIcon}
                </span>
                <AlertDialogPrimitive.Title
                  className={cn(
                    "text-lg-semi-bold",
                    isWarning
                      ? "text-[var(--text-error)]"
                      : "text-[var(--text-default)]",
                  )}
                >
                  {title}
                </AlertDialogPrimitive.Title>
              </div>
              <AlertDialogPrimitive.Description className="text-sm-regular text-[var(--text-subtle)]">
                {description}
              </AlertDialogPrimitive.Description>
            </div>
            <div className="flex flex-col gap-[var(--spacing-2)]">
              {showCheckboxRow && (
                <Checkbox
                  variant="muted"
                  label={checkboxLabel}
                  checked={checkbox}
                  onCheckedChange={onCheckedChange}
                />
              )}
              <div className="flex items-center justify-end gap-[var(--spacing-2-5)]">
                <AlertDialogPrimitive.Cancel asChild>
                  <Button variant="outline" className="flex-1" onClick={onCancel}>
                    {cancelLabel}
                  </Button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogPrimitive.Action asChild>
                  <Button variant="primary" className="flex-1" onClick={onConfirm}>
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
