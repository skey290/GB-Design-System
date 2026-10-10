"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SliderProps {
  /** 제어 컴포넌트로 사용할 때의 현재 값 */
  value?: number;
  /** 비제어 컴포넌트로 사용할 때의 초기 값 (Figma 예시 비율 약 31%에 가장 가까운 30) */
  defaultValue?: number;
  /** 값이 바뀔 때(드래그, 클릭, 키보드 조작) 호출됩니다 */
  onValueChange?: (value: number) => void;
  /** 최솟값 */
  min?: number;
  /** 최댓값 */
  max?: number;
  /** 한 번에 증감하는 단위 */
  step?: number;
  className?: string;
  id?: string;
  /** thumb(role="slider")에 적용되는 접근성 라벨 */
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundToStep(value: number, min: number, step: number) {
  if (step <= 0) return value;
  const steps = Math.round((value - min) / step);
  return min + steps * step;
}

export function Slider({
  value,
  defaultValue = 30,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SliderProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
    clamp(defaultValue, min, max),
  );
  const currentValue = clamp(
    isControlled ? (value as number) : uncontrolledValue,
    min,
    max,
  );

  const trackRef = React.useRef<HTMLDivElement>(null);
  const draggingRef = React.useRef(false);

  const commitValue = React.useCallback(
    (next: number) => {
      const clamped = clamp(roundToStep(next, min, step), min, max);
      if (!isControlled) {
        setUncontrolledValue(clamped);
      }
      onValueChange?.(clamped);
    },
    [isControlled, min, max, step, onValueChange],
  );

  const valueFromClientX = React.useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return currentValue;
      const rect = track.getBoundingClientRect();
      const ratio = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width;
      return min + clamp(ratio, 0, 1) * (max - min);
    },
    [currentValue, min, max],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    commitValue(valueFromClientX(event.clientX));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    commitValue(valueFromClientX(event.clientX));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const bigStep = step * 10;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        commitValue(currentValue + step);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        commitValue(currentValue - step);
        break;
      case "PageUp":
        event.preventDefault();
        commitValue(currentValue + bigStep);
        break;
      case "PageDown":
        event.preventDefault();
        commitValue(currentValue - bigStep);
        break;
      case "Home":
        event.preventDefault();
        commitValue(min);
        break;
      case "End":
        event.preventDefault();
        commitValue(max);
        break;
      default:
        break;
    }
  };

  const percent = max === min ? 0 : ((currentValue - min) / (max - min)) * 100;

  return (
    <div
      ref={trackRef}
      id={id}
      data-slot="slider-track"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "relative h-[var(--gb-spacing-1-5)] w-full touch-none cursor-pointer rounded-[var(--gb-radius-scale-full)] bg-[var(--muted)] select-none",
        className,
      )}
    >
      <div
        data-slot="slider-range"
        aria-hidden="true"
        className="absolute top-0 left-0 h-full rounded-[var(--gb-radius-scale-full)] bg-[var(--primary)]"
        style={{ width: `${percent}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-valuenow={currentValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-orientation="horizontal"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-slot="slider-thumb"
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 size-[var(--gb-spacing-4)] -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-[var(--gb-radius-scale-full)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-bolder)] bg-[var(--background)] outline-none focus-visible:shadow-[var(--gb-shadow-focus-ring)] active:cursor-grabbing"
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}
