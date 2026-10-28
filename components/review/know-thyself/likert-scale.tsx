"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

export interface LikertScaleProps {
  min: number;
  max: number;
  value: number | null;
  onValueChange: (value: number) => void;
  lowLabel?: string;
  highLabel?: string;
}

/** 1~N 척도 선택 행. `Button variant="outline" isSelected`를 숫자 버튼으로 재사용한다. */
export function LikertScale({
  min,
  max,
  value,
  onValueChange,
  lowLabel = "Disagree",
  highLabel = "Agree",
}: LikertScaleProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex flex-col gap-[var(--gb-spacing-2)]">
      <div className="flex items-center gap-[var(--gb-spacing-2)]">
        {options.map((n) => (
          <Button
            key={n}
            type="button"
            variant="outline"
            isSelected={value === n}
            aria-label={`${n}점`}
            onClick={() => onValueChange(n)}
            className="flex-1"
          >
            {n}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs-regular text-[var(--gb-text-subtle)]">
          {lowLabel}
        </p>
        <p className="text-xs-regular text-[var(--gb-text-subtle)]">
          {highLabel}
        </p>
      </div>
    </div>
  );
}
