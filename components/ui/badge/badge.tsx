import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  cn(
    "inline-flex w-fit shrink-0 items-center justify-center gap-[var(--gb-spacing-1)] whitespace-nowrap",
    "rounded-[var(--gb-radius-scale-full)]",
    "py-[var(--gb-spacing-0-5)]",
  ),
  {
    variants: {
      variant: {
        default: "bg-[var(--gb-background-bold)] text-[var(--gb-text-invert)]",
        reverse:
          "bg-[var(--gb-background-default)] text-[var(--gb-text-default)] shadow-[inset_0_0_0_var(--gb-border-1)_var(--gb-border-bolder)]",
        outline:
          "bg-transparent text-[var(--gb-text-subtle)] shadow-[inset_0_0_0_var(--gb-border-1)_var(--gb-border-muted)]",
        alarm:
          "bg-transparent text-[var(--gb-text-warning)] shadow-[inset_0_0_0_var(--gb-border-1)_var(--gb-border-warning)]",
        success:
          "bg-transparent text-[var(--gb-text-success)] shadow-[inset_0_0_0_var(--gb-border-1)_var(--gb-border-success)]",
        destructive:
          "bg-[var(--gb-background-error-default)] text-[var(--gb-text-default)]",
      },
      size: {
        "20": "h-[20px] px-[var(--gb-spacing-1-5)] text-xs-medium",
        "28": "h-[28px] px-[var(--gb-spacing-3)] text-sm-medium",
      },
    },
    compoundVariants: [
      { variant: "destructive", size: "20", className: "text-xs-semi-bold" },
      { variant: "destructive", size: "28", className: "text-sm-semi-bold" },
    ],
    defaultVariants: {
      variant: "outline",
      size: "20",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** 배지 안에 표시할 내용 (보통 숫자나 짧은 라벨). 생략하면 라벨 없이
   * `icon`만 렌더링된다 (Figma `Label=false`) */
  children?: React.ReactNode;
  /** 라벨 앞에 렌더링되는 아이콘 슬롯. `size`에 따라 10×10 또는 14×14로 렌더링된다. */
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant,
  size,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {icon && (
        <span
          className={cn(
            "shrink-0",
            size === "28" ? "size-[14px]" : "size-[10px]",
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
