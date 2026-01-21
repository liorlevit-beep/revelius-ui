import { useState } from 'react';
import { KPICard } from '../components/KPICard';
import { ApprovalUpliftChart } from '../components/ApprovalUpliftChart';
import { ChargebackChart } from '../components/ChargebackChart';
import { RoutingDistributionChart } from '../components/RoutingDistributionChart';
import { SignalCoverageChart } from '../components/SignalCoverageChart';
import { MerchantsTable } from '../components/MerchantsTable';
import { RoutingCanvas } from '../components/routing/RoutingCanvas';
import { NewScanModal } from '../components/scans/NewScanModal';
import { useMode } from '../contexts/ModeContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { GlassPanel } from '../components/glass/GlassPanel';
import { GlassApprovalUpliftChart } from '../components/glass/GlassApprovalUpliftChart';
import { GlassChargebackChart } from '../components/glass/GlassChargebackChart';
import { GlassRoutingDistributionChart } from '../components/glass/GlassRoutingDistributionChart';
import { GlassSignalCoverageChart } from '../components/glass/GlassSignalCoverageChart';
import { GlassMerchantsTable } from '../components/glass/GlassMerchantsTable';
import {
  kpis,
  timeSeries,
  routingDistributionBeforeAfter,
  signalCoverageSeries,
  merchantsNeedingAttention,
} from '../demo/dashboardMetrics';

// Feature flag for A/B testing
const DASHBOARD_LIQUID_GLASS = true;

export function Dashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { mode } = useMode();

  const currentTimeSeries = timeSeries[timeRange];
  const currentSignalCoverage = signalCoverageSeries[timeRange];

  const handleScanSuccess = (sessionId: string) => {
    // Navigate to scan detail page
    navigate(`/scans/${sessionId}`);
  };

  // Original Dashboard (Light Mode)
  if (!darkMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-transparent">
        <div className="p-8 space-y-8">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {kpis.map((kpi, idx) => (
              <KPICard key={idx} kpi={kpi} />
            ))}
          </div>

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
        </div>

        {/* New Scan Modal */}
        <NewScanModal 
          isOpen={isNewScanModalOpen}
          onClose={() => setIsNewScanModalOpen(false)}
          onSuccess={handleScanSuccess}
        />
      </div>
    );
  }

  // Liquid Glass Theme Dashboard (Dark Mode)
  return (
    <div className="min-h-screen relative bg-transparent">
      <div className="relative z-10 p-8 space-y-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {kpis.map((kpi, idx) => (
            <GlassPanel key={idx} variant="soft" shimmer={idx < 2}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-silver-mist-dim)' }}>
                    {kpi.label}
                  </span>
                  {kpi.change && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      kpi.change.startsWith('+') 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {kpi.change}
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--color-silver-mist)' }}>
                  {kpi.value}
                </div>
                {kpi.subtitle && (
                  <div className="text-xs mt-2" style={{ color: 'var(--color-silver-mist-dim)' }}>
                    {kpi.subtitle}
                  </div>
                )}
              </div>
            </GlassPanel>
          ))}
        </div>

        {/* Hero Routing Visualization - Only for Merchants mode */}
        {mode === 'merchants' && (
          <GlassPanel variant="strong">
            <div className="p-6 border-b" style={{ borderColor: 'var(--glass-border)' }}>
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-silver-mist)' }}>
                Intelligent Payment Routing
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--color-silver-mist-dim)' }}>
                Real-time routing optimization across your payment providers
              </p>
            </div>
            <div style={{ height: '600px' }}>
              <RoutingCanvas
                merchantName="Your Merchants"
                merchantCountry="Global"
                mode="merchant"
                height={600}
                glassTheme={true}
              />
            </div>
          </GlassPanel>
        )}

        {/* Hero Chart */}
        <GlassPanel variant="strong" shimmer>
          <GlassApprovalUpliftChart data={currentTimeSeries} />
        </GlassPanel>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel variant="soft">
            <GlassChargebackChart data={currentTimeSeries} />
          </GlassPanel>
          <GlassPanel variant="soft">
            <GlassRoutingDistributionChart data={routingDistributionBeforeAfter} />
          </GlassPanel>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel variant="soft">
            <GlassSignalCoverageChart data={currentSignalCoverage} />
          </GlassPanel>
          <GlassPanel variant="soft">
          <GlassMerchantsTable merchants={merchantsNeedingAttention} />
        </GlassPanel>
      </div>
    </div>

    {/* New Scan Modal */}
    <NewScanModal 
      isOpen={isNewScanModalOpen}
      onClose={() => setIsNewScanModalOpen(false)}
      onSuccess={handleScanSuccess}
    />
  </div>
  );
}
