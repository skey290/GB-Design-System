import * as React from "react";
import { cva } from "class-variance-authority";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ellipsis as MoreHorizontal,
  EllipsisVertical as MoreVertical,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * `totalPages`/`currentPage`를 받아 표시할 페이지 버튼과 생략 기호를 자동
 * 계산하는 완전 제어(controlled) 페이지네이션입니다.
 *
 * - `direction`(Horizontal/Vertical), `type`(number/dot) → Figma variant를
 *   그대로 prop화.
 * - `Status`(default/active) → props가 아니라 `currentPage === page` 여부로
 *   자동 결정.
 * - `type="dot"`: Figma 조립 예시(가로 5개 점, 46×6)에 화살표가 없어 이전/
 *   다음 버튼 없이 점만 렌더하고, 점 클릭은 `onPageChange`로 실제 페이지
 *   이동에 연동됩니다. Figma에 dot용 생략(`...`) 표현이 없어 `totalPages`가
 *   아무리 많아도 생략 없이 전부 렌더합니다.
 * - 경계 페이지(첫/마지막)에서의 이전/다음 비활성화는 Figma에 `Status=
 *   disabled`가 없지만, 페이지 범위를 벗어난 이동을 막아야 하는 기능적
 *   필요 때문에 `disabled` + `--gb-opacity-50`으로 유지합니다.
 * - hover 배경색은 Figma에 `Status=hover`가 없어 두지 않습니다. 대신
 *   `cursor-pointer`만 클릭 가능 신호로 남깁니다(색상/배경 변화 없음).
 * - 활성 dot은 6×6px 바운딩 박스 안에 바깥쪽 1px 링(`--gb-icon-faint`) +
 *   안쪽 4×4px 채움(`--gb-icon-pressed`) 구조입니다.
 */

const itemVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center",
    "size-[36px] rounded-[var(--gb-radius-scale-md)]",
    "outline-none transition-colors",
    "focus-visible:shadow-[var(--gb-shadow-focus-ring)]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[var(--gb-opacity-50)]",
  ),
  {
    variants: {
      active: {
        true: cn(
          "border-[length:var(--gb-border-1)] border-[var(--gb-border-default)] border-solid",
          "bg-[var(--gb-background-default)]",
        ),
        false: "bg-transparent",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

const ICON_SIZE_CLASS = "size-[var(--gb-spacing-4)]";
const ICON_COLOR_CLASS = "text-[var(--gb-icon-default)]";
const NUMBER_TEXT_CLASS = "text-sm-medium text-[var(--gb-text-default)]";
/** 실제 상호작용 가능한 아이템(이전/다음/번호)에만 적용, 비인터랙티브
 * ellipsis에는 적용하지 않음 — hover 배경색 제거 대신 남긴 최소 신호. */
const INTERACTIVE_CURSOR_CLASS = "cursor-pointer disabled:cursor-not-allowed";

/** dot 크기(6px)는 토큰 스케일(4/8px 단위)에 정확히 매칭되는 값이 없어
 * 하드코딩 + 인라인 근거 주석 처리 (Select 12px 리셋 아이콘, Chips 16px
 * 삭제 배지와 동일한 예외 패턴). */
const DOT_SIZE_CLASS = "size-[6px]";

export interface PaginationProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange"
> {
  /** 전체 페이지 수 */
  totalPages: number;
  /** 현재 페이지 (1부터 시작) */
  currentPage: number;
  /** 페이지 변경 시 호출됩니다 */
  onPageChange: (page: number) => void;
  /** 배치 방향 (Figma `Direction` variant) */
  direction?: "horizontal" | "vertical";
  /** 표시 형태 (Figma `Type` variant) — 번호 목록 또는 점 인디케이터 */
  type?: "number" | "dot";
  /** 현재 페이지 양옆(또는 상하)으로 표시할 페이지 번호 개수 (`type="number"` 전용) */
  siblingCount?: number;
}

const ELLIPSIS = "ellipsis" as const;

/** 현재 페이지 기준으로 [1, ..., n-1, n, n+1, ..., total] 형태의 페이지 배열을 계산합니다. */
function getPageList(
  totalPages: number,
  currentPage: number,
  siblingCount: number,
): (number | typeof ELLIPSIS)[] {
  // 항상 보여줄 최소 개수: 첫 페이지, 마지막 페이지, 현재 페이지, 좌우 형제, 생략 2개
  const totalVisible = siblingCount * 2 + 5;

  if (totalPages <= totalVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, index) => index + 1,
    );
    return [...leftRange, ELLIPSIS, totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, index) => totalPages - (3 + siblingCount * 2) + 1 + index,
    );
    return [1, ELLIPSIS, ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, index) => leftSibling + index,
  );
  return [1, ELLIPSIS, ...middleRange, ELLIPSIS, totalPages];
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  direction = "horizontal",
  type = "number",
  siblingCount = 1,
  className,
  ...props
}: PaginationProps) {
  const isVertical = direction === "vertical";
  const isDot = type === "dot";

  const navClassName = cn(
    "flex items-center gap-[var(--gb-spacing-1)]",
    isVertical ? "flex-col items-start" : "flex-row",
    className,
  );

  if (isDot) {
    const dotPages = Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );

    return (
      <nav
        aria-label="페이지네이션"
        data-slot="pagination"
        className={navClassName}
        {...props}
      >
        {dotPages.map((page) => {
          const active = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              aria-label={`${page}페이지로 이동`}
              aria-current={active ? "page" : undefined}
              data-slot="pagination-dot"
              onClick={() => onPageChange(page)}
              className={cn(
                "relative inline-flex shrink-0 items-center justify-center",
                DOT_SIZE_CLASS,
                "rounded-[var(--gb-radius-scale-full)] outline-none transition-colors",
                "focus-visible:shadow-[var(--gb-shadow-focus-ring)]",
                INTERACTIVE_CURSOR_CLASS,
              )}
            >
              {active ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    DOT_SIZE_CLASS,
                    "rounded-[var(--gb-radius-scale-full)] bg-[var(--gb-icon-faint)]",
                  )}
                >
                  <span className="absolute inset-[1px] rounded-[var(--gb-radius-scale-full)] bg-[var(--gb-icon-pressed)]" />
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className={cn(
                    DOT_SIZE_CLASS,
                    "rounded-[var(--gb-radius-scale-full)] bg-[var(--gb-icon-default)]",
                  )}
                />
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  const pages = getPageList(totalPages, currentPage, siblingCount);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const PrevIcon = isVertical ? ChevronUp : ChevronLeft;
  const NextIcon = isVertical ? ChevronDown : ChevronRight;
  const MoreIcon = isVertical ? MoreVertical : MoreHorizontal;

  return (
    <nav
      aria-label="페이지네이션"
      data-slot="pagination"
      className={navClassName}
      {...props}
    >
      <button
        type="button"
        aria-label="이전 페이지"
        data-slot="pagination-prev"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          itemVariants({ active: false }),
          ICON_COLOR_CLASS,
          INTERACTIVE_CURSOR_CLASS,
        )}
      >
        <PrevIcon className={ICON_SIZE_CLASS} aria-hidden="true" />
      </button>

      {pages.map((page, index) =>
        page === ELLIPSIS ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            data-slot="pagination-ellipsis"
            className={cn(itemVariants({ active: false }), ICON_COLOR_CLASS)}
          >
            <MoreIcon className={ICON_SIZE_CLASS} />
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-label={`${page}페이지로 이동`}
            aria-current={page === currentPage ? "page" : undefined}
            data-slot="pagination-item"
            onClick={() => onPageChange(page)}
            className={cn(
              itemVariants({ active: page === currentPage }),
              NUMBER_TEXT_CLASS,
              INTERACTIVE_CURSOR_CLASS,
            )}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="다음 페이지"
        data-slot="pagination-next"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(
          itemVariants({ active: false }),
          ICON_COLOR_CLASS,
          INTERACTIVE_CURSOR_CLASS,
        )}
      >
        <NextIcon className={ICON_SIZE_CLASS} aria-hidden="true" />
      </button>
    </nav>
  );
}
