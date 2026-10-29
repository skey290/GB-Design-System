import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import {
  MostHooked,
  type MostHookedItem,
  type SelectOption,
} from "./MostHooked";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8507-71028";

const JOB_TITLE_OPTIONS: SelectOption[] = [
  { value: "data-scientist", label: "Data Scientist" },
  { value: "product-manager", label: "Product Manager" },
  { value: "ux-designer", label: "UX Designer" },
];

const TOP_PERFORMERS: MostHookedItem[] = [
  {
    handle: "@cloedatascientist",
    description: "Discover the latest insights and updates here.",
    likes: 74,
    comments: 51,
  },
  {
    handle: "@cloedatascientist",
    description: "Discover the latest insights and updates here.",
    likes: 61,
    comments: 10,
  },
  {
    handle: "@cloedatascientist",
    description: "Discover the latest insights and updates here.",
    likes: 52,
    comments: 24,
  },
  {
    handle: "@cloedatascientist",
    description: "Discover the latest insights and updates here.",
    likes: 45,
    comments: 2,
  },
  {
    handle: "@cloedatascientist",
    description: "Discover the latest insights and updates here.",
    likes: 25,
    comments: 3,
  },
];

const meta = {
  title: "ContentStudio/UI/MostHooked",
  component: MostHooked,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    open: { control: "boolean" },
    disabled: { control: "boolean" },
    bio: { control: "text" },
    avatarSrc: { control: "text" },
    avatarAlt: { control: "text" },
    placeholder: { control: "text" },
    goalLabel: { control: "text" },
    toggleLabel: { control: "text" },
    items: { control: "object" },
    options: { control: false },
    value: { control: false },
    children: { control: false },
  },
  args: {
    open: true,
    disabled: false,
    options: JOB_TITLE_OPTIONS,
    defaultValue: "data-scientist",
    items: TOP_PERFORMERS,
    onValueChange: fn(),
    onGoalClick: fn(),
    onToggleOpen: fn(),
  },
} satisfies Meta<typeof MostHooked>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Goal" }));
    expect(args.onGoalClick).toHaveBeenCalledTimes(1);

    expect(canvas.getByText("Top Performers")).toBeInTheDocument();
    expect(canvas.getByText("#1")).toBeInTheDocument();
  },
};
