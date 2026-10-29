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
    src: "/images/personas/self-default.jpg",
    alt: "Uploaded reference 1",
  },
  {
    id: "upload-2",
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
  selfId: string;
}

/** gabrielle-ai.com의 Asset Gallery를 복제한 팝업. Self Cluster/Asset Panel의 여러 진입점에서 연다. */
export function AssetGalleryDialog({
  open,
  onOpenChange,
  selfId,
}: AssetGalleryDialogProps) {
  const [deletedImageIds, setDeletedImageIds] = React.useState<Set<string>>(
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
  const yourImages = [...YOUR_IMAGES, ...archivedImages].filter(
    (image) => !deletedImageIds.has(image.id),
  );

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asset Gallery</DialogTitle>
          <DialogDescription>for {selfId}</DialogDescription>
        </DialogHeader>

        <section className="flex flex-col gap-[var(--gb-spacing-4)]">
          <h2 className="text-lg-semi-bold text-[var(--gb-text-default)]">
            Your images
          </h2>
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
        </section>

        <section className="flex flex-col gap-[var(--gb-spacing-4)]">
          <h2 className="text-lg-semi-bold text-[var(--gb-text-default)]">
            Presets
          </h2>
          <div className="grid grid-cols-4 gap-[var(--gb-spacing-4)]">
            {PRESETS.map((preset) => (
              <button key={preset.id} type="button" className="group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.src}
                  alt={preset.alt}
                  className="aspect-[4/5] w-full rounded-[var(--gb-radius-scale-2xl)] object-cover transition-opacity group-hover:opacity-80"
                />
              </button>
            ))}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
