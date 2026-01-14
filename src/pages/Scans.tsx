import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Loader2, Copy, Check, AlertCircle, Columns3, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import { Header } from '../components/Header';
import { ScannerAPI } from '../api';
import { EllipsisCell, SessionIdCell, UrlCell } from '../components/table/EllipsisCell';
import {
  unwrapList,
  pickSessionId,
  pickUrl,
  pickStatus,
  pickCreated,
  pickRegion,
  pickLastUpdated,
} from '../utils/scanHelpers';
import { resolveRegion } from '../utils/region';

type SortColumn = 'sessionId' | 'url' | 'status' | 'region' | 'created' | 'updated' | null;
type SortDirection = 'asc' | 'desc' | null;

interface ColumnVisibility {
  sessionId: boolean;
  url: boolean;
  status: boolean;
  region: boolean;
  created: boolean;
  updated: boolean;
  actions: boolean;
}

const COLUMNS_STORAGE_KEY = 'scansTable.columns';
const PAGE_SIZE_STORAGE_KEY = 'scansTable.pageSize';

const defaultColumnVisibility: ColumnVisibility = {
  sessionId: true,
  url: true,
  status: true,
  region: true,
  created: true,
  updated: true,
  actions: true,
};

export function Scans() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [pageSize, setPageSize] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(PAGE_SIZE_STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 25;
    } catch {
      return 25;
    }
  });
  const columnsMenuRef = useRef<HTMLDivElement>(null);

  // Load column visibility from localStorage
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => {
    try {
      const stored = localStorage.getItem(COLUMNS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultColumnVisibility;
    } catch {
      return defaultColumnVisibility;
    }
  });

  // Save column visibility to localStorage
  useEffect(() => {
    localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // Save page size to localStorage
  useEffect(() => {
    localStorage.setItem(PAGE_SIZE_STORAGE_KEY, pageSize.toString());
  }, [pageSize]);

  // Close columns menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target as Node)) {
        setShowColumnsMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch sessions on mount
  useEffect(() => {
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
  }, []);

  // Get unique regions and statuses for filters
  const { regions, statuses } = useMemo(() => {
    const regionSet = new Set<string>();
    const statusSet = new Set<string>();

    sessions.forEach((session) => {
      const apiRegion = pickRegion(session);
      const url = pickUrl(session);
      const { region } = resolveRegion(apiRegion, url);
      const status = pickStatus(session);
      
      if (region && region !== '-') regionSet.add(region);
      if (status && status !== 'unknown') statusSet.add(status);
    });

    return {
      regions: ['All', ...Array.from(regionSet).sort()],
      statuses: ['All', ...Array.from(statusSet).sort()],
    };
  }, [sessions]);

  // Filter and sort sessions
  const filteredAndSortedSessions = useMemo(() => {
    let result = sessions.filter((session) => {
      const sessionId = pickSessionId(session);
      const url = pickUrl(session);
      const status = pickStatus(session);
      const apiRegion = pickRegion(session);
      const { region } = resolveRegion(apiRegion, url);

      const matchesSearch =
        searchQuery === '' ||
        sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || status === statusFilter;
      const matchesRegion = regionFilter === 'All' || region === regionFilter;

      return matchesSearch && matchesStatus && matchesRegion;
    });

    // Apply sorting
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (sortColumn) {
          case 'sessionId':
            aVal = pickSessionId(a);
            bVal = pickSessionId(b);
            break;
          case 'url':
            aVal = pickUrl(a);
            bVal = pickUrl(b);
            break;
          case 'status':
            aVal = pickStatus(a);
            bVal = pickStatus(b);
            break;
          case 'region':
            const aRegion = resolveRegion(pickRegion(a), pickUrl(a)).region;
            const bRegion = resolveRegion(pickRegion(b), pickUrl(b)).region;
            aVal = aRegion;
            bVal = bRegion;
            break;
          case 'created':
            const aCreated = pickCreated(a);
            const bCreated = pickCreated(b);
            aVal = aCreated && aCreated !== '-' ? new Date(aCreated).getTime() : 0;
            bVal = bCreated && bCreated !== '-' ? new Date(bCreated).getTime() : 0;
            break;
          case 'updated':
            const aUpdated = pickLastUpdated(a);
            const bUpdated = pickLastUpdated(b);
            aVal = aUpdated ? new Date(aUpdated).getTime() : 0;
            bVal = bUpdated ? new Date(bUpdated).getTime() : 0;
            break;
          default:
            return 0;
        }

        // Handle string comparison
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        // Handle numeric comparison
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return result;
  }, [sessions, searchQuery, statusFilter, regionFilter, sortColumn, sortDirection]);

  // Paginated data
  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedSessions.slice(start, start + pageSize);
  }, [filteredAndSortedSessions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedSessions.length / pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, regionFilter, pageSize]);

  const handleCopyId = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sessionId);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> none
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    ScannerAPI.getAllSessions()
      .then(response => {
        const sessionList = unwrapList(response);
        setSessions(sessionList);
      })
      .catch(err => {
        console.error('Failed to fetch sessions:', err);
        setError(err.message || 'Failed to load scan sessions');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
            <tr>
              {columnVisibility.sessionId && <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6 whitespace-nowrap w-[15%]">Session ID</th>}
              {columnVisibility.url && <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap w-[25%]">Target URL</th>}
              {columnVisibility.status && <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap w-[12%]">Status</th>}
              {columnVisibility.region && <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap w-[10%]">Region</th>}
              {columnVisibility.created && <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap w-[14%]">Created</th>}
              {columnVisibility.updated && <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap w-[14%]">Updated</th>}
              {columnVisibility.actions && <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6 whitespace-nowrap w-[10%]">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[...Array(10)].map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                {columnVisibility.sessionId && (
                  <td className="py-4 px-6 whitespace-nowrap w-[15%]">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                )}
                {columnVisibility.url && (
                  <td className="py-4 px-4 whitespace-nowrap w-[25%]">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </td>
                )}
                {columnVisibility.status && (
                  <td className="py-4 px-4 whitespace-nowrap w-[12%]">
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                  </td>
                )}
                {columnVisibility.region && (
                  <td className="py-4 px-4 whitespace-nowrap w-[10%]">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                )}
                {columnVisibility.created && (
                  <td className="py-4 px-4 whitespace-nowrap w-[14%]">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                )}
                {columnVisibility.updated && (
                  <td className="py-4 px-4 whitespace-nowrap w-[14%]">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                )}
                {columnVisibility.actions && (
                  <td className="py-4 px-6 whitespace-nowrap w-[10%]">
                    <div className="h-7 bg-gray-200 rounded-lg w-16"></div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Scans" timeRange="7" onTimeRangeChange={() => {}} />
        <main className="p-8">
          {/* Controls skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex flex-col gap-4">
              <div className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
              <div className="flex gap-3">
                <div className="h-10 w-32 bg-gray-100 rounded-xl animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-100 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
          {renderLoadingSkeleton()}
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Scans" timeRange="7" onTimeRangeChange={() => {}} />
        <main className="p-8">
          {/* Controls */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex flex-col gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search session ID or URL…"
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
          
          {/* Error Alert */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Failed to Load Scans</h3>
                <p className="text-red-700 text-sm mb-3">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Scans" timeRange="7" onTimeRangeChange={() => {}} />

      <main className="p-8">
        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search session ID or URL…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status}
                  </option>
                ))}
              </select>

              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === 'All' ? 'All Regions' : region}
                  </option>
                ))}
              </select>

              <div className="text-sm text-gray-600">
                {filteredAndSortedSessions.length} {filteredAndSortedSessions.length === 1 ? 'session' : 'sessions'}
              </div>

              {/* Column Visibility Control */}
              <div className="relative" ref={columnsMenuRef}>
                <button
                  onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  title="Toggle columns"
                >
                  <Columns3 className="w-4 h-4" />
                  Columns
                </button>

                {showColumnsMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      Show Columns
                    </div>
                    {Object.entries(columnVisibility).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => toggleColumn(key as keyof ColumnVisibility)}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {key === 'sessionId' ? 'Session ID' : key === 'url' ? 'Target URL' : key}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh sessions"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <div className="flex-1" />

              <button
                onClick={() => navigate('/scans/new')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Scan
              </button>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filteredAndSortedSessions.length === 0 && sessions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setRegionFilter('All');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No scan sessions yet</h3>
              <p className="text-gray-500 text-sm mb-4">Create your first scan to get started</p>
              <button
                onClick={() => navigate('/scans/new')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Scan
              </button>
            </div>
          </div>
        )}

        {/* Premium Table */}
        {sessions.length > 0 && filteredAndSortedSessions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Scrollable table container */}
            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
              <table className="w-full table-fixed">
                {/* Sticky header with backdrop blur */}
                <thead className="bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
                  <tr>
                    {columnVisibility.sessionId && (
                      <th 
                        onClick={() => handleSort('sessionId')}
                        className="group text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 transition-colors relative select-none w-[15%]"
                      >
                        <div className="flex items-center gap-2">
                          Session ID
                          {sortColumn === 'sessionId' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'sessionId' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'sessionId' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.url && (
                      <th 
                        onClick={() => handleSort('url')}
                        className="group text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 transition-colors relative select-none w-[25%]"
                      >
                        <div className="flex items-center gap-2">
                          Target URL
                          {sortColumn === 'url' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'url' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'url' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.status && (
                      <th 
                        onClick={() => handleSort('status')}
                        className="group text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 transition-colors relative select-none w-[12%]"
                      >
                        <div className="flex items-center gap-2">
                          Status
                          {sortColumn === 'status' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'status' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'status' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.region && (
                      <th 
                        onClick={() => handleSort('region')}
                        className="group text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 transition-colors relative select-none w-[10%]"
                      >
                        <div className="flex items-center gap-2">
                          Region
                          {sortColumn === 'region' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'region' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'region' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.created && (
                      <th 
                        onClick={() => handleSort('created')}
                        className="group text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 transition-colors relative select-none w-[14%]"
                      >
                        <div className="flex items-center gap-2">
                          Created
                          {sortColumn === 'created' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'created' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'created' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.updated && (
                      <th 
                        onClick={() => handleSort('updated')}
                        className="group text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 transition-colors relative select-none w-[14%]"
                      >
                        <div className="flex items-center gap-2">
                          Updated
                          {sortColumn === 'updated' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'updated' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'updated' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.actions && (
                      <th 
                        className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6 whitespace-nowrap relative w-[10%]"
                      >
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedSessions.map((session, idx) => {
                    const sessionId = pickSessionId(session);
                    const url = pickUrl(session);
                    const status = pickStatus(session);
                    const apiRegion = pickRegion(session);
                    const { region, isInferred } = resolveRegion(apiRegion, url);
                    const created = pickCreated(session);
                    const updated = pickLastUpdated(session);

                    return (
                      <tr
                        key={`${sessionId}-${idx}`}
                        className="group relative hover:bg-gray-50/80 cursor-pointer transition-all duration-150 active:scale-[0.998]"
                        onClick={() => navigate(`/scans/${sessionId}`)}
                      >
                        {columnVisibility.sessionId && (
                          <td 
                            className="py-4 px-6 whitespace-nowrap relative border-l-2 border-transparent group-hover:border-emerald-500 transition-colors duration-150 w-[15%]"
                          >
                            <div className="flex items-center gap-2">
                              <SessionIdCell sessionId={sessionId} className="text-sm text-gray-900" />
                              <button
                                onClick={(e) => handleCopyId(sessionId, e)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                                title="Copy full session ID"
                              >
                                {copiedId === sessionId ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </td>
                        )}
                        {columnVisibility.url && (
                          <td 
                            className={`py-4 px-4 whitespace-nowrap w-[25%] ${!columnVisibility.sessionId ? 'border-l-2 border-transparent group-hover:border-emerald-500 transition-colors duration-150' : ''}`}
                          >
                            <UrlCell url={url} className="text-sm text-gray-700" />
                          </td>
                        )}
                        {columnVisibility.status && (
                          <td 
                            className={`py-4 px-4 whitespace-nowrap w-[12%] ${!columnVisibility.sessionId && !columnVisibility.url ? 'border-l-2 border-transparent group-hover:border-emerald-500 transition-colors duration-150' : ''}`}
                          >
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                status === 'Scan Complete' || status === 'completed' || status === 'success'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : status === 'Scan Error' || status === 'failed' || status === 'error'
                                  ? 'bg-red-100 text-red-700'
                                  : status === 'In Progress' || status === 'pending' || status === 'running'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {status === 'In Progress' && <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />}
                              {status}
                            </span>
                          </td>
                        )}
                        {columnVisibility.region && (
                          <td 
                            className="py-4 px-4 whitespace-nowrap w-[10%]"
                          >
                            <EllipsisCell 
                              value={`${region}${isInferred ? ' *' : ''}`}
                              title={isInferred ? `${region} (Inferred from domain)` : region}
                              className="text-sm text-gray-700"
                            />
                          </td>
                        )}
                        {columnVisibility.created && (
                          <td 
                            className="py-4 px-4 whitespace-nowrap w-[14%]"
                          >
                            <EllipsisCell
                              value={created !== '-' ? new Date(created).toLocaleString() : created}
                              className="text-sm text-gray-700"
                            />
                          </td>
                        )}
                        {columnVisibility.updated && (
                          <td 
                            className="py-4 px-4 whitespace-nowrap w-[14%]"
                          >
                            <EllipsisCell
                              value={updated ? new Date(updated).toLocaleString() : updated}
                              className="text-sm text-gray-700"
                            />
                          </td>
                        )}
                        {columnVisibility.actions && (
                          <td 
                            className="py-4 px-6 whitespace-nowrap w-[10%]"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/scans/${sessionId}`);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors whitespace-nowrap"
                            >
                              View
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredAndSortedSessions.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, filteredAndSortedSessions.length)} of{' '}
                    {filteredAndSortedSessions.length} sessions
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Rows per page:</label>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 mr-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
