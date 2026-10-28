"use client";

import * as React from "react";

import { Icon } from "@/lib/sprite-icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface CreateSelfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (goal: string) => void;
}

/** 라이브 사이트의 "+" 슬롯 클릭 시 뜨는 "Create a 'Self'" 모달 (Your Goal + AI 생성 + Continue). */
export function CreateSelfDialog({
  open,
  onOpenChange,
  onContinue,
}: CreateSelfDialogProps) {
  const [goal, setGoal] = React.useState("");

  React.useEffect(() => {
    if (open) setGoal("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a &apos;Self&apos;</DialogTitle>
          <DialogDescription>
            Describe the goal this Self should represent.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Textarea
            title="Your Goal"
            value={goal}
            onValueChange={setGoal}
            maxLength={1000}
            placeholder="e.g. I want to be known as a finance-fluent modeling partner for early-stage SaaS founders."
            shouldFitContainer
          />
          <Button
            variant="icon-ghost"
            aria-label="Generate with AI"
            icon={<Icon id="sparkles-icon" className="size-full" />}
            className="absolute right-[var(--gb-spacing-2)] bottom-[var(--gb-spacing-2)]"
            onClick={() =>
              setGoal(
                "I want to be known as a finance-fluent modeling partner for early-stage SaaS founders.",
              )
            }
          />
        </div>

        <DialogFooter>
          <Button
            disabled={goal.trim().length === 0}
            onClick={() => onContinue(goal)}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
