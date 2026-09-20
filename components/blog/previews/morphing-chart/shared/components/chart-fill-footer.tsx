import { AnimatedTabs } from "@/components/ui/tabs/tabs";
import { FooterRow } from "../primitives";

export type FillMode = "on" | "off";

export function ChartFillFooter({
  selected,
  onSelect,
}: {
  selected: FillMode;
  onSelect: (mode: FillMode) => void;
}) {
  return (
    <FooterRow>
      <AnimatedTabs
        tabs={[
          { id: "on", name: "On" },
          { id: "off", name: "Off" },
        ]}
        activeTabId={selected}
        onChange={(mode) => onSelect(mode as FillMode)}
        scrollable={false}
        withBottomMargin={false}
        scrollerClassName="items-center px-0"
        listClassName="items-center gap-0.5 rounded-full bg-preview-surface-muted p-1 shadow-custom dark:bg-preview-dark-stage"
        tabClassName="h-7 rounded-full border-0 bg-transparent px-2.5 text-[13px] tracking-[-0.01em] shadow-none dark:bg-transparent"
        activeContainerClassName="pointer-events-none"
        activeListClassName="items-center gap-0.5 rounded-full bg-[lab(94.78%_0_0)] p-1 dark:bg-[lab(13.232%_0_0)]"
        activeTabClassName="h-7 rounded-full border-0 bg-transparent px-2.5 text-[13px] tracking-[-0.01em] shadow-none dark:bg-transparent"
        tabListLabel="Fill"
      />
    </FooterRow>
  );
}
