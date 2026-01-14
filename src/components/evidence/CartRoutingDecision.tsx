import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useRoutingTable } from '../../hooks/useRoutingTable';
import { computeCartEligibility } from '../../utils/routingEligibility';
import { EligibleProvidersSelector } from '../EligibleProvidersSelector';
import { ProviderRouteModal } from '../routing/ProviderRouteModal';
import type { SKU } from '../../demo/transactions';

interface CartRoutingDecisionProps {
  cart: SKU[];
}

/**
 * Simple hash function for deterministic category assignment
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Assign a deterministic category_id to a SKU based on routing table categories
 */
function assignCategoryId(sku: SKU, availableCategories: string[]): string {
  // If SKU already has evidence items with category matches, use that
  if (sku.evidence_items && sku.evidence_items.length > 0) {
    for (const item of sku.evidence_items) {
      if ((item as any).category_matches && (item as any).category_matches.length > 0) {
        const firstMatch = (item as any).category_matches[0];
        if (availableCategories.includes(firstMatch)) {
          return firstMatch;
        }
      }
    }
  }

  // Otherwise, deterministically assign based on product URL hash
  const hash = simpleHash(sku.product_url);
  const index = hash % availableCategories.length;
  return availableCategories[index];
}

export function CartRoutingDecision({ cart }: CartRoutingDecisionProps) {
  const { data: routingTable, loading, error } = useRoutingTable();
  const [manuallySelectedProvider, setManuallySelectedProvider] = useState<string | null>(null);
  const [modalProvider, setModalProvider] = useState<string | null>(null);

  // Compute routing decision
  const routingDecision = useMemo(() => {
    if (!routingTable || !cart || cart.length === 0) {
      return null;
    }

    // Get all unique category IDs from routing table
    const allCategories = new Set<string>();
    Object.values(routingTable.provider_category_mapping || {}).forEach((categories: any) => {
      if (Array.isArray(categories)) {
        categories.forEach((cat: string) => allCategories.add(cat));
      }
    });
    const availableCategories = Array.from(allCategories);

    // Assign category_id to each SKU if not present
    const enrichedCart = cart.map(sku => ({
      ...sku,
      category_id: assignCategoryId(sku, availableCategories),
    }));

    // Compute eligible providers per SKU
    const skuProviders = enrichedCart.map(sku => {
      const eligible: string[] = [];
      
      Object.entries(routingTable.provider_category_mapping || {}).forEach(([provider, categories]: [string, any]) => {
        if (Array.isArray(categories) && categories.includes(sku.category_id)) {
          eligible.push(provider);
        }
      });

      return {
        sku,
        eligible_providers: eligible,
      };
    });

    // Compute provider coverage
    const providerCoverage = new Map<string, number>();
    const allProviders = Object.keys(routingTable.provider_category_mapping || {});
    
    allProviders.forEach(provider => {
      const covered = skuProviders.filter(sp => sp.eligible_providers.includes(provider)).length;
      providerCoverage.set(provider, covered);
    });

    // Select best provider
    let selectedProvider = '';
    let maxCoverage = 0;
    
    providerCoverage.forEach((coverage, provider) => {
      if (coverage > maxCoverage) {
        maxCoverage = coverage;
        selectedProvider = provider;
      } else if (coverage === maxCoverage && provider === routingTable.default_psp) {
        // Tie-breaker: prefer default_psp
        selectedProvider = provider;
      }
    });

    // If no provider found, use default
    if (!selectedProvider && routingTable.default_psp) {
      selectedProvider = routingTable.default_psp;
      maxCoverage = providerCoverage.get(selectedProvider) || 0;
    }

    // Generate explanation
    const totalSKUs = cart.length;
    const coveragePercentage = Math.round((maxCoverage / totalSKUs) * 100);
    const missingCount = totalSKUs - maxCoverage;
    
    let explanation = '';
    if (maxCoverage === totalSKUs) {
      explanation = `${selectedProvider} supports all ${totalSKUs} SKU categories in this transaction.`;
    } else if (selectedProvider === routingTable.default_psp) {
      explanation = `${selectedProvider} (default PSP) selected with ${coveragePercentage}% coverage (${maxCoverage}/${totalSKUs} SKUs).`;
    } else {
      explanation = `${selectedProvider} selected with best coverage: ${maxCoverage}/${totalSKUs} SKUs (${coveragePercentage}%).`;
    }

    // Get missing categories
    const missingCategories = skuProviders
      .filter(sp => !sp.eligible_providers.includes(selectedProvider))
      .map(sp => sp.sku.category_id);

    return {
      selected_provider: selectedProvider,
      coverage: maxCoverage,
      total_skus: totalSKUs,
      coverage_percentage: coveragePercentage,
      explanation,
      sku_providers: skuProviders,
      missing_categories: [...new Set(missingCategories)],
      is_full_coverage: maxCoverage === totalSKUs,
    };
  }, [routingTable, cart]);

  // Compute eligibility result for provider selector
  const eligibilityResult = useMemo(() => {
    if (!routingTable || !cart || cart.length === 0) {
      return null;
    }
    return computeCartEligibility(cart, routingTable);
  }, [routingTable, cart]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !routingTable) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 mb-1">Routing Table Unavailable</h4>
            <p className="text-sm text-red-700">{error || 'Failed to load routing table'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <p className="text-sm text-gray-600">No cart items to route</p>
      </div>
    );
  }

  if (!routingDecision) {
    return null;
  }

  // Use manually selected provider if available, otherwise use computed selection
  const displayedProvider = manuallySelectedProvider || routingDecision.selected_provider;
  const displayedCoverage = eligibilityResult?.eligibleProviders.find(
    p => p.provider === displayedProvider
  );

  // Get coverage data for modal
  const modalCoverage = eligibilityResult?.eligibleProviders.find(p => p.provider === modalProvider);

  return (
    <div className="space-y-6">
      {/* Provider Selection UI */}
      {eligibilityResult && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <EligibleProvidersSelector
            eligibleProviders={eligibilityResult.eligibleProviders}
            selectedProvider={displayedProvider}
            totalItems={eligibilityResult.totalItems}
            onProviderSelect={(provider) => {
              setModalProvider(provider);
            }}
            readOnly={false}
          />
        </div>
      )}

      {/* Selected PSP Card */}
      <div className={`border-2 rounded-xl p-6 ${
        displayedCoverage?.isFullCoverage
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
            displayedCoverage?.isFullCoverage
              ? 'bg-emerald-100' 
              : 'bg-amber-100'
          }`}>
            {displayedCoverage?.isFullCoverage ? (
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            ) : (
              <TrendingUp className="w-6 h-6 text-amber-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-bold text-gray-900">
                Selected PSP: {displayedProvider}
              </h4>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                displayedCoverage?.isFullCoverage
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                Covers {displayedCoverage?.coverageCount || 0}/{routingDecision.total_skus} items
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {manuallySelectedProvider
                ? `Manually selected ${displayedProvider} with ${displayedCoverage?.coveragePercentage || 0}% coverage.`
                : routingDecision.explanation}
            </p>
            
            {/* Coverage Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Coverage</span>
                <span>{displayedCoverage?.coveragePercentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    displayedCoverage?.isFullCoverage
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${displayedCoverage?.coveragePercentage || 0}%` }}
                />
              </div>
            </div>

            {/* Missing Categories Warning */}
            {displayedCoverage && displayedCoverage.missedCategories.length > 0 && (
              <div className="bg-white border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">
                      Missing Category Coverage
                    </p>
                    <p className="text-xs text-amber-800">
                      The following categories are not supported by {displayedProvider}:
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {displayedCoverage.missedCategories.map((cat, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SKU-level routing table */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">SKU Routing Analysis</h4>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  SKU
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Category
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Eligible Providers
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Routed To
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {routingDecision.sku_providers.map((sp, index) => {
                const isSupported = sp.eligible_providers.includes(displayedProvider);
                
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-900 truncate max-w-xs" title={sp.sku.title}>
                          {sp.sku.title}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{sp.sku.sku_id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                        {sp.sku.category_id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {sp.eligible_providers.length === 0 ? (
                        <span className="text-xs text-gray-500 italic">No providers</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {sp.eligible_providers.map((provider, i) => (
                            <span
                              key={i}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                provider === displayedProvider
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {provider}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isSupported ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-700">
                            {displayedProvider}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-700">Not supported</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Route Modal */}
      {modalProvider && (
        <ProviderRouteModal
          open={!!modalProvider}
          onOpenChange={(open) => !open && setModalProvider(null)}
          provider={modalProvider}
          coverage={modalCoverage}
          items={cart}
          onSelect={() => setManuallySelectedProvider(modalProvider)}
          isSelected={displayedProvider === modalProvider}
        />
      )}
    </div>
  );
}
