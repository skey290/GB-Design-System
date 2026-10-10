"use client";

import * as React from "react";
import { Globe, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { PartInput } from "@/components/ui/part-input";
import { Select, type SelectOption } from "@/components/ui/select";

/**
 * Textfield / Upload / Select / Link 네 개의 입력 행을 boolean으로 켜고 끄는
 * 복합 블록이다. `Status`는 default/active/filled 3개이고
 * disabled/error는 없다.
 *
 * 렌더 순서는 Title → Textfield → Upload → Select → Link → Description으로 고정이며
 * 행 사이 간격은 `--gb-spacing-3`이다.
 *
 * Textfield/Link 행은 공용 `PartInput`, Select 행은 공용 `Select`를 그대로 재사용한다.
 * Upload 행만 네이티브 `<input type="file">`이 controlled value를 지원하지 않아
 * `<label>` + `sr-only` 조합으로 따로 구현한다.
 *
 * `Status=active`에서 Figma가 네 행을 동시에 포커스 링으로 보여주는 것은 목업이므로,
 * 코드는 행별 `:focus-within`으로 처리한다.
 */
export interface InputProps {
  /** 블록 상단 제목. 빈 문자열/undefined면 숨깁니다 */
  label?: string;
  /** 블록 하단 도움말 텍스트. 빈 문자열/undefined면 숨깁니다 */
  description?: string;

  /** Textfield 행 표시 여부 */
  showTextfield?: boolean;
  /** Textfield 행의 값 (제어) */
  textfieldValue?: string;
  onTextfieldValueChange?: (value: string) => void;
  textfieldPlaceholder?: string;

  /** Upload 행 표시 여부 */
  showUpload?: boolean;
  /** 선택된 파일 (제어) */
  file?: File | null;
  onFileChange?: (file: File | null) => void;
  uploadPlaceholder?: string;
  /** 네이티브 `<input type="file">`의 `accept` 속성 */
  accept?: string;

  /** Select 행 표시 여부. `selectOptions`가 비어 있으면 렌더링하지 않습니다 */
  showSelect?: boolean;
  selectOptions?: SelectOption[];
  selectValue?: string;
  onSelectValueChange?: (value: string) => void;
  selectPlaceholder?: string;

  /** Link 행 표시 여부 */
  showLink?: boolean;
  /** Link 행의 값 (제어) */
  linkValue?: string;
  onLinkValueChange?: (value: string) => void;
  linkPlaceholder?: string;

  className?: string;
}

export function Input({
  label = "File Upload",
  description = "The uploaded image will be used to generate your base brand kit.",

  showTextfield = true,
  textfieldValue,
  onTextfieldValueChange,
  textfieldPlaceholder = "Email or Username",

  showUpload = true,
  file = null,
  onFileChange,
  uploadPlaceholder = "File upload",
  accept,

  showSelect = true,
  selectOptions,
  selectValue,
  onSelectValueChange,
  selectPlaceholder = "MBTI",

  showLink = true,
  linkValue,
  onLinkValueChange,
  linkPlaceholder = "https://gabrielle.ai",

  className,
}: InputProps) {
  const fileInputId = React.useId();
  const labelId = React.useId();

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-[var(--gb-spacing-3)]",
        className,
      )}
    >
      {label ? (
        <p
          id={labelId}
          className="text-sm-semi-bold w-full text-[var(--gb-text-default)] select-none"
        >
          {label}
        </p>
      ) : null}

      {showTextfield ? (
        <PartInput
          trailingIcon={false}
          value={textfieldValue}
          onValueChange={onTextfieldValueChange}
          placeholder={textfieldPlaceholder}
          className="w-full"
        />
      ) : null}

      {showUpload ? (
        <label
          htmlFor={fileInputId}
          className={cn(
            "group flex h-[36px] w-full cursor-pointer items-center gap-[var(--gb-spacing-3)]",
            "rounded-[var(--gb-radius-scale-md)] border-[length:var(--gb-border-1)] border-solid border-[var(--border)]",
            "bg-[var(--background)] pl-[var(--gb-spacing-3)] pr-[var(--gb-spacing-3)]",
            "has-[:hover]:border-[var(--ring)] has-[:hover]:shadow-[var(--gb-shadow-focus-ring)]",
            "has-[:focus]:border-[var(--ring)] has-[:focus]:shadow-[var(--gb-shadow-focus-ring)]",
          )}
        >
          <span
            className={cn(
              "text-sm-medium flex-1 truncate",
              file
                ? "text-[var(--gb-text-default)]"
                : cn(
                    "text-[var(--gb-text-subtle)]",
                    // 다른 세 행은 네이티브 placeholder라 focus 시 사라진다. Upload 행은
                    // <span>이라 같은 동작을 직접 재현한다 — 값(파일명)은 그대로 둔다.
                    "group-has-[:focus]:opacity-0",
                  ),
            )}
          >
            {file ? file.name : uploadPlaceholder}
          </span>
          <Plus
            className={cn(
              "size-[var(--gb-spacing-4)] shrink-0",
              file
                ? "text-[var(--gb-icon-default)]"
                : "text-[var(--gb-icon-subtle)]",
            )}
            aria-hidden="true"
          />
          <input
            id={fileInputId}
            type="file"
            accept={accept}
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : uploadPlaceholder}
            className="sr-only"
            onChange={(event) =>
              onFileChange?.(event.target.files?.[0] ?? null)
            }
          />
        </label>
      ) : null}

      {showSelect && selectOptions?.length ? (
        <Select
          variant="primary"
          options={selectOptions}
          value={selectValue}
          onValueChange={onSelectValueChange}
          placeholder={selectPlaceholder}
          className="w-full"
        />
      ) : null}

      {showLink ? (
        <PartInput
          type="url"
          value={linkValue}
          onValueChange={onLinkValueChange}
          placeholder={linkPlaceholder}
          trailingIcon
          icon={Globe}
          className="w-full"
        />
      ) : null}

      {description ? (
        <p className="text-xs-medium w-full text-[var(--gb-text-subtle)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
