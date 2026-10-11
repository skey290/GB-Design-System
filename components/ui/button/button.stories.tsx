import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button, type ButtonProps } from "./button";
import { makeStatusSource } from "../../../.storybook/status-source";
import { ICON_IDS } from "@/lib/sprite-icon";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=73-3681";

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type ButtonStatus = "default" | "disabled" | "active";

const STATUS_PROPS: Record<ButtonStatus, Partial<ButtonProps>> = {
  default: {},
  active: { className: "pseudo-hover pseudo-hover-all" },
  disabled: { disabled: true },
};

type StoryArgs = Omit<ButtonProps, "disabled"> & {
  status: ButtonStatus;
};

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    // `status`가 대신 제어하므로 중복 컨트롤을 숨긴다
    controls: { exclude: ["disabled"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Figma 컴포넌트 description 필드 원문
      description: { component: "A clickable button used to trigger an action such as submit, navigate, or confirm. Type chooses the shape of the content — default renders a label, icon renders a single icon with no label, google renders the branded sign-in button — and Style sets the colour role. Not for representing a persistent on/off state — use Switch or Toggle instead." },
      source: {
        transform: makeStatusSource("Button", STATUS_PROPS, {
          cssOnly: ["active"], childrenKey: "children",
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <Button key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "mute",
        "outline",
        "link",
        "ghost",
        "icon",
        "icon-ghost",
        "icon-rounded",
        "google",
      ],
    },
    icon: {
      control: "select",
      options: ICON_IDS,
      description: "icon/icon-ghost/icon-rounded variant에서만 렌더링됩니다.",
    },
    iconAfter: {
      control: "select",
      options: ICON_IDS,
      description:
        "라벨 뒤 아이콘. primary/mute/outline/link에서만 렌더링됩니다 (link는 12px, 나머지는 16px).",
    },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. `active`는 hover·press CSS 상태라 캔버스에서 직접 올려 보면 된다",
    },
    children: {
      control: "text",
      description:
        '아이콘 전용 variant에서는 렌더링되지 않습니다. google variant는 비워두면 "Continue with Google"이 들어갑니다.',
    },
  },
  args: {
    variant: "primary",
    children: "Button",
    status: "default",
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
