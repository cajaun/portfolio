"use client";

import { useEffect, useId, useState } from "react";
import PreviewCard from "@/components/ui/previews";
import { createPortal } from "react-dom";

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
          <div className="rounded-xl bg-black px-4 py-2.5 dark:bg-white">
            <p className="text-[14px] font-semibold tracking-[-0.01em] text-white dark:text-black">
              Done
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function ModalPreview() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PreviewCard
        full
        footer={
          <div className="flex items-center justify-center  ">
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
