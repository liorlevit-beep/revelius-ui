import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RoutingDistribution } from '../demo/dashboardMetrics';
import { Card } from './Card';

interface RoutingDistributionChartProps {
  data: RoutingDistribution[];
}

export function RoutingDistributionChart({ data }: RoutingDistributionChartProps) {
  return (
    <Card title="Routing distribution (Before vs After)">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="route" 
            tick={{ fontSize: 12, fill: '#6b7280' }} 
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`} 
          />
          <Tooltip 
            formatter={(value) => `${value}%`}
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
          <Bar dataKey="before" fill="#cbd5e1" name="Before" radius={[8, 8, 0, 0]} />
          <Bar dataKey="after" fill="#22c55e" name="After" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
