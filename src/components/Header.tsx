import { Search, Moon, Sun } from 'lucide-react';
import { ScanActivityIndicator } from './scans/ScanActivityIndicator';

interface HeaderProps {
  title: string;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  glassTheme?: boolean;
  onThemeToggle?: () => void;
}

export function Header({ title, timeRange, onTimeRangeChange, glassTheme = false, onThemeToggle }: HeaderProps) {
  if (glassTheme) {
    return (
      <header className="backdrop-blur-xl bg-white/[0.03] border-b px-8 py-5" style={{ borderColor: 'var(--glass-border)' }}>
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
                className="w-10 h-10 backdrop-blur-md bg-white/[0.05] border rounded-lg transition-all hover:bg-white/[0.08] flex items-center justify-center group"
                style={{ borderColor: 'var(--glass-border)' }}
                title="Switch to Light Mode"
              >
                <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-silver-mist-dim)' }} />
              <input
                type="text"
                placeholder="Search merchants, domains, scan IDs…"
                className="pl-10 pr-4 py-2.5 w-96 backdrop-blur-md bg-white/[0.05] border rounded-xl text-sm transition-all"
                style={{ 
                  borderColor: 'var(--glass-border)',
                  color: 'var(--color-silver-mist)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--glass-border)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
            
            {/* Scan Activity Indicator */}
            <ScanActivityIndicator />
            
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              className="px-4 py-2.5 backdrop-blur-md bg-white/[0.05] border rounded-xl text-sm font-medium transition-all cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white"
              style={{ 
                borderColor: 'var(--glass-border)',
                color: 'var(--color-silver-mist)',
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
