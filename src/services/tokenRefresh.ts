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
    
    console.log('[TokenRefresh] Calling:', `${env.baseUrl}/auth/refresh`);
    console.log('[TokenRefresh] Using token:', currentToken.substring(0, 20) + '...');
    
    const response = await fetch(`${env.baseUrl}/auth/refresh`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
      },
    });
    
    console.log('[TokenRefresh] Response status:', response.status);
    console.log('[TokenRefresh] Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[TokenRefresh] ❌ Refresh failed with status:', response.status);
      console.error('[TokenRefresh] Error response:', errorText);
      
      // If refresh fails with 401/403, session is invalid - redirect to login
      if (response.status === 401 || response.status === 403) {
        console.log('[TokenRefresh] Session invalid, clearing auth');
        localStorage.removeItem('revelius_auth_token');
        localStorage.removeItem('revelius_auth_expires_at');
        window.location.assign('/auth?reason=expired');
      }
      
      return false;
    }
    
    const data = await response.json();
    console.log('[TokenRefresh] Success response:', data);
    const newToken = data.session_token || data.token || data.data?.session_token || data.data?.token;
    
    if (!newToken) {
      console.log('[TokenRefresh] ⚠️ No token in refresh response');
      return false;
    }
    
    // Update stored token
    localStorage.setItem('revelius_auth_token', newToken);
    
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
