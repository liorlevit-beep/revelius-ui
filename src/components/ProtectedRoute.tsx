/**
 * Protected Route Component
 * Guards routes requiring authentication
 * Redirects to /auth?reason=expired if no valid token
 */

import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, checkAuthStatus, clearToken, refreshToken } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      // Quick check: do we have a token?
      if (!isAuthenticated()) {
        console.log('[ProtectedRoute] No token found, redirecting to auth');
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // Verify token with backend
      const statusOk = await checkAuthStatus();
      
      if (statusOk) {
        console.log('[ProtectedRoute] Token valid');
        setIsValid(true);
        setIsChecking(false);
        return;
      }

      // Token invalid, attempt refresh
      console.log('[ProtectedRoute] Token invalid, attempting refresh');
      const newToken = await refreshToken();

      if (newToken) {
        // Recheck after refresh
        const recheckOk = await checkAuthStatus();
        if (recheckOk) {
          console.log('[ProtectedRoute] Token refreshed successfully');
          setIsValid(true);
          setIsChecking(false);
          return;
        }
      }

      // Refresh failed or still invalid
      console.log('[ProtectedRoute] Auth check failed, clearing token');
      clearToken();
      setIsValid(false);
      setIsChecking(false);
    }

    checkAuth();
  }, [location.pathname]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not valid
  if (!isValid) {
    return <Navigate to="/auth?reason=expired" replace />;
  }

  // Render protected content
  return <>{children}</>;
}
