"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Gnb } from "@/components/app/gnb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RangeSelect } from "@/components/ui/range-select";
import type { CalendarRangeValue } from "@/components/ui/calendar";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Icon } from "@/lib/sprite-icon";
import { AnalysisView } from "@/components/review/content-studio/analysis-view";
import { GenerationChat } from "@/components/review/content-studio/generation-chat";
import { ProcessingModal } from "@/components/review/content-studio/processing-modal";
import { PostCard } from "@/components/review/content-studio/post-card";
import { PostEditDialog } from "@/components/review/content-studio/post-edit-dialog";
import { SchedulePanel } from "@/components/review/content-studio/schedule-panel";
import { ScheduleSettingsPanel } from "@/components/content-studio/ui/ScheduleSettingsPanel";
import { ConfirmPopover } from "@/components/review/content-studio/confirm-popover";
import { GoalEditDialog } from "@/components/review/shared/goal-edit-dialog";
import {
  createGeneratedPosts,
  createMoreSlots,
  INITIAL_SLOTS,
  type Post,
  type ScheduleSlot,
} from "@/components/review/content-studio/data";

import { REVIEW_GNB_ITEMS, REVIEW_GNB_PATHS } from "../_lib/gnb-items";

// gabrielle-ai.com/content-studio 라이브 사이트 카피본
// (`docs/GB_Content_Studio.md` 전체 16부 기준). 기존 `app/*` 경로에
// Content Studio Figma WIP가 없어 새로 작성했다.
//
// 의도적 단순화(사전 고지, Phase 3 계획 보고 참고):
// - Funnel Analysis 상세는 플랫폼별 세부 수치 테이블을 목업 수준으로 간소화.
// - 멀티계정 캡션은 문서 확정 사항대로 계정 간 복제(개별 수정 불가)로 구현.

const SELF_OPTIONS = [
  { value: "data-scientist", label: "Data Scientist" },
  { value: "morning-jogger", label: "Morning Jogger" },
  { value: "workflow-sculptor", label: "Workflow Sculptor" },
  { value: "sunday-baker", label: "Sunday Baker" },
  { value: "vintage-curator", label: "Vintage Curator" },
  { value: "brooklyn-observer", label: "Brooklyn Observer" },
];

type GenerationTarget = {
  showCountStepper: boolean;
  defaultCount: number;
  mode: "first" | "extend" | "period-change";
};

export default function ReviewContentStudioPage() {
  const router = useRouter();
  const [gnbExpanded, setGnbExpanded] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [slots, setSlots] = React.useState<ScheduleSlot[]>(
    INITIAL_SLOTS.map((slot) => ({ ...slot, postId: null })),
  );
  const [activeSlotId, setActiveSlotId] = React.useState<string | null>(null);

  const [generationTarget, setGenerationTarget] =
    React.useState<GenerationTarget | null>(null);
  const [processingCount, setProcessingCount] = React.useState<number | null>(
    null,
  );

  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);
  const [archiveConfirmPostId, setArchiveConfirmPostId] = React.useState<
    string | null
  >(null);

  const [scheduleView, setScheduleView] = React.useState<"list" | "settings">(
    "list",
  );
  const [goalOpen, setGoalOpen] = React.useState(false);
  const [selfValue, setSelfValue] = React.useState("data-scientist");
  const [dateRange, setDateRange] = React.useState<CalendarRangeValue>({
    from: new Date(2026, 8, 1),
    to: new Date(2026, 8, 30),
  });

  const editingPost = posts.find((post) => post.id === editingPostId) ?? null;
  const hasAnyPost = posts.length > 0;

  const startGeneration = (target: GenerationTarget) =>
    setGenerationTarget(target);

  const handleGenerate = (count: number) => {
    setGenerationTarget(null);
    setProcessingCount(count);
  };

  const handleProcessingComplete = () => {
    if (processingCount === null) return;
    const startId = posts.length + 1;
    const generated = createGeneratedPosts(processingCount, startId);
    setPosts((prev) => [...prev, ...generated]);
    setSlots((prev) => {
      const emptySlotIds = prev
        .filter((slot) => slot.postId === null)
        .map((slot) => slot.id);
      const assignments = new Map(
        generated.map((post, index) => [emptySlotIds[index], post.id]),
      );
      return prev.map((slot) =>
        assignments.has(slot.id)
          ? { ...slot, postId: assignments.get(slot.id)! }
          : slot,
      );
    });
    setProcessingCount(null);
    setActiveTab(1);
  };

  const handleCreateMorePost = () => {
    setSlots((prev) => {
      const added: ScheduleSlot[] = createMoreSlots(prev.length + 1).map(
        (slot) => ({ ...slot, postId: null }),
      );
      return [...prev, ...added];
    });
  };

  const handleRangeChange = (range: CalendarRangeValue) => {
    setDateRange(range);
    setPosts([]);
    setSlots(INITIAL_SLOTS.map((slot) => ({ ...slot, postId: null })));
  };

  const handleScheduleDraft = (postId: string) =>
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, status: "scheduled" } : post,
      ),
    );

  const handleScheduleAllDraft = () =>
    setPosts((prev) =>
      prev.map((post) =>
        post.status === "draft" ? { ...post, status: "scheduled" } : post,
      ),
    );

  const handleArchivePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
    setSlots((prev) =>
      prev.map((slot) =>
        slot.postId === postId ? { ...slot, postId: null } : slot,
      ),
    );
    setArchiveConfirmPostId(null);
    setEditingPostId(null);
  };

  const handleSlotClick = (slot: ScheduleSlot) => {
    setActiveSlotId(slot.id);
    if (slot.postId) {
      setEditingPostId(slot.postId);
    } else {
      startGeneration({
        showCountStepper: true,
        defaultCount: 1,
        mode: "extend",
      });
    }
  };

  return (
    <div className="light flex h-screen w-screen overflow-hidden bg-[var(--gb-background-default)]">
      <Gnb
        expanded={gnbExpanded}
        onExpandedChange={setGnbExpanded}
        items={REVIEW_GNB_ITEMS}
        activeId="contents-studio"
        onItemSelect={(id) => router.push(REVIEW_GNB_PATHS[id] ?? "/review")}
        colorScheme="light"
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="absolute top-[20px] right-[36px] z-10 flex items-center gap-[var(--gb-spacing-3)]">
          <Select
            variant="side"
            options={SELF_OPTIONS}
            value={selfValue}
            onValueChange={setSelfValue}
          />
          <Button
            variant="icon-ghost"
            icon={<Icon id="pen-icon" />}
            aria-label="Edit Goal"
            onClick={() => setGoalOpen(true)}
          />
        </div>

        <div className="flex items-center justify-center gap-[var(--gb-spacing-4)] border-b-[length:var(--gb-border-1)] border-[var(--gb-border-subtler)] px-[var(--gb-spacing-8)] py-[var(--gb-spacing-4)]">
          <ButtonGroup
            type="menu"
            activeId="contents-studio"
            onActiveChange={(id) =>
              router.push(
                REVIEW_GNB_PATHS[id === "home" ? "dashboard" : id] ?? "/review",
              )
            }
          />
        </div>

        <div className="flex items-center justify-between px-[var(--gb-spacing-8)] py-[var(--gb-spacing-4)]">
          <div className="flex items-center gap-[var(--gb-spacing-3)]">
            <Tabs
              items={[{ label: "Analysis" }, { label: "Content" }]}
              selectedIndex={activeTab}
              onSelectedIndexChange={setActiveTab}
            />
            <Button
              variant="icon-ghost"
              icon={<Icon id="trash-2-icon" />}
              aria-label="Archive"
              onClick={() => router.push("/review/content-studio/archive")}
            />
          </div>
          <RangeSelect value={dateRange} onValueChange={handleRangeChange} />
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {activeTab === 0 && (
            <div className="w-full overflow-y-auto">
              <AnalysisView
                hasPosts={hasAnyPost}
                onCreatePosts={() =>
                  startGeneration({
                    showCountStepper: false,
                    defaultCount: 9,
                    mode: "first",
                  })
                }
              />
            </div>
          )}

          {activeTab === 1 && (
            <>
              {!hasAnyPost ? (
                <div className="flex w-full flex-col items-center justify-center gap-[var(--gb-spacing-4)]">
                  <p className="text-lg-semi-bold text-[var(--gb-text-default)]">
                    Ready to create your posts?
                  </p>
                  <p className="text-sm-regular text-[var(--gb-text-subtle)]">
                    We&rsquo;ll help you shape it to fit your brand.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() =>
                      startGeneration({
                        showCountStepper: false,
                        defaultCount: 9,
                        mode: "first",
                      })
                    }
                  >
                    Get started
                  </Button>
                </div>
              ) : (
                <>
                  {scheduleView === "settings" ? (
                    <ScheduleSettingsPanel
                      onBack={() => setScheduleView("list")}
                      onSave={() => setScheduleView("list")}
                    />
                  ) : (
                    <SchedulePanel
                      slots={slots}
                      posts={posts}
                      activeSlotId={activeSlotId}
                      onSlotClick={handleSlotClick}
                      onScheduleAllDraft={handleScheduleAllDraft}
                      onCreateMore={handleCreateMorePost}
                      onOpenSettings={() => setScheduleView("settings")}
                    />
                  )}
                  <div className="grid flex-1 grid-cols-3 gap-[var(--gb-spacing-4)] overflow-y-auto p-[var(--gb-spacing-6)] content-start">
                    {posts.map((post) => (
                      <ConfirmPopover
                        key={post.id}
                        open={archiveConfirmPostId === post.id}
                        onOpenChange={(open) =>
                          setArchiveConfirmPostId(open ? post.id : null)
                        }
                        trigger={
                          <div>
                            <PostCard
                              post={post}
                              isHighlighted={
                                slots.find((slot) => slot.postId === post.id)
                                  ?.id === activeSlotId
                              }
                              onOpenEdit={() => setEditingPostId(post.id)}
                              onScheduleDraft={() =>
                                handleScheduleDraft(post.id)
                              }
                              onArchive={() => setArchiveConfirmPostId(post.id)}
                            />
                          </div>
                        }
                        title="Move to Archive?"
                        description="This will be moved to your archive and take effect immediately."
                        onConfirm={() => handleArchivePost(post.id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog
        open={generationTarget !== null}
        onOpenChange={(open) => !open && setGenerationTarget(null)}
      >
        <DialogContent showCloseButton className="light">
          {generationTarget && (
            <GenerationChat
              showCountStepper={generationTarget.showCountStepper}
              defaultCount={generationTarget.defaultCount}
              onGenerate={handleGenerate}
            />
          )}
        </DialogContent>
      </Dialog>

      <ProcessingModal
        open={processingCount !== null}
        onCancel={() => setProcessingCount(null)}
        onComplete={handleProcessingComplete}
      />

      <PostEditDialog
        post={editingPost}
        open={editingPostId !== null}
        onOpenChange={(open) => !open && setEditingPostId(null)}
        onSaveChanges={(updated) => {
          setPosts((prev) =>
            prev.map((post) => (post.id === updated.id ? updated : post)),
          );
          setEditingPostId(null);
        }}
        onScheduleDraft={(updated) => {
          setPosts((prev) =>
            prev.map((post) =>
              post.id === updated.id
                ? { ...updated, status: "scheduled" }
                : post,
            ),
          );
          setEditingPostId(null);
        }}
        onArchive={() => editingPostId && handleArchivePost(editingPostId)}
      />

      <GoalEditDialog
        open={goalOpen}
        onOpenChange={setGoalOpen}
        colorScheme="light"
        defaultNow="4 years in finance, 3 in data science — forecasting Finance teams trust."
        defaultGoal="I'm known for Finance-Fluent Modeling Partner for early-stage SaaS founders."
        defaultPostingCount={3}
        defaultPostingFrequency="Day"
        defaultTargetedFollowersIndex={1}
        defaultTimeframe="1 year"
      />
    </div>
  );
}
