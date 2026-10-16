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
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
    docs: {
      // Verbatim text from the Figma component's description field
      description: { component: "상태 표시줄과 실제 진행률만큼 채워지는 바로 구성된 라벨 달린 진행 표시기. Status가 라벨을 in progress/completed로 전환한다. 소요 시간을 알 수 없을 땐 Spinner를, 로딩될 콘텐츠의 형태를 이미 알고 있을 땐 Skeleton을 사용한다." },
      source: { transform: makeStatusSource("Progress", STATUS_PROPS) },
    },
  },
  render: ({ status, ...args }) => (
    <Progress {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. Decided by `value >= max`, not a prop — choosing `completed` uses a value filled up to `max` instead of the `value` slider below",
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
  },
  args: {
    status: "in progress",
    value: 10,
    label: "Loading image..",
    completedLabel: "Completed",
  },
  decorators: [
    (Story) => (
      <div className="w-[226px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
