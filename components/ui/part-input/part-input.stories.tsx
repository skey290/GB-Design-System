import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { PartInput, type PartInputProps } from "./part-input";
import { makeStatusSource } from "../../../.storybook/status-source";

/** List matched 1:1 with the Figma `Status` axis values. */
type PartInputStatus = "default" | "filled" | "active" | "error" | "disabled";

const STATUS_PROPS: Record<PartInputStatus, Partial<PartInputProps>> = {
  default: {},
  filled: { defaultValue: "hello@example.com" },
  active: { className: "pseudo-hover pseudo-hover-all" },
  error: { isError: true },
  disabled: { disabled: true },
};

type StoryArgs = Omit<PartInputProps, "defaultValue" | "isError" | "disabled"> & {
  status: PartInputStatus;
};

const meta = {
  title: "UI/PartInput",
  component: PartInput,
  tags: ["autodocs"],
  parameters: {
    // `status` controls this instead, so hide the duplicate controls
    controls: { exclude: ["disabled", "defaultValue", "isError"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=520-3062",
    },
    docs: {
      // Verbatim text from Figma's description field
      description: { component: "보더, 패딩, placeholder, 선택적 trailing icon만 가진 순수 한 줄 입력 박스. 라벨, helper text, 에러 메시지는 없으며, 이를 base로 감싸는 상위 필드들(Input, Input search, Input time, Input phone)이 그 부분을 구성한다. 단독으로 배치하지 말고 이 상위 필드들 중 하나를 사용한다." },
      source: {
        transform: makeStatusSource("PartInput", STATUS_PROPS, {
          cssOnly: ["active"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <PartInput key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    placeholder: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `active` isn't a prop — it's a hover/focus CSS state, so hover over the canvas directly to see it",
    },
    showTrailingIcon: {
      control: "boolean",
      description:
        "Figma's default is true, but the code default is false (opt-in) to avoid affecting existing screens",
    },
    value: { control: false },
  },
  args: {
    placeholder: "Email or Username",
    status: "default",
    showTrailingIcon: false,
    onValueChange: fn(),
  },
  // Inside a parent field (Input, etc.) this is FILL with no width of its own — wrap it in the parent's inner width from Figma.
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
