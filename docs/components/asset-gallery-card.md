# AssetGalleryCard

- Code: `components/assets/ui/asset-gallery-card/asset-gallery-card.tsx` (`asset-gallery-card.module.css`, `asset-gallery-card.stories.tsx`, `asset-gallery-card.test.tsx`, `index.ts`)
- Figma: [📌 GB_UXUI](https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8012-10389) `Asset gallery card` node `8012:10389`

## Overview

A single tile in Assets' image gallery grid. Which of four looks it renders is derived entirely from which props are given — there is no `type`/`variant` prop:

| Look             | Trigger                                          | Shows                                                                      |
| ---------------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| Empty (upload)   | `image` omitted                                  | A dashed upload tile with a file input                                     |
| Default (filled) | `image` given, no `title`/`isSelected`           | Image + optional `date` label + optional `...` menu                        |
| Selectable       | `image` given, `isSelected` given (even `false`) | Image + a checkbox indicator, clickable/keyboard-toggleable                |
| Style card       | `image` + `title` given                          | Image + a text panel (`title`/`description`) + always a checkbox indicator |

## When to use

- The image tiles in Assets' gallery grid — reference photos, style boards, or uploaded portraits.

## How to use

```tsx
// Empty upload tile
<AssetGalleryCard onUpload={(file) => handleUpload(file)} />

// Default filled card with a date and a "..." menu
<AssetGalleryCard
  image={asset.url}
  alt={asset.alt}
  date={asset.date}
  menuOptions={MENU_OPTIONS}
  onSelectMenuOption={(value) => handleMenuAction(value)}
/>

// Selectable card
<AssetGalleryCard
  image={asset.url}
  alt={asset.alt}
  isSelected={selected}
  onSelectedChange={setSelected}
/>

// Style card
<AssetGalleryCard
  image={asset.url}
  alt={asset.alt}
  title={asset.title}
  description={asset.description}
  isSelected={selected}
  onSelectedChange={setSelected}
/>
```

## Props

| Prop                 | Type                          | Default | Description                                                                                                                    |
| -------------------- | ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `image`              | `string`                      | —       | Image URL. Omitted renders the empty upload card                                                                               |
| `alt`                | `string`                      | `""`    | Alt text for the image                                                                                                         |
| `date`               | `string`                      | —       | Date label on the filled card. Ignored on the style card                                                                       |
| `onUpload`           | `(file: File) => void`        | —       | Called with the selected file when uploading via the empty card                                                                |
| `menuOptions`        | `SelectOption[]`              | —       | Filled card's `...` dropdown items. Omitted hides the trigger. Ignored when `isSelected` is given or on the style card         |
| `onSelectMenuOption` | `(value: string) => void`     | —       | Called with the selected option's value                                                                                        |
| `title`              | `string`                      | —       | Card title. Given switches the card into the style card look (always selectable)                                               |
| `description`        | `string`                      | —       | Description below the title on the style card                                                                                  |
| `isSelected`         | `boolean`                     | —       | Checked state. Passing it (even `false`) switches the card into the selectable look. Always treated as given on the style card |
| `onSelectedChange`   | `(selected: boolean) => void` | —       | Called with the next checked state on click or Space/Enter                                                                     |
| `className`          | `string`                      | —       | Merged onto the root                                                                                                           |

## Structure

- Empty: `<label>` wrapping a hidden `<input type="file" accept="image/*">`, a plus-circle icon, and "Upload Your Image" text.
- Filled: `<div>`, `role="checkbox"` + `aria-checked` + `tabIndex={0}` only when selectable (selectable or style card).
- Style card branches to its own image/text-panel layout; default/selectable share the plain image + hover-ring + date/menu layout.
- The `...` menu reuses `components/ui/select` (`variant="icon-ghost"`, `icon="ellipsis-icon"`) with a hover-intent open/close (150ms close delay via `onTriggerMouseLeave`/`onContentMouseEnter`/`onContentMouseLeave`), not a raw dropdown.
- The checkbox indicator is a decorative `<span aria-hidden="true">` with a `Check` icon — the real checked semantics live on the root's `role="checkbox"`/`aria-checked`, not on the indicator itself.

## States and behaviors

- Hover ring (selectable/style card) and the empty card's hover border + plus icon use `--gb-border-invert`/`--gb-icon-default` — dark in light mode, light in dark mode. Not `--gb-border-static-white`/`--gb-icon-static-white`, which stay the same color in both modes.
- Selectable and style cards toggle on click anywhere on the card, or Space/Enter when focused — there is no separate checkbox hit target.
- The `...` menu and the checkbox indicator are mutually exclusive: `menuOptions` is ignored once the card becomes selectable (`isSelected` given) or is a style card.
- `isSelected`/`isStyleCard` are derived, not stored — the component holds no internal selected state; the parent (or, in Storybook, a demo wrapper) owns it via `onSelectedChange`.
