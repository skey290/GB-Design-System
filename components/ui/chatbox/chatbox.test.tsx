import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Chatbox } from "./chatbox";

describe("Chatbox", () => {
  it("renders a textarea with the default placeholder", () => {
    render(<Chatbox />);

    expect(
      screen.getByPlaceholderText("Please share your ideas."),
    ).toBeInTheDocument();
  });

  it("renders nothing in the slot by default", () => {
    render(<Chatbox />);

    expect(screen.queryAllByRole("img")).toHaveLength(0);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("renders slot children above the textarea", () => {
    render(
      <Chatbox>
        <span data-testid="slot">slot content</span>
      </Chatbox>,
    );

    const slot = screen.getByTestId("slot");
    const textarea = screen.getByPlaceholderText("Please share your ideas.");

    expect(slot).toBeInTheDocument();
    expect(
      slot.compareDocumentPosition(textarea) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("updates its value when typed into (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Chatbox />);

    const textarea = screen.getByPlaceholderText("Please share your ideas.");
    await user.type(textarea, "hello");

    expect(textarea).toHaveValue("hello");
  });

  it("calls onValueChange with the next value when typed into", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Chatbox onValueChange={onValueChange} />);

    await user.type(
      screen.getByPlaceholderText("Please share your ideas."),
      "hi",
    );

    expect(onValueChange).toHaveBeenLastCalledWith("hi");
  });

  it("opens the native file picker when the attach button is clicked", async () => {
    const user = userEvent.setup();
    render(<Chatbox />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");

    await user.click(screen.getByRole("button", { name: "첨부" }));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("calls onAttachFiles with the selected files", async () => {
    const user = userEvent.setup();
    const onAttachFiles = vi.fn();
    render(<Chatbox onAttachFiles={onAttachFiles} />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["dummy"], "photo.png", { type: "image/png" });

    await user.upload(fileInput, file);

    expect(onAttachFiles).toHaveBeenCalledTimes(1);
    expect(onAttachFiles.mock.calls[0][0]).toHaveLength(1);
    expect(onAttachFiles.mock.calls[0][0][0].name).toBe("photo.png");
  });

  it("forwards accept and multiple to the file input", () => {
    render(<Chatbox accept="image/*" multiple />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    expect(fileInput).toHaveAttribute("accept", "image/*");
    expect(fileInput).toHaveAttribute("multiple");
  });

  it("calls onSend when the send button is clicked", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Chatbox onSend={onSend} />);

    await user.click(screen.getByRole("button", { name: "전송" }));

    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it("clears the input value after the send button is clicked", async () => {
    const user = userEvent.setup();
    render(<Chatbox />);

    const textarea = screen.getByPlaceholderText("Please share your ideas.");
    await user.type(textarea, "hello");
    expect(textarea).toHaveValue("hello");

    await user.click(screen.getByRole("button", { name: "전송" }));

    expect(textarea).toHaveValue("");
  });

  it("disables the textarea and attach/send buttons when disabled", () => {
    render(<Chatbox disabled />);

    expect(
      screen.getByPlaceholderText("Please share your ideas."),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "첨부" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "전송" })).toBeDisabled();
  });

  it("does not dim the root with opacity when disabled", () => {
    const { container } = render(<Chatbox disabled />);

    const root = container.firstElementChild as HTMLElement;

    expect(root.className).not.toMatch(/opacity-/);
    expect(root.className).toMatch(/pointer-events-none/);
  });
});
