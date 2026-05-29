import { cn } from "@/lib/utils";

type SupportedImageCount = number;

type GridCellConfig = {
  roundedClass: string;
  spanClass: string;
  aspectRatio: string;
};

const GRID_LAYOUTS: Record<SupportedImageCount, GridCellConfig[]> = {
  1: [
    {
      roundedClass: "rounded-xl",
      spanClass: "col-span-2 row-span-1",
      aspectRatio: "dynamic",
    },
  ],
  2: [
    {
      roundedClass: "rounded-tl-xl rounded-bl-xl",
      spanClass: "col-span-1 row-span-1",
      aspectRatio: "7 / 8",
    },
    {
      roundedClass: "rounded-tr-xl rounded-br-xl",
      spanClass: "col-span-1 row-span-1",
      aspectRatio: "7 / 8",
    },
  ],
  3: [
    {
      roundedClass: "rounded-tl-xl rounded-bl-xl",
      spanClass: "col-span-1 row-span-2",
      aspectRatio: "7 / 8",
    },
    {
      roundedClass: "rounded-tr-xl",
      spanClass: "col-span-1 row-span-1",
      aspectRatio: "7 / 4",
    },
    {
      roundedClass: "rounded-br-xl",
      spanClass: "col-span-1 row-span-1",
      aspectRatio: "7 / 4",
    },
  ],
  4: [
    {
      roundedClass: "rounded-tl-xl",
      spanClass: "col-span-1 row-span-1",
      aspectRatio: "2 / 1",
    },
    {
      roundedClass: "rounded-tr-xl",
      spanClass: "col-span-1 row-span-1",
      aspectRatio: "2 / 1",
    },
    {
      roundedClass: "rounded-bl-xl",
      spanClass: "col-span-1 row-span-1",
      aspectRatio: "2 / 1",
    },
    {
      roundedClass: "rounded-br-xl",
      spanClass: "col-span-1 row-span-1",
      aspectRatio: "2 / 1",
    },
  ],
};

export const getAspectRatio = (height: number, width: number): string => {
  const aspectRatio = width / height;

  if (aspectRatio >= 2) return "2 / 1";
  if (aspectRatio >= 1.77 && aspectRatio < 2) return "16 / 9";
  if (aspectRatio === 1) return "1 / 1";
  if (aspectRatio >= 0.75 && aspectRatio < 1) return "3 / 4";
  return "16 / 9";
};

function getCellConfig(index: number, totalImages: SupportedImageCount) {
  return GRID_LAYOUTS[totalImages][index];
}

export const imageGrid = (index: number, totalImages: SupportedImageCount) => {
  return getCellConfig(index, totalImages).roundedClass;
};

export const imageSpan = (index: number, totalImages: SupportedImageCount) => {
  return getCellConfig(index, totalImages).spanClass;
};

export const gridClasses = (totalImages: SupportedImageCount) => {
  switch (totalImages) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-2";
    default:
      return "grid-cols-2";
  }
};

export const getImageStyle = (
  index: number,
  totalImages: SupportedImageCount,
  height: number,
  width: number,
) => {
  const { aspectRatio } = getCellConfig(index, totalImages);

  return {
    aspectRatio:
      aspectRatio === "dynamic" ? getAspectRatio(height, width) : aspectRatio,
  };
};

export default function TwitterImageGridPreview({
  totalImages,
  showLabels = true,
}: {
  totalImages: SupportedImageCount;
  showLabels?: boolean;
}) {
  const cells = Array.from({ length: totalImages });

  return (
    <div className={`grid ${gridClasses(totalImages)}`}>
      {cells.map((_, index) => (
        <div
          key={index}
          className={`relative w-full ${imageSpan(index, totalImages)}`}
          style={getImageStyle(index, totalImages, 1, 1)}
        >
          <div className="absolute inset-0 p-[1px]">
            <div
              className={cn(
                "relative flex h-full w-full items-center justify-center",
                "border border-preview-border bg-preview-surface-active shadow-custom dark:border-preview-dark-border dark:bg-preview-dark-surface-muted",
                imageGrid(index, totalImages),
              )}
            >
              {showLabels ? (
                <div className="flex h-6 w-12 select-none items-center justify-center rounded-full bg-preview-surface text-xs font-medium text-preview-text shadow-custom dark:bg-preview-dark-surface dark:text-preview-dark-text">
                  {index + 1}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
