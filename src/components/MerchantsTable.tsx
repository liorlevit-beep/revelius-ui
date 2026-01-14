import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MerchantAlert } from '../demo/dashboardMetrics';
import { Card } from './Card';
import { SortableTableHeader } from './SortableTableHeader';
import { useTableSort } from '../hooks/useTableSort';

interface MerchantsTableProps {
  merchants: MerchantAlert[];
}

export function MerchantsTable({ merchants }: MerchantsTableProps) {
  const navigate = useNavigate();
  
  const { sortedData: sortedMerchants, requestSort, sortConfig, getSortIndicator } = useTableSort(merchants, {
    key: 'riskScore',
    direction: 'desc',
  });

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'bg-red-50 text-red-700 border-red-100';
    if (score >= 70) return 'bg-orange-50 text-orange-700 border-orange-100';
    return 'bg-yellow-50 text-yellow-700 border-yellow-100';
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-emerald-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <Card title="Merchants needing attention">
      <div className="overflow-x-auto overflow-y-auto -mx-6" style={{ maxHeight: 'calc(100vh - 420px)' }}>
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
                label="Risk Score"
                sortKey="riskScore"
                currentSort={sortConfig?.key as string}
                direction={getSortIndicator('riskScore')}
                onSort={requestSort}
              />
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-3">
                Trend
              </th>
              <SortableTableHeader
                label="Last Scan"
                sortKey="lastScan"
                currentSort={sortConfig?.key as string}
                direction={getSortIndicator('lastScan')}
                onSort={requestSort}
              />
              <SortableTableHeader
                label="Est Uplift"
                sortKey="estUplift"
                currentSort={sortConfig?.key as string}
                direction={getSortIndicator('estUplift')}
                onSort={requestSort}
              />
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-6">
                Top Triggers
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedMerchants.map((merchant) => (
              <tr
                key={merchant.id}
                className="group relative hover:bg-gray-50/80 cursor-pointer transition-all duration-150 active:scale-[0.998]"
                onClick={() => navigate(`/merchants/${merchant.id}`)}
              >
                <td className="py-4 px-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{merchant.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{merchant.id}</p>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${getRiskScoreColor(
                      merchant.riskScore
                    )}`}
                  >
                    {merchant.riskScore}
                  </span>
                </td>
                <td className="py-4 px-3">
                  <TrendIcon trend={merchant.riskTrend} />
                </td>
                <td className="py-4 px-3">
                  <span className="text-sm text-gray-600">{merchant.lastScan}</span>
                </td>
                <td className="py-4 px-3">
                  <span className="text-sm font-semibold text-emerald-600">{merchant.estUplift}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1.5">
                    {merchant.triggers.slice(0, 3).map((trigger, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
