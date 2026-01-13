import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, ScanLine, CreditCard, FileText, Wallet, Code, ChevronLeft, ChevronRight, MoreVertical, Zap, Play, Sparkles } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Merchants', href: '/merchants', icon: Store },
  { name: 'Scans', href: '/scans', icon: ScanLine },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Policies', href: '/policies', icon: FileText },
  { name: 'Payment Providers', href: '/providers', icon: Wallet },
  { name: 'Developers', href: '/developers', icon: Code },
  { name: 'API Console', href: '/api-playground', icon: Play },
  { name: 'Demo', href: '/demo', icon: Sparkles },
];

export function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();

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
        {navigation.map((item) => (
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

      {/* User Profile Section */}
      <div className={`border-t border-gray-800 p-4 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          {/* Avatar */}
          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              DE
            </div>
            {/* Tooltip for collapsed state */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-950 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 top-1/2 -translate-y-1/2 shadow-lg">
                Demo User
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-950"></div>
              </div>
            )}
          </div>

          {/* User Info & Menu (only when expanded) */}
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Demo User</p>
                <p className="text-xs text-gray-400 truncate">demo@revelius.com</p>
              </div>
              <button 
                className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                title="User menu"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
