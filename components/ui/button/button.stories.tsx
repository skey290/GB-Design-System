import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button, type ButtonProps } from "./button";
import { makeStatusSource } from "../../../.storybook/status-source";
import { ICON_IDS, Icon, type IconId } from "@/lib/sprite-icon";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=73-3681";

/** A list matched 1:1 with the values of the Figma `Status` axis. */
type ButtonStatus = "default" | "disabled" | "active";

const ICON_ONLY_VARIANTS = ["icon", "icon-ghost", "icon-rounded"] as const;

const STATUS_PROPS: Record<ButtonStatus, { className?: string; disabled?: boolean }> = {
  default: {},
  active: { className: "pseudo-hover pseudo-hover-all" },
  disabled: { disabled: true },
};

interface StoryArgs {
  variant: ButtonProps["variant"];
  children?: string;
  icon?: IconId;
  "aria-label"?: string;
  status: ButtonStatus;
}

const meta = {
  title: "UI/Button",
  // `Button`'s props are a discriminated union keyed off `variant`; the flat
  // `StoryArgs` shape below can't satisfy that directly, so this cast hands
  // the actual prop construction to `render`, which resolves the union per
  // variant before handing props to `Button`.
  component: Button as unknown as ComponentType<StoryArgs>,
  tags: ["autodocs"],
  parameters: {
    // Hide the duplicate control since `status` drives it instead
    controls: { exclude: ["disabled"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: { component: "제출, 이동, 확인 같은 동작을 트리거하는 클릭 가능한 버튼. Type이 콘텐츠의 형태를 정한다 — default는 라벨, icon은 라벨 없는 아이콘 하나, google은 브랜드가 적용된 로그인 버튼을 렌더링한다 — Style은 색상 역할을 정한다. 지속되는 on/off 상태를 표현하는 용도가 아니며, 그 경우엔 Switch나 Toggle을 사용한다." },
      source: {
        transform: makeStatusSource("Button", STATUS_PROPS, {
          cssOnly: ["active"], childrenKey: "children",
        }),
      },
    },
  },
  render: ({ status, icon, children, "aria-label": ariaLabel, ...args }) => {
    const variant = args.variant ?? "primary";
    const isIconOnly = (ICON_ONLY_VARIANTS as readonly string[]).includes(
      variant,
    );
    const takesIcon = isIconOnly || !["ghost", "google"].includes(variant);
    const resolvedIcon =
      takesIcon && icon ? <Icon id={icon} /> : undefined;

    // `ButtonProps` is a discriminated union keyed off `variant` — construct
    // the per-variant shape dynamically from the flat Controls args, then
    // hand the result to `Button` as one cast (see the `component` cast above).
    const resolvedProps = {
      ...args,
      ...STATUS_PROPS[status],
      variant,
      icon: resolvedIcon,
      ...(isIconOnly
        ? { "aria-label": ariaLabel ?? "Icon", children: undefined }
        : { children }),
    } as ButtonProps;

    return <Button key={status} {...resolvedProps} />;
  },
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
      description:
        "icon/icon-ghost/icon-rounded에서는 버튼 전체 아이콘, 나머지 variant(google 제외)에서는 라벨 뒤 아이콘으로 렌더링됩니다 (link는 12px, 나머지는 16px).",
    },
    "aria-label": {
      control: "text",
      description: "icon/icon-ghost/icon-rounded에서만 쓰입니다 (필수).",
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
