"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/sprite-icon";

import styles from "./chatbox.module.css";

/**
 * The root's children lay out as three flat siblings sharing one gap, matching Figma:
 * the slot (`children`) → the text input → the button row.
 *
 * Always renders dark (regardless of the site theme) — the root forces a `dark`
 * class so the semantic tokens underneath resolve to their dark values.
 */
export interface ChatboxProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "defaultValue" | "onChange" | "children"
> {
  /** Value when used as a controlled component */
  value?: string;
  /** Initial value when used as an uncontrolled component */
  defaultValue?: string;
  /** Called when the value changes */
  onValueChange?: (value: string) => void;
  /** Called when files are picked via the attach button */
  onAttachFiles?: (files: File[]) => void;
  /** File types the attach button accepts (native input's accept) */
  accept?: string;
  /** Lets the attach button pick multiple files at once */
  multiple?: boolean;
  /** Called when the send button is clicked */
  onSend?: () => void;
  /** Figma `Status=disabled` */
  disabled?: boolean;
  /** Slot above the text input (Figma `-> Slot`) — attachment previews, chips, etc. */
  children?: React.ReactNode;
  /** Whether to show the send button (Figma `Button`). The attach button is always shown regardless of this prop */
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
    // Enter sends, Shift+Enter inserts a newline (left as the default behavior). Doesn't send
    // when Enter is used to commit a composed character (e.g. Korean IME input).
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

  // So the box itself grows instead of showing a scrollbar when a newline is added,
  // recompute height to match the actual content height (scrollHeight) on every value change.
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [currentValue]);

  // Clicking anywhere in the box — not just on the text — should let you start typing
  // right away (padding, the gap between the slot and the textarea, the empty space
  // between the attach/send buttons, the margins between slot items, etc.). So every
  // click hands focus to the textarea unless it's on or inside a real interactive
  // element (button/link/input). Reacting only when the root itself is the target
  // would miss child elements that are "not the root but still empty space," like the
  // gap in the middle of the button row's justify-between layout.
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
      className={`dark ${styles.root}${className ? ` ${className}` : ""}`}
      data-disabled={disabled || undefined}
      onMouseDown={handleRootMouseDown}
    >
      {children}

      <label htmlFor={textareaId} className={styles.srOnly}>
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
        className={styles.textarea}
        {...rest}
      />

      <div className={styles.actionsRow}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className={styles.srOnly}
          tabIndex={-1}
          onChange={handleFilesSelected}
        />
        <Button
          type="button"
          variant="icon"
          icon={<Icon id="plus-icon" />}
          aria-label="첨부"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        />
        {showButton && (
          <Button
            type="button"
            variant="icon"
            icon={<Icon id="sparkles-icon" />}
            aria-label="전송"
            disabled={disabled}
            onClick={handleSend}
          />
        )}
      </div>
    </div>
  );
}
