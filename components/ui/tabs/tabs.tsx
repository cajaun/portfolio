"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type Tab = {
  id: string;
  name: string;
  icon?: React.ReactNode;
};

type AnimatedTabsProps = {
  tabs: readonly Tab[];
  defaultTabId?: string;
  activeTabId?: string;
  scrollable?: boolean;
  withBottomMargin?: boolean;
  className?: string;
  scrollerClassName?: string;
  listClassName?: string;
  tabClassName?: string;
  activeContainerClassName?: string;
  activeListClassName?: string;
  activeTabClassName?: string;
  tabListLabel?: string;
  onChange?: (id: string) => void;
};

export function AnimatedTabs({
  tabs,
  defaultTabId,
  activeTabId,
  scrollable = true,
  withBottomMargin = true,
  className,
  scrollerClassName,
  listClassName,
  tabClassName,
  activeContainerClassName,
  activeListClassName,
  activeTabClassName,
  tabListLabel,
  onChange,
}: AnimatedTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTabId ?? tabs[0].id,
  );
  const activeTab = activeTabId ?? internalActiveTab;

  const tabScrollerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeScrollTabRef = useRef<HTMLButtonElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const usesCustomGeometry = Boolean(
    scrollerClassName ||
      listClassName ||
      tabClassName ||
      activeContainerClassName ||
      activeListClassName ||
      activeTabClassName ||
      tabListLabel,
  );

  useEffect(() => {
    const activeEl = activeScrollTabRef.current;
    const scroller = tabScrollerRef.current;

    if (!activeEl || !scroller) {
      return;
    }

    const nextScrollLeft =
      activeEl.offsetLeft - scroller.clientWidth / 2 + activeEl.offsetWidth / 2;

    scroller.scrollTo({
      left: Math.max(nextScrollLeft, 0),
      behavior: "smooth",
    });
  }, [activeTab]);

  useEffect(() => {
    const container = containerRef.current;
    const activeEl = activeTabRef.current;

    if (!container || !activeEl) return;

    if (!usesCustomGeometry) {
      const { offsetLeft, offsetWidth } = activeEl;
      const clipRight = offsetLeft + offsetWidth;

      container.style.clipPath = `inset(
        0
        ${100 - (clipRight / container.offsetWidth) * 100}%
        0
        ${(offsetLeft / container.offsetWidth) * 100}%
        round 999px
      )`;
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    const clipLeft = activeRect.left - containerRect.left;
    const clipTop = activeRect.top - containerRect.top;
    const clipRight = clipLeft + activeRect.width;
    const clipBottom = clipTop + activeRect.height;

    container.style.clipPath = `inset(
      ${clipTop}px
      ${containerRect.width - clipRight}px
      ${containerRect.height - clipBottom}px
      ${clipLeft}px
      round 999px
    )`;
  }, [activeTab, usesCustomGeometry]);

  const handleClick = (id: string) => {
    if (activeTabId === undefined) {
      setInternalActiveTab(id);
    }
    onChange?.(id);
  };

  return (
    <div className={cn(withBottomMargin ? "mb-4 w-full" : "w-full", className)}>
      <div
        ref={tabScrollerRef}
        className={cn(
          "relative flex w-full flex-col whitespace-nowrap px-6 scrollbar-none animate-slide-down-fade",
          scrollable ? "overflow-x-auto" : "overflow-visible",
          scrollerClassName,
        )}
        style={{
          overflowX: scrollable ? "auto" : "visible",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <ul
          className={cn("relative flex w-max gap-2", listClassName)}
          role={tabListLabel ? "tablist" : undefined}
          aria-label={tabListLabel}
        >
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                ref={activeTab === tab.id ? activeScrollTabRef : null}
                type="button"
                role={tabListLabel ? "tab" : undefined}
                aria-selected={tabListLabel ? activeTab === tab.id : undefined}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full px-3 font-medium text-preview-text-muted transition duration-200 ease-in-out hover:text-preview-text active:scale-[0.97] dark:text-preview-dark-text-muted hover:dark:text-preview-dark-text",
                  tabClassName,
                )}
                onClick={() => handleClick(tab.id)}
              >
                {tab.icon && <span className="size-5">{tab.icon}</span>}
                <span>{tab.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <div
          ref={containerRef}
          aria-hidden="true"
          className={cn(
            "absolute z-10 overflow-hidden transition-[clip-path] duration-200 ease",
            activeContainerClassName,
          )}
          style={{
            clipPath: "inset(0px 80.41% 0px 3.5% round 999px)",
          }}
        >
          <ul
            className={cn(
              "relative flex w-max gap-2 rounded-full bg-preview-surface-active dark:bg-preview-dark-active",
              activeListClassName,
            )}
          >
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  ref={activeTab === tab.id ? activeTabRef : null}
                  tabIndex={-1}
                  type="button"
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-full px-3 font-medium text-preview-text dark:text-white",
                    activeTabClassName,
                  )}
                >
                  {tab.icon && <span className="size-5">{tab.icon}</span>}
                  <span>{tab.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
