import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimeSeriesDataPoint } from '../../demo/dashboardMetrics';
import { GlassChartWrapper } from './GlassChartWrapper';

interface GlassChargebackChartProps {
  data: TimeSeriesDataPoint[];
}

export function GlassChargebackChart({ data }: GlassChargebackChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-gray-900/90 p-4 border border-white/20 rounded-xl shadow-2xl">
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-silver-mist)' }}>
            {data.date}
          </p>
          <p className="text-sm" style={{ color: 'var(--color-silver-mist-dim)' }}>
            <span className="font-medium">Chargeback rate:</span> {data.chargebackRate.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassChartWrapper title="Chargebacks over time">
      <ResponsiveContainer width="100%" height={300}>
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
            domain={[0.5, 0.8]}
            tickFormatter={(value) => `${value.toFixed(2)}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(203, 213, 225, 0.2)', strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="chargebackRate"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#ef4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </GlassChartWrapper>
  );
}
