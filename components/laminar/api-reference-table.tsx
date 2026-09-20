import { Info } from "lucide-react";

type ApiReferenceRow = {
  prop: string;
  type: string;
  defaultValue: string;
  description: string;
};

const API_REFERENCE_ROWS: ApiReferenceRow[] = [
  {
    prop: "text",
    type: "string | number",
    defaultValue: "-",
    description: "The value Laminar renders and animates.",
  },
  {
    prop: "variant",
    type: '"text" | "number" | "slots"',
    defaultValue: '"text"',
    description:
      "Controls whether Laminar reconciles normal text, numeric lanes, or rolling digit slots.",
  },
  {
    prop: "fontSize",
    type: "number",
    defaultValue: "-",
    description: "Sets the base font size for the rendered text.",
  },
  {
    prop: "color",
    type: "string",
    defaultValue: "-",
    description: "Sets the text color.",
  },
  {
    prop: "align",
    type: '"left" | "center" | "right"',
    defaultValue: '"left"',
    description: "Aligns the morphing run inside its viewport.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "-",
    description:
      "Passes a NativeWind class name to each animated text node.",
  },
  {
    prop: "style",
    type: "StyleProp<TextStyle>",
    defaultValue: "-",
    description: "Additional React Native text styles.",
  },
  {
    prop: "containerStyle",
    type: "StyleProp<ViewStyle>",
    defaultValue: "-",
    description: "Styles the outer Laminar viewport container.",
  },
  {
    prop: "fontStyle",
    type: "StyleProp<TextStyle>",
    defaultValue: "-",
    description:
      "Text styles merged with Laminar's base font size and color styles.",
  },
  {
    prop: "animationDuration",
    type: "number",
    defaultValue: "preset duration",
    description: "Overrides the selected preset duration in milliseconds.",
  },
  {
    prop: "animationPreset",
    type: '"default" | "smooth" | "snappy" | "bouncy"',
    defaultValue: "variant based",
    description:
      "Selects the motion preset. Text defaults to default, numeric variants default to snappy.",
  },
  {
    prop: "stagger",
    type: "number",
    defaultValue: "0.02",
    description: "Delay between glyph or digit animations, in seconds.",
  },
  {
    prop: "autoSize",
    type: "boolean",
    defaultValue: "true",
    description:
      "Measures the next value and animates the viewport width to match.",
  },
  {
    prop: "clipToBounds",
    type: "boolean",
    defaultValue: "false",
    description:
      "Clips moving glyphs and digits to the Laminar viewport bounds.",
  },
];

function CodeChip({ children }: { children: string }) {
  return (
    <code className="inline-block h-fit rounded-md border border-preview-border bg-white px-1.5 py-0.5 text-[11px] font-medium text-black dark:border-preview-dark-border dark:bg-preview-dark-surface dark:text-white">
      {children}
    </code>
  );
}

export default function ApiReferenceTable() {
  return (
    <div className="not-prose my-6 w-full overflow-auto rounded-lg shadow-custom">
      <table className="w-full min-w-[620px] overflow-hidden rounded-lg">
        <thead>
          <tr className="border-b border-preview-border dark:border-preview-dark-border">
            {["Prop", "Type", "Default"].map((heading) => (
              <th
                key={heading}
                className="bg-preview-surface-muted px-6 py-1.5 text-left text-[12px] font-medium text-gray-200 first-of-type:w-[37%] dark:bg-preview-dark-surface-muted dark:text-gray-100"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {API_REFERENCE_ROWS.map((row) => (
            <tr
              key={row.prop}
              className="border-t border-preview-border bg-white dark:border-preview-dark-border dark:bg-[#101010]"
            >
              <td className="px-6 py-4 text-[11px]">
                <div className="inline-flex items-center gap-1.5">
                  <CodeChip>{row.prop}</CodeChip>
                  <button
                    type="button"
                    aria-label={`${row.prop}: ${row.description}`}
                    title={row.description}
                    className="grid h-[22px] w-[22px] place-items-center rounded text-gray-200 transition-colors hover:bg-gray-300 hover:text-black dark:text-gray-100 hover:dark:bg-[#2A2A2A] hover:dark:text-white"
                  >
                    <Info className="size-3.5" aria-hidden />
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 text-[11px]">
                <CodeChip>{row.type}</CodeChip>
              </td>
              <td className="px-6 py-4 text-[11px]">
                <CodeChip>{row.defaultValue}</CodeChip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
