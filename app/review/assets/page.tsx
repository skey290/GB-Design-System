"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Gnb } from "@/components/app/gnb";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  SelfCluster,
  type ClusterSelf,
  type SelfMenuAction,
} from "@/components/assets/ui/self-cluster";
import { Popover } from "@/components/ui/popover";
import { Icon } from "@/lib/sprite-icon";
import { GoalEditDialog } from "@/components/review/shared/goal-edit-dialog";
import { AssetGalleryDialog } from "@/components/review/assets/asset-gallery-dialog";
import { addArchivedImage } from "@/lib/archived-asset-store";
import {
  AssetPanel,
  type AssetPanelSelfProfile,
} from "@/components/assets/ui/asset-panel";
import type {
  GoalPostingFrequency,
  GoalSettingAction,
  GoalTimeframe,
} from "@/components/app/goal-setting";

import { REVIEW_GNB_ITEMS, REVIEW_GNB_PATHS } from "../_lib/gnb-items";

// gabrielle-ai.com/assets 라이브 사이트 카피본. 기존 `app/assets/page.tsx`
// (Figma 기반 WIP, Self 1개만)와 달리, 라이브 조사 결과에 따라 복수 Self
// 클러스터/Self 액션 메뉴/Create Self 모달/Asset Gallery 이동을 포함한다.

interface PersonaDefinition extends Omit<ClusterSelf, "slotId"> {
  description: string;
  knownForNow: string;
  knownForNext: string;
  postingCount: number;
  postingFrequency: GoalPostingFrequency;
  targetedFollowersIndex: number;
  timeframe: GoalTimeframe;
  goalActions: GoalSettingAction[];
}

function buildGoalActions(id: string): GoalSettingAction[] {
  return [
    {
      id: `${id}-goal-1`,
      category: "Content Studio",
      label: "Plan a content series for your next goal",
    },
    {
      id: `${id}-goal-2`,
      category: "Assets",
      label: "Create assets for your target persona",
    },
    {
      id: `${id}-goal-3`,
      category: "Compass",
      label: "Set a growth milestone",
    },
    {
      id: `${id}-goal-4`,
      category: "Content Studio",
      label: "A/B test two captions",
    },
    {
      id: `${id}-goal-5`,
      category: "Assets",
      label: "Build a reference moodboard",
    },
  ];
}

const PERSONA_POOL: PersonaDefinition[] = [
  {
    id: "self-default",
    label: "Data Scientist",
    image: "/images/personas/self-default.jpg",
    description:
      "4 years in finance, 3 in data science — forecasting Finance teams trust.",
    knownForNow:
      "I'm known for Finance-Fluent Modeling Partner for early-stage SaaS founders.",
    knownForNext:
      "I'm known for Finance-Fluent Modeling Partner for early-stage SaaS founders.",
    postingCount: 3,
    postingFrequency: "Day",
    targetedFollowersIndex: 1,
    timeframe: "1 year",
    goalActions: buildGoalActions("self-default"),
  },
  {
    id: "team-leader",
    label: "Office Worker",
    image: "/images/personas/team-leader.jpg",
    description:
      "6 years leading cross-functional teams — turning scattered priorities into shipped roadmaps.",
    knownForNow:
      "I'm known for the Project Lead who ships messy roadmaps on time.",
    knownForNext:
      "I'm known for the Project Lead who ships messy roadmaps on time.",
    postingCount: 2,
    postingFrequency: "Week",
    targetedFollowersIndex: 0,
    timeframe: "6 months",
    goalActions: buildGoalActions("team-leader"),
  },
  {
    id: "entrepreneur",
    label: "Entrepreneur",
    image: "/images/personas/entrepreneur.jpg",
    description:
      "2 exits, 1 ongoing raise — building in public with investors watching.",
    knownForNow:
      "I'm known for the Solo Founder scaling a seed-stage SaaS from zero.",
    knownForNext:
      "I'm known for the Solo Founder scaling a seed-stage SaaS from zero.",
    postingCount: 5,
    postingFrequency: "Day",
    targetedFollowersIndex: 2,
    timeframe: "3 months",
    goalActions: buildGoalActions("entrepreneur"),
  },
  {
    id: "fashion-editor",
    label: "Fashion Editor",
    image: "/images/personas/fashion-editor.jpg",
    description:
      "8 years at print and digital fashion desks — spotting trends before they trend.",
    knownForNow:
      "I'm known for the Editor curating runway-to-retail style stories.",
    knownForNext:
      "I'm known for the Editor curating runway-to-retail style stories.",
    postingCount: 4,
    postingFrequency: "Day",
    targetedFollowersIndex: 3,
    timeframe: "1 year",
    goalActions: buildGoalActions("fashion-editor"),
  },
  {
    id: "fashionista",
    label: "Fashionista",
    image: "/images/personas/fashionista.jpg",
    description: "Styling everyday outfits with a thrifted, high-low mix.",
    knownForNow: "I'm known for the Stylist making secondhand look designer.",
    knownForNext: "I'm known for the Stylist making secondhand look designer.",
    postingCount: 1,
    postingFrequency: "Day",
    targetedFollowersIndex: 1,
    timeframe: "6 months",
    goalActions: buildGoalActions("fashionista"),
  },
  {
    id: "novelist",
    label: "English Novelist",
    image: "/images/personas/novelist.jpg",
    description:
      "3 published novels — writing slow mornings and quiet character studies.",
    knownForNow:
      "I'm known for the Novelist behind quiet, character-driven fiction.",
    knownForNext:
      "I'm known for the Novelist behind quiet, character-driven fiction.",
    postingCount: 3,
    postingFrequency: "Week",
    targetedFollowersIndex: 0,
    timeframe: "1 year",
    goalActions: buildGoalActions("novelist"),
  },
  {
    id: "vegan-chef",
    label: "Vegan Chef",
    image: "/images/personas/vegan-chef.jpg",
    description: "Plant-based recipes tested in a tiny apartment kitchen.",
    knownForNow:
      "I'm known for the Chef turning pantry staples into weeknight vegan meals.",
    knownForNext:
      "I'm known for the Chef turning pantry staples into weeknight vegan meals.",
    postingCount: 5,
    postingFrequency: "Week",
    targetedFollowersIndex: 2,
    timeframe: "3 months",
    goalActions: buildGoalActions("vegan-chef"),
  },
  {
    id: "yoga-meditator",
    label: "Yoga Meditator",
    image: "/images/personas/yoga-meditator.jpg",
    description: "200-hour certified — guiding breathwork for beginners.",
    knownForNow:
      "I'm known for the Teacher making meditation feel approachable.",
    knownForNext:
      "I'm known for the Teacher making meditation feel approachable.",
    postingCount: 3,
    postingFrequency: "Day",
    targetedFollowersIndex: 1,
    timeframe: "1 year",
    goalActions: buildGoalActions("yoga-meditator"),
  },
];

const INITIAL_SELVES: ClusterSelf[] = [
  { ...PERSONA_POOL[0]!, slotId: "north" },
  { ...PERSONA_POOL[1]!, slotId: "north-east" },
];

function DottedBackground() {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 opacity-[var(--gb-opacity-50)]",
        "bg-[var(--gb-color-neutral-950)]",
        "bg-[radial-gradient(circle,var(--gb-color-neutral-700)_1px,transparent_1px)]",
        "bg-[length:var(--gb-spacing-6)_var(--gb-spacing-6)]",
      )}
    />
  );
}

export default function ReviewAssetsPage() {
  const router = useRouter();
  const [gnbExpanded, setGnbExpanded] = React.useState(false);
  const [selves, setSelves] = React.useState<ClusterSelf[]>(INITIAL_SELVES);
  const [activeSelfId, setActiveSelfId] = React.useState(INITIAL_SELVES[0]!.id);
  const [pendingSlotId, setPendingSlotId] = React.useState<string | null>(null);
  // "Move to Archive" 확인 팝업 대상 Self — Confirm 전까지는 실제 아카이브 처리를 하지 않는다.
  const [archivingSelf, setArchivingSelf] = React.useState<ClusterSelf | null>(
    null,
  );
  // 이미지 확대 미리보기가 AssetPanel을 가리지 않고 캔버스 영역 안에서만 뜨도록, 그 컨테이너를 상태로 들고 있는다.
  const [canvasEl, setCanvasEl] = React.useState<HTMLDivElement | null>(null);
  // Edit Goal로 편집 중인 Self — GoalEditDialog(type=default)를 그 Self의 기존 입력값으로 채워서 연다.
  const [editingGoalSelfId, setEditingGoalSelfId] = React.useState<
    string | null
  >(null);
  // Asset Gallery 팝업 대상 Self — 더 이상 별도 라우트로 이동하지 않고 모달로 띄운다.
  const [galleryOpenForSelfId, setGalleryOpenForSelfId] = React.useState<
    string | null
  >(null);

  const usedPersonaIds = new Set(selves.map((self) => self.id));
  const nextPersona = PERSONA_POOL.find(
    (persona) => !usedPersonaIds.has(persona.id),
  );

  const handleAddSelf = (slotId: string) => setPendingSlotId(slotId);

  const handleCreateContinue = () => {
    if (!pendingSlotId || !nextPersona) {
      setPendingSlotId(null);
      return;
    }
    setSelves((prev) => [
      ...prev,
      { ...nextPersona, slotId: pendingSlotId as ClusterSelf["slotId"] },
    ]);
    setPendingSlotId(null);
    goToAssetGallery(nextPersona.id);
  };

  const goToAssetGallery = (selfId: string) => setGalleryOpenForSelfId(selfId);

  const handleConfirmArchive = () => {
    const self = archivingSelf;
    if (!self) return;
    addArchivedImage(self.id, self.image);
    const remaining = selves.filter((s) => s.id !== self.id);
    setSelves(remaining);
    if (activeSelfId === self.id) {
      setActiveSelfId(remaining[0]?.id ?? PERSONA_POOL[0]!.id);
    }
    setArchivingSelf(null);
    goToAssetGallery(self.id);
  };

  const getSelfMenuActions = (self: ClusterSelf): SelfMenuAction[] => [
    {
      label: "Create a Post",
      onSelect: () => router.push("/review/content-studio"),
    },
    {
      label: "Go to Asset Gallery",
      onSelect: () => goToAssetGallery(self.id),
    },
    { label: "Move to Archive", onSelect: () => setArchivingSelf(self) },
    {
      label: "Edit Goal",
      onSelect: () => {
        setActiveSelfId(self.id);
        setEditingGoalSelfId(self.id);
      },
    },
  ];

  const activePersona =
    PERSONA_POOL.find((persona) => persona.id === activeSelfId) ??
    PERSONA_POOL[0]!;
  const activeSelfProfile: AssetPanelSelfProfile = {
    ...activePersona,
    role: activePersona.label,
  };
  const editingGoalPersona = PERSONA_POOL.find(
    (persona) => persona.id === editingGoalSelfId,
  );

  return (
    <div className="dark relative flex h-screen w-screen overflow-hidden bg-[var(--gb-background-default)]">
      <DottedBackground />

      <Gnb
        expanded={gnbExpanded}
        onExpandedChange={setGnbExpanded}
        items={REVIEW_GNB_ITEMS}
        activeId="assets"
        onItemSelect={(id) => router.push(REVIEW_GNB_PATHS[id] ?? "/review")}
        className="z-4"
      />

      {/* Gnb와 AssetPanel(500px) 둘 다 제외한 영역을 캔버스로 쓴다 — 전체
          뷰포트 기준으로 중앙 정렬하면 우측 다이아몬드 슬롯이 AssetPanel에
          가려지므로, 캔버스 경계를 AssetPanel 폭만큼 명시적으로 인셋한다. */}
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div ref={setCanvasEl} className="absolute inset-0 right-[500px] z-1">
          <div className="absolute top-[9px] left-1/2 z-3 -translate-x-1/2">
            <ButtonGroup
              type="menu"
              activeId="assets"
              onActiveChange={(id) =>
                router.push(
                  REVIEW_GNB_PATHS[id === "home" ? "dashboard" : id] ??
                    "/review",
                )
              }
              className="dark [&>button[data-selected]]:text-sm-semi-bold"
            />
          </div>

          <div className="flex h-full items-center justify-center">
            <SelfCluster
              selves={selves}
              selectedSelfId={activeSelfId}
              onAddSelf={handleAddSelf}
              onSelectSelf={(self) => setActiveSelfId(self.id)}
              getSelfMenuActions={getSelfMenuActions}
              onEditSelfImage={(self) => goToAssetGallery(self.id)}
              previewPortalContainer={canvasEl}
            />
          </div>
        </div>

        <div className="absolute top-0 right-0 z-2 h-full">
          <AssetPanel
            self={activeSelfProfile}
            onCreateContents={() => router.push("/review/content-studio")}
            onEditSelfPortrait={() => goToAssetGallery(activeSelfProfile.id)}
            onGoToAssetGallery={() => goToAssetGallery(activeSelfProfile.id)}
            onEditGoal={() => setEditingGoalSelfId(activeSelfProfile.id)}
          />
        </div>
      </div>

      <GoalEditDialog
        key={`create-self-${pendingSlotId ?? "closed"}`}
        open={pendingSlotId !== null}
        onOpenChange={(open) => !open && setPendingSlotId(null)}
        onSave={handleCreateContinue}
      />

      {/* Edit Goal — 그 Self를 만들 때 입력된 값(type=default)으로 채워서 연다 */}
      <GoalEditDialog
        key={`edit-goal-${editingGoalSelfId ?? "closed"}`}
        open={editingGoalSelfId !== null}
        onOpenChange={(open) => !open && setEditingGoalSelfId(null)}
        defaultNow={editingGoalPersona?.knownForNow}
        defaultGoal={editingGoalPersona?.knownForNext}
        defaultPostingCount={editingGoalPersona?.postingCount}
        defaultPostingFrequency={editingGoalPersona?.postingFrequency}
        defaultTargetedFollowersIndex={
          editingGoalPersona?.targetedFollowersIndex
        }
        defaultTimeframe={editingGoalPersona?.timeframe}
        goalActions={editingGoalPersona?.goalActions}
        onSave={() => setEditingGoalSelfId(null)}
      />

      <Popover
        type="warning"
        open={archivingSelf !== null}
        onOpenChange={(open) => !open && setArchivingSelf(null)}
        title="Move to Archive?"
        description="This will be moved to your archive and take effect immediately."
        leadingIcon={<Icon id="archive-icon" />}
        onCancel={() => setArchivingSelf(null)}
        onConfirm={handleConfirmArchive}
      />

      <AssetGalleryDialog
        open={galleryOpenForSelfId !== null}
        onOpenChange={(open) => !open && setGalleryOpenForSelfId(null)}
        selves={selves.map((self) => ({ value: self.id, label: self.label }))}
        selfId={galleryOpenForSelfId ?? ""}
        onSelfIdChange={setGalleryOpenForSelfId}
      />
    </div>
  );
}
