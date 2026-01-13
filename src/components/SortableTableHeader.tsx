import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { SortDirection } from '../hooks/useTableSort';

interface SortableTableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: string | null;
  direction: SortDirection;
  onSort: (key: string) => void;
  align?: 'left' | 'center' | 'right';
}

export function SortableTableHeader({
  label,
  sortKey,
  currentSort,
  direction,
  onSort,
  align = 'left',
}: SortableTableHeaderProps) {
  const isActive = currentSort === sortKey;

  return (
    <th
      className={`px-4 py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 select-none group`}
      onClick={() => onSort(sortKey)}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}>
        <span>{label}</span>
        <span className="text-gray-400">
          {!isActive && (
            <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
          {isActive && direction === 'asc' && <ArrowUp className="w-3 h-3" />}
          {isActive && direction === 'desc' && <ArrowDown className="w-3 h-3" />}
        </span>
      </div>
    </th>
  );
}


