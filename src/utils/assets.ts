import type { ContentAssets, ContentDeliveries, AssetItem } from "../types/content.ts";

const COVER_PRIORITY = ["portrait-3-4", "portrait-2-3", "portrait-9-16"];

export function getCoverImage(assets?: ContentAssets): string {
  if (!assets?.cover) return "";
  for (const ratio of COVER_PRIORITY) {
    const match = assets.cover.find(
      (item: AssetItem) => item.ratio_tech_label === ratio,
    );
    if (match?.url) return match.url;
  }
  return assets.cover[0]?.url ?? "";
}

export function getHighlight(assets?: ContentAssets): string {
  const hl = assets?.highlight;
  if (!hl?.length) return "";
  const landscape = hl.find(
    (item: AssetItem) => item.ratio_tech_label === "landscape-16-9",
  );
  return landscape?.url ?? hl[0]?.url ?? "";
}

export function getHighlightTitle(assets?: ContentAssets): string {
  const ht = assets?.["highlight-title"];
  if (!ht?.length) return "";
  return ht[0]?.url ?? "";
}

export function getArtBackground(assets?: ContentAssets): string {
  const bg = assets?.["art-background"];
  if (!bg?.length) return "";
  const landscape = bg.find(
    (item: AssetItem) => item.ratio_tech_label === "landscape-16-9",
  );
  return landscape?.url ?? bg[0]?.url ?? "";
}

export function getScreenshot(assets?: ContentAssets): string {
  if (!assets?.screenshot?.length) return "";
  return assets.screenshot[0]?.url ?? "";
}

export function getIconImage(assets?: ContentAssets): string {
  if (!assets?.icon?.length) return "";
  return assets.icon[0]?.url ?? "";
}

export function getTrailerUrl(deliveries?: ContentDeliveries): string {
  if (!deliveries?.ba) return "";
  const keys = Object.keys(deliveries.ba);
  for (const key of keys) {
    const items = deliveries.ba[key];
    if (items?.length && items[0]?.url) {
      return items[0].url;
    }
  }
  return "";
}

export function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}min`;
  return `${m}min`;
}
