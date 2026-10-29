"use client";

import * as React from "react";
import { Eraser, Replace, Trash2 } from "lucide-react";

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

const YOUR_IMAGES = [
  {
    id: "upload-1",
    selfId: "self-default",
    src: "/images/personas/self-default.jpg",
    alt: "Uploaded reference 1",
  },
  {
    id: "upload-2",
    selfId: "team-leader",
    src: "/images/personas/team-leader.jpg",
    alt: "Uploaded reference 2",
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

export interface AssetGalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selves: SelectOption[];
  selfId: string;
  onSelfIdChange: (selfId: string) => void;
}

/** gabrielle-ai.com의 Asset Gallery를 복제한 팝업. Self Cluster/Asset Panel의 여러 진입점에서 연다. */
export function AssetGalleryDialog({
  open,
  onOpenChange,
  selves,
  selfId,
  onSelfIdChange,
}: AssetGalleryDialogProps) {
  const [deletedImageIds, setDeletedImageIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [selectedPresetIds, setSelectedPresetIds] = React.useState<Set<string>>(
    () => new Set(),
  );

  React.useEffect(() => {
    if (open) setDeletedImageIds(new Set());
  }, [open, selfId]);

  const archivedImages = getArchivedImages(selfId).map((src, index) => ({
    id: `archived-${index}`,
    src,
    alt: "Archived profile image",
  }));
  const yourImages = [
    ...YOUR_IMAGES.filter((image) => image.selfId === selfId),
    ...archivedImages,
  ].filter((image) => !deletedImageIds.has(image.id));

  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
  const tabItems: TabItem[] = [
    { label: "Self Portrait" },
    { label: "Reference" },
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
          width: "min(90vw, 1120px)",
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
            }}
          >
            <DialogTitle>Asset Gallery</DialogTitle>
            <span className="text-base-regular text-[var(--gb-text-subtle)]">
              for
            </span>
            <Select
              variant="ghost"
              options={selves}
              value={selfId}
              onValueChange={onSelfIdChange}
            />
          </div>
          <DialogDescription>
            Manage your Self Portrait here. It also includes reference images
            you can use to create a Self Portrait — create one of your own,
            upload an image you like, or generate a new one from a reference
            image.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          items={tabItems}
          selectedIndex={selectedTabIndex}
          onSelectedIndexChange={setSelectedTabIndex}
        />

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
            <AssetGalleryCard />
          </div>
        ) : (
          <div className="flex flex-wrap gap-[var(--gb-spacing-4)]">
            {PRESETS.map((preset) => (
              <AssetGalleryCard
                key={preset.id}
                image={preset.src}
                alt={preset.alt}
                isSelected={selectedPresetIds.has(preset.id)}
                onSelectedChange={(selected) =>
                  setSelectedPresetIds((prev) => {
                    const next = new Set(prev);
                    if (selected) next.add(preset.id);
                    else next.delete(preset.id);
                    return next;
                  })
                }
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
