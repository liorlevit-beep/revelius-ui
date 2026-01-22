/**
 * Protected Route Component
 * Checks authentication status and redirects to /auth if not authenticated
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyAuthWithRefresh } from '../lib/auth/api';
import { hasTokens } from '../lib/auth/storage';
import { authLogger } from '../lib/auth/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  async function checkAuth() {
    setIsChecking(true);

    // Quick check: if no tokens at all, redirect immediately
    if (!hasTokens()) {
      authLogger.authStatusFailed('No tokens found');
      authLogger.redirecting('/auth?reason=expired');
      navigate('/auth?reason=expired', { replace: true });
      return;
    }

    // Verify with backend (attempts refresh if needed)
    const authenticated = await verifyAuthWithRefresh();

    if (!authenticated) {
      // Still not authenticated after refresh attempt
      authLogger.redirecting('/auth?reason=expired');
      navigate('/auth?reason=expired', { replace: true });
      return;
    }

    setIsAuthenticated(true);
    setIsChecking(false);
  }

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
