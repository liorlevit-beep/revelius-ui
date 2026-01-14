import { useState } from 'react';
import { AlertCircle, CheckCircle, Eye, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReportContentCard } from './ReportContentCard';
import type { ReportItem } from './ReportContentCard';
import { JsonViewerWrapper } from '../JsonViewer';

interface VisualReportViewProps {
  report: any;
}

export function VisualReportView({ report }: VisualReportViewProps) {
  const [selectedItem, setSelectedItem] = useState<(ReportItem & { _bucket?: 'passed' | 'failed' }) | null>(null);

  // Defensive check
  if (!report || typeof report !== 'object') {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No report data available</p>
      </div>
    );
  }

  // Build items with _bucket property
  const failedItems = Array.isArray(report.failed_items) ? report.failed_items : [];
  const passedItems = Array.isArray(report.passed_items) ? report.passed_items : [];
  
  const failed = failedItems.map((i: any) => ({ ...i, _bucket: 'failed' as const }));
  const passed = passedItems.map((i: any) => ({ ...i, _bucket: 'passed' as const }));
  
  // Get items that need review
  const violationsAndReview = [
    ...failed,
    ...passed.filter((item: any) => item.review_required === true),
  ];
  
  // Clean findings (passed items without review required)
  const cleanFindings = passed.filter((item: any) => !item.review_required);
  
  // Count review required across both arrays
  const reviewRequiredCount = [
    ...failed.filter((item: any) => item.review_required === true),
    ...passed.filter((item: any) => item.review_required === true),
  ].length;
  
  // Separate by content type for layout
  const getItemsByType = (items: any[]) => {
    const images = items.filter((item: any) => item.content_type === 'image');
    const texts = items.filter((item: any) => item.content_type === 'text');
    const others = items.filter((item: any) => item.content_type !== 'image' && item.content_type !== 'text');
    return { images, texts, others };
  };

  return (
    <>
      <div className="space-y-8">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-gray-600" />
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Summary</h4>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {failed.length + passed.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Pass Rate</p>
              <p className="text-2xl font-bold text-emerald-600">
                {failed.length + passed.length > 0
                  ? Math.round((passed.length / (failed.length + passed.length)) * 100)
                  : 0}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Needs Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {reviewRequiredCount}
              </p>
            </div>
          </div>
        </div>

        {/* Violations & Required Review Section */}
        {violationsAndReview.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Violations & Required Review
              </h3>
              <span className="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                {violationsAndReview.length}
              </span>
            </div>
            
            {(() => {
              const { images, texts, others } = getItemsByType(violationsAndReview);
              return (
                <div className="space-y-6">
                  {/* Images Grid */}
                  {images.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-3">Images ({images.length})</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {images.map((item: any, idx: number) => (
                          <ReportContentCard
                            key={`violation-img-${idx}`}
                            item={item}
                            onClick={() => setSelectedItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Text Items */}
                  {texts.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-3">Text Pages ({texts.length})</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {texts.map((item: any, idx: number) => (
                          <ReportContentCard
                            key={`violation-text-${idx}`}
                            item={item}
                            onClick={() => setSelectedItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Other Content Types */}
                  {others.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-3">Other ({others.length})</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {others.map((item: any, idx: number) => (
                          <ReportContentCard
                            key={`violation-other-${idx}`}
                            item={item}
                            onClick={() => setSelectedItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Clean Findings Section */}
        {cleanFindings.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Clean Findings
              </h3>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                {cleanFindings.length}
              </span>
            </div>
            
            {(() => {
              const { images, texts, others } = getItemsByType(cleanFindings);
              return (
                <div className="space-y-6">
                  {/* Images Grid */}
                  {images.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-3">Images ({images.length})</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {images.map((item: any, idx: number) => (
                          <ReportContentCard
                            key={`clean-img-${idx}`}
                            item={item}
                            onClick={() => setSelectedItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Text Items */}
                  {texts.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-3">Text Pages ({texts.length})</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {texts.map((item: any, idx: number) => (
                          <ReportContentCard
                            key={`clean-text-${idx}`}
                            item={item}
                            onClick={() => setSelectedItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Other Content Types */}
                  {others.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-3">Other ({others.length})</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {others.map((item: any, idx: number) => (
                          <ReportContentCard
                            key={`clean-other-${idx}`}
                            item={item}
                            onClick={() => setSelectedItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Empty State */}
        {violationsAndReview.length === 0 && cleanFindings.length === 0 && (
          <div className="text-center py-12">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No items found in this report</p>
          </div>
        )}
      </div>

      {/* Item Details Drawer */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-end"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-gray-900">Item Details</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                {selectedItem._bucket === 'failed' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                    Failed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                    Passed
                  </span>
                )}
                {selectedItem.blocked && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-600 text-white">
                    Blocked
                  </span>
                )}
                {selectedItem.review_required && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                    Review Required
                  </span>
                )}
              </div>

              {/* Category Matches & MCC Tags */}
              {(() => {
                const hasMcc = selectedItem?.mcc || selectedItem?.mcc_code;
                const rawCategoryMatches = selectedItem?.category_matches;
                const hasCategories = selectedItem?.categories && (typeof selectedItem.categories === 'string' || (Array.isArray(selectedItem.categories) && selectedItem.categories.length > 0));
                
                // Extract category match strings from various possible structures
                let categoryMatchStrings: string[] = [];
                if (rawCategoryMatches) {
                  if (Array.isArray(rawCategoryMatches)) {
                    categoryMatchStrings = rawCategoryMatches
                      .map((item: any) => {
                        // If it's already a string
                        if (typeof item === 'string') return item;
                        // If it's an object, try common property names
                        if (typeof item === 'object' && item !== null) {
                          return item.name || item.category || item.label || item.value || item.match || null;
                        }
                        return null;
                      })
                      .filter((item: any): item is string => typeof item === 'string' && item.length > 0);
                  } else if (typeof rawCategoryMatches === 'string') {
                    categoryMatchStrings = [rawCategoryMatches];
                  }
                }
                
                const hasCategoryMatches = categoryMatchStrings.length > 0;
                
                if (!hasMcc && !hasCategoryMatches && !hasCategories) return null;
                
                return (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category & Classification</p>
                    <div className="flex flex-wrap gap-2">
                      {/* MCC Code */}
                      {hasMcc && (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                          MCC: {selectedItem.mcc || selectedItem.mcc_code}
                        </span>
                      )}
                      
                      {/* Category Matches */}
                      {hasCategoryMatches && categoryMatchStrings.map((cat: string, idx: number) => (
                        <span key={`cat-match-${idx}`} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                          {cat}
                        </span>
                      ))}
                      
                      {/* Categories (if it's a string or array) */}
                      {hasCategories && (
                        <>
                          {typeof selectedItem.categories === 'string' ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                              {selectedItem.categories}
                            </span>
                          ) : Array.isArray(selectedItem.categories) && selectedItem.categories.map((cat: any, idx: number) => {
                            if (!cat || typeof cat !== 'string') return null;
                            return (
                              <span key={`cat-${idx}`} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                {cat}
                              </span>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Image Preview */}
              {selectedItem.content_type === 'image' && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                  <img
                    src={selectedItem.url}
                    alt="Scanned item preview"
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Failed+to+Load';
                      e.currentTarget.alt = 'Image failed to load';
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
              )}

              {/* Media Description */}
              {(() => {
                const mediaDesc = selectedItem?.media_description || selectedItem?.description || selectedItem?.alt_text;
                if (!mediaDesc || typeof mediaDesc !== 'string') return null;
                
                return (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">Media Description:</p>
                    <p className="text-sm text-blue-700">{mediaDesc}</p>
                  </div>
                );
              })()}

              {/* Blocked Reason */}
              {selectedItem.blocked_reason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-1">Blocked Reason:</p>
                  <p className="text-sm text-red-700">{selectedItem.blocked_reason}</p>
                </div>
              )}

              {/* Confidence */}
              {(() => {
                const confidence = typeof selectedItem?.confidence === 'number' ? selectedItem.confidence : 0;
                const confidencePercent = Math.min(100, Math.max(0, Math.round(confidence * 100)));
                
                return (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Confidence Score</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              confidence >= 0.8 ? 'bg-emerald-500' :
                              confidence >= 0.6 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${confidencePercent}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {confidencePercent}%
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* URLs */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">URL:</p>
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 hover:text-emerald-700 break-all"
                  >
                    {selectedItem.url}
                  </a>
                </div>
                {selectedItem.url_referrer && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Referrer:</p>
                    <p className="text-sm text-gray-600 break-all">{selectedItem.url_referrer}</p>
                  </div>
                )}
              </div>

              {/* Raw JSON */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Raw Data:</p>
                  <button
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(JSON.stringify(selectedItem, null, 2));
                      } catch (err) {
                        console.error('Failed to copy JSON:', err);
                      }
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Copy JSON
                  </button>
                </div>
                {selectedItem ? (
                  <JsonViewerWrapper data={selectedItem} />
                ) : (
                  <p className="text-sm text-gray-500">No data available</p>
                )}
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
