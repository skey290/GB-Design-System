import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputFileUpload } from "./input-file-upload";

describe("InputFileUpload", () => {
  it("renders its Figma label and default placeholder", () => {
    render(<InputFileUpload />);

    expect(screen.getByText("File Upload")).toBeInTheDocument();
    expect(screen.getByText("File upload")).toBeInTheDocument();
  });

  it("renders a custom label and placeholder", () => {
    render(<InputFileUpload label="Attachment" placeholder="Choose a file" />);

    expect(screen.getByText("Attachment")).toBeInTheDocument();
    expect(screen.getByText("Choose a file")).toBeInTheDocument();
  });

  it("renders the default helper text", () => {
    render(<InputFileUpload />);

    expect(
      screen.getByText(
        "The uploaded image will be used to generate your base brand kit.",
      ),
    ).toBeInTheDocument();
  });

  it("hides the helper text when description is empty", () => {
    render(<InputFileUpload description="" />);

    expect(
      screen.queryByText(
        "The uploaded image will be used to generate your base brand kit.",
      ),
    ).not.toBeInTheDocument();
  });

  it("shows the selected file name instead of the placeholder", () => {
    const file = new File(["dummy"], "File.pdf", { type: "application/pdf" });
    render(<InputFileUpload file={file} />);

    expect(screen.getByText("File.pdf")).toBeInTheDocument();
    expect(screen.queryByText("File upload")).not.toBeInTheDocument();
  });

  it("calls onFileChange when a file is selected", async () => {
    const user = userEvent.setup();
    const onFileChange = vi.fn();
    render(<InputFileUpload onFileChange={onFileChange} />);

    const file = new File(["dummy"], "resume.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByLabelText<HTMLInputElement>("File Upload");

    await user.upload(input, file);

    expect(onFileChange).toHaveBeenCalledWith(file);
  });
});
