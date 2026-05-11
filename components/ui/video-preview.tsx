"use client";

import { useState, useRef, useCallback, ReactNode } from "react";
import Image from "next/image";
import PreviewCard from "@/components/ui/previews";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  src: string;
  header?: ReactNode;
  headerClassName?: string;
  footer?: ReactNode;
  footnote?: ReactNode;
  full?: boolean;
}

export function VideoPreview({
  src,
  header,
  headerClassName,
  footer,
  footnote,
  full = true,
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  return (
    <PreviewCard
      header={header}
      headerClassName={headerClassName}
      footer={footer}
      footnote={footnote}
      full={full}
    >
      <div className="relative">
        <div className="flex items-center justify-center pt-10">
        <div className="relative inline-block">
          {/* Phone Frame */}
          <Image
            src="/phone-frame.png"
            alt="Phone"
            width={227}
            height={450}
            className="pointer-events-none relative z-10 select-none"
            priority
          />

  
          <div
            className="absolute inset-[1.25%_3.3%] z-[1] overflow-hidden rounded-[7.5%]"
          >
            <div className="group relative h-full w-full overflow-hidden bg-black">
              <video
                ref={videoRef}
                src={src}
                loop
                playsInline
                autoPlay
                muted
                preload="auto"
                className="h-full w-full"
              />

                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  className="absolute inset-0 z-20 flex h-full w-full items-center justify-center"
                >
                  <div
                    className={cn(
                      "flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/90 transition-opacity duration-200",
                      "absolute left-1/2 top-1/2",
                      "focus-visible:opacity-100",
                      isPlaying
                        ? "opacity-0 group-hover:opacity-100"
                        : "opacity-100"
                    )}
                  >
                    {isPlaying ? (
                      // Pause Icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5.75 3C4.7835 3 4 3.7835 4 4.75V19.25C4 20.2165 4.7835 21 5.75 21H8.25C9.2165 21 10 20.2165 10 19.25V4.75C10 3.7835 9.2165 3 8.25 3H5.75Z"
                          fill="currentColor"
                        />
                        <path
                          d="M15.75 3C14.7835 3 14 3.7835 14 4.75V19.25C14 20.2165 14.7835 21 15.75 21H18.25C19.2165 21 20 20.2165 20 19.25V4.75C20 3.7835 19.2165 3 18.25 3H15.75Z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      // Play Icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7.65703 2.27884C6.49076 1.57201 5 2.41169 5 3.77543V20.2247C5 21.5884 6.49076 22.4281 7.65703 21.7213L21.2276 13.4966C22.3516 12.8155 22.3516 11.1846 21.2276 10.5035L7.65703 2.27884Z"
                          fill="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PreviewCard>
  );
}
