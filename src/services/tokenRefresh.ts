/**
 * Token Refresh Service
 * 
 * Automatically refreshes the authentication token before it expires
 * to ensure uninterrupted user experience.
 */

import { getEnvConfig } from '../config/env';

// Refresh token 5 minutes before expiry
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

// Check token expiry every minute
const CHECK_INTERVAL_MS = 60 * 1000;

let refreshTimer: number | null = null;
let checkInterval: number | null = null;
let isRefreshing = false;

/**
 * Get token expiry time in milliseconds
 */
function getTokenExpiry(): number | null {
  const expiresAt = localStorage.getItem('revelius_auth_expires_at');
  
  if (!expiresAt) {
    return null;
  }
  
  // expiresAt could be ISO string or Unix timestamp
  const timestamp = parseInt(expiresAt, 10);
  if (!isNaN(timestamp)) {
    // If it's a Unix timestamp (seconds), convert to milliseconds
    return timestamp > 10000000000 ? timestamp : timestamp * 1000;
  }
  
  // Try parsing as ISO string
  const date = new Date(expiresAt);
  return isNaN(date.getTime()) ? null : date.getTime();
}

/**
 * Refresh the authentication token
 */
async function refreshToken(): Promise<boolean> {
  if (isRefreshing) {
    console.log('[TokenRefresh] Already refreshing, skipping...');
    return false;
  }
  
  isRefreshing = true;
  
  try {
    console.log('[TokenRefresh] 🔄 Refreshing token...');
    const env = getEnvConfig();
    const currentToken = localStorage.getItem('revelius_auth_token');
    
    if (!currentToken) {
      console.log('[TokenRefresh] ⚠️ No token to refresh');
      return false;
    }
    
    // Check if we have a refresh token
    const refreshToken = localStorage.getItem('revelius_refresh_token');
    
    const requestUrl = `${env.baseUrl}/auth/refresh`;
    const requestHeaders = {
      'Authorization': `Bearer ${refreshToken || currentToken}`,
      'Content-Type': 'application/json',
    };
    const requestBody = {
      refresh_token: refreshToken || currentToken,
    };
    
    console.log('[TokenRefresh] ========================================');
    console.log('[TokenRefresh] 📤 SENDING REFRESH REQUEST');
    console.log('[TokenRefresh] URL:', requestUrl);
    console.log('[TokenRefresh] Method: POST');
    console.log('[TokenRefresh] Has refresh_token in localStorage:', !!refreshToken);
    console.log('[TokenRefresh] Using token (first 20 chars):', (refreshToken || currentToken).substring(0, 20) + '...');
    console.log('[TokenRefresh] Headers:', {
      'Authorization': 'Bearer ' + (refreshToken || currentToken).substring(0, 20) + '...',
      'Content-Type': 'application/json',
    });
    console.log('[TokenRefresh] Body:', {
      refresh_token: (refreshToken || currentToken).substring(0, 20) + '...'
    });
    console.log('[TokenRefresh] ========================================');
    
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody),
    });
    
    console.log('[TokenRefresh] ========================================');
    console.log('[TokenRefresh] Response status:', response.status);
    console.log('[TokenRefresh] Response statusText:', response.statusText);
    console.log('[TokenRefresh] Response URL:', response.url);
    console.log('[TokenRefresh] Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('[TokenRefresh] ========================================');
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[TokenRefresh] ========================================');
      console.error('[TokenRefresh] ❌ REFRESH FAILED');
      console.error('[TokenRefresh] Status:', response.status, response.statusText);
      console.error('[TokenRefresh] URL that was called:', response.url);
      console.error('[TokenRefresh] Error response body:', errorText);
      console.error('[TokenRefresh] ========================================');
      
      // If refresh fails with 401/403, session is invalid - redirect to login
      if (response.status === 401 || response.status === 403) {
        console.log('[TokenRefresh] Session invalid, clearing auth');
        localStorage.removeItem('revelius_auth_token');
        localStorage.removeItem('revelius_refresh_token');
        localStorage.removeItem('revelius_auth_expires_at');
        window.location.assign('/auth?reason=expired');
      }
      
      return false;
    }
    
    const rawText = await response.text();
    console.log('[TokenRefresh] ========================================');
    console.log('[TokenRefresh] ✅ REFRESH SUCCESS');
    console.log('[TokenRefresh] Raw response body:', rawText);
    console.log('[TokenRefresh] Response length:', rawText.length, 'bytes');
    console.log('[TokenRefresh] ========================================');
    
    const data = JSON.parse(rawText);
    console.log('[TokenRefresh] Parsed response:', data);
    const newToken = data.session_token || data.token || data.data?.session_token || data.data?.token;
    const newRefreshToken = data.refresh_token || data.data?.refresh_token;
    
    if (!newToken) {
      console.log('[TokenRefresh] ⚠️ No token in refresh response');
      return false;
    }
    
    // Update stored tokens
    localStorage.setItem('revelius_auth_token', newToken);
    
    if (newRefreshToken) {
      localStorage.setItem('revelius_refresh_token', newRefreshToken);
      console.log('[TokenRefresh] New refresh token stored');
    }
    
    // Update expiry if provided
    const expiresIn = data.expires_in || data.data?.expires_in;
    const expiresAt = data.expires_at || data.data?.expires_at;
    
    if (expiresAt) {
      localStorage.setItem('revelius_auth_expires_at', expiresAt);
    } else if (expiresIn) {
      // Calculate expiry from expires_in (seconds)
      const expiryTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem('revelius_auth_expires_at', expiryTime.toString());
    }
    
    console.log('[TokenRefresh] ✅ Token refreshed successfully');
    
    // Schedule next refresh
    scheduleNextRefresh();
    
    return true;
  } catch (error) {
    console.error('[TokenRefresh] ❌ Error refreshing token:', error);
    return false;
  } finally {
    isRefreshing = false;
  }
}

/**
 * Schedule the next token refresh based on expiry time
 */
function scheduleNextRefresh() {
  // Clear existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  
  const expiryTime = getTokenExpiry();
  
  if (!expiryTime) {
    console.log('[TokenRefresh] No expiry time set, will check periodically');
    return;
  }
  
  const now = Date.now();
  const timeUntilExpiry = expiryTime - now;
  const timeUntilRefresh = timeUntilExpiry - REFRESH_BUFFER_MS;
  
  console.log('[TokenRefresh] Token expires at:', new Date(expiryTime).toLocaleString());
  console.log('[TokenRefresh] Time until expiry:', Math.round(timeUntilExpiry / 1000 / 60), 'minutes');
  console.log('[TokenRefresh] Will refresh in:', Math.round(timeUntilRefresh / 1000 / 60), 'minutes');
  
  if (timeUntilRefresh <= 0) {
    // Token is about to expire or already expired, refresh now
    console.log('[TokenRefresh] Token expires soon, refreshing now');
    refreshToken();
  } else {
    // Schedule refresh before expiry
    refreshTimer = window.setTimeout(() => {
      console.log('[TokenRefresh] Scheduled refresh triggered');
      refreshToken();
    }, timeUntilRefresh);
  }
}

/**
 * Check if token needs refresh
 */
function checkTokenExpiry() {
  const token = localStorage.getItem('revelius_auth_token');
  
  if (!token) {
    // No token, stop checking
    console.log('[TokenRefresh] No token found, stopping refresh checks');
    stopTokenRefresh();
    return;
  }
  
  const expiryTime = getTokenExpiry();
  
  if (!expiryTime) {
    // No expiry time, can't proactively refresh
    console.log('[TokenRefresh] No expiry time available');
    return;
  }
  
  const now = Date.now();
  const timeUntilExpiry = expiryTime - now;
  
  // If token expires in less than REFRESH_BUFFER_MS, refresh now
  if (timeUntilExpiry <= REFRESH_BUFFER_MS && timeUntilExpiry > 0) {
    console.log('[TokenRefresh] Token expires soon, refreshing proactively');
    refreshToken();
  } else if (timeUntilExpiry <= 0) {
    console.log('[TokenRefresh] Token expired, redirecting to login');
    localStorage.removeItem('revelius_auth_token');
    localStorage.removeItem('revelius_refresh_token');
    localStorage.removeItem('revelius_auth_expires_at');
    window.location.assign('/auth?reason=expired');
  }
}

/**
 * Start automatic token refresh
 * Call this after successful login
 */
export function startTokenRefresh() {
  console.log('[TokenRefresh] 🚀 Starting automatic token refresh');
  
  // Schedule first refresh based on expiry
  scheduleNextRefresh();
  
  // Also check periodically in case expiry time changes
  if (!checkInterval) {
    checkInterval = window.setInterval(checkTokenExpiry, CHECK_INTERVAL_MS);
  }
}

/**
 * Stop automatic token refresh
 * Call this on logout
 */
export function stopTokenRefresh() {
  console.log('[TokenRefresh] 🛑 Stopping automatic token refresh');
  
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}

/**
 * Manually trigger a token refresh
 */
export async function manualRefreshToken(): Promise<boolean> {
  return refreshToken();
}
