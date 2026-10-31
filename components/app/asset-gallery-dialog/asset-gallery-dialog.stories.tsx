import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Button } from "@/components/ui/button";

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
// canvas has somewhere to keep that state and a button to open the dialog.
function ControlledAssetGalleryDialog(props: AssetGalleryDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selfId, setSelfId] = React.useState(props.selfId);
  const [portraitsBySelfId, setPortraitsBySelfId] =
    React.useState(INITIAL_PORTRAITS);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Asset Gallery</Button>
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
      />
    </>
  );
}

const meta = {
  title: "App/AssetGalleryDialog",
  component: AssetGalleryDialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Asset management modal shared by the Self app (browse/manage a Self's portrait + references) and Content Studio (pick reference images for a post). Covers browsing both tabs, uploading or editing a Self Portrait via a 2x2 style pick, creating a reference from a preset, and the delete-blocked warning when only one Self Portrait remains.",
        story:
          "Canvas uses a demo-only local-state wrapper (open state, a per-self portrait map, and an 'Open Asset Gallery' trigger button) so the flow works in isolation. The code below is what a real page writes — see docs/components/asset-gallery-dialog.md.",
      },
      source: {
        type: "code",
        code: `<AssetGalleryDialog
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
/>`,
      },
    },
  },
  argTypes: {
    isPickerMode: { control: "boolean" },
    initialTabIndex: { control: "radio", options: [0, 1] },
    colorScheme: { control: "radio", options: ["dark", "light"] },
  },
  args: {
    open: false,
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
    colorScheme: "dark",
  },
  render: (args) => <ControlledAssetGalleryDialog {...args} />,
} satisfies Meta<typeof AssetGalleryDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
