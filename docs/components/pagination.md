# Pagination

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3331-2811) · node-id `3331:2811`
Code: `components/ui/pagination/pagination.tsx`

## Overview

Navigation across a paged list. It comes as a numbered list (`number`) or a compact row of dots (`dot`); `number` lays out horizontally or vertically, `dot` only horizontally (see Variants below). Long page counts collapse to an ellipsis around the current page.

The root is `width: fit-content` — Figma sets `Pagination` to HUG, so it takes only as much room as its items and never stretches to the parent width.

## When to use

- When the user should pick a page directly from a multi-page list → `type="number"`.
- Where only the **current position** needs indicating, as in a carousel or onboarding → `type="dot"`.

## When not to use

- Not for infinite scroll or "load more" patterns — the total page count must be known.

## How to use

```tsx
// Numbered list (default)
<Pagination totalPages={10} currentPage={page} onPageChange={setPage} />

// Expose more numbers either side of the current page
<Pagination totalPages={20} currentPage={page} onPageChange={setPage} siblingCount={2} />

// Dot indicator
<Pagination type="dot" totalPages={5} currentPage={page} onPageChange={setPage} />

// Vertical layout (arrows become up/down, and so does the ellipsis)
<Pagination direction="vertical" totalPages={10} currentPage={page} onPageChange={setPage} />
```

## Structure

Five files per the project component rule: `pagination.tsx` / `pagination.module.css` / `pagination.stories.tsx` / `pagination.test.tsx` / `index.ts`.

```
number:
<nav>                      flex, gap 4 (flex-col when vertical)
  <button>                 ◀ / ▲   36×36, radius 8
  <button>                 number  36×36, radius 8
  <span>                   …       36×36, non-interactive
  <button>                 ▶ / ▼

dot:
<nav>                      flex, gap 4
  <button>                 6×6 round dot
```

- Number cells, arrows, and the ellipsis are **all the same 36×36 box**. Only the ellipsis is a `<span>` rather than a button.
- The dot is 6px, a literal rather than `--gb-spacing-1-5` (also 6px) — per this project's rule, a component's own dimensions are literal px, not spacing tokens, regardless of whether a same-valued token exists.

## Props

| Prop           | Type                         | Default        | Description                                                              |
| -------------- | ---------------------------- | -------------- | ------------------------------------------------------------------------ |
| `totalPages`   | `number`                     | **required**   | Total number of pages                                                    |
| `currentPage`  | `number`                     | **required**   | Current page (1-based)                                                   |
| `onPageChange` | `(page: number) => void`     | **required**   | Page change callback                                                     |
| `type`         | `"number" \| "dot"`          | `"number"`     | Display form (Figma `Type`)                                              |
| `direction`    | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction (Figma `Direction`)                                     |
| `siblingCount` | `number`                     | `1`            | How many numbers to show either side of the current page (`number` only) |

The rest of `React.HTMLAttributes<HTMLElement>` is inherited, except `onChange`.

## Variants

Figma's `Type` (number / dot) and `Direction` (Horizontal / Vertical) are not a full 2×2 — only **three** combinations actually exist. `dot × Vertical` has no Figma design at all.

| Combination         | Icons                                               | Figma                                                                                                                        |
| ------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| number × horizontal | `chevron-left` / `chevron-right` / `ellipsis`       | exists                                                                                                                       |
| number × vertical   | `chevron-up` / `chevron-down` / `ellipsis-vertical` | exists                                                                                                                       |
| dot × horizontal    | none (dots only)                                    | exists                                                                                                                       |
| dot × vertical      | none (dots only)                                    | **not defined in Figma** — reachable in code (`type="dot" direction="vertical"`), but there is no design to check it against |

**Changing direction changes the icons too** — left/right arrows must not survive into a vertical layout.

Figma also has a separate cell atom, `Part/pagination` (`3641:9731`), with its own `Type` (dot / number / ellipsis / chevron) × `Style` (7 values) × `Status` (default / active) — 16 variants that this component's cells are built from design-wise. Code has no matching sub-component for it; `Pagination` renders its own `<button>` markup directly rather than compositing a `Part/Pagination`-equivalent.

## States and behaviors

| Property                        | Value                                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Cell size                       | 36 × 36                                                                                                                   |
| Cell radius                     | `--gb-radius-scale-md` (8px)                                                                                              |
| Item gap                        | `--gb-spacing-1` (4px)                                                                                                    |
| Icon                            | 16px, `--gb-icon-default`                                                                                                 |
| Number text                     | `Text-sm/Medium`, `--gb-text-default`                                                                                     |
| **Current page**                | background `--gb-background-default` + 1px `--gb-border-default`                                                          |
| Other numbers / arrows, hovered | same as current page — Figma's `Part/pagination` `Status=active` box applies on hover/press, not just to the current page |
| Other numbers                   | transparent background, no border                                                                                         |
| Disabled arrow                  | `--gb-opacity-50` (code-only — Figma's `Status` axis on `Part/pagination` has no `disabled` value at all)                 |
| Dot size                        | 6px, radius full                                                                                                          |
| Dot (current / other)           | `--gb-icon-default` (filled) / `--gb-icon-pressed` fill + `--gb-icon-faint` 1px stroke                                    |
| Focus ring                      | `--gb-shadow-focus-ring` (code-only accessibility addition — not in Figma)                                                |

- **Only the current page gets a border and background.** Every other number is transparent, showing text alone.
- The previous arrow on the first page and the next arrow on the last are `disabled` and dimmed to 50% opacity.
- The ellipsis is not a click target and gets no hover background.
- The number of exposed cells is `siblingCount * 2 + 5` (first, last, current, the siblings either side, and two ellipses).

## Composition with other components

It does **not** use the shared `Button`. The Figma page cell is 36×36 at radius 8 with a border only on the current page, a palette that matches no Button variant.
