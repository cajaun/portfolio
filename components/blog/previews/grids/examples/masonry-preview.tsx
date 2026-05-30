"use client";

import { useMemo, useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
  Chrome,
  FooterRow,
  PreviewFootnote,
  Stage,
  SurfaceButton,
  Toolbar,
  useMobilePreview,
} from "../shared/primitives";



type MasonryMode = "rows" | "pack";

interface MasonryItem {
  id: number;
  naturalRem: number; // natural height
  rowRem: number;     // forced row height (max of its row)
}


const masonryItems: MasonryItem[] = [
  { id: 1,  naturalRem: 5,   rowRem: 9 },
  { id: 2,  naturalRem: 9,   rowRem: 9 },
  { id: 3,  naturalRem: 4,   rowRem: 9 },

  { id: 4,  naturalRem: 7.5, rowRem: 7.5 },
  { id: 5,  naturalRem: 5,   rowRem: 7.5 },
  { id: 6,  naturalRem: 6,   rowRem: 7.5 },

  { id: 7,  naturalRem: 8,   rowRem: 8 },
  { id: 8,  naturalRem: 3.5, rowRem: 8 },
  { id: 9,  naturalRem: 6.5, rowRem: 8 },

  { id: 10, naturalRem: 4.5, rowRem: 8.5 },
  { id: 11, naturalRem: 8.5, rowRem: 8.5 },
  { id: 12, naturalRem: 5.5, rowRem: 8.5 },
];
function packIntoColumns(items: MasonryItem[], cols: number): MasonryItem[][] {
  const columns: { sum: number; items: MasonryItem[] }[] = Array.from(
    { length: cols },
    () => ({ sum: 0, items: [] }),
  );
  items.forEach((item) => {
    const shortest = columns.reduce((best, col) =>
      col.sum < best.sum ? col : best,
    );
    shortest.items.push(item);
    shortest.sum += item.naturalRem;
  });
  return columns.map((c) => c.items);
}

export function MasonryExamplesPreview() {
  const [mode, setMode] = useState<MasonryMode>("rows");
  const isMobile = useMobilePreview();
  const packedColumns = useMemo(
    () =>
      packIntoColumns(
        isMobile ? masonryItems.slice(0, 8) : masonryItems,
        isMobile ? 2 : 3,
      ),
    [isMobile],
  );

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={mode === "rows"} onClick={() => setMode("rows")}>
            Row grid
          </SurfaceButton>
          <SurfaceButton active={mode === "pack"} onClick={() => setMode("pack")}>
            Packed
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Row grid forces every card in a row to match the tallest. Packing lets each card breathe.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <div className="grid h-[36rem] grid-cols-2 gap-2.5 sm:h-[30rem] sm:grid-cols-3 sm:gap-3">
              {packedColumns.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-2.5 sm:gap-3">
                  {col.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-preview-border bg-preview-surface-muted transition-[height] duration-500 ease-in-out dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted"
                      style={{
                        height: `${mode === "rows" ? item.rowRem : item.naturalRem}rem`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
