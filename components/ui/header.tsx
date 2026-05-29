"use client";

import CajaunArt from "@/public/Cajaun_art.png";
import Image from "next/image";
import Link from "next/link";
import { animate, motion, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";
import { SITE } from "@/data/site";

const Header = () => {
  const [isDetached, setIsDetached] = useState(false);
  const selectionStylesRef = useRef<{
    bodyUserSelect: string;
    bodyWebkitUserSelect: string;
    rootUserSelect: string;
    rootWebkitUserSelect: string;
  } | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const lockTextSelection = () => {
    const body = document.body;
    const root = document.documentElement;

    if (!selectionStylesRef.current) {
      selectionStylesRef.current = {
        bodyUserSelect: body.style.userSelect,
        bodyWebkitUserSelect: body.style.getPropertyValue(
          "-webkit-user-select",
        ),
        rootUserSelect: root.style.userSelect,
        rootWebkitUserSelect: root.style.getPropertyValue(
          "-webkit-user-select",
        ),
      };
    }

    body.style.userSelect = "none";
    root.style.userSelect = "none";
    body.style.setProperty("-webkit-user-select", "none");
    root.style.setProperty("-webkit-user-select", "none");
    window.getSelection()?.removeAllRanges();
  };

  const unlockTextSelection = () => {
    const previous = selectionStylesRef.current;

    if (!previous) {
      return;
    }

    const body = document.body;
    const root = document.documentElement;

    body.style.userSelect = previous.bodyUserSelect;
    root.style.userSelect = previous.rootUserSelect;
    body.style.setProperty("-webkit-user-select", previous.bodyWebkitUserSelect);
    root.style.setProperty("-webkit-user-select", previous.rootWebkitUserSelect);
    selectionStylesRef.current = null;
  };

  const snapBack = async () => {
    const spring = {
      type: "spring" as const,
      stiffness: 420,
      damping: 18,
      mass: 0.7,
    };

    await Promise.all([animate(x, 0, spring), animate(y, 0, spring)]);
    setIsDetached(false);
  };

  return (
    <div
      className="relative z-20 mb-16 flex animate-slide-down-fade select-none items-center px-2 isolation-isolate"
      style={{ animationDelay: "90ms" }}
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div
          aria-hidden="true"
          className={`absolute inset-0 rounded-full border border-dashed border-black/10 bg-black/[0.02] dark:border-white/15 dark:bg-white/[0.03] ${
            isDetached ? "opacity-100" : "opacity-0"
          }`}
        />

        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.12}
          style={{ x, y }}
          whileDrag={{
            scale: 1.04,
            zIndex: 80,
            boxShadow:
              "0px 16px 32px rgba(0, 0, 0, 0.12), 0px 4px 12px rgba(0, 0, 0, 0.08)",
          }}
          onDragStart={() => {
            x.stop();
            y.stop();
            lockTextSelection();
            setIsDetached(true);
          }}
          onDragEnd={() => {
            unlockTextSelection();
            snapBack();
          }}
          onPointerDown={() => {
            const releaseSelection = () => {
              window.removeEventListener("pointerup", releaseSelection);
              window.removeEventListener("pointercancel", releaseSelection);
              unlockTextSelection();
            };

            lockTextSelection();
            window.addEventListener("pointerup", releaseSelection);
            window.addEventListener("pointercancel", releaseSelection);
          }}
          className="relative z-10 h-16 w-16 cursor-grab overflow-hidden rounded-full shadow-custom touch-none select-none will-change-transform active:cursor-grabbing"
        >
          <Image
            alt={`Photo of ${SITE.name}`}
            src={CajaunArt}
            className="h-full w-full object-cover pointer-events-none select-none"
            quality={100}
            sizes="64px"
            priority
            draggable={false}
          />
        </motion.div>
      </div>

      <div className="ml-4 select-none">
        <Link href="/">
          <h1 className="mb-0.5 font-medium">{SITE.name}</h1>
        </Link>
        <p className="paragraph group inline-flex items-center justify-center overflow-hidden transition text-gray-200 font-medium dark:text-gray-100">
          <span>{SITE.title}</span>
        </p>
      </div>
    </div>
  );
};

export default Header;
