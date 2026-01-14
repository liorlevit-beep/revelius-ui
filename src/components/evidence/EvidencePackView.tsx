import { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  Image as ImageIcon,
  FileText,
  BarChart3,
  Link2,
  Download,
  Printer,
  Check
} from 'lucide-react';

interface EvidenceItem {
  content_type?: string;
  url?: string;
  url_referrer?: string;
  blocked_reason?: string;
  confidence?: number;
  media_description?: string;
  review_required?: boolean;
  category_matches?: string[];
  [key: string]: any;
}

interface EvidenceReport {
  summary?: {
    total_scanned_items?: number;
    total_failed_items?: number;
    passed_percentage?: number;
  };
  passed_items?: EvidenceItem[];
  failed_items?: EvidenceItem[];
  root_website_url?: string;
  [key: string]: any;
}

interface EvidencePackViewProps {
  report: EvidenceReport;
  sessionId: string;
  txnId: string;
}

type ItemGroup = {
  title: string;
  items: EvidenceItem[];
  icon: any;
};

export function EvidencePackView({ report, sessionId, txnId }: EvidencePackViewProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['product-pages', 'media-assets']));
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  const [visibleItemsPerGroup, setVisibleItemsPerGroup] = useState<Record<string, number>>({});
  const [linkCopied, setLinkCopied] = useState(false);
  const ITEMS_PER_PAGE = 30;

  // Extract data
  const summary = report.summary || {};
  const allItems = [...(report.passed_items || []), ...(report.failed_items || [])];
  
  // Count review required
  const reviewRequiredCount = allItems.filter(item => item.review_required).length;

  // Categorize items into groups
  const groups: ItemGroup[] = useMemo(() => {
    const productPages: EvidenceItem[] = [];
    const sitePages: EvidenceItem[] = [];
    const mediaAssets: EvidenceItem[] = [];

    allItems.forEach(item => {
      const url = item.url || '';
      const contentType = item.content_type || '';

      if (contentType.includes('image')) {
        mediaAssets.push(item);
      } else if (
        url.includes('?product=') || 
        url.includes('/product/') || 
        url.includes('product_cat') ||
        url.includes('/shop/') ||
        url.includes('/item/')
      ) {
        productPages.push(item);
      } else {
        sitePages.push(item);
      }
    });

    return [
      { title: 'Product Pages', items: productPages, icon: FileText },
      { title: 'Site Pages', items: sitePages, icon: FileText },
      { title: 'Media Assets', items: mediaAssets, icon: ImageIcon },
    ].filter(group => group.items.length > 0);
  }, [allItems]);

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupTitle)) {
      newExpanded.delete(groupTitle);
    } else {
      newExpanded.add(groupTitle);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleDescription = (index: number) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDescriptions(newExpanded);
  };

  const loadMoreItems = (groupTitle: string, currentCount: number) => {
    setVisibleItemsPerGroup(prev => ({
      ...prev,
      [groupTitle]: (prev[groupTitle] || ITEMS_PER_PAGE) + ITEMS_PER_PAGE,
    }));
  };

  const getStatusPill = (item: EvidenceItem) => {
    const isPassed = (report.passed_items || []).includes(item);
    const reviewRequired = item.review_required;

    if (reviewRequired) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" />
          Review
        </span>
      );
    }

    if (isPassed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5" />
          Passed
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
        <XCircle className="w-3.5 h-3.5" />
        Failed
      </span>
    );
  };

  const truncateUrl = (url: string, maxLength: number = 60) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  // Export/Share Actions
  const handleCopyLink = async () => {
    const evidenceUrl = `${window.location.origin}/transactions/${txnId}/evidence?session=${sessionId}`;
    try {
      await navigator.clipboard.writeText(evidenceUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = evidenceUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } catch (e) {
        console.error('Fallback copy failed:', e);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `evidence-${txnId}-${sessionId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // Get capture timestamp
  const captureTimestamp = useMemo(() => {
    if (report.timestamp) {
      return new Date(report.timestamp * 1000).toLocaleString();
    }
    if (report.created_at) {
      return new Date(report.created_at).toLocaleString();
    }
    if (report.scan_timestamp) {
      return new Date(report.scan_timestamp).toLocaleString();
    }
    return 'Unknown';
  }, [report]);

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .evidence-pack-print,
          .evidence-pack-print * {
            visibility: visible;
          }
          .evidence-pack-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>

    <div className="space-y-6 evidence-pack-print">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Upstream Evidence Pack</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-semibold">Transaction:</span>{' '}
                <span className="font-mono">{txnId}</span>
              </p>
              <p>
                <span className="font-semibold">Scan Session:</span>{' '}
                <span className="font-mono">{sessionId}</span>
              </p>
              {report.root_website_url && (
                <p>
                  <span className="font-semibold">Root URL:</span>{' '}
                  <a 
                    href={report.root_website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    {report.root_website_url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
              title="Copy evidence link to clipboard"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>
            
            <button
              onClick={handleDownloadJson}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
              title="Download report as JSON"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
              title="Print evidence pack"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Evidence Integrity Info */}
        <div className="mb-4 p-3 bg-white/60 backdrop-blur rounded-lg border border-emerald-200">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Evidence Integrity
          </p>
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-semibold">Captured at:</span>{' '}
              <span className="font-mono">{captureTimestamp}</span>
            </div>
            <div>
              <span className="font-semibold">Session ID:</span>{' '}
              <span className="font-mono">{sessionId.substring(0, 20)}...</span>
            </div>
            <div>
              <span className="font-semibold">Bound transaction:</span>{' '}
              <span className="font-mono">{txnId}</span>
            </div>
          </div>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total Scanned
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {summary.total_scanned_items || allItems.length || 0}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Failed Items
              </p>
            </div>
            <p className="text-3xl font-bold text-red-600">
              {summary.total_failed_items || (report.failed_items || []).length || 0}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pass Rate
              </p>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {summary.passed_percentage !== undefined 
                ? `${Math.round(summary.passed_percentage)}%`
                : allItems.length > 0
                ? `${Math.round(((report.passed_items || []).length / allItems.length) * 100)}%`
                : '0%'
              }
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Review Required
              </p>
            </div>
            <p className="text-3xl font-bold text-amber-600">
              {reviewRequiredCount}
            </p>
          </div>
        </div>
      </div>

      {/* Evidence Groups */}
      {groups.map((group, groupIdx) => {
        const groupKey = group.title.toLowerCase().replace(/\s+/g, '-');
        const isExpanded = expandedGroups.has(groupKey);
        const visibleCount = visibleItemsPerGroup[groupKey] || ITEMS_PER_PAGE;
        const visibleItems = group.items.slice(0, visibleCount);
        const hasMore = visibleCount < group.items.length;
        const Icon = group.icon;

        return (
          <div key={groupIdx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(groupKey)}
              className="w-full px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
                <Icon className="w-5 h-5 text-gray-600" />
                <h4 className="text-lg font-semibold text-gray-900">{group.title}</h4>
                <span className="px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
                  {group.items.length}
                </span>
              </div>
            </button>

            {/* Group Content */}
            {isExpanded && (
              <div className="p-6 space-y-4">
                {visibleItems.map((item, itemIdx) => {
                  const globalIdx = groupIdx * 1000 + itemIdx; // Unique key
                  const isImage = item.content_type?.includes('image');
                  const isDescExpanded = expandedDescriptions.has(globalIdx);

                  return (
                    <div 
                      key={itemIdx}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all print-break-inside-avoid"
                    >
                      {/* Status and URL */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusPill(item)}
                            {item.confidence !== undefined && (
                              <span className="text-xs text-gray-600">
                                Confidence: <span className="font-semibold">{Math.round(item.confidence * 100)}%</span>
                              </span>
                            )}
                          </div>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-blue-600 hover:text-blue-700 hover:underline block truncate"
                            title={item.url}
                          >
                            {item.url}
                          </a>
                          {item.url_referrer && (
                            <p className="text-xs text-gray-500 truncate mt-1" title={item.url_referrer}>
                              Referrer: {item.url_referrer}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Blocked Reason */}
                      {item.blocked_reason && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs font-semibold text-red-900 uppercase tracking-wider mb-1">
                            Blocked Reason
                          </p>
                          <p className="text-sm text-red-800">{item.blocked_reason}</p>
                        </div>
                      )}

                      {/* Category Matches */}
                      {item.category_matches && item.category_matches.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                            Category Matches
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.category_matches.map((cat: string, catIdx: number) => (
                              <span
                                key={catIdx}
                                className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Image Preview */}
                      {isImage && item.url && (
                        <div className="mb-3">
                          <div className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={item.url}
                              alt="Evidence media"
                              loading="lazy"
                              className="w-full h-auto max-h-96 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="flex flex-col items-center justify-center py-12 text-gray-400">
                                      <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                      </svg>
                                      <p class="text-sm">Image failed to load</p>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Media Description */}
                      {item.media_description && (
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                            Media Description
                          </p>
                          <p className={`text-sm text-gray-700 ${!isDescExpanded && 'line-clamp-3'}`}>
                            {item.media_description}
                          </p>
                          {item.media_description.length > 150 && (
                            <button
                              onClick={() => toggleDescription(globalIdx)}
                              className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                            >
                              {isDescExpanded ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Text Asset */}
                      {!isImage && item.content_type?.includes('text') && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <span className="font-semibold">Text asset validated</span> — Content analyzed for compliance
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Load More Button */}
                {hasMore && (
                  <div className="pt-4 text-center no-print">
                    <button
                      onClick={() => loadMoreItems(groupKey, visibleCount)}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                    >
                      Load More ({group.items.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Empty State */}
      {allItems.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Evidence Items</h3>
          <p className="text-sm text-gray-600">
            This scan report contains no evidence items to display.
          </p>
        </div>
      )}
    </div>
    </>
  );
}
