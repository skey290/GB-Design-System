import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const chipsVariants = cva(
  cn(
    "inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap",
    "text-sm-medium",
    "rounded-[var(--radius-scale-full)]",
    "border-[length:var(--border-1)] border-transparent",
    "px-[var(--spacing-4)] py-[var(--spacing-2)]",
    // 28px: 컴포넌트 자체 높이라 간격 전용인 --spacing-*가 아닌 범용 숫자 풀 --scale-*를 참조 (Figma 스펙 확정값)
    "h-[calc(var(--scale-28)*1px)]",
    "transition-colors",
    // disabled는 Figma상 primary 타입에만 그려져 있으나, 사용자 확정에 따라 모든 variant에 동일한
    // 모양(--background-bold + opacity-70, primary disabled와 동일)으로 통일 적용 — Type 고유색 유지 안 함
    "disabled:pointer-events-none disabled:bg-primary disabled:text-muted-foreground disabled:opacity-[var(--opacity-70)]",
  ),
  {
    variants: {
      variant: {
        // hover는 Figma에 별도 State가 없어, active(selected)와 동일한 색으로 미리보기 (사용자 확정)
        primary:
          "bg-primary text-primary-foreground hover:bg-[var(--background-static-gray)] hover:text-[var(--text-static-white)]",
        secondary:
          "bg-[var(--background-surface-secondary)] text-foreground hover:bg-[var(--background-static-gray)] hover:text-[var(--text-static-white)]",
        outline:
          "bg-background text-foreground border-border hover:bg-[var(--background-static-gray)] hover:text-[var(--text-static-white)] hover:border-transparent",
        ghost:
          "bg-transparent text-foreground hover:bg-[var(--background-static-gray)] hover:text-[var(--text-static-white)]",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    // Figma State=active: 4개 Type 전부 동일하게 bg-static-gray + text-static-white로 통일되고
    // border는 사라짐(outline도 테두리 없음) — 구 파일 기준이던 "흰 테두리 링"은 더 이상 유효하지 않음
    compoundVariants: [
      {
        variant: "primary",
        selected: true,
        className:
          "bg-[var(--background-static-gray)] text-[var(--text-static-white)]",
      },
      {
        variant: "secondary",
        selected: true,
        className:
          "bg-[var(--background-static-gray)] text-[var(--text-static-white)]",
      },
      {
        variant: "outline",
        selected: true,
        className:
          "bg-[var(--background-static-gray)] text-[var(--text-static-white)] border-transparent",
      },
      {
        variant: "ghost",
        selected: true,
        className:
          "bg-[var(--background-static-gray)] text-[var(--text-static-white)]",
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
  /** 우측 상단에 삭제(X) 배지를 표시할지 여부 (Figma propDelete) */
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
      {deletable && (
        // 칩 자체가 <button>이라 중첩 <button>(잘못된 HTML)을 피하기 위해 role="button"으로 구현,
        // 키보드 접근성(Enter/Space)은 직접 처리
        <span
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Remove"
          aria-disabled={disabled || undefined}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={activateDelete}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              activateDelete(event);
            }
          }}
          className={cn(
            "absolute flex items-center justify-center rounded-[var(--radius-scale-full)]",
            "size-[var(--spacing-4)]",
            // -4px/-5px: Figma 스펙 실측값(우측 상단 코너 오버랩). 사용자 확정에 따라 전 variant 동일 오프셋으로 통일
            "-right-[var(--spacing-1)] -top-[5px]",
            "border-[length:var(--border-1)] border-solid",
            disabled
              ? "pointer-events-none bg-[var(--background-disabled)] border-[color:var(--border-overlay)]"
              : "bg-background border-border",
          )}
        >
          {/* 10px: 토큰 스케일에 정확히 매칭되는 값 없어 Figma 실측값 그대로 사용 (Select 리셋 아이콘과 동일한 예외 패턴) */}
          <svg className="size-[10px]">
            <use href="/icons.svg#x-icon" />
          </svg>
        </span>
      )}
    </button>
  );
}
