import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, Tags, ScanLine, CreditCard, FileText, Wallet, Code, ChevronLeft, ChevronRight, Layers, ChevronDown, Building2, ShoppingCart } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';
import { useMode } from '../contexts/ModeContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Merchants', href: '/merchants', icon: Store },
  { name: 'Categories', href: '/categories', icon: Tags },
  { name: 'Scans', href: '/scans', icon: ScanLine },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Policies', href: '/policies', icon: FileText },
  { name: 'Payment Providers', href: '/payment-providers', icon: Wallet },
  { name: 'Developers', href: '/developers', icon: Code },
  { name: 'ui-modules', href: '/ui-modules', icon: Layers },
];

export function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();
  const { mode, setMode } = useMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  // Filter navigation based on mode
  const filteredNavigation = navigation.filter(item => {
    if (mode === 'orchestrators') {
      // Show merchants tab, hide others
      return item.name !== 'ui-modules'; // Keep all except debug items
    } else {
      // Hide merchants tab
      return item.name !== 'Merchants' && item.name !== 'ui-modules';
    }
  });

  return (
    <div 
      className={`bg-gray-900 border-r border-gray-800 h-screen fixed left-0 top-0 transition-all duration-300 z-30 flex flex-col overflow-x-hidden overflow-y-auto ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className={`p-6 flex items-center border-b border-gray-800 flex-shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <h1 className="text-xl font-bold text-white transition-opacity">
            Revelius
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1 flex-1 overflow-y-auto overflow-x-hidden">
        {filteredNavigation.map((item) => (
          <div key={item.name} className="relative group">
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="transition-opacity truncate">
                  {item.name}
                </span>
              )}
            </NavLink>
            {/* Tooltip for collapsed state */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-950 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60] top-1/2 -translate-y-1/2 shadow-lg pointer-events-none">
                {item.name}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-950"></div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mode Selector at Bottom */}
      <div className={`border-t border-gray-800 p-3 flex-shrink-0`}>
        {collapsed ? (
          /* Collapsed State - Icon Only */
          <div className="relative group">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full p-2.5 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors flex items-center justify-center"
            >
              {mode === 'orchestrators' ? (
                <Building2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
              )}
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-950 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 top-1/2 -translate-y-1/2 shadow-lg">
              Revelius for {mode === 'orchestrators' ? 'Orchestrators' : 'Merchants'}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-950"></div>
            </div>

            {/* Dropdown for collapsed state */}
            {dropdownOpen && (
              <div className="absolute bottom-full left-full ml-2 mb-0 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <button
                  onClick={() => {
                    setMode('orchestrators');
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-750 transition-colors ${
                    mode === 'orchestrators' ? 'bg-gray-750' : ''
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">Payment Orchestrators</div>
                    <div className="text-xs text-gray-400">Manage merchant portfolios</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setMode('merchants');
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-750 transition-colors ${
                    mode === 'merchants' ? 'bg-gray-750' : ''
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">Merchants</div>
                    <div className="text-xs text-gray-400">Optimize your payments</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Expanded State - Full Dropdown */
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                {mode === 'orchestrators' ? (
                  <Building2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                )}
                <div>
                  <div className="text-xs text-gray-400">Revelius for</div>
                  <div className="text-sm font-semibold text-white">
                    {mode === 'orchestrators' ? 'Payment Orchestrators' : 'Merchants'}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <button
                  onClick={() => {
                    setMode('orchestrators');
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-750 transition-colors ${
                    mode === 'orchestrators' ? 'bg-gray-750' : ''
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">Payment Orchestrators</div>
                    <div className="text-xs text-gray-400">Manage merchant portfolios</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setMode('merchants');
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-750 transition-colors ${
                    mode === 'merchants' ? 'bg-gray-750' : ''
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">Merchants</div>
                    <div className="text-xs text-gray-400">Optimize your payments</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
