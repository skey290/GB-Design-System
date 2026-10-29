# InputForm

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=5084-3716) — `Input form` (node-id `5084:3716`)
Code: `components/ui/input-form/input-form.tsx`

## Overview

A **composite block** that toggles four input rows — Textfield, Upload, Select, Link — on and off with booleans. Designed so a consumer enables only the slots it needs.

If you need a single bare input box, use the base [`Input`](./input.md) (`components/ui/input`) instead.

## When to use

- To present several form rows as one block, enabling only the rows you need.
- When the rows must share identical dimensions, borders, and focus rings — each row is an `Input` or `Select` instance, so they match automatically.

## When not to use

- A single input box → `Input`.
- File upload only → either turn off the other three slots here, or use `Input` with `type="upload"` directly.

## How to use

```tsx
import { InputForm } from "@/components/ui/input-form";

// All four slots (the Figma default)
<InputForm
  title="File Upload"
  selectOptions={MBTI_OPTIONS}
  onFileChange={(file) => setFile(file)}
/>

// Upload row only
<InputForm
  showTextfield={false}
  showSelect={false}
  showLink={false}
  onFileChange={(file) => setFile(file)}
/>
```

## Structure

Render order is fixed and the gap between rows is `--gb-spacing-3` (12px).

```
Title            text-sm-semi-bold, --gb-text-default   ← title
Textfield row    Input (type="textfield", no icon)      ← showTextfield
Upload row       Input (type="upload", Plus icon)       ← showUpload
Select row       Select (variant="primary")             ← showSelect
Link row         Input (type="link", Globe icon)        ← showLink
Description      text-xs-medium, --gb-text-subtle       ← description
```

In Figma all four rows are shared component instances — Textfield, Upload, and Link are `Part/Input`, Select is `select` (`614:2466`). The code mirrors that exactly: three `Input` instances differing only by `type`, plus one `Select`.

The gap **inside** each row, between text and icon, is `--gb-spacing-2` (8px) for all four rows, inherited from the shared components.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `"File Upload"` | Heading above the block (Figma `title`). Hidden when empty |
| `description` | `string` | Figma sample copy | Help text below the block. Hidden when empty |
| `showTextfield` | `boolean` | `true` | Show the Textfield row |
| `textfieldValue` / `onTextfieldValueChange` / `textfieldPlaceholder` | — | placeholder `"Email or Username"` | Textfield row control |
| `showUpload` | `boolean` | `true` | Show the Upload row |
| `file` / `onFileChange` / `uploadPlaceholder` / `accept` | — | placeholder `"File upload"` | Upload row control |
| `showSelect` | `boolean` | `true` | Show the Select row. Not rendered when `selectOptions` is empty |
| `selectOptions` / `selectValue` / `onSelectValueChange` / `selectPlaceholder` | — | placeholder `"MBTI"` | Select row control |
| `showLink` | `boolean` | `true` | Show the Link row |
| `linkValue` / `onLinkValueChange` / `linkPlaceholder` | — | placeholder `"https://gabrielle.ai"` | Link row control |
| `shouldFitContainer` | `boolean` | `false` | Stretch to the parent width instead of the fixed 320px |
| `className` | `string` | — | Merged onto the root wrapper |

All four slot booleans default to `true`, matching the Figma component property defaults.

## Variants

One axis, `Status`, with three values — `default` / `active` / `filled`. There is no `disabled` or `error`.

None of the three is a React prop: `active` is each row's `:focus-within`, and `filled` follows from whether that row has a value.

Figma's `Status=active` draws a focus ring on all four rows **at once**. Four fields cannot actually be focused simultaneously, so that frame reads as a mockup showing the active look, and the code applies it per row.

## States and behaviors

Trailing icon per row:

| Row | Icon | Empty | Has value |
| --- | --- | --- | --- |
| Textfield | none | — | — |
| Upload | `lucide/plus` | `--gb-icon-subtle` | `--gb-icon-default` |
| Select | `lucide/chevron-down` (`chevron-up` when open) | `--gb-icon-subtle` | `--gb-icon-default` |
| Link | `lucide/globe` | `--gb-icon-subtle` | `--gb-icon-default` |

Icons show in all three Status values and **only the color changes with whether a value exists** — the same rule as the base `Input`.

Shared across rows: height 36px, `--gb-spacing-3` horizontal padding, `--gb-radius-scale-md`, `--gb-border-1`. On focus the border becomes `--gb-border-static-gray` with `--gb-shadow-focus-ring`.

## Composition with other components

- **`Input`** (`components/ui/input`): the Textfield, Upload, and Link rows, via `type="textfield" | "upload" | "link"`.
- **`Select`** (`components/ui/select`): the Select row. `variant="primary"` matches the Figma trigger spec, and the dropdown panel (210px, 8px offset, 32px items, `shadow-md`) is already aligned.

Used by `components/app/goal-setting`.

## Placeholder behavior differs between the Upload row and the text rows

In Figma, the `active` frames of `Part/Input` `textfield` and `link` have no text layer at all, while `upload/active` keeps its text in `text/default`. The code follows that: the text rows hide their placeholder on focus, and the Upload row keeps its label and brightens it. Once a file is chosen, the file name is shown and never hidden.
