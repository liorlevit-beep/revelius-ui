import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Chip } from '../components/Badges';
import { getPolicyPackById, type PolicyRule } from '../demo/policies';

export function PolicyPackDetail() {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'routing' | 'triggers'>('overview');
  const [selectedRule, setSelectedRule] = useState<PolicyRule | null>(null);

  const pack = getPolicyPackById(packId || '');

  if (!pack) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Policy Pack Not Found" timeRange="7" onTimeRangeChange={() => {}} />
        <main className="p-8">
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy pack not found</h3>
            <p className="text-gray-600 mb-6">The requested policy pack does not exist.</p>
            <button
              onClick={() => navigate('/policies')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
            >
              Back to Policies
            </button>
          </Card>
        </main>
      </div>
    );
  }

  const downloadJSON = () => {
    const dataStr = JSON.stringify(pack, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `policy-pack-${pack.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Policy Pack" timeRange="7" onTimeRangeChange={() => {}} />

      <main className="p-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/policies')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Policies
        </button>

        {/* Header Card */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{pack.name}</h1>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${
                      pack.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {pack.status === 'Active' && <CheckCircle className="w-4 h-4 mr-1.5" />}
                    {pack.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{pack.description}</p>

                {/* Regions */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Regions:</span>
                  <div className="flex flex-wrap gap-1">
                    {pack.regions.map((region) => (
                      <Chip key={region} label={region} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {pack.status === 'Draft' && (
                  <button
                    onClick={() => alert('Set as active (demo)')}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    Set as active
                  </button>
                )}
                <button
                  onClick={downloadJSON}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </button>
                <button
                  onClick={() => setActiveTab('triggers')}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  View recent triggers
                </button>
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
              onClick={() => setActiveTab('rules')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'rules'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Rules ({pack.rules.length})
            </button>
            <button
              onClick={() => setActiveTab('routing')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'routing'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Routing Preferences
            </button>
            <button
              onClick={() => setActiveTab('triggers')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'triggers'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Triggers & Impact
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* What this pack optimizes for */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">What this pack optimizes for</h3>
                    <ul className="space-y-2">
                      {pack.optimizesFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                {/* High-level gates */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">High-level gates</h3>
                    <ul className="space-y-2">
                      {pack.highLevelGates.map((gate, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          {gate}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>

              {/* Thresholds */}
              <Card>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-6">Risk Score Thresholds</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Auto-approve threshold</label>
                        <span className="text-sm font-semibold text-gray-900">&lt; {pack.thresholds.autoApprove}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${pack.thresholds.autoApprove}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Review threshold</label>
                        <span className="text-sm font-semibold text-gray-900">
                          {pack.thresholds.autoApprove} - {pack.thresholds.review}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500"
                          style={{ width: `${pack.thresholds.review}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Reject threshold</label>
                        <span className="text-sm font-semibold text-gray-900">&gt; {pack.thresholds.reject}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${pack.thresholds.reject}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Where it applies */}
              <Card>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Where it applies</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-700 block mb-2">Merchant Categories</span>
                      <div className="flex flex-wrap gap-1">
                        {pack.appliesTo.categories.map((cat) => (
                          <Chip key={cat} label={cat} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700 block mb-2">Regions</span>
                      <div className="flex flex-wrap gap-1">
                        {pack.appliesTo.regions.map((region) => (
                          <Chip key={region} label={region} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700 block mb-2">Payment Methods</span>
                      <div className="flex flex-wrap gap-1">
                        {pack.appliesTo.methods.map((method) => (
                          <Chip key={method} label={method} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rules List */}
                <div className="lg:col-span-2 space-y-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Active Rules</h3>
                  {pack.rules.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-gray-600">No rules defined yet.</p>
                    </Card>
                  ) : (
                    pack.rules.map((rule) => (
                      <Card
                        key={rule.id}
                        className={`cursor-pointer transition-all ${
                          selectedRule?.id === rule.id ? 'ring-2 ring-emerald-500' : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedRule(rule)}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">{rule.name}</h4>
                              <p className="text-xs text-gray-600">Priority {rule.priority}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  rule.action === 'approve'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : rule.action === 'reject'
                                    ? 'bg-red-50 text-red-700'
                                    : rule.action === 'review'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-blue-50 text-blue-700'
                                }`}
                              >
                                {rule.action.replace('_', ' ')}
                              </span>
                              {!rule.enabled && (
                                <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600">
                                  Disabled
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">{rule.triggersLast30d}</span> triggers (30d)
                            </div>
                            {rule.lastTriggered && (
                              <div>Last: {getRelativeTime(rule.lastTriggered)}</div>
                            )}
                            <div className="flex items-center gap-1">
                              {rule.impactApprovalDelta >= 0 ? (
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                              )}
                              <span
                                className={`font-semibold ${
                                  rule.impactApprovalDelta >= 0 ? 'text-emerald-600' : 'text-red-600'
                                }`}
                              >
                                {rule.impactApprovalDelta > 0 ? '+' : ''}
                                {rule.impactApprovalDelta.toFixed(1)}pp
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                {/* Rule Detail Panel */}
                <div className="lg:col-span-1">
                  {selectedRule ? (
                    <Card className="sticky top-8">
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Natural Language Rule</h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 font-mono whitespace-pre-wrap mb-4">
                          {selectedRule.naturalLanguage}
                        </div>

                        <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Conditions</h4>
                        <div className="space-y-2 mb-4">
                          {selectedRule.conditions.map((cond, i) => (
                            <div key={i} className="text-xs bg-white border border-gray-200 rounded-lg p-2">
                              <div className="font-semibold text-gray-900">{cond.field}</div>
                              <div className="text-gray-600">
                                {cond.operator} {Array.isArray(cond.value) ? cond.value.join(', ') : cond.value}
                              </div>
                              {cond.logic && i < selectedRule.conditions.length - 1 && (
                                <div className="text-emerald-600 font-semibold mt-1">{cond.logic}</div>
                              )}
                            </div>
                          ))}
                        </div>

                        <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Action</h4>
                        <div className="text-sm bg-white border border-gray-200 rounded-lg p-3">
                          <span className="font-semibold text-gray-900">{selectedRule.action.replace('_', ' ')}</span>
                          {selectedRule.actionParams && (
                            <div className="text-gray-600 mt-1">→ {selectedRule.actionParams}</div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-8 text-center text-sm text-gray-600">
                      Select a rule to view details
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Routing Preferences Tab */}
          {activeTab === 'routing' && (
            <div className="p-6 space-y-4">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Routing Preferences</h3>
              {pack.routingPreferences.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-600">No routing preferences defined.</p>
                </Card>
              ) : (
                pack.routingPreferences.map((pref) => (
                  <Card key={pref.id}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">When:</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono">
                            {pref.condition}
                          </p>
                        </div>
                        {!pref.enabled && (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600">
                            Disabled
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Preferred Routes (in order):</h4>
                      <div className="space-y-2">
                        {pref.preferredRoutes.map((route, i) => (
                          <div
                            key={route.routeId}
                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-gray-900">{route.routeName}</div>
                              <div className="text-xs text-gray-600">{route.reason}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Triggers & Impact Tab */}
          {activeTab === 'triggers' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Recent Triggers (Last 30 days)</h3>
                <p className="text-sm text-gray-600">Showing {pack.triggers.length} recent policy triggers</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                        Timestamp
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                        Rule
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                        Merchant
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                        Transaction
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pack.triggers.map((trigger) => (
                      <tr key={trigger.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">{getRelativeTime(trigger.timestamp)}</span>
                          <br />
                          <span className="text-xs text-gray-500">{trigger.timestamp.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">{trigger.ruleName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => navigate(`/merchants/${trigger.merchantId}`)}
                            className="text-sm text-gray-900 hover:text-emerald-600 transition-colors"
                          >
                            {trigger.merchantName}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono text-gray-700">{trigger.transactionId}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">{trigger.action}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


