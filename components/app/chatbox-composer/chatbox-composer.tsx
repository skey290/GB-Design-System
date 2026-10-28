"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chatbox, type ChatboxProps } from "@/components/ui/chatbox";
import { Chips } from "@/components/ui/chips";

/**
 * Chatbox(`components/ui/chatbox`)의 `-> Slot`에 담길 콘텐츠를 얹은 조합 컴포넌트.
 *
 * 아톰은 "파일을 고르는 것"까지만 담당하고, 고른 파일을 어떤 모습으로 보여줄지는
 * 여기서 결정한다 — 썸네일 행, 필터 chips 두 가지.
 */
export interface ChatboxComposerImage {
  src: string;
  alt?: string;
}

export type ChatboxComposerVariant = "default" | "image" | "chips";

const CHIP_LABELS = ["All", "Image", "Text"] as const;

interface ChatboxComposerSharedProps extends Omit<
  ChatboxProps,
  "children" | "onAttachFiles" | "accept" | "multiple"
> {
  /** 제어 컴포넌트로 사용할 때의 첨부 이미지 목록 */
  images?: ChatboxComposerImage[];
  /** 비제어 컴포넌트로 사용할 때의 초기 첨부 이미지 목록 (첨부 버튼으로 추가된 이미지가 여기에 쌓입니다) */
  defaultImages?: ChatboxComposerImage[];
  /** 이미지 우상단 X 버튼 클릭 시 호출됩니다 (인덱스 전달) */
  onRemoveImage?: (index: number) => void;
  /** 첨부 버튼 클릭 시 호출됩니다 */
  onAttach?: () => void;
}

export type ChatboxComposerProps = ChatboxComposerSharedProps &
  (
    | { variant?: "default" | "image" }
    | {
        variant: "chips";
        /** 제어 컴포넌트로 사용할 선택된 chip 인덱스 (0=All/1=Image/2=Text) */
        selectedChip?: number;
        /** 비제어 컴포넌트로 사용할 초기 선택 인덱스 */
        defaultSelectedChip?: number;
        /** chip 선택이 바뀔 때 호출됩니다 */
        onChipChange?: (index: number) => void;
      }
  );

/** 구현부 전용 평탄화 타입 — variant별로 갈라진 prop을 한 번에 destructure하기 위함. */
type ChatboxComposerInternalProps = ChatboxComposerSharedProps & {
  variant?: ChatboxComposerVariant;
  selectedChip?: number;
  defaultSelectedChip?: number;
  onChipChange?: (index: number) => void;
};

export function ChatboxComposer(props: ChatboxComposerProps) {
  const {
    variant = "default",
    images,
    defaultImages = [],
    onRemoveImage,
    onAttach,
    selectedChip,
    defaultSelectedChip = 0,
    onChipChange,
    disabled = false,
    ...chatboxProps
  } = props as ChatboxComposerInternalProps;

  const isImagesControlled = images !== undefined;
  const [uncontrolledImages, setUncontrolledImages] =
    React.useState<ChatboxComposerImage[]>(defaultImages);
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

  const handleAttachFiles = (files: File[]) => {
    onAttach?.();
    if (!isImagesControlled) {
      setUncontrolledImages((prev) => [
        ...prev,
        ...files.map((file) => ({
          src: URL.createObjectURL(file),
          alt: file.name,
        })),
      ]);
    }
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

  const showImages = currentImages.length > 0;
  const showChips = variant === "chips";

  return (
    <Chatbox
      {...chatboxProps}
      disabled={disabled}
      accept="image/*"
      multiple
      onAttachFiles={handleAttachFiles}
    >
      {showImages ? (
        <div className="flex w-full items-start gap-[var(--gb-spacing-2)]">
          {currentImages.map((image, index) => (
            <div key={index} className="relative shrink-0">
              {/* 82px: Figma 썸네일 크기, 매칭 토큰 없음 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt ?? ""}
                className="size-[82px] rounded-[var(--gb-radius-scale-md)] object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                aria-label="이미지 제거"
                className={cn(
                  "absolute flex size-[var(--gb-spacing-4)] items-center justify-center",
                  "rounded-[var(--gb-radius-scale-lg)]",
                  // 예외: Chatbox 전체가 다크여도 이 삭제 배지만 항상 라이트 고정
                  "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-color-neutral-200)]",
                  "bg-[var(--gb-color-white)]",
                  "-top-[4px] -right-[5px]",
                )}
              >
                <X
                  className="size-[var(--gb-spacing-4)] text-[var(--gb-color-neutral-950)]"
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
    </Chatbox>
  );
}
