import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SignalCoverageDataPoint } from '../demo/dashboardMetrics';
import { Card } from './Card';

interface SignalCoverageChartProps {
  data: SignalCoverageDataPoint[];
}

export function SignalCoverageChart({ data }: SignalCoverageChartProps) {
  return (
    <Card title="Risk signal coverage over time">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #f3f4f6',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="websiteContent"
            stackId="1"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.8}
            name="Website content"
          />
          <Area
            type="monotone"
            dataKey="checkoutFlow"
            stackId="1"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.8}
            name="Checkout flow"
          />
          <Area
            type="monotone"
            dataKey="ugc"
            stackId="1"
            stroke="#ec4899"
            fill="#ec4899"
            fillOpacity={0.8}
            name="UGC"
          />
          <Area
            type="monotone"
            dataKey="productCatalog"
            stackId="1"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.8}
            name="Product catalog"
          />
          <Area
            type="monotone"
            dataKey="claimsLanguage"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.8}
            name="Claims/language"
          />
          <Area
            type="monotone"
            dataKey="geoLicensing"
            stackId="1"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.8}
            name="Geo/licensing"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
