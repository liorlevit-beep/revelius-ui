import { X, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { getProviderDisplayName } from '../../data/providerRegions';
import type { ProviderCoverage } from '../../utils/routingEligibility';
import type { SKU, LineItem } from '../../demo/transactions';

interface ProviderRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: string;
  coverage?: ProviderCoverage;
  items?: (SKU | LineItem)[];
  onSelect?: () => void;
  isSelected?: boolean;
}

export function ProviderRouteModal({
  open,
  onOpenChange,
  provider,
  coverage,
  items = [],
  onSelect,
  isSelected = false,
}: ProviderRouteModalProps) {
  if (!open) return null;

  const displayName = getProviderDisplayName(provider);
  const totalItems = items.length;
  const supportedCount = coverage?.coverageCount || 0;
  const coveragePercentage = coverage?.coveragePercentage || 0;
  const isFullCoverage = coverage?.isFullCoverage || false;
  const isDefault = coverage?.isDefault || false;

  // Categorize items as supported or unsupported
  const supportedItems = items.filter(item => {
    const categoryId = 'category_id' in item ? item.category_id : item.categoryId;
    return categoryId && coverage?.coveredCategories.includes(categoryId);
  });

  const unsupportedItems = items.filter(item => {
    const categoryId = 'category_id' in item ? item.category_id : item.categoryId;
    return categoryId && !coverage?.coveredCategories.includes(categoryId);
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-8"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
                {isDefault && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Default PSP
                  </span>
                )}
                {isSelected && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    ✓ Selected
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Review coverage and select as routing provider
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Coverage Summary */}
        <div className="flex-shrink-0 p-6 border-b border-gray-100">
          <div className={`rounded-xl p-4 ${
            isFullCoverage
              ? 'bg-emerald-50 border-2 border-emerald-200'
              : supportedCount > 0
              ? 'bg-amber-50 border-2 border-amber-200'
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                isFullCoverage
                  ? 'bg-emerald-100'
                  : supportedCount > 0
                  ? 'bg-amber-100'
                  : 'bg-red-100'
              }`}>
                {isFullCoverage ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : supportedCount > 0 ? (
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Coverage: {supportedCount}/{totalItems} items
                </h3>
                <p className="text-sm text-gray-700">
                  {isFullCoverage
                    ? `${displayName} supports all items in this transaction`
                    : supportedCount > 0
                    ? `${displayName} supports ${coveragePercentage}% of items`
                    : `${displayName} does not support any items in this transaction`}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className={`text-3xl font-bold ${
                  isFullCoverage
                    ? 'text-emerald-600'
                    : supportedCount > 0
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}>
                  {coveragePercentage}%
                </div>
              </div>
            </div>

            {/* Coverage Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isFullCoverage
                      ? 'bg-emerald-500'
                      : supportedCount > 0
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${coveragePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Supported Items */}
          {supportedItems.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Supported Items ({supportedItems.length})
              </h4>
              <div className="space-y-2">
                {supportedItems.map((item, idx) => {
                  const title = 'title' in item ? item.title : item.name;
                  const sku = 'sku_id' in item ? item.sku_id : item.sku;
                  const categoryId = 'category_id' in item ? item.category_id : item.categoryId;
                  
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">
                          {title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 font-mono">{sku}</span>
                          {categoryId && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                                {categoryId}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Unsupported Items */}
          {unsupportedItems.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Unsupported Items ({unsupportedItems.length})
              </h4>
              <div className="space-y-2">
                {unsupportedItems.map((item, idx) => {
                  const title = 'title' in item ? item.title : item.name;
                  const sku = 'sku_id' in item ? item.sku_id : item.sku;
                  const categoryId = 'category_id' in item ? item.category_id : item.categoryId;
                  
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">
                          {title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 font-mono">{sku}</span>
                          {categoryId && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                {categoryId}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-amber-700 mt-1">
                          This category is not supported by {displayName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Items */}
          {items.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">No items to display</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            {isFullCoverage ? (
              <span className="text-emerald-700 font-medium">
                ✓ Full coverage — recommended for this transaction
              </span>
            ) : supportedCount > 0 ? (
              <span className="text-amber-700 font-medium">
                ⚠️ Partial coverage — some items may need alternative routing
              </span>
            ) : (
              <span className="text-red-700 font-medium">
                ✕ No coverage — not recommended for this transaction
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            {onSelect && !isSelected && (
              <button
                onClick={() => {
                  onSelect();
                  onOpenChange(false);
                }}
                className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  supportedCount > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={supportedCount === 0}
              >
                Select this provider
              </button>
            )}
            {isSelected && (
              <div className="px-6 py-2 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Currently Selected
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
