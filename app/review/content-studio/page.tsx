"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Gnb } from "@/components/app/gnb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { CalendarRangeValue } from "@/components/ui/calendar";
import { Toggle } from "@/components/ui/toggle";
import { AnalysisView } from "@/components/review/content-studio/analysis-view";
import { GenerationChat } from "@/components/review/content-studio/generation-chat";
import { ProcessingModal } from "@/components/review/content-studio/processing-modal";
import { PostCard } from "@/components/content-studio/ui/PostCard";
import { PostEditDialog } from "@/components/review/content-studio/post-edit-dialog";
import {
  SchedulePanel,
  type SchedulePanelGroup,
  type SchedulePanelSlot,
} from "@/components/content-studio/ui/SchedulePanel";
import { ProfileCard } from "@/components/content-studio/ui/ProfileCard";
import { ScheduleSettingsPanel } from "@/components/content-studio/ui/ScheduleSettingsPanel";
import { ConfirmPopover } from "@/components/review/content-studio/confirm-popover";
import { IncompleteProfileDialog } from "@/components/review/content-studio/incomplete-profile-dialog";
import { GoalEditDialog } from "@/components/review/shared/goal-edit-dialog";
import { ContentGoalDialog } from "@/components/review/shared/content-goal-dialog";
import { ToneOfVoiceDialog } from "@/components/review/shared/tone-of-voice-dialog";
import {
  SELF_OPTIONS,
  getSelfImage,
  setContentGoal,
  setSelfGoal,
  setToneOfVoice,
  useContentGoal,
  useSelfGoal,
  useToneOfVoice,
  type ContentGoalData,
  type ToneOfVoiceData,
} from "@/components/review/shared/self-goal-data";
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

// 좌측 패널/우측 콘텐츠 영역을 각자 색이 다른 패널로 나누지 않고, 스크롤
// 가능한 캔버스 전체가 하나로 이어진 배경처럼 보이도록 하는 레이어.
// Assets/Compass의 dotted canvas 배경(dark 전용)과 같은 구조를 light 톤
// 토큰으로 적용한 버전.
function DottedBackground() {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0",
        "bg-[var(--gb-background-subtlest)]",
        "bg-[radial-gradient(circle,var(--gb-color-neutral-300)_1px,transparent_1px)]",
        "bg-[length:var(--gb-spacing-6)_var(--gb-spacing-6)]",
      )}
    />
  );
}

type GenerationTarget = {
  showCountStepper: boolean;
  defaultCount: number;
  mode: "first" | "extend" | "period-change";
};

export default function ReviewContentStudioPage() {
  const router = useRouter();
  const [gnbExpanded, setGnbExpanded] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(1);

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
  const [contentGoalOpen, setContentGoalOpen] = React.useState(false);
  const [toneOfVoiceOpen, setToneOfVoiceOpen] = React.useState(false);
  const [selfValue, setSelfValue] = React.useState("data-scientist");
  const selfGoal = useSelfGoal(selfValue);
  const contentGoal = useContentGoal(selfValue);
  const toneOfVoice = useToneOfVoice(selfValue);
  const draftGoalRef = React.useRef({ now: "", next: "" });
  const draftContentGoalRef = React.useRef<ContentGoalData>({
    contentGoal: "",
    pillars: [],
    ratio: "Balanced",
    postingCount: 3,
    postingFrequencyUnit: "Week",
  });
  const draftToneOfVoiceRef = React.useRef<ToneOfVoiceData>({
    traits: [],
    referenceLink: "",
    referenceText: "",
    referenceFileName: "",
  });
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [incompleteProfileOpen, setIncompleteProfileOpen] =
    React.useState(false);
  const [completionQueue, setCompletionQueue] = React.useState<
    Array<"self" | "content" | "tone">
  >([]);
  const [dateRange, setDateRange] = React.useState<CalendarRangeValue>({
    from: new Date(2026, 8, 1),
    to: new Date(2026, 8, 30),
  });

  const editingPost = posts.find((post) => post.id === editingPostId) ?? null;
  const hasAnyPost = posts.length > 0;

  const scheduleGroups = React.useMemo<SchedulePanelGroup[]>(() => {
    const postById = new Map(posts.map((post) => [post.id, post]));
    const groupOrder: string[] = [];
    const groupsByKey = new Map<string, SchedulePanelGroup>();
    for (const slot of slots) {
      const key = `${slot.dayLabel}|${slot.date}`;
      const post = slot.postId ? postById.get(slot.postId) : null;
      const type: SchedulePanelSlot["type"] =
        post?.status === "no-content" || !post ? "no content" : post.status;
      const panelSlot: SchedulePanelSlot = {
        rowId: slot.id,
        type,
        time: slot.time,
      };
      const group = groupsByKey.get(key);
      if (group) {
        group.slots.push(panelSlot);
      } else {
        groupOrder.push(key);
        groupsByKey.set(key, {
          date: `${slot.dayLabel}, ${slot.date}`,
          slots: [panelSlot],
        });
      }
    }
    return groupOrder.map((key) => groupsByKey.get(key)!);
  }, [slots, posts]);

  const missingProfileItems = [
    selfGoal === undefined && "Self-Goal",
    contentGoal === undefined && "Content Goal",
    toneOfVoice === undefined && "Tone of Voice",
  ].filter((item): item is string => Boolean(item));

  const startGeneration = (target: GenerationTarget) =>
    setGenerationTarget(target);

  const requestGeneration = (target: GenerationTarget) => {
    if (missingProfileItems.length > 0) {
      setIncompleteProfileOpen(true);
      return;
    }
    startGeneration(target);
  };

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

  const handleOpenGoalEditor = () => {
    draftGoalRef.current = {
      now: selfGoal?.now ?? "",
      next: selfGoal?.next ?? "",
    };
    setGoalOpen(true);
  };

  const handleOpenContentGoalEditor = () => {
    draftContentGoalRef.current = contentGoal ?? {
      contentGoal: "",
      pillars: [],
      ratio: "Balanced",
      postingCount: 3,
      postingFrequencyUnit: "Week",
    };
    setContentGoalOpen(true);
  };

  const handleOpenToneOfVoiceEditor = () => {
    draftToneOfVoiceRef.current = toneOfVoice ?? {
      traits: [],
      referenceLink: "",
      referenceText: "",
      referenceFileName: "",
    };
    setToneOfVoiceOpen(true);
  };

  // "Complete now" walks through whichever of Self-Goal/Content Goal/Tone of
  // Voice are still missing, one edit dialog at a time — advanceCompletionQueue
  // pops the front and this effect opens whatever is now at the front.
  React.useEffect(() => {
    if (completionQueue.length === 0) return;
    const next = completionQueue[0];
    if (next === "self") handleOpenGoalEditor();
    else if (next === "content") handleOpenContentGoalEditor();
    else if (next === "tone") handleOpenToneOfVoiceEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completionQueue]);

  const advanceCompletionQueue = () =>
    setCompletionQueue((queue) => queue.slice(1));

  const handleCompleteProfileNow = () => {
    setIncompleteProfileOpen(false);
    setCompletionQueue(
      [
        selfGoal === undefined && "self",
        contentGoal === undefined && "content",
        toneOfVoice === undefined && "tone",
      ].filter((item): item is "self" | "content" | "tone" => Boolean(item)),
    );
  };

  const handleSlotClick = (slot: ScheduleSlot) => {
    setActiveSlotId(slot.id);
    if (slot.postId) {
      setEditingPostId(slot.postId);
    } else {
      requestGeneration({
        showCountStepper: true,
        defaultCount: 1,
        mode: "extend",
      });
    }
  };

  return (
    <div className="light relative flex h-screen w-screen overflow-hidden bg-[var(--gb-background-default)]">
      <DottedBackground />

      <Gnb
        expanded={gnbExpanded}
        onExpandedChange={setGnbExpanded}
        items={REVIEW_GNB_ITEMS}
        activeId="contents-studio"
        onItemSelect={(id) => router.push(REVIEW_GNB_PATHS[id] ?? "/review")}
        colorScheme="light"
        className="z-4"
      />

      <div className="relative z-4 flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full w-[380px] shrink-0 flex-col">
            <div className="flex items-center px-[var(--gb-spacing-5)] py-[var(--gb-spacing-4)]">
              <Toggle
                type="text"
                items={[
                  {
                    text: "Content",
                    pressed: activeTab === 1,
                    onPressedChange: () => setActiveTab(1),
                  },
                  {
                    text: "Analysis",
                    pressed: activeTab === 0,
                    onPressedChange: () => setActiveTab(0),
                  },
                ]}
                trailingAction={{
                  icon: "archive-icon",
                  "aria-label": "Archive",
                  onClick: () => router.push("/review/content-studio/archive"),
                }}
              />
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-[var(--gb-spacing-5)] py-[var(--gb-spacing-5)]">
              <ProfileCard
                className="shrink-0"
                open={profileOpen}
                avatarSrc={getSelfImage(selfValue)}
                options={SELF_OPTIONS}
                value={selfValue}
                onValueChange={setSelfValue}
                onToggleOpen={() => setProfileOpen((prev) => !prev)}
                isSelfGoalComplete={selfGoal !== undefined}
                knownForNowText={selfGoal?.now}
                knownForNextText={selfGoal?.next}
                isContentGoalComplete={contentGoal !== undefined}
                contentGoalText={
                  contentGoal
                    ? [
                        contentGoal.contentGoal,
                        contentGoal.pillars.join(", "),
                        contentGoal.ratio,
                        `${contentGoal.postingCount}x/${contentGoal.postingFrequencyUnit.toLowerCase()}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")
                    : undefined
                }
                isToneOfVoiceComplete={toneOfVoice !== undefined}
                toneOfVoiceText={
                  toneOfVoice
                    ? [
                        toneOfVoice.traits.join(", "),
                        toneOfVoice.referenceFileName ||
                          toneOfVoice.referenceLink ||
                          toneOfVoice.referenceText,
                      ]
                        .filter(Boolean)
                        .join(" · ")
                    : undefined
                }
                onEditSelfGoal={handleOpenGoalEditor}
                onEditContentGoal={handleOpenContentGoalEditor}
                onEditToneOfVoice={handleOpenToneOfVoiceEditor}
              />
              {scheduleView === "settings" ? (
                <ScheduleSettingsPanel
                  className="min-h-0 flex-1"
                  onBack={() => setScheduleView("list")}
                  onSave={() => setScheduleView("list")}
                />
              ) : (
                <SchedulePanel
                  className="min-h-[300px] flex-1"
                  groups={scheduleGroups}
                  dateRange={dateRange}
                  onDateRangeChange={handleRangeChange}
                  selectedRowId={activeSlotId}
                  onSlotClick={(panelSlot) => {
                    const slot = slots.find((s) => s.id === panelSlot.rowId);
                    if (slot) handleSlotClick(slot);
                  }}
                  onScheduleAllDraft={handleScheduleAllDraft}
                  onCreateMorePost={handleCreateMorePost}
                  onOpenSettings={() => setScheduleView("settings")}
                />
              )}
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-col overflow-hidden">
            <div className="flex items-center justify-center gap-[var(--gb-spacing-4)] border-b-[length:var(--gb-border-1)] border-[var(--gb-border-subtler)] px-[var(--gb-spacing-8)] py-[var(--gb-spacing-4)]">
              <ButtonGroup
                type="menu"
                activeId="contents-studio"
                onActiveChange={(id) =>
                  router.push(
                    REVIEW_GNB_PATHS[id === "home" ? "dashboard" : id] ??
                      "/review",
                  )
                }
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {activeTab === 0 ? (
                <AnalysisView
                  hasPosts={hasAnyPost}
                  onCreatePosts={() =>
                    requestGeneration({
                      showCountStepper: false,
                      defaultCount: 9,
                      mode: "first",
                    })
                  }
                />
              ) : !hasAnyPost ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-[var(--gb-spacing-4)]">
                  <p className="text-lg-semi-bold text-[var(--gb-text-default)]">
                    Ready to create your posts?
                  </p>
                  <p className="text-sm-regular text-[var(--gb-text-subtle)]">
                    We&rsquo;ll help you shape it to fit your brand.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() =>
                      requestGeneration({
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
                            onScheduleDraft={() => handleScheduleDraft(post.id)}
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
              )}
            </div>
          </div>
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

      <IncompleteProfileDialog
        open={incompleteProfileOpen}
        onOpenChange={setIncompleteProfileOpen}
        missingItems={missingProfileItems}
        onCompleteNow={handleCompleteProfileNow}
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
        onOpenChange={(open) => {
          setGoalOpen(open);
          if (!open) advanceCompletionQueue();
        }}
        colorScheme="light"
        defaultNow={selfGoal?.now ?? ""}
        defaultGoal={selfGoal?.next ?? ""}
        onNowChange={(value) => {
          draftGoalRef.current.now = value;
        }}
        onGoalChange={(value) => {
          draftGoalRef.current.next = value;
        }}
        onSave={() => {
          setSelfGoal(selfValue, {
            now: draftGoalRef.current.now,
            next: draftGoalRef.current.next,
          });
          setGoalOpen(false);
          advanceCompletionQueue();
        }}
        defaultPostingCount={3}
        defaultPostingFrequency="Day"
        defaultTargetedFollowersIndex={1}
        defaultTimeframe="1 year"
      />

      <ContentGoalDialog
        open={contentGoalOpen}
        onOpenChange={(open) => {
          setContentGoalOpen(open);
          if (!open) advanceCompletionQueue();
        }}
        defaultContentGoal={contentGoal?.contentGoal ?? ""}
        defaultPillars={contentGoal?.pillars ?? []}
        defaultRatio={contentGoal?.ratio ?? "Balanced"}
        defaultPostingCount={contentGoal?.postingCount ?? 3}
        defaultPostingFrequencyUnit={
          contentGoal?.postingFrequencyUnit ?? "Week"
        }
        onContentGoalChange={(value) => {
          draftContentGoalRef.current.contentGoal = value;
        }}
        onPillarsChange={(value) => {
          draftContentGoalRef.current.pillars = value;
        }}
        onRatioChange={(value) => {
          draftContentGoalRef.current.ratio = value;
        }}
        onPostingCountChange={(value) => {
          draftContentGoalRef.current.postingCount = value;
        }}
        onPostingFrequencyUnitChange={(value) => {
          draftContentGoalRef.current.postingFrequencyUnit = value;
        }}
        onSave={() => {
          setContentGoal(selfValue, { ...draftContentGoalRef.current });
          setContentGoalOpen(false);
          advanceCompletionQueue();
        }}
      />

      <ToneOfVoiceDialog
        open={toneOfVoiceOpen}
        onOpenChange={(open) => {
          setToneOfVoiceOpen(open);
          if (!open) advanceCompletionQueue();
        }}
        defaultReferenceLink={toneOfVoice?.referenceLink ?? ""}
        defaultReferenceText={toneOfVoice?.referenceText ?? ""}
        defaultTraits={toneOfVoice?.traits ?? []}
        onReferenceFileChange={(file) => {
          draftToneOfVoiceRef.current.referenceFileName = file?.name ?? "";
        }}
        onReferenceLinkChange={(value) => {
          draftToneOfVoiceRef.current.referenceLink = value;
        }}
        onReferenceTextChange={(value) => {
          draftToneOfVoiceRef.current.referenceText = value;
        }}
        onTraitsChange={(value) => {
          draftToneOfVoiceRef.current.traits = value;
        }}
        onSave={() => {
          setToneOfVoice(selfValue, { ...draftToneOfVoiceRef.current });
          setToneOfVoiceOpen(false);
          advanceCompletionQueue();
        }}
      />
    </div>
  );
}
