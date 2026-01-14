import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, X, ExternalLink, ChevronRight } from 'lucide-react';
import { scanJobsStore, type ScanJob } from '../../lib/scans/scanJobsStore';

const MAX_VISIBLE_IN_POPOVER = 5;

export function FloatingScansIndicator() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ScanJob[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [lastGlobalUpdate, setLastGlobalUpdate] = useState<Date | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const prevJobsRef = useRef<Map<string, string>>(new Map());

  // Subscribe to store changes
  useEffect(() => {
    const updateJobs = () => {
      const currentJobs = scanJobsStore.listJobs();
      setJobs(currentJobs);
      
      // Update global last update timestamp
      if (currentJobs.length > 0) {
        const mostRecent = currentJobs.reduce((latest, job) => {
          const jobTime = job.last_update ? new Date(job.last_update).getTime() : 0;
          return jobTime > latest ? jobTime : latest;
        }, 0);
        
        if (mostRecent > 0) {
          setLastGlobalUpdate(new Date(mostRecent));
        }
      }
    };
    
    updateJobs();
    const unsubscribe = scanJobsStore.subscribe(updateJobs);
    
    return unsubscribe;
  }, []);

  // Monitor for updates and trigger pulse
  useEffect(() => {
    const interval = setInterval(() => {
      let hadUpdate = false;

      jobs.forEach((job) => {
        const prevUpdate = prevJobsRef.current.get(job.session_id);
        const currentUpdate = job.last_update;

        if (currentUpdate && prevUpdate !== currentUpdate) {
          hadUpdate = true;
          prevJobsRef.current.set(job.session_id, currentUpdate);
        } else if (currentUpdate && !prevUpdate) {
          prevJobsRef.current.set(job.session_id, currentUpdate);
        }
      });

      if (hadUpdate) {
        // Trigger pulse animation
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 400);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobs]);

  // Close popover when clicking outside
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Don't render if no active jobs
  if (jobs.length === 0) {
    return null;
  }

  const formatTimeAgo = (timestamp: Date): string => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const isStale = lastGlobalUpdate ? (Date.now() - lastGlobalUpdate.getTime() > 20000) : false;
  const timeSinceUpdate = lastGlobalUpdate ? formatTimeAgo(lastGlobalUpdate) : null;

  const extractDomain = (url: string): string => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const mapStatus = (status?: string): { label: string; color: string } => {
    if (!status) return { label: 'Queued', color: 'bg-gray-100 text-gray-700' };
    
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('complete') || lowerStatus.includes('success')) {
      return { label: 'Finalizing', color: 'bg-emerald-100 text-emerald-700' };
    }
    if (lowerStatus.includes('running') || lowerStatus.includes('progress')) {
      return { label: 'Running', color: 'bg-blue-100 text-blue-700' };
    }
    
    return { label: 'Running', color: 'bg-blue-100 text-blue-700' };
  };

  const visibleJobs = jobs.slice(0, MAX_VISIBLE_IN_POPOVER);
  const hiddenCount = Math.max(0, jobs.length - MAX_VISIBLE_IN_POPOVER);

  return (
    <div
      ref={popoverRef}
      className="fixed bottom-6 right-6 z-50"
      role="status"
      aria-label="Scans running indicator"
    >
      {/* Collapsed Pill */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative bg-white rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
          style={{ minWidth: '200px' }}
        >
          {/* Pulse Ring Effect */}
          {isPulsing && (
            <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-ping" />
          )}

          {/* Content */}
          <div className="relative px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Pulsing Dot */}
              <div className="relative flex-shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${isStale ? 'bg-gray-400' : 'bg-blue-500'}`} />
                {!isStale && (
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse opacity-50" />
                )}
              </div>

              {/* Spinner */}
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />

              {/* Text */}
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-semibold text-gray-900">
                  Scanning ({jobs.length})
                </div>
                <div className={`text-xs ${isStale ? 'text-gray-500' : 'text-gray-600'}`}>
                  {isStale ? 'Still working...' : timeSinceUpdate ? `Updated ${timeSinceUpdate}` : 'Working...'}
                </div>
              </div>

              {/* Expand Indicator */}
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors" />
            </div>

            {/* Indeterminate micro-bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                style={{
                  width: '40%',
                  animation: 'shimmer-fast 2s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </button>
      )}

      {/* Expanded Popover */}
      {isExpanded && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200" style={{ width: '380px' }}>
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                Scanning {jobs.length} {jobs.length === 1 ? 'site' : 'sites'}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {isStale ? 'Still working...' : timeSinceUpdate ? `Updated ${timeSinceUpdate}` : 'Real-time updates'}
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
              aria-label="Collapse"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Job List */}
          <div className="max-h-80 overflow-y-auto">
            {visibleJobs.map((job) => {
              const domain = extractDomain(job.url);
              const status = mapStatus(job.last_status);
              const startedAgo = job.started_at ? formatTimeAgo(new Date(job.started_at)) : null;

              return (
                <div
                  key={job.session_id}
                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => {
                    navigate(`/scans/${job.session_id}`);
                    setIsExpanded(false);
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {domain}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color} whitespace-nowrap`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Started {startedAgo}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/scans/${job.session_id}`);
                        setIsExpanded(false);
                      }}
                      className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="View details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* View All Row */}
            {hiddenCount > 0 && (
              <button
                onClick={() => {
                  navigate('/scans');
                  setIsExpanded(false);
                }}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
              >
                <span>+{hiddenCount} more • View all scans</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Click any scan to view details
            </p>
          </div>
        </div>
      )}

      {/* Custom animation */}
      <style>{`
        @keyframes shimmer-fast {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(350%);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-spin,
          .animate-pulse,
          .animate-ping {
            animation: none;
          }
          [style*="animation: shimmer-fast"] {
            animation: none !important;
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
