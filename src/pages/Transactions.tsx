import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp } from 'lucide-react';
import { Header } from '../components/Header';
import { Chip } from '../components/Badges';
import { TransactionDetailPanel } from '../components/TransactionDetailPanel';
import { UpliftKpis, UpliftChart, BreakdownTable } from '../components/UpliftComponents';
import { SortableTableHeader } from '../components/SortableTableHeader';
import { useTableSort } from '../hooks/useTableSort';
import {
  transactions,
  upliftSeries,
  upliftBreakdownByCountry,
  upliftBreakdownByRoute,
  getUpliftMetrics,
  type Transaction,
} from '../demo/transactions';
import { merchants } from '../demo/merchants';

export function Transactions() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'feed' | 'uplift'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [merchantFilter, setMerchantFilter] = useState('All');
  const [outcomeFilter, setOutcomeFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [routeFilter, setRouteFilter] = useState('All');
  const [dateRange, setDateRange] = useState('7');
  const [showOptimizationsOnly, setShowOptimizationsOnly] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const daysAgo = parseInt(dateRange) === 24 
      ? new Date(now.getTime() - 24 * 60 * 60 * 1000)
      : new Date(now.getTime() - parseInt(dateRange) * 24 * 60 * 60 * 1000);

    return transactions.filter((txn) => {
      const matchesSearch =
        searchQuery === '' ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMerchant = merchantFilter === 'All' || txn.merchantId === merchantFilter;
      const matchesOutcome = outcomeFilter === 'All' || txn.currentOutcome === outcomeFilter;
      const matchesMethod = methodFilter === 'All' || txn.method === methodFilter;
      const matchesRoute = routeFilter === 'All' || txn.currentRoute === routeFilter;
      const matchesDate = txn.createdAt >= daysAgo;
      const matchesOptimization = !showOptimizationsOnly || txn.suggestedRoute !== txn.currentRoute;

      return matchesSearch && matchesMerchant && matchesOutcome && matchesMethod && 
             matchesRoute && matchesDate && matchesOptimization;
    });
  }, [searchQuery, merchantFilter, outcomeFilter, methodFilter, routeFilter, dateRange, showOptimizationsOnly]);

  const { sortedData: sortedTransactions, requestSort, sortConfig, getSortIndicator } = useTableSort(filteredTransactions, {
    key: 'createdAt',
    direction: 'desc',
  });

  const upliftMetrics = getUpliftMetrics(sortedTransactions);
  const currentUpliftSeries = dateRange === '24' ? upliftSeries[24] : dateRange === '7' ? upliftSeries[7] : upliftSeries[30];

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Transactions" timeRange="7" onTimeRangeChange={() => {}} />

      <main className="p-8">
        {/* Tabs */}
        <div className="bg-white rounded-t-2xl border border-gray-100 border-b-0">
          <nav className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab('feed')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'feed'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('uplift')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'uplift'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Uplift
            </button>
          </nav>
        </div>

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm">
            {/* Controls */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by txn ID, merchant, country…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={merchantFilter}
                    onChange={(e) => setMerchantFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="All">All Merchants</option>
                    {merchants.slice(0, 10).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={outcomeFilter}
                    onChange={(e) => setOutcomeFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="All">All Outcomes</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                  </select>

                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="All">All Methods</option>
                    <option value="Card">Card</option>
                    <option value="APM">APM</option>
                    <option value="Wallet">Wallet</option>
                    <option value="Bank transfer">Bank transfer</option>
                  </select>

                  <select
                    value={routeFilter}
                    onChange={(e) => setRouteFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="All">All Routes</option>
                    <option value="PSP A">PSP A</option>
                    <option value="PSP B">PSP B</option>
                    <option value="Local Acquirer">Local Acquirer</option>
                    <option value="Alt Rail">Alt Rail</option>
                  </select>

                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="24">Last 24 hours</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                  </select>

                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={showOptimizationsOnly}
                      onChange={(e) => setShowOptimizationsOnly(e.target.checked)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    Optimizations only
                  </label>
                </div>

                <p className="text-sm text-gray-600">
                  Showing {filteredTransactions.length} transactions
                  {showOptimizationsOnly && ` with optimization opportunities`}
                </p>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50 border-b border-gray-100 z-10">
                  <tr>
                    <SortableTableHeader
                      label="Txn ID"
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
                      label="Amount"
                      sortKey="amount"
                      currentSort={sortConfig?.key as string}
                      direction={getSortIndicator('amount')}
                      onSort={requestSort}
                    />
                    <SortableTableHeader
                      label="Country"
                      sortKey="country"
                      currentSort={sortConfig?.key as string}
                      direction={getSortIndicator('country')}
                      onSort={requestSort}
                    />
                    <SortableTableHeader
                      label="Method"
                      sortKey="method"
                      currentSort={sortConfig?.key as string}
                      direction={getSortIndicator('method')}
                      onSort={requestSort}
                    />
                    <SortableTableHeader
                      label="Route"
                      sortKey="currentRoute"
                      currentSort={sortConfig?.key as string}
                      direction={getSortIndicator('currentRoute')}
                      onSort={requestSort}
                    />
                    <SortableTableHeader
                      label="Outcome"
                      sortKey="currentOutcome"
                      currentSort={sortConfig?.key as string}
                      direction={getSortIndicator('currentOutcome')}
                      onSort={requestSort}
                    />
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Signals
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedTransactions.map((txn) => {
                    const hasOptimization = txn.suggestedRoute !== txn.currentRoute;
                    return (
                      <tr
                        key={txn.id}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedTransaction?.id === txn.id ? 'bg-emerald-50' : ''
                        }`}
                        onClick={() => setSelectedTransaction(txn)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-gray-900">{txn.id}</span>
                            {hasOptimization && (
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" title="Optimization opportunity" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{getRelativeTime(txn.createdAt)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/merchants/${txn.merchantId}`);
                            }}
                            className="text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors"
                          >
                            {txn.merchantName}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {txn.amount} {txn.currency}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700">{txn.country}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700">{txn.method}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">{txn.currentRoute}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                              txn.currentOutcome === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {txn.currentOutcome}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {txn.riskSignals.slice(0, 2).map((signal, i) => (
                              <Chip key={i} label={signal} />
                            ))}
                            {txn.riskSignals.length > 2 && (
                              <span className="text-xs text-gray-500">+{txn.riskSignals.length - 2}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Uplift Tab */}
        {activeTab === 'uplift' && (
          <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            {/* KPI Cards */}
            <UpliftKpis
              baselineRate={upliftMetrics.baselineRate}
              optimizedRate={upliftMetrics.optimizedRate}
              uplift={upliftMetrics.uplift}
              incrementalApprovals={upliftMetrics.incrementalApprovals}
              incrementalVolume={upliftMetrics.incrementalVolume}
              revenueUplift={upliftMetrics.revenueUplift}
            />

            {/* Chart */}
            <UpliftChart data={currentUpliftSeries} showHourly={dateRange === '24'} />

            {/* Breakdown Tables */}
            <div className="grid grid-cols-2 gap-6">
              <BreakdownTable title="Uplift by Country" data={upliftBreakdownByCountry} />
              <BreakdownTable title="Uplift by Route" data={upliftBreakdownByRoute} />
            </div>
          </div>
        )}
      </main>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedTransaction(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <TransactionDetailPanel
              transaction={selectedTransaction}
              onClose={() => setSelectedTransaction(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
