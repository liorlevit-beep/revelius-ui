import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { StatusBadge, RiskScoreBadge, Chip } from '../components/Badges';
import { SortableTableHeader } from '../components/SortableTableHeader';
import { useTableSort } from '../hooks/useTableSort';
import { ScanStore } from '../demo/scans';

export function Scans() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const allScans = ScanStore.getAllScans();

  const filteredScans = useMemo(() => {
    const now = new Date();
    const daysAgo = new Date(now.getTime() - parseInt(dateRange) * 24 * 60 * 60 * 1000);

    return allScans.filter((scan) => {
      const matchesSearch =
        searchQuery === '' ||
        scan.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (scan.merchantName && scan.merchantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        scan.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate = scan.timestamp >= daysAgo;
      const matchesStatus = statusFilter === 'All' || scan.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || scan.category === categoryFilter;
      
      // Severity filter based on risk score
      const matchesSeverity =
        severityFilter === 'All' ||
        (severityFilter === 'Critical' && scan.riskScore >= 85) ||
        (severityFilter === 'High' && scan.riskScore >= 70 && scan.riskScore < 85) ||
        (severityFilter === 'Medium' && scan.riskScore >= 50 && scan.riskScore < 70) ||
        (severityFilter === 'Low' && scan.riskScore < 50);

      return matchesSearch && matchesDate && matchesStatus && matchesCategory && matchesSeverity;
    });
  }, [allScans, searchQuery, dateRange, statusFilter, severityFilter, categoryFilter]);

  const { sortedData: sortedScans, requestSort, sortConfig, getSortIndicator } = useTableSort(filteredScans, {
    key: 'timestamp',
    direction: 'desc',
  });

  const paginatedScans = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedScans.slice(start, start + itemsPerPage);
  }, [sortedScans, currentPage]);

  const totalPages = Math.ceil(sortedScans.length / itemsPerPage);

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

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
                placeholder="Search domain, merchant, scan ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="success">Success</option>
                <option value="partial">Partial</option>
                <option value="failed">Failed</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="All">All Severity</option>
                <option value="Critical">Critical (85+)</option>
                <option value="High">High (70-84)</option>
                <option value="Medium">Medium (50-69)</option>
                <option value="Low">Low (&lt;50)</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Adult">Adult</option>
                <option value="Gambling">Gambling</option>
                <option value="Supplements">Supplements</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Marketplaces">Marketplaces</option>
                <option value="General">General</option>
              </select>

              <button
                onClick={() => navigate('/scans/new')}
                className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Scan
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <SortableTableHeader
                    label="Scan ID"
                    sortKey="id"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('id')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Merchant"
                    sortKey="merchantName"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('merchantName')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Timestamp"
                    sortKey="timestamp"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('timestamp')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Type"
                    sortKey="type"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('type')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Status"
                    sortKey="status"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('status')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Pages"
                    sortKey="pagesScanned"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('pagesScanned')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Risk Score"
                    sortKey="riskScore"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('riskScore')}
                    onSort={requestSort}
                  />
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-6">
                    Top Triggers
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedScans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/scans/${scan.id}`)}
                  >
                    <td className="py-4 px-6">
                      <p className="text-sm font-mono font-semibold text-gray-900">{scan.id}</p>
                    </td>
                    <td className="py-4 px-4">
                      {scan.merchantName ? (
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{scan.merchantName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{scan.domain}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">{scan.domain}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700" title={scan.timestamp.toLocaleString()}>
                        {getRelativeTime(scan.timestamp)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm capitalize text-gray-700">{scan.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={scan.status} />
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{scan.pagesScanned}</span>
                    </td>
                    <td className="py-4 px-4">
                      <RiskScoreBadge score={scan.riskScore} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {scan.topTriggers.slice(0, 3).map((trigger, idx) => (
                          <Chip key={idx} label={trigger} />
                        ))}
                        {scan.topTriggers.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                            +{scan.topTriggers.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredScans.length)} of {filteredScans.length} scans
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

