import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AssetGalleryDialog } from "./asset-gallery-dialog";

vi.mock("@/lib/archived-asset-store", () => ({
  getArchivedImages: vi.fn(() => []),
}));

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
  const onDeletePortraitImage = vi.fn();
  const onDeleteArchivedImage = vi.fn();
  const onUploadReferenceImage = vi.fn();
  const onCreateReferenceImages = vi.fn();
  const onDeleteReferenceImage = vi.fn();

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
      onDeletePortraitImage={onDeletePortraitImage}
      onDeleteArchivedImage={onDeleteArchivedImage}
      myReferenceImages={[]}
      onUploadReferenceImage={onUploadReferenceImage}
      onCreateReferenceImages={onCreateReferenceImages}
      onDeleteReferenceImage={onDeleteReferenceImage}
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
    onDeletePortraitImage,
    onDeleteArchivedImage,
    onUploadReferenceImage,
    onCreateReferenceImages,
    onDeleteReferenceImage,
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

  it("deletes a Self Portrait when more than one exists, and tells the host via onDeletePortraitImage", async () => {
    const user = userEvent.setup();
    const { onDeletePortraitImage } = renderDialog({
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
    // The host must drop it from the `portraitImages` array it passes back in,
    // or the image reappears the next time the dialog is opened.
    expect(onDeletePortraitImage).toHaveBeenCalledWith("p1");
  });

  it("deletes an archived image and tells the host via onDeleteArchivedImage, not onDeletePortraitImage", async () => {
    const user = userEvent.setup();
    const { getArchivedImages } = await import("@/lib/archived-asset-store");
    // yourImages now has 2 entries (the seeded "p1" + "archived-0"), so
    // deleting either is allowed. Persists across this test's re-renders
    // (vitest.config.ts has no restoreMocks/clearMocks), so reset it after.
    vi.mocked(getArchivedImages).mockReturnValue([
      "/images/personas/entrepreneur.jpg",
    ]);
    try {
      const { onDeleteArchivedImage, onDeletePortraitImage } = renderDialog();

      const comboboxes = screen.getAllByRole("combobox");
      await user.click(comboboxes[2]!);
      await user.click(screen.getByText("Delete Self Portrait"));

      expect(onDeleteArchivedImage).toHaveBeenCalledWith(
        "/images/personas/entrepreneur.jpg",
      );
      expect(onDeletePortraitImage).not.toHaveBeenCalled();
    } finally {
      vi.mocked(getArchivedImages).mockReturnValue([]);
    }
  });

  it("calls onUploadReferenceImage when a raw file is uploaded on the Reference tab", async () => {
    const user = userEvent.setup();
    const { onUploadReferenceImage } = renderDialog();

    await user.click(screen.getByRole("tab", { name: /Reference/ }));
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["dummy"], "photo.png", { type: "image/png" });
    await user.upload(fileInput, file);

    expect(onUploadReferenceImage).toHaveBeenCalledWith(
      expect.stringMatching(/^blob:/),
    );
  });

  it("renders myReferenceImages on the Reference tab and calls onDeleteReferenceImage when removed", async () => {
    const user = userEvent.setup();
    const { onDeleteReferenceImage } = renderDialog({
      myReferenceImages: [
        {
          id: "ref-1",
          src: "/images/personas/entrepreneur.jpg",
          alt: "My uploaded reference",
        },
      ],
    });

    await user.click(screen.getByRole("tab", { name: /Reference/ }));
    expect(
      screen.getByRole("img", { name: "My uploaded reference" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Delete reference image" }),
    );
    expect(onDeleteReferenceImage).toHaveBeenCalledWith("ref-1");
  });

  it("calls onCreateReferenceImages with the picked preset(s) when 'Create my reference' is clicked", async () => {
    const user = userEvent.setup();
    const { onCreateReferenceImages } = renderDialog({
      initialTabIndex: 1,
    });

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["dummy"], "photo.png", { type: "image/png" });
    await user.upload(fileInput, file);
    await user.click(screen.getByRole("img", { name: "Entrepreneur preset" }));
    await user.click(
      screen.getByRole("button", { name: "Create my reference" }),
    );

    expect(onCreateReferenceImages).toHaveBeenCalledWith([
      { src: "/images/personas/entrepreneur.jpg", alt: "Entrepreneur preset" },
    ]);
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

  it("shows a static self label in picker mode even without selfLabel, instead of the Select", async () => {
    const user = userEvent.setup();
    renderDialog({ isPickerMode: true });

    expect(screen.getByText("Data Scientist")).toBeInTheDocument();

    // The Self Portrait tab's own "..." menu is also a combobox — switch to
    // Reference (no per-card menu there) so the only combobox this could
    // catch is the header "for" field.
    await user.click(screen.getByRole("tab", { name: /Reference/ }));
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
