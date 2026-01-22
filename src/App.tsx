import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { SidebarProvider } from './contexts/SidebarContext';
import { ModeProvider } from './contexts/ModeContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ProvidersProvider } from './state/providersStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ApiKeysModal } from './components/ApiKeysModal';
import { FloatingScansIndicator } from './components/scans/FloatingScansIndicator';
import { DarkGradientBackground } from './components/ui/DarkGradientBackground';
import { DashboardLiquidGlassTheme } from './theme/DashboardLiquidGlassTheme';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { Dashboard } from './pages/Dashboard';
import { Merchants } from './pages/Merchants';
import { Merchant360 } from './pages/Merchant360';
import { Scans } from './pages/Scans';
import { ScanNew } from './pages/ScanNew';
import { ScanReport } from './pages/ScanReport';
import { Transactions } from './pages/Transactions';
import { TransactionsGenerateFromScanPage } from './pages/TransactionsGenerateFromScanPage';
import { Policies } from './pages/Policies';
import { PolicyPackDetail } from './pages/PolicyPackDetail';
import { Providers } from './pages/Providers';
import { ProviderDetail } from './pages/ProviderDetail';
import { PaymentProvidersPage } from './pages/PaymentProvidersPage';
import { Developers } from './pages/Developers';
import SdkDemo from './pages/SdkDemo';
import ApiConsole from './pages/ApiConsole';
import Demo from './pages/Demo';
import DemoLab from './pages/DemoLab';
import Categories from './pages/Categories';
import { UiModules } from './pages/UiModules';
import ProviderCategoriesCMS from './pages/ProviderCategoriesCMS';
import { useSidebar } from './contexts/SidebarContext';

function AppContent() {
  const { collapsed } = useSidebar();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [timeRange, setTimeRange] = useState('7');

  // Determine page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/merchants')) return 'Merchants';
    if (path.startsWith('/categories')) return 'Categories';
    if (path.startsWith('/scans')) return 'Scans';
    if (path.startsWith('/transactions')) return 'Transactions';
    if (path.startsWith('/policies')) return 'Policies';
    if (path.startsWith('/providers')) return 'Providers';
    if (path.startsWith('/payment-providers')) return 'Payment Providers';
    if (path.startsWith('/developers')) return 'Developers';
    if (path.startsWith('/sdk-demo')) return 'SDK Demo';
    if (path.startsWith('/api-playground')) return 'API Playground';
    if (path.startsWith('/demo')) return 'Demo';
    if (path.startsWith('/ui-modules')) return 'UI Modules';
    return 'Revelius';
  };

  // Check if we're on an auth page (no sidebar/header)
  const isAuthPage = location.pathname.startsWith('/auth');

  const renderContent = () => (
    <>
      <Routes>
        {/* Public auth routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected app routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                {/* Dark mode animated gradient background - z-index 0, behind everything */}
                <DarkGradientBackground intensity="normal" />
                
                {/* API Keys Modal - needs high z-index */}
                <ApiKeysModal />
                
                {/* Sidebar - z-index 40 (from Sidebar component) */}
                <Sidebar />
                
                {/* Global Header */}
                <div 
                  className={`fixed top-0 transition-all duration-300 z-30 ${
                    collapsed ? 'left-20' : 'left-64'
                  }`}
                  style={{ right: 0 }}
                >
                  <Header 
                    title={getPageTitle()} 
                    timeRange={timeRange} 
                    onTimeRangeChange={setTimeRange}
                    glassTheme={darkMode}
                    onThemeToggle={toggleDarkMode}
                  />
                </div>
                
                {/* Main content area - no z-index to allow modals independent stacking */}
                <main 
                  className={`absolute overflow-y-auto overflow-x-hidden transition-all duration-300 max-w-full ${
                    collapsed ? 'left-20' : 'left-64'
                  }`}
                  style={{ top: '73px', bottom: 0, right: 0 }}
                >
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/merchants" element={<Merchants />} />
                    <Route path="/merchants/:id" element={<Merchant360 />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/scans" element={<Scans />} />
                    <Route path="/scans/new" element={<ScanNew />} />
                    <Route path="/scans/:id" element={<ScanReport />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/transactions/generate-from-scan/:sessionId" element={<TransactionsGenerateFromScanPage />} />
                    <Route path="/policies" element={<Policies />} />
                    <Route path="/policies/:packId" element={<PolicyPackDetail />} />
                    <Route path="/providers" element={<Providers />} />
                    <Route path="/providers/:id" element={<ProviderDetail />} />
                    <Route path="/payment-providers" element={<PaymentProvidersPage />} />
                    <Route path="/developers" element={<Developers />} />
                    <Route path="/sdk-demo" element={<SdkDemo />} />
                    <Route path="/api-playground" element={<ApiConsole />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/demo-lab" element={<DemoLab />} />
                    <Route path="/ui-modules" element={<UiModules />} />
                    <Route path="/cms/provider-categories" element={<ProviderCategoriesCMS />} />
                  </Routes>
                </main>
                
                {/* Global Floating Scan Indicator */}
                <FloatingScansIndicator />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );

  return (
    <div className="relative w-full h-screen overflow-x-hidden">
      {darkMode ? (
        <DashboardLiquidGlassTheme>
          {renderContent()}
        </DashboardLiquidGlassTheme>
      ) : (
        renderContent()
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ModeProvider>
          <SidebarProvider>
            <ProvidersProvider>
              <AppContent />
            </ProvidersProvider>
          </SidebarProvider>
        </ModeProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

