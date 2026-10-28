"use client";

import * as React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ProgressBar } from "@/components/ui/progress-bar";

import { LikertScale } from "./likert-scale";
import type { SurveyQuestion } from "./data";

export type SurveyQuestionFormat = "statement" | "tipi" | "paired";

export interface SurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  introTitle: string;
  introDescription: string;
  introHelper: string;
  surveyTitle?: string;
  questions: SurveyQuestion[];
  format: SurveyQuestionFormat;
  scaleMin: number;
  scaleMax: number;
  onComplete: (answers: number[]) => void;
}

function renderQuestionText(
  question: SurveyQuestion,
  format: SurveyQuestionFormat,
) {
  if (format === "tipi") {
    return `I see myself as ${question.traitA}, ${question.traitB}.`;
  }
  if (format === "paired") {
    return `I want to be seen as ${question.traitA}, not ${question.traitB}.`;
  }
  return question.traitA;
}

/**
 * 인트로 → 문항 순회(Likert scale) → 완료의 공용 설문 플로우.
 * Self-Gap(1~5)/Inner Self(TIPI, 1~7)/Outer Self(1~5)가 이 컴포넌트를 공유한다
 * (`docs/GB_Know_Thyself.md` 3·4·5부).
 */
export function SurveyDialog({
  open,
  onOpenChange,
  introTitle,
  introDescription,
  introHelper,
  surveyTitle,
  questions,
  format,
  scaleMin,
  scaleMax,
  onComplete,
}: SurveyDialogProps) {
  const [step, setStep] = React.useState(-1);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    if (open) {
      setStep(-1);
      setAnswers({});
    }
  }, [open]);

  const question = step >= 0 ? questions[step] : null;
  const currentValue = question ? (answers[question.id] ?? null) : null;

  const handleNext = () => {
    if (step === -1) {
      setStep(0);
      return;
    }
    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }
    onComplete(questions.map((q) => answers[q.id]));
  };

  const handleBack = () => {
    if (step <= 0) {
      setStep(-1);
      return;
    }
    setStep(step - 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark">
        {step === -1 ? (
          <div className="flex flex-col items-center gap-[var(--gb-spacing-5)] py-[var(--gb-spacing-4)] text-center">
            <p className="text-lg-semi-bold text-[var(--gb-text-default)]">
              {introTitle}
            </p>
            <p className="text-sm-regular text-[var(--gb-text-subtle)]">
              {introDescription}
            </p>
            <p className="text-xs-regular text-[var(--gb-text-subtler)]">
              {introHelper}
            </p>
            <Button variant="primary" onClick={handleNext} className="w-full">
              Start Test
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-[var(--gb-spacing-5)]">
            <div className="flex flex-col gap-[var(--gb-spacing-2)]">
              {surveyTitle && (
                <p className="text-xs-medium text-[var(--gb-text-subtle)]">
                  {surveyTitle}
                </p>
              )}
              <ProgressBar
                value={((step + 1) / questions.length) * 100}
                aria-label="설문 진행률"
                className="w-full"
              />
              <p className="text-xs-regular text-[var(--gb-text-subtler)]">
                Q{step + 1} / {questions.length}
              </p>
            </div>

            {question && (
              <p className="text-lg-semi-bold text-[var(--gb-text-default)]">
                {renderQuestionText(question, format)}
              </p>
            )}

            <LikertScale
              min={scaleMin}
              max={scaleMax}
              value={currentValue}
              onValueChange={(value) =>
                question &&
                setAnswers((prev) => ({ ...prev, [question.id]: value }))
              }
            />

            <ButtonGroup
              type="back-or-forth"
              primaryLabel={
                step === questions.length - 1 ? "Finish" : "Go Next"
              }
              onSecondaryClick={handleBack}
              onPrimaryClick={handleNext}
              renderPrimary={(button) =>
                React.cloneElement(
                  button as React.ReactElement<{ disabled?: boolean }>,
                  { disabled: currentValue === null },
                )
              }
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
