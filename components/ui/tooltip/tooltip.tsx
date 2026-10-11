"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const tooltipContentVariants = cva(
  cn(
    "relative z-50 flex w-fit flex-col",
    "gap-[var(--gb-spacing-1)]",
    "rounded-[var(--gb-radius-scale-md)]",
    "pl-[var(--gb-spacing-4)] pr-[var(--gb-spacing-8)] py-[var(--gb-spacing-3)]",
    "text-left",
    "shadow-[var(--gb-shadow-sm)]",
    "text-sm-regular",
  ),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        reversed:
          "bg-[var(--gb-background-mute-subtler)] text-[var(--gb-text-emphasis)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface TooltipProps extends VariantProps<
  typeof tooltipContentVariants
> {
  /** 툴팁을 트리거하는 요소 (hover/focus 대상) */
  children: React.ReactNode;
  /** 툴팁 제목. 전달하지 않으면 렌더링되지 않음 */
  title?: React.ReactNode;
  /** 툴팁 설명. 전달하지 않으면 렌더링되지 않음 */
  description?: React.ReactNode;
  /** 트리거 기준 어느 방향에 띄울지 */
  side?: "top" | "right" | "bottom" | "left";
  /** 트리거 기준 어느 지점에 정렬할지 */
  align?: "start" | "center" | "end";
  /** 트리거와 툴팁 사이 거리(px) */
  sideOffset?: number;
  /** 정렬 축 방향으로 밀어낼 거리(px) */
  alignOffset?: number;
  /** 뷰포트 경계와 이 거리(px) 이내로 겹치지 않도록 Radix가 자동으로 flip/shift한다 */
  collisionPadding?:
    number | Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  /** 닫기 버튼을 누르면 호출됩니다. 전달해야 닫기 버튼이 렌더링됩니다 */
  onClose?: () => void;
  /** 제어 컴포넌트로 사용할 때의 열림 여부 */
  open?: boolean;
  /** 비제어 컴포넌트로 사용할 때의 초기 열림 여부 */
  defaultOpen?: boolean;
  /** 열림 상태가 바뀔 때 호출됩니다 */
  onOpenChange?: (open: boolean) => void;
  /** 트리거에 포인터가 진입한 뒤 툴팁이 열리기까지의 지연 시간(ms) */
  delayDuration?: number;
  /** 툴팁 본문에 병합 */
  className?: string;
}

export function Tooltip({
  children,
  title,
  description,
  variant,
  side = "top",
  align = "center",
  sideOffset,
  alignOffset,
  collisionPadding = 12,
  onClose,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  className,
}: TooltipProps) {
  const hasBody = Boolean(title) || Boolean(description);

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            collisionPadding={collisionPadding}
            className={cn(tooltipContentVariants({ variant }), className)}
          >
            {hasBody && (
              <div className="flex flex-col gap-[var(--gb-spacing-1)]">
                {title && <p className="text-sm-semi-bold">{title}</p>}
                {description && (
                  <p className="text-sm-regular">{description}</p>
                )}
              </div>
            )}
            {onClose && (
              <button
                type="button"
                aria-label="Close tooltip"
                onClick={onClose}
                className={cn(
                  "absolute outline-none",
                  "top-[var(--gb-spacing-3-5)] right-[var(--gb-spacing-4)]",
                )}
              >
                <X aria-hidden="true" className="size-[var(--gb-spacing-4)]" />
              </button>
            )}
            <TooltipPrimitive.Arrow asChild width={10} height={10}>
              <div
                className={cn(
                  "size-[var(--gb-spacing-2-5)] rotate-45",
                  "rounded-[var(--gb-radius-scale-xs)]",
                  // 45° 회전으로 대각선(14.14px)이 생기므로 본문 쪽으로 밀어넣어
                  // "밑변 10px · 높이 5px 삼각형"만 노출시킨다. Radix가 래퍼를
                  // 회전시켜 로컬 -Y를 항상 본문 안쪽으로 맞추므로 side가 무엇이든
                  // 같은 값을 쓴다.
                  "translate-y-[calc(-50%_-_2px)]",
                  variant === "reversed"
                    ? "bg-[var(--gb-background-mute-subtler)]"
                    : "bg-primary",
                )}
              />
            </TooltipPrimitive.Arrow>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
