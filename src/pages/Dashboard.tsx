import { useState } from 'react';
import { Header } from '../components/Header';
import { KPICard } from '../components/KPICard';
import { ApprovalUpliftChart } from '../components/ApprovalUpliftChart';
import { ChargebackChart } from '../components/ChargebackChart';
import { RoutingDistributionChart } from '../components/RoutingDistributionChart';
import { SignalCoverageChart } from '../components/SignalCoverageChart';
import { MerchantsTable } from '../components/MerchantsTable';
import { RoutingCanvas } from '../components/routing/RoutingCanvas';
import { LiveScansStrip } from '../components/scans/LiveScansStrip';
import { NewScanModal } from '../components/scans/NewScanModal';
import { useMode } from '../contexts/ModeContext';
import { useNavigate } from 'react-router-dom';
import {
  kpis,
  timeSeries,
  routingDistributionBeforeAfter,
  signalCoverageSeries,
  merchantsNeedingAttention,
} from '../demo/dashboardMetrics';

export function Dashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState(false);
  const { mode } = useMode();

  const currentTimeSeries = timeSeries[timeRange];
  const currentSignalCoverage = signalCoverageSeries[timeRange];

  const handleScanSuccess = (sessionId: string) => {
    // Navigate to scan detail page
    navigate(`/scans/${sessionId}`);
  };

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

        {/* Live Scans Strip */}
        <LiveScansStrip onNewScan={() => setIsNewScanModalOpen(true)} />

        {/* Hero Routing Visualization - Only for Merchants mode */}
        {mode === 'merchants' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Intelligent Payment Routing</h2>
              <p className="text-sm text-gray-600 mt-1">Real-time routing optimization across your payment providers</p>
            </div>
            <div style={{ height: '600px' }}>
              <RoutingCanvas
                merchantName="Your Merchants"
                merchantCountry="Global"
                mode="merchant"
                height={600}
              />
            </div>
          </div>
        )}

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

      {/* New Scan Modal */}
      <NewScanModal 
        isOpen={isNewScanModalOpen}
        onClose={() => setIsNewScanModalOpen(false)}
        onSuccess={handleScanSuccess}
      />
    </div>
  );
}
