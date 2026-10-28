"use client";

import * as React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/lib/sprite-icon";

export interface SelfGapInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (emails: string) => void;
}

/** Self-Gap 완료 직후 친구 초대 모달 (`docs/GB_Know_Thyself.md` 3부③) */
export function SelfGapInviteDialog({
  open,
  onOpenChange,
  onInvite,
}: SelfGapInviteDialogProps) {
  const [emails, setEmails] = React.useState("");

  React.useEffect(() => {
    if (open) setEmails("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark">
        <div className="flex flex-col items-center gap-[var(--gb-spacing-5)] py-[var(--gb-spacing-4)] text-center">
          <Icon
            id="circle-check-big-icon"
            className="size-[32px] text-[var(--gb-text-success)]"
          />
          <p className="text-lg-semi-bold text-[var(--gb-text-default)]">
            Invite your friends to see &lsquo;Self-Gap&rsquo; result.
          </p>
          <p className="text-sm-regular text-[var(--gb-text-subtle)]">
            They&rsquo;ll answer about you. You&rsquo;ll see where you match —
            and where you don&rsquo;t.
          </p>
          <Input
            aria-label="친구 이메일(콤마로 구분)"
            placeholder="friend1@email.com, friend2@email.com"
            value={emails}
            onValueChange={setEmails}
            className="w-full"
          />
          <div className="flex w-full items-center gap-[var(--gb-spacing-2)]">
            <Button
              variant="outline"
              icon={<Icon id="replace-icon" />}
              onClick={() =>
                navigator.clipboard?.writeText(
                  "https://gabrielle-ai.com/self-gap/invite/demo",
                )
              }
              className="flex-1"
            >
              Copy link
            </Button>
            <Button
              variant="primary"
              disabled={!emails.trim()}
              onClick={() => onInvite(emails)}
              className="flex-1"
            >
              Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
