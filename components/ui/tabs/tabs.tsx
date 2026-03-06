"use client";

import { useEffect, useRef, useState } from "react";

export type Tab = {
  id: string;
  name: string;
  icon?: React.ReactNode;
};

type AnimatedTabsProps = {
  tabs: Tab[];
  onChange?: (id: string) => void;
};

export function AnimatedTabs({ tabs, onChange }: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

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
    setActiveTab(id);
    onChange?.(id);
  };

  return (
   <div className="w-full mb-4">
  <div className="relative flex w-full flex-col animate-slide-down-fade">


    <ul className="relative flex w-full gap-2">
      {tabs.map((tab) => (
        <li key={tab.id}>
          <button

            className="flex h-9 items-center gap-2 rounded-full px-3 font-medium  text-gray-200 dark:text-gray-100 transition duration-200 ease-in-out hover:text-black hover:dark:text-white active:scale-[0.97]"
             onClick={() => handleClick(tab.id)}
          >
            {tab.icon && <span className="size-5">{tab.icon}</span>}
            <span className="inline">{tab.name}</span>
          </button>
        </li>
      ))}
    </ul>


    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute z-10 w-full overflow-hidden transition-[clip-path] duration-200 ease"
      style={{ clipPath: "inset(0px 80.41% 0px 3.5% round 999px)" }}
    >
      <ul className="relative flex w-full gap-2 bg-gray-300 dark:bg-[#2A2A2A] rounded-full">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              ref={activeTab === tab.id ? activeTabRef : null}
              tabIndex={-1}
              className="flex h-9 items-center gap-2 rounded-full px-3 font-medium  text-black dark:text-white"
            >
              {tab.icon && <span className="size-5">{tab.icon}</span>}
              <span className="inline">{tab.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>

  </div>
</div>
  );
}