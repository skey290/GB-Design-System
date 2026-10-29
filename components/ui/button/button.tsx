import * as React from "react";

import { ButtonGroupContext } from "@/components/ui/button-group/context";

import styles from "./button.module.css";

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
>;

/**
 * Required when nothing visible names the control: `aria-label`, or
 * `aria-labelledby` pointing at text already on screen. Either one satisfies
 * the type; omitting both is a compile error.
 */
export type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-labelledby": string; "aria-label"?: string };

/** Figma `Style=primary | mute | outline | link` — a label, optionally followed by an icon. */
export type TextButtonProps = NativeButtonProps & {
  variant?: "primary" | "mute" | "outline" | "link";
  children: React.ReactNode;
  /** Icon rendered after the label — 16px, 12px for `link`. Any SVG, colored with currentColor. */
  icon?: React.ReactNode;
  /** Visual state marking this as the currently selected item within a group (keeps the same look as :active). Default false */
  isSelected?: boolean;
};

/** Figma `Style=ghost` — a label with no icon slot in Figma. */
export type PlainButtonProps = NativeButtonProps & {
  variant: "ghost";
  children: React.ReactNode;
  icon?: undefined;
  isSelected?: boolean;
};

/** Figma `Type=icon`, `Style=icon | icon-ghost | icon-rounded` — a single icon, no visible label. */
export type IconButtonProps = NativeButtonProps &
  AccessibleName & {
    variant: "icon" | "icon-ghost" | "icon-rounded";
    icon: React.ReactNode;
    children?: undefined;
    isSelected?: boolean;
  };

/** Figma `Type=google` — the branded button. Label and icon are fixed in Figma. */
export type BrandButtonProps = NativeButtonProps & {
  variant: "google";
  children?: React.ReactNode;
  icon?: undefined;
  isSelected?: boolean;
};

export type ButtonProps =
  TextButtonProps | PlainButtonProps | IconButtonProps | BrandButtonProps;

const ICON_ONLY_VARIANTS = ["icon", "icon-ghost", "icon-rounded"] as const;

const BRAND_VARIANTS = {
  google: { label: "Continue with Google", iconId: "google-icon" },
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      className,
      variant,
      children,
      icon,
      disabled,
      isSelected = false,
      ...rest
    } = props;

    const group = React.useContext(ButtonGroupContext);
    const resolvedDisabled = disabled ?? group.disabled;
    const resolvedVariant = variant ?? "primary";
    const isIconOnly = (ICON_ONLY_VARIANTS as readonly string[]).includes(
      resolvedVariant,
    );
    const brand =
      BRAND_VARIANTS[resolvedVariant as keyof typeof BRAND_VARIANTS];
    const contentType = brand ? "brand" : isIconOnly ? "icon" : "text";
    const label = brand ? (children ?? brand.label) : children;

    return (
      <button
        ref={ref}
        type="button"
        disabled={resolvedDisabled}
        data-variant={resolvedVariant}
        data-selected={isSelected || undefined}
        className={className ? `${styles.root} ${className}` : styles.root}
        {...rest}
      >
        {brand && (
          <svg aria-hidden="true">
            <use href={`/icons.svg#${brand.iconId}`} />
          </svg>
        )}
        {contentType === "icon" ? icon : label}
        {contentType === "text" && icon}
      </button>
    );
  },
);
