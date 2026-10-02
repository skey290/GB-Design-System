import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Chatbox } from "./chatbox";

describe("Chatbox", () => {
  it("renders a textarea with the default placeholder", () => {
    render(<Chatbox />);

    expect(
      screen.getByPlaceholderText("Please share your ideas."),
    ).toBeInTheDocument();
  });

  it("does not render an images row, chip row, or sentence-option row when variant is default", () => {
    render(<Chatbox variant="default" />);

    expect(screen.queryAllByRole("img")).toHaveLength(0);
    expect(
      screen.queryByRole("button", { name: "All" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "I would like to change Asset Image",
      }),
    ).not.toBeInTheDocument();
  });

  describe("images (variant=image)", () => {
    it("renders an images row with remove buttons", () => {
      render(
        <Chatbox
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
        <Chatbox
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
        <Chatbox
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
      // 첨부 버튼으로 실제 파일을 추가하면 variant 값과 무관하게 썸네일이 보여야 함
      const user = userEvent.setup();
      render(<Chatbox variant="default" />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["dummy"], "photo.png", { type: "image/png" });

      await user.upload(fileInput, file);

      expect(screen.getAllByRole("img")).toHaveLength(1);
    });
  });

  describe("chip filter (variant=chip)", () => {
    it("renders the 3 fixed chip labels with 'All' selected by default", () => {
      render(<Chatbox variant="chip" />);

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
      render(<Chatbox variant="chip" onChipChange={onChipChange} />);

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
      render(<Chatbox variant="chip" selectedChip={1} />);

      expect(screen.getByRole("button", { name: "Image" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });
  });

  describe("sentence option (variant=sentence-option)", () => {
    it("renders the 3 fixed sentence-option rows", () => {
      render(<Chatbox variant="sentence-option" />);

      expect(
        screen.getByRole("button", {
          name: "I would like to change Asset Image",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: "I would like to change Short Text (One Liner)",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: "I would like to change Long Text (Description)",
        }),
      ).toBeInTheDocument();
    });

    it("switches selection on click and calls onSentenceOptionChange", async () => {
      const user = userEvent.setup();
      const onSentenceOptionChange = vi.fn();
      render(
        <Chatbox
          variant="sentence-option"
          onSentenceOptionChange={onSentenceOptionChange}
        />,
      );

      const longText = screen.getByRole("button", {
        name: "I would like to change Long Text (Description)",
      });
      await user.click(longText);

      expect(onSentenceOptionChange).toHaveBeenCalledWith(2);
      expect(longText).toHaveAttribute("aria-pressed", "true");
    });

    it("respects a controlled defaultSelectedSentenceOption prop", () => {
      render(
        <Chatbox variant="sentence-option" defaultSelectedSentenceOption={1} />,
      );

      expect(
        screen.getByRole("button", {
          name: "I would like to change Short Text (One Liner)",
        }),
      ).toHaveAttribute("aria-pressed", "true");
    });
  });

  it("opens the native file picker when the attach button is clicked", async () => {
    const user = userEvent.setup();
    render(<Chatbox />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");

    await user.click(screen.getByRole("button", { name: "첨부" }));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("adds a thumbnail when a file is selected via the attach input", async () => {
    const user = userEvent.setup();
    render(<Chatbox />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["dummy"], "photo.png", { type: "image/png" });

    await user.upload(fileInput, file);

    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("updates its value when typed into (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Chatbox />);

    const textarea = screen.getByPlaceholderText("Please share your ideas.");
    await user.type(textarea, "hello");

    expect(textarea).toHaveValue("hello");
  });

  it("calls onValueChange with the next value when typed into", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Chatbox onValueChange={onValueChange} />);

    await user.type(
      screen.getByPlaceholderText("Please share your ideas."),
      "hi",
    );

    expect(onValueChange).toHaveBeenLastCalledWith("hi");
  });

  it("calls onAttach when the attach button is clicked", async () => {
    const user = userEvent.setup();
    const onAttach = vi.fn();
    render(<Chatbox onAttach={onAttach} />);

    await user.click(screen.getByRole("button", { name: "첨부" }));

    expect(onAttach).toHaveBeenCalledTimes(1);
  });

  it("calls onSend when the send button is clicked", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Chatbox onSend={onSend} />);

    await user.click(screen.getByRole("button", { name: "전송" }));

    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it("clears the input value after the send button is clicked", async () => {
    const user = userEvent.setup();
    render(<Chatbox />);

    const textarea = screen.getByPlaceholderText("Please share your ideas.");
    await user.type(textarea, "hello");
    expect(textarea).toHaveValue("hello");

    await user.click(screen.getByRole("button", { name: "전송" }));

    expect(textarea).toHaveValue("");
  });

  it("disables the textarea and attach/send buttons when disabled", () => {
    render(<Chatbox disabled />);

    expect(
      screen.getByPlaceholderText("Please share your ideas."),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "첨부" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "전송" })).toBeDisabled();
  });

  it("disables chip and sentence-option rows when disabled", () => {
    const { rerender } = render(<Chatbox variant="chip" disabled />);
    expect(screen.getByRole("button", { name: "All" })).toBeDisabled();

    rerender(<Chatbox variant="sentence-option" disabled />);
    expect(
      screen.getByRole("button", {
        name: "I would like to change Asset Image",
      }),
    ).toBeDisabled();
  });
});
