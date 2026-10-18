"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
  SkeletonBlock,
  SkeletonLine,
  Stage,
  SurfaceButton,
} from "@/components/blog/previews/grids/shared/primitives";

export type HeaderLook = "top" | "compact" | "open";
type ClosedHeaderLook = Exclude<HeaderLook, "open">;

type HeaderCanvasProps = {
  look: HeaderLook;
  mobile?: boolean;
  compact?: boolean;
  closeLook?: ClosedHeaderLook;
  compactHeader?: boolean;
  flushTop?: boolean;
  showBackdrop?: boolean;
  onLookChange: (look: HeaderLook) => void;
};

const MENU_SKELETONS = ["w-32", "w-36", "w-32", "w-40"];

const EASE_GLIDE = "cubic-bezier(0.32, 0.72, 0, 1)";
const EASE_QUART = "cubic-bezier(0.23, 1, 0.32, 1)";

function BrandMark() {
  return <HeaderSkeleton className="h-5 w-5 rounded-[6px]" />;
}

function HeaderSkeleton({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 rounded-full bg-black/[0.12] dark:bg-white/[0.14] ${className}`}
    />
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block size-full" aria-hidden="true">
      <span
        className={`absolute inset-x-3 top-[calc(50%-0.75px)] h-[1.5px] rounded-xs bg-current transition-transform duration-400 ease-out will-change-transform ${
          open ? "translate-y-0 rotate-45" : "-translate-y-[3.5px]"
        }`}
      />
      <span
        className={`absolute inset-x-3 top-[calc(50%-0.75px)] h-[1.5px] rounded-xs bg-current transition-transform duration-400 ease-out will-change-transform ${
          open ? "translate-y-0 -rotate-45" : "translate-y-[3.5px]"
        }`}
      />
    </span>
  );
}

function MenuPanel({ mobile, open }: { mobile: boolean; open: boolean }) {
  return (
    <div
      id="nav-panel"
      aria-hidden={!open}
      inert={!open}
      style={{ transitionTimingFunction: EASE_GLIDE }}
      className={`invisible grid grid-rows-[0fr] transition-[grid-template-rows,visibility] duration-500 motion-reduce:transition-none ${
        open ? "visible grid-rows-[1fr]" : ""
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className="mx-1 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-black/10 pt-7 pb-8 max-[760px]:gap-x-5 max-[760px]:gap-y-7 max-[760px]:pt-6 max-[760px]:pb-[26px] dark:border-white/10"
        >
          <p
            style={{ transitionTimingFunction: EASE_QUART }}
            className={`col-span-2 mb-1.5 text-[13px] text-preview-text-muted transition-[opacity,filter,transform] duration-200 motion-reduce:translate-y-0 motion-reduce:blur-none motion-reduce:opacity-100 dark:text-white/45 ${
              open ? "translate-y-0 blur-none opacity-100 duration-500" : "-translate-y-1 blur-[4px] opacity-0"
            }`}
          >
            <HeaderSkeleton className="h-2.5 w-10" />
          </p>
          {MENU_SKELETONS.map((width, index) => (
            <span
              key={`${width}-${index}`}
              style={{
                transitionDelay: open ? `${80 + (index + 1) * 35}ms` : "0ms",
                transitionTimingFunction: EASE_QUART,
              }}
              className={`inline-block transition-[opacity,filter,transform] duration-200 motion-reduce:translate-y-0 motion-reduce:blur-none motion-reduce:opacity-100 ${
                open ? "translate-y-0 blur-none opacity-100 duration-500" : "-translate-y-1 blur-[4px] opacity-0"
              }`}
            >
              <HeaderSkeleton className={`${mobile ? "h-3" : "h-3.5"} ${width}`} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeaderSurface({
  look,
  mobile = false,
  compactHeader = false,
  closeLook = "compact",
  onLookChange,
}: HeaderCanvasProps) {
  const open = look === "open";
  // Opening the panel should preserve the closed state that led to it. In the
  // scroll preview, an open menu is still a compact header rather than a
  // sudden return to the larger top-of-page metrics.
  const closedLook = open ? closeLook : look;
  const isCompact = closedLook === "compact";

  return (
    <div
      data-look={look}
      data-open={open || undefined}
      data-compact={isCompact || undefined}
      style={{
        transitionDuration: "600ms",
        transitionTimingFunction: EASE_GLIDE,
        maxWidth: compactHeader
          ? open || !isCompact
            ? "100%"
            : "calc(100% - 4rem)"
          : undefined,
      }}
      className={`group/nav pointer-events-auto relative z-20 mx-auto flex w-full max-w-[72rem] flex-col rounded-[18px] border border-black/10 bg-white/[0.72] pr-2.5 pl-3.5 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.08)] inset-ring inset-ring-black/5 backdrop-blur-[8px] transition-[max-width,border-radius,background-color,backdrop-filter,box-shadow] motion-reduce:transition-none dark:border-white/10 dark:bg-[rgb(22_22_24/0.3)] dark:shadow-[0_18px_40px_-18px_rgb(0_0_0/0)] dark:inset-ring-white/5 max-[520px]:pr-2 max-[520px]:pl-3 ${
        isCompact && !open
          ? "max-w-[920px] bg-white/[0.9] shadow-[0_18px_40px_-18px_rgb(0_0_0/0.12)] inset-ring-black/5 dark:bg-[rgb(22_22_24/0.78)] dark:shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] dark:inset-ring-white/8"
          : ""
      } ${
        open
          ? "rounded-3xl bg-white/[0.94] shadow-[0_30px_60px_-24px_rgb(0_0_0/0.16)] inset-ring-black/5 backdrop-blur-[10px] dark:bg-[rgb(20_20_22/0.72)] dark:shadow-[0_30px_60px_-24px_rgb(0_0_0/0.8)] dark:inset-ring-white/8"
          : ""
      }`}
    >
      <div
        style={{
          transitionDuration: "600ms",
          transitionTimingFunction: EASE_GLIDE,
        }}
        className={`flex items-center gap-7 transition-[height] motion-reduce:transition-none ${
          isCompact ? "h-[54px]" : "h-[60px]"
        }`}
      >
        <div className="flex items-center gap-[9px] text-[18px] font-semibold tracking-[-0.01em] text-preview-text dark:text-white">
          <BrandMark />
          <HeaderSkeleton className="h-2.5 w-14" />
        </div>

        <div
          className={`ml-auto items-center gap-6 text-[14.5px] text-preview-text-muted max-[760px]:hidden dark:text-white/55 ${
            mobile ? "hidden" : "flex"
          }`}
        >
          {["w-8", "w-9", "w-10"].map((width) => (
            <span key={width} className="transition-opacity duration-200 hover:opacity-80">
              <HeaderSkeleton className={`h-2.5 ${width}`} />
            </span>
          ))}
          <button
            type="button"
            onClick={() => onLookChange(open ? closeLook : "open")}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-panel"
            className="-mr-0.5 -ml-1 inline-flex h-[34px] items-center gap-1.5 rounded-[10px] bg-black/[0.04] px-[11px] text-[14.5px] text-preview-text-muted inset-ring inset-ring-black/10 transition-colors duration-200 hover:bg-black/[0.08] hover:text-preview-text aria-expanded:bg-black/[0.08] aria-expanded:text-preview-text dark:bg-white/[0.04] dark:text-white/55 dark:inset-ring-white/10 dark:hover:bg-white/[0.08] dark:hover:text-white dark:aria-expanded:bg-white/[0.08] dark:aria-expanded:text-white"
          >
            <HeaderSkeleton className="h-2.5 w-10" />
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              aria-hidden="true"
              className={`transition-transform duration-400 ease-out ${open ? "rotate-180" : ""}`}
            >
              <path
                d="m2 3.75 3 3 3-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onLookChange(open ? closeLook : "open")}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav-panel"
          className={`relative ml-auto size-[38px] flex-none rounded-[11px] bg-black/[0.06] text-preview-text transition-colors duration-200 hover:bg-black/[0.1] dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1] max-[760px]:inline-flex ${
            mobile ? "inline-flex" : "hidden"
          }`}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      <MenuPanel mobile={mobile} open={open} />
    </div>
  );
}

function SkeletonContent({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`mx-auto w-full max-w-[34rem] px-4 ${
        compact ? "min-h-[30rem] pb-16 pt-12" : "min-h-[38rem] pb-24 pt-14"
      }`}
    >
      <div className="mx-auto max-w-[21rem] text-center">
        <SkeletonLine className={`mx-auto ${compact ? "h-6 w-36" : "h-7 w-44"}`} />
        <SkeletonLine className={`mx-auto ${compact ? "mt-3" : "mt-4"} h-3 w-56 max-w-full`} />
        <SkeletonLine className="mx-auto mt-2 h-3 w-40 max-w-full" />
      </div>

      <div className={`${compact ? "mt-8" : "mt-12"} grid gap-2.5 sm:gap-3 sm:grid-cols-2`}>
        {["w-24", "w-20"].map((width) => (
          <div
            key={width}
            className={`${compact ? "h-20" : "h-28"} flex flex-col gap-2 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-stage`}
          >
            <SkeletonLine className={`h-3 ${width}`} />
            <SkeletonLine className="h-3 w-32 max-w-full" />
            <SkeletonBlock className={`${compact ? "h-5" : "h-6"} mt-auto w-full`} />
          </div>
        ))}
      </div>

      <div className={`${compact ? "h-28" : "h-36"} mt-3 flex flex-col gap-2 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-stage`}>
        <SkeletonLine className="h-3 w-32" />
        <SkeletonLine className="h-3 w-64 max-w-full" />
        <SkeletonBlock className={`${compact ? "h-8" : "h-10"} mt-auto w-full`} />
      </div>

      <div className={`${compact ? "h-24" : "h-32"} mt-3 flex flex-col gap-2 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-stage`}>
        <SkeletonLine className="h-3 w-28" />
        <SkeletonLine className="h-3 w-48 max-w-full" />
        <SkeletonBlock className={`${compact ? "h-5" : "h-6"} mt-auto w-full`} />
      </div>
    </div>
  );
}

export function HeaderPreviewCanvas({
  look,
  mobile = false,
  compact = false,
  closeLook = "compact",
  compactHeader = false,
  flushTop = false,
  showBackdrop = true,
  onLookChange,
}: HeaderCanvasProps) {
  const open = look === "open";
  const closedLook = open ? closeLook : look;

  return (
    <div
      className={`relative -mx-4 ${
        flushTop ? "" : "-mt-4 sm:-mt-8"
      } sm:-mx-8 ${
        compact ? "min-h-[30rem]" : "min-h-[38rem]"
      }`}
    >
      <AnimatePresence initial={false}>
        {open && showBackdrop ? (
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => onLookChange(closeLook)}
              className="absolute inset-0 z-10 cursor-default bg-black/20 backdrop-blur-[6px] dark:bg-black/30"
          />
        ) : null}
      </AnimatePresence>

      <div
        data-open={open || undefined}
        data-compact={closedLook === "compact" || undefined}
        className={
          closedLook === "compact"
            ? "pointer-events-none sticky top-0 z-30 h-[74px] px-4 pt-2.5 transition-[padding] duration-600 ease-glide motion-reduce:transition-none sm:px-8"
            : "pointer-events-none sticky top-0 z-30 h-[74px] px-4 pt-3.5 transition-[padding] duration-600 ease-glide motion-reduce:transition-none sm:px-8"
        }
      >
        <HeaderSurface
          look={look}
          mobile={mobile}
          closeLook={closeLook}
          compactHeader={compactHeader}
          onLookChange={onLookChange}
        />
      </div>
      <div className="relative z-0">
        <SkeletonContent compact={compact} />
      </div>
    </div>
  );
}

export function HeaderOverviewPreview() {
  const [look, setLook] = useState<HeaderLook>("top");
  const scrollRef = useRef<HTMLDivElement>(null);
  const stableLookRef = useRef<ClosedHeaderLook>("top");
  const programmaticScrollRef = useRef<number | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const programmaticTarget = programmaticScrollRef.current;

      if (programmaticTarget !== null) {
        if (Math.abs(scrollTop - programmaticTarget) > 1) return;
        programmaticScrollRef.current = null;
      }

      const nextLook: ClosedHeaderLook = scrollTop > 24 ? "compact" : "top";

      stableLookRef.current = nextLook;
      setLook((current) => {
        if (current === "open") return current;
        return nextLook;
      });
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLook = (nextLook: HeaderLook) => {
    if (nextLook === "open") {
      setLook("open");
      return;
    }

    stableLookRef.current = nextLook;
    setLook(nextLook);
  };

  const triggerMenu = () => {
    setLook((current) =>
      current === "open" ? stableLookRef.current : "open",
    );
  };

  const scrollToEnd = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const returningToTop = scrollContainer.scrollTop >= maxScroll - 1;
    const nextLook: ClosedHeaderLook = returningToTop ? "top" : "compact";
    const target = returningToTop ? 0 : maxScroll;

    stableLookRef.current = nextLook;
    setLook((current) => (current === "open" ? current : nextLook));
    programmaticScrollRef.current = target;
    scrollContainer.scrollTo({
      top: target,
      behavior: "smooth",
    });
  };

  return (
    <PreviewCard
      full
      scrollable
      scrollContainerRef={scrollRef}
      footer={
        <div className="flex w-full items-center justify-center gap-2">
          <SurfaceButton onClick={triggerMenu}>Trigger menu</SurfaceButton>
          <SurfaceButton onClick={scrollToEnd}>Scroll page</SurfaceButton>
        </div>
      }
      innerClassName="!p-0"
    >
      <Stage className="!py-0 sm:!py-0">
        <HeaderPreviewCanvas
          compact
          flushTop
          look={look}
          closeLook={stableLookRef.current}
          compactHeader
          onLookChange={changeLook}
        />
      </Stage>
    </PreviewCard>
  );
}

export function HeaderExpansionPreview() {
  const [look, setLook] = useState<HeaderLook>("top");

  const changeLook = (nextLook: HeaderLook) => {
    setLook(nextLook === "compact" ? "top" : nextLook);
  };

  return (
    <PreviewCard
      full
      footer={
        <div className="flex w-full items-center justify-center gap-2">
          <SurfaceButton active={look !== "open"} onClick={() => setLook("top")}>
            Close
          </SurfaceButton>
          <SurfaceButton active={look === "open"} onClick={() => setLook("open")}>
            Open
          </SurfaceButton>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full justify-center px-4 text-center">
          <p className="text-[13px] text-gray-200 dark:text-preview-dark-paragraph">
            The panel grows from the same surface as the row
          </p>
        </div>
      }
    >
      <Stage className="!pb-0 sm:!pb-0">
        <HeaderPreviewCanvas
          compact
          look={look}
          closeLook="top"
          onLookChange={changeLook}
        />
      </Stage>
    </PreviewCard>
  );
}

export function HeaderScrollPreview() {
  const [look, setLook] = useState<HeaderLook>("top");
  const scrollRef = useRef<HTMLDivElement>(null);
  const stableLookRef = useRef<ClosedHeaderLook>("top");
  const programmaticScrollRef = useRef<number | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const programmaticTarget = programmaticScrollRef.current;

      if (programmaticTarget !== null) {
        if (Math.abs(scrollTop - programmaticTarget) > 1) return;
        programmaticScrollRef.current = null;
      }

      const nextLook: ClosedHeaderLook =
        scrollTop > 24 ? "compact" : "top";

      stableLookRef.current = nextLook;
      setLook((current) => {
        if (current === "open") return current;
        return nextLook;
      });
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const setScrollLook = (nextLook: HeaderLook) => {
    if (nextLook === "open") {
      setLook("open");
      return;
    }

    stableLookRef.current = nextLook;
    setLook(nextLook);
  };

  const setScrollPosition = (nextLook: ClosedHeaderLook) => {
    stableLookRef.current = nextLook;
    setLook(nextLook);

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const target =
      nextLook === "compact"
        ? scrollContainer.scrollHeight - scrollContainer.clientHeight
        : 0;

    programmaticScrollRef.current = target;

    scrollContainer.scrollTo({
      top: target,
      behavior: "smooth",
    });
  };

  return (
    <PreviewCard
      full
      scrollable
      scrollContainerRef={scrollRef}
      footer={
        <div className="flex w-full items-center justify-center gap-2">
          <SurfaceButton active={look === "top"} onClick={() => setScrollPosition("top")}>
            Scroll up
          </SurfaceButton>
          <SurfaceButton
            active={look === "compact"}
            onClick={() => setScrollPosition("compact")}
          >
            Scroll down
          </SurfaceButton>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full justify-center px-4 text-center">
          <p className="text-[13px] text-gray-200 dark:text-preview-dark-paragraph">
            Scroll inside the card to see the row contract after 24 pixels
          </p>
        </div>
      }
    >
      <Stage className="!py-0 sm:!py-0">
        <HeaderPreviewCanvas
          look={look}
          closeLook={stableLookRef.current}
          compactHeader
          flushTop
          onLookChange={setScrollLook}
        />
      </Stage>
    </PreviewCard>
  );
}
