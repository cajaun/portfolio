"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const layoutTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.8,
};

const fadeTransition = {
  duration: 0.18,
  ease: "easeOut" as const,
};

function SkeletonLine({
  className,
}: {
  className: string;
}) {
  return (
    <div
      className={`rounded-full bg-black/[0.06] dark:bg-preview-dark-skeleton ${className}`}
    />
  );
}

function ModalSkeletonSurface({
  expanded = false,
  layoutId,
  onClose,
}: {
  expanded?: boolean;
  layoutId?: string;
  onClose?: () => void;
}) {
  return (
    <motion.div
      layout
      layoutId={layoutId}
      transition={layoutTransition}
      className={cn(
        "w-full rounded-[1.25rem] bg-preview-surface p-4 shadow-custom dark:bg-preview-dark-surface",
        expanded
          ? "max-w-[30rem] rounded-[1.5rem] p-5 dark:bg-preview-dark-surface-muted dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          : "max-w-[18rem]",
      )}
      onClick={(event) => event.stopPropagation()}
      role={expanded ? "dialog" : undefined}
      aria-modal={expanded ? true : undefined}
      aria-label={expanded ? "Skeleton modal preview" : undefined}
    >
      <SkeletonLine className={cn("h-5", expanded ? "w-44" : "w-32")} />
      <SkeletonLine
        className={cn("mt-3 h-3", expanded ? "w-64 max-w-full" : "w-44")}
      />
      <SkeletonLine
        className={cn(
          "mt-1.5 h-3",
          expanded ? "w-52 max-w-full" : "w-36",
        )}
      />

      <div className="mt-5 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-raised">
        <SkeletonLine className={cn("h-4", expanded ? "w-36" : "w-28")} />
        <SkeletonLine
          className={cn(
            "mt-2.5 h-3",
            expanded ? "w-52 max-w-full" : "w-40",
          )}
        />
      </div>

      <div className="my-4 border-t border-dashed border-preview-border dark:border-preview-dark-border-strong" />

      <SkeletonLine className={cn("h-4", expanded ? "w-32" : "w-24")} />
      <SkeletonLine
        className={cn("mt-2 h-3", expanded ? "w-56 max-w-full" : "w-40")}
      />
      <div className="mt-4 h-10 rounded-xl border border-preview-border bg-preview-surface dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-raised" />
      <div className="mt-3 h-10 rounded-xl border border-preview-border bg-preview-surface-muted dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-raised" />

      <div className="mt-4 flex items-center justify-between border-t border-preview-border pt-4 dark:border-preview-dark-border-strong">
        <div className="h-9 w-24 rounded-xl border border-preview-border bg-preview-surface-muted dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-raised" />
        {expanded && onClose ? (
          <button
            type="button"
            aria-label="Close modal preview"
            onClick={onClose}
            className="h-9 w-16 rounded-xl border border-preview-border bg-preview-surface-active transition-transform duration-200 active:scale-[0.98] dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-active"
          />
        ) : (
          <div className="h-9 w-16 rounded-xl border border-preview-border bg-preview-surface-active dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-active" />
        )}
      </div>
    </motion.div>
  );
}

function MiniModalSkeleton({ open }: { open: boolean }) {
  return (
    <Stage>
      <div className="flex h-[28rem] w-full items-center justify-center">
        <AnimatePresence initial={false}>
          {!open ? (
            <ModalSkeletonSurface
              key="inline-skeleton-modal"
              layoutId="modal-preview-skeleton"
            />
          ) : null}
        </AnimatePresence>
      </div>
    </Stage>
  );
}

function SkeletonModalOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const root = document.documentElement;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const previousOverflow = root.style.overflow;
    const previousPaddingRight = root.style.paddingRight;

    root.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      root.style.paddingRight = previousPaddingRight
        ? `calc(${previousPaddingRight} + ${scrollbarWidth}px)`
        : `${scrollbarWidth}px`;
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-3 py-8 dark:bg-black/55"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fadeTransition}
      onClick={onClose}
    >
      <ModalSkeletonSurface
        expanded
        layoutId="modal-preview-skeleton"
        onClose={onClose}
      />
    </motion.div>,
    document.body,
  );
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
        "overflow-hidden rounded-[1.4rem] bg-preview-surface shadow-custom dark:bg-preview-dark-surface",
        className ?? "max-w-xl",
      )}
    >
      {children}
    </div>
  );
}

function PreviewModalShell({
  title,
  description,
  compact = false,
}: {
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div className="w-full max-w-[22rem] rounded-[1.25rem] bg-preview-surface p-4 text-preview-text shadow-custom dark:bg-preview-dark-surface-muted dark:text-preview-dark-text dark:shadow-[0_20px_60px_rgba(0,0,0,0.42)]">
      <p className="text-[15px] font-medium tracking-[-0.02em]">{title}</p>
      <p className="mt-1 text-[13px] leading-[1.4] text-gray-200 dark:text-preview-dark-paragraph">
        {description}
      </p>
      <div className="mt-4 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-raised">
        <SkeletonLine className="h-3.5 w-24" />
        <SkeletonLine className="mt-2 h-3 w-36" />
        <SkeletonLine className="mt-1.5 h-3 w-28" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-preview-border pt-4 dark:border-preview-dark-border-strong">
        <div className="h-9 w-24 rounded-xl border border-preview-border bg-preview-surface-muted dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-raised" />
        <div
          className={cn(
            "h-9 rounded-xl border border-preview-border bg-preview-surface-active dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-active",
            compact ? "w-16" : "w-20",
          )}
        />
      </div>
    </div>
  );
}

export function PortalLayerPreview() {
  const [mode, setMode] = useState<"local" | "portal">("portal");

  return (
    <PreviewCard
      full
      footer={
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <SurfaceButton
            active={mode === "local"}
            onClick={() => setMode("local")}
          >
            Without portal
          </SurfaceButton>
          <SurfaceButton
            active={mode === "portal"}
            onClick={() => setMode("portal")}
          >
            With portal
          </SurfaceButton>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-gray-200 dark:text-preview-dark-paragraph">
            The trigger stays in the page. The dialog moves to a cleaner layer.
          </p>
        </div>
      }
    >
      <Stage>
        <LayoutGroup id="portal-layer-preview">
          <Chrome className="relative max-w-xl">
            <div className="flex h-12 items-center justify-between border-b border-preview-border bg-preview-surface-muted px-4 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
              <SkeletonLine className="h-4 w-28" />
              <div className="h-8 w-20 rounded-full border border-preview-border bg-preview-surface-active dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-active" />
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_15rem]">
              <div className="space-y-3">
                <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                  <SkeletonLine className="h-4 w-40" />
                  <SkeletonLine className="mt-2 h-3 w-44" />
                </div>
                <div className="relative h-[12rem] overflow-hidden rounded-xl border border-dashed border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                  <div className="mb-3 flex h-9 items-center rounded-lg border border-preview-border bg-preview-surface px-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface">
                    <SkeletonLine className="h-3 w-24" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLine className="h-3 w-36" />
                    <SkeletonLine className="h-3 w-44" />
                    <SkeletonLine className="h-3 w-28" />
                  </div>

                  <AnimatePresence initial={false}>
                    {mode === "local" ? (
                      <motion.div
                        key="local-modal"
                        layout
                        className="absolute inset-x-4 bottom-[-2.75rem]"
                        transition={layoutTransition}
                      >
                        <motion.div
                          layoutId="portal-preview-modal"
                          transition={layoutTransition}
                        >
                          <PreviewModalShell
                            title="Share this file"
                            description="Rendered inside the clipped container."
                            compact
                          />
                        </motion.div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>

              <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                <SkeletonLine className="h-4 w-24" />
                <SkeletonLine className="mt-2 h-3 w-32" />
                <div className="mt-4 space-y-2">
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border-strong dark:bg-preview-dark-surface" />
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border-strong dark:bg-preview-dark-surface" />
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {mode === "portal" ? (
                <motion.div
                  key="portal-modal"
                  className="absolute inset-0 flex items-center justify-center bg-black/15 px-4 py-8 dark:bg-black/35"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fadeTransition}
                >
                  <motion.div
                    layoutId="portal-preview-modal"
                    className="w-full max-w-[22rem]"
                    transition={layoutTransition}
                  >
                    <PreviewModalShell
                      title="Share this file"
                      description="Rendered above the page through a portal."
                    />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="clip-gradient"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-preview-surface to-transparent dark:from-preview-dark-surface"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fadeTransition}
                />
              )}
            </AnimatePresence>
          </Chrome>
        </LayoutGroup>
      </Stage>
    </PreviewCard>
  );
}

export function ModalFocusPreview() {
  const [locked, setLocked] = useState(true);

  return (
    <PreviewCard
      full
      footer={
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <SurfaceButton active={!locked} onClick={() => setLocked(false)}>
            Unlocked page
          </SurfaceButton>
          <SurfaceButton active={locked} onClick={() => setLocked(true)}>
            Locked modal
          </SurfaceButton>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-gray-200 dark:text-preview-dark-paragraph">
            The page behind the dialog should stop competing for focus and scroll.
          </p>
        </div>
      }
    >
      <Stage>
        <Chrome className="relative max-w-xl">
          <div className="flex h-12 items-center justify-between border-b border-preview-border bg-preview-surface-muted px-4 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
            <SkeletonLine className="h-4 w-28" />
            <div className="h-8 w-20 rounded-full border border-preview-border bg-preview-surface-active dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-active" />
          </div>
          <div className="overflow-hidden">
            <div
              className={cn(
                "grid gap-4 p-4 transition-transform duration-300 md:grid-cols-[minmax(0,1fr)_15rem]",
                locked ? "translate-y-0" : "-translate-y-8",
              )}
            >
              <div className="space-y-3">
                <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                  <SkeletonLine className="h-4 w-40" />
                  <SkeletonLine className="mt-2 h-3 w-44" />
                </div>
                <div className="relative h-[12rem] overflow-hidden rounded-xl border border-dashed border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                  <div className="mb-3 flex h-9 items-center rounded-lg border border-preview-border bg-preview-surface px-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface">
                    <SkeletonLine className="h-3 w-24" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLine className="h-3 w-36" />
                    <SkeletonLine className="h-3 w-44" />
                    <SkeletonLine className="h-3 w-28" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                <SkeletonLine className="h-4 w-24" />
                <SkeletonLine className="mt-2 h-3 w-32" />
                <div className="mt-4 space-y-2">
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border-strong dark:bg-preview-dark-surface" />
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border-strong dark:bg-preview-dark-surface" />
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/15 px-4 py-8 transition-colors duration-300 dark:bg-black/35",
              locked ? "backdrop-blur-[1px]" : "bg-black/5 dark:bg-black/15",
            )}
          >
            <div className="w-full max-w-[22rem]">
              <PreviewModalShell
                title="Share this file"
                description="Rendered above the page through a portal."
              />
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

export function ModalShiftPreview() {
  const [stableLock, setStableLock] = useState(true);

  return (
    <PreviewCard
      full
      footer={
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <SurfaceButton
            active={!stableLock}
            onClick={() => setStableLock(false)}
          >
            Naive lock
          </SurfaceButton>
          <SurfaceButton active={stableLock} onClick={() => setStableLock(true)}>
            Stable lock
          </SurfaceButton>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-gray-200 dark:text-preview-dark-paragraph">
            Reserve the scrollbar gap so the page does not shift when scroll locks.
          </p>
        </div>
      }
    >
      <Stage>
        <Chrome className="relative max-w-xl">
          <div className="flex h-12 items-center justify-between border-b border-preview-border bg-preview-surface-muted px-4 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
            <SkeletonLine className="h-4 w-28" />
            <div className="h-8 w-20 rounded-full border border-preview-border bg-preview-surface-active dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-active" />
          </div>
          <div className="overflow-hidden">
            <div
              className={cn(
                "grid gap-4 p-4 transition-transform duration-300 md:grid-cols-[minmax(0,1fr)_15rem]",
                stableLock ? "translate-x-0" : "-translate-x-3",
              )}
            >
              <div className="space-y-3">
                <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                  <SkeletonLine className="h-4 w-40" />
                  <SkeletonLine className="mt-2 h-3 w-44" />
                </div>
                <div className="relative h-[12rem] overflow-hidden rounded-xl border border-dashed border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                  <div className="mb-3 flex h-9 items-center rounded-lg border border-preview-border bg-preview-surface px-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface">
                    <SkeletonLine className="h-3 w-24" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLine className="h-3 w-36" />
                    <SkeletonLine className="h-3 w-44" />
                    <SkeletonLine className="h-3 w-28" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                <SkeletonLine className="h-4 w-24" />
                <SkeletonLine className="mt-2 h-3 w-32" />
                <div className="mt-4 space-y-2">
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border-strong dark:bg-preview-dark-surface" />
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border-strong dark:bg-preview-dark-surface" />
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/15 px-4 py-8 transition-colors duration-300 dark:bg-black/35",
              stableLock
                ? "backdrop-blur-[1px]"
                : "bg-black/5 dark:bg-black/15",
            )}
          >
            <div className="w-full max-w-[22rem]">
              <PreviewModalShell
                title="Share this file"
                description="Rendered above the page through a portal."
              />
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}

export default function ModalPreview() {
  const [open, setOpen] = useState(false);

  return (
    <LayoutGroup id="modal-state-preview">
      <PreviewCard
        full
        footer={
          <div className="flex items-center justify-center  w-full">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-9 min-w-16 select-none items-center justify-center rounded-lg bg-preview-surface px-3 text-sm font-medium text-preview-text shadow-custom transition-[scale,color,background-color,shadow] duration-200 ease-out will-change-transform active:scale-[0.97] dark:bg-preview-dark-surface dark:text-preview-dark-text "
            >
              Open
            </button>
          </div>
        }
      >
        <MiniModalSkeleton open={open} />
      </PreviewCard>

      <AnimatePresence initial={false}>
        {open ? (
          <SkeletonModalOverlay
            key="expanded-skeleton-modal"
            onClose={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </LayoutGroup>
  );
}
