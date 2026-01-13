import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, GitCompare, CheckSquare, Square } from 'lucide-react';
import { Card } from '../Card';
import type { ScanSummary } from './types';

interface ScansTabProps {
  merchantId: string;
  scans: ScanSummary[];
}

export function ScansTab({ merchantId, scans }: ScansTabProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'onboarding' | 'scheduled' | 'manual'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'partial' | 'failed'>('all');
  const [selectedScans, setSelectedScans] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);

  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const matchesSearch =
        searchQuery === '' ||
        scan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scan.url.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || scan.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || scan.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [scans, searchQuery, typeFilter, statusFilter]);

  const handleToggleScan = (scanId: string) => {
    const newSelected = new Set(selectedScans);
    if (newSelected.has(scanId)) {
      newSelected.delete(scanId);
    } else {
      if (newSelected.size >= 2) {
        // Only allow 2 selections
        return;
      }
      newSelected.add(scanId);
    }
    setSelectedScans(newSelected);
  };

  const handleCompare = () => {
    if (selectedScans.size === 2) {
      setShowComparison(true);
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700';
      case 'partial':
        return 'bg-amber-50 text-amber-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'onboarding':
        return 'bg-blue-50 text-blue-700';
      case 'scheduled':
        return 'bg-purple-50 text-purple-700';
      case 'manual':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  // Mock comparison data
  const comparisonData = useMemo(() => {
    if (selectedScans.size !== 2) return null;
    
    const scanIds = Array.from(selectedScans);
    const scan1 = scans.find(s => s.id === scanIds[0]);
    const scan2 = scans.find(s => s.id === scanIds[1]);
    
    if (!scan1 || !scan2) return null;

    return {
      scan1,
      scan2,
      riskScoreChange: scan2.riskScore - scan1.riskScore,
      newFindings: ['New health claim detected', 'Missing license information added'],
      resolvedFindings: ['Checkout disclosure fixed'],
      changedFindings: ['Subscription terms updated'],
    };
  }, [selectedScans, scans]);

  return (
    <div className="p-6 space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by scan ID or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="onboarding">Onboarding</option>
            <option value="scheduled">Scheduled</option>
            <option value="manual">Manual</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="partial">Partial</option>
            <option value="failed">Failed</option>
          </select>

          <div className="ml-auto flex items-center gap-3">
            {selectedScans.size === 2 && (
              <button
                onClick={handleCompare}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                <GitCompare className="w-4 h-4" />
                Compare Scans
              </button>
            )}
            <button
              onClick={() => navigate(`/scans/new?merchantId=${merchantId}`)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Scan
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Showing {filteredScans.length} scans
          {selectedScans.size > 0 && ` • ${selectedScans.size} selected for comparison`}
        </p>
      </div>

      {/* Scans Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 w-8">
                  {/* Checkbox column */}
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Timestamp
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Type
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Pages
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Risk Score
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Delta Summary
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredScans.map((scan) => (
                <tr
                  key={scan.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleScan(scan.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {selectedScans.has(scan.id) ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span className="text-sm text-gray-900">{getRelativeTime(scan.timestamp)}</span>
                      <br />
                      <span className="text-xs text-gray-500" title={scan.timestamp.toLocaleString()}>
                        {scan.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold capitalize ${getTypeColor(scan.type)}`}>
                      {scan.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(scan.status)}`}>
                      {scan.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">{scan.pagesScanned}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                        scan.riskScore >= 80 ? 'bg-red-50 text-red-700' :
                        scan.riskScore >= 60 ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {scan.riskScore}
                      </span>
                      {scan.riskDelta !== 0 && (
                        <span className={`text-xs font-medium ${scan.riskDelta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {scan.riskDelta > 0 ? '+' : ''}{scan.riskDelta}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{scan.deltaSummary}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/scans/${scan.id}`)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Comparison Modal */}
      {showComparison && comparisonData && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-8"
          onClick={() => setShowComparison(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 border-b border-gray-100 px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-900">Scan Comparison</h2>
              <p className="text-sm text-gray-600 mt-1">
                Comparing {comparisonData.scan1.id} vs {comparisonData.scan2.id}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
              {/* Risk Score Change */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Risk Score Change</h3>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">{comparisonData.scan1.riskScore}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-2xl font-bold text-gray-900">{comparisonData.scan2.riskScore}</span>
                  <span className={`text-lg font-semibold ${
                    comparisonData.riskScoreChange > 0 ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {comparisonData.riskScoreChange > 0 ? '+' : ''}{comparisonData.riskScoreChange}
                  </span>
                </div>
              </div>

              {/* New Findings */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">New Findings</h3>
                <ul className="space-y-2">
                  {comparisonData.newFindings.map((finding, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resolved Findings */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Resolved Findings</h3>
                <ul className="space-y-2">
                  {comparisonData.resolvedFindings.map((finding, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Changed Findings */}
              {comparisonData.changedFindings.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Changed Findings</h3>
                  <ul className="space-y-2">
                    {comparisonData.changedFindings.map((finding, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-100 px-8 py-4 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setShowComparison(false)}
                className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


