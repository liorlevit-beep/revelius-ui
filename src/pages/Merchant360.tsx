import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { Header } from '../components/Header';
import { Chip } from '../components/Badges';
import { TransactionDetailPanel } from '../components/TransactionDetailPanel';
import { UpliftKpis, UpliftChart, BreakdownTable } from '../components/UpliftComponents';
import { OverviewTab } from '../components/merchant360/OverviewTab';
import { ScansTab } from '../components/merchant360/ScansTab';
import { FindingsTab } from '../components/merchant360/FindingsTab';
import { merchants } from '../demo/merchants';
import {
  getMerchantOverview,
  getMerchantScans,
  getMerchantFindings,
  getTopFindings,
} from '../demo/merchantsEnhanced';
import {
  getTransactionsForMerchant,
  getUpliftMetrics,
  upliftSeries,
  upliftBreakdownByCountry,
  upliftBreakdownByRoute,
  type Transaction,
} from '../demo/transactions';
import type { Finding } from '../components/merchant360/types';

export function Merchant360() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'scans' | 'findings' | 'transactions' | 'uplift'>('overview');
  const [selectedFindingId, setSelectedFindingId] = useState<string | undefined>(undefined);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const merchant = merchants.find((m) => m.id === id);
  const overview = id ? getMerchantOverview(id) : null;
  const scans = id ? getMerchantScans(id) : [];
  const findings = id ? getMerchantFindings(id) : [];
  const topFindings = id ? getTopFindings(id, 5) : [];
  const transactions = id ? getTransactionsForMerchant(id) : [];
  const upliftMetrics = getUpliftMetrics(transactions);
  const currentUpliftSeries = upliftSeries[7]; // Last 7 days for merchant view

  if (!merchant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Merchant Not Found" timeRange="7" onTimeRangeChange={() => {}} />
        <main className="p-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Merchant not found</h3>
            <p className="text-gray-600 mb-6">The requested merchant does not exist or has been removed.</p>
            <button
              onClick={() => navigate('/merchants')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
            >
              Back to Merchants
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleFindingClick = (finding: Finding) => {
    setSelectedFindingId(finding.id);
    setActiveTab('findings');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'scans', label: 'Scans & Reports' },
    { id: 'findings', label: 'Findings & Evidence' },
    { id: 'transactions', label: 'Transactions & Routing' },
    { id: 'uplift', label: 'Uplift / Impact' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={merchant.name} timeRange="7" onTimeRangeChange={() => {}} />

      <main className="p-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/merchants')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Merchants
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{merchant.name}</h1>
              <p className="text-sm text-gray-500">{merchant.domain}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                  merchant.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : merchant.status === 'Review'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {merchant.status}
              </span>
            </div>
          </div>

          {/* Risk Score & Route Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Risk Score</p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl font-bold ${
                    merchant.riskScore >= 80
                      ? 'text-red-600'
                      : merchant.riskScore >= 60
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {merchant.riskScore}
                </span>
                {merchant.riskDelta !== 0 && (
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    merchant.riskDelta > 0 ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {merchant.riskDelta > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(merchant.riskDelta)}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Current Route</p>
              <p className="text-lg font-semibold text-gray-900">{merchant.currentRoute || 'PSP A'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Recommended Route</p>
              <p className="text-lg font-semibold text-emerald-600">{merchant.recommendedRoute || 'Local Acquirer'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Est. Uplift</p>
              <p className="text-lg font-semibold text-emerald-600">+{merchant.estUplift}pp</p>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Approval Rate</p>
              <p className="text-xl font-bold text-gray-900">{merchant.approvalRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">GMV</p>
              <p className="text-xl font-bold text-gray-900">${(merchant.volume / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Category</p>
              <Chip label={merchant.category} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Region</p>
              <Chip label={merchant.geo} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl border border-gray-100 border-b-0">
          <nav className="flex gap-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id !== 'findings') {
                    setSelectedFindingId(undefined);
                  }
                }}
                className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm">
          {activeTab === 'overview' && (
            <OverviewTab
              merchantId={merchant.id}
              overview={overview}
              topFindings={topFindings}
              onFindingClick={handleFindingClick}
            />
          )}

          {activeTab === 'scans' && (
            <ScansTab
              merchantId={merchant.id}
              scans={scans}
            />
          )}

          {activeTab === 'findings' && (
            <FindingsTab
              findings={findings}
              onFindingClick={handleFindingClick}
              selectedFindingId={selectedFindingId}
            />
          )}

          {activeTab === 'transactions' && (
            <div className="p-6">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No transactions found for this merchant.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Transactions ({transactions.length})
                    </h3>
                  </div>

                  {/* Transactions Table */}
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                              Txn ID
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                              Amount
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                              Country
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                              Method
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                              Route
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                              Outcome
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                              Signals
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {transactions.slice(0, 20).map((txn) => {
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
                </div>
              )}
            </div>
          )}

          {activeTab === 'uplift' && (
            <div className="p-6 space-y-6">
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
              <UpliftChart data={currentUpliftSeries} showHourly={false} />

              {/* Breakdown Tables */}
              <div className="grid grid-cols-2 gap-6">
                <BreakdownTable title="Uplift by Country" data={upliftBreakdownByCountry} />
                <BreakdownTable title="Uplift by Route" data={upliftBreakdownByRoute} />
              </div>
            </div>
          )}
        </div>
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
