"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Chips } from "@/components/ui/chips";
import { ChatboxComposer } from "@/components/app/chatbox-composer";
import { Icon } from "@/lib/sprite-icon";

const ASSISTANT_LINES = [
  "Not just written. Already scheduled.",
  "I noticed a pattern in your Compass data — SCATTERED, but there's direction underneath it.",
  "Here are a few concepts I'm considering: “Something!” / “REFLECTIONS — captured at the right angle” / “BEYOND THE SURFACE”.",
  "Where should I post this, and how many should I prepare?",
];

export interface GenerationChatProps {
  /** 생성 개수 스테퍼 노출 여부 — 1부(첫 생성)는 숨기고 고정 9개, 5부·7부는 노출 */
  showCountStepper?: boolean;
  defaultCount?: number;
  onGenerate: (count: number) => void;
  /** Assets의 Reference 탭에서 Generate로 넘어온 레퍼런스 이미지. 없으면 행 자체를 숨김. */
  referenceImages?: string[];
}

/**
 * 대화형 생성 패널 — ChatboxComposer를 재사용해 Where to post?/Select Post
 * Type/Auto-generate를 채팅 흐름 안에 인라인으로 배치한다.
 * (`docs/GB_Content_Studio.md` 1부②③, 5부④, 7부③)
 */
export function GenerationChat({
  showCountStepper = false,
  defaultCount = 9,
  onGenerate,
  referenceImages,
}: GenerationChatProps) {
  const [postType, setPostType] = React.useState(0);
  const [count, setCount] = React.useState(defaultCount);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[var(--gb-spacing-6)] px-[var(--gb-spacing-8)]">
      <div className="flex w-full max-w-[640px] flex-col gap-[var(--gb-spacing-3)]">
        {ASSISTANT_LINES.map((line, index) => (
          <p
            key={index}
            className="text-base-regular rounded-[var(--gb-radius-scale-lg)] bg-[var(--gb-background-subtlest)] px-[var(--gb-spacing-4)] py-[var(--gb-spacing-3)] text-[var(--gb-text-default)]"
          >
            {line}
          </p>
        ))}

        <div className="flex flex-col gap-[var(--gb-spacing-3)] rounded-[var(--gb-radius-scale-lg)] border-[length:var(--gb-border-1)] border-dashed border-[var(--gb-border-bold)] p-[var(--gb-spacing-4)]">
          {referenceImages && referenceImages.length > 0 && (
            <div className="flex items-center gap-[var(--gb-spacing-2)]">
              <span className="text-sm-medium text-[var(--gb-text-default)]">
                Reference
              </span>
              <div className="flex gap-[var(--gb-spacing-1)]">
                {referenceImages.map((src, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={index}
                    src={src}
                    alt="Reference"
                    className="h-[32px] w-[32px] rounded-[var(--gb-radius-scale-md)] object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-[var(--gb-spacing-2)]">
            <span className="text-sm-medium text-[var(--gb-text-default)]">
              Where to post?
            </span>
            <Chips variant="secondary" selected>
              LinkedIn
            </Chips>
          </div>

          <div className="flex items-center gap-[var(--gb-spacing-2)]">
            <span className="text-sm-medium text-[var(--gb-text-default)]">
              Select Post Type
            </span>
            <Chips
              variant="secondary"
              selected={postType === 0}
              onClick={() => setPostType(0)}
            >
              Image
            </Chips>
            <Chips
              variant="secondary"
              selected={postType === 1}
              onClick={() => setPostType(1)}
            >
              Text
            </Chips>
          </div>

          {showCountStepper && (
            <div className="flex items-center gap-[var(--gb-spacing-3)]">
              <span className="text-sm-medium text-[var(--gb-text-default)]">
                How many posts are you going to make?
              </span>
              <Button
                variant="icon-rounded"
                icon={<Icon id="minus-icon" />}
                aria-label="감소"
                onClick={() => setCount((prev) => Math.max(0, prev - 1))}
              />
              <span className="text-sm-semi-bold w-[24px] text-center text-[var(--gb-text-default)]">
                {count}
              </span>
              <Button
                variant="icon-rounded"
                icon={<Icon id="plus-icon" />}
                aria-label="증가"
                onClick={() => setCount((prev) => prev + 1)}
              />
            </div>
          )}
        </div>

        <Button
          variant="primary"
          icon={<Icon id="sparkles-icon" />}
          disabled={showCountStepper && count === 0}
          onClick={() => onGenerate(showCountStepper ? count : defaultCount)}
        >
          Auto-generate
        </Button>
      </div>

      <ChatboxComposer
        placeholder="Tell Gabrielle more about the direction you want…"
        shouldFitContainer
        className="w-full max-w-[640px]"
      />
    </div>
  );
}
