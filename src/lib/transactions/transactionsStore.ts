import type { Transaction } from '../../demo/transactions';

const STORAGE_KEY = 'revelius:transactions';

/**
 * Transaction Store - Persistent storage for transactions
 */
class TransactionsStore {
  private transactions: Transaction[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.hydrate();
  }

  /**
   * Load transactions from localStorage
   */
  private hydrate() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert ISO date strings back to Date objects
        this.transactions = parsed.map((txn: any) => ({
          ...txn,
          createdAt: new Date(txn.createdAt),
        }));
      }
    } catch (error) {
      console.error('Failed to hydrate transactions from localStorage:', error);
      this.transactions = [];
    }
  }

  /**
   * Save transactions to localStorage
   */
  private persist() {
    try {
      const serialized = JSON.stringify(this.transactions);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to persist transactions to localStorage:', error);
    }
  }

  /**
   * Notify all listeners of state change
   */
  private notify() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Subscribe to store changes
   */
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get all transactions
   */
  list(): Transaction[] {
    return [...this.transactions];
  }

  /**
   * Get a transaction by ID
   */
  get(id: string): Transaction | undefined {
    return this.transactions.find(txn => txn.id === id);
  }

  /**
   * Add a new transaction
   */
  add(transaction: Transaction): void {
    this.transactions = [transaction, ...this.transactions];
    this.persist();
    this.notify();
  }

  /**
   * Update an existing transaction
   */
  update(transaction: Transaction): void {
    const index = this.transactions.findIndex(txn => txn.id === transaction.id);
    if (index !== -1) {
      this.transactions[index] = transaction;
      this.persist();
      this.notify();
    }
  }

  /**
   * Remove a transaction by ID
   */
  remove(id: string): void {
    this.transactions = this.transactions.filter(txn => txn.id !== id);
    this.persist();
    this.notify();
  }

  /**
   * Clear all transactions (for testing/reset)
   */
  clear(): void {
    this.transactions = [];
    this.persist();
    this.notify();
  }

  /**
   * Get count of transactions
   */
  count(): number {
    return this.transactions.length;
  }

  /**
   * Check if a transaction exists
   */
  has(id: string): boolean {
    return this.transactions.some(txn => txn.id === id);
  }
}

// Export singleton instance
export const transactionsStore = new TransactionsStore();

// Export type for convenience
export type { Transaction };
