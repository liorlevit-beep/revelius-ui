import { useState, useEffect, useRef } from 'react';
import { Loader2, ChevronDown, ChevronUp, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scanJobsStore, type ScanJob } from '../../lib/scans/scanJobsStore';
import { useScanPolling } from '../../hooks/useScanPolling';
import { ScanToast, type ToastMessage } from './ScanToast';

// Component for individual job polling
function ScanJobPoller({ 
  job, 
  onStatusChange,
  onComplete,
  onFailed,
}: { 
  job: ScanJob;
  onStatusChange: (sessionId: string, oldStatus: string | undefined, newStatus: string) => void;
  onComplete: (sessionId: string) => void;
  onFailed: (sessionId: string, error?: string) => void;
}) {
  useScanPolling({
    sessionId: job.session_id,
    enabled: true,
    onStatusChange: (oldStatus, newStatus) => onStatusChange(job.session_id, oldStatus, newStatus),
    onComplete: () => onComplete(job.session_id),
    onFailed: (sessionId, error) => onFailed(sessionId, error),
  });

  return null;
}

export function ScanActivityIndicator() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ScanJob[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [justUpdated, setJustUpdated] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [warnings, setWarnings] = useState<Map<string, string>>(new Map());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Subscribe to store changes
  useEffect(() => {
    const updateJobs = () => {
      setJobs(scanJobsStore.listJobs());
    };
    
    updateJobs();
    const unsubscribe = scanJobsStore.subscribe(updateJobs);
    
    return unsubscribe;
  }, []);

  // Monitor for "still working" warnings
  useEffect(() => {
    const warningInterval = setInterval(() => {
      const now = Date.now();
      const newWarnings = new Map<string, string>();

      jobs.forEach((job) => {
        if (!job.last_update) return;

        const timeSinceUpdate = now - new Date(job.last_update).getTime();
        
        if (timeSinceUpdate > 75000) { // 75 seconds
          newWarnings.set(job.session_id, 'taking longer than usual');
        } else if (timeSinceUpdate > 20000) { // 20 seconds
          newWarnings.set(job.session_id, 'no update yet, still working');
        }
      });

      setWarnings(newWarnings);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(warningInterval);
  }, [jobs]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleStatusChange = (sessionId: string, oldStatus: string | undefined, newStatus: string) => {
    // Show pulse on status change
    setJustUpdated(prev => new Set(prev).add(sessionId));
    setTimeout(() => {
      setJustUpdated(prev => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }, 2000);

    // Notify on interesting status changes
    if (oldStatus === 'pending' && newStatus === 'running') {
      addToast({
        type: 'info',
        title: 'Scan Started',
        message: `Processing ${scanJobsStore.getJob(sessionId)?.url}`,
        duration: 4000,
      });
    }
  };

  const handleComplete = (sessionId: string) => {
    const job = scanJobsStore.getJob(sessionId);
    
    addToast({
      type: 'success',
      title: 'Scan Completed',
      message: job?.url || `Session ${sessionId}`,
      action: {
        label: 'View Results',
        onClick: () => navigate(`/scans/${sessionId}`),
      },
      duration: 8000,
    });
  };

  const handleFailed = (sessionId: string, error?: string) => {
    const job = scanJobsStore.getJob(sessionId);
    
    addToast({
      type: 'error',
      title: 'Scan Failed',
      message: error || job?.url || `Session ${sessionId}`,
      action: {
        label: 'Try Again',
        onClick: () => {
          // Could open the NewScanModal with prefilled URL
          navigate('/scans');
        },
      },
      duration: 0, // Persistent until dismissed
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  // Don't render if no active jobs
  if (jobs.length === 0) {
    return null;
  }

  const formatTimeAgo = (timestamp: string): string => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <>
      {/* Job Pollers - invisible components that manage polling */}
      {jobs.map(job => (
        <ScanJobPoller
          key={job.session_id}
          job={job}
          onStatusChange={handleStatusChange}
          onComplete={handleComplete}
          onFailed={handleFailed}
        />
      ))}

      {/* Toast Notifications */}
      <ScanToast toasts={toasts} onDismiss={dismissToast} />

      <div className="relative" ref={dropdownRef}>
        {/* Activity Pill */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-sm font-medium text-blue-700 hover:bg-blue-100 transition-all shadow-sm"
        >
          {/* Pulsing Dot */}
          <div className="relative">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <div className="absolute inset-0 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75" />
          </div>

          {/* Spinner */}
          <Loader2 className="w-4 h-4 animate-spin" />

          {/* Text */}
          <span>
            Scanning {jobs.length} {jobs.length === 1 ? 'site' : 'sites'}
          </span>

          {/* Chevron */}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

      {/* Expanded Drawer */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Active Scans</h3>
              <span className="text-xs text-gray-600">{jobs.length} in progress</span>
            </div>
          </div>

          {/* Job List */}
          <div className="max-h-96 overflow-y-auto">
            {jobs.map((job) => {
              const hasJustUpdated = justUpdated.has(job.session_id);
              const timeSinceUpdate = job.last_update ? formatTimeAgo(job.last_update) : null;
              const warning = warnings.get(job.session_id);

              return (
                <div
                  key={job.session_id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-all ${
                    hasJustUpdated ? 'bg-emerald-50' : ''
                  }`}
                >
                  {/* URL and Session */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {job.url}
                      </p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {job.session_id}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate(`/scans/${job.session_id}`);
                        setIsExpanded(false);
                      }}
                      className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Indeterminate Progress Bar */}
                  <div className="mb-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500 animate-shimmer" 
                         style={{ 
                           width: '50%',
                           animation: 'shimmer 2s infinite linear',
                         }} 
                    />
                  </div>

                  {/* Status and Stats */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status */}
                      {job.last_status && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
                          {job.last_status}
                        </span>
                      )}

                      {/* Stats if available */}
                      {(job.pages_crawled || job.products_parsed || job.media_items) && (
                        <span className="text-gray-600">
                          {job.pages_crawled && `${job.pages_crawled} pages`}
                          {job.products_parsed && ` • ${job.products_parsed} products`}
                          {job.media_items && ` • ${job.media_items} media`}
                        </span>
                      )}

                      {/* Working indicator if no stats */}
                      {!job.last_status && !job.pages_crawled && (
                        <span className="text-gray-500 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Working…
                        </span>
                      )}
                    </div>

                    {/* Heartbeat - Last Update */}
                    {timeSinceUpdate && (
                      <div className={`flex items-center gap-1 ${hasJustUpdated ? 'text-emerald-600' : 'text-gray-500'}`}>
                        <Clock className="w-3 h-3" />
                        <span>{timeSinceUpdate}</span>
                      </div>
                    )}
                  </div>

                  {/* Warning Messages */}
                  {warning && (
                    <div className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg ${
                      warning === 'taking longer than usual' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {warning === 'taking longer than usual' && <AlertTriangle className="w-3 h-3" />}
                      {warning === 'no update yet, still working' && <Loader2 className="w-3 h-3 animate-spin" />}
                      <span className="capitalize">{warning}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Scans will complete automatically. You can close this or navigate away.
            </p>
          </div>
        </div>
        )}

        {/* Custom shimmer animation */}
        <style>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(300%);
            }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
          }
        `}</style>
      </div>
    </>
  );
}
