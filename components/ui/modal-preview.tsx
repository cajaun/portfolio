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
      className={`rounded-full bg-black/[0.06] dark:bg-white/[0.08] ${className}`}
    />
  );
}

function MiniModalSkeleton() {
  return (
    <div className="flex min-h-[19rem] items-center justify-center px-4 py-10">
      <div className="w-full max-w-[18rem] rounded-[1.25rem] border border-[#EBEBEB] bg-white p-4  dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]">
        <SkeletonLine className="h-5 w-32" />
        <SkeletonLine className="mt-3 h-3 w-44" />
        <SkeletonLine className="mt-1.5 h-3 w-36" />

        <div className="mt-5 rounded-xl border border-[#EBEBEB] bg-[#FCFCFC] p-3 dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]">
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="mt-2.5 h-3 w-40" />
        </div>

        <div className="my-4 border-t border-dashed border-[#EBEBEB] dark:border-[#2C2C2B]" />

        <SkeletonLine className="h-4 w-24" />
        <SkeletonLine className="mt-2 h-3 w-40" />
        <div className="mt-4 h-10 rounded-xl border border-[#EBEBEB] bg-white dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]" />
        <div className="mt-3 h-10 rounded-xl border border-[#EBEBEB] bg-[#FCFCFC] dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]" />

        <div className="mt-4 flex items-center justify-between border-t border-[#EBEBEB] pt-4 dark:border-[#2C2C2B]">
          <div className="h-9 w-24 rounded-xl border border-[#EBEBEB] bg-[#FCFCFC] dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]" />
          <div className="h-9 w-16 rounded-xl border border-[#EBEBEB] bg-[#FCFCFC] dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]" />
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
    <div className="flex size-10 items-center justify-center rounded-full border border-[#EBEBEB] bg-[#FCFCFC] text-[12px] font-medium tracking-[-0.01em] text-black dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)] dark:text-white">
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
        "flex h-9 items-center justify-center rounded-lg border px-3 text-[13px] font-medium tracking-[-0.01em] transition-transform duration-200 active:scale-[0.98]",
        active
          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
          : "border-[#EBEBEB] bg-white text-black shadow-custom dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)] dark:text-white",
      )}
    >
      {children}
    </button>
  );
}

function CenteredPreviewHeader({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="flex w-full items-center justify-center gap-2 text-center">
      <p className="truncate text-[14px] font-medium tracking-[-0.01em] text-black dark:text-white">
        {title}
      </p>
      <span className="text-[12px] text-gray-200 dark:text-gray-100">/</span>
      <p className="truncate text-[12px] font-medium tracking-[-0.01em] text-gray-200 dark:text-gray-100">
        {detail}
      </p>
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
    <div className="w-full max-w-[22rem] rounded-[1.25rem] border border-[#EBEBEB] bg-white p-4 text-black shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)] dark:text-white dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <p className="text-[15px] font-medium tracking-[-0.02em]">{title}</p>
      <p className="mt-1 text-[13px] leading-[1.4] text-gray-200 dark:text-gray-100">
        {description}
      </p>
      <div className="mt-4 rounded-xl border border-[#EBEBEB] bg-[#FCFCFC] p-3 dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]">
        <SkeletonLine className="h-3.5 w-24" />
        <SkeletonLine className="mt-2 h-3 w-36" />
        <SkeletonLine className="mt-1.5 h-3 w-28" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#EBEBEB] pt-4 dark:border-[#2C2C2B]">
        <div className="h-9 w-24 rounded-xl border border-[#EBEBEB] bg-[#FCFCFC] dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]" />
        <div
          className={cn(
            "h-9 rounded-xl bg-black dark:bg-white",
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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
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
        className="w-full max-w-[30rem] rounded-[1.5rem] border border-[#EBEBEB] bg-white p-5 text-black shadow-[0_30px_80px_rgba(0,0,0,0.12)] dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)] dark:text-white dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
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

        <div className="mt-5 rounded-xl border border-[#EBEBEB] bg-[#FCFCFC] p-4 dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]">
          <p className="text-[15px] font-medium tracking-[-0.01em] text-black dark:text-white">
            Anyone with the link can view
          </p>
          <p className="mt-1 text-[14px] leading-6 text-gray-200 dark:text-gray-100">
            cajaun.com/project/valmiera
          </p>
        </div>

        <div className="my-5 border-t border-dashed border-[#EBEBEB] dark:border-[#2C2C2B]" />

        <div>
          <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black dark:text-white">
            People with access
          </h3>
          <p className="mt-1 text-[14px] leading-6 text-gray-200 dark:text-gray-100">
            Email addresses at these domains are allowed.
          </p>
          <div className="mt-4 rounded-xl border border-[#EBEBEB] bg-white px-3 py-3 dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]">
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
          <div className="mt-4 rounded-xl border border-[#EBEBEB] bg-[#FCFCFC] px-4 py-3 dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]">
            <p className="text-[15px] font-medium tracking-[-0.01em] text-black dark:text-white">
              Create a group
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#EBEBEB] pt-5 dark:border-[#2C2C2B]">
          <div className="rounded-xl border border-[#EBEBEB] bg-[#FCFCFC] px-4 py-2.5 dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]">
            <p className="text-[14px] font-medium tracking-[-0.01em] text-black dark:text-white">
              Get embed code
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-black px-4 py-2.5 dark:bg-white"
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
      header={
        <CenteredPreviewHeader
          title="Layout escape"
          detail={mode === "portal" ? "Portal root" : "Local tree"}
        />
      }
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
      <div className="bg-[lab(94.78%_0_0)] px-4 py-10 sm:px-12 dark:bg-[lab(17.06%_0_0)]">
        <div className="relative mx-auto max-w-xl overflow-hidden rounded-[1.4rem] border border-[#EBEBEB] bg-white dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]">
          <div className="flex h-12 items-center justify-between border-b border-[#EBEBEB] px-4 dark:border-[#2C2C2B]">
            <SkeletonLine className="h-4 w-28" />
            <div className="h-8 w-20 rounded-full bg-black dark:bg-white" />
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="space-y-3">
              <div className="rounded-xl border border-[#EBEBEB] bg-[#FCFCFC] p-3 dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]">
                <SkeletonLine className="h-4 w-40" />
                <SkeletonLine className="mt-2 h-3 w-44" />
              </div>
              <div className="relative h-[12rem] overflow-hidden rounded-xl border border-dashed border-[#D8D8D8] bg-[#FCFCFC] p-3 dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]">
                <div className="mb-3 flex h-9 items-center rounded-lg border border-[#EBEBEB] bg-white px-3 dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]">
                  <SkeletonLine className="h-3 w-24" />
                </div>
                <div className="space-y-2">
                  <SkeletonLine className="h-3 w-36" />
                  <SkeletonLine className="h-3 w-44" />
                  <SkeletonLine className="h-3 w-28" />
                </div>

                {mode === "local" ? (
                  <div className="absolute inset-x-4 bottom-[-2.75rem]">
                    <PreviewModalShell
                      title="Share this file"
                      description="Rendered inside the clipped container."
                      compact
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-[#EBEBEB] bg-[#FCFCFC] p-3 dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]">
              <SkeletonLine className="h-4 w-24" />
              <SkeletonLine className="mt-2 h-3 w-32" />
              <div className="mt-4 space-y-2">
                <div className="h-10 rounded-lg border border-[#EBEBEB] bg-white dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]" />
                <div className="h-10 rounded-lg border border-[#EBEBEB] bg-white dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]" />
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
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent dark:from-[lab(3.04863%_0_0)]" />
          )}
        </div>
      </div>
    </PreviewCard>
  );
}

export function ModalClosePreview() {
  const [open, setOpen] = useState(true);
  const [lastAction, setLastAction] = useState("Done button");

  const closeWith = (action: string) => {
    setLastAction(action);
    setOpen(false);
  };

  return (
    <PreviewCard
      full
      header={
        <CenteredPreviewHeader
          title="Exit paths"
          detail={open ? "Modal open" : `Closed with ${lastAction}`}
        />
      }
      footer={
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          {open ? (
            <>
              <SurfaceButton onClick={() => closeWith("Backdrop click")}>
                Backdrop
              </SurfaceButton>
              <SurfaceButton onClick={() => closeWith("Escape key")}>
                Escape
              </SurfaceButton>
              <SurfaceButton active onClick={() => closeWith("Done button")}>
                Done
              </SurfaceButton>
            </>
          ) : (
            <div className="flex w-full items-center justify-center">
              <SurfaceButton active onClick={() => setOpen(true)}>
                Reopen modal
              </SurfaceButton>
            </div>
          )}
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-gray-200 dark:text-gray-100">
            A modal should be easy to leave by click, key, or button.
          </p>
        </div>
      }
    >
      <div className="bg-[lab(94.78%_0_0)] px-4 py-10 sm:px-12 dark:bg-[lab(17.06%_0_0)]">
        <div className="relative mx-auto max-w-xl rounded-[1.4rem] border border-[#EBEBEB] bg-white dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]">
          <div className="h-[19rem] rounded-[1.4rem] bg-[#FCFCFC] p-4 dark:bg-[lab(8.708%_0_0)]">
            <div className="space-y-3">
              <div className="h-10 rounded-lg border border-[#EBEBEB] bg-white dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-24 rounded-xl border border-[#EBEBEB] bg-white dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]" />
                <div className="h-24 rounded-xl border border-[#EBEBEB] bg-white dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]" />
              </div>
            </div>
          </div>

          {open ? (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/15 px-4 py-8 dark:bg-black/35"
              onClick={() => closeWith("Backdrop click")}
            >
              <div
                className="w-full max-w-[22rem]"
                onClick={(event) => event.stopPropagation()}
              >
                <PreviewModalShell
                  title="Share this file"
                  description="The same component can support several clear exits."
                />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
              <div className="rounded-full border border-[#EBEBEB] bg-white px-3 py-2 text-[13px] font-medium tracking-[-0.01em] text-black shadow-custom dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)] dark:text-white">
                Closed with {lastAction}
              </div>
            </div>
          )}
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
              className="flex h-9 min-w-16 select-none items-center justify-center rounded-lg bg-white px-3 text-sm font-medium text-black shadow-custom transition-[scale,color,background-color,shadow] duration-200 ease-out will-change-transform active:scale-[0.97] dark:bg-[lab(3.04863%_0_0)] dark:text-white "
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
