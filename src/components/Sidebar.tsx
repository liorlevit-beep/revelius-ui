import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Tags, ScanLine, CreditCard, FileText, Wallet, Code, ChevronLeft, ChevronRight, Layers, ChevronDown, Building2, ShoppingCart } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';
import { useMode } from '../contexts/ModeContext';
import { IridescentButton } from './ui/IridescentButton';

const navigationSections = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Operations',
    items: [
      { name: 'Merchants', href: '/merchants', icon: Store },
      { name: 'Categories', href: '/categories', icon: Tags },
      { name: 'Scans', href: '/scans', icon: ScanLine },
      { name: 'Transactions', href: '/transactions', icon: CreditCard },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { name: 'Policies', href: '/policies', icon: FileText },
      { name: 'Payment Providers', href: '/payment-providers', icon: Wallet },
    ],
  },
  {
    title: 'Development',
    items: [
      { name: 'Developers', href: '/developers', icon: Code },
      { name: 'ui-modules', href: '/ui-modules', icon: Layers },
    ],
  },
];

export function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();
  const { mode, setMode } = useMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  // Animation disabled for debugging
  // const [deselectingItem, setDeselectingItem] = useState<string | null>(null);
  // const [driveDirection, setDriveDirection] = useState<'up' | 'down' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const prevLocationRef = useRef(location.pathname);

  // Handle collapse animation
  useEffect(() => {
    if (collapsed) {
      setIsCollapsing(true);
      const timer = setTimeout(() => {
        setIsCollapsing(false);
      }, 150); // Match the label fade-out duration
      return () => clearTimeout(timer);
    }
  }, [collapsed]);

  // Animation disabled for debugging
  /*
  useEffect(() => {
    const prevPath = prevLocationRef.current;
    const currentPath = location.pathname;
    
    if (prevPath !== currentPath) {
      const allItems = navigationSections.flatMap(section => section.items);
      const prevItemIndex = allItems.findIndex(item => 
        item.href === prevPath || 
        (item.href !== '/' && prevPath.startsWith(item.href))
      );
      const newItemIndex = allItems.findIndex(item => 
        item.href === currentPath || 
        (item.href !== '/' && currentPath.startsWith(item.href))
      );
      
      if (prevItemIndex !== -1 && newItemIndex !== -1 && prevItemIndex !== newItemIndex) {
        const prevItem = allItems[prevItemIndex];
        const direction = newItemIndex > prevItemIndex ? 'down' : 'up';
        
        setDeselectingItem(prevItem.href);
        setDriveDirection(direction);
        
        const timer = setTimeout(() => {
          setDeselectingItem(null);
          setDriveDirection(null);
        }, 300);
        return () => clearTimeout(timer);
      }
      
      prevLocationRef.current = currentPath;
    }
  }, [location.pathname]);
  */

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

  // Filter navigation sections based on mode
  const filteredSections = navigationSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (mode === 'orchestrators') {
        // Show merchants tab, hide debug items
        return item.name !== 'ui-modules';
      } else {
        // Hide merchants tab and debug items
        return item.name !== 'Merchants' && item.name !== 'ui-modules';
      }
    }),
  })).filter(section => section.items.length > 0); // Remove empty sections

  return (
    <div 
      className={`bg-gray-900 dark:bg-gray-950/80 dark:backdrop-blur-xl border-r border-gray-800 dark:border-gray-700/50 h-screen fixed left-0 top-0 transition-all duration-300 z-40 flex flex-col overflow-y-auto ${
        collapsed ? 'w-20 overflow-x-hidden' : 'w-64'
      }`}
      style={collapsed ? undefined : { overflowX: 'visible' }}
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
      <nav 
        className={`py-4 space-y-1 flex-1 overflow-y-auto ${
          collapsed ? 'px-2 overflow-x-hidden' : 'px-5 overflow-x-visible'
        } ${isCollapsing ? 'sidebar-collapsing' : ''}`}
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        {filteredSections.map((section) => (
          <div 
            key={section.title} 
            className="space-y-1" 
            style={collapsed ? { overflow: 'hidden' } : { overflow: 'visible', padding: '2px' }}
          >
            {section.items.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href !== '/' && location.pathname.startsWith(item.href));
              // Animation disabled
              const showAsActive = isActive;
              
              return (
                <div 
                  key={item.name} 
                  className={`relative group ${collapsed ? 'flex justify-center' : ''}`}
                  style={collapsed ? { overflow: 'hidden' } : { overflow: 'visible' }}
                >
                  {collapsed ? (
                    <>
                      {/* Collapsed State - Icon Only Button with Iridescent Effect */}
                      <button
                        onClick={() => navigate(item.href)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex items-center justify-center relative overflow-hidden rounded-[10px] flex-shrink-0 ${
                          showAsActive
                            ? 'ir-btn-collapsed ir-btn-collapsed--active w-12 h-12'
                            : 'text-gray-300 w-12 h-12'
                        }`}
                        style={
                          showAsActive
                            ? {
                                background: 
                                  'linear-gradient(to bottom, hsl(257, 70%, 94%), hsl(257, 75%, 90%, 0.9) 33%, hsl(257, 65%, 97%, 0.9))',
                                backdropFilter: 'blur(12px) saturate(1.5) contrast(1.1)',
                                WebkitBackdropFilter: 'blur(12px) saturate(1.5) contrast(1.1)',
                                border: '1px solid transparent',
                                transformStyle: 'preserve-3d',
                              }
                            : undefined
                        }
                      >
                        {showAsActive && (
                          <>
                            <span className="ir-drop" aria-hidden="true" style={{
                              position: 'absolute',
                              inset: '-1px',
                              borderRadius: '10px',
                              translate: '0.2em 0.3em',
                              scale: '1.2 0.6',
                              background: 'linear-gradient(135deg, hsl(280, 85%, 88%), hsl(240, 75%, 92%))',
                              opacity: 1,
                              mask: 'radial-gradient(closest-side, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 100%, 0.987) 8.1%, hsla(0, 0%, 100%, 0.951) 15.5%, hsla(0, 0%, 100%, 0.896) 22.5%, hsla(0, 0%, 100%, 0.825) 29%, hsla(0, 0%, 100%, 0.741) 35.3%, hsla(0, 0%, 100%, 0.648) 41.2%, hsla(0, 0%, 100%, 0.55) 47.1%, hsla(0, 0%, 100%, 0.45) 52.9%, hsla(0, 0%, 100%, 0.352) 58.8%, hsla(0, 0%, 100%, 0.259) 64.7%, hsla(0, 0%, 100%, 0.175) 71%, hsla(0, 0%, 100%, 0.104) 77.5%, hsla(0, 0%, 100%, 0.049) 84.5%, hsla(0, 0%, 100%, 0.013) 91.9%, hsla(0, 0%, 100%, 0) 100%)',
                              zIndex: -1,
                              pointerEvents: 'none',
                            }} />
                            <span style={{
                              position: 'absolute',
                              inset: '-1px',
                              borderRadius: '10px',
                              background: 'linear-gradient(98deg, hsl(356, 100%, 65%) -5%, hsl(280, 95%, 60%) 20%, hsl(240, 100%, 70%) 40%, hsl(200, 100%, 75%) 70%, hsl(180, 95%, 70%) 160%)',
                              opacity: 0.6,
                              filter: 'blur(3px) brightness(1.3) contrast(1.7) saturate(1.6)',
                              mask: 'linear-gradient(166deg, transparent 60%, black)',
                              zIndex: 3,
                              pointerEvents: 'none',
                            }} aria-hidden="true" />
                          </>
                        )}
                        <span className="collapsed-icon-wrapper relative z-10">
                          <item.icon className="w-5 h-5 flex-shrink-0" style={showAsActive ? { color: '#0a0a0a' } : undefined} />
                        </span>
                      </button>
                      {/* Tooltip for collapsed state */}
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-950 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60] top-1/2 -translate-y-1/2 shadow-lg pointer-events-none">
                        {item.name}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-950"></div>
                      </div>
                    </>
                  ) : (
                    /* Expanded State - Iridescent Button */
                    <IridescentButton
                      active={showAsActive}
                      icon={<item.icon className="w-5 h-5" />}
                      onClick={() => navigate(item.href)}
                    >
                      {item.name}
                    </IridescentButton>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Mode Selector at Bottom */}
      <div className="border-t border-gray-800 p-3 flex-shrink-0" style={{ overflow: 'visible' }}>
        {collapsed ? (
          /* Collapsed State - Icon Only */
          <div className="relative group overflow-visible">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full p-2.5 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors flex items-center justify-center"
            >
              {mode === 'orchestrators' ? (
                <Building2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
              )}
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-950 text-white text-sm font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 top-1/2 -translate-y-1/2 shadow-lg">
              Revelius for {mode === 'orchestrators' ? 'Orchestrators' : 'Merchants'}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-950"></div>
            </div>

            {/* Dropdown for collapsed state */}
            {dropdownOpen && (
              <div className="absolute bottom-full left-full ml-2 mb-0 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50">
                <button
                  onClick={() => {
                    setMode('orchestrators');
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-750 transition-colors ${
                    mode === 'orchestrators' ? 'bg-gray-750' : ''
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">Payment Orchestrators</div>
                    <div className="text-xs text-gray-400 truncate">Manage merchant portfolios</div>
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
                  <ShoppingCart className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">Merchants</div>
                    <div className="text-xs text-gray-400 truncate">Optimize your payments</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Expanded State - Full Dropdown */
          <div ref={dropdownRef} className="relative min-w-0">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {mode === 'orchestrators' ? (
                  <Building2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <ShoppingCart className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-400">Revelius for</div>
                  <div className="text-sm font-semibold text-white truncate">
                    {mode === 'orchestrators' ? 'Payment Orchestrators' : 'Merchants'}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50">
                <button
                  onClick={() => {
                    setMode('orchestrators');
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-750 transition-colors ${
                    mode === 'orchestrators' ? 'bg-gray-750' : ''
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">Payment Orchestrators</div>
                    <div className="text-xs text-gray-400 truncate">Manage merchant portfolios</div>
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
                  <ShoppingCart className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">Merchants</div>
                    <div className="text-xs text-gray-400 truncate">Optimize your payments</div>
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
