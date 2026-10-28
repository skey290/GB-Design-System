"use client";

import * as React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export interface NudgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShareStory: () => void;
  onDoNotAskAgainChange: (checked: boolean) => void;
}

/** 최초 진입 넛지 모달 (`docs/GB_Know_Thyself.md` 1부①·2부①) */
export function NudgeModal({
  open,
  onOpenChange,
  onShareStory,
  onDoNotAskAgainChange,
}: NudgeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark">
        <div className="flex flex-col items-center gap-[var(--gb-spacing-5)] py-[var(--gb-spacing-4)] text-center">
          <p className="text-lg-semi-bold text-[var(--gb-text-default)]">
            Let&rsquo;s make your brand sharper
          </p>
          <p className="text-sm-regular text-[var(--gb-text-subtle)]">
            Just a few things about you — it&rsquo;ll only take a sec.
          </p>
          <Checkbox
            label="Do not ask again"
            onCheckedChange={onDoNotAskAgainChange}
          />
          <Button variant="primary" onClick={onShareStory} className="w-full">
            Share Your Story
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
