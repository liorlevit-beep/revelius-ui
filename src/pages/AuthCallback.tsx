import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * OAuth Callback Page
 * 
 * Flow:
 * 1. Frontend opens popup directly to Google OAuth
 * 2. User authenticates with Google
 * 3. Google redirects popup to backend at /auth/google/callback with authorization code
 * 4. Backend exchanges code with Google for tokens
 * 5. Backend creates session and redirects here with session_token
 * 6. This page verifies state and sends token to parent window (popup opener)
 * 7. Parent window stores token and navigates to dashboard
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = () => {
      console.log('========================================');
      console.log('[AuthCallback] Starting callback processing');
      console.log('[AuthCallback] Full URL:', window.location.href);
      console.log('[AuthCallback] Is popup?', !!window.opener);
      console.log('========================================');
      
      // Check for Google OAuth response in hash fragment (for id_token)
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const idToken = hashParams.get('id_token');
      const hashState = hashParams.get('state');
      const hashError = hashParams.get('error');
      
      console.log('[AuthCallback] Hash fragment:', hash);
      console.log('[AuthCallback] Hash params:', Object.fromEntries(hashParams.entries()));
      
      // Also check query parameters (for session_token from our backend)
      const token = searchParams.get('token');
      const sessionToken = searchParams.get('session_token');
      const queryError = searchParams.get('error');
      const queryState = searchParams.get('state');
      
      console.log('[AuthCallback] Query params:', Object.fromEntries(searchParams.entries()));
      
      const error = hashError || queryError;
      const state = hashState || queryState;
      
      console.log('[AuthCallback] ID Token found:', !!idToken, idToken ? `(length: ${idToken.length})` : '');
      console.log('[AuthCallback] Session Token found:', !!sessionToken);
      console.log('[AuthCallback] Error:', error);
      console.log('[AuthCallback] State:', state);
      
      // Verify state to prevent CSRF attacks
      const savedState = sessionStorage.getItem('google_auth_state') || sessionStorage.getItem('oauth_state');
      if (state && savedState && state !== savedState) {
        console.error('State mismatch - possible CSRF attack');
        sendErrorToParent('Invalid state parameter');
        return;
      }
      
      // Clean up state
      sessionStorage.removeItem('google_auth_state');
      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('frontend_callback');

      if (error) {
        sendErrorToParent(error);
        return;
      }

      // Handle Google ID token (from OAuth popup)
      if (idToken) {
        console.log('[AuthCallback] ✅ Processing Google ID token...');
        setStatus('Processing Google sign-in...');
        
        if (window.opener) {
          console.log('[AuthCallback] Sending ID token to parent window...');
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_SUCCESS',
            idToken: idToken
          }, window.location.origin);
          console.log('[AuthCallback] Message sent, closing popup...');
          setTimeout(() => window.close(), 500);
        } else {
          // If not in popup, we can't proceed - need to show error
          console.error('[AuthCallback] ❌ Not in popup context (no window.opener)');
          sendErrorToParent('Authentication window error. Please try again.');
        }
        return;
      }

      // Handle session token (from our backend)
      const authToken = sessionToken || token;
      if (authToken) {
        console.log('Processing session token...');
        setStatus('Authentication successful!');
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'AUTH_SUCCESS',
            token: authToken,
            expiresAt: searchParams.get('expires_at')
          }, window.location.origin);
          window.close();
        } else {
          // If not in popup, store token and redirect to dashboard
          localStorage.setItem('revelius_auth_token', authToken);
          const expiresAt = searchParams.get('expires_at');
          if (expiresAt) {
            localStorage.setItem('revelius_auth_expires_at', expiresAt);
          }
          navigate('/');
        }
        return;
      }

      // No token found
      sendErrorToParent('No authentication token received');
    };

    handleCallback();
  }, [searchParams, navigate]);

  const sendErrorToParent = (errorMessage: string) => {
    setStatus(`Error: ${errorMessage}`);
    
    if (window.opener) {
      window.opener.postMessage({
        type: 'AUTH_ERROR',
        error: errorMessage
      }, window.location.origin);
      
      // Close popup after a short delay to show error
      setTimeout(() => window.close(), 2000);
    } else {
      // If not in popup, redirect to auth page with error
      navigate('/auth?error=' + encodeURIComponent(errorMessage));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        {status.startsWith('Error:') ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-400">{status}</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">{status}</p>
          </>
        )}
      </div>
    </div>
  );
}
