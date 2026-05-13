"use client";

import { useEffect, useRef, useState } from "react";

export type Tab = {
  id: string;
  name: string;
  icon?: React.ReactNode;
};

type AnimatedTabsProps = {
  tabs: readonly Tab[];
  defaultTabId?: string;
  activeTabId?: string;
  withBottomMargin?: boolean;
  onChange?: (id: string) => void;
};

export function AnimatedTabs({
  tabs,
  defaultTabId,
  activeTabId,
  withBottomMargin = true,
  onChange,
}: AnimatedTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTabId ?? tabs[0].id,
  );
  const activeTab = activeTabId ?? internalActiveTab;

  const containerRef = useRef<HTMLDivElement>(null);
  const activeScrollTabRef = useRef<HTMLButtonElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const activeEl = activeScrollTabRef.current;
    const scroller = activeEl?.parentElement?.parentElement;

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

    const { offsetLeft, offsetWidth } = activeEl;

    const clipLeft = offsetLeft;
    const clipRight = offsetLeft + offsetWidth;

    container.style.clipPath = `inset(
      0
      ${100 - (clipRight / container.offsetWidth) * 100}%
      0
      ${(clipLeft / container.offsetWidth) * 100}%
      round 999px
    )`;
  }, [activeTab]);

  const handleClick = (id: string) => {
    if (activeTabId === undefined) {
      setInternalActiveTab(id);
    }
    onChange?.(id);
  };

  return (
    <div className={withBottomMargin ? "mb-4 w-full" : "w-full"}>
      <div
        className="relative flex w-full flex-col overflow-x-auto whitespace-nowrap px-6 scrollbar-none animate-slide-down-fade"
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <ul className="relative flex w-max gap-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                ref={activeTab === tab.id ? activeScrollTabRef : null}
                type="button"
                className={`flex h-9 items-center gap-2 rounded-full px-3 font-medium text-gray-200 transition duration-200 ease-in-out hover:text-black active:scale-[0.97] dark:text-gray-100 hover:dark:text-white`}
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
          className="absolute z-10 overflow-hidden transition-[clip-path] duration-200 ease"
          style={{
            clipPath: "inset(0px 80.41% 0px 3.5% round 999px)",
          }}
        >
          <ul className="relative flex w-max gap-2 rounded-full bg-gray-300 dark:bg-[#2A2A2A]">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  ref={activeTab === tab.id ? activeTabRef : null}
                  tabIndex={-1}
                  type="button"
                  className={`flex h-9 items-center gap-2 rounded-full px-3 font-medium text-black dark:text-white `}
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
