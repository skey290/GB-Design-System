import * as React from "react";

import { Badge, type BadgeVariant } from "@/components/ui/badge";

import type { FoundationStatus } from "./data";

const STATUS_LABEL: Record<FoundationStatus, string> = {
  "not-started": "Not started",
  "survey-open": "Survey open",
  completed: "Completed",
};

const STATUS_VARIANT: Record<FoundationStatus, BadgeVariant> = {
  "not-started": "destructive",
  "survey-open": "default",
  completed: "success",
};

export interface FoundationCardProps {
  title: string;
  status: FoundationStatus;
  statusOverrideLabel?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

/** 4개 Foundation(My Story/Self-Gap/Inner Self/Outer Self) 공용 대시보드 카드 */
export function FoundationCard({
  title,
  status,
  statusOverrideLabel,
  children,
  footer,
}: FoundationCardProps) {
  return (
    <section className="flex flex-col gap-[var(--gb-spacing-3)] rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
      <div className="flex items-center justify-between">
        <p className="text-base-bold text-[var(--gb-text-default)]">{title}</p>
        <Badge variant={STATUS_VARIANT[status]}>
          {statusOverrideLabel ?? STATUS_LABEL[status]}
        </Badge>
      </div>
      {children}
      {footer}
    </section>
  );
}
