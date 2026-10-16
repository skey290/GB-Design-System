import * as React from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ellipsis as MoreHorizontal,
  EllipsisVertical as MoreVertical,
} from "lucide-react";

import styles from "./pagination.module.css";

/**
 * A fully controlled pagination component that takes `totalPages`/`currentPage`
 * and automatically computes page buttons/ellipses. See `docs/components/pagination.md` for spec.
 */

export interface PaginationProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange"
> {
  /** Total number of pages */
  totalPages: number;
  /** Current page (1-indexed) */
  currentPage: number;
  /** Called when the page changes */
  onPageChange: (page: number) => void;
  /** Layout direction (Figma `Direction` variant) */
  direction?: "horizontal" | "vertical";
  /** Display type (Figma `Type` variant) — numbered list or dot indicator */
  type?: "number" | "dot";
  /** Number of page numbers shown on either side (or above/below) the current page (`type="number"` only) */
  siblingCount?: number;
}

const ELLIPSIS = "ellipsis" as const;

/** Computes a page array in the form [1, ..., n-1, n, n+1, ..., total] relative to the current page. */
function getPageList(
  totalPages: number,
  currentPage: number,
  siblingCount: number,
): (number | typeof ELLIPSIS)[] {
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

  const navClassName = className
    ? `${styles.nav} ${className}`
    : styles.nav;

  if (isDot) {
    const dotPages = Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );

    return (
      <nav
        aria-label="페이지네이션"
        data-slot="pagination"
        data-direction={direction}
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
              className={styles.dot}
            >
              {active ? (
                <span aria-hidden="true" className={styles.dotMarkActive}>
                  <span className={styles.dotMarkActiveInner} />
                </span>
              ) : (
                <span aria-hidden="true" className={styles.dotMark} />
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
      data-direction={direction}
      className={navClassName}
      {...props}
    >
      <button
        type="button"
        aria-label="이전 페이지"
        data-slot="pagination-prev"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${styles.item} ${styles.iconColor} ${styles.clickable}`}
      >
        <PrevIcon className={styles.icon} aria-hidden="true" />
      </button>

      {pages.map((page, index) =>
        page === ELLIPSIS ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            data-slot="pagination-ellipsis"
            className={`${styles.item} ${styles.iconColor}`}
          >
            <MoreIcon className={styles.icon} />
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-label={`${page}페이지로 이동`}
            aria-current={page === currentPage ? "page" : undefined}
            data-slot="pagination-item"
            data-active={page === currentPage || undefined}
            onClick={() => onPageChange(page)}
            className={`${styles.item} ${styles.number} ${styles.clickable}`}
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
        className={`${styles.item} ${styles.iconColor} ${styles.clickable}`}
      >
        <NextIcon className={styles.icon} aria-hidden="true" />
      </button>
    </nav>
  );
}
