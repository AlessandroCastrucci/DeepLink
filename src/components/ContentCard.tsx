import { Link } from "react-router-dom";
import type { ContentItem } from "../types/content.ts";
import { getCoverImage } from "../utils/assets.ts";

interface ContentCardProps {
  content: ContentItem;
  showType?: boolean;
  fluid?: boolean;
}

export default function ContentCard({
  content,
  showType = false,
  fluid = false,
}: ContentCardProps) {
  const coverUrl = getCoverImage(content.assets);

  return (
    <Link
      to={`/content/${content.content_id}`}
      className={`group relative flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 ${
        fluid ? "w-full" : ""
      }`}
      style={fluid ? undefined : { width: "140px" }}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-dark-700">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={content.title}
            loading="lazy"
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-dark-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-dark-400"
            >
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <path d="m7 2 10 20" />
              <path d="M2 12h20" />
            </svg>
          </div>
        )}
        {showType && content.content_type && (
          <div className="absolute top-2 left-2 rounded bg-accent-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            {content.content_type}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8">
          <p className="line-clamp-2 text-xs font-medium leading-tight text-white">
            {content.title}
          </p>
        </div>
      </div>
    </Link>
  );
}
