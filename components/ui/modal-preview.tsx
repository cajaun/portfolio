"use client";

import { useEffect, useId, useState } from "react";
import PreviewCard from "@/components/ui/previews";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

function SkeletonLine({
  className,
}: {
  className: string;
}) {
  return (
    <div
      className={`rounded-full bg-black/[0.06] dark:bg-preview-surface/[0.08] ${className}`}
    />
  );
}

function MiniModalSkeleton() {
  return (
    <div className="flex min-h-[19rem] items-center justify-center px-4 py-10">
      <div className="w-full max-w-[18rem] rounded-[1.25rem] bg-preview-surface p-4 shadow-custom dark:bg-preview-dark-surface">
        <SkeletonLine className="h-5 w-32" />
        <SkeletonLine className="mt-3 h-3 w-44" />
        <SkeletonLine className="mt-1.5 h-3 w-36" />

        <div className="mt-5 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="mt-2.5 h-3 w-40" />
        </div>

        <div className="my-4 border-t border-dashed border-preview-border dark:border-preview-dark-border" />

        <SkeletonLine className="h-4 w-24" />
        <SkeletonLine className="mt-2 h-3 w-40" />
        <div className="mt-4 h-10 rounded-xl border border-preview-border bg-preview-surface dark:border-preview-dark-border dark:bg-preview-dark-surface" />
        <div className="mt-3 h-10 rounded-xl border border-preview-border bg-preview-surface-muted dark:border-preview-dark-border dark:bg-preview-dark-surface-muted" />

        <div className="mt-4 flex items-center justify-between border-t border-preview-border pt-4 dark:border-preview-dark-border">
          <div className="h-9 w-24 rounded-xl border border-preview-border bg-preview-surface-muted dark:border-preview-dark-border dark:bg-preview-dark-surface-muted" />
          <div className="h-9 w-16 rounded-xl border border-preview-border bg-preview-surface-muted dark:border-preview-dark-border dark:bg-preview-dark-surface-muted" />
        </div>
      </div>
    </div>
  );
}

function Avatar({
  initials,
}: {
  initials: string;
}) {
  return (
    <div className="flex size-10 items-center justify-center rounded-full border border-preview-border bg-preview-surface-muted text-[12px] font-medium tracking-[-0.01em] text-black dark:border-preview-dark-border dark:bg-preview-dark-surface-muted dark:text-white">
      {initials}
    </div>
  );
}

function SurfaceButton({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
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
          ? "bg-preview-surface-active text-preview-text shadow-custom dark:bg-preview-dark-active dark:text-white"
          : "bg-preview-surface text-black shadow-custom dark:border-preview-dark-border dark:bg-preview-dark-surface dark:text-white",
      )}
    >
      {children}
    </button>
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
    <div className="w-full max-w-[22rem] rounded-[1.25rem] bg-preview-surface p-4 text-black shadow-custom dark:bg-preview-dark-surface dark:text-white dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <p className="text-[15px] font-medium tracking-[-0.02em]">{title}</p>
      <p className="mt-1 text-[13px] leading-[1.4] text-gray-200 dark:text-gray-100">
        {description}
      </p>
      <div className="mt-4 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
        <SkeletonLine className="h-3.5 w-24" />
        <SkeletonLine className="mt-2 h-3 w-36" />
        <SkeletonLine className="mt-1.5 h-3 w-28" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-preview-border pt-4 dark:border-preview-dark-border">
        <div className="h-9 w-24 rounded-xl border border-preview-border bg-preview-surface-muted dark:border-preview-dark-border dark:bg-preview-dark-surface-muted" />
        <div
          className={cn(
            "h-9 rounded-xl bg-black dark:bg-preview-surface",
            compact ? "w-16" : "w-20",
          )}
        />
      </div>
    </div>
  );
}

function ShareModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

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
  }, [open, onClose]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-3 py-8 dark:bg-black/55"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-[30rem] rounded-[1.5rem] border border-preview-border bg-preview-surface p-5 text-black shadow-[0_30px_80px_rgba(0,0,0,0.12)] dark:border-preview-dark-border dark:bg-preview-dark-surface dark:text-white dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id={titleId}
          className="text-[1.45rem] font-medium tracking-[-0.03em] text-black dark:text-white"
        >
          Share this file
        </h2>
        <p
          id={descriptionId}
          className="mt-2 text-[15px] font-medium leading-6 tracking-[-0.01em] text-gray-200 dark:text-gray-100"
        >
          Invite your team to review and collaborate.
        </p>

        <div className="mt-5 rounded-xl border border-preview-border bg-preview-surface-muted p-4 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
          <p className="text-[15px] font-medium tracking-[-0.01em] text-black dark:text-white">
            Anyone with the link can view
          </p>
          <p className="mt-1 text-[14px] leading-6 text-gray-200 dark:text-gray-100">
            cajaun.com/project/valmiera
          </p>
        </div>

        <div className="my-5 border-t border-dashed border-preview-border dark:border-preview-dark-border" />

        <div>
          <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black dark:text-white">
            People with access
          </h3>
          <p className="mt-1 text-[14px] leading-6 text-gray-200 dark:text-gray-100">
            Email addresses at these domains are allowed.
          </p>
          <div className="mt-4 rounded-xl border border-preview-border bg-preview-surface px-3 py-3 dark:border-preview-dark-border dark:bg-preview-dark-surface">
            <p className="text-[14px] text-gray-200 dark:text-gray-100">
              Search by name, email or group
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Avatar initials="JB" />
            <div className="flex-1">
              <p className="text-[15px] font-medium tracking-[-0.01em] text-black dark:text-white">
                Justin Brown
              </p>
              <p className=" text-[14px]  text-gray-200 dark:text-gray-100">
                justin@gmail.com
              </p>
            </div>
            <p className="text-[14px] font-medium tracking-[-0.01em] text-gray-200 dark:text-gray-100">
              Viewer
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-preview-border bg-preview-surface-muted px-4 py-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
            <p className="text-[15px] font-medium tracking-[-0.01em] text-black dark:text-white">
              Create a group
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-preview-border pt-5 dark:border-preview-dark-border">
          <div className="rounded-xl border border-preview-border bg-preview-surface-muted px-4 py-2.5 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
            <p className="text-[14px] font-medium tracking-[-0.01em] text-black dark:text-white">
              Get embed code
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-black px-4 py-2.5 dark:bg-preview-surface"
          >
            <p className="text-[14px] font-semibold tracking-[-0.01em] text-white dark:text-black">
              Done
            </p>
          </button>
        </div>
      </div>
    </div>,
    document.body,
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
          <p className="text-center text-[13px] text-gray-200 dark:text-gray-100">
            The trigger stays in the page. The dialog moves to a cleaner layer.
          </p>
        </div>
      }
    >
      <div className="bg-preview-surface px-4 py-10 sm:px-12 dark:bg-preview-dark-stage">
        <div className="relative mx-auto max-w-xl overflow-hidden rounded-[1.4rem] bg-preview-surface shadow-custom dark:bg-preview-dark-surface">
          <div className="flex h-12 items-center justify-between border-b border-preview-border px-4 dark:border-preview-dark-border">
            <SkeletonLine className="h-4 w-28" />
            <div className="h-8 w-20 rounded-full bg-black dark:bg-preview-surface" />
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="space-y-3">
              <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
                <SkeletonLine className="h-4 w-40" />
                <SkeletonLine className="mt-2 h-3 w-44" />
              </div>
              <div className="relative h-[12rem] overflow-hidden rounded-xl border border-dashed border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
                <div className="mb-3 flex h-9 items-center rounded-lg border border-preview-border bg-preview-surface px-3 dark:border-preview-dark-border dark:bg-preview-dark-surface">
                  <SkeletonLine className="h-3 w-24" />
                </div>
                <div className="space-y-2">
                  <SkeletonLine className="h-3 w-36" />
                  <SkeletonLine className="h-3 w-44" />
                  <SkeletonLine className="h-3 w-28" />
                </div>

                {mode === "local" ? (
                  <div className="absolute inset-x-4 bottom-[-2.75rem] ">
                    <PreviewModalShell
                      title="Share this file"
                      description="Rendered inside the clipped container."
                      compact
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
              <SkeletonLine className="h-4 w-24" />
              <SkeletonLine className="mt-2 h-3 w-32" />
              <div className="mt-4 space-y-2">
                <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border dark:bg-preview-dark-surface" />
                <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border dark:bg-preview-dark-surface" />
              </div>
            </div>
          </div>

          {mode === "portal" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/15 px-4 py-8 dark:bg-black/35">
              <PreviewModalShell
                title="Share this file"
                description="Rendered above the page through a portal."
              />
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-preview-surface to-transparent dark:from-preview-dark-surface" />
          )}
        </div>
      </div>
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
          <p className="text-center text-[13px] text-gray-200 dark:text-gray-100">
            The page behind the dialog should stop competing for focus and scroll.
          </p>
        </div>
      }
    >
      <div className="bg-preview-surface px-4 py-10 sm:px-12 dark:bg-preview-dark-stage">
        <div className="relative mx-auto max-w-xl overflow-hidden rounded-[1.4rem] bg-preview-surface shadow-custom dark:bg-preview-dark-surface">
          <div className="flex h-12 items-center justify-between border-b border-preview-border px-4 dark:border-preview-dark-border">
            <SkeletonLine className="h-4 w-28" />
            <div className="h-8 w-20 rounded-full bg-black dark:bg-preview-surface" />
          </div>
          <div className="overflow-hidden">
            <div
              className={cn(
                "grid gap-4 p-4 transition-transform duration-300 md:grid-cols-[minmax(0,1fr)_15rem]",
                locked ? "translate-y-0" : "-translate-y-8",
              )}
            >
              <div className="space-y-3">
                <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
                  <SkeletonLine className="h-4 w-40" />
                  <SkeletonLine className="mt-2 h-3 w-44" />
                </div>
                <div className="relative h-[12rem] overflow-hidden rounded-xl border border-dashed border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
                  <div className="mb-3 flex h-9 items-center rounded-lg border border-preview-border bg-preview-surface px-3 dark:border-preview-dark-border dark:bg-preview-dark-surface">
                    <SkeletonLine className="h-3 w-24" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLine className="h-3 w-36" />
                    <SkeletonLine className="h-3 w-44" />
                    <SkeletonLine className="h-3 w-28" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
                <SkeletonLine className="h-4 w-24" />
                <SkeletonLine className="mt-2 h-3 w-32" />
                <div className="mt-4 space-y-2">
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border dark:bg-preview-dark-surface" />
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border dark:bg-preview-dark-surface" />
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
        </div>
      </div>
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
          <p className="text-center text-[13px] text-gray-200 dark:text-gray-100">
            Reserve the scrollbar gap so the page does not shift when scroll locks.
          </p>
        </div>
      }
    >
      <div className="bg-preview-surface px-4 py-10 sm:px-12 dark:bg-preview-dark-stage">
        <div className="relative mx-auto max-w-xl overflow-hidden rounded-[1.4rem] bg-preview-surface shadow-custom dark:bg-preview-dark-surface">
          <div className="flex h-12 items-center justify-between border-b border-preview-border px-4 dark:border-preview-dark-border">
            <SkeletonLine className="h-4 w-28" />
            <div className="h-8 w-20 rounded-full bg-black dark:bg-preview-surface" />
          </div>
          <div className="overflow-hidden">
            <div
              className={cn(
                "grid gap-4 p-4 transition-transform duration-300 md:grid-cols-[minmax(0,1fr)_15rem]",
                stableLock ? "translate-x-0" : "-translate-x-3",
              )}
            >
              <div className="space-y-3">
                <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
                  <SkeletonLine className="h-4 w-40" />
                  <SkeletonLine className="mt-2 h-3 w-44" />
                </div>
                <div className="relative h-[12rem] overflow-hidden rounded-xl border border-dashed border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
                  <div className="mb-3 flex h-9 items-center rounded-lg border border-preview-border bg-preview-surface px-3 dark:border-preview-dark-border dark:bg-preview-dark-surface">
                    <SkeletonLine className="h-3 w-24" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLine className="h-3 w-36" />
                    <SkeletonLine className="h-3 w-44" />
                    <SkeletonLine className="h-3 w-28" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
                <SkeletonLine className="h-4 w-24" />
                <SkeletonLine className="mt-2 h-3 w-32" />
                <div className="mt-4 space-y-2">
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border dark:bg-preview-dark-surface" />
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border dark:bg-preview-dark-surface" />
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
        </div>
      </div>
    </PreviewCard>
  );
}

export default function ModalPreview() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PreviewCard
        full
        footer={
          <div className="flex items-center justify-center  w-full">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-9 min-w-16 select-none items-center justify-center rounded-lg bg-preview-surface px-3 text-sm font-medium text-black shadow-custom transition-[scale,color,background-color,shadow] duration-200 ease-out will-change-transform active:scale-[0.97] dark:bg-preview-dark-surface dark:text-white "
            >
              Open
            </button>
          </div>
        }
      >
        <MiniModalSkeleton />
      </PreviewCard>

      <ShareModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
