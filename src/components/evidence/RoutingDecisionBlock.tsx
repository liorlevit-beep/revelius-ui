import { useMemo, useState } from 'react';
import { Loader2, CheckCircle, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { useRoutingTable } from '../../hooks/useRoutingTable';
import { computeLineItemsEligibility } from '../../utils/routingEligibility';
import { EligibleProvidersSelector } from '../EligibleProvidersSelector';
import { ProviderRouteModal } from '../routing/ProviderRouteModal';
import { getProviderDisplayName } from '../../data/providerRegions';
import type { LineItem } from '../../demo/transactions';

interface RoutingDecisionBlockProps {
  lineItems?: LineItem[];
}

interface SKUAnalysis {
  sku: string;
  name: string;
  categoryId: string;
  supportedProviders: string[];
  routedProvider: string | null;
}

interface RoutingDecision {
  selectedPsp: string;
  totalCategories: number;
  supportedCategories: number;
  missingCategories: string[];
  explanation: string;
  skuAnalysis: SKUAnalysis[];
}

export function RoutingDecisionBlock({ lineItems }: RoutingDecisionBlockProps) {
  const { data: routingTable, loading, error } = useRoutingTable();
  const [manuallySelectedProvider, setManuallySelectedProvider] = useState<string | null>(null);
  const [modalProvider, setModalProvider] = useState<string | null>(null);

  // Compute routing decision
  const decision: RoutingDecision | null = useMemo(() => {
    if (!routingTable || !lineItems || lineItems.length === 0) {
      return null;
    }

    const { mapping, default_psp } = routingTable;

    // Get unique category IDs from line items
    const categoryIds = Array.from(new Set(lineItems.map(item => item.categoryId)));

    // For each category, find which providers support it
    const categoryProviderMap = new Map<string, string[]>();
    categoryIds.forEach(categoryId => {
      const providers: string[] = [];
      Object.entries(mapping).forEach(([providerKey, supportedCategories]) => {
        if (supportedCategories.includes(categoryId)) {
          providers.push(providerKey);
        }
      });
      categoryProviderMap.set(categoryId, providers);
    });

    // Find provider(s) that support ALL categories
    const allProviders = Object.keys(mapping);
    const fullCoverageProviders = allProviders.filter(providerKey => {
      return categoryIds.every(categoryId => 
        mapping[providerKey]?.includes(categoryId)
      );
    });

    // Determine selected PSP
    let selectedPsp: string;
    let supportedCategories: number;
    let missingCategories: string[] = [];
    let explanation: string;

    if (fullCoverageProviders.length > 0) {
      // Pick the first full coverage provider (or default if it has full coverage)
      selectedPsp = fullCoverageProviders.includes(default_psp)
        ? default_psp
        : fullCoverageProviders[0];
      supportedCategories = categoryIds.length;
      explanation = `Selected ${getProviderDisplayName(selectedPsp)} because it supports all ${categoryIds.length} SKU ${categoryIds.length === 1 ? 'category' : 'categories'} (${categoryIds.join(', ')}).`;
    } else {
      // No provider supports all categories - find provider with max coverage
      const providerCoverage = allProviders.map(providerKey => {
        const supported = categoryIds.filter(categoryId =>
          mapping[providerKey]?.includes(categoryId)
        );
        return {
          providerKey,
          supportedCount: supported.length,
          supported,
        };
      });

      // Sort by coverage descending
      providerCoverage.sort((a, b) => b.supportedCount - a.supportedCount);

      // If default_psp has any coverage, use it; otherwise use max coverage provider
      const defaultCoverage = providerCoverage.find(p => p.providerKey === default_psp);
      const maxCoverage = providerCoverage[0];

      if (defaultCoverage && defaultCoverage.supportedCount > 0) {
        selectedPsp = default_psp;
        supportedCategories = defaultCoverage.supportedCount;
        missingCategories = categoryIds.filter(cat => !defaultCoverage.supported.includes(cat));
        explanation = `Selected ${getProviderDisplayName(selectedPsp)} (default PSP) with partial coverage: ${supportedCategories}/${categoryIds.length} categories supported. Missing: ${missingCategories.join(', ')}.`;
      } else if (maxCoverage && maxCoverage.supportedCount > 0) {
        selectedPsp = maxCoverage.providerKey;
        supportedCategories = maxCoverage.supportedCount;
        missingCategories = categoryIds.filter(cat => !maxCoverage.supported.includes(cat));
        explanation = `Selected ${getProviderDisplayName(selectedPsp)} (max coverage) with partial coverage: ${supportedCategories}/${categoryIds.length} categories supported. Missing: ${missingCategories.join(', ')}.`;
      } else {
        // No provider supports any category - fall back to default
        selectedPsp = default_psp;
        supportedCategories = 0;
        missingCategories = categoryIds;
        explanation = `Selected ${getProviderDisplayName(selectedPsp)} (default PSP) but no providers found supporting these categories: ${categoryIds.join(', ')}.`;
      }
    }

    // Build SKU analysis
    const skuAnalysis: SKUAnalysis[] = lineItems.map(item => {
      const supportedProviders = categoryProviderMap.get(item.categoryId) || [];
      return {
        sku: item.sku,
        name: item.name,
        categoryId: item.categoryId,
        supportedProviders,
        routedProvider: supportedProviders.includes(selectedPsp) ? selectedPsp : null,
      };
    });

    return {
      selectedPsp,
      totalCategories: categoryIds.length,
      supportedCategories,
      missingCategories,
      explanation,
      skuAnalysis,
    };
  }, [routingTable, lineItems]);

  // Compute eligibility result for provider selector
  const eligibilityResult = useMemo(() => {
    if (!routingTable || !lineItems || lineItems.length === 0) {
      return null;
    }
    return computeLineItemsEligibility(lineItems, routingTable);
  }, [routingTable, lineItems]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin mr-3" />
          <p className="text-sm text-gray-600">Loading routing table...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-sm text-red-800">
          <strong>Error:</strong> {error}
        </p>
      </div>
    );
  }

  // No line items
  if (!lineItems || lineItems.length === 0) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
        <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-600">No line items in this transaction</p>
      </div>
    );
  }

  // No decision (shouldn't happen if lineItems exist and routing table loaded)
  if (!decision) {
    return null;
  }

  // Use manually selected provider if available, otherwise use computed selection
  const displayedProvider = manuallySelectedProvider || decision.selectedPsp;
  const displayedCoverage = eligibilityResult?.eligibleProviders.find(
    p => p.provider === displayedProvider
  );

  const coveragePercent = displayedCoverage?.coveragePercentage || 0;
  const hasFullCoverage = displayedCoverage?.isFullCoverage || false;

  // Get coverage data for modal
  const modalCoverage = eligibilityResult?.eligibleProviders.find(p => p.provider === modalProvider);

  return (
    <div className="space-y-4">
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
      <div className={`p-6 rounded-xl border-2 ${
        hasFullCoverage
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              hasFullCoverage ? 'bg-emerald-100' : 'bg-amber-100'
            }`}>
              {hasFullCoverage ? (
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-1">
                Selected PSP
              </h5>
              <p className="text-xl font-bold text-gray-900">
                {getProviderDisplayName(displayedProvider)}
              </p>
            </div>
          </div>
          
          {/* Coverage Badge */}
          <div className={`px-4 py-2 rounded-lg ${
            hasFullCoverage
              ? 'bg-emerald-100 border border-emerald-300'
              : 'bg-amber-100 border border-amber-300'
          }`}>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-0.5">
              Coverage
            </p>
            <p className={`text-2xl font-bold ${
              hasFullCoverage ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {displayedCoverage?.coverageCount || 0}/{decision.totalCategories}
            </p>
          </div>
        </div>

        {/* Coverage Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-2">
            <span>Category Coverage</span>
            <span>{coveragePercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                hasFullCoverage ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${coveragePercent}%` }}
            />
          </div>
        </div>

        {/* Explanation */}
        <p className={`text-sm ${
          hasFullCoverage ? 'text-emerald-800' : 'text-amber-800'
        }`}>
          {manuallySelectedProvider
            ? `Manually selected ${getProviderDisplayName(displayedProvider)} with ${displayedCoverage?.coveragePercentage || 0}% coverage.`
            : decision.explanation}
        </p>

        {/* Missing Categories */}
        {displayedCoverage && displayedCoverage.missedCategories.length > 0 && (
          <div className="mt-4 p-3 bg-white/60 rounded-lg border border-amber-200">
            <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-2">
              Missing Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {displayedCoverage.missedCategories.map(cat => (
                <span
                  key={cat}
                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium border border-red-200"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SKU Analysis Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            SKU Routing Analysis
          </h5>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Supported Providers
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Routed PSP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {decision.skuAnalysis.map((sku, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {sku.sku}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {sku.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                      {sku.categoryId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {sku.supportedProviders.length === 0 ? (
                      <span className="text-xs text-red-600 font-medium">
                        No providers found
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {sku.supportedProviders.map(provider => (
                          <span
                            key={provider}
                            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                              provider === displayedProvider
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}
                          >
                            {getProviderDisplayName(provider)}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {sku.routedProvider ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {getProviderDisplayName(sku.routedProvider)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Not supported
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Route Modal */}
      {modalProvider && lineItems && (
        <ProviderRouteModal
          open={!!modalProvider}
          onOpenChange={(open) => !open && setModalProvider(null)}
          provider={modalProvider}
          coverage={modalCoverage}
          items={lineItems}
          onSelect={() => setManuallySelectedProvider(modalProvider)}
          isSelected={displayedProvider === modalProvider}
        />
      )}
    </div>
  );
}
