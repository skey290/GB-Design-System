import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

  it("forwards inputType to the native type attribute, alongside other native attributes", () => {
    render(<Input placeholder="field" inputType="email" maxLength={5} />);

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

  it("renders no trailing icon for the default textfield type", () => {
    render(<Input placeholder="field" />);

    expect(
      screen.getByPlaceholderText("field").parentElement?.querySelector("svg"),
    ).not.toBeInTheDocument();
  });

  it("renders the Globe trailing icon for type='link'", () => {
    render(<Input type="link" placeholder="field" />);

    expect(
      screen
        .getByPlaceholderText("field")
        .parentElement?.querySelector("svg.lucide-globe"),
    ).toBeInTheDocument();
  });

  it("renders a file picker with the Plus icon for type='upload'", () => {
    render(<Input type="upload" placeholder="File upload" />);

    const fileInput = screen.getByLabelText<HTMLInputElement>("File upload");
    expect(fileInput).toHaveAttribute("type", "file");
    expect(screen.getByText("File upload")).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector("svg.lucide-plus")).toBeInTheDocument();
  });

  it("shows the file name once a file is selected in upload type", () => {
    const file = new File(["x"], "resume.pdf", { type: "application/pdf" });
    render(<Input type="upload" placeholder="File upload" file={file} />);

    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
    expect(screen.queryByText("File upload")).not.toBeInTheDocument();
  });

  describe("type='social-connect'", () => {
    it("renders a connect button with the Linkedin icon", () => {
      render(<Input type="social-connect" />);

      expect(
        screen.getByRole("button", { name: "Connect with Linkedin" }),
      ).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-node-access
      expect(
        document.querySelector('use[href="/icons.svg#linkedin-icon"]'),
      ).toBeInTheDocument();
    });

    it("shows the connected label when isConnected is true", () => {
      render(<Input type="social-connect" isConnected />);

      expect(
        screen.getByRole("button", { name: "Linkedin Connected" }),
      ).toBeInTheDocument();
    });

    it("shows the error label when isError is true, overriding isConnected", () => {
      render(<Input type="social-connect" isConnected isError />);

      expect(
        screen.getByRole("button", { name: "Fail to connect" }),
      ).toBeInTheDocument();
    });

    it("calls onConnectClick when clicked", async () => {
      const user = userEvent.setup();
      const onConnectClick = vi.fn();
      render(<Input type="social-connect" onConnectClick={onConnectClick} />);

      await user.click(
        screen.getByRole("button", { name: "Connect with Linkedin" }),
      );

      expect(onConnectClick).toHaveBeenCalledTimes(1);
    });

    it("is disabled and does not call onConnectClick when disabled", async () => {
      const user = userEvent.setup();
      const onConnectClick = vi.fn();
      render(
        <Input
          type="social-connect"
          disabled
          onConnectClick={onConnectClick}
        />,
      );

      const button = screen.getByRole("button", {
        name: "Connect with Linkedin",
      });
      expect(button).toBeDisabled();

      await user.click(button);

      expect(onConnectClick).not.toHaveBeenCalled();
    });
  });
});
