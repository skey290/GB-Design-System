import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Home } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { FloatingMenu, type FloatingMenuItem } from "./FloatingMenu";

const items: FloatingMenuItem[] = [
  { id: "dashboard", icon: Home },
  { id: "assets", label: "Assets" },
  { id: "compass", label: "Compass" },
  { id: "contents-studio", label: "Content Studio" },
];

/** 스토리 전용 컨트롤드 래퍼: activeId 상태를 로컬에서 관리해 인터랙션을 재현합니다 */
function ControlledFloatingMenu({
  initialActiveId,
  onActiveChange,
}: {
  initialActiveId: string;
  onActiveChange?: (id: string) => void;
}) {
  const [activeId, setActiveId] = React.useState(initialActiveId);

  return (
    <FloatingMenu
      items={items}
      activeId={activeId}
      onActiveChange={(id) => {
        setActiveId(id);
        onActiveChange?.(id);
      }}
    />
  );
}

const meta = {
  title: "UI/FloatingMenu",
  component: FloatingMenu,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=601-467",
    },
  },
  args: {
    items,
    onActiveChange: fn(),
  },
} satisfies Meta<typeof FloatingMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `Status=dashboard` — 아이콘 전용 항목이 활성화된 상태 */
export const DashboardActive: Story = {
  args: {
    activeId: "dashboard",
  },
};

/** Figma `Status=assets` */
export const AssetsActive: Story = {
  args: {
    activeId: "assets",
  },
};

/** Figma `Status=compass` */
export const CompassActive: Story = {
  args: {
    activeId: "compass",
  },
};

/** Figma `Status=contents studio` */
export const ContentsStudioActive: Story = {
  args: {
    activeId: "contents-studio",
  },
};

/** Figma `Status=disabled` — 전체 비활성화, 활성 하이라이트 없이 모든 항목이 회색으로 고정 렌더링 */
export const DisabledState: Story = {
  args: {
    activeId: "assets",
    disabled: true,
  },
};

export const ClickInteraction: Story = {
  args: {
    activeId: "assets",
  },
  render: (args) => (
    <ControlledFloatingMenu
      initialActiveId="assets"
      onActiveChange={args.onActiveChange}
    />
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const assetsTab = canvas.getByRole("tab", { name: "Assets" });
    const compassTab = canvas.getByRole("tab", { name: "Compass" });

    await expect(assetsTab).toHaveAttribute("aria-selected", "true");
    await expect(compassTab).toHaveAttribute("aria-selected", "false");

    await userEvent.click(compassTab);

    await expect(compassTab).toHaveAttribute("aria-selected", "true");
    await expect(assetsTab).toHaveAttribute("aria-selected", "false");
    await expect(args.onActiveChange).toHaveBeenCalledWith("compass");
  },
};

export const KeyboardNavigation: Story = {
  args: {
    activeId: "dashboard",
  },
  render: (args) => (
    <ControlledFloatingMenu
      initialActiveId="dashboard"
      onActiveChange={args.onActiveChange}
    />
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dashboardTab = canvas.getByRole("tab", { name: "dashboard" });

    dashboardTab.focus();
    await expect(dashboardTab).toHaveFocus();
    await expect(dashboardTab).toHaveAttribute("tabindex", "0");

    await userEvent.keyboard("{ArrowRight}");

    const assetsTab = canvas.getByRole("tab", { name: "Assets" });
    await expect(assetsTab).toHaveAttribute("aria-selected", "true");
    await expect(assetsTab).toHaveFocus();
    await expect(args.onActiveChange).toHaveBeenCalledWith("assets");

    await userEvent.keyboard("{End}");

    const contentsStudioTab = canvas.getByRole("tab", {
      name: "Content Studio",
    });
    await expect(contentsStudioTab).toHaveAttribute("aria-selected", "true");
    await expect(args.onActiveChange).toHaveBeenCalledWith("contents-studio");
  },
};

export const DisabledInteraction: Story = {
  args: {
    activeId: "assets",
    disabled: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const assetsTab = canvas.getByRole("tab", { name: "Assets" });
    const compassTab = canvas.getByRole("tab", { name: "Compass" });

    await expect(assetsTab).toBeDisabled();
    await expect(compassTab).toBeDisabled();

    await userEvent.click(compassTab, { pointerEventsCheck: 0 });

    await expect(args.onActiveChange).not.toHaveBeenCalled();
  },
};
