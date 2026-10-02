"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Chips } from "@/components/ui/chips";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/**
 * Figma 소스 없이(사용자 요청) 기존 컴포넌트(Slider/Chips/Textarea/Button)와
 * 토큰만으로 구성한 신규 복합 컴포넌트. 온보딩에서 퍼스널 브랜딩의 톤앤매너를
 * 파악하기 위한 카드로, 자유 텍스트 대신 "스펙트럼 2축 + 키워드 다중선택(최대
 * maxKeywords개) + 선택적 레퍼런스 한 줄"로 문항을 압축해, 적은 입력으로도
 * 결과물 생성의 근거가 될 만큼 명확한 신호를 받는 것을 목표로 한다.
 */
export interface OnboardingToneValue {
  /** 0(미니멀) ~ 100(화려함) 스펙트럼 값 */
  minimalToDecorative: number;
  /** 0(차분함) ~ 100(강렬함) 스펙트럼 값 */
  calmToIntense: number;
  /** 선택된 톤 키워드 (최대 maxKeywords개) */
  keywords: string[];
  /** 참고하고 싶은 브랜드/사람 (선택 입력) */
  reference: string;
}

const DEFAULT_VALUE: OnboardingToneValue = {
  minimalToDecorative: 50,
  calmToIntense: 50,
  keywords: [],
  reference: "",
};

const TONE_KEYWORDS = [
  "Minimal",
  "Elegant",
  "Warm",
  "Professional",
  "Playful",
  "Modern",
  "Classic",
  "Bold",
] as const;

export interface OnboardingToneCardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "onSubmit" | "value" | "defaultValue"
  > {
  /** 카드 상단 타이틀 */
  title?: string;
  /** 타이틀 아래 설명 문구 */
  description?: string;
  /** 제어 컴포넌트로 사용할 때의 현재 값 */
  value?: OnboardingToneValue;
  /** 비제어 컴포넌트로 사용할 때의 초기 값 */
  defaultValue?: OnboardingToneValue;
  /** 필드 중 하나라도 바뀔 때마다 호출 */
  onValueChange?: (value: OnboardingToneValue) => void;
  /** 제출 버튼 클릭 시 호출 */
  onSubmit?: (value: OnboardingToneValue) => void;
  /** 제출 버튼 라벨 */
  submitLabel?: string;
  /** 키워드 최대 선택 개수 */
  maxKeywords?: number;
}

export function OnboardingToneCard({
  title = "Tell us your brand tone",
  description = "A few precise questions get us to the right direction. Go with your gut.",
  value,
  defaultValue = DEFAULT_VALUE,
  onValueChange,
  onSubmit,
  submitLabel = "Next",
  maxKeywords = 3,
  className,
  ...props
}: OnboardingToneCardProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const current = isControlled ? (value as OnboardingToneValue) : uncontrolledValue;

  const commit = (next: OnboardingToneValue) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  const toggleKeyword = (keyword: string) => {
    const selected = current.keywords.includes(keyword);
    if (!selected && current.keywords.length >= maxKeywords) return;
    const nextKeywords = selected
      ? current.keywords.filter((k) => k !== keyword)
      : [...current.keywords, keyword];
    commit({ ...current, keywords: nextKeywords });
  };

  const canSubmit = current.keywords.length > 0;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[var(--spacing-6)]",
        "rounded-[var(--radius-scale-2xl)] border-[length:var(--border-1)] border-solid border-[var(--border-default)]",
        "bg-[var(--background-default)] p-[var(--spacing-6)]",
        "shadow-[var(--shadow-sm)]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-[var(--spacing-1)]">
        <p className="text-lg-semi-bold text-[var(--text-default)]">
          {title}
        </p>
        <p className="text-sm-regular text-[var(--text-subtle)]">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-[var(--spacing-5)]">
        <div className="flex flex-col gap-[var(--spacing-2)]">
          <div className="flex items-center justify-between">
            <span className="text-xs-medium text-[var(--text-subtle)]">
              Minimal
            </span>
            <span className="text-xs-medium text-[var(--text-subtle)]">
              Decorative
            </span>
          </div>
          <Slider
            value={current.minimalToDecorative}
            onValueChange={(next) =>
              commit({ ...current, minimalToDecorative: next })
            }
            aria-label="Tone from minimal to decorative"
          />
        </div>

        <div className="flex flex-col gap-[var(--spacing-2)]">
          <div className="flex items-center justify-between">
            <span className="text-xs-medium text-[var(--text-subtle)]">
              Calm
            </span>
            <span className="text-xs-medium text-[var(--text-subtle)]">
              Intense
            </span>
          </div>
          <Slider
            value={current.calmToIntense}
            onValueChange={(next) =>
              commit({ ...current, calmToIntense: next })
            }
            aria-label="Tone from calm to intense"
          />
        </div>
      </div>

      <div className="flex flex-col gap-[var(--spacing-2)]">
        <span className="text-sm-medium text-[var(--foreground)]">
          Pick up to {maxKeywords} keywords closest to your tone
        </span>
        <div className="flex flex-wrap gap-[var(--spacing-2)]">
          {TONE_KEYWORDS.map((keyword) => {
            const selected = current.keywords.includes(keyword);
            const limitReached =
              !selected && current.keywords.length >= maxKeywords;
            return (
              <Chips
                key={keyword}
                variant="outline"
                selected={selected}
                disabled={limitReached}
                onClick={() => toggleKeyword(keyword)}
              >
                {keyword}
              </Chips>
            );
          })}
        </div>
      </div>

      <Textarea
        label="Any brand or person you'd like to reference? (optional)"
        value={current.reference}
        onValueChange={(next) => commit({ ...current, reference: next })}
        maxLength={120}
        placeholder="e.g. Understated, like MUJI"
      />

      <Button
        variant="primary"
        disabled={!canSubmit}
        onClick={() => onSubmit?.(current)}
        className="w-full"
      >
        {submitLabel}
      </Button>
    </div>
  );
}
