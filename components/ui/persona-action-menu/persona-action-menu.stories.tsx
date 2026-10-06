import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { Archive, Eraser, FileText, Goal } from "lucide-react";

import { PersonaActionMenu, type PersonaActionMenuAction } from "./persona-action-menu";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=5314-6902";

// Figma 목업(node 5314:6902 / 5314:9667) 확정 4개 액션
const DEFAULT_ACTIONS: PersonaActionMenuAction[] = [
  {
    label: "Create a Post",
    icon: <FileText className="size-[var(--spacing-4)]" aria-hidden="true" />,
    onSelect: fn(),
  },
  {
    label: "Edit Asset Image",
    icon: <Eraser className="size-[var(--spacing-4)]" aria-hidden="true" />,
    onSelect: fn(),
  },
  {
    label: "Move to Archive",
    icon: <Archive className="size-[var(--spacing-4)]" aria-hidden="true" />,
    onSelect: fn(),
  },
  {
    label: "Edit Goal",
    icon: <Goal className="size-[var(--spacing-4)]" aria-hidden="true" />,
    onSelect: fn(),
  },
];

const meta = {
  title: "UI/PersonaActionMenu",
  component: PersonaActionMenu,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    style: {
      control: "radio",
      options: ["self-right", "self-left"],
    },
    label: { control: "text" },
  },
  args: {
    label: "Data Scientist",
    style: "self-right",
    actions: DEFAULT_ACTIONS,
  },
} satisfies Meta<typeof PersonaActionMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
