"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CircleArrowOutUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { createSpriteIcon } from "@/lib/sprite-icon";
import { Gnb } from "@/components/app/gnb";
import { CompassToolbar } from "@/components/compass/ui/compass-toolbar";
import { ButtonGroup } from "@/components/ui/button-group";
import { Toggle, type ToggleItem } from "@/components/ui/toggle";
import { CompassSphere } from "@/components/compass/ui/compass-sphere";
import { CompassDetailView } from "@/components/compass/ui/compass-detail-view";
import {
  CompassAnalysis,
  type CompassAnalysisSelf,
  type CompassAnalysisType,
} from "@/components/compass/ui/compass-analysis";

import { REVIEW_GNB_ITEMS, REVIEW_GNB_PATHS } from "../_lib/gnb-items";

// gabrielle-ai.com/compass 라이브 사이트 카피본. 기존 `app/compass/page.tsx`
// (Figma 기반 WIP)와 레이아웃·로직이 거의 동일하게 확인되어(코치마크 문구,
// "9post/7day" 규칙까지 일치) 그대로 이식했다 — GNB 라우팅만
// `/review/*` 사이를 오가도록 바꿨다. 원본 WIP는 건드리지 않는다.
type AnalysisSubmenuValue =
  "growth-potential" | "reach" | "engagement" | "ranking";

const AnalysisReachIcon = createSpriteIcon("reach-icon");
const AnalysisEngagementIcon = createSpriteIcon("engagement-icon");
const AnalysisRankingIcon = createSpriteIcon("crown-icon");

const ANALYSIS_MENU_ITEMS: {
  value: AnalysisSubmenuValue;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "growth-potential",
    label: "Growth Potential",
    icon: <CircleArrowOutUpRight aria-hidden="true" className="size-full" />,
  },
  {
    value: "reach",
    label: "Reach",
    icon: <AnalysisReachIcon aria-hidden="true" className="size-full" />,
  },
  {
    value: "engagement",
    label: "Engagement",
    icon: <AnalysisEngagementIcon aria-hidden="true" className="size-full" />,
  },
  {
    value: "ranking",
    label: "Ranking",
    icon: <AnalysisRankingIcon aria-hidden="true" className="size-full" />,
  },
];

const SELF_OPTIONS = [
  { value: "self-default", label: "Data Scientist" },
  { value: "team-leader", label: "Office Worker" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "fashion-editor", label: "Fashion Editor" },
  { value: "fashionista", label: "Fashionista" },
  { value: "novelist", label: "English Novelist" },
  { value: "vegan-chef", label: "Vegan Chef" },
  { value: "yoga-meditator", label: "Yoga Meditator" },
];

const TOGGLE_OPTIONS = [
  { value: "home", label: "Home" },
  { value: "analysis", label: "Analysis" },
] as const;

const ANALYSIS_SELVES: CompassAnalysisSelf[] = [
  {
    id: "data-scientist",
    image: "/images/personas/self-default.jpg",
    imageAlt: "Data Scientist",
    qualifiedReach: 8340,
    engagementIntensity: 14.3,
    growth: 55,
  },
  {
    id: "yoga-meditator",
    image: "/images/personas/yoga-meditator.jpg",
    imageAlt: "Yoga Meditator",
    qualifiedReach: 6453,
    engagementIntensity: 1.8,
    growth: 20,
  },
  {
    id: "novelist",
    image: "/images/personas/novelist.jpg",
    imageAlt: "Novelist",
    qualifiedReach: 4784,
    engagementIntensity: 0.4,
    growth: 30,
  },
  {
    id: "entrepreneur",
    image: "/images/personas/entrepreneur.jpg",
    imageAlt: "Entrepreneur",
    qualifiedReach: 978,
    engagementIntensity: 2.0,
    growth: 45,
  },
  {
    id: "fashionista",
    image: "/images/personas/fashionista.jpg",
    imageAlt: "Fashionista",
    qualifiedReach: 6782,
    engagementIntensity: 0.3,
    growth: 10,
  },
  {
    id: "fashion-editor",
    image: "/images/personas/fashion-editor.jpg",
    imageAlt: "Fashion Editor",
    qualifiedReach: 125,
    engagementIntensity: 3.7,
    growth: 65,
  },
  {
    id: "team-leader",
    image: "/images/personas/team-leader.jpg",
    imageAlt: "Team Leader",
    qualifiedReach: 8006,
    engagementIntensity: 0.5,
    growth: 15,
  },
  {
    id: "vegan-chef",
    image: "/images/personas/vegan-chef.jpg",
    imageAlt: "Vegan Chef",
    qualifiedReach: 5431,
    engagementIntensity: 1.9,
    growth: 25,
  },
];

const ANALYSIS_CONFIG: Record<
  AnalysisSubmenuValue,
  {
    type: CompassAnalysisType;
    label?: string;
  }
> = {
  "growth-potential": { type: "potential" },
  reach: { type: "reach", label: "Most Reached Post" },
  engagement: { type: "engagement", label: "Most Engaged Post" },
  ranking: { type: "reach-and-engagement", label: "Ranking" },
};

function ScrollableDetailView() {
  const [thumb, setThumb] = React.useState({ top: 0, height: 100 });
  const [scrollable, setScrollable] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  const updateThumb = React.useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight) {
      setScrollable(false);
      setThumb({ top: 0, height: 100 });
      return;
    }
    setScrollable(true);
    const heightPercent = (clientHeight / scrollHeight) * 100;
    const topPercent =
      (scrollTop / (scrollHeight - clientHeight)) * (100 - heightPercent);
    setThumb({ top: topPercent, height: heightPercent });
  }, []);

  const listCallbackRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (node) updateThumb();
    },
    [updateThumb],
  );

  React.useEffect(() => {
    window.addEventListener("resize", updateThumb);
    return () => window.removeEventListener("resize", updateThumb);
  }, [updateThumb]);

  return (
    <div className="flex h-full shrink-0">
      <div
        ref={listCallbackRef}
        onScroll={updateThumb}
        className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <CompassDetailView type="default" />
      </div>
      {scrollable && (
        <div
          aria-hidden="true"
          className="shrink-0 py-[var(--spacing-1)] pr-[var(--spacing-1)]"
        >
          <div className="relative h-full w-[10px] rounded-[var(--radius-scale-full)] bg-[var(--background-subtler)]">
            <div
              className="absolute inset-x-0 rounded-[var(--radius-scale-full)] bg-[var(--background-subtle)]"
              style={{ top: `${thumb.top}%`, height: `${thumb.height}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewCompassPage() {
  const router = useRouter();
  const [gnbExpanded, setGnbExpanded] = React.useState(false);
  const [floatingNavActiveId, setFloatingNavActiveId] =
    React.useState<string>("compass");
  const [toggleValue, setToggleValue] = React.useState<string>("home");
  const [selfValue, setSelfValue] = React.useState("self-default");
  const [analysisSubmenu, setAnalysisSubmenu] =
    React.useState<AnalysisSubmenuValue>("growth-potential");

  const [showGrowthCoachmark, setShowGrowthCoachmark] = React.useState(true);
  const [showReachCoachmark, setShowReachCoachmark] = React.useState(true);
  const [showEngagementCoachmark, setShowEngagementCoachmark] =
    React.useState(true);

  const coachmark = React.useMemo(() => {
    if (analysisSubmenu === "growth-potential" && showGrowthCoachmark) {
      return {
        title: "Growth Potential: 80%",
        description: "Start posting to turn this potential into real reach.",
        onDismiss: () => setShowGrowthCoachmark(false),
      };
    }
    if (analysisSubmenu === "reach" && showReachCoachmark) {
      return {
        title: "Most Reached: 8,340",
        onDismiss: () => setShowReachCoachmark(false),
      };
    }
    if (analysisSubmenu === "engagement" && showEngagementCoachmark) {
      return {
        title: "Most Engaged: 14.3%",
        onDismiss: () => setShowEngagementCoachmark(false),
      };
    }
    return undefined;
  }, [
    analysisSubmenu,
    showGrowthCoachmark,
    showReachCoachmark,
    showEngagementCoachmark,
  ]);

  const isAnalysis = toggleValue === "analysis";
  const analysisConfig = ANALYSIS_CONFIG[analysisSubmenu];
  const hasOutwardRing =
    analysisConfig.type === "reach" ||
    analysisConfig.type === "reach-and-engagement";

  return (
    <div className="dark relative flex h-screen w-screen overflow-hidden bg-[var(--background-default)]">
      <Gnb
        expanded={gnbExpanded}
        onExpandedChange={setGnbExpanded}
        items={REVIEW_GNB_ITEMS}
        activeId="compass"
        onItemSelect={(id) => router.push(REVIEW_GNB_PATHS[id] ?? "/review")}
      />

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0",
            "bg-[var(--color-neutral-950)]",
            "bg-[radial-gradient(circle,var(--color-neutral-700)_1px,transparent_1px)]",
            "bg-[length:var(--spacing-6)_var(--spacing-6)]",
          )}
        />

        {isAnalysis ? (
          <div className="absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              className={cn(
                "flex min-h-full justify-center",
                "[align-items:safe_center]",
                "bg-[var(--color-neutral-950)]",
                "bg-[radial-gradient(circle,var(--color-neutral-700)_1px,transparent_1px)]",
                "bg-[length:var(--spacing-6)_var(--spacing-6)]",
                hasOutwardRing
                  ? "pt-[calc(var(--spacing-4)*2+53px+44px)]"
                  : "pt-[calc(var(--spacing-4)*2+53px)]",
                "pb-[calc(var(--spacing-4)*2+53px)]",
              )}
            >
              <CompassAnalysis
                type={analysisConfig.type}
                label={analysisConfig.label}
                selves={ANALYSIS_SELVES}
                coachmark={coachmark}
              />
            </div>
          </div>
        ) : (
          <CompassSphere className="absolute inset-0" />
        )}

        <div className="absolute top-[var(--spacing-4)] left-1/2 -translate-x-1/2">
          <ButtonGroup
            type="menu"
            activeId={floatingNavActiveId}
            onActiveChange={setFloatingNavActiveId}
            className="dark [&>button[data-selected]]:text-sm-semi-bold"
          />
        </div>

        <div className="absolute top-[var(--spacing-4)] left-[var(--spacing-4)] flex flex-col gap-[var(--spacing-3)]">
          <CompassToolbar
            toggleOptions={TOGGLE_OPTIONS}
            toggleValue={toggleValue}
            onToggleValueChange={setToggleValue}
            selectOptions={isAnalysis ? undefined : SELF_OPTIONS}
            selectValue={selfValue}
            onSelectValueChange={setSelfValue}
          />
          {isAnalysis && (
            <Toggle
              orientation="vertical"
              selectionMode="single"
              items={ANALYSIS_MENU_ITEMS.map((item): ToggleItem => ({
                icon: item.icon,
                label: item.label,
                "aria-label": item.label,
                pressed: item.value === analysisSubmenu,
                onPressedChange: () => setAnalysisSubmenu(item.value),
              }))}
            />
          )}
        </div>
      </div>

      <ScrollableDetailView />
    </div>
  );
}
