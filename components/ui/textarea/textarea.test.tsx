import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders with a label", () => {
    render(<Textarea label="Tell me about your interest." />);

    expect(
      screen.getByLabelText("Tell me about your interest."),
    ).toBeInTheDocument();
  });

  it("renders without a label when none is provided", () => {
    render(<Textarea placeholder="no label here" />);

    expect(screen.getByPlaceholderText("no label here")).toBeInTheDocument();
  });

  it("updates its value when typed into (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Textarea label="field" />);

    const textarea = screen.getByLabelText("field");
    await user.type(textarea, "hello");

    expect(textarea).toHaveValue("hello");
  });

  it("calls onValueChange with the next value when typed into", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Textarea label="field" onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText("field"), "hi");

    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onValueChange).toHaveBeenLastCalledWith("hi");
  });

  it("respects value as a controlled value and does not update on its own", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Textarea label="field" value="fixed" onValueChange={onValueChange} />,
    );

    const textarea = screen.getByLabelText("field");
    await user.type(textarea, "x");

    expect(onValueChange).toHaveBeenCalledWith("fixedx");
    // controlled: value stays "fixed" because the `value` prop was not updated
    expect(textarea).toHaveValue("fixed");
  });

  it("does not render a counter when maxLength is not set", () => {
    render(<Textarea label="field" />);

    expect(screen.queryByText(/characters left/)).not.toBeInTheDocument();
  });

  it("renders and updates a character counter when maxLength is set", async () => {
    const user = userEvent.setup();
    render(<Textarea label="field" maxLength={10} />);

    expect(screen.getByText("10 characters left")).toBeInTheDocument();

    await user.type(screen.getByLabelText("field"), "hi");

    expect(screen.getByText("8 characters left")).toBeInTheDocument();
  });

  it("renders the Figma resize handle instead of the native grip", () => {
    const { container } = render(<Textarea label="field" />);

    const textarea = screen.getByLabelText("field");
    expect(textarea.className).toContain("resize-none");

    const handle = container.querySelector(
      '[data-slot="textarea-resize-handle"]',
    );
    expect(handle).not.toBeNull();
    expect(handle?.querySelector("use")?.getAttribute("href")).toBe(
      "/icons.svg#handle-icon",
    );
  });

  it("grows the textarea when the handle is dragged down", () => {
    const { container } = render(<Textarea label="field" />);

    const textarea = screen.getByLabelText("field") as HTMLTextAreaElement;
    Object.defineProperty(textarea, "offsetHeight", {
      configurable: true,
      value: 80,
    });

    const handle = container.querySelector(
      '[data-slot="textarea-resize-handle"]',
    ) as HTMLElement;

    fireEvent.pointerDown(handle, { button: 0, clientY: 100 });
    fireEvent.pointerMove(window, { clientY: 140 });
    fireEvent.pointerUp(window);

    expect(textarea.style.height).toBe("120px");
  });
});
