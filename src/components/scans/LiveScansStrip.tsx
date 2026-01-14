import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Activity, Plus, ChevronRight } from 'lucide-react';
import { scanJobsStore, type ScanJob } from '../../lib/scans/scanJobsStore';

const MAX_VISIBLE_ROWS = 5;

interface LiveScansStripProps {
  onNewScan?: () => void;
  glassTheme?: boolean;
}

export function LiveScansStrip({ onNewScan, glassTheme = false }: LiveScansStripProps) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ScanJob[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [pulsingJobs, setPulsingJobs] = useState<Set<string>>(new Set());

  // Subscribe to store changes
  useEffect(() => {
    const updateJobs = () => {
      setJobs(scanJobsStore.listJobs());
    };
    
    updateJobs();
    const unsubscribe = scanJobsStore.subscribe(updateJobs);
    
    return unsubscribe;
  }, []);

  // Monitor for updates and trigger heartbeat pulse
  useEffect(() => {
    const prevUpdates = new Map<string, string>();

    const interval = setInterval(() => {
      jobs.forEach((job) => {
        const prevUpdate = prevUpdates.get(job.session_id);
        const currentUpdate = job.last_update;

        if (prevUpdate && currentUpdate && prevUpdate !== currentUpdate) {
          // Update detected - trigger pulse
          setPulsingJobs(prev => new Set(prev).add(job.session_id));
          setTimeout(() => {
            setPulsingJobs(prev => {
              const next = new Set(prev);
              next.delete(job.session_id);
              return next;
            });
          }, 400);
        }

        if (currentUpdate) {
          prevUpdates.set(job.session_id, currentUpdate);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [jobs]);

  const formatTimeAgo = (timestamp: string): string => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
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
    if (lowerStatus.includes('pending') || lowerStatus.includes('queued')) {
      return { label: 'Queued', color: 'bg-gray-100 text-gray-700' };
    }
    
    // Default to Running for unknown statuses
    return { label: 'Running', color: 'bg-blue-100 text-blue-700' };
  };

  const extractDomain = (url: string): { domain: string; path: string } => {
    try {
      const parsed = new URL(url);
      const domain = parsed.hostname.replace('www.', '');
      const path = parsed.pathname !== '/' ? parsed.pathname : '';
      return { domain, path };
    } catch {
      return { domain: url, path: '' };
    }
  };

  const isStale = (lastUpdate?: string): boolean => {
    if (!lastUpdate) return false;
    const seconds = Math.floor((Date.now() - new Date(lastUpdate).getTime()) / 1000);
    return seconds > 20;
  };

  if (jobs.length === 0) {
    // Empty state
    if (glassTheme) {
      return (
        <div className="backdrop-blur-xl bg-white/[0.04] rounded-2xl border p-8 mb-6" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
              <Activity className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-silver-mist)' }}>No scans running right now</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--color-silver-mist-dim)' }}>
              Start a scan to see real-time evidence capture in action
            </p>
            {onNewScan && (
              <button
                onClick={onNewScan}
                className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-semibold hover:bg-emerald-500/30 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Start a Scan
              </button>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8 mb-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No scans running right now</h3>
          <p className="text-sm text-gray-600 mb-4">
            Start a scan to see real-time evidence capture in action
          </p>
          {onNewScan && (
            <button
              onClick={onNewScan}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Start a Scan
            </button>
          )}
        </div>
      </div>
    );
  }

  const visibleJobs = showAll ? jobs : jobs.slice(0, MAX_VISIBLE_ROWS);
  const hiddenCount = Math.max(0, jobs.length - MAX_VISIBLE_ROWS);

  if (glassTheme) {
    return (
      <div className="backdrop-blur-xl bg-white/[0.04] rounded-2xl border shadow-sm mb-6 overflow-hidden" style={{ borderColor: 'var(--glass-border)' }}>
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border-b" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--color-silver-mist)' }}>
                <div className="relative">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <div className="absolute inset-0 w-5 h-5">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
                  </div>
                </div>
                Live Scans
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-semibold">
                  {jobs.length}
                </span>
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-silver-mist-dim)' }}>Real-time evidence capture in progress</p>
            </div>
            {onNewScan && (
              <button
                onClick={onNewScan}
                className="px-3 py-1.5 backdrop-blur-md bg-white/[0.05] border text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 hover:bg-white/[0.08]"
                style={{ borderColor: 'var(--glass-border)', color: 'var(--color-silver-mist)' }}
              >
                <Plus className="w-3.5 h-3.5" />
                New Scan
              </button>
            )}
          </div>
        </div>

        {/* Scan Rows */}
        <div className="divide-y" style={{ borderColor: 'var(--glass-border)' }}>
          {visibleJobs.map((job) => {
            const { domain, path } = extractDomain(job.url);
            const status = mapStatus(job.last_status);
            const startedAgo = job.started_at ? formatTimeAgo(job.started_at) : null;
            const lastUpdateAgo = job.last_update ? formatTimeAgo(job.last_update) : null;
            const isPulsing = pulsingJobs.has(job.session_id);
            const stale = isStale(job.last_update);

            return (
              <div
                key={job.session_id}
                onClick={() => navigate(`/scans/${job.session_id}`)}
                className="px-6 py-4 transition-colors cursor-pointer relative group"
                style={{
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          status.label === 'Running' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          status.label === 'Finalizing' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold truncate" style={{ color: 'var(--color-silver-mist)' }}>
                            {domain}
                          </span>
                          {path && (
                            <span className="text-xs truncate" style={{ color: 'var(--color-silver-mist-dim)' }}>
                              {path}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          {startedAgo && (
                            <span className="text-xs" style={{ color: 'var(--color-silver-mist-dim)' }}>
                              Started {startedAgo}
                            </span>
                          )}
                          {lastUpdateAgo && (
                            <span className={`text-xs ${stale ? 'text-amber-400' : ''}`} style={{ color: stale ? '#d97706' : 'var(--color-silver-mist-dim)' }}>
                              {stale ? 'Still working...' : `Updated ${lastUpdateAgo}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-silver-mist-dim)' }} />
                </div>

                {/* Indeterminate scanline shimmer */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer" />
                </div>

                {/* Heartbeat pulse indicator */}
                {isPulsing && (
                  <div className="absolute top-4 right-6">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping-fast" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Show More */}
          {hiddenCount > 0 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:bg-white/[0.05]"
              style={{ color: 'var(--color-iridescent-cyan)' }}
            >
              {showAll ? 'Show Less' : `+${hiddenCount} more running`}
              <ChevronRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50/50 to-emerald-50/50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="relative">
                <Activity className="w-5 h-5 text-emerald-600" />
                <div className="absolute inset-0 w-5 h-5">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
                </div>
              </div>
              Live Scans
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {jobs.length}
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Real-time evidence capture in progress</p>
          </div>
          {onNewScan && (
            <button
              onClick={onNewScan}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New Scan
            </button>
          )}
        </div>
      </div>

      {/* Scan Rows */}
      <div className="divide-y divide-gray-100">
        {visibleJobs.map((job) => {
          const { domain, path } = extractDomain(job.url);
          const status = mapStatus(job.last_status);
          const startedAgo = job.started_at ? formatTimeAgo(job.started_at) : null;
          const lastUpdateAgo = job.last_update ? formatTimeAgo(job.last_update) : null;
          const isPulsing = pulsingJobs.has(job.session_id);
          const stale = isStale(job.last_update);

          return (
            <div
              key={job.session_id}
              onClick={() => navigate(`/scans/${job.session_id}`)}
              className="group relative px-6 py-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent cursor-pointer transition-all duration-200 hover:translate-x-1"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Domain and Path */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-gray-900 truncate">
                          {domain}
                        </span>
                        {path && (
                          <span className="text-xs text-gray-500 truncate">
                            {path}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">
                          Started {startedAgo}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className={`text-xs ${stale ? 'text-amber-600' : 'text-gray-500'}`}>
                          {stale ? 'Still working...' : `Updated ${lastUpdateAgo}`}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill with Heartbeat */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color} relative z-10`}
                        title="Polled every ~5s. Evidence capture continues until completion."
                      >
                        {status.label}
                      </div>
                      {/* Heartbeat Pulse */}
                      {isPulsing && (
                        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                      )}
                      {/* Alive Indicator Dot */}
                      <div
                        className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white transition-colors ${
                          stale ? 'bg-gray-400' : isPulsing ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                      >
                        {!stale && !isPulsing && (
                          <div className="absolute inset-0 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse opacity-50" />
                        )}
                      </div>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/scans/${job.session_id}`);
                      }}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="View scan details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Indeterminate Scanline Animation */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                  style={{
                    width: '30%',
                    animation: 'scanline 2.5s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Show More Row */}
        {!showAll && hiddenCount > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full px-6 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
          >
            <span>+{hiddenCount} more running</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Show Less Row */}
        {showAll && hiddenCount > 0 && (
          <button
            onClick={() => setShowAll(false)}
            className="w-full px-6 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
          >
            <span>Show less</span>
          </button>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes scanline {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
      `}</style>
    </div>
  );
}
