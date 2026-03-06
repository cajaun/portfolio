import Image from "next/image";
import { ReactNode } from "react";

type ImageItem = {
  url: string;
  width: number;
  height: number;
};

const demoImages: ImageItem[] = [
  { url: "/ac.jpeg", width: 3024, height: 4032 },
  { url: "/cafe.jpeg", width: 3024, height: 4032 },
  { url: "/george.jpeg", width: 3024, height: 4032 },
  { url: "/highway.jpeg", width: 3024, height: 4032 },
  { url: "/plane.jpeg", width: 3024, height: 4032 },
];

export const getAspectRatio = (height: number, width: number): string => {
  const aspectRatio = width / height;

  if (aspectRatio >= 2) return "2 / 1";
  if (aspectRatio >= 1.77 && aspectRatio < 2) return "16 / 9";
  if (aspectRatio === 1) return "1 / 1";
  if (aspectRatio >= 0.75 && aspectRatio < 1) return "3 / 4";
  return "16 / 9";
};

export const imageGrid = (index: number, totalImages: number) => {
  let roundedClass = "";

  if (totalImages === 1) {
    roundedClass = "rounded-xl";
  } else if (totalImages === 2) {
    roundedClass =
      index === 0
        ? "rounded-tl-xl rounded-bl-xl"
        : "rounded-tr-xl rounded-br-xl";
  } else if (totalImages === 3) {
    roundedClass =
      index === 0
        ? "rounded-tl-xl rounded-bl-xl col-span-1 row-span-2"
        : index === 1
          ? "rounded-tr-xl col-span-1"
          : "rounded-br-xl col-span-1";
  } else if (totalImages === 4) {
    roundedClass =
      index === 0
        ? "rounded-tl-xl"
        : index === 1
          ? "rounded-tr-xl"
          : index === totalImages - 1
            ? "rounded-br-xl"
            : "rounded-bl-xl";
  }

  return ` ${roundedClass}`;
};

export const imageSpan = (index: number, totalImages: number) => {
  let span = "";

  if (totalImages === 1) {
    span = "col-span-2 row-span-1";
  } else if (totalImages === 2) {
    span = "col-span-1 row-span-1";
  } else if (totalImages === 3) {
    span = index === 0 ? "col-span-1 row-span-2" : "col-span-1 row-span-1";
  } else if (totalImages === 4) {
    span = "col-span-1 row-span-1";
  }

  return ` ${span}`;
};

export const gridClasses = (totalImages: number) => {
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
  totalImages: number,
  height: number,
  width: number,
) => {
  switch (totalImages) {
    case 1:
      return { aspectRatio: getAspectRatio(height, width) };
    case 2:
      return { aspectRatio: "7 / 8" };
    case 3:
      return index === 0 ? { aspectRatio: "7 / 8" } : { aspectRatio: "7 / 4" };
    case 4:
      return { aspectRatio: "2 / 1" };
    default:
      return { aspectRatio: "1 / 1" };
  }
};

export default function TwitterImageGridPreview({
  totalImages,
}: {
  totalImages: 1 | 2 | 3 | 4;
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
              className={`relative flex items-center justify-center h-full w-full
                bg-[lab(96.752%_0_0)]
                border border-[lab(91.996%_-.0000298023_.0000119209)]
                dark:bg-[lab(8.708%_0_-.00000298023)]
]
                dark:border-[lab(17.06%_0_0)]
                ${imageGrid(index, totalImages)}
              `}
            >
              {/* Center badge */}
              <div className="flex h-6 w-12 select-none items-center justify-center rounded-full font-medium text-xs shadow-custom bg-[lab(100%_0_0)] dark:bg-[lab(3.04863%_0_0)]">
                {index + 1}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
