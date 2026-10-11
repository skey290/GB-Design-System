import type { Meta, StoryObj } from "@storybook/react";

import { Progress, type ProgressProps } from "./progress";
import { makeStatusSource } from "../../../.storybook/status-source";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3539-7160";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type ProgressStatus = "in progress" | "completed";

/** 상태는 prop이 아니라 `value >= max`로 결정되므로, `completed`는 값을 끝까지 채운다. */
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
    docs: { source: { transform: makeStatusSource("Progress", STATUS_PROPS) } },
  },
  render: ({ status, ...args }) => (
    <Progress {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. prop이 아니라 `value >= max`로 결정된다 — `completed`를 고르면 아래 `value` 슬라이더 대신 `max`까지 채운 값이 쓰인다",
    },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
    label: {
      control: "text",
      description: "진행 중일 때 바 위에 표시할 문구",
    },
    completedLabel: {
      control: "text",
      description: "value가 max에 도달하면 이 문구로 바뀝니다",
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
