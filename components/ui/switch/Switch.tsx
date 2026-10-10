"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type" | "role"
> {
  /** 제어 컴포넌트로 사용할 때의 on/off 상태 */
  checked?: boolean;
  /** 비제어 컴포넌트로 사용할 때의 초기 on/off 상태 */
  defaultChecked?: boolean;
  /** on/off 상태가 바뀔 때 호출됩니다 */
  onCheckedChange?: (checked: boolean) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 스위치 옆에 표시할 라벨 텍스트 */
  label?: string;
  /** 라벨이 트랙 기준 어느 쪽에 위치하는지 */
  labelPosition?: "left" | "right";
  /** 스위치 크기 */
  size?: "default" | "small";
}

/** 즉시 적용되는 on/off 슬라이더. */
export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  label = "switch",
  labelPosition = "right",
  size = "default",
  className,
  onClick,
  ...props
}: SwitchProps) {
  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);
  const isChecked = isControlled ? checked : uncontrolledChecked;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (disabled || event.defaultPrevented) return;

    const next = !isChecked;
    if (!isControlled) {
      setUncontrolledChecked(next);
    }
    onCheckedChange?.(next);
  };

  const track = (
    <span
      data-slot="switch-track"
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center overflow-clip rounded-[var(--gb-radius-scale-full)] p-[var(--gb-spacing-0-5)] shadow-[var(--gb-shadow-xs)] transition-colors",
        size === "small" ? "h-[22px] w-[40px]" : "h-[24px] w-[44px]",
        isChecked
          ? "justify-end bg-[var(--gb-background-bold)]"
          : cn(
              "justify-start",
              disabled
                ? "bg-[var(--gb-background-disabled)]"
                : "bg-[var(--gb-background-selected)]",
            ),
      )}
    >
      <span
        data-slot="switch-thumb"
        className={cn(
          "shrink-0 rounded-[var(--gb-radius-scale-full)] transition-transform",
          size === "small" ? "size-[18px]" : "size-[20px]",
          isChecked
            ? "bg-[var(--gb-background-subtlest)]"
            : "bg-[var(--gb-background-static-white)]",
        )}
      />
    </span>
  );

  const labelNode = label ? (
    <span
      data-slot="switch-label"
      className="text-sm-medium whitespace-nowrap text-[var(--gb-text-default)]"
    >
      {label}
    </span>
  ) : null;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={label ? undefined : "switch"}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-[var(--gb-spacing-1-5)] rounded-[var(--gb-radius-scale-full)] outline-none focus-visible:shadow-[var(--gb-shadow-focus-ring)]",
        disabled
          ? "cursor-not-allowed opacity-[var(--gb-opacity-50)]"
          : "cursor-pointer",
        className,
      )}
      {...props}
    >
      {labelPosition === "left" && labelNode}
      {track}
      {labelPosition === "right" && labelNode}
    </button>
  );
}
