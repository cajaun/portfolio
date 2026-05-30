import type { ImageCardCount } from "@/components/blog/previews/shared/image-card-skeleton";

const feedSeed = [
  {
    author: "Maya Chen",
    handle: "@mayadesigns",
    body: "Testing a softer loading state so new posts feel like part of the feed.",
  },
  {
    author: "Noah Price",
    handle: "@noahmotion",
    body: "Intersection observer handles the load boundary without scroll math.",
  },
  {
    author: "Elena Park",
    handle: "@elenaui",
    body: "The same pattern works for feeds, comments, and notifications.",
  },
  {
    author: "Ravi Singh",
    handle: "@ravibuilds",
    body: "When the boundary enters the root, fetch the next batch.",
  },
  {
    author: "Talia Brooks",
    handle: "@taliatype",
    body: "This API removes a lot of homemade visibility code.",
  },
  {
    author: "Jordan Lee",
    handle: "@jordanfeed",
    body: "Observers also help with impressions, autoplay rules, and read progress.",
  },
];

export type MediaPost = {
  id: string;
  author: string;
  handle: string;
  body: string;
  gridSize: ImageCardCount;
  filler?: boolean;
};

export const mediaPosts: MediaPost[] = [
  {
    id: "studio-tour",
    author: "Design Camera",
    handle: "@design",
    body: "The active post switches once most of the card is inside the feed window.",
    gridSize: 2,
  },
  {
    id: "filler-1",
    author: "System",
    handle: "@system",
    body: "Scroll down to reach the next active post in the feed.",
    gridSize: 3,
    filler: true,
  },
  {
    id: "filler-2",
    author: "System",
    handle: "@system",
    body: "Keep scrolling, the next main post is coming up soon.",
    gridSize: 4,
    filler: true,
  },
  {
    id: "prototype-loop",
    author: "Motion Notes",
    handle: "@motion",
    body: "This is the same pattern behind autoplay and pause rules in media feeds.",
    gridSize: 3,
  },
  {
    id: "filler-3",
    author: "System",
    handle: "@system",
    body: "Another scroll boundary before the final active post appears.",
    gridSize: 2,
    filler: true,
  },
  {
    id: "filler-4",
    author: "System",
    handle: "@system",
    body: "Almost there, the last main post is just below.",
    gridSize: 3,
    filler: true,
  },
  {
    id: "ui-breakdown",
    author: "Product Clips",
    handle: "@product",
    body: "Only one post needs to feel primary at a time, so the observer picks a winner.",
    gridSize: 4,
  },
];

export const videoPosts: MediaPost[] = [
  {
    id: "video-studio-tour",
    author: "Design Camera",
    handle: "@design",
    body: "Only the video with the strongest intersection should play.",
    gridSize: 1,
  },
  {
    id: "video-layout-cuts",
    author: "Layout Cuts",
    handle: "@layout",
    body: "As this card becomes primary, the previous video pauses.",
    gridSize: 1,
  },
  {
    id: "video-motion-notes",
    author: "Motion Notes",
    handle: "@motion",
    body: "A threshold keeps quick edge touches from starting playback.",
    gridSize: 1,
  },
  {
    id: "video-product-clips",
    author: "Product Clips",
    handle: "@product",
    body: "The same observer can pause video when it leaves the feed window.",
    gridSize: 1,
  },
  {
    id: "video-studio-roll",
    author: "Studio Roll",
    handle: "@studio",
    body: "Autoplay is just a visibility rule attached to the media card.",
    gridSize: 1,
  },
  {
    id: "video-final-cut",
    author: "Final Cut",
    handle: "@final",
    body: "When nothing is visible enough, every video stays paused.",
    gridSize: 1,
  },
];

export const videoDurationSeconds = 93;
export const videoPreviewDurationMs = 45000;
export const initialVideoProgress: Record<string, number> = {
  "video-studio-tour": 0,
  "video-layout-cuts": 0.26,
  "video-motion-notes": 0.08,
  "video-product-clips": 0.48,
  "video-studio-roll": 0.18,
  "video-final-cut": 0,
};

export function buildInitialVideoProgress() {
  return videoPosts.reduce<Record<string, number>>((progress, post) => {
    progress[post.id] = initialVideoProgress[post.id] ?? 0;
    return progress;
  }, {});
}

export function formatVideoTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function buildFeedBatch(start: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const seed = feedSeed[(start + index) % feedSeed.length];
    return {
      id: `${start + index}`,
      ...seed,
    };
  });
}
