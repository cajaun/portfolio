"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ImageCardSkeleton from "@/components/blog/previews/shared/image-card-skeleton";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import { cn } from "@/lib/utils";

// ─── Shared primitives ────────────────────────────────────────────────────────

const layoutTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.8,
};

const fadeTransition = {
  duration: 0.22,
  ease: "easeOut" as const,
};

const previewCardBase =
  "border-preview-border bg-preview-surface-muted dark:border-preview-dark-border-strong dark:bg-preview-dark-stage";
const previewCardHighlight =
  "border-preview-border bg-preview-surface-active dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted";

const mobilePreviewQuery = "(max-width: 640px)";

function useMobilePreview() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(mobilePreviewQuery);
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function SurfaceButton({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 items-center justify-center rounded-lg px-3 text-[13px] font-medium tracking-[-0.01em] transition-transform duration-200 active:scale-[0.98]",
        active
          ? "bg-preview-surface-active text-preview-text shadow-custom dark:bg-preview-dark-active dark:text-preview-dark-text"
          : "bg-preview-surface text-preview-text shadow-custom dark:border-preview-dark-border-strong dark:bg-preview-dark-surface dark:text-preview-dark-text",
      )}
    >
      {children}
    </button>
  );
}

function PreviewFootnote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex w-full select-none items-center justify-center text-center">
      <p className="max-w-xl text-center text-[13px] leading-5 text-gray-200 dark:text-preview-dark-paragraph">
        {children}
      </p>
    </div>
  );
}

function FooterRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {children}
    </div>
  );
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-full bg-preview-border dark:bg-preview-dark-surface-active",
        className,
      )}
    />
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-preview-border dark:bg-preview-dark-surface-active",
        className,
      )}
    />
  );
}

function AnimatedCardSkeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      layout
      transition={layoutTransition}
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-preview-border bg-preview-surface p-2.5 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface sm:p-3",
        className,
      )}
      style={style}
    >
      <SkeletonLine className="h-3 w-3/4" />
      <SkeletonLine className="h-3 w-1/2" />
      <SkeletonBlock className="mt-auto h-6 w-full" />
    </motion.div>
  );
}

function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="bg-preview-surface-muted px-4 py-4 sm:px-8 sm:py-8 dark:bg-preview-dark-stage">
      {children}
    </div>
  );
}

function Chrome({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full overflow-hidden rounded-[1.4rem] bg-preview-surface shadow-custom dark:bg-preview-dark-surface",
        className ?? "max-w-xl",
      )}
    >
      {children}
    </div>
  );
}

function Toolbar() {
  return (
    <div className="flex h-11 items-center justify-between border-b border-preview-border bg-preview-surface-muted px-4 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
      <SkeletonLine className="h-3.5 w-24" />
      <SkeletonLine className="h-3.5 w-16" />
    </div>
  );
}

// ─── 1. EqualTracksPreview ────────────────────────────────────────────────────
//
// One thing changes: the number of columns. The cards are identical across all
// three states. The button adds or removes a column and the grid reflows visibly.
// Motion animates the cards between the new track positions.

type ColCount = 2 | 3 | 4;

export function EqualTracksPreview() {
  const [cols, setCols] = useState<ColCount>(3);
  const isMobile = useMobilePreview();

  const template: Record<ColCount, string> = {
    2: "repeat(2, minmax(0, 1fr))",
    3: "repeat(3, minmax(0, 1fr))",
    4: "repeat(4, minmax(0, 1fr))",
  };
  const rowHeight = isMobile ? "7.25rem" : "6rem";

  useEffect(() => {
    if (isMobile && cols === 4) {
      setCols(3);
    }
  }, [cols, isMobile]);

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={cols === 2} onClick={() => setCols(2)}>
            2 columns
          </SurfaceButton>
          <SurfaceButton active={cols === 3} onClick={() => setCols(3)}>
            3 columns
          </SurfaceButton>
          <div className="hidden sm:block">
            <SurfaceButton active={cols === 4} onClick={() => setCols(4)}>
              4 columns
            </SurfaceButton>
          </div>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Equal tracks split the container width evenly. Every card gets the same share.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <motion.div
              layout
              transition={layoutTransition}
              className="grid min-h-[23.5rem] content-center gap-2.5 sm:h-[20rem] sm:gap-3"
              style={{
                gridTemplateColumns: template[cols],
                gridAutoRows: rowHeight,
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <AnimatedCardSkeleton
                  key={i}
                  className="min-h-[7.25rem] sm:h-24 sm:min-h-0"
                />
              ))}
            </motion.div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

// ─── 2. FloorPreview ──────────────────────────────────────────────────────────
//
// The container stays fixed. The button changes the grid rule so the same
// pressure either crushes cards or lets them wrap before they get too small.

type FloorMode = "none" | "floor";

export function FloorPreview() {
  const [mode, setMode] = useState<FloorMode>("floor");
  const isMobile = useMobilePreview();
  const columns =
    mode === "floor"
      ? "repeat(auto-fit, minmax(8rem, 1fr))"
      : "repeat(3, minmax(0, 1fr))";

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={mode === "none"} onClick={() => setMode("none")}>
            No floor
          </SurfaceButton>
          <SurfaceButton active={mode === "floor"} onClick={() => setMode("floor")}>
            With floor
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          The container stays fixed. The floor decides whether cards shrink or wrap.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <div className="mx-auto w-full max-w-[24rem] rounded-2xl border border-dashed border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-stage">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-preview-text-muted dark:text-preview-dark-text-muted">
                  Fixed container
                </p>
                <SkeletonLine className="h-2.5 w-20" />
              </div>
              <motion.div
                layout
                transition={layoutTransition}
                className="grid h-[26rem] content-start gap-2.5 sm:h-[19rem] sm:gap-3"
                style={{
                  gridTemplateColumns: columns,
                  gridAutoRows: isMobile ? "6.25rem" : "5.5rem",
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <AnimatedCardSkeleton
                    key={i}
                    className="min-h-[6.25rem] sm:h-[5.5rem] sm:min-h-0"
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

// ─── 3. IntrinsicEdgesPreview ─────────────────────────────────────────────────
//
// A row with content-hugging edges and a flexible middle.
// The button resizes the middle content — text gets longer — and the edges
// stay fixed while the middle absorbs the change.

export function IntrinsicEdgesPreview() {
  const [wide, setWide] = useState(false);
  const isMobile = useMobilePreview();

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={!wide} onClick={() => setWide(false)}>
            Short content
          </SurfaceButton>
          <SurfaceButton active={wide} onClick={() => setWide(true)}>
            Long content
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Edges hug their content. The middle absorbs whatever space is left.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "max-content minmax(0, 1fr) max-content",
              }}
            >
              {/* Left edge — hugs content */}
              <motion.div
                layout
                transition={layoutTransition}
                className="flex min-h-[4.5rem] flex-row items-center gap-2 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted sm:min-h-0 sm:flex-col sm:items-stretch"
              >
                <SkeletonLine className="h-3 w-16 sm:w-14" />
                <SkeletonLine className="h-3 w-12 sm:w-10" />
                <SkeletonLine className="h-3 w-14 sm:w-12" />
              </motion.div>

              {/* Middle — absorbs remaining width, content varies */}
              <motion.div
                layout
                transition={layoutTransition}
                className={cn(
                  "flex min-h-[8.5rem] flex-col gap-2 rounded-xl border p-3 sm:min-h-0",
                  previewCardHighlight,
                )}
              >
                <SkeletonLine
                  className={cn(
                    "h-3 transition-[width] duration-500 ease-in-out",
                    wide ? "w-full" : "w-1/2 sm:w-1/3",
                  )}
                />
                <SkeletonLine
                  className={cn(
                    "h-3 transition-[width] duration-500 ease-in-out",
                    wide ? "w-4/5" : "w-2/5 sm:w-1/4",
                  )}
                />
                <SkeletonBlock
                  className={cn(
                    "mt-auto h-12 transition-[width] duration-500 ease-in-out sm:mt-2 sm:h-10",
                    wide ? "w-full" : "w-2/3",
                  )}
                />
              </motion.div>

              {/* Right edge — hugs content */}
              <motion.div
                layout
                transition={layoutTransition}
                className="grid min-h-[4.5rem] grid-cols-3 gap-2 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted sm:flex sm:min-h-0 sm:flex-col"
              >
                <SkeletonBlock className="h-8 w-full sm:h-7 sm:w-16" />
                <SkeletonBlock className="h-8 w-full sm:h-7 sm:w-16" />
                <SkeletonBlock className="h-8 w-full sm:h-7 sm:w-16" />
              </motion.div>
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

// ─── 4. GapPreview ────────────────────────────────────────────────────────────
//
// One property on the container — gap — animates between three values.
// The cards never change. The container owns the spacing entirely.

type GapMode = "none" | "tight" | "loose";

export function GapPreview() {
  const [gap, setGap] = useState<GapMode>("tight");
  const isMobile = useMobilePreview();

  const gapValue: Record<GapMode, string> = {
    none: "0px",
    tight: "0.75rem",
    loose: "1.75rem",
  };

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={gap === "none"} onClick={() => setGap("none")}>
            No gap
          </SurfaceButton>
          <SurfaceButton active={gap === "tight"} onClick={() => setGap("tight")}>
            Balanced
          </SurfaceButton>
          <SurfaceButton active={gap === "loose"} onClick={() => setGap("loose")}>
            Loose
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Gap is the container&apos;s property. The cards do not know it exists.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <div
              className="grid h-[24rem] grid-cols-2 content-center transition-[gap] duration-300 ease-out sm:h-[13.75rem] sm:grid-cols-3"
              style={{
                gap: gapValue[gap],
                gridTemplateRows: isMobile
                  ? "repeat(3, minmax(6.25rem, 1fr))"
                  : "repeat(2, 6rem)",
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "flex min-h-[6.25rem] flex-col gap-2 bg-preview-surface-muted p-3 dark:bg-preview-dark-stage sm:min-h-[6rem]",
                    gap !== "none" && "rounded-xl border border-preview-border dark:border-preview-dark-border-strong",
                  )}
                >
                  <SkeletonLine className="h-3 w-3/4" />
                  <SkeletonLine className="h-3 w-1/2" />
                  <SkeletonBlock className="mt-auto h-5 w-full" />
                </div>
              ))}
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

// ─── 5. RegularGridExamplesPreview ────────────────────────────────────────────
//
// A peer grid changes only item count and track count. Stable item keys let new
// cards enter without shifting the whole preview card.

type RegularGridMode = "six" | "nine" | "wide";

export function RegularGridExamplesPreview() {
  const [mode, setMode] = useState<RegularGridMode>("six");
  const isMobile = useMobilePreview();
  const itemCount = mode === "nine" ? 9 : mode === "wide" ? 8 : 6;
  const columns =
    isMobile
      ? mode === "wide"
        ? "repeat(3, minmax(0, 1fr))"
        : "repeat(2, minmax(0, 1fr))"
      : mode === "wide"
        ? "repeat(4, minmax(0, 1fr))"
        : "repeat(3, minmax(0, 1fr))";

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={mode === "six"} onClick={() => setMode("six")}>
            Six items
          </SurfaceButton>
          <SurfaceButton active={mode === "nine"} onClick={() => setMode("nine")}>
            Nine items
          </SurfaceButton>
          <SurfaceButton active={mode === "wide"} onClick={() => setMode("wide")}>
            Wider grid
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Peer items keep the same role. The grid only changes tracks and count.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <motion.div
              layout
              transition={layoutTransition}
              className="grid h-[34rem] content-start gap-2.5 sm:h-[18.5rem] sm:content-center sm:gap-3"
              style={{
                gridTemplateColumns: columns,
                gridAutoRows: isMobile ? "6.25rem" : "5rem",
              }}
            >
              <AnimatePresence initial={false}>
                {Array.from({ length: itemCount }).map((_, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={layoutTransition}
                    className="flex min-h-[6.25rem] flex-col gap-2 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-stage sm:h-20 sm:min-h-0"
                  >
                    <SkeletonLine className="h-3 w-3/4" />
                    <SkeletonLine className="h-3 w-1/2" />
                    <SkeletonBlock className="mt-auto h-5 w-full" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

// ─── 6. NamedAreasPreview ─────────────────────────────────────────────────────
//
// A shell layout can name its rectangles before panels render. The buttons
// switch between two maps so the same roles move into different cells.

type AreaMode = "dashboard" | "article";
type AreaTileId = "header" | "nav" | "main" | "aside" | "footer";

const areaTiles: AreaTileId[] = [
  "header",
  "nav",
  "main",
  "aside",
  "footer",
];

const areaLabels: Record<AreaTileId, string> = {
  header: "Header",
  nav: "Nav",
  main: "Main",
  aside: "Aside",
  footer: "Footer",
};

const areaPositions: Record<AreaMode, Record<AreaTileId, CSSProperties>> = {
  dashboard: {
    header: { gridColumn: "1 / span 4", gridRow: "1" },
    nav: { gridColumn: "1", gridRow: "2 / span 3" },
    main: { gridColumn: "2 / span 2", gridRow: "2 / span 3" },
    aside: { gridColumn: "4", gridRow: "2 / span 3" },
    footer: { gridColumn: "1 / span 4", gridRow: "5" },
  },
  article: {
    header: { gridColumn: "1 / span 4", gridRow: "1" },
    main: { gridColumn: "1 / span 3", gridRow: "2 / span 3" },
    aside: { gridColumn: "4", gridRow: "2 / span 2" },
    nav: { gridColumn: "4", gridRow: "4" },
    footer: { gridColumn: "1 / span 4", gridRow: "5" },
  },
};

const mobileAreaPositions: Record<AreaMode, Record<AreaTileId, CSSProperties>> =
  {
    dashboard: {
      header: { gridColumn: "1 / span 2", gridRow: "1" },
      nav: { gridColumn: "1", gridRow: "2 / span 2" },
      main: { gridColumn: "2", gridRow: "2 / span 2" },
      aside: { gridColumn: "1 / span 2", gridRow: "4" },
      footer: { gridColumn: "1 / span 2", gridRow: "5" },
    },
    article: {
      header: { gridColumn: "1 / span 2", gridRow: "1" },
      main: { gridColumn: "1 / span 2", gridRow: "2 / span 2" },
      aside: { gridColumn: "1", gridRow: "4" },
      nav: { gridColumn: "2", gridRow: "4" },
      footer: { gridColumn: "1 / span 2", gridRow: "5" },
    },
  };

function AreaTile({
  id,
  mode,
  mobile,
}: {
  id: AreaTileId;
  mode: AreaMode;
  mobile: boolean;
}) {
  const main = id === "main";

  return (
    <motion.div
      layout
      transition={layoutTransition}
      className={cn(
        "flex min-h-0 flex-col gap-2 rounded-xl border p-2.5 sm:p-3",
        main ? previewCardHighlight : previewCardBase,
      )}
      style={mobile ? mobileAreaPositions[mode][id] : areaPositions[mode][id]}
    >
      <span
        className={cn(
          "text-[11px] font-semibold uppercase tracking-wide",
          "text-preview-text-muted dark:text-preview-dark-text-muted",
        )}
      >
        {areaLabels[id]}
      </span>
      <div className="mt-auto space-y-1.5">
        <SkeletonLine className="h-2.5" />
        <SkeletonLine className="h-2.5 w-2/3" />
      </div>
    </motion.div>
  );
}

export function NamedAreasPreview() {
  const [mode, setMode] = useState<AreaMode>("dashboard");
  const isMobile = useMobilePreview();

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton
            active={mode === "dashboard"}
            onClick={() => setMode("dashboard")}
          >
            Dashboard map
          </SurfaceButton>
          <SurfaceButton
            active={mode === "article"}
            onClick={() => setMode("article")}
          >
            Article map
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          The role names stay put. The area map changes where those roles land.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome className="max-w-2xl">
          <Toolbar />
          <div className="p-3 sm:p-4">
            <motion.div
              layout
              transition={layoutTransition}
              className="grid h-[31.5rem] grid-cols-2 gap-2.5 sm:h-[26rem] sm:grid-cols-4 sm:gap-3"
              style={{
                gridTemplateRows: isMobile
                  ? "4.5rem 7rem 7rem 5.75rem 4.5rem"
                  : "4.75rem repeat(3, minmax(0, 1fr)) 4.75rem",
              }}
            >
              {areaTiles.map((tile) => (
                <AreaTile
                  key={tile}
                  id={tile}
                  mode={mode}
                  mobile={isMobile}
                />
              ))}
            </motion.div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

// ─── 7. AspectRatioPreview ───────────────────────────────────────────────────
//
// The grid tracks stay fixed while image loading changes. The reserved column
// keeps its card height stable because the media rectangle exists up front.

type MediaLoadMode = "pending" | "loaded";

const mediaBlockHeight: Record<MediaLoadMode, string> = {
  pending: "2.75rem",
  loaded: "8rem",
};

export function AspectRatioPreview() {
  const [mode, setMode] = useState<MediaLoadMode>("pending");
  const loaded = mode === "loaded";

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton
            active={mode === "pending"}
            onClick={() => setMode("pending")}
          >
            Before load
          </SurfaceButton>
          <SurfaceButton
            active={mode === "loaded"}
            onClick={() => setMode("loaded")}
          >
            Images loaded
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          The reserved card keeps its height. The unreserved card pushes content down after load.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome className="max-w-2xl">
          <Toolbar />
          <div className="p-3 sm:p-4">
            <div className="grid h-[43rem] grid-cols-1 gap-3 sm:h-[22rem] sm:grid-cols-2">
              <div
                className={cn(
                  "flex h-[21.125rem] flex-col rounded-xl border p-3 sm:h-auto sm:min-h-0",
                  previewCardBase,
                )}
              >
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-preview-text-muted dark:text-preview-dark-text-muted">
                  No ratio
                </p>
                <motion.div
                  layout
                  transition={layoutTransition}
                  className="rounded-lg bg-preview-border dark:bg-preview-dark-surface-active"
                  style={{ height: mediaBlockHeight[mode] }}
                />
                <div className="mt-4 space-y-2.5">
                  <SkeletonLine className="h-2.5 w-4/5" />
                  <SkeletonLine className="h-2.5 w-3/5" />
                  <SkeletonLine className="h-2.5 w-2/3" />
                </div>
                <SkeletonBlock className="mt-auto h-12" />
              </div>

              <div
                className={cn(
                  "flex h-[21.125rem] flex-col rounded-xl border p-3 sm:h-auto sm:min-h-0",
                  previewCardHighlight,
                )}
              >
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-preview-text-muted dark:text-preview-dark-text-muted">
                  Reserved
                </p>
                <div className="grid h-28 grid-cols-2 gap-2 rounded-lg bg-preview-surface p-2 dark:bg-preview-dark-surface">
                  {[0, 1].map((item) => (
                    <motion.div
                      key={item}
                      initial={false}
                      animate={{
                        opacity: loaded ? 1 : 0.45,
                        scale: loaded ? 1 : 0.96,
                      }}
                      transition={fadeTransition}
                      className="rounded-md bg-preview-border dark:bg-preview-dark-surface-active"
                    />
                  ))}
                </div>
                <div className="mt-4 space-y-2.5">
                  <SkeletonLine className="h-2.5 w-4/5" />
                  <SkeletonLine className="h-2.5 w-3/5" />
                  <SkeletonLine className="h-2.5 w-2/3" />
                </div>
                <SkeletonBlock className="mt-auto h-12" />
              </div>
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

// ─── 8. AutoFlowPreview ───────────────────────────────────────────────────────
//
// Items are numbered 1–6. The button changes the placement order.
// In row mode, 1 sits left of 2. In column mode, 1 sits above 2.
// The numbers make the fill direction traceable. The layout itself changes.

type FlowDir = "row" | "column";

const autoFlowPositions: Record<FlowDir, Record<number, CSSProperties>> = {
  row: {
    1: { gridColumn: "1", gridRow: "1" },
    2: { gridColumn: "2", gridRow: "1" },
    3: { gridColumn: "3", gridRow: "1" },
    4: { gridColumn: "1", gridRow: "2" },
    5: { gridColumn: "2", gridRow: "2" },
    6: { gridColumn: "3", gridRow: "2" },
  },
  column: {
    1: { gridColumn: "1", gridRow: "1" },
    2: { gridColumn: "1", gridRow: "2" },
    3: { gridColumn: "2", gridRow: "1" },
    4: { gridColumn: "2", gridRow: "2" },
    5: { gridColumn: "3", gridRow: "1" },
    6: { gridColumn: "3", gridRow: "2" },
  },
};

const mobileAutoFlowPositions: Record<FlowDir, Record<number, CSSProperties>> =
  {
    row: {
      1: { gridColumn: "1", gridRow: "1" },
      2: { gridColumn: "2", gridRow: "1" },
      3: { gridColumn: "1", gridRow: "2" },
      4: { gridColumn: "2", gridRow: "2" },
      5: { gridColumn: "1", gridRow: "3" },
      6: { gridColumn: "2", gridRow: "3" },
    },
    column: {
      1: { gridColumn: "1", gridRow: "1" },
      2: { gridColumn: "1", gridRow: "2" },
      3: { gridColumn: "1", gridRow: "3" },
      4: { gridColumn: "2", gridRow: "1" },
      5: { gridColumn: "2", gridRow: "2" },
      6: { gridColumn: "2", gridRow: "3" },
    },
  };

export function AutoFlowPreview() {
  const [flow, setFlow] = useState<FlowDir>("row");
  const isMobile = useMobilePreview();

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={flow === "row"} onClick={() => setFlow("row")}>
            Row
          </SurfaceButton>
          <SurfaceButton active={flow === "column"} onClick={() => setFlow("column")}>
            Column
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          The numbers show source order. Flow direction decides where each number lands.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <motion.div
              layout
              transition={layoutTransition}
              className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3"
              style={{
                gridTemplateRows: isMobile
                  ? "repeat(3, minmax(6rem, 1fr))"
                  : "repeat(2, minmax(5.5rem, 1fr))",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <motion.div
                  key={n}
                  layout
                  transition={layoutTransition}
                  className="flex min-h-[6rem] flex-col justify-between rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-stage sm:min-h-[5.5rem]"
                  style={
                    isMobile
                      ? mobileAutoFlowPositions[flow][n]
                      : autoFlowPositions[flow][n]
                  }
                >
                  <span className="text-[11px] font-bold tabular-nums text-preview-text dark:text-preview-dark-text">
                    {n}
                  </span>
                  <div className="space-y-1.5">
                    <SkeletonLine className="h-2.5 w-3/4" />
                    <SkeletonLine className="h-2.5 w-1/2" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

// ─── 6. BentoPreview ─────────────────────────────────────────────────────────
//
// Three steps, one change each:
// Step 1 — six equal panels.
// Step 2 — the lead panel earns extra space and nearby panels move around it.
// Step 3 — the composition tightens into a dashboard-like bento.
// Stable keys plus explicit grid positions let Motion animate the layout.

type BentoStep = "equal" | "span" | "compose";
type BentoTileId = "lead" | "metric" | "chart" | "notes" | "tasks" | "status";

const bentoTiles: BentoTileId[] = [
  "lead",
  "metric",
  "chart",
  "notes",
  "tasks",
  "status",
];

const bentoPositions: Record<BentoStep, Record<BentoTileId, CSSProperties>> = {
  equal: {
    lead: { gridColumn: "1 / span 2", gridRow: "1" },
    metric: { gridColumn: "3 / span 2", gridRow: "1" },
    chart: { gridColumn: "1 / span 2", gridRow: "2" },
    notes: { gridColumn: "3 / span 2", gridRow: "2" },
    tasks: { gridColumn: "1 / span 2", gridRow: "3" },
    status: { gridColumn: "3 / span 2", gridRow: "3" },
  },
  span: {
    lead: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
    metric: { gridColumn: "3 / span 2", gridRow: "1" },
    chart: { gridColumn: "3 / span 2", gridRow: "2" },
    notes: { gridColumn: "1", gridRow: "3" },
    tasks: { gridColumn: "2", gridRow: "3" },
    status: { gridColumn: "3 / span 2", gridRow: "3" },
  },
  compose: {
    lead: { gridColumn: "1 / span 2", gridRow: "1 / span 3" },
    metric: { gridColumn: "3", gridRow: "1" },
    chart: { gridColumn: "4", gridRow: "1" },
    notes: { gridColumn: "3 / span 2", gridRow: "2" },
    tasks: { gridColumn: "3", gridRow: "3" },
    status: { gridColumn: "4", gridRow: "3" },
  },
};

const mobileBentoPositions: Record<
  BentoStep,
  Record<BentoTileId, CSSProperties>
> = {
  equal: {
    lead: { gridColumn: "1", gridRow: "1" },
    metric: { gridColumn: "2", gridRow: "1" },
    chart: { gridColumn: "1", gridRow: "2" },
    notes: { gridColumn: "2", gridRow: "2" },
    tasks: { gridColumn: "1", gridRow: "3" },
    status: { gridColumn: "2", gridRow: "3" },
  },
  span: {
    lead: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
    metric: { gridColumn: "1", gridRow: "3" },
    chart: { gridColumn: "2", gridRow: "3" },
    notes: { gridColumn: "1", gridRow: "4" },
    tasks: { gridColumn: "2", gridRow: "4" },
    status: { gridColumn: "1 / span 2", gridRow: "5" },
  },
  compose: {
    lead: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
    metric: { gridColumn: "1", gridRow: "3" },
    chart: { gridColumn: "2", gridRow: "3" },
    notes: { gridColumn: "1 / span 2", gridRow: "4" },
    tasks: { gridColumn: "1", gridRow: "5" },
    status: { gridColumn: "2", gridRow: "5" },
  },
};

function BentoTile({
  id,
  step,
  mobile,
}: {
  id: BentoTileId;
  step: BentoStep;
  mobile: boolean;
}) {
  const isLead = id === "lead";
  const composed = step === "compose";
  const highlighted = isLead && step !== "equal";

  return (
    <motion.div
      layout
      transition={layoutTransition}
      className={cn(
        "relative overflow-hidden rounded-xl border p-2.5 sm:p-3",
        "flex flex-col gap-2",
        highlighted ? previewCardHighlight : previewCardBase,
      )}
      style={mobile ? mobileBentoPositions[step][id] : bentoPositions[step][id]}
    >
      <motion.div
        layout
        transition={layoutTransition}
        className={cn(
          "rounded-full",
          "bg-preview-border dark:bg-preview-dark-surface-active",
          isLead ? "h-3 w-3/5" : "h-2.5 w-2/3",
        )}
      />
      <motion.div
        layout
        transition={layoutTransition}
        className={cn(
          "rounded-full",
          "bg-preview-border dark:bg-preview-dark-surface-active",
          isLead ? "h-3 w-2/5" : "h-2.5 w-1/2",
        )}
      />

      {isLead ? (
        <motion.div
          layout
          transition={layoutTransition}
          className="mt-auto grid grid-cols-4 items-end gap-1.5"
        >
          {[42, 64, 52, 76].map((height) => (
            <motion.div
              key={height}
              initial={false}
              animate={{
                height: step === "equal" ? "1.25rem" : `${height / 16}rem`,
                opacity: step === "equal" ? 0.32 : 1,
              }}
              transition={layoutTransition}
              className={cn(
                "rounded-md",
                "bg-preview-border dark:bg-preview-dark-surface-active",
              )}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={false}
          animate={{
            opacity: composed ? 1 : 0.45,
            scale: composed ? 1 : 0.96,
          }}
          transition={fadeTransition}
          className={cn(
            "mt-auto flex items-center gap-1.5",
            composed ? "opacity-100" : "opacity-50",
          )}
        >
          <div className="h-5 flex-1 rounded-md bg-preview-border dark:bg-preview-dark-surface-active" />
          <div className="h-5 w-7 rounded-md bg-preview-border dark:bg-preview-dark-surface-active" />
        </motion.div>
      )}
    </motion.div>
  );
}

export function BentoExamplesPreview() {
  const [step, setStep] = useState<BentoStep>("equal");
  const isMobile = useMobilePreview();

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={step === "equal"} onClick={() => setStep("equal")}>
            Equal grid
          </SurfaceButton>
          <SurfaceButton active={step === "span"} onClick={() => setStep("span")}>
            Lead spans
          </SurfaceButton>
          <SurfaceButton active={step === "compose"} onClick={() => setStep("compose")}>
            Compose
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Bento is a plain grid where one tile has earned more space.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <motion.div
              layout
              transition={layoutTransition}
              className="grid h-[31rem] grid-cols-2 gap-2.5 sm:h-[16rem] sm:grid-cols-4 sm:gap-3"
              style={{
                gridTemplateRows: isMobile
                  ? "repeat(5, minmax(5.5rem, 1fr))"
                  : "repeat(3, minmax(0, 1fr))",
              }}
            >
              {bentoTiles.map((tile) => (
                <BentoTile
                  key={tile}
                  id={tile}
                  step={step}
                  mobile={isMobile}
                />
              ))}
            </motion.div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

// ─── 7. DensePlacementPreview ─────────────────────────────────────────────────
//
// Item 1 and item 2 span 2 columns. Without dense, the grid leaves a gap —
// shown as a dashed outline so the hole is unambiguous. With dense, the next small item
// slides into the hole. The numbered items make the reorder visible.

type DenseMode = "off" | "on";

const densePositions: Record<DenseMode, Record<number, CSSProperties>> = {
  off: {
    1: { gridColumn: "1 / span 2", gridRow: "1" },
    2: { gridColumn: "1 / span 2", gridRow: "2" },
    3: { gridColumn: "3", gridRow: "2" },
    4: { gridColumn: "1", gridRow: "3" },
    5: { gridColumn: "2", gridRow: "3" },
    6: { gridColumn: "3", gridRow: "3" },
  },
  on: {
    1: { gridColumn: "1 / span 2", gridRow: "1" },
    2: { gridColumn: "1 / span 2", gridRow: "2" },
    3: { gridColumn: "3", gridRow: "1" },
    4: { gridColumn: "3", gridRow: "2" },
    5: { gridColumn: "1", gridRow: "3" },
    6: { gridColumn: "2", gridRow: "3" },
  },
};

const mobileDensePositions: Record<DenseMode, Record<number, CSSProperties>> = {
  off: {
    1: { gridColumn: "1 / span 2", gridRow: "1" },
    2: { gridColumn: "1", gridRow: "2" },
    3: { gridColumn: "1 / span 2", gridRow: "3" },
    4: { gridColumn: "1", gridRow: "4" },
    5: { gridColumn: "2", gridRow: "4" },
    6: { gridColumn: "1", gridRow: "5" },
  },
  on: {
    1: { gridColumn: "1 / span 2", gridRow: "1" },
    2: { gridColumn: "1", gridRow: "2" },
    3: { gridColumn: "2", gridRow: "2" },
    4: { gridColumn: "1 / span 2", gridRow: "3" },
    5: { gridColumn: "1", gridRow: "4" },
    6: { gridColumn: "2", gridRow: "4" },
  },
};

export function DensePlacementPreview() {
  const [dense, setDense] = useState<DenseMode>("off");
  const isMobile = useMobilePreview();

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={dense === "off"} onClick={() => setDense("off")}>
            Normal flow
          </SurfaceButton>
          <SurfaceButton active={dense === "on"} onClick={() => setDense("on")}>
            Dense
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Dense backfills the gap left by a spanning item. Source order diverges from visual order.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <motion.div
              layout
              transition={layoutTransition}
              className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3"
              style={{
                gridTemplateRows: isMobile
                  ? "repeat(5, minmax(5.25rem, 1fr))"
                  : "repeat(3, minmax(5rem, 1fr))",
              }}
            >
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  opacity: dense === "off" ? 1 : 0,
                  scale: dense === "off" ? 1 : 0.94,
                }}
                transition={fadeTransition}
                className="pointer-events-none z-0 flex min-h-[5.25rem] items-center justify-center rounded-xl border border-dashed border-preview-border dark:border-preview-dark-border-strong sm:min-h-[5rem]"
                style={
                  isMobile
                    ? { gridColumn: "2", gridRow: "2" }
                    : { gridColumn: "3", gridRow: "1" }
                }
              >
                <span className="text-[11px] font-medium text-preview-text-muted dark:text-preview-dark-text-muted">
                  gap
                </span>
              </motion.div>

              {/* Items keep stable keys so layout changes can animate. */}
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <motion.div
                  key={n}
                  layout
                  transition={layoutTransition}
                  className={cn(
                    "z-10 flex min-h-[5.25rem] flex-col justify-between rounded-xl p-3 sm:min-h-[5rem]",
                    "border",
                    n === 1 ? previewCardHighlight : previewCardBase,
                  )}
                  style={
                    isMobile
                      ? mobileDensePositions[dense][n]
                      : densePositions[dense][n]
                  }
                >
                  <span
                    className={cn(
                      "text-[11px] font-bold tabular-nums",
                      "text-preview-text dark:text-preview-dark-text",
                    )}
                  >
                    {n}
                  </span>
                  <div className="space-y-1.5">
                    <SkeletonLine className="h-2.5 w-3/4" />
                    <SkeletonLine className="h-2.5 w-1/2" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

// ─── 8. MosaicExamplesPreview ─────────────────────────────────────────────────
//
// Count-based compositions inside a social post chrome.
// Each count maps to a different grid rule — not a scaled version of the same one.

type MosaicCount = 1 | 2 | 3 | 4;

function clampMosaicCount(value: number): MosaicCount {
  return Math.min(4, Math.max(1, value)) as MosaicCount;
}

export function MosaicExamplesPreview() {
  const [count, setCount] = useState<MosaicCount>(1);

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton
            onClick={() => setCount((current) => clampMosaicCount(current - 1))}
          >
            Remove image
          </SurfaceButton>
          <SurfaceButton
            onClick={() => setCount((current) => clampMosaicCount(current + 1))}
          >
            Add image
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          {count} {count === 1 ? "image uses" : "images use"} a count-specific composition rule.
        </PreviewFootnote>
      }
    >
      <Stage>
        <ImageCardSkeleton count={count} />
      </Stage>
    </PreviewCard>
  );
}

// ─── 9. MasonryExamplesPreview ────────────────────────────────────────────────
//
// The same six cards animate between two states:
// Row grid — every card in a row is forced to the tallest card's height.
//   The wasted space at the bottom of shorter cards is visible.
// Packed — each card collapses to its natural height. The column fills in.
// The cards themselves never change content, only their height property animates.

type MasonryMode = "rows" | "pack";

interface MasonryItem {
  id: number;
  naturalRem: number; // natural height
  rowRem: number;     // forced row height (max of its row)
}

// Row 1: items 1,2,3 — tallest is item 2 at 9rem
// Row 2: items 4,5,6 — tallest is item 4 at 7.5rem
const masonryItems: MasonryItem[] = [
  { id: 1,  naturalRem: 5,   rowRem: 9 },
  { id: 2,  naturalRem: 9,   rowRem: 9 },
  { id: 3,  naturalRem: 4,   rowRem: 9 },

  { id: 4,  naturalRem: 7.5, rowRem: 7.5 },
  { id: 5,  naturalRem: 5,   rowRem: 7.5 },
  { id: 6,  naturalRem: 6,   rowRem: 7.5 },

  { id: 7,  naturalRem: 8,   rowRem: 8 },
  { id: 8,  naturalRem: 3.5, rowRem: 8 },
  { id: 9,  naturalRem: 6.5, rowRem: 8 },

  { id: 10, naturalRem: 4.5, rowRem: 8.5 },
  { id: 11, naturalRem: 8.5, rowRem: 8.5 },
  { id: 12, naturalRem: 5.5, rowRem: 8.5 },
];
function packIntoColumns(items: MasonryItem[], cols: number): MasonryItem[][] {
  const columns: { sum: number; items: MasonryItem[] }[] = Array.from(
    { length: cols },
    () => ({ sum: 0, items: [] }),
  );
  items.forEach((item) => {
    const shortest = columns.reduce((best, col) =>
      col.sum < best.sum ? col : best,
    );
    shortest.items.push(item);
    shortest.sum += item.naturalRem;
  });
  return columns.map((c) => c.items);
}

export function MasonryExamplesPreview() {
  const [mode, setMode] = useState<MasonryMode>("rows");
  const isMobile = useMobilePreview();
  const packedColumns = useMemo(
    () =>
      packIntoColumns(
        isMobile ? masonryItems.slice(0, 8) : masonryItems,
        isMobile ? 2 : 3,
      ),
    [isMobile],
  );

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={mode === "rows"} onClick={() => setMode("rows")}>
            Row grid
          </SurfaceButton>
          <SurfaceButton active={mode === "pack"} onClick={() => setMode("pack")}>
            Packed
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Row grid forces every card in a row to match the tallest. Packing lets each card breathe.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <div className="grid h-[36rem] grid-cols-2 gap-2.5 sm:h-[30rem] sm:grid-cols-3 sm:gap-3">
              {packedColumns.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-2.5 sm:gap-3">
                  {col.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-preview-border bg-preview-surface-muted transition-[height] duration-500 ease-in-out dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted"
                      style={{
                        height: `${mode === "rows" ? item.rowRem : item.naturalRem}rem`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
