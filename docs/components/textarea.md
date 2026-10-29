# Textarea

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=623-3651) · node-id `623:3651`
Code: `components/ui/textarea/textarea.tsx`

## Overview

An atom that stacks a label, a multi-line input box, and an optional character counter. It wraps a single native `<textarea>`, and passing `maxLength` adds the remaining-character count below it automatically.

## When to use

- For multi-line free text. Use [Input](./input.md) for a single line and [Chatbox](./chatbox.md) for a chat composer.
- When the input has a length cap and the remaining count should be visible — supplying `maxLength` is enough.

## When not to use

- **Single-line input** → [Input](./input.md).
- **Chat message composer** → [Chatbox](./chatbox.md), which also carries the attach/send row and its slots.

## How to use

```tsx
// Basic
<Textarea title="What are you into?" placeholder="Tell me about your interests." />

// Character counter (rendered only when maxLength is given)
<Textarea title="What are you into?" maxLength={1000} />

// Controlled
<Textarea title="Bio" value={bio} onValueChange={setBio} maxLength={300} />

// Fill the parent instead of the fixed 725px
<Textarea title="What do you do for work?" shouldFitContainer value={work} onValueChange={setWork} />
```

## Structure

Five files per the project component rule: `textarea.tsx` / `textarea.module.css` / `textarea.stories.tsx` / `textarea.test.tsx` / `index.ts`.

```
<div>                                 root, flex-col, gap 12px, width 725
  <label htmlFor>                     only when title is given
  <div>                               positioning wrapper for the resize grip
    <textarea resize-none>            the input box
    <span data-slot="textarea-resize-handle">   7px custom grip, bottom right
  <span data-slot="textarea-counter"> only when maxLength is given
```

- Input box padding is **asymmetric: 12 left, 8 top/right/bottom**. The narrower right side is a fixed Figma value, but it does not leave dedicated room for the grip — Figma's text right edge and grip right edge sit at the same x (717), so the grip overlaps the text column rather than getting its own margin.
- Height is only a `min-height: 80px`, never fixed. Figma draws the box at a **fixed** 80px (not a minimum) — the "grows while dragging" behavior is a code-only extension, justified by the resize grip actually being present and functional.

## Props

`TextareaProps` extends `React.TextareaHTMLAttributes<HTMLTextAreaElement>`, omitting `value`, `defaultValue`, `onChange`, and `disabled`, and adding the following.

| Prop                 | Type                                                                  | Default | Description                                                                     |
| -------------------- | --------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------- |
| `title`              | `string`                                                              | —       | Label above the field. Omitting it renders no label                             |
| `value`              | `string`                                                              | —       | Value when controlled                                                           |
| `defaultValue`       | `string`                                                              | `""`    | Initial value when uncontrolled                                                 |
| `onValueChange`      | `(value: string) => void`                                             | —       | Called when the value changes                                                   |
| `maxLength`          | `number`                                                              | —       | Maximum length. When set, a `{remaining} characters left` counter renders below |
| `shouldFitContainer` | `boolean`                                                             | `false` | Stretch to the parent width instead of the fixed 725px                          |
| `className`          | `string`                                                              | —       | Merged onto the root `<div>`                                                    |
| `ref`                | `React.Ref<HTMLTextAreaElement>`                                      | —       | Forwarded to the `<textarea>`, set alongside the internal resize ref            |
| `...props`           | rest of `React.TextareaHTMLAttributes` (minus the omitted ones above) | —       | `placeholder`, `readOnly`, `rows`, … forwarded to the native element            |

`disabled` is omitted deliberately — Figma has no disabled state, so the native attribute is blocked from leaking through `...props`.

Figma has six properties total, three of which have no code counterpart: a `TEXT` `Title` (default `"What are you into?"`, maps to `title`), a `TEXT` `Placeholder` (default `"Tell me about your interests."`, maps to `placeholder`), and a `TEXT` `Description` (default `"1000 characters left"`) alongside its visibility `BOOLEAN`, plus boolean toggles for showing the title and placeholder. The `Description` text and its boolean are not implemented — the counter in code always reads `{remaining} characters left` computed from `maxLength`, it is not a free-text slot.

## Variants

There is no `variant` prop. Figma has one axis, `Status`, with three values — `default` / `active` / `filled` — none of which is a prop; they follow from CSS state and whether a value exists.

| Figma `Status` | Trigger            | Code                                        |
| -------------- | ------------------ | ------------------------------------------- |
| `default`      | empty, not focused | native `::placeholder` → `--gb-text-subtle` |
| `filled`       | has a value        | ordinary text color `--gb-text-default`     |
| `active`       | focused            | focus border + `--gb-shadow-focus-ring`     |

Figma's `active` frame has real text content in it (not an empty, focused field) — it depicts "focused with content", not "focused and empty". Unlike `Input`, Figma never draws Textarea focused-and-empty, so the placeholder-hides-on-focus behavior Input has doesn't apply here, and its absence isn't a gap against Figma. There is also no `hover` value on this axis — Textarea has no hover styling, and that is also not a gap.

## States and behaviors

| Property                 | Value                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Label                    | `Text-sm/Medium`, `--gb-text-default`                                                      |
| Body                     | `Text-sm/Regular`                                                                          |
| Placeholder              | `--gb-text-subtle`                                                                         |
| Counter                  | `Text-xs/Regular`, `--gb-text-subtle`                                                      |
| Border                   | `--gb-border-1`, focus switches to `--gb-border-static-gray` with `--gb-shadow-focus-ring` |
| Radius                   | `--gb-radius-scale-md`                                                                     |
| Background               | `--gb-background-default`                                                                  |
| Resize handle icon color | `--gb-icon-default`                                                                        |

- **Resize** — the native grip (`resize-y`) is replaced by Figma's own `handle-icon` (7px), because the native one cannot be restyled. Pointer dragging adjusts the height and never shrinks below 80px. The handle icon's own stroke renders about 58% thinner than Figma's asset at this size (Figma's raw 7×7 asset is 1 unit at 7px; the shared sprite symbol is a 24×24 viewBox at `stroke-width: 2`, which scales down to ~0.58px here) — not fixed, since this sprite symbol is shared and a one-off adjustment needs a decision first.
- **Counter** — `maxLength - current length`, recomputed on every keystroke. Without `maxLength` the element is not rendered at all.

## Composition with other components

Used by `components/app/known-for`, with `shouldFitContainer`. It renders its own helper/description line next to the Textarea rather than using a built-in description slot — matching the fact noted above that Figma's `Description` property isn't implemented in code.
