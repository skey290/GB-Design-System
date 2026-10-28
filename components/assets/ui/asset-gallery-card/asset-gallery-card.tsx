"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "@/lib/sprite-icon";

import styles from "./asset-gallery-card.module.css";

export interface AssetGalleryCardProps {
  /** Image URL. Present renders the filled card, absent renders the empty upload card. */
  image?: string;
  /** Alt text for the image. */
  alt?: string;
  /** Date label shown on the filled card. Omitted skips the label. */
  date?: string;
  /** Called with the selected file when uploading via the empty card. */
  onUpload?: (file: File) => void;
  /** Called when the filled card's "..." menu button is clicked. */
  onOpenMenu?: () => void;
  className?: string;
}

export function AssetGalleryCard({
  image,
  alt = "",
  date,
  onUpload,
  onOpenMenu,
  className,
}: AssetGalleryCardProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload?.(file);
    }
    event.target.value = "";
  };

  if (!image) {
    return (
      <label
        data-slot="asset-gallery-card"
        className={cn(styles.root, styles.empty, className)}
      >
        <span className={styles.plusCircle}>
          <Icon id="plus-icon" className={styles.plusIcon} />
        </span>
        <span className={styles.uploadText}>Upload Your Image</span>
        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleFileChange}
        />
      </label>
    );
  }

  return (
    <div
      data-slot="asset-gallery-card"
      className={cn(styles.root, styles.filled, className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={alt} className={styles.image} />
      {date ? <span className={styles.dateLabel}>{date}</span> : null}
      <button
        type="button"
        aria-label="More options"
        className={styles.menuButton}
        onClick={onOpenMenu}
      >
        <Icon id="ellipsis-icon" className={styles.menuIcon} />
      </button>
    </div>
  );
}
