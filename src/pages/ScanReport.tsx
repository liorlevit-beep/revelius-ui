import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Check, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { JsonViewerWrapper } from '../components/JsonViewer';
import { ScanReportView } from '../components/scans/ScanReportView';
import { ScannerAPI } from '../api';
import {
  pickStatus,
  pickProgress,
  pickMessage,
  pickLastUpdated,
  pickUrl,
  pickRegion,
  isStatusComplete,
  isStatusFailed,
  isStatusInProgress,
} from '../utils/scanHelpers';
import { resolveRegion } from '../utils/region';

export function ScanReport() {
  const navigate = useNavigate();
  const { id: sessionId } = useParams<{ id: string }>();
  const [statusData, setStatusData] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'raw'>('report');
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      pollCountRef.current = 0;
    }
  }, []);

  // Fetch report (defined early with useCallback)
  const fetchReport = useCallback(async () => {
    if (!sessionId) {
      console.log('[fetchReport] No sessionId, skipping');
      return;
    }

    console.log('[fetchReport] Starting report fetch for session:', sessionId);
    try {
      setLoadingReport(true);
      setReportError(null);
      const response = await ScannerAPI.getJsonReport(sessionId);
      console.log('[fetchReport] Report fetched successfully:', response);
      setReportData(response);
    } catch (err: any) {
      console.error('[fetchReport] Failed to fetch report:', err);
      setReportError(err.message || 'Failed to load report');
    } finally {
      setLoadingReport(false);
    }
  }, [sessionId]);

  // Start polling for status updates
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return;
    
    pollCountRef.current = 0;
    pollingIntervalRef.current = setInterval(async () => {
      if (!sessionId) {
        stopPolling();
        return;
      }

      pollCountRef.current += 1;
      
      // Stop after 30 polls (60 seconds with 2s interval)
      if (pollCountRef.current > 30) {
        stopPolling();
        return;
      }

      try {
        const response = await ScannerAPI.getSessionStatus(sessionId);
        setStatusData(response);
        
        const status = pickStatus(response);
        
        // Stop polling if completed or failed
        if (isStatusComplete(status) || isStatusFailed(status)) {
          stopPolling();
          
          // Auto-fetch report if completed and on report tab
          if (isStatusComplete(status) && activeTab === 'report' && !reportData) {
            fetchReport();
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Don't stop polling on single error, but log it
      }
    }, 2000);
  }, [sessionId, stopPolling, fetchReport, activeTab, reportData]);

  // Fetch status on mount and when sessionId changes
  useEffect(() => {
    if (!sessionId) return;

    async function fetchStatus() {
      try {
        setLoadingStatus(true);
        setStatusError(null);
        const response = await ScannerAPI.getSessionStatus(sessionId);
        console.log('[fetchStatus] Raw API response:', response);
        console.log('[fetchStatus] Response data field:', response?.data);
        setStatusData(response);
        
        const status = pickStatus(response);
        console.log('[fetchStatus] Picked status:', status);
        
        // Start polling if in progress
        if (isStatusInProgress(status)) {
          startPolling();
        } else {
          stopPolling();
        }
      } catch (err: any) {
        console.error('Failed to fetch session status:', err);
        setStatusError(err.message || 'Failed to load session status');
        stopPolling();
      } finally {
        setLoadingStatus(false);
      }
    }

    fetchStatus();

    // Cleanup on unmount or sessionId change
    return () => {
      stopPolling();
    };
  }, [sessionId, startPolling, stopPolling]);

  // Auto-fetch report when switching to Reports tab
  useEffect(() => {
    console.log('[Auto-fetch] Tab:', activeTab, 'Has reportData:', !!reportData, 'Loading:', loadingReport, 'SessionId:', sessionId);
    console.log('[Auto-fetch] statusData:', statusData);
    
    if (activeTab === 'report' && !reportData && !loadingReport && sessionId && statusData) {
      const status = pickStatus(statusData);
      console.log('[Auto-fetch] Current status:', status);
      console.log('[Auto-fetch] isStatusComplete:', isStatusComplete(status));
      console.log('[Auto-fetch] isStatusFailed:', isStatusFailed(status));
      
      // Only auto-fetch if scan is complete or failed (not in progress)
      if (isStatusComplete(status) || isStatusFailed(status)) {
        console.log('[Auto-fetch] Conditions met, triggering fetchReport');
        fetchReport();
      } else {
        console.log('[Auto-fetch] Status not ready for report fetch');
      }
    }
  }, [activeTab, reportData, loadingReport, sessionId, statusData, fetchReport]);

  const handleCopyJson = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // No sessionId
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-transparent">
        <main className="p-8">
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-6">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
            <p className="text-amber-900 dark:text-amber-300 font-semibold">No session selected</p>
            <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">Please select a scan session from the list.</p>
            <button
              onClick={() => navigate('/scans')}
              className="mt-4 px-4 py-2 bg-amber-600 dark:bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors"
            >
              Back to Scans
            </button>
          </div>
        </main>
      </div>
    );
  }

  const status = statusData ? pickStatus(statusData) : 'unknown';
  const progress = statusData ? pickProgress(statusData) : undefined;
  const message = statusData ? pickMessage(statusData) : undefined;
  const lastUpdated = statusData ? pickLastUpdated(statusData) : undefined;
  
  // Resolve region from status data
  const url = statusData ? pickUrl(statusData) : '';
  const apiRegion = statusData ? pickRegion(statusData) : undefined;
  const { region, isInferred } = resolveRegion(apiRegion, url);

  const tabs = [
    { id: 'report', label: 'Report' },
    { id: 'raw', label: 'Raw JSON' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <main className="p-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/scans')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Scans
        </button>

        {/* Header Card */}
        <div className="bg-white dark:bg-white/5 dark:border-white/10 rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Scanning Site URL */}
              {url && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Scanning Site</p>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors"
                  >
                    {url}
                  </a>
                </div>
              )}
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Session: {sessionId}</h2>
              {lastUpdated && (
                <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isStatusComplete(status)
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : isStatusFailed(status)
                    ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                    : isStatusInProgress(status)
                    ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400'
                }`}
              >
                {isStatusInProgress(status) && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                {status}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Region</p>
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400"
                title={isInferred ? 'Inferred from domain' : undefined}
              >
                {region}
                {isInferred && <span className="text-xs ml-1">*</span>}
              </span>
            </div>

            {progress !== undefined && (
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{Math.round(progress)}%</span>
                </div>
              </div>
            )}

            {message && (
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Message</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-white/5 dark:border-white/10 rounded-2xl border border-gray-100 shadow-sm">
          <div className="border-b border-gray-100 dark:border-white/10 px-6">
            <nav className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Report Tab */}
            {activeTab === 'report' && (
              <div className="space-y-6">
                {loadingReport && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading report...</p>
                  </div>
                )}

                {reportError && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">Failed to Load Report</h3>
                      <p className="text-red-700 dark:text-red-400 text-sm">{reportError}</p>
                      <button
                        onClick={fetchReport}
                        className="mt-3 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition-colors inline-flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                {reportData && !loadingReport && (
                  <ScanReportView 
                    reportData={reportData} 
                    sessionId={sessionId} 
                    onRefresh={fetchReport}
                  />
                )}

                {!reportData && !loadingReport && !reportError && (
                  <div>
                    {/* Check if scan is not completed yet */}
                    {isStatusInProgress(status) ? (
                      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-8 text-center">
                        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">Scan In Progress</h3>
                        <p className="text-blue-700 dark:text-blue-400 text-sm mb-4">
                          The report will be available once the scan is completed.
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 text-xs">
                          Auto-refreshing status every 2 seconds...
                        </p>
                      </div>
                    ) : isStatusFailed(status) ? (
                      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">Scan Failed</h3>
                        <p className="text-red-700 dark:text-red-400 text-sm mb-4">
                          The scan could not be completed. Report is not available.
                        </p>
                        <button
                          onClick={() => navigate('/scans')}
                          className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                        >
                          Back to Scans
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">Loading Report</h3>
                        <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch the scan report...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Raw JSON Tab */}
            {activeTab === 'raw' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">Raw Data</h3>
                  <div className="space-y-4">
                    {statusData && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status Data</h4>
                        <JsonViewerWrapper data={statusData} />
                      </div>
                    )}
                    {reportData && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Report Data</h4>
                        <JsonViewerWrapper data={reportData} />
                      </div>
                    )}
                    {!statusData && !reportData && (
                      <p className="text-gray-600 dark:text-gray-400 text-center py-12">No data available</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
