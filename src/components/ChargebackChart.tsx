import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimeSeriesDataPoint } from '../demo/dashboardMetrics';
import { Card } from './Card';

interface ChargebackChartProps {
  data: TimeSeriesDataPoint[];
}

export function ChargebackChart({ data }: ChargebackChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-surface p-4 rounded-xl">
          <p className="text-sm font-semibold text-gray-900 mb-2">{data.date}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Chargeback rate:</span> {data.chargebackRate.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Chargebacks over time">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            {/* Gradient fill from line to bottom - subtle red */}
            <linearGradient id="chargebackGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
              <stop offset="50%" stopColor="#f87171" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#fca5a5" stopOpacity={0} />
            </linearGradient>
          </defs>
          
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
            domain={[0.5, 0.8]}
            tickFormatter={(value) => `${value.toFixed(2)}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="chargebackRate"
            stroke="none"
            fill="url(#chargebackGradient)"
            fillOpacity={1}
          />
          <Line
            type="monotone"
            dataKey="chargebackRate"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#ef4444' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}
