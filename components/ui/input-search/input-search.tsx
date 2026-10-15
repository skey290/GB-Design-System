"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { PartInput, type PartInputProps } from "@/components/ui/part-input";

/** 왼쪽에 돋보기 아이콘이 들어간 한 줄 검색 입력. 스펙 상세는 `docs/components/input-search.md` 참고. */
export interface InputSearchProps extends Omit<
  PartInputProps,
  "value" | "defaultValue" | "onValueChange" | "className"
> {
  /** 제어 컴포넌트로 사용할 때의 검색어 */
  value?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기 검색어 */
  defaultValue?: string;
  /** 검색어가 바뀔 때 호출됩니다. 검색 실행은 호출부의 책임입니다 */
  onValueChange?: (value: string) => void;
  /** 입력을 비활성화합니다 */
  disabled?: boolean;
  /** 바깥 wrapper에 병합 (보더·그림자·포커스 링을 가진 요소) */
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
        "flex h-[36px] w-[344px] items-center gap-[var(--gb-spacing-3)]",
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
        showTrailingIcon={false}
        placeholder={placeholder}
        disabled={disabled}
        {...inputProps}
        className={cn(
          "h-full w-auto flex-1 rounded-none border-0 bg-transparent px-0",
          "not-disabled:hover:border-transparent not-disabled:hover:shadow-none",
          "not-disabled:focus:border-transparent not-disabled:focus:shadow-none",
          "disabled:border-transparent disabled:bg-transparent disabled:text-[var(--gb-text-static-gray)]",
        )}
      />
    </div>
  );
}
