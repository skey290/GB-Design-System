import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { AssetGalleryCard } from "./asset-gallery-card";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8012-10389";

const meta = {
  title: "Assets/UI/AssetGalleryCard",
  component: AssetGalleryCard,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  decorators: [
    (Story) => (
      <div className="dark flex items-start justify-center bg-[var(--gb-background-default)] p-[var(--gb-spacing-4)]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    image: { control: "text" },
    alt: { control: "text" },
    date: { control: "text" },
  },
  args: {
    image: "/images/personas/self-default.jpg",
    alt: "Uploaded reference",
    date: "2025.05.17",
    onUpload: fn(),
    onOpenMenu: fn(),
  },
} satisfies Meta<typeof AssetGalleryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
