# Input search

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3981-19811) · node-id `3981:19811`
Code: `components/ui/input-search/input-search.tsx`

## Overview

A single-line search field with a magnifying-glass icon on the left. It composes the shared [Input](./input.md) with its border and background stripped, while the outer wrapper owns the border, shadow, and focus ring.

## When to use

- Above a list or gallery, to take a search query.
- **Running the search is not this component's job.** Enter handling, debouncing, and dispatching the query belong to the consumer. This component only holds the text.

## When not to use

- **Ordinary text entry** → [Input](./input.md). The search icon itself signals "search".

## How to use

```tsx
// Basic
<InputSearch placeholder="Search placeholder" />

// Controlled, with the consumer running the search
<InputSearch
  value={query}
  onValueChange={setQuery}
  onKeyDown={(e) => e.key === "Enter" && runSearch(query)}
/>

// Fill the parent instead of the fixed 344px
<InputSearch shouldFitContainer />

// Disabled
<InputSearch disabled />
```

## Structure

Five files per the project component rule: `input-search.tsx` / `input-search.module.css` / `input-search.stories.tsx` / `input-search.test.tsx` / `index.ts`.

```
<div>                      owns border, background, shadow, focus ring. height 36, gap 12
  <Search />               lucide magnifier, 16px, leading
  <Input isBare />         the bare field, flex: 1
```

- **The search icon leads**, so the icon-to-text gap is **12px** — different from the trailing-icon gap inside `Input` (8px).
- The inner `Input` is composed with `isBare`, which drops its own border, background, padding, radius, and focus ring. All visible chrome belongs to the wrapper, so the ring is never drawn twice.
- `Input` defaults to `type="textfield"`, which has no trailing icon, so nothing needs to be turned off.

## Props

`InputSearchProps` extends `InputProps`, omitting `value` / `defaultValue` / `onValueChange` / `className` and redeclaring them.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Value when controlled |
| `defaultValue` | `string` | — | Initial value when uncontrolled |
| `onValueChange` | `(value: string) => void` | — | Called when the value changes |
| `placeholder` | `string` | `"Search placeholder"` | Sample text shown while empty |
| `disabled` | `boolean` | — | Disabled state |
| `shouldFitContainer` | `boolean` | `false` | Stretch to the parent width instead of the fixed 344px |
| `className` | `string` | — | Merged onto the outer wrapper |

Other native `<input>` attributes pass through `...inputProps` to the inner `Input` (`onKeyDown`, `name`, `autoFocus`, …).

## Variants

There is no `variant` prop. Figma has one axis, `Status`, with four values — `default` / `active` / `filled` / `disabled`. There is no `error`.

| Figma `Status` | Trigger | Background | Border | Text |
| --- | --- | --- | --- | --- |
| `default` | empty, not focused | `--gb-background-default` | `--gb-border-default` | `--gb-text-subtle` |
| `filled` | has a value | `--gb-background-default` | `--gb-border-default` | `--gb-text-default` |
| `active` | hover or focus | `--gb-background-default` | `--gb-border-static-gray` | `--gb-text-default` |
| `disabled` | `disabled` | `--gb-background-disabled` | `--gb-border-overlay` | `--gb-text-static-gray` |

## States and behaviors

| Property | Value |
| --- | --- |
| Height | 36px |
| Width | 344px, or 100% with `shouldFitContainer` |
| Horizontal padding | `--gb-spacing-3` (12px) |
| Icon gap | `--gb-spacing-3` (12px) |
| Radius | `--gb-radius-scale-md` |
| Shadow | `--gb-shadow-xs` (default, filled, disabled) |
| Focus ring | `--gb-shadow-focus-ring` — **replaces** `shadow-xs` while active |
| Icon color | `--gb-icon-default`, `--gb-icon-static-gray` when disabled |

- **`active` is not a prop.** The same declarations are applied to `:hover` and `:focus-within`, because Figma's `active` covers both. Hover sits inside `@media (hover: hover)` so touch devices do not latch it.
- **Disabled is not a dimming.** Instead of lowering opacity it uses an opaque palette of its own, with `pointer-events: none` blocking hover changes. The palette is applied by the wrapper; the inner `Input` contributes nothing because `isBare` already cleared its background and border.

## Composition with other components

- **Input** (`components/ui/input`): the field itself, composed with `isBare`.

> In Figma, `Input search` does **not** use a `Part/Input` instance — the icon and text sit directly under the root. The code is more compositional than the design file here.

Used by `components/app/gnb`, which overrides the width to 234px.
