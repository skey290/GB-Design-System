import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { Pagination, type PaginationProps } from "./pagination";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3331-2811";

// `Pagination` is a fully controlled component, so this story holds its own
// state to let clicks actually move the page even when Controls changes
// totalPages/direction/type.
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
    docs: {
      description: {
        // Verbatim text from Figma's description field
        component:
          "Page navigation for a paged list. Type switches between a numbered list with previous/next controls and a compact row of dots, and Direction lays it out horizontally or vertically. Long page counts collapse to ellipses around the current page.",
        story:
          "Canvas uses a demo-only local-state wrapper so clicking a page works in isolation. The code below is what a real page writes — see docs/components/pagination.md.",
      },
      source: {
        type: "code",
        code: `<Pagination
  totalPages={10}
  currentPage={page}
  onPageChange={setPage}
/>`,
      },
    },
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
