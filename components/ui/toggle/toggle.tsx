import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { IconId } from "@/lib/sprite-icon";

export type ToggleType = "icon" | "text";
export type ToggleOrientation = "horizontal" | "vertical" | "grid";
export type ToggleSelectionMode = "multiple" | "single";

const toggleIconItemVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center",
    "h-[36px] w-[34px]",
    "outline-none transition-colors",
    "focus-visible:z-10 focus-visible:shadow-[var(--gb-shadow-focus-ring)]",
    "cursor-pointer disabled:cursor-not-allowed",
  ),
  {
    variants: {
      pressed: {
        true: "bg-[var(--gb-background-mute-subtle)] text-[var(--gb-icon-static-white)]",
        false: cn(
          "bg-[var(--gb-background-default)] text-[var(--gb-icon-default)]",
          "enabled:hover:bg-[var(--gb-background-mute-subtle)] enabled:hover:text-[var(--gb-icon-static-white)]",
        ),
      },
      disabled: {
        true: "bg-[var(--gb-background-disabled)] text-[var(--gb-icon-static-gray)]",
        false: "",
      },
    },
    defaultVariants: { pressed: false, disabled: false },
  },
);

const toggleTextItemVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap",
    "h-[32px] px-[var(--gb-spacing-2)] py-[var(--gb-spacing-1)]",
    "rounded-[var(--gb-radius-scale-md)] shadow-[var(--gb-shadow-sm)]",
    "text-sm-medium outline-none transition-colors",
    "focus-visible:z-10 focus-visible:shadow-[var(--gb-shadow-focus-ring)]",
    "cursor-pointer disabled:cursor-not-allowed",
  ),
  {
    variants: {
      pressed: {
        true: "bg-[var(--gb-background-mute-subtle)] text-[var(--gb-text-static-white)]",
        false: cn(
          "bg-transparent text-[var(--gb-text-default)]",
          "enabled:hover:bg-[var(--gb-background-mute-subtle)] enabled:hover:text-[var(--gb-text-static-white)]",
        ),
      },
      disabled: {
        true: "bg-transparent text-[var(--gb-text-static-gray)]",
        false: "",
      },
    },
    defaultVariants: { pressed: false, disabled: false },
  },
);

interface ToggleItemBase {
  /** 눌림 상태 */
  pressed?: boolean;
  /** 눌림 상태가 바뀔 때 호출됩니다 */
  onPressedChange?: (pressed: boolean) => void;
  /** `orientation="vertical"`일 때만 버튼 우측 바깥에 표시되는 보조 라벨 */
  label?: string;
}

export interface ToggleIconItem extends ToggleItemBase {
  /** 버튼 안에 렌더링할 아이콘 */
  icon: React.ReactNode;
  /** 아이콘만 있는 버튼이라 접근성 라벨이 필수입니다 */
  "aria-label": string;
  text?: never;
}

export interface ToggleTextItem extends ToggleItemBase {
  /** 버튼 안에 렌더링할 텍스트 */
  text: string;
  icon?: never;
  /** 생략하면 `text`가 접근성 이름이 됩니다 */
  "aria-label"?: string;
}

export type ToggleItem = ToggleIconItem | ToggleTextItem;

export interface ToggleTrailingAction {
  /** 아이콘 id */
  icon: IconId;
  "aria-label": string;
  onClick?: () => void;
}

/** `orientation="grid"`는 Figma에 2×2 한 종류만 있어 아이템 4개로 고정한다. */
export type ToggleGridItems = readonly [
  ToggleItem,
  ToggleItem,
  ToggleItem,
  ToggleItem,
];

interface ToggleBaseProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /**
   * 아이템 내용 종류.
   * - `icon`: 보더 박스 + 구분선 안에 아이콘 칩 배치
   * - `text`: 트랙 배경 위에 텍스트 칩이 떠 있는 알약(세그먼트) 형태
   */
  type?: ToggleType;
  /** 그룹 오른쪽에 떨어져 붙는 아이콘 버튼 (`type="text"` + `horizontal` 전용) */
  trailingAction?: ToggleTrailingAction;
  /**
   * 선택 방식 (Figma에 없는 접근성 prop — 시각적 결과는 동일합니다).
   * - `multiple`: 각 항목이 독립적으로 on/off (`aria-pressed`)
   * - `single`: 항상 하나만 선택되는 세그먼트 컨트롤 (`role="radiogroup"`/`radio`)
   */
  selectionMode?: ToggleSelectionMode;
  /** 그룹 전체를 비활성화합니다. 개별 아이템 단위 비활성화는 지원하지 않습니다. */
  disabled?: boolean;
}

export type ToggleProps = ToggleBaseProps &
  (
    | {
        /**
         * 세그먼트 배치 방향.
         * - `horizontal`: 1행 가로 배치
         * - `vertical`: 1열 세로 배치 (`item.label` 지원)
         */
        orientation?: "horizontal" | "vertical";
        /** 세그먼트 그룹에 표시할 아이템 목록 */
        items: ToggleItem[];
      }
    | {
        /** 2×2 그리드 배치. Figma에 이 한 종류만 있어 아이템 4개로 고정된다 */
        orientation: "grid";
        items: ToggleGridItems;
      }
  );

function isIconItem(item: ToggleItem): item is ToggleIconItem {
  return item.text === undefined;
}

function ToggleItemButton({
  item,
  disabled,
  selectionMode,
  className,
}: {
  item: ToggleItem;
  disabled: boolean;
  selectionMode: ToggleSelectionMode;
  className?: string;
}) {
  const pressed = item.pressed ?? false;
  const isSingle = selectionMode === "single";

  const handleClick = () => {
    if (isSingle) {
      if (!pressed) item.onPressedChange?.(true);
      return;
    }
    item.onPressedChange?.(!pressed);
  };

  const selectionProps = isSingle
    ? ({ role: "radio", "aria-checked": pressed } as const)
    : ({ "aria-pressed": pressed } as const);

  return (
    <button
      type="button"
      {...selectionProps}
      aria-label={item["aria-label"]}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        isIconItem(item)
          ? toggleIconItemVariants({ pressed, disabled })
          : toggleTextItemVariants({ pressed, disabled }),
        className,
      )}
    >
      {isIconItem(item) ? (
        <span
          aria-hidden="true"
          data-slot="toggle-icon"
          className="inline-flex size-[16px] items-center justify-center"
        >
          {item.icon}
        </span>
      ) : (
        item.text
      )}
    </button>
  );
}

// Figma에서 구분선은 칸 경계 위에 겹쳐 그려져 컨테이너 치수에 더해지지 않는다.
// 음수 마진으로 레이아웃 차지분을 0으로 만들어 같은 결과를 낸다.
function RowDivider() {
  return (
    <span
      aria-hidden="true"
      data-slot="toggle-divider"
      className="-my-[length:var(--gb-border-1)] h-[length:var(--gb-border-2)] w-full shrink-0 bg-[var(--gb-border-default)]"
    />
  );
}

function ColumnDivider() {
  return (
    <span
      aria-hidden="true"
      data-slot="toggle-divider"
      className="-mx-[length:var(--gb-border-1)] w-[length:var(--gb-border-2)] shrink-0 self-stretch bg-[var(--gb-border-default)]"
    />
  );
}

const iconContainerClassName = cn(
  "inline-flex",
  "rounded-[var(--gb-radius-scale-lg)]",
  "border-[length:var(--gb-border-1)] border-[var(--gb-border-default)] border-solid",
  "shadow-[var(--gb-shadow-xs)]",
);

const textContainerVariants = cva(
  cn(
    "inline-flex h-[36px] items-center",
    "rounded-[var(--gb-radius-scale-lg)]",
    "border-[length:var(--gb-border-1)] border-solid",
    "gap-[var(--gb-spacing-0-5)] p-[var(--gb-spacing-0-5)]",
  ),
  {
    variants: {
      disabled: {
        true: "border-[var(--gb-border-overlay)] bg-[var(--gb-background-disabled)]",
        false:
          "border-[var(--gb-border-default)] bg-[var(--gb-background-selected)]",
      },
    },
    defaultVariants: { disabled: false },
  },
);

export function Toggle({
  items,
  type = "icon",
  orientation = "horizontal",
  trailingAction,
  selectionMode = "multiple",
  disabled = false,
  className,
  ...props
}: ToggleProps) {
  const groupRole = selectionMode === "single" ? "radiogroup" : "group";

  if (type === "text") {
    const pill = (
      <div
        role={groupRole}
        className={cn(
          textContainerVariants({ disabled }),
          trailingAction ? null : className,
        )}
        {...(trailingAction ? {} : props)}
      >
        {items.map((item, index) => (
          <ToggleItemButton
            key={(item.text ?? item["aria-label"] ?? "") + index}
            item={item}
            disabled={disabled}
            selectionMode={selectionMode}
          />
        ))}
      </div>
    );

    if (!trailingAction) return pill;

    return (
      <div
        className={cn(
          "inline-flex items-center gap-[var(--gb-spacing-1-5)]",
          className,
        )}
        {...props}
      >
        {pill}
        <Button
          variant="icon"
          icon={trailingAction.icon}
          aria-label={trailingAction["aria-label"]}
          onClick={trailingAction.onClick}
          disabled={disabled}
        />
      </div>
    );
  }

  if (orientation === "grid") {
    const rows: ToggleItem[][] = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }

    return (
      <div
        role={groupRole}
        className={cn(
          iconContainerClassName,
          "flex-col overflow-clip",
          className,
        )}
        {...props}
      >
        {rows.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {rowIndex > 0 && !disabled && <RowDivider />}
            <div className="inline-flex flex-row">
              {row.map((item, colIndex) => (
                <React.Fragment key={(item["aria-label"] ?? "") + colIndex}>
                  {colIndex > 0 && !disabled && <ColumnDivider />}
                  <ToggleItemButton
                    item={item}
                    disabled={disabled}
                    selectionMode={selectionMode}
                  />
                </React.Fragment>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  // `w-fit` 필수: `align-items: stretch`가 기본인 flex-col 부모 안에 두면
  // 컨테이너가 형제 폭에 맞춰 늘어나 `left-full` 기준점이 밀려난다.
  if (orientation === "vertical") {
    return (
      <div
        role={groupRole}
        className={cn(iconContainerClassName, "w-fit flex-col", className)}
        {...props}
      >
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <div
              key={(item["aria-label"] ?? "") + index}
              className={cn(
                "relative",
                !isLast &&
                  !disabled &&
                  "-mb-[length:var(--gb-border-1)] border-b-[length:var(--gb-border-1)] border-b-[var(--gb-border-default)] border-solid",
              )}
            >
              <ToggleItemButton
                item={item}
                disabled={disabled}
                selectionMode={selectionMode}
                className={cn(
                  isFirst && "rounded-t-[var(--gb-radius-scale-lg)]",
                  isLast && "rounded-b-[var(--gb-radius-scale-lg)]",
                )}
              />
              {item.label && (
                <span
                  data-slot="toggle-label"
                  className="text-xs-medium absolute left-full top-1/2 ml-[var(--gb-spacing-2)] -translate-y-1/2 whitespace-nowrap text-[var(--gb-text-subtle)]"
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role={groupRole}
      className={cn(
        iconContainerClassName,
        "flex-row overflow-clip",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => (
        <React.Fragment key={(item["aria-label"] ?? "") + index}>
          {index > 0 && !disabled && <ColumnDivider />}
          <ToggleItemButton
            item={item}
            disabled={disabled}
            selectionMode={selectionMode}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
