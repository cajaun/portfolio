"use client";

import type { ReactNode } from "react";
import { AnimatedTabs } from "@/components/ui/tabs/tabs";

// the same two springs the engine uses: loose at rest, stiff and critically damped in the hand
export const restSpring = {
  type: "spring" as const,
  stiffness: 190,
  damping: 2 * Math.sqrt(190) * 0.78,
  mass: 1,
};

export const followSpring = {
  type: "spring" as const,
  stiffness: 900,
  damping: 2 * Math.sqrt(900),
  mass: 1,
};

export function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="bg-preview-surface-muted px-1 py-4 sm:px-8 sm:py-6 dark:bg-preview-dark-stage">
      {children}
    </div>
  );
}

export function PreviewFootnote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex w-full select-none items-center justify-center text-center">
      <p className="text-center text-[13px] text-preview-text-muted dark:text-preview-dark-text-muted">
        {children}
      </p>
    </div>
  );
}

export function FooterRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {children}
    </div>
  );
}

export function TabsFooter<T extends string>({
  tabs,
  selected,
  onSelect,
  label,
}: {
  tabs: { id: T; name: string }[];
  selected: T;
  onSelect: (id: T) => void;
  label: string;
}) {
  return (
    <FooterRow>
      <AnimatedTabs
        tabs={tabs}
        activeTabId={selected}
        onChange={(id) => onSelect(id as T)}
        scrollable={false}
        withBottomMargin={false}
        scrollerClassName="items-center px-0"
        listClassName="items-center gap-0.5 rounded-full bg-preview-surface p-1 shadow-custom dark:bg-preview-dark-stage"
        tabClassName="h-7 rounded-full border-0 bg-transparent px-2.5 text-[13px] tracking-[-0.01em] shadow-none dark:bg-transparent"
        activeContainerClassName="pointer-events-none"
        activeListClassName="items-center gap-0.5 rounded-full bg-[lab(94.78%_0_0)] p-1 dark:bg-[lab(13.232%_0_0)]"
        activeTabClassName="h-7 rounded-full border-0 bg-transparent px-2.5 text-[13px] tracking-[-0.01em] shadow-none dark:bg-transparent"
        tabListLabel={label}
      />
    </FooterRow>
  );
}

// the footer button the modal post uses, with an optional pressed state
export function FooterButton({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 min-w-16 select-none items-center justify-center rounded-lg px-3 text-[13px] font-medium tracking-[-0.01em] text-preview-text shadow-custom transition-[scale,background-color] duration-200 ease-out will-change-transform active:scale-[0.97] dark:text-preview-dark-text ${
        active
          ? "bg-preview-surface-active dark:bg-preview-dark-surface-muted"
          : "bg-preview-surface dark:bg-preview-dark-surface"
      }`}
    >
      {children}
    </button>
  );
}
