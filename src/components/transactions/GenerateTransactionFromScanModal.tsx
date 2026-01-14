import { useState, useEffect } from 'react';
import { X, Search, Loader2, AlertCircle, Check } from 'lucide-react';
import { ScannerAPI } from '../../api';
import { unwrapList, pickSessionId, pickUrl, pickStatus, pickCreated } from '../../utils/scanHelpers';

interface GenerateTransactionFromScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSessionSelected: (sessionId: string, url: string) => void | Promise<void>;
}

interface ScanSession {
  session_id: string;
  url: string;
  status: string;
  timestamp: string;
}

export function GenerateTransactionFromScanModal({
  open,
  onOpenChange,
  onSessionSelected,
}: GenerateTransactionFromScanModalProps) {
  const [sessions, setSessions] = useState<ScanSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSessions();
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  async function fetchSessions() {
    setLoading(true);
    setError(null);
    try {
      const response = await ScannerAPI.getAllSessions();
      const sessionList = unwrapList(response);
      
      const parsedSessions = sessionList.map((session: any) => ({
        session_id: pickSessionId(session),
        url: pickUrl(session),
        status: pickStatus(session),
        timestamp: pickCreated(session),
      }));

      setSessions(parsedSessions);
    } catch (err: any) {
      console.error('Failed to fetch sessions:', err);
      setError(err.message || 'Failed to load scan sessions');
    } finally {
      setLoading(false);
    }
  }

  const filteredSessions = sessions.filter((session) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      session.session_id.toLowerCase().includes(query) ||
      session.url.toLowerCase().includes(query)
    );
  });

  const handleSelectSession = async (session: ScanSession) => {
    setSelectedSessionId(session.session_id);
    setGenerating(true);
    
    try {
      await onSessionSelected(session.session_id, session.url);
      onOpenChange(false);
      // Reset state
      setSearchQuery('');
      setSelectedSessionId(null);
    } catch (error) {
      console.error('Failed to generate transaction:', error);
      // Keep modal open on error
    } finally {
      setGenerating(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-8"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generate Transaction from Scan</h2>
            <p className="text-sm text-gray-500 mt-1">Select a scan session to create a new transaction</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by session ID or domain…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {generating && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">Generating transaction...</p>
                <p className="text-xs text-gray-500 mt-1">Analyzing scan report and building cart</p>
              </div>
            </div>
          )}
          
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Failed to Load Sessions</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={fetchSessions}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'Try adjusting your search criteria' : 'No scan sessions available'}
              </p>
            </div>
          )}

          {!loading && !error && filteredSessions.length > 0 && (
            <div className="space-y-2">
              {filteredSessions.map((session) => (
                <button
                  key={session.session_id}
                  onClick={() => handleSelectSession(session)}
                  className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-emerald-500 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono font-semibold text-gray-900 truncate">
                          {session.session_id}
                        </span>
                        {selectedSessionId === session.session_id && (
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-2">{session.url}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {session.status && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                              session.status === 'Scan Complete' || session.status === 'completed' || session.status === 'success'
                                ? 'bg-emerald-100 text-emerald-700'
                                : session.status === 'Scan Error' || session.status === 'failed' || session.status === 'error'
                                ? 'bg-red-100 text-red-700'
                                : session.status === 'In Progress' || session.status === 'pending' || session.status === 'running'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {session.status}
                          </span>
                        )}
                        {session.timestamp && session.timestamp !== '-' && (
                          <span>{new Date(session.timestamp).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'} available
          </p>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
