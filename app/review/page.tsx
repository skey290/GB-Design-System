import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * gabrielle-ai.com 라이브 사이트를 UX 검토용으로 로컬 디자인시스템에 맞춰
 * 재구현한 4개 카피본의 인덱스. Figma 기반 WIP(`/assets`, `/compass`)와는
 * 별도 경로 — 원본 WIP는 건드리지 않는다.
 */
const REVIEW_PAGES = [
  {
    href: "/review/assets",
    title: "Assets",
    description: "Self 클러스터, Asset Gallery, Archive",
  },
  {
    href: "/review/compass",
    title: "Compass",
    description: "Compass Sphere, Analysis 4종",
  },
  {
    href: "/review/content-studio",
    title: "Content Studio",
    description: "Analysis/Content 탭, 포스트 생성 플로우",
  },
  {
    href: "/review/know-thyself",
    title: "Know Thyself",
    description: "Self-Gap/Outer/Inner/Future Self 테스트",
  },
];

export default function ReviewIndexPage() {
  return (
    <div className="dark flex min-h-screen w-full flex-col items-start gap-[var(--gb-spacing-6)] bg-[var(--gb-background-default)] p-[var(--gb-spacing-10)]">
      <div className="flex flex-col gap-[var(--gb-spacing-2)]">
        <h1 className="text-2xl-semi-bold text-[var(--gb-text-default)]">
          Live Site Review Copies
        </h1>
        <p className="text-sm-regular text-[var(--gb-text-subtle)]">
          gabrielle-ai.com의 UX 검토용 로컬 카피본입니다.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-[var(--gb-spacing-4)]">
        {REVIEW_PAGES.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className={cn(
              "flex flex-col gap-[var(--gb-spacing-2)] rounded-[var(--gb-radius-scale-lg)]",
              "border-[length:var(--gb-border-1)] border-[var(--gb-border-subtle)]",
              "bg-[var(--gb-background-subtle)] p-[var(--gb-spacing-6)]",
              "transition-colors hover:border-[var(--gb-border-selected)]",
            )}
          >
            <span className="text-lg-semi-bold text-[var(--gb-text-default)]">
              {page.title}
            </span>
            <span className="text-sm-regular text-[var(--gb-text-subtle)]">
              {page.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
