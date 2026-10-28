"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  type LucideIcon,
  BarChartBig,
  Bell,
  CreditCard,
  Shield,
  UserRound,
  PanelLeftClose as PanelLeftCloseIcon,
  PanelLeftOpen as PanelLeftOpenIcon,
  Settings as SettingsIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { GnbButton } from "@/components/app/gnb-button";
import { InputSearch } from "@/components/ui/input-search";
import {
  NotiDropdown,
  type NotiDropdownItem,
} from "@/components/app/noti-dropdown";

/** 읽지 않은 알림 벨 — `Bell` 위에 점을 겹친 합성 아이콘 (docs/components/gnb.md 참고) */
const DotBellIcon = function DotBellIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <Bell aria-hidden="true" className="size-full" />
      <span
        aria-hidden="true"
        data-testid="unread-dot"
        className="absolute -top-0.5 -right-0.5 size-[var(--gb-spacing-1)] rounded-[var(--gb-radius-scale-full)] bg-[var(--gb-background-warning-default)]"
      />
    </span>
  );
} as unknown as LucideIcon;

/** Setting 패널 메뉴 6행의 id (Figma `Part/GNB` 라벨과 1:1 대응) */
export type GnbSettingSection =
  "notification" | "general" | "account" | "privacy" | "billing" | "usage";

const SETTING_SECTIONS: {
  id: GnbSettingSection;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "notification", label: "Notification", icon: Bell },
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "account", label: "Account", icon: UserRound },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "usage", label: "Usage", icon: BarChartBig },
];

/** Setting 패널 — 헤더 없이 검색창+메뉴 6행만 쌓인다 (docs/components/gnb.md 참고) */
function GnbSettingPanel({
  activeSection,
  searchValue,
  defaultSearchValue,
  onSearchChange,
  onSectionSelect,
}: {
  activeSection: GnbSettingSection | null;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  onSectionSelect?: (section: GnbSettingSection) => void;
}) {
  return (
    <div
      className={cn(
        "dark flex h-full w-[250px] flex-col items-start gap-[var(--gb-spacing-2-5)]",
        "bg-[var(--gb-background-subtlest)] px-[var(--gb-spacing-2)] py-[var(--gb-spacing-5)]",
      )}
    >
      <InputSearch
        value={searchValue}
        defaultValue={defaultSearchValue}
        onValueChange={onSearchChange}
        placeholder="Search"
        shouldFitContainer
      />
      <ul
        className={cn(
          "flex w-full flex-col items-start gap-[var(--gb-spacing-2-5)]",
          "border-l-[length:var(--gb-border-1)] border-[var(--gb-border-selected)] pl-[var(--gb-spacing-3-5)]",
        )}
      >
        {SETTING_SECTIONS.map(({ id, label, icon }, index) => (
          <li
            key={id}
            // 레일 헤더 고정 높이에 맞춤, 토큰 스케일에 대응값 없음
            className={cn("w-full shrink-0", index === 0 && "mt-[60px]")}
          >
            <GnbButton
              type="icon-with-text"
              icon={icon}
              label={label}
              status={activeSection === id ? "active" : "default"}
              onClick={() => onSectionSelect?.(id)}
              className="w-full"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 메인 사이드바 (docs/components/gnb.md 참고) */
export interface GnbItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

export interface GnbProps {
  /** 사이드바 확장 여부 (Figma `Expand` variant) */
  expanded: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** 네비게이션 항목 목록 (Figma의 Dashboard/Assets/Compass/Contents Studio/Know Thyself) */
  items: GnbItem[];
  /** 현재 활성 항목 id */
  activeId: string;
  /** 개별적으로 비활성화된 항목 id 목록 (Figma `Style=disabled`) */
  disabledIds?: string[];
  onItemSelect?: (id: string) => void;
  /** 알림 벨의 읽지 않음 dot 표시 여부를 결정 (0이면 dot 숨김) */
  unreadCount?: number;
  /** 알림 드롭다운(`NotiDropdown`)에 전달할 항목 목록 */
  notificationItems?: NotiDropdownItem[];
  onToggleNotification?: (open: boolean) => void;
  onNotificationSettingsClick?: () => void;
  /** Settings 메뉴 클릭 콜백 (Setting 패널 토글과 별개로 항상 함께 호출됨) */
  onSettingsClick?: () => void;
  /** Setting 패널 메뉴 행 클릭 콜백 */
  onSettingSectionSelect?: (section: GnbSettingSection) => void;
  /** Setting 패널 검색창의 제어 컴포넌트 값 */
  settingSearchValue?: string;
  /** Setting 패널 검색창의 비제어 초기값 */
  defaultSettingSearchValue?: string;
  onSettingSearchChange?: (value: string) => void;
  className?: string;
}

export function Gnb({
  expanded,
  onExpandedChange,
  items,
  activeId,
  disabledIds = [],
  onItemSelect,
  unreadCount = 0,
  notificationItems = [],
  onToggleNotification,
  onNotificationSettingsClick,
  onSettingsClick,
  onSettingSectionSelect,
  settingSearchValue,
  defaultSettingSearchValue,
  onSettingSearchChange,
  className,
}: GnbProps) {
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [notificationTab, setNotificationTab] = React.useState<
    "all" | "unread"
  >("all");
  const [activeDrawer, setActiveDrawer] = React.useState<"setting" | null>(
    null,
  );
  const [activeSettingSection, setActiveSettingSection] =
    React.useState<GnbSettingSection | null>(null);
  const menuType = expanded ? "icon-with-text" : "icon";

  const handleSettingSectionSelect = (section: GnbSettingSection) => {
    setActiveSettingSection(section);
    onSettingSectionSelect?.(section);
  };

  // 알림 → Setting의 Notification 섹션 바로 이동 (docs/components/gnb.md 참고)
  const handleNotificationSettingsClick = () => {
    setNotificationOpen(false);
    setActiveDrawer("setting");
    handleSettingSectionSelect("notification");
    onNotificationSettingsClick?.();
  };

  const toggleDrawer = (drawer: "setting") => {
    setActiveDrawer((prev) => (prev === drawer ? null : drawer));
  };

  const handleNotificationOpenChange = (open: boolean) => {
    setNotificationOpen(open);
    onToggleNotification?.(open);
  };

  return (
    <div className="relative inline-flex h-full">
      <div
        className={cn(
          "dark flex h-full flex-col gap-[var(--gb-spacing-2-5)] overflow-hidden",
          "bg-[var(--gb-background-subtlest)] py-[var(--gb-spacing-5)]",
          "transition-[width] duration-200 ease-linear",
          expanded
            ? // Figma 확정값 250px, 좌우 패딩 8px
              "w-[250px] items-start px-[var(--gb-spacing-2)]"
            : // Figma 확정값 48px, 좌우 패딩 6px — 36px 아이콘 슬롯이 꽉 차게 맞물림
              "w-[48px] items-center px-[var(--gb-spacing-1-5)]",
          className,
        )}
      >
        <div className="flex w-full items-center gap-[var(--gb-spacing-3)] overflow-hidden">
          <GnbButton
            type="icon"
            icon={expanded ? PanelLeftCloseIcon : PanelLeftOpenIcon}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => onExpandedChange?.(!expanded)}
            className="shrink-0"
          />
          <img
            src="/images/logo.png"
            alt="Gabrielle"
            aria-hidden={expanded ? undefined : "true"}
            className={cn(
              "h-[13.151px] w-auto shrink-0",
              "transition-opacity duration-150 ease-out",
              expanded ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        <PopoverPrimitive.Root
          open={notificationOpen}
          onOpenChange={handleNotificationOpenChange}
        >
          <PopoverPrimitive.Trigger asChild>
            <GnbButton
              type={menuType}
              icon={unreadCount > 0 ? DotBellIcon : Bell}
              label="Notification"
              status={notificationOpen ? "active" : "default"}
              aria-label={expanded ? undefined : "Notification"}
              className="w-full"
            />
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              side="bottom"
              align="start"
              sideOffset={8}
              className="z-50"
            >
              <NotiDropdown
                items={notificationItems}
                selectedTab={notificationTab}
                onSelectedTabChange={setNotificationTab}
                onSettingsClick={handleNotificationSettingsClick}
                onItemClick={handleNotificationSettingsClick}
              />
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

        <GnbButton
          type={menuType}
          icon={SettingsIcon}
          label="Settings"
          status={activeDrawer === "setting" ? "active" : "default"}
          aria-label={expanded ? undefined : "Settings"}
          onClick={() => {
            if (activeDrawer !== "setting") setActiveSettingSection(null);
            toggleDrawer("setting");
            onSettingsClick?.();
          }}
          className="w-full"
        />

        <div role="separator" className="h-[8px] w-full">
          <div className="mt-[4px] h-[length:var(--gb-border-1)] w-full bg-[var(--gb-border-default)]" />
        </div>

        <nav
          aria-label="Main"
          className="flex w-full flex-1 flex-col gap-[var(--gb-spacing-2-5)] overflow-y-auto"
        >
          {items.map((item) => {
            const isDisabled = disabledIds.includes(item.id);
            // Setting이 열려있는 동안은 끔 (docs/components/gnb.md 참고)
            const isActive =
              !isDisabled && item.id === activeId && activeDrawer !== "setting";

            return (
              <GnbButton
                key={item.id}
                type={menuType}
                icon={item.icon}
                label={item.label}
                aria-label={expanded ? undefined : item.label}
                status={
                  isDisabled ? "disabled" : isActive ? "active" : "default"
                }
                onClick={() => {
                  if (activeDrawer === "setting") setActiveDrawer(null);
                  onItemSelect?.(item.id);
                }}
                className="w-full"
              />
            );
          })}
        </nav>
      </div>

      {/* Setting 패널 (docs/components/gnb.md 참고) */}
      {activeDrawer === "setting" && (
        <GnbSettingPanel
          activeSection={activeSettingSection}
          searchValue={settingSearchValue}
          defaultSearchValue={defaultSettingSearchValue}
          onSearchChange={onSettingSearchChange}
          onSectionSelect={handleSettingSectionSelect}
        />
      )}
    </div>
  );
}
