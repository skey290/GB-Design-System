"use client";

import type * as React from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./PostingModal.module.css";

export interface ImageStyleOption {
  id: string;
  label: string;
  thumbnailSrc: string;
}

/**
 * Figma `Part/Asset Gallery` → `image style option` (node `8828:17517`) fixes
 * this at exactly these 4 styles, so this is a closed list, not a prop.
 */
export const IMAGE_STYLE_OPTIONS: readonly ImageStyleOption[] = [
  {
    id: "artistic-duotone",
    label: "Artistic Duotone",
    thumbnailSrc: "/images/styles/artistic-duotone.jpg",
  },
  {
    id: "monochrome",
    label: "Monochrome",
    thumbnailSrc: "/images/styles/monochrome.jpg",
  },
  {
    id: "editorial",
    label: "Editorial",
    thumbnailSrc: "/images/styles/editorial.jpg",
  },
  {
    id: "deep-chroma",
    label: "Deep Chroma",
    thumbnailSrc: "/images/styles/deep-chroma.jpg",
  },
];

interface ImageStyleCardProps {
  label: string;
  thumbnailSrc: string;
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

/**
 * One card in PostingModal's "Image style" row (Figma `Part/Asset Gallery`,
 * `Style=style card compact`). One of a mutually exclusive set, so the root
 * is `role="radio"` inside the row's `role="radiogroup"`, not a checkbox.
 */
export function ImageStyleCard({
  label,
  thumbnailSrc,
  isSelected,
  onSelect,
  className,
}: ImageStyleCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      aria-label={label}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={cn(styles.imageStyleCard, className)}
    >
      <div className={styles.imageStyleCardImage}>
        <div className={styles.imageStyleCardImageClip}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumbnailSrc} alt="" className={styles.imageStyleCardImg} />
        </div>
        <span aria-hidden="true" className={styles.imageStyleCardRing} />
        <span aria-hidden="true" className={styles.imageStyleCardCheckbox}>
          <Check
            aria-hidden="true"
            className={styles.imageStyleCardCheckIcon}
          />
        </span>
      </div>
      <p className={styles.imageStyleCardTitle}>{label}</p>
    </div>
  );
}

export interface ReferenceThumbnailProps {
  src: string;
  alt?: string;
  /** Called when the thumbnail's remove (×) button is clicked */
  onRemove?: () => void;
  className?: string;
}

/**
 * Bare 104×104 thumbnail — the image box portion of `ImageStyleCard`
 * (same rounded-square shape and clip), without its selection ring or
 * checkbox. Used by PostingModal's "Reference" row, which only ever
 * displays already-picked images with no selection interaction, just a
 * remove button for taking one back out.
 */
export function ReferenceThumbnail({
  src,
  alt = "",
  onRemove,
  className,
}: ReferenceThumbnailProps) {
  return (
    <div className={cn(styles.referenceThumbnailWrap, className)}>
      <div className={styles.imageStyleCardImage}>
        <div className={styles.imageStyleCardImageClip}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className={styles.imageStyleCardImg} />
        </div>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove reference image"
          className={styles.referenceRemoveButton}
        >
          <X aria-hidden="true" className={styles.referenceRemoveIcon} />
        </button>
      )}
    </div>
  );
}
