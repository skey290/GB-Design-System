"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Figma "Carousel" (node-id 479:736) — 좌/우 화살표 버튼(Button General 인스턴스,
 * `variant="icon"`, 아이콘은 `/icons.svg`의 `arrow-left-icon`/`arrow-right-icon`)과
 * 콘텐츠 슬롯(Slot)만 정의된 최소 구성입니다.
 *
 * 아래 3가지는 Figma 디자인에 명시되어 있지 않아 사용자와 협의해 확정한 사항입니다:
 * 1. 슬라이드 전환 로직 — `embla-carousel-react` 등 외부 라이브러리 설치 없이, 순수
 *    React state(현재 인덱스)와 CSS `transform: translateX()`로 구현.
 * 2. 콘텐츠 슬롯 크기 — Figma 상 318×360px 고정이지만, 재사용 가능한 wrapper로
 *    만들기 위해 가변 크기(`w-full`/`h-full`)로 구현하고 `slotClassName`으로 조절 가능.
 * 3. 인디케이터(dots)/자동재생 — Figma 디자인에 없어 구현 범위에서 제외.
 */
export interface CarouselProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** 슬라이드로 렌더링할 콘텐츠 (각 자식이 하나의 슬라이드) */
  children: React.ReactNode;
  /** 좌측(이전) 버튼 노출 여부 — Figma `leftButton` 불리언 토글에 대응 */
  showPreviousButton?: boolean;
  /** 우측(다음) 버튼 노출 여부 — Figma `rightButton` 불리언 토글에 대응 */
  showNextButton?: boolean;
  /** 이전 버튼 클릭으로 슬라이드가 전환된 뒤 호출. 전환 후 인덱스를 전달 */
  onPrevious?: (index: number) => void;
  /** 다음 버튼 클릭으로 슬라이드가 전환된 뒤 호출. 전환 후 인덱스를 전달 */
  onNext?: (index: number) => void;
  /**
   * 이전 버튼 disabled 여부를 직접 제어. 전달하지 않으면(비제어 모드) 첫 슬라이드에서
   * 자동으로 disabled 처리됩니다.
   */
  previousDisabled?: boolean;
  /**
   * 다음 버튼 disabled 여부를 직접 제어. 전달하지 않으면(비제어 모드) 마지막 슬라이드에서
   * 자동으로 disabled 처리됩니다.
   */
  nextDisabled?: boolean;
  /** 초기 슬라이드 인덱스 (기본 0) */
  defaultIndex?: number;
  /** 콘텐츠 슬롯(뷰포트)에 적용할 className. 기본 크기는 `w-full h-full`(가변) */
  slotClassName?: string;
}

export function Carousel({
  children,
  showPreviousButton = true,
  showNextButton = true,
  onPrevious,
  onNext,
  previousDisabled,
  nextDisabled,
  defaultIndex = 0,
  className,
  slotClassName,
  ...props
}: CarouselProps) {
  const slides = React.Children.toArray(children);
  const lastIndex = Math.max(slides.length - 1, 0);
  const [index, setIndex] = React.useState(() =>
    Math.min(Math.max(defaultIndex, 0), lastIndex),
  );

  const isPreviousDisabled = previousDisabled ?? index === 0;
  const isNextDisabled = nextDisabled ?? index === lastIndex;

  const handlePrevious = () => {
    if (isPreviousDisabled) return;
    const next = Math.max(index - 1, 0);
    setIndex(next);
    onPrevious?.(next);
  };

  const handleNext = () => {
    if (isNextDisabled) return;
    const next = Math.min(index + 1, lastIndex);
    setIndex(next);
    onNext?.(next);
  };

  return (
    <div
      data-slot="carousel"
      className={cn("flex items-center gap-[var(--spacing-5)]", className)}
      {...props}
    >
      {showPreviousButton && (
        <Button
          variant="icon"
          icon="arrow-left-icon"
          aria-label="Previous slide"
          disabled={isPreviousDisabled}
          onClick={handlePrevious}
          className="shrink-0"
        />
      )}

      <div
        data-slot="carousel-viewport"
        className={cn("relative h-full w-full overflow-hidden", slotClassName)}
      >
        <div
          data-slot="carousel-track"
          className="flex h-full transition-transform ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              data-slot="carousel-slide"
              className="h-full w-full shrink-0"
              aria-hidden={slideIndex !== index}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showNextButton && (
        <Button
          variant="icon"
          icon="arrow-right-icon"
          aria-label="Next slide"
          disabled={isNextDisabled}
          onClick={handleNext}
          className="shrink-0"
        />
      )}
    </div>
  );
}
