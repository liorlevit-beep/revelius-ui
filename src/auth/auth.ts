/**
 * Revelius Authentication Service
 * Manages session tokens, backend exchange, status, refresh, and logout
 * 
 * Uses existing backend endpoints:
 * - GET /auth/login (with Authorization: Bearer <google-id-token>)
 * - GET /auth/status
 * - GET /auth/refresh
 * - GET /auth/logout
 */

import { getEnvConfig } from '../config/env';
import { getSignedHeaders } from '../api/signer';

const TOKEN_KEY = 'revelius_auth_token';
const EXPIRES_AT_KEY = 'revelius_auth_expires_at';

interface LoginResponse {
  data: {
    session_token?: string;
    refresh_token?: string;
    token?: string;
    expires_in?: number;
    email?: string;
    name?: string;
  } | null;
  error: string | null;
  status_code: number;
  success: boolean;
}

interface StatusResponse {
  data: {
    authenticated?: boolean;
    email?: string;
    user_id?: string;
  } | null;
  error: string | null;
  status_code: number;
  success: boolean;
}

interface RefreshResponse {
  data: {
    session_token?: string;
    token?: string;
    expires_in?: number;
  } | null;
  error: string | null;
  status_code: number;
  success: boolean;
}

/**
 * Get stored auth token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store auth token and optional expiration
 */
export function setToken(token: string, expiresInSeconds?: number): void {
  localStorage.setItem(TOKEN_KEY, token);
  
  if (expiresInSeconds) {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
  }

  // Log only in dev (first 10 chars)
  if (import.meta.env.DEV) {
    console.log(`[Auth] Token stored: ${token.substring(0, 10)}...`);
  }
}

/**
 * Clear auth token
 */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  
  if (import.meta.env.DEV) {
    console.log('[Auth] Token cleared');
  }
}

/**
 * Check if token is expired (based on stored expiration)
 */
export function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
  if (!expiresAt) return false;
  
  return Date.now() >= parseInt(expiresAt, 10);
}

/**
 * Exchange Google ID token for Revelius session token
 * Calls: GET /auth/login with Authorization: Bearer <google-id-token>
 */
export async function exchangeGoogleIdToken(idToken: string): Promise<void> {
  const env = getEnvConfig();
  const signedHeaders = getSignedHeaders(env.accessKey, env.secretKey);

  if (import.meta.env.DEV) {
    console.log('[Auth] Exchanging Google ID token with backend...');
  }

  const response = await fetch(`${env.baseUrl}/auth/login`, {
    method: 'GET',
    headers: {
      ...signedHeaders,
      'Authorization': `Bearer ${idToken}`,
    },
    credentials: 'include',
  });

  const data: LoginResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || `Backend exchange failed (HTTP ${response.status})`);
  }

  // Store token - backend may return session_token or token
  const token = data.data?.session_token || data.data?.token;
  
  if (!token) {
    // Backend might be using cookie-only mode
    if (import.meta.env.DEV) {
      console.log('[Auth] No token in response - assuming cookie-based session');
    }
    return;
  }

  setToken(token, data.data?.expires_in);
}

/**
 * Check authentication status
 * Calls: GET /auth/status
 */
export async function status(): Promise<boolean> {
  const env = getEnvConfig();
  const signedHeaders = getSignedHeaders(env.accessKey, env.secretKey);
  const token = getToken();

  const headers: Record<string, string> = {
    ...signedHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${env.baseUrl}/auth/status`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data: StatusResponse = await response.json();

    const authenticated = response.ok && data.success && data.data?.authenticated;

    if (import.meta.env.DEV) {
      console.log(`[Auth] Status check: ${authenticated ? 'authenticated' : 'not authenticated'}`);
    }

    return !!authenticated;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Auth] Status check failed:', error);
    }
    return false;
  }
}

/**
 * Refresh authentication token
 * Calls: GET /auth/refresh
 */
export async function refresh(): Promise<boolean> {
  const env = getEnvConfig();
  const signedHeaders = getSignedHeaders(env.accessKey, env.secretKey);
  const token = getToken();

  const headers: Record<string, string> = {
    ...signedHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.log('[Auth] Attempting token refresh...');
  }

  try {
    const response = await fetch(`${env.baseUrl}/auth/refresh`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data: RefreshResponse = await response.json();

    if (!response.ok || !data.success) {
      if (import.meta.env.DEV) {
        console.log('[Auth] Refresh failed:', data.error);
      }
      return false;
    }

    // Update token if provided
    const newToken = data.data?.session_token || data.data?.token;
    if (newToken) {
      setToken(newToken, data.data?.expires_in);
    }

    if (import.meta.env.DEV) {
      console.log('[Auth] Token refresh successful');
    }

    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Auth] Refresh error:', error);
    }
    return false;
  }
}

/**
 * Logout and clear session
 * Calls: GET /auth/logout
 */
export async function logout(): Promise<void> {
  const env = getEnvConfig();
  const signedHeaders = getSignedHeaders(env.accessKey, env.secretKey);
  const token = getToken();

  const headers: Record<string, string> = {
    ...signedHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    await fetch(`${env.baseUrl}/auth/logout`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (import.meta.env.DEV) {
      console.log('[Auth] Logout successful');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Auth] Logout error:', error);
    }
  } finally {
    clearToken();
  }
}
