import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { LUCIDE_SPRITE_MAP, type IconId } from "@/lib/sprite-icon";

const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap",
    "text-sm-medium",
    "outline-none transition-colors",
    "focus-visible:shadow-[var(--gb-shadow-focus-ring)]",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "h-[36px] gap-[var(--gb-spacing-2)] rounded-[var(--gb-radius-scale-lg)] px-[var(--gb-spacing-4)]",
          "bg-primary text-primary-foreground",
          "hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-text-static-white)] hover:opacity-[var(--gb-opacity-90)]",
          "active:bg-[var(--gb-background-mute)] active:text-[var(--gb-text-static-white)] active:opacity-[var(--gb-opacity-90)]",
          "disabled:border disabled:border-[var(--gb-border-overlay)] disabled:bg-[var(--gb-background-disabled)] disabled:text-[var(--gb-text-static-gray)]",
        ),
        mute: cn(
          "h-[36px] gap-[var(--gb-spacing-2)] rounded-[var(--gb-radius-scale-lg)] px-[var(--gb-spacing-4)]",
          "bg-[var(--gb-background-subtler)] text-[var(--gb-text-default)]",
          "hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-text-static-white)] hover:opacity-[var(--gb-opacity-90)]",
          "active:bg-[var(--gb-background-mute)] active:text-[var(--gb-text-static-white)] active:opacity-[var(--gb-opacity-90)]",
          "disabled:border disabled:border-[var(--gb-border-overlay)] disabled:bg-[var(--gb-background-disabled)] disabled:text-[var(--gb-text-static-gray)]",
        ),
        outline: cn(
          "h-[36px] gap-[var(--gb-spacing-2)] rounded-[var(--gb-radius-scale-lg)] px-[var(--gb-spacing-4)]",
          "border-[length:var(--gb-border-1)] border-border border-solid",
          "bg-background text-foreground",
          "hover:border-transparent hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-text-static-white)]",
          "active:border-transparent active:bg-[var(--gb-background-mute)] active:text-[var(--gb-text-static-white)]",
          "disabled:border-[var(--gb-border-overlay)] disabled:bg-[var(--gb-background-disabled)] disabled:text-[var(--gb-text-static-gray)]",
        ),
        link: cn(
          "h-[20px] gap-[var(--gb-spacing-2)] bg-transparent",
          // 밑줄은 텍스트가 아니라 컨테이너 하단 보더 — 후행 아이콘 아래까지 이어진다
          "border-b-[length:var(--gb-border-1)] border-b-[var(--gb-border-invert)] border-solid",
          "text-[var(--gb-text-bold)]",
          "hover:border-b-[var(--gb-border-mute-subtle)] hover:text-[var(--gb-text-subtle)]",
          "active:border-b-[var(--gb-border-mute-subtle)] active:text-[var(--gb-text-subtle)]",
          "disabled:border-b-[var(--gb-border-static-gray)] disabled:text-[var(--gb-text-static-gray)]",
        ),
        ghost: cn(
          "h-[36px] gap-[var(--gb-spacing-2)] rounded-[var(--gb-radius-scale-full)] px-[var(--gb-spacing-4)] py-[var(--gb-spacing-2)]",
          "bg-transparent text-[var(--gb-text-default)]",
          "hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-text-static-white)]",
          "active:bg-[var(--gb-background-mute)] active:text-[var(--gb-text-static-white)]",
          "disabled:bg-transparent disabled:text-[var(--gb-text-static-gray)]",
        ),
        icon: cn(
          "size-[36px] rounded-[var(--gb-radius-scale-lg)]",
          "border-[length:var(--gb-border-1)] border-border border-solid",
          "bg-background text-[var(--gb-icon-default)]",
          "hover:border-transparent hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-icon-static-white)]",
          "active:border-transparent active:bg-[var(--gb-background-mute)] active:text-[var(--gb-icon-static-white)]",
          "disabled:border-[var(--gb-border-overlay)] disabled:bg-[var(--gb-background-disabled)] disabled:text-[var(--gb-icon-static-gray)]",
        ),
        "icon-ghost": cn(
          "size-[36px] rounded-[var(--gb-radius-scale-full)]",
          "bg-transparent text-[var(--gb-icon-default)]",
          "hover:rounded-[var(--gb-radius-scale-lg)] hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-icon-static-white)]",
          "active:rounded-[var(--gb-radius-scale-lg)] active:bg-[var(--gb-background-mute)] active:text-[var(--gb-icon-static-white)]",
          "disabled:bg-transparent disabled:text-[var(--gb-icon-static-gray)]",
        ),
        "icon-rounded": cn(
          "size-[36px] rounded-[var(--gb-radius-scale-full)]",
          "bg-background text-[var(--gb-icon-default)]",
          "hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-icon-static-white)]",
          "active:bg-[var(--gb-background-mute)] active:text-[var(--gb-icon-static-white)]",
          "disabled:bg-transparent disabled:text-[var(--gb-icon-static-gray)]",
        ),
        google: cn(
          "h-[36px] gap-[var(--gb-spacing-1-5)] rounded-[var(--gb-radius-scale-lg)] px-[var(--gb-spacing-4)]",
          "border-[length:var(--gb-border-1)] border-[var(--gb-border-muted)] border-solid",
          "bg-[var(--gb-background-bolder)] text-[var(--gb-text-invert)]",
          "hover:border-transparent hover:bg-[var(--gb-background-mute)] hover:text-[var(--gb-text-static-white)]",
          "active:border-transparent active:bg-[var(--gb-background-mute)] active:text-[var(--gb-text-static-white)]",
          "disabled:border-[var(--gb-border-overlay)] disabled:bg-[var(--gb-background-disabled)] disabled:text-[var(--gb-text-static-gray)]",
        ),
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

/** 아이콘만 렌더링하는 variant — children 대신 `icon`을 씁니다. */
const ICON_ONLY_VARIANTS = ["icon", "icon-ghost", "icon-rounded"] as const;

/** `iconAfter` 슬롯이 정의된 variant. */
const TRAILING_ICON_VARIANTS = ["primary", "mute", "outline", "link"] as const;

const GOOGLE_ICON_ID: IconId = "google-icon";
const GOOGLE_LABEL = "Continue with Google";

function ButtonIcon({ id, className }: { id: IconId; className: string }) {
  const LucideIconComponent = (
    LUCIDE_SPRITE_MAP as Record<
      string,
      React.ComponentType<React.SVGProps<SVGSVGElement>> | undefined
    >
  )[id];

  if (LucideIconComponent) {
    return <LucideIconComponent className={className} aria-hidden="true" />;
  }

  return (
    <svg className={className} aria-hidden="true">
      <use href={`/icons.svg#${id}`} />
    </svg>
  );
}

export interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof buttonVariants> {
  /** 버튼 라벨 텍스트 (아이콘 전용 variant에서는 렌더링되지 않습니다) */
  children?: React.ReactNode;
  /** 아이콘 전용 variant(icon/icon-ghost/icon-rounded)에서 렌더링할 아이콘 id */
  icon?: IconId;
  /** 라벨 뒤에 렌더링할 아이콘 id (primary/mute/outline/link에서만 적용) */
  iconAfter?: IconId;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      children,
      icon = "circle-dashed-icon",
      iconAfter,
      disabled,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) {
    const resolvedVariant = variant ?? "primary";
    const isIconOnly = (ICON_ONLY_VARIANTS as readonly string[]).includes(
      resolvedVariant,
    );
    const isGoogle = resolvedVariant === "google";
    const showIconAfter =
      iconAfter !== undefined &&
      (TRAILING_ICON_VARIANTS as readonly string[]).includes(resolvedVariant);

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel ?? (isIconOnly ? icon : undefined)}
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      >
        {isIconOnly ? (
          <ButtonIcon id={icon} className="size-[16px] shrink-0" />
        ) : (
          <>
            {isGoogle && (
              <ButtonIcon
                id={GOOGLE_ICON_ID}
                className="size-[16px] shrink-0"
              />
            )}
            {isGoogle ? (children ?? GOOGLE_LABEL) : children}
            {showIconAfter && (
              <ButtonIcon
                id={iconAfter}
                className={cn(
                  "shrink-0",
                  resolvedVariant === "link" ? "size-[12px]" : "size-[16px]",
                )}
              />
            )}
          </>
        )}
      </button>
    );
  },
);
