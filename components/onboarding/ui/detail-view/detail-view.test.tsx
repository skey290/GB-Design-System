import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DetailView } from "./detail-view";

describe("DetailView", () => {
  it("renders the Gabrielle headline and Google sign-in caption", () => {
    render(<DetailView onContinueWithGoogle={vi.fn()} />);

    expect(
      screen.getByText(
        "Welcome to Gabrielle, an agent for your personal branding.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sign up or Log in using Google account."),
    ).toBeInTheDocument();
  });

  it("renders a Continue with Google button", () => {
    render(<DetailView onContinueWithGoogle={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Continue with Google" }),
    ).toBeInTheDocument();
  });

  it("calls onContinueWithGoogle when the button is clicked", async () => {
    const user = userEvent.setup();
    const onContinueWithGoogle = vi.fn();
    render(<DetailView onContinueWithGoogle={onContinueWithGoogle} />);

    await user.click(
      screen.getByRole("button", { name: "Continue with Google" }),
    );

    expect(onContinueWithGoogle).toHaveBeenCalledTimes(1);
  });

  it("forwards a ref to the root element", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<DetailView ref={ref} onContinueWithGoogle={vi.fn()} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
