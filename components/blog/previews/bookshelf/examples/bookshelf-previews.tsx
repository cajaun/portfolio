"use client";

import { useRef, useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import type { Mode } from "../engine/shelf-engine";
import { Bookshelf, type BookshelfHandle } from "../shared/bookshelf";
import { FooterButton, FooterRow, PreviewFootnote, Stage, TabsFooter } from "../shared/primitives";
import type { Pose, Rules } from "../shared/shelf-model";
import {
  SHELF_W,
  anatomySpec,
  anchorSpec,
  gapsSpec,
  pushSpec,
  springsSpec,
  stackSpec,
  turnSpec,
} from "./specs";

type RuleOverrides = Partial<Omit<Rules, "W">>;

const poseTabs: { id: Pose; name: string }[] = [
  { id: "spine", name: "Spine out" },
  { id: "face", name: "Face out" },
  { id: "flat", name: "Laid flat" },
];

// the whole shelf, with the same pose control the site shows for the book in hand
export function BookshelfPreview() {
  const shelf = useRef<BookshelfHandle>(null);
  const [handled, setHandled] = useState<{ id: string; pose: Pose } | null>(null);

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <TabsFooter
          tabs={poseTabs}
          selected={handled?.pose ?? "spine"}
          onSelect={(pose) => shelf.current?.setPose(pose)}
          label="How the book sits"
        />
      }
      footnote={
        <PreviewFootnote>Drag a book to move it. The footer turns the book you last touched</PreviewFootnote>
      }
    >
      <Stage>
        <Bookshelf
          ref={shelf}
          spec={anatomySpec}
          W={SHELF_W}
          initialHandled="b10"
          poster="anatomy"
          onHandledChange={setHandled}
        />
      </Stage>
    </PreviewCard>
  );
}

// the footer opens and closes the close-up, the way the modal post's footer opens its dialog
export function BookshelfCloseUpPreview() {
  const shelf = useRef<BookshelfHandle>(null);
  const [mode, setMode] = useState<Mode>("shelf");
  const open = mode !== "shelf";

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <FooterButton active={open} onClick={() => !open && shelf.current?.open("b13")}>
            Take the book out
          </FooterButton>
          <FooterButton active={!open} onClick={() => open && shelf.current?.close()}>
            Put it back
          </FooterButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>Tap a book or use the footer. The detail panel fades in with the blur</PreviewFootnote>
      }
    >
      <Stage>
        <Bookshelf
          ref={shelf}
          spec={anatomySpec}
          W={SHELF_W}
          poster="anatomy"
          onModeChange={setMode}
        />
      </Stage>
    </PreviewCard>
  );
}

export function BookshelfGapsPreview() {
  const [gaps, setGaps] = useState<Rules["gaps"]>("touch");
  const rules = useRef<Record<Rules["gaps"], RuleOverrides>>({
    touch: { gaps: "touch" },
    even: { gaps: "even" },
  }).current;

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <TabsFooter
          tabs={[
            { id: "even", name: "Even gaps" },
            { id: "touch", name: "Spines touch" },
          ]}
          selected={gaps}
          onSelect={setGaps}
          label="Gaps"
        />
      }
      footnote={<PreviewFootnote>Spines sit flush. The stack keeps a little room on each side</PreviewFootnote>}
    >
      <Stage>
        <Bookshelf spec={gapsSpec} W={SHELF_W} rules={rules[gaps]} poster="gaps" interactive={false} />
      </Stage>
    </PreviewCard>
  );
}

// a footer of states: each tab shows the same shelf with one book changed under one rule
function StatePreview<T extends string>({
  spec,
  poster,
  bookId,
  tabs,
  label,
  footnote,
  turnDuration,
}: {
  spec: Parameters<typeof Bookshelf>[0]["spec"];
  poster: Parameters<typeof Bookshelf>[0]["poster"];
  bookId: string;
  tabs: { id: T; name: string; pose: Pose; rules: RuleOverrides }[];
  label: string;
  footnote: string;
  turnDuration?: number;
}) {
  const shelf = useRef<BookshelfHandle>(null);
  const [selected, setSelected] = useState<T>(tabs[0].id);

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <TabsFooter
          tabs={tabs.map(({ id, name }) => ({ id, name }))}
          selected={selected}
          onSelect={(id) => {
            const tab = tabs.find((t) => t.id === id)!;
            setSelected(id);
            shelf.current?.present(bookId, tab.pose, tab.rules);
          }}
          label={label}
        />
      }
      footnote={<PreviewFootnote>{footnote}</PreviewFootnote>}
    >
      <Stage>
        <Bookshelf
          ref={shelf}
          spec={spec}
          W={SHELF_W}
          poster={poster}
          interactive={false}
          turnDuration={turnDuration}
        />
      </Stage>
    </PreviewCard>
  );
}

export function BookshelfPushPreview() {
  return (
    <StatePreview
      spec={pushSpec}
      poster="push"
      bookId="b33"
      label="Push"
      tabs={[
        { id: "standing", name: "Standing", pose: "spine", rules: { push: "fill" } },
        { id: "shift", name: "Shift the row", pose: "flat", rules: { push: "shift" } },
        { id: "fill", name: "Use the gaps", pose: "flat", rules: { push: "fill" } },
      ]}
      footnote="Lay the second book flat with each rule and see which books move"
    />
  );
}

export function BookshelfAnchorPreview() {
  return (
    <StatePreview
      spec={anchorSpec}
      poster="anchor"
      bookId="b48"
      label="Anchor"
      tabs={[
        { id: "spine", name: "Spine out", pose: "spine", rules: { anchor: "centre" } },
        { id: "edge", name: "Keep the edge", pose: "face", rules: { anchor: "edge" } },
        { id: "centre", name: "Keep the centre", pose: "face", rules: { anchor: "centre" } },
      ]}
      footnote="Turn the middle book face out with each anchor and look at which neighbours move"
    />
  );
}

export function BookshelfTurnPreview() {
  return (
    <StatePreview
      spec={turnSpec}
      poster="turn"
      bookId="b56"
      label="Pose"
      turnDuration={1.1}
      tabs={[
        { id: "spine", name: "Spine out", pose: "spine", rules: {} },
        { id: "face", name: "Face out", pose: "face", rules: {} },
        { id: "flat", name: "Laid flat", pose: "flat", rules: {} },
      ]}
      footnote="The book comes forward past the shelf before it turns, then goes back in"
    />
  );
}

export function BookshelfStackPreview() {
  const shelf = useRef<BookshelfHandle>(null);
  const [selected, setSelected] = useState<"home" | "beside" | "on">("home");

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <TabsFooter
          tabs={[
            { id: "home", name: "On its own" },
            { id: "beside", name: "Beside the stack" },
            { id: "on", name: "On the stack" },
          ]}
          selected={selected}
          onSelect={(id) => {
            setSelected(id);
            shelf.current?.placeByStack("b51", "b47", id);
          }}
          label="Stack"
        />
      }
      footnote={<PreviewFootnote>Move the flat book on the right next to the stack, then onto it</PreviewFootnote>}
    >
      <Stage>
        <Bookshelf ref={shelf} spec={stackSpec} W={SHELF_W} poster="stack" interactive={false} />
      </Stage>
    </PreviewCard>
  );
}

export function BookshelfSpringsPreview() {
  const shelf = useRef<BookshelfHandle>(null);
  const [last, setLast] = useState<"one" | "two" | null>(null);
  const press = (id: "one" | "two") => {
    setLast(id);
    shelf.current?.hop("b25", [18, 40], { springs: id });
  };

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <FooterButton active={last === "one"} onClick={() => press("one")}>
            One spring
          </FooterButton>
          <FooterButton active={last === "two"} onClick={() => press("two")}>
            Two springs
          </FooterButton>
        </FooterRow>
      }
      footnote={<PreviewFootnote>Each button carries the same book across the shelf</PreviewFootnote>}
    >
      <Stage>
        <Bookshelf ref={shelf} spec={springsSpec} W={SHELF_W} poster="springs" interactive={false} />
      </Stage>
    </PreviewCard>
  );
}
