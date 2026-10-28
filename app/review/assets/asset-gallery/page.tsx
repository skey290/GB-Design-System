"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Gnb } from "@/components/app/gnb";
import { Button } from "@/components/ui/button";
import { AssetGalleryCard } from "@/components/assets/ui/asset-gallery-card";
import { getArchivedImages } from "@/lib/archived-asset-store";

import { REVIEW_GNB_ITEMS, REVIEW_GNB_PATHS } from "../../_lib/gnb-items";

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

function AssetGalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gnbExpanded, setGnbExpanded] = React.useState(false);
  const selfId = searchParams.get("self") ?? "self-default";
  // Archive에서 보존된 이미지를 하드코딩 샘플 뒤에 이어 붙인다.
  const archivedImages = getArchivedImages(selfId).map((src, index) => ({
    id: `archived-${index}`,
    src,
    alt: "Archived profile image",
  }));
  const yourImages = [...YOUR_IMAGES, ...archivedImages];

  return (
    <div className="dark flex h-screen w-screen overflow-hidden bg-[var(--gb-background-default)]">
      <Gnb
        expanded={gnbExpanded}
        onExpandedChange={setGnbExpanded}
        items={REVIEW_GNB_ITEMS}
        activeId="assets"
        onItemSelect={(id) => router.push(REVIEW_GNB_PATHS[id] ?? "/review")}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-[var(--gb-spacing-8)] overflow-y-auto px-[var(--gb-spacing-10)] py-[var(--gb-spacing-8)]">
        <div className="flex items-center gap-[var(--gb-spacing-2)]">
          <Button
            variant="icon-ghost"
            aria-label="Back to Assets"
            icon={<ArrowLeft aria-hidden="true" className="size-full" />}
            onClick={() => router.push("/review/assets")}
          />
          <h1 className="text-2xl-semi-bold text-[var(--gb-text-default)]">
            Asset Gallery
          </h1>
          <span className="text-sm-regular text-[var(--gb-text-subtle)]">
            for {selfId}
          </span>
        </div>

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
      </div>
    </div>
  );
}

export default function AssetGalleryPage() {
  return (
    <React.Suspense fallback={null}>
      <AssetGalleryContent />
    </React.Suspense>
  );
}
