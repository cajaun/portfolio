"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import { cn } from "@/lib/utils";
import {
  SkeletonLine,
  Stage,
  fadeTransition,
  layoutTransition,
} from "../shared/primitives";

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
