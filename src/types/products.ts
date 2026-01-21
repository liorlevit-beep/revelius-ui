/**
 * Products API types
 */

export type ProductCategory = {
  id?: string;
  name: string;
  description?: string;
};

export type RoutingTable = {
  default_psp: string;
  mapping?: Record<string, string[]>;
  provider_category_mapping?: Record<string, string[]>;
};

export type RouteProductsRequest = {
  products: string[];
};

export type RouteProductsResponse = unknown;

export type ProductListItem = {
  id: string;
  title?: string;
  name?: string;
  detected_category?: string;
  category?: string;
  risk_level?: string;
  risk?: string;
  confidence?: number; // 0-1 or 0-100
  signals?: string[];
  tags?: string[];
  keywords?: string[];
  evidence?: string;
  source_url?: string;
  page?: string;
  price?: number;
  description?: string;
  mcc_code?: string;
  category_labels?: string[];
};
