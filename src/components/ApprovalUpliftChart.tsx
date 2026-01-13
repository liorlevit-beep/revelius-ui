import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { TimeSeriesDataPoint } from '../demo/dashboardMetrics';
import { Card } from './Card';

interface ApprovalUpliftChartProps {
  data: TimeSeriesDataPoint[];
}

export function ApprovalUpliftChart({ data }: ApprovalUpliftChartProps) {
  const routingEnabledIndex = data.findIndex((d) => d.routingEnabled);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-100 rounded-xl shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-2">{data.date}</p>
          <div className="space-y-1.5">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-400"></span>
              <span className="font-medium">Baseline:</span> {data.baseline.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="font-medium">Optimized:</span> {data.optimized.toFixed(1)}%
            </p>
            {data.note && (
              <p className="text-xs text-emerald-600 mt-2 pt-2 border-t border-gray-100 font-medium">
                {data.note}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Approval uplift over time">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            domain={[75, 90]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          {routingEnabledIndex !== -1 && (
            <ReferenceLine
              x={data[routingEnabledIndex].date}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ 
                value: 'Routing enabled', 
                position: 'top', 
                fill: '#f59e0b', 
                fontSize: 12,
                fontWeight: 600,
              }}
            />
          )}
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
    </Card>
  );
}
