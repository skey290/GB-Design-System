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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateSelfDialog } from "@/components/review/assets/create-self-dialog";
import { addArchivedImage } from "@/lib/archived-asset-store";
import {
  AssetPanel,
  type AssetPanelSelfProfile,
} from "@/components/review/assets/asset-panel";
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
  const [selfPortraitOpen, setSelfPortraitOpen] = React.useState(false);

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
  };

  const handleMoveToArchive = (self: ClusterSelf) => {
    addArchivedImage(self.id, self.image);
    const remaining = selves.filter((s) => s.id !== self.id);
    setSelves(remaining);
    if (activeSelfId === self.id) {
      setActiveSelfId(remaining[0]?.id ?? PERSONA_POOL[0]!.id);
    }
  };

  const getSelfMenuActions = (self: ClusterSelf): SelfMenuAction[] => [
    {
      label: "Create a Post",
      onSelect: () => router.push("/review/content-studio"),
    },
    {
      label: "Go to Asset Gallery",
      onSelect: () =>
        router.push(`/review/assets/asset-gallery?self=${self.id}`),
    },
    { label: "Move to Archive", onSelect: () => handleMoveToArchive(self) },
    { label: "Edit Goal", onSelect: () => setActiveSelfId(self.id) },
  ];

  const activePersona =
    PERSONA_POOL.find((persona) => persona.id === activeSelfId) ??
    PERSONA_POOL[0]!;
  const activeSelfProfile: AssetPanelSelfProfile = {
    ...activePersona,
    role: activePersona.label,
  };

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
        <div className="absolute inset-0 right-[500px] z-1">
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
              onAddSelf={handleAddSelf}
              onSelectSelf={(self) => setActiveSelfId(self.id)}
              getSelfMenuActions={getSelfMenuActions}
            />
          </div>
        </div>

        <div className="absolute top-0 right-0 z-2 h-full">
          <AssetPanel
            self={activeSelfProfile}
            onCreateContents={() => router.push("/review/content-studio")}
            onEditSelfPortrait={() => setSelfPortraitOpen(true)}
            onGoToAssetGallery={() =>
              router.push(
                `/review/assets/asset-gallery?self=${activeSelfProfile.id}`,
              )
            }
          />
        </div>
      </div>

      <CreateSelfDialog
        open={pendingSlotId !== null}
        onOpenChange={(open) => !open && setPendingSlotId(null)}
        onContinue={handleCreateContinue}
      />

      {/* "Edit Self Portrait" 트리거는 review 전용 글루 — 재사용 단위는 SelfCluster뿐이라 별도 컴포넌트로 안 뺌 */}
      <Dialog open={selfPortraitOpen} onOpenChange={setSelfPortraitOpen}>
        <DialogContent className="items-center justify-center">
          <SelfCluster
            selves={selves}
            onAddSelf={handleAddSelf}
            onSelectSelf={(self) => setActiveSelfId(self.id)}
            getSelfMenuActions={getSelfMenuActions}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
