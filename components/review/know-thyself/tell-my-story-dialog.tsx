"use client";

import * as React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input-form";
import { Textarea } from "@/components/ui/textarea";

const PERSONALITY_TYPE_OPTIONS = [
  { value: "istj", label: "ISTJ" },
  { value: "enfp", label: "ENFP" },
  { value: "intj", label: "INTJ" },
  { value: "esfj", label: "ESFJ" },
  { value: "type-1", label: "Enneagram Type 1" },
  { value: "type-8", label: "Enneagram Type 8" },
];

export interface TellMyStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenMyBasics: () => void;
  onSave: () => void;
}

/** Tell My Story 모달 (`docs/GB_Know_Thyself.md` 1부②·③) */
export function TellMyStoryDialog({
  open,
  onOpenChange,
  onOpenMyBasics,
  onSave,
}: TellMyStoryDialogProps) {
  const [personalityType, setPersonalityType] = React.useState("");
  const [personalityFile, setPersonalityFile] = React.useState<File | null>(
    null,
  );
  const [workStoryFile, setWorkStoryFile] = React.useState<File | null>(null);
  const [workStoryUrl, setWorkStoryUrl] = React.useState("");
  const [interests, setInterests] = React.useState("");
  const [interestFile, setInterestFile] = React.useState<File | null>(null);
  const [interestUrl, setInterestUrl] = React.useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark">
        <div className="flex flex-col gap-[var(--gb-spacing-4)]">
          <p className="text-lg-semi-bold text-[var(--gb-text-default)]">
            Tell My Story
          </p>

          <InputForm
            title="What's my personality type?"
            showTextfield={false}
            showUpload
            file={personalityFile}
            onFileChange={setPersonalityFile}
            showSelect
            selectOptions={PERSONALITY_TYPE_OPTIONS}
            selectValue={personalityType}
            onSelectValueChange={setPersonalityType}
            showLink={false}
            shouldFitContainer
          />

          <InputForm
            title="Could you share your work story?"
            showTextfield={false}
            showUpload
            file={workStoryFile}
            onFileChange={setWorkStoryFile}
            showSelect={false}
            showLink
            linkValue={workStoryUrl}
            onLinkValueChange={setWorkStoryUrl}
            linkPlaceholder="Portfolio URL"
            shouldFitContainer
          />

          <div className="flex flex-col gap-[var(--gb-spacing-2)]">
            <p className="text-sm-medium text-[var(--gb-text-default)]">
              What are you into?
            </p>
            <Textarea
              aria-label="관심사"
              placeholder="자유롭게 적어주세요"
              value={interests}
              onValueChange={setInterests}
              maxLength={1000}
              shouldFitContainer
            />
          </div>

          <InputForm
            title="Upload your interest"
            showTextfield={false}
            showUpload
            file={interestFile}
            onFileChange={setInterestFile}
            showSelect={false}
            showLink
            linkValue={interestUrl}
            onLinkValueChange={setInterestUrl}
            linkPlaceholder="Reference URL"
            shouldFitContainer
          />

          <div className="flex items-center gap-[var(--gb-spacing-3)]">
            <Button variant="primary" onClick={onSave} className="flex-1">
              Save
            </Button>
            <Button variant="link" onClick={onOpenMyBasics}>
              My Basics
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
