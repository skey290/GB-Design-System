"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  cn(
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
    "size-[32px]",
  ),
  {
    variants: {
      variant: {
        image: "",
        initial:
          "border-[length:var(--gb-border-1)] border-[var(--gb-border-subtler)] bg-[var(--gb-background-default)]",
        icon: "border-[length:var(--gb-border-1)] border-[var(--gb-border-subtler)] bg-[var(--gb-background-default)]",
      },
      shape: {
        rounded: "rounded-[var(--gb-radius-scale-md)]",
        rectangle: "rounded-[var(--gb-radius-scale-none)]",
        circle: "rounded-[var(--gb-radius-scale-full)]",
      },
    },
    defaultVariants: {
      variant: "image",
      shape: "rounded",
    },
  },
);

export interface AvatarProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof avatarVariants> {
  /** variant="image"일 때 표시할 이미지 URL */
  src?: string;
  /** 이미지의 대체 텍스트이자, 폴백(초성/아이콘) 상태의 접근성 라벨로도 사용됩니다 */
  alt?: string;
  /** variant="initial"일 때 표시할 이니셜 텍스트 (Figma 예시: "S") */
  initials?: string;
}

/** `variant="image"`인데 `src`가 없거나 로드에 실패하면 `initials`로, 그것도
 * 없으면 기본 아이콘으로 폴백합니다. 모든 조합이 32px 고정 크기입니다. */
export function Avatar({
  variant = "image",
  shape = "rounded",
  src,
  alt = "",
  initials,
  className,
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = React.useState(false);

  let resolvedVariant: NonNullable<AvatarProps["variant"]> = variant ?? "image";
  if (resolvedVariant === "image" && (!src || imageFailed)) {
    resolvedVariant = initials ? "initial" : "icon";
  }
  if (resolvedVariant === "initial" && !initials) {
    resolvedVariant = "icon";
  }

  const isImage = resolvedVariant === "image";

  return (
    <div
      className={cn(
        avatarVariants({ variant: resolvedVariant, shape }),
        className,
      )}
      role={isImage ? undefined : "img"}
      aria-label={isImage ? undefined : alt || initials || "avatar"}
      {...props}
    >
      {isImage && (
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          onError={() => setImageFailed(true)}
        />
      )}
      {resolvedVariant === "initial" && (
        <span
          aria-hidden="true"
          className="text-sm-semi-bold text-[var(--gb-text-default)]"
        >
          {initials}
        </span>
      )}
      {resolvedVariant === "icon" && (
        <svg
          aria-hidden="true"
          className="size-[18px] text-[var(--gb-icon-default)]"
        >
          <use href="/icons.svg#user-filled-icon" />
        </svg>
      )}
    </div>
  );
}
