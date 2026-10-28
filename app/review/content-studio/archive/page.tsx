"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/sprite-icon";
import { ConfirmPopover } from "@/components/review/content-studio/confirm-popover";
import type { Post } from "@/components/review/content-studio/data";

/**
 * Content Studio 아카이브 전용 서브페이지. GNB의 History/Self Archive
 * 드로어와 달리 Analysis/Content 탭 옆 trash 아이콘으로 진입하는 별도
 * 화면이라 서브라우트로 둔다(`docs/GB_Content_Studio.md` 12부·13부).
 *
 * 메인 `app/review/content-studio/page.tsx`가 세션 상태(archivedPosts)를
 * 들고 있지 않아, 이 서브페이지는 데모용 목 데이터로 독립 동작한다 —
 * 리뷰 목적상 "아카이브 화면 자체의 상호작용(복원/영구삭제)"을 보여주는
 * 것이 목표라 메인 페이지와의 상태 공유는 범위 밖으로 둔다.
 */
const MOCK_ARCHIVED: (Post & { deletedAt: string })[] = [
  {
    id: "archived-1",
    status: "draft",
    contentType: "image",
    image: "/images/personas/vegan-chef.jpg",
    caption: 'What founders actually mean when they say "show me the model."',
    hashtags: ["#DataStorytelling"],
    platforms: ["linkedin"],
    date: "08.28.2026",
    time: "10:00 PM",
    deletedAt: "Aug 28, 09:12 PM",
  },
  {
    id: "archived-2",
    status: "scheduled",
    contentType: "text",
    image: "/images/personas/yoga-meditator.jpg",
    caption:
      "Consistency isn't a content calendar. It's a decision you stop having to make.",
    hashtags: ["#BrandVoice"],
    platforms: ["linkedin"],
    date: "08.27.2026",
    time: "02:25 PM",
    deletedAt: "Aug 27, 03:40 PM",
  },
];

export default function ContentStudioArchivePage() {
  const router = useRouter();
  const [items, setItems] = React.useState(MOCK_ARCHIVED);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? null);

  const handleRestore = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const handleDelete = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <div className="dark flex h-screen w-screen overflow-hidden bg-[var(--gb-background-default)]">
      <div className="flex w-[280px] shrink-0 flex-col gap-[var(--gb-spacing-2)] border-r-[length:var(--gb-border-1)] border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
        <div className="mb-[var(--gb-spacing-3)] flex items-center gap-[var(--gb-spacing-2)]">
          <Button
            variant="icon-ghost"
            aria-label="Back to Content Studio"
            icon={<ArrowLeft aria-hidden="true" className="size-full" />}
            onClick={() => router.push("/review/content-studio")}
          />
          <h1 className="text-lg-semi-bold text-[var(--gb-text-default)]">
            Archive
          </h1>
        </div>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
            className={`text-sm-regular rounded-[var(--gb-radius-scale-md)] px-[var(--gb-spacing-3)] py-[var(--gb-spacing-2)] text-left ${
              selectedId === item.id
                ? "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-selected)] text-[var(--gb-text-default)]"
                : "border-[length:var(--gb-border-1)] border-solid border-transparent text-[var(--gb-text-subtle)]"
            }`}
          >
            Deleted at {item.deletedAt}
          </button>
        ))}
        {items.length === 0 && (
          <p className="text-sm-regular text-[var(--gb-text-subtle)]">
            보관함이 비어 있습니다.
          </p>
        )}
      </div>

      <div className="grid flex-1 grid-cols-3 gap-[var(--gb-spacing-4)] overflow-y-auto p-[var(--gb-spacing-6)] content-start">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col gap-[var(--gb-spacing-2)] rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-solid p-[var(--gb-spacing-3)] ${
              selectedId === item.id
                ? "border-[var(--gb-border-selected)]"
                : "border-[var(--gb-border-subtler)]"
            }`}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt=""
                className="aspect-square w-full rounded-[var(--gb-radius-scale-lg)] object-cover opacity-[var(--gb-opacity-60)]"
              />
              <ConfirmPopover
                trigger={
                  <Button
                    variant="icon-ghost"
                    icon={<Icon id="x-icon" />}
                    aria-label="영구 삭제"
                    className="absolute top-[var(--gb-spacing-1)] right-[var(--gb-spacing-1)] bg-[var(--gb-background-default)]"
                  />
                }
                title="⚠ Are you sure you want to delete this?"
                description="This will not be saved and take effect immediately."
                onConfirm={() => handleDelete(item.id)}
              />
            </div>
            <p className="text-sm-medium line-clamp-2 text-[var(--gb-text-default)]">
              {item.caption}
            </p>
            <ConfirmPopover
              trigger={<Button variant="outline">Restore</Button>}
              title="Restore this post?"
              description="Move this back to your schedule. It will be visible again and ready to use."
              confirmLabel="Confirm"
              onConfirm={() => handleRestore(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
