"use client";

import * as React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Chips } from "@/components/ui/chips";
import { DateSelect } from "@/components/ui/date-select";
import { InputTime } from "@/components/ui/input-time";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/lib/sprite-icon";

import { AccountPicker, PLATFORM_ICONS } from "./account-picker";
import { ConfirmPopover } from "./confirm-popover";
import {
  formatPostDate,
  parsePostDate,
  PLATFORM_IDENTITIES,
  PLATFORM_LABELS,
  type Post,
  type PostPlatform,
} from "./data";

const CONTENT_TYPE_TABS = ["All", "Image", "Text"];

export interface PostEditDialogProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveChanges: (updated: Post) => void;
  onScheduleDraft: (updated: Post) => void;
  onArchive: () => void;
}

/**
 * 개별 포스트 수정 모달. 상태별 편집 권한이 다르다(`docs/GB_Content_Studio.md`
 * 11부): Posted=읽기전용, Scheduled=편집만, Draft=편집+Schedule Draft.
 */
export function PostEditDialog({
  post,
  open,
  onOpenChange,
  onSaveChanges,
  onScheduleDraft,
  onArchive,
}: PostEditDialogProps) {
  const [draft, setDraft] = React.useState<Post | null>(post);
  const [previewPlatform, setPreviewPlatform] =
    React.useState<PostPlatform>("linkedin");
  const [contentTypeTab, setContentTypeTab] = React.useState(0);
  const [rewriteInstruction, setRewriteInstruction] = React.useState("");
  const [showArchiveConfirm, setShowArchiveConfirm] = React.useState(false);

  React.useEffect(() => {
    if (open && post) {
      setDraft(post);
      setPreviewPlatform(post.platforms[0] ?? "linkedin");
      setRewriteInstruction("");
    }
  }, [open, post]);

  if (!draft) return null;

  const isPosted = draft.status === "posted";
  const isReadOnly = isPosted;
  const isDraftStatus = draft.status === "draft";

  const handleAddPlatform = (platform: PostPlatform) => {
    setDraft((prev) =>
      prev ? { ...prev, platforms: [...prev.platforms, platform] } : prev,
    );
  };

  const handleApplyChanges = () => {
    if (!rewriteInstruction.trim()) return;
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            caption: `${prev.caption}\n\n(AI rewrite: ${rewriteInstruction})`,
          }
        : prev,
    );
    setRewriteInstruction("");
  };

  const identity = PLATFORM_IDENTITIES[previewPlatform];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="light">
        {/* Dialog 셸 폭이 CSS Module(min(90vw,560px))로 고정돼 있어
            className으로 더 넓힐 수 없다 — 2열 대신 세로 스택으로 구성 */}
        <div className="flex flex-col gap-[var(--gb-spacing-5)]">
          <div className="flex flex-1 flex-col gap-[var(--gb-spacing-4)]">
            <div className="flex flex-col gap-[var(--gb-spacing-2)]">
              <p className="text-sm-medium text-[var(--gb-text-default)]">
                Where to post?
              </p>
              <div className="flex items-center gap-[var(--gb-spacing-2)]">
                {draft.platforms.map((platform) => (
                  <Chips key={platform} variant="secondary" selected>
                    <Icon
                      id={PLATFORM_ICONS[platform]}
                      className="size-[14px]"
                    />
                    {PLATFORM_LABELS[platform]}
                  </Chips>
                ))}
                {!isReadOnly && (
                  <AccountPicker
                    connectedPlatforms={draft.platforms}
                    onAddPlatform={handleAddPlatform}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-[var(--gb-spacing-3)]">
              <DateSelect
                label="Date to post"
                defaultValue={parsePostDate(draft.date)}
                disabled={isReadOnly}
                onValueChange={(date) =>
                  setDraft((prev) =>
                    prev ? { ...prev, date: formatPostDate(date) } : prev,
                  )
                }
              />
              <InputTime
                defaultValue={draft.time.slice(0, 5)}
                defaultPeriod={draft.time.includes("PM") ? "PM" : "AM"}
                disabled={isReadOnly}
                onValueChange={(value) =>
                  setDraft((prev) => {
                    if (!prev) return prev;
                    const period = prev.time.includes("PM") ? "PM" : "AM";
                    return { ...prev, time: `${value} ${period}` };
                  })
                }
                onPeriodChange={(period) =>
                  setDraft((prev) => {
                    if (!prev) return prev;
                    const value = prev.time.slice(0, 5);
                    return { ...prev, time: `${value} ${period}` };
                  })
                }
              />
            </div>

            <Tabs
              items={CONTENT_TYPE_TABS.map((label) => ({ label }))}
              selectedIndex={contentTypeTab}
              onSelectedIndexChange={setContentTypeTab}
            />

            {!isReadOnly && (
              <div className="flex flex-col gap-[var(--gb-spacing-2)]">
                <p className="text-sm-medium text-[var(--gb-text-default)]">
                  Rewrite with AI
                </p>
                <Textarea
                  aria-label="AI 재작성 지시"
                  placeholder="예: 더 캐주얼한 톤으로, 질문형 훅으로 시작"
                  value={rewriteInstruction}
                  onValueChange={setRewriteInstruction}
                  shouldFitContainer
                />
                <Button
                  variant="outline"
                  disabled={!rewriteInstruction.trim()}
                  onClick={handleApplyChanges}
                >
                  Apply Changes
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-[var(--gb-spacing-4)]">
            {draft.platforms.length > 1 && (
              <div className="flex items-center gap-[var(--gb-spacing-2)]">
                {draft.platforms.map((platform) => (
                  <Chips
                    key={platform}
                    variant="secondary"
                    selected={previewPlatform === platform}
                    onClick={() => setPreviewPlatform(platform)}
                  >
                    {PLATFORM_LABELS[platform]}
                  </Chips>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-[var(--gb-spacing-3)] rounded-[var(--gb-radius-scale-lg)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-4)]">
              <div className="flex items-center gap-[var(--gb-spacing-2)]">
                <Icon
                  id={PLATFORM_ICONS[previewPlatform]}
                  className="size-[20px]"
                />
                <div>
                  <p className="text-sm-semi-bold text-[var(--gb-text-default)]">
                    {identity.name}
                  </p>
                  {identity.handle && (
                    <p className="text-xs-regular text-[var(--gb-text-subtle)]">
                      {identity.handle}
                    </p>
                  )}
                </div>
              </div>
              {draft.images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={draft.images[0]}
                  alt=""
                  className="aspect-square w-full rounded-[var(--gb-radius-scale-md)] object-cover"
                />
              )}
              <p className="text-sm-regular whitespace-pre-line text-[var(--gb-text-default)]">
                {draft.caption}
              </p>
              <p className="text-xs-regular text-[var(--gb-text-subtler)]">
                {draft.hashtags.join(" ")}
              </p>
            </div>

            <div className="flex items-center gap-[var(--gb-spacing-2)]">
              {isDraftStatus && (
                <ConfirmPopover
                  trigger={
                    <Button
                      variant="icon-ghost"
                      icon={<Icon id="archive-icon" />}
                      aria-label="Move to Archive"
                    />
                  }
                  open={showArchiveConfirm}
                  onOpenChange={setShowArchiveConfirm}
                  title="Move to Archive?"
                  description="This will be moved to your archive and take effect immediately."
                  onConfirm={onArchive}
                />
              )}
              <Button
                variant="outline"
                disabled={isReadOnly}
                onClick={() => onSaveChanges(draft)}
                className="flex-1"
              >
                Save Changes
              </Button>
              {isDraftStatus && (
                <Button
                  variant="primary"
                  onClick={() => onScheduleDraft(draft)}
                  className="flex-1"
                >
                  Schedule Draft
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
