"use client";

import { useEffect, useState } from "react";
import type { SetStateAction } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
  CODE_LENGTH,
  VerificationCodeField,
} from "./verification-code-field";
import {
  PreviewTabs,
  PreviewFootnote,
  Stage,
} from "./primitives";

type VerificationState = "empty" | "partial" | "complete";

const SAMPLE_CODE = "222222";

const ANATOMY_TABS = [
  { id: "empty", name: "Empty" },
  { id: "partial", name: "Partial" },
  { id: "complete", name: "Complete" },
] as const;

const ACTIVE_CELL_TABS = Array.from({ length: CODE_LENGTH }, (_, index) => ({
  id: String(index),
  name: String(index + 1),
}));

const MOTION_TABS = [
  { id: "placeholder", name: "Placeholder" },
  { id: "digit", name: "Digit" },
] as const;

const ERROR_TABS = [
  { id: "ready", name: "Ready" },
  { id: "invalid", name: "Invalid" },
] as const;

function codeForState(nextState: VerificationState) {
  const count =
    nextState === "empty" ? 0 : nextState === "partial" ? 3 : CODE_LENGTH;

  return [
    ...SAMPLE_CODE.slice(0, count).split(""),
    ...Array.from({ length: CODE_LENGTH - count }, () => ""),
  ];
}

function VerificationStage({
  activeIndex,
  code,
  errorPulseKey,
  onActiveIndexChange,
  onCodeChange,
  onInvalidInput,
}: {
  activeIndex: number;
  code: string[];
  errorPulseKey?: number;
  onActiveIndexChange: (nextIndex: SetStateAction<number>) => void;
  onCodeChange: (nextCode: SetStateAction<string[]>) => void;
  onInvalidInput?: () => void;
}) {
  return (
    <Stage>
      <div className="flex min-h-[18rem] items-center justify-center px-2 sm:min-h-[22rem]">
        <VerificationCodeField
          activeIndex={activeIndex}
          code={code}
          errorPulseKey={errorPulseKey}
          onActiveIndexChange={onActiveIndexChange}
          onCodeChange={onCodeChange}
          onInvalidInput={onInvalidInput}
        />
      </div>
    </Stage>
  );
}

export function VerificationCodeAnatomyPreview({
  footnote = "The value changes while every visible cell keeps its address",
}: {
  footnote?: string;
}) {
  const [state, setState] = useState<VerificationState>("empty");
  const activeIndex =
    state === "complete" ? CODE_LENGTH - 1 : state === "partial" ? 3 : 0;

  return (
    <PreviewCard
      full
      footer={
        <PreviewTabs
          label="Verification code anatomy"
          onSelect={(nextState) => setState(nextState as VerificationState)}
          selected={state}
          tabs={ANATOMY_TABS}
        />
      }
      innerClassName="!p-0"
      footnote={<PreviewFootnote>{footnote}</PreviewFootnote>}
    >
      <VerificationStage
        activeIndex={activeIndex}
        code={codeForState(state)}
        onActiveIndexChange={() => undefined}
        onCodeChange={() => undefined}
      />
    </PreviewCard>
  );
}

export function VerificationCodeIndicatorPreview({
  footnote = "One indicator moves between the cells that share the same layout",
}: {
  footnote?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <PreviewCard
      full
      footer={
        <PreviewTabs
          label="Active code cell"
          onSelect={(index) => setActiveIndex(Number(index))}
          selected={String(activeIndex)}
          tabs={ACTIVE_CELL_TABS}
        />
      }
      innerClassName="!p-0"
      footnote={<PreviewFootnote>{footnote}</PreviewFootnote>}
    >
      <VerificationStage
        activeIndex={activeIndex}
        code={codeForState("complete")}
        onActiveIndexChange={setActiveIndex}
        onCodeChange={() => undefined}
      />
    </PreviewCard>
  );
}

export function VerificationCodeMotionPreview({
  footnote = "The placeholder fades while the digit rolls into the same position",
}: {
  footnote?: string;
}) {
  const [state, setState] = useState<"placeholder" | "digit">("placeholder");
  const code = state === "digit" ? ["", "", "2", "", "", ""] : ["", "", "", "", "", ""];

  return (
    <PreviewCard
      full
      footer={
        <PreviewTabs
          label="Digit motion states"
          onSelect={(nextState) =>
            setState(nextState as "placeholder" | "digit")
          }
          selected={state}
          tabs={MOTION_TABS}
        />
      }
      innerClassName="!p-0"
      footnote={<PreviewFootnote>{footnote}</PreviewFootnote>}
    >
      <VerificationStage
        activeIndex={2}
        code={code}
        onActiveIndexChange={() => undefined}
        onCodeChange={() => undefined}
      />
    </PreviewCard>
  );
}

export function VerificationCodeErrorPreview({
  footnote = "The active boundary reports an invalid value without changing the code",
}: {
  footnote?: string;
}) {
  const [state, setState] = useState<"ready" | "invalid">("ready");
  const [errorPulseKey, setErrorPulseKey] = useState(0);

  useEffect(() => {
    if (state === "invalid") {
      setErrorPulseKey((key) => key + 1);
    }
  }, [state]);

  return (
    <PreviewCard
      full
      footer={
        <PreviewTabs
          label="Verification code validation"
          onSelect={(nextState) => setState(nextState as "ready" | "invalid")}
          selected={state}
          tabs={ERROR_TABS}
        />
      }
      innerClassName="!p-0"
      footnote={<PreviewFootnote>{footnote}</PreviewFootnote>}
    >
      <VerificationStage
        activeIndex={CODE_LENGTH - 1}
        code={codeForState("complete")}
        errorPulseKey={errorPulseKey}
        onActiveIndexChange={() => undefined}
        onCodeChange={() => undefined}
      />
    </PreviewCard>
  );
}
