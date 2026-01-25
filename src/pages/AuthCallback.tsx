import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { env } from '../config/env';
import { startTokenRefresh } from '../services/tokenRefresh';
import { getAndClearRedirectPath } from '../services/navigation';

/**
 * AuthCallback page - handles OAuth redirect from Google
 * Extracts ID token from URL hash and authenticates with backend
 */
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      console.log('[AuthCallback] Page loaded');
      console.log('[AuthCallback] Full URL:', window.location.href);
      console.log('[AuthCallback] Hash:', window.location.hash);
      
      try {
        // Parse the URL hash fragment (Google returns id_token in hash after #)
        const hash = window.location.hash.substring(1); // Remove '#'
        const params = new URLSearchParams(hash);
        
        console.log('[AuthCallback] Hash params:', Object.fromEntries(params.entries()));
        
        const idToken = params.get('id_token');
        const state = params.get('state');
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        
        if (error) {
          console.error('[AuthCallback] OAuth error:', error, errorDescription);
          navigate(`/auth?error=${encodeURIComponent(errorDescription || error)}`);
          return;
        }
        
        if (!idToken) {
          console.error('[AuthCallback] No ID token in URL');
          navigate('/auth?error=No authentication token received');
          return;
        }
        
        // Verify state matches (CSRF protection)
        const savedState = sessionStorage.getItem('google_auth_state');
        console.log('[AuthCallback] State from URL:', state);
        console.log('[AuthCallback] State from sessionStorage:', savedState);
        
        if (state !== savedState) {
          console.error('[AuthCallback] State mismatch! Possible CSRF attack');
          navigate('/auth?error=Security validation failed');
          return;
        }
        
        console.log('[AuthCallback] ✅ ID token received, authenticating with backend...');
        
        // Send ID token to backend
        const backendResponse = await fetch(`${env.baseUrl}/auth/login`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (!backendResponse.ok) {
          const errorData = await backendResponse.json().catch(() => ({}));
          console.error('[AuthCallback] Backend error:', errorData);
          throw new Error(errorData.error || `HTTP ${backendResponse.status}`);
        }

        const data = await backendResponse.json();
        console.log('[AuthCallback] Backend response:', data);

        // Extract tokens
        const sessionToken = data.session_token || data.token || data.data?.session_token || data.data?.token;
        const refreshToken = data.refresh_token || data.data?.refresh_token;

        if (!sessionToken) {
          throw new Error('No session token in backend response');
        }

        // Store tokens
        localStorage.setItem('revelius_auth_token', sessionToken);
        if (refreshToken) {
          localStorage.setItem('revelius_refresh_token', refreshToken);
        }
        
        // Store expiry
        const expiresAt = data.expires_at || data.data?.expires_at;
        const expiresIn = data.expires_in || data.data?.expires_in;
        if (expiresAt) {
          localStorage.setItem('revelius_auth_expires_at', expiresAt);
        } else if (expiresIn) {
          const expiryTime = Date.now() + (expiresIn * 1000);
          localStorage.setItem('revelius_auth_expires_at', expiryTime.toString());
        }

        console.log('[AuthCallback] ✅ Authentication successful, redirecting...');
        
        // Start token refresh
        startTokenRefresh();
        
        // Navigate to saved location or dashboard
        const redirectPath = getAndClearRedirectPath();
        navigate(redirectPath || '/', { replace: true });
        
      } catch (err) {
        console.error('[AuthCallback] Error processing callback:', err);
        navigate(`/auth?error=${encodeURIComponent(err instanceof Error ? err.message : 'Authentication failed')}`);
      }
    }

    handleCallback();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <div className="mb-4">
          <svg className="animate-spin h-12 w-12 mx-auto text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-lg">Completing sign-in...</p>
      </div>
    </div>
  );
}
