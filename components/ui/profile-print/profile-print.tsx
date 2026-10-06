"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

/**
 * Figma "Profile print" 페이지(node-id 7256:22281), 내부 컴포넌트명 `Part/Print`.
 * `type` variant(process/completed/upload)를 `type` prop으로 그대로 매핑했습니다.
 *
 * - `process`: 정사각 시머 로더(`Skeleton` 재사용) + 중앙 "Processing" 배지(`Spinner
 *   variant="primary"` 재사용 — 배지의 bg/text 색상·치수가 Figma 스펙과 정확히 일치:
 *   `--background-bold`/`--text-invert`는 Shadcn `--primary`/`--primary-foreground`에
 *   alias되어 있음).
 * - `completed`: 정사각 인물 사진(object-cover) + 하단 우측 타임스탬프.
 * - `upload`: 빈 상태 CTA 카드. "Open your folder" 버튼은 `Button variant="outline"`을
 *   재사용하고, 숨겨진 `<input type="file">`을 트리거해 `onFileSelect` 콜백으로 선택
 *   결과를 전달합니다(Figma는 정적 디자인이라 실제 파일 선택 동작을 표현할 수 없어
 *   기능적으로 추가 — `input-image.tsx`의 sr-only 파일 인풋 패턴과 동일).
 *
 * 컨테이너 폭 542px(및 upload 상태 높이 642px)은 floating-profile(620px 고정폭)
 * 선례와 동일하게 Figma 원본 px 값을 그대로 사용합니다.
 *
 * Figma의 `type=upload` variant에는 컨테이너 전체를 덮는 장식용 SVG(`imgTypeUpload`)가
 * 있었지만, 다운로드해 대조한 결과 다른 두 variant가 `bg-white + padding`으로 만드는
 * 흰 테두리와 치수까지 완전히 동일한 "Subtract" 프레임 도형이라 실제 이미지 애셋이
 * 아니었습니다. 그래서 기본값은 동일한 `bg-white + padding`으로 재현하되, 추후 실제
 * 이미지 애셋(텍스처/워터마크 등)이 필요해지면 바로 끼워넣을 수 있도록
 * `emptyStateBackgroundSrc` prop으로 교체 지점을 열어뒀습니다(미지정 시 아무 것도
 * 렌더링하지 않아 현재 디자인과 동일).
 */
export interface ProfilePrintProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Figma `type` — 기본값도 Figma와 동일하게 "process" */
  type?: "process" | "completed" | "upload";
  /** `process`/`completed` 상태 우하단 타임스탬프 (Figma 예시: "2026.03.24 19:24:06") */
  timestamp?: string;
  /** `completed` 상태 인물 사진 */
  portraitSrc?: string;
  portraitAlt?: string;
  /**
   * `upload` 상태 배경에 끼워 넣을 이미지(텍스처/워터마크 등). 미지정 시 기본
   * `bg-white + padding` 흰 테두리 그대로 렌더링됩니다(Figma 원본과 동일한 결과).
   */
  emptyStateBackgroundSrc?: string;
  emptyStateBackgroundAlt?: string;
  /** `upload` 상태 "Open your folder" 클릭 → 파일 선택 결과 콜백 */
  onFileSelect?: (file: File | null) => void;
}

export function ProfilePrint({
  type = "process",
  timestamp = "2026.03.24 19:24:06",
  portraitSrc,
  portraitAlt = "",
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
        "relative flex w-[542px] flex-col items-center justify-center overflow-clip",
        "bg-[var(--background-static-white)]",
        "px-[var(--spacing-4)] pt-[var(--spacing-9)] pb-[var(--spacing-24)]",
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
          <div className="relative aspect-square w-full shrink-0 overflow-hidden">
            <img
              src={portraitSrc}
              alt={portraitAlt}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <p className="text-time-stamp absolute bottom-[18px] right-[13px] text-[var(--text-subtle)]">
            {timestamp}
          </p>
        </>
      )}

      {isProcess && (
        <>
          <div className="relative w-full shrink-0">
            <Skeleton
              shape="rect"
              className="aspect-square h-auto w-full rounded-none"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner variant="primary" label="Processing" />
            </div>
          </div>
          <p className="text-time-stamp absolute bottom-[18px] right-[13px] text-[var(--text-subtle)]">
            {timestamp}
          </p>
        </>
      )}

      {isUpload && (
        <>
          <div
            className={cn(
              "relative flex size-[510px] shrink-0 flex-col items-center justify-center",
              "gap-[var(--spacing-6)] opacity-[var(--opacity-85)]",
              "border-[length:var(--border-2)] border-dashed border-[var(--border-muted)]",
              "bg-[var(--background-bolder)] backdrop-blur-[var(--backdrop-blur-md)]",
            )}
          >
            <div className="flex w-full shrink-0 flex-col items-center gap-[var(--spacing-2)]">
              <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-subtler)]">
                {/* 아이콘 색상은 Figma에서 실제로 --border-bolder 변수에 바인딩되어 있음
                    (get_variable_defs로 확인, 이름은 "border"지만 이 인스턴스에서 아이콘
                    stroke 색으로 쓰임). light #0a0a0a / dark #fafafa로 --background-subtler
                    (light #f5f5f5 / dark #262626)와 항상 대비를 이뤄, 다크모드에서 정적
                    --color-neutral-950(#0a0a0a 고정)을 쓰면 배경과 아이콘이 둘 다 어두워져
                    묻히는 문제가 있었음. */}
                <svg
                  className="size-[24px] text-[var(--border-bolder)]"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#asset-icon" />
                </svg>
              </div>
              <p className="text-lg-medium w-full min-w-full text-center text-[var(--border-overlay)]">
                {`Let's create your brand image!`}
              </p>
              <p className="text-sm-regular w-full min-w-full whitespace-pre-wrap text-center text-[var(--text-selected)]">
                {`We'll craft an image that fits your personal brand.`}
                <br aria-hidden="true" />
                {` Upload a photo to get started.`}
              </p>
            </div>

            <Button
              variant="outline"
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
          <p className="text-time-stamp absolute bottom-[18px] right-[13px] text-[var(--text-subtle)]">
            Gabrielle.ai
          </p>
        </>
      )}
    </div>
  );
}
