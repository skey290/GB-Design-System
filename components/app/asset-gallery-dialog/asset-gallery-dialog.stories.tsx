import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn, userEvent, within } from "storybook/test";
import { useDarkMode } from "storybook-dark-mode";

import {
  AssetGalleryDialog,
  type AssetGalleryDialogProps,
  type AssetGalleryPortraitImage,
} from "./asset-gallery-dialog";

const SELVES = [
  { value: "self-1", label: "Data Scientist" },
  { value: "self-2", label: "Office Worker" },
];

const INITIAL_PORTRAITS: Record<string, AssetGalleryPortraitImage[]> = {
  "self-1": [
    {
      id: "seed-1",
      src: "/images/personas/self-default.jpg",
      alt: "Data Scientist",
    },
  ],
  "self-2": [
    {
      id: "seed-2",
      src: "/images/personas/team-leader.jpg",
      alt: "Office Worker",
    },
  ],
};

// Real pages (Self app's Asset Gallery entry points, Content Studio's
// PostingModal) each hold this same open/selfId/portraitImages state
// themselves and pass it in as props — this wrapper is only here so the
// canvas has somewhere to keep that state. No trigger button: the dialog is
// the thing being reviewed, so it should just be on screen immediately.
function ControlledAssetGalleryDialog(props: AssetGalleryDialogProps) {
  // No separate colorScheme Control — the dialog just follows Storybook's
  // own dark/light toolbar toggle directly (no args round-trip, unlike the
  // earlier useArgs() attempt, which crashed with "Rendered more hooks than
  // during the previous render" in this Storybook setup).
  const isDark = useDarkMode();
  const [open, setOpen] = React.useState(props.open);
  // `useState(props.open)` only reads `open` on first mount — toggling the
  // Controls panel's `open` arg afterward re-renders this component without
  // remounting it, so without this the dialog gets stuck on whatever `open`
  // happened to be the first time (e.g. a URL with `open:!false` baked in).
  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);
  const [selfId, setSelfId] = React.useState(props.selfId);
  const [portraitsBySelfId, setPortraitsBySelfId] =
    React.useState(INITIAL_PORTRAITS);

  return (
    <AssetGalleryDialog
      {...props}
      open={open}
      onOpenChange={setOpen}
      selves={SELVES}
      selfId={selfId}
      onSelfIdChange={(nextId) => {
        setSelfId(nextId);
        props.onSelfIdChange(nextId);
      }}
      portraitImages={portraitsBySelfId[selfId] ?? []}
      onGenerate={(src) => {
        setPortraitsBySelfId((prev) => ({
          ...prev,
          [selfId]: [
            ...(prev[selfId] ?? []),
            { id: `generated-${Date.now()}`, src, alt: "Generated portrait" },
          ],
        }));
        props.onGenerate(src);
      }}
      onSetMainPortrait={props.onSetMainPortrait}
      onReplacePortrait={(imageId, newSrc) => {
        setPortraitsBySelfId((prev) => ({
          ...prev,
          [selfId]: (prev[selfId] ?? []).map((image) =>
            image.id === imageId ? { ...image, src: newSrc } : image,
          ),
        }));
        props.onReplacePortrait(imageId, newSrc);
      }}
      onUseReferenceImages={props.onUseReferenceImages}
      colorScheme={isDark ? "dark" : "light"}
    />
  );
}

// Real usage differs enough between the two call sites (selector vs. static
// label, picker footer, light vs. dark) that one fixed code sample would lie
// for whichever caller it doesn't match — so Show code switches on
// `isPickerMode`, the prop that actually distinguishes them.
const SELF_APP_SOURCE = `<AssetGalleryDialog
  open={open}
  onOpenChange={setOpen}
  selves={selves.map((self) => ({ value: self.id, label: self.label }))}
  selfId={selfId}
  onSelfIdChange={setSelfId}
  portraitImages={portraitImagesBySelfId[selfId] ?? []}
  onGenerate={handleGenerate}
  onSetMainPortrait={handleSetMainPortrait}
  onReplacePortrait={handleReplacePortrait}
  onUseReferenceImages={handleUseReferenceImages}
  isPickerMode={false}
/>`;

const CONTENT_STUDIO_SOURCE = `// AssetGalleryDialog's "for [self]" selector has no meaning here — the
// dialog is only ever opened to pick Reference images for the post being
// edited, never to manage a particular Self's portrait.
<AssetGalleryDialog
  open={isDialogOpen}
  onOpenChange={setIsDialogOpen}
  initialTabIndex={1}
  selves={[{ value: "post", label: "This Post" }]}
  selfId="post"
  onSelfIdChange={() => {}}
  selfLabel={selfLabel}
  portraitImages={[]}
  onGenerate={() => {}}
  onSetMainPortrait={() => {}}
  onReplacePortrait={() => {}}
  onUseReferenceImages={handleUseReferenceImages}
  colorScheme="light"
  isPickerMode
/>`;

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=9025-11979";

const meta = {
  title: "App/AssetGalleryDialog",
  component: AssetGalleryDialog,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          "Asset management modal shared by the Self app (browse/manage a Self's portrait + references) and Content Studio (pick reference images for a post). Covers browsing both tabs, uploading or editing a Self Portrait via a 2x2 style pick, creating a reference from a preset, and the delete-blocked warning when only one Self Portrait remains.",
        story:
          "Canvas uses a demo-only local-state wrapper (open state + a per-self portrait map) so the flow works in isolation — the dialog is open immediately, no trigger button needed. The code below is what a real page writes — see docs/components/asset-gallery-dialog.md. Toggle isPickerMode to see Content Studio's call site instead of the Self app's.",
      },
      source: {
        transform: (
          _code: string,
          context: { args?: Record<string, unknown> },
        ) =>
          context.args?.isPickerMode ? CONTENT_STUDIO_SOURCE : SELF_APP_SOURCE,
      },
    },
  },
  argTypes: {
    isPickerMode: { control: "boolean" },
    initialTabIndex: { control: "radio", options: [0, 1] },
    // No Control: the canvas follows Storybook's own dark/light toolbar
    // toggle instead (see ControlledAssetGalleryDialog) — a separate radio
    // here would just be a second, disconnected dark/light switch.
    colorScheme: { table: { disable: true } },
    // Content Studio (PostingModal) passes this instead of a `selves`
    // selector — it replaces the "for" dropdown with a static label. Set it
    // here to preview that look instead of switching files.
    selfLabel: { control: "text" },
  },
  args: {
    open: true,
    onOpenChange: fn(),
    selves: SELVES,
    selfId: "self-1",
    onSelfIdChange: fn(),
    portraitImages: INITIAL_PORTRAITS["self-1"]!,
    onGenerate: fn(),
    onUseReferenceImages: fn(),
    onSetMainPortrait: fn(),
    onReplacePortrait: fn(),
    isPickerMode: false,
    initialTabIndex: 0,
    selfLabel: undefined,
  },
  render: (args) => <ControlledAssetGalleryDialog {...args} />,
} satisfies Meta<typeof AssetGalleryDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// DialogContent renders through a Portal straight to document.body, outside
// canvasElement's own subtree — so queries here use the owner document's
// body instead of `within(canvasElement)`, which would never find it.
export const StyleSelectFreshUpload: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A fresh upload on the empty Self Portrait card opens the style-select step as independent checkboxes (can generate several styles at once).",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const fileInput = canvasElement.ownerDocument.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["dummy"], "photo.png", { type: "image/png" });
    await userEvent.upload(fileInput, file);
    await canvas.findByText("Create Self");
  },
};

export const StyleSelectEditExisting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '"Edit Profile Portrait" on an existing Self Portrait opens the same style-select step, but as a radiogroup — only one replacement style applies.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const comboboxes = await canvas.findAllByRole("combobox");
    // comboboxes[0] is the header "for" Select — [1] is the card's "..." menu.
    await userEvent.click(comboboxes[1]!);
    await userEvent.click(await canvas.findByText("Edit Profile Portrait"));
  },
};

export const ReferenceCreateStep: Story = {
  args: { initialTabIndex: 1 },
  parameters: {
    docs: {
      description: {
        story:
          "A fresh upload on the Reference tab's empty card opens the reference-create step next to a preset grid — the raw upload is already added to My Reference immediately, independent of this step.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const fileInput = canvasElement.ownerDocument.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["dummy"], "photo.png", { type: "image/png" });
    await userEvent.upload(fileInput, file);
    await canvas.findByText("Create My Reference");
  },
};

export const DeleteBlockedWarning: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Deleting the only remaining Self Portrait is blocked — a "Keep at least one Self Portrait" warning shakes into view instead of removing it.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const comboboxes = await canvas.findAllByRole("combobox");
    await userEvent.click(comboboxes[1]!);
    await userEvent.click(await canvas.findByText("Delete Self Portrait"));
    await canvas.findByText("Keep at least one Self Portrait");
  },
};

export const PickerModeSelection: Story = {
  args: { isPickerMode: true, initialTabIndex: 1 },
  parameters: {
    docs: {
      description: {
        story:
          'Content Studio\'s picker mode: selecting a Reference image enables the footer confirm button and updates its label to "Select (n)".',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await canvas.findByRole("img", { name: "Entrepreneur preset" }),
    );
    await canvas.findByRole("button", { name: "Select (1)" });
  },
};
