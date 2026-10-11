import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Switch, type SwitchProps } from "./switch";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type SwitchStatus = "default" | "disabled";

const STATUS_PROPS: Record<SwitchStatus, Partial<SwitchProps>> = {
  default: {},
  disabled: { disabled: true },
};

type StoryArgs = Omit<SwitchProps, "disabled"> & {
  status: SwitchStatus;
};

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-10618",
    },
  },
  render: ({ status, ...args }) => (
    <Switch {...args} {...STATUS_PROPS[status]} />
  ),
  args: {
    label: "switch",
    labelPosition: "right",
    size: "default",
    defaultChecked: false,
    status: "default",
    onCheckedChange: fn(),
  },
  argTypes: {
    labelPosition: {
      control: "radio",
      options: ["left", "right"],
      description: "라벨이 트랙 기준 어느 쪽에 오는지 (Figma `Type` variant)",
    },
    size: {
      control: "radio",
      options: ["default", "small"],
      description: "스위치 크기 (Figma `Size` variant)",
    },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. `On`(켜짐)·`Type`(라벨 위치)·`Size`와는 별개 축이다",
    },
    defaultChecked: { control: "boolean" },
    label: { control: "text" },
    showLabel: {
      control: "boolean",
      description:
        "Figma `label` 프로퍼티. false면 라벨이 sr-only가 되어 화면에서 사라지고 접근성 이름으로만 남습니다",
    },
    checked: { control: false },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
