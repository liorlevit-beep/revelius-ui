/**
 * Navigation Service
 * 
 * Provides a centralized way to navigate programmatically
 * using React Router, compatible with all browser environments
 * including sandboxed/embedded browsers.
 */

type NavigateFunction = (path: string) => void;

let navigateFunction: NavigateFunction | null = null;

/**
 * Set the navigate function from React Router
 * Call this once when the app initializes
 */
export function setNavigate(navigate: NavigateFunction) {
  navigateFunction = navigate;
}

/**
 * Navigate to a path using React Router
 * Falls back to window.location if navigate not available
 */
export function navigateTo(path: string) {
  console.log('[Navigation] Navigating to:', path);
  
  if (navigateFunction) {
    console.log('[Navigation] Using React Router navigate');
    navigateFunction(path);
  } else {
    console.log('[Navigation] Fallback to window.location');
    window.location.href = path;
  }
}

/**
 * Navigate to auth page with reason
 * Saves the current location so we can redirect back after login
 */
export function navigateToAuth(reason: string = 'expired') {
  // Save current location for redirect after login
  const currentPath = window.location.pathname + window.location.search + window.location.hash;
  if (currentPath !== '/auth' && currentPath !== '/auth/callback') {
    sessionStorage.setItem('revelius_redirect_after_login', currentPath);
    console.log('[Navigation] Saved redirect path:', currentPath);
  }
  
  const path = `/auth?reason=${reason}`;
  navigateTo(path);
}

/**
 * Get the saved redirect path and clear it
 */
export function getAndClearRedirectPath(): string | null {
  const path = sessionStorage.getItem('revelius_redirect_after_login');
  if (path) {
    sessionStorage.removeItem('revelius_redirect_after_login');
    console.log('[Navigation] Retrieved redirect path:', path);
  }
  return path;
}
