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
 */
export function navigateToAuth(reason: string = 'expired') {
  const path = `/auth?reason=${reason}`;
  navigateTo(path);
}
