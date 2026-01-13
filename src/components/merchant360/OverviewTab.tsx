import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { CheckCircle, Play, AlertTriangle } from 'lucide-react';
import { Card } from '../Card';
import { Chip } from '../Badges';
import type { MerchantOverview, Finding } from './types';

interface OverviewTabProps {
  merchantId: string;
  overview: MerchantOverview | null;
  topFindings: Finding[];
  onFindingClick: (finding: Finding) => void;
}

export function OverviewTab({ merchantId, overview, topFindings, onFindingClick }: OverviewTabProps) {
  const navigate = useNavigate();

  if (!overview) {
    return (
      <div className="p-6">
        <p className="text-gray-600">No overview data available.</p>
      </div>
    );
  }

  const hasMismatch = overview.declared.category !== overview.observed.category;

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
    }
  };

  const getSeverityLabel = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Row 1: Declared vs Observed + Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Declared vs Observed */}
        <Card>
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Declared vs Observed</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Declared</label>
                <Chip label={overview.declared.category} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Observed</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <Chip label={overview.observed.category} />
                  {hasMismatch && (
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs font-semibold">
                      Mismatch
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {overview.observed.narrative}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Detected Patterns</label>
                <div className="flex flex-wrap gap-2">
                  {overview.observed.patterns.map((pattern, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium"
                    >
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Risk Breakdown */}
        <Card>
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Risk Breakdown</h3>
            
            <div className="space-y-4">
              {Object.entries(overview.riskBreakdown).map(([key, data]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{data.value}%</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        data.severity === 'high' ? 'bg-red-50 text-red-700' :
                        data.severity === 'medium' ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {getSeverityLabel(data.severity)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getSeverityColor(data.severity)}`}
                      style={{ width: `${data.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Risk Trend Chart */}
      <Card>
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Risk Trend (Last 30 Days)</h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={overview.riskTrendSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [value.toFixed(0), 'Risk Score']}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line type="monotone" dataKey="riskScore" stroke="#f59e0b" strokeWidth={2} dot={false} />
              
              {/* Add markers for events */}
              {overview.riskTrendSeries.filter(d => d.event).map((d, i) => (
                <ReferenceDot
                  key={i}
                  x={d.date}
                  y={d.riskScore}
                  r={6}
                  fill="#10b981"
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* Event Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
            {overview.riskTrendSeries.filter(d => d.event).map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span>{d.event}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Row 3: Top Findings + Monitoring Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Findings */}
        <Card>
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Top Findings</h3>
            
            {topFindings.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No critical findings detected</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topFindings.map((finding) => (
                  <button
                    key={finding.id}
                    onClick={() => onFindingClick(finding)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900 flex-1 pr-4">{finding.title}</p>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${
                        finding.severity === 'critical' ? 'bg-red-50 text-red-700' :
                        finding.severity === 'high' ? 'bg-orange-50 text-orange-700' :
                        finding.severity === 'medium' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {finding.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip label={finding.surface} />
                      <span className="text-xs text-gray-500">{finding.confidence}% confidence</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Monitoring Status */}
        <Card>
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Monitoring Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Monitoring</span>
                <div className="flex items-center gap-2">
                  {overview.monitoring.enabled ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">Enabled</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold text-amber-700">Disabled</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Scan Cadence</span>
                <span className="text-sm font-semibold text-gray-900 capitalize">{overview.monitoring.cadence}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Last Scan</span>
                <span className="text-sm font-semibold text-gray-900">
                  {overview.monitoring.lastScan.toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Drift Detected</span>
                <span className={`text-sm font-semibold ${
                  overview.monitoring.driftDetected ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  {overview.monitoring.driftDetected ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigate(`/scans/new?merchantId=${merchantId}`)}
                  className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Run New Scan
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


