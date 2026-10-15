"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * 라벨 + 글자수 카운터 + 커스텀 리사이즈 그립을 갖춘 텍스트 영역.
 * 스펙은 `docs/components/textarea.md` 참고.
 */
const MIN_HEIGHT = 80;

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "defaultValue" | "onChange" | "disabled"
> {
  /** 필드 위에 표시할 라벨 텍스트 (Figma 상단 텍스트, 예: "Tell me about your interest.") */
  label?: string;
  /** 제어 컴포넌트로 사용할 때의 값 */
  value?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기 값 */
  defaultValue?: string;
  /** 값이 바뀔 때 호출됩니다 */
  onValueChange?: (value: string) => void;
  /**
   * 최대 입력 글자 수. 지정하면 하단에 `{남은 글자 수} characters left`
   * 카운터가 자동으로 렌더링됩니다(Figma 예시: "1000 characters left").
   * 지정하지 않으면 카운터를 렌더링하지 않습니다.
   */
  maxLength?: number;
  /** 실제 DOM `<textarea>`에 연결할 ref. 리사이즈 그립이 쓰는 내부 ref와 함께 설정됩니다 */
  ref?: React.Ref<HTMLTextAreaElement>;
}

export function Textarea({
  ref,
  label,
  value,
  defaultValue = "",
  onValueChange,
  maxLength,
  className,
  id,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // 리사이즈 그립이 내부 ref로 높이를 직접 만지므로, 외부 ref와 함께 채운다.
  const setTextareaRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const startResize = (event: React.PointerEvent<HTMLSpanElement>) => {
    const element = textareaRef.current;
    if (!element || event.button !== 0) return;
    event.preventDefault();

    const startY = event.clientY;
    const startHeight = element.offsetHeight;

    const handleMove = (moveEvent: PointerEvent) => {
      const next = Math.max(
        MIN_HEIGHT,
        startHeight + moveEvent.clientY - startY,
      );
      element.style.height = `${next}px`;
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

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

  const charactersLeft =
    maxLength !== undefined ? maxLength - currentValue.length : null;

  return (
    <div
      className={cn(
        "flex w-[725px] flex-col items-start gap-[var(--gb-spacing-3)]",
        className,
      )}
    >
      {label ? (
        <label
          htmlFor={textareaId}
          className="text-sm-medium w-full text-[var(--foreground)] select-none"
        >
          {label}
        </label>
      ) : null}
      <div className="relative w-full">
        <textarea
          ref={setTextareaRef}
          id={textareaId}
          value={currentValue}
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            "text-sm-regular block w-full resize-none rounded-[var(--gb-radius-scale-md)]",
            "min-h-[80px]",
            "border-[length:var(--gb-border-1)] border-solid border-[var(--border)]",
            "bg-[var(--background)] text-[var(--foreground)]",
            "pt-[var(--gb-spacing-2)] pr-[var(--gb-spacing-2)] pb-[var(--gb-spacing-2)] pl-[var(--gb-spacing-3)]",
            "outline-none transition-colors placeholder:text-[var(--muted-foreground)]",
            "focus-visible:border-[var(--ring)] focus-visible:shadow-[var(--gb-shadow-focus-ring)]",
          )}
          {...props}
        />
        <span
          data-slot="textarea-resize-handle"
          aria-hidden="true"
          onPointerDown={startResize}
          className={cn(
            "absolute right-[var(--gb-spacing-2)] bottom-[var(--gb-spacing-2)]",
            "cursor-ns-resize text-[var(--gb-icon-default)]",
          )}
        >
          <svg className="size-[7px]">
            <use href="/icons.svg#handle-icon" />
          </svg>
        </span>
      </div>
      {charactersLeft !== null ? (
        <span
          data-slot="textarea-counter"
          className="text-xs-regular w-full text-[var(--muted-foreground)]"
        >
          {charactersLeft} characters left
        </span>
      ) : null}
    </div>
  );
}
