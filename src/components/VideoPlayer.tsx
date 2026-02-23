import { useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  poster: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  function togglePlay() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => setError(true));
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  }

  if (error) {
    return (
      <div
        className="relative aspect-video w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="text-sm text-gray-300">Bande-annonce indisponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-contain"
        playsInline
        onEnded={() => setPlaying(false)}
        onError={() => setError(true)}
        controls={playing}
      />
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/20"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/90 transition-transform hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="white"
            >
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
