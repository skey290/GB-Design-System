# Input

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=520-3062) — `Part/Input` (node-id `520:3062`)
Code: `components/ui/input/input.tsx`

## Overview

The base single-line input box: border, padding, placeholder, and the trailing icon implied by its `Type`. It has no label, helper text, or error message — those are composed by the higher-level fields (`InputForm`, `InputSearch`, `InputTime`, `InputPhone`) that wrap this as their base.

Figma's component set has a fourth `Type` — `social connect` (code: `"social-connect"`) — alongside `textfield` / `upload` / `link`. It renders a completely different DOM (a fixed Linkedin connect/disconnect `<button>`, not an editable field) — see [Social connect](#social-connect) below.

The Figma component set is named `Part/Input`; the code component is named `Input` because it is the atom every other input-family component is built from. The composite block Figma calls `Input form` maps to `InputForm` in code — see [`input-form.md`](./input-form.md).

## When to use

- As the **base composed into other input-family components**. `InputTime`, `InputPhone`, `InputSearch`, and `InputForm` all import it.
- Directly, only when you need a bare field and are supplying the label, helper text, and error message yourself.

## When not to use

- **Do not drop it into an app screen on its own.** It renders no label, helper text, or error message. Use one of the wrapping fields instead.

## How to use

```tsx
import { Input } from "@/components/ui/input";

// Figma `Type=textfield` (the default) — no icon
<Input placeholder="Email or Username" value={email} onValueChange={setEmail} />

// Figma `Type=link` — trailing Globe icon, native URL semantics
<Input
  type="link"
  inputType="url"
  placeholder="https://gabrielle.ai"
  value={url}
  onValueChange={setUrl}
/>

// Figma `Type=upload` — trailing Plus icon, renders a file picker
<Input
  type="upload"
  placeholder="File upload"
  accept="application/pdf"
  file={resume}
  onFileChange={setResume}
/>

// Figma `Type=social connect` — a fixed Linkedin connect button, not an editable field
<Input
  type="social-connect"
  isConnected={isLinkedinConnected}
  onConnectClick={connectLinkedin}
/>
```

Pass `value` + `onValueChange` for controlled use, or `defaultValue` alone for uncontrolled use. Passing both makes `value` win and the field behaves as controlled.

## Structure

The rendered DOM depends on `type`:

| `type` | DOM | Trailing icon |
| --- | --- | --- |
| `textfield` | a single native `<input>` | none |
| `link` | `<div>` wrapper + `<input>` + absolutely positioned icon | `lucide/Globe` |
| `upload` | `<label>` + visible `<span>` + icon + screen-reader-only `<input type="file">` | `lucide/Plus` |
| `social-connect` | a single native `<button type="button">`, leading icon | `#linkedin-icon` (sprite, not lucide), fixed brand color |

- **No label** — place one yourself in the consumer if you need it.
- **Right padding is 36px** (`--gb-spacing-9`) whenever a trailing icon is present on `textfield` / `link` / `upload`. Figma lays the text and icon out as flex siblings with `gap: 8px`, so text ellipsizes at `12px padding + 16px icon + 8px gap`. The code positions the icon absolutely and reproduces the same result with `padding-right`. Figma's `social connect` does not follow this layout — its icon is leading, not trailing, with `padding: 16px` and `gap: 6px` all around instead.
- **No validation or error message** — `isError` only recolors the border.
- `className` lands on the element that owns the visible box: the `<input>` for `textfield`, the wrapper `<div>` for `link`, the `<label>` for `upload`.

### Why `upload` renders a `<label>`

A native `<input type="file">` cannot be a controlled component, so its value can never be driven by a `value` prop. The visible row is therefore a `<label>` showing either `file.name` or the placeholder, with the real file input hidden via `.srOnly`. Clicking anywhere on the row opens the file picker through the label association.

## Props

`InputProps` extends `React.InputHTMLAttributes<HTMLInputElement>`, omitting `value`, `defaultValue`, `onChange`, and `type`, and adding the following.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"textfield" \| "upload" \| "link" \| "social-connect"` | `"textfield"` | Figma `Type` axis. Decides the trailing icon and the rendered DOM — `social-connect` replaces the field with a fixed Linkedin connect button, see [Social connect](#social-connect) |
| `inputType` | `React.HTMLInputTypeAttribute` | `undefined` | Native `<input type>` forwarded to the DOM (`tel`, `url`, …). Ignored by `type="upload"` and `type="social-connect"` |
| `value` | `string` | `undefined` | Value when used as a controlled component. Ignored by `type="social-connect"` |
| `defaultValue` | `string` | `""` | Initial value when used as an uncontrolled component. Ignored by `type="social-connect"` |
| `onValueChange` | `(value: string) => void` | `undefined` | Called when the value changes. Ignored by `type="social-connect"` |
| `ref` | `React.Ref<HTMLInputElement>` | `undefined` | For composite components (e.g. `TimeMaskInput`) that need the DOM node. Not forwarded by `type="social-connect"`, which renders a `<button>`, not an `<input>` |
| `file` | `File \| null` | `null` | Selected file. Only used by `type="upload"` |
| `onFileChange` | `(file: File \| null) => void` | `undefined` | Called when the file selection changes. Only used by `type="upload"` |
| `accept` | `string` | `undefined` | `accept` attribute for the file input. Only used by `type="upload"` |
| `isError` | `boolean` | `false` | Figma `Status=error`. For `textfield`/`link`/`upload`, turns the border to the warning color only. For `social-connect`, also switches the border to `--gb-border-error` (a different token from the other three `Type`s' `--gb-border-warning`) and the label to `"Fail to connect"` |
| `isBare` | `boolean` | `false` | Fills the outer container with no border, background, or focus ring. Used when a wrapper (e.g. `InputSearch`) draws those instead. No Figma counterpart — code only. Not used by `type="social-connect"` |
| `isConnected` | `boolean` | `false` | Figma `Status=filled`. Only used by `type="social-connect"` — switches the label to `"Linkedin Connected"` and the width to a fixed 204px |
| `onConnectClick` | `React.MouseEventHandler<HTMLButtonElement>` | `undefined` | Click handler. Only used by `type="social-connect"` |
| `disabled` | `boolean` (native) | `undefined` | Disabled state |
| `...props` | rest of `React.InputHTMLAttributes` | — | `placeholder`, `maxLength`, `readOnly`, … forwarded to the native element. Not spread onto `type="social-connect"`'s `<button>`, since none of these attributes apply to it |

### `type` vs `inputType`

Figma's `Type` axis and HTML's `type` attribute are different things that happen to share a name. The Figma axis owns `type` here, so the native attribute is passed as `inputType`. Both still work exactly as before — only the prop name moved.

This matters beyond styling: the "caret goes to the start of an empty field" behavior is gated on the native type, which is why `InputPhone` passes `inputType="tel"` and `InputTime` passes `inputType="text"`.

## Variants

There is no cva-based `variant` prop. Figma has two axes — `Type` (4 values: `textfield` / `upload` / `link` / `social connect`) × `Status` (5 values: `default` / `active` / `filled` / `disabled` / `error`) = **20 combinations, all drawn and all implemented**.

`Status` is not a single prop, and what drives `active` differs by `Type`: for `textfield`/`link`/`upload` it's CSS `:hover`/`:focus` (Figma collapses hover and keyboard focus into one state); for `social-connect` it's CSS `:hover`/`:active` together (no variant in the component set is literally named "hover" — Figma's `active` reads as a press/fill state, but the same look now also applies on hover so the button gives feedback before a click). `filled` is driven by whether a value exists (`currentValue.length > 0`) for the first three, and by the `isConnected` prop for `social-connect`. `disabled` is the native attribute. `error` is the `isError` prop, for all four.

## States and behaviors

Background, border, and shadow are identical across `textfield` / `link` / `upload`. `social-connect` differs substantially — see its own table below.

| Status | Trigger | Tokens |
| --- | --- | --- |
| default | No value, not hovered or focused | `--gb-background-default`, `--gb-border-default`, text `--gb-text-subtle` |
| hover / focus (Figma `active`) | Pointer over, or click/keyboard focus, while enabled | `--gb-border-static-gray`, `--gb-shadow-focus-ring` |
| filled | A value exists | Text switches to `--gb-text-default` |
| disabled | `disabled` prop | `--gb-background-disabled`, `--gb-border-overlay`, `--gb-text-static-gray` |
| error | `isError` prop | `--gb-border-warning`. Text stays `--gb-text-subtle` — only the border changes |

Trailing icon color (`upload` and `link` only):

| Status | Icon color |
| --- | --- |
| No value (default, active) | `--gb-icon-subtle` |
| Has a value (filled) | `--gb-icon-default` |
| disabled | `--gb-icon-static-gray` |

Figma splits the icon color by **whether a value exists** — hover and focus do not change it. `active` is still `icon/subtle`. (Figma's `social connect` icon is a fixed brand color, `#0076B2`, unaffected by `Status` including `disabled` — it does not follow this table at all.)

Other behaviors:

- **Placeholder hides on focus** for `textfield` and `link`. Figma's `active` variants for those two types have no text layer at all, which matches. Since Figma's `active` collapses hover and focus into one state, the asymmetry (`textfield`/`link` clear their text, `upload` keeps it) can't be explained by hover vs. focus — the actual trigger across the whole family is the caret: whichever types can receive a caret empty out their placeholder on it, and the two that don't (`upload`, `social connect`) keep their text.
- **`upload` keeps its text on focus**, recolored to `--gb-text-default`. Figma's `upload/active` still draws the text, so this row reads as a button label rather than a placeholder.
- **Caret starts at position 0 in an empty field.** Clicking an empty field pins the caret to index 0 regardless of where you clicked (`onMouseDown` → `preventDefault` + `setSelectionRange(0, 0)`). Fields with a value follow normal browser behavior. Only runs for types where `setSelectionRange` is specified (`text`, `search`, `url`, `tel`, `password`); others such as `email` skip it.
- **`readOnly`** is forwarded as-is with no custom styling.

## Sizing

The root is `width: 100%` — the parent field decides the width. Figma draws `textfield` / `upload` / `link` at a fixed 320px, but every real instance in the file overrides that (222–320px), so the 320 is canvas layout rather than a spec. `social-connect` draws at a different, genuinely fixed width — see [Social connect](#social-connect) below.

## Social connect

Figma's fourth `Type`, `social connect` (code: `type="social-connect"`), renders a single native `<button type="button">` instead of an `<input>` — a fixed Linkedin connect/disconnect control, not an editable field.

- Common across its 5 `Status` values: height 36, padding 16px all sides, gap `--gb-spacing-1-5` (6px), `--gb-radius-scale-lg`, centered content, Text-sm/Medium, leading 16px `#linkedin-icon` (sprite-only — lucide-react has no Linkedin icon) fixed to the brand color `--gb-color-linkedin-brand` (`#0076b2`, a dedicated primitive token — never recolored, not even when disabled, the same precedent `--gb-color-shimmer-gray` sets for a one-off literal hex).
- No `TEXT` property exists for the label — each `Status` hardcodes its own string, reproduced in code as `SOCIAL_CONNECT_LABEL`: `default`/`disabled`/`active` → `"Connect with Linkedin"`; `filled` (`isConnected`) → `"Linkedin Connected"`; `error` (`isError`) → `"Fail to connect"` (Figma's own component has a typo here, `"Fail to conncet"` — the code uses the corrected spelling).
- No `INSTANCE_SWAP` property either — only one icon is designed, so there is no generic "social platform" prop; `isConnected` and `onConnectClick` are the only state hooks.
- Width is HUG (`fit-content`) on `default`/`active`/`disabled`, and a genuinely FIXED 204px on `filled`/`error` — reproduced via `[data-connected="true"], [data-error="true"] { width: 204px }` in `input.module.css`.
- `active` (CSS `:hover` and `:active` together — no variant in the component set is literally named "hover", but the same look applies to both pointer-over and press) drops the border entirely and switches to `--gb-background-mute` background with `--gb-text-static-white` text; every other status keeps the 1px border and transparent background.

| Status | Background | Border | Text |
| --- | --- | --- | --- |
| default | transparent | `--gb-border-default` | `--gb-text-subtle` |
| active (`:hover`, `:active`) | `--gb-background-mute` | none | `--gb-text-static-white` |
| filled (`isConnected`) | transparent | `--gb-border-default` | `--gb-text-default` |
| error (`isError`) | transparent | `--gb-border-error` (not `--gb-border-warning`, unlike the other three `Type`s) | `--gb-text-default` |
| disabled | `--gb-background-disabled` | `--gb-border-overlay` | `--gb-text-static-gray` |

## Composition with other components

- `Input` is the **base**. `InputTime`, `InputSearch`, `InputPhone`, and `InputForm` all import it.
- `InputForm` (Figma `Input form`, `5084:3716`) composes the Textfield, Upload, and Link rows as three `Input` instances with different `type` values, plus a `Select` row.
- `Textarea` is a multi-line `<textarea>`, a different DOM element, so it does not build on `Input`.

## Typography weight is kept in disabled

`Input`, `Select`, and `RangeSelect` keep `Text-sm/Medium` when disabled — the disabled state is expressed through color only, never by dropping the weight. `DateSelect` is the exception: its Figma disabled text (node `7219:10923`) is `Inter Regular`/`--gb-font-weight-normal`, not `Medium` — see [`date-select.md`](./date-select.md). No test currently pins the weight claim for any of these four — `select.test.tsx` has no font-weight assertion.

## The consumer renders the error message

`isError` recolors the border and nothing else. A consumer that needs a message composes it — `InputTime` rendering a full-width message below the row is the only current precedent.
