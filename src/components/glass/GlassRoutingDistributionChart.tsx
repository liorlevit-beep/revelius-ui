import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RoutingDistribution } from '../../demo/dashboardMetrics';
import { GlassChartWrapper } from './GlassChartWrapper';

interface GlassRoutingDistributionChartProps {
  data: RoutingDistribution[];
}

export function GlassRoutingDistributionChart({ data }: GlassRoutingDistributionChartProps) {
  return (
    <GlassChartWrapper title="Routing distribution (Before vs After)">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            {/* Cursor hover gradient - Dark mode - Bottom to top, fading to transparent */}
            <linearGradient id="cursorGradientDark" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#67e8f9" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.1)" vertical={false} />
          <XAxis 
            dataKey="route" 
            tick={{ fontSize: 12, fill: '#94a3b8' }} 
            axisLine={{ stroke: 'rgba(203, 213, 225, 0.2)' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#94a3b8' }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`} 
          />
          <Tooltip 
            formatter={(value) => `${value}%`}
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(203, 213, 225, 0.2)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              color: '#cbd5e1',
            }}
            cursor={{ fill: 'url(#cursorGradientDark)' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar dataKey="before" fill="#64748b" name="Before" radius={[8, 8, 0, 0]} />
          <Bar dataKey="after" fill="#10b981" name="After" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </GlassChartWrapper>
  );
}
