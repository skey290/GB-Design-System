import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputPhone } from "./input-phone";

const COUNTRY_CODE_OPTIONS = [
  { value: "kr", label: "South Korea", code: "+82" },
  { value: "us", label: "United States", code: "+1" },
];

beforeAll(() => {
  // Radix Popover(내부 Select)는 포지셔닝 계산에 ResizeObserver를 사용하는데 jsdom에는 없음
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

describe("InputPhone", () => {
  it("renders the label", () => {
    render(<InputPhone countryCodeOptions={COUNTRY_CODE_OPTIONS} />);

    expect(screen.getByText("Phone Number")).toBeInTheDocument();
  });

  it("renders a custom label", () => {
    render(
      <InputPhone label="Mobile" countryCodeOptions={COUNTRY_CODE_OPTIONS} />,
    );

    expect(screen.getByText("Mobile")).toBeInTheDocument();
  });

  it("updates the phone value when typed into (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<InputPhone countryCodeOptions={COUNTRY_CODE_OPTIONS} />);

    const phoneInput = screen.getByRole("textbox");
    await user.type(phoneInput, "5550100");

    expect(phoneInput).toHaveValue("5550100");
  });

  it("calls onValueChange with the next phone value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <InputPhone
        countryCodeOptions={COUNTRY_CODE_OPTIONS}
        onValueChange={onValueChange}
      />,
    );

    await user.type(screen.getByRole("textbox"), "12");

    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onValueChange).toHaveBeenLastCalledWith("12");
  });

  it("respects value as a controlled phone value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <InputPhone
        countryCodeOptions={COUNTRY_CODE_OPTIONS}
        value="fixed"
        onValueChange={onValueChange}
      />,
    );

    const phoneInput = screen.getByRole("textbox");
    await user.type(phoneInput, "x");

    expect(onValueChange).toHaveBeenCalledWith("fixedx");
    expect(phoneInput).toHaveValue("fixed");
  });

  it("disables both the select trigger and the phone input when disabled", () => {
    render(<InputPhone countryCodeOptions={COUNTRY_CODE_OPTIONS} disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("shows the selected country code on the trigger", () => {
    render(
      <InputPhone
        countryCodeOptions={COUNTRY_CODE_OPTIONS}
        defaultCountryCode="kr"
      />,
    );

    expect(screen.getByText("+82")).toBeInTheDocument();
  });
});
