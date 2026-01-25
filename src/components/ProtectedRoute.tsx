import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getEnvConfig } from '../config/env';
import { startTokenRefresh, stopTokenRefresh } from '../services/tokenRefresh';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 * 
 * Checks for valid session token and validates it with the backend.
 * If no token or token is invalid:
 * - Attempts to refresh once
 * - Redirects to /auth if refresh fails
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function validateSession() {
      try {
        const token = localStorage.getItem('revelius_auth_token');
        
        // No token? Redirect to auth
        if (!token) {
          console.log('[ProtectedRoute] No auth token found, redirecting to /auth');
          setIsValidating(false);
          setIsAuthenticated(false);
          return;
        }

        // Validate token with backend
        const env = getEnvConfig();
        console.log('[ProtectedRoute] Validating session token...');
        console.log('[ProtectedRoute] Token:', token.substring(0, 20) + '...');
        console.log('[ProtectedRoute] Calling:', `${env.baseUrl}/auth/status`);
        
        const response = await fetch(`${env.baseUrl}/auth/status`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('[ProtectedRoute] Response status:', response.status);

        if (response.ok) {
          console.log('[ProtectedRoute] ✅ Session valid');
          setIsAuthenticated(true);
          setIsValidating(false);
          
          // Start automatic token refresh
          startTokenRefresh();
          return;
        }

        // Token invalid - try to refresh
        console.log('[ProtectedRoute] ❌ Session invalid (status:', response.status, '), attempting refresh...');
        
        const errorText = await response.text().catch(() => '');
        console.log('[ProtectedRoute] /auth/status error:', errorText);
        
        console.log('[ProtectedRoute] Calling refresh endpoint:', `${env.baseUrl}/auth/refresh`);
        
        const refreshResponse = await fetch(`${env.baseUrl}/auth/refresh`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('[ProtectedRoute] Refresh response status:', refreshResponse.status);

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          const newToken = data.session_token || data.token || data.data?.session_token || data.data?.token;
          
          if (newToken) {
            console.log('[ProtectedRoute] ✅ Token refreshed successfully');
            localStorage.setItem('revelius_auth_token', newToken);
            const expiresAt = data.expires_at || data.data?.expires_at;
            if (expiresAt) {
              localStorage.setItem('revelius_auth_expires_at', expiresAt);
            }
            setIsAuthenticated(true);
            setIsValidating(false);
            return;
          }
        }

        // Refresh failed - clear token and redirect
        const refreshError = await refreshResponse.text().catch(() => '');
        console.log('[ProtectedRoute] ❌ Refresh failed:', refreshError);
        console.log('[ProtectedRoute] Clearing session and redirecting to /auth');
        
        // Stop token refresh service
        stopTokenRefresh();
        
        localStorage.removeItem('revelius_auth_token');
        localStorage.removeItem('revelius_refresh_token');
        localStorage.removeItem('revelius_auth_expires_at');
        setIsAuthenticated(false);
        setIsValidating(false);
      } catch (error) {
        console.error('[ProtectedRoute] Error validating session:', error);
        
        // Stop token refresh service
        stopTokenRefresh();
        
        localStorage.removeItem('revelius_auth_token');
        localStorage.removeItem('revelius_refresh_token');
        localStorage.removeItem('revelius_auth_expires_at');
        setIsAuthenticated(false);
        setIsValidating(false);
      }
    }

    validateSession();
  }, []);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Validating session...</p>
        </div>
      </div>
    );
  }

  // Not authenticated? Redirect to auth with current location
  if (!isAuthenticated) {
    return <Navigate to="/auth?reason=expired" state={{ from: location }} replace />;
  }

  // Authenticated - render protected content
  return <>{children}</>;
}
