import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Checkbox, type CheckboxProps } from "./checkbox";
import { makeStatusSource } from "../../../.storybook/status-source";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type CheckboxStatus =
  | "default"
  | "part"
  | "checked"
  | "disabled"
  | "disabled-checked"
  | "disabled-part";

const STATUS_PROPS: Record<CheckboxStatus, Partial<CheckboxProps>> = {
  default: {},
  checked: { defaultChecked: true },
  part: { indeterminate: true },
  disabled: { disabled: true },
  "disabled-checked": { disabled: true, defaultChecked: true },
  "disabled-part": { disabled: true, indeterminate: true },
};

type StoryArgs = Omit<
  CheckboxProps,
  "defaultChecked" | "indeterminate" | "disabled"
> & {
  status: CheckboxStatus;
};

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    // `status`가 대신 제어하므로 중복 컨트롤을 숨긴다
    controls: { exclude: ["disabled", "defaultChecked", "indeterminate", "checked"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-8617",
    },
    docs: {
      // Figma 컴포넌트 description 필드 원문
      description: { component: "A single boolean choice, optionally with a text label beside the box. Status sets what the box shows — nothing, part (indeterminate, for a partially selected group), or a check — and carries the disabled variants of each, so a disabled checkbox still shows whether it was checked. Type sets the visual tone of the enabled states. Use for one standalone yes/no option — for choosing one out of many mutually exclusive options, use a radio group instead." },
      source: {
        transform: makeStatusSource("Checkbox", STATUS_PROPS),
      },
    },
  },
  // status가 비제어 초기값(defaultChecked)을 바꾸므로 key로 다시 마운트시킨다.
  render: ({ status, ...args }) => (
    <Checkbox key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  args: {
    status: "default",
    label: "Accept terms and conditions",
    showLabel: true,
    variant: "default",
    onCheckedChange: fn(),
  },
  argTypes: {
    status: {
      control: "select",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. 체크·대시 표시와 비활성을 함께 담으며, disabled 배색은 Type과 무관하게 하나다",
    },
    variant: {
      control: "radio",
      options: ["default", "mute"],
      description: "Figma `Type` 축. default/part/checked 모두와 조합된다",
    },
    label: { control: "text" },
    showLabel: {
      control: "boolean",
      description:
        "Figma `label` 프로퍼티. false면 라벨이 sr-only가 되어 화면에서 사라지고 접근성 이름으로만 남는다",
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
