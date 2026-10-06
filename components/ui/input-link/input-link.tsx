"use client";

import * as React from "react";
import { Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/**
 * Figma "Link" — node-id `5084:3716` 그룹("File Upload / MBTI Select / Link"
 * 세트, 사용자 확인: "한 세트로 구성하고 필요에 따라 지우고 쓰려고 묶어둔
 * 것"이라 완전히 독립된 컴포넌트로 구현) 내 Link 필드(composite "Input"
 * node, `Type=default`, `Status=default`(7219:10097)/`active`(7219:10102)/
 * `filled`(7219:10107)). 같은 그룹의 File Upload와 달리 이 필드에는 자체
 * 라벨/도움말 텍스트가 없습니다 — Figma의 `title`/`description` prop은
 * File Upload 예시에만 실질적으로 연결돼 있고, Link/MBTI Select는 라벨 없는
 * 순수 "Part/Input" 박스라 이 컴포넌트도 라벨 없이 구현했습니다(필요하면
 * 사용하는 쪽에서 별도 라벨을 배치).
 *
 * `Status`는 `default`/`active`/`filled` 3종뿐이고 `disabled`는 없습니다
 * (InputImage/InputCareer 등과 동일한 패턴, 2026-09-27 확인) — disabled prop을
 * 두지 않았습니다.
 *
 * "Part/Input" 모양(기존 base `Input`과 동일한 사이즈/보더/radius/배경
 * 토큰)에 우측 `globe`(lucide/globe, 아이콘 스프라이트에 신규 추가) 트레일링
 * 아이콘을 더한 구조입니다. `InputSearch`와 동일한 "borderless nested Input +
 * wrapper가 시각적 border/포커스 링 담당" 패턴을 재사용했습니다. Figma
 * 원본 텍스트가 `Inter:Medium`(500) 굵기라 base `Input`의 기본
 * `text-sm-regular` 대신 `text-sm-medium`으로 덮어썼습니다. `Status=active`의
 * 보더/그림자(`--border-static-gray` + focus ring)는 기존 `Input`의
 * `:hover`+`:focus` 상태와 정확히 같은 값(`--ring` = `--border-static-gray`,
 * `--shadow-focus-ring`)이라 동일한 토큰으로 재사용했습니다.
 */
export interface InputLinkProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "className"
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function InputLink({
  className,
  placeholder = "https://gabrielle.ai",
  ...inputProps
}: InputLinkProps) {
  return (
    <div
      className={cn(
        "flex h-[36px] w-full items-center gap-[var(--spacing-3)]",
        "rounded-[var(--radius-scale-md)] border-[length:var(--border-1)] border-solid border-[var(--border)]",
        "bg-[var(--background)] pl-[var(--spacing-3)] pr-[var(--spacing-3)]",
        "hover:border-[var(--ring)] hover:shadow-[var(--shadow-focus-ring)]",
        "focus-within:border-[var(--ring)] focus-within:shadow-[var(--shadow-focus-ring)]",
        className,
      )}
    >
      <Input
        type="url"
        placeholder={placeholder}
        {...inputProps}
        className="text-sm-medium h-full w-auto flex-1 rounded-none border-0 bg-transparent px-0 hover:border-transparent hover:shadow-none focus:border-transparent focus:shadow-none"
      />
      <Globe
        className="size-[var(--spacing-4)] shrink-0 text-[var(--muted-foreground)]"
        aria-hidden="true"
      />
    </div>
  );
}
