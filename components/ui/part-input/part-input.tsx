"use client";

import * as React from "react";
import { Plus, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * 가장 안쪽에서 재사용되는 기본 텍스트 입력 atom.
 * 스펙은 `docs/components/part-input.md` 참고.
 */
export interface PartInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange"
> {
  /** 제어 컴포넌트로 사용할 때의 값 */
  value?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기 값 */
  defaultValue?: string;
  /** 값이 바뀔 때 호출됩니다 */
  onValueChange?: (value: string) => void;
  /** 실제 DOM input에 접근이 필요한 조합 컴포넌트(예: TimeMaskInput)를 위한 ref.
   * React 19부터 함수 컴포넌트가 forwardRef 없이 ref를 일반 prop으로 받을 수 있습니다. */
  ref?: React.Ref<HTMLInputElement>;
  /** trailing 아이콘 표시 여부 (Figma `Trailing icon`, 기본값 `true`) */
  showTrailingIcon?: boolean;
  /** trailing 아이콘 컴포넌트. Figma Instance Swap 프로퍼티 기본값과 동일한
   * lucide `Plus`가 기본값입니다. `showTrailingIcon`이 true일 때만 렌더링됩니다. */
  icon?: LucideIcon;
  /** 에러 상태 (Figma `Status=error`). 보더만 경고색으로 바뀌고 에러 문구는
   * 이 컴포넌트가 렌더링하지 않습니다 — 소비처가 조합합니다. */
  isError?: boolean;
}

const SELECTION_RANGE_SUPPORTED_TYPES = new Set([
  "text",
  "search",
  "url",
  "tel",
  "password",
]);

export function PartInput({
  ref,
  value,
  defaultValue = "",
  onValueChange,
  disabled,
  className,
  onMouseDown,
  showTrailingIcon = true,
  icon: Icon = Plus,
  isError = false,
  ...props
}: PartInputProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    onMouseDown?.(event);
    if (event.defaultPrevented || disabled) return;
    if (event.button !== 0 || currentValue.length > 0) return;

    const input = event.currentTarget;
    if (!SELECTION_RANGE_SUPPORTED_TYPES.has(input.type)) return;

    event.preventDefault();
    input.focus();
    input.setSelectionRange(0, 0);
  };

  const inputElement = (
    <input
      ref={ref}
      value={currentValue}
      disabled={disabled}
      onChange={handleChange}
      onMouseDown={handleMouseDown}
      className={cn(
        "text-sm-medium",
        "w-full rounded-[var(--gb-radius-scale-md)]",
        "h-[36px]",
        "border-[length:var(--gb-border-1)] border-solid",
        isError
          ? "border-[var(--gb-border-warning)]"
          : "border-[var(--border)]",
        "bg-[var(--background)] text-[var(--foreground)]",
        showTrailingIcon
          ? "pl-[var(--gb-spacing-3)] pr-[var(--gb-spacing-9)]"
          : "pl-[var(--gb-spacing-3)] pr-[var(--gb-spacing-3)]",
        "outline-none transition-colors placeholder:text-[var(--muted-foreground)]",
        "focus:placeholder:opacity-0",
        "not-disabled:hover:border-[var(--ring)] not-disabled:hover:shadow-[var(--gb-shadow-focus-ring)]",
        "not-disabled:focus:border-[var(--ring)] not-disabled:focus:shadow-[var(--gb-shadow-focus-ring)]",
        "disabled:cursor-not-allowed disabled:border-[var(--gb-border-overlay)] disabled:bg-[var(--gb-background-disabled)] disabled:text-[var(--gb-text-static-gray)]",
        !showTrailingIcon && className,
      )}
      {...props}
    />
  );

  if (!showTrailingIcon) {
    return inputElement;
  }

  return (
    <div className={cn("group relative", className)}>
      {inputElement}
      <Icon
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 right-[var(--gb-spacing-3)] size-[var(--gb-spacing-4)] -translate-y-1/2 transition-colors",
          disabled
            ? "text-[var(--gb-icon-static-gray)]"
            : currentValue.length > 0
              ? "text-[var(--gb-icon-default)]"
              : "text-[var(--gb-icon-subtle)]",
        )}
      />
    </div>
  );
}
