import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("defaults to the image variant (rounded shape), falling back to the icon without a src", () => {
    render(<Avatar />);

    const avatar = screen.getByRole("img");
    expect(avatar.querySelector("svg")).toBeInTheDocument();
    expect(avatar).toHaveAttribute("data-shape", "rounded");
  });

  it("renders initials for the initial variant", () => {
    render(<Avatar variant="initial" initials="S" />);

    expect(screen.getByText("S")).toBeInTheDocument();
  });

  it("falls back from initial to icon when no initials are provided", () => {
    render(<Avatar variant="initial" />);

    const avatar = screen.getByRole("img");
    expect(avatar.querySelector("svg")).toBeInTheDocument();
  });

  it("renders an image for the image variant", () => {
    render(
      <Avatar
        variant="image"
        src="https://example.com/avatar.png"
        alt="사용자"
      />,
    );

    const image = screen.getByAltText("사용자");
    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  it("falls back from image to icon when no src is provided", () => {
    render(<Avatar variant="image" />);

    const avatar = screen.getByRole("img");
    expect(avatar.querySelector("svg")).toBeInTheDocument();
  });

  it("falls back from image to initials when the image fails to load and initials are set", () => {
    const { container } = render(
      <Avatar
        variant="image"
        src="https://example.com/broken.png"
        initials="S"
      />,
    );

    // An <img> with the default alt="" gets accessibility role "presentation" (the decorative
    // image rule), so it can't be found with getByRole("img") — we find it directly by its
    // actual DOM tag, regardless of role, and fire the error event on it.
    const image = container.querySelector("img") as HTMLImageElement;
    fireEvent.error(image);

    expect(screen.getByText("S")).toBeInTheDocument();
  });

  it("applies the icon/initial placeholder variant as a data attribute", () => {
    render(<Avatar variant="icon" />);

    expect(screen.getByRole("img")).toHaveAttribute("data-variant", "icon");
  });

  it("applies the shape prop as a data attribute (rounded/rectangle/circle)", () => {
    const { rerender } = render(<Avatar variant="icon" shape="rounded" />);
    expect(screen.getByRole("img")).toHaveAttribute("data-shape", "rounded");

    rerender(<Avatar variant="icon" shape="rectangle" />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "data-shape",
      "rectangle",
    );

    rerender(<Avatar variant="icon" shape="circle" />);
    expect(screen.getByRole("img")).toHaveAttribute("data-shape", "circle");
  });

  it("forwards additional props to the underlying div", () => {
    render(<Avatar variant="icon" data-testid="custom-avatar" />);

    expect(screen.getByTestId("custom-avatar")).toBeInTheDocument();
  });
});
