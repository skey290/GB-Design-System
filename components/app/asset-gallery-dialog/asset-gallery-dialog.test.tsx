import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AssetGalleryDialog } from "./asset-gallery-dialog";

const SELVES = [{ value: "self-1", label: "Data Scientist" }];

function renderDialog(
  extra: Partial<React.ComponentProps<typeof AssetGalleryDialog>> = {},
) {
  const onOpenChange = vi.fn();
  const onSelfIdChange = vi.fn();
  const onGenerate = vi.fn();
  const onUseReferenceImages = vi.fn();
  const onSetMainPortrait = vi.fn();
  const onReplacePortrait = vi.fn();

  render(
    <AssetGalleryDialog
      open
      onOpenChange={onOpenChange}
      selves={SELVES}
      selfId="self-1"
      onSelfIdChange={onSelfIdChange}
      portraitImages={[
        { id: "p1", src: "/images/personas/self-default.jpg", alt: "Portrait" },
      ]}
      onGenerate={onGenerate}
      onUseReferenceImages={onUseReferenceImages}
      onSetMainPortrait={onSetMainPortrait}
      onReplacePortrait={onReplacePortrait}
      {...extra}
    />,
  );

  return {
    onOpenChange,
    onSelfIdChange,
    onGenerate,
    onUseReferenceImages,
    onSetMainPortrait,
    onReplacePortrait,
  };
}

describe("AssetGalleryDialog", () => {
  it("renders the Self Portrait tab by default with the given portrait images", () => {
    renderDialog();

    expect(screen.getByText("Asset Gallery")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Portrait" })).toBeInTheDocument();
  });

  it("switches to the Reference tab and shows the preset grid", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("tab", { name: /Reference/ }));

    expect(screen.getByText("Presets")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Entrepreneur preset" }),
    ).toBeInTheDocument();
  });

  it("blocks deleting the only remaining Self Portrait and shows a warning instead", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getAllByRole("combobox")[1]!);
    await user.click(screen.getByText("Delete Self Portrait"));

    expect(
      screen.getByText("Keep at least one Self Portrait"),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Portrait" })).toBeInTheDocument();
  });

  it("deletes a Self Portrait when more than one exists", async () => {
    const user = userEvent.setup();
    renderDialog({
      portraitImages: [
        {
          id: "p1",
          src: "/images/personas/self-default.jpg",
          alt: "Portrait 1",
        },
        {
          id: "p2",
          src: "/images/personas/team-leader.jpg",
          alt: "Portrait 2",
        },
      ],
    });

    const comboboxes = screen.getAllByRole("combobox");
    await user.click(comboboxes[1]!);
    await user.click(screen.getByText("Delete Self Portrait"));

    expect(
      screen.queryByRole("img", { name: "Portrait 1" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Portrait 2" })).toBeInTheDocument();
  });

  it("calls onSetMainPortrait and closes when 'Set as main Portrait' is chosen", async () => {
    const user = userEvent.setup();
    const { onSetMainPortrait, onOpenChange } = renderDialog();

    await user.click(screen.getAllByRole("combobox")[1]!);
    await user.click(screen.getByText("Set as main Portrait"));

    expect(onSetMainPortrait).toHaveBeenCalledWith(
      "/images/personas/self-default.jpg",
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("opens the style-select step as a radio group when editing an existing portrait", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getAllByRole("combobox")[1]!);
    await user.click(screen.getByText("Edit Profile Portrait"));

    expect(screen.getByText("Create Self")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
  });

  it("calls onReplacePortrait with the selected style when editing", async () => {
    const user = userEvent.setup();
    const { onReplacePortrait } = renderDialog();

    await user.click(screen.getAllByRole("combobox")[1]!);
    await user.click(screen.getByText("Edit Profile Portrait"));
    await user.click(screen.getByText("Monochrome"));
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(onReplacePortrait).toHaveBeenCalledWith(
      "p1",
      "/images/style-cards/monochrome.jpg",
    );
  });

  it("shows the style-select step as independent checkboxes for a fresh upload", async () => {
    const user = userEvent.setup();
    renderDialog();

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["dummy"], "photo.png", { type: "image/png" });
    await user.upload(fileInput, file);

    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
  });

  it("requires a Select in picker mode before enabling the confirm button", async () => {
    const user = userEvent.setup();
    const { onUseReferenceImages } = renderDialog({ isPickerMode: true });

    await user.click(screen.getByRole("tab", { name: /Reference/ }));
    const confirmButton = screen.getByRole("button", { name: "Select" });
    expect(confirmButton).toBeDisabled();

    await user.click(screen.getByRole("img", { name: "Entrepreneur preset" }));
    const updatedButton = screen.getByRole("button", { name: "Select (1)" });
    await user.click(updatedButton);

    expect(onUseReferenceImages).toHaveBeenCalledWith([
      "/images/personas/entrepreneur.jpg",
    ]);
  });

  it("omits the confirm button outside picker mode", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("tab", { name: /Reference/ }));

    expect(
      screen.queryByRole("button", { name: /Select/ }),
    ).not.toBeInTheDocument();
  });
});
