export interface AssetItem {
  ratio_tech_label: string;
  height: number;
  width: number;
  url: string;
  culture?: string | null;
  extension?: string;
  size?: number;
  create_date?: string;
  update_date?: string;
  is_intl?: boolean;
  number?: number;
}

export interface DeliveryItem {
  content_delivery_id?: number;
  type?: string;
  url: string;
  duration?: number;
  size?: number;
  extension?: string;
  preview?: boolean;
  drm?: boolean;
  resolution?: string;
  audio?: string[];
  subtitle?: string[];
}

export interface ClassificationItem {
  id: number;
  system_label: string;
  label: string;
  age: number;
  logo: string;
  type: string;
}

export interface ContentAssets {
  cover?: AssetItem[];
  icon?: AssetItem[];
  screenshot?: AssetItem[];
  "art-background"?: AssetItem[];
  highlight?: AssetItem[];
  "highlight-title"?: AssetItem[];
}

export interface ContentDeliveries {
  ba?: Record<string, DeliveryItem[]>;
  "stream drm"?: Record<string, DeliveryItem[]>;
  subtitle?: Record<string, DeliveryItem[]>;
}

export interface ContentItem {
  content_id: number;
  title: string;
  title_original?: string;
  description?: string;
  content_type?: string;
  content_type_tech_label?: string;
  theme_label?: string;
  product_year?: number;
  product_country?: string[];
  duration?: number;
  sales_mode?: string[];
  price?: number;
  price_promo?: number;
  classification?: ClassificationItem[];
  rubric_id?: number[];
  display_order?: number;
  provider_label?: string;
  licence_label?: string;
  assets?: ContentAssets;
  deliveries?: ContentDeliveries;
}

export interface RubricItem {
  rubric_id: number;
  rubric_title: string;
  nb_content: number;
}

export interface CategoryRow {
  rubric: RubricItem;
  contents: ContentItem[];
}
