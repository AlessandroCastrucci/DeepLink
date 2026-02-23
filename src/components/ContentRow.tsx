import { useRef } from "react";
import { Link } from "react-router-dom";
import type { ContentItem } from "../types/content.ts";
import ContentCard from "./ContentCard.tsx";

interface ContentRowProps {
  title: string;
  rubricId?: number;
  contents: ContentItem[];
}

export default function ContentRow({
  title,
  rubricId,
  contents,
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (contents.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between px-4">
        {rubricId ? (
          <Link
            to={`/category/${rubricId}`}
            className="group flex items-center gap-1.5"
          >
            <h2 className="text-base font-semibold text-white md:text-lg">
              {title}
            </h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent-500 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        ) : (
          <h2 className="text-base font-semibold text-white md:text-lg">
            {title}
          </h2>
        )}

        <div className="hidden gap-1 md:flex">
          <button
            onClick={() => scroll("left")}
            className="rounded-full bg-dark-600 p-1.5 text-gray-300 transition-colors hover:bg-dark-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-full bg-dark-600 p-1.5 text-gray-300 transition-colors hover:bg-dark-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="hide-scrollbar flex gap-3 overflow-x-auto px-4"
      >
        {contents.map((item) => (
          <ContentCard key={item.content_id} content={item} />
        ))}
      </div>
    </section>
  );
}
