"use client";

import * as React from "react";

import styles from "./slider.module.css";

export interface SliderProps {
  /** Current value when used as a controlled component */
  value?: number;
  /** Initial value when used as an uncontrolled component (30, closest to the ~31% ratio in the Figma example) */
  defaultValue?: number;
  /** Called when the value changes (drag, click, keyboard interaction) */
  onValueChange?: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Increment/decrement unit per step */
  step?: number;
  /** Merged onto the track */
  className?: string;
  /** Root id */
  id?: string;
  /** Accessible label applied to the thumb (role="slider") */
  "aria-label"?: string;
  /** Connects the thumb's accessible name to a label element's id */
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
      className={className ? `${styles.track} ${className}` : styles.track}
    >
      <div
        data-slot="slider-range"
        aria-hidden="true"
        className={styles.range}
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
        className={styles.thumb}
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}
