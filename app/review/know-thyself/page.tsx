"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Gnb } from "@/components/app/gnb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  type ButtonGroupMenuItem,
} from "@/components/ui/button-group";
import { Select } from "@/components/ui/select";
import { Icon } from "@/lib/sprite-icon";

import { FoundationCard } from "@/components/review/know-thyself/foundation-card";
import { NudgeModal } from "@/components/review/know-thyself/nudge-modal";
import { TellMyStoryDialog } from "@/components/review/know-thyself/tell-my-story-dialog";
import { MyBasicsDialog } from "@/components/review/know-thyself/my-basics-dialog";
import { SurveyDialog } from "@/components/review/know-thyself/survey-dialog";
import { ResultSummaryDialog } from "@/components/review/know-thyself/result-summary-dialog";
import { SelfGapInviteDialog } from "@/components/review/know-thyself/self-gap-invite-dialog";
import { SelfGapResultDialog } from "@/components/review/know-thyself/self-gap-result-dialog";
import { GoalEditDialog } from "@/components/review/shared/goal-edit-dialog";
import {
  SELF_GAP_QUESTIONS,
  SELF_GAP_NUMBERLINE,
  TIPI_QUESTIONS,
  OUTER_SELF_QUESTIONS,
  type FoundationStatus,
} from "@/components/review/know-thyself/data";

import { REVIEW_GNB_ITEMS, REVIEW_GNB_PATHS } from "../_lib/gnb-items";

// gabrielle-ai.com/know-thyself 라이브 사이트 카피본
// (`docs/GB_Know_Thyself.md` 전체 9부 기준).
//
// 의도적 단순화(사전 고지, Phase 4 계획 보고 참고):
// - "Goal as [Self]" 카드는 Content Studio의 GoalEditDialog(공용 Goal 데이터)를
//   그대로 재사용하고, 카드 자체는 전용 컴포넌트 없이 이 페이지에서 직접 조립.
// - My Basics/Tell My Story의 파일 업로드는 실제 업로드 없이 선택 상태만 추적.

const SELF_OPTIONS = [
  { value: "data-scientist", label: "Data Scientist" },
  { value: "morning-jogger", label: "Morning Jogger" },
  { value: "workflow-sculptor", label: "Workflow Sculptor" },
  { value: "sunday-baker", label: "Sunday Baker" },
  { value: "vintage-curator", label: "Vintage Curator" },
  { value: "brooklyn-observer", label: "Brooklyn Observer" },
];

// `ButtonGroup type="menu"`의 기본 항목엔 Know Thyself가 없어 이 페이지에서만 추가한다
// (공용 컴포넌트 기본값은 건드리지 않음).
const MENU_ITEMS: ButtonGroupMenuItem[] = [
  { id: "home", icon: "home-icon" },
  { id: "assets", label: "Assets" },
  { id: "compass", label: "Compass" },
  { id: "contents-studio", label: "Content Studio" },
  { id: "know-thyself", label: "Know Thyself" },
];

type SurveyKind = "self-gap" | "inner-self" | "outer-self" | null;

export default function ReviewKnowThyselfPage() {
  const router = useRouter();
  const [gnbExpanded, setGnbExpanded] = React.useState(false);
  const [selfValue, setSelfValue] = React.useState("data-scientist");

  const [showNudge, setShowNudge] = React.useState(true);

  const [myStoryStatus, setMyStoryStatus] =
    React.useState<FoundationStatus>("not-started");
  const [selfGapStatus, setSelfGapStatus] =
    React.useState<FoundationStatus>("not-started");
  const [selfGapResponded, setSelfGapResponded] = React.useState(0);
  const [innerSelfStatus, setInnerSelfStatus] =
    React.useState<FoundationStatus>("not-started");
  const [outerSelfStatus, setOuterSelfStatus] =
    React.useState<FoundationStatus>("not-started");

  const [tellMyStoryOpen, setTellMyStoryOpen] = React.useState(false);
  const [myBasicsOpen, setMyBasicsOpen] = React.useState(false);
  const [activeSurvey, setActiveSurvey] = React.useState<SurveyKind>(null);
  const [selfGapInviteOpen, setSelfGapInviteOpen] = React.useState(false);
  const [selfGapResultOpen, setSelfGapResultOpen] = React.useState(false);
  const [innerSelfResultOpen, setInnerSelfResultOpen] = React.useState(false);
  const [outerSelfResultOpen, setOuterSelfResultOpen] = React.useState(false);
  const [goalOpen, setGoalOpen] = React.useState(false);

  const brandReady = outerSelfStatus === "completed";

  return (
    <div className="dark flex h-screen w-screen overflow-hidden bg-[var(--gb-background-default)]">
      <Gnb
        expanded={gnbExpanded}
        onExpandedChange={setGnbExpanded}
        items={REVIEW_GNB_ITEMS}
        activeId="know-thyself"
        onItemSelect={(id) => router.push(REVIEW_GNB_PATHS[id] ?? "/review")}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="absolute top-[20px] right-[36px] z-10 flex items-center gap-[var(--gb-spacing-3)]">
          <Select
            variant="side"
            options={SELF_OPTIONS}
            value={selfValue}
            onValueChange={setSelfValue}
          />
        </div>

        <div className="flex items-center justify-center gap-[var(--gb-spacing-4)] border-b-[length:var(--gb-border-1)] border-[var(--gb-border-subtler)] px-[var(--gb-spacing-8)] py-[var(--gb-spacing-4)]">
          <ButtonGroup
            type="menu"
            items={MENU_ITEMS}
            activeId="know-thyself"
            onActiveChange={(id) =>
              router.push(
                REVIEW_GNB_PATHS[id === "home" ? "dashboard" : id] ?? "/review",
              )
            }
          />
        </div>

        <div className="flex flex-col gap-[var(--gb-spacing-5)] p-[var(--gb-spacing-6)]">
          <section className="flex flex-col gap-[var(--gb-spacing-3)] rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
            <div className="flex items-center justify-between">
              <p className="text-base-bold text-[var(--gb-text-default)]">
                Goal as Data Scientist
              </p>
              <Badge variant="success">Completed</Badge>
            </div>
            <p className="text-sm-regular text-[var(--gb-text-default)]">
              Finance-Fluent Modeling Partner for early-stage SaaS founders —
              posting 3 times a week, targeting ~1,000 followers, tracked
              monthly.
            </p>
            <Button
              variant="outline"
              icon={<Icon id="pen-icon" />}
              onClick={() => setGoalOpen(true)}
              className="w-fit"
            >
              Edit Goal
            </Button>
          </section>

          <div className="grid grid-cols-2 gap-[var(--gb-spacing-4)]">
            <FoundationCard
              title="My Story"
              status={myStoryStatus}
              footer={
                myStoryStatus === "completed" ? (
                  <div className="flex flex-wrap gap-[var(--gb-spacing-2)]">
                    <Badge variant="outline">7 years</Badge>
                    <Badge variant="outline">Enterprise sales</Badge>
                    <Badge variant="outline">Growth-stage</Badge>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setTellMyStoryOpen(true)}
                    className="w-fit"
                  >
                    Share Your Story
                  </Button>
                )
              }
            >
              {myStoryStatus === "completed" && (
                <p className="text-sm-regular text-[var(--gb-text-subtle)]">
                  7 years in enterprise sales, now building growth-stage
                  go-to-market motion.
                </p>
              )}
            </FoundationCard>

            <FoundationCard
              title="Self-Gap"
              status={selfGapStatus}
              statusOverrideLabel={
                selfGapStatus === "survey-open"
                  ? `Survey open · ${selfGapResponded}/5 Responded`
                  : undefined
              }
              footer={
                selfGapStatus === "not-started" ? (
                  <Button
                    variant="primary"
                    onClick={() => setActiveSurvey("self-gap")}
                    className="w-fit"
                  >
                    Start Test
                  </Button>
                ) : (
                  <div className="flex items-center gap-[var(--gb-spacing-2)]">
                    <Button
                      variant="outline"
                      onClick={() => setSelfGapInviteOpen(true)}
                    >
                      Invite friends
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setSelfGapResultOpen(true)}
                    >
                      View result
                    </Button>
                  </div>
                )
              }
            >
              {selfGapStatus !== "not-started" && (
                <p className="text-sm-regular text-[var(--gb-text-subtle)]">
                  You are funnier, more open, more of a risk-taker than what you
                  think yourself.
                </p>
              )}
            </FoundationCard>

            <FoundationCard
              title="Inner Self"
              status={innerSelfStatus}
              footer={
                innerSelfStatus === "not-started" ? (
                  <Button
                    variant="primary"
                    onClick={() => setActiveSurvey("inner-self")}
                    className="w-fit"
                  >
                    Start Test
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setInnerSelfResultOpen(true)}
                    className="w-fit"
                  >
                    Edit Answer
                  </Button>
                )
              }
            >
              {innerSelfStatus === "completed" && (
                <>
                  <p className="text-sm-regular text-[var(--gb-text-subtle)]">
                    Grounded and steady, even when no one&rsquo;s watching.
                  </p>
                  <div className="flex flex-wrap gap-[var(--gb-spacing-2)]">
                    <Badge variant="outline">Grounded</Badge>
                    <Badge variant="outline">Honest</Badge>
                    <Badge variant="outline">Steady</Badge>
                  </div>
                </>
              )}
            </FoundationCard>

            <FoundationCard
              title="Outer Self"
              status={outerSelfStatus}
              footer={
                outerSelfStatus === "not-started" ? (
                  <Button
                    variant="primary"
                    onClick={() => setActiveSurvey("outer-self")}
                    className="w-fit"
                  >
                    Start Test
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setOuterSelfResultOpen(true)}
                    className="w-fit"
                  >
                    Edit Answer
                  </Button>
                )
              }
            >
              {outerSelfStatus === "completed" && (
                <>
                  <p className="text-sm-regular text-[var(--gb-text-subtle)]">
                    Approachable over impressive, calm over high-energy.
                  </p>
                  <div className="flex flex-wrap gap-[var(--gb-spacing-2)]">
                    <Badge variant="outline">Approachable</Badge>
                    <Badge variant="outline">Calm</Badge>
                    <Badge variant="outline">Consistent</Badge>
                  </div>
                </>
              )}
            </FoundationCard>
          </div>

          <div className="grid grid-cols-2 gap-[var(--gb-spacing-4)]">
            <section className="flex flex-col gap-[var(--gb-spacing-3)] rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
              <div className="flex items-center justify-between">
                <p className="text-base-bold text-[var(--gb-text-default)]">
                  Core Objective
                </p>
                <Badge variant={brandReady ? "success" : "outline"}>
                  {brandReady ? "Completed" : "Not started"}
                </Badge>
              </div>
              {brandReady ? (
                <>
                  <p className="text-sm-regular text-[var(--gb-text-default)]">
                    To be remembered as someone who delivers trusted insight,
                    built on real experience.
                  </p>
                  <div className="flex flex-wrap gap-[var(--gb-spacing-2)]">
                    <Badge variant="outline">Finance-credible modeling</Badge>
                    <Badge variant="outline">Trusted advisor</Badge>
                  </div>
                </>
              ) : (
                <p className="text-sm-regular text-[var(--gb-text-subtler)]">
                  Fill in more sections, and this gets more refined.
                </p>
              )}
            </section>

            <section className="flex flex-col gap-[var(--gb-spacing-3)] rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
              <div className="flex items-center justify-between">
                <p className="text-base-bold text-[var(--gb-text-default)]">
                  Tone of Voice
                </p>
                <Badge variant={brandReady ? "success" : "outline"}>
                  {brandReady ? "Completed" : "Not started"}
                </Badge>
              </div>
              {brandReady ? (
                <>
                  <p className="text-sm-regular text-[var(--gb-text-default)]">
                    Warm yet logical, a voice that simplifies complexity and
                    earns trust.
                  </p>
                  <div className="flex flex-wrap gap-[var(--gb-spacing-2)]">
                    <Badge variant="outline">Grounded</Badge>
                    <Badge variant="outline">Calm</Badge>
                    <Badge variant="outline">Precise</Badge>
                  </div>
                </>
              ) : (
                <p className="text-sm-regular text-[var(--gb-text-subtler)]">
                  Fill in more sections, and this gets more refined.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>

      <NudgeModal
        open={showNudge}
        onOpenChange={setShowNudge}
        onShareStory={() => {
          setShowNudge(false);
          setTellMyStoryOpen(true);
        }}
        onDoNotAskAgainChange={() => {}}
      />

      <TellMyStoryDialog
        open={tellMyStoryOpen}
        onOpenChange={setTellMyStoryOpen}
        onOpenMyBasics={() => setMyBasicsOpen(true)}
        onSave={() => {
          setTellMyStoryOpen(false);
          setMyStoryStatus("completed");
        }}
      />

      <MyBasicsDialog
        open={myBasicsOpen}
        onOpenChange={setMyBasicsOpen}
        onSave={() => setMyBasicsOpen(false)}
      />

      <SurveyDialog
        open={activeSurvey === "self-gap"}
        onOpenChange={(open) => !open && setActiveSurvey(null)}
        introTitle="Do people really see you the way you think?"
        introDescription="Answer a few quick questions about yourself, then send the same ones to people who know you."
        introHelper="See where you match — and where you don't."
        surveyTitle="Self-Gap"
        questions={SELF_GAP_QUESTIONS}
        format="statement"
        scaleMin={1}
        scaleMax={5}
        onComplete={() => {
          setActiveSurvey(null);
          setSelfGapStatus("survey-open");
          setSelfGapInviteOpen(true);
        }}
      />

      <SurveyDialog
        open={activeSurvey === "inner-self"}
        onOpenChange={(open) => !open && setActiveSurvey(null)}
        introTitle="Let's find the real you"
        introDescription="A few honest questions about who you are."
        introHelper="The more honest you are, the more accurate your foundation becomes."
        surveyTitle="10 Item Personality Test (TIPI)"
        questions={TIPI_QUESTIONS}
        format="tipi"
        scaleMin={1}
        scaleMax={7}
        onComplete={() => {
          setActiveSurvey(null);
          setInnerSelfStatus("completed");
          setInnerSelfResultOpen(true);
        }}
      />

      <SurveyDialog
        open={activeSurvey === "outer-self"}
        onOpenChange={(open) => !open && setActiveSurvey(null)}
        introTitle="Let's shape how you're seen"
        introDescription="A few quick choices about the image you want to lead with."
        introHelper="The clearer your choices, the sharper your brand becomes."
        surveyTitle="Outer-Self"
        questions={OUTER_SELF_QUESTIONS}
        format="paired"
        scaleMin={1}
        scaleMax={5}
        onComplete={() => {
          setActiveSurvey(null);
          setOuterSelfStatus("completed");
          setOuterSelfResultOpen(true);
        }}
      />

      <SelfGapInviteDialog
        open={selfGapInviteOpen}
        onOpenChange={setSelfGapInviteOpen}
        onInvite={() => {
          setSelfGapInviteOpen(false);
          setSelfGapResponded(3);
        }}
      />

      <SelfGapResultDialog
        open={selfGapResultOpen}
        onOpenChange={setSelfGapResultOpen}
        respondedCount={selfGapResponded}
        totalInvited={5}
        matchRate={72}
        matchPoint="Dependable"
        gapPoint="Funnier than you think"
        rows={SELF_GAP_NUMBERLINE}
        onStartOver={() => {
          setSelfGapResultOpen(false);
          setActiveSurvey("self-gap");
        }}
        onEditAnswer={() => {
          setSelfGapResultOpen(false);
          setActiveSurvey("self-gap");
        }}
      />

      <ResultSummaryDialog
        open={innerSelfResultOpen}
        onOpenChange={setInnerSelfResultOpen}
        title="Inner Self"
        headline="Grounded and steady, even when no one's watching."
        traits={["Grounded", "Honest", "Steady"]}
        onEditAnswer={() => {
          setInnerSelfResultOpen(false);
          setActiveSurvey("inner-self");
        }}
      />

      <ResultSummaryDialog
        open={outerSelfResultOpen}
        onOpenChange={setOuterSelfResultOpen}
        title="Outer Self"
        headline="Approachable over impressive, calm over high-energy."
        traits={["Approachable", "Calm", "Consistent"]}
        onEditAnswer={() => {
          setOuterSelfResultOpen(false);
          setActiveSurvey("outer-self");
        }}
      />

      <GoalEditDialog
        open={goalOpen}
        onOpenChange={setGoalOpen}
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
