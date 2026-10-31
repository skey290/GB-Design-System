import * as React from "react";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Icon, type IconId } from "@/lib/sprite-icon";
import { cn } from "@/lib/utils";

import styles from "./PostSignal.module.css";

/** Figma `Type`. */
export type PostSignalType = "full" | "empty";

/** Figma `Part/post signal` → `Type` (semantic status of a perception trait). */
export type PostSignalTraitStatus = "matched" | "weak-signal" | "not-detected";

/** One row in the "How people see you" trait list. */
export interface PostSignalTrait {
  /** Trait name, e.g. "Expert & authoritative" */
  label: string;
  /** Drives the icon, label color, and default badge variant/label */
  status: PostSignalTraitStatus;
  /** Supporting copy below the divider */
  description: string;
  /** Overrides the status's default badge label */
  badgeLabel?: string;
}

/** One row in the "How people respond" reaction list. */
export interface PostSignalReaction {
  icon: IconId;
  label: string;
  /** Bar fill percent (0-100). Independent of `comments` */
  percent: number;
  comments: number;
  quote: string;
}

export interface PostSignalProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Figma `Type` */
  type?: PostSignalType;
  /** "Perception Alignment" row label */
  perceptionLabel?: string;
  /** "Perception Alignment" row + progress bar percent (0-100) */
  perceptionPercent?: number;
  /** Trait rows, in display order */
  traits?: PostSignalTrait[];
  /** Hashtag list under "Top perceived traits (from comments)" */
  perceivedTraits?: string[];
  /** Reaction rows, in display order */
  reactions?: PostSignalReaction[];
  /** "How people see you" empty-state title */
  perceptionEmptyTitle?: string;
  /** "How people see you" empty-state description */
  perceptionEmptyDescription?: string;
  /** "What people say" empty-state title */
  feedbackEmptyTitle?: string;
  /** "What people say" empty-state description */
  feedbackEmptyDescription?: string;
}

const STATUS_META: Record<
  PostSignalTraitStatus,
  { icon: IconId; badgeVariant: BadgeVariant; defaultLabel: string }
> = {
  matched: {
    icon: "circle-check-icon",
    badgeVariant: "outline",
    defaultLabel: "Matched",
  },
  "weak-signal": {
    icon: "triangle-alert-icon",
    badgeVariant: "default",
    defaultLabel: "Weak signal",
  },
  "not-detected": {
    icon: "circle-x-icon",
    badgeVariant: "alarm",
    defaultLabel: "Not detected",
  },
};

const DEFAULT_TRAITS: PostSignalTrait[] = [
  {
    label: "Expert & authoritative",
    status: "matched",
    description:
      "To be the go-to person for sustainable fashion startups, your content needs to establish deep expertise and authority.",
  },
  {
    label: "Professional & credible",
    status: "matched",
    description:
      "Reaching investors and co-founders requires trust and professionalism as your first impression.",
  },
  {
    label: "Niche leader",
    status: "weak-signal",
    description:
      "Positioning yourself as the leading voice in sustainable fashion requires a clear, ownable niche identity.",
  },
  {
    label: "Influential voice",
    status: "not-detected",
    description:
      "To land speaking engagements and an advisory role within 6 months, your audience needs to see you as a thought leader.",
  },
  {
    label: "Community builder",
    status: "matched",
    description:
      "Hitting 500 newsletter subscribers means people need to see you as someone worth following consistently.",
  },
];

const DEFAULT_PERCEIVED_TRAITS = [
  "Relatable",
  "Trustworthy",
  "Practical",
  "Authentic",
  "Inspiring",
];

const DEFAULT_REACTIONS: PostSignalReaction[] = [
  {
    icon: "message-circle-heart-icon",
    label: "Empathy",
    percent: 50,
    comments: 43,
    quote: '"I went through the same thing..."',
  },
  {
    icon: "message-circle-question-icon",
    label: "Question",
    percent: 40,
    comments: 28,
    quote: '"How did you get started with this?"',
  },
  {
    icon: "share-2-icon",
    label: "Sharing intent",
    percent: 20,
    comments: 19,
    quote: '"Sending this to a friend right now."',
  },
  {
    icon: "messages-square-icon",
    label: "Discussion",
    percent: 0,
    comments: 4,
    quote: '"I\'d push back on point 2 though..."',
  },
];

function EmptyBody({
  icon,
  title,
  description,
}: {
  icon: IconId;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.emptyBody}>
      <div className={styles.emptyIconWrap}>
        <Icon id={icon} className={styles.emptyIcon} />
      </div>
      <p className={styles.emptyTitle}>{title}</p>
      <p className={styles.emptyDescription}>{description}</p>
    </div>
  );
}

function TraitRow({ trait }: { trait: PostSignalTrait }) {
  const meta = STATUS_META[trait.status];

  return (
    <div className={styles.sonner} data-status={trait.status}>
      <div className={styles.sonnerHeader}>
        <Icon id={meta.icon} className={styles.sonnerStatusIcon} />
        <p className={styles.traitLabel}>{trait.label}</p>
        <Badge variant={meta.badgeVariant} size="20">
          {trait.badgeLabel ?? meta.defaultLabel}
        </Badge>
      </div>
      <div className={styles.sonnerBody}>
        <div className={styles.divider} aria-hidden="true" />
        <p className={styles.traitDescription}>{trait.description}</p>
      </div>
    </div>
  );
}

function ReactionRow({ reaction }: { reaction: PostSignalReaction }) {
  return (
    <div className={styles.sonner}>
      <div className={styles.sonnerHeader}>
        <Icon id={reaction.icon} className={styles.reactionIcon} />
        <p className={styles.reactionLabel}>{reaction.label}</p>
        <div className={styles.reactionBarWrap}>
          <ProgressBar value={reaction.percent} aria-label={reaction.label} />
          <span className={styles.reactionCaption}>
            {reaction.comments} comments
          </span>
        </div>
      </div>
      <div className={styles.sonnerBody}>
        <div className={styles.divider} aria-hidden="true" />
        <p className={styles.reactionQuote}>{reaction.quote}</p>
      </div>
    </div>
  );
}

export function PostSignal({
  className,
  type = "full",
  perceptionLabel = "Perception Alignment",
  perceptionPercent = 75,
  traits = DEFAULT_TRAITS,
  perceivedTraits = DEFAULT_PERCEIVED_TRAITS,
  reactions = DEFAULT_REACTIONS,
  perceptionEmptyTitle = "No audience signals yet",
  perceptionEmptyDescription = "We need comments and feedback to analyze how your brand is perceived.",
  feedbackEmptyTitle = "No feedback insights yet",
  feedbackEmptyDescription = "Your top perceived traits from comments will appear here.",
  ...props
}: PostSignalProps) {
  const isEmpty = type === "empty";

  return (
    <div className={cn(styles.root, className)} data-type={type} {...props}>
      <div className={styles.card}>
        <p className={styles.title}>How people see you</p>
        {isEmpty ? (
          <EmptyBody
            icon="heart-icon"
            title={perceptionEmptyTitle}
            description={perceptionEmptyDescription}
          />
        ) : (
          <div className={styles.perceptionBody}>
            <div className={styles.perceptionHeaderRow}>
              <p className={styles.perceptionLabel}>{perceptionLabel}</p>
              <p
                className={styles.perceptionValue}
              >{`${perceptionPercent}%`}</p>
            </div>
            <ProgressBar
              value={perceptionPercent}
              aria-label={perceptionLabel}
            />
            {traits.map((trait) => (
              <TraitRow key={trait.label} trait={trait} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.card}>
        <p className={styles.title}>What people say</p>
        {isEmpty ? (
          <EmptyBody
            icon="smile-icon"
            title={feedbackEmptyTitle}
            description={feedbackEmptyDescription}
          />
        ) : (
          <>
            <div className={styles.perceivedTraitsBlock}>
              <p className={styles.sectionLabel}>
                Top perceived traits (from comments)
              </p>
              <div className={styles.hashtagRow}>
                {perceivedTraits.map((trait) => (
                  <span key={trait} className={styles.hashtag}>
                    {`#${trait}`}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.reactionsBlock}>
              <p className={styles.sectionLabel}>
                How people respond (from comments)
              </p>
              {reactions.map((reaction) => (
                <ReactionRow key={reaction.label} reaction={reaction} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
