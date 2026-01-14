import { useState, useEffect, useMemo } from 'react';
import { X, Search, Loader2, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ScannerAPI } from '../../api';
import { setEvidenceSessionId } from '../../lib/evidenceBinding';

interface ScanSession {
  session_id: string;
  root_website_url?: string;
  status?: string;
  timestamp?: number;
  created_at?: string;
  [key: string]: any;
}

interface AttachScanSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  txnId: string;
  onAttached: (sessionId: string) => void;
}

export function AttachScanSessionModal({ open, onOpenChange, txnId, onAttached }: AttachScanSessionModalProps) {
  const [sessions, setSessions] = useState<ScanSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch sessions when modal opens
  useEffect(() => {
    if (open) {
      fetchSessions();
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ScannerAPI.getAllSessions();
      console.log('[AttachScanSessionModal] Sessions response:', response);
      
      // Extract sessions from response
      const data = response?.data ?? response;
      let sessionsList: ScanSession[] = [];
      
      if (Array.isArray(data)) {
        sessionsList = data;
      } else if (data && typeof data === 'object' && 'sessions' in data) {
        sessionsList = (data as any).sessions;
      } else if (data && typeof data === 'object') {
        // If it's an object with session IDs as keys, convert to array
        sessionsList = Object.entries(data).map(([key, value]: [string, any]) => ({
          session_id: key,
          ...value,
        }));
      }
      
      console.log('[AttachScanSessionModal] Parsed sessions:', sessionsList);
      setSessions(sessionsList);
    } catch (err: any) {
      console.error('[AttachScanSessionModal] Failed to fetch sessions:', err);
      setError(err.message || 'Failed to load scan sessions');
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions based on search query
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    
    const query = searchQuery.toLowerCase();
    return sessions.filter(session => 
      session.session_id?.toLowerCase().includes(query) ||
      session.root_website_url?.toLowerCase().includes(query)
    );
  }, [sessions, searchQuery]);

  // Handle session selection
  const handleSelectSession = (sessionId: string) => {
    setEvidenceSessionId(txnId, sessionId);
    onAttached(sessionId);
    onOpenChange(false);
  };

  // Get status icon
  const getStatusIcon = (status?: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'completed':
      case 'complete':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
      case 'processing':
      case 'in_progress':
        return <Clock className="w-4 h-4 text-amber-600 animate-pulse" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp?: number, created_at?: string) => {
    if (timestamp) {
      return new Date(timestamp * 1000).toLocaleString();
    }
    if (created_at) {
      return new Date(created_at).toLocaleString();
    }
    return 'Unknown';
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Attach Scan Session</h2>
              <p className="text-sm text-gray-600 mt-1">
                Select a scan session to attach as evidence for transaction {txnId}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by session ID or website URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
              <p className="text-sm text-gray-600">Loading scan sessions...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Sessions</h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchSessions}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredSessions.length === 0 && sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No scan sessions found</h3>
              <p className="text-sm text-gray-600 max-w-md">
                No scan sessions are available. Create a new scan from the Scans page to get started.
              </p>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredSessions.length === 0 && sessions.length > 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching sessions</h3>
              <p className="text-sm text-gray-600">Try adjusting your search query</p>
            </div>
          )}

          {/* Sessions List */}
          {!loading && !error && filteredSessions.length > 0 && (
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <button
                  key={session.session_id}
                  onClick={() => handleSelectSession(session.session_id)}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 group-hover:bg-emerald-100 rounded-lg flex items-center justify-center transition-colors">
                      <FileText className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {session.root_website_url || 'Unknown URL'}
                          </p>
                          <p className="text-xs font-mono text-gray-500 truncate">
                            {session.session_id}
                          </p>
                        </div>
                        {session.status && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 group-hover:bg-white rounded-lg transition-colors">
                            {getStatusIcon(session.status)}
                            <span className="text-xs font-medium text-gray-700 capitalize">
                              {session.status}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTimestamp(session.timestamp, session.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <p className="text-sm text-gray-600">
            {!loading && !error && (
              <>
                Showing {filteredSessions.length} of {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
              </>
            )}
          </p>
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
