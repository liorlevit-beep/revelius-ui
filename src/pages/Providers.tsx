import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Chip } from '../components/Badges';
import { AddProviderModal } from '../components/AddProviderModal';
import { useProviders } from '../state/providersStore';

export function Providers() {
  const navigate = useNavigate();
  const { providers } = useProviders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [sortBy, setSortBy] = useState('volumeShare');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProviders = useMemo(() => {
    let filtered = providers.filter((provider) => {
      const matchesSearch =
        searchQuery === '' ||
        provider.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || provider.status === statusFilter;
      const matchesRegion = regionFilter === 'All' || provider.regions.includes(regionFilter);
      const matchesMethod = methodFilter === 'All' || provider.methods.includes(methodFilter);

      return matchesSearch && matchesStatus && matchesRegion && matchesMethod;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'volumeShare':
          return b.stats.volumeSharePct - a.stats.volumeSharePct;
        case 'approvalRate':
          return b.stats.approvalRatePct - a.stats.approvalRatePct;
        case 'cost':
          return a.stats.avgCostBps - b.stats.avgCostBps;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [providers, searchQuery, statusFilter, regionFilter, methodFilter, sortBy]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" />;
      case 'disconnected':
        return <Activity className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'degraded':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'disconnected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Payment Providers" timeRange="7" onTimeRangeChange={() => {}} />

      <main className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Connected Providers</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your payment provider connections and view performance metrics
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Provider
          </button>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search providers..."
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
                  <option value="All">All Statuses</option>
                  <option value="connected">Connected</option>
                  <option value="degraded">Degraded</option>
                  <option value="disconnected">Disconnected</option>
                </select>

                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="All">All Regions</option>
                  <option value="US">US</option>
                  <option value="EU">EU</option>
                  <option value="UK">UK</option>
                  <option value="CA">CA</option>
                </select>

                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="All">All Methods</option>
                  <option value="Card">Card</option>
                  <option value="Wallet">Wallet</option>
                  <option value="APM">APM</option>
                  <option value="Bank transfer">Bank transfer</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="volumeShare">Sort by Volume Share</option>
                  <option value="approvalRate">Sort by Approval Rate</option>
                  <option value="cost">Sort by Cost</option>
                  <option value="name">Sort by Name</option>
                </select>

                <span className="text-sm text-gray-600 ml-auto">
                  {filteredProviders.length} {filteredProviders.length === 1 ? 'provider' : 'providers'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {provider.logoText.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(
                            provider.status
                          )}`}
                        >
                          {getStatusIcon(provider.status)}
                          {provider.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regions */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {provider.regions.map((region) => (
                      <Chip key={region} label={region} />
                    ))}
                  </div>
                </div>

                {/* KPIs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Volume Share</span>
                    <span className="text-lg font-bold text-gray-900">{provider.stats.volumeSharePct.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Approval Rate</span>
                    <span className="text-lg font-bold text-emerald-600">{provider.stats.approvalRatePct.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Avg Cost</span>
                    <span className="text-lg font-bold text-gray-900">{provider.stats.avgCostBps} bps</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Chargeback Rate</span>
                    <span className="text-lg font-bold text-gray-900">{provider.stats.chargebackRatePct.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Mini Chart */}
                {provider.series30d.length > 0 && (
                  <div className="mb-4">
                    <span className="text-xs text-gray-500 block mb-2">Approval Rate (30d)</span>
                    <ResponsiveContainer width="100%" height={60}>
                      <LineChart data={provider.series30d}>
                        <Line
                          type="monotone"
                          dataKey="approvalRatePct"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/providers/${provider.id}`)}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => alert('Manage credentials (demo)')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                  >
                    Credentials
                  </button>
                  <button
                    onClick={() => alert('Testing connection...\n✓ Connection successful')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                  >
                    Test
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Provider
              </button>
            </div>
          </Card>
        )}
      </main>

      {/* Add Provider Modal */}
      <AddProviderModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}


