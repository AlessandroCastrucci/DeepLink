import { useState, useEffect } from "react";
import { getRubricList, getContentList } from "../api/galaxy.ts";
import type { ContentItem, CategoryRow } from "../types/content.ts";
import HeroSlider from "../components/HeroSlider.tsx";
import ContentRow from "../components/ContentRow.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

const HIGHLIGHT_RUBRIC = "268833";
const CATEGORY_RUBRICS =
  "273536,268860,295883,287837,294356,291318,287839,287838,287840,268858,268859,268857,270101,273535,268866,273694,283300,268844,268850,268845";

export default function HomePage() {
  const [heroItems, setHeroItems] = useState<ContentItem[]>([]);
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const highlighted = await getContentList(HIGHLIGHT_RUBRIC);
        if (cancelled) return;
        setHeroItems(highlighted);

        const rubrics = await getRubricList(CATEGORY_RUBRICS);
        if (cancelled) return;

        const validRubrics = rubrics.filter((r) => r.nb_content > 0);
        const batchSize = 4;

        for (let i = 0; i < validRubrics.length; i += batchSize) {
          const batch = validRubrics.slice(i, i + batchSize);
          const results = await Promise.all(
            batch.map(async (rubric) => {
              const contents = await getContentList(String(rubric.rubric_id));
              return { rubric, contents } as CategoryRow;
            }),
          );
          if (cancelled) return;
          setRows((prev) => [...prev, ...results.filter((r) => r.contents.length > 0)]);
        }
      } catch (err) {
        console.error("Failed to load home:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && heroItems.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <HeroSlider items={heroItems} />

      {heroItems.length > 0 && (
        <ContentRow
          title="A la une"
          rubricId={Number(HIGHLIGHT_RUBRIC)}
          contents={heroItems}
        />
      )}

      {rows.map((row) => (
        <ContentRow
          key={row.rubric.rubric_id}
          title={row.rubric.rubric_title}
          rubricId={row.rubric.rubric_id}
          contents={row.contents}
        />
      ))}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-dark-500 border-t-accent-500" />
        </div>
      )}
    </div>
  );
}
