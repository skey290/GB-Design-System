import type { Meta, StoryObj } from "@storybook/react";

import { Progress, type ProgressProps } from "./progress";
import { makeStatusSource } from "../../../.storybook/status-source";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3539-7160";

/** List mapped 1:1 to the values of the Figma `Status` axis. */
type ProgressStatus = "in progress" | "completed";

/** Status is decided by `value >= max`, not a prop, so `completed` fills the value all the way. */
const STATUS_PROPS: Record<ProgressStatus, Partial<ProgressProps>> = {
  "in progress": {},
  completed: { value: 100 },
};

type StoryArgs = ProgressProps & { status: ProgressStatus };

const meta = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    design: { type: "figma", url: FIGMA_URL },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A labelled progress indicator — a status line above a bar that fills with real progress. Status switches the label between in progress and completed. Use Spinner when the duration is unknown, and Skeleton when the shape of the loading content is already known.",
      },
      source: { transform: makeStatusSource("Progress", STATUS_PROPS) },
    },
  },
  render: ({ status, ...args }) => (
    <Progress
      {...args}
      {...(status === "completed"
        ? { value: args.max ?? 100 }
        : STATUS_PROPS[status])}
    />
  ),
  argTypes: {
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. Decided by `value >= max`, not a prop — `completed` fills the value up to `max` and ignores the `value` slider below, and `in progress` flips to the completed label by itself once the slider reaches `max`",
    },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
    label: {
      control: "text",
      description: "Text to show above the bar while in progress",
    },
    completedLabel: {
      control: "text",
      description: "Switches to this text once value reaches max",
    },
    showText: {
      control: "boolean",
      description: "Show the status label above the bar (Figma `Text`)",
    },
    shouldFitContainer: {
      control: "boolean",
      description: "Fill the parent width instead of the fixed 226px. Default true",
    },
  },
  args: {
    status: "in progress",
    value: 10,
    label: "Loading image..",
    completedLabel: "Completed",
    showText: true,
    shouldFitContainer: true,
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
