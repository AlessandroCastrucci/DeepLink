import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { ContentItem } from "../types/content.ts";
import { getHighlight, getHighlightTitle, formatDuration } from "../utils/assets.ts";
interface HeroSliderProps {
  items: ContentItem[];
}

export default function HeroSlider({ items }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const heroItems = items.filter((i) => getHighlight(i.assets)).slice(0, 6);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % heroItems.length);
  }, [heroItems.length]);

  useEffect(() => {
    if (heroItems.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [heroItems.length, next]);

  if (heroItems.length === 0) return null;
  const item = heroItems[current];
  const bgUrl = getHighlight(item.assets);
  const titleUrl = getHighlightTitle(item.assets);

  return (
    <section className="relative mb-6 overflow-hidden">
      <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
        <img
          key={item.content_id}
          src={bgUrl}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover animate-[fadeIn_0.6s_ease]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/70 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 md:max-w-2xl md:p-8">
          {titleUrl ? (
            <img
              src={titleUrl}
              alt={item.title}
              className="h-auto max-h-16 w-auto max-w-[280px] object-contain md:max-h-20 md:max-w-[400px]"
            />
          ) : (
            <h2 className="text-2xl font-bold text-white md:text-4xl">
              {item.title}
            </h2>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
            {item.product_year && <span>{item.product_year}</span>}
            {item.duration && (
              <>
                <span className="text-dark-400">|</span>
                <span>{formatDuration(item.duration)}</span>
              </>
            )}
            {item.theme_label && (
              <>
                <span className="text-dark-400">|</span>
                <span>{item.theme_label}</span>
              </>
            )}
            {item.classification?.[0]?.label && (
              <>
                <span className="text-dark-400">|</span>
                <span className="rounded border border-gray-500 px-1.5 py-0.5 text-[10px]">
                  {item.classification[0].label}
                </span>
              </>
            )}
          </div>

          {item.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-gray-300 md:line-clamp-3">
              {item.description}
            </p>
          )}

          <button
            onClick={() => {
              navigate(`/content/${item.content_id}`);
            }}
            className="mt-1 inline-flex w-fit items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
            Voir le contenu
          </button>
        </div>
      </div>

      {heroItems.length > 1 && (
        <div className="absolute right-4 bottom-4 flex gap-1.5 md:right-8 md:bottom-8">
          {heroItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-6 bg-accent-500"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
