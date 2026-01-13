import type { ApiEnvelope } from '../types/common';
import type {
  ProductCategory,
  RoutingTable,
  RouteProductsResponse,
} from '../types/products';

export const productsMocks = {
  getCategories: (): ApiEnvelope<ProductCategory[]> => ({
    data: [
      { name: 'Retail Goods' },
      { name: 'High Risk' },
    ],
  }),

  getRoutingTable: (): ApiEnvelope<RoutingTable> => ({
    data: {
      default_psp: 'rapyd',
      mapping: {
        stripe: ['cat1'],
        adyen: ['cat2'],
      },
    },
  }),

  upsertRoutingTable: (payload: RoutingTable): ApiEnvelope<RoutingTable> => ({
    data: payload,
  }),

  routeProducts: (): ApiEnvelope<RouteProductsResponse> => ({
    data: {
      routed: true,
    },
  }),
};
