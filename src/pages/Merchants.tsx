import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { SortableTableHeader } from '../components/SortableTableHeader';
import { useTableSort } from '../hooks/useTableSort';
import { merchants, type Merchant } from '../demo/merchants';

export function Merchants() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [geoFilter, setGeoFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const itemsPerPage = 15;

  const filteredMerchants = useMemo(() => {
    return merchants.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.domain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk =
        riskFilter === 'All' ||
        (riskFilter === '0-30' && m.riskScore <= 30) ||
        (riskFilter === '31-60' && m.riskScore >= 31 && m.riskScore <= 60) ||
        (riskFilter === '61-80' && m.riskScore >= 61 && m.riskScore <= 80) ||
        (riskFilter === '81-100' && m.riskScore >= 81);

      const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
      const matchesGeo = geoFilter === 'All' || m.geo === geoFilter;
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;

      return matchesSearch && matchesRisk && matchesCategory && matchesGeo && matchesStatus;
    });
  }, [searchQuery, riskFilter, categoryFilter, geoFilter, statusFilter]);

  const { sortedData: sortedMerchants, requestSort, sortConfig, getSortIndicator } = useTableSort(filteredMerchants, {
    key: 'riskScore',
    direction: 'desc',
  });

  const paginatedMerchants = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedMerchants.slice(start, start + itemsPerPage);
  }, [sortedMerchants, currentPage]);

  const totalPages = Math.ceil(sortedMerchants.length / itemsPerPage);

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`;
    return `$${volume}`;
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'Review') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getRiskColor = (score: number) => {
    if (score >= 81) return 'bg-red-50 text-red-700 border-red-200';
    if (score >= 61) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (score >= 31) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Merchants" timeRange="7" onTimeRangeChange={() => {}} />

      <main className="p-8">
        {/* Controls Row */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by merchant name or domain…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="All">All Risk</option>
                <option value="0-30">0-30</option>
                <option value="31-60">31-60</option>
                <option value="61-80">61-80</option>
                <option value="81-100">81-100</option>
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

              <select
                value={geoFilter}
                onChange={(e) => setGeoFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="All">All GEO</option>
                <option value="US">US</option>
                <option value="EU">EU</option>
                <option value="UK">UK</option>
                <option value="IL">IL</option>
                <option value="Global">Global</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Review">Review</option>
                <option value="Restricted">Restricted</option>
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
          <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
            <table className="w-full table-fixed">
              <thead className="bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  <SortableTableHeader
                    label="Merchant"
                    sortKey="name"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('name')}
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
                    label="Risk Score"
                    sortKey="riskScore"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('riskScore')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Last Scan"
                    sortKey="lastScan"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('lastScan')}
                    onSort={requestSort}
                  />
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Top Triggers
                  </th>
                  <SortableTableHeader
                    label="Volume"
                    sortKey="volume"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('volume')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Approval"
                    sortKey="approvalRate"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('approvalRate')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Est. Uplift"
                    sortKey="estUplift"
                    currentSort={sortConfig?.key as string}
                    direction={getSortIndicator('estUplift')}
                    onSort={requestSort}
                  />
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedMerchants.map((merchant) => (
                  <tr
                    key={merchant.id}
                    className="group relative hover:bg-gray-50/80 cursor-pointer transition-all duration-150 active:scale-[0.998]"
                    onClick={(e) => {
                      if (!(e.target as HTMLElement).closest('.action-menu')) {
                        navigate(`/merchants/${merchant.id}`);
                      }
                    }}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{merchant.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{merchant.domain}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(
                          merchant.status
                        )}`}
                      >
                        {merchant.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold border ${getRiskColor(
                            merchant.riskScore
                          )}`}
                        >
                          {merchant.riskScore}
                        </span>
                        {merchant.riskDelta !== 0 && (
                          <span
                            className={`flex items-center text-xs font-semibold ${
                              merchant.riskDelta > 0 ? 'text-red-600' : 'text-emerald-600'
                            }`}
                          >
                            {merchant.riskDelta > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {Math.abs(merchant.riskDelta)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700" title={merchant.lastScan.toLocaleString()}>
                        {getRelativeTime(merchant.lastScan)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {merchant.topTriggers.slice(0, 3).map((trigger, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {trigger}
                          </span>
                        ))}
                        {merchant.topTriggers.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                            +{merchant.topTriggers.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-gray-900">{formatVolume(merchant.volume)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{merchant.approvalRate}%</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-emerald-600">+{merchant.estUplift}pp</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative action-menu">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === merchant.id ? null : merchant.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        {openMenuId === merchant.id && (
                          <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/merchants/${merchant.id}`);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-xl"
                            >
                              View merchant
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/scans/new?merchantId=${merchant.id}`);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Run new scan
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/scans/S-${merchant.id.split('-')[1]}`);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-xl"
                            >
                              View latest report
                            </button>
                          </div>
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
                {Math.min(currentPage * itemsPerPage, sortedMerchants.length)} of{' '}
                {sortedMerchants.length} merchants
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                ))}
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

