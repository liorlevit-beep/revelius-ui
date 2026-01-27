/**
 * Products API types
 */

export type ProductCategory = {
  id?: string;
  name: string;
  description?: string;
};

export type ProductListItem = {
  id?: string;
  title?: string;
  name?: string;
  detected_category?: string;
  category?: string;
  risk_level?: string;
  risk?: string;
  confidence?: number;
  signals?: string[];
  tags?: string[];
  keywords?: string[];
  evidence?: string;
  [key: string]: any; // Allow additional properties
};

export type RoutingTable = {
  default_psp: string;
  mapping: Record<string, string[]>;
  provider_category_mapping?: Record<string, string[]>;
};

export type RouteProductsRequest = {
  products: string[];
};

export type RouteProductsResponse = unknown;
