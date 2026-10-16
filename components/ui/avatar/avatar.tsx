"use client";

import * as React from "react";

import styles from "./avatar.module.css";

export type AvatarVariant = "image" | "initial" | "icon";
export type AvatarShape = "rounded" | "rectangle" | "circle";

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  variant?: AvatarVariant;
  shape?: AvatarShape;
  /** Image URL to display when variant="image" */
  src?: string;
  /** Alt text for the image, also used as the accessibility label for the fallback (initials/icon) state */
  alt?: string;
  /** Initials text to display when variant="initial" (Figma example: "S") */
  initials?: string;
}

/** When `variant="image"` but `src` is missing or fails to load, falls back to `initials`,
 * and to the default icon if that's missing too. Every combination is a fixed 32px size. */
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
      data-variant={resolvedVariant}
      data-shape={shape}
      className={className ? `${styles.root} ${className}` : styles.root}
      role={isImage ? undefined : "img"}
      aria-label={isImage ? undefined : alt || initials || "avatar"}
      {...props}
    >
      {isImage && (
        <img
          src={src}
          alt={alt}
          className={styles.image}
          onError={() => setImageFailed(true)}
        />
      )}
      {resolvedVariant === "initial" && (
        <span aria-hidden="true" className={styles.initials}>
          {initials}
        </span>
      )}
      {resolvedVariant === "icon" && (
        <svg aria-hidden="true" className={styles.icon}>
          <use href="/icons.svg#user-filled-icon" />
        </svg>
      )}
    </div>
  );
}
