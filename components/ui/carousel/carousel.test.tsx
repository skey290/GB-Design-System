import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Carousel } from "./carousel";

function slides(count = 3) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i}>Slide {i + 1}</div>
  ));
}

describe("Carousel", () => {
  it("renders previous and next buttons by default", () => {
    render(<Carousel>{slides()}</Carousel>);

    expect(
      screen.getByRole("button", { name: "Previous slide" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next slide" }),
    ).toBeInTheDocument();
  });

  it("hides the previous button when showPreviousButton is false", () => {
    render(<Carousel showPreviousButton={false}>{slides()}</Carousel>);

    expect(
      screen.queryByRole("button", { name: "Previous slide" }),
    ).not.toBeInTheDocument();
  });

  it("hides the next button when showNextButton is false", () => {
    render(<Carousel showNextButton={false}>{slides()}</Carousel>);

    expect(
      screen.queryByRole("button", { name: "Next slide" }),
    ).not.toBeInTheDocument();
  });

  it("disables the previous button on the first slide", () => {
    render(<Carousel>{slides()}</Carousel>);

    expect(
      screen.getByRole("button", { name: "Previous slide" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Next slide" }),
    ).not.toBeDisabled();
  });

  it("moves to the next slide and updates the transform when the next button is clicked", async () => {
    const user = userEvent.setup();
    render(<Carousel>{slides()}</Carousel>);

    const track = document.querySelector(
      '[data-slot="carousel-track"]',
    ) as HTMLElement;
    expect(track.style.transform).toBe("translateX(-0%)");

    await user.click(screen.getByRole("button", { name: "Next slide" }));

    expect(track.style.transform).toBe("translateX(-100%)");
  });

  it("disables the next button on the last slide", async () => {
    const user = userEvent.setup();
    render(<Carousel>{slides(2)}</Carousel>);

    await user.click(screen.getByRole("button", { name: "Next slide" }));

    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  });

  it("calls onNext with the new index when the next button is clicked", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    render(<Carousel onNext={onNext}>{slides()}</Carousel>);

    await user.click(screen.getByRole("button", { name: "Next slide" }));

    expect(onNext).toHaveBeenCalledWith(1);
  });

  it("calls onPrevious with the new index when the previous button is clicked", async () => {
    const user = userEvent.setup();
    const onPrevious = vi.fn();
    render(
      <Carousel defaultIndex={1} onPrevious={onPrevious}>
        {slides()}
      </Carousel>,
    );

    await user.click(screen.getByRole("button", { name: "Previous slide" }));

    expect(onPrevious).toHaveBeenCalledWith(0);
  });

  it("respects previousDisabled/nextDisabled overrides regardless of index", () => {
    render(
      <Carousel previousDisabled nextDisabled>
        {slides()}
      </Carousel>,
    );

    expect(
      screen.getByRole("button", { name: "Previous slide" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  });
});
