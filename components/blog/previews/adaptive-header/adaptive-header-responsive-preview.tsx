"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import { Stage } from "@/components/blog/previews/grids/shared/primitives";
import { HeaderPreviewCanvas, type HeaderLook } from "./adaptive-header-preview";

export default function HeaderMobilePreview() {
  const [look, setLook] = useState<HeaderLook>("top");

  return (
    <PreviewCard full innerClassName="!p-0">
      <Stage className="relative !py-0 sm:!py-0">
        <AnimatePresence initial={false}>
          {look === "open" ? (
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              onClick={() => setLook("top")}
              className="absolute inset-0 z-10 cursor-default bg-black/20 backdrop-blur-[6px] dark:bg-black/30"
            />
          ) : null}
        </AnimatePresence>
        <div className="relative mx-auto max-w-[25rem]">
          <HeaderPreviewCanvas
            compact
            mobile
            look={look}
            closeLook="top"
            showBackdrop={false}
            onLookChangeAction={setLook}
          />
        </div>
      </Stage>
    </PreviewCard>
  );
}
