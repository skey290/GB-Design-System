import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ChatboxComposer } from "./chatbox-composer";

describe("ChatboxComposer", () => {
  it("does not render an images row or chip row when variant is default", () => {
    render(<ChatboxComposer variant="default" />);

    expect(screen.queryAllByRole("img")).toHaveLength(0);
    expect(
      screen.queryByRole("button", { name: "All" }),
    ).not.toBeInTheDocument();
  });

  describe("images (variant=image)", () => {
    it("renders an images row with remove buttons", () => {
      render(
        <ChatboxComposer
          variant="image"
          images={[
            { src: "/a.png", alt: "a" },
            { src: "/b.png", alt: "b" },
          ]}
        />,
      );

      expect(screen.getAllByRole("img")).toHaveLength(2);
      expect(
        screen.getAllByRole("button", { name: "이미지 제거" }),
      ).toHaveLength(2);
    });

    it("calls onRemoveImage with the clicked image index", async () => {
      const user = userEvent.setup();
      const onRemoveImage = vi.fn();
      render(
        <ChatboxComposer
          variant="image"
          images={[
            { src: "/a.png", alt: "a" },
            { src: "/b.png", alt: "b" },
          ]}
          onRemoveImage={onRemoveImage}
        />,
      );

      const removeButtons = screen.getAllByRole("button", {
        name: "이미지 제거",
      });
      await user.click(removeButtons[1]);

      expect(onRemoveImage).toHaveBeenCalledWith(1);
    });

    it("actually removes the image from the DOM when uncontrolled", async () => {
      const user = userEvent.setup();
      render(
        <ChatboxComposer
          variant="image"
          defaultImages={[
            { src: "/a.png", alt: "a" },
            { src: "/b.png", alt: "b" },
          ]}
        />,
      );

      expect(screen.getAllByRole("img")).toHaveLength(2);

      const removeButtons = screen.getAllByRole("button", {
        name: "이미지 제거",
      });
      await user.click(removeButtons[0]);

      expect(screen.getAllByRole("img")).toHaveLength(1);
    });

    it("shows the images row even without variant='image' once a file is attached", async () => {
      // Once a real file is added via the attach button, the thumbnail should show regardless of the variant value
      const user = userEvent.setup();
      render(<ChatboxComposer variant="default" />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["dummy"], "photo.png", { type: "image/png" });

      await user.upload(fileInput, file);

      expect(screen.getAllByRole("img")).toHaveLength(1);
    });

    it("calls onAttach when a file is selected", async () => {
      const user = userEvent.setup();
      const onAttach = vi.fn();
      render(<ChatboxComposer onAttach={onAttach} />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["dummy"], "photo.png", { type: "image/png" });

      await user.upload(fileInput, file);

      expect(onAttach).toHaveBeenCalledTimes(1);
    });

    it("constrains the attach input to images", () => {
      render(<ChatboxComposer />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

      expect(fileInput).toHaveAttribute("accept", "image/*");
      expect(fileInput).toHaveAttribute("multiple");
    });
  });

  describe("chip filter (variant=chips)", () => {
    it("renders the 3 fixed chip labels with 'All' selected by default", () => {
      render(<ChatboxComposer variant="chips" />);

      const all = screen.getByRole("button", { name: "All" });
      const image = screen.getByRole("button", { name: "Image" });
      const text = screen.getByRole("button", { name: "Text" });

      expect(all).toHaveAttribute("aria-pressed", "true");
      expect(image).toHaveAttribute("aria-pressed", "false");
      expect(text).toHaveAttribute("aria-pressed", "false");
    });

    it("switches selection on click and calls onChipChange", async () => {
      const user = userEvent.setup();
      const onChipChange = vi.fn();
      render(<ChatboxComposer variant="chips" onChipChange={onChipChange} />);

      const text = screen.getByRole("button", { name: "Text" });
      await user.click(text);

      expect(onChipChange).toHaveBeenCalledWith(2);
      expect(text).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });

    it("respects a controlled selectedChip prop", () => {
      render(<ChatboxComposer variant="chips" selectedChip={1} />);

      expect(screen.getByRole("button", { name: "Image" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });
  });

  it("disables chip row when disabled", () => {
    render(<ChatboxComposer variant="chips" disabled />);
    expect(screen.getByRole("button", { name: "All" })).toBeDisabled();
  });

  it("forwards shouldForceDark through to the underlying Chatbox", () => {
    const { container } = render(<ChatboxComposer shouldForceDark={false} />);

    const root = container.firstElementChild as HTMLElement;

    expect(root).not.toHaveClass("dark");
  });

  it("forwards showAttachButton through to the underlying Chatbox", () => {
    render(<ChatboxComposer showAttachButton={false} />);

    expect(screen.queryByLabelText("첨부")).toBeNull();
  });

  it("forwards textarea props through to the underlying Chatbox", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatboxComposer onSend={onSend} placeholder="Ask anything." />);

    const textarea = screen.getByPlaceholderText("Ask anything.");
    await user.type(textarea, "hello");
    await user.click(screen.getByRole("button", { name: "전송" }));

    expect(onSend).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue("");
  });
});
