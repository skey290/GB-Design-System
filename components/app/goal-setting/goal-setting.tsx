"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chips } from "@/components/ui/chips";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/lib/sprite-icon";

import styles from "./goal-setting.module.css";

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

const NOW_PLACEHOLDER =
  "What are you known for today? Share your experience, past work, or what people already know you for.";
const GOAL_PLACEHOLDER =
  "What do you want to be known for next? Describe the position and audience you're aiming for.";

export function Divider() {
  return <div className={styles.divider} />;
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
    <p className={styles.sentence}>
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
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  formatOption?: (option: T) => string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={styles.radioGroup}>
      {options.map((option) => {
        const isSelected = option === value;
        return (
          <Button
            key={option}
            type="button"
            variant="mute"
            role="radio"
            aria-checked={isSelected}
            isSelected={isSelected}
            onClick={() => onChange(option)}
            className={styles.radioButton}
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
    <div className={styles.settingsPanel}>
      <p className={styles.settingsPanelTitle}>{title}</p>
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
      <div className={styles.frequencyRow}>
        <div className={styles.frequencyCounterRow}>
          <Button
            type="button"
            variant="icon-ghost"
            icon={<Icon id="minus-icon" />}
            aria-label="감소"
            onClick={() => onCountChange(Math.max(1, count - 1))}
          />
          <span className={styles.frequencyCount}>{count}</span>
          <Button
            type="button"
            variant="icon-ghost"
            icon={<Icon id="plus-icon" />}
            aria-label="증가"
            onClick={() => onCountChange(count + 1)}
          />
          <span className={styles.frequencyUnit}>time(s)</span>
        </div>
        <ToggleGroup
          label="Posting Frequency"
          options={POSTING_FREQUENCIES}
          value={frequency}
          onChange={onFrequencyChange}
          formatOption={(option) => `a ${option}`}
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
      <div className={styles.followersSliderWrap}>
        <Slider
          value={index}
          onValueChange={onIndexChange}
          min={0}
          max={TARGETED_FOLLOWERS_LABELS.length - 1}
          step={1}
          aria-label="Targeted Followers"
          shouldFitContainer
        />
        <div className={styles.followersLabelsWrap}>
          {TARGETED_FOLLOWERS_LABELS.map((label, labelIndex) => {
            const isFirst = labelIndex === 0;
            const isLast = labelIndex === TARGETED_FOLLOWERS_LABELS.length - 1;
            return (
              <span
                key={label}
                style={{
                  left: `${(labelIndex / (TARGETED_FOLLOWERS_LABELS.length - 1)) * 100}%`,
                }}
                data-position={isFirst ? "first" : isLast ? "last" : undefined}
                className={styles.followersLabel}
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
    <div className={styles.goalAccordion}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={styles.goalAccordionTrigger}
      >
        <span className={styles.goalAccordionTriggerLeft}>
          <Icon id="sparkles-icon" className={styles.goalAccordionIcon} />
          <span className={styles.goalAccordionLabel}>
            Gabrielle suggests {actions.length} action
            {actions.length === 1 ? "" : "s"}
          </span>
        </span>
        <Icon
          id={open ? "chevron-up-icon" : "chevron-down-icon"}
          className={styles.goalAccordionIcon}
        />
      </button>
      {open && (
        <div className={styles.goalAccordionPanel}>
          {shown.map((action) => (
            <div key={action.id} className={styles.goalAccordionRow}>
              <Badge variant="outline" size="20">
                {action.category}
              </Badge>
              <p className={styles.goalAccordionRowLabel}>{action.label}</p>
              <Button type="button" variant="outline" onClick={action.onRun}>
                Run
              </Button>
            </div>
          ))}
          {moreCount > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className={styles.goalAccordionMore}
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
    <div className={cn("dark", styles.root, className)}>
      {showHeader && (
        <div className={styles.header}>
          <p className={styles.headerTitle}>My goal</p>
          <Button
            type="button"
            variant="icon-ghost"
            icon={<Icon id="x-icon" />}
            aria-label="닫기"
            onClick={onClose}
          />
        </div>
      )}

      <div className={styles.contentWrap}>
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Known for Now</p>
          <div className={styles.sectionBody}>
            <Textarea
              aria-label="Known for Now"
              placeholder={NOW_PLACEHOLDER}
              value={currentNow}
              onValueChange={handleNowChange}
              shouldFitContainer
            />
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Known for Next</p>
          <div className={styles.sectionBody}>
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
          className={styles.saveButton}
        >
          Save
        </Button>
      )}
    </div>
  );
}
