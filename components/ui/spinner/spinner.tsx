import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  cn(
    "inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap",
    "text-xs-medium",
    "gap-[var(--spacing-1)]",
    "rounded-[var(--radius-scale-md)]",
    "px-[var(--spacing-2)] py-[var(--spacing-0-5)]",
    // 20px: 컴포넌트 자체 높이라 Figma 스펙 확정값
    "h-[20px]",
  ),
  {
    variants: {
      variant: {
        // outline만 border-width 적용 (Figma 스펙 확정값)
        outline:
          "border-[length:var(--border-1)] border-border bg-transparent text-foreground",
        // Shadcn --secondary는 --background-subtler(#f5f5f5)에 alias되어 있어
        // Figma Spinner secondary가 지정하는 --background-surface-secondary
        // (#fafafa, node-id 1202:729)와 라이트 모드에서 값이 다름(다크 모드에서는
        // 둘 다 #262626로 우연히 동일) — 이 컴포넌트는 직접 시맨틱 토큰을 참조
        // (2026-09-26, Figma 절대 기준 원칙에 따라 수정)
        secondary:
          "bg-[var(--background-surface-secondary)] text-secondary-foreground",
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
    <span className={cn(spinnerVariants({ variant }), className)} {...props}>
      <LoaderCircle
        aria-hidden="true"
        // 12px: 아이콘 자체 크기라 Figma 스펙 확정값
        // 색상은 currentColor로 텍스트 색상과 자동 연동되므로 별도 지정하지 않음
        className="size-[12px] shrink-0 animate-spin"
      />
      {label}
    </span>
  );
}
