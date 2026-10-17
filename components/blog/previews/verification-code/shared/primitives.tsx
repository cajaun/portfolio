import type { ReactNode } from "react";
import { AnimatedTabs, type Tab } from "@/components/ui/tabs/tabs";

export function FooterRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {children}
    </div>
  );
}

export function PreviewTabs({
  tabs,
  selected,
  onSelect,
  label,
}: {
  tabs: readonly Tab[];
  selected: string;
  onSelect: (id: string) => void;
  label: string;
}) {
  return (
    <FooterRow>
      <AnimatedTabs
        tabs={tabs}
        activeTabId={selected}
        onChange={onSelect}
        scrollable={false}
        withBottomMargin={false}
        scrollerClassName="items-center px-0"
        listClassName="items-center gap-0.5 rounded-full bg-preview-surface-muted p-1 shadow-custom dark:bg-preview-dark-stage"
        tabClassName="h-7 rounded-full border-0 bg-transparent px-2.5 text-[13px] tracking-[-0.01em] shadow-none dark:bg-transparent"
        activeContainerClassName="pointer-events-none"
        activeListClassName="items-center gap-0.5 rounded-full bg-[lab(94.78%_0_0)] p-1 dark:bg-[lab(13.232%_0_0)]"
        activeTabClassName="h-7 rounded-full border-0 bg-transparent px-2.5 text-[13px] tracking-[-0.01em] shadow-none dark:bg-transparent"
        tabListLabel={label}
      />
    </FooterRow>
  );
}

export function PreviewFootnote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex w-full select-none items-center justify-center text-center">
      <p className="max-w-xl text-center text-[13px] leading-5 text-preview-text-muted dark:text-preview-dark-text-muted">
        {children}
      </p>
    </div>
  );
}

export function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="bg-preview-surface-muted px-4 py-4 sm:px-8 sm:py-8 dark:bg-preview-dark-stage">
      {children}
    </div>
  );
}
