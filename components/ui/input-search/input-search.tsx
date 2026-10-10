"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { PartInput, type PartInputProps } from "@/components/ui/part-input";

/**
 * `Status`는 default/active/filled/disabled 4개이고 error는 없다.
 *
 * `active`는 prop이 아니라 `:focus-within` CSS로 처리한다. `hover:`도 함께 걸어
 * 마우스 오버만으로도 같은 스타일이 보인다 — active가 hover와 클릭 모두를 의미한다.
 *
 * `disabled`는 opacity로 흐리는 방식이 아니라 별도의 불투명 스타일이다. base `PartInput`과
 * 달리 그림자 `shadow-xs`가 남는다.
 *
 * 검색 아이콘은 클릭 불가능한 장식 요소다. `PartInput`은 border/bg/padding 없이 합성하고
 * 바깥 wrapper가 시각적 border/그림자/포커스 링을 담당한다.
 */
export interface InputSearchProps extends Omit<
  PartInputProps,
  "value" | "defaultValue" | "onValueChange" | "className"
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function InputSearch({
  disabled,
  className,
  placeholder = "Search placeholder",
  ...inputProps
}: InputSearchProps) {
  return (
    <div
      className={cn(
        "flex h-[36px] w-full items-center gap-[var(--gb-spacing-3)]",
        "rounded-[var(--gb-radius-scale-md)] border-[length:var(--gb-border-1)] border-solid",
        "pl-[var(--gb-spacing-3)] pr-[var(--gb-spacing-3)]",
        "shadow-[var(--gb-shadow-xs)]",
        disabled
          ? "pointer-events-none border-[var(--gb-border-overlay)] bg-[var(--gb-background-disabled)]"
          : cn(
              "border-[var(--border)] bg-[var(--background)]",
              "hover:border-[var(--ring)] hover:shadow-[var(--gb-shadow-focus-ring)]",
              "focus-within:border-[var(--ring)] focus-within:shadow-[var(--gb-shadow-focus-ring)]",
            ),
        className,
      )}
    >
      <Search
        className={cn(
          "size-[var(--gb-spacing-4)] shrink-0",
          disabled
            ? "text-[var(--gb-icon-static-gray)]"
            : "text-[var(--gb-icon-default)]",
        )}
        aria-hidden="true"
      />
      <PartInput
        trailingIcon={false}
        placeholder={placeholder}
        disabled={disabled}
        {...inputProps}
        className={cn(
          "h-full w-auto flex-1 rounded-none border-0 bg-transparent px-0",
          "hover:border-transparent hover:shadow-none focus:border-transparent focus:shadow-none",
          // base PartInput의 disabled는 자체 배경/보더를 입히므로 여기서는 투명하게 둔다.
          "disabled:border-transparent disabled:bg-transparent disabled:text-[var(--gb-text-static-gray)]",
        )}
      />
    </div>
  );
}
