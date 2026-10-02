import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputBasic } from "./input-basic";

describe("InputBasic", () => {
  it("renders the Time to post field with its Figma label and placeholder by default", () => {
    render(<InputBasic />);

    const input = screen.getByLabelText("Time to post");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
    expect(input).toHaveAttribute("placeholder", "11:00");

    const amButton = screen.getByRole("radio", { name: "AM" });
    const pmButton = screen.getByRole("radio", { name: "PM" });
    expect(amButton).toHaveAttribute("aria-checked", "true");
    expect(pmButton).toHaveAttribute("aria-checked", "false");
  });

  it("renders a custom label", () => {
    render(<InputBasic label="Custom Time" />);

    expect(screen.getByLabelText("Custom Time")).toBeInTheDocument();
  });

  it("switches from its placeholder to the __:__ mask on focus", async () => {
    const user = userEvent.setup();
    render(<InputBasic />);

    const input = screen.getByLabelText("Time to post");
    expect(input).toHaveValue("");

    await user.click(input);
    expect(input).toHaveValue("__:__");

    await user.tab();
    expect(input).toHaveValue("");
  });

  it("fills the mask with digits typed left to right and ignores non-digit keys", async () => {
    const user = userEvent.setup();
    render(<InputBasic />);

    const input = screen.getByLabelText("Time to post");
    await user.type(input, "ab1c2de34");

    expect(input).toHaveValue("12:34");
  });

  it("removes only the last filled digit of the mask on backspace", async () => {
    const user = userEvent.setup();
    render(<InputBasic />);

    const input = screen.getByLabelText("Time to post");
    await user.type(input, "123");
    expect(input).toHaveValue("12:3_");

    await user.type(input, "{Backspace}");
    expect(input).toHaveValue("12:__");
  });

  it("positions the caret right before the mask on focus with no digits typed", async () => {
    const user = userEvent.setup();
    render(<InputBasic />);

    const input = screen.getByLabelText<HTMLInputElement>("Time to post");
    await user.click(input);

    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(0);
  });

  it.each([
    [1, 1],
    [2, 3],
    [3, 4],
    [4, 5],
  ] as const)(
    "positions the caret at index %s after %s digits are typed",
    async (digitCount, expectedCaret) => {
      const user = userEvent.setup();
      render(<InputBasic />);

      const input = screen.getByLabelText<HTMLInputElement>("Time to post");
      await user.click(input);
      await user.keyboard("1".repeat(digitCount));

      expect(input.selectionStart).toBe(expectedCaret);
      expect(input.selectionEnd).toBe(expectedCaret);
    },
  );

  it("reports the current HH:MM mask via onValueChange as digits are typed", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InputBasic onValueChange={onValueChange} />);

    // "9"는 시(1~12) 십의 자리로 유효하지 않아(0/1만 허용) 거부되므로,
    // 유효한 자리 값인 "1"로 검증합니다.
    await user.type(screen.getByLabelText("Time to post"), "1");

    expect(onValueChange).toHaveBeenLastCalledWith("1_:__");
  });

  it("toggles between AM and PM when clicked (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<InputBasic />);

    const pmButton = screen.getByRole("radio", { name: "PM" });
    await user.click(pmButton);

    expect(pmButton).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "AM" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("calls onPeriodChange when the AM/PM toggle is clicked", async () => {
    const user = userEvent.setup();
    const onPeriodChange = vi.fn();
    render(<InputBasic onPeriodChange={onPeriodChange} />);

    await user.click(screen.getByRole("radio", { name: "PM" }));

    expect(onPeriodChange).toHaveBeenCalledWith("PM");
  });

  it("respects period as a controlled value", async () => {
    const user = userEvent.setup();
    const onPeriodChange = vi.fn();
    render(<InputBasic period="AM" onPeriodChange={onPeriodChange} />);

    await user.click(screen.getByRole("radio", { name: "PM" }));

    expect(onPeriodChange).toHaveBeenCalledWith("PM");
    expect(screen.getByRole("radio", { name: "AM" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("disables the time input and the AM/PM toggle when disabled", () => {
    render(<InputBasic disabled defaultValue="1100" />);

    const input = screen.getByLabelText<HTMLInputElement>("Time to post");
    expect(input).toBeDisabled();
    expect(screen.getByRole("radio", { name: "AM" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "PM" })).toBeDisabled();
  });

  it("does not update its value when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InputBasic disabled onValueChange={onValueChange} />);

    const input = screen.getByLabelText("Time to post");
    await user.type(input, "12");

    expect(onValueChange).not.toHaveBeenCalled();
  });

  describe("propDelete (Figma propDelete, node-id 7329:4687 / 7329:4675)", () => {
    it("does not render a delete button by default", () => {
      render(<InputBasic />);

      expect(
        screen.queryByRole("button", { name: "Delete" }),
      ).not.toBeInTheDocument();
    });

    it("renders a delete button when showDelete is true", () => {
      render(<InputBasic showDelete />);

      expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
    });

    it("calls onDelete when the delete button is clicked", async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(<InputBasic showDelete onDelete={onDelete} />);

      await user.click(screen.getByRole("button", { name: "Delete" }));

      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it("disables the delete button and does not call onDelete when disabled", async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(<InputBasic showDelete disabled onDelete={onDelete} />);

      const deleteButton = screen.getByRole("button", { name: "Delete" });
      expect(deleteButton).toBeDisabled();

      await user.click(deleteButton);

      expect(onDelete).not.toHaveBeenCalled();
    });
  });

  describe("HH:MM range validation (Figma Status=error, node-id 4723:1249)", () => {
    it("accepts hour boundary values 1 and 12 without an error", async () => {
      const user = userEvent.setup();
      render(<InputBasic />);
      const input = screen.getByLabelText<HTMLInputElement>("Time to post");

      await user.type(input, "01");
      expect(input).toHaveValue("01:__");
      expect(
        screen.queryByText("Hours must be between 1 and 12."),
      ).not.toBeInTheDocument();

      await user.type(input, "{Backspace}{Backspace}12");
      expect(input).toHaveValue("12:__");
      expect(
        screen.queryByText("Hours must be between 1 and 12."),
      ).not.toBeInTheDocument();
    });

    it("rejects an hour of 13 — the invalid second digit never fills the mask", async () => {
      const user = userEvent.setup();
      render(<InputBasic />);
      const input = screen.getByLabelText<HTMLInputElement>("Time to post");

      await user.type(input, "13");

      expect(input).toHaveValue("1_:__");
      expect(
        screen.getByText("Hours must be between 1 and 12."),
      ).toBeInTheDocument();
    });

    it("rejects an hour of 00 — a second 0 is invalid after a leading 0", async () => {
      const user = userEvent.setup();
      render(<InputBasic />);
      const input = screen.getByLabelText<HTMLInputElement>("Time to post");

      await user.type(input, "00");

      expect(input).toHaveValue("0_:__");
      expect(
        screen.getByText("Hours must be between 1 and 12."),
      ).toBeInTheDocument();
    });

    it("accepts minute boundary values 0 and 59 without an error", async () => {
      const user = userEvent.setup();
      render(<InputBasic />);
      const input = screen.getByLabelText<HTMLInputElement>("Time to post");

      await user.type(input, "1200");
      expect(input).toHaveValue("12:00");
      expect(
        screen.queryByText("Minutes must be between 0 and 59."),
      ).not.toBeInTheDocument();

      await user.type(input, "{Backspace}{Backspace}59");
      expect(input).toHaveValue("12:59");
      expect(
        screen.queryByText("Minutes must be between 0 and 59."),
      ).not.toBeInTheDocument();
    });

    it("rejects a minute-tens digit of 6 (60+) — it never fills the mask", async () => {
      const user = userEvent.setup();
      render(<InputBasic />);
      const input = screen.getByLabelText<HTMLInputElement>("Time to post");

      await user.type(input, "126");

      expect(input).toHaveValue("12:__");
      expect(
        screen.getByText("Minutes must be between 0 and 59."),
      ).toBeInTheDocument();
    });

    it("clears the error and continues filling the mask once a valid digit is typed", async () => {
      const user = userEvent.setup();
      render(<InputBasic />);
      const input = screen.getByLabelText<HTMLInputElement>("Time to post");

      await user.type(input, "126"); // "6" rejected, error shown
      await user.type(input, "0"); // valid minute-tens digit

      expect(input).toHaveValue("12:0_");
      expect(
        screen.queryByText("Minutes must be between 0 and 59."),
      ).not.toBeInTheDocument();
    });

    it("clears the error on backspace", async () => {
      const user = userEvent.setup();
      render(<InputBasic />);
      const input = screen.getByLabelText<HTMLInputElement>("Time to post");

      await user.type(input, "13");
      expect(
        screen.getByText("Hours must be between 1 and 12."),
      ).toBeInTheDocument();

      await user.type(input, "{Backspace}");
      expect(
        screen.queryByText("Hours must be between 1 and 12."),
      ).not.toBeInTheDocument();
    });

    it("clears the error on blur", async () => {
      const user = userEvent.setup();
      render(<InputBasic />);
      const input = screen.getByLabelText<HTMLInputElement>("Time to post");

      await user.type(input, "13");
      expect(
        screen.getByText("Hours must be between 1 and 12."),
      ).toBeInTheDocument();

      await user.tab();
      expect(
        screen.queryByText("Hours must be between 1 and 12."),
      ).not.toBeInTheDocument();
    });
  });
});
