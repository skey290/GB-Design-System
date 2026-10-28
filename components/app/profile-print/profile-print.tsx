"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Icon } from "@/lib/sprite-icon";

import styles from "./profile-print.module.css";

/**
 * Profile image print card. `type` has three kinds: process/completed/upload.
 *
 * - `process`: a square shimmer loader (reusing `Skeleton`) + a centered
 *   "Processing" badge (reusing `Spinner variant="primary"` — the badge's
 *   bg/text colors and dimensions exactly match the Figma spec:
 *   `--background-bold`/`--text-invert` are aliased to Shadcn's
 *   `--primary`/`--primary-foreground`).
 * - `completed`: a square portrait photo (object-cover) + a bottom-right
 *   timestamp. On mouse hover (Figma `Status=hover`), the image blurs and an
 *   "Update this image" edit overlay appears — handled via `:hover`/`:focus-within`
 *   CSS (`profile-print.module.css`), with the `imageHover` prop as an escape
 *   hatch to force-preview the same look in Storybook/tests. The overlay
 *   button reuses `Button variant="mute"`.
 * - `upload`: an empty-state CTA card. The "Open your folder" button reuses
 *   `Button variant="outline"` (only the default background is overridden via
 *   `.openFolderButton` in `profile-print.module.css` — to layer the solid
 *   fill Figma requires on top of outline's default transparent background.
 *   Not done via inline `style` because inline style would also hide
 *   `button.module.css`'s pseudo-class rules for hover/active/disabled etc.,
 *   killing hover), triggering a hidden `<input type="file">` and passing the
 *   selection result through the `onFileSelect` callback (added functionally
 *   since Figma is a static design and can't express actual file-selection
 *   behavior — same sr-only file-input pattern as `input-image.tsx`).
 *
 * The container width of 542px (and the upload state's height of 642px) use
 * Figma's original px values as-is. Since Figma pins all three `type`s to
 * dark semantic tokens, `dark` is applied at the root (same pattern as
 * GoalSetting/AssetPanel) — only the background outside the card is fixed to
 * `--gb-background-static-white` regardless of mode.
 *
 * Figma's `type=upload` variant had a decorative SVG (`imgTypeUpload`)
 * covering the whole container, but downloading and comparing it showed it
 * was a "Subtract" frame shape with the exact same white border and
 * dimensions the other two variants produce via `bg-white + padding` — not
 * an actual image asset. So the default reproduces the same
 * `bg-white + padding`, while leaving a swap point open via the
 * `emptyStateBackgroundSrc` prop in case a real image asset (texture,
 * watermark, etc.) is needed later (renders nothing when unset, identical to
 * the current design).
 */
export interface ProfilePrintProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Figma `type` — defaults to "process" to match Figma */
  type?: "process" | "completed" | "upload";
  /** Bottom-right timestamp for the `process`/`completed` states (Figma example: "2026.03.24 19:24:06") */
  timestamp?: string;
  /** Portrait photo for the `completed` state */
  portraitSrc?: string;
  portraitAlt?: string;
  /**
   * Forces the `completed` state's "Update this image" edit overlay to show
   * (Figma `Status=hover`). The real interaction already works via CSS
   * `:hover`/`:focus-within`, so this prop is only for environments that
   * can't reproduce a mouse hover, like Storybook Controls or tests. Default false.
   */
  imageHover?: boolean;
  /** Click callback for the "Edit Profile Portrait" button in the `completed` state's hover overlay */
  onEditImage?: () => void;
  /**
   * Image (texture/watermark, etc.) to place in the `upload` state's
   * background. Renders the default `bg-white + padding` white border as-is
   * when unset (identical result to the Figma original).
   */
  emptyStateBackgroundSrc?: string;
  emptyStateBackgroundAlt?: string;
  /** Callback for the file-selection result when "Open your folder" is clicked in the `upload` state */
  onFileSelect?: (file: File | null) => void;
}

export function ProfilePrint({
  type = "process",
  timestamp = "2026.03.24 19:24:06",
  portraitSrc,
  portraitAlt = "",
  imageHover = false,
  onEditImage,
  emptyStateBackgroundSrc,
  emptyStateBackgroundAlt = "",
  onFileSelect,
  className,
  ...props
}: ProfilePrintProps) {
  const isCompleted = type === "completed";
  const isProcess = type === "process";
  const isUpload = type === "upload";
  const fileInputId = React.useId();

  return (
    <div
      className={cn(
        "dark relative flex w-[542px] flex-col items-center justify-center overflow-clip",
        "bg-[var(--gb-background-static-white)]",
        "px-[var(--gb-spacing-4)] pt-[var(--gb-spacing-9)] pb-[var(--gb-spacing-24)]",
        isUpload && "h-[642px]",
        className,
      )}
      {...props}
    >
      {emptyStateBackgroundSrc && isUpload && (
        <img
          src={emptyStateBackgroundSrc}
          alt={emptyStateBackgroundAlt}
          aria-hidden={emptyStateBackgroundAlt === ""}
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {isCompleted && (
        <>
          <div
            className={cn(
              "relative aspect-square w-full shrink-0 overflow-hidden",
              styles.portrait,
            )}
            data-image-hover={imageHover || undefined}
          >
            <img
              src={portraitSrc}
              alt={portraitAlt}
              className={cn(
                "absolute inset-0 size-full object-cover",
                styles.portraitImage,
              )}
            />
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-[var(--gb-spacing-9)]",
                styles.portraitOverlay,
              )}
            >
              <div className="flex w-[510px] flex-col items-center gap-[var(--gb-spacing-2)] text-center">
                <p className="text-lg-medium w-full text-[var(--gb-text-popover)]">
                  Update this image
                </p>
                <p className="text-sm-regular w-full text-[var(--gb-text-selected)]">
                  Make a quick change to keep it current and sharp.
                </p>
              </div>
              <Button
                variant="mute"
                icon={<Icon id="eraser-icon" />}
                onClick={onEditImage}
              >
                Edit Profile Portrait
              </Button>
            </div>
          </div>
          <p className="text-time-stamp absolute bottom-[18px] right-[13px] text-[var(--gb-text-subtle)]">
            {timestamp}
          </p>
        </>
      )}

      {isProcess && (
        <>
          <div className="relative w-full shrink-0">
            <Skeleton
              type="rectangle"
              className="rounded-none"
              style={{ aspectRatio: "1 / 1", height: "auto" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner type="primary" label="Processing" />
            </div>
          </div>
          <p className="text-time-stamp absolute bottom-[18px] right-[13px] text-[var(--gb-text-subtle)]">
            {timestamp}
          </p>
        </>
      )}

      {isUpload && (
        <>
          <div
            className={cn(
              "relative flex size-[510px] shrink-0 flex-col items-center justify-center",
              "gap-[var(--gb-spacing-6)] opacity-[var(--gb-opacity-85)]",
              "border-[length:var(--gb-border-2)] border-dashed border-[var(--gb-border-muted)]",
              "bg-[var(--gb-background-bolder)] backdrop-blur-[var(--gb-backdrop-blur-md)]",
            )}
          >
            <div className="flex w-full shrink-0 flex-col items-center gap-[var(--gb-spacing-2)]">
              <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[var(--gb-radius-scale-lg)] bg-[var(--gb-background-subtler)]">
                {/* The icon color is bound to --border-bolder in Figma — the
                    name says "border" but in this instance it's used as the
                    icon's stroke color. */}
                <svg
                  className="size-[24px] text-[var(--gb-border-bolder)]"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#asset-icon" />
                </svg>
              </div>
              <p className="text-lg-medium w-full min-w-full text-center text-[var(--gb-text-popover)]">
                {`Let's create your brand image!`}
              </p>
              <p className="text-sm-regular w-full min-w-full whitespace-pre-wrap text-center text-[var(--gb-text-selected)]">
                {`We'll craft an image that fits your personal brand.`}
                <br aria-hidden="true" />
                {` Upload a photo to get started.`}
              </p>
            </div>

            <Button
              variant="outline"
              className={styles.openFolderButton}
              onClick={() => document.getElementById(fileInputId)?.click()}
            >
              Open your folder
            </Button>
            <input
              id={fileInputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) =>
                onFileSelect?.(event.target.files?.[0] ?? null)
              }
            />
          </div>
          <p className="text-time-stamp absolute bottom-[18px] right-[13px] text-[var(--gb-text-subtle)]">
            Gabrielle.ai
          </p>
        </>
      )}
    </div>
  );
}
