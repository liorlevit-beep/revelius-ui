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
  mapping: Record<string, string[]>;
};

export type RouteProductsRequest = {
  products: string[];
};

export type RouteProductsResponse = unknown;
