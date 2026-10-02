import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("renders a nav with one button per visible page plus prev/next", () => {
    render(
      <Pagination totalPages={3} currentPage={1} onPageChange={() => {}} />,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "1페이지로 이동" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "2페이지로 이동" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "3페이지로 이동" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "이전 페이지" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다음 페이지" }),
    ).toBeInTheDocument();
  });

  it("marks the current page with aria-current='page'", () => {
    render(
      <Pagination totalPages={5} currentPage={2} onPageChange={() => {}} />,
    );

    const current = screen.getByRole("button", { name: "2페이지로 이동" });
    const other = screen.getByRole("button", { name: "1페이지로 이동" });

    expect(current).toHaveAttribute("aria-current", "page");
    expect(other).not.toHaveAttribute("aria-current");
  });

  it("disables the previous button on the first page", () => {
    render(
      <Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />,
    );

    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음 페이지" })).toBeEnabled();
  });

  it("disables the next button on the last page", () => {
    render(
      <Pagination totalPages={5} currentPage={5} onPageChange={() => {}} />,
    );

    expect(screen.getByRole("button", { name: "다음 페이지" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeEnabled();
  });

  it("calls onPageChange with the clicked page number", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination totalPages={5} currentPage={1} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "2페이지로 이동" }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with currentPage + 1 when next is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination totalPages={5} currentPage={2} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "다음 페이지" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("renders ellipsis instead of every page number when totalPages is large", () => {
    const { container } = render(
      <Pagination totalPages={20} currentPage={10} onPageChange={() => {}} />,
    );

    const ellipses = container.querySelectorAll(
      '[data-slot="pagination-ellipsis"]',
    );
    expect(ellipses.length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("button", { name: "10페이지로 이동" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "5페이지로 이동" }),
    ).not.toBeInTheDocument();
  });

  it("stacks items vertically when direction is 'vertical'", () => {
    render(
      <Pagination
        totalPages={3}
        currentPage={1}
        onPageChange={() => {}}
        direction="vertical"
      />,
    );

    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("flex-col");
  });

  it("stacks items horizontally by default", () => {
    render(
      <Pagination totalPages={3} currentPage={1} onPageChange={() => {}} />,
    );

    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("flex-row");
  });

  it("forwards additional props to the nav container", () => {
    render(
      <Pagination
        totalPages={3}
        currentPage={1}
        onPageChange={() => {}}
        data-testid="custom-pagination"
      />,
    );

    expect(screen.getByTestId("custom-pagination")).toBeInTheDocument();
  });

  describe("type='dot'", () => {
    it("renders one dot button per page, no ellipsis, no prev/next buttons", () => {
      render(
        <Pagination
          totalPages={5}
          currentPage={1}
          onPageChange={() => {}}
          type="dot"
        />,
      );

      for (let page = 1; page <= 5; page += 1) {
        expect(
          screen.getByRole("button", { name: `${page}페이지로 이동` }),
        ).toBeInTheDocument();
      }
      expect(
        screen.queryByRole("button", { name: "이전 페이지" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "다음 페이지" }),
      ).not.toBeInTheDocument();
    });

    it("does not truncate with ellipsis even when totalPages is large", () => {
      render(
        <Pagination
          totalPages={30}
          currentPage={15}
          onPageChange={() => {}}
          type="dot"
        />,
      );

      expect(
        screen.getByRole("button", { name: "1페이지로 이동" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "30페이지로 이동" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("...", { exact: false }),
      ).not.toBeInTheDocument();
    });

    it("marks the current page dot with aria-current='page'", () => {
      render(
        <Pagination
          totalPages={5}
          currentPage={3}
          onPageChange={() => {}}
          type="dot"
        />,
      );

      expect(
        screen.getByRole("button", { name: "3페이지로 이동" }),
      ).toHaveAttribute("aria-current", "page");
      expect(
        screen.getByRole("button", { name: "1페이지로 이동" }),
      ).not.toHaveAttribute("aria-current");
    });

    it("calls onPageChange with the clicked dot's page", async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <Pagination
          totalPages={5}
          currentPage={1}
          onPageChange={onPageChange}
          type="dot"
        />,
      );

      await user.click(screen.getByRole("button", { name: "4페이지로 이동" }));

      expect(onPageChange).toHaveBeenCalledTimes(1);
      expect(onPageChange).toHaveBeenCalledWith(4);
    });
  });
});
