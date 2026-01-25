import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle, Edit, Power } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Chip } from '../components/Badges';
import { useProviders } from '../state/providersStore';

export function ProviderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { providers } = useProviders();
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'coverage' | 'credentials'>('overview');

  const provider = providers.find((p) => p.id === id);

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-transparent">
        <Header title="Provider Not Found" timeRange="7" onTimeRangeChange={() => {}} />
        <main className="p-8">
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Provider not found</h3>
            <p className="text-gray-600 mb-6">The requested provider does not exist.</p>
            <button
              onClick={() => navigate('/providers')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
            >
              Back to Providers
            </button>
          </Card>
        </main>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5" />;
      case 'disconnected':
        return <Activity className="w-5 h-5" />;
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

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <Header title="Provider Details" timeRange="7" onTimeRangeChange={() => {}} />

      <main className="p-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/providers')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Providers
        </button>

        {/* Header Card */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {provider.logoText.substring(0, 2)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.name}</h1>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(
                        provider.status
                      )}`}
                    >
                      {getStatusIcon(provider.status)}
                      {provider.status}
                    </span>
                    {provider.lastSync && (
                      <span className="text-sm text-gray-600">
                        Last sync: {getRelativeTime(provider.lastSync)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('Update credentials (demo)')}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Update Credentials
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to disable this provider?')) {
                      alert('Provider disabled (demo)');
                    }
                  }}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <Power className="w-4 h-4" />
                  Disable
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-5 gap-6 mt-6 pt-6 border-t border-gray-100">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Volume Share</span>
                <span className="text-2xl font-bold text-gray-900">{provider.stats.volumeSharePct.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Approval Rate</span>
                <span className="text-2xl font-bold text-emerald-600">{provider.stats.approvalRatePct.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Decline Rate</span>
                <span className="text-2xl font-bold text-red-600">{provider.stats.declineRatePct.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Avg Cost</span>
                <span className="text-2xl font-bold text-gray-900">{provider.stats.avgCostBps} bps</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Chargeback Rate</span>
                <span className="text-2xl font-bold text-gray-900">{provider.stats.chargebackRatePct.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl border border-gray-100 border-b-0">
          <nav className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'performance'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('coverage')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'coverage'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Coverage & Constraints
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'credentials'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Credentials
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Regions & Methods */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Regions & Methods</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-700 block mb-2">Supported Regions</span>
                        <div className="flex flex-wrap gap-1">
                          {provider.regions.map((region) => (
                            <Chip key={region} label={region} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-700 block mb-2">Payment Methods</span>
                        <div className="flex flex-wrap gap-1">
                          {provider.methods.map((method) => (
                            <Chip key={method} label={method} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Routing Weight */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Routing Weight</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">Priority in routing decisions</span>
                          <span className="text-lg font-bold text-gray-900">{provider.routingWeight}/100</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${provider.routingWeight}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        Higher weight means this provider is preferred when multiple routes are eligible.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Top Merchants */}
              <Card>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Top Merchants by Volume</h3>
                  {provider.topMerchants.length === 0 ? (
                    <p className="text-sm text-gray-600">No merchant data available yet.</p>
                  ) : (
                    <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 520px)' }}>
                      <table className="w-full table-fixed">
                        <thead className="bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
                          <tr>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                              Merchant
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                              Domain
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                              Volume
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                              Approval Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {provider.topMerchants.map((merchant) => (
                            <tr key={merchant.merchantId} className="group relative hover:bg-gray-50/80 cursor-pointer transition-all duration-150 active:scale-[0.998]">
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => navigate(`/merchants/${merchant.merchantId}`)}
                                  className="text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors"
                                >
                                  {merchant.merchantName}
                                </button>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm text-gray-600">{merchant.domain}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm font-semibold text-gray-900">{merchant.volume}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm font-semibold text-emerald-600">
                                  {merchant.approvalRatePct.toFixed(1)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="p-6 space-y-6">
              {/* Approval Rate Over Time */}
              <Card>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-6">Approval Rate Over Time (30 days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={provider.series30d}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        domain={[80, 95]}
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(val) => `${val}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(value?: number) => value ? [`${value.toFixed(1)}%`, 'Approval Rate'] : ['0%', 'Approval Rate']}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <Line type="monotone" dataKey="approvalRatePct" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Decline Reasons */}
              <Card>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-6">Declines by Reason</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={provider.declineReasons}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="reason" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="count" fill="#f87171" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {/* Coverage & Constraints Tab */}
          {activeTab === 'coverage' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Supported Countries */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Supported Countries</h3>
                    {provider.constraints.countries.length === 0 ? (
                      <p className="text-sm text-gray-600">No country restrictions.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {provider.constraints.countries.map((country) => (
                          <Chip key={country} label={country} />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Restricted Categories */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Restricted Categories</h3>
                    {provider.constraints.restrictedCategories.length === 0 ? (
                      <p className="text-sm text-gray-600">No category restrictions.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {provider.constraints.restrictedCategories.map((category) => (
                          <span
                            key={category}
                            className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Notes */}
              <Card>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Additional Notes</h3>
                  {provider.constraints.notes.length === 0 ? (
                    <p className="text-sm text-gray-600">No additional notes.</p>
                  ) : (
                    <ul className="space-y-2">
                      {provider.constraints.notes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Credentials Tab */}
          {activeTab === 'credentials' && (
            <div className="p-6 space-y-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-6">Connection Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-900">Connected</p>
                          <p className="text-xs text-emerald-700">
                            Connected on {provider.connectedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => alert('Update credentials (demo)')}
                        className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg border border-emerald-200 transition-colors"
                      >
                        Update Credentials
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Environment</label>
                        <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                          Production
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">API Key</label>
                        <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-mono">
                          sk_live_••••••••••••••••••••••••
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Webhook URL</label>
                        <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 font-mono">
                          https://api.revelius.com/webhooks/providers
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Last Sync</label>
                        <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                          {provider.lastSync ? provider.lastSync.toLocaleString() : 'Never'}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to disable this provider? This will stop all routing to this provider.')) {
                            alert('Provider disabled (demo)');
                          }
                        }}
                        className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Power className="w-5 h-5" />
                        Disable Provider
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


