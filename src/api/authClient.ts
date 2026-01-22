/**
 * Authenticated API Client
 * 
 * Wrapper around fetch that:
 * 1. Automatically adds Authorization: Bearer <token> header when token exists
 * 2. On 401/403, attempts to refresh token once
 * 3. Retries original request with new token
 * 4. If refresh fails, clears token and redirects to /auth?reason=expired
 */

import { getToken, setToken, clearToken, refreshToken as refreshAuthToken } from '../lib/auth';

interface AuthClientOptions extends RequestInit {
  skipAuth?: boolean; // Don't add Authorization header
  skipRefresh?: boolean; // Don't attempt refresh on 401/403
}

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Authenticated fetch wrapper
 * Use this for all API calls that require authentication
 */
export async function authFetch<T = any>(
  url: string,
  options: AuthClientOptions = {}
): Promise<T> {
  const { skipAuth, skipRefresh, ...fetchOptions } = options;

  // Build headers
  const headers = new Headers(fetchOptions.headers);
  
  // Add Authorization header if token exists (unless skipAuth)
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Make request
  let response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle 401/403 - attempt token refresh
  if (
    !skipRefresh &&
    (response.status === 401 || response.status === 403)
  ) {
    console.log('[authFetch] Received 401/403, attempting token refresh...');

    // If already refreshing, wait for that promise
    if (isRefreshing && refreshPromise) {
      try {
        await refreshPromise;
      } catch (error) {
        console.error('[authFetch] Token refresh failed:', error);
        handleAuthFailure();
        throw new Error('Authentication failed');
      }
    } else {
      // Start refresh
      isRefreshing = true;
      refreshPromise = attemptTokenRefresh();

      try {
        await refreshPromise;
      } catch (error) {
        console.error('[authFetch] Token refresh failed:', error);
        handleAuthFailure();
        throw new Error('Authentication failed');
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Retry original request with new token
    const newToken = getToken();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
    }
  }

  // If still unauthorized after refresh, redirect to auth
  if (response.status === 401 || response.status === 403) {
    console.error('[authFetch] Still unauthorized after refresh attempt');
    handleAuthFailure();
    throw new Error('Authentication failed');
  }

  // Handle non-OK responses
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  // Parse JSON response
  return response.json();
}

/**
 * Attempt to refresh the token
 * Returns new token if successful, throws otherwise
 */
async function attemptTokenRefresh(): Promise<string> {
  try {
    const refreshResponse = await refreshAuthToken();
    
    const newToken = refreshResponse.token || refreshResponse.access_token;
    
    if (!newToken) {
      throw new Error('No token in refresh response');
    }

    // Store new token
    setToken(newToken, refreshResponse.expires_in);
    
    console.log('[authFetch] Token refreshed successfully');
    return newToken;
  } catch (error) {
    console.error('[authFetch] Token refresh failed:', error);
    throw error;
  }
}

/**
 * Handle auth failure - clear token and redirect to auth page
 */
function handleAuthFailure(): void {
  clearToken();
  
  // Only redirect if not already on auth page
  if (!window.location.pathname.startsWith('/auth')) {
    window.location.href = '/auth?reason=expired';
  }
}
