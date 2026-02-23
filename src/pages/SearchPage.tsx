import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { searchContent } from "../api/galaxy.ts";
import type { ContentItem } from "../types/content.ts";
import ContentCard from "../components/ContentCard.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchContent(q.trim());
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams, performSearch]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  }

  return (
    <div className="px-4 pt-20 pb-8">
      <div className="mx-auto max-w-7xl">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative mx-auto max-w-2xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un film, une s\u00e9rie..."
              className="w-full rounded-xl border border-dark-500 bg-dark-700 px-5 py-4 pr-14 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-accent-500"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-accent-500 p-2.5 text-white transition-colors hover:bg-accent-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : searched && results.length === 0 ? (
          <div className="py-20 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mx-auto mb-4 text-dark-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <p className="text-gray-400">
              Aucun r&eacute;sultat pour &laquo;{" "}
              {searchParams.get("q")} &raquo;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
            {results.map((item) => (
              <ContentCard
                key={item.content_id}
                content={item}
                showType
                fluid
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
