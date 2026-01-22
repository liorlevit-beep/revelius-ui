/**
 * Authenticated API Client
 * Wraps fetch to automatically add Authorization header and handle token refresh
 */

import { getToken, refreshToken, clearToken } from '../lib/auth';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export interface AuthenticatedRequestOptions extends RequestInit {
  skipAuth?: boolean; // Skip adding Authorization header
}

/**
 * Make an authenticated API request
 * Automatically adds Authorization: Bearer <token>
 * On 401/403: attempts refresh once, retries original request once, redirects if still fails
 */
export async function authenticatedFetch(
  url: string,
  options: AuthenticatedRequestOptions = {}
): Promise<Response> {
  const { skipAuth, ...fetchOptions } = options;

  // Add Authorization header if not skipping
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }

  // Make initial request
  let response = await fetch(url, fetchOptions);

  // If 401/403, attempt refresh and retry once
  if ((response.status === 401 || response.status === 403) && !skipAuth) {
    console.log('[authenticatedFetch] Got 401/403, attempting token refresh');

    // Ensure only one refresh happens at a time
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken();
    }

    const newToken = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (newToken) {
      // Retry with new token
      console.log('[authenticatedFetch] Retrying request with refreshed token');
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${newToken}`,
      };
      response = await fetch(url, fetchOptions);

      // If still 401/403 after refresh, redirect to auth
      if (response.status === 401 || response.status === 403) {
        console.error('[authenticatedFetch] Still unauthorized after refresh, clearing token');
        clearToken();
        window.location.href = '/auth?reason=expired';
      }
    } else {
      // Refresh failed, redirect to auth
      console.error('[authenticatedFetch] Token refresh failed, redirecting to auth');
      clearToken();
      window.location.href = '/auth?reason=expired';
    }
  }

  return response;
}

/**
 * Convenience method for JSON APIs
 */
export async function authenticatedFetchJSON<T = any>(
  url: string,
  options: AuthenticatedRequestOptions = {}
): Promise<T> {
  const response = await authenticatedFetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.statusText} - ${errorText}`);
  }

  return response.json();
}
