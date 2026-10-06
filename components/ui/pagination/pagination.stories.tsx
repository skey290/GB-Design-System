import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { Pagination, type PaginationProps } from "./pagination";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3331-2811";

// `Pagination`은 완전 제어 컴포넌트라, Controls에서 totalPages/direction/type을
// 바꿔도 클릭으로 실제 페이지 이동을 확인할 수 있도록 내부 상태를 들고 있는다.
function ControlledPagination({
  currentPage,
  onPageChange,
  ...rest
}: PaginationProps) {
  const [page, setPage] = React.useState(currentPage);
  const prevTotalPages = React.useRef(rest.totalPages);

  React.useEffect(() => {
    if (prevTotalPages.current !== rest.totalPages) {
      setPage(1);
      prevTotalPages.current = rest.totalPages;
    }
  }, [rest.totalPages]);

  return (
    <Pagination
      {...rest}
      currentPage={page}
      onPageChange={(next) => {
        setPage(next);
        onPageChange(next);
      }}
    />
  );
}

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    direction: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    type: {
      control: "radio",
      options: ["number", "dot"],
    },
    totalPages: { control: "number" },
    siblingCount: { control: "number" },
  },
  args: {
    totalPages: 10,
    currentPage: 1,
    direction: "horizontal",
    type: "number",
    siblingCount: 1,
    onPageChange: () => {},
  },
  render: (args) => <ControlledPagination {...args} />,
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
