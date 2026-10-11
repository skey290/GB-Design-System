import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { PartInput, type PartInputProps } from "./part-input";
import { makeStatusSource } from "../../../.storybook/status-source";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
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
    // `status`가 대신 제어하므로 중복 컨트롤을 숨긴다
    controls: { exclude: ["disabled", "defaultValue", "isError"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=520-3062",
    },
    docs: {
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
        "Figma `Status` 축. `active`는 prop이 아니라 hover·focus CSS 상태라 캔버스에서 직접 올려 보면 된다",
    },
    showTrailingIcon: {
      control: "boolean",
      description:
        "Figma 기본값은 true지만, 기존 화면 영향을 피해 코드 기본값은 false(opt-in)",
    },
    value: { control: false },
  },
  args: {
    placeholder: "Email or Username",
    status: "default",
    showTrailingIcon: false,
    onValueChange: fn(),
  },
  // 부모 필드(Input 등) 안에서는 FILL이라 폭이 없다 — Figma의 부모 내부 폭으로 감싼다.
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
