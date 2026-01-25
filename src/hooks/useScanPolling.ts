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

const INITIAL_POLL_INTERVAL = 20000; // 20 seconds
const BACKOFF_POLL_INTERVAL = 20000; // 20 seconds
const BACKOFF_THRESHOLD = 60000; // Switch to slower polling after 1 minute
const NO_UPDATE_WARNING_THRESHOLD = 20000; // 20 seconds
const SLOW_SCAN_WARNING_THRESHOLD = 75000; // 75 seconds

// Terminal status: scan is done when status === "inactive"
// Then check success field: true = completed, false = failed

export function useScanPolling({
  sessionId,
  enabled = true,
  onStatusChange,
  onComplete,
  onFailed,
}: UseScanPollingOptions) {
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());
  const lastStatusRef = useRef<string | undefined>(undefined);
  const lastSuccessfulPollRef = useRef<number>(Date.now());
  const isPollingRef = useRef(false);


  const pollStatus = useCallback(async () => {
    if (isPollingRef.current || !enabled) return;
    
    isPollingRef.current = true;

    try {
      console.log(`[useScanPolling] Polling status for session: ${sessionId}`);
      const response = await ScannerAPI.getSessionStatus(sessionId);
      const status = response?.data?.status;
      const success = response?.data?.success;
      const progress = response?.data?.progress;
      const message = response?.data?.message;

      console.log(`[useScanPolling] Received response:`, {
        sessionId,
        status,
        success,
        progress,
        message,
        fullResponse: response
      });

      if (!status) {
        console.warn(`[useScanPolling] No status returned for session ${sessionId}`);
        isPollingRef.current = false;
        return;
      }

      // Update last successful poll time
      lastSuccessfulPollRef.current = Date.now();

      // Check for status change
      const hasStatusChanged = lastStatusRef.current !== status;
      if (hasStatusChanged && onStatusChange) {
        console.log(`[useScanPolling] Status changed from "${lastStatusRef.current}" to "${status}"`);
        onStatusChange(lastStatusRef.current, status);
      }
      lastStatusRef.current = status;

      // Check if terminal status: status === "inactive"
      const isTerminal = status.toLowerCase() === 'inactive';
      console.log(`[useScanPolling] Is terminal status? ${isTerminal} (status: "${status}", success: ${success})`);
      
      if (isTerminal) {
        console.log(`[useScanPolling] Terminal status detected (inactive). Stopping polling for session: ${sessionId}`);
        
        // Remove from active jobs
        scanJobsStore.removeJob(sessionId);

        // Trigger completion callbacks based on success field
        // If success === true, scan completed successfully
        // If success === false, scan failed
        if (success === true) {
          console.log(`[useScanPolling] Success detected (inactive + success=true), calling onComplete`);
          if (onComplete) {
            onComplete(sessionId);
          }
        } else if (success === false) {
          console.log(`[useScanPolling] Failure detected (inactive + success=false), calling onFailed`);
          if (onFailed) {
            onFailed(sessionId, message);
          }
        } else {
          // Fallback: if success field is missing but status is inactive
          console.log(`[useScanPolling] Inactive status but success field is undefined/null, treating as complete`);
          if (onComplete) {
            onComplete(sessionId);
          }
        }

        // Stop polling
        if (pollTimerRef.current) {
          clearTimeout(pollTimerRef.current);
        }
        isPollingRef.current = false;
        console.log(`[useScanPolling] Polling stopped for session: ${sessionId}`);
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

      console.log(`[useScanPolling] Scheduling next poll in ${nextInterval}ms for session: ${sessionId}`);

      pollTimerRef.current = setTimeout(() => {
        isPollingRef.current = false;
        pollStatus();
      }, nextInterval);

    } catch (err) {
      console.error(`[useScanPolling] Failed to poll status for ${sessionId}:`, err);
      
      // Continue polling even on error (might be temporary network issue)
      const elapsedTime = Date.now() - startTimeRef.current;
      const nextInterval = elapsedTime > BACKOFF_THRESHOLD 
        ? BACKOFF_POLL_INTERVAL 
        : INITIAL_POLL_INTERVAL;

      console.log(`[useScanPolling] Error occurred, scheduling retry in ${nextInterval}ms`);

      pollTimerRef.current = setTimeout(() => {
        isPollingRef.current = false;
        pollStatus();
      }, nextInterval);
    }
  }, [sessionId, enabled, onStatusChange, onComplete, onFailed]);

  // Start polling
  useEffect(() => {
    if (!enabled || !sessionId) {
      console.log(`[useScanPolling] Polling not enabled or no sessionId`, { enabled, sessionId });
      return;
    }

    console.log(`[useScanPolling] Starting polling for session: ${sessionId}`);

    // Reset refs
    startTimeRef.current = Date.now();
    lastSuccessfulPollRef.current = Date.now();
    isPollingRef.current = false;

    // Start first poll
    pollStatus();

    // Cleanup
    return () => {
      console.log(`[useScanPolling] Cleaning up polling for session: ${sessionId}`);
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
