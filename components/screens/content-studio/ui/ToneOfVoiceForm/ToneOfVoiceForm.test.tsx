import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ToneOfVoiceForm } from "./ToneOfVoiceForm";

function renderForm(
  props: Partial<React.ComponentProps<typeof ToneOfVoiceForm>> = {},
) {
  return render(<ToneOfVoiceForm {...props} />);
}

describe("ToneOfVoiceForm", () => {
  it("renders the Reference materials and Personality type fields and Save button", () => {
    renderForm();

    expect(screen.getByText("Reference materials")).toBeInTheDocument();
    expect(screen.getByText("Personality type")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload reference file")).toBeInTheDocument();
    expect(screen.getByLabelText("Reference link")).toBeInTheDocument();
    expect(screen.getByLabelText("Reference text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("updates the reference link value", async () => {
    const user = userEvent.setup();
    const onReferenceLinkChange = vi.fn();
    renderForm({ onReferenceLinkChange });

    await user.type(screen.getByLabelText("Reference link"), "https://x.com");
    expect(onReferenceLinkChange).toHaveBeenLastCalledWith("https://x.com");
  });

  it("updates the fallback reference text", async () => {
    const user = userEvent.setup();
    const onReferenceTextChange = vi.fn();
    renderForm({ onReferenceTextChange });

    await user.type(screen.getByLabelText("Reference text"), "hi");
    expect(onReferenceTextChange).toHaveBeenCalled();
  });

  it("toggles a personality trait on and off", async () => {
    const user = userEvent.setup();
    const onTraitsChange = vi.fn();
    renderForm({ onTraitsChange });

    await user.click(screen.getByRole("button", { name: "Soft" }));
    expect(onTraitsChange).toHaveBeenLastCalledWith(["Soft"]);

    await user.click(screen.getByRole("button", { name: "Soft" }));
    expect(onTraitsChange).toHaveBeenLastCalledWith([]);
  });

  it("disables Save until a reference material and a personality trait are both set", async () => {
    const user = userEvent.setup();
    renderForm();

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    await user.type(screen.getByLabelText("Reference text"), "hi");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Soft" }));
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });

  it("calls onSave when the Save button is clicked with all fields filled", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    renderForm({
      defaultReferenceText: "hi",
      defaultTraits: ["Soft"],
      onSave,
    });

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderForm({ onClose });

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
