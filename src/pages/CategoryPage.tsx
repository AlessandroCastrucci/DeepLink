import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContentList, getRubricList } from "../api/galaxy.ts";
import type { ContentItem } from "../types/content.ts";
import ContentCard from "../components/ContentCard.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

export default function CategoryPage() {
  const { rubricId } = useParams<{ rubricId: string }>();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rubricId) return;

    let cancelled = false;

    async function loadCategory() {
      setLoading(true);
      setContents([]);
      setTitle("");
      try {
        const [contentData, rubricData] = await Promise.all([
          getContentList(rubricId!),
          getRubricList(rubricId!),
        ]);
        if (cancelled) return;
        setContents(contentData);
        if (rubricData.length > 0) {
          setTitle(rubricData[0].rubric_title);
        }
      } catch (err) {
        console.error("Failed to load category:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategory();
    return () => {
      cancelled = true;
    };
  }, [rubricId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="px-4 pt-20 pb-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-white md:text-3xl">
          {title || "Cat\u00e9gorie"}
        </h1>
        {contents.length === 0 ? (
          <p className="py-20 text-center text-gray-400">
            Aucun contenu disponible dans cette cat\u00e9gorie.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
            {contents.map((item) => (
              <ContentCard key={item.content_id} content={item} fluid />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
