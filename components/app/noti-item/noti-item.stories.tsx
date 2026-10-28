import type { Meta, StoryObj } from "@storybook/nextjs";

import { NotiItem } from "./noti-item";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8163-93036";

const meta = {
  title: "App/NotiItem",
  component: NotiItem,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    // Verbatim text from the Figma component's description field
    docs: {
      description: {
        component:
          "A single row of the notification dropdown list — a megaphone icon, a label, and the unread dot. Implemented as NotiItem in components/app/noti-item.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark w-[300px] bg-[var(--gb-background-overlay)] p-[var(--gb-spacing-1)]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: "text" },
    unread: { control: "boolean" },
  },
  args: {
    label: "New comment on your asset",
    unread: true,
  },
} satisfies Meta<typeof NotiItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
