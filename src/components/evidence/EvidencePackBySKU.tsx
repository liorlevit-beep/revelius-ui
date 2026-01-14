import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Image as ImageIcon } from 'lucide-react';
import type { SKU, EvidenceSummary } from '../../demo/transactions';

interface EvidencePackBySKUProps {
  sessionId: string;
  rootUrl: string;
  cart: SKU[];
  evidenceSummary: EvidenceSummary;
  transactionId: string;
}

export function EvidencePackBySKU({
  sessionId,
  rootUrl,
  cart,
  evidenceSummary,
  transactionId,
}: EvidencePackBySKUProps) {
  const [expandedSKUs, setExpandedSKUs] = useState<Set<string>>(new Set(cart.slice(0, 2).map(sku => sku.sku_id)));
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [visibleItemsPerSKU, setVisibleItemsPerSKU] = useState<Map<string, number>>(
    new Map(cart.map(sku => [sku.sku_id, 25]))
  );
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const toggleSKU = (skuId: string) => {
    const newExpanded = new Set(expandedSKUs);
    if (newExpanded.has(skuId)) {
      newExpanded.delete(skuId);
    } else {
      newExpanded.add(skuId);
    }
    setExpandedSKUs(newExpanded);
  };

  const toggleDescription = (itemUrl: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(itemUrl)) {
      newExpanded.delete(itemUrl);
    } else {
      newExpanded.add(itemUrl);
    }
    setExpandedDescriptions(newExpanded);
  };

  const loadMoreItems = (skuId: string) => {
    const newVisible = new Map(visibleItemsPerSKU);
    const current = newVisible.get(skuId) || 25;
    newVisible.set(skuId, current + 25);
    setVisibleItemsPerSKU(newVisible);
  };

  const handleImageError = (url: string) => {
    setImageErrors(prev => new Set(prev).add(url));
  };

  const getStatusColor = (status: string) => {
    if (status === 'passed' || status === 'Passed') {
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle };
    }
    if (status === 'failed' || status === 'Failed') {
      return { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle };
    }
    return { bg: 'bg-amber-100', text: 'text-amber-700', icon: HelpCircle };
  };

  const truncateUrl = (url: string, maxLength: number = 60) => {
    if (url.length <= maxLength) return url;
    return url.slice(0, maxLength - 3) + '...';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upstream Evidence Pack</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="font-medium text-gray-900">Transaction:</span>
            {transactionId}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="font-medium text-gray-900">Session ID:</span>
            <span className="font-mono text-xs">{sessionId}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="font-medium text-gray-900">Root URL:</span>
            {rootUrl}
          </span>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Scanned</div>
          <div className="text-2xl font-bold text-gray-900">{evidenceSummary.total_scanned_items}</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <div className="text-sm font-medium text-emerald-700 mb-1">Passed</div>
          <div className="text-2xl font-bold text-emerald-900">{evidenceSummary.passed_percentage.toFixed(1)}%</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <div className="text-sm font-medium text-red-700 mb-1">Failed</div>
          <div className="text-2xl font-bold text-red-900">{evidenceSummary.total_failed_items}</div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <div className="text-sm font-medium text-amber-700 mb-1">Review Required</div>
          <div className="text-2xl font-bold text-amber-900">{evidenceSummary.review_required_count}</div>
        </div>
      </div>

      {/* Evidence by SKU */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Evidence by Product (SKU)</h4>
        
        {cart.map((sku) => {
          const isExpanded = expandedSKUs.has(sku.sku_id);
          const visibleCount = visibleItemsPerSKU.get(sku.sku_id) || 25;
          const visibleItems = sku.evidence_items.slice(0, visibleCount);
          const hasMore = sku.evidence_items.length > visibleCount;

          return (
            <div key={sku.sku_id} className="border border-gray-200 rounded-xl overflow-hidden">
              {/* SKU Header */}
              <button
                onClick={() => toggleSKU(sku.sku_id)}
                className="w-full bg-gray-50 hover:bg-gray-100 transition-colors px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📦</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h5 className="font-semibold text-gray-900 truncate">{sku.title}</h5>
                    <p className="text-sm text-gray-600 truncate" title={sku.product_url}>
                      {truncateUrl(sku.product_url)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Qty: {sku.quantity}</span>
                    <span className="font-semibold text-gray-900">${sku.price.toFixed(2)}</span>
                    <span className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full font-medium">
                      {sku.evidence_items.length} evidence items
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-3" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-3" />
                )}
              </button>

              {/* Evidence Items */}
              {isExpanded && (
                <div className="p-6 space-y-4 bg-white">
                  {sku.evidence_items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No evidence items found for this SKU</p>
                    </div>
                  ) : (
                    <>
                      {visibleItems.map((item, index) => {
                        const statusStyle = getStatusColor(item.status);
                        const StatusIcon = statusStyle.icon;
                        const isImageType = item.content_type === 'image' || item.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
                        const hasImageError = imageErrors.has(item.url);
                        const isDescriptionExpanded = expandedDescriptions.has(item.url);

                        return (
                          <div
                            key={`${item.url}-${index}`}
                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                          >
                            {/* Status and URL */}
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {item.status}
                                  </span>
                                  {item.confidence !== undefined && (
                                    <span className="text-xs text-gray-600">
                                      {Math.round(item.confidence * 100)}% confidence
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-900 truncate" title={item.url}>
                                    {truncateUrl(item.url, 80)}
                                  </p>
                                  {item.url_referrer && (
                                    <p className="text-xs text-gray-500 truncate" title={item.url_referrer}>
                                      Referrer: {truncateUrl(item.url_referrer, 80)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Open source
                              </a>
                            </div>

                            {/* Blocked Reason */}
                            {item.blocked_reason && (
                              <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                  {item.blocked_reason}
                                </p>
                              </div>
                            )}

                            {/* Image Preview */}
                            {isImageType && !hasImageError && (
                              <div className="mb-3">
                                <img
                                  src={item.url}
                                  alt="Evidence content"
                                  loading="lazy"
                                  onError={() => handleImageError(item.url)}
                                  className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200"
                                />
                              </div>
                            )}

                            {/* Image Error Fallback */}
                            {isImageType && hasImageError && (
                              <div className="mb-3 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Image unavailable</p>
                                  <p className="text-xs text-gray-500">Failed to load image from source</p>
                                </div>
                              </div>
                            )}

                            {/* Media Description (for images) */}
                            {isImageType && (item as any).media_description && (
                              <div className="space-y-2">
                                <p className={`text-sm text-gray-700 ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                                  {(item as any).media_description}
                                </p>
                                {(item as any).media_description.length > 150 && (
                                  <button
                                    onClick={() => toggleDescription(item.url)}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                  >
                                    {isDescriptionExpanded ? 'Show less' : 'Show more'}
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Text Asset Badge */}
                            {!isImageType && (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                                <span className="text-sm text-blue-700 font-medium">Text asset validated</span>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Load More Button */}
                      {hasMore && (
                        <button
                          onClick={() => loadMoreItems(sku.sku_id)}
                          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200"
                        >
                          Load more ({sku.evidence_items.length - visibleCount} remaining)
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
