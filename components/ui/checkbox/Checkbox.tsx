"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type" | "role"
> {
  /** 제어 컴포넌트로 사용할 때의 체크 여부 (Figma `Checked` variant) */
  checked?: boolean;
  /** 비제어 컴포넌트로 사용할 때의 초기 체크 여부 */
  defaultChecked?: boolean;
  /**
   * 인디터미네이트(부분 선택) 상태 (Figma `Part` variant). `checked`와 별개의
   * boolean이며, `true`면 `checked` 값과 무관하게 `aria-checked="mixed"`로
   * 노출됩니다. 소비자가 직접 제어합니다(내부 state 없음).
   */
  indeterminate?: boolean;
  /** 체크 상태가 바뀔 때 호출됩니다 */
  onCheckedChange?: (checked: boolean) => void;
  /** 비활성화 여부 (Figma `Disabled` variant) */
  disabled?: boolean;
  /**
   * Figma `Style` variant(`default` | `muted`). 네이티브 `style`(인라인 스타일)
   * 속성과 이름이 충돌해 `variant`로 명명했습니다. Figma 컴포넌트 세트에는
   * `muted` 스타일이 미체크(`Defalut`) 상태에만 존재하며, 체크/인디터미네이트/
   * 비활성 상태와 조합된 `muted` 스와치는 없습니다 — 그 경우 `variant`는
   * 무시되고 해당 상태의 일반 스타일이 우선합니다.
   */
  variant?: "default" | "muted";
  /** 체크박스 옆에 표시할 라벨 텍스트 (필수) */
  label: string;
  className?: string;
  id?: string;
}

export function Checkbox({
  checked,
  defaultChecked = false,
  indeterminate = false,
  onCheckedChange,
  disabled = false,
  variant = "default",
  label,
  className,
  id,
  onClick,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;

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

  // Figma 원본 그대로: Default(선택 안 됨)는 진하게 채워진 박스, Checked/Part는
  // 흰 배경 + 아이콘으로 색이 "반전"돼 있습니다 — 사용자 확인 후 보정 없이 구현.
  const isMarked = indeterminate || isChecked;
  // Figma `Style=muted`는 미체크 상태에만 존재하는 스와치입니다. 체크/인디터미네이트/
  // 비활성 상태와의 조합은 Figma에 없으므로 그 경우 muted를 적용하지 않습니다.
  const isMuted = variant === "muted" && !disabled && !isMarked;

  return (
    <div
      className={cn(
        "inline-flex items-center align-top gap-[var(--spacing-2)]",
        className,
      )}
    >
      <button
        type="button"
        role="checkbox"
        id={checkboxId}
        aria-checked={indeterminate ? "mixed" : isChecked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "flex size-[var(--spacing-4)] shrink-0 items-center justify-center rounded-[var(--radius-scale-sm)] border-[length:var(--border-1)] border-solid shadow-[var(--shadow-xs)] outline-none transition-colors focus-visible:shadow-[var(--shadow-focus-ring)]",
          disabled
            ? "cursor-not-allowed border-[var(--border-default)] bg-[var(--background-disabled-bold)]"
            : cn(
                "cursor-pointer",
                isMarked
                  ? "border-[var(--border-subtle)] bg-[var(--background-default)] text-[var(--icon-default)]"
                  : isMuted
                    ? "border-[var(--border-mute)] bg-[var(--background-default)]"
                    : "border-[var(--border-muted)] bg-[var(--background-bolder)]",
              ),
        )}
        {...props}
      >
        {!disabled && indeterminate ? (
          <svg aria-hidden="true" className="size-[var(--spacing-3)]">
            <use href="/icons.svg#minus-icon" />
          </svg>
        ) : !disabled && isChecked ? (
          <svg aria-hidden="true" className="size-[var(--spacing-3)]">
            <use href="/icons.svg#check-icon" />
          </svg>
        ) : null}
      </button>
      <label
        htmlFor={checkboxId}
        className={cn(
          "text-sm-medium select-none",
          disabled
            ? "cursor-not-allowed text-[var(--text-subtle)]"
            : cn(
                "cursor-pointer",
                isMuted
                  ? "text-[var(--text-subtler)]"
                  : "text-[var(--text-default)]",
              ),
        )}
      >
        {label}
      </label>
    </div>
  );
}
