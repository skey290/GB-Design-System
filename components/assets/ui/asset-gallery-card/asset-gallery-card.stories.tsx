import * as React from "react";
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
  type: "default" | "selectable" | "style card" | "empty";
  image: string;
  alt: string;
  date: string;
  title: string;
  description: string;
  isSelected: boolean;
  onUpload: (file: File) => void;
  onSelectMenuOption: (value: string) => void;
  onSelectedChange: (selected: boolean) => void;
}

function AssetGalleryCardPlayground({
  type,
  image,
  alt,
  date,
  title,
  description,
  isSelected,
  onUpload,
  onSelectMenuOption,
  onSelectedChange,
}: AssetGalleryCardPlaygroundProps) {
  const [selected, setSelected] = React.useState(isSelected);

  return (
    <AssetGalleryCard
      image={type === "empty" ? undefined : image}
      alt={alt}
      date={type === "default" ? date : undefined}
      onUpload={onUpload}
      menuOptions={type === "default" ? MENU_OPTIONS : undefined}
      onSelectMenuOption={onSelectMenuOption}
      title={type === "style card" ? title : undefined}
      description={type === "style card" ? description : undefined}
      isSelected={
        type === "selectable" || type === "style card" ? selected : undefined
      }
      onSelectedChange={(next) => {
        setSelected(next);
        onSelectedChange(next);
      }}
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
    docs: {
      description: {
        component:
          "AssetGalleryCard has no `type` prop — which of the four looks (empty/default/selectable/style card) renders is derived from which props are given. See docs/components/asset-gallery-card.md for the full prop reference.",
        story:
          "Canvas uses a demo-only local-state wrapper (plus a story-only `type` arg that doesn't exist on the component) so the checkbox toggles in isolation. The code below is what a real page writes for each look.",
      },
      source: {
        type: "code",
        code: `// Default filled card with a date and a "..." menu
<AssetGalleryCard
  image={asset.url}
  alt={asset.alt}
  date={asset.date}
  menuOptions={MENU_OPTIONS}
  onSelectMenuOption={(value) => handleMenuAction(value)}
/>

// Selectable card
<AssetGalleryCard
  image={asset.url}
  alt={asset.alt}
  isSelected={selected}
  onSelectedChange={setSelected}
/>`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark flex items-start justify-center bg-[var(--gb-background-default)] p-[var(--gb-spacing-4)]">
        <Story />
      </div>
    ),
  ],
  // isSelected seeds local toggle state on mount, so remount when the control changes it.
  render: (args) => (
    <AssetGalleryCardPlayground key={String(args.isSelected)} {...args} />
  ),
  argTypes: {
    type: {
      control: "select",
      options: ["default", "selectable", "style card", "empty"],
    },
    image: { control: "text" },
    alt: { control: "text" },
    date: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    isSelected: { control: "boolean" },
  },
  args: {
    type: "default",
    image: "/images/personas/self-default.jpg",
    alt: "Uploaded reference",
    date: "2025.05.17",
    title: "Deep Chroma",
    description: "Baroque-inspired chiaroscuro",
    isSelected: false,
    onUpload: fn(),
    onSelectMenuOption: fn(),
    onSelectedChange: fn(),
  },
} satisfies Meta<typeof AssetGalleryCardPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
