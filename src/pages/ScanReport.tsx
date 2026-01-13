import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Download, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { SeverityBadge, Chip, RiskScoreBadge } from '../components/Badges';
import { RightDrawer } from '../components/RightDrawer';
import { JsonViewerWrapper } from '../components/JsonViewer';
import { ScanStore } from '../demo/scans';
import { normalizeScan, getDecisionRecommendation, type NormalizedFinding, type NormalizedEvidence } from '../adapters/normalizeScan';
import { merchants } from '../demo/merchants';

export function ScanReport() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'summary' | 'findings' | 'evidence' | 'coverage' | 'raw'>('summary');
  const [selectedFinding, setSelectedFinding] = useState<NormalizedFinding | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<NormalizedEvidence | null>(null);
  const [findingSeverityFilter, setFindingSeverityFilter] = useState<string>('All');
  const [findingSurfaceFilter, setFindingSurfaceFilter] = useState<string>('All');
  const [findingPolicyFilter, setFindingPolicyFilter] = useState<string>('All');
  const [copied, setCopied] = useState(false);

  const rawReport = id ? ScanStore.getScanReport(id) : undefined;
  const scan = rawReport ? normalizeScan(rawReport) : null;

  if (!scan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Scan Not Found" timeRange="7" onTimeRangeChange={() => {}} />
        <main className="p-8">
          <p className="text-gray-600">Scan report not found.</p>
        </main>
      </div>
    );
  }

  const merchant = scan.merchantId ? merchants.find((m) => m.id === scan.merchantId) : null;
  const decision = getDecisionRecommendation(scan.overallRiskScore);

  const filteredFindings = scan.findings.filter((f) => {
    const matchesSeverity = findingSeverityFilter === 'All' || f.severity === findingSeverityFilter.toLowerCase();
    const matchesSurface = findingSurfaceFilter === 'All' || f.surface === findingSurfaceFilter.toLowerCase();
    const matchesPolicy = findingPolicyFilter === 'All' || f.policyTags.some(tag => tag.toLowerCase().includes(findingPolicyFilter.toLowerCase()));
    return matchesSeverity && matchesSurface && matchesPolicy;
  });

  const allPolicyTags = Array.from(new Set(scan.findings.flatMap(f => f.policyTags)));

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rawReport, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(rawReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-${scan.scanId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'findings', label: 'Findings' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'coverage', label: 'Coverage' },
    { id: 'raw', label: 'Raw JSON' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`Scan Report ${scan.scanId}`} timeRange="7" onTimeRangeChange={() => {}} />

      <main className="p-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/scans')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Scans
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {merchant && (
                <p className="text-sm font-semibold text-gray-900 mb-1">{merchant.name}</p>
              )}
              <p className="text-lg font-mono text-gray-700 mb-2">{scan.url}</p>
              <p className="text-sm text-gray-500">
                Scanned {scan.timestamp.toLocaleString()} • {scan.type} scan
              </p>
            </div>
            <div className="flex items-center gap-3">
              {merchant && (
                <button
                  onClick={() => navigate(`/merchants/${scan.merchantId}`)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Open Merchant
                </button>
              )}
              <button
                onClick={handleCopyJson}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
              <button
                onClick={handleDownloadJson}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Overall Risk Score</p>
              <RiskScoreBadge score={scan.overallRiskScore} size="lg" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{scan.riskExplanation}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="border-b border-gray-100 px-6">
            <nav className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Detected Categories */}
                  <div className="p-6 border border-gray-200 rounded-xl">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Detected Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {scan.categoriesDetected.map((cat, i) => (
                        <div key={i} className="px-3 py-2 bg-gray-100 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">{cat.category}</p>
                          <p className="text-xs text-gray-500">{cat.confidence}% confidence</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Breakdown */}
                  <div className="p-6 border border-gray-200 rounded-xl">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Risk Breakdown</h3>
                    <div className="space-y-3">
                      {Object.entries(scan.riskBreakdown).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm capitalize text-gray-700">{key}</span>
                            <span className="text-sm font-semibold text-gray-900">{value}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decision Recommendation */}
                <div className={`p-6 border-2 rounded-xl ${
                  decision.color === 'emerald' ? 'border-emerald-200 bg-emerald-50' :
                  decision.color === 'amber' ? 'border-amber-200 bg-amber-50' :
                  'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 ${
                        decision.color === 'emerald' ? 'text-emerald-900' :
                        decision.color === 'amber' ? 'text-amber-900' :
                        'text-red-900'
                      }`}>
                        Decision: {decision.label}
                      </h3>
                      <p className={`text-sm ${
                        decision.color === 'emerald' ? 'text-emerald-700' :
                        decision.color === 'amber' ? 'text-amber-700' :
                        'text-red-700'
                      }`}>
                        {decision.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Top Findings */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Top Findings</h3>
                  <div className="space-y-3">
                    {scan.findings.slice(0, 5).map((finding) => (
                      <div
                        key={finding.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => setSelectedFinding(finding)}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{finding.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{finding.whySnippet}</p>
                        </div>
                        <SeverityBadge severity={finding.severity} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Findings Tab */}
            {activeTab === 'findings' && (
              <div className="flex gap-6">
                {/* Left Filters */}
                <div className="w-64 flex-shrink-0 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Severity</h4>
                    <div className="space-y-2">
                      {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
                        <button
                          key={sev}
                          onClick={() => setFindingSeverityFilter(sev)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            findingSeverityFilter === sev
                              ? 'bg-emerald-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Surface</h4>
                    <div className="space-y-2">
                      {['All', 'Website', 'App', 'UGC', 'Checkout'].map((surf) => (
                        <button
                          key={surf}
                          onClick={() => setFindingSurfaceFilter(surf)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            findingSurfaceFilter === surf
                              ? 'bg-emerald-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {surf}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Policy Tags</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                      <button
                        onClick={() => setFindingPolicyFilter('All')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          findingPolicyFilter === 'All'
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        All
                      </button>
                      {allPolicyTags.slice(0, 10).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setFindingPolicyFilter(tag)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            findingPolicyFilter === tag
                              ? 'bg-emerald-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Findings List */}
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Showing {filteredFindings.length} of {scan.findings.length} findings
                  </p>
                  {filteredFindings.map((finding) => (
                    <div
                      key={finding.id}
                      className="p-4 border border-gray-200 rounded-xl hover:border-emerald-300 cursor-pointer transition-all"
                      onClick={() => setSelectedFinding(finding)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 flex-1">{finding.title}</h4>
                        <SeverityBadge severity={finding.severity} />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{finding.whySnippet}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Chip label={finding.surface} />
                        <Chip label={`${finding.confidence}% confidence`} />
                        {finding.policyTags.slice(0, 2).map((tag, i) => (
                          <Chip key={i} label={tag} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Tab */}
            {activeTab === 'evidence' && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {scan.evidence.map((evidence) => (
                  <div
                    key={evidence.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 cursor-pointer transition-all"
                    onClick={() => setSelectedEvidence(evidence)}
                  >
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Chip label={evidence.type} />
                        <span className="text-xs text-gray-500">{evidence.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">{evidence.snippet}</p>
                      <p className="text-xs text-gray-500 truncate">{evidence.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coverage Tab */}
            {activeTab === 'coverage' && (
              <div className="space-y-6">
                <div className="grid grid-cols-5 gap-4">
                  <div className="p-4 border border-gray-200 rounded-xl text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">{scan.coverageStats.pagesCrawled}</p>
                    <p className="text-xs font-medium text-gray-500">Pages Crawled</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">{scan.coverageStats.productsParsed}</p>
                    <p className="text-xs font-medium text-gray-500">Products Parsed</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">{scan.coverageStats.mediaItems}</p>
                    <p className="text-xs font-medium text-gray-500">Media Items</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">{scan.coverageStats.ugcSamples}</p>
                    <p className="text-xs font-medium text-gray-500">UGC Samples</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">{scan.coverageStats.formsDetected}</p>
                    <p className="text-xs font-medium text-gray-500">Forms Detected</p>
                  </div>
                </div>

                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Crawled URLs</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
                    {scan.coverageStats.urlsCrawled.map((url, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                        <span className="text-gray-400">•</span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Raw JSON Tab */}
            {activeTab === 'raw' && (
              <JsonViewerWrapper data={rawReport} title={`Raw Scan Report - ${scan.scanId}`} />
            )}
          </div>
        </div>
      </main>

      {/* Finding Drawer */}
      <RightDrawer
        isOpen={selectedFinding !== null}
        onClose={() => setSelectedFinding(null)}
        title="Finding Details"
        width="lg"
      >
        {selectedFinding && (
          <div className="space-y-6">
            <div>
              <SeverityBadge severity={selectedFinding.severity} className="mb-3" />
              <h2 className="text-xl font-bold text-gray-900">{selectedFinding.title}</h2>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-700">{selectedFinding.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Why this matters</h3>
              <p className="text-sm text-gray-700">{selectedFinding.whySnippet}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Policy Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedFinding.policyTags.map((tag, i) => (
                  <Chip key={i} label={tag} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Confidence</span>
                  <span className="text-sm font-medium">{selectedFinding.confidence}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Surface</span>
                  <span className="text-sm font-medium capitalize">{selectedFinding.surface}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Suggested Action</h3>
              <p className="text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                {selectedFinding.suggestedAction}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Source URLs</h3>
              <div className="space-y-2">
                {selectedFinding.sourceUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {url}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </RightDrawer>

      {/* Evidence Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvidence(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Chip label={selectedEvidence.type} />
                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <ImageIcon className="w-24 h-24 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">URL</h4>
                  <a
                    href={selectedEvidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    {selectedEvidence.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Snippet</h4>
                  <pre className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {selectedEvidence.snippet}
                  </pre>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Timestamp</h4>
                  <p className="text-sm text-gray-700">{selectedEvidence.timestamp.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
