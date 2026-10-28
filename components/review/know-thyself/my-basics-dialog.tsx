"use client";

import * as React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Chips } from "@/components/ui/chips";
import { DateSelect } from "@/components/ui/date-select";
import { Input } from "@/components/ui/input";
import { InputTime } from "@/components/ui/input-time";
import { ProfilePrint } from "@/components/app/profile-print";

const CHANNEL_OPTIONS = ["LinkedIn", "X", "Instagram", "Threads"];

export interface MyBasicsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

/** My Basics 서브모달 (`docs/GB_Know_Thyself.md` 1부④) */
export function MyBasicsDialog({
  open,
  onOpenChange,
  onSave,
}: MyBasicsDialogProps) {
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [channels, setChannels] = React.useState<string[]>(["LinkedIn"]);

  const toggleChannel = (channel: string) =>
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel],
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark">
        <div className="flex flex-col gap-[var(--gb-spacing-4)]">
          <p className="text-lg-semi-bold text-[var(--gb-text-default)]">
            My Basics
          </p>

          <div className="flex flex-col gap-[var(--gb-spacing-2)]">
            <p className="text-sm-medium text-[var(--gb-text-default)]">
              What should we call you?
            </p>
            <Input
              aria-label="이름"
              placeholder="Your name"
              value={name}
              onValueChange={setName}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-[var(--gb-spacing-2)]">
            <p className="text-sm-medium text-[var(--gb-text-default)]">
              Profile image
            </p>
            <p className="text-xs-regular text-[var(--gb-text-subtle)]">
              이 사진을 기반으로 브랜드 키트가 생성됩니다.
            </p>
            <ProfilePrint type="upload" className="w-full" />
          </div>

          <div className="flex flex-col gap-[var(--gb-spacing-2)]">
            <p className="text-sm-medium text-[var(--gb-text-default)]">
              What do you do?
            </p>
            <Input
              aria-label="직업/역할"
              placeholder="e.g. Data Scientist"
              value={role}
              onValueChange={setRole}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-[var(--gb-spacing-3)]">
            <DateSelect label="Birth date" />
            <InputTime
              label="Birth time"
              defaultValue="09:00"
              defaultPeriod="AM"
            />
          </div>

          <div className="flex flex-col gap-[var(--gb-spacing-2)]">
            <p className="text-sm-medium text-[var(--gb-text-default)]">
              Contact
            </p>
            <Input
              aria-label="연락처"
              placeholder="you@email.com"
              value={contact}
              onValueChange={setContact}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-[var(--gb-spacing-2)]">
            <p className="text-sm-medium text-[var(--gb-text-default)]">
              Where do you want to post?
            </p>
            <div className="flex flex-wrap items-center gap-[var(--gb-spacing-2)]">
              {CHANNEL_OPTIONS.map((channel) => (
                <Chips
                  key={channel}
                  variant="secondary"
                  selected={channels.includes(channel)}
                  onClick={() => toggleChannel(channel)}
                >
                  {channel}
                </Chips>
              ))}
            </div>
          </div>

          <Button variant="primary" onClick={onSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
