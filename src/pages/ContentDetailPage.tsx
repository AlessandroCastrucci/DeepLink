import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContentDetail, getRubricList, getContentList } from "../api/galaxy.ts";
import type { ContentItem, CategoryRow } from "../types/content.ts";
import {
  getHighlight,
  getArtBackground,
  getTrailerUrl,
  formatDuration,
} from "../utils/assets.ts";
import {
  detectPlatform,
  buildDeepLinkPath,
  getOpenInAppUrl,
} from "../utils/deeplink.ts";
import VideoPlayer from "../components/VideoPlayer.tsx";
import ContentRow from "../components/ContentRow.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import { useAuth } from "../context/AuthContext.tsx";

const RELATED_RUBRIC = "270102";

export default function ContentDetailPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const { user, openLogin } = useAuth();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [related, setRelated] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contentId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setContent(null);
      setRelated([]);
      try {
        const detail = await getContentDetail(contentId!);
        if (cancelled) return;
        setContent(detail);

        const rubrics = await getRubricList(RELATED_RUBRIC);
        if (cancelled) return;

        const validRubrics = rubrics.filter((r) => r.nb_content > 0);
        const rows = await Promise.all(
          validRubrics.slice(0, 5).map(async (rubric) => {
            const contents = await getContentList(String(rubric.rubric_id));
            return { rubric, contents } as CategoryRow;
          }),
        );
        if (cancelled) return;
        setRelated(rows.filter((r) => r.contents.length > 0));
      } catch (err) {
        console.error("Failed to load content:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [contentId]);

  if (loading) return <LoadingSpinner />;
  if (!content) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-400">Contenu introuvable.</p>
      </div>
    );
  }

  const trailerUrl = getTrailerUrl(content.deliveries);
  const heroImage = getHighlight(content.assets) || getArtBackground(content.assets);
  const platform = detectPlatform();
  const appPath = buildDeepLinkPath(content.content_id);
  const openInAppUrl = getOpenInAppUrl(platform, appPath, window.location.href);

  return (
    <div>
      <div className="relative">
        {trailerUrl ? (
          <VideoPlayer src={trailerUrl} poster={heroImage} />
        ) : heroImage ? (
          <div className="relative aspect-video w-full">
            <img
              src={heroImage}
              alt={content.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="aspect-video w-full bg-dark-700" />
        )}
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              {content.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-400">
              {content.content_type && (
                <span className="rounded bg-accent-500/20 px-2 py-0.5 text-xs font-semibold text-accent-400">
                  {content.content_type}
                </span>
              )}
              {content.product_year && <span>{content.product_year}</span>}
              {content.duration && (
                <>
                  <span className="text-dark-400">|</span>
                  <span>{formatDuration(content.duration)}</span>
                </>
              )}
              {content.theme_label && (
                <>
                  <span className="text-dark-400">|</span>
                  <span>{content.theme_label}</span>
                </>
              )}
              {content.classification?.[0]?.label && (
                <>
                  <span className="text-dark-400">|</span>
                  <span className="rounded border border-gray-500 px-1.5 py-0.5 text-xs">
                    {content.classification[0].label}
                  </span>
                </>
              )}
            </div>
          </div>
          {user ? (
            <a
              href={openInAppUrl}
              className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
            >
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
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
              Ouvrir l'app
            </a>
          ) : (
            <button
              onClick={openLogin}
              className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
            >
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
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
              Ouvrir l'app
            </button>
          )}
        </div>

        {content.description && (
          <div className="mb-8">
            <h2 className="mb-2 text-lg font-semibold text-white">Synopsis</h2>
            <p className="leading-relaxed text-gray-300">
              {content.description}
            </p>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="pb-4">
          {related.map((row) => (
            <ContentRow
              key={row.rubric.rubric_id}
              title={row.rubric.rubric_title}
              rubricId={row.rubric.rubric_id}
              contents={row.contents}
            />
          ))}
        </div>
      )}
    </div>
  );
}
