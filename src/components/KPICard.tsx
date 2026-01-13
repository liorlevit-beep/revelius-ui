import { TrendingUp, TrendingDown } from 'lucide-react';
import type { KPI } from '../demo/dashboardMetrics';

interface KPICardProps {
  kpi: KPI;
}

export function KPICard({ kpi }: KPICardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
      <p className="text-sm font-medium text-gray-500 mb-3">{kpi.label}</p>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">{kpi.value}</span>
        {kpi.delta && (
          <span
            className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${
              kpi.deltaType === 'positive' 
                ? 'text-emerald-700 bg-emerald-50' 
                : 'text-red-700 bg-red-50'
            }`}
          >
            {kpi.deltaType === 'positive' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {kpi.delta}
          </span>
        )}
      </div>
    </div>
  );
}
