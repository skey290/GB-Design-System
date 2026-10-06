import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputLink } from "./input-link";

describe("InputLink", () => {
  it("renders with the default Figma placeholder", () => {
    render(<InputLink />);

    expect(
      screen.getByPlaceholderText("https://gabrielle.ai"),
    ).toBeInTheDocument();
  });

  it("renders a custom placeholder", () => {
    render(<InputLink placeholder="https://example.com" />);

    expect(
      screen.getByPlaceholderText("https://example.com"),
    ).toBeInTheDocument();
  });

  it("updates its value when typed into (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<InputLink />);

    const input = screen.getByRole("textbox");
    await user.type(input, "https://gabrielle.ai/pricing");

    expect(input).toHaveValue("https://gabrielle.ai/pricing");
  });

  it("calls onValueChange with the next value when typed into", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InputLink onValueChange={onValueChange} />);

    await user.type(screen.getByRole("textbox"), "hi");

    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onValueChange).toHaveBeenLastCalledWith("hi");
  });

  it("respects value as a controlled value and does not update on its own", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <InputLink
        value="https://fixed.example"
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "x");

    expect(onValueChange).toHaveBeenCalled();
    expect(input).toHaveValue("https://fixed.example");
  });
});
