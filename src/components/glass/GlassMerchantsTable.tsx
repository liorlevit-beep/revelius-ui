import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MerchantAlert } from '../../demo/dashboardMetrics';
import { GlassChartWrapper } from './GlassChartWrapper';
import { SortableTableHeader } from '../SortableTableHeader';
import { useTableSort } from '../../hooks/useTableSort';

interface GlassMerchantsTableProps {
  merchants: MerchantAlert[];
}

export function GlassMerchantsTable({ merchants }: GlassMerchantsTableProps) {
  const navigate = useNavigate();
  
  const { sortedData: sortedMerchants, requestSort, sortConfig, getSortIndicator } = useTableSort(merchants, {
    key: 'riskScore',
    direction: 'desc',
  });

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (score >= 70) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-emerald-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <GlassChartWrapper title="Merchants needing attention">
      <div className="overflow-x-auto overflow-y-auto -mx-6" style={{ maxHeight: 'calc(100vh - 420px)' }}>
        <table className="w-full table-fixed">
          <thead className="backdrop-blur-sm border-b sticky top-0 z-10" style={{ 
            backgroundColor: 'rgba(30, 27, 75, 0.6)',
            borderColor: 'var(--glass-border)'
          }}>
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
              <th className="text-left text-xs font-medium uppercase tracking-wider py-3 px-3" style={{ color: 'var(--color-silver-mist-dim)' }}>
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
              <th className="text-left text-xs font-medium uppercase tracking-wider py-3 px-6" style={{ color: 'var(--color-silver-mist-dim)' }}>
                Top Triggers
              </th>
            </tr>
          </thead>
          <tbody style={{ borderColor: 'var(--glass-border)' }}>
            {sortedMerchants.map((merchant) => (
              <tr
                key={merchant.id}
                className="group relative cursor-pointer transition-all duration-150 active:scale-[0.998] border-b"
                style={{ 
                  borderColor: 'var(--glass-border)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => navigate(`/merchants/${merchant.id}`)}
              >
                <td className="py-4 px-6">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-silver-mist)' }}>
                      {merchant.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-silver-mist-dim)' }}>
                      {merchant.id}
                    </p>
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
                  <span className="text-sm" style={{ color: 'var(--color-silver-mist-dim)' }}>
                    {merchant.lastScan}
                  </span>
                </td>
                <td className="py-4 px-3">
                  <span className="text-sm font-semibold text-emerald-400">{merchant.estUplift}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1.5">
                    {merchant.triggers.slice(0, 3).map((trigger, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10"
                        style={{ color: 'var(--color-silver-mist-dim)' }}
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
    </GlassChartWrapper>
  );
}
