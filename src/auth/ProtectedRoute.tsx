/**
 * Protected Route Component
 * Wraps protected pages and ensures user is authenticated
 * 
 * Flow:
 * 1. Check for token in localStorage
 * 2. If no token -> redirect to /auth?reason=expired
 * 3. If token exists -> call status() to verify
 * 4. If unauthorized -> try refresh() then status() again
 * 5. If still fails -> clear token and redirect to /auth?reason=expired
 */

import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, status, refresh, clearToken } from './auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    // Quick check: no token at all
    const token = getToken();
    if (!token) {
      if (import.meta.env.DEV) {
        console.log('[Auth] No token found, redirecting to login');
      }
      navigate('/auth?reason=expired', { replace: true });
      return;
    }

    // Verify token with backend
    let authenticated = await status();

    // If not authenticated, try refresh once
    if (!authenticated) {
      if (import.meta.env.DEV) {
        console.log('[Auth] Status check failed, attempting refresh');
      }
      
      const refreshed = await refresh();
      
      if (refreshed) {
        // Check status again after refresh
        authenticated = await status();
      }
    }

    // If still not authenticated, redirect to login
    if (!authenticated) {
      if (import.meta.env.DEV) {
        console.log('[Auth] Authentication failed, redirecting to login');
      }
      clearToken();
      navigate('/auth?reason=expired', { replace: true });
      return;
    }

    // Authentication successful
    setIsAuthenticated(true);
    setIsChecking(false);
  }

  // Show loading spinner while checking auth
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

  // Render protected content if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
