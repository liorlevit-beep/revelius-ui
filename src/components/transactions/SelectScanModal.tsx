import { useState, useEffect, useMemo } from 'react';
import { X, Search, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScannerAPI } from '../../api';
import {
  unwrapList,
  pickSessionId,
  pickUrl,
  pickStatus,
  pickCreated,
} from '../../utils/scanHelpers';

interface SelectScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SelectScanModal({ isOpen, onClose }: SelectScanModalProps) {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    async function fetchSessions() {
      try {
        setLoading(true);
        setError(null);
        const response = await ScannerAPI.getAllSessions();
        const sessionList = unwrapList(response);
        setSessions(sessionList);
      } catch (err: any) {
        console.error('Failed to fetch sessions:', err);
        setError(err.message || 'Failed to load scan sessions');
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [isOpen]);

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;

    const query = searchQuery.toLowerCase();
    return sessions.filter((session) => {
      const url = pickUrl(session)?.toLowerCase() || '';
      const sessionId = pickSessionId(session)?.toLowerCase() || '';
      const status = pickStatus(session)?.toLowerCase() || '';
      return url.includes(query) || sessionId.includes(query) || status.includes(query);
    });
  }, [sessions, searchQuery]);

  const handleGenerate = (sessionId: string) => {
    onClose();
    navigate(`/transactions/generate-from-scan/${sessionId}`);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Select Scan Session
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Choose a scan to generate transactions from
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search Bar */}
            {!loading && !error && sessions.length > 0 && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by URL, session ID, or status..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="max-h-[500px] overflow-y-auto">
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loading scans...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center max-w-md">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                    <p className="text-sm text-red-700 dark:text-red-400 font-medium mb-2">
                      Failed to load scans
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{error}</p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && sessions.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No scan sessions found
                    </p>
                  </div>
                </div>
              )}

              {/* Scans List */}
              {!loading && !error && filteredSessions.length > 0 && (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSessions.map((session) => {
                    const sessionId = pickSessionId(session) || '';
                    const url = pickUrl(session) || 'Unknown URL';
                    const status = pickStatus(session) || 'unknown';
                    const created = pickCreated(session);

                    // Extract domain from URL
                    let domain = url;
                    try {
                      const urlObj = new URL(url);
                      domain = urlObj.hostname;
                    } catch {
                      // Keep original if not a valid URL
                    }

                    return (
                      <div
                        key={sessionId}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Domain/URL */}
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {domain}
                            </p>
                            
                            {/* Session ID */}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono truncate">
                              {sessionId}
                            </p>

                            {/* Status & Date */}
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {/* Status Badge */}
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                status === 'completed' || status === 'complete'
                                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                  : status === 'active' || status === 'scanning'
                                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                                  : status === 'failed' || status === 'error'
                                  ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}>
                                {status}
                              </span>

                              {/* Created Date */}
                              {created && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(created).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Generate Button */}
                          <button
                            onClick={() => handleGenerate(sessionId)}
                            className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2 shadow-sm hover:shadow-md"
                          >
                            Generate
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No Results */}
              {!loading && !error && sessions.length > 0 && filteredSessions.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No scans match your search
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                    >
                      Clear search
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
