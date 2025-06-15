"use client";

import {
  MotionConfig,
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import { useTheme } from "next-themes";
import { Fragment, useCallback, useState, useRef, useEffect } from "react";

type SectionData = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type ScrollIslandProps = {
  sections: SectionData[];
};

export function ScrollIsland({ sections }: ScrollIslandProps) {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);
  const [titleEls, setTitleEls] = useState<HTMLElement[]>([]);
  const [currentTitle, setCurrentTitle] = useState(sections[0]?.title || "");
  const isDarkMode = useTheme();
  const titleElsRef = useRef<HTMLElement[]>([]);
  const currentTitleRef = useRef<string>(sections[0]?.title || "");

  useEffect(() => {
    titleElsRef.current = titleEls;
  }, [titleEls]);

  useEffect(() => {
    currentTitleRef.current = currentTitle;
  }, [currentTitle]);

  const setupTitles = useCallback((node: HTMLDivElement) => {
    if (node) {
      const els = Array.from(node.querySelectorAll("h2"));
      setTitleEls(els);
    }
  }, []);


 
	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		setPercent(Math.floor(latest * 100));
		titleEls.forEach((el, index) => {
			const top = el.getBoundingClientRect().top;
			if (top >= 0 && top < 32) {
				setCurrentTitle(sections[index].title ?? "");
			}
		});
	});

  return (
    <div className="relative w-full max-w-screen-sm mx-auto " ref={setupTitles}>
      <MotionConfig
        transition={{
          type: "spring",
          damping: 40,
          stiffness: 400,
        }}
      >
        <AnimatePresence>
          {open && <Overlay onClick={() => setOpen(false)} />}
        </AnimatePresence>

        <main className={`text-balance `}>
          {sections.map((item, index) => (
            <Fragment key={item.id}>
              <div
                className={index !== sections.length - 1 ? "mb-16" : undefined}
              >
                <h2
                  id={item.id}
                  className="font-medium animate-slide-down-fade"
                  style={{ animationDelay: `${90 * (index + 1)}ms` }}
                >
                  {item.title}
                </h2>
                <div
                  className="my-4 animate-slide-down-fade"
                  style={{ animationDelay: `${90 * (index + 1)}ms` }}
                >
                  {item.content}
                </div>
              </div>
            </Fragment>
          ))}
        </main>

        <motion.div
          className={`fixed top-4 left-1/2 -translate-x-1/2 ${
            isDarkMode
              ? "bg-[#0B0B0A] border border-[#2A2A28] text-neutral-50"
              : "bg-neutral-900 text-neutral-50"
          } z-10 overflow-hidden`}
          initial={false}
          style={{ borderRadius: 22 }}
          animate={{ width: open ? 340 : 280, height: open ? "auto" : 44 }}
        >
          <ol className="px-4 pt-4" style={{ paddingBlockStart: 44 }}>
            {sections.map((item) => (
              <motion.li
                key={item.id}
                className={`
        list-inside list-none transition-[filter] font-medium `}
              >
                <a
                  href={`#${item.id}`}
                  className="h-12 inline-flex items-center"
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </a>
              </motion.li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            style={{ height: 44 }}
            className="pl-2 pr-4 absolute inset-x-0 top-0 bg-inherit flex items-center justify-between gap-2"
          >
            <span className="flex grow min-w-0 items-center gap-1">
              <svg className="size-7 -rotate-90 shrink-0" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  strokeWidth="15"
                  fill="none"
                  className="stroke-neutral-500"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="35"
                  strokeWidth="15"
                  strokeDashoffset="0"
                  fill="none"
                  pathLength="1"
                  style={{ pathLength: scrollYProgress }}
                  className="stroke-neutral-50"
                  strokeLinecap="round"
                />
              </svg>

              <span className="truncate font-semibold">{currentTitle}</span>
            </span>

            <span className="font-semibold bg-neutral-500 px-2 rounded-full">
              {percent}%
            </span>
          </button>
        </motion.div>
      </MotionConfig>
    </div>
  );
}

function Overlay(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-10  backdrop-blur-[10px]"
      {...props}
    />
  );
}
