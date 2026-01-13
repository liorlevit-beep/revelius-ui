import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Header } from '../components/Header';
import { merchants } from '../demo/merchants';
import { ScanStore, type RawScanReport, type ScanIndexItem } from '../demo/scans';

type ScanStep = {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'complete';
};

export function ScanNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const merchantIdParam = searchParams.get('merchantId');

  const [merchantId, setMerchantId] = useState(merchantIdParam || '');
  const [url, setUrl] = useState('');
  const [profile, setProfile] = useState('Balanced');
  const [crawlDepth, setCrawlDepth] = useState(2);
  const [region, setRegion] = useState('US');
  const [isScanning, setIsScanning] = useState(false);
  const [steps, setSteps] = useState<ScanStep[]>([
    { id: 'discover', label: 'Discovering pages', status: 'pending' },
    { id: 'extract', label: 'Extracting products', status: 'pending' },
    { id: 'analyze', label: 'Analyzing media', status: 'pending' },
    { id: 'classify', label: 'Classifying risk', status: 'pending' },
    { id: 'report', label: 'Generating report', status: 'pending' },
  ]);

  const selectedMerchant = merchants.find((m) => m.id === merchantId);

  const validateUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return urlString.startsWith('http://') || urlString.startsWith('https://');
    } catch {
      return false;
    }
  };

  const runScan = async () => {
    if (!url || !validateUrl(url)) {
      alert('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsScanning(true);

    // Simulate scan progress
    const stepDurations = [1500, 2000, 1800, 2200, 1500]; // ms per step
    
    for (let i = 0; i < steps.length; i++) {
      // Mark current step as running
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === i ? { ...step, status: 'running' } : step
        )
      );

      // Wait for step duration
      await new Promise((resolve) => setTimeout(resolve, stepDurations[i]));

      // Mark current step as complete
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === i ? { ...step, status: 'complete' } : step
        )
      );
    }

    // Generate mock scan results
    const newScanId = `S-${Date.now().toString().slice(-5)}`;
    const domain = new URL(url).hostname;
    const riskScore = Math.floor(Math.random() * 50) + 40;

    const scanItem: ScanIndexItem = {
      id: newScanId,
      merchantId: merchantId || undefined,
      merchantName: selectedMerchant?.name,
      domain,
      url,
      timestamp: new Date(),
      status: 'success',
      type: 'manual',
      pagesScanned: Math.floor(Math.random() * 300) + 50,
      riskScore,
      topTriggers: ['Content scan', 'Policy check', 'Product analysis'],
      category: selectedMerchant?.category || 'General',
    };

    const scanReport: RawScanReport = {
      scan_id: newScanId,
      merchant_id: merchantId || undefined,
      url,
      timestamp: new Date().toISOString(),
      status: 'success',
      type: 'manual',
      config: {
        profile,
        crawl_depth: crawlDepth,
        region,
      },
      overall_risk_score: riskScore,
      risk_explanation: `Scan completed successfully. Risk score: ${riskScore}/100. No critical issues detected.`,
      categories_detected: [
        { category: 'E-commerce', confidence: 95 },
      ],
      risk_breakdown: {
        content: Math.floor(Math.random() * 30) + 10,
        product: Math.floor(Math.random() * 30) + 15,
        licensing: Math.floor(Math.random() * 20) + 5,
        ugc: Math.floor(Math.random() * 25) + 5,
      },
      findings: [
        {
          id: `${newScanId}-F001`,
          title: 'Sample finding from scan',
          description: 'This is a demo finding generated from the new scan.',
          severity: riskScore > 70 ? 'high' : riskScore > 50 ? 'medium' : 'low',
          confidence: 85,
          surface: 'website',
          policy_tags: ['Content Policy'],
          why_snippet: 'Detected during automated scan',
          evidence_ids: [],
          source_urls: [url],
          suggested_action: 'Review and verify compliance',
          timestamp: new Date().toISOString(),
        },
      ],
      evidence: [],
      coverage: {
        pages_crawled: scanItem.pagesScanned,
        products_parsed: Math.floor(scanItem.pagesScanned * 0.4),
        media_items: Math.floor(scanItem.pagesScanned * 2.5),
        ugc_samples: Math.floor(scanItem.pagesScanned * 1.8),
        forms_detected: Math.floor(Math.random() * 10) + 2,
        urls_crawled: [url],
      },
    };

    // Add to store
    ScanStore.addScan(scanItem, scanReport);

    // Navigate to results
    setTimeout(() => {
      navigate(`/scans/${newScanId}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="New Scan" timeRange="7" onTimeRangeChange={() => {}} />

      <main className="p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="max-w-3xl mx-auto">
          {!isScanning ? (
            // Scan Configuration Form
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Configure New Scan</h2>

              <div className="space-y-6">
                {/* Merchant Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Merchant (Optional)
                  </label>
                  <select
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="">No merchant (ad-hoc scan)</option>
                    {merchants.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} - {m.domain}
                      </option>
                    ))}
                  </select>
                  {selectedMerchant && (
                    <p className="mt-2 text-xs text-gray-500">
                      Selected: {selectedMerchant.name} ({selectedMerchant.domain})
                    </p>
                  )}
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    URL <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                {/* Scan Profile */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Scan Profile
                  </label>
                  <select
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Balanced">Balanced (default)</option>
                    <option value="Strict">Strict</option>
                    <option value="High-risk tolerant">High-risk tolerant</option>
                  </select>
                </div>

                {/* Crawl Depth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Crawl Depth
                  </label>
                  <select
                    value={crawlDepth}
                    onChange={(e) => setCrawlDepth(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value={1}>1 level</option>
                    <option value={2}>2 levels</option>
                    <option value={3}>3 levels</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="US">US</option>
                    <option value="EU">EU</option>
                    <option value="UK">UK</option>
                    <option value="IL">IL</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={runScan}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Run Scan
                  </button>
                  <button
                    onClick={() => navigate('/scans')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Scanning Progress
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Scanning in Progress</h2>
              <p className="text-sm text-gray-600 mb-8">{url}</p>

              <div className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      step.status === 'running'
                        ? 'bg-emerald-50 border-emerald-200'
                        : step.status === 'complete'
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {step.status === 'complete' ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : step.status === 'running' ? (
                        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        step.status === 'running'
                          ? 'text-emerald-700'
                          : step.status === 'complete'
                          ? 'text-gray-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

