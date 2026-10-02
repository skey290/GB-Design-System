import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, userEvent, within } from "storybook/test";

import { Pagination } from "./pagination";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3331-2811";

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
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `Direction=Horizontal`, 현재 페이지 = 1 (총 5페이지, 생략 없음) */
export const Horizontal: Story = {
  args: {
    totalPages: 5,
    currentPage: 1,
    direction: "horizontal",
    onPageChange: () => {},
  },
};

/** 총 페이지가 많아 앞/뒤 모두 생략(...)이 표시되는 경우 */
export const HorizontalWithEllipsis: Story = {
  name: "Horizontal (With Ellipsis)",
  args: {
    totalPages: 20,
    currentPage: 10,
    direction: "horizontal",
    onPageChange: () => {},
  },
};

/** 첫 페이지 — 이전 버튼이 비활성화됨 (Figma에 없는 경계 상태, 사용자 확인 후 추가) */
export const FirstPage: Story = {
  args: {
    totalPages: 10,
    currentPage: 1,
    direction: "horizontal",
    onPageChange: () => {},
  },
};

/** 마지막 페이지 — 다음 버튼이 비활성화됨 */
export const LastPage: Story = {
  args: {
    totalPages: 10,
    currentPage: 10,
    direction: "horizontal",
    onPageChange: () => {},
  },
};

/** Figma `Direction=Vertical` */
export const Vertical: Story = {
  args: {
    totalPages: 5,
    currentPage: 1,
    direction: "vertical",
    onPageChange: () => {},
  },
};

/** Figma `Direction=Horizontal, Type=dot` — 점 인디케이터, 화살표 없음 */
export const Dot: Story = {
  args: {
    totalPages: 5,
    currentPage: 1,
    direction: "horizontal",
    type: "dot",
    onPageChange: () => {},
  },
};

/**
 * dot 타입은 Figma에 생략(`...`) 표현이 없어 페이지가 많아도 전부 렌더합니다
 * (2026-09-27 사용자 확정).
 */
export const DotManyPages: Story = {
  name: "Dot (Many Pages, No Truncation)",
  args: {
    totalPages: 15,
    currentPage: 8,
    direction: "horizontal",
    type: "dot",
    onPageChange: () => {},
  },
};

/**
 * `Pagination`은 완전 제어 컴포넌트라 클릭 시 페이지 변화를 직접 검증하려면
 * 상위에서 `currentPage` state를 들고 있어야 합니다.
 */
function ControlledPaginationDemo() {
  const [page, setPage] = React.useState(1);

  return (
    <Pagination
      totalPages={10}
      currentPage={page}
      onPageChange={setPage}
      direction="horizontal"
    />
  );
}

/** dot 클릭 시 `onPageChange`로 실제 페이지 이동에 연동됩니다 (2026-09-27 사용자 확정). */
function ControlledDotPaginationDemo() {
  const [page, setPage] = React.useState(1);

  return (
    <Pagination
      totalPages={5}
      currentPage={page}
      onPageChange={setPage}
      direction="horizontal"
      type="dot"
    />
  );
}

export const Interaction: Story = {
  args: {
    totalPages: 10,
    currentPage: 1,
    direction: "horizontal",
    onPageChange: () => {},
  },
  render: () => <ControlledPaginationDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstPage = canvas.getByRole("button", { name: "1페이지로 이동" });

    await expect(firstPage).toHaveAttribute("aria-current", "page");

    const nextButton = canvas.getByRole("button", { name: "다음 페이지" });
    await userEvent.click(nextButton);

    const secondPage = canvas.getByRole("button", { name: "2페이지로 이동" });
    await expect(secondPage).toHaveAttribute("aria-current", "page");
    await expect(firstPage).not.toHaveAttribute("aria-current", "page");
  },
};

/** dot 클릭이 실제로 `onPageChange`를 호출해 페이지를 이동시키는지 검증 */
export const DotInteraction: Story = {
  args: {
    totalPages: 5,
    currentPage: 1,
    direction: "horizontal",
    type: "dot",
    onPageChange: () => {},
  },
  render: () => <ControlledDotPaginationDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstDot = canvas.getByRole("button", { name: "1페이지로 이동" });

    await expect(firstDot).toHaveAttribute("aria-current", "page");

    const thirdDot = canvas.getByRole("button", { name: "3페이지로 이동" });
    await userEvent.click(thirdDot);

    await expect(thirdDot).toHaveAttribute("aria-current", "page");
    await expect(firstDot).not.toHaveAttribute("aria-current", "page");
  },
};
