"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type" | "role"
> {
  /** 제어 컴포넌트로 사용할 때의 on/off 상태 (Figma `On` variant) */
  checked?: boolean;
  /** 비제어 컴포넌트로 사용할 때의 초기 on/off 상태 */
  defaultChecked?: boolean;
  /** on/off 상태가 바뀔 때 호출됩니다 */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * 비활성화 여부 (Figma `Type=disabled` variant에 대응).
   * `labelPosition`과 독립적인 prop으로, 자유롭게 조합할 수 있습니다
   * (Figma는 `disabled`일 때 라벨이 항상 왼쪽에 오는 예시만 제공하지만,
   * 두 prop을 결합으로 유지해 `disabled` + `labelPosition="right"` 조합도 허용합니다).
   */
  disabled?: boolean;
  /** 스위치 옆에 표시할 라벨 텍스트 */
  label?: string;
  /**
   * 라벨이 트랙 기준 어느 쪽에 위치하는지 (Figma `Type` variant)
   * - "right": 트랙 → 라벨 순서 (Figma `Type=default`)
   * - "left": 라벨 → 트랙 순서 (Figma `Type=reversed`, `Type=disabled` 예시와 동일 순서)
   */
  labelPosition?: "left" | "right";
  /** 스위치 크기 (Figma `Size` variant) */
  size?: "default" | "small";
}

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
        // 트랙/썸 치수는 Figma 스펙 확정값
        "relative inline-flex shrink-0 items-center overflow-clip rounded-[var(--radius-scale-full)] p-[var(--spacing-0-5)] shadow-[var(--shadow-xs)] transition-colors",
        size === "small" ? "h-[22px] w-[40px]" : "h-[24px] w-[44px]",
        isChecked
          ? "justify-end bg-[var(--background-bold)]"
          : cn(
              "justify-start",
              disabled
                ? "bg-[var(--background-disabled)]"
                : "bg-[var(--background-selected)]",
            ),
      )}
    >
      <span
        data-slot="switch-thumb"
        className={cn(
          "shrink-0 rounded-[var(--radius-scale-full)] transition-transform",
          size === "small" ? "size-[18px]" : "size-[20px]",
          isChecked
            ? "bg-[var(--background-subtlest)]"
            : "bg-[var(--background-static-white)]",
        )}
      />
    </span>
  );

  const labelNode = label ? (
    <span
      data-slot="switch-label"
      className="text-sm-medium whitespace-nowrap text-[var(--foreground)]"
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
        "inline-flex items-center gap-[var(--spacing-1-5)] rounded-[var(--radius-scale-full)] outline-none focus-visible:shadow-[var(--shadow-focus-ring)]",
        disabled
          ? "cursor-not-allowed opacity-[var(--opacity-50)]"
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
