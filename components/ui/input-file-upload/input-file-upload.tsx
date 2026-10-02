"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Figma "File Upload" — node-id `5084:3716` 그룹("File Upload / MBTI Select /
 * Link" 세트, 사용자 확인: "한 세트로 구성하고 필요에 따라 지우고 쓰려고
 * 묶어둔 것"이라 완전히 독립된 컴포넌트로 구현) 내 File Upload 필드
 * (composite "Input" node, `Type=default`, `Status=default`(3466:30269)/
 * `active`(5153:2051)/`filled`(5110:11536)). MBTI Select는 기존
 * `Select`(`type="mbti"`)와 완전히 동일해 신규 작업 없이 그대로 재사용하고,
 * Link는 별도의 `InputLink` 컴포넌트로 분리했습니다.
 *
 * `Status`는 `default`/`active`/`filled` 3종뿐이고 `disabled`는 없습니다
 * (InputImage/InputCareer/InputInterest/InputSocialMedia와 동일한 패턴,
 * 2026-09-27 확인) — disabled prop을 두지 않았습니다.
 *
 * "Part/Input" 모양(기존 base `Input`과 동일한 사이즈/보더/radius/배경
 * 토큰)에 우측 `+`(lucide/plus) 트레일링 아이콘을 더한 구조입니다. 텍스트는
 * Figma 원본에서 `Inter:Medium`(500) 굵기라 base `Input`의 기본 `text-sm-regular`
 * 대신 직접 `text-sm-medium`을 적용했습니다(파일명/placeholder 모두 실제
 * `<input>`이 아니라 커스텀 `<span>`이라 base `Input`을 합성하지 않고 별도
 * 렌더링 — `InputImage`/`InputCareer`의 파일 행과 동일한 근거).
 *
 * `Status=active`(포커스) Figma 예시에는 우연히 파일명/placeholder 텍스트
 * 자체가 비어 있지만(정적 스냅샷에서 누락된 것으로 판단 — 다른 Input*
 * 계열은 전부 포커스 여부와 무관하게 텍스트를 계속 보여줌), 포커스 시
 * 텍스트가 사라지는 것은 실제 파일 선택 UX상 부자연스러워 `InputImage`/
 * `InputCareer` 선례를 따라 항상 렌더링했습니다. 포커스 보더/그림자
 * (`--border-static-gray` + focus ring)는 기존 `Input`의 `:hover`+`:focus`
 * 상태와 정확히 같은 값(`--ring` = `--border-static-gray`,
 * `--shadow-focus-ring`)이라 동일한 토큰으로 재사용했습니다.
 *
 * 네이티브 `<input type="file">`(sr-only)를 감싼 `<label>` 행으로
 * 구현했습니다 — `type="file"`은 React에서 controlled `value`를 지원하지
 * 않아 base `Input`(controlled value 모델)을 재사용할 수 없는 정당한
 * 예외입니다(`InputImage`/`InputCareer`와 동일 근거).
 */
export interface InputFileUploadProps {
  /** 필드 위에 표시할 라벨 텍스트 (Figma 예시: "File Upload"). 빈 문자열/undefined면 숨깁니다 */
  label?: string;
  /** 선택된 파일 (제어) */
  file?: File | null;
  /** 파일이 선택/해제될 때 호출됩니다 */
  onFileChange?: (file: File | null) => void;
  /** 파일 미선택 시 표시할 안내 텍스트 (Figma 예시: "File upload") */
  placeholder?: string;
  /** 라벨 아래 도움말 텍스트 (Figma 예시 문구, 빈 문자열/undefined면 숨김) */
  description?: string;
  /** 네이티브 `<input type="file">`의 `accept` 속성 */
  accept?: string;
  className?: string;
}

export function InputFileUpload({
  label = "File Upload",
  file = null,
  onFileChange,
  placeholder = "File upload",
  description = "The uploaded image will be used to generate your base brand kit.",
  accept,
  className,
}: InputFileUploadProps) {
  const fileInputId = React.useId();
  const labelId = React.useId();

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-[var(--spacing-3)]",
        className,
      )}
    >
      {label ? (
        <p
          id={labelId}
          className="text-sm-semi-bold w-full text-[var(--foreground)] select-none"
        >
          {label}
        </p>
      ) : null}

      <label
        htmlFor={fileInputId}
        className={cn(
          "flex h-[calc(var(--scale-36)*1px)] w-full cursor-pointer items-center gap-[var(--spacing-3)]",
          "rounded-[var(--radius-scale-md)] border-[length:var(--border-1)] border-solid border-[var(--border)]",
          "bg-[var(--background)] pl-[var(--spacing-3)] pr-[var(--spacing-3)]",
          "has-[:hover]:border-[var(--ring)] has-[:hover]:shadow-[var(--shadow-focus-ring)]",
          "has-[:focus]:border-[var(--ring)] has-[:focus]:shadow-[var(--shadow-focus-ring)]",
        )}
      >
        <span
          className={cn(
            "text-sm-medium flex-1 truncate",
            file
              ? "text-[var(--foreground)]"
              : "text-[var(--muted-foreground)]",
          )}
        >
          {file ? file.name : placeholder}
        </span>
        <svg
          className="size-[var(--spacing-4)] shrink-0 text-[var(--muted-foreground)]"
          aria-hidden="true"
        >
          <use href="/icons.svg#plus-icon" />
        </svg>
        <input
          id={fileInputId}
          type="file"
          accept={accept}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : placeholder}
          className="sr-only"
          onChange={(event) => onFileChange?.(event.target.files?.[0] ?? null)}
        />
      </label>

      {description ? (
        <p className="text-xs-medium w-full text-[var(--muted-foreground)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
