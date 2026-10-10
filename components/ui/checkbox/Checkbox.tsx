"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type" | "role"
> {
  /** 제어 컴포넌트로 사용할 때의 체크 여부 (Figma `Status=checked`) */
  checked?: boolean;
  /** 비제어 컴포넌트로 사용할 때의 초기 체크 여부 */
  defaultChecked?: boolean;
  /**
   * 인디터미네이트(부분 선택) 상태 (Figma `Status=part`). `checked`와 별개의
   * boolean이며, `true`면 `checked` 값과 무관하게 `aria-checked="mixed"`로
   * 노출됩니다. 소비자가 직접 제어합니다(내부 state 없음).
   */
  indeterminate?: boolean;
  /** 체크 상태가 바뀔 때 호출됩니다 */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * 비활성화 여부. Figma `Status`의 `disabled`/`disabled-checked`/`disabled-part`
   * 세 값에 대응하며, `checked`/`indeterminate`와 조합해 어느 쪽인지가 정해집니다.
   */
  disabled?: boolean;
  /**
   * Figma `Type` 축(`default` | `mute`). 네이티브 `style`(인라인 스타일) 속성과
   * 이름이 충돌해 `variant`로 명명했습니다.
   */
  variant?: "default" | "mute";
  /** 체크박스 옆에 표시할 라벨 텍스트 (필수) */
  label: string;
  className?: string;
  id?: string;
}

/** 라벨을 곁들일 수 있는 단일 boolean 선택. */
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

  const isMarked = indeterminate || isChecked;
  // disabled 배색은 Type과 무관하게 하나다 — Figma도 `mute` × disabled 스와치를 두지 않았다.
  const tone = disabled ? "disabled" : variant;

  return (
    <div
      className={cn(
        "inline-flex items-center align-top gap-[var(--gb-spacing-2)]",
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
          "flex size-[16px] shrink-0 items-center justify-center rounded-[var(--gb-radius-scale-sm)] border-[length:var(--gb-border-1)] border-solid shadow-[var(--gb-shadow-xs)] outline-none transition-colors focus-visible:shadow-[var(--gb-shadow-focus-ring)]",
          tone === "disabled"
            ? "cursor-not-allowed border-[var(--gb-border-default)] bg-[var(--gb-background-disabled-bold)] text-[var(--gb-icon-static-gray)]"
            : cn(
                "cursor-pointer text-[var(--gb-icon-default)]",
                tone === "mute"
                  ? "border-[var(--gb-border-mute-subtle)] bg-[var(--gb-background-default)]"
                  : isMarked
                    ? "border-[var(--gb-border-subtle)] bg-[var(--gb-background-default)]"
                    : "border-[var(--gb-border-muted)] bg-[var(--gb-background-bolder)]",
              ),
        )}
        {...props}
      >
        {indeterminate ? (
          <Minus aria-hidden="true" className="size-[12px]" />
        ) : isChecked ? (
          <Check aria-hidden="true" className="size-[12px]" />
        ) : null}
      </button>
      <label
        htmlFor={checkboxId}
        className={cn(
          "text-sm-medium select-none",
          tone === "disabled"
            ? "cursor-not-allowed text-[var(--gb-text-static-gray)]"
            : cn(
                "cursor-pointer",
                tone === "mute"
                  ? "text-[var(--gb-text-subtle)]"
                  : "text-[var(--gb-text-default)]",
              ),
        )}
      >
        {label}
      </label>
    </div>
  );
}
