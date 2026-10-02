import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search } from "lucide-react";

import { Input } from "./input";

describe("Input", () => {
  it("renders with a placeholder", () => {
    render(<Input placeholder="Email or Username" />);

    expect(
      screen.getByPlaceholderText("Email or Username"),
    ).toBeInTheDocument();
  });

  it("updates its value when typed into (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="field" />);

    const input = screen.getByPlaceholderText("field");
    await user.type(input, "hello");

    expect(input).toHaveValue("hello");
  });

  it("calls onValueChange with the next value when typed into", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Input placeholder="field" onValueChange={onValueChange} />);

    await user.type(screen.getByPlaceholderText("field"), "hi");

    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onValueChange).toHaveBeenLastCalledWith("hi");
  });

  it("respects value as a controlled value and does not update on its own", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Input placeholder="field" value="fixed" onValueChange={onValueChange} />,
    );

    const input = screen.getByPlaceholderText("field");
    await user.type(input, "x");

    expect(onValueChange).toHaveBeenCalledWith("fixedx");
    expect(input).toHaveValue("fixed");
  });

  it("is disabled and does not accept input when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Input placeholder="field" disabled onValueChange={onValueChange} />,
    );

    const input = screen.getByPlaceholderText("field");
    expect(input).toBeDisabled();

    await user.type(input, "x");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("");
  });

  it("passes through native input attributes such as type and maxLength", () => {
    render(<Input placeholder="field" type="email" maxLength={5} />);

    const input = screen.getByPlaceholderText("field");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("maxlength", "5");
  });

  it("places the caret at the start when clicking into an empty field", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="field" />);

    const input = screen.getByPlaceholderText<HTMLInputElement>("field");
    await user.click(input);

    expect(input).toHaveFocus();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(0);
  });

  it("still focuses normally when clicking a field that already has a value", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="field" defaultValue="hello" />);

    const input = screen.getByPlaceholderText<HTMLInputElement>("field");
    await user.click(input);

    expect(input).toHaveFocus();
  });

  it("does not render a trailing icon by default", () => {
    render(<Input placeholder="field" />);

    expect(
      screen.queryByPlaceholderText("field")?.parentElement?.querySelector("svg"),
    ).not.toBeInTheDocument();
  });

  it("renders the default trailing icon when trailingIcon is true", () => {
    render(<Input placeholder="field" trailingIcon />);

    const icon = screen
      .getByPlaceholderText("field")
      .parentElement?.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("swaps the trailing icon when a custom icon is passed", () => {
    render(<Input placeholder="field" trailingIcon icon={Search} />);

    const icon = screen
      .getByPlaceholderText("field")
      .parentElement?.querySelector("svg.lucide-search");
    expect(icon).toBeInTheDocument();
  });
});
