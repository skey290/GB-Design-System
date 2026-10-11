import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  cn(
    "inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap",
    "text-xs-medium",
    "gap-[var(--gb-spacing-1)]",
    "rounded-[var(--gb-radius-scale-md)]",
    "px-[var(--gb-spacing-2)] py-[var(--gb-spacing-0-5)]",
    "h-[20px]",
  ),
  {
    variants: {
      variant: {
        outline:
          "border-[length:var(--gb-border-1)] border-border bg-transparent text-foreground",
        reversed:
          "bg-[var(--gb-background-surface-secondary)] text-[var(--gb-text-default)]",
        primary: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

export interface SpinnerProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof spinnerVariants> {
  /** 배지에 표시할 라벨 텍스트 */
  label?: string;
}

export function Spinner({
  className,
  variant,
  label = "Processing",
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(spinnerVariants({ variant }), className)}
      {...props}
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-[12px] shrink-0 animate-spin"
      />
      {label}
    </span>
  );
}
