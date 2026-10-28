"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/sprite-icon";

export interface ResultSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  headline: string;
  traits: string[];
  onEditAnswer: () => void;
}

/**
 * Inner Self/Outer Self 공용 결과 모달 — 서술형 한 줄 요약 + 특성 배지 3개 +
 * "Edit Answer" (`docs/GB_Know_Thyself.md` 4부·5부, Self-Gap과 동일한 결과 UI 패턴 공유).
 */
export function ResultSummaryDialog({
  open,
  onOpenChange,
  title,
  headline,
  traits,
  onEditAnswer,
}: ResultSummaryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark">
        <div className="flex flex-col items-center gap-[var(--gb-spacing-5)] py-[var(--gb-spacing-4)] text-center">
          <Icon
            id="circle-check-big-icon"
            className="size-[32px] text-[var(--gb-text-success)]"
          />
          <p className="text-xs-medium text-[var(--gb-text-subtle)]">{title}</p>
          <p className="text-lg-semi-bold text-[var(--gb-text-default)]">
            {headline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-[var(--gb-spacing-2)]">
            {traits.map((trait) => (
              <Badge key={trait} variant="success">
                {trait}
              </Badge>
            ))}
          </div>
          <Button variant="outline" onClick={onEditAnswer} className="w-full">
            Edit Answer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
