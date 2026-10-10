import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const scrollbarVariants = cva(
  cn(
    "overflow-y-auto overflow-x-hidden",
    "[&::-webkit-scrollbar-track]:bg-[var(--gb-background-subtler)]",
    "[&::-webkit-scrollbar-track]:rounded-[var(--gb-radius-scale-full)]",
    "[&::-webkit-scrollbar-thumb]:bg-[var(--gb-background-subtle)]",
    "[&::-webkit-scrollbar-thumb]:rounded-[var(--gb-radius-scale-full)]",
    "[scrollbar-color:var(--gb-background-subtle)_var(--gb-background-subtler)]",
  ),
  {
    variants: {
      thickness: {
        thick: cn("[&::-webkit-scrollbar]:w-[10px]", "[scrollbar-width:auto]"),
        thin: cn("[&::-webkit-scrollbar]:w-[5px]", "[scrollbar-width:thin]"),
      },
    },
    defaultVariants: {
      thickness: "thick",
    },
  },
);

export interface ScrollbarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scrollbarVariants> {
  /** 스크롤될 내용 */
  children: React.ReactNode;
}

export const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  function Scrollbar({ thickness, className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(scrollbarVariants({ thickness }), className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
