import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AssetGalleryCard } from "./asset-gallery-card";

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

  it("calls onOpenMenu when the '...' button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenMenu = vi.fn();
    render(
      <AssetGalleryCard
        image="/images/personas/self-default.jpg"
        onOpenMenu={onOpenMenu}
      />,
    );

    await user.click(screen.getByRole("button", { name: "More options" }));

    expect(onOpenMenu).toHaveBeenCalledTimes(1);
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
