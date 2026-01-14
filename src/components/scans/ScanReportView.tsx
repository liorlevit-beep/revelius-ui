import { useState } from 'react';
import { 
  Download, Copy, Check, AlertCircle, ChevronDown, ChevronUp, 
  FileText, Shield, Image as ImageIcon, Code, ExternalLink, RefreshCw 
} from 'lucide-react';
import { JsonViewerWrapper } from '../JsonViewer';
import { EllipsisCell } from '../table/EllipsisCell';
import { VisualReportView } from './VisualReportView';
import { CountryFlag } from '../CountryFlag';
import { ScannerAPI } from '../../api';

// ========================================================
// Schema-Resilient Helper Functions
// ========================================================

export function unwrapReportPayload(res: any): any {
  if (!res) return {};
  // Handle fetch client wrappers
  const root = res?.data ?? res;
  // Extract the actual report object
  return root?.report ?? root?.data?.report ?? root;
}

export function unwrapReport(res: any): any {
  return unwrapReportPayload(res);
}

export function findFirstKey(obj: any, keys: string[]): any {
  if (!obj || typeof obj !== 'object') return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined) return obj[key];
  }
  return undefined;
}

export function normalizeArray(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return [value];
  return [];
}

export function guessOverview(report: any): Record<string, any> {
  const overview: Record<string, any> = {};
  
  // Scan URL/Target
  overview.url = findFirstKey(report, ['scanned_url', 'target_url', 'url', 'target', 'website', 'domain']);
  
  // Category
  overview.category = findFirstKey(report, ['inferred_category', 'category', 'mcc', 'merchant_category', 'type']);
  
  // Risk/Severity
  overview.risk = findFirstKey(report, ['risk_level', 'severity', 'score', 'risk_score', 'threat_level']);
  
  // Region
  overview.region = findFirstKey(report, ['region', 'country', 'location', 'geo']);
  
  // Status
  overview.status = findFirstKey(report, ['status', 'state', 'result']);
  
  // Summary/Description
  overview.summary = findFirstKey(report, ['summary', 'description', 'message', 'details']);
  
  // Timestamps
  overview.scanned_at = findFirstKey(report, ['scanned_at', 'scan_time', 'timestamp', 'created_at']);
  overview.completed_at = findFirstKey(report, ['completed_at', 'finished_at', 'updated_at']);
  
  return overview;
}

export function guessFindings(report: any): any[] {
  const findings = findFirstKey(report, ['findings', 'violations', 'issues', 'alerts', 'flags', 'results', 'detections']);
  return normalizeArray(findings);
}

export function guessEvidence(report: any): any[] {
  const evidence = findFirstKey(report, ['evidence', 'sources', 'artifacts', 'snapshots', 'urls', 'matches', 'references']);
  return normalizeArray(evidence);
}

export function guessImages(report: any): string[] {
  const images: string[] = [];
  
  // Look for screenshot arrays
  const screenshots = findFirstKey(report, ['screenshots', 'images', 'captures', 'snapshots']);
  if (Array.isArray(screenshots)) {
    screenshots.forEach((item: any) => {
      if (typeof item === 'string' && (item.startsWith('http') || item.startsWith('data:image'))) {
        images.push(item);
      } else if (item?.url) {
        images.push(item.url);
      }
    });
  }
  
  // Look for image URLs in evidence
  const evidence = guessEvidence(report);
  evidence.forEach((item: any) => {
    const url = item?.url || item?.image || item?.screenshot;
    if (url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('data:image'))) {
      images.push(url);
    }
  });
  
  return images;
}

// Detect Scanner Report Schema
export function hasScannerReportShape(report: any): boolean {
  return (
    report &&
    typeof report === 'object' &&
    ('passed_items' in report || 'failed_items' in report) &&
    ('summary' in report || 'root_website_url' in report || 'session_id' in report)
  );
}

// Extract Scanner Report Items
export function getScannerReportItems(report: any): any[] {
  const passed = Array.isArray(report?.passed_items) ? report.passed_items : [];
  const failed = Array.isArray(report?.failed_items) ? report.failed_items : [];
  
  return [
    ...failed.map((i: any) => ({ ...i, _bucket: 'failed' })),
    ...passed.map((i: any) => ({ ...i, _bucket: 'passed' })),
  ];
}

function getSeverityBadge(severity: any): { color: string; text: string } {
  const s = String(severity || '').toLowerCase();
  
  if (s.includes('high') || s.includes('critical') || s.includes('severe')) {
    return { color: 'bg-red-100 text-red-700', text: 'High' };
  }
  if (s.includes('medium') || s.includes('moderate') || s.includes('med')) {
    return { color: 'bg-yellow-100 text-yellow-700', text: 'Medium' };
  }
  if (s.includes('low') || s.includes('minor')) {
    return { color: 'bg-blue-100 text-blue-700', text: 'Low' };
  }
  if (s.includes('info') || s.includes('information')) {
    return { color: 'bg-gray-100 text-gray-700', text: 'Info' };
  }
  
  return { color: 'bg-gray-100 text-gray-700', text: String(severity || 'Unknown') };
}

// ========================================================
// Main Component
// ========================================================

interface ScanReportViewProps {
  reportData: any;
  sessionId: string;
  onRefresh?: () => void;
}

export function ScanReportView({ reportData, sessionId, onRefresh }: ScanReportViewProps) {
  // Feature flag for visual vs table view
  const useVisual = true;
  
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFinding, setExpandedFinding] = useState<number | null>(null);
  const [expandedEvidence, setExpandedEvidence] = useState<number | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const report = unwrapReport(reportData);
  
  // Detect Scanner Report schema
  const isScannerReport = hasScannerReportShape(report);
  
  // Scanner Report specific data
  const scannerItems = isScannerReport ? getScannerReportItems(report) : [];
  const scannerSummary = report?.summary;
  
  // Generic fallback data
  const overview = guessOverview(report);
  const findings = guessFindings(report);
  const evidence = guessEvidence(report);
  const images = guessImages(report);

  const hasOverview = isScannerReport || Object.values(overview).some(v => v !== undefined);
  const hasFindings = !isScannerReport && findings.length > 0;
  const hasEvidence = !isScannerReport && evidence.length > 0;
  const hasImages = !isScannerReport && images.length > 0;
  const hasScannerItems = isScannerReport && scannerItems.length > 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const blob = await ScannerAPI.getPdfReport(sessionId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scan-report-${sessionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF report:', err);
      alert('Failed to download PDF report. Please try again.');
    }
  };

  const sections = isScannerReport ? [
    { id: 'overview', label: 'Overview', show: true },
    { id: 'items', label: 'Scanned Items', show: hasScannerItems, count: scannerItems.length },
    { id: 'raw', label: 'Raw JSON', show: true },
  ].filter(s => s.show) : [
    { id: 'overview', label: 'Overview', show: hasOverview },
    { id: 'findings', label: 'Findings', show: hasFindings, count: findings.length },
    { id: 'evidence', label: 'Evidence', show: hasEvidence, count: evidence.length },
    { id: 'images', label: 'Assets', show: hasImages, count: images.length },
    { id: 'raw', label: 'Raw JSON', show: true },
  ].filter(s => s.show);

  return (
    <div className="flex gap-6">
      {/* Left Navigation Panel */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-6 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider px-3 mb-3">
            Report Outline
          </h3>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                activeSection === section.id
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{section.label}</span>
              {section.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeSection === section.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 space-y-8">
        {/* Header Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Scan Report</h2>
              {overview.scanned_at && (
                <p className="text-sm text-gray-500 mt-0.5">
                  Scanned: {new Date(overview.scanned_at).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        {hasOverview && (
          <div id="section-overview" className="scroll-mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Overview
              </h3>
              
              {isScannerReport ? (
                // Scanner Report Overview
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {report?.customer_name && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Customer</p>
                        <p className="text-sm text-gray-900 font-medium">{report.customer_name}</p>
                      </div>
                    )}
                    
                    {report?.root_website_url && (
                      <div className="col-span-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Website URL</p>
                        <EllipsisCell value={report.root_website_url} className="text-sm text-gray-900 font-medium" />
                      </div>
                    )}
                    
                    {report?.session_id && (
                      <div className="col-span-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Session ID</p>
                        <div className="flex items-center gap-2">
                          <EllipsisCell value={report.session_id} className="text-sm text-gray-900 font-mono" />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(report.session_id);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Summary KPIs */}
                  {scannerSummary && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Summary Statistics</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {scannerSummary.total_scanned_items !== undefined && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Total Items</p>
                            <p className="text-2xl font-bold text-gray-900">{scannerSummary.total_scanned_items}</p>
                          </div>
                        )}
                        
                        {scannerSummary.total_passed_items !== undefined && (
                          <div className="bg-emerald-50 rounded-lg p-3">
                            <p className="text-xs text-emerald-600 mb-1">Passed</p>
                            <p className="text-2xl font-bold text-emerald-700">{scannerSummary.total_passed_items}</p>
                            {scannerSummary.passed_percentage !== undefined && (
                              <p className="text-xs text-emerald-600 mt-1">{scannerSummary.passed_percentage}%</p>
                            )}
                          </div>
                        )}
                        
                        {scannerSummary.total_failed_items !== undefined && (
                          <div className="bg-red-50 rounded-lg p-3">
                            <p className="text-xs text-red-600 mb-1">Failed</p>
                            <p className="text-2xl font-bold text-red-700">{scannerSummary.total_failed_items}</p>
                            {scannerSummary.failed_percentage !== undefined && (
                              <p className="text-xs text-red-600 mt-1">{scannerSummary.failed_percentage}%</p>
                            )}
                          </div>
                        )}
                        
                        {scannerSummary.block_score_confidence !== undefined && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs text-blue-600 mb-1">Confidence</p>
                            <p className="text-2xl font-bold text-blue-700">
                              {Math.round(scannerSummary.block_score_confidence * 100)}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Generic Overview
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {overview.url && (
                      <div className="col-span-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Target URL</p>
                        <EllipsisCell value={overview.url} className="text-sm text-gray-900 font-medium" />
                      </div>
                    )}
                    
                    {overview.category && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Category</p>
                        <p className="text-sm text-gray-900">{overview.category}</p>
                      </div>
                    )}
                    
                    {overview.risk !== undefined && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Risk Level</p>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBadge(overview.risk).color}`}>
                          {getSeverityBadge(overview.risk).text}
                        </span>
                      </div>
                    )}
                    
                    {overview.region && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Region</p>
                        <div className="flex items-center gap-2">
                          <CountryFlag country={overview.region} />
                          <span className="text-sm text-gray-700">{overview.region}</span>
                        </div>
                      </div>
                    )}
                    
                    {overview.status && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                        <p className="text-sm text-gray-900">{overview.status}</p>
                      </div>
                    )}
                  </div>
                  
                  {overview.summary && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-2">Summary</p>
                      <p className="text-sm text-gray-700">{String(overview.summary)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scanner Items Section */}
        {hasScannerItems && (
          <div id="section-items" className="scroll-mt-6">
            {useVisual ? (
              // Visual Report View
              <VisualReportView report={report} />
            ) : (
              // Table View (existing)
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    Scanned Items
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      {scannerItems.length}
                    </span>
                  </h3>
                </div>
              
              {scannerItems.length === 0 ? (
                <div className="p-12 text-center">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No items scanned</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6 whitespace-nowrap">
                          Type
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap">
                          URL
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap">
                          Referrer
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap">
                          Result
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap">
                          Confidence
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6 whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {scannerItems.map((item, idx) => {
                        const isExpanded = expandedItem === idx;
                        const isFailed = item._bucket === 'failed';
                        const isBlocked = item.blocked === true;
                        const needsReview = item.review_required === true;
                        
                        return (
                          <>
                            <tr
                              key={idx}
                              className="group relative hover:bg-gray-50/80 cursor-pointer transition-all duration-150"
                              onClick={() => setExpandedItem(isExpanded ? null : idx)}
                            >
                              <td className="py-3 px-6 whitespace-nowrap">
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                  {item.content_type || '—'}
                                </span>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap max-w-xs">
                                <EllipsisCell value={item.url || '—'} className="text-sm text-gray-900" />
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap max-w-xs">
                                <EllipsisCell value={item.url_referrer || '—'} className="text-sm text-gray-600" />
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    isFailed ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                  }`}>
                                    {isFailed ? 'Failed' : 'Passed'}
                                  </span>
                                  {isBlocked && (
                                    <span className="px-2 py-0.5 bg-red-600 text-white rounded-full text-xs font-bold">
                                      Blocked
                                    </span>
                                  )}
                                  {needsReview && (
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                      Review
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                {item.confidence !== undefined ? (
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                                      <div
                                        className={`h-2 rounded-full ${isFailed ? 'bg-red-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.round(item.confidence * 100)}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">
                                      {Math.round(item.confidence * 100)}%
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">—</span>
                                )}
                              </td>
                              <td className="py-3 px-6 whitespace-nowrap">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedItem(isExpanded ? null : idx);
                                  }}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                                >
                                  {isExpanded ? 'Hide' : 'Details'}
                                </button>
                              </td>
                            </tr>
                            
                            {/* Expanded Details Row */}
                            {isExpanded && (
                              <tr>
                                <td colSpan={6} className="bg-gray-50 border-t border-gray-100">
                                  <div className="p-6 space-y-4">
                                    {/* Blocked Reason */}
                                    {item.blocked_reason && (
                                      <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Blocked Reason</p>
                                        <p className="text-sm text-gray-900">{item.blocked_reason}</p>
                                      </div>
                                    )}
                                    
                                    {/* Image Preview for image content_type */}
                                    {item.content_type === 'image' && item.url && (
                                      <div>
                                        <p className="text-xs font-medium text-gray-500 mb-2">Image Preview</p>
                                        <div className="max-w-md">
                                          <img
                                            src={item.url}
                                            alt="Content preview"
                                            className="w-full rounded-lg border border-gray-200 shadow-sm"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).style.display = 'none';
                                              const parent = (e.target as HTMLImageElement).parentElement;
                                              if (parent) {
                                                parent.innerHTML = '<div class="p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-500">Image preview unavailable</div>';
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Full JSON */}
                                    <div>
                                      <p className="text-xs font-medium text-gray-500 mb-2">Full Details</p>
                                      <JsonViewerWrapper data={item} />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* Findings Section */}
        {hasFindings && (
          <div id="section-findings" className="scroll-mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Findings
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                  {findings.length}
                </span>
              </h3>
              
              <div className="space-y-3">
                {findings.map((finding, idx) => {
                  const title = findFirstKey(finding, ['title', 'name', 'type', 'issue', 'violation']);
                  const description = findFirstKey(finding, ['description', 'message', 'details', 'info']);
                  const severity = findFirstKey(finding, ['severity', 'risk', 'level', 'priority']);
                  const status = findFirstKey(finding, ['status', 'result', 'state']);
                  const badge = getSeverityBadge(severity);
                  const isExpanded = expandedFinding === idx;

                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFinding(isExpanded ? null : idx)}
                        className="w-full p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 text-left"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {title || `Finding #${idx + 1}`}
                            </span>
                            {severity && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                                {badge.text}
                              </span>
                            )}
                            {status && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {status}
                              </span>
                            )}
                          </div>
                          {description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {String(description)}
                            </p>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <JsonViewerWrapper data={finding} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Evidence Section */}
        {hasEvidence && (
          <div id="section-evidence" className="scroll-mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-emerald-600" />
                Evidence
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                  {evidence.length}
                </span>
              </h3>
              
              <div className="space-y-3">
                {evidence.map((item, idx) => {
                  const type = findFirstKey(item, ['type', 'kind', 'category']);
                  const source = findFirstKey(item, ['source', 'url', 'link', 'reference']);
                  const snippet = findFirstKey(item, ['snippet', 'text', 'content', 'quote', 'match']);
                  const timestamp = findFirstKey(item, ['timestamp', 'time', 'captured_at', 'detected_at']);
                  const isExpanded = expandedEvidence === idx;

                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedEvidence(isExpanded ? null : idx)}
                        className="w-full p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 text-left"
                      >
                        <Code className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {type && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                {type}
                              </span>
                            )}
                            {timestamp && (
                              <span className="text-xs text-gray-500">
                                {new Date(timestamp).toLocaleString()}
                              </span>
                            )}
                          </div>
                          {source && (
                            <EllipsisCell value={source} className="text-sm text-gray-900 font-medium mb-1" />
                          )}
                          {snippet && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {String(snippet)}
                            </p>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <JsonViewerWrapper data={item} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Images/Assets Section */}
        {hasImages && (
          <div id="section-images" className="scroll-mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                Screenshots & Assets
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                  {images.length}
                </span>
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {images.map((imageUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setShowImageModal(imageUrl)}
                    className="aspect-video bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-emerald-500 transition-all"
                  >
                    <img
                      src={imageUrl}
                      alt={`Screenshot ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State - Only show if truly unrecognized */}
        {!isScannerReport && !hasOverview && !hasFindings && !hasEvidence && !hasImages && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report data structure not recognized</h3>
            <p className="text-sm text-gray-600 mb-4">
              We couldn't extract structured sections from this report. View the raw JSON below.
            </p>
            <div className="flex items-center gap-2 justify-center">
              <button
                onClick={() => setShowRawJson(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                View Raw JSON
              </button>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Raw JSON Section */}
        <div id="section-raw" className="scroll-mt-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-600" />
                Raw JSON Data
              </h3>
              {showRawJson ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {showRawJson && (
              <div className="border-t border-gray-200 p-6">
                <JsonViewerWrapper data={report} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowImageModal(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors z-10"
            >
              <AlertCircle className="w-5 h-5 text-gray-700" />
            </button>
            <img
              src={showImageModal}
              alt="Full size preview"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
