"use client";

import * as React from "react";
import { ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chips } from "@/components/ui/chips";

/**
 * Figma "Chatbox" (node-id 7219:5418). `Style` variant → `variant` prop
 * (DOM `style`과 이름 충돌 방지).
 *
 * 항상 다크로 렌더링(사이트 테마 무관) — 루트에 `dark` 클래스를 강제해
 * 하위 시맨틱 토큰이 다크 값으로 resolve되게 한다. 단, 이미지 삭제(X)
 * 배지만 예외적으로 라이트 고정 primitive를 직접 사용한다(Figma 지정값).
 *
 * `images`/`defaultImages`는 `variant`와 무관하게 항상 표시 가능 —
 * 첨부 버튼으로 추가된 이미지는 variant 값과 상관없이 보여야 하기 때문에
 * `ChatboxSharedProps`에 둔다. `selectedChip`/`selectedSentenceOption`은
 * 각각 `variant="chip"`/`"sentence-option"`에서만 의미가 있어 discriminated
 * union으로 분리한다(Calendar의 `mode` 패턴과 동일).
 */
export interface ChatboxImage {
  src: string;
  alt?: string;
}

export type ChatboxVariant = "default" | "image" | "chip" | "sentence-option";

const CHIP_LABELS = ["All", "Image", "Text"] as const;

const SENTENCE_OPTION_LABELS = [
  "I would like to change Asset Image",
  "I would like to change Short Text (One Liner)",
  "I would like to change Long Text (Description)",
] as const;

interface ChatboxSharedProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "defaultValue" | "onChange"
> {
  /** 제어 컴포넌트로 사용할 때의 첨부 이미지 목록 */
  images?: ChatboxImage[];
  /** 비제어 컴포넌트로 사용할 때의 초기 첨부 이미지 목록 (첨부 버튼으로 추가된 이미지가 여기에 쌓입니다) */
  defaultImages?: ChatboxImage[];
  /** 이미지 우상단 X 버튼 클릭 시 호출됩니다 (인덱스 전달) */
  onRemoveImage?: (index: number) => void;
  /** 제어 컴포넌트로 사용할 때의 값 */
  value?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기 값 */
  defaultValue?: string;
  /** 값이 바뀔 때 호출됩니다 */
  onValueChange?: (value: string) => void;
  /** "+" 첨부 버튼 클릭 시 호출됩니다 */
  onAttach?: () => void;
  /** 전송(sparkles) 버튼 클릭 시 호출됩니다 */
  onSend?: () => void;
  /** Figma `Status=disabled` */
  disabled?: boolean;
}

export type ChatboxProps = ChatboxSharedProps &
  (
    | { variant?: "default" | "image" }
    | {
        variant: "chip";
        /** 제어 컴포넌트로 사용할 선택된 chip 인덱스 (0=All/1=Image/2=Text) */
        selectedChip?: number;
        /** 비제어 컴포넌트로 사용할 초기 선택 인덱스 */
        defaultSelectedChip?: number;
        /** chip 선택이 바뀔 때 호출됩니다 */
        onChipChange?: (index: number) => void;
      }
    | {
        variant: "sentence-option";
        /** 제어 컴포넌트로 사용할 선택된 행 인덱스 */
        selectedSentenceOption?: number;
        /** 비제어 컴포넌트로 사용할 초기 선택 인덱스 */
        defaultSelectedSentenceOption?: number;
        /** sentence option 선택이 바뀔 때 호출됩니다 */
        onSentenceOptionChange?: (index: number) => void;
      }
  );

/** 구현부 전용 평탄화 타입 — variant별로 갈라진 prop을 한 번에 destructure하기 위함. */
type ChatboxInternalProps = ChatboxSharedProps & {
  variant?: ChatboxVariant;
  selectedChip?: number;
  defaultSelectedChip?: number;
  onChipChange?: (index: number) => void;
  selectedSentenceOption?: number;
  defaultSelectedSentenceOption?: number;
  onSentenceOptionChange?: (index: number) => void;
};

export function Chatbox(props: ChatboxProps) {
  const {
    variant = "default",
    images,
    defaultImages = [],
    onRemoveImage,
    selectedChip,
    defaultSelectedChip = 0,
    onChipChange,
    selectedSentenceOption,
    defaultSelectedSentenceOption = 0,
    onSentenceOptionChange,
    value,
    defaultValue = "",
    onValueChange,
    onAttach,
    onSend,
    disabled = false,
    placeholder = "Please share your ideas.",
    className,
    id,
    ...rest
  } = props as ChatboxInternalProps;
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

  const isImagesControlled = images !== undefined;
  const [uncontrolledImages, setUncontrolledImages] =
    React.useState<ChatboxImage[]>(defaultImages);
  const currentImages = isImagesControlled ? images : uncontrolledImages;

  const handleRemoveImage = (index: number) => {
    if (!isImagesControlled) {
      setUncontrolledImages((prev) => {
        const removed = prev[index];
        if (removed?.src.startsWith("blob:")) {
          URL.revokeObjectURL(removed.src);
        }
        return prev.filter((_, i) => i !== index);
      });
    }
    onRemoveImage?.(index);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
    onAttach?.();
  };

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && !isImagesControlled) {
      const newImages: ChatboxImage[] = Array.from(files).map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));
      setUncontrolledImages((prev) => [...prev, ...newImages]);
    }
    event.target.value = "";
  };

  const isChipControlled = selectedChip !== undefined;
  const [uncontrolledChip, setUncontrolledChip] =
    React.useState(defaultSelectedChip);
  const currentChip = isChipControlled ? selectedChip : uncontrolledChip;

  const handleChipClick = (index: number) => {
    if (!isChipControlled) {
      setUncontrolledChip(index);
    }
    onChipChange?.(index);
  };

  const isSentenceControlled = selectedSentenceOption !== undefined;
  const [uncontrolledSentence, setUncontrolledSentence] = React.useState(
    defaultSelectedSentenceOption,
  );
  const currentSentence = isSentenceControlled
    ? selectedSentenceOption
    : uncontrolledSentence;

  const handleSentenceClick = (index: number) => {
    if (!isSentenceControlled) {
      setUncontrolledSentence(index);
    }
    onSentenceOptionChange?.(index);
  };

  const showImages = currentImages.length > 0;
  const showChips = variant === "chip";
  const showSentenceOptions = variant === "sentence-option";
  const showAttachmentBlock = showImages || showChips || showSentenceOptions;

  return (
    <div
      className={cn(
        // 항상 다크: 사이트 테마와 무관하게 하위 시맨틱 토큰을 다크 값으로 강제
        "dark",
        // 700px: Figma 예시 프레임 폭(w-[700px] max-w-[700px])을 컨테이너 최대폭으로만
        // 적용, 실제 폭은 반응형(w-full). 매칭 토큰 없어 근사/고정값 사용 (Slider 435px 선례).
        "flex w-full max-w-[700px] flex-col items-start",
        "rounded-[var(--gb-radius-scale-2xl)] p-[var(--gb-spacing-4)]",
        "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-default)]",
        "bg-[var(--gb-background-default)]",
        showAttachmentBlock
          ? "gap-[var(--gb-spacing-4)]"
          : "gap-[var(--gb-spacing-11)]",
        // Status=active → hover 또는 내부 textarea 포커스에 대한 링 (focus-within)
        "hover:border-[var(--gb-border-static-gray)] hover:shadow-[var(--gb-shadow-focus-ring)]",
        "focus-within:border-[var(--gb-border-static-gray)] focus-within:shadow-[var(--gb-shadow-focus-ring)]",
        disabled && "pointer-events-none opacity-[var(--gb-opacity-50)]",
        className,
      )}
    >
      {showImages ? (
        <div className="flex w-full items-start gap-[var(--gb-spacing-2)]">
          {currentImages.map((image, index) => (
            <div key={index} className="relative shrink-0">
              {/* 81px: Figma 예시 썸네일 크기, 매칭 토큰 없음 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt ?? ""}
                className="size-[81px] rounded-[var(--gb-radius-scale-md)] object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                aria-label="이미지 제거"
                className={cn(
                  "absolute flex size-[var(--gb-spacing-4)] items-center justify-center",
                  "rounded-[var(--gb-radius-scale-lg)]",
                  // 예외: 컴포넌트 전체가 다크여도 이 삭제 배지만 항상 라이트 고정
                  // (스크린샷 실측, 위 컴포넌트 doc 참고)
                  "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-color-neutral-200)]",
                  "bg-[var(--gb-color-white)]",
                  // Figma 예시 오프셋(-5px/-5.34px), 매칭 토큰 없어 근사치 사용
                  "-top-1.5 -right-1.5",
                )}
              >
                <X
                  className="size-[var(--gb-spacing-2)] text-[var(--gb-color-neutral-950)]"
                  aria-hidden="true"
                />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {showChips ? (
        <div className="flex items-start gap-[var(--gb-spacing-2)]">
          {CHIP_LABELS.map((label, index) => (
            <Chips
              key={label}
              type="button"
              variant="secondary"
              selected={currentChip === index}
              disabled={disabled}
              onClick={() => handleChipClick(index)}
            >
              {label}
            </Chips>
          ))}
        </div>
      ) : null}

      {showSentenceOptions ? (
        <div className="flex w-full flex-col gap-[var(--gb-spacing-2)]">
          {SENTENCE_OPTION_LABELS.map((label, index) => {
            const isSelected = currentSentence === index;
            return (
              <button
                key={label}
                type="button"
                disabled={disabled}
                aria-pressed={isSelected}
                onClick={() => handleSentenceClick(index)}
                className={cn(
                  "flex h-[36px] w-full items-center justify-between gap-[var(--gb-spacing-2)]",
                  "rounded-[var(--gb-radius-scale-lg)] px-[var(--gb-spacing-4)]",
                  "text-sm-medium text-left transition-colors",
                  "border-[length:var(--gb-border-1)] border-solid",
                  isSelected
                    ? "border-transparent bg-[var(--gb-background-static-gray)] text-[var(--gb-text-static-white)]"
                    : "border-[var(--gb-border-default)] bg-[var(--gb-background-default)] text-[var(--gb-text-default)]",
                  "disabled:pointer-events-none disabled:border-[var(--gb-border-overlay)] disabled:bg-[var(--gb-background-disabled)] disabled:text-[var(--gb-text-static-gray)]",
                )}
              >
                <span className="truncate">{label}</span>
                <ChevronRight
                  className="size-[var(--gb-spacing-4)] shrink-0"
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="flex w-full flex-col gap-[var(--gb-spacing-11)]">
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
            "focus:placeholder:opacity-0",
            "disabled:cursor-not-allowed",
          )}
          {...rest}
        />
        <div
          className={cn(
            "flex w-full items-center justify-between rounded-[var(--gb-radius-scale-full)]",
            // Figma의 drop-shadow(0 1px 1px rgba(0,0,0,0.1))는 매칭 토큰이 없어
            // 가장 가까운 --shadow-xs로 근사
            "shadow-[var(--gb-shadow-xs)]",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
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
            onClick={handleAttachClick}
            className="disabled:border-[var(--gb-border-overlay)] disabled:bg-[var(--gb-background-disabled)]"
          />
          <Button
            type="button"
            variant="icon"
            icon="sparkles-icon"
            aria-label="전송"
            disabled={disabled}
            onClick={handleSend}
            className="disabled:border-[var(--gb-border-overlay)] disabled:bg-[var(--gb-background-disabled)]"
          />
        </div>
      </div>
    </div>
  );
}
