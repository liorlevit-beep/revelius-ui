/**
 * Scan Jobs Store
 * Manages running scan sessions with localStorage persistence
 */

export interface ScanJob {
  session_id: string;
  url: string;
  started_at: string; // ISO timestamp
  last_status?: string;
  last_update?: string; // ISO timestamp
  pages_crawled?: number;
  products_parsed?: number;
  media_items?: number;
}

const STORAGE_KEY = 'revelius:scanJobs';

class ScanJobsStore {
  private jobs: Map<string, ScanJob>;
  private listeners: Set<() => void>;

  constructor() {
    this.jobs = new Map();
    this.listeners = new Set();
    this.loadFromStorage();
  }

  /**
   * Load jobs from localStorage
   */
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.jobs = new Map(Object.entries(data));
      }
    } catch (err) {
      console.error('Failed to load scan jobs from storage:', err);
    }
  }

  /**
   * Save jobs to localStorage
   */
  private saveToStorage() {
    try {
      const data = Object.fromEntries(this.jobs);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save scan jobs to storage:', err);
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
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Add a new scan job
   */
  addJob(job: ScanJob) {
    this.jobs.set(job.session_id, {
      ...job,
      started_at: job.started_at || new Date().toISOString(),
      last_update: new Date().toISOString(),
    });
    this.saveToStorage();
    this.notify();
  }

  /**
   * Update an existing job
   */
  updateJob(session_id: string, updates: Partial<ScanJob>) {
    const existing = this.jobs.get(session_id);
    if (existing) {
      this.jobs.set(session_id, {
        ...existing,
        ...updates,
        last_update: new Date().toISOString(),
      });
      this.saveToStorage();
      this.notify();
    }
  }

  /**
   * Remove a completed/failed job
   */
  removeJob(session_id: string) {
    this.jobs.delete(session_id);
    this.saveToStorage();
    this.notify();
  }

  /**
   * Get a specific job
   */
  getJob(session_id: string): ScanJob | undefined {
    return this.jobs.get(session_id);
  }

  /**
   * Get all active jobs
   */
  listJobs(): ScanJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Get count of active jobs
   */
  getCount(): number {
    return this.jobs.size;
  }

  /**
   * Clear all jobs (for cleanup/debugging)
   */
  clearAll() {
    this.jobs.clear();
    this.saveToStorage();
    this.notify();
  }
}

// Singleton instance
export const scanJobsStore = new ScanJobsStore();
