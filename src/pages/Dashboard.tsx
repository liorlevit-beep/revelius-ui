import { useState } from 'react';
import { Header } from '../components/Header';
import { KPICard } from '../components/KPICard';
import { ApprovalUpliftChart } from '../components/ApprovalUpliftChart';
import { ChargebackChart } from '../components/ChargebackChart';
import { RoutingDistributionChart } from '../components/RoutingDistributionChart';
import { SignalCoverageChart } from '../components/SignalCoverageChart';
import { MerchantsTable } from '../components/MerchantsTable';
import {
  kpis,
  timeSeries,
  routingDistributionBeforeAfter,
  signalCoverageSeries,
  merchantsNeedingAttention,
} from '../demo/dashboardMetrics';

export function Dashboard() {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');

  const currentTimeSeries = timeSeries[timeRange];
  const currentSignalCoverage = signalCoverageSeries[timeRange];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" timeRange={timeRange} onTimeRangeChange={(range) => setTimeRange(range as '7' | '30' | '90')} />
      
      <main className="p-8 space-y-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {kpis.map((kpi, idx) => (
            <KPICard key={idx} kpi={kpi} />
          ))}
        </div>

        {/* Hero Chart */}
        <ApprovalUpliftChart data={currentTimeSeries} />

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChargebackChart data={currentTimeSeries} />
          <RoutingDistributionChart data={routingDistributionBeforeAfter} />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SignalCoverageChart data={currentSignalCoverage} />
          <MerchantsTable merchants={merchantsNeedingAttention} />
        </div>
      </main>
    </div>
  );
}
