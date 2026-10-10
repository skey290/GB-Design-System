import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const chipsVariants = cva(
  cn(
    "relative inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap",
    "text-sm-medium",
    "rounded-[var(--gb-radius-scale-full)]",
    "px-[var(--gb-spacing-4)] py-[var(--gb-spacing-2)]",
    "h-[28px]",
    "transition-colors",
    // disabled 모습은 Type과 무관하게 하나다 — outline이 보더로 쓰는 inset
    // box-shadow까지 지워야 네 variant가 완전히 같은 모습이 된다.
    "disabled:pointer-events-none disabled:bg-primary disabled:text-muted-foreground disabled:opacity-[var(--gb-opacity-70)] disabled:shadow-none",
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-primary text-primary-foreground",
          "hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-text-static-white)]",
        ),
        secondary: cn(
          "bg-[var(--gb-background-surface-secondary)] text-foreground",
          "hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-text-static-white)]",
        ),
        outline: cn(
          // 실제 border 대신 inset box-shadow — 레이아웃 폭을 차지하지 않아
          // 다른 variant와 폭이 완전히 동일하게 유지된다 (Figma inside stroke와 동일)
          "bg-background text-foreground shadow-[inset_0_0_0_var(--gb-border-1)_var(--gb-border-default)]",
          "hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-text-static-white)] hover:shadow-none",
        ),
        ghost: cn(
          "bg-transparent text-foreground",
          "hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-text-static-white)]",
        ),
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        selected: true,
        className:
          "bg-[var(--gb-background-mute)] text-[var(--gb-text-static-white)]",
      },
      {
        variant: "secondary",
        selected: true,
        className:
          "bg-[var(--gb-background-mute)] text-[var(--gb-text-static-white)]",
      },
      {
        variant: "outline",
        selected: true,
        className:
          "bg-[var(--gb-background-mute)] text-[var(--gb-text-static-white)] shadow-none",
      },
      {
        variant: "ghost",
        selected: true,
        className:
          "bg-[var(--gb-background-mute)] text-[var(--gb-text-static-white)]",
      },
    ],
    defaultVariants: {
      variant: "primary",
      selected: false,
    },
  },
);

export interface ChipsProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipsVariants> {
  children: React.ReactNode;
  /** 우측 상단에 삭제(X) 배지를 표시할지 여부 */
  deletable?: boolean;
  /** 삭제 배지 클릭/키보드 활성화 시 호출. 칩 자체의 onClick으로는 전파되지 않음 */
  onDelete?: (event: React.SyntheticEvent) => void;
}

export function Chips({
  className,
  variant,
  selected = false,
  disabled,
  deletable = false,
  onDelete,
  children,
  ...props
}: ChipsProps) {
  const activateDelete = (event: React.SyntheticEvent) => {
    if (disabled) return;
    event.stopPropagation();
    onDelete?.(event);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected ?? false}
      className={cn(chipsVariants({ variant, selected }), className)}
      {...props}
    >
      {children}
      {/* Figma: disabled에는 삭제 배지가 없다 */}
      {deletable && !disabled && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Remove"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={activateDelete}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              activateDelete(event);
            }
          }}
          className={cn(
            "absolute flex items-center justify-center rounded-[var(--gb-radius-scale-full)]",
            "size-[16px]",
            "-right-[4px] -top-[5px]",
            // 아이콘 색은 칩 본문과 독립 — 상속시키면 primary/selected에서
            // 배지 배경과 같은 색이 되어 X가 보이지 않는다.
            "bg-background text-[var(--gb-icon-default)]",
          )}
        >
          <X className="size-[16px] shrink-0" />
        </span>
      )}
    </button>
  );
}
