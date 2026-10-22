import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputForm } from "./input-form";

describe("InputForm", () => {
  it("renders its Figma title and default placeholder", () => {
    render(<InputForm />);

    expect(screen.getByText("File Upload")).toBeInTheDocument();
    expect(screen.getByText("File upload")).toBeInTheDocument();
  });

  it("renders a custom title and upload placeholder", () => {
    render(<InputForm title="Attachment" uploadPlaceholder="Choose a file" />);

    expect(screen.getByText("Attachment")).toBeInTheDocument();
    expect(screen.getByText("Choose a file")).toBeInTheDocument();
  });

  it("renders the default helper text", () => {
    render(<InputForm />);

    expect(
      screen.getByText(
        "The uploaded image will be used to generate your base brand kit.",
      ),
    ).toBeInTheDocument();
  });

  it("hides the helper text when description is empty", () => {
    render(<InputForm description="" />);

    expect(
      screen.queryByText(
        "The uploaded image will be used to generate your base brand kit.",
      ),
    ).not.toBeInTheDocument();
  });

  it("shows the selected file name instead of the placeholder", () => {
    const file = new File(["dummy"], "File.pdf", { type: "application/pdf" });
    render(<InputForm file={file} />);

    expect(screen.getByText("File.pdf")).toBeInTheDocument();
    expect(screen.queryByText("File upload")).not.toBeInTheDocument();
  });

  it("calls onFileChange when a file is selected", async () => {
    const user = userEvent.setup();
    const onFileChange = vi.fn();
    render(<InputForm onFileChange={onFileChange} />);

    const file = new File(["dummy"], "resume.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByLabelText<HTMLInputElement>("File Upload");

    await user.upload(input, file);

    expect(onFileChange).toHaveBeenCalledWith(file);
  });

  it("renders all four slots by default", () => {
    render(<InputForm selectOptions={[{ value: "ISTJ", label: "ISTJ" }]} />);

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
      <InputForm
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
    render(<InputForm />);

    expect(screen.queryByText("MBTI")).not.toBeInTheDocument();
  });

  it("marks the root to fill the container when shouldFitContainer is true", () => {
    const { container } = render(<InputForm shouldFitContainer />);

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstElementChild).toHaveAttribute(
      "data-fit-container",
      "true",
    );
  });

  it("keeps the fixed width by default", () => {
    const { container } = render(<InputForm />);

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstElementChild).not.toHaveAttribute(
      "data-fit-container",
    );
  });
});
