"use client";

import * as React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { NumberlineRow } from "./data";

export interface SelfGapResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  respondedCount: number;
  totalInvited: number;
  matchRate: number;
  matchPoint: string;
  gapPoint: string;
  rows: NumberlineRow[];
  onStartOver: () => void;
  onEditAnswer: () => void;
}

/**
 * Self-Gap 상세 결과 — (1) 매치율+일치 1개+격차 1개 요약, (2) 문항별 넘버라인
 * 비교(`docs/GB_Know_Thyself.md` 3부⑤). 9부 Open Items에서 확정된 스펙 기준
 * (매치율%+일치 1개+격차 1개)으로 구현 — Figma 현 상태(격차 3개)는 반영하지 않음.
 */
export function SelfGapResultDialog({
  open,
  onOpenChange,
  respondedCount,
  totalInvited,
  matchRate,
  matchPoint,
  gapPoint,
  rows,
  onStartOver,
  onEditAnswer,
}: SelfGapResultDialogProps) {
  const min = 1;
  const max = 5;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark">
        <div className="flex flex-col gap-[var(--gb-spacing-5)]">
          <div className="flex flex-col items-center gap-[var(--gb-spacing-3)] text-center">
            <p className="text-xs-medium text-[var(--gb-text-subtle)]">
              Respondents {respondedCount}/{totalInvited} Responded
            </p>
            <p className="text-2xl-semi-bold text-[var(--gb-text-default)]">
              {matchRate}% Match
            </p>
            <div className="flex items-center gap-[var(--gb-spacing-2)]">
              <Badge variant="success">Match: {matchPoint}</Badge>
              <Badge variant="alarm">Gap: {gapPoint}</Badge>
            </div>
          </div>

          <div className="flex items-center justify-center gap-[var(--gb-spacing-4)]">
            <div className="flex items-center gap-[var(--gb-spacing-2)]">
              <span className="size-[8px] rounded-full bg-[var(--gb-color-blue-500)]" />
              <p className="text-xs-regular text-[var(--gb-text-subtle)]">Me</p>
            </div>
            <div className="flex items-center gap-[var(--gb-spacing-2)]">
              <span className="size-[8px] rounded-full bg-[var(--gb-color-red-500)]" />
              <p className="text-xs-regular text-[var(--gb-text-subtle)]">
                Friends
              </p>
            </div>
          </div>

          <div className="flex max-h-[320px] flex-col gap-[var(--gb-spacing-4)] overflow-y-auto">
            {rows.map((row) => (
              <div
                key={row.question}
                className="flex flex-col gap-[var(--gb-spacing-2)]"
              >
                <p className="text-sm-regular text-[var(--gb-text-default)]">
                  {row.question}
                </p>
                <div className="relative h-[20px] w-full">
                  <div className="absolute top-1/2 h-[2px] w-full -translate-y-1/2 bg-[var(--gb-border-subtler)]" />
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 size-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gb-color-blue-500)]"
                    style={{
                      left: `${((row.me - min) / (max - min)) * 100}%`,
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 size-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gb-color-red-500)]"
                    style={{
                      left: `${((row.friends - min) / (max - min)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-[var(--gb-spacing-2)]">
            <Button variant="outline" onClick={onEditAnswer} className="flex-1">
              Edit Answer
            </Button>
            <Button variant="primary" onClick={onStartOver} className="flex-1">
              Start Test
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
