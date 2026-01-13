import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { UpliftTimeSeries, UpliftBreakdown } from '../demo/transactions';

interface UpliftKpisProps {
  baselineRate: number;
  optimizedRate: number;
  uplift: number;
  incrementalApprovals: number;
  incrementalVolume: number;
  revenueUplift: number;
}

export function UpliftKpis({
  baselineRate,
  optimizedRate,
  uplift,
  incrementalApprovals,
  incrementalVolume,
  revenueUplift,
}: UpliftKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-1">Baseline Rate</p>
        <p className="text-2xl font-bold text-gray-900">{baselineRate.toFixed(1)}%</p>
      </div>
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-1">Optimized Rate</p>
        <p className="text-2xl font-bold text-emerald-600">{optimizedRate.toFixed(1)}%</p>
      </div>
      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
        <p className="text-xs font-medium text-emerald-600 mb-1">Uplift</p>
        <p className="text-2xl font-bold text-emerald-700">+{uplift.toFixed(1)}pp</p>
      </div>
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-1">Incremental Approvals</p>
        <p className="text-2xl font-bold text-gray-900">{incrementalApprovals}</p>
      </div>
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-1">Incremental Volume</p>
        <p className="text-2xl font-bold text-gray-900">${(incrementalVolume / 1000).toFixed(1)}K</p>
      </div>
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-1">Revenue Uplift</p>
        <p className="text-2xl font-bold text-emerald-600">${(revenueUplift / 1000).toFixed(1)}K</p>
      </div>
    </div>
  );
}

interface UpliftChartProps {
  data: UpliftTimeSeries[];
  showHourly?: boolean;
}

export function UpliftChart({ data, showHourly = false }: UpliftChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-xl shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {showHourly ? new Date(data.date).toLocaleTimeString() : data.date}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Baseline:</span> {data.baseline.toFixed(1)}%
            </p>
            <p className="text-sm text-emerald-700">
              <span className="font-medium">Optimized:</span> {data.optimized.toFixed(1)}%
            </p>
            <p className="text-sm font-bold text-emerald-600">
              Uplift: +{(data.optimized - data.baseline).toFixed(1)}pp
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        Approval Rate Over Time
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            tickFormatter={(value) => {
              if (showHourly) {
                const date = new Date(value);
                return date.getHours() + 'h';
              }
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            domain={[75, 92]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="#9ca3af"
            name="Baseline"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#9ca3af' }}
          />
          <Line
            type="monotone"
            dataKey="optimized"
            stroke="#22c55e"
            name="Optimized"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#22c55e' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface BreakdownTableProps {
  title: string;
  data: UpliftBreakdown[];
}

export function BreakdownTable({ title, data }: BreakdownTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">
                {title.includes('Country') ? 'Country' : 'Route'}
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                Baseline
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                Optimized
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                Uplift
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">
                Volume
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row) => (
              <tr key={row.label} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-6">
                  <span className="text-sm font-semibold text-gray-900">{row.label}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-gray-700">{row.baseline.toFixed(1)}%</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-semibold text-emerald-600">{row.optimized.toFixed(1)}%</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-bold text-emerald-700">+{row.uplift.toFixed(1)}pp</span>
                </td>
                <td className="py-3 px-6 text-right">
                  <span className="text-sm text-gray-700">{row.volume}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


