import { AnimatedTabs } from "@/components/ui/tabs/tabs";
import { RANGES, type RangeType } from "../chart-model";
import { FooterRow } from "../primitives";

export function ChartRangeFooter({
  selected,
  onSelect,
}: {
  selected: RangeType;
  onSelect: (range: RangeType) => void;
}) {
  return (
    <FooterRow>
      <AnimatedTabs
        tabs={RANGES.map((range) => ({ id: range, name: range }))}
        activeTabId={selected}
        onChange={(range) => onSelect(range as RangeType)}
        scrollable={false}
        withBottomMargin={false}
        scrollerClassName="items-center px-0"
        listClassName="items-center gap-0.5 rounded-full  bg-preview-surface-muted p-1 shadow-custom  dark:bg-preview-dark-stage"
        tabClassName="h-7 rounded-full border-0 bg-transparent px-2.5 text-[13px] tracking-[-0.01em] shadow-none dark:bg-transparent"
        activeContainerClassName="pointer-events-none"
        activeListClassName="items-center gap-0.5 rounded-full bg-[lab(94.78%_0_0)] p-1 dark:bg-[lab(13.232%_0_0)]"
        activeTabClassName="h-7 rounded-full border-0 bg-transparent px-2.5 text-[13px] tracking-[-0.01em] shadow-none dark:bg-transparent"
        tabListLabel="Chart ranges"
      />
    </FooterRow>
  );
}
