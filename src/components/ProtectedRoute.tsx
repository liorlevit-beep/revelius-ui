import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, checkAuthStatus, refreshToken, setToken, clearToken } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that requires authentication
 * 
 * Flow:
 * 1. Check if token exists in localStorage
 * 2. If no token -> redirect to /auth?reason=expired
 * 3. If token exists -> call /auth/status to verify
 * 4. If status fails with 401/403 -> attempt refresh -> retry status
 * 5. If still fails -> redirect to /auth?reason=expired
 * 6. If success -> render children
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    verifyAuth();
  }, []);

  async function verifyAuth() {
    // Quick check: if no token, redirect immediately
    if (!isAuthenticated()) {
      setIsChecking(false);
      setIsValid(false);
      return;
    }

    try {
      // Call /auth/status to verify token
      const status = await checkAuthStatus();

      if (status.authenticated || status.valid) {
        setIsValid(true);
      } else {
        // Token invalid, attempt refresh
        await attemptRefresh();
      }
    } catch (error) {
      console.error('[ProtectedRoute] Auth status check failed:', error);
      // Attempt refresh on error
      await attemptRefresh();
    } finally {
      setIsChecking(false);
    }
  }

  async function attemptRefresh() {
    try {
      console.log('[ProtectedRoute] Attempting token refresh...');
      const refreshResponse = await refreshToken();

      const newToken = refreshResponse.token || refreshResponse.access_token;

      if (newToken) {
        setToken(newToken, refreshResponse.expires_in);

        // Retry status check with new token
        const status = await checkAuthStatus();

        if (status.authenticated || status.valid) {
          console.log('[ProtectedRoute] Token refreshed and verified');
          setIsValid(true);
          return;
        }
      }

      // Refresh didn't help
      throw new Error('Token refresh did not restore authentication');
    } catch (error) {
      console.error('[ProtectedRoute] Token refresh failed:', error);
      clearToken();
      setIsValid(false);
    }
  }

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not valid, redirect to auth
  if (!isValid) {
    return <Navigate to="/auth?reason=expired" state={{ from: location }} replace />;
  }

  // Valid - render protected content
  return <>{children}</>;
}
