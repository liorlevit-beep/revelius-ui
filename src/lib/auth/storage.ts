/**
 * Token storage utilities
 * Manages session_token and refresh_token in localStorage
 */

const SESSION_TOKEN_KEY = 'revelius_session_token';
const REFRESH_TOKEN_KEY = 'revelius_refresh_token';
const TOKEN_EXPIRES_AT_KEY = 'revelius_token_expires_at';

export interface StoredTokens {
  sessionToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

/**
 * Store authentication tokens
 */
export function storeTokens(
  sessionToken: string,
  refreshToken?: string,
  expiresIn?: number
): void {
  localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
  
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  
  if (expiresIn) {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
  }
}

/**
 * Get stored tokens
 */
export function getTokens(): StoredTokens {
  return {
    sessionToken: localStorage.getItem(SESSION_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    expiresAt: localStorage.getItem(TOKEN_EXPIRES_AT_KEY)
      ? parseInt(localStorage.getItem(TOKEN_EXPIRES_AT_KEY)!, 10)
      : null,
  };
}

/**
 * Get session token (commonly used)
 */
export function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

/**
 * Clear all tokens
 */
export function clearTokens(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
}

/**
 * Check if tokens exist
 */
export function hasTokens(): boolean {
  return !!localStorage.getItem(SESSION_TOKEN_KEY);
}
