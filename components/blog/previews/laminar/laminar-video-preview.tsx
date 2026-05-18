"use client";

import {
  VideoPreview,
  type VideoPreviewProps,
} from "@/components/blog/previews/shared/video-preview";

const LAMINAR_VIDEO_PATH = "/laminar";

export const LAMINAR_VIDEO_DEMOS = [
  "montage-demo",
  "lcs",
  "number-lane",
  "probe-token",
  "auto-size",
] as const;

export type LaminarVideoDemo = (typeof LAMINAR_VIDEO_DEMOS)[number];

type LaminarVideoPreviewProps = Omit<VideoPreviewProps, "src" | "poster"> & {
  demo: LaminarVideoDemo;
};

export function getLaminarVideoAssets(demo: LaminarVideoDemo) {
  return {
    src: `${LAMINAR_VIDEO_PATH}/${demo}.mp4`,
    poster: `${LAMINAR_VIDEO_PATH}/${demo}.jpg`,
  };
}

export function LaminarVideoPreview({
  demo,
  ...props
}: LaminarVideoPreviewProps) {
  return <VideoPreview {...getLaminarVideoAssets(demo)} {...props} />;
}
