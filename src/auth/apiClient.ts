/**
 * Authenticated API client wrapper
 * Automatically adds Authorization header and handles 401/403 with refresh-once retry
 */

import { getToken, refresh, clearToken } from './auth';

/**
 * Fetch wrapper that adds auth headers and handles token refresh on 401/403
 * 
 * On 401/403:
 * 1. Attempts refresh() once
 * 2. Retries original request once
 * 3. If still unauthorized: clears token and redirects to /auth?reason=expired
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = getToken();
  
  // Add Authorization header if token exists
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Always include credentials for cookie-based auth
  const fetchInit: RequestInit = {
    ...init,
    headers,
    credentials: 'include',
  };

  // Make initial request
  let response = await fetch(input, fetchInit);

  // Handle 401/403: attempt refresh and retry once
  if (response.status === 401 || response.status === 403) {
    if (import.meta.env.DEV) {
      console.log(`[Auth] Received ${response.status}, attempting refresh...`);
    }

    const refreshed = await refresh();

    if (!refreshed) {
      // Refresh failed - clear token and redirect to login
      if (import.meta.env.DEV) {
        console.log('[Auth] Refresh failed, redirecting to login');
      }
      clearToken();
      window.location.assign('/auth?reason=expired');
      throw new Error('Session expired');
    }

    // Retry with new token
    const newToken = getToken();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
    }

    response = await fetch(input, {
      ...init,
      headers,
      credentials: 'include',
    });

    // If still unauthorized after refresh, redirect to login
    if (response.status === 401 || response.status === 403) {
      if (import.meta.env.DEV) {
        console.log('[Auth] Still unauthorized after refresh, redirecting to login');
      }
      clearToken();
      window.location.assign('/auth?reason=expired');
      throw new Error('Session expired');
    }
  }

  return response;
}
