"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  LayoutGroup,
  type Transition,
  motion,
} from "motion/react";
import {
  Children,
  cloneElement,
  type HTMLAttributes,
  type ReactElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type AnimatedBackgroundChildProps = HTMLAttributes<HTMLElement> & {
  "data-id": string;
  "data-checked"?: string;
};

export type AnimatedBackgroundProps = {
  children:
    | ReactElement<AnimatedBackgroundChildProps>[]
    | ReactElement<AnimatedBackgroundChildProps>;
  defaultValue?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  containerClassName?: string;
  transition?: Transition;
  enableHover?: boolean;
  hoverExitDelay?: number;
  singleBackground?: boolean;
};

type BackgroundRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  containerClassName,
  transition,
  enableHover = false,
  hoverExitDelay = 0,
  singleBackground = false,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [backgroundRect, setBackgroundRect] = useState<BackgroundRect | null>(
    null,
  );
  const uniqueId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverExitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleSetActiveId = (id: string | null) => {
    if (hoverExitTimeoutRef.current) {
      clearTimeout(hoverExitTimeoutRef.current);
      hoverExitTimeoutRef.current = null;
    }

    setActiveId(id);
    onValueChange?.(id);
  };

  const handleClearActiveId = () => {
    if (!hoverExitDelay) {
      handleSetActiveId(null);
      return;
    }

    hoverExitTimeoutRef.current = setTimeout(() => {
      handleSetActiveId(null);
    }, hoverExitDelay);
  };

  useEffect(() => {
    if (defaultValue !== undefined) {
      setActiveId(defaultValue);
    }
  }, [defaultValue]);

  const updateBackgroundRect = useCallback(() => {
    if (!singleBackground || !activeId || !containerRef.current) {
      setBackgroundRect(null);
      return;
    }

    const activeElement = Array.from(containerRef.current.children).find(
      (element) => element.getAttribute("data-id") === activeId,
    );

    if (!(activeElement instanceof HTMLElement)) {
      setBackgroundRect(null);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();

    setBackgroundRect({
      x: activeRect.left - containerRect.left,
      y: activeRect.top - containerRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [activeId, singleBackground]);

  useLayoutEffect(() => {
    updateBackgroundRect();
  }, [updateBackgroundRect, children]);

  useEffect(() => {
    if (!singleBackground) {
      return;
    }

    window.addEventListener("resize", updateBackgroundRect);

    return () => {
      window.removeEventListener("resize", updateBackgroundRect);
    };
  }, [singleBackground, updateBackgroundRect]);

  useEffect(() => {
    return () => {
      if (hoverExitTimeoutRef.current) {
        clearTimeout(hoverExitTimeoutRef.current);
      }
    };
  }, []);

  const items = Children.map(children, (child, index) => {
    const id = child.props["data-id"];

    const interactionProps = enableHover
      ? {
          onMouseEnter: () => handleSetActiveId(id),
          onMouseLeave: handleClearActiveId,
        }
      : {
          onClick: () => handleSetActiveId(id),
        };

    if (singleBackground) {
      return cloneElement(child, {
        key: child.key ?? index,
        className: cn("relative z-10", child.props.className),
        "data-checked": activeId === id ? "true" : "false",
        ...interactionProps,
      });
    }

    return cloneElement(
      child,
      {
        key: child.key ?? index,
        className: cn("relative", child.props.className),
        "data-checked": activeId === id ? "true" : "false",
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {activeId === id && (
            <motion.div
              layoutId={`background-${uniqueId}`}
              className={cn("absolute inset-0", className)}
              transition={transition}
              initial={{ opacity: defaultValue ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        {child.props.children}
      </>,
    );
  });

  if (singleBackground) {
    return (
      <div ref={containerRef} className={cn("relative", containerClassName)}>
        <AnimatePresence initial={false}>
          {backgroundRect && (
            <motion.div
              key="background"
              className={cn("absolute left-0 top-0 -z-10", className)} 
              style={{
                width: backgroundRect.width,
                height: backgroundRect.height,
              }}
              transition={transition}
              initial={{
                opacity: defaultValue ? 1 : 0,
                x: backgroundRect.x,
                y: backgroundRect.y,
              }}
              animate={{
                opacity: 1,
                x: backgroundRect.x,
                y: backgroundRect.y,
              }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        {items}
      </div>
    );
  }

  return <LayoutGroup id={uniqueId}>{items}</LayoutGroup>;
}
