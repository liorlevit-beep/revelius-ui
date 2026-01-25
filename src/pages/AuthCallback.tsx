import { useEffect } from 'react';

/**
 * AuthCallback page - handles OAuth redirect from Google
 * Extracts ID token from URL hash and sends it back to parent window
 */
export default function AuthCallback() {
  useEffect(() => {
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
        
        // Send error back to parent
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: errorDescription || error,
          }, window.location.origin);
          
          console.log('[AuthCallback] Error sent to parent, closing popup...');
          window.close();
        }
        return;
      }
      
      if (!idToken) {
        console.error('[AuthCallback] No ID token in URL');
        
        // Send error back to parent
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: 'No authentication token received',
          }, window.location.origin);
          
          console.log('[AuthCallback] Error sent to parent, closing popup...');
          window.close();
        }
        return;
      }
      
      // Verify state matches (CSRF protection)
      const savedState = sessionStorage.getItem('google_auth_state');
      console.log('[AuthCallback] State from URL:', state);
      console.log('[AuthCallback] State from sessionStorage:', savedState);
      
      if (state !== savedState) {
        console.error('[AuthCallback] State mismatch! Possible CSRF attack');
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: 'Security validation failed. Please try again.',
          }, window.location.origin);
          
          window.close();
        }
        return;
      }
      
      console.log('[AuthCallback] ✅ ID token received, length:', idToken.length);
      
      // Send token back to parent window
      if (window.opener) {
        console.log('[AuthCallback] Sending ID token to parent window...');
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_SUCCESS',
          idToken: idToken,
        }, window.location.origin);
        
        console.log('[AuthCallback] Message sent, popup will close');
        
        // Parent window will close the popup
      } else {
        console.error('[AuthCallback] No opener window found!');
      }
      
    } catch (err) {
      console.error('[AuthCallback] Error processing callback:', err);
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: 'Failed to process authentication response',
        }, window.location.origin);
        
        window.close();
      }
    }
  }, []);
  
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
