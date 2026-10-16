import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Checkbox, type CheckboxProps } from "./checkbox";
import { makeStatusSource } from "../../../.storybook/status-source";

/** A list matched 1:1 with the values of the Figma `Status` axis. */
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
    // Hide the duplicate controls since `status` drives them instead
    controls: { exclude: ["disabled", "defaultChecked", "indeterminate", "checked"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=76-8617",
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: { component: "박스 옆에 텍스트 라벨을 선택적으로 둘 수 있는 단일 boolean 선택. Status가 박스에 표시되는 내용을 정한다 — 아무것도 없음, part(일부만 선택된 그룹을 위한 indeterminate), check — 그리고 각각의 disabled 변형도 함께 가지므로, disabled된 체크박스도 체크 여부를 그대로 보여준다. Type은 활성 상태들의 시각적 톤을 정한다. 독립된 하나의 yes/no 옵션에 사용하고, 서로 배타적인 여러 옵션 중 하나를 고를 때는 라디오 그룹을 사용한다." },
      source: {
        transform: makeStatusSource("Checkbox", STATUS_PROPS),
      },
    },
  },
  // status changes the uncontrolled initial value (defaultChecked), so remount via key.
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
