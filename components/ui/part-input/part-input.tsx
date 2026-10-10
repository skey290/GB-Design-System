"use client";

import * as React from "react";
import { Plus, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * `Status=active`는 Figma에서 정식 Variant Set이 아닌 loose 심볼이라 prop이
 * 아니라 CSS 의사클래스로 구현한다. 트리거는 `:hover`+`:focus` — active가
 * 마우스 오버와 클릭/포커스 모두를 의미하기 때문이다.
 *
 * `disabled`는 opacity로 흐리는 방식이 아니라 별도의 불투명 스타일이며,
 * hover/focus에 따른 변화가 없어야 한다 — Tailwind의 `not-disabled:` 변형자로
 * hover/focus 스타일을 차단한다.
 *
 * 예시 텍스트는 네이티브 `placeholder` 속성으로 전달하는 것을 전제로 한다.
 * 포커스 즉시 사라지고(`focus:placeholder:opacity-0`) 캐럿만 남는다.
 *
 * 값이 빈 필드는 어디를 클릭해도 캐럿이 항상 맨 앞(0)에 놓인다 — `onMouseDown`에서
 * `preventDefault`로 브라우저의 캐럿 계산을 막고 `setSelectionRange(0, 0)`을
 * 직접 호출한다. `setSelectionRange`는 `text`/`search`/`url`/`tel`/`password`
 * 타입에서만 지원되므로(그 외 타입은 `InvalidStateError`) 다른 타입은 건너뛴다.
 *
 * trailing 아이콘 색은 값 유무로 갈린다 — 빈 값은 `icon/subtle`, 값이 들어오면
 * `icon/default`. hover/focus로는 바뀌지 않는다.
 *
 * `trailingIcon` 기본값은 Figma 컴포넌트 프로퍼티와 같은 `true`다. 아이콘 없이
 * 쓰는 조합(input-time/input-search/input-phone, Input의 Textfield 행)은 각자
 * `trailingIcon={false}`를 명시한다.
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
  trailingIcon?: boolean;
  /** trailing 아이콘 컴포넌트. Figma Instance Swap 프로퍼티 기본값과 동일한
   * lucide `Plus`가 기본값입니다. `trailingIcon`이 true일 때만 렌더링됩니다. */
  icon?: LucideIcon;
  /** 에러 상태 (Figma `Status=error`). 보더만 경고색으로 바뀌고 에러 문구는
   * 이 컴포넌트가 렌더링하지 않습니다 — 소비처가 조합합니다. */
  isError?: boolean;
}

/** `selectionStart`/`setSelectionRange`은 스펙상 이 타입들에서만 지원되고
 * (`email`/`number` 등에서 호출하면 `InvalidStateError`), 나머지 타입은
 * 호출 자체가 불가능합니다. */
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
  trailingIcon = true,
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
        // 36px: Figma 확정값 (Button.tsx와 동일).
        "h-[36px]",
        "border-[length:var(--gb-border-1)] border-solid",
        isError
          ? "border-[var(--gb-border-warning)]"
          : "border-[var(--border)]",
        "bg-[var(--background)] text-[var(--foreground)]",
        // trailing 아이콘이 있으면 텍스트가 아이콘과 겹치지 않도록 우측 패딩을
        // 아이콘 슬롯(16px) + 여백만큼 늘립니다.
        trailingIcon
          ? "pl-[var(--gb-spacing-3)] pr-[var(--gb-spacing-8)]"
          : "pl-[var(--gb-spacing-3)] pr-[var(--gb-spacing-3)]",
        "outline-none transition-colors placeholder:text-[var(--muted-foreground)]",
        "focus:placeholder:opacity-0",
        "not-disabled:hover:border-[var(--ring)] not-disabled:hover:shadow-[var(--gb-shadow-focus-ring)]",
        "not-disabled:focus:border-[var(--ring)] not-disabled:focus:shadow-[var(--gb-shadow-focus-ring)]",
        "disabled:cursor-not-allowed disabled:border-[var(--gb-border-overlay)] disabled:bg-[var(--gb-background-disabled)] disabled:text-[var(--gb-text-static-gray)]",
        !trailingIcon && className,
      )}
      {...props}
    />
  );

  if (!trailingIcon) {
    return inputElement;
  }

  // 아이콘이 있을 때만 wrapper를 씁니다 — `trailingIcon={false}`면 단일 <input>
  // 그대로다. wrapper를 쓸 때는 `className`이 input이 아니라 이 바깥 박스에 적용됩니다.
  return (
    <div className={cn("group relative", className)}>
      {inputElement}
      <Icon
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 right-[var(--gb-spacing-3)] size-[var(--gb-spacing-4)] -translate-y-1/2 transition-colors",
          // Figma는 값 유무로 아이콘 색을 가른다 — 빈 값은 subtle, 값이 들어오면(filled)
          // default. hover/focus로는 색이 바뀌지 않는다.
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
