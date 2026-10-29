# Input phone

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3525-8236) · node-id `3525:8236`
Code: `components/ui/input-phone/input-phone.tsx`

## Overview

A labelled field pairing a country-code dropdown on the left with a phone-number input on the right. Both halves reuse existing shared components — [Select](./select.md) for the dropdown and [Input](./input.md) for the number. Country data, and the as-you-type number formatting, come from [`libphonenumber-js`](https://www.npmjs.com/package/libphonenumber-js) rather than being hand-maintained.

## When to use

- When a country code and a phone number must be collected together.
- **The country-code list defaults to every ITU-assigned country from `libphonenumber-js`** (`getCountries()` + `getCountryCallingCode()`, with the display name from `Intl.DisplayNames`). Pass `countryCodeOptions` only to narrow that list down — e.g. to the handful of countries a product actually supports.

## When not to use

- A plain number field with no country code → the Textfield row of [InputForm](./input-form.md), or `Input` directly.

## How to use

```tsx
// Basic — country list defaults to the full libphonenumber-js set
<InputPhone />

// Controlled (the code and the number are controlled independently)
<InputPhone
  countryCode={code}
  onCountryCodeChange={setCode}
  value={phone}
  onValueChange={setPhone}
/>

// Narrowed to a product-specific subset
const SUPPORTED_COUNTRIES = [
  { value: "us", label: "United States (+1)", code: "+1" },
  { value: "kr", label: "South Korea (+82)", code: "+82" },
];
<InputPhone countryCodeOptions={SUPPORTED_COUNTRIES} />

// Fill the parent instead of the fixed 320px
<InputPhone shouldFitContainer />

// Disabled — both halves turn off together and the label does not dim
<InputPhone disabled />
```

## Structure

Five files per the project component rule: `input-phone.tsx` / `input-phone.module.css` / `input-phone.stories.tsx` / `input-phone.test.tsx` / `index.ts`.

```
<div data-slot="input-phone">            root, flex-col, items-start, gap 12, width 320
  <label htmlFor>                        label
  <div>                                   field group, flex-col, items-start, gap 8
    <div data-slot="input-phone-wrapper"> row, flex, items-start, gap 10
      <Select variant="primary" />        country code, width 88
      <Input inputType="tel" />           phone number, flex: 1
    <p>                                   warning message, only while a rejection is active
```

- The field group exists only so the 12px label↔row gap and the 8px row↔warning gap can both exist with a single `gap` value each — `gap` can't express two different sizes on one flex container.
- **The row gap is 10px** (`--gb-spacing-2-5`) — easy to confuse with the 12px between rows and the 8px icon gap.
- The 88px Select width is a fixed Figma value, so it is a literal.
- The number field passes `inputType="tel"`, which both gives the correct mobile keypad and enables the "caret starts at the front of an empty field" behavior.

## Props

| Prop                  | Type                      | Required | Default                                           | Description                                                                                                    |
| --------------------- | ------------------------- | -------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `countryCodeOptions`  | `SelectOption[]`          | no       | every `libphonenumber-js` country, sorted by name | Country-code list. The trigger shows `code`. Pass this to narrow the default list down                         |
| `label`               | `string`                  | no       | `"Where can we reach you?"`                       | Label above the field                                                                                          |
| `countryCode`         | `string`                  | no       | —                                                 | Country code when controlled                                                                                   |
| `defaultCountryCode`  | `string`                  | no       | —                                                 | Initial country code when uncontrolled                                                                         |
| `onCountryCodeChange` | `(value: string) => void` | no       | —                                                 | Country-code change callback                                                                                   |
| `value`               | `string`                  | no       | —                                                 | Phone number when controlled                                                                                   |
| `defaultValue`        | `string`                  | no       | `""`                                              | Initial phone number when uncontrolled                                                                         |
| `onValueChange`       | `(value: string) => void` | no       | —                                                 | Phone-number change callback. Receives the value **after** `AsYouType` formatting, once a `countryCode` is set |
| `placeholder`         | `string`                  | no       | —                                                 | Placeholder for the number field                                                                               |
| `searchPlaceholder`   | `string`                  | no       | `"Search country"`                                | Placeholder for the search box shown above the country dropdown list                                           |
| `disabled`            | `boolean`                 | no       | `false`                                           | Disables both halves (Figma `Status=disabled`)                                                                 |
| `shouldFitContainer`  | `boolean`                 | no       | `false`                                           | Stretch to the parent width instead of the fixed 320px                                                         |
| `id`                  | `string`                  | no       | generated                                         | Input id used for the label association                                                                        |
| `className`           | `string`                  | no       | —                                                 | Merged onto the root                                                                                           |

The country code and the phone number are **two independent controlled axes, not a value pair** — controlling one while leaving the other uncontrolled is valid.

## Variants

There is no `variant` prop. Figma's `Status` axis has four values — `default` / `filled` / `disabled` / `error`. There is no `active`; focus is handled by `Input` and `Select` in their own CSS.

| Figma `Status` | Shared across both halves                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default`      | background `--gb-background-default`, border `--gb-border-default`, text `--gb-text-subtle`                                                                                                                                                                                                                                                                                                                                                                                                          |
| `filled`       | text becomes `--gb-text-default`                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `disabled`     | background `--gb-background-disabled`, border `--gb-border-overlay`, text `--gb-text-static-gray`                                                                                                                                                                                                                                                                                                                                                                                                    |
| `error`        | **only the phone number `Input`** border turns `--gb-border-warning` — the country-code `Select` stays `--gb-border-default`, per Figma. A message in `--gb-text-warning` appears below the row. The focus ring (`box-shadow`) is suppressed while erroring, in `Input`'s own CSS (`.root[data-error]:not(:disabled):focus`/`:hover`) — otherwise it outranks the error border on specificity and hides it while the field is focused, i.e. while the user is actively typing the rejected character |

`error` isn't prop-driven — it's entirely internal state, set only when a keystroke is rejected (see below). There's no `isError`/`error` prop to force it externally.

## States and behaviors

- **The label does not dim when disabled** — confirmed in Figma. Only the two fields take the disabled palette.
- **The number field formats itself live.** Every keystroke runs the current digits through `libphonenumber-js`'s `AsYouType(countryCode)`, so a US number reads `(201) 666-1234` as it's typed. With no `countryCode` selected yet, the raw typed text passes through unformatted — there's no country to format against. `AsYouType` is re-created per keystroke rather than kept as a persistent instance; this is the documented non-incremental usage and is correct for a value that can also arrive from outside (controlled mode, paste).
- The root is a fixed 320px, which is the component's own Figma value (identical across every Status variant), not a layout example. Pass `shouldFitContainer` to override it.
- Height, radius, and border for both halves are inherited from `Select` and `Input` — this component never restates them.
- **Typing is validated in real time, using the same "restrict the keystroke, don't let it land" model as [InputTime](./input-time.md)'s hour/minute mask.** Three things get rejected outright (the keystroke never reaches the value), checked in this order:
  1. **No country selected yet** — any attempt to type at all (a digit included) is rejected → `"Select a country first."` A country has to be picked before the number field accepts anything.
  2. **A non-digit character** — not just letters, but anything that isn't `0`–`9` (symbols, whitespace, non-Latin text) → `"Numbers only."` This is checked by comparing the _count_ of non-digit characters before/after the keystroke, not scanning the whole string for letters — so it only fires on what was just typed, not on punctuation `AsYouType` itself inserts (`(`, `)`, `-`, space) or on a controlled `value` that already happens to contain non-digit text.
  3. **A digit that would exceed the selected country's number length** — per `libphonenumber-js`'s `validatePhoneNumberLength` (`TOO_LONG`) → `"Too many digits for this country."`

  All three messages are kept to one line at the component's 320px width — don't lengthen them without checking they still fit.

  A rejection also shake-animates the phone `Input` (same `shake` keyframe/timing as `InputTime`) and sets `isError` on it — never on the `Select`. The message and the border auto-clear after 2 seconds of no further typing, or immediately on blur.

- **The Storybook `error` status has an `errorType` control** (`noCountry` / `digitLimit` / `nonNumeric`, only shown when `status` is `error`) that previews each of the three rejections above without the viewer having to type — `InputPhoneErrorPreview` in `input-phone.stories.tsx` simulates the triggering keystroke on mount and re-fires it every 1.5s so it survives the 2s auto-dismiss.

## Composition with other components

- **Select** (`components/ui/select`): the country-code dropdown, `variant="primary"` at 88px, with `isSearchable` enabled — a search box ("Search country" by default) sits above the 245-country list, matching Figma's `phone number` Type (node `8094:1222`). See `isSearchable` in [`select.md`](./select.md) for the filtering/focus/keyboard behavior.
- **Input** (`components/ui/input`): the number field, `inputType="tel"`.
