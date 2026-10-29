import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputPhone } from "./input-phone";

const COUNTRY_CODE_OPTIONS = [
  { value: "kr", label: "South Korea", code: "+82" },
  { value: "us", label: "United States", code: "+1" },
];

beforeAll(() => {
  // Radix Popover (inside Select) uses ResizeObserver for positioning, which jsdom lacks
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

    expect(screen.getByText("Where can we reach you?")).toBeInTheDocument();
  });

  it("renders a custom label", () => {
    render(
      <InputPhone label="Mobile" countryCodeOptions={COUNTRY_CODE_OPTIONS} />,
    );

    expect(screen.getByText("Mobile")).toBeInTheDocument();
  });

  it("updates the phone value when typed into (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(
      <InputPhone
        countryCodeOptions={COUNTRY_CODE_OPTIONS}
        defaultCountryCode="us"
      />,
    );

    const phoneInput = screen.getByRole("textbox") as HTMLInputElement;
    await user.type(phoneInput, "5550100");

    expect(phoneInput.value.replace(/\D/g, "")).toBe("5550100");
  });

  it("calls onValueChange with the next phone value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <InputPhone
        countryCodeOptions={COUNTRY_CODE_OPTIONS}
        defaultCountryCode="us"
        onValueChange={onValueChange}
      />,
    );

    await user.type(screen.getByRole("textbox"), "12");

    expect(onValueChange).toHaveBeenCalledTimes(2);
    const lastValue = onValueChange.mock.calls.at(-1)?.[0] as string;
    expect(lastValue.replace(/\D/g, "")).toBe("12");
  });

  it("respects value as a controlled phone value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <InputPhone
        countryCodeOptions={COUNTRY_CODE_OPTIONS}
        defaultCountryCode="us"
        value="123"
        onValueChange={onValueChange}
      />,
    );

    const phoneInput = screen.getByRole("textbox");
    await user.type(phoneInput, "4");

    expect(onValueChange).toHaveBeenCalled();
    expect(phoneInput).toHaveValue("123");
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

  it("defaults to the full libphonenumber-js country list when countryCodeOptions is omitted", async () => {
    const user = userEvent.setup();
    render(<InputPhone />);

    await user.click(screen.getByRole("combobox"));

    expect(await screen.findByText("United States (+1)")).toBeInTheDocument();
    expect(screen.getByText("South Korea (+82)")).toBeInTheDocument();
  });

  it("formats the phone number as you type once a country is selected", async () => {
    const user = userEvent.setup();
    render(
      <InputPhone
        countryCodeOptions={COUNTRY_CODE_OPTIONS}
        defaultCountryCode="us"
      />,
    );

    await user.type(screen.getByRole("textbox"), "2016661234");

    expect(screen.getByRole("textbox")).toHaveValue("(201) 666-1234");
  });

  it("marks the root to fill the container when shouldFitContainer is true", () => {
    const { container } = render(
      <InputPhone
        countryCodeOptions={COUNTRY_CODE_OPTIONS}
        shouldFitContainer
      />,
    );

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstElementChild).toHaveAttribute(
      "data-fit-container",
      "true",
    );
  });

  it("keeps the fixed width by default", () => {
    const { container } = render(
      <InputPhone countryCodeOptions={COUNTRY_CODE_OPTIONS} />,
    );

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstElementChild).not.toHaveAttribute(
      "data-fit-container",
    );
  });

  describe("real-time length and character validation", () => {
    it("rejects a digit that would exceed the selected country's number length", async () => {
      const user = userEvent.setup();
      render(
        <InputPhone
          countryCodeOptions={COUNTRY_CODE_OPTIONS}
          defaultCountryCode="us"
        />,
      );

      const phoneInput = screen.getByRole("textbox");
      await user.type(phoneInput, "20166612345");

      expect(phoneInput).toHaveValue("(201) 666-1234");
      expect(phoneInput).toHaveAttribute("data-error");
      expect(
        screen.getByText("Too many digits for this country."),
      ).toBeInTheDocument();
    });

    it("rejects a letter and shows a message", async () => {
      const user = userEvent.setup();
      render(
        <InputPhone
          countryCodeOptions={COUNTRY_CODE_OPTIONS}
          defaultCountryCode="us"
        />,
      );

      const phoneInput = screen.getByRole("textbox");
      await user.type(phoneInput, "20abc");

      expect(phoneInput).toHaveValue("20");
      expect(screen.getByText("Numbers only.")).toBeInTheDocument();
    });

    it("rejects a non-digit symbol and shows a message", async () => {
      const user = userEvent.setup();
      render(
        <InputPhone
          countryCodeOptions={COUNTRY_CODE_OPTIONS}
          defaultCountryCode="us"
        />,
      );

      const phoneInput = screen.getByRole("textbox");
      await user.type(phoneInput, "20#");

      expect(phoneInput).toHaveValue("20");
      expect(screen.getByText("Numbers only.")).toBeInTheDocument();
    });

    it("rejects any digit typed before a country is selected", async () => {
      const user = userEvent.setup();
      render(<InputPhone countryCodeOptions={COUNTRY_CODE_OPTIONS} />);

      const phoneInput = screen.getByRole("textbox");
      await user.type(phoneInput, "2");

      expect(phoneInput).toHaveValue("");
      expect(phoneInput).toHaveAttribute("data-error");
      expect(screen.getByText("Select a country first.")).toBeInTheDocument();
    });

    it("clears the warning message on blur", async () => {
      const user = userEvent.setup();
      render(
        <InputPhone
          countryCodeOptions={COUNTRY_CODE_OPTIONS}
          defaultCountryCode="us"
        />,
      );

      const phoneInput = screen.getByRole("textbox");
      await user.type(phoneInput, "20abc");
      expect(screen.getByText("Numbers only.")).toBeInTheDocument();

      await user.tab();

      expect(screen.queryByText("Numbers only.")).not.toBeInTheDocument();
    });
  });

  describe("country search", () => {
    it("shows a search box with the default placeholder when the dropdown opens", async () => {
      const user = userEvent.setup();
      render(<InputPhone countryCodeOptions={COUNTRY_CODE_OPTIONS} />);

      await user.click(screen.getByRole("combobox"));

      expect(
        await screen.findByPlaceholderText("Search country"),
      ).toBeInTheDocument();
    });

    it("filters the country list as the user types", async () => {
      const user = userEvent.setup();
      render(<InputPhone countryCodeOptions={COUNTRY_CODE_OPTIONS} />);

      await user.click(screen.getByRole("combobox"));
      await user.type(
        await screen.findByPlaceholderText("Search country"),
        "Korea",
      );

      expect(
        screen.getByRole("option", { name: /South Korea/ }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("option", { name: /United States/ }),
      ).not.toBeInTheDocument();
    });

    it("supports a custom search placeholder", async () => {
      const user = userEvent.setup();
      render(
        <InputPhone
          countryCodeOptions={COUNTRY_CODE_OPTIONS}
          searchPlaceholder="Find your country"
        />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(
        await screen.findByPlaceholderText("Find your country"),
      ).toBeInTheDocument();
    });
  });
});
