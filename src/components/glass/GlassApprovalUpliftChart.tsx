import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { TimeSeriesDataPoint } from '../../demo/dashboardMetrics';
import { GlassChartWrapper } from './GlassChartWrapper';

interface GlassApprovalUpliftChartProps {
  data: TimeSeriesDataPoint[];
}

export function GlassApprovalUpliftChart({ data }: GlassApprovalUpliftChartProps) {
  const routingEnabledIndex = data.findIndex((d) => d.routingEnabled);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-gray-900/90 p-4 border border-white/20 rounded-xl shadow-2xl">
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-silver-mist)' }}>
            {data.date}
          </p>
          <div className="space-y-1.5">
            <p className="text-sm flex items-center gap-2" style={{ color: 'var(--color-silver-mist-dim)' }}>
              <span className="w-3 h-3 rounded-full bg-gray-400"></span>
              <span className="font-medium">Baseline:</span> {data.baseline.toFixed(1)}%
            </p>
            <p className="text-sm flex items-center gap-2" style={{ color: 'var(--color-silver-mist-dim)' }}>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="font-medium">Optimized:</span> {data.optimized.toFixed(1)}%
            </p>
            {data.note && (
              <p className="text-xs text-emerald-400 mt-2 pt-2 border-t border-white/10 font-medium">
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
    <GlassChartWrapper title="Approval uplift over time">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.1)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={{ stroke: 'rgba(203, 213, 225, 0.2)' }}
            tickLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            domain={[75, 90]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(203, 213, 225, 0.2)', strokeWidth: 1 }} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          {routingEnabledIndex !== -1 && (
            <ReferenceLine
              x={data[routingEnabledIndex].date}
              stroke="#d97706"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ 
                value: 'Routing enabled', 
                position: 'top', 
                fill: '#d97706', 
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
            stroke="#10b981"
            name="Optimized"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </GlassChartWrapper>
  );
}
