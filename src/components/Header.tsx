import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, User, LogOut } from 'lucide-react';
import { ScanActivityIndicator } from './scans/ScanActivityIndicator';
import { stopTokenRefresh } from '../services/tokenRefresh';

interface HeaderProps {
  title: string;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  glassTheme?: boolean;
  onThemeToggle?: () => void;
}

export function Header({ title, timeRange, onTimeRangeChange, glassTheme = false, onThemeToggle }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    console.log('[Header] Signing out...');
    
    // Stop automatic token refresh
    stopTokenRefresh();
    
    // Clear auth data
    localStorage.removeItem('revelius_auth_token');
    localStorage.removeItem('revelius_refresh_token');
    localStorage.removeItem('revelius_auth_expires_at');
    
    // Redirect to login
    navigate('/auth');
  };

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
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-lg transition-all hover:-translate-y-0.5 flex items-center justify-center group"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
                title="User Menu"
              >
                <User className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </button>
              
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden shadow-2xl z-50"
                  style={{
                    background: 'rgba(30, 30, 40, 0.95)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-200 hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
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
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg transition-all hover:bg-gray-100 flex items-center justify-center group"
              title="User Menu"
            >
              <User className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl z-50">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
          
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
