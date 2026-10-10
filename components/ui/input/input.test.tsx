import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "./input";

describe("Input", () => {
  it("renders its Figma label and default placeholder", () => {
    render(<Input />);

    expect(screen.getByText("File Upload")).toBeInTheDocument();
    expect(screen.getByText("File upload")).toBeInTheDocument();
  });

  it("renders a custom label and upload placeholder", () => {
    render(<Input label="Attachment" uploadPlaceholder="Choose a file" />);

    expect(screen.getByText("Attachment")).toBeInTheDocument();
    expect(screen.getByText("Choose a file")).toBeInTheDocument();
  });

  it("renders the default helper text", () => {
    render(<Input />);

    expect(
      screen.getByText(
        "The uploaded image will be used to generate your base brand kit.",
      ),
    ).toBeInTheDocument();
  });

  it("hides the helper text when description is empty", () => {
    render(<Input description="" />);

    expect(
      screen.queryByText(
        "The uploaded image will be used to generate your base brand kit.",
      ),
    ).not.toBeInTheDocument();
  });

  it("shows the selected file name instead of the placeholder", () => {
    const file = new File(["dummy"], "File.pdf", { type: "application/pdf" });
    render(<Input file={file} />);

    expect(screen.getByText("File.pdf")).toBeInTheDocument();
    expect(screen.queryByText("File upload")).not.toBeInTheDocument();
  });

  it("calls onFileChange when a file is selected", async () => {
    const user = userEvent.setup();
    const onFileChange = vi.fn();
    render(<Input onFileChange={onFileChange} />);

    const file = new File(["dummy"], "resume.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByLabelText<HTMLInputElement>("File Upload");

    await user.upload(input, file);

    expect(onFileChange).toHaveBeenCalledWith(file);
  });

  it("renders all four slots by default", () => {
    render(<Input selectOptions={[{ value: "ISTJ", label: "ISTJ" }]} />);

    expect(
      screen.getByPlaceholderText("Email or Username"),
    ).toBeInTheDocument();
    expect(screen.getByText("File upload")).toBeInTheDocument();
    expect(screen.getByText("MBTI")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("https://gabrielle.ai"),
    ).toBeInTheDocument();
  });

  it("hides each slot when its toggle is false", () => {
    render(
      <Input
        showTextfield={false}
        showUpload={false}
        showSelect={false}
        showLink={false}
        selectOptions={[{ value: "ISTJ", label: "ISTJ" }]}
      />,
    );

    expect(
      screen.queryByPlaceholderText("Email or Username"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("File upload")).not.toBeInTheDocument();
    expect(screen.queryByText("MBTI")).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("https://gabrielle.ai"),
    ).not.toBeInTheDocument();
  });

  it("does not render the select slot without options", () => {
    render(<Input />);

    expect(screen.queryByText("MBTI")).not.toBeInTheDocument();
  });
});
