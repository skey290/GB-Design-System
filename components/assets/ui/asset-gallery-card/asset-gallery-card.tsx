"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Icon } from "@/lib/sprite-icon";
import { Select, type SelectOption } from "@/components/ui/select";

import styles from "./asset-gallery-card.module.css";

export type { SelectOption as AssetGalleryCardMenuOption };

const MENU_HOVER_CLOSE_DELAY = 150;

export interface AssetGalleryCardProps {
  /** Image URL. Present renders the filled card, absent renders the empty upload card. */
  image?: string;
  /** Alt text for the image. */
  alt?: string;
  /** Date label shown on the filled card. Omitted skips the label. */
  date?: string;
  /** Called with the selected file when uploading via the empty card. */
  onUpload?: (file: File) => void;
  /** Filled card's "..." dropdown items. Omitted hides the trigger. Ignored when `isSelected` is given. */
  menuOptions?: SelectOption[];
  /** Called with the selected option's value when a menu item is chosen. */
  onSelectMenuOption?: (value: string) => void;
  /** Checked state. Passing it (even `false`) switches the filled card into the selectable type (Figma `Style=selectable card`). */
  isSelected?: boolean;
  /** Called with the next checked state when a selectable card is clicked or toggled via keyboard. */
  onSelectedChange?: (selected: boolean) => void;
  className?: string;
}

export function AssetGalleryCard({
  image,
  alt = "",
  date,
  onUpload,
  menuOptions,
  onSelectMenuOption,
  isSelected,
  onSelectedChange,
  className,
}: AssetGalleryCardProps) {
  const isSelectable = isSelected !== undefined;

  const toggleSelected = () => onSelectedChange?.(!isSelected);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuCloseTimeoutRef =
    React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(menuCloseTimeoutRef.current), []);
  const openMenu = () => {
    clearTimeout(menuCloseTimeoutRef.current);
    setMenuOpen(true);
  };
  const scheduleCloseMenu = () => {
    clearTimeout(menuCloseTimeoutRef.current);
    menuCloseTimeoutRef.current = setTimeout(
      () => setMenuOpen(false),
      MENU_HOVER_CLOSE_DELAY,
    );
  };

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
      className={cn(
        styles.root,
        styles.filled,
        isSelectable && styles.selectable,
        className,
      )}
      role={isSelectable ? "checkbox" : undefined}
      aria-checked={isSelectable ? isSelected : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      onClick={isSelectable ? toggleSelected : undefined}
      onKeyDown={
        isSelectable
          ? (event) => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                toggleSelected();
              }
            }
          : undefined
      }
    >
      <div className={styles.imageClip}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} className={styles.image} />
      </div>
      <span aria-hidden="true" className={styles.hoverRing} />
      {date ? <span className={styles.dateLabel}>{date}</span> : null}
      {isSelectable ? (
        <span aria-hidden="true" className={styles.checkboxIndicator}>
          <Check aria-hidden="true" className={styles.checkIcon} />
        </span>
      ) : menuOptions && menuOptions.length > 0 ? (
        <Select
          variant="icon-ghost"
          icon="ellipsis-icon"
          options={menuOptions}
          onValueChange={onSelectMenuOption}
          className={styles.menuTrigger}
          open={menuOpen}
          onOpenChange={(next) => (next ? openMenu() : scheduleCloseMenu())}
          onTriggerMouseLeave={scheduleCloseMenu}
          onContentMouseEnter={openMenu}
          onContentMouseLeave={scheduleCloseMenu}
        />
      ) : null}
    </div>
  );
}
