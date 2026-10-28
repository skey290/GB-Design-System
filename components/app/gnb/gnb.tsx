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

import styles from "./gnb.module.css";

/** 읽지 않은 알림 벨 — `Bell` 위에 점을 겹친 합성 아이콘 (docs/components/gnb.md 참고) */
const DotBellIcon = function DotBellIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <span className={cn(styles.dotBellWrap, className)}>
      <Bell aria-hidden="true" className={styles.dotBellIcon} />
      <span
        aria-hidden="true"
        data-testid="unread-dot"
        className={styles.unreadDot}
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
    <div className={cn("dark", styles.settingPanel)}>
      <InputSearch
        value={searchValue}
        defaultValue={defaultSearchValue}
        onValueChange={onSearchChange}
        placeholder="Search"
        shouldFitContainer
      />
      <ul className={styles.settingList}>
        {SETTING_SECTIONS.map(({ id, label, icon }) => (
          <li key={id} className={styles.settingListItem}>
            <GnbButton
              type="icon-with-text"
              icon={icon}
              label={label}
              status={activeSection === id ? "active" : "default"}
              onClick={() => onSectionSelect?.(id)}
              className={styles.fullWidthButton}
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
    <div className={styles.wrapper}>
      <div
        className={cn("dark", styles.sidebar, className)}
        data-expanded={expanded || undefined}
      >
        <div className={styles.topRow}>
          <GnbButton
            type="icon"
            icon={expanded ? PanelLeftCloseIcon : PanelLeftOpenIcon}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => onExpandedChange?.(!expanded)}
            className={styles.collapseButton}
          />
          <img
            src="/images/logo.png"
            alt="Gabrielle"
            aria-hidden={expanded ? undefined : "true"}
            data-expanded={expanded || undefined}
            className={styles.logo}
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
              className={styles.fullWidthButton}
            />
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              side="bottom"
              align="start"
              sideOffset={8}
              className={styles.popoverContent}
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
          className={styles.fullWidthButton}
        />

        <div role="separator" className={styles.separator}>
          <div className={styles.separatorLine} />
        </div>

        <nav aria-label="Main" className={styles.nav}>
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
                className={styles.fullWidthButton}
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
