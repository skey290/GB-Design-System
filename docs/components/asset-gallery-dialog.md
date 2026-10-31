# AssetGalleryDialog

- Code: `components/app/asset-gallery-dialog/asset-gallery-dialog.tsx` (`asset-gallery-dialog.module.css`, `asset-gallery-dialog.stories.tsx`, `asset-gallery-dialog.test.tsx`, `index.ts`)
- Figma: [❄️ GB_Assets](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=9025-11979) — `Asset Gallery Dialog` component set, on the `Component` page next to `Part/Asset Gallery` (AssetGalleryCard). `Type` variant with 4 values covering the visually distinct looks: Self Portrait browse, Reference browse (My Reference empty), Reference browse (My Reference added — shows the delete-X card), Self Portrait style-select. Interactive-only states (delete-blocked warning, archived-Self dropdown, reference-create, picker mode) aren't duplicated here — Storybook is the source of truth for behavior; Figma covers what a given screen looks like.

## Overview

The asset management modal shared by the Self app (`app/review/assets/page.tsx`) and Content Studio (`PostingModal`). One component, two modes:

| Mode                             | Trigger                | Tabs show                                                                       | Footer                                       |
| -------------------------------- | ---------------------- | ------------------------------------------------------------------------------- | -------------------------------------------- |
| Browse/manage (default)          | `isPickerMode` omitted | Self Portrait grid (with a "..." menu per image) / Reference grid (browse-only) | None                                         |
| Pick references (Content Studio) | `isPickerMode`         | Same tabs, but Reference images become checkboxes                               | "Select (n)" button → `onUseReferenceImages` |

Beyond browsing, the dialog has two in-place creation steps that replace the tab content (the dialog itself never resizes except for the reference-create step, which hugs its content):

- **Self Portrait style-select** — opened by uploading via the empty Self Portrait card, or by "Edit Profile Portrait" on an existing one. Shows the uploaded photo next to a 2×2 grid of style cards. A fresh upload uses independent checkboxes (can create several styles at once via `onGenerate`); editing an existing portrait switches the grid to a `radiogroup` (one replacement only, via `onReplacePortrait`).
- **Reference-create** — opened by uploading via the Reference tab's empty card. Shows the uploaded photo next to a preset grid; the raw upload is already added to "My Reference" immediately, independent of this step.

Other behaviors:

- Deleting the only remaining Self Portrait is blocked — instead of removing it, a "Keep at least one Self Portrait" warning shakes into view on the card for 2 seconds.
- "Set as main Portrait" calls `onSetMainPortrait` and closes the dialog.
- The "for [Self]" header dropdown (`selves`) can include archived Selves alongside active ones — see `app/review/assets/page.tsx` for how the host page tags archived entries with a muted label and a permanent-delete trailing icon (via `Select`'s `shouldFitContent` + `DropdownListOption`'s `muted`/`trailingIcon` props).

## When to use

- Any entry point that lets a user browse/manage a Self's portrait and references (Self app), or pick reference images for a post (Content Studio).

## How to use

```tsx
// Self app — browse/manage, no picker footer
<AssetGalleryDialog
  open={galleryOpenForSelfId !== null}
  onOpenChange={(open) => !open && setGalleryOpenForSelfId(null)}
  selves={selves.map((self) => ({ value: self.id, label: self.label }))}
  selfId={galleryOpenForSelfId ?? ""}
  onSelfIdChange={setGalleryOpenForSelfId}
  portraitImages={portraitImagesBySelfId[galleryOpenForSelfId ?? ""] ?? []}
  onGenerate={handleGeneratePortrait}
  onSetMainPortrait={handleSetMainPortrait}
  onReplacePortrait={handleReplacePortrait}
  onUseReferenceImages={handleUseReferenceImages}
/>

// Content Studio (PostingModal) — picker mode, Reference tab pre-selected
<AssetGalleryDialog
  open={galleryOpen}
  onOpenChange={setGalleryOpen}
  selves={[{ value: "this-post", label: "This Post" }]}
  selfId="this-post"
  onSelfIdChange={() => {}}
  portraitImages={[]}
  onGenerate={noop}
  onSetMainPortrait={noop}
  onReplacePortrait={noop}
  onUseReferenceImages={handleUseReferenceImages}
  isPickerMode
  initialTabIndex={1}
/>
```

In Storybook, toggling `isPickerMode` in the Playground's Controls panel switches the canvas between these two looks and updates the "Show code" panel to the matching call site's real code (see the `source.transform` in `asset-gallery-dialog.stories.tsx`) — no need to read both files side by side.

## Props

| Prop                        | Type                                             | Notes                                                                                                                                                                                                                                                                                   |
| --------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open` / `onOpenChange`     | `boolean` / `(open: boolean) => void`            | Fully controlled — no built-in trigger.                                                                                                                                                                                                                                                 |
| `selves`                    | `SelectOption[]`                                 | Options for the header "for" dropdown.                                                                                                                                                                                                                                                  |
| `selfId` / `onSelfIdChange` | `string` / `(selfId: string) => void`            | Which self's gallery is shown.                                                                                                                                                                                                                                                          |
| `selfLabel`                 | `string`                                         | Replaces the "for" dropdown with a static label. Always used (falling back to the matching `selves` label if omitted) when `isPickerMode` is set — picking references has no "self" to switch, so the dropdown never renders in that mode regardless of whether `selfLabel` was passed. |
| `portraitImages`            | `AssetGalleryPortraitImage[]`                    | That self's Self Portrait images (archived images for the same self are merged in internally via `getArchivedImages`).                                                                                                                                                                  |
| `onGenerate`                | `(imageSrc: string) => void`                     | Called once per selected style card after a fresh upload.                                                                                                                                                                                                                               |
| `onSetMainPortrait`         | `(imageSrc: string) => void`                     | "Set as main Portrait" menu action.                                                                                                                                                                                                                                                     |
| `onReplacePortrait`         | `(imageId: string, newImageSrc: string) => void` | "Edit Profile Portrait" → style pick, replaces in place.                                                                                                                                                                                                                                |
| `onUseReferenceImages`      | `(imageSrcs: string[]) => void`                  | Picker mode's "Select" confirm.                                                                                                                                                                                                                                                         |
| `initialTabIndex`           | `0 \| 1`                                         | Tab shown on open. Default `0` (Self Portrait).                                                                                                                                                                                                                                         |
| `colorScheme`               | `"dark" \| "light"`                              | Default `"dark"`.                                                                                                                                                                                                                                                                       |
| `isPickerMode`              | `boolean`                                        | Adds checkboxes + the "Select" footer to the Reference tab, and forces the "for" field to plain text (see `selfLabel`). Default `false`.                                                                                                                                                |
