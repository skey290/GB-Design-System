"use client";

import * as React from "react";
import { CircleCheck, CircleX, Expand, Pencil, Shrink } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import styles from "./ProfileCard.module.css";

export type { SelectOption };

export interface ProfileCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Figma `Open` — full checklist/goal layout vs the collapsed checklist row. Default true */
  open?: boolean;
  /** Figma `Status=disabled` */
  disabled?: boolean;
  /** Image for the avatar. Falls back to the Avatar component's own icon when omitted */
  avatarSrc?: string;
  /** Alt text for the avatar */
  avatarAlt?: string;
  /** Options for the job-title select trigger */
  options: SelectOption[];
  /** Select value when controlled */
  value?: string;
  /** Select initial value when uncontrolled */
  defaultValue?: string;
  /** Called when the select value changes */
  onValueChange?: (value: string) => void;
  /** Select trigger placeholder */
  placeholder?: string;
  /** Click handler for the expand/collapse toggle — typically flips `open` in the parent */
  onToggleOpen?: () => void;
  /** Accessible label for the expand/collapse toggle button */
  toggleLabel?: string;
  /** Whether the Self-Goal checklist item/section is complete */
  isSelfGoalComplete?: boolean;
  /** Whether the Content Goal checklist item/section is complete */
  isContentGoalComplete?: boolean;
  /** Whether the Tone of Voice checklist item/section is complete */
  isToneOfVoiceComplete?: boolean;
  /** Self-Goal "Known for Now" description, shown when `open` */
  knownForNowText?: string;
  /** Self-Goal "Known for Next" description, shown when `open` */
  knownForNextText?: string;
  /** Content Goal description, shown when `open` */
  contentGoalText?: string;
  /** Tone of Voice description, shown when `open` */
  toneOfVoiceText?: string;
  /** Click handler for the Self-Goal pencil edit button, shown when `open` */
  onEditSelfGoal?: () => void;
  /** Click handler for the Content Goal pencil edit button, shown when `open` */
  onEditContentGoal?: () => void;
  /** Click handler for the Tone of Voice pencil edit button, shown when `open` */
  onEditToneOfVoice?: () => void;
}

const CHECKLIST_HINT = "All three are required to generate content.";

const DEFAULT_KNOWN_FOR_NOW_TEXT =
  "Financial modeling and data analysis in early-stage startups.";
const DEFAULT_KNOWN_FOR_NEXT_TEXT =
  "Finance-Fluent Modeling Partner for early-stage SaaS founders.";
const DEFAULT_CONTENT_GOAL_TEXT =
  "Financial modeling and data analysis in early-stage startups.";
const DEFAULT_TONE_OF_VOICE_TEXT =
  "Financial modeling and data analysis in early-stage startups.";

function GoalStatusIcon({ complete }: { complete: boolean }) {
  return complete ? (
    <CircleCheck aria-hidden="true" className={styles.goalStatusSuccess} />
  ) : (
    <CircleX aria-hidden="true" className={styles.goalStatusWarning} />
  );
}

export function ProfileCard({
  className,
  open = true,
  disabled = false,
  avatarSrc,
  avatarAlt = "Profile picture",
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select...",
  onToggleOpen,
  toggleLabel = open ? "Collapse profile card" : "Expand profile card",
  isSelfGoalComplete = false,
  isContentGoalComplete = false,
  isToneOfVoiceComplete = false,
  knownForNowText = DEFAULT_KNOWN_FOR_NOW_TEXT,
  knownForNextText = DEFAULT_KNOWN_FOR_NEXT_TEXT,
  contentGoalText = DEFAULT_CONTENT_GOAL_TEXT,
  toneOfVoiceText = DEFAULT_TONE_OF_VOICE_TEXT,
  onEditSelfGoal,
  onEditContentGoal,
  onEditToneOfVoice,
  ...props
}: ProfileCardProps) {
  return (
    <div
      className={cn(styles.root, className)}
      data-open={open}
      data-disabled={disabled || undefined}
      {...props}
    >
      <div className={styles.headerRow}>
        <Avatar shape="rounded" src={avatarSrc} alt={avatarAlt} />
        <div className={styles.controlsRow}>
          <Select
            variant="mute"
            className={styles.trigger}
            options={options}
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            placeholder={placeholder}
            disabled={disabled}
          />
          <Button
            variant="icon"
            aria-label={toggleLabel}
            icon={open ? <Shrink /> : <Expand />}
            onClick={onToggleOpen}
            disabled={disabled}
          />
        </div>
      </div>
      <div className={styles.divider} aria-hidden="true" />
      {open ? (
        <>
          <div className={styles.goalSection}>
            <div className={styles.goalHeader}>
              <GoalStatusIcon complete={isSelfGoalComplete} />
              <p className={styles.goalTitle}>Self-Goal</p>
            </div>
            <div className={styles.knownForBlock}>
              <div className={styles.knownForLabelRow}>
                <span className={styles.knownForLabel}>Known for</span>
                <Badge variant="reverse" size="20">
                  Now
                </Badge>
              </div>
              <p className={styles.goalText}>{knownForNowText}</p>
            </div>
            <div className={styles.knownForBlock}>
              <div className={styles.knownForLabelRow}>
                <span className={styles.knownForLabel}>Known for</span>
                <Badge variant="reverse" size="20">
                  Next
                </Badge>
              </div>
              <p className={styles.goalText}>{knownForNextText}</p>
            </div>
            <Button
              variant="icon-ghost"
              className={styles.editButton}
              aria-label="Edit Self-Goal"
              icon={<Pencil />}
              onClick={onEditSelfGoal}
              disabled={disabled}
            />
          </div>
          <div className={styles.divider} aria-hidden="true" />
          <div className={styles.goalSectionCompact}>
            <div className={styles.goalHeader}>
              <GoalStatusIcon complete={isContentGoalComplete} />
              <p className={styles.goalTitle}>Content Goal</p>
            </div>
            <p className={styles.goalText}>{contentGoalText}</p>
            <Button
              variant="icon-ghost"
              className={styles.editButton}
              aria-label="Edit Content Goal"
              icon={<Pencil />}
              onClick={onEditContentGoal}
              disabled={disabled}
            />
          </div>
          <div className={styles.divider} aria-hidden="true" />
          <div className={styles.goalSectionCompact}>
            <div className={styles.goalHeader}>
              <GoalStatusIcon complete={isToneOfVoiceComplete} />
              <p className={styles.goalTitle}>Tone of Voice</p>
            </div>
            <p className={styles.goalText}>{toneOfVoiceText}</p>
            <Button
              variant="icon-ghost"
              className={styles.editButton}
              aria-label="Edit Tone of Voice"
              icon={<Pencil />}
              onClick={onEditToneOfVoice}
              disabled={disabled}
            />
          </div>
        </>
      ) : (
        <div className={styles.checklist}>
          <p className={styles.checklistHint}>{CHECKLIST_HINT}</p>
          <div className={styles.checklistRow}>
            <div className={styles.badgeGroup}>
              <Badge
                variant={isSelfGoalComplete ? "success" : "alarm"}
                icon={
                  isSelfGoalComplete ? (
                    <CircleCheck
                      aria-hidden="true"
                      className={styles.checklistBadgeIcon}
                    />
                  ) : (
                    <CircleX
                      aria-hidden="true"
                      className={styles.checklistBadgeIcon}
                    />
                  )
                }
              >
                Self-Goal
              </Badge>
              <Badge
                variant={isContentGoalComplete ? "success" : "alarm"}
                icon={
                  isContentGoalComplete ? (
                    <CircleCheck
                      aria-hidden="true"
                      className={styles.checklistBadgeIcon}
                    />
                  ) : (
                    <CircleX
                      aria-hidden="true"
                      className={styles.checklistBadgeIcon}
                    />
                  )
                }
              >
                Content Goal
              </Badge>
              <Badge
                variant={isToneOfVoiceComplete ? "success" : "alarm"}
                icon={
                  isToneOfVoiceComplete ? (
                    <CircleCheck
                      aria-hidden="true"
                      className={styles.checklistBadgeIcon}
                    />
                  ) : (
                    <CircleX
                      aria-hidden="true"
                      className={styles.checklistBadgeIcon}
                    />
                  )
                }
              >
                Tone of Voice
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
