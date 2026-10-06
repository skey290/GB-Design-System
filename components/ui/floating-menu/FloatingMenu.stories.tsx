import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Home } from "lucide-react";
import { fn } from "storybook/test";

import { FloatingMenu, type FloatingMenuItem } from "./FloatingMenu";

const items: FloatingMenuItem[] = [
  { id: "dashboard", icon: Home },
  { id: "assets", label: "Assets" },
  { id: "compass", label: "Compass" },
  { id: "contents-studio", label: "Content Studio" },
];

// 완전 제어 컴포넌트라, Controls에서 activeId를 바꿔도 클릭/키보드로 실제 선택
// 이동을 확인할 수 있도록 내부 상태를 들고 있는다.
function ControlledFloatingMenu({
  activeId,
  onActiveChange,
  ...rest
}: Parameters<typeof FloatingMenu>[0]) {
  const [current, setCurrent] = React.useState(activeId);
  const prevActiveId = React.useRef(activeId);

  React.useEffect(() => {
    if (prevActiveId.current !== activeId) {
      setCurrent(activeId);
      prevActiveId.current = activeId;
    }
  }, [activeId]);

  return (
    <FloatingMenu
      {...rest}
      activeId={current}
      onActiveChange={(id) => {
        setCurrent(id);
        onActiveChange?.(id);
      }}
    />
  );
}

const meta = {
  title: "UI/FloatingMenu",
  component: FloatingMenu,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=601-467",
    },
  },
  argTypes: {
    activeId: {
      control: "select",
      options: items.map((item) => item.id),
    },
    disabled: { control: "boolean" },
  },
  args: {
    items,
    activeId: "assets",
    disabled: false,
    onActiveChange: fn(),
  },
  render: (args) => <ControlledFloatingMenu {...args} />,
} satisfies Meta<typeof FloatingMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
