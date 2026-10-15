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
  /** 전송 버튼 표시 여부 (Figma `Button`). 첨부 버튼은 이 prop과 무관하게 항상 노출 */
  showButton?: boolean;
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
  showButton = true,
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter는 전송, Shift+Enter는 줄바꿈(기본 동작 그대로 둔다). 한글 등
    // 조합 문자를 Enter로 확정하는 경우는 전송하지 않는다.
    if (
      event.key !== "Enter" ||
      event.nativeEvent.isComposing ||
      event.shiftKey
    )
      return;
    event.preventDefault();
    handleSend();
  };

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // 줄바꿈이 들어가도 스크롤바 대신 박스 자체가 늘어나도록, 값이 바뀔
  // 때마다 실제 내용 높이(scrollHeight)에 맞춰 height를 다시 계산한다.
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [currentValue]);

  // 텍스트 글자 위가 아니라 박스 안 어디를 눌러도(패딩, 슬롯과 textarea 사이
  // gap, 첨부/전송 버튼 사이의 빈 공간, 슬롯 안 아이템 사이 여백 등) 바로
  // 타이핑할 수 있어야 한다 — 클릭이 실제 인터랙티브 엘리먼트(버튼/링크/인풋)
  // 위나 그 안이 아닌 이상 전부 textarea로 포커스를 넘긴다. 루트 자신이
  // 타깃일 때만 반응하는 식으로는 button 행의 justify-between 가운데 빈
  // 공간처럼 "root는 아니지만 여전히 빈 공간인" 자식 엘리먼트를 놓친다.
  const handleRootMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, input, textarea, a, [role='button']")) return;
    event.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.focus();
    if (currentValue.length === 0) {
      textarea.setSelectionRange(0, 0);
    }
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
        "dark",
        "flex w-[700px] flex-col items-start",
        "gap-[var(--gb-spacing-7)]",
        "rounded-[var(--gb-radius-scale-2xl)] p-[var(--gb-spacing-4)]",
        "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-default)]",
        "bg-[var(--gb-background-default)]",
        "hover:border-[var(--gb-border-static-gray)] hover:shadow-[var(--gb-shadow-focus-ring)]",
        "focus-within:border-[var(--gb-border-static-gray)] focus-within:shadow-[var(--gb-shadow-focus-ring)]",
        disabled && "pointer-events-none",
        className,
      )}
      onMouseDown={handleRootMouseDown}
    >
      {children}

      <label htmlFor={textareaId} className="sr-only">
        {placeholder}
      </label>
      <textarea
        id={textareaId}
        ref={textareaRef}
        value={currentValue}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "text-xs-regular w-full resize-none border-0 bg-transparent p-0",
          "text-[var(--gb-text-default)] outline-none",
          "placeholder:text-[var(--gb-text-subtle)] focus:placeholder:opacity-0",
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
        {showButton && (
          <Button
            type="button"
            variant="icon"
            icon="sparkles-icon"
            aria-label="전송"
            disabled={disabled}
            onClick={handleSend}
          />
        )}
      </div>
    </div>
  );
}
