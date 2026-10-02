import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import {
  AssetHistoryDrawer,
  type AssetHistoryDrawerItem,
} from "./asset-history-drawer";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3365-461";

const workHistoryItems: AssetHistoryDrawerItem[] = [
  {
    label: "Edited",
    badge: "Data Scientist",
    timestamp: "Just now",
    onRestore: fn(),
  },
  {
    label: "Created",
    badge: "Data Scientist",
    timestamp: "20min ago",
    onRestore: fn(),
  },
  {
    label: "Deleted",
    badge: "Data Scientist",
    timestamp: "2days ago",
    onRestore: fn(),
  },
];

const selfArchiveItems: AssetHistoryDrawerItem[] = [
  { label: "Morning Jogger", selected: true, onRestore: fn(), onDelete: fn() },
  { label: "Workflow Sculptor", onRestore: fn(), onDelete: fn() },
  { label: "Sunday Baker", onRestore: fn(), onDelete: fn() },
  { label: "Vintage Curator", onRestore: fn(), onDelete: fn() },
  { label: "Brooklyn Observer", onRestore: fn(), onDelete: fn() },
];

const meta = {
  title: "UI/AssetHistoryDrawer",
  component: AssetHistoryDrawer,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 500 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof AssetHistoryDrawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WorkHistory: Story = {
  args: {
    title: "Work History",
    items: workHistoryItems,
  },
};

export const SelfArchive: Story = {
  args: {
    title: "Self Archive",
    items: selfArchiveItems,
  },
};

export const CloseInteraction: Story = {
  args: {
    title: "Work History",
    items: workHistoryItems,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));

    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const RestoreAndDeleteInteraction: Story = {
  args: {
    title: "Self Archive",
    items: selfArchiveItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const restoreButtons = canvas.getAllByRole("button", { name: "Restore" });
    const deleteButtons = canvas.getAllByRole("button", { name: "Delete" });

    await userEvent.click(restoreButtons[0]);
    await expect(selfArchiveItems[0].onRestore).toHaveBeenCalledTimes(1);

    await userEvent.click(deleteButtons[0]);
    await expect(selfArchiveItems[0].onDelete).toHaveBeenCalledTimes(1);
  },
};
