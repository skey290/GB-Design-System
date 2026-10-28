"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chips } from "@/components/ui/chips";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/lib/sprite-icon";

export type GoalPostingFrequency = "Day" | "Week" | "Month";
export type GoalTimeframe = "1 month" | "3 months" | "6 months" | "1 year";

const POSTING_FREQUENCIES: readonly GoalPostingFrequency[] = [
  "Day",
  "Week",
  "Month",
];
const TIMEFRAMES: readonly GoalTimeframe[] = [
  "1 month",
  "3 months",
  "6 months",
  "1 year",
];

/** Figma `Targeted Followers` 슬라이더 스케일 레이블 6개 */
export const TARGETED_FOLLOWERS_LABELS = [
  "1,000",
  "5,000",
  "10,000",
  "50,000",
  "1M",
  "1M+",
] as const;

export interface GoalSettingAction {
  id: string;
  /** Gabrielle accordion 액션 행의 출처 Badge 라벨 (예: "Assets", "Content Studio") */
  category: string;
  label: string;
  onRun?: () => void;
}

export interface GoalSettingProps {
  onClose?: () => void;
  className?: string;
  /** "My goal" 타이틀 + 닫기 버튼 행 표시 여부. 다른 UI(예: Asset 패널)에 임베드할 때 false로 생략 */
  showHeader?: boolean;

  /** 제어 컴포넌트로 사용할 때의 "Known for Now" 값 */
  now?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기값 */
  defaultNow?: string;
  onNowChange?: (value: string) => void;

  /** 제어 컴포넌트로 사용할 때의 "Known for Next" 값 */
  goal?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기값 */
  defaultGoal?: string;
  onGoalChange?: (value: string) => void;
  goalActions?: GoalSettingAction[];

  /** 제어 컴포넌트로 사용할 때의 Posting 카운터 값 */
  postingCount?: number;
  defaultPostingCount?: number;
  onPostingCountChange?: (value: number) => void;

  postingFrequency?: GoalPostingFrequency;
  defaultPostingFrequency?: GoalPostingFrequency;
  onPostingFrequencyChange?: (value: GoalPostingFrequency) => void;

  /** `TARGETED_FOLLOWERS_LABELS` 인덱스(0~5) */
  targetedFollowersIndex?: number;
  defaultTargetedFollowersIndex?: number;
  onTargetedFollowersIndexChange?: (index: number) => void;

  timeframe?: GoalTimeframe;
  defaultTimeframe?: GoalTimeframe;
  onTimeframeChange?: (value: GoalTimeframe) => void;

  /** 카드 하단 단일 Save 버튼 클릭 시 호출됩니다 */
  onSave?: () => void;
  /** 하단 Save 버튼 표시 여부. 다른 UI(예: Asset 패널)에 임베드할 때 false로 생략 */
  showSaveButton?: boolean;
}

const ROOT_CLASS = cn(
  "flex w-[560px] flex-col items-stretch gap-[var(--gb-spacing-7)]",
  "rounded-[var(--gb-radius-scale-3xl)] p-[var(--gb-spacing-8)]",
  "border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)]",
  "bg-[var(--gb-background-default)] shadow-[var(--gb-shadow-lg)]",
);

const NOW_PLACEHOLDER =
  "What are you known for today? Share your experience, past work, or what people already know you for.";
const GOAL_PLACEHOLDER =
  "What do you want to be known for next? Describe the position and audience you're aiming for.";

export function Divider() {
  return (
    <div className="h-[length:var(--gb-border-1)] w-full shrink-0 bg-[var(--gb-border-subtler)]" />
  );
}

function SentenceChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Chips variant="outline" selected={selected} onClick={onClick}>
      {children}
    </Chips>
  );
}

export function SettingsSentence({
  postingCount,
  postingFrequency,
  targetedFollowersIndex,
  timeframe,
  openPanel = null,
  onOpenFrequency,
  onOpenFollowers,
  onOpenTimeframe,
}: {
  postingCount: number;
  postingFrequency: GoalPostingFrequency;
  targetedFollowersIndex: number;
  timeframe: GoalTimeframe;
  openPanel?: SettingsPanelKind;
  onOpenFrequency?: () => void;
  onOpenFollowers?: () => void;
  onOpenTimeframe?: () => void;
}) {
  const frequencyLabel = `${postingCount} time${postingCount === 1 ? "" : "s"} a ${postingFrequency.toLowerCase()}`;
  const followersLabel =
    TARGETED_FOLLOWERS_LABELS[targetedFollowersIndex] ??
    TARGETED_FOLLOWERS_LABELS[0];

  return (
    <p className="flex w-full flex-wrap items-center gap-[var(--gb-spacing-1)] text-base-regular text-[var(--gb-text-default)]">
      <span>I post</span>
      <SentenceChip
        selected={openPanel === "frequency"}
        onClick={onOpenFrequency}
      >
        {frequencyLabel}
      </SentenceChip>
      <span>, aiming for</span>
      <SentenceChip
        selected={openPanel === "followers"}
        onClick={onOpenFollowers}
      >
        {followersLabel}
      </SentenceChip>
      <span>followers, within</span>
      <SentenceChip
        selected={openPanel === "timeframe"}
        onClick={onOpenTimeframe}
      >
        {timeframe}
      </SentenceChip>
      <span>.</span>
    </p>
  );
}

function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  formatOption,
  variant = "outline",
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  formatOption?: (option: T) => string;
  variant?: "outline" | "mute";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex w-full items-center gap-[var(--gb-spacing-2)]"
    >
      {options.map((option) => {
        const isSelected = option === value;
        return (
          <Button
            key={option}
            type="button"
            variant={variant}
            role="radio"
            aria-checked={isSelected}
            isSelected={isSelected}
            onClick={() => onChange(option)}
            className="flex-1"
          >
            {formatOption ? formatOption(option) : option}
          </Button>
        );
      })}
    </div>
  );
}

function SettingsPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-[var(--gb-spacing-4)] rounded-[var(--gb-radius-scale-3xl)] border-[length:var(--gb-border-1)] border-dashed border-[var(--gb-border-bold)] px-[var(--gb-spacing-4)] pt-[var(--gb-spacing-4)] pb-[var(--gb-spacing-6)] shadow-[var(--gb-shadow-lg)]">
      <p className="w-full text-sm-semi-bold text-[var(--gb-text-default)]">
        {title}
      </p>
      {children}
    </div>
  );
}

function FrequencyPanel({
  count,
  frequency,
  onCountChange,
  onFrequencyChange,
}: {
  count: number;
  frequency: GoalPostingFrequency;
  onCountChange: (value: number) => void;
  onFrequencyChange: (value: GoalPostingFrequency) => void;
}) {
  return (
    <SettingsPanel title="Posting Frequency">
      <div className="flex w-full flex-col items-start gap-[var(--gb-spacing-3)]">
        <div className="flex items-center gap-[var(--gb-spacing-2)]">
          <Button
            type="button"
            variant="icon-ghost"
            icon={<Icon id="minus-icon" />}
            aria-label="감소"
            onClick={() => onCountChange(Math.max(1, count - 1))}
          />
          <span className="w-[40px] text-center text-sm-semi-bold text-[var(--gb-text-default)]">
            {count}
          </span>
          <Button
            type="button"
            variant="icon-ghost"
            icon={<Icon id="plus-icon" />}
            aria-label="증가"
            onClick={() => onCountChange(count + 1)}
          />
          <span className="text-xs-medium whitespace-nowrap text-[var(--gb-text-default)]">
            time(s)
          </span>
        </div>
        <ToggleGroup
          label="Posting Frequency"
          options={POSTING_FREQUENCIES}
          value={frequency}
          onChange={onFrequencyChange}
          formatOption={(option) => `a ${option}`}
          variant="mute"
        />
      </div>
    </SettingsPanel>
  );
}

function FollowersPanel({
  index,
  onIndexChange,
}: {
  index: number;
  onIndexChange: (index: number) => void;
}) {
  return (
    <SettingsPanel title="Targeted Followers">
      <div className="flex w-full flex-col gap-[var(--gb-spacing-2)]">
        <Slider
          value={index}
          onValueChange={onIndexChange}
          min={0}
          max={TARGETED_FOLLOWERS_LABELS.length - 1}
          step={1}
          aria-label="Targeted Followers"
          shouldFitContainer
        />
        <div className="relative h-[var(--gb-spacing-4)] w-full">
          {TARGETED_FOLLOWERS_LABELS.map((label, labelIndex) => {
            const isFirst = labelIndex === 0;
            const isLast = labelIndex === TARGETED_FOLLOWERS_LABELS.length - 1;
            return (
              <span
                key={label}
                style={{
                  left: `${(labelIndex / (TARGETED_FOLLOWERS_LABELS.length - 1)) * 100}%`,
                }}
                className={cn(
                  "text-xs-medium absolute whitespace-nowrap text-[var(--gb-text-default)]",
                  isFirst
                    ? "translate-x-0"
                    : isLast
                      ? "-translate-x-full"
                      : "-translate-x-1/2",
                )}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </SettingsPanel>
  );
}

function TimeframePanel({
  value,
  onChange,
}: {
  value: GoalTimeframe;
  onChange: (value: GoalTimeframe) => void;
}) {
  return (
    <SettingsPanel title="Timeframe">
      <ToggleGroup
        label="Timeframe"
        options={TIMEFRAMES}
        value={value}
        onChange={onChange}
      />
    </SettingsPanel>
  );
}

function GabrielleAccordion({
  actions,
  open,
  onToggle,
}: {
  actions: GoalSettingAction[];
  open: boolean;
  onToggle: () => void;
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (actions.length === 0) return null;
  const shown = isExpanded ? actions : actions.slice(0, 2);
  const moreCount = actions.length - shown.length;

  return (
    <div className="flex w-full flex-col items-start gap-[var(--gb-spacing-3)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-[var(--gb-radius-scale-full)] px-[var(--gb-spacing-3)] py-[var(--gb-spacing-1)]"
      >
        <span className="flex items-center gap-[var(--gb-spacing-2-5)]">
          <Icon
            id="sparkles-icon"
            className="size-[16px] text-[var(--gb-text-default)]"
          />
          <span className="text-sm-regular text-[var(--gb-text-default)]">
            Gabrielle suggests {actions.length} action
            {actions.length === 1 ? "" : "s"}
          </span>
        </span>
        <Icon
          id={open ? "chevron-up-icon" : "chevron-down-icon"}
          className="size-[16px] text-[var(--gb-text-default)]"
        />
      </button>
      {open && (
        <div className="flex w-full flex-col gap-[var(--gb-spacing-1)] rounded-[var(--gb-radius-scale-xl)] border border-dashed border-[var(--gb-border-invert)] p-[var(--gb-spacing-3-5)]">
          {shown.map((action) => (
            <div
              key={action.id}
              className="flex w-full items-center gap-[var(--gb-spacing-2-5)]"
            >
              <Badge variant="outline" size="20">
                {action.category}
              </Badge>
              <p className="flex-1 text-sm-medium text-[var(--gb-text-subtle)]">
                {action.label}
              </p>
              <Button type="button" variant="outline" onClick={action.onRun}>
                Run
              </Button>
            </div>
          ))}
          {moreCount > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="text-left text-xs-medium text-[var(--gb-text-subtler)]"
            >
              + {moreCount} more
            </button>
          )}
        </div>
      )}
    </div>
  );
}

type SettingsPanelKind = "frequency" | "followers" | "timeframe" | null;

export function GoalSetting({
  onClose,
  className,
  showHeader = true,
  now,
  defaultNow = "",
  onNowChange,
  goal,
  defaultGoal = "",
  onGoalChange,
  goalActions = [],
  postingCount,
  defaultPostingCount = 3,
  onPostingCountChange,
  postingFrequency,
  defaultPostingFrequency = "Day",
  onPostingFrequencyChange,
  targetedFollowersIndex,
  defaultTargetedFollowersIndex = 1,
  onTargetedFollowersIndexChange,
  timeframe,
  defaultTimeframe = "1 year",
  onTimeframeChange,
  onSave,
  showSaveButton = true,
}: GoalSettingProps) {
  const [uncontrolledNow, setUncontrolledNow] = React.useState(defaultNow);
  const currentNow = now ?? uncontrolledNow;
  const handleNowChange = (value: string) => {
    if (now === undefined) setUncontrolledNow(value);
    onNowChange?.(value);
  };

  const [uncontrolledGoal, setUncontrolledGoal] = React.useState(defaultGoal);
  const currentGoal = goal ?? uncontrolledGoal;
  const handleGoalChange = (value: string) => {
    if (goal === undefined) setUncontrolledGoal(value);
    onGoalChange?.(value);
  };

  const [uncontrolledPostingCount, setUncontrolledPostingCount] =
    React.useState(defaultPostingCount);
  const currentPostingCount = postingCount ?? uncontrolledPostingCount;
  const handlePostingCountChange = (value: number) => {
    if (postingCount === undefined) setUncontrolledPostingCount(value);
    onPostingCountChange?.(value);
  };

  const [uncontrolledPostingFrequency, setUncontrolledPostingFrequency] =
    React.useState(defaultPostingFrequency);
  const currentPostingFrequency =
    postingFrequency ?? uncontrolledPostingFrequency;
  const handlePostingFrequencyChange = (value: GoalPostingFrequency) => {
    if (postingFrequency === undefined) setUncontrolledPostingFrequency(value);
    onPostingFrequencyChange?.(value);
  };

  const [
    uncontrolledTargetedFollowersIndex,
    setUncontrolledTargetedFollowersIndex,
  ] = React.useState(defaultTargetedFollowersIndex);
  const currentTargetedFollowersIndex =
    targetedFollowersIndex ?? uncontrolledTargetedFollowersIndex;
  const handleTargetedFollowersIndexChange = (index: number) => {
    if (targetedFollowersIndex === undefined)
      setUncontrolledTargetedFollowersIndex(index);
    onTargetedFollowersIndexChange?.(index);
  };

  const [uncontrolledTimeframe, setUncontrolledTimeframe] =
    React.useState(defaultTimeframe);
  const currentTimeframe = timeframe ?? uncontrolledTimeframe;
  const handleTimeframeChange = (value: GoalTimeframe) => {
    if (timeframe === undefined) setUncontrolledTimeframe(value);
    onTimeframeChange?.(value);
  };

  const [openPanel, setOpenPanel] = React.useState<SettingsPanelKind>(null);
  const togglePanel = (panel: Exclude<SettingsPanelKind, null>) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  const [goalAccordionOpen, setGoalAccordionOpen] = React.useState(false);

  /** Settings sentence/accordion visibility reflects the last Save, not every keystroke */
  const [hasSavedGoal, setHasSavedGoal] = React.useState(
    (goal ?? defaultGoal).trim().length > 0,
  );
  const handleSaveClick = () => {
    setHasSavedGoal(currentGoal.trim().length > 0);
    onSave?.();
  };

  return (
    <div className={cn("dark", ROOT_CLASS, className)}>
      {showHeader && (
        <div className="flex w-full items-center justify-between">
          <p className="text-xl-black text-[var(--gb-text-default)]">My goal</p>
          <Button
            type="button"
            variant="icon-ghost"
            icon={<Icon id="x-icon" />}
            aria-label="닫기"
            onClick={onClose}
          />
        </div>
      )}

      <div className="flex w-full flex-col items-center gap-[var(--gb-spacing-4)]">
        <div className="flex w-full flex-col items-start gap-[var(--gb-spacing-2)]">
          <p className="w-full text-base-bold text-[var(--gb-text-default)]">
            Known for Now
          </p>
          <div className="flex w-full flex-col items-start gap-[var(--gb-spacing-4)]">
            <Textarea
              aria-label="Known for Now"
              placeholder={NOW_PLACEHOLDER}
              value={currentNow}
              onValueChange={handleNowChange}
              shouldFitContainer
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[var(--gb-spacing-2)]">
          <p className="w-full text-base-bold text-[var(--gb-text-default)]">
            Known for Next
          </p>
          <div className="flex w-full flex-col items-start gap-[var(--gb-spacing-4)]">
            <Textarea
              aria-label="Known for Next"
              placeholder={GOAL_PLACEHOLDER}
              value={currentGoal}
              onValueChange={handleGoalChange}
              shouldFitContainer
            />
            {hasSavedGoal && (
              <>
                <SettingsSentence
                  postingCount={currentPostingCount}
                  postingFrequency={currentPostingFrequency}
                  targetedFollowersIndex={currentTargetedFollowersIndex}
                  timeframe={currentTimeframe}
                  openPanel={openPanel}
                  onOpenFrequency={() => togglePanel("frequency")}
                  onOpenFollowers={() => togglePanel("followers")}
                  onOpenTimeframe={() => togglePanel("timeframe")}
                />
                {openPanel === "frequency" && (
                  <FrequencyPanel
                    count={currentPostingCount}
                    frequency={currentPostingFrequency}
                    onCountChange={handlePostingCountChange}
                    onFrequencyChange={handlePostingFrequencyChange}
                  />
                )}
                {openPanel === "followers" && (
                  <FollowersPanel
                    index={currentTargetedFollowersIndex}
                    onIndexChange={handleTargetedFollowersIndexChange}
                  />
                )}
                {openPanel === "timeframe" && (
                  <TimeframePanel
                    value={currentTimeframe}
                    onChange={handleTimeframeChange}
                  />
                )}
                <Divider />
                <GabrielleAccordion
                  actions={goalActions}
                  open={goalAccordionOpen}
                  onToggle={() => setGoalAccordionOpen((prev) => !prev)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {showSaveButton && (
        <Button
          type="button"
          variant="primary"
          onClick={handleSaveClick}
          className="w-full"
        >
          Save
        </Button>
      )}
    </div>
  );
}
