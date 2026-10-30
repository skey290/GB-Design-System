"use client";

import * as React from "react";
import { Eraser, Replace, Trash2 } from "lucide-react";

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
}: AssetGalleryDialogProps) {
  const [deletedImageIds, setDeletedImageIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [selectedPresetIds, setSelectedPresetIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [uploadedReferenceImages, setUploadedReferenceImages] = React.useState<
    AssetGalleryPortraitImage[]
  >([]);
  const referenceFileInputRef = React.useRef<HTMLInputElement>(null);
  // Set only right after the very first upload for this self (empty gallery) — swaps the
  // grid for the style-select step until Generate is clicked.
  const [pendingUploadSrc, setPendingUploadSrc] = React.useState<string | null>(
    null,
  );
  const [selectedStyleId, setSelectedStyleId] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    if (open) {
      setDeletedImageIds(new Set());
      setPendingUploadSrc(null);
      setSelectedStyleId(null);
    }
  }, [open, selfId]);

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
  };

  const handleGenerate = () => {
    const style = STYLE_CARDS.find((item) => item.id === selectedStyleId);
    if (!style) return;
    onGenerate(style.image);
    setPendingUploadSrc(null);
    setSelectedStyleId(null);
  };

  const referenceImages = [...uploadedReferenceImages, ...PRESETS];

  const handleReferenceFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedReferenceImages((prev) => [
        {
          id: `reference-upload-${prev.length}`,
          src: URL.createObjectURL(file),
          alt: "Uploaded reference image",
        },
        ...prev,
      ]);
    }
    event.target.value = "";
  };

  const handleGenerateFromReferences = () => {
    const selected = referenceImages
      .filter((image) => selectedPresetIds.has(image.id))
      .map((image) => image.src);
    if (selected.length === 0) return;
    onUseReferenceImages(selected);
    onOpenChange(false);
  };

  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          width: pendingUploadSrc ? "min(95vw, 1220px)" : "min(90vw, 1120px)",
          borderRadius: "var(--gb-radius-scale-2xl)",
        }}
      >
        <DialogHeader>
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
            <DialogTitle>Asset Gallery</DialogTitle>
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
          {selectedTabIndex === 1 && !pendingUploadSrc ? (
            <DialogDescription>
              Pick one or more reference images to generate on-brand content in
              Content Studio, or upload one of your own.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Manage your Self Portrait here. It also includes reference images
              you can use to create a Self Portrait — create one of your own,
              upload an image you like, or generate a new one from a reference
              image.
            </DialogDescription>
          )}
        </DialogHeader>

        {pendingUploadSrc ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--gb-spacing-4)",
              }}
            >
              <div className="flex flex-wrap gap-[var(--gb-spacing-4)]">
                {STYLE_CARDS.map((style) => (
                  <AssetGalleryCard
                    key={style.id}
                    image={style.image}
                    alt={style.title}
                    title={style.title}
                    description={style.description}
                    isSelected={selectedStyleId === style.id}
                    onSelectedChange={(selected) =>
                      setSelectedStyleId(selected ? style.id : null)
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
                  marginTop: "calc((315px - 32px) / 2)",
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
                  disabled={!selectedStyleId}
                  onClick={handleGenerate}
                  style={{ width: "207px" }}
                >
                  Generate
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Tabs
                items={tabItems}
                selectedIndex={selectedTabIndex}
                onSelectedIndexChange={setSelectedTabIndex}
              />
              {selectedTabIndex === 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "var(--gb-spacing-2)",
                  }}
                >
                  <input
                    ref={referenceFileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleReferenceFileChange}
                  />
                  <Button
                    variant="outline"
                    icon={<Icon id="plus-icon" className="w-4 h-4" />}
                    onClick={() => referenceFileInputRef.current?.click()}
                  >
                    Upload
                  </Button>
                  <Button
                    variant="primary"
                    icon={<Icon id="arrow-right-icon" className="w-4 h-4" />}
                    disabled={selectedPresetIds.size === 0}
                    onClick={handleGenerateFromReferences}
                  >
                    Generate
                  </Button>
                </div>
              )}
            </div>

            {selectedTabIndex === 0 ? (
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
            ) : (
              <div className="flex flex-wrap gap-[var(--gb-spacing-4)]">
                {referenceImages.map((image) => (
                  <AssetGalleryCard
                    key={image.id}
                    image={image.src}
                    alt={image.alt}
                    style={{ width: "100%" }}
                    isSelected={selectedPresetIds.has(image.id)}
                    onSelectedChange={(selected) =>
                      setSelectedPresetIds((prev) => {
                        const next = new Set(prev);
                        if (selected) next.add(image.id);
                        else next.delete(image.id);
                        return next;
                      })
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
