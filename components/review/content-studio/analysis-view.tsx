"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, type CalendarEventType } from "@/components/ui/calendar";
import { Select } from "@/components/ui/select";
import { Icon } from "@/lib/sprite-icon";

const CHANNEL_OPTIONS = [
  { value: "all", label: "All Channels" },
  { value: "linkedin", label: "LinkedIn" },
];

const PERCEPTION_TRAITS = [
  { label: "Finance-Fluent", status: "matched" as const },
  { label: "Data-Driven", status: "matched" as const },
  { label: "Early-stage Focus", status: "weak" as const },
  { label: "Operator Mindset", status: "not-detected" as const },
];

const FUNNEL_PLATFORMS = [
  "LinkedIn",
  "Instagram",
  "Pinterest",
  "YouTube",
  "Facebook",
  "TikTok",
] as const;

const PERCEPTION_BADGE: Record<
  (typeof PERCEPTION_TRAITS)[number]["status"],
  "success" | "default" | "outline"
> = {
  matched: "success",
  weak: "default",
  "not-detected": "outline",
};

const CALENDAR_EVENTS: Record<string, CalendarEventType> = {
  "2026-09-01": "published",
  "2026-09-02": "reserved",
  "2026-09-03": "draft",
};

export interface AnalysisViewProps {
  hasPosts: boolean;
  onCreatePosts: () => void;
}

/** Analysis 탭 — `docs/GB_Content_Studio.md` 1부①, 14부. */
export function AnalysisView({ hasPosts, onCreatePosts }: AnalysisViewProps) {
  const [channel, setChannel] = React.useState("all");
  const [showFunnel, setShowFunnel] = React.useState(false);

  if (!hasPosts) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-[var(--gb-spacing-4)]">
        <p className="text-lg-semi-bold text-[var(--gb-text-default)]">
          No post yet
        </p>
        <Button variant="primary" onClick={onCreatePosts}>
          Create posts
        </Button>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-2 gap-[var(--gb-spacing-5)] p-[var(--gb-spacing-6)]">
      <section className="flex flex-col gap-[var(--gb-spacing-4)] rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
        <div className="flex items-center justify-between">
          <p className="text-base-bold text-[var(--gb-text-default)]">Reach</p>
          <Select
            variant="side"
            options={CHANNEL_OPTIONS}
            value={channel}
            onValueChange={setChannel}
          />
        </div>

        {showFunnel ? (
          <table className="w-full table-fixed text-left">
            <thead>
              <tr className="text-xs-medium text-[var(--gb-text-subtle)]">
                <th className="py-[var(--gb-spacing-2)]">Platform</th>
                <th>Reach</th>
                <th>Engagement</th>
                <th>New Followers</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              {FUNNEL_PLATFORMS.map((platform, index) => (
                <tr
                  key={platform}
                  className="text-sm-regular text-[var(--gb-text-default)]"
                >
                  <td className="py-[var(--gb-spacing-2)]">{platform}</td>
                  <td>{48 - index * 4}%</td>
                  <td>{12 - index}%</td>
                  <td>{320 - index * 30}</td>
                  <td>{(4.2 - index * 0.3).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center gap-[var(--gb-spacing-6)]">
            <div>
              <p className="text-2xl-semi-bold text-[var(--gb-text-default)]">
                48%
              </p>
              <p className="text-xs-regular text-[var(--gb-text-subtle)]">
                Total Reach
              </p>
            </div>
            <div>
              <p className="text-2xl-semi-bold text-[var(--gb-text-default)]">
                12%
              </p>
              <p className="text-xs-regular text-[var(--gb-text-subtle)]">
                Engagement rate
              </p>
            </div>
            <div>
              <p className="text-2xl-semi-bold text-[var(--gb-text-default)]">
                320
              </p>
              <p className="text-xs-regular text-[var(--gb-text-subtle)]">
                New followers
              </p>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => setShowFunnel((prev) => !prev)}
        >
          {showFunnel ? "Back to Reach" : "Funnel Analysis"}
        </Button>
      </section>

      <section className="flex flex-col gap-[var(--gb-spacing-4)] rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
        <p className="text-base-bold text-[var(--gb-text-default)]">
          Posts This Month
        </p>
        <Calendar mode="single" events={CALENDAR_EVENTS} />
      </section>

      <section className="flex flex-col gap-[var(--gb-spacing-4)] rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
        <p className="text-base-bold text-[var(--gb-text-default)]">
          How people see you
        </p>
        <p className="text-2xl-semi-bold text-[var(--gb-text-default)]">
          Perception Alignment 72%
        </p>
        <div className="flex flex-wrap gap-[var(--gb-spacing-2)]">
          {PERCEPTION_TRAITS.map((trait) => (
            <Badge key={trait.label} variant={PERCEPTION_BADGE[trait.status]}>
              {trait.label}
            </Badge>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-[var(--gb-spacing-4)] rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
        <p className="text-base-bold text-[var(--gb-text-default)]">
          What people say
        </p>
        <div className="flex flex-wrap gap-[var(--gb-spacing-2)]">
          <Badge variant="outline">#FinanceFluent</Badge>
          <Badge variant="outline">#DataStoryteller</Badge>
          <Badge variant="outline">#TrustedModeling</Badge>
        </div>
      </section>

      <section className="col-span-2 flex flex-col gap-[var(--gb-spacing-3)] rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
        <p className="text-base-bold text-[var(--gb-text-default)]">
          Action Items
        </p>
        <div className="flex flex-wrap gap-[var(--gb-spacing-3)]">
          {[
            "Low posting frequency this week",
            "No LinkedIn carousel yet",
            "Perception gap: Operator Mindset",
            "Tone drifted off-brand on 2 posts",
          ].map((label) => (
            <div
              key={label}
              className="flex min-w-[220px] flex-1 items-center justify-between gap-[var(--gb-spacing-3)] rounded-[var(--gb-radius-scale-lg)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-default)] px-[var(--gb-spacing-4)] py-[var(--gb-spacing-3)]"
            >
              <span className="text-sm-medium text-[var(--gb-text-default)]">
                {label}
              </span>
              <Button
                variant="icon-ghost"
                icon={<Icon id="plus-icon" />}
                aria-label="Create a post"
                onClick={onCreatePosts}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
