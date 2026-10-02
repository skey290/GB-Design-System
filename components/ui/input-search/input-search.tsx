"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";

/**
 * Figma "Input search" (node-id 3981:19811) — `Property 1=Default/Variant2`
 * (심볼 2개)는 Chatbox의 `Property 4`와 동일하게 MCP가 자동 생성한 일반화된
 * 이름이라 실제 의미가 불명확했지만, `get_design_context`로 확인한 결과 base
 * `Input`의 `State=default/active`와 완전히 동일한 값 패턴이었습니다:
 * `Default` = `border-border` + 옅은 정적 그림자(`drop-shadow(0 1px 1px
 * rgba(0,0,0,0.1))`), `Variant2` = `border-ring` + `--shadow-focus-ring`과
 * 정확히 일치하는 box-shadow(정적 그림자는 사라짐). → **`Default`=미포커스,
 * `Variant2`=포커스** 상태로 해석해 prop이 아니라 `:focus-within` CSS로
 * 처리했습니다(재질문 없이 진행). 2026-08-02 사용자 요청("active는 hover와
 * 클릭 모두를 의미")에 따라 `hover:`도 함께 추가해 마우스 오버만으로도 같은
 * 스타일이 보이도록 확장했습니다.
 *
 * 검색 아이콘(`lucide/search`, 16px)은 클릭 불가능한 장식 요소라
 * `InputWithTitle`의 도움말 아이콘과 동일하게 `/icons.svg` 스프라이트
 * (`search-icon`, 정확히 일치하는 id 존재)를 인라인 `<svg><use>`로
 * 렌더링했습니다. `Input`을 border/bg/padding 없이 합성하고 바깥 wrapper가
 * 시각적 border/그림자/포커스 링을 담당합니다(InputWithTitle과 동일한 패턴).
 * 정적 그림자(`0 1px 1px rgba(0,0,0,0.1)`)는 매칭 토큰이 없어 가장 가까운
 * `--shadow-xs`로 근사했습니다(Chatbox의 버튼 행 그림자와 동일한 근거).
 */
export interface InputSearchProps extends Omit<
  InputProps,
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
  placeholder = "Search...",
  ...inputProps
}: InputSearchProps) {
  return (
    <div
      className={cn(
        "flex h-[calc(var(--scale-36)*1px)] w-full items-center gap-[var(--spacing-3)]",
        "rounded-[var(--radius-scale-md)] border-[length:var(--border-1)] border-solid border-[var(--border)]",
        "bg-[var(--background)] pl-[var(--spacing-3)] pr-[var(--spacing-3)]",
        // Figma의 정적 drop-shadow(0 1px 1px rgba(0,0,0,0.1))는 매칭 토큰이 없어 --shadow-xs로 근사
        "shadow-[var(--shadow-xs)]",
        "hover:border-[var(--ring)] hover:shadow-[var(--shadow-focus-ring)]",
        "focus-within:border-[var(--ring)] focus-within:shadow-[var(--shadow-focus-ring)]",
        disabled && "pointer-events-none opacity-[var(--opacity-50)]",
        className,
      )}
    >
      <svg
        className="size-[var(--spacing-4)] shrink-0 text-[var(--muted-foreground)]"
        aria-hidden="true"
      >
        <use href="/icons.svg#search-icon" />
      </svg>
      <Input
        placeholder={placeholder}
        disabled={disabled}
        {...inputProps}
        className="h-full w-auto flex-1 rounded-none border-0 bg-transparent px-0 hover:border-transparent hover:shadow-none focus:border-transparent focus:shadow-none"
      />
    </div>
  );
}
