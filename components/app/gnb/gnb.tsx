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

/** Unread notification bell — a composite icon overlaying a dot on `Bell` (see docs/components/gnb.md) */
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

/** Ids for the 6 Setting panel menu rows (1:1 with Figma's `Part/GNB` labels) */
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

/** Setting panel — just a search box + 6 menu rows stacked, with no header (see docs/components/gnb.md) */
function GnbSettingPanel({
  activeSection,
  searchValue,
  defaultSearchValue,
  onSearchChange,
  onSectionSelect,
  colorScheme,
}: {
  activeSection: GnbSettingSection | null;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  onSectionSelect?: (section: GnbSettingSection) => void;
  colorScheme: "dark" | "light";
}) {
  return (
    <div className={cn(colorScheme, styles.settingPanel)}>
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

/** Main sidebar (see docs/components/gnb.md) */
export interface GnbItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

export interface GnbProps {
  /** Whether the sidebar is expanded (Figma `Expand` variant) */
  expanded: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** List of navigation items (Figma's Dashboard/Assets/Compass/Contents Studio/Know Thyself) */
  items: GnbItem[];
  /** Id of the currently active item */
  activeId: string;
  /** Ids of individually disabled items (Figma `Style=disabled`) */
  disabledIds?: string[];
  onItemSelect?: (id: string) => void;
  /** Determines whether the notification bell's unread dot is shown (hidden when 0) */
  unreadCount?: number;
  /** List of items passed to the notification dropdown (`NotiDropdown`) */
  notificationItems?: NotiDropdownItem[];
  onToggleNotification?: (open: boolean) => void;
  onNotificationSettingsClick?: () => void;
  /** Settings menu click callback (always called together with, independently of, the Setting panel toggle) */
  onSettingsClick?: () => void;
  /** Setting panel menu row click callback */
  onSettingSectionSelect?: (section: GnbSettingSection) => void;
  /** Controlled component value for the Setting panel's search box */
  settingSearchValue?: string;
  /** Uncontrolled initial value for the Setting panel's search box */
  defaultSettingSearchValue?: string;
  onSettingSearchChange?: (value: string) => void;
  className?: string;
  /** Forces light/dark semantic tokens regardless of the page's own theme. Default "dark" */
  colorScheme?: "dark" | "light";
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
  colorScheme = "dark",
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

  // Notification → jumps straight to Setting's Notification section (see docs/components/gnb.md)
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
        className={cn(colorScheme, styles.sidebar, className)}
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
          <span
            role="img"
            aria-label="Gabrielle"
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
                colorScheme={colorScheme}
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
            // Turned off while Setting is open (see docs/components/gnb.md)
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

      {/* Setting panel (see docs/components/gnb.md) */}
      {activeDrawer === "setting" && (
        <GnbSettingPanel
          activeSection={activeSettingSection}
          searchValue={settingSearchValue}
          defaultSearchValue={defaultSettingSearchValue}
          onSearchChange={onSettingSearchChange}
          onSectionSelect={handleSettingSectionSelect}
          colorScheme={colorScheme}
        />
      )}
    </div>
  );
}
