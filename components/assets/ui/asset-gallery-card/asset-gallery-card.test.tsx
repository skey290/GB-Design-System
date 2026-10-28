import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Archive } from "lucide-react";

import {
  AssetGalleryCard,
  type AssetGalleryCardMenuOption,
} from "./asset-gallery-card";

const MENU_OPTIONS: AssetGalleryCardMenuOption[] = [
  { value: "move-to-archive", label: "Move to Archive", icon: Archive },
];

describe("AssetGalleryCard", () => {
  it("renders the empty upload card when no image is given", () => {
    render(<AssetGalleryCard />);

    expect(screen.getByText("Upload Your Image")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the filled card with the image and date label", () => {
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        alt="Reference"
        date="2025.05.17"
      />,
    );

    expect(screen.getByRole("img", { name: "Reference" })).toBeInTheDocument();
    expect(screen.getByText("2025.05.17")).toBeInTheDocument();
    expect(screen.queryByText("Upload Your Image")).not.toBeInTheDocument();
  });

  it("omits the date label when date is not given", () => {
    render(<AssetGalleryCard image="/images/personas/self-default.jpg" />);

    expect(screen.queryByText(/\d{4}\.\d{2}\.\d{2}/)).not.toBeInTheDocument();
  });

  it("omits the menu trigger when menuOptions is not given", () => {
    render(<AssetGalleryCard image="/images/personas/self-default.jpg" />);

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("opens the dropdown and calls onSelectMenuOption when an item is picked", async () => {
    const user = userEvent.setup();
    const onSelectMenuOption = vi.fn();
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        menuOptions={MENU_OPTIONS}
        onSelectMenuOption={onSelectMenuOption}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    const item = await within(document.body).findByText("Move to Archive");
    await user.click(item);

    expect(onSelectMenuOption).toHaveBeenCalledWith("move-to-archive");
  });

  it("calls onUpload with the selected file on the empty card", async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn();
    const { container } = render(<AssetGalleryCard onUpload={onUpload} />);

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["content"], "photo.png", { type: "image/png" });

    await user.upload(input, file);

    expect(onUpload).toHaveBeenCalledTimes(1);
    expect(onUpload).toHaveBeenCalledWith(file);
  });
});
