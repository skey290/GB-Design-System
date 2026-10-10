import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputSearch } from "./input-search";

describe("InputSearch", () => {
  it("renders with the default 'Search placeholder' placeholder", () => {
    render(<InputSearch />);

    expect(
      screen.getByPlaceholderText("Search placeholder"),
    ).toBeInTheDocument();
  });

  it("allows overriding the placeholder", () => {
    render(<InputSearch placeholder="Find a component" />);

    expect(screen.getByPlaceholderText("Find a component")).toBeInTheDocument();
  });

  it("updates its value when typed into (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<InputSearch />);

    const input = screen.getByPlaceholderText("Search placeholder");
    await user.type(input, "hello");

    expect(input).toHaveValue("hello");
  });

  it("calls onValueChange with the next value when typed into", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InputSearch onValueChange={onValueChange} />);

    await user.type(screen.getByPlaceholderText("Search placeholder"), "hi");

    expect(onValueChange).toHaveBeenLastCalledWith("hi");
  });

  it("is disabled when disabled is set", () => {
    render(<InputSearch disabled />);

    expect(screen.getByPlaceholderText("Search placeholder")).toBeDisabled();
  });
});
