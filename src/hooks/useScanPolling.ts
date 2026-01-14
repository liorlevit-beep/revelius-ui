import { useEffect, useRef, useCallback } from 'react';
import { ScannerAPI } from '../api';
import { scanJobsStore } from '../lib/scans/scanJobsStore';

interface UseScanPollingOptions {
  sessionId: string;
  enabled?: boolean;
  onStatusChange?: (oldStatus: string | undefined, newStatus: string) => void;
  onComplete?: (sessionId: string) => void;
  onFailed?: (sessionId: string, error?: string) => void;
}

const INITIAL_POLL_INTERVAL = 4000; // 4 seconds
const BACKOFF_POLL_INTERVAL = 9000; // 9 seconds
const BACKOFF_THRESHOLD = 60000; // Switch to slower polling after 1 minute
const NO_UPDATE_WARNING_THRESHOLD = 20000; // 20 seconds
const SLOW_SCAN_WARNING_THRESHOLD = 75000; // 75 seconds

// Terminal statuses that indicate scan is done
const TERMINAL_STATUSES = [
  'completed',
  'success',
  'Scan Complete',
  'complete',
  'failed',
  'error',
  'Scan Error',
  'cancelled',
  'canceled',
];

export function useScanPolling({
  sessionId,
  enabled = true,
  onStatusChange,
  onComplete,
  onFailed,
}: UseScanPollingOptions) {
  const pollTimerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(Date.now());
  const lastStatusRef = useRef<string | undefined>();
  const lastSuccessfulPollRef = useRef<number>(Date.now());
  const isPollingRef = useRef(false);

  const isTerminalStatus = useCallback((status: string): boolean => {
    return TERMINAL_STATUSES.some(terminal => 
      status.toLowerCase().includes(terminal.toLowerCase())
    );
  }, []);

  const isSuccessStatus = useCallback((status: string): boolean => {
    const successStatuses = ['completed', 'success', 'Scan Complete', 'complete'];
    return successStatuses.some(success => 
      status.toLowerCase().includes(success.toLowerCase())
    );
  }, []);

  const isFailureStatus = useCallback((status: string): boolean => {
    const failureStatuses = ['failed', 'error', 'Scan Error'];
    return failureStatuses.some(failure => 
      status.toLowerCase().includes(failure.toLowerCase())
    );
  }, []);

  const pollStatus = useCallback(async () => {
    if (isPollingRef.current || !enabled) return;
    
    isPollingRef.current = true;

    try {
      const response = await ScannerAPI.getSessionStatus(sessionId);
      const status = response?.data?.status;
      const progress = response?.data?.progress;

      if (!status) {
        console.warn(`No status returned for session ${sessionId}`);
        isPollingRef.current = false;
        return;
      }

      // Update last successful poll time
      lastSuccessfulPollRef.current = Date.now();

      // Check for status change
      const hasStatusChanged = lastStatusRef.current !== status;
      if (hasStatusChanged && onStatusChange) {
        onStatusChange(lastStatusRef.current, status);
      }
      lastStatusRef.current = status;

      // Check if terminal status
      if (isTerminalStatus(status)) {
        // Remove from active jobs
        scanJobsStore.removeJob(sessionId);

        // Trigger completion callbacks
        if (isSuccessStatus(status) && onComplete) {
          onComplete(sessionId);
        } else if (isFailureStatus(status) && onFailed) {
          onFailed(sessionId, response?.data?.message);
        }

        // Stop polling
        if (pollTimerRef.current) {
          clearTimeout(pollTimerRef.current);
        }
        isPollingRef.current = false;
        return;
      }

      // Update job in store with new data
      scanJobsStore.updateJob(sessionId, {
        last_status: status,
        last_update: new Date().toISOString(),
        ...(typeof progress === 'object' && progress ? progress : {}),
      });

      // Schedule next poll with backoff
      const elapsedTime = Date.now() - startTimeRef.current;
      const nextInterval = elapsedTime > BACKOFF_THRESHOLD 
        ? BACKOFF_POLL_INTERVAL 
        : INITIAL_POLL_INTERVAL;

      pollTimerRef.current = setTimeout(() => {
        isPollingRef.current = false;
        pollStatus();
      }, nextInterval);

    } catch (err) {
      console.error(`Failed to poll status for ${sessionId}:`, err);
      
      // Continue polling even on error (might be temporary network issue)
      const elapsedTime = Date.now() - startTimeRef.current;
      const nextInterval = elapsedTime > BACKOFF_THRESHOLD 
        ? BACKOFF_POLL_INTERVAL 
        : INITIAL_POLL_INTERVAL;

      pollTimerRef.current = setTimeout(() => {
        isPollingRef.current = false;
        pollStatus();
      }, nextInterval);
    }
  }, [sessionId, enabled, onStatusChange, onComplete, onFailed, isTerminalStatus, isSuccessStatus, isFailureStatus]);

  // Start polling
  useEffect(() => {
    if (!enabled || !sessionId) return;

    // Reset refs
    startTimeRef.current = Date.now();
    lastSuccessfulPollRef.current = Date.now();
    isPollingRef.current = false;

    // Start first poll
    pollStatus();

    // Cleanup
    return () => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
      isPollingRef.current = false;
    };
  }, [sessionId, enabled, pollStatus]);

  // Monitor for "still working" warnings
  useEffect(() => {
    if (!enabled || !sessionId) return;

    const warningInterval = setInterval(() => {
      const timeSinceLastPoll = Date.now() - lastSuccessfulPollRef.current;
      
      if (timeSinceLastPoll > SLOW_SCAN_WARNING_THRESHOLD) {
        // Could emit a warning event here if needed
        console.log(`Scan ${sessionId}: taking longer than usual (${Math.floor(timeSinceLastPoll / 1000)}s)`);
      } else if (timeSinceLastPoll > NO_UPDATE_WARNING_THRESHOLD) {
        console.log(`Scan ${sessionId}: no update yet, still working... (${Math.floor(timeSinceLastPoll / 1000)}s)`);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(warningInterval);
  }, [sessionId, enabled]);

  return {
    isPolling: enabled,
    lastStatus: lastStatusRef.current,
  };
}
