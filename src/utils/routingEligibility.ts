/**
 * Utility functions for computing provider eligibility based on routing table
 */

import type { RoutingTable } from '../types/products';
import type { SKU, LineItem } from '../demo/transactions';

export interface ProviderCoverage {
  provider: string;
  coverageCount: number;
  coveragePercentage: number;
  isFullCoverage: boolean;
  isDefault: boolean;
  coveredCategories: string[];
  missedCategories: string[];
}

export interface EligibilityResult {
  eligibleProviders: ProviderCoverage[];
  defaultProvider: ProviderCoverage | null;
  bestCoverageProviders: ProviderCoverage[];
  totalItems: number;
}

/**
 * Compute eligible providers for a cart of SKUs
 */
export function computeCartEligibility(
  cart: SKU[],
  routingTable: RoutingTable
): EligibilityResult {
  if (!cart || cart.length === 0 || !routingTable) {
    return {
      eligibleProviders: [],
      defaultProvider: null,
      bestCoverageProviders: [],
      totalItems: 0,
    };
  }

  const { default_psp, provider_category_mapping } = routingTable;
  const mapping = provider_category_mapping || {};
  
  // Get unique categories from cart
  const categories = Array.from(new Set(cart.map(sku => sku.category_id).filter(Boolean)));
  const totalItems = cart.length;
  
  // Compute coverage for each provider
  const providerCoverages: ProviderCoverage[] = [];
  const allProviders = Object.keys(mapping);
  
  allProviders.forEach(provider => {
    const supportedCategories = mapping[provider] || [];
    const coveredCategories = categories.filter((cat): cat is string => cat !== undefined && supportedCategories.includes(cat));
    const missedCategories = categories.filter((cat): cat is string => cat !== undefined && !supportedCategories.includes(cat));
    const coverageCount = cart.filter(sku => sku.category_id && supportedCategories.includes(sku.category_id)).length;
    const coveragePercentage = totalItems > 0 ? Math.round((coverageCount / totalItems) * 100) : 0;
    
    providerCoverages.push({
      provider,
      coverageCount,
      coveragePercentage,
      isFullCoverage: coverageCount === totalItems,
      isDefault: provider === default_psp,
      coveredCategories,
      missedCategories,
    });
  });
  
  // Sort by coverage (desc), then by default status
  providerCoverages.sort((a, b) => {
    if (a.coverageCount !== b.coverageCount) {
      return b.coverageCount - a.coverageCount;
    }
    if (a.isDefault !== b.isDefault) {
      return a.isDefault ? -1 : 1;
    }
    return 0;
  });
  
  // Find best coverage providers
  const maxCoverage = providerCoverages[0]?.coverageCount || 0;
  const bestCoverageProviders = providerCoverages.filter(p => p.coverageCount === maxCoverage);
  
  // Get default provider info
  const defaultProvider = providerCoverages.find(p => p.isDefault) || null;
  
  // Only include providers with at least some coverage
  const eligibleProviders = providerCoverages.filter(p => p.coverageCount > 0);
  
  return {
    eligibleProviders: eligibleProviders.length > 0 ? eligibleProviders : [defaultProvider!].filter(Boolean),
    defaultProvider,
    bestCoverageProviders,
    totalItems,
  };
}

/**
 * Compute eligible providers for line items
 */
export function computeLineItemsEligibility(
  lineItems: LineItem[],
  routingTable: RoutingTable
): EligibilityResult {
  if (!lineItems || lineItems.length === 0 || !routingTable) {
    return {
      eligibleProviders: [],
      defaultProvider: null,
      bestCoverageProviders: [],
      totalItems: 0,
    };
  }

  const { default_psp, mapping } = routingTable;
  
  // Get unique categories from line items
  const categories = Array.from(new Set(lineItems.map(item => item.categoryId)));
  const totalItems = lineItems.length;
  
  // Guard against undefined mapping
  if (!mapping) {
    return {
      eligibleProviders: [],
      defaultProvider: null,
      bestCoverageProviders: [],
      totalItems: 0,
    };
  }
  
  // Compute coverage for each provider
  const providerCoverages: ProviderCoverage[] = [];
  const allProviders = Object.keys(mapping);
  
  allProviders.forEach(provider => {
    const supportedCategories = mapping[provider] || [];
    const coveredCategories = categories.filter(cat => supportedCategories.includes(cat));
    const missedCategories = categories.filter(cat => !supportedCategories.includes(cat));
    const coverageCount = lineItems.filter(item => supportedCategories.includes(item.categoryId)).length;
    const coveragePercentage = totalItems > 0 ? Math.round((coverageCount / totalItems) * 100) : 0;
    
    providerCoverages.push({
      provider,
      coverageCount,
      coveragePercentage,
      isFullCoverage: coverageCount === totalItems,
      isDefault: provider === default_psp,
      coveredCategories,
      missedCategories,
    });
  });
  
  // Sort by coverage (desc), then by default status
  providerCoverages.sort((a, b) => {
    if (a.coverageCount !== b.coverageCount) {
      return b.coverageCount - a.coverageCount;
    }
    if (a.isDefault !== b.isDefault) {
      return a.isDefault ? -1 : 1;
    }
    return 0;
  });
  
  // Find best coverage providers
  const maxCoverage = providerCoverages[0]?.coverageCount || 0;
  const bestCoverageProviders = providerCoverages.filter(p => p.coverageCount === maxCoverage);
  
  // Get default provider info
  const defaultProvider = providerCoverages.find(p => p.isDefault) || null;
  
  // Only include providers with at least some coverage
  const eligibleProviders = providerCoverages.filter(p => p.coverageCount > 0);
  
  return {
    eligibleProviders: eligibleProviders.length > 0 ? eligibleProviders : [defaultProvider!].filter(Boolean),
    defaultProvider,
    bestCoverageProviders,
    totalItems,
  };
}

/**
 * Get eligible providers for a single SKU based on its category
 */
export function getProvidersForCategory(
  categoryId: string,
  routingTable: RoutingTable
): string[] {
  if (!categoryId || !routingTable) {
    return [];
  }

  const mapping = routingTable.provider_category_mapping || routingTable.mapping || {};
  const eligibleProviders: string[] = [];
  
  Object.entries(mapping).forEach(([provider, categories]) => {
    if (Array.isArray(categories) && categories.includes(categoryId)) {
      eligibleProviders.push(provider);
    }
  });
  
  return eligibleProviders;
}
