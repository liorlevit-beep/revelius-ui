import { useState, useMemo, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Columns3, Loader2, AlertCircle } from 'lucide-react';
import { saveTableState, getTableState } from '../../utils/tableStorage';

export interface Column<T = any> {
  id: string;
  header: string;
  accessor: (row: T) => any;
  cell?: (row: T) => ReactNode;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface SmartTableProps<T = any> {
  tableId: string;
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  rowClassName?: (row: T, index: number) => string;
  defaultPageSize?: number;
  stickyHeader?: boolean;
  maxHeight?: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  columnId: string;
  direction: SortDirection;
}

export function SmartTable<T = any>({
  tableId,
  columns: initialColumns,
  data,
  loading = false,
  error = null,
  emptyMessage = 'No data found',
  onRowClick,
  rowClassName,
  defaultPageSize = 25,
  stickyHeader = true,
  maxHeight = 'calc(100vh - 280px)',
}: SmartTableProps<T>) {
  const tableState = getTableState(tableId);
  
  // Column widths
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    tableState.columnWidths || {}
  );
  
  // Column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    tableState.columnVisibility || 
    initialColumns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  
  // Sorting
  const [sortState, setSortState] = useState<SortState>({ columnId: '', direction: null });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(tableState.pageSize || defaultPageSize);
  
  // Column menu
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const columnMenuRef = useRef<HTMLDivElement>(null);
  
  // Resizing
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

  // Visible columns
  const visibleColumns = useMemo(
    () => initialColumns.filter(col => columnVisibility[col.id]),
    [initialColumns, columnVisibility]
  );

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortState.columnId || !sortState.direction) return data;

    const column = initialColumns.find(col => col.id === sortState.columnId);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aVal = column.accessor(a);
      const bVal = column.accessor(b);

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;

      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortState, initialColumns]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sort
  const handleSort = (columnId: string) => {
    const column = initialColumns.find(col => col.id === columnId);
    if (!column?.sortable) return;

    setSortState(prev => {
      if (prev.columnId !== columnId) {
        return { columnId, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { columnId, direction: 'desc' };
      }
      return { columnId: '', direction: null };
    });
    setCurrentPage(1);
  };

  // Handle column resize
  const handleResizeStart = (columnId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(columnId);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = columnWidths[columnId] || initialColumns.find(c => c.id === columnId)?.width || 150;
  };

  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizeStartX.current;
      const newWidth = Math.max(80, resizeStartWidth.current + delta);
      setColumnWidths(prev => {
        const updated = { ...prev, [resizingColumn]: newWidth };
        saveTableState(tableId, { columnWidths: updated });
        return updated;
      });
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, tableId]);

  // Handle column visibility toggle
  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility(prev => {
      const updated = { ...prev, [columnId]: !prev[columnId] };
      saveTableState(tableId, { columnVisibility: updated });
      return updated;
    });
  };

  // Close column menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target as Node)) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update page size
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    saveTableState(tableId, { pageSize: newSize });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mr-3" />
          <span className="text-gray-600">Loading...</span>
        </div>
        <div className="animate-pulse space-y-2 p-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <p className="text-gray-600 mb-2">{emptyMessage}</p>
        <p className="text-gray-400 text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {sortedData.length} {sortedData.length === 1 ? 'result' : 'results'}
        </div>
        
        <div className="relative" ref={columnMenuRef}>
          <button
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center gap-2"
          >
            <Columns3 className="w-4 h-4" />
            Columns
          </button>
          
          {showColumnMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2 animate-fade-in">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Show/Hide Columns
              </div>
              {initialColumns.map(col => (
                <label
                  key={col.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={columnVisibility[col.id]}
                    onChange={() => toggleColumnVisibility(col.id)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{col.header}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto" style={{ maxHeight }}>
        <table className="w-full">
          <thead
            className={`${
              stickyHeader ? 'sticky top-0 z-10 backdrop-blur-sm bg-white/95' : 'bg-gray-50'
            } border-b border-gray-100`}
          >
            <tr>
              {visibleColumns.map((column) => {
                const width = columnWidths[column.id] || column.width || 150;
                const isSorted = sortState.columnId === column.id;
                
                return (
                  <th
                    key={column.id}
                    style={{ width, minWidth: column.minWidth, maxWidth: column.maxWidth }}
                    className="relative group"
                  >
                    <div
                      onClick={() => column.sortable !== false && handleSort(column.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                        column.sortable !== false ? 'cursor-pointer hover:text-gray-700' : ''
                      } transition-colors`}
                    >
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {column.header}
                      </span>
                      
                      {column.sortable !== false && (
                        <span className="flex-shrink-0">
                          {isSorted ? (
                            sortState.direction === 'asc' ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                          )}
                        </span>
                      )}
                    </div>
                    
                    {/* Resize Handle */}
                    <div
                      onMouseDown={(e) => handleResizeStart(column.id, e)}
                      className="absolute right-0 top-0 bottom-0 w-1 hover:w-2 cursor-col-resize hover:bg-emerald-500 transition-all opacity-0 group-hover:opacity-100"
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-50">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row, rowIndex)}
                className={`
                  group relative transition-all duration-150
                  hover:bg-gray-50 hover:scale-[0.995]
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${rowClassName?.(row, rowIndex) || ''}
                `}
              >
                {/* Hover accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {visibleColumns.map((column) => {
                  const value = column.accessor(row);
                  const content = column.cell ? column.cell(row) : value;
                  
                  return (
                    <td
                      key={column.id}
                      className={`px-4 py-3 text-sm ${column.className || ''}`}
                      style={{
                        textAlign: column.align || 'left',
                      }}
                    >
                      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {content}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
            </span>
            
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
