"use client";

import * as React from "react";

import { PostCard } from "@/components/content-studio/ui/PostCard";
import { AssetGalleryCard } from "@/components/assets/ui/asset-gallery-card";
import { ChatboxComposer } from "@/components/app/chatbox-composer";
import { Button } from "@/components/ui/button";
import { Chatbox } from "@/components/ui/chatbox";
import { Chips } from "@/components/ui/chips";
import { DateSelect } from "@/components/ui/date-select";
import { InputTime, type TimePeriod } from "@/components/ui/input-time";
import { Select, type SelectOption } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Icon } from "@/lib/sprite-icon";
import { cn } from "@/lib/utils";
import {
  PLATFORM_LABELS,
  type Post,
  type PostPlatform,
} from "@/components/review/content-studio/data";
import { AssetGalleryDialog } from "@/components/app/asset-gallery-dialog";

import { IMAGE_STYLE_OPTIONS, type ImageStyleOption } from "./ImageStyleCard";
import styles from "./PostingModal.module.css";

export type { ImageStyleOption };
export { IMAGE_STYLE_OPTIONS };

const POST_TYPE_LABELS = ["All", "Image", "Text"] as const;

const ALL_PLATFORMS: PostPlatform[] = ["linkedin", "x", "instagram", "threads"];

const PLATFORM_OPTIONS: SelectOption[] = ALL_PLATFORMS.map((platform) => ({
  value: platform,
  label: PLATFORM_LABELS[platform],
}));

// AssetGalleryDialog's "for [self]" selector has no meaning in PostingModal's
// context — the dialog is only ever opened here to pick Reference images for
// the post being edited, never to manage a particular Self's portrait.
const REFERENCE_DIALOG_SELF_ID = "post";
const REFERENCE_DIALOG_SELVES: SelectOption[] = [
  { value: REFERENCE_DIALOG_SELF_ID, label: "This Post" },
];
const noop = () => {};

export interface PostingModalSharedProps {
  /** Figma `closeButton` */
  showCloseButton?: boolean;
  /** Called when the close button is clicked */
  onClose?: () => void;
  /** Header date label (Figma example "Today, Sep 01") */
  dateLabel?: string;
  /** Current Self's display name, shown in the Reference gallery dialog's "for" field in place of a selector. Defaults to "This Post" */
  selfLabel?: string;
  className?: string;
}

/** Figma `Style=empty, Type=LinkedIn` — the creation flow. */
export interface PostingModalEmptyProps extends PostingModalSharedProps {
  style?: "empty";
  /** Platforms selected in "Where to post?" */
  platforms: PostPlatform[];
  /** Called when a platform is picked from the "+" dropdown */
  onAddPlatform?: (platform: PostPlatform) => void;
  /** Called when a selected platform chip's delete (×) is clicked. Never called for the last remaining platform — at least one is always kept */
  onRemovePlatform?: (index: number) => void;
  /** "How many posts are you going to make?" stepper value */
  postCount?: number;
  onPostCountChange?: (count: number) => void;
  /** "Select Post Type" chips — 0=All/1=Image/2=Text */
  postTypeIndex?: number;
  onPostTypeChange?: (index: number) => void;
  /** Generation instruction text in the Chatbox */
  instruction?: string;
  onInstructionChange?: (value: string) => void;
  /** Called when "Auto-generate" is clicked */
  onAutoGenerate?: () => void;
  /** Selected image style id when used as a controlled component. The "Image style" row and "Reference" row (shared with `style="default"`) show only when `postTypeIndex` is 0 (All) or 1 (Image) */
  selectedImageStyleId?: string;
  /** Initial selected image style id when used as an uncontrolled component */
  defaultSelectedImageStyleId?: string;
  /** Called when a different image style card is clicked */
  onImageStyleChange?: (id: string) => void;
  /** Reference image srcs already attached, when used as a controlled component */
  referenceImages?: string[];
  /** Initial reference image srcs when used as an uncontrolled component */
  defaultReferenceImages?: string[];
  /** Called with the full next list when images are picked from the Reference gallery dialog */
  onReferenceImagesChange?: (images: string[]) => void;
}

/** Figma `Style=default, Type=LinkedIn|X (Twitter)|Instagram|Thread` — the edit flow. */
export interface PostingModalDefaultProps extends PostingModalSharedProps {
  style: "default";
  /** Post being edited. `post.platforms` drives the right-side Tabs and preview — adding a platform grows the row with no new branches */
  post: Post;
  /** Called when a platform is picked from the "+" dropdown */
  onAddPlatform?: (platform: PostPlatform) => void;
  /** Called when a selected platform chip's delete (×) is clicked. Never called for the last remaining platform — at least one is always kept */
  onRemovePlatform?: (index: number) => void;
  avatarSrc?: string;
  /** Index into `post.platforms` for the currently shown tab/preview */
  activeTabIndex?: number;
  onActiveTabIndexChange?: (index: number) => void;
  onDateChange?: (date: Date) => void;
  onTimeChange?: (value: string) => void;
  onTimePeriodChange?: (period: TimePeriod) => void;
  /** AI rewrite instruction text in the Chatbox */
  rewriteInstruction?: string;
  onRewriteInstructionChange?: (value: string) => void;
  /** AI rewrite Chatbox's "All/Image/Text" chip (0=All/1=Image/2=Text) when used as a controlled component. Picking "Text" hides the Image style/Reference rows, same as `Style=empty`'s Post Type chips */
  postTypeIndex?: number;
  /** Initial chip index when used as an uncontrolled component */
  defaultPostTypeIndex?: number;
  onPostTypeChange?: (index: number) => void;
  onApplyChanges?: () => void;
  onSaveChanges?: () => void;
  onScheduleDraft?: () => void;
  onArchive?: () => void;
  /** Selected image style id when used as a controlled component. The "Image style" row itself (Figma's fixed 4 options) shows only when `post.contentType !== "text"`, `post.images.length > 0`, and the chip above isn't "Text" */
  selectedImageStyleId?: string;
  /** Initial selected image style id when used as an uncontrolled component */
  defaultSelectedImageStyleId?: string;
  /** Called when a different image style card is clicked */
  onImageStyleChange?: (id: string) => void;
  /** Reference image srcs already attached, when used as a controlled component */
  referenceImages?: string[];
  /** Initial reference image srcs when used as an uncontrolled component */
  defaultReferenceImages?: string[];
  /** Called with the full next list when images are picked from the Reference gallery dialog */
  onReferenceImagesChange?: (images: string[]) => void;
}

export type PostingModalProps =
  PostingModalEmptyProps | PostingModalDefaultProps;

function CloseButton({ onClose }: { onClose?: () => void }) {
  return (
    <Button
      variant="icon"
      icon={<Icon id="x-icon" />}
      aria-label="Close"
      onClick={onClose}
      className={styles.closeButton}
    />
  );
}

function WhereToPostField({
  label,
  platforms,
  onAddPlatform,
  onRemovePlatform,
}: {
  label: string;
  platforms: PostPlatform[];
  onAddPlatform?: (platform: PostPlatform) => void;
  onRemovePlatform?: (index: number) => void;
}) {
  const availableOptions = PLATFORM_OPTIONS.filter(
    (option) => !platforms.includes(option.value as PostPlatform),
  );
  const canRemove = platforms.length > 1;

  return (
    <div className={styles.fieldGroup}>
      <p className={styles.whereLabel}>{label}</p>
      <div className={styles.whereToPostRow}>
        {platforms.map((platform, index) => (
          <Chips
            key={`${platform}-${index}`}
            variant="secondary"
            showDeleteIcon={canRemove}
            onDelete={() => onRemovePlatform?.(index)}
          >
            {PLATFORM_LABELS[platform]}
          </Chips>
        ))}
        {availableOptions.length > 0 && (
          <Select
            variant="icon"
            icon="plus-icon"
            options={availableOptions}
            onValueChange={(value) => onAddPlatform?.(value as PostPlatform)}
            className={styles.addPlatformSelect}
          />
        )}
      </div>
    </div>
  );
}

function ImageStyleRow({
  selectedImageStyleId,
  defaultSelectedImageStyleId,
  onImageStyleChange,
}: {
  selectedImageStyleId?: string;
  defaultSelectedImageStyleId?: string;
  onImageStyleChange?: (id: string) => void;
}) {
  const isControlled = selectedImageStyleId !== undefined;
  const [uncontrolledId, setUncontrolledId] = React.useState(
    defaultSelectedImageStyleId,
  );
  const currentId = isControlled ? selectedImageStyleId : uncontrolledId;

  const handleSelect = (id: string) => {
    if (!isControlled) {
      setUncontrolledId(id);
    }
    onImageStyleChange?.(id);
  };

  return (
    <div className={styles.fieldGroup}>
      <p className={styles.whereLabel}>Image style</p>
      <div
        role="radiogroup"
        aria-label="Image style"
        className={styles.imageStyleRow}
      >
        {IMAGE_STYLE_OPTIONS.map((option) => (
          <AssetGalleryCard
            key={option.id}
            image={option.thumbnailSrc}
            alt=""
            title={option.label}
            isCompact
            selectionRole="radio"
            isSelected={currentId === option.id}
            onSelectedChange={() => handleSelect(option.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ReferenceRow({
  referenceImages,
  defaultReferenceImages = [],
  onReferenceImagesChange,
  selfLabel = "This Post",
}: {
  referenceImages?: string[];
  defaultReferenceImages?: string[];
  onReferenceImagesChange?: (images: string[]) => void;
  selfLabel?: string;
}) {
  const isControlled = referenceImages !== undefined;
  const [uncontrolledImages, setUncontrolledImages] = React.useState<string[]>(
    defaultReferenceImages,
  );
  const currentImages = isControlled ? referenceImages : uncontrolledImages;

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleUseReferenceImages = (imageSrcs: string[]) => {
    const next = [...currentImages, ...imageSrcs];
    if (!isControlled) {
      setUncontrolledImages(next);
    }
    onReferenceImagesChange?.(next);
  };

  const handleRemove = (index: number) => {
    const next = currentImages.filter((_, i) => i !== index);
    if (!isControlled) {
      setUncontrolledImages(next);
    }
    onReferenceImagesChange?.(next);
  };

  return (
    <div className={styles.fieldGroup}>
      <p className={styles.whereLabel}>Reference</p>
      <div className={styles.referenceRow}>
        {currentImages.map((src, index) => (
          <AssetGalleryCard
            key={`${src}-${index}`}
            image={src}
            isCompact
            onRemove={() => handleRemove(index)}
          />
        ))}
        <AssetGalleryCard
          isCompact
          emptyLabel="Add Reference"
          onEmptyClick={() => setIsDialogOpen(true)}
        />
      </div>

      <AssetGalleryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialTabIndex={1}
        selves={REFERENCE_DIALOG_SELVES}
        selfId={REFERENCE_DIALOG_SELF_ID}
        onSelfIdChange={noop}
        selfLabel={selfLabel}
        portraitImages={[]}
        onGenerate={noop}
        onSetMainPortrait={noop}
        onReplacePortrait={noop}
        onUseReferenceImages={handleUseReferenceImages}
        colorScheme="light"
        isPickerMode
      />
    </div>
  );
}

function PostCountStepper({
  count,
  onCountChange,
}: {
  count: number;
  onCountChange?: (count: number) => void;
}) {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        onClick={() => onCountChange?.(Math.max(1, count - 1))}
        aria-label="Decrease post count"
        className={styles.stepperButton}
      >
        <Icon id="minus-icon" className={styles.stepperIcon} />
      </button>
      <p className={styles.stepperCount}>{count}</p>
      <button
        type="button"
        onClick={() => onCountChange?.(count + 1)}
        aria-label="Increase post count"
        className={styles.stepperButton}
      >
        <Icon id="plus-icon" className={styles.stepperIcon} />
      </button>
    </div>
  );
}

function parsePostDate(date: string): Date {
  const [month, day, year] = date.split(".").map(Number);
  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1);
}

function PostingModalEmpty({
  platforms,
  onAddPlatform,
  onRemovePlatform,
  postCount = 1,
  onPostCountChange,
  postTypeIndex = 0,
  onPostTypeChange,
  instruction = "",
  onInstructionChange,
  onAutoGenerate,
  selectedImageStyleId,
  defaultSelectedImageStyleId,
  onImageStyleChange,
  referenceImages,
  defaultReferenceImages,
  onReferenceImagesChange,
  dateLabel = "Today, Sep 01",
  selfLabel,
  showCloseButton = true,
  onClose,
  className,
}: PostingModalEmptyProps) {
  // Post Type = "All" (0) or "Image" (1) — "Text" (2) has no image to style/reference.
  const showImageAndReference = postTypeIndex === 0 || postTypeIndex === 1;

  return (
    <div className={cn(styles.root, className)} data-style="empty">
      <div
        className={styles.emptyLeft}
        data-has-image-section={showImageAndReference || undefined}
      >
        <p className={styles.title}>{dateLabel}</p>

        <WhereToPostField
          label="Where to post?"
          platforms={platforms}
          onAddPlatform={onAddPlatform}
          onRemovePlatform={onRemovePlatform}
        />

        <div className={styles.fieldGroup}>
          <p className={styles.whereLabelSmall}>
            How many posts are you going to make?
          </p>
          <PostCountStepper
            count={postCount}
            onCountChange={onPostCountChange}
          />
        </div>

        <div className={styles.fieldGroup}>
          <p className={styles.whereLabelSmall}>Select Post Type</p>
          <div className={styles.postTypeRow}>
            {POST_TYPE_LABELS.map((label, index) => (
              <Chips
                key={label}
                variant="secondary"
                selected={postTypeIndex === index}
                onClick={() => onPostTypeChange?.(index)}
              >
                {label}
              </Chips>
            ))}
          </div>
        </div>

        {showImageAndReference && (
          <>
            <ImageStyleRow
              selectedImageStyleId={selectedImageStyleId}
              defaultSelectedImageStyleId={defaultSelectedImageStyleId}
              onImageStyleChange={onImageStyleChange}
            />
            <ReferenceRow
              referenceImages={referenceImages}
              defaultReferenceImages={defaultReferenceImages}
              onReferenceImagesChange={onReferenceImagesChange}
              selfLabel={selfLabel}
            />
          </>
        )}
      </div>

      <div className={styles.emptyRight}>
        <Chatbox
          value={instruction}
          onValueChange={onInstructionChange}
          showAiButton={false}
          showAttachButton={false}
          shouldFitContainer
          shouldForceDark={false}
          placeholder="Generate a post that..."
          className={styles.chatbox}
        />
        <Button
          variant="primary"
          icon={<Icon id="sparkles-icon" />}
          onClick={onAutoGenerate}
          className={styles.fullWidthButton}
        >
          Auto-generate
        </Button>
      </div>

      {showCloseButton && <CloseButton onClose={onClose} />}
    </div>
  );
}

function PostingModalDefault({
  post,
  onAddPlatform,
  onRemovePlatform,
  avatarSrc,
  activeTabIndex = 0,
  onActiveTabIndexChange,
  onDateChange,
  onTimeChange,
  onTimePeriodChange,
  rewriteInstruction = "",
  onRewriteInstructionChange,
  postTypeIndex,
  defaultPostTypeIndex = 0,
  onPostTypeChange,
  onApplyChanges,
  onSaveChanges,
  onScheduleDraft,
  onArchive,
  selectedImageStyleId,
  defaultSelectedImageStyleId,
  onImageStyleChange,
  referenceImages,
  defaultReferenceImages,
  onReferenceImagesChange,
  dateLabel = "Today, Sep 01",
  selfLabel,
  showCloseButton = true,
  onClose,
  className,
}: PostingModalDefaultProps) {
  const activePlatform =
    post.platforms[activeTabIndex] ?? post.platforms[0] ?? "linkedin";
  const tabItems = post.platforms.map((platform) => ({
    label: PLATFORM_LABELS[platform],
  }));

  const isPostTypeControlled = postTypeIndex !== undefined;
  const [uncontrolledPostTypeIndex, setUncontrolledPostTypeIndex] =
    React.useState(defaultPostTypeIndex);
  const currentPostTypeIndex = isPostTypeControlled
    ? postTypeIndex
    : uncontrolledPostTypeIndex;

  const handlePostTypeChange = (index: number) => {
    if (!isPostTypeControlled) {
      setUncontrolledPostTypeIndex(index);
    }
    onPostTypeChange?.(index);
  };

  // Post Type = "All" (0) or "Image" (1) — "Text" (2) has no image to style/reference.
  const showImageAndReference = currentPostTypeIndex !== 2;
  const showImageStyle =
    showImageAndReference &&
    post.contentType !== "text" &&
    post.images.length > 0;

  return (
    <div className={cn(styles.root, className)} data-style="default">
      <div className={styles.defaultLeft}>
        <p className={styles.title}>{dateLabel}</p>

        <WhereToPostField
          label="Where to post?"
          platforms={post.platforms}
          onAddPlatform={onAddPlatform}
          onRemovePlatform={onRemovePlatform}
        />

        <div className={styles.dateTimeRow}>
          <DateSelect
            label="Date to post"
            defaultValue={parsePostDate(post.date)}
            onValueChange={onDateChange}
            shouldForceDark={false}
            className={styles.dateSelect}
          />
          <InputTime
            defaultValue={post.time.slice(0, 5)}
            defaultPeriod={post.time.includes("PM") ? "PM" : "AM"}
            onValueChange={onTimeChange}
            onPeriodChange={onTimePeriodChange}
            shouldFitContainer
            className={styles.inputTime}
          />
        </div>

        {showImageStyle && (
          <ImageStyleRow
            selectedImageStyleId={selectedImageStyleId}
            defaultSelectedImageStyleId={defaultSelectedImageStyleId}
            onImageStyleChange={onImageStyleChange}
          />
        )}

        {showImageAndReference && (
          <ReferenceRow
            referenceImages={referenceImages}
            defaultReferenceImages={defaultReferenceImages}
            onReferenceImagesChange={onReferenceImagesChange}
            selfLabel={selfLabel}
          />
        )}

        <ChatboxComposer
          variant="chips"
          selectedChip={currentPostTypeIndex}
          onChipChange={handlePostTypeChange}
          value={rewriteInstruction}
          onValueChange={onRewriteInstructionChange}
          showAiButton={false}
          showAttachButton={false}
          shouldFitContainer
          shouldForceDark={false}
          placeholder="If you'd like to update the post on the right, please let us know what to change."
          className={styles.chatbox}
        />

        <Button
          variant="outline"
          icon={<Icon id="sparkles-icon" />}
          onClick={onApplyChanges}
          className={styles.fullWidthButton}
        >
          Apply Changes
        </Button>
      </div>

      <div className={styles.divider} />

      <div className={styles.defaultRight} data-platform={activePlatform}>
        <Tabs
          items={tabItems}
          selectedIndex={activeTabIndex}
          onSelectedIndexChange={onActiveTabIndexChange}
          shouldFitContainer
        />

        <PostCard
          post={post}
          platform={activePlatform}
          showButtons={false}
          avatarSrc={avatarSrc}
          onOpenEdit={() => {}}
          onScheduleDraft={() => onScheduleDraft?.()}
          onArchive={() => onArchive?.()}
          className={styles.previewCard}
        />

        <div className={styles.footer}>
          <Button
            variant="icon"
            icon={<Icon id="archive-icon" />}
            aria-label="Move to Archive"
            onClick={onArchive}
          />
          <Button
            variant="outline"
            onClick={onSaveChanges}
            className={styles.fullWidthButton}
          >
            Save Changes
          </Button>
          <Button
            variant="primary"
            onClick={onScheduleDraft}
            className={styles.fullWidthButton}
          >
            Schedule Draft
          </Button>
        </div>
      </div>

      {showCloseButton && <CloseButton onClose={onClose} />}
    </div>
  );
}

/**
 * Figma `Posting modal` (node 8127:91305). `Style=empty` is the creation
 * flow, `Style=default` is the edit flow — the right-side Tabs and preview
 * iterate `post.platforms`, so adding a platform to that array grows the row
 * with no new branches (see `PostCard`'s `platform` prop and
 * `docs/components/posting-modal.md`).
 */
export function PostingModal(props: PostingModalProps) {
  if (props.style === "default") {
    return <PostingModalDefault {...props} />;
  }
  return <PostingModalEmpty {...props} />;
}
