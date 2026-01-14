import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SignalCoverageDataPoint } from '../../demo/dashboardMetrics';
import { GlassChartWrapper } from './GlassChartWrapper';

interface GlassSignalCoverageChartProps {
  data: SignalCoverageDataPoint[];
}

export function GlassSignalCoverageChart({ data }: GlassSignalCoverageChartProps) {
  return (
    <GlassChartWrapper title="Risk signal coverage over time">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(203, 213, 225, 0.2)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              color: '#cbd5e1',
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
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
            name="Website content"
          />
          <Area
            type="monotone"
            dataKey="checkoutFlow"
            stackId="1"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
            name="Checkout flow"
          />
          <Area
            type="monotone"
            dataKey="ugc"
            stackId="1"
            stroke="#ec4899"
            fill="#ec4899"
            fillOpacity={0.6}
            name="UGC"
          />
          <Area
            type="monotone"
            dataKey="productCatalog"
            stackId="1"
            stroke="#d97706"
            fill="#d97706"
            fillOpacity={0.6}
            name="Product catalog"
          />
          <Area
            type="monotone"
            dataKey="claimsLanguage"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Claims/language"
          />
          <Area
            type="monotone"
            dataKey="geoLicensing"
            stackId="1"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.6}
            name="Geo/licensing"
          />
        </AreaChart>
      </ResponsiveContainer>
    </GlassChartWrapper>
  );
}
