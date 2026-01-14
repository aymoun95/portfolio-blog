"use client";

import { useRef, useState } from "react";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
};

export default function VideoPlayer({
  src,
  poster,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`
        my-8 w-full overflow-hidden rounded-2xl
        border border-white/10 bg-black
        ${className}
      `}
    >
      {hasError && (
        <div className="flex items-center justify-center p-6 text-sm text-red-400">
          Failed to load video
        </div>
      )}

      <video
        ref={videoRef}
        className={`w-full h-auto mb-0 mt-0 ${hasError ? "hidden" : "block"}`}
        controls
        playsInline
        preload="metadata"
        muted
        poster={poster}
        onError={() => {
          const el = videoRef.current;
          if (!el || el.networkState === el.NETWORK_NO_SOURCE) {
            setHasError(true);
          }
        }}
      >
        <source src={src.replace(".mov", ".mp4")} type="video/mp4" />
        <source src={src} type="video/quicktime" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
