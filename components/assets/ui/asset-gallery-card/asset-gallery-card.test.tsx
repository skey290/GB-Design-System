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

  it("renders the selectable card as an unchecked checkbox by default", () => {
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        isSelected={false}
      />,
    );

    const card = screen.getByRole("checkbox");
    expect(card).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("calls onSelectedChange with the toggled state when the selectable card is clicked", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        isSelected={false}
        onSelectedChange={onSelectedChange}
      />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  it("reflects isSelected as checked on the selectable card", () => {
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        isSelected={true}
      />,
    );

    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("renders the style card's title and description", () => {
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        title="Deep Chroma"
        description="Baroque-inspired chiaroscuro"
      />,
    );

    expect(screen.getByText("Deep Chroma")).toBeInTheDocument();
    expect(
      screen.getByText("Baroque-inspired chiaroscuro"),
    ).toBeInTheDocument();
  });

  it("always shows the style card's checkbox, unchecked by default, even without isSelected", () => {
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        title="Deep Chroma"
      />,
    );

    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("reflects isSelected as checked on the style card", () => {
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        title="Deep Chroma"
        isSelected={true}
      />,
    );

    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("ignores date and menuOptions on the style card", () => {
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        title="Deep Chroma"
        date="2025.05.17"
        menuOptions={MENU_OPTIONS}
      />,
    );

    expect(screen.queryByText("2025.05.17")).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("calls onSelectedChange with the toggled state when the style card is clicked", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        title="Deep Chroma"
        onSelectedChange={onSelectedChange}
      />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onSelectedChange).toHaveBeenCalledWith(true);
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

  it("renders a custom empty label", () => {
    render(<AssetGalleryCard emptyLabel="Add Reference" />);

    expect(screen.getByText("Add Reference")).toBeInTheDocument();
  });

  it("calls onEmptyClick instead of rendering a file input when given", async () => {
    const user = userEvent.setup();
    const onEmptyClick = vi.fn();
    const { container } = render(
      <AssetGalleryCard onEmptyClick={onEmptyClick} />,
    );

    expect(
      container.querySelector('input[type="file"]'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(onEmptyClick).toHaveBeenCalledTimes(1);
  });

  it("renders the style card compact look without a description", () => {
    render(
      <AssetGalleryCard
        image="/images/styles/monochrome.jpg"
        title="Monochrome"
        description="Should be ignored"
        isCompact
        isSelected={false}
      />,
    );

    expect(screen.getByText("Monochrome")).toBeInTheDocument();
    expect(screen.queryByText("Should be ignored")).not.toBeInTheDocument();
  });

  it("uses role=radio when selectionRole is radio", () => {
    render(
      <AssetGalleryCard
        image="/images/styles/monochrome.jpg"
        title="Monochrome"
        isCompact
        selectionRole="radio"
        isSelected={false}
      />,
    );

    expect(screen.getByRole("radio")).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("renders a remove button instead of a checkbox or menu when onRemove is given", () => {
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        onRemove={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Remove image" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("calls onRemove when the remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Remove image" }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("hides the empty card's visible label and exposes it as aria-label when compact", () => {
    render(<AssetGalleryCard isCompact emptyLabel="Add Reference" />);

    expect(screen.queryByText("Add Reference")).not.toBeInTheDocument();
    expect(
      screen.getByLabelText("Add Reference", { selector: "label" }),
    ).toBeInTheDocument();
  });
});
