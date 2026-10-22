/**
 * Rebuilds the source so that, in stories where the `status` control expands into
 * internal props, the Show code panel shows the code you would actually write.
 *
 * `status` is a story-only arg that gathers the Figma `Status` axis into one
 * control, so printing it verbatim would put a non-existent prop in the code. This
 * substitutes the real props instead, and notes CSS-only states such as hover in a
 * comment, since they have no prop.
 */

type Props = Record<string, unknown>;

/** A story-only device, hidden from the code sample. */
function isPseudoClassName(key: string, value: unknown) {
  return (
    key === "className" &&
    typeof value === "string" &&
    value.split(" ").every((part) => part.startsWith("pseudo-"))
  );
}

function formatDate(value: Date) {
  return `new Date(${value.getFullYear()}, ${value.getMonth()}, ${value.getDate()})`;
}

/** One JSX attribute value as a string. `null` means omit it from the code. */
function formatValue(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "function") return null;
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") return `{${value}}`;
  if (typeof value === "boolean") return value ? "" : "{false}";
  if (value instanceof Date) return `{${formatDate(value)}}`;
  // File has no enumerable own properties, so it would vanish silently in the object branch below
  if (typeof File !== "undefined" && value instanceof File) {
    return `{new File([], ${JSON.stringify(value.name)})}`;
  }
  if (Array.isArray(value)) return value.length ? "{[...]}" : null;
  if (typeof value === "object") {
    const entries = Object.entries(value as Props).filter(
      ([, v]) => v !== undefined && typeof v !== "function",
    );
    if (!entries.length) return null;
    const body = entries
      .map(([k, v]) =>
        v instanceof Date
          ? `${k}: ${formatDate(v)}`
          : `${k}: ${JSON.stringify(v)}`,
      )
      .join(", ");
    return `{{ ${body} }}`;
  }
  return null;
}

export interface StatusSourceOptions {
  /** Prop names to exclude from the code sample */
  omit?: string[];
  /** Name of the arg rendered as children (e.g. Button's `children`) */
  childrenKey?: string;
  /** Status values reproduced through CSS alone, with no prop */
  cssOnly?: string[];
}

export function makeStatusSource(
  componentName: string,
  statusProps: Record<string, Props>,
  options: StatusSourceOptions = {},
) {
  const { omit = [], childrenKey, cssOnly = [] } = options;

  return (_code: string, context: { args?: Props }) => {
    const args = context.args ?? {};
    const status = String(args.status ?? "");
    const resolved: Props = { ...args, ...(statusProps[status] ?? {}) };
    delete resolved.status;

    let children: string | null = null;
    if (childrenKey && typeof resolved[childrenKey] === "string") {
      children = resolved[childrenKey] as string;
      delete resolved[childrenKey];
    }

    const attrs: string[] = [];
    for (const [key, value] of Object.entries(resolved)) {
      if (omit.includes(key) || isPseudoClassName(key, value)) continue;
      const formatted = formatValue(value);
      if (formatted === null) continue;
      attrs.push(formatted === "" ? key : `${key}=${formatted}`);
    }
    attrs.sort();

    const body = attrs.length ? `\n  ${attrs.join("\n  ")}\n` : " ";
    const element = children
      ? `<${componentName}${body}>${children}</${componentName}>`
      : `<${componentName}${body}/>`;

    if (!cssOnly.includes(status)) return element;

    return `${element}\n\n// \`${status}\` is a CSS state with no prop — hover or focus the element to see it.`;
  };
}
