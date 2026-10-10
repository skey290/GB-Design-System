"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * 루트 자식은 Figma와 동일하게 슬롯(`children`) → 텍스트 입력 → 버튼 행 세 개가
 * 한 레벨에 평평하게 놓이고 gap 하나를 공유한다.
 *
 * 항상 다크로 렌더링(사이트 테마 무관) — 루트에 `dark` 클래스를 강제해 하위
 * 시맨틱 토큰이 다크 값으로 resolve되게 한다.
 */
export interface ChatboxProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "defaultValue" | "onChange" | "children"
> {
  /** 제어 컴포넌트로 사용할 때의 값 */
  value?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기 값 */
  defaultValue?: string;
  /** 값이 바뀔 때 호출됩니다 */
  onValueChange?: (value: string) => void;
  /** 첨부 버튼으로 파일을 고르면 호출됩니다 */
  onAttachFiles?: (files: File[]) => void;
  /** 첨부 버튼이 받을 파일 형식 (네이티브 input의 accept) */
  accept?: string;
  /** 첨부 버튼으로 여러 파일을 한 번에 고를 수 있게 합니다 */
  multiple?: boolean;
  /** 전송 버튼 클릭 시 호출됩니다 */
  onSend?: () => void;
  /** Figma `Status=disabled` */
  disabled?: boolean;
  /** 텍스트 입력 영역 위 슬롯 (Figma `-> Slot`) — 첨부 미리보기, chips 등 */
  children?: React.ReactNode;
}

export function Chatbox({
  value,
  defaultValue = "",
  onValueChange,
  onAttachFiles,
  accept,
  multiple = false,
  onSend,
  disabled = false,
  placeholder = "Please share your ideas.",
  className,
  id,
  children,
  ...rest
}: ChatboxProps) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  const handleSend = () => {
    onSend?.();
    if (!isControlled) {
      setUncontrolledValue("");
    }
    onValueChange?.("");
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onAttachFiles?.(Array.from(files));
    }
    event.target.value = "";
  };

  return (
    <div
      className={cn(
        // 항상 다크: 사이트 테마와 무관하게 하위 시맨틱 토큰을 다크 값으로 강제
        "dark",
        // 700px: Figma 예시 프레임 폭을 컨테이너 최대폭으로만 적용, 실제 폭은
        // 반응형(w-full). 매칭 토큰이 없어 고정값을 쓴다.
        "flex w-full max-w-[700px] flex-col items-start",
        "gap-[var(--gb-spacing-7)]",
        "rounded-[var(--gb-radius-scale-2xl)] p-[var(--gb-spacing-4)]",
        "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-default)]",
        "bg-[var(--gb-background-default)]",
        // Status=active → hover 또는 내부 textarea 포커스에 대한 링 (focus-within)
        "hover:border-[var(--gb-border-static-gray)] hover:shadow-[var(--gb-shadow-focus-ring)]",
        "focus-within:border-[var(--gb-border-static-gray)] focus-within:shadow-[var(--gb-shadow-focus-ring)]",
        disabled && "pointer-events-none",
        className,
      )}
    >
      {children}

      <label htmlFor={textareaId} className="sr-only">
        {placeholder}
      </label>
      <textarea
        id={textareaId}
        value={currentValue}
        disabled={disabled}
        onChange={handleChange}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "text-xs-regular w-full resize-none border-0 bg-transparent p-0",
          "text-[var(--gb-text-default)] outline-none",
          "placeholder:text-[var(--gb-text-subtle)]",
          "disabled:cursor-not-allowed disabled:placeholder:text-[var(--gb-text-static-gray)]",
        )}
        {...rest}
      />

      <div className="flex w-full items-center justify-between">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          tabIndex={-1}
          onChange={handleFilesSelected}
        />
        <Button
          type="button"
          variant="icon"
          icon="plus-icon"
          aria-label="첨부"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        />
        <Button
          type="button"
          variant="icon"
          icon="sparkles-icon"
          aria-label="전송"
          disabled={disabled}
          onClick={handleSend}
        />
      </div>
    </div>
  );
}
