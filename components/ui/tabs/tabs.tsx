"use client";

import { useEffect, useRef, useState } from "react";

const allTabs = [
  {
    id: "All",
    name: "All",
  },
  {
    id: "Animations",
    name: "Animations",
  },
  {
    id: "UI Components",
    name: "UI Components",
  },
  {
    id: "React",
    name: "React",
  },
  {
    id: "Expo",
    name: "Expo",
  },
];

export const TabBar = () => {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  useEffect(() => {
    if (activeTabIndex === null) {
      return;
    }

    const setTabPosition = () => {
      const currentTab = tabsRef.current[activeTabIndex] as HTMLElement;
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    };

    setTabPosition();
  }, [activeTabIndex]);

  return (
    <div
      className="relative flex h-12 rounded-3xl mb-16 animate-slide-down-fade overflow-x-auto scrollbar-none whitespace-nowrap px-4"
      style={{
        animationDelay: "180ms",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <span
        className="absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl py-2 transition-all ease-linear duration-200"
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      >
        <span className="h-full w-full rounded-3xl bg-gray-300 dark:bg-[#191918]" />
      </span>

      {allTabs.map((tab, index) => {
  const isActive = activeTabIndex === index;
  const isLast = index === allTabs.length - 1;

  return (
    <button
      key={index}
      ref={(el) => {
        tabsRef.current[index] = el;
      }}
      className={`${
        isActive ? "text-black dark:text-white" : "dark:text-gray-100 text-gray-200"
      } my-auto cursor-pointer select-none rounded-full px-4 text-center font-medium ${
        !isLast ? "mr-2" : ""  
      }`}
      onClick={() => setActiveTabIndex(index)}
    >
      {tab.name}
    </button>
  );
})}

    </div>
  );
};
