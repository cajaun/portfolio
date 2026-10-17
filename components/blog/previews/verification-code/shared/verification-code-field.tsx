"use client";

import {
  animate,
  LayoutGroup,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Fragment, useEffect, useRef } from "react";
import type { KeyboardEvent, SetStateAction } from "react";
import { useTheme } from "next-themes";
import { CodeBox } from "./code-box";

export const CODE_LENGTH = 6;
export const HAS_SEPARATOR = true;

const ACTIVE_COLOR_LIGHT = "#111318";
const ACTIVE_COLOR_DARK = "#F0F0F0";
const ERROR_COLOR = "#FE5870";

export function createEmptyCode() {
  return Array.from({ length: CODE_LENGTH }, () => "");
}

type VerificationCodeFieldProps = {
  code: string[];
  activeIndex: number;
  onCodeChange: (nextCode: SetStateAction<string[]>) => void;
  onActiveIndexChange: (nextIndex: SetStateAction<number>) => void;
  errorPulseKey?: number;
  onInvalidInput?: () => void;
};

export function VerificationCodeField({
  code,
  activeIndex,
  onCodeChange,
  onActiveIndexChange,
  errorPulseKey = 0,
  onInvalidInput,
}: VerificationCodeFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { resolvedTheme } = useTheme();
  const wiggleX = useMotionValue(0);
  const colorProgress = useMotionValue(0);

  const indicatorBorderColor = useTransform(
    colorProgress,
    [0, 1],
    [
      resolvedTheme === "dark" ? ACTIVE_COLOR_DARK : ACTIVE_COLOR_LIGHT,
      ERROR_COLOR,
    ],
  );

  useEffect(() => {
    if (!errorPulseKey) return;

    colorProgress.set(0);
    const colorAnimation = animate(colorProgress, [1, 1, 0], {
      duration: 0.91,
      times: [0, 0.66, 1],
      ease: "easeInOut",
    });
    const wiggleAnimation = animate(wiggleX, [-5, 5, -4, 4, 0], {
      duration: 0.25,
      ease: "easeInOut",
    });

    return () => {
      colorAnimation.stop();
      wiggleAnimation.stop();
    };
  }, [colorProgress, errorPulseKey, wiggleX]);

  const focusInput = () => inputRef.current?.focus();

  const handleBoxPress = (index: number) => {
    onActiveIndexChange(index);
    focusInput();
  };

  const handleChange = (value: string) => {
    const inputChar = value[0];
    if (!inputChar) return;

    if (!/^[0-9]$/.test(inputChar)) {
      onInvalidInput?.();
      return;
    }

    onCodeChange((previous) => {
      const next = [...previous];
      next[activeIndex] = inputChar;
      return next;
    });
    onActiveIndexChange((index) => Math.min(index + 1, CODE_LENGTH - 1));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Backspace") return;

    event.preventDefault();
    onCodeChange((previous) => {
      const next = [...previous];
      next[activeIndex] = "";
      return next;
    });
    onActiveIndexChange((index) => Math.max(index - 1, 0));
  };

  return (
    <LayoutGroup id="verification-code">
      <motion.div
        style={{ x: wiggleX }}
        className="relative flex w-full max-w-[22rem] justify-center gap-1.5 sm:gap-3"
      >
        {code.map((value, index) => {
          const isMiddle =
            HAS_SEPARATOR &&
            CODE_LENGTH % 2 === 0 &&
            index === CODE_LENGTH / 2;

          return (
            <Fragment key={index}>
              {isMiddle ? (
                <span className="flex w-2.5 shrink-0 items-center justify-center text-[15px] font-medium text-preview-text-muted dark:text-preview-dark-text-muted sm:w-5">
                  -
                </span>
              ) : null}
              <CodeBox
                index={index}
                value={value}
                active={activeIndex === index}
                indicatorBorderColor={indicatorBorderColor}
                onPress={handleBoxPress}
              />
            </Fragment>
          );
        })}

        <input
          ref={inputRef}
          aria-label="Verification code input"
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={1}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          value=""
          className="absolute h-px w-px overflow-hidden opacity-0"
        />
      </motion.div>
    </LayoutGroup>
  );
}
