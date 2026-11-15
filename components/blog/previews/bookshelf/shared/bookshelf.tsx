"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";
import type { Carry, Mode, ShelfEngine } from "../engine/shelf-engine";
import { viewSize } from "./view";
import { POSTERS } from "./posters";
import { DEFAULT_RULES, type Pose, type RowSpec, type Rules } from "./shelf-model";

type RuleOverrides = Partial<Omit<Rules, "W">>;

export interface BookshelfHandle {
  setPose(pose: Pose): void;
  present(id: string, pose: Pose, rules?: RuleOverrides): void;
  turn(id: string, rules?: RuleOverrides): void;
  carry(carry: Carry, rules?: RuleOverrides): void;
  open(id: string): void;
  close(): void;
  placeByStack(id: string, stackMember: string, where: "home" | "beside" | "on"): void;
  hop(id: string, xs: [number, number], rules?: RuleOverrides): void;
}

// the page fades its sections in on load, so each shelf starts later, one at a time, while the browser is idle
const INTRO_MS = 1400;
const queue: (() => void)[] = [];
let pumping = false;

function schedule(job: () => void) {
  queue.push(job);
  if (pumping) return;
  pumping = true;
  const idle =
    window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 16));
  const next = () => {
    const run = queue.shift();
    if (!run) {
      pumping = false;
      return;
    }
    idle(
      () => {
        run();
        next();
      },
      { timeout: 1200 },
    );
  };
  window.setTimeout(next, Math.max(0, INTRO_MS - performance.now()));
}

function SkeletonLine({ className }: { className: string }) {
  return (
    <div
      className={`rounded-full bg-preview-border dark:bg-preview-dark-surface-active ${className}`}
    />
  );
}

// the detail panel over the blurred shelf, drawn as skeleton lines; it fades on the same curve as the blur
function DetailOverlay({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-10"
      style={{
        opacity: visible ? 1 : 0,
        transition: visible ? "opacity 0.55s ease" : "opacity 0.5s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
      onClick={onClose}
    >
      <div className="absolute inset-x-0 top-[62%] flex flex-col items-center gap-2">
        <SkeletonLine className="h-2 w-16" />
        <SkeletonLine className="mt-1 h-4 w-36" />
        <SkeletonLine className="h-2.5 w-28" />
        <SkeletonLine className="mt-2 hidden h-2 w-48 max-w-[70%] sm:block" />
        <SkeletonLine className="hidden h-2 w-40 max-w-[60%] sm:block" />
      </div>
    </div>
  );
}

// the blurred shelf behind the close-up: appears sharp, blurs in, and clears again on the way back
function snapshotStyle(mode: Mode, entered: boolean): CSSProperties {
  if (mode === "shelf") return { opacity: 0, transition: "none" };
  if (mode === "closing")
    return { opacity: 1, filter: "blur(0px)", transition: "filter 0.5s ease, opacity 0.5s ease" };
  return entered
    ? { opacity: 0.5, filter: "blur(10px)", transition: "filter 0.55s ease, opacity 0.55s ease" }
    : { opacity: 1, filter: "blur(0px)", transition: "none" };
}

export const Bookshelf = forwardRef<
  BookshelfHandle,
  {
    spec: RowSpec[];
    W: number;
    rules?: RuleOverrides;
    tap?: "open" | "turn" | "none";
    turnDuration?: number;
    cycle?: Pose[];
    initialHandled?: string | null;
    interactive?: boolean;
    carrying?: boolean; // draws the pointer the scripted carries use
    poster: keyof typeof POSTERS;
    maxWidth?: number;
    onHandledChange?: (handled: { id: string; pose: Pose } | null) => void;
    onModeChange?: (mode: Mode) => void;
  }
>(function Bookshelf(
  {
    spec,
    W,
    rules: overrides,
    tap = "open",
    turnDuration,
    cycle = ["spine", "face", "flat"],
    initialHandled = null,
    interactive = true,
    carrying = false,
    poster,
    maxWidth = 560,
    onHandledChange,
    onModeChange,
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null);
  const snapRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const engine = useRef<ShelfEngine | null>(null);
  const alive = useRef(true);
  const callbacks = useRef({ onHandledChange, onModeChange });
  callbacks.current = { onHandledChange, onModeChange };
  const [mode, setMode] = useState<Mode>("shelf");
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);
  const [posterGone, setPosterGone] = useState(false);
  const rules = useMemo<Rules>(() => ({ W, ...DEFAULT_RULES, ...overrides }), [W, overrides]);
  const latest = useRef({ spec, W, rules, tap, cycle, initialHandled, interactive, turnDuration });
  latest.current = { spec, W, rules, tap, cycle, initialHandled, interactive, turnDuration };
  const view = viewSize(spec.length, W);
  const still = POSTERS[poster];

  // builds the engine once, either from the idle queue or straight away when the footer needs it;
  // three.js loads as its own chunk here, so the page itself never waits for it
  const starting = useRef<Promise<ShelfEngine | null> | null>(null);
  const ensure = () => {
    if (!starting.current)
      starting.current = import("../engine/shelf-engine").then(async ({ ShelfEngine }) => {
        if (!alive.current || !rootRef.current) return null;
        let lastKey = "";
        const e = new ShelfEngine(
          rootRef.current,
          glRef.current!,
          snapRef.current!,
          cursorRef.current,
          latest.current,
          {
            onHandle: (h) => {
              const key = h ? `${h.id}:${h.pose}` : "";
              if (key === lastKey) return;
              lastKey = key;
              callbacks.current.onHandledChange?.(h);
            },
            onMode: (m) => {
              setMode(m);
              callbacks.current.onModeChange?.(m);
            },
            onReady: () => setReady(true),
          },
        );
        engine.current = e;
        await e.start();
        return alive.current ? e : null;
      });
    return starting.current;
  };
  const withEngine = (fn: (e: ShelfEngine) => void) => {
    if (engine.current) fn(engine.current);
    else void ensure().then((e) => e && fn(e));
  };

  useEffect(() => {
    alive.current = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        schedule(() => void ensure());
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(rootRef.current!);
    return () => {
      alive.current = false;
      io.disconnect();
      engine.current?.dispose();
      engine.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engine.current?.setRules(rules);
  }, [rules]);

  // the still stays under the canvas until the canvas has faded in over it
  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setPosterGone(true), 260);
    return () => window.clearTimeout(timer);
  }, [ready]);

  // the blur starts one frame after the sharp copy is in place
  useEffect(() => {
    if (mode !== "detail") {
      setEntered(false);
      return;
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  useImperativeHandle(ref, () => ({
    setPose: (pose) => withEngine((e) => e.setPoseOfHandled(pose)),
    present: (id, pose, r) => withEngine((e) => e.present(id, pose, r)),
    turn: (id, r) => withEngine((e) => e.turn(id, r)),
    carry: (c, r) => withEngine((e) => e.carry(c, r)),
    open: (id) => withEngine((e) => e.openBook(id)),
    close: () => engine.current?.close(),
    placeByStack: (id, member, where) => withEngine((e) => e.placeByStack(id, member, where)),
    hop: (id, xs, r) => withEngine((e) => e.hop(id, xs, r)),
  }));

  return (
    <div className="mx-auto w-full select-none" style={{ maxWidth }}>
      {/* the height comes from the case size, so the page never jumps when the shelf arrives */}
      <div
        ref={rootRef}
        className="relative w-full"
        style={{ aspectRatio: `${view.w} / ${view.h}` }}
        onPointerDownCapture={() => {
          if (interactive) void ensure();
        }}
        onClick={(e) => {
          // a tap on the still before the shelf is live plays once the shelf starts
          if (!interactive || engine.current) return;
          const r = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          void ensure().then((eng) => eng?.tapAt(x, y));
        }}
      >
        {!posterGone ? (
          <>
            <img
              src={still.light}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full dark:hidden"
            />
            <img
              src={still.dark}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 hidden h-full w-full dark:block"
            />
          </>
        ) : null}
        <div
          className="absolute inset-0"
          style={{ opacity: ready ? 1 : 0, transition: "opacity 0.24s ease" }}
        >
          <canvas
            ref={snapRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={snapshotStyle(mode, entered)}
          />
          <canvas ref={glRef} className="absolute inset-0 h-full w-full" />
          {carrying ? (
            <div
              ref={cursorRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-10 size-4 rounded-full border-2 border-preview-surface bg-preview-text opacity-0 shadow-custom transition-opacity duration-200 dark:border-preview-dark-stage dark:bg-preview-dark-text"
            />
          ) : null}
          {mode !== "shelf" ? (
            <DetailOverlay
              visible={mode === "detail" && entered}
              onClose={() => engine.current?.close()}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
});
