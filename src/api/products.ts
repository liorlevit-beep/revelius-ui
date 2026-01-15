import { apiFetch } from './http';
import type { ApiEnvelope } from '../types/common';
import type {
  ProductCategory,
  RoutingTable,
  RouteProductsResponse,
} from '../types/products';

/**
 * Products API - Product categorization and routing
 */
export const ProductsAPI = {
  /**
   * Get all available product categories
   */
  async getCategories(): Promise<ApiEnvelope<ProductCategory[]>> {
    return apiFetch<ApiEnvelope<ProductCategory[]>>('/products/categories');
  },

  /**
   * Get all products
   */
  async getAllProducts(sessionId?: string): Promise<ApiEnvelope<unknown>> {
    return apiFetch<ApiEnvelope<unknown>>('/products/all', {
      ...(sessionId && { sessionId }),
    });
  },

  /**
   * Get the current routing table configuration
   */
  async getRoutingTable(): Promise<ApiEnvelope<RoutingTable>> {
    return apiFetch<ApiEnvelope<RoutingTable>>('/products/routing_table');
  },

  /**
   * Create or update the routing table configuration
   */
  async upsertRoutingTable(payload: RoutingTable): Promise<ApiEnvelope<RoutingTable>> {
    return apiFetch<ApiEnvelope<RoutingTable>>('/products/routing_table', {
      method: 'POST',
      body: payload,
    });
  },

  /**
   * Route products to appropriate PSPs based on session
   */
  async routeProducts(
    sessionId: string,
    products: string[]
  ): Promise<ApiEnvelope<RouteProductsResponse>> {
    return apiFetch<ApiEnvelope<RouteProductsResponse>>('/products/router', {
      method: 'POST',
      body: { products },
      sessionId,
    });
  },
};
