/**
 * Evidence Binding Storage
 * 
 * Local storage helper for binding transactions to scan session IDs
 */

const STORAGE_PREFIX = 'revelius:evidenceBinding:';

/**
 * Get the bound evidence session ID for a transaction
 */
export function getEvidenceSessionId(txnId: string): string | null {
  const key = `${STORAGE_PREFIX}${txnId}`;
  return localStorage.getItem(key);
}

/**
 * Set (bind) an evidence session ID to a transaction
 */
export function setEvidenceSessionId(txnId: string, sessionId: string): void {
  const key = `${STORAGE_PREFIX}${txnId}`;
  localStorage.setItem(key, sessionId);
}

/**
 * Remove the evidence binding for a transaction
 */
export function removeEvidenceSessionId(txnId: string): void {
  const key = `${STORAGE_PREFIX}${txnId}`;
  localStorage.removeItem(key);
}
