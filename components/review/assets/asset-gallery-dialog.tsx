"use client";

import * as React from "react";
import { Eraser, Replace, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/sprite-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, type SelectOption } from "@/components/ui/select";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import {
  AssetGalleryCard,
  type AssetGalleryCardMenuOption,
} from "@/components/assets/ui/asset-gallery-card";
import { getArchivedImages } from "@/lib/archived-asset-store";

const CARD_MENU_OPTIONS: AssetGalleryCardMenuOption[] = [
  {
    value: "set-as-main-portrait",
    label: "Set as main Portrait",
    icon: Replace,
  },
  {
    value: "edit-profile-portrait",
    label: "Edit Profile Portrait",
    icon: Eraser,
  },
  {
    value: "delete-self-portrait",
    label: "Delete Self Portrait",
    icon: Trash2,
  },
];

interface StyleCardOption {
  id: string;
  title: string;
  description: string;
  image: string;
}

const STYLE_CARDS: StyleCardOption[] = [
  {
    id: "deep-chroma",
    title: "Deep Chroma",
    description: "Baroque-inspired chiaroscuro",
    image: "/images/style-cards/deep-chroma.jpg",
  },
  {
    id: "natural-light",
    title: "Natural Light",
    description: "Expressionist color",
    image: "/images/style-cards/natural-light.jpg",
  },
  {
    id: "monochrome",
    title: "Monochrome",
    description: "Straight photography",
    image: "/images/style-cards/monochrome.jpg",
  },
  {
    id: "editorial",
    title: "Editorial",
    description: "Editorial portraiture",
    image: "/images/style-cards/editorial.jpg",
  },
];

const PRESETS = [
  {
    id: "preset-entrepreneur",
    src: "/images/personas/entrepreneur.jpg",
    alt: "Entrepreneur preset",
  },
  {
    id: "preset-fashion-editor",
    src: "/images/personas/fashion-editor.jpg",
    alt: "Fashion Editor preset",
  },
  {
    id: "preset-fashionista",
    src: "/images/personas/fashionista.jpg",
    alt: "Fashionista preset",
  },
  {
    id: "preset-novelist",
    src: "/images/personas/novelist.jpg",
    alt: "English Novelist preset",
  },
  {
    id: "preset-vegan-chef",
    src: "/images/personas/vegan-chef.jpg",
    alt: "Vegan Chef preset",
  },
  {
    id: "preset-yoga-meditator",
    src: "/images/personas/yoga-meditator.jpg",
    alt: "Yoga Meditator preset",
  },
  {
    id: "preset-self-default",
    src: "/images/personas/self-default.jpg",
    alt: "Data Scientist preset",
  },
  {
    id: "preset-team-leader",
    src: "/images/personas/team-leader.jpg",
    alt: "Office Worker preset",
  },
];

export interface AssetGalleryPortraitImage {
  id: string;
  src: string;
  alt: string;
}

export interface AssetGalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selves: SelectOption[];
  selfId: string;
  onSelfIdChange: (selfId: string) => void;
  /** Images the user has uploaded/created for this self's portrait. Empty until they add one. */
  portraitImages: AssetGalleryPortraitImage[];
  /** Called with the chosen style card's image when Generate is clicked after an upload. */
  onGenerate: (imageSrc: string) => void;
  /** Called with the selected reference image(s) when Generate is clicked on the Reference tab. */
  onUseReferenceImages: (imageSrcs: string[]) => void;
  /** Tab shown when the dialog opens (0=Self Portrait, 1=Reference). Defaults to 0. */
  initialTabIndex?: number;
  /** Forces light/dark semantic tokens regardless of the opening page's own theme. Default "dark" */
  colorScheme?: "dark" | "light";
  /**
   * Content Studio opens this dialog to pick reference images for a post, so its
   * Reference tab needs multi-select + a confirm button — the plain Self/Asset
   * Panel entry point (default) is just browsing/managing, nothing to pick. Default false.
   */
  isPickerMode?: boolean;
}

/** gabrielle-ai.com의 Asset Gallery를 복제한 팝업. Self Cluster/Asset Panel의 여러 진입점에서 연다. */
export function AssetGalleryDialog({
  open,
  onOpenChange,
  selves,
  selfId,
  onSelfIdChange,
  portraitImages,
  onGenerate,
  onUseReferenceImages,
  initialTabIndex = 0,
  colorScheme = "dark",
  isPickerMode = false,
}: AssetGalleryDialogProps) {
  const [deletedImageIds, setDeletedImageIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  // Only meaningful in picker mode — tracks which My Reference/Preset images are
  // checked for the bottom "Select" button to hand back via onUseReferenceImages.
  const [selectedPresetIds, setSelectedPresetIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [uploadedReferenceImages, setUploadedReferenceImages] = React.useState<
    AssetGalleryPortraitImage[]
  >([]);
  // Set right after an upload (Self Portrait's empty card, or Reference's) — swaps the
  // grid for the style-select step until Generate is clicked. `pendingUploadTarget` tracks
  // which gallery the generated result should land in.
  const [pendingUploadSrc, setPendingUploadSrc] = React.useState<string | null>(
    null,
  );
  const [pendingUploadTarget, setPendingUploadTarget] = React.useState<
    "self-portrait" | "reference" | null
  >(null);
  const [selectedStyleIds, setSelectedStyleIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  // Separate from `selectedPresetIds` (the main Reference tab's "pick images to use"
  // selection) so checking a preset here to create a new reference doesn't leak into,
  // or get cleared by, that unrelated selection.
  const [selectedCreatePresetIds, setSelectedCreatePresetIds] = React.useState<
    Set<string>
  >(() => new Set());
  const [selectedTabIndex, setSelectedTabIndex] =
    React.useState(initialTabIndex);

  React.useEffect(() => {
    if (open) {
      setDeletedImageIds(new Set());
      setPendingUploadSrc(null);
      setPendingUploadTarget(null);
      setSelectedStyleIds(new Set());
      setSelectedCreatePresetIds(new Set());
      setSelectedPresetIds(new Set());
      setSelectedTabIndex(initialTabIndex);
    }
  }, [open, selfId, initialTabIndex]);

  const archivedImages = getArchivedImages(selfId).map((src, index) => ({
    id: `archived-${index}`,
    src,
    alt: "Archived profile image",
  }));
  const yourImages = [...portraitImages, ...archivedImages].filter(
    (image) => !deletedImageIds.has(image.id),
  );

  const handleEmptyCardUpload = (file: File) => {
    setPendingUploadSrc(URL.createObjectURL(file));
    setPendingUploadTarget("self-portrait");
  };

  const handleGenerate = () => {
    if (pendingUploadTarget === "reference") {
      const selected = PRESETS.filter((preset) =>
        selectedCreatePresetIds.has(preset.id),
      );
      if (selected.length === 0) return;
      setUploadedReferenceImages((prev) => [
        ...selected.map((preset, index) => ({
          id: `reference-style-${prev.length + index}`,
          src: preset.src,
          alt: preset.alt,
        })),
        ...prev,
      ]);
      setPendingUploadSrc(null);
      setPendingUploadTarget(null);
      setSelectedCreatePresetIds(new Set());
      return;
    }

    const selected = STYLE_CARDS.filter((item) =>
      selectedStyleIds.has(item.id),
    );
    if (selected.length === 0) return;
    selected.forEach((style) => onGenerate(style.image));
    setPendingUploadSrc(null);
    setPendingUploadTarget(null);
    setSelectedStyleIds(new Set());
  };

  // The raw upload already landed in "My Reference" on upload, so backing out of the
  // create step just discards the in-progress preset selection, not the upload itself.
  const handleCancelReferenceUpload = () => {
    setPendingUploadSrc(null);
    setPendingUploadTarget(null);
    setSelectedCreatePresetIds(new Set());
  };

  const referenceImages = [...uploadedReferenceImages, ...PRESETS];

  // The raw upload becomes a reference immediately; it's also offered as the
  // pending-upload preview so the user can additionally create a styled
  // version of it via Generate (which adds alongside, not instead of, it).
  const handleReferenceUpload = (file: File) => {
    const src = URL.createObjectURL(file);
    setUploadedReferenceImages((prev) => [
      {
        id: `reference-upload-${prev.length}`,
        src,
        alt: "Uploaded reference image",
      },
      ...prev,
    ]);
    setPendingUploadSrc(src);
    setPendingUploadTarget("reference");
  };

  const handleDeleteUploadedReference = (imageId: string) => {
    setUploadedReferenceImages((prev) =>
      prev.filter((image) => image.id !== imageId),
    );
  };

  const handleSelectReferences = () => {
    const selected = referenceImages
      .filter((image) => selectedPresetIds.has(image.id))
      .map((image) => image.src);
    if (selected.length === 0) return;
    onUseReferenceImages(selected);
    onOpenChange(false);
  };

  const toggleSelectedPresetId = (imageId: string, selected: boolean) => {
    setSelectedPresetIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(imageId);
      else next.delete(imageId);
      return next;
    });
  };

  const tabItems: TabItem[] = [
    { label: "Self Portrait", count: yourImages.length },
    { label: "Reference", count: referenceImages.length },
  ];

  const handleSelectMenuOption = (value: string, imageId: string) => {
    if (value === "delete-self-portrait") {
      setDeletedImageIds((prev) => new Set(prev).add(imageId));
    } else if (
      value === "set-as-main-portrait" ||
      value === "edit-profile-portrait"
    ) {
      onOpenChange(false);
    }
  };

  const isReferenceUploadStep =
    pendingUploadSrc !== null && pendingUploadTarget === "reference";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={colorScheme}
        style={{
          // Sized to fit exactly 5 of the fixed 207px cards per row (5*207 + 4*16
          // gaps + 2*24 padding) — the widest a grid row ever needs, so a near-empty
          // grid (e.g. one Self Portrait) doesn't leave a huge empty gutter on the
          // right. Every step (including Self Portrait's style-card step) shares
          // this same size, so the modal never resizes as you move through it.
          width: "min(90vw, 1160px)",
          height: isReferenceUploadStep ? undefined : "720px",
          overflowY: "hidden",
          borderRadius: "var(--gb-radius-scale-2xl)",
        }}
      >
        <DialogHeader style={{ minHeight: "76px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "var(--gb-spacing-3)",
              marginTop: "calc(var(--gb-spacing-2) * -1)",
            }}
          >
            <DialogTitle>
              {isReferenceUploadStep
                ? "Create My Reference"
                : pendingUploadSrc
                  ? "Create Self"
                  : "Asset Gallery"}
            </DialogTitle>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--gb-spacing-2)",
              }}
            >
              <span className="text-base-regular text-[var(--gb-text-default)]">
                for
              </span>
              <Select
                variant="ghost"
                options={selves}
                value={selfId}
                onValueChange={onSelfIdChange}
              />
            </div>
          </div>
          {isReferenceUploadStep ? (
            <DialogDescription>
              Pick a preset below to create your own reference image from the
              photo you uploaded.
            </DialogDescription>
          ) : pendingUploadSrc ? (
            <DialogDescription>
              Pick a style below to create your Self Portrait from the photo
              you uploaded.
            </DialogDescription>
          ) : selectedTabIndex === 1 ? (
            <DialogDescription>
              {isPickerMode
                ? "Pick one or more reference images to generate on-brand content in Content Studio, or upload one of your own."
                : "Browse your reference images, or create your own using a preset."}
            </DialogDescription>
          ) : (
            <DialogDescription>
              Manage your Self Portrait here. It also includes reference images
              you can use to create a Self Portrait
              <br />— create one of your own, upload an image you like, or
              generate a new one from a reference image.
            </DialogDescription>
          )}
        </DialogHeader>

        {pendingUploadSrc ? (
          isReferenceUploadStep ? (
            <>
              <div
                style={{
                  display: "flex",
                  flex: "1 1 auto",
                  minHeight: 0,
                  overflowY: "auto",
                  // "safe" keeps scrolling starting from the top once the
                  // Presets grid (which can grow to several rows) is taller
                  // than the uploaded photo — plain "center" would otherwise
                  // push part of the row above the scrollable area.
                  alignItems: "safe center",
                  gap: "var(--gb-spacing-4)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pendingUploadSrc}
                  alt="Uploaded photo"
                  style={{
                    display: "block",
                    width: "207px",
                    height: "315px",
                    flexShrink: 0,
                    objectFit: "cover",
                    borderRadius: "var(--gb-radius-scale-2xl)",
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    display: "flex",
                    width: "32px",
                    height: "32px",
                    flexShrink: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--gb-radius-scale-full)",
                    border: "var(--gb-border-1) solid var(--gb-border-muted)",
                    color: "var(--gb-icon-default)",
                  }}
                >
                  <Icon id="plus-icon" className="w-4 h-4" />
                </span>
                <div className="flex flex-wrap gap-[var(--gb-spacing-4)]">
                  {PRESETS.map((preset) => (
                    <AssetGalleryCard
                      key={preset.id}
                      image={preset.src}
                      alt={preset.alt}
                      isSelected={selectedCreatePresetIds.has(preset.id)}
                      onSelectedChange={(selected) =>
                        setSelectedCreatePresetIds((prev) => {
                          const next = new Set(prev);
                          if (selected) next.add(preset.id);
                          else next.delete(preset.id);
                          return next;
                        })
                      }
                    />
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexShrink: 0,
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "var(--gb-spacing-2)",
                }}
              >
                <Button
                  variant="icon-ghost"
                  aria-label="Back"
                  icon={<Icon id="arrow-left-icon" className="w-4 h-4" />}
                  onClick={handleCancelReferenceUpload}
                />
                <Button
                  variant="primary"
                  disabled={selectedCreatePresetIds.size === 0}
                  onClick={handleGenerate}
                >
                  Generate my reference
                </Button>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: "1 1 auto",
                  minHeight: 0,
                  overflowY: "auto",
                  // This row is always exactly 4 style cards + icon + image — a
                  // fixed amount of content, unlike the browsing grids — so
                  // centering it in the fixed-size dialog reads as intentional
                  // rather than leaving it pinned top-left with empty space
                  // around it. "safe" falls back to flex-start if it overflows.
                  justifyContent: "safe center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "safe center",
                    gap: "var(--gb-spacing-4)",
                  }}
                >
                  <div className="grid grid-cols-2 gap-[var(--gb-spacing-4)]">
                    {STYLE_CARDS.map((style) => (
                      <AssetGalleryCard
                        key={style.id}
                        image={style.image}
                        alt={style.title}
                        title={style.title}
                        description={style.description}
                        isSelected={selectedStyleIds.has(style.id)}
                        onSelectedChange={(selected) =>
                          setSelectedStyleIds((prev) => {
                            const next = new Set(prev);
                            if (selected) next.add(style.id);
                            else next.delete(style.id);
                            return next;
                          })
                        }
                      />
                    ))}
                  </div>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "flex",
                      width: "32px",
                      height: "32px",
                      flexShrink: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "var(--gb-radius-scale-full)",
                      border: "var(--gb-border-1) solid var(--gb-border-muted)",
                      color: "var(--gb-icon-default)",
                    }}
                  >
                    <Icon id="plus-icon" className="w-4 h-4" />
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexShrink: 0,
                      gap: "var(--gb-spacing-2)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pendingUploadSrc}
                      alt="Uploaded photo"
                      style={{
                        display: "block",
                        width: "207px",
                        height: "315px",
                        objectFit: "cover",
                        borderRadius: "var(--gb-radius-scale-2xl)",
                      }}
                    />
                    <p className="text-sm-medium text-center text-[var(--gb-text-subtle)]">
                      Uploaded image
                    </p>
                    <Button
                      variant="primary"
                      disabled={selectedStyleIds.size === 0}
                      onClick={handleGenerate}
                      style={{ width: "207px" }}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )
        ) : (
          <>
            <Tabs
              items={tabItems}
              selectedIndex={selectedTabIndex}
              onSelectedIndexChange={setSelectedTabIndex}
            />

            <div
              style={{
                flex: "1 1 auto",
                minHeight: 0,
                overflowY: "auto",
              }}
            >
              {selectedTabIndex === 0 ? (
                <div className="flex flex-col gap-[var(--gb-spacing-3)]">
                  <span className="text-sm-medium text-[var(--gb-text-subtle)]">
                    Self Portrait
                  </span>
                  <div className="flex flex-wrap gap-[var(--gb-spacing-4)]">
                    {yourImages.map((image) => (
                      <AssetGalleryCard
                        key={image.id}
                        image={image.src}
                        alt={image.alt}
                        menuOptions={CARD_MENU_OPTIONS}
                        onSelectMenuOption={(value) =>
                          handleSelectMenuOption(value, image.id)
                        }
                      />
                    ))}
                    <AssetGalleryCard onUpload={handleEmptyCardUpload} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-[var(--gb-spacing-5)]">
                  <div className="flex flex-col gap-[var(--gb-spacing-3)]">
                    <span className="text-sm-medium text-[var(--gb-text-subtle)]">
                      My Reference
                    </span>
                    <div className="flex flex-wrap gap-[var(--gb-spacing-4)]">
                      {uploadedReferenceImages.map((image) => (
                        <div
                          key={image.id}
                          style={{ position: "relative", flexShrink: 0 }}
                        >
                          <AssetGalleryCard
                            image={image.src}
                            alt={image.alt}
                            isSelected={
                              isPickerMode
                                ? selectedPresetIds.has(image.id)
                                : undefined
                            }
                            onSelectedChange={
                              isPickerMode
                                ? (selected) =>
                                    toggleSelectedPresetId(image.id, selected)
                                : undefined
                            }
                          />
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteUploadedReference(image.id);
                            }}
                            aria-label="Delete reference image"
                            style={{
                              position: "absolute",
                              top: "var(--gb-spacing-2)",
                              ...(isPickerMode
                                ? { left: "var(--gb-spacing-2)" }
                                : { right: "var(--gb-spacing-2)" }),
                              zIndex: 2,
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              flexShrink: 0,
                              alignItems: "center",
                              justifyContent: "center",
                              border: 0,
                              borderRadius: "var(--gb-radius-scale-full)",
                              padding: 0,
                              background: "var(--gb-background-mute)",
                              color: "var(--gb-icon-static-white)",
                              cursor: "pointer",
                            }}
                          >
                            <X
                              aria-hidden="true"
                              style={{ width: "12px", height: "12px" }}
                            />
                          </button>
                        </div>
                      ))}
                      <AssetGalleryCard onUpload={handleReferenceUpload} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[var(--gb-spacing-3)]">
                    <span className="text-sm-medium text-[var(--gb-text-subtle)]">
                      Presets
                    </span>
                    <div className="flex flex-wrap gap-[var(--gb-spacing-4)]">
                      {PRESETS.map((image) => (
                        <AssetGalleryCard
                          key={image.id}
                          image={image.src}
                          alt={image.alt}
                          isSelected={
                            isPickerMode
                              ? selectedPresetIds.has(image.id)
                              : undefined
                          }
                          onSelectedChange={
                            isPickerMode
                              ? (selected) =>
                                  toggleSelectedPresetId(image.id, selected)
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isPickerMode && selectedTabIndex === 1 && (
              <div
                style={{
                  display: "flex",
                  flexShrink: 0,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="primary"
                  disabled={selectedPresetIds.size === 0}
                  onClick={handleSelectReferences}
                >
                  {selectedPresetIds.size > 0
                    ? `Select (${selectedPresetIds.size})`
                    : "Select"}
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
