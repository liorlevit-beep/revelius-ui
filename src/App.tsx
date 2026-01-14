import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './contexts/SidebarContext';
import { ProvidersProvider } from './state/providersStore';
import { Sidebar } from './components/Sidebar';
import { ApiKeysModal } from './components/ApiKeysModal';
import { Dashboard } from './pages/Dashboard';
import { Merchants } from './pages/Merchants';
import { Merchant360 } from './pages/Merchant360';
import { Scans } from './pages/Scans';
import { ScanNew } from './pages/ScanNew';
import { ScanReport } from './pages/ScanReport';
import { Transactions } from './pages/Transactions';
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
import { useSidebar } from './contexts/SidebarContext';

function AppContent() {
  const { collapsed } = useSidebar();

  return (
    <div className="relative w-full h-screen overflow-x-hidden">
      <ApiKeysModal />
      <Sidebar />
      <main 
        className={`absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-300 max-w-full ${
          collapsed ? 'left-20' : 'left-64'
        }`}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/merchants" element={<Merchants />} />
          <Route path="/merchants/:id" element={<Merchant360 />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/scans" element={<Scans />} />
          <Route path="/scans/new" element={<ScanNew />} />
          <Route path="/scans/:id" element={<ScanReport />} />
          <Route path="/transactions" element={<Transactions />} />
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
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <SidebarProvider>
        <ProvidersProvider>
          <AppContent />
        </ProvidersProvider>
      </SidebarProvider>
    </Router>
  );
}

export default App;
