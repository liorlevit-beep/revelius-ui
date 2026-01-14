/**
 * Helper functions for safely extracting scan session data
 * These handle unknown/varying API response shapes
 */

/**
 * Unwrap API response to get array data
 */
export function unwrapList(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (res?.data && Array.isArray(res.data)) return res.data;
  if (res?.sessions && Array.isArray(res.sessions)) return res.sessions;
  if (res?.results && Array.isArray(res.results)) return res.results;
  return [];
}

/**
 * Safe data pickers for session objects
 */
export function pickSessionId(obj: any): string {
  return obj?.session_id ?? obj?.sessionId ?? obj?.id ?? obj?.scan_id ?? 'unknown';
}

export function pickUrl(obj: any): string {
  return obj?.target_url ?? obj?.url ?? obj?.website ?? obj?.domain ?? obj?.target ?? obj?.merchant_url ?? '-';
}

export function pickStatus(obj: any): string {
  // Try to unwrap if response has a data field
  const data = obj?.data ?? obj;
  
  // Check for 'active' field first (boolean)
  if (data?.active !== undefined) {
    if (data.active === true) {
      return 'In Progress';
    }
    
    // When active is false, check session_successfully_ended
    if (data?.session_successfully_ended !== undefined) {
      return data.session_successfully_ended === true ? 'Scan Complete' : 'Scan Error';
    }
    
    // Fallback if session_successfully_ended is not present
    return 'Scan Complete';
  }
  
  // Check fallback status fields
  const status = data?.status ?? data?.state ?? data?.scan_status;
  
  // Map "inactive" to "Scan Complete" (scan is done but session is inactive)
  if (status === 'inactive') {
    return 'Scan Complete';
  }
  
  return status ?? 'unknown';
}

export function pickCreated(obj: any): string {
  const timestamp = obj?.created_timestamp ?? obj?.created_at ?? obj?.createdAt ?? obj?.timestamp ?? obj?.created ?? obj?.date;
  if (!timestamp) return '-';
  
  try {
    // Check if it's an epoch timestamp (number or numeric string)
    if (typeof timestamp === 'number' || !isNaN(Number(timestamp))) {
      const epochValue = Number(timestamp);
      // Handle both seconds and milliseconds epoch
      const date = epochValue > 10000000000 
        ? new Date(epochValue) 
        : new Date(epochValue * 1000);
      
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    
    // Try to parse as date string
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return String(timestamp);
    return date.toISOString();
  } catch {
    return String(timestamp);
  }
}

export function pickRegion(obj: any): string {
  const data = obj?.data ?? obj;
  return data?.region ?? data?.location ?? data?.geo ?? '-';
}

export function pickProgress(obj: any): number | undefined {
  const data = obj?.data ?? obj;
  const progress = data?.progress ?? data?.percentage ?? data?.completion;
  if (typeof progress === 'number') return progress;
  if (typeof progress === 'string') {
    const num = parseFloat(progress);
    if (!isNaN(num)) return num;
  }
  return undefined;
}

export function pickMessage(obj: any): string | undefined {
  const data = obj?.data ?? obj;
  return data?.message ?? data?.status_message ?? data?.description ?? data?.info;
}

export function pickLastUpdated(obj: any): string | undefined {
  const data = obj?.data ?? obj;
  const timestamp = data?.last_updated ?? data?.lastUpdated ?? data?.updated_at ?? data?.updatedAt ?? data?.updated_timestamp;
  if (!timestamp) return undefined;
  
  try {
    // Check if it's an epoch timestamp (number or numeric string)
    if (typeof timestamp === 'number' || !isNaN(Number(timestamp))) {
      const epochValue = Number(timestamp);
      // Handle both seconds and milliseconds epoch
      const date = epochValue > 10000000000 
        ? new Date(epochValue) 
        : new Date(epochValue * 1000);
      
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    
    // Try to parse as date string
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString();
  } catch {
    return undefined;
  }
}

/**
 * Check if status indicates scan is complete
 */
export function isStatusComplete(status: string): boolean {
  const normalizedStatus = status.toLowerCase();
  return (
    normalizedStatus === 'scan complete' ||
    normalizedStatus === 'completed' ||
    normalizedStatus === 'complete' ||
    normalizedStatus === 'success' ||
    normalizedStatus === 'finished' ||
    normalizedStatus === 'done' ||
    normalizedStatus === 'inactive' // Session is inactive = scan is complete
  );
}

/**
 * Check if status indicates scan failed
 */
export function isStatusFailed(status: string): boolean {
  const normalizedStatus = status.toLowerCase();
  return (
    normalizedStatus === 'failed' ||
    normalizedStatus === 'error' ||
    normalizedStatus === 'scan error' ||
    normalizedStatus === 'cancelled' ||
    normalizedStatus === 'timeout'
  );
}

/**
 * Check if status indicates scan is in progress
 */
export function isStatusInProgress(status: string): boolean {
  const normalizedStatus = status.toLowerCase();
  return (
    normalizedStatus === 'in progress' ||
    normalizedStatus === 'pending' ||
    normalizedStatus === 'running' ||
    normalizedStatus === 'in_progress' ||
    normalizedStatus === 'inprogress' ||
    normalizedStatus === 'processing' ||
    normalizedStatus === 'scanning'
  );
}

/**
 * Format relative time
 */
export function getRelativeTime(timestamp: string | Date | number): string {
  try {
    let date: Date;
    
    // Handle epoch timestamp (number or numeric string)
    if (typeof timestamp === 'number' || !isNaN(Number(timestamp))) {
      const epochValue = Number(timestamp);
      // Handle both seconds and milliseconds epoch
      date = epochValue > 10000000000 
        ? new Date(epochValue) 
        : new Date(epochValue * 1000);
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      date = timestamp;
    }
    
    if (isNaN(date.getTime())) return '-';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  } catch {
    return '-';
  }
}

/**
 * Truncate session ID for display
 */
export function truncateId(id: string, maxLength: number = 12): string {
  if (id.length <= maxLength) return id;
  return `${id.substring(0, maxLength)}...`;
}
