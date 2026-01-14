/**
 * Table state persistence utilities
 */

export interface TableState {
  columnWidths?: Record<string, number>;
  columnVisibility?: Record<string, boolean>;
  pageSize?: number;
}

export function saveTableState(tableId: string, state: Partial<TableState>): void {
  try {
    const existing = getTableState(tableId);
    const updated = { ...existing, ...state };
    localStorage.setItem(`table_${tableId}`, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save table state:', error);
  }
}

export function getTableState(tableId: string): TableState {
  try {
    const stored = localStorage.getItem(`table_${tableId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load table state:', error);
  }
  return {};
}

export function clearTableState(tableId: string): void {
  try {
    localStorage.removeItem(`table_${tableId}`);
  } catch (error) {
    console.warn('Failed to clear table state:', error);
  }
}
