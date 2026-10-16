import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tooltip } from "./tooltip";

beforeAll(() => {
  // Radix Tooltip's Arrow (useSize) uses ResizeObserver for its positioning calculation,
  // which jsdom lacks — same polyfill pattern as the combobox/select/input-phone tests
  if (!("ResizeObserver" in window)) {
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = vi
      .fn()
      .mockImplementation(function ResizeObserverMock() {
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        };
      });
  }
});

describe("Tooltip", () => {
  it("does not render its content until the trigger is hovered", () => {
    render(
      <Tooltip title="Title" description="Tool tip text" delayDuration={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    expect(screen.queryByText("Title")).not.toBeInTheDocument();
  });

  it("shows title and description on hover", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip title="Title" description="Tool tip text" delayDuration={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument();
    });
    expect(screen.getByText("Tool tip text")).toBeInTheDocument();
  });

  it("renders only the description when title is omitted", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip description="Tool tip text" delayDuration={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    await waitFor(() => {
      expect(screen.getByText("Tool tip text")).toBeInTheDocument();
    });
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("defaults to the default (dark) variant", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip title="Title" delayDuration={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    const content = await waitFor(() => screen.getByRole("tooltip"));
    expect(content).toHaveAttribute("data-variant", "default");
  });

  it("applies the reversed variant", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip title="Title" variant="reversed" delayDuration={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    const content = await waitFor(() => screen.getByRole("tooltip"));
    expect(content).toHaveAttribute("data-variant", "reversed");
  });

  it("accepts a custom collisionPadding without breaking rendering", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip title="Title" delayDuration={0} collisionPadding={{ top: 80 }}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument();
    });
  });

  it("renders a close button only when onClose is provided, and calls it on click", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Tooltip title="Title" onClose={onClose} delayDuration={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    const closeButton = await waitFor(() =>
      screen.getByRole("button", { name: "Close tooltip" }),
    );
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render a close button when onClose is not provided", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip title="Title" delayDuration={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: "Close tooltip" }),
    ).not.toBeInTheDocument();
  });
});
