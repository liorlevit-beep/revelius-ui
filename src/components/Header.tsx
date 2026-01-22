import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, User, LogOut, ChevronDown } from 'lucide-react';
import { ScanActivityIndicator } from './scans/ScanActivityIndicator';

interface HeaderProps {
  title: string;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  glassTheme?: boolean;
  onThemeToggle?: () => void;
}

export function Header({ title, timeRange, onTimeRangeChange, glassTheme = false, onThemeToggle }: HeaderProps) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleSignOut() {
    // TODO: Implement sign out functionality
    navigate('/auth');
  }

  if (glassTheme) {
    return (
      <header 
        className="border-b px-8 py-5" 
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderColor: 'rgba(255, 255, 255, 0.18)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-silver-mist)' }}>{title}</h2>
            <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              Demo
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-lg transition-all hover:-translate-y-0.5 flex items-center justify-center group"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                <User className="w-5 h-5 text-gray-300" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl z-50"
                  style={{
                    background: 'rgba(17, 24, 39, 0.95)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-medium text-gray-200">Account</p>
                    <p className="text-xs text-gray-400">Signed in with Google</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="w-10 h-10 rounded-lg transition-all hover:-translate-y-0.5 flex items-center justify-center group"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
                title="Switch to Light Mode"
              >
                <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search merchants, domains, scan IDs…"
                className="pl-10 pr-4 py-2.5 w-96 rounded-xl text-sm transition-all text-gray-200 placeholder:text-gray-500"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
            
            {/* Scan Activity Indicator */}
            <ScanActivityIndicator />
            
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-gray-200 [&>option]:bg-gray-900 [&>option]:text-white"
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px) saturate(180%)',
                WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
      </header>
    );
  }
  
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg">
            Demo
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg transition-all hover:bg-gray-100 flex items-center justify-center"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Account</p>
                  <p className="text-xs text-gray-500">Signed in with Google</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          {onThemeToggle && (
            <button
              onClick={onThemeToggle}
              className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg transition-all hover:bg-gray-100 flex items-center justify-center group"
              title="Switch to Dark Mode"
            >
              <Moon className="w-5 h-5 text-gray-600 group-hover:rotate-[360deg] transition-transform duration-500" />
            </button>
          )}
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search merchants, domains, scan IDs…"
              className="pl-10 pr-4 py-2.5 w-96 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          
          {/* Scan Activity Indicator */}
          <ScanActivityIndicator />
          
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all cursor-pointer"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>
    </header>
  );
}
