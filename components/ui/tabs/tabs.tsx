"use client";

import { useEffect, useRef, useState } from "react";

const allTabs = [
  {
    id: "All",
    name: "All",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width="1em"
        height="1em"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          d="m434.8 137.65l-149.36-68.1c-16.19-7.4-42.69-7.4-58.88 0L77.3 137.65c-17.6 8-17.6 21.09 0 29.09l148 67.5c16.89 7.7 44.69 7.7 61.58 0l148-67.5c17.52-8 17.52-21.1-.08-29.09M160 308.52l-82.7 37.11c-17.6 8-17.6 21.1 0 29.1l148 67.5c16.89 7.69 44.69 7.69 61.58 0l148-67.5c17.6-8 17.6-21.1 0-29.1l-79.94-38.47"
        ></path>
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          d="m160 204.48l-82.8 37.16c-17.6 8-17.6 21.1 0 29.1l148 67.49c16.89 7.7 44.69 7.7 61.58 0l148-67.49c17.7-8 17.7-21.1.1-29.1L352 204.48"
        ></path>
      </svg>
    ),
  },
  {
    id: "Animations",
    name: "Animations",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width="1em"
        height="1em"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          d="M259.92 262.91L216.4 149.77a9 9 0 0 0-16.8 0l-43.52 113.14a9 9 0 0 1-5.17 5.17L37.77 311.6a9 9 0 0 0 0 16.8l113.14 43.52a9 9 0 0 1 5.17 5.17l43.52 113.14a9 9 0 0 0 16.8 0l43.52-113.14a9 9 0 0 1 5.17-5.17l113.14-43.52a9 9 0 0 0 0-16.8l-113.14-43.52a9 9 0 0 1-5.17-5.17M108 68L88 16L68 68L16 88l52 20l20 52l20-52l52-20zm318.67 49.33L400 48l-26.67 69.33L304 144l69.33 26.67L400 240l26.67-69.33L496 144z"
        ></path>
      </svg>
    ),
  },
  {
    id: "UI Components",
    name: "UI Components",
  },
  {
    id: "React",
    name: "React",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="1em"
        height="1em"
      >
        <path
          fill="currentColor"
          d="m25 11.6l-.9-.3c0-.2.1-.4.1-.6c.7-3.3.2-6-1.3-6.9c-1.5-.8-3.9 0-6.3 2.1c-.2.2-.5.4-.7.6c-.2-.1-.3-.3-.5-.4C13 3.9 10.5 3 9 3.9c-1.5.8-1.9 3.4-1.3 6.5c.1.3.1.6.2.9c-.4.1-.7.2-1 .3c-3 1-4.9 2.7-4.9 4.3c0 1.7 2 3.5 5.1 4.5c.2.1.5.2.8.2c-.1.3-.2.7-.2 1c-.6 3.1-.1 5.5 1.3 6.4c1.5.9 4 0 6.5-2.2c.2-.2.4-.4.6-.5c.2.2.5.5.8.7c2.4 2.1 4.7 2.9 6.2 2s2-3.5 1.4-6.7c0-.2-.1-.5-.2-.8c.2-.1.4-.1.5-.2c3.2-1.1 5.3-2.8 5.3-4.5c-.1-1.5-2.1-3.1-5.1-4.2m-7.5-4.7c2.1-1.8 4-2.5 4.9-2s1.3 2.7.7 5.6c0 .2-.1.4-.1.6c-1.2-.3-2.5-.5-3.7-.6q-1.05-1.5-2.4-3zm-7.2 10.5c.3.5.5 1 .8 1.5s.6 1 .9 1.4c-.9-.1-1.7-.2-2.6-.4c.2-.8.5-1.6.9-2.5m0-2.8c-.4-.8-.6-1.6-.9-2.4c.8-.2 1.7-.3 2.5-.4c-.3.5-.6.9-.9 1.4c-.2.4-.5.9-.7 1.4m.6 1.4c.4-.8.8-1.5 1.2-2.3c.4-.7.9-1.5 1.4-2.2c.8-.1 1.7-.1 2.6-.1s1.7 0 2.6.1c.5.7.9 1.4 1.3 2.2c.4.7.8 1.5 1.2 2.3c-.4.8-.8 1.5-1.2 2.3c-.4.7-.9 1.5-1.3 2.2c-.8.1-1.7.1-2.6.1s-1.7 0-2.5-.1c-.5-.7-.9-1.4-1.4-2.2s-.9-1.5-1.3-2.3m10 2.9c.3-.5.6-1 .8-1.5c.4.8.7 1.6.9 2.5c-.9.2-1.7.3-2.6.4c.4-.5.7-1 .9-1.4m.8-4.3c-.3-.5-.5-1-.8-1.5s-.6-.9-.8-1.4c.9.1 1.7.3 2.6.4c-.3.9-.6 1.7-1 2.5M16 8.3c.6.6 1.1 1.3 1.6 2q-1.65-.15-3.3 0c.6-.7 1.2-1.4 1.7-2M9.6 4.9c.9-.5 3 .2 5.2 2.2l.4.4q-1.35 1.35-2.4 3c-1.3.1-2.5.3-3.7.6c-.1-.3-.1-.6-.2-.9c-.6-2.7-.2-4.8.7-5.3M8.2 19.6c-.2-.1-.5-.1-.7-.2c-1.4-.5-2.5-1.1-3.3-1.7c-.7-.6-1-1.2-1-1.7c0-1 1.5-2.3 4.1-3.2c.3-.1.6-.2 1-.3c.3 1.2.7 2.4 1.3 3.5c-.6 1.2-1 2.4-1.4 3.6m6.5 5.5c-1.1 1-2.2 1.6-3.1 2c-.9.3-1.5.3-2 .1c-.9-.5-1.3-2.5-.8-5.1c.1-.4.2-.7.2-1.1c1.2.3 2.5.5 3.8.5q1.05 1.5 2.4 3c-.2.2-.3.4-.5.6m1.3-1.4c-.6-.6-1.1-1.3-1.7-2h3.3c-.4.7-1 1.4-1.6 2m7.3 1.7c-.2.9-.5 1.5-.9 1.7c-.9.5-2.8-.2-4.8-1.9c-.2-.2-.5-.4-.7-.6c.8-.9 1.6-1.9 2.3-3c1.3-.1 2.5-.3 3.8-.6c.1.2.1.5.2.7c.3 1.4.3 2.7.1 3.7m1-6c-.2 0-.3.1-.5.1c-.4-1.2-.9-2.4-1.4-3.6c.5-1.1 1-2.3 1.4-3.5c.3.1.6.2.8.3c2.6.9 4.2 2.2 4.2 3.2c0 1.2-1.7 2.6-4.5 3.5"
        ></path>
        <path
          fill="currentColor"
          d="M16 18.5c.5 0 1-.1 1.4-.4s.7-.7.9-1.1c.2-.5.2-1 .1-1.5s-.3-.9-.7-1.3c-.3-.4-.8-.6-1.3-.7s-1 0-1.5.1c-.5.2-.9.5-1.1.9c-.3.4-.4.9-.4 1.4c0 .3.1.7.2 1s.3.6.5.8s.5.4.8.5c.4.2.8.3 1.1.3"
        ></path>
      </svg>
    ),
  },
  {
    id: "Expo",
    name: "Expo",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
      >
        <path
          fill="currentColor"
          d="M0 20.084c.043.53.23 1.063.718 1.778c.58.849 1.576 1.315 2.303.567c.49-.505 5.794-9.776 8.35-13.29a.76.76 0 0 1 1.248 0c2.556 3.514 7.86 12.785 8.35 13.29c.727.748 1.723.282 2.303-.567c.57-.835.728-1.42.728-2.046c0-.426-8.26-15.798-9.092-17.078c-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77Z"
        ></path>
      </svg>
    ),
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
              isActive
                ? "text-black dark:text-white"
                : "dark:text-gray-100 text-gray-200"
            } my-auto cursor-pointer select-none rounded-full px-4 text-center font-medium flex items-center ${
              !isLast ? "mr-1" : ""
            }`}
            onClick={() => setActiveTabIndex(index)}
          >
            {tab.icon && (
              <span className="mr-2 flex-shrink-0 text-lg" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            {tab.name}
          </button>
        );
      })}
    </div>
  );
};
