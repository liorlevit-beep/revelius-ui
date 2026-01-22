/**
 * Revelius Authentication Service
 * 
 * How it works:
 * 1. User clicks "Sign in with Google" -> calls /auth/login -> redirects to Google OAuth
 * 2. Google redirects back to /auth/callback?token=... -> we store token in localStorage
 * 3. All API requests include Authorization: Bearer <token>
 * 4. On 401/403, we attempt /auth/refresh once, retry original request
 * 5. If refresh fails or token missing, redirect to /auth?reason=expired
 * 6. User can sign out via /auth/logout -> clears token -> redirects to /auth
 * 
 * Token storage:
 * - revelius_auth_token: JWT or opaque token from backend
 * - revelius_auth_expires_at: optional timestamp if backend provides expires_in
 */

import { env } from '../config/env';

const TOKEN_KEY = 'revelius_auth_token';
const EXPIRES_KEY = 'revelius_auth_expires_at';

// ============================================================================
// Token Storage
// ============================================================================

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, expiresIn?: number): void {
  localStorage.setItem(TOKEN_KEY, token);
  
  if (expiresIn) {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem(EXPIRES_KEY, expiresAt.toString());
  }
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

export function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem(EXPIRES_KEY);
  if (!expiresAt) return false; // No expiry set, assume valid
  return Date.now() > parseInt(expiresAt, 10);
}

// ============================================================================
// Auth API Calls
// ============================================================================

interface LoginResponse {
  url?: string;
  token?: string;
  access_token?: string;
  expires_in?: number;
}

interface StatusResponse {
  authenticated?: boolean;
  valid?: boolean;
  user?: any;
}

interface RefreshResponse {
  token?: string;
  access_token?: string;
  expires_in?: number;
}

/**
 * Start OAuth login flow
 * Returns either a redirect URL or a token (depending on backend implementation)
 */
export async function startLogin(): Promise<LoginResponse> {
  const response = await fetch(`${env.baseUrl}/auth/login`, {
    method: 'GET',
    credentials: 'include', // Include cookies if backend uses them
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check if current token is valid
 */
export async function checkAuthStatus(): Promise<StatusResponse> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${env.baseUrl}/auth/status`, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      return { authenticated: false, valid: false };
    }
    throw new Error(`Status check failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Refresh the current token
 * Returns new token if successful
 */
export async function refreshToken(): Promise<RefreshResponse> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${env.baseUrl}/auth/refresh`, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Sign out the current user
 */
export async function logout(): Promise<void> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
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
  } catch (error) {
    console.warn('Logout request failed, but clearing local token anyway:', error);
  }
  
  clearToken();
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse token from URL query string or hash fragment
 * Supports: ?token=..., ?access_token=..., #token=..., #access_token=...
 */
export function extractTokenFromUrl(): { token: string | null; expiresIn: number | null } {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  
  const token = 
    urlParams.get('token') ||
    urlParams.get('access_token') ||
    hashParams.get('token') ||
    hashParams.get('access_token');
  
  const expiresInStr = 
    urlParams.get('expires_in') ||
    hashParams.get('expires_in');
  
  const expiresIn = expiresInStr ? parseInt(expiresInStr, 10) : null;
  
  return { token, expiresIn };
}

/**
 * Check if user should be authenticated (has token and not expired)
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired()) return false;
  return true;
}
