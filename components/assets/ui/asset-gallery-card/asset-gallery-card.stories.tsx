import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { Eraser, Replace, Trash2 } from "lucide-react";

import {
  AssetGalleryCard,
  type AssetGalleryCardMenuOption,
} from "./asset-gallery-card";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8012-10389";

const MENU_OPTIONS: AssetGalleryCardMenuOption[] = [
  {
    value: "set-as-main-portrait",
    label: "Set as main Portrait",
    icon: Replace,
  },
  {
    value: "edit-profile-portrait",
    label: "Edit Profile Portrait",
    icon: Eraser,
  },
  {
    value: "delete-self-portrait",
    label: "Delete Self Portrait",
    icon: Trash2,
  },
];

interface AssetGalleryCardPlaygroundProps {
  type: "filled" | "empty";
  image: string;
  alt: string;
  date: string;
  onUpload: (file: File) => void;
  onSelectMenuOption: (value: string) => void;
}

function AssetGalleryCardPlayground({
  type,
  image,
  alt,
  date,
  onUpload,
  onSelectMenuOption,
}: AssetGalleryCardPlaygroundProps) {
  return (
    <AssetGalleryCard
      image={type === "filled" ? image : undefined}
      alt={alt}
      date={date}
      onUpload={onUpload}
      menuOptions={type === "filled" ? MENU_OPTIONS : undefined}
      onSelectMenuOption={onSelectMenuOption}
    />
  );
}

const meta = {
  title: "Assets/UI/AssetGalleryCard",
  component: AssetGalleryCardPlayground,
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
    type: { control: "select", options: ["filled", "empty"] },
    image: { control: "text" },
    alt: { control: "text" },
    date: { control: "text" },
  },
  args: {
    type: "filled",
    image: "/images/personas/self-default.jpg",
    alt: "Uploaded reference",
    date: "2025.05.17",
    onUpload: fn(),
    onSelectMenuOption: fn(),
  },
} satisfies Meta<typeof AssetGalleryCardPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
