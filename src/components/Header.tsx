import { Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export function Header({ title, timeRange, onTimeRangeChange }: HeaderProps) {
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search merchants, domains, scan IDs…"
              className="pl-10 pr-4 py-2.5 w-96 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
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
