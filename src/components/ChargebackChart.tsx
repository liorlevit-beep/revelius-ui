import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
        <div className="bg-white p-4 border border-gray-100 rounded-xl shadow-lg">
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
            domain={[0.5, 0.8]}
            tickFormatter={(value) => `${value.toFixed(2)}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
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
    </Card>
  );
}
